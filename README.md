# WHITEFALL — Unstoppable Momentum

Official FW26 site. Dark, premium, limited.

## Where things stand (updated July 19, 2026)

Done and live:
- Deployed on Vercel — every merge to `main` redeploys automatically.
- Glitch fixes shipped: smooth scrolling (no more full-page re-renders), stable
  mobile layout (no address-bar jumping), fonts preloaded, signups can't hang.
- Waitlist relay switched from FormSubmit (activation never worked) to Web3Forms.
- Repeat signups from the same device keep their original member number.

Two steps remain — both quick:
1. **Signup emails**: get a free Web3Forms access key and paste it into the
   `WEB3FORMS_KEY` line in `src/App.jsx` — full instructions in "The email
   list" section below. Until then, visitors who join see an "email your
   signup" backup button, so nothing is lost.
2. **Share cards**: replace `YOUR-SITE-URL` (2 places) in `index.html` with the
   real site URL so pasted links show the branded preview image.

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

## The email list — IMPORTANT one-time step

Every waitlist signup on the live site is emailed to **kohenjthrasher@gmail.com**
instantly via Web3Forms (free, no account, no activation link).

**One-time setup:** go to https://web3forms.com, enter kohenjthrasher@gmail.com
in the "Create your Access Key" box, and the key arrives in your inbox within a
minute. Paste it into the `WEB3FORMS_KEY` line near the top of `src/App.jsx`
(replacing `PASTE-YOUR-ACCESS-KEY-HERE`), commit, redeploy. Until the key is in
place, the site shows each visitor a "couldn't reach the list — email your
signup" button as a fallback, so no signup is silently lost.

The key is designed to live in public site code — it only lets people send email
*to you*. Free tier is 250 submissions/month. Set up a Gmail filter on the
subject "New Whitefall waitlist signup" to auto-label them.

> History: the site previously used FormSubmit, whose activation flow never
> completed (its one-time links kept reporting "not a valid link"), and before
> that sent to `kohenthrasher@gmail.com` (missing the "j") — a typo. Signups
> from those periods never arrived.

## Owner panel

Bottom-right of the footer → the faint **OWNER** button → passcode **0623**.
Shows signups recorded on that device, with copy + email-me-the-list buttons.
(On the live site your inbox is the master list; the panel is a backup view.
The passcode is a light lock — anyone reading the source code can find it,
so don't put anything sensitive behind it.)

## Editing quick-reference (all in `src/App.jsx`)

- Products/teasers → the `TEASERS` array
- FAQ answers → the `FAQS` array
- Contact categories → the `TOPICS` array
- Passcode → `OWNER_CODE`
- Drop countdown date → the `DROP_DATE` line (placeholder: Oct 1, 2026, noon ET)
- Slogan/copy → search the text you want to change

When you outgrow this (real checkout, inventory), the natural next step is
Shopify with this design as the storefront theme direction, or keep this site
and link "Shop" to a Shopify/Stripe checkout.

## After deploying — 2 quick things

1. **Share card**: open `index.html` and replace `YOUR-SITE-URL` (2 places) with your
   real deployed URL, commit, redeploy. Now links pasted anywhere show the branded card.
2. **Waitlist sizes**: signups can tap their size — the owner panel (passcode 0623)
   shows a size tally so you know how many of each size to produce.

Note: the brand name is currently WHITEFALL throughout. If the final name changes,
tell Claude and it's a one-command swap.
