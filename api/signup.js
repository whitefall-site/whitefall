/* ————————————————————————————————————————————————
   WAITLIST ENDPOINT — runs on Vercel, not in the browser.

   Why server-side: browser ad blockers silently kill third-party
   requests (a signup vanishes and nobody knows), API keys stay off the
   client, and the delivery provider can change without touching the site.

   Two independent jobs, because they are complementary — not alternatives:

     STORE  — Shopify: the signup becomes a tagged customer record, so the
              list lives with the business and Shopify Email can mail it.
     NOTIFY — an email lands in the owner's inbox the moment someone joins:
              Gmail SMTP (no third-party service — the brand inbox sends to
              itself), or Resend, or Web3Forms. First one configured wins.

   Either job succeeding counts as delivered. Configure one or both in
   Vercel → Settings → Environment Variables. With neither configured the
   endpoint reports stored:null and the site shows its "confirm by email"
   fallback, so a signup is never silently dropped.

   GET /api/signup reports what is configured — confirms setup without
   sending a test signup, and without exposing any secret.
———————————————————————————————————————————————— */

/* Member numbers were removed deliberately. They depended on a shared counter,
   and every free counter service tried turned out to be unreliable — which
   meant the site's headline promise ("your number, locked for life") rested on
   something that could silently fail or, worse, hand two people the same
   number. The waitlist now promises early access, which needs no shared state
   and can always be honoured. */

const clean = (v, max = 200) => String(v == null ? "" : v).trim().slice(0, max);
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* Gmail shows app passwords in spaced groups ("abcd efgh ijkl mnop") and
   they are almost always pasted that way. SMTP needs them unspaced. */
const appPassword = () => (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

const storeProvider = () =>
  process.env.SHOPIFY_STORE && process.env.SHOPIFY_ADMIN_TOKEN ? "shopify" : null;

const notifyProvider = () => {
  if (process.env.GMAIL_USER && appPassword()) return "gmail";
  if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL) return "resend";
  if (process.env.WEB3FORMS_KEY) return "web3forms";
  return null;
};

/* Small fetch wrapper so one slow provider can't hang the request.
   Budget matters: Vercel kills a function at maxDuration (30s, set in
   vercel.json) and a killed function means a lost signup. Worst case here is
   counter (4s) + Shopify search (5s) + Shopify write (5s) = 14s, with the
   notifier running in parallel. */
async function post(url, opts, ms = 5000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctl.signal });
  } finally {
    clearTimeout(t);
  }
}

/* ——— Shopify: upsert the customer, tagged for the waitlist ——— */
async function toShopify({ email, size, interests }) {
  const shop = process.env.SHOPIFY_STORE.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const base = `https://${shop}/admin/api/2024-10`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
  };

  const tags = ["waitlist", "fw26"];
  if (size) tags.push(`size-${size}`);
  if (interests && interests.length) tags.push(...interests.map((i) => `wants-${i}`));

  // Existing customer? Update rather than create, so a repeat signup or a
  // later size selection enriches the same record instead of erroring.
  const found = await post(
    `${base}/customers/search.json?query=${encodeURIComponent("email:" + email)}`,
    { headers }
  );
  const existing = found.ok ? (await found.json()).customers?.[0] : null;

  if (existing) {
    const prior = (existing.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
    // Size is a correction — the newest answer replaces any earlier one.
    const merged = [...new Set([
      ...prior.filter((t) => !(size && /^size-/.test(t))),
      ...tags,
    ])];
    const res = await post(`${base}/customers/${existing.id}.json`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ customer: { id: existing.id, tags: merged.join(", ") } }),
    });
    return res.ok;
  }

  const res = await post(`${base}/customers.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      customer: {
        email,
        tags: tags.join(", "),
        email_marketing_consent: { state: "subscribed", opt_in_level: "single_opt_in" },
      },
    }),
  });
  if (res.ok) return true;
  // 422 usually means the address already exists — treat as delivered.
  return res.status === 422;
}

/* Shared body for the owner notification. */
function notifyText({ email, size, interests }) {
  return [
    `Email:  ${email}`,
    `Size:   ${size || "—"}`,
    `Wants:  ${interests && interests.length ? interests.join(", ") : "general waitlist"}`,
    `Time:   ${new Date().toUTCString()}`,
  ].join("\n");
}
const notifySubject = () => "▲ New Whitefall waitlist signup";

/* ——— Gmail SMTP: the brand inbox mails itself. No third-party service;
       auth is a Google App Password generated inside the owner's own
       account. Loaded dynamically so a missing dependency degrades to the
       other adapters instead of crashing the endpoint. ——— */
async function toGmail(payload) {
  const { default: nodemailer } = await import("nodemailer");
  const user = process.env.GMAIL_USER;
  // Defaults to Gmail; SMTP_HOST/SMTP_PORT allow any other provider later
  // (Outlook, a custom-domain mailbox) without a code change.
  const port = Number(process.env.SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass: appPassword() },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    tls: process.env.SMTP_INSECURE === "1" ? { rejectUnauthorized: false } : undefined,
  });
  await transport.sendMail({
    from: `"Whitefall Waitlist" <${user}>`,
    to: process.env.OWNER_EMAIL || user,
    replyTo: payload.email, // reply goes straight to the new member
    subject: notifySubject(payload),
    text: notifyText(payload),
  });
  return true;
}

/* ——— Resend: email the owner ——— */
async function toResend(payload) {
  const res = await post("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Whitefall <onboarding@resend.dev>",
      to: [process.env.OWNER_EMAIL],
      reply_to: payload.email,
      subject: notifySubject(payload),
      text: notifyText(payload),
    }),
  });
  return res.ok;
}

/* ——— Web3Forms: kept working for any key already configured ——— */
async function toWeb3Forms(payload) {
  const { email, size, interests, num } = payload;
  const res = await post("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_KEY,
      subject: notifySubject(payload),
      from_name: "Whitefall Waitlist",
      email,
      size: size || "—",
      wants: interests && interests.length ? interests.join(", ") : "general waitlist",
    }),
  });
  if (!res.ok) return false;
  const j = await res.json().catch(() => null);
  return Boolean(j && (j.success === true || j.success === "true"));
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Human-readable diagnosis: says what is missing and what to do about it,
    // without ever echoing a secret back.
    const store = storeProvider();
    const notify = notifyProvider();
    const halfGmail = Boolean(process.env.GMAIL_USER) !== Boolean(appPassword());
    const halfShopify =
      Boolean(process.env.SHOPIFY_STORE) !== Boolean(process.env.SHOPIFY_ADMIN_TOKEN);

    let status;
    if (notify || store) {
      status = `Working — signups will ${notify ? `email you (via ${notify})` : ""}` +
        `${notify && store ? " and " : ""}${store ? "save to Shopify" : ""}.`;
    } else if (halfGmail) {
      status = `Almost — ${process.env.GMAIL_USER ? "GMAIL_APP_PASSWORD" : "GMAIL_USER"} is missing. Add it in Vercel → Settings → Environment Variables, then Redeploy.`;
    } else if (halfShopify) {
      status = `Almost — ${process.env.SHOPIFY_STORE ? "SHOPIFY_ADMIN_TOKEN" : "SHOPIFY_STORE"} is missing. Add it in Vercel → Settings → Environment Variables, then Redeploy.`;
    } else {
      status =
        "Not set up yet — signups reach nobody. Quickest fix: set GMAIL_USER " +
        "and GMAIL_APP_PASSWORD in Vercel → Settings → Environment Variables, " +
        "then Redeploy. See the README section 'Fastest: Gmail sends to itself'.";
    }

    return res.status(200).json({
      ok: true,
      status,
      store,
      notify,
      // kept so an older cached page reading `provider` still works
      provider: store || notify,
    });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const email = clean(body.email).toLowerCase();
  if (!validEmail(email)) {
    return res.status(400).json({ ok: false, error: "invalid_email" });
  }
  const size = clean(body.size, 8) || null;
  const interests = Array.isArray(body.interests)
    ? body.interests.slice(0, 12).map((i) => clean(i, 60)).filter(Boolean)
    : [];

  const payload = { email, size, interests };

  // Store and notify are independent: a Shopify outage must not stop the
  // owner's email, and vice versa. Run both, report whatever succeeded.
  const run = async (name, fn) => {
    if (!name) return null;
    try {
      return (await fn(payload)) ? name : null;
    } catch (e) {
      // Never log the address itself — only the outcome.
      console.error(`waitlist ${name} failed:`, e && e.message);
      return null;
    }
  };

  const notifier = notifyProvider();
  const [didStore, didNotify] = await Promise.all([
    run(storeProvider(), toShopify),
    run(notifier, notifier === "gmail" ? toGmail : notifier === "resend" ? toResend : toWeb3Forms),
  ]);

  const done = [didStore, didNotify].filter(Boolean);

  if (!done.length) {
    // Nothing delivered. Write the signup to this project's own Vercel
    // runtime log as a last resort — it is private to the project owner and
    // recoverable from the Vercel dashboard (Logs) for as long as the plan
    // retains them. Not a substitute for real delivery, but it means a
    // signup during a misconfiguration window isn't gone for good.
    console.warn(
      "WAITLIST_UNDELIVERED " +
        JSON.stringify({ email, size, interests, at: new Date().toISOString() })
    );
  }

  return res.status(200).json({
    ok: true,
    stored: done.length ? done.join("+") : null,
  });
}
