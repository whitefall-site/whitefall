import React from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* Vercel Analytics — no-ops outside Vercel, so local dev stays clean.
        Turn it on in Vercel → your project → Analytics. */}
    <Analytics />
  </React.StrictMode>
);
