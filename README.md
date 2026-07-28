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
- Full signup path verified end-to-end in a browser against mocked live
  services: member number assigned, owner email sent, member card generated.

**One blocker before launch: the Web3Forms access key.** Without it no signup
reaches the inbox — visitors get a "confirm your spot by email" fallback button
instead, so nobody is lost, but it's a worse experience and manual on your end.
Two-minute fix, either way:

- **Easiest — no code:** Vercel → your project → Settings → Environment
  Variables → add `VITE_WEB3FORMS_KEY` = your key → Redeploy.
- **Or in code:** paste it into the `WEB3FORMS_KEY` line near the top of
  `src/App.jsx`, replacing `PASTE-YOUR-ACCESS-KEY-HERE`, and commit.

Get the key at https://web3forms.com — enter kohenjthrasher@gmail.com, it
arrives by email in about a minute. No account, no activation link.

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
minute. Then set it either as the `VITE_WEB3FORMS_KEY` environment variable in
Vercel (Settings → Environment Variables → Redeploy — no code edit), or by
pasting it into the `WEB3FORMS_KEY` line near the top of `src/App.jsx`. Until
the key is in place, the site shows each visitor a "confirm your spot by email"
button as a fallback, so no signup is silently lost.

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

## After deploying

- **Share card**: handled automatically — `vite.config.js` fills the real domain
  into the og/twitter tags at build time using Vercel's own environment
  variables, and follows a custom domain when you attach one. To force a
  specific URL, set `VITE_SITE_URL` in Vercel's environment variables.
- **Waitlist sizes**: signups can tap their size — the owner panel (passcode 0623)
  shows a size tally so you know how many of each size to produce.

Note: the brand name is currently WHITEFALL throughout. If the final name changes,
tell Claude and it's a one-command swap.
