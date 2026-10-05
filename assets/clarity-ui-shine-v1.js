(function(){
"use strict";
if (window.__CLARITY_UI_SHINE_V1__) return;
window.__CLARITY_UI_SHINE_V1__ = true;

var CSS = `
/* ===== Clarity UI shine — plaques + matched nav colors ===== */
:root{
  --rrra-rem:#0d4f3c;
  --rrra-rem-soft:#d8f0e4;
  --rrra-rem-mid:#1a6b52;
  --rrra-real:#8a6a28;
  --rrra-real-soft:#f5edd6;
  --rrra-real-mid:#b8922a;
  --rrra-refl:#2c4a3a;
  --rrra-refl-soft:#e4f0d4;
  --rrra-refl-mid:#3d7a35;
  --rrra-act:#2a5f7a;
  --rrra-act-soft:#e0f0f5;
  --rrra-act-mid:#356a90;
  --rrra-vault:#4a3a70;
  --rrra-vault-soft:#efe8f8;
  --rrra-vault-mid:#5a4a90;
}

/* Track pills — one plaque strip */
.clarity-gate-switcher.rrra-sitewide,
.clarity-gate-switcher,
#clarity-path-plaque,
.cgp-track-plaque{
  display:flex !important;
  flex-wrap:wrap !important;
  align-items:center !important;
  gap:0.4rem !important;
  margin:0.65rem 0 0.85rem !important;
  padding:0.55rem 0.7rem !important;
  border-radius:16px !important;
  background:linear-gradient(145deg, rgba(255,253,248,0.96), rgba(232,242,236,0.92)) !important;
  border:1px solid rgba(13,79,60,0.18) !important;
  box-shadow:0 4px 16px rgba(13,50,40,0.08), inset 0 1px 0 rgba(255,255,255,0.85) !important;
}
html[data-theme="dark"] .clarity-gate-switcher.rrra-sitewide,
html[data-theme="dark"] .cgp-track-plaque{
  background:linear-gradient(145deg, rgba(18,28,24,0.95), rgba(12,22,18,0.92)) !important;
  border-color:rgba(212,180,90,0.25) !important;
}
.clarity-gate-switcher .cgs-label,
.cgp-track-plaque .cgs-label{
  font-size:0.68rem !important;
  font-weight:800 !important;
  letter-spacing:0.06em !important;
  text-transform:uppercase !important;
  color:var(--rrra-rem) !important;
  margin-right:0.15rem !important;
  flex-shrink:0 !important;
}
.cgs-btn, .gps-btn.gps-phase{
  border-radius:999px !important;
  padding:0.32rem 0.7rem !important;
  font-size:0.72rem !important;
  font-weight:700 !important;
  border:1.5px solid transparent !important;
  box-shadow:0 1px 4px rgba(0,0,0,0.08) !important;
}
.cgs-seeker, .gps-seeker{ background:linear-gradient(180deg,#f8f0d8,#f0e4c0) !important; color:#6a4a18 !important; border-color:#d4b45a !important; }
.cgs-new_muslim, .gps-new_muslim{ background:linear-gradient(180deg,#d8f5e8,#c0ecd8) !important; color:#0a3d2e !important; border-color:#5a9e7a !important; }
.cgs-practicing, .gps-practicing{ background:linear-gradient(180deg,#d8eef5,#c0e0ec) !important; color:#1a4a5a !important; border-color:#4a8ab0 !important; }
.cgs-dai, .gps-dai{ background:linear-gradient(180deg,#e8e0f5,#d8d0ec) !important; color:#3a2a5a !important; border-color:#7a6ab0 !important; }
.cgs-btn.active, .cgs-btn.is-active, .gps-btn.active{
  box-shadow:0 0 0 2px rgba(13,79,60,0.25), 0 2px 8px rgba(0,0,0,0.12) !important;
  transform:translateY(-1px);
}
.cgs-reset{
  background:rgba(13,79,60,0.08) !important;
  color:var(--rrra-rem) !important;
  border-color:rgba(13,79,60,0.25) !important;
}

/* Hub intro → plaques */
.rrra-hub-hero,
.rrra-hub-summary,
[data-rrra-hub] > .rrra-hub-hero{
  border-radius:18px !important;
  padding:1rem 1.15rem !important;
  margin:0.35rem 0 0.75rem !important;
  border:1px solid transparent !important;
  box-shadow:0 6px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5) !important;
}
.rrra-hub-hero h2{
  margin:0 0 0.25rem !important;
  font-size:1.35rem !important;
  font-family:'Cormorant Garamond',serif !important;
}
.rrra-hub-sub{ margin:0 !important; font-size:0.9rem !important; line-height:1.45 !important; opacity:0.92; }
.rrra-hub-meta{
  display:inline-block !important;
  margin-top:0.45rem !important;
  font-size:0.68rem !important;
  font-weight:700 !important;
  letter-spacing:0.04em !important;
  text-transform:uppercase !important;
  padding:0.2rem 0.55rem !important;
  border-radius:999px !important;
  background:rgba(255,255,255,0.45) !important;
}
.rrra-hub-summary{
  font-size:0.86rem !important;
  line-height:1.5 !important;
  margin-top:0.15rem !important;
}

/* Per-tab plaque colors */
[data-rrra="reminder"].rrra-hub-hero,
#tab-reminder .rrra-hub-hero{
  background:linear-gradient(145deg, var(--rrra-rem-soft), #e8f8f0) !important;
  border-color:rgba(13,79,60,0.28) !important;
  color:#0a2e22 !important;
}
[data-rrra="reminder"].rrra-hub-hero h2{ color:var(--rrra-rem) !important; }
#tab-reminder .rrra-hub-summary{
  background:linear-gradient(145deg, #eef8f2, var(--rrra-rem-soft)) !important;
  border-color:rgba(13,79,60,0.2) !important;
  color:#1a3a2e !important;
}

[data-rrra="reality"].rrra-hub-hero,
#tab-reality .rrra-hub-hero{
  background:linear-gradient(145deg, var(--rrra-real-soft), #faf6e8) !important;
  border-color:rgba(184,146,42,0.4) !important;
  color:#3a2a10 !important;
}
[data-rrra="reality"].rrra-hub-hero h2{ color:var(--rrra-real) !important; }
#tab-reality .rrra-hub-summary{
  background:linear-gradient(145deg, #faf6e8, var(--rrra-real-soft)) !important;
  border-color:rgba(184,146,42,0.3) !important;
}

[data-rrra="reflection"].rrra-hub-hero,
#tab-reflection .rrra-hub-hero{
  background:linear-gradient(145deg, var(--rrra-refl-soft), #eef5e0) !important;
  border-color:rgba(61,122,53,0.35) !important;
  color:#1a2e14 !important;
}
[data-rrra="reflection"].rrra-hub-hero h2{ color:var(--rrra-refl-mid) !important; }
#tab-reflection .rrra-hub-summary{
  background:linear-gradient(145deg, #eef5e0, var(--rrra-refl-soft)) !important;
  border-color:rgba(61,122,53,0.25) !important;
}

[data-rrra="action"].rrra-hub-hero,
#tab-action .rrra-hub-hero{
  background:linear-gradient(145deg, var(--rrra-act-soft), #e8f4fa) !important;
  border-color:rgba(42,95,122,0.35) !important;
  color:#123040 !important;
}
[data-rrra="action"].rrra-hub-hero h2{ color:var(--rrra-act) !important; }
#tab-action .rrra-hub-summary{
  background:linear-gradient(145deg, #e8f4fa, var(--rrra-act-soft)) !important;
  border-color:rgba(42,95,122,0.25) !important;
}

#tab-notes .rrra-hub-hero,
[data-rrra="notes"].rrra-hub-hero,
#tab-notes > .card:first-child h2{
  /* vault plaque accent via rail */
}

/* Bottom door rail + mobile bottom nav — match hub colors */
#clarity-door-rail.door-rail-bottom,
#clarity-door-rail.door-rail-rrra5{
  background:rgba(12,24,20,0.96) !important;
  border-top:1px solid rgba(212,180,90,0.2) !important;
}
.door-rail-btn.rrra-rail-rem{
  background:linear-gradient(180deg, var(--rrra-rem-mid), var(--rrra-rem)) !important;
  color:#f0faf4 !important;
  border-color:rgba(255,255,255,0.15) !important;
}
.door-rail-btn.rrra-rail-real{
  background:linear-gradient(180deg, var(--rrra-real-mid), var(--rrra-real)) !important;
  color:#1a1208 !important;
  border-color:rgba(255,255,255,0.2) !important;
}
.door-rail-btn.rrra-rail-refl{
  background:linear-gradient(180deg, var(--rrra-refl-mid), var(--rrra-refl)) !important;
  color:#f0f8e8 !important;
  border-color:rgba(255,255,255,0.15) !important;
}
.door-rail-btn.rrra-rail-act{
  background:linear-gradient(180deg, var(--rrra-act-mid), var(--rrra-act)) !important;
  color:#f0f8fc !important;
  border-color:rgba(255,255,255,0.15) !important;
}
.door-rail-btn.rrra-rail-vault{
  background:linear-gradient(180deg, var(--rrra-vault-mid), var(--rrra-vault)) !important;
  color:#f4f0fc !important;
  border-color:rgba(255,255,255,0.15) !important;
}
.door-rail-btn.active{
  box-shadow:0 0 0 2px rgba(255,255,255,0.45), 0 -2px 12px rgba(0,0,0,0.25) !important;
  filter:brightness(1.08);
  transform:translateY(-2px);
}

/* Mobile bottom tabs */
.mobile-bottom-nav .mb-tab[data-tab="reminder"],
.mobile-bottom-nav .mb-tab[data-rrra="reminder"]{ color:var(--rrra-rem-mid) !important; }
.mobile-bottom-nav .mb-tab[data-tab="reality"],
.mobile-bottom-nav .mb-tab[data-rrra="reality"]{ color:var(--rrra-real-mid) !important; }
.mobile-bottom-nav .mb-tab[data-tab="reflection"],
.mobile-bottom-nav .mb-tab[data-rrra="reflection"]{ color:var(--rrra-refl-mid) !important; }
.mobile-bottom-nav .mb-tab[data-tab="action"],
.mobile-bottom-nav .mb-tab[data-rrra="action"]{ color:var(--rrra-act-mid) !important; }
.mobile-bottom-nav .mb-tab[data-tab="notes"],
.mobile-bottom-nav .mb-tab[data-rrra="notes"]{ color:var(--rrra-vault-mid) !important; }
.mobile-bottom-nav .mb-tab.active{
  background:rgba(13,79,60,0.08) !important;
  border-radius:12px 12px 0 0 !important;
  font-weight:800 !important;
}
.mobile-bottom-nav .mb-tab[data-tab="reminder"].active{ background:rgba(13,79,60,0.12) !important; }
.mobile-bottom-nav .mb-tab[data-tab="reality"].active{ background:rgba(184,146,42,0.15) !important; }
.mobile-bottom-nav .mb-tab[data-tab="reflection"].active{ background:rgba(61,122,53,0.12) !important; }
.mobile-bottom-nav .mb-tab[data-tab="action"].active{ background:rgba(42,95,122,0.12) !important; }
.mobile-bottom-nav .mb-tab[data-tab="notes"].active{ background:rgba(90,74,144,0.12) !important; }

html[data-theme="dark"] .rrra-hub-hero{
  box-shadow:0 6px 20px rgba(0,0,0,0.35) !important;
}
html[data-theme="dark"] #tab-reminder .rrra-hub-hero{
  background:linear-gradient(145deg,#0e2820,#0a1c16) !important; color:#e8f0ea !important;
}
html[data-theme="dark"] #tab-reality .rrra-hub-hero{
  background:linear-gradient(145deg,#2a2210,#1a160c) !important; color:#f5edd6 !important;
}
html[data-theme="dark"] #tab-reflection .rrra-hub-hero{
  background:linear-gradient(145deg,#142414,#0c180c) !important; color:#e4f0d4 !important;
}
html[data-theme="dark"] #tab-action .rrra-hub-hero{
  background:linear-gradient(145deg,#0c2428,#0a1a1c) !important; color:#e0f0f5 !important;
}

/* Live button readable when on */
.live-haramain-btn.on{
  background:#0f4c3a !important;
}
.live-haramain-btn.on .live-dot{ background:#7dff9a !important; }
`;

function inject(){
  if (document.getElementById("clarity-ui-shine-css")) return;
  var s = document.createElement("style");
  s.id = "clarity-ui-shine-css";
  s.textContent = CSS;
  (document.head || document.documentElement).appendChild(s);
}

/** Wrap track switcher into one plaque if fragmented */
function plaqueTrack(){
  try {
    var sw = document.querySelector(".clarity-gate-switcher.rrra-sitewide, .clarity-gate-switcher");
    if (!sw) return;
    sw.classList.add("cgp-track-plaque");
    if (!sw.querySelector(".cgs-label")) {
      var lab = document.createElement("span");
      lab.className = "cgs-label";
      lab.textContent = "Track";
      sw.insertBefore(lab, sw.firstChild);
    }
  } catch(e){}
}

function boot(){
  inject();
  plaqueTrack();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 80); });
else setTimeout(boot, 80);
window.addEventListener("load", function(){ setTimeout(boot, 200); });
})();
