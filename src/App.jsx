import { useState, useEffect, useRef } from "react";

/* ————————————————————————————————————————————————
   WHITEFALL (concept) — FW26 · midnight city
   The logo hangs in the midnight sky.
   Palette: Midnight #05070D · Steel #0C111C · Snow #EDECE8
            Frost #BFD3DB · Ash #7E8590
   Type:    Anton (display) · Archivo (body) · Space Mono (utility)
———————————————————————————————————————————————— */

const LOGO = "/logo.png";

const LOGO_GLYPH = "/logo-glyph.png";

/* FW26 lineup. The piece with `dropping: true` renders as THE DROP — full
   photo feature with the live shop states. The rest sit in NEXT UP as
   compact rows until their first look is ready. */
const PIECES = [
  {
    n: "01",
    name: "WHITEFALL CREWNECK",
    cat: "CONTRAST PIPING · 320 GSM · 80% COTTON / 20% POLYESTER",
    fit: "RUNS TAILORED",
    shot: "/fw26-01-crewneck.jpg",
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

/* The logo standing in as the letter A inside the wordmark */
const MarkA = ({ h = "0.78em", glow = false }) => (
  <img src={LOGO_GLYPH} alt="A" style={{
    height: h, width: "auto", display: "inline-block",
    verticalAlign: "baseline", margin: "0 0.05em",
    filter: glow ? "drop-shadow(0 0 22px rgba(191,211,219,.55))" : "none",
  }} />
);

/* Hollow, broadened wordmark — outlined letterforms matching the logo's line art */
const Wordmark = ({ size, stroke, glow = false, spacing = "0.1em" }) => (
  <span style={{
    fontFamily: "'Syncopate', sans-serif", fontWeight: 700,
    fontSize: size, letterSpacing: spacing, whiteSpace: "nowrap",
    color: "transparent", WebkitTextStroke: `${stroke} #EDECE8`,
  }}>
    WHITEF<MarkA h="0.74em" glow={glow} />LL
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
/* featured piece — photo beside the details, stacked on narrow screens */
.piece-feature {
  display: grid; grid-template-columns: minmax(0, 360px) 1fr;
  gap: 36px; align-items: center; padding: 34px 0;
}
.piece-shot {
  width: 100%; height: auto; display: block;
  border: 1px solid rgba(237,236,232,.12); background: #0E131E;
}
@media (max-width: 760px) {
  .piece-feature { grid-template-columns: 1fr; gap: 20px; padding: 26px 0; }
  .piece-shot { max-width: 440px; margin: 0 auto; }
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
  .hero-mark { width: 40vw !important; }
  .slogan { letter-spacing: 0.2em !important; }
}
@media (min-width: 641px) { .ig-short { display: none; } }
.join-bar { display: none; }
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

/* —— fetch with a deadline, so a stalled network call can never leave the
      signup button stuck on "SAVING…" —— */
const fetchT = (url, opts = {}, ms = 10000) => {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { ...opts, signal: ctl.signal }).finally(() => clearTimeout(t));
};

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
        <div style={{ ...anton, fontSize: "clamp(26px, 4.4vw, 40px)", color: S.snow, letterSpacing: "0.04em", lineHeight: 1.1 }}>
          DATE TO BE ANNOUNCED
        </div>
        <div style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginTop: 8 }}>
          THE LIST HEARS FIRST ▲
        </div>
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
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 18 }}>
        {fit && <span style={{ ...chip, color: S.frost, border: "1px solid rgba(191,211,219,.4)" }}>{fit}</span>}
        <span style={{ ...chip, color: S.snow, border: `1px solid ${S.line}` }}>S – XXL</span>
        {cfg.soldOut && <span style={{ ...chip, fontWeight: 700, color: S.night, background: S.snow }}>SOLD OUT</span>}
      </div>
      {cfg.soldOut ? (
        <button onClick={onNotify}
          style={{ ...mono, background: "none", border: "1px solid rgba(191,211,219,.4)", color: S.frost, padding: "15px 26px", fontSize: 12, letterSpacing: "0.1em", cursor: "pointer" }}>
          JOIN THE LIST — RESTOCKS HEARD HERE FIRST ▲
        </button>
      ) : buyable ? (
        <a href={cfg.checkoutUrl} target="_blank" rel="noopener noreferrer"
          style={{ ...mono, display: "inline-block", background: S.snow, color: S.night, padding: "16px 34px", textDecoration: "none", fontSize: 14, fontWeight: 700, letterSpacing: "0.1em" }}>
          BUY NOW ▲
        </a>
      ) : (
        <button onClick={onNotify}
          style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "16px 28px", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
          GET NOTIFIED — THE LIST SHOPS FIRST ▲
        </button>
      )}
      {!live && !cfg.soldOut && (
        <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.16em", margin: "14px 0 0" }}>
          {dropDay ? `DROPS ${dropDay} · ` : "DATE ANNOUNCED TO THE LIST FIRST · "}
          WAITLIST GETS EARLY ACCESS
        </p>
      )}
    </div>
  );
}


const FAQS = [
  { q: "When does FW26 drop?", a: "The date isn't public yet. The waitlist gets it first — the exact date and time, plus access one hour before anyone else. Join below; it's free and it's the only way to know before it happens." },
  { q: "Where's my order?", a: "Every order gets a tracking link by email within 24 hours of shipping. Can't find it? Email us your order number, or DM us on Instagram — we respond within one business day." },
  { q: "What's your return policy?", a: "30 days, no questions. Unworn, tags on, full refund to your original payment method. Email us your order number and we'll send you return instructions." },
  { q: "How does sizing run?", a: "It varies piece to piece — some are cut boxy and oversized, others tailored and slim. Always read the description on the specific product you're interested in: every piece lists its own fit notes and exact garment measurements there." },
  { q: "Will pieces restock?", a: "Rarely, and never guaranteed. Runs are small and numbered by design — when a piece sells out, don't count on seeing it again. If a restock ever happens, the waitlist hears first." },
  { q: "Where do you ship?", a: "The United States for now. International is on the list — join the waitlist and you'll hear the moment it opens up." },
];

/* Brand support inbox — published on the site on purpose. Keep this a brand
   address, never a personal one. Waitlist delivery does NOT depend on it (see
   api/signup.js); this is purely the customer-facing contact route. */
const SUPPORT_EMAIL = "whitefall26@gmail.com";

/* One source of truth for a topic's pre-filled email: the same "what to
   include" list drives both the on-page checklist and the email body. */
const topicMailto = (t) => {
  const lines = ["Hi Whitefall,", "", t.label + ".", ""];
  for (const f of t.include) lines.push(f + ":");
  lines.push("", "Thanks!");
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Whitefall — " + t.label)}&body=${encodeURIComponent(lines.join("\n"))}`;
};

/* Signups POST to this site's own /api/signup endpoint, which assigns the
   and delivers the signup. Nothing about the delivery provider
   lives in the browser — see api/signup.js and the README runbook. */

const TOPICS = [
  {
    id: "order", n: "01", label: "I can't find my order",
    help: "No stress — it happens. Check your inbox (and spam) for a confirmation from us first. Still nothing? DM us and we'll track it down.",
    include: ["Name on the order", "Email used at checkout", "Order number (if you have it)"],
  },
  {
    id: "shipping", n: "02", label: "Where's my package?",
    help: "Tracking links go out within 24 hours of shipping. If yours hasn't moved in 3+ days, DM us and we'll chase the carrier for you.",
    include: ["Order number", "Tracking number (if you have it)"],
  },
  {
    id: "size", n: "03", label: "Wrong size / exchange",
    help: "Free size exchanges within 30 days — unworn, tags on. DM us and we'll set the swap up.",
    include: ["Order number", "Which piece", "Current size", "Size you need"],
  },
  {
    id: "return", n: "04", label: "Return & refund",
    help: "30 days, no questions asked. DM us your order number and we'll send a return label — refund lands back on your original payment method once it's scanned in.",
    include: ["Order number", "Piece(s) you're returning"],
  },
  {
    id: "drop", n: "05", label: "FW26 / waitlist question",
    help: "Drop details go to the waitlist first — join it below if you haven't. Anything else about FW26, ask away.",
    include: [],
  },
  {
    id: "other", n: "06", label: "Something else",
    help: "Collabs, wholesale, press, or anything that doesn't fit a box — DM us and a real person will get back to you within one business day.",
    include: [],
  },
];

export default function App() {
  useReveal();
  const moonRef = useParallax((y) => `translateY(${y * 0.06}px)`);
  const heroRef = useParallax((y) => `translateX(-50%) translateY(${y * 0.22}px)`);
  const poolRef = useParallax((y) => `translate(-50%, 0) translateY(${y * 0.16}px)`);
  const markRef = useParallax((y) => `translateY(calc(-50% + ${(y - 1400) * 0.08}px)) rotate(6deg)`);
  useEffect(() => {
    const t = setTimeout(() => setPopup(true), 1600);
    return () => clearTimeout(t);
  }, []);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [open, setOpen] = useState(null);
  const [topic, setTopic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupDone, setPopupDone] = useState(false);
  const [popupJoined, setPopupJoined] = useState(false);
  const [relayFailed, setRelayFailed] = useState(false);
  const [shared, setShared] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [joinedAt, setJoinedAt] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardUrl, setCardUrl] = useState(null);
  const [cardBusy, setCardBusy] = useState(false);
  /* The join date replaces the old member number: it is the one personal,
     "I was early" detail that needs no shared counter and can never fail. */
  const joinedLabel = (joinedAt || new Date())
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();

  const shareSite = async () => {
    const data = { title: "WHITEFALL", text: "FW26 is coming. The list shops first. FREEDOM TO FALL.", url: typeof location !== "undefined" ? location.href : "" };
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
      x.fillText("FW26  ·  THE LIST SHOPS FIRST", 540, 268);
      x.strokeStyle = "rgba(237,236,232,.16)"; x.lineWidth = 1;
      x.beginPath(); x.moveTo(150, 320); x.lineTo(930, 320); x.stroke();

      /* ——— status line ——— */
      ls("12px");
      x.fillStyle = "#BFD3DB";
      x.font = "700 34px 'Space Mono', monospace";
      x.fillText("EARLY ACCESS GRANTED", 540, 560);

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
      x.fillText("THE LIST SHOPS ONE HOUR EARLY", 540, 1010);

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
        ["ACCESS", "EARLY"],
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
      if (e.key !== "Escape") return;
      if (ownerOpen) setOwnerOpen(false);
      else if (cardOpen) setCardOpen(false);
      else if (privacyOpen) setPrivacyOpen(false);
      else if (popup && !popupDone) setPopupDone(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ownerOpen, cardOpen, privacyOpen, popup, popupDone]);

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
          {[["FW26", "#fw26"], ["Manifesto", "#manifesto"], ["Support", "#support"]].map(([t, h]) => (
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
        }}>
          <img src={LOGO} alt="" aria-hidden className="signal hero-in hero-mark"
            style={{ width: "min(52vw, 400px)", height: "auto" }} />
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
          <p className="hero-in hd3" style={{ ...mono, color: S.ash, fontSize: 10, letterSpacing: "0.2em", margin: "18px 0 0" }}>
            THE LIST GETS <span style={{ color: S.frost }}>A ONE HOUR HEAD START</span> — AND THE DROP DATE FIRST
          </p>
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

      {/* ——— MANIFESTO ——— */}
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

      {/* ——— FW26 COMING SOON ——— */}
      <section id="fw26" style={{ padding: "7vw 22px 6vw", background: S.steel, borderTop: `1px solid ${S.line}` }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="rv-l" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
            <h2 style={{ ...anton, fontSize: "clamp(40px,7vw,96px)", margin: 0, lineHeight: 1 }}>
              FW26
            </h2>
            <span style={{ ...mono, fontSize: 12, color: S.ash, letterSpacing: "0.18em" }}>FALL / WINTER 2026 · FOUR PIECES</span>
          </div>
          <p className="rv" style={{ color: S.ash, maxWidth: 560, lineHeight: 1.7, margin: "0 0 28px" }}>
            The Whitefall Crewneck leads the collection. Previews and first looks drop on{" "}
            <a href={IG} target="_blank" rel="noopener noreferrer" style={{ color: S.frost, textDecoration: "none", borderBottom: `1px solid rgba(191,211,219,.4)` }}>@whitefall26</a>
            {" "}— the waitlist gets the date first, and shops first.
          </p>

          {/* drop countdown */}
          <div className="rv" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "0 0 44px" }}>
            <Countdown />
          </div>

          <div className="stagger" style={{ borderTop: `1px solid ${S.line}` }}>
            {PIECES.filter((p) => p.dropping).map((p) => (p.shot ? (
              /* photographed piece \u2014 full feature treatment */
              <div key={p.n} className="piece-feature" style={{ borderBottom: `1px solid ${S.line}` }}>
                <img src={p.shot} alt={p.alt} className="piece-shot" width="880" height="1407" loading="lazy" decoding="async" />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ ...mono, fontSize: 11, color: S.frost, letterSpacing: "0.16em" }}>{p.n}</span>
                  </div>
                  <h3 style={{ ...anton, fontSize: "clamp(26px, 4.2vw, 54px)", letterSpacing: "0.02em", margin: "0 0 14px", lineHeight: 1.05 }}>{p.name}</h3>
                  <p style={{ ...mono, fontSize: 11, color: S.ash, letterSpacing: "0.14em", lineHeight: 1.9, margin: "0 0 16px" }}>{p.cat}</p>
                  <PieceShop shopId={p.shop} fit={p.fit} onNotify={go("waitlist")} />
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
                  <span style={{ ...mono, fontSize: 10, color: S.snow, letterSpacing: "0.14em", border: `1px solid ${S.line}`, padding: "6px 10px" }}>COMING SOON</span>
                </div>
              </div>
            )))}
          </div>

          {/* the rest of the collection — teased, not yet revealed */}
          <div className="rv" style={{ marginTop: 54 }}>
            <p style={{ ...mono, color: S.frost, fontSize: 11, letterSpacing: "0.24em", margin: "0 0 6px" }}>NEXT UP</p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 520 }}>
              Three more pieces complete FW26. First looks land on the waitlist and{" "}
              <a href={IG} target="_blank" rel="noopener noreferrer" style={{ color: S.frost, textDecoration: "none" }}>@whitefall26</a>
              {" "}as each one is ready.
            </p>
            <div style={{ borderTop: `1px solid ${S.line}` }}>
              {PIECES.filter((p) => !p.dropping).map((p) => (
                <div key={p.n} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "26px 0", borderBottom: `1px solid ${S.line}`, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
                    <span style={{ ...mono, fontSize: 11, color: S.frost, letterSpacing: "0.16em" }}>{p.n}</span>
                    <span style={{ ...anton, fontSize: "clamp(22px, 3.6vw, 46px)", letterSpacing: "0.02em" }}>{p.name}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
                    <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em" }}>{p.cat}</span>
                    <span style={{ ...mono, fontSize: 10, color: S.snow, letterSpacing: "0.14em", border: `1px solid ${S.line}`, padding: "6px 10px" }}>COMING SOON</span>
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
          <h2 style={{ ...anton, fontSize: "clamp(34px,6.5vw,88px)", margin: "0 0 16px" }}>THE LIST SHOPS FIRST</h2>
          <p style={{ color: S.ash, maxWidth: 480, margin: "0 auto 30px", lineHeight: 1.7 }}>
            Runs are small and numbered by design. The list gets the drop date before
            anyone else, and shops an hour early.
          </p>
          {joined ? (
            <div>
              <div style={{ ...anton, fontSize: "clamp(40px, 8vw, 76px)", lineHeight: 1.05, color: S.snow, textShadow: "0 0 60px rgba(191,211,219,.35)", margin: "0 0 10px" }}>
                YOU'RE ON THE LIST
              </div>
              <p style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.2em", margin: "0 0 20px" }}>
                ▲ EARLY ACCESS CONFIRMED — WATCH YOUR INBOX
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
          <h2 className="rv" style={{ ...anton, fontSize: "clamp(34px,6vw,80px)", margin: "0 0 40px" }}>NEED SOMETHING?</h2>

          {/* three fast lanes */}
          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 56 }}>
            <a href={IG} target="_blank" rel="noopener noreferrer" style={{ background: S.panel, border: `1px solid ${S.line}`, padding: "26px 22px", textDecoration: "none", color: S.snow, transition: "border-color .3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(191,211,219,.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.line)}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginBottom: 12 }}>FASTEST — DM US</div>
              <div style={{ ...anton, fontSize: 22, marginBottom: 8 }}>@WHITEFALL26</div>
              <div style={{ color: S.ash, fontSize: 14, lineHeight: 1.6 }}>DM on Instagram for orders, sizing, and drop questions. Typical reply: under a few hours.</div>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ background: S.panel, border: `1px solid ${S.line}`, padding: "26px 22px", textDecoration: "none", color: S.snow, transition: "border-color .3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(191,211,219,.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.line)}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginBottom: 12 }}>ORDERS &amp; RETURNS</div>
              <div style={{ ...anton, fontSize: 22, marginBottom: 8 }}>EMAIL SUPPORT</div>
              <div style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.04em", marginBottom: 8, wordBreak: "break-all" }}>{SUPPORT_EMAIL}</div>
              <div style={{ color: S.ash, fontSize: 14, lineHeight: 1.6 }}>Include your order number. Replies within one business day.</div>
            </a>
            <a href="#fw26" onClick={go("fw26")} style={{ background: S.panel, border: `1px solid ${S.line}`, padding: "26px 22px", textDecoration: "none", color: S.snow, transition: "border-color .3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(191,211,219,.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.line)}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginBottom: 12 }}>SIZE & FIT</div>
              <div style={{ ...anton, fontSize: 22, marginBottom: 8 }}>FIT GUIDE</div>
              <div style={{ color: S.ash, fontSize: 14, lineHeight: 1.6 }}>Every piece is cut differently — boxy, tailored, oversized. Check the description on the product you want: each one lists its own fit and exact measurements.</div>
            </a>
          </div>

          {/* pick your problem — guided contact */}
          <div className="rv" style={{ marginBottom: 48 }}>
            <p style={{ ...mono, color: S.frost, fontSize: 11, letterSpacing: "0.22em", margin: "0 0 18px" }}>WHAT'S GOING ON? PICK ONE — WE'LL POINT YOU RIGHT.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {TOPICS.map((t) => (
                <button key={t.id} onClick={() => setTopic(topic === t.id ? null : t.id)}
                  aria-expanded={topic === t.id}
                  style={{
                    background: topic === t.id ? S.snow : S.panel,
                    color: topic === t.id ? S.night : S.snow,
                    border: `1px solid ${topic === t.id ? S.snow : S.line}`,
                    padding: "18px 16px", cursor: "pointer", textAlign: "left",
                    fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 600,
                    letterSpacing: "0.01em", transition: "all .25s ease",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                  onMouseEnter={(e) => { if (topic !== t.id) e.currentTarget.style.borderColor = "rgba(191,211,219,.5)"; }}
                  onMouseLeave={(e) => { if (topic !== t.id) e.currentTarget.style.borderColor = S.line; }}
                >
                  <span aria-hidden style={{ ...mono, fontSize: 10, color: topic === t.id ? S.night : S.frost, letterSpacing: "0.1em" }}>{t.n}</span> {t.label}
                </button>
              ))}
            </div>
            {TOPICS.filter((t) => t.id === topic).map((t) => (
              <div key={t.id} style={{ border: `1px solid rgba(191,211,219,.35)`, borderTop: `2px solid ${S.frost}`, background: S.panel, padding: "26px 24px", marginTop: 12 }}>
                <h3 style={{ ...anton, fontSize: 20, margin: "0 0 10px", letterSpacing: "0.04em" }}>{t.label.toUpperCase()}</h3>
                <p style={{ color: S.ash, fontSize: 15, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 680 }}>{t.help}</p>
                {t.include.length > 0 && (
                  <div style={{ margin: "0 0 20px" }}>
                    <p style={{ ...mono, fontSize: 10, color: S.frost, letterSpacing: "0.18em", margin: "0 0 10px" }}>WHAT WE'LL NEED:</p>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                      {t.include.map((item) => (
                        <li key={item} style={{ color: S.ash, fontSize: 14, lineHeight: 1.5, display: "flex", gap: 10 }}>
                          <span aria-hidden style={{ color: S.frost }}>▲</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a href={topicMailto(t)}
                    style={{ ...mono, background: S.snow, color: S.night, padding: "14px 24px", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", fontWeight: 700 }}>
                    EMAIL US — PRE-FILLED ▲
                  </a>
                  <a href={IG} target="_blank" rel="noopener noreferrer"
                    style={{ ...mono, border: `1px solid ${S.line}`, color: S.snow, padding: "14px 24px", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>
                    OR DM @WHITEFALL26
                  </a>
                </div>
                <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.12em", margin: "16px 0 0" }}>
                  THE EMAIL OPENS WITH THE SUBJECT AND DETAILS ALREADY LAID OUT — JUST FILL THEM IN AND SEND.
                </p>
              </div>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="rv" style={{ border: `1px solid ${S.line}`, borderBottom: "none" }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${S.line}`, background: open === i ? S.panel : "transparent", transition: "background .3s ease" }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", color: S.snow, cursor: "pointer",
                    padding: "20px 22px", textAlign: "left", gap: 16,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "0.01em" }}>{f.q}</span>
                  <span style={{ ...mono, color: S.frost, fontSize: 16, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .3s ease", flexShrink: 0 }}>+</span>
                </button>
                <div style={{ maxHeight: open === i ? 600 : 0, overflow: "hidden", transition: "max-height .45s cubic-bezier(.16,.8,.24,1)" }}>
                  <p style={{ color: S.ash, fontSize: 15, lineHeight: 1.7, margin: 0, padding: "0 22px 22px", maxWidth: 760 }}>{f.a}</p>
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
            <div style={{ display: "flex", gap: 26, flexWrap: "wrap" }}>
              {[["Instagram", IG], ["Support", "#support"], ["FW26", "#fw26"], ["Waitlist", "#waitlist"]].map(([t, h]) => (
                <a key={t} href={h} onClick={h.startsWith("#") ? go(h.slice(1)) : undefined} target={h.startsWith("http") ? "_blank" : undefined} rel={h.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ ...mono, color: S.ash, fontSize: 11, letterSpacing: "0.14em", textDecoration: "none", textTransform: "uppercase" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = S.frost)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = S.ash)}
                >{t}</a>
              ))}
              <button onClick={() => setPrivacyOpen(true)}
                style={{ ...mono, background: "none", border: "none", color: S.ash, fontSize: 11, letterSpacing: "0.14em", cursor: "pointer", textTransform: "uppercase", padding: 0 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = S.frost)}
                onMouseLeave={(e) => (e.currentTarget.style.color = S.ash)}
              >Privacy</button>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${S.line}`, paddingTop: 22, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em" }}>© 2026 WHITEFALL. ALL RIGHTS RESERVED.</span>
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
        <div className="join-bar" style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 55,
          alignItems: "center", justifyContent: "space-between", gap: 10,
          background: "rgba(5,7,13,.92)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(191,211,219,.25)", padding: "12px 14px",
        }}>
          <span style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", color: S.ash, lineHeight: 1.4 }}>
            FW26 — THE LIST<br />SHOPS FIRST
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={(e) => { go("waitlist")(e); }}
              style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "13px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
              JOIN ▲
            </button>
            <button onClick={() => setBarDismissed(true)} aria-label="Dismiss"
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
                  EARLY ACCESS CONFIRMED ▲
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
            <h2 style={{ ...anton, fontSize: "clamp(26px, 5vw, 36px)", margin: "0 0 8px", lineHeight: 1.05 }}>THE LIST SHOPS FIRST</h2>
            <p style={{ ...mono, color: S.frost, fontSize: 10, letterSpacing: "0.18em", margin: "0 0 12px" }}>ONE HOUR BEFORE ANYONE ELSE.</p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.65, margin: "0 0 22px" }}>
              Runs are small and numbered by design. The list gets the drop date first
              and shops an hour early.
            </p>
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
