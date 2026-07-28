import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* The share-card tags need an absolute URL. Vercel exposes the site's domain
   at build time, so this fills itself in on every deploy — including after a
   custom domain is attached. Set VITE_SITE_URL to override. */
const siteUrl = (() => {
  const raw =
    process.env.VITE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "";
  if (!raw) return "";
  const trimmed = raw.replace(/\/+$/, "");
  return /^https?:\/\//.test(trimmed) ? trimmed : "https://" + trimmed;
})();

export default defineConfig({
  plugins: [
    react(),
    {
      name: "whitefall-site-url",
      transformIndexHtml(html) {
        if (siteUrl) return html.split("https://YOUR-SITE-URL").join(siteUrl);
        // Local build with no domain available: drop those tags entirely rather
        // than ship links pointing at a domain that doesn't exist.
        return html.replace(/^.*YOUR-SITE-URL.*\r?\n?/gm, "");
      },
    },
  ],
});
