# WHITEFALL — Unstoppable Momentum

Official FW26 site. Dark, premium, limited.

## Launch status (updated July 28, 2026)

Done and live:
- Deployed on Vercel — every merge to `main` redeploys automatically.
- Glitch fixes shipped: smooth scrolling (no more full-page re-renders), stable
  mobile layout (no address-bar jumping), fonts preloaded, signups can't hang.
- Waitlist relay switched from FormSubmit (activation never worked) to Web3Forms.
- Repeat signups from the same device keep their original member number.
- Share-card URLs now fill themselves in at build time from Vercel's domain —
  nothing to edit by hand, and they follow a custom domain automatically.
- No personal email address appears anywhere on the site or in this repo.
  Support runs through Instagram DMs, and the support section shows an
  "EMAIL SUPPORT — COMING SOON" card. To switch email support on later, add a
  branded address (e.g. support@yourdomain) to that card in `src/App.jsx`.
- Full signup path verified end-to-end in a browser against mocked live
  services: member number assigned, owner email sent, member card generated.

**The commerce plan (decided):** the site is the storefront; **Shopify is the
engine** behind it — payments, inventory that can't oversell, shipping labels,
taxes, refunds. The October drop is the **Whitefall Crewneck only**; pieces
02–04 sit in a NEXT UP section until their first looks are ready. The whole
shop turns on and off from Vercel environment variables — no code edits on
drop day. Full instructions: "Shopify — the commerce engine" below.

**Two owner steps before launch:**

1. **Web3Forms access key** (2 minutes) — without it no signup reaches the
   inbox. Get the key at https://web3forms.com (enter the owner inbox address;
   the key arrives by email — no account, no activation link). Then Vercel →
   Settings → Environment Variables → add `VITE_WEB3FORMS_KEY` = the key →
   Redeploy. (Or paste it into the `WEB3FORMS_KEY` line in `src/App.jsx`.)
2. **Shopify store** (about an hour, needs ID + bank details for payouts) —
   see the runbook below.

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

An hour before you set `VITE_CREWNECK_URL` publicly, email the product link to
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

## The email list — IMPORTANT one-time step

Every waitlist signup on the live site is emailed to the owner inbox instantly
via Web3Forms (free, no account, no activation link). The destination address is
whichever inbox created the access key — it is never published on the site.

**One-time setup:** go to https://web3forms.com, enter the owner inbox address
in the "Create your Access Key" box, and the key arrives there within a minute.
Then set it either as the `VITE_WEB3FORMS_KEY` environment variable in Vercel
(Settings → Environment Variables → Redeploy — no code edit), or by pasting it
into the `WEB3FORMS_KEY` line near the top of `src/App.jsx`. Until the key is in
place, the site shows each visitor a "DM us to confirm your spot" button as a
fallback, so no signup is silently lost.

The key is designed to live in public site code — it only lets people send email
*to you*. Free tier is 250 submissions/month. Set up a Gmail filter on the
subject "New Whitefall waitlist signup" to auto-label them.

> History: the site previously used FormSubmit, whose activation flow never
> completed (its one-time links kept reporting "not a valid link"), and before
> that sent to a misspelled address. Signups from those periods never arrived.

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
