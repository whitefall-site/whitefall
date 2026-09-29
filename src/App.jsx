import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { LOGO_VIEWBOX, LOGO_OUTLINES, LOGO_FILL } from "./logoPaths.js";

/* ————————————————————————————————————————————————
   WHITEFALL (concept) — FW26 · midnight city
   The logo hangs in the midnight sky.
   Palette: Midnight #05070D · Steel #0C111C · Snow #EDECE8
            Frost #BFD3DB · Ash #7E8590
   Type:    Anton (display) · Archivo (body) · Space Mono (utility)
———————————————————————————————————————————————— */

const LOGO = "/logo.png";

/* FW26 lineup. The piece with `dropping: true` renders as THE DROP — full
   photo feature with the live shop states. The rest sit in NEXT UP as
   compact rows until their first look is ready. */
const PIECES = [
  {
    n: "01",
    name: "WHITEFALL CREWNECK",
    cat: "FRENCH TERRY · CONTRAST PIPING · 320 GSM · 80% COTTON / 20% POLYESTER",
    colorway: "BLACK / WHITE PIPING",
    fit: "RUNS TAILORED",
    shot: "/fw26-01-crewneck.jpg",
    webp: true, // fw26-01-crewneck.webp + fw26-01-crewneck-480.webp exist in public/
    // extra angles: add paths here and the tap-to-zoom view becomes a swipeable gallery
    more: [],
    // the DETAILS tab under the piece — one plain fact per line
    details: [
      // same facts as the Shopify description — keep the two in step
      "320 GSM FRENCH TERRY · 80% COTTON / 20% POLYESTER",
      "MOUNTAIN SCREEN PRINT ACROSS THE BACK",
      "EMBROIDERED CHEST LOCKUP",
      "RAISED WHITE CONTRAST PIPING",
    ],
    alt: "Whitefall Crewneck in black, back view — outlined mountain logo across the shoulders with white contrast piping along the sleeves and body.",
    dropping: true,
    shop: "crewneck",
  },
  { n: "02", name: "AVALANCHE HOODIE", cat: "500GSM · BOX LOGO" },
  { n: "03", name: "MOMENTUM ATHLETIC SHIRT", cat: "PERFORMANCE KNIT · BUILT TO TRAIN" },
  { n: "04", name: "FREEFALL DOWN PUFFER", cat: "700-FILL DOWN · STORM SHELL" },
];

/* ——— SHOP CONFIG — the switch that turns the store on ———
   The site is the storefront; Shopify is the engine behind it (payments,
   inventory, shipping, taxes, refunds).

   The product link and price are public information, not secrets, so they
   live here as defaults — no Vercel variable is needed for BUY NOW to work.
   Each can still be overridden from Vercel → Settings → Environment
   Variables → Redeploy, which is the easy way to change a price:

     VITE_CREWNECK_URL      override the product link below
     VITE_CREWNECK_PRICE    override the displayed price
     VITE_CREWNECK_SOLDOUT  set to 1 → SOLD OUT state + notify CTA
     VITE_DROP_LIVE         set to 1 → go live before the countdown date

   BUY NOW still only appears once the drop is live, so setting these early
   is safe. Full owner runbook in README → "Shopify — the commerce engine". */
const SHOP = {
  crewneck: {
    price: import.meta.env.VITE_CREWNECK_PRICE || "$69.99",
    checkoutUrl:
      import.meta.env.VITE_CREWNECK_URL ||
      "https://a1xduc-bf.myshopify.com/products/whitefall-crewneck",
    soldOut: import.meta.env.VITE_CREWNECK_SOLDOUT === "1",
  },
};
const FORCE_DROP_LIVE = import.meta.env.VITE_DROP_LIVE === "1";
// matches the five Shopify variants
const SIZES = ["S", "M", "L", "XL", "XXL"];

/* The manifesto is hidden, not deleted — flip to true to bring it back.
   The house voice is now closer to a shipping notice than a poem: facts
   stacked in a list, the product doing the persuading. */
const SHOW_MANIFESTO = false;

/* Stacked facts, no prose. One line per thing that is true. */
const SpecList = ({ items, center = false }) => (
  <ul style={{
    ...mono, listStyle: "none", margin: 0, padding: 0,
    display: "flex", flexDirection: "column", gap: 8,
    fontSize: 12, letterSpacing: "0.16em", lineHeight: 1.5,
    color: S.ash, textAlign: center ? "center" : "left",
  }}>
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

/* Hollow, broadened wordmark — outlined letterforms matching the logo's line
   art. Plain letters throughout; the logo stands on its own elsewhere. */
const Wordmark = ({ size, stroke, glow = false, spacing = "0.1em" }) => (
  <span style={{
    fontFamily: "'Syncopate', sans-serif", fontWeight: 700,
    fontSize: size, letterSpacing: spacing, whiteSpace: "nowrap",
    color: "transparent", WebkitTextStroke: `${stroke} #EDECE8`,
    filter: glow ? "drop-shadow(0 0 18px rgba(191,211,219,.35))" : "none",
  }}>
    WHITEFALL
  </span>
);

const CSS = `
html { scroll-behavior: smooth; }
section[id] { scroll-margin-top: 72px; }
body { margin: 0; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes signalPulse {
  0%, 100% { filter: drop-shadow(0 0 24px rgba(191,211,219,.55)) drop-shadow(0 0 90px rgba(191,211,219,.25)); }
  50% { filter: drop-shadow(0 0 40px rgba(191,211,219,.8)) drop-shadow(0 0 130px rgba(191,211,219,.4)); }
}
@keyframes drift { from { background-position: 0 0; } to { background-position: 0 700px; } }
@keyframes riseIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
.hero-in { animation: riseIn 1.1s cubic-bezier(.16,.8,.24,1) both; }
.hd1 { animation-delay: .15s; } .hd2 { animation-delay: .3s; } .hd3 { animation-delay: .5s; }
.marquee-track { animation: marquee 26s linear infinite; }
.signal { animation: signalPulse 4.5s ease-in-out infinite; }
/* hero logo reveal: outlines trace on (driven from JS, see HeroMark), then
   the solid mark fades up. The glow is a pre-blurred copy of the logo that
   only changes opacity, which phones can animate without repainting. */
.mark-line { fill: none; stroke: #EDECE8; stroke-width: 2; stroke-linejoin: round; }
.mark-fill { fill: #EDECE8; fill-rule: evenodd; opacity: 0; transition: opacity 1.3s ease; }
.mark-draw.drawn .mark-fill { opacity: 1; }
.mark-glow {
  position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
  filter: blur(22px); opacity: 0; transition: opacity 1.6s ease; will-change: opacity;
}
.mark-glow.on { opacity: .75; animation: glowPulse 4.5s ease-in-out 1.6s infinite; }
@keyframes glowPulse { 0%, 100% { opacity: .75; } 50% { opacity: 1; } }
/* the mark is smaller on phones, so the drawn line gets heavier to stay visible */
@media (max-width: 640px) { .mark-line { stroke-width: 4; } }
.snowfall {
  background-image:
    radial-gradient(1.5px 1.5px at 12% 18%, rgba(237,236,232,.5) 50%, transparent 51%),
    radial-gradient(1px 1px at 68% 42%, rgba(237,236,232,.35) 50%, transparent 51%),
    radial-gradient(1.5px 1.5px at 41% 71%, rgba(191,211,219,.4) 50%, transparent 51%),
    radial-gradient(1px 1px at 87% 12%, rgba(237,236,232,.3) 50%, transparent 51%),
    radial-gradient(1px 1px at 24% 92%, rgba(191,211,219,.3) 50%, transparent 51%);
  background-size: 340px 700px;
  animation: drift 30s linear infinite;
}
@keyframes popIn { from { opacity: 0; transform: translate(-50%,-50%) scale(.94); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
.pop-in { animation: popIn .5s cubic-bezier(.16,.8,.24,1) both; }
/* scroll reveal */
.rv { opacity: 0; transform: translateY(48px); transition: opacity .9s cubic-bezier(.16,.8,.24,1), transform .9s cubic-bezier(.16,.8,.24,1); }
.rv.in { opacity: 1; transform: translateY(0); }
.rv-l { opacity: 0; transform: translateX(-56px); transition: opacity .9s cubic-bezier(.16,.8,.24,1), transform .9s cubic-bezier(.16,.8,.24,1); }
.rv-l.in { opacity: 1; transform: translateX(0); }
.rv-scale { opacity: 0; transform: scale(.92); transition: opacity 1s cubic-bezier(.16,.8,.24,1), transform 1s cubic-bezier(.16,.8,.24,1); }
.rv-scale.in { opacity: 1; transform: scale(1); }
.stagger > * { opacity: 0; transform: translateY(36px); transition: opacity .8s cubic-bezier(.16,.8,.24,1), transform .8s cubic-bezier(.16,.8,.24,1); }
.stagger.in > * { opacity: 1; transform: translateY(0); }
.stagger.in > *:nth-child(1) { transition-delay: .05s; }
.stagger.in > *:nth-child(2) { transition-delay: .15s; }
.stagger.in > *:nth-child(3) { transition-delay: .25s; }
.stagger.in > *:nth-child(4) { transition-delay: .35s; }
.stagger.in > *:nth-child(5) { transition-delay: .45s; }
.stagger.in > *:nth-child(6) { transition-delay: .55s; }
/* support contact rows */
.contact-row {
  display: grid; grid-template-columns: 80px 1fr auto; gap: 18px; align-items: baseline;
  padding: 20px 0; border-bottom: 1px solid rgba(237,236,232,.12);
}
.contact-link {
  font-family: 'Anton', sans-serif; font-size: clamp(20px, 2.6vw, 30px); letter-spacing: 0.03em;
  color: #EDECE8; text-decoration: none; word-break: break-all; transition: color .2s ease;
}
.contact-link:hover, .contact-link:focus-visible { color: #BFD3DB; }
@media (max-width: 640px) {
  .contact-row { grid-template-columns: 1fr; gap: 6px; }
}
/* footer */
.foot-cols { display: flex; gap: 56px; flex-wrap: wrap; }
.foot-link {
  font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #7E8590; text-decoration: none; background: none; border: 0; padding: 0; cursor: pointer;
  transition: color .2s ease;
}
.foot-link:hover, .foot-link:focus-visible { color: #BFD3DB; }
@media (max-width: 480px) { .foot-cols { gap: 36px; } }
/* product info tabs */
.pinfo { margin-top: 28px; max-width: 440px; border-bottom: 1px solid rgba(237,236,232,.12); }
.pinfo details { border-top: 1px solid rgba(237,236,232,.12); }
.pinfo summary {
  list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.18em; color: #EDECE8;
}
.pinfo summary::-webkit-details-marker { display: none; }
.pinfo summary:hover, .pinfo summary:focus-visible { color: #BFD3DB; }
.pinfo-plus { color: #BFD3DB; font-size: 15px; transition: transform .3s ease; }
.pinfo details[open] .pinfo-plus { transform: rotate(45deg); }
/* tap-to-zoom photo */
.shot-btn { display: block; position: relative; padding: 0; border: 0; background: none; cursor: zoom-in; width: 100%; }
.shot-btn:focus-visible { outline: 1px solid #BFD3DB; outline-offset: 4px; }
.shot-hint {
  position: absolute; right: 10px; bottom: 10px; font-family: 'Space Mono', monospace; font-size: 10px;
  letter-spacing: 0.14em; color: #05070D; background: rgba(237,236,232,.88); padding: 5px 8px;
}
.zoom-strip {
  display: flex; height: 100%; overflow-x: auto; scroll-snap-type: x mandatory;
  scrollbar-width: none; overscroll-behavior: contain;
}
.zoom-strip::-webkit-scrollbar { display: none; }
.zoom-slide {
  flex: 0 0 100%; scroll-snap-align: center; display: flex; align-items: center; justify-content: center;
  padding: 56px 16px 40px; box-sizing: border-box;
}
.zoom-slide img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; }
/* featured piece — photo beside the details, stacked on narrow screens */
.piece-feature {
  display: grid; grid-template-columns: minmax(0, 480px) 1fr;
  gap: 48px; align-items: end; padding: 34px 0;
}
.piece-shot {
  width: 100%; height: auto; display: block;
  border: 1px solid rgba(237,236,232,.12); background: #0E131E;
}
@media (max-width: 760px) {
  .piece-feature { grid-template-columns: 1fr; gap: 20px; padding: 26px 0; }
  .piece-shot, .shot-btn { max-width: 440px; margin: 0 auto; }
}
.tease { transition: transform .5s cubic-bezier(.16,.8,.24,1), border-color .4s ease; }
.tease:hover { transform: translateY(-8px); border-color: rgba(191,211,219,.5) !important; }
.tease:hover .tease-logo { opacity: .3; transform: scale(1.08) rotate(-2deg); }
.tease-logo { transition: opacity .5s ease, transform .7s cubic-bezier(.16,.8,.24,1); }
a:focus-visible, button:focus-visible, input:focus-visible { outline: 2px solid #BFD3DB; outline-offset: 3px; }
::selection { background: #BFD3DB; color: #05070D; }

/* ——— phone-first tuning ——— */
/* svh units track the small viewport, so the hero doesn't jump when the
   mobile browser's address bar hides/shows (vh lines are the fallback) */
.hero { min-height: 100vh; min-height: 100svh; }
.hero-wrap { top: 14vh; top: 14svh; }
.hero-copy { bottom: 5vh; bottom: 5svh; }
.nav-solo { display: none; }
@media (max-width: 640px) {
  .nav-word { display: none; }
  .nav-solo { display: inline-block !important; }
  .nav-links { gap: 14px !important; }
  .ig-full { display: none; }
  .hero-wrap { top: 11vh !important; top: 11svh !important; }
  .hero-mark { width: min(72vw, 38svh) !important; }
  .slogan { letter-spacing: 0.2em !important; }
}
@media (min-width: 641px) { .ig-short { display: none; } }
.join-bar { display: none; transition: transform .35s ease, opacity .35s ease; }
.join-bar-away { transform: translateY(110%); opacity: 0; pointer-events: none; }
@media (max-width: 640px) {
  .join-bar { display: flex !important; }
  footer { padding-bottom: 104px !important; }
}
@media (max-width: 480px) {
  .form-row { flex-direction: column !important; align-items: stretch !important; }
  .form-in { width: 100% !important; box-sizing: border-box; border-right: 1px solid rgba(237,236,232,.12) !important; margin-bottom: 8px; }
  .form-btn { width: 100% !important; }
  section[id] { scroll-margin-top: 62px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .rv, .rv-l, .rv-scale, .stagger > * { opacity: 1 !important; transform: none !important; }
}
`;

/* —— scroll-reveal hook —— */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv, .rv-l, .rv-scale, .stagger");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* —— parallax hook: writes the transform straight to the element on scroll,
      so the rest of the app never re-renders while scrolling —— */
function useParallax(toTransform) {
  const ref = useRef(null);
  useEffect(() => {
    let raf = null;
    const apply = () => {
      raf = null;
      if (ref.current) ref.current.style.transform = toTransform(window.scrollY);
    };
    const onScroll = () => { if (raf == null) raf = requestAnimationFrame(apply); };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => { window.removeEventListener("scroll", onScroll); if (raf != null) cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

/* The hero logo. Each outline is measured and traced on with the Web
   Animations API (works the same in Safari and Chrome), then the solid mark
   fades up and the glow starts pulsing. Set up before first paint so the
   lines never flash in fully drawn. Reduced motion, or a browser without the
   API, gets the finished mark straight away. */
function HeroMark() {
  const svgRef = useRef(null);
  const [drawn, setDrawn] = useState(false);
  useLayoutEffect(() => {
    const lines = [...svgRef.current.querySelectorAll(".mark-line")];
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !lines.length || !lines[0].getTotalLength || !lines[0].animate) { setDrawn(true); return; }
    const anims = lines.map((path, i) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len} ${len}`;
      path.style.strokeDashoffset = `${len}`;
      return path.animate(
        [{ strokeDashoffset: `${len}` }, { strokeDashoffset: "0" }],
        { duration: 2100, delay: 200 + i * 250, easing: "cubic-bezier(.65,0,.35,1)", fill: "forwards" }
      );
    });
    const t = setTimeout(() => setDrawn(true), 2300);
    return () => { clearTimeout(t); anims.forEach((a) => a.cancel()); };
  }, []);
  return (
    <div className="hero-mark" style={{ position: "relative", width: "min(52vw, 400px)" }}>
      <img src={LOGO} alt="" aria-hidden className={"mark-glow" + (drawn ? " on" : "")} />
      <svg ref={svgRef} viewBox={LOGO_VIEWBOX} aria-hidden="true" className={"mark-draw" + (drawn ? " drawn" : "")}
        style={{ position: "relative", width: "100%", height: "auto", display: "block", overflow: "visible" }}>
        <path className="mark-fill" d={LOGO_FILL} />
        {LOGO_OUTLINES.map((d, i) => <path key={i} className="mark-line" d={d} />)}
      </svg>
    </div>
  );
}

/* —— fetch with a deadline, so a stalled network call can never leave the
      signup button stuck on "SAVING…" —— */
const fetchT = (url, opts = {}, ms = 10000) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { ...opts, signal: ctl.signal }).finally(() => clearTimeout(t));
};

/* —— visitor memory (this browser only): { joinedAt, popupDismissedAt,
      barDismissedAt }. Every access is guarded — private windows and
      blocked storage simply behave like a first visit. —— */
const VISITOR_KEY = "whitefall-visitor";
const readVisitor = () => {
  try { return JSON.parse(localStorage.getItem(VISITOR_KEY) || "{}") || {}; } catch (e) { return {}; }
};
const writeVisitor = (patch) => {
  try { localStorage.setItem(VISITOR_KEY, JSON.stringify({ ...readVisitor(), ...patch })); } catch (e) { /* blocked */ }
};
const WEEK = 7 * 24 * 60 * 60 * 1000;
const recent = (ts) => typeof ts === "number" && Date.now() - ts < WEEK;

const S = {
  snow: "#EDECE8",
  frost: "#BFD3DB",
  ash: "#7E8590",
  night: "#05070D",
  steel: "#0B0F18",
  panel: "#0E131E",
  line: "rgba(237,236,232,.12)",
};
const anton = { fontFamily: "'Anton', sans-serif" };
const mono = { fontFamily: "'Space Mono', monospace" };
const IG = "https://instagram.com/whitefall26";

// ——— DROP DATE (placeholder — change this one line when the real date is locked) ———
/* Empty until the date is locked. While it is empty the site says the date is
   unannounced instead of counting down to a guess, and BUY NOW stays hidden.

   To start the countdown, either put an ISO date here or set VITE_DROP_DATE in
   Vercel — e.g. "2026-11-14T12:00:00-05:00" (note -05:00 for EST after Nov 2,
   -04:00 for EDT before it). The shop then turns itself on at that moment, so
   nobody has to be at a keyboard. */
const DROP_DATE_RAW = import.meta.env.VITE_DROP_DATE || "";
const parsedDrop = DROP_DATE_RAW ? new Date(DROP_DATE_RAW).getTime() : NaN;
const DROP_DATE = Number.isFinite(parsedDrop) ? parsedDrop : null;

/* Self-contained so its once-a-second tick re-renders only these tiles,
   not the whole page */
function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (DROP_DATE == null) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (DROP_DATE == null) {
    return (
      <div>
        <div style={{ ...anton, fontSize: "clamp(20px, 2.6vw, 28px)", color: S.snow, letterSpacing: "0.06em", lineHeight: 1.1 }}>
          DATE TO BE ANNOUNCED
        </div>
        {/* every update goes out on Instagram first */}
        <a href={IG} target="_blank" rel="noopener noreferrer"
          style={{ ...mono, display: "inline-block", fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginTop: 8, textDecoration: "none", borderBottom: "1px solid rgba(191,211,219,.4)", paddingBottom: 2 }}>
          RELEASE DATES ON INSTAGRAM — @WHITEFALL26
        </a>
      </div>
    );
  }

  const diff = Math.max(0, DROP_DATE - now);
  const cd = {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
  const pad = (v) => String(v).padStart(2, "0");
  return diff > 0 ? (
    <>
      {[["DAYS", pad(cd.d)], ["HRS", pad(cd.h)], ["MIN", pad(cd.m)], ["SEC", pad(cd.s)]].map(([l, v]) => (
        <div key={l} style={{ border: `1px solid ${S.line}`, background: S.panel, padding: "12px 0", width: 74, textAlign: "center" }}>
          <div style={{ ...anton, fontSize: 30, lineHeight: 1, color: S.snow }}>{v}</div>
          <div style={{ ...mono, fontSize: 9, letterSpacing: "0.2em", color: S.ash, marginTop: 6 }}>{l}</div>
        </div>
      ))}
      <span style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginLeft: 6 }}>UNTIL THE DROP</span>
    </>
  ) : (
    <span style={{ ...anton, fontSize: 30, color: S.frost, letterSpacing: "0.06em" }}>THE DROP IS LIVE ▲</span>
  );
}

/* The shop states for a dropping piece: GET NOTIFIED before the drop,
   BUY NOW once live and configured, SOLD OUT when the run is gone.
   Checks the clock on a slow tick so the flip happens without a reload. */
function PieceShop({ shopId, fit, onNotify }) {
  const cfg = SHOP[shopId] || {};
  // With no date set, the shop stays shut unless deliberately forced live.
  const [live, setLive] = useState(
    FORCE_DROP_LIVE || (DROP_DATE != null && Date.now() >= DROP_DATE)
  );
  useEffect(() => {
    if (live || DROP_DATE == null) return;
    const t = setInterval(() => {
      if (Date.now() >= DROP_DATE) { setLive(true); clearInterval(t); }
    }, 15000);
    return () => clearInterval(t);
  }, [live]);
  const buyable = live && cfg.checkoutUrl && !cfg.soldOut;
  const dropDay = DROP_DATE == null
    ? null
    : new Date(DROP_DATE).toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const chip = { ...mono, fontSize: 10, letterSpacing: "0.14em", padding: "6px 10px" };
  return (
    <div>
      {cfg.price && (
        <div style={{ ...mono, fontSize: 17, color: S.snow, letterSpacing: "0.08em", margin: "0 0 14px" }}>{cfg.price}</div>
      )}
      {/* size and fit read like a hang tag: label, then value */}
      <dl style={{ ...mono, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 18, rowGap: 8, margin: "0 0 20px", fontSize: 11, letterSpacing: "0.16em" }}>
        <dt style={{ color: S.ash }}>SIZES</dt>
        <dd style={{ margin: 0, color: S.snow, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {SIZES.map((s) => <span key={s}>{s}</span>)}
        </dd>
        {fit && <><dt style={{ color: S.ash }}>FIT</dt><dd style={{ margin: 0, color: S.frost }}>{fit}</dd></>}
      </dl>
      {cfg.soldOut && (
        <div style={{ marginBottom: 18 }}><span style={{ ...chip, fontWeight: 700, color: S.night, background: S.snow }}>SOLD OUT</span></div>
      )}
      {cfg.soldOut ? (
        <button onClick={onNotify}
          style={{ ...mono, background: "none", border: "1px solid rgba(191,211,219,.4)", color: S.frost, padding: "15px 26px", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer" }}>
          GET RESTOCK ALERTS ▲
        </button>
      ) : buyable ? (
        <a href={cfg.checkoutUrl} target="_blank" rel="noopener noreferrer"
          style={{ ...mono, display: "inline-block", background: S.snow, color: S.night, padding: "16px 34px", textDecoration: "none", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}>
          BUY NOW ▲
        </a>
      ) : (
        <button onClick={onNotify}
          style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "16px 28px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
          GET NOTIFIED ▲
        </button>
      )}
      {/* with no date, the countdown block above already says "TBA" */}
      {!live && !cfg.soldOut && dropDay && (
        <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.16em", margin: "14px 0 0" }}>
          DROPS {dropDay} · UPDATES ON @WHITEFALL26
        </p>
      )}
    </div>
  );
}

/* Same facts as the FAQ, cut down to lines — keep the two in step. */
const SHIPPING_FACTS = [
  "UNITED STATES ONLY, FOR NOW",
  "TRACKING LINK BY EMAIL WITHIN 24 HOURS OF SHIPPING",
];
const RETURN_FACTS = [
  "30 DAYS, NO QUESTIONS",
  "UNWORN, TAGS ON — FULL REFUND",
  "EMAIL YOUR ORDER NUMBER, WE SEND INSTRUCTIONS",
];

/* DETAILS / SHIPPING / RETURNS under a piece. Native <details>, so it works
   with the keyboard and screen readers with no extra code. */
function ProductInfo({ details = [] }) {
  const tabs = [["DETAILS", details], ["SHIPPING", SHIPPING_FACTS], ["RETURNS", RETURN_FACTS]]
    .filter(([, items]) => items.length);
  return (
    <div className="pinfo">
      {tabs.map(([title, items]) => (
        <details key={title}>
          <summary>{title}<span aria-hidden className="pinfo-plus">+</span></summary>
          <div style={{ padding: "2px 0 16px" }}><SpecList items={items} /></div>
        </details>
      ))}
    </div>
  );
}

const FAQS = [
  { id: "drop", q: "When does FW26 drop?", a: "Release dates and every update go up on Instagram — follow @whitefall26. Join the waitlist and you'll also get an email when it drops." },
  { id: "tracking", q: "Where's my order?", a: "Every order gets a tracking link by email within 24 hours of shipping. Can't find it? Email us your order number, or DM us on Instagram — we respond within one business day." },
  { id: "returns", q: "What's your return policy?", a: "30 days, no questions. Unworn, tags on, full refund to your original payment method. Email us your order number and we'll send you return instructions." },
  { id: "sizing", q: "How does sizing run?", a: "It varies piece to piece — some are cut boxy and oversized, others tailored and slim. Every piece lists its fit next to its sizes. Want exact measurements for a size? Email us or DM us on Instagram and we'll send them." },
  { id: "restocks", q: "Will pieces restock?", a: "Rarely, and never guaranteed. Runs are small and numbered by design — when a piece sells out, don't count on seeing it again. If a restock ever happens, the waitlist hears first." },
  { id: "shipping", q: "Where do you ship?", a: "The United States for now. International is on the list — join the waitlist and you'll hear the moment it opens up." },
];

/* Brand support inbox — published on the site on purpose. Keep this a brand
   address, never a personal one. Waitlist delivery does NOT depend on it (see
   api/signup.js); this is purely the customer-facing contact route. */
const SUPPORT_EMAIL = "whitefall26@gmail.com";

export default function App() {
  useReveal();
  const moonRef = useParallax((y) => `translateY(${y * 0.06}px)`);
  const heroRef = useParallax((y) => `translateX(-50%) translateY(${y * 0.22}px)`);
  const poolRef = useParallax((y) => `translate(-50%, 0) translateY(${y * 0.16}px)`);
  const markRef = useParallax((y) => `translateY(calc(-50% + ${(y - 1400) * 0.08}px)) rotate(6deg)`);
  /* What this browser remembers about the visitor, read once on load:
     people who already joined see "you're on the list" instead of the form,
     and anyone who closed the popup or bar isn't asked again for a week. */
  const [visitor] = useState(readVisitor);
  useEffect(() => {
    const v = readVisitor();
    if (v.joinedAt || recent(v.popupDismissedAt)) return;
    /* Ask once they've shown interest (scrolled past most of the hero) or
       after 12 seconds — never on arrival, and never while they're already
       looking at the waitlist form. */
    let fired = false;
    const fire = () => {
      if (fired) return;
      const w = document.getElementById("waitlist");
      if (w) {
        const r = w.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) return;
      }
      fired = true;
      setPopup(true);
      stop();
    };
    /* Decide only once scrolling settles: a tap on "JOIN THE WAITLIST"
       smooth-scrolls past the trigger point on its way to the form, and
       that visitor must not be interrupted mid-glide. */
    let settle, scrolling = false, timeUp = false;
    const onScroll = () => {
      scrolling = true;
      clearTimeout(settle);
      settle = setTimeout(() => {
        scrolling = false;
        if (timeUp || window.scrollY > window.innerHeight * 0.6) fire();
      }, 450);
    };
    const t = setTimeout(() => { timeUp = true; if (!scrolling) fire(); }, 12000);
    window.addEventListener("scroll", onScroll, { passive: true });
    const stop = () => { clearTimeout(t); clearTimeout(settle); window.removeEventListener("scroll", onScroll); };
    return stop;
  }, []);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(() => !!visitor.joinedAt);
  const [open, setOpen] = useState(null);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupDone, setPopupDone] = useState(false);
  const [popupJoined, setPopupJoined] = useState(false);
  const [relayFailed, setRelayFailed] = useState(false);
  const [shared, setShared] = useState(false);
  const [barDismissed, setBarDismissed] = useState(() => recent(visitor.barDismissedAt));
  const [waitlistInView, setWaitlistInView] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [joinedAt, setJoinedAt] = useState(() => (visitor.joinedAt ? new Date(visitor.joinedAt) : null));
  const [zoom, setZoom] = useState(null); // { name, alt, images } while the photo viewer is open
  const [zoomAt, setZoomAt] = useState(0);
  const stripRef = useRef(null);
  const stepZoom = (dir) => {
    const s = stripRef.current;
    if (s) s.scrollBy({ left: dir * s.clientWidth, behavior: "smooth" });
  };
  const [cardOpen, setCardOpen] = useState(false);
  const [cardUrl, setCardUrl] = useState(null);
  const [cardBusy, setCardBusy] = useState(false);
  /* The join date replaces the old member number: it is the one personal,
     "I was early" detail that needs no shared counter and can never fail. */
  const joinedLabel = (joinedAt || new Date())
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();

  const shareSite = async () => {
    const data = { title: "WHITEFALL", text: "FW26 is coming. FREEDOM TO FALL.", url: typeof location !== "undefined" ? location.href : "" };
    try {
      if (navigator.share) { await navigator.share(data); setShared(true); return; }
      await navigator.clipboard.writeText(data.url || data.text);
      setShared(true); setTimeout(() => setShared(false), 1800);
    } catch (e) { /* user cancelled share sheet */ }
  };

  // ——— MEMBER CARD: story-sized, generated in the browser ———
  const buildCard = async () => {
    if (cardBusy) return;
    setCardBusy(true);
    try {
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
      const c = document.createElement("canvas");
      c.width = 1080; c.height = 1920;
      const x = c.getContext("2d");
      const ls = (v) => { try { x.letterSpacing = v; } catch (e) {} };

      /* ——— ground: night gradient + starfield ——— */
      const grad = x.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, "#03040A"); grad.addColorStop(0.55, "#070C18"); grad.addColorStop(1, "#0B1322");
      x.fillStyle = grad; x.fillRect(0, 0, 1080, 1920);
      for (let i = 0; i < 130; i++) {
        x.fillStyle = `rgba(237,236,232,${0.12 + Math.random() * 0.4})`;
        const r = Math.random() < 0.7 ? 2 : 3;
        x.fillRect(Math.random() * 1080, Math.random() * 1920, r, r);
      }
      /* pooled glow behind the number, replacing the old logo glow */
      const pool = x.createRadialGradient(540, 940, 0, 540, 940, 620);
      pool.addColorStop(0, "rgba(191,211,219,.13)");
      pool.addColorStop(1, "rgba(191,211,219,0)");
      x.fillStyle = pool; x.fillRect(0, 320, 1080, 1240);

      /* ——— credential frame ——— */
      x.strokeStyle = "rgba(191,211,219,.22)"; x.lineWidth = 2;
      x.strokeRect(64, 64, 1080 - 128, 1920 - 128);

      x.textAlign = "center";

      /* ——— header: wordmark, no glyph ——— */
      ls("14px");
      x.lineWidth = 3; x.strokeStyle = "#EDECE8";
      x.font = "700 52px Syncopate, sans-serif";
      x.strokeText("WHITEFALL", 540, 210);
      ls("10px");
      x.fillStyle = "#7E8590";
      x.font = "400 24px 'Space Mono', monospace";
      x.fillText("FW26  ·  FREEDOM TO FALL", 540, 268);
      x.strokeStyle = "rgba(237,236,232,.16)"; x.lineWidth = 1;
      x.beginPath(); x.moveTo(150, 320); x.lineTo(930, 320); x.stroke();

      /* ——— status line ——— */
      ls("12px");
      x.fillStyle = "#BFD3DB";
      x.font = "700 34px 'Space Mono', monospace";
      x.fillText("ON THE LIST", 540, 560);

      /* ——— the hero: the drop this pass is for ——— */
      ls("2px");
      x.fillStyle = "#EDECE8";
      x.shadowColor = "rgba(191,211,219,.45)"; x.shadowBlur = 70;
      x.font = "400 300px Anton, sans-serif";
      x.fillText("FW26", 540, 900);
      x.shadowBlur = 0;

      /* ——— the promise, spelled out ——— */
      ls("8px");
      x.fillStyle = "#7E8590";
      x.font = "400 30px 'Space Mono', monospace";
      x.fillText("DROP ALERTS BY EMAIL", 540, 1010);

      /* ——— join date: the personal detail, and the earliness signal ——— */
      ls("10px");
      x.fillStyle = "#BFD3DB";
      x.font = "700 26px 'Space Mono', monospace";
      x.fillText("ON THE LIST SINCE", 540, 1180);
      ls("4px");
      x.fillStyle = "#EDECE8";
      x.font = "400 96px Anton, sans-serif";
      x.fillText(joinedLabel, 540, 1290);

      /* ——— credential data rows ——— */
      const rowY = 1530;
      x.strokeStyle = "rgba(237,236,232,.16)"; x.lineWidth = 1;
      x.beginPath(); x.moveTo(150, rowY - 80); x.lineTo(930, rowY - 80); x.stroke();
      const cells = [
        ["ALERTS", "EMAIL"],
        ["DROP", "FW26"],
        ["STATUS", "CONFIRMED"],
      ];
      cells.forEach(([label, value], i) => {
        const cx = 260 + i * 280;
        ls("6px");
        x.fillStyle = "#7E8590";
        x.font = "400 20px 'Space Mono', monospace";
        x.fillText(label, cx, rowY);
        ls("2px");
        x.fillStyle = "#EDECE8";
        x.font = "700 24px 'Space Mono', monospace";
        x.fillText(value, cx, rowY + 42);
      });

      /* ——— footer ——— */
      ls("10px");
      x.fillStyle = "#BFD3DB";
      x.font = "700 32px 'Space Mono', monospace";
      x.fillText("FREEDOM TO FALL.", 540, 1752);
      ls("6px");
      x.fillStyle = "#7E8590";
      x.font = "400 22px 'Space Mono', monospace";
      x.fillText("WHITEFALL26.COM", 540, 1808);

      setCardUrl(c.toDataURL("image/png"));
      setCardOpen(true);
    } catch (e) { console.error("card build failed", e); }
    setCardBusy(false);
  };

  const shareCard = async () => {
    if (!cardUrl) return;
    try {
      const blob = await (await fetch(cardUrl)).blob();
      const file = new File([blob], "whitefall-member.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "WHITEFALL" });
        return;
      }
    } catch (e) { /* share unsupported or cancelled — fall through */ }
    downloadCard();
  };

  const downloadCard = () => {
    if (!cardUrl) return;
    let landed = false;
    try {
      const a = document.createElement("a");
      a.href = cardUrl; a.download = "whitefall-member.png";
      document.body.appendChild(a); a.click(); a.remove();
      landed = true;
    } catch (e) { /* download blocked */ }
    if (!landed) {
      try { window.open(cardUrl, "_blank"); } catch (e) { /* popups blocked too — the long-press hint covers it */ }
    }
  };
  // owner panel
  const [ownerOpen, setOwnerOpen] = useState(false);
  const [ownerUnlocked, setOwnerUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [list, setList] = useState([]);
  const [copied, setCopied] = useState(false);

  const [sessionRows, setSessionRows] = useState([]);
  const [storeMode, setStoreMode] = useState("checking");

  // Escape closes the top-most open overlay
  useEffect(() => {
    const onKey = (e) => {
      if (zoom && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        stepZoom(e.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (e.key !== "Escape") return;
      if (zoom) setZoom(null);
      else if (ownerOpen) setOwnerOpen(false);
      else if (cardOpen) setCardOpen(false);
      else if (privacyOpen) setPrivacyOpen(false);
      else if (popup && !popupDone) setPopupDone(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, ownerOpen, cardOpen, privacyOpen, popup, popupDone]);

  // photo viewer: freeze the page behind it, start on the first image
  useEffect(() => {
    if (!zoom) return;
    setZoomAt(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [zoom]);

  // closing the ask (not the thank-you) means "not now" — respect it for a week
  useEffect(() => {
    if (popupDone && !popupJoined) writeVisitor({ popupDismissedAt: Date.now() });
  }, [popupDone, popupJoined]);

  // the mobile join bar steps aside while the real form is on screen
  useEffect(() => {
    const w = document.getElementById("waitlist");
    if (!w || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setWaitlistInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(w);
    return () => io.disconnect();
  }, []);

  const mergeRow = (rows, row) => {
    const hit = rows.find((r) => r.email === row.email);
    if (hit) {
      return rows.map((r) => r.email === row.email
        ? { ...r, interests: [...new Set([...(r.interests || []), ...(row.interests || [])])] }
        : r);
    }
    return [...rows, row];
  };

  const LS_KEY = "whitefall-signups";
  const hasArtifactStore = () =>
    typeof window !== "undefined" && window.storage && typeof window.storage.set === "function";
  const lsRead = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (e) { return []; } };
  const lsWrite = (rows) => { try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); } catch (e) { /* blocked */ } };

  const saveSignup = async (addr, interests = []) => {
    const clean = addr.trim().toLowerCase();
    if (!clean.includes("@") || clean.includes(" ")) return false;
    setSaving(true);
    const row = { email: clean, interests, at: new Date().toISOString() };
    setSessionRows((rows) => mergeRow(rows, row));
    try {
      if (hasArtifactStore()) {
        const key = "signup:" + clean.replace(/[\s/\\'"]/g, "_");
        let prior = [];
        try {
          const existing = await window.storage.get(key, true);
          if (existing) prior = JSON.parse(existing.value).interests || [];
        } catch (e) { /* first signup */ }
        await window.storage.set(key, JSON.stringify({ ...row, interests: [...new Set([...prior, ...interests])] }), true);
        setStoreMode("live");
        setJoinedAt(new Date());
        writeVisitor({ joinedAt: new Date().toISOString() });
      } else {
        // Deployed: one call to our own endpoint, which delivers the signup.
        // Going through our own origin means ad blockers have no third-party
        // request to intercept and silently lose.
        setStoreMode("relay");
        try {
          const rs = await fetchT("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ email: clean, interests }),
          }, 12000);
          const rj = rs.ok ? await rs.json().catch(() => null) : null;
          setRelayFailed(!(rj && rj.stored));
          if (rj && !rj.stored) console.error("waitlist not delivered — no provider configured");
          // only remember the join once it truly landed, so a failed signup
          // shows the form again next visit instead of a false "you're in"
          if (rj && rj.stored) writeVisitor({ joinedAt: new Date().toISOString() });
        } catch (e) {
          console.error("signup endpoint unreachable", e);
          setRelayFailed(true);
        }
        setJoinedAt(new Date());
        lsWrite(mergeRow(lsRead(), row));
      }
    } catch (e) {
      console.error("signup save failed", e);
      setStoreMode(hasArtifactStore() ? "live" : "relay");
    }
    setSaving(false);
    return true;
  };

  const joinWaitlist = async () => {
    if (!email.includes("@")) return;
    const ok = await saveSignup(email);
    if (!ok) return; // rejected (e.g. spaces in the address) — don't pretend it worked
    setJoined(true);
    // thank-you popup with the founder number, no matter where they signed up
    setPopupJoined(true);
    setPopupDone(false);
    setPopup(true);
  };



  const loadList = async () => {
    let rows = [];
    try {
      if (hasArtifactStore()) {
        const res = await window.storage.list("signup:", true);
        const keys = (res && res.keys) || [];
        for (const k of keys) {
          try {
            const r = await window.storage.get(k, true);
            if (r) rows.push(JSON.parse(r.value));
          } catch (e) { /* skip */ }
        }
        setStoreMode("live");
      } else {
        rows = lsRead();
        setStoreMode("relay");
      }
    } catch (e) {
      console.error("list load failed", e);
      setStoreMode(hasArtifactStore() ? "live" : "relay");
    }
    for (const s of sessionRows) rows = mergeRow(rows, s);
    rows.sort((a, b) => (b.at || "").localeCompare(a.at || ""));
    setList(rows);
  };

  const OWNER_CODE = "0623";

  // Reliable in-page navigation (hash links are blocked in some sandboxed previews)
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  // footer help links: open that FAQ answer and bring it into view
  const openFaq = (id) => (e) => {
    const i = FAQS.findIndex((f) => f.id === id);
    if (i < 0) return;
    setOpen(i);
    go(`faq-${id}`)(e);
  };

  return (
    <div style={{ background: S.night, color: S.snow, fontFamily: "'Archivo', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>

      {/* ——— NAV ——— */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 22px", background: "rgba(5,7,13,.78)",
        backdropFilter: "blur(14px)", borderBottom: `1px solid ${S.line}`,
      }}>
        <a href="#top" onClick={go("top")} style={{ display: "flex", alignItems: "baseline", textDecoration: "none", color: S.snow }}>
          <img src={LOGO} alt="Whitefall" className="nav-solo" style={{ width: 32, height: 33, alignSelf: "center" }} />
          <span className="nav-word"><Wordmark size="15px" stroke="1px" spacing="0.14em" /></span>
        </a>
        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {[["FW26", "#fw26"], ...(SHOW_MANIFESTO ? [["Manifesto", "#manifesto"]] : []), ["Support", "#support"]].map(([t, h]) => (
            <a key={t} href={h} onClick={go(h.slice(1))}
              style={{ color: S.ash, textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = S.frost)}
              onMouseLeave={(e) => (e.currentTarget.style.color = S.ash)}
            >{t}</a>
          ))}
          <a href={IG} target="_blank" rel="noopener noreferrer"
            style={{ ...mono, border: `1px solid ${S.line}`, color: S.snow, padding: "8px 14px", fontSize: 11, letterSpacing: "0.08em", textDecoration: "none", transition: "all .25s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = S.snow; e.currentTarget.style.color = S.night; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = S.snow; }}
          ><span className="ig-full">@WHITEFALL26</span><span className="ig-short">IG ▲</span></a>
        </nav>
      </header>

      {/* ——— HERO: the signal over the city ——— */}
      <section id="top" className="hero" style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #03040A 0%, #060A14 45%, #0A1120 78%, #05070D 100%)" }}>
        {/* stars */}
        <div className="snowfall" style={{ position: "absolute", inset: 0, opacity: 0.7, pointerEvents: "none" }} aria-hidden />
        {/* moon glow */}
        <div ref={moonRef} style={{ position: "absolute", top: "-10%", right: "-8%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(191,211,219,.08), transparent 60%)", transform: "translateY(0px)", pointerEvents: "none" }} aria-hidden />

        {/* the logo — hanging in the midnight sky */}
        <div ref={heroRef} className="hero-wrap" style={{
          position: "absolute", left: "50%",
          transform: "translateX(-50%) translateY(0px)",
          textAlign: "center", pointerEvents: "none",
          willChange: "transform", // own layer: the parallax moves it without repainting the drawing
        }}>
          <HeroMark />
        </div>
        {/* soft glow pooling beneath the logo */}
        <div aria-hidden ref={poolRef} style={{ position: "absolute", left: "50%", top: "44vh", width: "70vw", height: "30vh", transform: "translate(-50%, 0) translateY(0px)", background: "radial-gradient(50% 50% at 50% 50%, rgba(191,211,219,.07), transparent 70%)", pointerEvents: "none" }} />

        {/* headline block */}
        <div className="hero-copy" style={{ position: "absolute", left: 0, right: 0, padding: "0 22px", textAlign: "center", zIndex: 2 }}>
          <p className="hero-in hd1" style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.28em", margin: "0 0 10px" }}>
            FALL / WINTER 2026
          </p>
          <h1 className="hero-in hd2" style={{ margin: 0, lineHeight: 1, textShadow: "0 0 55px rgba(191,211,219,.2)" }}>
            <Wordmark size="clamp(30px, 8.2vw, 124px)" stroke="2.5px" spacing="0.08em" glow />
          </h1>
          <p className="hero-in hd2 slogan" style={{ ...anton, color: S.frost, fontSize: "clamp(16px, 2.6vw, 30px)", letterSpacing: "0.34em", margin: "14px 0 0" }}>
            FREEDOM TO FALL.
          </p>
          <div className="hero-in hd3" style={{ marginTop: 22, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#waitlist" onClick={go("waitlist")} style={{ ...mono, background: S.snow, color: S.night, padding: "16px 32px", textDecoration: "none", fontSize: 13, letterSpacing: "0.1em", fontWeight: 700 }}>
              JOIN THE WAITLIST
            </a>
            <a href="#fw26" onClick={go("fw26")} style={{ ...mono, border: `1px solid ${S.line}`, color: S.snow, padding: "16px 32px", textDecoration: "none", fontSize: 13, letterSpacing: "0.1em", background: "rgba(5,7,13,.4)", backdropFilter: "blur(4px)" }}>
              PREVIEW FW26
            </a>
          </div>
        </div>
      </section>

      {/* ——— TICKER ——— */}
      <div style={{ overflow: "hidden", borderTop: `1px solid ${S.line}`, borderBottom: `1px solid ${S.line}`, padding: "13px 0", background: S.night }} aria-hidden>
        <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ ...mono, display: "flex", gap: 52, paddingRight: 52, fontSize: 12, letterSpacing: "0.2em", color: S.ash, whiteSpace: "nowrap" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>FW26 · COMING SOON <span style={{ color: S.frost }}>▲</span> FREEDOM TO FALL <span style={{ color: S.frost }}>▲</span> WHITEFALL — FW26</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ——— MANIFESTO (hidden — see SHOW_MANIFESTO) ——— */}
      {SHOW_MANIFESTO && (
      <section id="manifesto" style={{ padding: "9vw 22px", background: S.night, position: "relative", overflow: "hidden" }}>
        {/* giant watermark logo drifting on scroll */}
        <img src={LOGO} alt="" aria-hidden ref={markRef} style={{
          position: "absolute", right: "-14%", top: "50%", width: "56vw", opacity: 0.04,
          transform: "translateY(calc(-50% - 112px)) rotate(6deg)", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <p className="rv" style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.28em", margin: "0 0 6vw" }}>MANIFESTO</p>
          {[
            "COMFORT BURIES QUIETLY.",
            "ALL LOSS IS PSYCHOLOGICAL — UNTIL DEATH.",
            "FEAR POINTS AT EVERYTHING WORTH DOING.",
            "BETTER A FAILURE THAN A COWARD.",
          ].map((line) => (
            <h2 key={line} className="rv" style={{ ...anton, fontSize: "clamp(26px, 4.6vw, 62px)", lineHeight: 1.05, margin: "0 0 5vw", maxWidth: 980 }}>
              {line}
            </h2>
          ))}
          <h2 className="rv" style={{ ...anton, color: S.frost, fontSize: "clamp(28px, 5.2vw, 70px)", lineHeight: 1, letterSpacing: "0.05em", margin: 0, textShadow: "0 0 40px rgba(191,211,219,.2)" }}>
            FREEDOM TO FALL.
          </h2>
          <div className="stagger" style={{ display: "flex", gap: 44, marginTop: "7vw", flexWrap: "wrap" }}>
            {[["01", "LIMITED, NUMBERED RUNS"], ["02", "HEAVYWEIGHT, LUXURY FINISH"]].map(([n, l]) => (
              <div key={n} style={{ borderLeft: `2px solid ${S.frost}`, paddingLeft: 16 }}>
                <div style={{ ...anton, fontSize: 30, color: S.snow }}>{n}</div>
                <div style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.ash, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ——— FW26 COMING SOON ——— */}
      <section id="fw26" style={{ padding: "7vw 22px 6vw", background: S.steel, borderTop: `1px solid ${S.line}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="rv-l" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <h2 style={{ ...anton, fontSize: "clamp(40px,7vw,96px)", margin: 0, lineHeight: 1 }}>
              FW26
            </h2>
            <span style={{ ...mono, fontSize: 12, color: S.ash, letterSpacing: "0.18em" }}>FALL / WINTER 2026 · FOUR PIECES</span>
          </div>
          {/* drop countdown */}
          <div className="rv" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "22px 0 40px" }}>
            <Countdown />
          </div>

          <div className="stagger" style={{ borderTop: `1px solid ${S.line}` }}>
            {PIECES.filter((p) => p.dropping).map((p) => (p.shot ? (
              /* photographed piece \u2014 full feature treatment */
              <div key={p.n} className="piece-feature">
                <button type="button" className="shot-btn" aria-label={`View ${p.name} photo full screen`}
                  onClick={() => setZoom({ name: p.name, alt: p.alt, images: [p.webp ? p.shot.replace(/\.jpg$/, ".webp") : p.shot, ...(p.more || [])] })}>
                  {/* WebP (~75% lighter) for browsers that take it, the JPG for the rest */}
                  <picture>
                    {p.webp && <source type="image/webp"
                      srcSet={`${p.shot.replace(/\.jpg$/, "-480.webp")} 480w, ${p.shot.replace(/\.jpg$/, ".webp")} 880w`}
                      sizes="(max-width: 760px) min(440px, 100vw), 480px" />}
                    <img src={p.shot} alt={p.alt} className="piece-shot" width="880" height="1407" loading="lazy" decoding="async" />
                  </picture>
                  <span className="shot-hint" aria-hidden>
                    {(p.more || []).length ? `1 / ${1 + p.more.length}` : "+ ZOOM"}
                  </span>
                </button>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ ...mono, fontSize: 11, color: S.frost, letterSpacing: "0.16em" }}>{p.n}</span>
                  </div>
                  <h3 style={{ ...anton, fontSize: "clamp(26px, 4.2vw, 54px)", letterSpacing: "0.02em", margin: "0 0 14px", lineHeight: 1.05 }}>{p.name}</h3>
                  <p style={{ ...mono, fontSize: 11, color: S.ash, letterSpacing: "0.14em", lineHeight: 1.9, margin: "0 0 16px" }}>{p.colorway || p.cat}</p>
                  <PieceShop shopId={p.shop} fit={p.fit} onNotify={go("waitlist")} />
                  <ProductInfo details={p.details} />
                </div>
              </div>
            ) : (
              <div key={p.n} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "26px 0", borderBottom: `1px solid ${S.line}`, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
                  <span style={{ ...mono, fontSize: 11, color: S.frost, letterSpacing: "0.16em" }}>{p.n}</span>
                  <span style={{ ...anton, fontSize: "clamp(22px, 3.6vw, 46px)", letterSpacing: "0.02em" }}>{p.name}</span>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em" }}>{p.cat}</span>
                </div>
              </div>
            )))}
          </div>

          {/* the rest of the collection — teased, not yet revealed */}
          <div className="rv" style={{ marginTop: 54 }}>
            <p style={{ ...mono, color: S.frost, fontSize: 11, letterSpacing: "0.24em", margin: "0 0 14px" }}>NEXT UP</p>
            <div style={{ borderTop: `1px solid ${S.line}` }}>
              {PIECES.filter((p) => !p.dropping).map((p) => (
                <div key={p.n} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "18px 0", borderBottom: `1px solid ${S.line}`, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
                    <span style={{ ...mono, fontSize: 11, color: S.frost, letterSpacing: "0.16em" }}>{p.n}</span>
                    <span style={{ ...anton, fontSize: "clamp(18px, 2.2vw, 26px)", letterSpacing: "0.04em", color: S.ash }}>{p.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em" }}>{p.cat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— WAITLIST ——— */}
      <section id="waitlist" style={{ padding: "6vw 22px 7vw", background: S.night, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="snowfall" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} aria-hidden />
        <div className="rv-scale" style={{ position: "relative" }}>
          <img src={LOGO} alt="" aria-hidden className="signal" style={{ width: 90, margin: "0 auto 22px", display: "block" }} />
          <h2 style={{ ...anton, fontSize: "clamp(34px,6.5vw,88px)", margin: "0 0 16px" }}>JOIN THE LIST</h2>
          <div style={{ maxWidth: 340, margin: "0 auto 30px" }}>
            <SpecList center items={["SMALL RUNS", "DROP ALERTS BY EMAIL", "UPDATES ON @WHITEFALL26"]} />
          </div>
          {joined ? (
            <div>
              <div style={{ ...anton, fontSize: "clamp(40px, 8vw, 76px)", lineHeight: 1.05, color: S.snow, textShadow: "0 0 60px rgba(191,211,219,.35)", margin: "0 0 10px" }}>
                YOU'RE ON THE LIST
              </div>
              <p style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.2em", margin: "0 0 20px" }}>
                ▲ WE'LL EMAIL YOU WHEN IT DROPS
              </p>
              {relayFailed && (
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("FW26 waitlist signup")}&body=${encodeURIComponent("Add me to the FW26 waitlist: " + email.trim().toLowerCase())}`}
                  style={{ ...mono, display: "inline-block", border: "1px solid rgba(191,211,219,.4)", color: S.frost, padding: "10px 16px", fontSize: 10, letterSpacing: "0.14em", textDecoration: "none", margin: "0 0 18px" }}>
                  ONE LAST STEP — TAP TO CONFIRM YOUR SPOT BY EMAIL ▲
                </a>
              )}
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
                <button onClick={buildCard} disabled={cardBusy}
                  style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "14px 24px", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer" }}>
                  {cardBusy ? "BUILDING…" : "GET YOUR MEMBER CARD ▲"}
                </button>
                <button onClick={shareSite}
                  style={{ ...mono, background: "none", border: `1px solid ${S.line}`, color: S.snow, padding: "14px 24px", fontSize: 12, letterSpacing: "0.12em", cursor: "pointer" }}>
                  {shared ? "LINK SENT ▲" : "PUT A FRIEND ON"}
                </button>
              </div>
            </div>
          ) : (
            <div className="form-row" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <input
                type="email" value={email} placeholder="EMAIL ADDRESS"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinWaitlist()}
                aria-label="Email address"
                className="form-in"
                style={{ ...mono, background: "rgba(255,255,255,.03)", border: `1px solid ${S.line}`, borderRight: "none", color: S.snow, padding: "16px 18px", fontSize: 13, width: "min(320px, 62vw)", letterSpacing: "0.06em" }}
              />
              <button
                className="form-btn"
                onClick={joinWaitlist} disabled={saving}
                style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "16px 26px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}
              >
                {saving ? "SAVING…" : "JOIN ▲"}
              </button>
            </div>
          )}
          <p style={{ ...mono, fontSize: 9, color: S.ash, letterSpacing: "0.12em", marginTop: 16 }}>
            YOUR EMAIL IS SAVED TO THE WHITEFALL LIST SO WE CAN NOTIFY YOU ABOUT DROPS. NOTHING ELSE.
          </p>
        </div>
      </section>

      {/* ——— SUPPORT / CUSTOMER SERVICE ——— */}
      <section id="support" style={{ padding: "7vw 22px 8vw", background: S.steel, borderTop: `1px solid ${S.line}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p className="rv" style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.28em", margin: "0 0 14px" }}>SUPPORT — WE ANSWER FAST</p>
          <h2 className="rv" style={{ ...anton, fontSize: "clamp(28px,4vw,48px)", margin: "0 0 32px" }}>NEED SOMETHING?</h2>

          {/* two ways to reach a person — nothing to pick through */}
          <div className="rv" style={{ borderTop: `1px solid ${S.line}`, marginBottom: 48 }}>
            {[
              { label: "DM", value: "@WHITEFALL26", note: "FASTEST", href: IG, external: true },
              { label: "EMAIL", value: SUPPORT_EMAIL, note: "ORDERS & RETURNS · INCLUDE YOUR ORDER NUMBER", href: `mailto:${SUPPORT_EMAIL}` },
            ].map((c) => (
              <div key={c.label} className="contact-row">
                <span style={{ ...mono, fontSize: 10, letterSpacing: "0.22em", color: S.ash }}>{c.label}</span>
                <a href={c.href} className="contact-link" {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{c.value}</a>
                <span style={{ ...mono, fontSize: 10, letterSpacing: "0.16em", color: S.ash }}>{c.note}</span>
              </div>
            ))}
          </div>

          {/* FAQ accordion — open rules, same as the contact rows above */}
          <p className="rv" style={{ ...mono, fontSize: 10, letterSpacing: "0.22em", color: S.ash, margin: "0 0 12px" }}>FAQ</p>
          <div className="rv" style={{ borderTop: `1px solid ${S.line}` }}>
            {FAQS.map((f, i) => (
              <div key={f.id} id={`faq-${f.id}`} style={{ borderBottom: `1px solid ${S.line}`, scrollMarginTop: 80 }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", color: S.snow, cursor: "pointer",
                    padding: "20px 0", textAlign: "left", gap: 16,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.01em" }}>{f.q}</span>
                  <span style={{ ...mono, color: S.frost, fontSize: 16, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .3s ease", flexShrink: 0 }}>+</span>
                </button>
                <div style={{ maxHeight: open === i ? 600 : 0, overflow: "hidden", transition: "max-height .45s cubic-bezier(.16,.8,.24,1)" }}>
                  <p style={{ color: S.ash, fontSize: 15, lineHeight: 1.7, margin: 0, padding: "0 0 22px", maxWidth: 760 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer style={{ borderTop: `1px solid ${S.line}`, padding: "56px 22px 36px", background: S.night, position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 28, marginBottom: 44 }}>
            <div>
              <div><Wordmark size="20px" stroke="1.2px" spacing="0.14em" /></div>
              <div style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.16em", marginTop: 6 }}>FREEDOM TO FALL.</div>
            </div>
            {/* link columns — plain words, one job each */}
            <nav aria-label="Footer" className="foot-cols">
              {[
                ["SHOP", [
                  { t: "FW26", href: "#fw26", onClick: go("fw26") },
                  { t: "Waitlist", href: "#waitlist", onClick: go("waitlist") },
                ]],
                ["HELP", [
                  { t: "Shipping", href: "#faq-shipping", onClick: openFaq("shipping") },
                  { t: "Returns", href: "#faq-returns", onClick: openFaq("returns") },
                  { t: "Sizing", href: "#faq-sizing", onClick: openFaq("sizing") },
                  { t: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
                  { t: "Privacy", onClick: () => setPrivacyOpen(true) },
                ]],
                ["FOLLOW", [
                  { t: "Instagram", href: IG, external: true },
                ]],
              ].map(([head, links]) => (
                <div key={head}>
                  <div style={{ ...mono, fontSize: 10, color: S.frost, letterSpacing: "0.2em", marginBottom: 14 }}>{head}</div>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {links.map((l) => (
                      <li key={l.t}>
                        {l.href ? (
                          <a href={l.href} onClick={l.onClick} className="foot-link"
                            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{l.t}</a>
                        ) : (
                          <button type="button" onClick={l.onClick} className="foot-link">{l.t}</button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div style={{ borderTop: `1px solid ${S.line}`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em", display: "flex", flexWrap: "wrap", columnGap: 14, rowGap: 6 }}>
              {["© 2026 WHITEFALL", "US SHIPPING", "30-DAY RETURNS"].map((t) => <span key={t} style={{ whiteSpace: "nowrap" }}>{t}</span>)}
            </span>
            <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em" }}>
              <button onClick={() => { setOwnerOpen(true); if (ownerUnlocked) loadList(); }}
                aria-label="Owner login"
                style={{ ...mono, background: "none", border: "none", color: "rgba(126,133,144,.45)", fontSize: 10, letterSpacing: "0.14em", cursor: "pointer", padding: 0, marginLeft: 10 }}>
                OWNER
              </button>
            </span>
          </div>
        </div>
      </footer>

      {/* ——— STICKY MOBILE JOIN BAR ——— */}
      {!joined && !barDismissed && (
        <div className={"join-bar" + (waitlistInView ? " join-bar-away" : "")} aria-hidden={waitlistInView || undefined} style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 55,
          alignItems: "center", justifyContent: "space-between", gap: 10,
          background: "rgba(5,7,13,.92)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(191,211,219,.25)", padding: "12px 14px",
        }}>
          <span style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", color: S.ash, lineHeight: 1.4 }}>
            FW26 — DROP<br />ALERTS BY EMAIL
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={(e) => { go("waitlist")(e); }}
              style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "13px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
              JOIN ▲
            </button>
            <button onClick={() => { setBarDismissed(true); writeVisitor({ barDismissedAt: Date.now() }); }} aria-label="Dismiss"
              style={{ ...mono, background: "none", border: "none", color: S.ash, fontSize: 13, cursor: "pointer", padding: "6px" }}>✕</button>
          </div>
        </div>
      )}

      {/* ——— ENTRY POPUP — waitlist ask ——— */}
      {popup && !popupDone && (popupJoined || !joined) && (
        <div role="dialog" aria-modal="true" aria-label="Join the waitlist" style={{ position: "fixed", inset: 0, zIndex: 90 }}>
          <div onClick={() => setPopupDone(true)} style={{ position: "absolute", inset: 0, background: "rgba(3,4,10,.78)", backdropFilter: "blur(6px)" }} />
          <div className="pop-in" style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "min(480px, 92vw)", background: S.panel,
            border: "1px solid rgba(191,211,219,.35)", borderTop: `3px solid ${S.frost}`,
            padding: "34px 30px", textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,.6)",
          }}>
            <button onClick={() => setPopupDone(true)} aria-label="Close"
              style={{ ...mono, position: "absolute", top: 12, right: 14, background: "none", border: "none", color: S.ash, fontSize: 14, cursor: "pointer" }}>✕</button>
            <div style={{ marginBottom: 12 }}><Wordmark size="21px" stroke="1.2px" glow /></div>
            <p style={{ ...mono, color: S.frost, fontSize: 10, letterSpacing: "0.28em", margin: "0 0 10px" }}>FREEDOM TO FALL.</p>
            {popupJoined ? (
              <div>
                <h2 style={{ ...anton, fontSize: "clamp(22px, 4.6vw, 30px)", margin: "0 0 4px", lineHeight: 1.05 }}>THANK YOU.</h2>
                <div style={{ ...anton, fontSize: "clamp(34px, 8vw, 52px)", lineHeight: 1.05, color: S.snow, textShadow: "0 0 40px rgba(191,211,219,.35)", margin: "6px 0 6px" }}>
                  YOU'RE ON THE LIST
                </div>
                <p style={{ ...mono, fontSize: 10, color: S.frost, letterSpacing: "0.18em", margin: "0 0 14px" }}>
                  WE'LL EMAIL YOU WHEN IT DROPS ▲
                </p>
                {relayFailed && (
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("FW26 waitlist signup")}&body=${encodeURIComponent("Add me to the FW26 waitlist: " + email.trim().toLowerCase())}`}
                    style={{ ...mono, display: "inline-block", border: "1px solid rgba(191,211,219,.4)", color: S.frost, padding: "9px 14px", fontSize: 9, letterSpacing: "0.12em", textDecoration: "none", margin: "0 0 12px" }}>
                    ONE LAST STEP — TAP TO CONFIRM YOUR SPOT ▲
                  </a>
                )}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
                  <button onClick={buildCard} disabled={cardBusy}
                    style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "13px 18px", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                    {cardBusy ? "BUILDING…" : "GET YOUR MEMBER CARD ▲"}
                  </button>
                  <button onClick={() => setPopupDone(true)}
                    style={{ ...mono, background: "none", border: `1px solid ${S.line}`, color: S.snow, padding: "13px 18px", fontSize: 11, letterSpacing: "0.1em", cursor: "pointer" }}>
                    DONE
                  </button>
                </div>
              </div>
            ) : (
            <div>
            <h2 style={{ ...anton, fontSize: "clamp(26px, 5vw, 36px)", margin: "0 0 14px", lineHeight: 1.05 }}>JOIN THE LIST</h2>
            <div style={{ margin: "0 0 22px" }}>
              <SpecList center items={["SMALL RUNS", "DROP ALERTS BY EMAIL", "UPDATES ON @WHITEFALL26"]} />
            </div>
            <div className="form-row" style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <input
                type="email" value={email} placeholder="EMAIL ADDRESS" aria-label="Email address"
                className="form-in"
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") joinWaitlist(); }}
                style={{ ...mono, background: "rgba(255,255,255,.04)", border: `1px solid ${S.line}`, borderRight: "none", color: S.snow, padding: "15px 16px", fontSize: 13, width: "min(240px, 56vw)", letterSpacing: "0.06em" }}
              />
              <button
                className="form-btn"
                onClick={joinWaitlist}
                disabled={saving}
                style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "15px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                {saving ? "SAVING…" : "JOIN ▲"}
              </button>
            </div>
            <button onClick={() => setPopupDone(true)}
              style={{ ...mono, marginTop: 16, background: "none", border: "none", color: S.ash, fontSize: 10, letterSpacing: "0.16em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}>
              MAYBE LATER
            </button>
            </div>
            )}
          </div>
        </div>
      )}

      {/* ——— PHOTO VIEWER — full screen, swipe between angles ——— */}
      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={`${zoom.name} photos`}
          style={{ position: "fixed", inset: 0, zIndex: 97, background: S.night }}>
          <div className="zoom-strip" ref={stripRef}
            onScroll={(e) => setZoomAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {zoom.images.map((src, i) => (
              <div key={src} className="zoom-slide" onClick={(e) => { if (e.target === e.currentTarget) setZoom(null); }}>
                <img src={src} alt={i === 0 ? zoom.alt : `${zoom.name}, view ${i + 1}`} />
              </div>
            ))}
          </div>
          {zoom.images.length > 1 && [["‹", -1, { left: 8 }], ["›", 1, { right: 8 }]].map(([glyph, dir, side]) => (
            <button key={dir} onClick={() => stepZoom(dir)} aria-label={dir < 0 ? "Previous photo" : "Next photo"}
              style={{ ...mono, position: "absolute", top: "50%", transform: "translateY(-50%)", ...side, background: "rgba(5,7,13,.6)", border: `1px solid ${S.line}`, color: S.snow, fontSize: 22, width: 44, height: 44, cursor: "pointer" }}>
              {glyph}
            </button>
          ))}
          {zoom.images.length > 1 && (
            <div style={{ ...mono, position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontSize: 11, letterSpacing: "0.18em", color: S.ash, pointerEvents: "none" }}>
              {zoomAt + 1} / {zoom.images.length} · SWIPE
            </div>
          )}
          <button onClick={() => setZoom(null)} aria-label="Close" autoFocus
            style={{ ...mono, position: "absolute", top: 12, right: 12, background: "none", border: `1px solid ${S.line}`, color: S.snow, fontSize: 11, letterSpacing: "0.14em", padding: "10px 14px", cursor: "pointer" }}>
            CLOSE ✕
          </button>
        </div>
      )}

      {/* ——— MEMBER CARD MODAL ——— */}
      {cardOpen && cardUrl && (
        <div role="dialog" aria-label="Your member card" style={{ position: "fixed", inset: 0, zIndex: 96 }}>
          <div onClick={() => setCardOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.78)", backdropFilter: "blur(5px)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(380px, 90vw)", textAlign: "center" }}>
            <img src={cardUrl} alt="Your Whitefall member card" style={{ width: "100%", maxHeight: "68vh", objectFit: "contain", border: "1px solid rgba(191,211,219,.35)", display: "block", margin: "0 auto 14px" }} />
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={shareCard}
                style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "14px 22px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                SHARE / SAVE ▲
              </button>
              <button onClick={downloadCard}
                style={{ ...mono, background: "none", border: "1px solid rgba(237,236,232,.25)", color: S.snow, padding: "14px 22px", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer" }}>
                DOWNLOAD
              </button>
              <button onClick={() => setCardOpen(false)}
                style={{ ...mono, background: "none", border: "none", color: S.ash, fontSize: 12, letterSpacing: "0.1em", cursor: "pointer" }}>
                CLOSE
              </button>
            </div>
            <p style={{ ...mono, fontSize: 9, color: S.ash, letterSpacing: "0.14em", marginTop: 12 }}>TIP: YOU CAN ALSO PRESS AND HOLD THE CARD TO SAVE IT.</p>
          </div>
        </div>
      )}

      {/* ——— PRIVACY NOTE ——— */}
      {privacyOpen && (
        <div role="dialog" aria-label="Privacy" style={{ position: "fixed", inset: 0, zIndex: 95 }}>
          <div onClick={() => setPrivacyOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(520px, 92vw)", maxHeight: "80vh", overflowY: "auto", background: S.panel, border: `1px solid ${S.line}`, padding: "28px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ ...anton, fontSize: 18, letterSpacing: "0.08em" }}>PRIVACY, PLAINLY</span>
              <button onClick={() => setPrivacyOpen(false)} aria-label="Close" style={{ ...mono, background: "none", border: "none", color: S.ash, fontSize: 13, cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.75, margin: "0 0 14px" }}>
              When you join the waitlist we store your email address. That's the whole list.
            </p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.75, margin: "0 0 14px" }}>
              It's used for one thing: telling you about drops. It is never sold, rented, or shared with anyone else.
            </p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              Want off the list or your data deleted? Email <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Delete my data")}`} style={{ color: S.frost }}>{SUPPORT_EMAIL}</a> or DM <a href={IG} target="_blank" rel="noopener noreferrer" style={{ color: S.frost }}>@whitefall26</a> and it's done — no questions asked.
            </p>
          </div>
        </div>
      )}

      {/* ——— OWNER PANEL — waitlist export ——— */}
      {ownerOpen && (
        <div role="dialog" aria-label="Owner panel" style={{ position: "fixed", inset: 0, zIndex: 100 }}>
          <div onClick={() => setOwnerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "min(560px, 92vw)", maxHeight: "84vh", overflowY: "auto",
            background: S.panel, border: `1px solid rgba(191,211,219,.3)`, padding: "28px 26px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ ...anton, fontSize: 20, letterSpacing: "0.08em" }}>OWNER — WAITLIST</span>
              <button onClick={() => setOwnerOpen(false)} aria-label="Close owner panel"
                style={{ ...mono, background: "none", border: "none", color: S.ash, fontSize: 13, cursor: "pointer" }}>✕</button>
            </div>

            {!ownerUnlocked ? (
              <div>
                <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>Enter the owner passcode to view collected signups.</p>
                <div className="form-row" style={{ display: "flex" }}>
                  <input type="password" className="form-in" value={code} placeholder="PASSCODE" aria-label="Owner passcode"
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && code.trim().toUpperCase() === OWNER_CODE) { setOwnerUnlocked(true); loadList(); } }}
                    style={{ ...mono, flex: 1, background: "rgba(255,255,255,.03)", border: `1px solid ${S.line}`, borderRight: "none", color: S.snow, padding: "13px 14px", fontSize: 13, letterSpacing: "0.1em" }} />
                  <button
                    onClick={() => { if (code.trim().toUpperCase() === OWNER_CODE) { setOwnerUnlocked(true); loadList(); } }}
                    style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "13px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                    UNLOCK
                  </button>
                </div>
                {code && code.trim().toUpperCase() !== OWNER_CODE && (
                  <p style={{ ...mono, color: S.ash, fontSize: 10, letterSpacing: "0.12em", marginTop: 10 }}>KEEP TYPING — THAT'S NOT IT YET.</p>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                  <span style={{ ...mono, fontSize: 12, color: S.frost, letterSpacing: "0.14em" }}>
                    {list.length} SIGNUP{list.length === 1 ? "" : "S"} COLLECTED
                    <span style={{ display: "block", fontSize: 9, color: storeMode === "live" ? S.frost : S.ash, marginTop: 6, letterSpacing: "0.12em" }}>
                      {storeMode === "live"
                        ? "● LIVE STORAGE — COLLECTING FROM ALL VISITORS"
                        : storeMode === "relay"
                        ? "● DEPLOYED — EVERY SIGNUP EMAILS YOUR INBOX INSTANTLY. THIS LIST SHOWS THIS DEVICE."
                        : "○ PREVIEW MODE — SHOWING THIS SESSION ONLY."}
                    </span>
                  </span>
                  <button onClick={loadList} style={{ ...mono, background: "none", border: `1px solid ${S.line}`, color: S.snow, padding: "8px 14px", fontSize: 10, letterSpacing: "0.12em", cursor: "pointer" }}>
                    ↻ REFRESH
                  </button>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Whitefall waitlist export — " + list.length + " signups")}&body=${encodeURIComponent(list.map((r) => r.email + (r.interests && r.interests.length ? "  [wants: " + r.interests.join(", ") + "]" : "") + "  (" + (r.at || "").slice(0, 10) + ")").join("\n") || "No signups yet.")}`}
                    style={{ ...mono, background: S.snow, color: S.night, padding: "12px 18px", textDecoration: "none", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
                    EMAIL LIST TO ME ▲
                  </a>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(list.map((r) => r.email).join("\n"));
                        setCopied(true); setTimeout(() => setCopied(false), 1500);
                      } catch (e) { console.error("copy failed", e); }
                    }}
                    style={{ ...mono, background: "none", border: `1px solid ${S.line}`, color: S.snow, padding: "12px 18px", fontSize: 11, letterSpacing: "0.1em", cursor: "pointer" }}>
                    {copied ? "COPIED ▲" : "COPY EMAILS"}
                  </button>
                </div>

                {list.length === 0 ? (
                  <p style={{ ...mono, color: S.ash, fontSize: 11, letterSpacing: "0.12em" }}>NO SIGNUPS YET — SHARE THE SITE AND THEY'LL SHOW UP HERE.</p>
                ) : (
                  <div style={{ border: `1px solid ${S.line}`, borderBottom: "none" }}>
                    {list.map((r, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "11px 12px", borderBottom: `1px solid ${S.line}`, flexWrap: "wrap" }}>
                        <span style={{ ...mono, fontSize: 12 }}>{r.email}</span>
                        <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.08em" }}>
                          {(r.interests && r.interests.length ? r.interests.join(" · ") + "  " : "")}{(r.at || "").slice(0, 10)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ ...mono, fontSize: 9, color: S.ash, letterSpacing: "0.1em", marginTop: 14, lineHeight: 1.7 }}>
                  {hasArtifactStore()
                    ? 'SIGNUPS FROM EVERY VISITOR SAVE HERE AUTOMATICALLY. "EMAIL LIST TO ME" OPENS A PRE-FILLED EMAIL WITH THE FULL LIST.'
                    : "YOUR INBOX IS THE MASTER LIST ON THE LIVE SITE — EVERY SIGNUP ARRIVES THE MOMENT IT HAPPENS."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
