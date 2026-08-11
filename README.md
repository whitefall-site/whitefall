# WHITEFALL — Unstoppable Momentum

Official FW26 site. Dark, premium, limited.

## Launch status (updated July 28, 2026)

Done and live:
- Deployed on Vercel — every merge to `main` redeploys automatically.
- Glitch fixes shipped: smooth scrolling (no more full-page re-renders), stable
  mobile layout (no address-bar jumping), fonts preloaded, signups can't hang.
- Waitlist runs through this site's own `/api/signup` endpoint (see
  `api/signup.js`) rather than a third-party call from the visitor's browser.
  Ad blockers can't intercept it, no key is exposed to the client, and the
  delivery provider can change without touching the site.
- Member numbers were removed: they needed a shared counter, every free
  counter service tried proved unreliable, and a headline promise of "your
  number, locked for life" cannot rest on something that can silently fail or
  hand two people the same number. The waitlist now promises **a one hour head
  start**, which needs no shared state and can always be honoured.
- Share-card URLs now fill themselves in at build time from Vercel's domain —
  nothing to edit by hand, and they follow a custom domain automatically.
- Support runs on two live lanes: **whitefall26@gmail.com** (brand inbox) and
  Instagram DMs. No personal address appears anywhere on the site or in this
  repo. The address lives in one constant, `SUPPORT_EMAIL` in `src/App.jsx` —
  change it there and every contact point follows, including the pre-filled
  topic emails. Swap it for `support@yourdomain` once a custom domain is live.
- Full signup path verified end-to-end in a browser against mocked live
  services: signup delivered, owner email sent, member card generated.

**The commerce plan (decided):** the site is the storefront; **Shopify is the
engine** behind it — payments, inventory that can't oversell, shipping labels,
taxes, refunds. The October drop is the **Whitefall Crewneck only**; pieces
02–04 sit in a NEXT UP section until their first looks are ready. The whole
shop turns on and off from Vercel environment variables — no code edits on
drop day. Full instructions: "Shopify — the commerce engine" below.

**Owner steps before launch:**

1. **Waitlist emails — 5 minutes, no third-party service.** Generate a Google
   App Password on the whitefall26 account and paste it into Vercel. Every
   signup then emails the brand inbox instantly. Steps: "Fastest: Gmail sends
   to itself" below.
2. **Shopify** — the store itself, plus (optionally) an Admin API token that
   also files each signup as a tagged customer. Runbook below.

Neither is a hard blocker: until they're set the site behaves honestly —
visitors still get their confirmation and see a "confirm your spot by email"
button, so nobody is silently lost.

## Analytics & Speed Insights

Both are wired into `src/main.jsx` (`<Analytics />` and `<SpeedInsights />`).
They are privacy-friendly and cookieless — no consent banner needed — and both
no-op anywhere other than Vercel, so local dev stays clean. Combined cost is
about 1.5 KB gzipped.

**Turn them on:** Vercel → your project → **Analytics** tab and **Speed
Insights** tab → Enable each. Data appears within a few minutes of real
traffic. Free tiers cap monthly events; past the cap collection pauses until
the next period rather than charging you.

**Analytics** answers *who is showing up*: traffic sources (Instagram vs
direct), mobile-vs-desktop split, and how many visitors reach the waitlist.

**Speed Insights** answers *how it feels for them*, scored on real visitors'
devices rather than a lab test:

- **LCP** — how fast the hero logo paints
- **INP** — responsiveness when tapping JOIN or a size button
- **CLS** — layout jumping while loading

CLS currently measures ~0.000 in testing, because the product image carries
explicit `width`/`height` attributes that reserve its space. **If a future
image is added without those attributes, CLS will regress** — that is the
number to watch after adding photos for pieces 02–04.

## Run it locally

1. Open this folder in VS Code
2. In the terminal:

```bash
npm install
npm run dev
```

3. Open the URL it prints (usually http://localhost:5173)

## Deploy (pick ONE)

### Option A — Vercel (best for a real brand site)
1. Push this folder to a GitHub repo
2. Go to vercel.com → "Add New Project" → import the repo
3. Vercel auto-detects Vite. Click Deploy. Done — free HTTPS URL, and you can attach avalanche-apparel.com later.

Or without GitHub: `npx vercel` in this folder and follow the prompts.

### Option B — Netlify Drop (simplest possible)
1. Run `npm run build` — this creates a `dist/` folder
2. Go to app.netlify.com/drop and drag the `dist` folder onto the page
3. Live instantly. (Re-drag after any change.)

## Shopify — the commerce engine (owner runbook)

The site stays the face of the brand; Shopify handles the money. This split is
how the big streetwear brands run: a distinctive front, a bulletproof back
office. Customers click BUY NOW on whitefall and land on your Shopify checkout.

### One-time setup (~1 hour)

1. Go to shopify.com → start the **Basic** plan (monthly fee applies; there's
   usually a cheap trial period to set everything up).
2. Add a product: **Whitefall Crewneck** — price, description (use the site's
   spec line: contrast piping · 320 GSM · 80% cotton / 20% polyester · runs
   tailored), and **six size variants** (XS–XXL).
3. On each variant: set the inventory count for that size and make sure
   **"Track quantity"** is ON and **"Continue selling when out of stock"** is
   OFF. This is what makes overselling impossible during the drop.
4. Settings → **Payments**: activate Shopify Payments (needs ID + bank account
   — this is where the money lands).
5. Settings → **Shipping**: set your rates — domestic first; add international
   zones when you're ready. For worldwide selling, look at Settings → Markets.
   The site's FAQ promises "duties calculated at checkout" — if your plan
   doesn't support collecting duties, soften that FAQ line (ask Claude).
6. Settings → **Policies**: set the 30-day return policy so it matches what
   the site's FAQ promises. Shopify's order emails cover the "tracking link
   within 24 hours" promise automatically when you fulfill orders.
7. Copy the **product page link** (Sales channels → view product) — that's the
   link the site's BUY NOW button will use.
8. While you're in here, create the Admin API token that also powers the
   waitlist — see "The waitlist" section below. Two minutes, and it means no
   separate email service to sign up for.

### Drop day (no code — Vercel dashboard only)

Vercel → your project → Settings → Environment Variables:

| Variable | Set it to | Effect |
|---|---|---|
| `VITE_CREWNECK_URL` | the Shopify product link | BUY NOW appears (once drop is live) |
| `VITE_CREWNECK_PRICE` | e.g. `$120` | price shows on the product feature |
| `VITE_DROP_LIVE` | `1` | forces the shop live before the countdown date |
| `VITE_CREWNECK_SOLDOUT` | `1` | flips to SOLD OUT + restock-notify state |

After adding or changing any of these: **Deployments → Redeploy**. The change
is live in about a minute. Before the URL is set, the site shows GET NOTIFIED
(waitlist) instead — so there's no broken state at any point.

### The early-access play ("the list shops first" — for real)

One hour before you set `VITE_CREWNECK_URL` publicly, email the product link to
the waitlist (every signup is in your inbox) and/or post it to IG Close
Friends. The list literally shops before the public button exists. Then flip
the env var and the shop is open to everyone.

### When it sells out

Set `VITE_CREWNECK_SOLDOUT=1` → Redeploy. The site shows SOLD OUT with a
"restocks heard here first" waitlist CTA — sold out becomes another reason to
join the list.

### After the drop

Orders, refunds, shipping labels, and customer emails all live in the Shopify
admin (their mobile app is good). The site needs nothing from you day-to-day.

## The waitlist — where signups go

Signups POST to this site's own endpoint (`api/signup.js`, running on Vercel),
not to a third-party service from the visitor's browser. That endpoint assigns
and delivers the signup. Three practical wins: browser ad
blockers can't silently swallow a signup, no key is ever exposed to the client,
and the delivery provider can be swapped by changing an environment variable
instead of the site's code.

The endpoint does two independent jobs, and either one succeeding counts:

- **NOTIFY** — an email hits the brand inbox the second someone joins.
- **STORE** — the signup becomes a tagged Shopify customer.

They are complementary, not alternatives. Set up one now and the other later;
if both are on, a Shopify outage still can't stop the email.

> **Is it working right now?** Open `https://your-site/api/signup` in any
> browser. It answers in plain English — "Working — signups will email you",
> or exactly which variable is missing and where to add it. Safe to open
> anywhere; it never echoes a secret.
>
> **If nothing is configured**, undelivered signups are still written to the
> project's private Vercel runtime log as `WAITLIST_UNDELIVERED` lines
> (Vercel → your project → Logs). Retention is short and this is a safety
> net, not a solution — but a signup during a setup gap isn't gone for good.

### Fastest: Gmail sends to itself (no third-party service at all)

`whitefall26@gmail.com` can mail *itself* every signup. Nothing to sign up
for, no key emailed to you, no activation link — the credential is generated
inside the Google account you already own.

1. Go to **myaccount.google.com/security** (signed in as whitefall26)
2. Turn on **2-Step Verification** if it isn't already (required by Google
   before app passwords exist)
3. Go to **myaccount.google.com/apppasswords**, type a name like
   "Whitefall site", and hit **Create**
4. Google shows a 16-character password like `abcd efgh ijkl mnop` — copy it
   (spaces are fine, the endpoint strips them)
5. Vercel → Settings → Environment Variables → add both → **Redeploy**:

   | Variable | Value |
   |---|---|
   | `GMAIL_USER` | `whitefall26@gmail.com` |
   | `GMAIL_APP_PASSWORD` | the 16-character password |

Each signup then arrives as an email titled
"▲ New Whitefall waitlist signup" with the address and size. **Reply-To is set
to the new member**, so hitting reply in Gmail writes straight to them — handy
for welcoming early signups personally.

An app password only permits sending mail and can be revoked on that same
page at any time. It is stored in Vercel, never in this repo, and never
reaches the browser.

> Using a different mailbox later (Outlook, or `support@` on a custom
> domain)? Set `SMTP_HOST` and `SMTP_PORT` too — any SMTP provider works
> without a code change.

### Recommended alongside it: Shopify (no extra service, no keys to chase)

Do this while setting up the store — it adds about two minutes:

1. Shopify admin → **Settings → Apps and sales channels → Develop apps**
2. **Create an app**, name it "Whitefall site"
3. **Configure Admin API scopes** → tick `write_customers` and `read_customers`
4. **Install app** → reveal the **Admin API access token** (starts `shpat_`)
5. Vercel → Settings → Environment Variables, add both, then **Redeploy**:

   | Variable | Value |
   |---|---|
   | `SHOPIFY_STORE` | `your-store.myshopify.com` |
   | `SHOPIFY_ADMIN_TOKEN` | the `shpat_…` token |

Every signup then becomes a Shopify customer, subscribed to email marketing and
tagged `waitlist`, `fw26`, and `size-L`. Which means: the list lives with the business, Shopify Email can mail
it for free, and you can filter "everyone on the waitlist who wears L" in two
clicks. Signing up again or changing size updates the same customer rather than
duplicating it, and size tags are replaced rather than stacked.

### Alternative: Resend (plain email notifications)

If you'd rather just get an email per signup: create a Resend account, make an
API key, then set `RESEND_API_KEY` and `OWNER_EMAIL` (use
`whitefall26@gmail.com`) in Vercel. The default sender
(`onboarding@resend.dev`) works without verifying a domain as long as
notifications go to your own address. Set `RESEND_FROM` later for a branded
sender on your own domain.

`WEB3FORMS_KEY` is also still supported if a key ever turns up — set it
server-side in Vercel (no `VITE_` prefix now; keys stay off the client).

### Checking it works

Visit `https://your-site/api/signup` in a browser. It returns something like
`{"ok":true,"store":"shopify","notify":"gmail"}` — either field is `null` if
that job isn't configured yet. No secrets are exposed, and it confirms setup
without sending a test signup.

Then join the waitlist on the live site with any address. If the "confirm your
spot by email" button does *not* appear, delivery worked.

> History: the site previously used FormSubmit, whose activation links kept
> reporting "not a valid link", then Web3Forms, whose key flow also never
> completed. Both required chasing a third-party signup; the current setup
> removes that dependency by reusing the Shopify credentials the store needs
> anyway.

## Owner panel

Bottom-right of the footer → the faint **OWNER** button → passcode **0623**.
Shows signups recorded on that device, with copy + email-me-the-list buttons.
(On the live site your inbox is the master list; the panel is a backup view.
The passcode is a light lock — anyone reading the source code can find it,
so don't put anything sensitive behind it.)

## Editing quick-reference (all in `src/App.jsx`)

- FW26 lineup → the `PIECES` array (name, `cat` spec line, `fit` note)
- FAQ answers → the `FAQS` array
- Contact categories → the `TOPICS` array
- Passcode → `OWNER_CODE`
- Drop countdown date → the `DROP_DATE` line (placeholder: Oct 1, 2026, noon ET)
- Slogan/copy → search the text you want to change

### Adding a product photo

Drop the image in `public/` (e.g. `public/fw26-02-hoodie.jpg`), then add two
fields to that piece in the `PIECES` array:

```js
shot: "/fw26-02-hoodie.jpg",
alt:  "Short description of the photo, for screen readers and SEO.",
```

Any piece with a `shot` automatically switches from a compact text row to the
full photo feature (image beside the details, with a FIRST LOOK badge) and
stacks on phones. Pieces without one stay as text rows. Also update the `width`
and `height` on the `piece-shot` image in the FW26 section if the new photo has
a different aspect ratio — those attributes reserve space so the page doesn't
jump while the image loads.

When you outgrow this (real checkout, inventory), the natural next step is
Shopify with this design as the storefront theme direction, or keep this site
and link "Shop" to a Shopify/Stripe checkout.

## After deploying

- **Share card**: handled automatically — `vite.config.js` fills the real domain
  into the og/twitter tags at build time using Vercel's own environment
  variables, and follows a custom domain when you attach one. To force a
  specific URL, set `VITE_SITE_URL` in Vercel's environment variables.
- **Waitlist sizes**: signups can tap their size — the owner panel (passcode 0623)
  shows a size tally so you know how many of each size to produce.

Note: the brand name is currently WHITEFALL throughout. If the final name changes,
tell Claude and it's a one-command swap.
