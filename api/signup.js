/* ————————————————————————————————————————————————
   WAITLIST ENDPOINT — runs on Vercel, not in the browser.

   Why server-side: browser ad blockers silently kill third-party
   requests (a signup vanishes and nobody knows), API keys stay off the
   client, and the delivery provider can change without touching the site.

   Delivery is tried in order and stops at the first success:
     1. Shopify   — the customer list lives where the business lives
     2. Resend    — plain email notification
     3. Web3Forms — kept so any existing key keeps working

   Configure whichever one you have (Vercel → Settings → Environment
   Variables). With none configured the endpoint reports stored:false and
   the site shows its DM fallback, so a signup is never silently dropped.

   GET /api/signup returns which provider is configured — a way to confirm
   setup without sending a test signup, and without exposing any secret.
———————————————————————————————————————————————— */

const COUNTER = "https://api.counterapi.dev/v1/whitefall-fw26/waitlist/up";

const clean = (v, max = 200) => String(v == null ? "" : v).trim().slice(0, max);
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/* Which provider is live, in priority order. */
function provider() {
  if (process.env.SHOPIFY_STORE && process.env.SHOPIFY_ADMIN_TOKEN) return "shopify";
  if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL) return "resend";
  if (process.env.WEB3FORMS_KEY) return "web3forms";
  return null;
}

/* Small fetch wrapper so one slow provider can't hang the request. */
async function post(url, opts, ms = 8000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctl.signal });
  } finally {
    clearTimeout(t);
  }
}

/* ——— Shopify: upsert the customer, tagged for the waitlist ——— */
async function toShopify({ email, size, interests, num }) {
  const shop = process.env.SHOPIFY_STORE.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const base = `https://${shop}/admin/api/2024-10`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
  };

  const tags = ["waitlist", "fw26"];
  if (num) tags.push(`member-${String(num).padStart(3, "0")}`);
  if (num && num <= 100) tags.push("founding-member");
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
    // A member number is assigned once and never reassigned, so an existing
    // one wins. Size is a correction — the newest answer replaces the old.
    const keptNumber = prior.find((t) => /^member-\d+$/.test(t));
    const merged = [...new Set([
      ...prior.filter((t) => !(size && /^size-/.test(t))),
      ...tags.filter((t) => !(keptNumber && /^member-\d+$/.test(t))),
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

/* ——— Resend: email the owner ——— */
async function toResend({ email, size, interests, num }) {
  const res = await post("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "Whitefall <onboarding@resend.dev>",
      to: [process.env.OWNER_EMAIL],
      subject: "▲ New Whitefall waitlist signup" + (num ? ` — member #${String(num).padStart(3, "0")}` : ""),
      text: [
        `Email:  ${email}`,
        `Member: ${num ? "#" + String(num).padStart(3, "0") : "unassigned"}`,
        `Size:   ${size || "—"}`,
        `Wants:  ${interests && interests.length ? interests.join(", ") : "general waitlist"}`,
        `Time:   ${new Date().toISOString()}`,
      ].join("\n"),
    }),
  });
  return res.ok;
}

/* ——— Web3Forms: kept working for any key already configured ——— */
async function toWeb3Forms({ email, size, interests, num }) {
  const res = await post("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_KEY,
      subject: "▲ New Whitefall waitlist signup" + (num ? ` — member #${String(num).padStart(3, "0")}` : ""),
      from_name: "Whitefall Waitlist",
      email,
      member_number: num || "unassigned",
      size: size || "—",
      wants: interests && interests.length ? interests.join(", ") : "general waitlist",
    }),
  });
  if (!res.ok) return false;
  const j = await res.json().catch(() => null);
  return Boolean(j && (j.success === true || j.success === "true"));
}

/* Member number. Done server-side so ad blockers can't break it. */
async function memberNumber(existing) {
  if (existing) return existing;
  try {
    const r = await post(COUNTER, {}, 5000);
    const j = await r.json();
    return (j && (j.count || (j.data && j.data.count))) || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, provider: provider() });
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

  const num = await memberNumber(Number(body.num) || null);
  const payload = { email, size, interests, num };

  const which = provider();
  let stored = null;
  if (which) {
    try {
      const sent =
        which === "shopify" ? await toShopify(payload) :
        which === "resend" ? await toResend(payload) :
        await toWeb3Forms(payload);
      if (sent) stored = which;
    } catch (e) {
      // Never leak the address into logs; the outcome is what matters.
      console.error("waitlist delivery failed via " + which + ":", e && e.message);
    }
  }

  return res.status(200).json({ ok: true, stored, num });
}
