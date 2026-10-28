/* ————————————————————————————————————————————————
   LIVE STOCK — runs on Vercel, not in the browser.

   GET /api/stock?handle=whitefall-crewneck
     → { ok: true, available: true, variants: { "<variant id>": true|false } }

   The site's size picker calls this so sold-out sizes grey out — and the
   whole piece flips to SOLD OUT — on their own during a drop. No keys needed:
   it reads the public product data Shopify serves for every published product
   (/products/<handle>.js), server-side, so there are no browser cross-site
   rules to fight.

   Vercel's edge caches each answer for 15 seconds, so even a rush of buyers
   reaches Shopify at most a few times a minute.

   While the Shopify storefront is still password-locked (before the drop),
   Shopify answers with its password page instead of product data. This
   endpoint then reports { ok: false, reason: "store-locked" } and the site
   simply leaves every size tappable — the checkout still has the final say.
———————————————————————————————————————————————— */

const shopDomain = () =>
  (process.env.SHOPIFY_STORE || "a1xduc-bf.myshopify.com")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");

// Only products the site actually sells — this is not an open proxy.
const HANDLES = new Set(["whitefall-crewneck"]);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  const handle = String((req.query && req.query.handle) || "");
  if (!HANDLES.has(handle)) {
    return res.status(400).json({ ok: false, error: "unknown_product" });
  }

  // short cache on failures too, so a locked store isn't asked on every visit
  const fail = (reason) => {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    return res.status(200).json({ ok: false, reason });
  };

  let r;
  try {
    r = await fetch(`https://${shopDomain()}/products/${handle}.js`, {
      redirect: "manual", // a redirect here means the password page
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });
  } catch (e) {
    return fail("unreachable");
  }
  if (r.status >= 300 && r.status < 400) return fail("store-locked");
  if (r.status === 404) return fail("not-published");
  if (!r.ok) return fail(`shopify-${r.status}`);

  let product;
  try {
    product = await r.json();
  } catch (e) {
    return fail("store-locked"); // got HTML (the password page), not JSON
  }

  const variants = {};
  for (const v of product.variants || []) variants[String(v.id)] = Boolean(v.available);

  res.setHeader("Cache-Control", "public, s-maxage=15, stale-while-revalidate=45");
  return res.status(200).json({ ok: true, available: Boolean(product.available), variants });
}
