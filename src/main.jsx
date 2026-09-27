import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
/* Fonts are self-hosted: served from this site instead of Google, so there is
   no third-party request before first paint, nothing to be blocked, and the
   member card canvas can always rely on the real faces. Only the weights the
   site actually uses are imported. */
import "@fontsource/anton/400.css";
import "@fontsource/archivo/400.css";
import "@fontsource/archivo/500.css";
import "@fontsource/archivo/600.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "@fontsource/syncopate/700.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* Both no-op outside Vercel, so local dev stays clean. Enable each in
        Vercel → your project → Analytics / Speed Insights. */}
    <Analytics />
    <SpeedInsights />
  </React.StrictMode>
);
