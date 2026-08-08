import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
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
