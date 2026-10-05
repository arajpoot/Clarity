(function(){
"use strict";
if (window.__CLARITY_UI_SHINE_V2__) return;
window.__CLARITY_UI_SHINE_V2__ = true;

var CSS = `
/* ===== Pan/scroll restored — do not lock touch-action on document ===== */
html, body {
  touch-action: auto !important;
  -ms-touch-action: auto !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  height: auto !important;
  min-height: 100% !important;
  overscroll-behavior-y: auto !important;
}
.page-wrapper, .main-content, .tab-panel, #main-application-workspace {
  touch-action: auto !important;
  overflow: visible !important;
}
/* Only nav chrome uses manipulation (faster taps, no double-zoom) */
.nav-tabs, #clarity-door-rail, .mobile-bottom-nav, .stream-controls, .cgs-btn {
  touch-action: manipulation !important;
}

/* ===== Track plaque: intro ABOVE, all phases ONE strip ===== */
.cgp-intro, .clarity-gate-switcher .cgp-intro, p.cgp-intro {
  display: block !important;
  width: 100% !important;
  flex: 0 0 100% !important;
  margin: 0.25rem 0 0.45rem !important;
  padding: 0 !important;
  font-size: 0.8rem !important;
  line-height: 1.45 !important;
  opacity: 0.9 !important;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}
.clarity-gate-switcher.rrra-sitewide,
.clarity-gate-switcher,
.cgp-track-plaque {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0.4rem !important;
  margin: 0.55rem 0 0.85rem !important;
  padding: 0.65rem 0.75rem !important;
  border-radius: 16px !important;
  background: linear-gradient(145deg, rgba(255,253,248,0.98), rgba(232,242,236,0.94)) !important;
  border: 1px solid rgba(13,79,60,0.2) !important;
  box-shadow: 0 4px 16px rgba(13,50,40,0.08), inset 0 1px 0 rgba(255,255,255,0.9) !important;
}
.cgp-track-row {
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 0.35rem !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
  padding-bottom: 0.1rem !important;
  width: 100% !important;
}
.cgp-track-row .cgs-label {
  flex-shrink: 0 !important;
  font-size: 0.65rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: #0d4f3c !important;
  margin: 0 0.15rem 0 0 !important;
}
.cgp-track-row .cgs-btn {
  flex: 0 0 auto !important;
  white-space: nowrap !important;
  border-radius: 999px !important;
  padding: 0.34rem 0.65rem !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  border: 1.5px solid transparent !important;
}
.cgs-seeker, .cgs-btn[data-gate="seeker"] {
  background: linear-gradient(180deg,#f8f0d8,#f0e4c0) !important;
  color: #6a4a18 !important; border-color: #d4b45a !important;
}
.cgs-new_muslim, .cgs-btn[data-gate="new_muslim"], .cgs-new {
  background: linear-gradient(180deg,#d8f5e8,#c0ecd8) !important;
  color: #0a3d2e !important; border-color: #5a9e7a !important;
}
.cgs-practicing, .cgs-btn[data-gate="practicing"], .cgs-daily {
  background: linear-gradient(180deg,#d8eef5,#c0e0ec) !important;
  color: #1a4a5a !important; border-color: #4a8ab0 !important;
}
.cgs-dai, .cgs-btn[data-gate="dai"] {
  background: linear-gradient(180deg,#e8e0f5,#d8d0ec) !important;
  color: #3a2a5a !important; border-color: #7a6ab0 !important;
}
.cgs-reset {
  background: rgba(13,79,60,0.08) !important;
  color: #0d4f3c !important; border-color: rgba(13,79,60,0.25) !important;
}
.cgs-btn.active, .cgs-btn.is-active {
  box-shadow: 0 0 0 2px rgba(13,79,60,0.28), 0 2px 8px rgba(0,0,0,0.1) !important;
}

html[data-theme="dark"] .clarity-gate-switcher,
html[data-theme="dark"] .cgp-track-plaque {
  background: linear-gradient(145deg, rgba(18,28,24,0.96), rgba(12,22,18,0.94)) !important;
  border-color: rgba(212,180,90,0.28) !important;
}
html[data-theme="dark"] .cgp-track-row .cgs-label { color: #d4b45a !important; }

/* ===== Hub plaques (tab intros) ===== */
.rrra-hub-hero {
  border-radius: 18px !important;
  padding: 1rem 1.15rem !important;
  margin: 0.35rem 0 0.55rem !important;
  box-shadow: 0 6px 18px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.55) !important;
}
.rrra-hub-summary {
  border-radius: 14px !important;
  padding: 0.65rem 0.9rem !important;
  margin: 0 0 0.65rem !important;
  font-size: 0.84rem !important;
  line-height: 1.45 !important;
}
#tab-reminder .rrra-hub-hero {
  background: linear-gradient(145deg, #d8f0e4, #e8f8f0) !important;
  border: 1px solid rgba(13,79,60,0.28) !important;
}
#tab-reminder .rrra-hub-hero h2 { color: #0d4f3c !important; }
#tab-reminder .rrra-hub-summary {
  background: #eef8f2 !important;
  border: 1px solid rgba(13,79,60,0.18) !important;
}
#tab-reality .rrra-hub-hero {
  background: linear-gradient(145deg, #f5edd6, #faf6e8) !important;
  border: 1px solid rgba(184,146,42,0.4) !important;
}
#tab-reality .rrra-hub-hero h2 { color: #8a6a28 !important; }
#tab-reality .rrra-hub-summary {
  background: #faf6e8 !important;
  border: 1px solid rgba(184,146,42,0.28) !important;
}
#tab-reflection .rrra-hub-hero {
  background: linear-gradient(145deg, #e4f0d4, #eef5e0) !important;
  border: 1px solid rgba(61,122,53,0.35) !important;
}
#tab-reflection .rrra-hub-hero h2 { color: #2c4a3a !important; }
#tab-reflection .rrra-hub-summary {
  background: #eef5e0 !important;
  border: 1px solid rgba(61,122,53,0.25) !important;
}
#tab-action .rrra-hub-hero {
  background: linear-gradient(145deg, #e0f0f5, #e8f4fa) !important;
  border: 1px solid rgba(42,95,122,0.35) !important;
}
#tab-action .rrra-hub-hero h2 { color: #2a5f7a !important; }
#tab-action .rrra-hub-summary {
  background: #e8f4fa !important;
  border: 1px solid rgba(42,95,122,0.25) !important;
}

/* Bottom nav colors */
.door-rail-btn.rrra-rail-rem { background: linear-gradient(180deg,#1a6b52,#0d4f3c) !important; color:#f0faf4 !important; }
.door-rail-btn.rrra-rail-real { background: linear-gradient(180deg,#b8922a,#8a6a28) !important; color:#1a1208 !important; }
.door-rail-btn.rrra-rail-refl { background: linear-gradient(180deg,#3d7a35,#2c4a3a) !important; color:#f0f8e8 !important; }
.door-rail-btn.rrra-rail-act { background: linear-gradient(180deg,#356a90,#2a5f7a) !important; color:#f0f8fc !important; }
.door-rail-btn.rrra-rail-vault { background: linear-gradient(180deg,#5a4a90,#4a3a70) !important; color:#f4f0fc !important; }
.door-rail-btn.active {
  box-shadow: 0 0 0 2px rgba(255,255,255,0.5) !important;
  filter: brightness(1.08);
}

/* ===== Banner declutter: calendar / salah / temps ===== */
.banner-side {
  max-width: 7.5rem !important;
  width: 7.2rem !important;
  overflow: hidden !important;
}
.hijri-cal-section, .salah-times-section {
  padding: 0.28rem 0.32rem !important;
  overflow: hidden !important;
}
.hijri-cal-grid {
  font-size: 0.52rem !important;
  gap: 0 !important;
  line-height: 1.1 !important;
}
.hijri-cal-grid .day, .hijri-cal-grid .dow {
  padding: 0.06rem 0 !important;
}
.hijri-cal-meta, .salah-meta {
  font-size: 0.55rem !important;
  margin-top: 0.08rem !important;
  line-height: 1.2 !important;
  max-height: 2.4em !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.hijri-local-time { font-size: 0.7rem !important; margin-top: 0.1rem !important; }
.hijri-local-loc {
  font-size: 0.5rem !important;
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  opacity: 0.85 !important;
}
.salah-times-list { font-size: 0.56rem !important; }
.salah-times-list li { padding: 0.06rem 0 !important; }
.salah-times-list .salah-time {
  font-size: 0.52rem !important;
  padding: 0.02rem 0.2rem !important;
}
/* Hide duplicate temp noise in place-name / side if double-filled */
.banner-side .temp-live + .temp-live { display: none !important; }
#place-temp-alt:empty, #place-temp:empty { display: none !important; }
/* Festival strip: single line, no wrap flood */
.banner-event-strip, .banner-mobile-strip {
  font-size: 0.62rem !important;
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}


/* ===== Banner vs visit strip — no overlap with volume/stream row ===== */
#clarity-top-duo {
  position: relative !important;
  z-index: 20 !important;
  overflow: visible !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
#clarity-top-duo .banner {
  overflow: hidden !important;
  /* room for stream row inside overlay */
  padding-bottom: 0 !important;
}
#clarity-top-duo .banner-overlay {
  padding-bottom: 0.45rem !important;
}
#clarity-top-duo .banner-center {
  padding-bottom: 0.15rem !important;
}
#clarity-top-duo .stream-controls {
  position: relative !important;
  z-index: 6 !important;
  margin-top: 0.35rem !important;
  margin-bottom: 0.15rem !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  gap: 0.3rem !important;
  max-width: 100% !important;
}
#clarity-top-duo .volume-control {
  display: inline-flex !important;
  align-items: center !important;
  position: relative !important;
  z-index: 7 !important;
  flex-shrink: 0 !important;
  background: rgba(255,255,255,0.22) !important;
  border-radius: 18px !important;
  padding: 0.22rem 0.55rem !important;
}
#clarity-top-duo .volume-control input[type="range"] {
  width: 52px !important;
  min-width: 44px !important;
}

/* Visit / LAST strip sits fully BELOW banner — never over stream controls */
#clarity-visit-pill-bar,
.cv-stitched-banner {
  position: relative !important;
  z-index: 15 !important;
  clear: both !important;
  display: flex !important;
  margin: 0 !important;
  margin-top: 0 !important;
  transform: none !important;
  top: auto !important;
  /* pull out of any negative overlap */
  border-top: 1px solid rgba(13,79,60,0.12) !important;
}
/* If strip was absolutely positioned over banner, kill that */
#clarity-top-duo #clarity-visit-pill-bar,
.banner #clarity-visit-pill-bar {
  position: relative !important;
  inset: auto !important;
}

/* Ensure main content starts cleanly under strip */
#clarity-visit-pill-bar + *,
#main-application-workspace,
.page-wrapper {
  position: relative !important;
  z-index: 2 !important;
}


/* ===== Night: intro plaques + track strip match dark chrome ===== */
html[data-theme="dark"] .rrra-hub-hero,
html[data-theme="dark"] #tab-reminder .rrra-hub-hero {
  background: linear-gradient(145deg, #0e2820, #0a1c16) !important;
  border: 1px solid rgba(212,180,90,0.22) !important;
  color: #e8f0ea !important;
}
html[data-theme="dark"] #tab-reminder .rrra-hub-hero h2 { color: #7dcea0 !important; }
html[data-theme="dark"] #tab-reminder .rrra-hub-sub,
html[data-theme="dark"] #tab-reminder .rrra-hub-meta { color: #c8ddd0 !important; }
html[data-theme="dark"] #tab-reminder .rrra-hub-summary {
  background: rgba(20,36,28,0.95) !important;
  border: 1px solid rgba(212,180,90,0.15) !important;
  color: #d0e4d8 !important;
}
html[data-theme="dark"] #tab-reality .rrra-hub-hero {
  background: linear-gradient(145deg, #2a2210, #1a160c) !important;
  border-color: rgba(212,180,90,0.35) !important;
  color: #f5edd6 !important;
}
html[data-theme="dark"] #tab-reality .rrra-hub-hero h2 { color: #e8d48a !important; }
html[data-theme="dark"] #tab-reality .rrra-hub-summary {
  background: rgba(40,32,16,0.95) !important;
  border-color: rgba(212,180,90,0.2) !important;
  color: #e8dcc0 !important;
}
html[data-theme="dark"] #tab-reflection .rrra-hub-hero {
  background: linear-gradient(145deg, #142414, #0c180c) !important;
  border-color: rgba(120,180,100,0.3) !important;
  color: #e4f0d4 !important;
}
html[data-theme="dark"] #tab-reflection .rrra-hub-hero h2 { color: #a8d48a !important; }
html[data-theme="dark"] #tab-reflection .rrra-hub-summary {
  background: rgba(20,32,18,0.95) !important;
  color: #d4e8c8 !important;
}
html[data-theme="dark"] #tab-action .rrra-hub-hero {
  background: linear-gradient(145deg, #0c2428, #0a1a1c) !important;
  border-color: rgba(80,140,180,0.35) !important;
  color: #e0f0f5 !important;
}
html[data-theme="dark"] #tab-action .rrra-hub-hero h2 { color: #7ec8e0 !important; }
html[data-theme="dark"] #tab-action .rrra-hub-summary {
  background: rgba(12,28,32,0.95) !important;
  color: #c8e4ec !important;
}

html[data-theme="dark"] .clarity-gate-switcher,
html[data-theme="dark"] .cgp-track-plaque {
  background: linear-gradient(145deg, rgba(18,28,24,0.98), rgba(12,20,16,0.96)) !important;
  border: 1px solid rgba(212,180,90,0.28) !important;
  color: #e8f0ea !important;
}
html[data-theme="dark"] .cgp-intro,
html[data-theme="dark"] p.cgp-intro {
  color: #c8ddd0 !important;
  opacity: 1 !important;
}
html[data-theme="dark"] .cgp-track-row .cgs-label { color: #d4b45a !important; }
html[data-theme="dark"] .cgs-reset {
  background: rgba(212,180,90,0.12) !important;
  color: #e8d48a !important;
  border-color: rgba(212,180,90,0.35) !important;
}

/* Reset pill always tappable */
.cgs-reset, #clarity-path-reset-btn {
  pointer-events: auto !important;
  cursor: pointer !important;
  opacity: 1 !important;
  flex-shrink: 0 !important;
}

/* Bottom nav fonts — readable desktop + mobile */
#clarity-door-rail.door-rail-bottom .door-rail-btn,
#clarity-door-rail .door-rail-btn {
  font-size: 0.78rem !important;
  min-height: 2.75rem !important;
  padding: 0.4rem 0.55rem !important;
}
#clarity-door-rail .dr-label {
  font-size: 0.78rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.01em !important;
}
#clarity-door-rail .dr-ico {
  font-size: 1rem !important;
}
@media (min-width: 901px) {
  #clarity-door-rail.door-rail-bottom .door-rail-btn,
  #clarity-door-rail .door-rail-btn {
    font-size: 0.88rem !important;
    min-height: 3rem !important;
    padding: 0.5rem 0.75rem !important;
  }
  #clarity-door-rail .dr-label { font-size: 0.88rem !important; }
  #clarity-door-rail .dr-ico { font-size: 1.1rem !important; }
}
.mobile-bottom-nav .mb-tab {
  font-size: 0.72rem !important;
  font-weight: 700 !important;
}
.mobile-bottom-nav .mb-tab .mb-icon { font-size: 1.2rem !important; }
@media (min-width: 901px) {
  .mobile-bottom-nav .mb-tab { font-size: 0.82rem !important; }
}

/* Live iframe must paint above stills */
#banner-media.live-active #banner-live,
#banner-media.live-active .banner-live {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  z-index: 5 !important;
  pointer-events: none !important;
  width: 100% !important;
  height: 100% !important;
}
#banner-media.live-active img,
#banner-media.live-active .banner-still-fallback {
  opacity: 0 !important;
  z-index: 0 !important;
}


/* ===== Desktop: snug content to viewport edges ===== */
@media (min-width: 901px) {
  .page-wrapper,
  #main-content,
  .main-content,
  #main-application-workspace {
    max-width: none !important;
    width: 100% !important;
    padding-left: 0.85rem !important;
    padding-right: 0.85rem !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  .tab-panel.active,
  .rrra-hub-body,
  #tab-reminder, #tab-reality, #tab-reflection, #tab-action, #tab-notes {
    max-width: none !important;
    width: 100% !important;
  }
  .card, .rrra-hub-hero, .rrra-hub-summary, .cgp-track-plaque {
    max-width: none !important;
  }
  /* slight side padding only so text isn't glued to chrome */
  #main-application-workspace > .tab-panel {
    padding-left: 0.25rem !important;
    padding-right: 0.25rem !important;
  }
}
@media (min-width: 1200px) {
  .page-wrapper,
  #main-content {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}

/* ===== Snappy phase transitions (less baggy) ===== */
.tab-panel {
  transition: opacity 0.18s ease, transform 0.18s ease !important;
}
.tab-panel:not(.active) {
  display: none !important;
}
.tab-panel.active {
  display: block !important;
  animation: clarityTabIn 0.2s ease both;
}
@keyframes clarityTabIn {
  from { opacity: 0.55; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.gate-hidden {
  transition: none !important;
}
.cgs-btn, .gps-btn {
  transition: box-shadow 0.12s ease, transform 0.1s ease, filter 0.12s ease !important;
}
#clarity-path-quiz-modal {
  transition: opacity 0.15s ease !important;
}
#clarity-path-quiz-modal .cpq-card {
  transition: transform 0.15s ease !important;
}
.card {
  transition: opacity 0.15s ease !important;
}

/* meme accent chip */
.mv-chip.mv-accent {
  background: linear-gradient(180deg, #1a6b52, #0d4f3c) !important;
  color: #f0faf4 !important;
  border-color: rgba(255,255,255,0.2) !important;
}
.clarity-to-meme-pill {
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  padding: 0.28rem 0.6rem !important;
  border-radius: 999px !important;
  cursor: pointer !important;
}


/* ===== Brand font restore ===== */
.banner-center h1,
.banner-title,
.clarity-brand,
#clarity-top-duo .banner-center .brand-name,
#clarity-top-duo h1,
.logo-text, .site-title {
  font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
}
.rrra-hub-hero h2,
.card h2 {
  font-family: 'Cormorant Garamond', Georgia, serif !important;
}

/* ===== Live: lighten overlay so stream is visible ===== */
#banner-media.live-active ~ .banner-overlay,
.banner:has(.live-active) .banner-overlay,
#clarity-top-duo .banner:has(.live-active) .banner-overlay {
  background: linear-gradient(to bottom, rgba(8,28,22,0.08), rgba(8,28,22,0.18)) !important;
}
#banner-media.live-active #banner-live,
#banner-media.live-active .banner-live {
  opacity: 1 !important;
  z-index: 4 !important;
}
/* Keep center controls readable without blacking out video */
#clarity-top-duo .banner-center {
  background: transparent !important;
}
#clarity-top-duo .banner-center .rabbana-box,
#clarity-top-duo .banner-center .verse-box {
  background: rgba(8,28,22,0.45) !important;
  backdrop-filter: blur(4px);
}

/* ===== Calendar + Salah: circular plaque icons ===== */
.hijri-cal-section .cal-title,
.salah-times-section .salah-title {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.25rem !important;
}
.hijri-cal-section,
.salah-times-section {
  border-radius: 16px !important;
  background: rgba(0,0,0,0.28) !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12) !important;
}
/* circular icon badges at top of side plaques */
.banner-side .cal-title::before,
.banner-side .salah-title::before {
  content: none;
}
.banner-side .hijri-cal-section .cal-title,
.banner-side .salah-times-section .salah-title {
  width: auto !important;
  margin: 0 auto 0.2rem !important;
  padding: 0.2rem 0.45rem !important;
  border-radius: 999px !important;
  background: rgba(255,255,255,0.14) !important;
  font-size: 0.65rem !important;
}
/* circular day cells for today */
.hijri-cal-grid .day.today {
  border-radius: 50% !important;
  background: rgba(255,255,255,0.4) !important;
}

/* ===== Meme card never fully gate-hidden when practicing/dai ===== */
#meme-card:not([data-gate-hidden="1"]) {
  display: block !important;
}
.clarity-to-meme-pill {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  background: linear-gradient(180deg, #e8f5ee, #d4ecd8) !important;
  color: #0a3d2e !important;
  border: 1px solid #8fd4b0 !important;
}
html[data-theme="dark"] .clarity-to-meme-pill {
  background: rgba(212,180,90,0.15) !important;
  color: #e8d48a !important;
  border-color: rgba(212,180,90,0.35) !important;
}

/* Surah dropdown readable */
#surah-list-pill, #surah-reciter-pill {
  max-width: 9.5rem !important;
  color: #fff !important;
}
#surah-list-pill option, #surah-reciter-pill option {
  color: #1a2a22 !important;
  background: #fff !important;
}

/* Live button */
.live-haramain-btn.on { background: #0f4c3a !important; }
.live-haramain-btn.on .live-dot { background: #7dff9a !important; }

@media (max-width: 900px) {
  .banner-side { display: none !important; } /* mobile: less litter; salah often in strip */
  .cgp-track-row { flex-wrap: nowrap !important; }
}
`;

function injectCss(){
  var s = document.getElementById("clarity-ui-shine-css");
  if (!s) {
    s = document.createElement("style");
    s.id = "clarity-ui-shine-css";
    (document.head || document.documentElement).appendChild(s);
  }
  s.textContent = CSS;
}

/** Force track UI: intro above, all gates in one scrollable row */
function layoutTrackPlaque(){
  try {
    var sw = document.querySelector(".clarity-gate-switcher.rrra-sitewide, .clarity-gate-switcher");
    if (!sw) return;
    sw.classList.add("cgp-track-plaque");

    /* Move any intro paragraph outside the button row */
    var intro = sw.querySelector(".cgp-intro");
    if (!intro) {
      /* text node / mixed: look for leading p */
      intro = sw.querySelector("p");
    }

    var row = sw.querySelector(".cgp-track-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "cgp-track-row";
      sw.appendChild(row);
    }

    /* Collect label + buttons into row in order */
    var label = sw.querySelector(".cgs-label");
    var buttons = Array.prototype.slice.call(sw.querySelectorAll(".cgs-btn"));
    if (label && label.parentNode !== row) row.appendChild(label);
    buttons.forEach(function(btn){
      if (btn.parentNode !== row) row.appendChild(btn);
    });

    /* Ensure seeker exists */
    if (!row.querySelector('[data-gate="seeker"]')) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cgs-btn cgs-seeker";
      b.setAttribute("data-gate", "seeker");
      b.onclick = function(){ if (window.claritySwitchGate) window.claritySwitchGate("seeker"); };
      b.innerHTML = '<span class="cgs-txt"><span class="cgs-num">1</span> Seeker</span>';
      row.insertBefore(b, row.querySelector('[data-gate="new_muslim"]') || row.firstChild);
    }

    if (intro && intro.parentNode === sw) {
      sw.insertBefore(intro, row);
    }
  } catch(e){}
}

/** Clean double-filled temps / meta litter */
function declutterBanner(){
  try {
    /* Collapse duplicate temperature strings */
    document.querySelectorAll(".temp-live, #place-temp, #place-temp-alt").forEach(function(el){
      var t = (el.textContent || "").trim();
      if (!t || t === "—°C" || t === "Loading...") return;
      /* normalize "27°C °C" */
      t = t.replace(/°C\s*°C/g, "°C").replace(/\s+/g, " ");
      el.textContent = t;
    });
    /* Meta lines that concatenate festivals without space */
    document.querySelectorAll(".hijri-cal-meta, .banner-event-strip, .banner-mobile-strip").forEach(function(el){
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      el.textContent = t;
    });
  } catch(e){}
}

/** Live/Stills robust toggle */
function wireLive(){
  if (window.__shineLiveWired) return;
  window.__shineLiveWired = true;

  var STREAMS = {
    makkah: "https://www.youtube-nocookie.com/embed/Rs7St51oDDc?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
    madinah: "https://www.youtube-nocookie.com/embed/27cln-IxOGo?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1"
  };

  function place(){
    try {
      return ((document.getElementById("live-place-select") || {}).value
        || localStorage.getItem("clarity_haramain_place") || "makkah").toLowerCase();
    } catch(e){ return "makkah"; }
  }

  function setUI(on){
    var btn = document.getElementById("live-haramain-btn");
    var lab = document.getElementById("live-haramain-label");
    if (btn) btn.classList.toggle("on", !!on);
    if (lab) lab.textContent = on ? "Live" : "Stills";
    try {
      localStorage.setItem("clarity_banner_live", on ? "1" : "0");
      localStorage.setItem("clarity_haramain_live", on ? "on" : "off");
    } catch(e){}
  }

  function stills(){
    var media = document.getElementById("banner-media");
    var frame = document.getElementById("banner-live");
    if (media) {
      media.classList.remove("live-active");
      media.classList.add("live-fallback");
    }
    if (frame) {
      try { frame.src = "about:blank"; frame.removeAttribute("src"); } catch(e){}
      frame.setAttribute("hidden", "");
    }
    setUI(false);
    try {
      if (typeof setDailyBanner === "function")
        setDailyBanner(typeof bannerPlaceIdx === "number" ? bannerPlaceIdx : 0);
    } catch(e){}
  }

  function live(){
    if (location.protocol === "file:") { stills(); return; }
    var media = document.getElementById("banner-media");
    if (!media) return;
    var frame = document.getElementById("banner-live");
    if (!frame) {
      frame = document.createElement("iframe");
      frame.id = "banner-live";
      frame.className = "banner-live banner-live-iframe";
      frame.title = "Haramain live";
      frame.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      frame.setAttribute("allowfullscreen", "");
      media.appendChild(frame);
    }
    var p = place();
    var url = STREAMS[p] || STREAMS.makkah;
    frame.removeAttribute("hidden");
    frame.style.cssText = "position:absolute;inset:0;width:100%;height:100%;border:0;opacity:1;z-index:5;";
    frame.src = url;
    media.classList.add("live-active");
    media.classList.remove("live-fallback");
    setUI(true);
  }

  window.toggleHaramainLive = function(){
    var media = document.getElementById("banner-media");
    var on = media && media.classList.contains("live-active");
    if (on) stills(); else live();
  };

  var btn = document.getElementById("live-haramain-btn");
  if (btn) {
    btn.onclick = function(ev){ ev.preventDefault(); window.toggleHaramainLive(); };
  }
  var sel = document.getElementById("live-place-select");
  if (sel) {
    sel.onchange = function(){
      try { localStorage.setItem("clarity_haramain_place", place()); } catch(e){}
      var media = document.getElementById("banner-media");
      if (media && media.classList.contains("live-active")) live();
      else stills();
    };
  }
}


/** Ensure visit strip is not inside .banner (overlap source) */

/** Nuclear: keep visit strip below duo; defeat fighting scripts */
function nuclearStripLock(){
  try {
    var bar = document.getElementById("clarity-visit-pill-bar");
    var duo = document.getElementById("clarity-top-duo");
    if (!bar || !duo || !duo.parentNode) return;
    /* Always re-parent after duo */
    if (bar.previousElementSibling !== duo) {
      if (duo.nextSibling) duo.parentNode.insertBefore(bar, duo.nextSibling);
      else duo.parentNode.appendChild(bar);
    }
    bar.style.setProperty("position", "relative", "important");
    bar.style.setProperty("top", "auto", "important");
    bar.style.setProperty("bottom", "auto", "important");
    bar.style.setProperty("left", "auto", "important");
    bar.style.setProperty("right", "auto", "important");
    bar.style.setProperty("transform", "none", "important");
    bar.style.setProperty("margin-top", "0", "important");
    bar.style.setProperty("z-index", "12", "important");
    /* Banner: no max-height crush */
    var banner = duo.querySelector(".banner");
    if (banner) {
      banner.style.setProperty("max-height", "none", "important");
    }
  } catch(e){}
}

function unstickVisitStrip(){
  try {
    var bar = document.getElementById("clarity-visit-pill-bar");
    if (!bar) return;
    var banner = document.querySelector("#clarity-top-duo .banner, .banner");
    var duo = document.getElementById("clarity-top-duo");
    if (banner && banner.contains(bar) && duo) {
      /* place immediately after duo */
      if (duo.nextSibling) duo.parentNode.insertBefore(bar, duo.nextSibling);
      else duo.parentNode.appendChild(bar);
    } else if (duo && bar.previousElementSibling !== duo && !duo.contains(bar)) {
      /* already outside — ok */
    }
  } catch(e){}
}


function wireResetPill(){
  try {
    var btn = document.getElementById("clarity-path-reset-btn")
      || document.querySelector(".cgs-reset");
    if (!btn || btn.__resetWired) return;
    btn.addEventListener("click", function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      try {
        if (typeof window.clarityPathResetToSeeker === "function") {
          window.clarityPathResetToSeeker();
        } else if (window.clarityPathProgress && typeof window.clarityPathProgress.reset === "function") {
          window.clarityPathProgress.reset();
        } else {
          localStorage.setItem("clarity_path_unlocked_max", "0");
          localStorage.setItem("clarity_committed_path", "seeker");
          localStorage.removeItem("clarity_quiz_passed_v1");
          if (typeof window.clarityRequestPath === "function") window.clarityRequestPath("seeker");
        }
      } catch(e){ console.warn("reset", e); }
      try { if (typeof layoutTrackPlaque === "function") layoutTrackPlaque(); } catch(e2){}
    }, true);
    btn.__resetWired = true;
  } catch(e){}
}


function ensureMemeVisible(){
  try {
    var max = 0;
    try { max = parseInt(localStorage.getItem("clarity_path_unlocked_max")||"0",10)||0; } catch(e){}
    if (max < 2) return; /* practicing = index 2 */
    var card = document.getElementById("meme-card");
    if (!card) return;
    card.classList.remove("gate-hidden");
    card.removeAttribute("data-gate-hidden");
    card.style.removeProperty("display");
    card.style.removeProperty("visibility");
  } catch(e){}
}

function boot(){
  injectCss();
  layoutTrackPlaque();
  declutterBanner();
  wireLive();
  wireResetPill();
  ensureMemeVisible();
  unstickVisitStrip();
  nuclearStripLock();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 60); });
else setTimeout(boot, 60);
window.addEventListener("load", function(){
  setTimeout(boot, 200);
  setTimeout(layoutTrackPlaque, 500);
  setTimeout(declutterBanner, 800);
  setTimeout(declutterBanner, 2500);
  setTimeout(unstickVisitStrip, 100);
  setTimeout(unstickVisitStrip, 600);
  var n = 0;
  var iv = setInterval(function(){
    nuclearStripLock();
    n++;
    if (n > 24) clearInterval(iv);
  }, 500);
});
})();
