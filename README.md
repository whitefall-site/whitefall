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
3. Vercel auto-detects Vite. Click Deploy. Done — free HTTPS URL, and you can attach your custom domain later.

Or without GitHub: `npx vercel` in this folder and follow the prompts.

### Option B — Netlify Drop (simplest possible)
1. Run `npm run build` — this creates a `dist/` folder
2. Go to app.netlify.com/drop and drag the `dist` folder onto the page
3. Live instantly. (Re-drag after any change.)

## The waitlist database — IMPORTANT one-time step

Every signup from every visitor is saved to one shared **Supabase** database
(free tier), and the **owner panel on the site shows the full live list from any
device**. Do this once:

1. Go to [supabase.com](https://supabase.com) → sign up (free) → **New project**
   (any name, any region, set a database password and keep it somewhere safe).
2. In the project, open **SQL Editor** → **New query** → paste the entire
   contents of `supabase-setup.sql` (in this repo) → **Run**. It creates the
   signups table and the secure functions the site calls.
3. Open **Project Settings → API** and copy two values: the **Project URL** and
   the **anon public** key.
4. In **Vercel** → your project → **Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL` = the Project URL
   - `VITE_SUPABASE_ANON_KEY` = the anon public key
   Then **redeploy** (Deployments → ⋯ → Redeploy) so the build picks them up.
5. For local dev: copy `.env.example` to `.env.local` and fill in the same two
   values.

That's it. The owner panel (faint **OWNER** button in the footer) now checks the
passcode against the database and shows every signup — email, member number,
size, date — live from all visitors. Member numbers are assigned by the database
in signup order, so the first 100 founding-member numbers are globally correct.

**Change the passcode** (recommended — the default `0623` is visible in this
repo's history): in Supabase SQL Editor run

```sql
update settings set value = 'YOUR-NEW-LONGER-CODE' where key = 'owner_code';
```

then use that code in the OWNER panel. Longer is better — anyone on the internet
can attempt codes, so treat it like a password.

**Fallback:** if the two env vars are not set, the site falls back to the old
behavior — signups are emailed to **kohenthrasher@gmail.com** via FormSubmit
(which requires a one-time "Activate" click on the email FormSubmit sends you)
and the owner panel only shows signups made on that same device.

## Owner panel

Bottom-right of the footer → the faint **OWNER** button → enter your passcode.
With Supabase set up (see above) it shows **every signup from every visitor,
live, from any device** — emails, member numbers, a size tally, and copy /
email-me-the-list buttons. The passcode is checked by the database, not by
code in the page, so change it with the SQL one-liner above and it takes
effect everywhere immediately.

## Editing quick-reference (all in `src/App.jsx`)

- Products/teasers → the `TEASERS` array
- FAQ answers → the `FAQS` array
- Contact categories → the `TOPICS` array
- Passcode → in Supabase (`settings` table); `OWNER_CODE` in App.jsx is only the fallback when Supabase isn't configured
- Drop countdown date → the `DROP_DATE` line (placeholder: Oct 1, 2026, noon ET)
- Slogan/copy → search the text you want to change

When you outgrow this (real checkout, inventory), the natural next step is
Shopify with this design as the storefront theme direction, or keep this site
and link "Shop" to a Shopify/Stripe checkout.

## After deploying — 2 quick things

1. **Share card**: open `index.html` and replace `YOUR-SITE-URL` (2 places) with your
   real deployed URL, commit, redeploy. Now links pasted anywhere show the branded card.
2. **Waitlist sizes**: signups can tap their size — the owner panel
   shows a size tally so you know how many of each size to produce.

Note: the brand name is currently WHITEFALL throughout. If the final name changes,
tell Claude and it's a one-command swap.
