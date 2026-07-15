# WHITEFALL — Unstoppable Momentum

Official FW26 site. Dark, premium, limited.

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
instantly via FormSubmit (free, no account).

**The very first signup triggers a confirmation email to you — open it and click
"Activate".** Do this yourself right after deploying: open the live site, sign up
with any email, then check your inbox (and spam) for the FormSubmit activation
email. Signups submitted *before* activation are NOT delivered, so activate before
sharing the link. After that, every signup lands in your inbox automatically with
the visitor's email, member number, and which pieces they want. Set up a Gmail
filter on the subject "New Whitefall waitlist signup" to auto-label them.

> Note: an earlier version of the site sent signups to `kohenthrasher@gmail.com`
> (missing the "j") — a typo. Any signups from that period never reached you.

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
