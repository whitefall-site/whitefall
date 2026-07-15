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
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600&family=Space+Mono:wght@400;700&family=Syncopate:wght@700&display=swap');
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
.tease { transition: transform .5s cubic-bezier(.16,.8,.24,1), border-color .4s ease; }
.tease:hover { transform: translateY(-8px); border-color: rgba(191,211,219,.5) !important; }
.tease:hover .tease-logo { opacity: .3; transform: scale(1.08) rotate(-2deg); }
.tease-logo { transition: opacity .5s ease, transform .7s cubic-bezier(.16,.8,.24,1); }
a:focus-visible, button:focus-visible, input:focus-visible { outline: 2px solid #BFD3DB; outline-offset: 3px; }
::selection { background: #BFD3DB; color: #05070D; }

/* ——— phone-first tuning ——— */
.nav-solo { display: none; }
@media (max-width: 640px) {
  .nav-word { display: none; }
  .nav-solo { display: inline-block !important; }
  .nav-links { gap: 14px !important; }
  .ig-full { display: none; }
  .hero-wrap { top: 11vh !important; }
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

/* —— parallax hook: returns scrollY —— */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { setY(window.scrollY); raf = null; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return y;
}


const FAQS = [
  { q: "When does FW26 drop?", a: "October 2026. Waitlist members get the exact date, time, and early access 24 hours before anyone else. Join below — it's free and it's the only way in early." },
  { q: "Where's my order?", a: "Every order gets a tracking link by email within 24 hours of shipping. Can't find it? DM us your order number on Instagram or email support — we respond within one business day." },
  { q: "What's your return policy?", a: "30 days, no questions. Unworn, tags on, full refund to your original payment method. Start a return by emailing us your order number — we send the label, you drop it off." },
  { q: "How does sizing run?", a: "It varies piece to piece — some are cut boxy and oversized, others tailored and slim. Always read the description on the specific product you're interested in: every piece lists its own fit notes and exact garment measurements there." },
  { q: "Will pieces restock?", a: "Rarely, and never guaranteed. Runs are small and numbered by design — when a piece sells out, don't count on seeing it again. If a restock ever happens, the waitlist hears first." },
  { q: "Do you ship worldwide?", a: "Yes. Duties are calculated at checkout so there are no surprise fees at your door." },
];

const SUPPORT_EMAIL = "kohenthrasher@gmail.com";

/* ——— SUPABASE (recommended): with these two env vars set, every signup from
   every visitor lands in one shared database and the owner panel shows the
   full live list from any device. Setup: README + supabase-setup.sql.
   Without them the site falls back to email relay + this-device storage. ——— */
const SB_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const hasSupabase = () => Boolean(SB_URL && SB_KEY);
const sbRpc = async (fn, args) => {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`${fn} failed: ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
};

const TOPICS = [
  {
    id: "order", n: "01", label: "I can't find my order",
    help: "No stress — it happens. Check your inbox (and spam) for a confirmation from us first. Still nothing? Send us your full name and the email you ordered with, and we'll track it down.",
    subject: "Order help — I can't find my order",
    body: "Hi Whitefall,%0D%0A%0D%0AI can't find my order.%0D%0A%0D%0AName on the order:%0D%0AEmail used at checkout:%0D%0AOrder number (if you have it):%0D%0A%0D%0AThanks!",
  },
  {
    id: "shipping", n: "02", label: "Where's my package?",
    help: "Tracking links go out within 24 hours of shipping. If yours hasn't moved in 3+ days, send us your order number and we'll chase the carrier for you.",
    subject: "Shipping — where's my package?",
    body: "Hi Whitefall,%0D%0A%0D%0AMy package hasn't arrived / tracking isn't updating.%0D%0A%0D%0AOrder number:%0D%0ATracking number (if you have it):%0D%0A%0D%0AThanks!",
  },
  {
    id: "size", n: "03", label: "Wrong size / exchange",
    help: "Free size exchanges within 30 days — unworn, tags on. Tell us your order number, the piece, and the size you need, and we'll set the swap up.",
    subject: "Exchange — wrong size",
    body: "Hi Whitefall,%0D%0A%0D%0AI'd like to exchange for a different size.%0D%0A%0D%0AOrder number:%0D%0APiece:%0D%0ACurrent size:%0D%0ASize I need:%0D%0A%0D%0AThanks!",
  },
  {
    id: "return", n: "04", label: "Return & refund",
    help: "30 days, no questions asked. Send your order number and we'll email you a return label — refund lands back on your original payment method once it's scanned in.",
    subject: "Return — refund request",
    body: "Hi Whitefall,%0D%0A%0D%0AI'd like to return my order.%0D%0A%0D%0AOrder number:%0D%0APiece(s) I'm returning:%0D%0A%0D%0AThanks!",
  },
  {
    id: "drop", n: "05", label: "FW26 / waitlist question",
    help: "Drop details go to the waitlist first — join it below if you haven't. Anything else about FW26, ask away.",
    subject: "FW26 — drop question",
    body: "Hi Whitefall,%0D%0A%0D%0AQuestion about the FW26 drop:%0D%0A%0D%0A",
  },
  {
    id: "other", n: "06", label: "Something else",
    help: "Collabs, wholesale, press, or anything that doesn't fit a box — hit us directly and a real person will get back to you within one business day.",
    subject: "Whitefall — general inquiry",
    body: "Hi Whitefall,%0D%0A%0D%0A",
  },
];

export default function App() {
  useReveal();
  const y = useScrollY();
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
  const [size, setSize] = useState(null);
  const [relayFailed, setRelayFailed] = useState(false);
  const [unlockFailed, setUnlockFailed] = useState(false);
  const [shared, setShared] = useState(false);
  const [barDismissed, setBarDismissed] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [memberNum, setMemberNum] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardUrl, setCardUrl] = useState(null);
  const [cardBusy, setCardBusy] = useState(false);
  const founding = memberNum != null && memberNum <= 100;
  const pad3 = (v) => String(v).padStart(3, "0");

  // ——— DROP DATE (placeholder — change this one line when the real date is locked) ———
  const DROP_DATE = new Date("2026-10-01T12:00:00-04:00").getTime();
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, DROP_DATE - now);
  const cd = {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
  const pad = (v) => String(v).padStart(2, "0");

  const saveSize = async (sz) => {
    setSize(sz);
    const clean = email.trim().toLowerCase();
    if (!clean.includes("@")) return;
    setSessionRows((rows) => rows.map((r) => (r.email === clean ? { ...r, size: sz } : r)));
    try {
      if (hasSupabase()) {
        await sbRpc("set_size", { p_email: clean, p_size: sz });
        lsWrite(lsRead().map((r) => (r.email === clean ? { ...r, size: sz } : r)));
      } else if (hasArtifactStore()) {
        const key = "signup:" + clean.replace(/[\s/\\'"]/g, "_");
        let row = { email: clean, interests: [], at: new Date().toISOString() };
        try {
          const existing = await window.storage.get(key, true);
          if (existing) row = JSON.parse(existing.value);
        } catch (e) { /* not stored yet */ }
        await window.storage.set(key, JSON.stringify({ ...row, size: sz }), true);
      } else {
        lsWrite(lsRead().map((r) => (r.email === clean ? { ...r, size: sz } : r)));
        try {
          await fetch("https://formsubmit.co/ajax/" + SUPPORT_EMAIL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              _subject: "▲ Whitefall waitlist — size added",
              _template: "table",
              email: clean,
              size: sz,
            }),
          });
        } catch (e) { console.error("size relay failed", e); }
      }
    } catch (e) { console.error("size save unavailable", e); }
  };

  const shareSite = async () => {
    const data = { title: "WHITEFALL", text: "FW26 is coming. The list shops first. UNSTOPPABLE MOMENTUM.", url: typeof location !== "undefined" ? location.href : "" };
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
      const glyphImg = await new Promise((res, rej) => {
        const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = LOGO_GLYPH;
      });
      const c = document.createElement("canvas");
      c.width = 1080; c.height = 1920;
      const x = c.getContext("2d");
      const grad = x.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, "#03040A"); grad.addColorStop(0.55, "#070C18"); grad.addColorStop(1, "#0B1322");
      x.fillStyle = grad; x.fillRect(0, 0, 1080, 1920);
      for (let i = 0; i < 130; i++) {
        x.fillStyle = `rgba(237,236,232,${0.12 + Math.random() * 0.4})`;
        const r = Math.random() < 0.7 ? 2 : 3;
        x.fillRect(Math.random() * 1080, Math.random() * 1920, r, r);
      }
      // glowing glyph
      const gw = 430, gh = gw * glyphImg.height / glyphImg.width;
      x.save(); x.shadowColor = "rgba(191,211,219,.85)"; x.shadowBlur = 80;
      x.drawImage(glyphImg, (1080 - gw) / 2, 250, gw, gh); x.restore();
      x.textAlign = "center";
      // hollow wordmark
      try { x.letterSpacing = "12px"; } catch (e) {}
      x.lineWidth = 5; x.strokeStyle = "#EDECE8";
      x.font = "700 88px Syncopate, sans-serif";
      x.strokeText("WHITEFALL", 540, 250 + gh + 150);
      // member label
      try { x.letterSpacing = "10px"; } catch (e) {}
      x.fillStyle = "#BFD3DB";
      x.font = "700 40px 'Space Mono', monospace";
      x.fillText(memberNum != null && memberNum <= 100 ? "FOUNDING MEMBER" : "MEMBER", 540, 250 + gh + 290);
      // the number
      try { x.letterSpacing = "0px"; } catch (e) {}
      x.fillStyle = "#EDECE8";
      x.shadowColor = "rgba(191,211,219,.4)"; x.shadowBlur = 60;
      x.font = "400 330px Anton, sans-serif";
      x.fillText(memberNum != null ? "#" + pad3(memberNum) : "▲", 540, 250 + gh + 640);
      x.shadowBlur = 0;
      // slogan + footer
      try { x.letterSpacing = "8px"; } catch (e) {}
      x.fillStyle = "#BFD3DB";
      x.font = "700 34px 'Space Mono', monospace";
      x.fillText("UNSTOPPABLE MOMENTUM.", 540, 250 + gh + 780);
      x.fillStyle = "#7E8590";
      x.font = "400 28px 'Space Mono', monospace";
      x.fillText("FW26 — THE LIST SHOPS FIRST", 540, 1810);
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
      if (hasSupabase()) {
        // One shared database for every visitor — the owner panel reads it live
        const n = await sbRpc("join_waitlist", { p_email: clean, p_interests: interests });
        if (n) { setMemberNum(n); row.num = n; }
        lsWrite(mergeRow(lsRead(), row));
        setSessionRows((rows) => rows.map((r) => (r.email === clean ? { ...r, num: n || r.num } : r)));
        setStoreMode("cloud");
        setRelayFailed(false);
      } else if (hasArtifactStore()) {
        const key = "signup:" + clean.replace(/[\s/\\'"]/g, "_");
        let prior = [];
        try {
          const existing = await window.storage.get(key, true);
          if (existing) prior = JSON.parse(existing.value).interests || [];
        } catch (e) { /* first signup */ }
        await window.storage.set(key, JSON.stringify({ ...row, interests: [...new Set([...prior, ...interests])] }), true);
        setStoreMode("live");
        try {
          const res = await window.storage.list("signup:", true);
          const n = ((res && res.keys) || []).length;
          if (n > 0) {
            setMemberNum(n);
            await window.storage.set(key, JSON.stringify({ ...row, interests: [...new Set([...prior, ...interests])], num: n }), true);
            setSessionRows((rows) => rows.map((r) => (r.email === clean ? { ...r, num: n } : r)));
          }
        } catch (e) { /* unnumbered */ }
      } else {
        // Deployed: global member number from a free counter, then instant email to the owner
        let n = null;
        try {
          const cr = await fetch("https://api.counterapi.dev/v1/whitefall-fw26/waitlist/up");
          const cj = await cr.json();
          n = cj && (cj.count || (cj.data && cj.data.count)) || null;
        } catch (e) { console.error("counter unavailable", e); }
        if (n) { setMemberNum(n); row.num = n; }
        lsWrite(mergeRow(lsRead(), row));
        setSessionRows((rows) => rows.map((r) => (r.email === clean ? { ...r, num: n || r.num } : r)));
        setStoreMode("relay");
        try {
          const fr = await fetch("https://formsubmit.co/ajax/" + SUPPORT_EMAIL, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              _subject: "▲ New Whitefall waitlist signup" + (n ? " — member #" + String(n).padStart(3, "0") : ""),
              _template: "table",
              _replyto: clean,
              email: clean,
              member_number: n || "unassigned",
              wants: interests.join(", ") || "general waitlist",
              signed_up_at: new Date().toLocaleString(),
            }),
          });
          const fj = await fr.json().catch(() => null);
          const delivered = fr.ok && fj && (fj.success === true || fj.success === "true");
          setRelayFailed(!delivered);
          if (!delivered) console.error("email relay not delivered", fj);
        } catch (e) { console.error("email relay failed", e); setRelayFailed(true); }
      }
    } catch (e) {
      console.error("signup save failed", e);
      setRelayFailed(true);
      setStoreMode(hasSupabase() ? "cloud" : hasArtifactStore() ? "live" : "relay");
    }
    setSaving(false);
    return true;
  };

  const joinWaitlist = async () => {
    const ok = await saveSignup(email);
    if (!ok) return;
    setJoined(true);
    // thank-you popup with the founder number, no matter where they signed up
    setPopupJoined(true);
    setPopupDone(false);
    setPopup(true);
  };



  const loadList = async (ownerCode) => {
    let rows = [];
    try {
      if (hasSupabase()) {
        const data = await sbRpc("list_signups", { p_code: (ownerCode ?? code).trim() });
        rows = (data || []).map((r) => ({
          email: r.email, num: r.num, size: r.size,
          interests: r.interests || [], at: r.created_at || "",
        }));
        setStoreMode("cloud");
      } else if (hasArtifactStore()) {
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
      if (hasSupabase()) return false; // wrong passcode or network — don't show a stale list
      setStoreMode(hasArtifactStore() ? "live" : "relay");
    }
    for (const s of sessionRows) rows = mergeRow(rows, s);
    rows.sort((a, b) => (b.at || "").localeCompare(a.at || ""));
    setList(rows);
    return true;
  };

  const OWNER_CODE = "0623";

  // With Supabase the passcode is verified by the database, not in this file
  const tryUnlock = async () => {
    if (hasSupabase()) {
      const ok = await loadList(code);
      if (ok) { setOwnerUnlocked(true); setUnlockFailed(false); }
      else setUnlockFailed(true);
    } else if (code.trim().toUpperCase() === OWNER_CODE) {
      setOwnerUnlocked(true);
      loadList();
    }
  };

  // Reliable in-page navigation (hash links are blocked in some sandboxed previews)
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <section id="top" style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "linear-gradient(180deg, #03040A 0%, #060A14 45%, #0A1120 78%, #05070D 100%)" }}>
        {/* stars */}
        <div className="snowfall" style={{ position: "absolute", inset: 0, opacity: 0.7, pointerEvents: "none" }} aria-hidden />
        {/* moon glow */}
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(191,211,219,.08), transparent 60%)", transform: `translateY(${y * 0.06}px)`, pointerEvents: "none" }} aria-hidden />

        {/* the logo — hanging in the midnight sky */}
        <div className="hero-wrap" style={{
          position: "absolute", left: "50%", top: "14vh",
          transform: `translateX(-50%) translateY(${y * 0.22}px)`,
          textAlign: "center", pointerEvents: "none",
        }}>
          <img src={LOGO} alt="" aria-hidden className="signal hero-in hero-mark"
            style={{ width: "min(52vw, 400px)", height: "auto" }} />
        </div>
        {/* soft glow pooling beneath the logo */}
        <div aria-hidden style={{ position: "absolute", left: "50%", top: "44vh", width: "70vw", height: "30vh", transform: `translate(-50%, 0) translateY(${y * 0.16}px)`, background: "radial-gradient(50% 50% at 50% 50%, rgba(191,211,219,.07), transparent 70%)", pointerEvents: "none" }} />

        {/* headline block */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "5vh", padding: "0 22px", textAlign: "center", zIndex: 2 }}>
          <p className="hero-in hd1" style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.28em", margin: "0 0 10px" }}>
            FALL / WINTER 2026 — THE SIGNAL IS UP
          </p>
          <h1 className="hero-in hd2" style={{ margin: 0, lineHeight: 1, textShadow: "0 0 55px rgba(191,211,219,.2)" }}>
            <Wordmark size="clamp(30px, 8.2vw, 124px)" stroke="2.5px" spacing="0.08em" glow />
          </h1>
          <p className="hero-in hd2 slogan" style={{ ...anton, color: S.frost, fontSize: "clamp(16px, 2.6vw, 30px)", letterSpacing: "0.34em", margin: "14px 0 0" }}>
            UNSTOPPABLE MOMENTUM.
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
            FIRST 100 SIGNUPS BECOME <span style={{ color: S.frost }}>FOUNDING MEMBERS</span> — NUMBER LOCKED FOR LIFE
          </p>
        </div>
      </section>

      {/* ——— TICKER ——— */}
      <div style={{ overflow: "hidden", borderTop: `1px solid ${S.line}`, borderBottom: `1px solid ${S.line}`, padding: "13px 0", background: S.night }} aria-hidden>
        <div className="marquee-track" style={{ display: "flex", width: "max-content" }}>
          {[0, 1].map((k) => (
            <div key={k} style={{ ...mono, display: "flex", gap: 52, paddingRight: 52, fontSize: 12, letterSpacing: "0.2em", color: S.ash, whiteSpace: "nowrap" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>FW26 · COMING SOON <span style={{ color: S.frost }}>▲</span> UNSTOPPABLE MOMENTUM <span style={{ color: S.frost }}>▲</span> WHITEFALL — FW26</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ——— MANIFESTO ——— */}
      <section id="manifesto" style={{ padding: "9vw 22px", background: S.night, position: "relative", overflow: "hidden" }}>
        {/* giant watermark logo drifting on scroll */}
        <img src={LOGO} alt="" aria-hidden style={{
          position: "absolute", right: "-14%", top: "50%", width: "56vw", opacity: 0.04,
          transform: `translateY(calc(-50% + ${(y - 1400) * 0.08}px)) rotate(6deg)`, pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <p className="rv" style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.28em", margin: "0 0 6vw" }}>MANIFESTO</p>
          {[
            "COMFORT BURIES QUIETLY.",
            "ALL LOSS IS PSYCHOLOGICAL — UNTIL DEATH.",
            "EVERYONE WANTS THE MOON. ALMOST NO ONE LEAVES THE GROUND.",
            "FEAR POINTS AT EVERYTHING WORTH DOING.",
            "BETTER A FAILURE THAN A COWARD.",
          ].map((line) => (
            <h2 key={line} className="rv" style={{ ...anton, fontSize: "clamp(26px, 4.6vw, 62px)", lineHeight: 1.05, margin: "0 0 5vw", maxWidth: 980 }}>
              {line}
            </h2>
          ))}
          <h2 className="rv" style={{ ...anton, color: S.frost, fontSize: "clamp(28px, 5.2vw, 70px)", lineHeight: 1, letterSpacing: "0.05em", margin: 0, textShadow: "0 0 40px rgba(191,211,219,.2)" }}>
            UNSTOPPABLE MOMENTUM.
          </h2>
          <div className="stagger" style={{ display: "flex", gap: 44, marginTop: "7vw", flexWrap: "wrap" }}>
            {[["01", "LIMITED, NUMBERED RUNS"], ["02", "HEAVYWEIGHT, LUXURY FINISH"], ["03", "FEAR, USED AS FUEL"]].map(([n, l]) => (
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
              FW26 <span style={{ color: S.frost }}>—</span> COMING SOON
            </h2>
            <span style={{ ...mono, fontSize: 12, color: S.ash, letterSpacing: "0.18em" }}>FALL / WINTER 2026 · FOUR PIECES</span>
          </div>
          <p className="rv" style={{ color: S.ash, maxWidth: 560, lineHeight: 1.7, margin: "0 0 28px" }}>
            Four pieces. No previews, no leaks — the waitlist sees them first, shops them first.
          </p>

          {/* drop countdown */}
          <div className="rv" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", margin: "0 0 44px" }}>
            {diff > 0 ? (
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
            )}
          </div>

          <div className="stagger" style={{ borderTop: `1px solid ${S.line}` }}>
            {[
              ["01", "WHITEOUT CREWNECK", "HEAVYWEIGHT BRUSHED FLEECE"],
              ["02", "AVALANCHE HOODIE", "500GSM \u00b7 BOX LOGO"],
              ["03", "MOMENTUM ATHLETIC SHIRT", "PERFORMANCE KNIT \u00b7 BUILT TO TRAIN"],
              ["04", "FREEFALL DOWN PUFFER", "700-FILL DOWN \u00b7 STORM SHELL"],
            ].map(([n, name, cat]) => (
              <div key={n} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 14, padding: "26px 0", borderBottom: `1px solid ${S.line}`, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
                  <span style={{ ...mono, fontSize: 11, color: S.frost, letterSpacing: "0.16em" }}>{n}</span>
                  <span style={{ ...anton, fontSize: "clamp(22px, 3.6vw, 46px)", letterSpacing: "0.02em" }}>{name}</span>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em" }}>{cat}</span>
                  <span style={{ ...mono, fontSize: 10, color: S.snow, letterSpacing: "0.14em", border: `1px solid ${S.line}`, padding: "6px 10px" }}>COMING SOON</span>
                </div>
              </div>
            ))}
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
            Every signup gets a permanent member number — the first 100 are Founding Members
            with early access for life. When FW26 hits, that number is everything.
          </p>
          {joined ? (
            <div>
              {memberNum != null && (
                <div style={{ ...anton, fontSize: "clamp(72px, 16vw, 140px)", lineHeight: 1, color: S.snow, textShadow: "0 0 60px rgba(191,211,219,.35)", margin: "0 0 8px" }}>
                  #{pad3(memberNum)}
                </div>
              )}
              <p style={{ ...mono, color: S.frost, fontSize: 12, letterSpacing: "0.2em", margin: "0 0 20px" }}>
                {memberNum != null
                  ? (founding ? "▲ FOUNDING MEMBER — EARLY ACCESS FOR LIFE" : "▲ MEMBER — THE LIST SHOPS FIRST")
                  : "▲ YOU'RE IN. WATCH YOUR INBOX."}
              </p>
              {relayFailed && (
                <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Waitlist signup")}&body=${encodeURIComponent("Add me to the FW26 waitlist: " + email.trim().toLowerCase())}`}
                  style={{ ...mono, display: "inline-block", border: "1px solid rgba(191,211,219,.4)", color: S.frost, padding: "10px 16px", fontSize: 10, letterSpacing: "0.14em", textDecoration: "none", margin: "0 0 18px" }}>
                  COULDN'T REACH THE LIST — TAP TO EMAIL YOUR SIGNUP INSTEAD ▲
                </a>
              )}
              {!size ? (
                <div>
                  <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.16em", margin: "0 0 12px" }}>WHAT SIZE ARE YOU? (OPTIONAL — HELPS US MAKE ENOUGH OF YOURS)</p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                    {["XS","S","M","L","XL","XXL"].map((sz) => (
                      <button key={sz} onClick={() => saveSize(sz)}
                        style={{ ...mono, background: "transparent", border: `1px solid ${S.line}`, color: S.snow, width: 52, padding: "11px 0", fontSize: 12, cursor: "pointer", transition: "all .2s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(191,211,219,.6)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.line)}
                      >{sz}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ ...mono, fontSize: 10, color: S.frost, letterSpacing: "0.16em", margin: "0 0 12px" }}>SIZE {size} NOTED ▲</p>
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
              <div style={{ ...mono, fontSize: 10, letterSpacing: "0.18em", color: S.frost, marginBottom: 12 }}>ORDERS & RETURNS</div>
              <div style={{ ...anton, fontSize: 22, marginBottom: 8 }}>EMAIL SUPPORT</div>
              <div style={{ color: S.ash, fontSize: 14, lineHeight: 1.6 }}>{SUPPORT_EMAIL} — include your order number. Replies within one business day.</div>
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
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(t.subject)}&body=${t.body}`}
                    style={{ ...mono, background: S.snow, color: S.night, padding: "14px 24px", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em", fontWeight: 700 }}>
                    EMAIL US — PRE-FILLED ▲
                  </a>
                  <a href="https://instagram.com/whitefall26" target="_blank" rel="noopener noreferrer"
                    style={{ ...mono, border: `1px solid ${S.line}`, color: S.snow, padding: "14px 24px", textDecoration: "none", fontSize: 12, letterSpacing: "0.1em" }}>
                    OR DM @WHITEFALL26
                  </a>
                </div>
                <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.12em", margin: "16px 0 0" }}>
                  THE EMAIL OPENS WITH THE SUBJECT AND DETAILS ALREADY FILLED IN — JUST ADD YOUR INFO AND SEND.
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
              <div style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.16em", marginTop: 6 }}>UNSTOPPABLE MOMENTUM.</div>
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
              MADE SCARCE. WORN LOUD. ▲{" "}
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
            <p style={{ ...mono, color: S.frost, fontSize: 10, letterSpacing: "0.28em", margin: "0 0 10px" }}>UNSTOPPABLE MOMENTUM.</p>
            {popupJoined ? (
              <div>
                <h2 style={{ ...anton, fontSize: "clamp(22px, 4.6vw, 30px)", margin: "0 0 4px", lineHeight: 1.05 }}>THANK YOU.</h2>
                {memberNum != null && (
                  <div style={{ ...anton, fontSize: "clamp(54px, 13vw, 84px)", lineHeight: 1, color: S.snow, textShadow: "0 0 40px rgba(191,211,219,.35)", margin: "6px 0 4px" }}>
                    #{pad3(memberNum)}
                  </div>
                )}
                <p style={{ ...mono, fontSize: 10, color: S.frost, letterSpacing: "0.18em", margin: "0 0 14px" }}>
                  {memberNum != null
                    ? (founding ? "FOUNDING MEMBER — EARLY ACCESS FOR LIFE" : "MEMBER — THE LIST SHOPS FIRST")
                    : "YOU'RE ON THE LIST ▲"}
                </p>
                {relayFailed && (
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Waitlist signup")}&body=${encodeURIComponent("Add me to the FW26 waitlist: " + email.trim().toLowerCase())}`}
                    style={{ ...mono, display: "inline-block", border: "1px solid rgba(191,211,219,.4)", color: S.frost, padding: "9px 14px", fontSize: 9, letterSpacing: "0.12em", textDecoration: "none", margin: "0 0 12px" }}>
                    COULDN'T REACH THE LIST — EMAIL YOUR SIGNUP ▲
                  </a>
                )}
                <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.14em", margin: "0 0 12px" }}>WHAT SIZE ARE YOU? (OPTIONAL)</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
                  {["XS","S","M","L","XL","XXL"].map((sz) => (
                    <button key={sz} onClick={() => saveSize(sz)}
                      style={{ ...mono, background: size === sz ? S.frost : "transparent", color: size === sz ? S.night : S.snow, border: `1px solid ${size === sz ? S.frost : S.line}`, width: 48, padding: "10px 0", fontSize: 12, cursor: "pointer" }}
                    >{sz}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
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
            <h2 style={{ ...anton, fontSize: "clamp(26px, 5vw, 36px)", margin: "0 0 8px", lineHeight: 1.05 }}>THE FIRST 100 ARE FOUNDERS</h2>
            <p style={{ ...mono, color: S.frost, fontSize: 10, letterSpacing: "0.18em", margin: "0 0 12px" }}>YOUR NUMBER. LOCKED FOREVER.</p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.65, margin: "0 0 22px" }}>
              Every signup gets a permanent member number. The first 100 become Founding Members —
              early access for life, and first claim on every drop, starting with FW26.
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
              When you join the waitlist we store your email address, and — only if you choose to share them —
              your size and the pieces you're interested in. That's the whole list.
            </p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.75, margin: "0 0 14px" }}>
              It's used for one thing: telling you about drops. It is never sold, rented, or shared with anyone else.
            </p>
            <p style={{ color: S.ash, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
              Want off the list or your data deleted? Email <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: S.frost }}>{SUPPORT_EMAIL}</a> and it's done.
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
                    onChange={(e) => { setCode(e.target.value); setUnlockFailed(false); }}
                    onKeyDown={(e) => { if (e.key === "Enter") tryUnlock(); }}
                    style={{ ...mono, flex: 1, background: "rgba(255,255,255,.03)", border: `1px solid ${S.line}`, borderRight: "none", color: S.snow, padding: "13px 14px", fontSize: 13, letterSpacing: "0.1em" }} />
                  <button
                    onClick={tryUnlock}
                    style={{ ...mono, background: S.snow, color: S.night, border: "none", padding: "13px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}>
                    UNLOCK
                  </button>
                </div>
                {hasSupabase()
                  ? unlockFailed && (
                    <p style={{ ...mono, color: S.ash, fontSize: 10, letterSpacing: "0.12em", marginTop: 10 }}>THAT'S NOT IT — CHECK THE CODE AND TRY AGAIN.</p>
                  )
                  : code && code.trim().toUpperCase() !== OWNER_CODE && (
                    <p style={{ ...mono, color: S.ash, fontSize: 10, letterSpacing: "0.12em", marginTop: 10 }}>KEEP TYPING — THAT'S NOT IT YET.</p>
                  )}
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
                  <span style={{ ...mono, fontSize: 12, color: S.frost, letterSpacing: "0.14em" }}>
                    {list.length} SIGNUP{list.length === 1 ? "" : "S"} COLLECTED
                    <span style={{ display: "block", fontSize: 9, color: storeMode === "live" || storeMode === "cloud" ? S.frost : S.ash, marginTop: 6, letterSpacing: "0.12em" }}>
                      {storeMode === "cloud"
                        ? "● SUPABASE LIVE — EVERY SIGNUP FROM EVERY VISITOR, ANY DEVICE"
                        : storeMode === "live"
                        ? "● LIVE STORAGE — COLLECTING FROM ALL VISITORS"
                        : storeMode === "relay"
                        ? "● DEPLOYED — EVERY SIGNUP EMAILS YOUR INBOX INSTANTLY (WITH MEMBER #). THIS LIST SHOWS THIS DEVICE."
                        : "○ PREVIEW MODE — SHOWING THIS SESSION ONLY."}
                    </span>
                  </span>
                  <button onClick={loadList} style={{ ...mono, background: "none", border: `1px solid ${S.line}`, color: S.snow, padding: "8px 14px", fontSize: 10, letterSpacing: "0.12em", cursor: "pointer" }}>
                    ↻ REFRESH
                  </button>
                </div>
                {list.some((r) => r.size) && (
                  <p style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.12em", margin: "0 0 14px" }}>
                    SIZES — {["XS","S","M","L","XL","XXL"].map((sz) => `${sz}:${list.filter((r) => r.size === sz).length}`).join("  ")}
                  </p>
                )}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Whitefall waitlist export — " + list.length + " signups")}&body=${encodeURIComponent(list.map((r) => (r.num ? "#" + pad3(r.num) + "  " : "") + r.email + (r.size ? "  [size: " + r.size + "]" : "") + (r.interests && r.interests.length ? "  [wants: " + r.interests.join(", ") + "]" : "") + "  (" + (r.at || "").slice(0, 10) + ")").join("\n") || "No signups yet.")}`}
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
                        <span style={{ ...mono, fontSize: 12 }}>{r.num ? "#" + pad3(r.num) + "  " : ""}{r.email}</span>
                        <span style={{ ...mono, fontSize: 10, color: S.ash, letterSpacing: "0.08em" }}>
                          {r.size ? r.size + "  " : ""}{(r.interests && r.interests.length ? r.interests.join(" · ") + "  " : "")}{(r.at || "").slice(0, 10)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ ...mono, fontSize: 9, color: S.ash, letterSpacing: "0.1em", marginTop: 14, lineHeight: 1.7 }}>
                  {hasSupabase()
                    ? 'THIS IS THE MASTER LIST — EVERY SIGNUP SAVES TO YOUR SUPABASE DATABASE AND SHOWS HERE FROM ANY DEVICE. "EMAIL LIST TO ME" OPENS A PRE-FILLED EMAIL WITH THE FULL LIST.'
                    : hasArtifactStore()
                    ? 'SIGNUPS FROM EVERY VISITOR SAVE HERE AUTOMATICALLY. "EMAIL LIST TO ME" OPENS A PRE-FILLED EMAIL WITH THE FULL LIST.'
                    : "YOUR INBOX IS THE MASTER LIST ON THE LIVE SITE — EACH SIGNUP ARRIVES WITH ITS MEMBER NUMBER THE MOMENT IT HAPPENS."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
