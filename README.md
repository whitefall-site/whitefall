# WHITEFALL — Freedom To Fall

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
  hand two people the same number. The waitlist now promises **a drop alert
  by email**, which needs no shared state and can always be honoured. (An
  earlier one-hour head start was dropped too — release dates and updates go
  out on Instagram, @whitefall26.)
- Share-card URLs now fill themselves in at build time from Vercel's domain —
  nothing to edit by hand, and they follow a custom domain automatically.
- Support runs on two live lanes: **whitefall26@gmail.com** (brand inbox) and
  Instagram DMs. No personal address appears anywhere on the site or in this
  repo. The address lives in one constant, `SUPPORT_EMAIL` in `src/App.jsx` —
  change it there and every contact point follows. Swap it for `support@yourdomain` once a custom domain is live.
- Full signup path verified end-to-end in a browser against mocked live
  services: signup delivered, owner email sent, member card generated.
- Fonts are self-hosted (the `@fontsource/*` packages, imported in
  `src/main.jsx`) — no request to Google, so nothing to block or stall.
- The site remembers each visitor in their own browser (`whitefall-visitor`
  in localStorage — nothing leaves the device). Someone who has joined sees
  "YOU'RE ON THE LIST" on return and is never asked again; the popup waits
  until the visitor scrolls past the hero or stays 12 seconds, never
  interrupts someone already heading to the form, and stays away for a week
  after "MAYBE LATER". The mobile join bar hides while the form is on screen
  and for a week after it's closed. A signup that failed to deliver is not
  remembered, so that visitor sees the form again.
- Footer has SHOP / HELP / FOLLOW columns; Shipping, Returns and Sizing open
  the matching FAQ answer.
- Icons: `favicon-32.png` (browser tab), `apple-touch-icon.png` (iPhone home
  screen) and `icon-192/512.png` + `site.webmanifest` (Android) — the mark on
  midnight, so it never shows as white lines on a white tab.
- `public/og-image.png` (the picture shown when the link is shared) was
  redrawn with the real fonts and the current tagline, FREEDOM TO FALL.
  Platforms cache share images — paste the link into
  developers.facebook.com/tools/debug and hit "Scrape Again" to refresh it.

**The commerce plan (decided):** the site is the storefront; **Shopify is the
engine** behind it — payments, inventory that can't oversell, shipping labels,
taxes, refunds. The founding run is **one piece only — the Founding Member
Crewneck** (same title in Shopify; handle `whitefall-crewneck`). A NEXT UP section
appears automatically if more pieces are ever added to `PIECES`. The whole
shop turns on and off from Vercel environment variables — no code edits on
drop day. Buyers pick a size here and go straight to Shopify checkout. Full
instructions: "Shopify — the commerce engine" below.

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
- **INP** — responsiveness when tapping JOIN or a nav link
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

The site stays the face of the brand; Shopify handles the money. Buyers pick a
size **on whitefall**, tap BUY NOW, and land **straight on Shopify checkout**
with that size already in the bag — Shopify's own store pages are never seen.
(Technically a "cart permalink": `whitefall26.myshopify.com/cart/<size id>:1`.)

What's wired in the code:

- **Size picker** — appears in place of the plain size list once the drop is
  live. The five Shopify size IDs live in `src/App.jsx` → `SHOP` config.
- **Live stock** — `api/stock.js` reads Shopify's public product data so
  sold-out sizes cross themselves out and the piece flips to **SOLD OUT on its
  own** when the last one sells. Cached 15s at Vercel's edge. No keys needed.
- **One piece per checkout**, opened in the same tab (new tabs strand phone
  buyers).
- **Rehearsal switch** — see "Rehearse the drop" below.

### Where Shopify stands (Nov 3, 2026 — night before the drop)

- Founding Member Crewneck, $69.99, S–XXL (`WHF-CN-001-S…XXL`), handle
  `whitefall-crewneck`. Stock in: S 4 · M 8 · L 19 · XL 9 · XXL 5 (45).
  Every size DENY — it can't oversell.
- Online Store listing **scheduled for Nov 4, 6:55 PM Central** — five minutes
  before the site's countdown opens the shop, so checkout is already live at 7:00
  (was 7:00 sharp; moved so the first buyers never hit a still-publishing
  product). Hidden on the Shop app.
- Storefront password OFF. Live theme is the checkout-only copy, so any plain
  Shopify page bounces back to whitefall26.com.
- Shipping (US): Standard $8 · Express $15 · free Standard at $70+ in Shopify
  right now. The policy says $100+, so change the free rate's minimum to $100
  (Settings → Shipping → General profile). One crewneck ($69.99) never
  qualifies either way, since BUY NOW sends one piece per checkout.
- Policies: only the privacy policy is in Shopify so far. Paste the refund
  (no refunds, exchanges within 14 days) and shipping policies in Settings →
  Policies. The Shopify connection can't write them.

### Still yours to do in Shopify (phone is fine)

1. **Local delivery** — Settings → Shipping and delivery → Local delivery →
   turn on for your location, set the Twin Cities zone (postal codes or
   distance), price **$7** (25 mi radius), delivery info "Within 3 days". The site tells
   Twin Cities buyers to pick it at checkout. Shopify only allows one local
   price per address, so **same day ($15) runs through DMs**.
2. **Brand email** — Settings → General → store contact email is still your
   personal Gmail; buyers see it on order emails. Switch it to
   whitefall26@gmail.com to match the site.
3. **Checkout look** — Settings → Checkout → Customize. Upload the dark logo
   (`checkout-logo.png`, midnight on transparent), buttons `#05070D`.

### Rehearse the drop (before drop day)

Every GitHub branch / pull request gets its own Vercel **preview** link. Add
`?shop-preview` to the end of that link and the shop opens exactly as it will
on drop day — size picker, BUY NOW, the lot — with a blue PREVIEW banner.
**The live site ignores `?shop-preview`**, so nobody can open the shop early.

Test order, start to finish:

1. In Safari, open `whitefall26.myshopify.com` and enter the store password
   once (Online Store → Preferences shows it) — that lets *your* phone past the
   lock.
2. Shopify → Products → Founding Member Crewneck → set size **S** to 1.
3. Preview link + `?shop-preview` → S → BUY NOW → pay with your own card.
4. Shopify → Orders → refund it in full (Shopify keeps the small card fee),
   then set S back to 0.

### Drop day

Nothing to press. At 6:55 PM Central the Online Store listing publishes itself;
at 7:00 the site flips on its own: countdown → size picker + BUY NOW, the hero says
SHOP THE DROP, the phone bar turns into a SHOP button, the email popup stops.
At 7:01, on your phone: pick a size → BUY NOW → make sure Shopify checkout
opens with that size in it (no need to pay), then post. Email everyone on the list — they were promised an email
when it drops.

### Vercel switches (optional — no code edits)

| Variable | Set it to | Effect |
|---|---|---|
| `VITE_DROP_DATE` | e.g. `2026-11-14T12:00:00-06:00` | starts the countdown and auto-opens the shop at that moment |
| `VITE_DROP_LIVE` | `1` | force the shop live now |

**Code links:** `whitefall26.com/?code=WAITLIST` (or any code, e.g. an
ambassador's `?code=EVAN`) puts that code straight into checkout — the buy box
shows "CODE … APPLIES AT CHECKOUT". No code in the address → nothing changes.
| `VITE_CREWNECK_PRICE` | e.g. `$74.99` | change the displayed price (change it in Shopify too) |
| `VITE_CREWNECK_SOLDOUT` | `1` | force SOLD OUT (normally automatic) |

After adding or changing any of these: **Deployments → Redeploy**.

### The drop date

Set in `src/App.jsx` → `DROP_DATE_RAW`: `2026-11-04T19:00:00-06:00` (Wed Nov 4,
7 PM Central). `VITE_DROP_DATE` in Vercel overrides it. Format is ISO with a
timezone offset — Central is `-06:00` until March 2027. The site always shows
the time in Central ("WED 11.04 · 7 PM CT"), whatever the visitor's own zone.

### When it sells out

Automatic: the last size selling flips the piece to SOLD OUT with a "restock
alerts" button within about 30 seconds. `VITE_CREWNECK_SOLDOUT=1` is only a
manual override.

### After the drop

Orders, refunds, shipping labels and customer emails all live in the Shopify
admin (the mobile app is good). The site needs nothing from you day-to-day.

### If a size ID ever changes

Deleting and re-adding a size in Shopify gives it a new ID. Update the number
in `src/App.jsx` → `SHOP.crewneck.variants` (Shopify admin → the product →
tap the size → the number at the end of the page address).

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
tagged `waitlist` and `fw26`. Which means: the list lives with the business, Shopify Email can mail
it for free, and the waitlist is one click away in Customers. Signing up again
updates the same customer rather than duplicating it.

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
- Passcode → `OWNER_CODE`
- Drop date → `DROP_DATE_RAW` in `src/App.jsx`, or `VITE_DROP_DATE` in Vercel
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

Every photographed piece gets tap-to-zoom (full screen, Escape or tap outside
to close). To add more angles, list them in the piece's `more` array —
`more: ["/fw26-01-crewneck-front.jpg", "/fw26-01-crewneck-detail.jpg"]` — and
the viewer becomes a swipeable gallery with arrows and a 1 / 3 counter.

### The lookbook

The LOOKBOOK section (after FW26, linked in the nav and footer) is the shoot.
Frames live in `public/lookbook/` as three files each — `fw26-lb-NN-600.webp`
(the grid), `fw26-lb-NN.webp` (full screen) and `fw26-lb-NN.jpg` (fallback),
all cropped to 2:3 portrait. The order and alt text come from the `LOOKBOOK`
list near the top of `App.jsx`; reorder that list to reorder the grid. Tapping
a frame opens the full-screen viewer on that frame and swipes through all of
them. The grid is 2 columns on phones, 3 on tablets, 4 on wide screens, so a
multiple of 12 frames fills every row evenly.

The DETAILS tab under a piece comes from its `details` array (one plain fact
per line). SHIPPING and RETURNS are shared by every piece and live in
`SHIPPING_FACTS` / `RETURN_FACTS` — if a policy changes, update those and the
matching answer in `FAQS` together.

Optional, for speed: also put two WebP copies next to the JPG —
`fw26-02-hoodie.webp` (full size) and `fw26-02-hoodie-480.webp` (480px wide) —
and add `webp: true` to the piece. Browsers then download roughly a quarter of
the bytes (the crewneck went from 128 KB to 31 KB, or 14 KB on desktop). Leave
`webp` off until both files exist, or the photo won't show. Claude can make
the copies for you.

When you outgrow this (real checkout, inventory), the natural next step is
Shopify with this design as the storefront theme direction, or keep this site
and link "Shop" to a Shopify/Stripe checkout.

## After deploying

- **Share card**: handled automatically — `vite.config.js` fills the real domain
  into the og/twitter tags at build time using Vercel's own environment
  variables, and follows a custom domain when you attach one. To force a
  specific URL, set `VITE_SITE_URL` in Vercel's environment variables.

Note: the brand name is currently WHITEFALL throughout. If the final name changes,
tell Claude and it's a one-command swap.
