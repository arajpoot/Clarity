/* Clarity polish wiring v2 — ported from banner2 reference, factored for publish */
(function(){
"use strict";
if (window.__CLARITY_POLISH_WIRING_V2__) return;
window.__CLARITY_POLISH_WIRING_V2__ = true;
function injectStyle(id, css){
  try{
    if(document.getElementById(id)) return;
    var s=document.createElement("style"); s.id=id; s.textContent=css; document.head.appendChild(s);
  }catch(e){}
}
injectStyle('clarity-doors-flow-css-v1', `
/* Dai phase — never force-hide content cards */
html[data-clarity-path="dai"] .card.gate-hidden,
html[data-clarity-path="dai"] [id$="-card"].gate-hidden,
html[data-clarity-path="dai"] .card[data-gate-hidden="1"],
html[data-clarity-path="dai"] [id$="-card"][data-gate-hidden="1"] {
  display: block !important;
  visibility: visible !important;
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}
html[data-clarity-path="dai"] .cgs-btn.path-locked {
  opacity: 1 !important;
  pointer-events: auto !important;
}
/* Smooth door panel transitions */
.tab-panel {
  transition: opacity 0.2s ease;
}
.tab-panel.active {
  display: block !important;
  opacity: 1 !important;
}
body.section-open #main-application-workspace,
body.section-open .page-wrapper {
  scroll-margin-top: 0.5rem;
}
`);

/* --- clarity-doors-flow-js-v1 --- */

(function(){
  "use strict";
  if (window.__CLARITY_DOORS_FLOW_V1__) return;
  window.__CLARITY_DOORS_FLOW_V1__ = true;

  var ORDER = ["seeker","new_muslim","practicing","dai"];

  function pathNow(){
    try {
      return document.documentElement.getAttribute("data-clarity-path")
        || localStorage.getItem("clarity_committed_path")
        || "seeker";
    } catch(e){ return "seeker"; }
  }

  function showEl(el){
    if (!el) return;
    el.classList.remove("gate-hidden");
    el.removeAttribute("data-gate-hidden");
    el.hidden = false;
    try {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("height");
      el.style.removeProperty("max-height");
      el.style.removeProperty("opacity");
      el.style.removeProperty("pointer-events");
      el.style.removeProperty("overflow");
    } catch(e){}
  }

  function openAllSections(){
    /* Only Dai may force-open the full library. Other paths stay curriculum-confined. */
    var gate = pathNow();
    if (gate !== "dai") {
      /* Do not call reapply here — path-progress already applied on switch; calling it
         from every openAll/heal path caused extra cascades and freezes. */
      return;
    }
    document.querySelectorAll(".card, [id$='-card']").forEach(showEl);
    var lock = document.getElementById("clarity-path-lock");
    if (lock) lock.textContent = "/* dai: all open */";
    document.body.setAttribute("data-meme-studio-open", "1");
    try {
      document.documentElement.setAttribute("data-clarity-meme-ok", "1");
      document.body.setAttribute("data-clarity-meme-ok", "1");
    } catch(eOk){}
    try { if (typeof window.clarityMemeUiSync === "function") window.clarityMemeUiSync(); } catch(e){}
  }

  function unlockPathUi(){
    document.querySelectorAll(".cgs-btn.path-locked").forEach(function(btn){
      btn.classList.remove("path-locked");
    });
  }

  function onPath(gate){
    gate = gate || pathNow();
    try {
      document.documentElement.setAttribute("data-clarity-path", gate);
      document.body.setAttribute("data-clarity-path", gate);
    } catch(e){}
    if (gate === "dai") {
      openAllSections();
      unlockPathUi();
    }
  }

  /* Smooth door open — ensure panel + rail stay in sync */
  var prevDoor = window.clarityOpenSectionDoor;
  if (typeof prevDoor === "function" && !prevDoor.__flowV1) {
    window.clarityOpenSectionDoor = function(tabId){
      tabId = String(tabId || "journey");
      /* If on dai, make sure nothing is gate-hidden before switch */
      if (pathNow() === "dai") openAllSections();
      var r;
      try { r = prevDoor.apply(this, arguments); } catch(e){ console.warn(e); }
      try {
        document.querySelectorAll(".tab-panel").forEach(function(p){
          var on = p.id === ("tab-" + tabId);
          p.classList.toggle("active", on);
          if (on) {
            p.hidden = false;
            p.style.removeProperty("display");
          }
        });
        document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function(btn){
          btn.classList.toggle("active", btn.getAttribute("data-rail-tab") === tabId);
        });
        document.body.setAttribute("data-active-tab", tabId);
      } catch(e2){}
      return r;
    };
    window.clarityOpenSectionDoor.__flowV1 = true;
  }

  /* Listen once — do not wrap path APIs (wrapping caused lag on every switch) */
  window.addEventListener("clarity-path-changed", function (ev) {
    var g = (ev && ev.detail && ev.detail.gate) || pathNow();
    onPath(g);
  });

  /* Force max unlock so dai is reachable without stuck quiz gate (user asked highest phase open) */
  try {
    if (localStorage.getItem("clarity_path_max") != null) {
      /* leave progress, but if already dai committed, open all */
    }
  } catch(e){}

  function boot(){
    onPath(pathNow());
    if (pathNow() === "dai") openAllSections();
    /* path-progress owns filter for non-dai; no extra reapply from polish */
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 300); });
  else setTimeout(boot, 300);
  window.addEventListener("load", function(){ setTimeout(boot, 500); });

  /* Soft heal: dai only, once after settle — never re-enter path filter */
  var __doorsHealDone = false;
  function softDoorsHeal(){
    if (__doorsHealDone) return;
    if (pathNow() !== "dai") return;
    var hidden = document.querySelectorAll(".card.gate-hidden, [id$='-card'][data-gate-hidden='1']");
    if (hidden.length) openAllSections();
    __doorsHealDone = true;
  }
  setTimeout(softDoorsHeal, 800);
  setTimeout(softDoorsHeal, 2200);
  window.addEventListener("clarity-path-changed", function(){
    __doorsHealDone = false;
    if (pathNow() === "dai") setTimeout(softDoorsHeal, 400);
  });

  window.clarityDoorsFlow = { openAll: openAllSections, onPath: onPath };
})();

injectStyle('clarity-banner-nuclear-css', `
/* Nuclear: banner is a fixed clip box. Media cannot affect document flow. */
#clarity-top-duo {
  position: relative !important;
  z-index: 20 !important;
  overflow: visible !important;
}
#clarity-top-duo .banner,
.banner {
  position: relative !important;
  display: block !important;
  overflow: hidden !important;
  isolation: isolate !important;
  /* height comes only from overlay; media never contributes */
  height: auto !important;
  min-height: 9.5rem !important;
  max-height: 18rem !important;
  z-index: 1 !important;
}
#clarity-top-duo .banner-overlay,
.banner-overlay {
  position: relative !important;
  z-index: 3 !important;
  display: flex !important;
}
/* Media layer: painted only inside banner, zero layout size contribution */
#clarity-top-duo .banner-media,
.banner-media,
#banner-media {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  z-index: 0 !important;
  pointer-events: none !important;
  /* critical: do not let children escape paint */
  contain: strict !important;
  clip: rect(0, auto, auto, 0) !important;
  clip-path: inset(0) !important;
}
#banner-img,
.banner-still-img,
#banner-live,
.banner-live-iframe,
.banner-media img,
.banner-media iframe {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  max-height: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  padding: 0 !important;
  object-fit: cover !important;
  transform: none !important;
  inset: auto !important; /* override any inset:-18% leftovers */
}
/* Hidden live = no paint, no decode */
#banner-live[hidden],
.banner-live-iframe[hidden],
#banner-live:not([src]),
.banner-media:not(.live-active) #banner-live {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
}
/* Anything that escaped the banner — kill it */
body > #banner-live,
body > #banner-img,
body > .banner-media,
#main-application-workspace > #banner-live,
#main-application-workspace > #banner-img,
.page-wrapper > iframe[src*="youtube"] {
  display: none !important;
  height: 0 !important;
  width: 0 !important;
}
/* Content must start cleanly under duo */
#clarity-visit-pill-bar,
#clarity-grave-path-strip,
#main-application-workspace,
.main-content {
  position: relative !important;
  z-index: 2 !important;
  clear: both !important;
}
`);

/* --- clarity-banner-nuclear-js --- */

(function(){
  "use strict";
  if (window.__CLARITY_BANNER_NUCLEAR__) return;
  window.__CLARITY_BANNER_NUCLEAR__ = true;

  function nuclear() {
    var banner = document.querySelector("#clarity-top-duo .banner") || document.querySelector(".banner");
    if (!banner) return;

    var overlay = banner.querySelector(".banner-overlay");
    var media = document.getElementById("banner-media") || banner.querySelector(".banner-media");
    var ifr = document.getElementById("banner-live");
    var img = document.getElementById("banner-img");

    /* Always re-parent media as first child of banner */
    if (media) {
      if (media.parentNode !== banner) banner.insertBefore(media, banner.firstChild);
      media.setAttribute("aria-hidden", "true");
    }
    if (img && media && img.parentNode !== media) media.appendChild(img);
    if (ifr && media && ifr.parentNode !== media) media.appendChild(ifr);

    /* Size banner from overlay only */
    if (overlay) {
      var h = overlay.offsetHeight;
      if (h > 80) {
        banner.style.height = h + "px";
        banner.style.maxHeight = Math.min(h, 280) + "px";
      }
    }
    banner.style.overflow = "hidden";

    /* Live off by default unless media has live-active */
    if (ifr && media && !media.classList.contains("live-active")) {
      ifr.setAttribute("hidden", "");
      try {
        if (ifr.src) { ifr.src = ""; ifr.removeAttribute("src"); }
      } catch(e){}
    }

    /* Destroy escaped clones */
    document.querySelectorAll("#banner-live, #banner-img, .banner-media").forEach(function(node){
      if (!banner.contains(node)) {
        try { node.remove(); } catch(e) { node.style.display = "none"; }
      }
    });
  }

  /* When user enables Live, allow src then re-clip */
  function wrapLive() {
    var btn = document.getElementById("live-haramain-btn");
    if (btn && !btn.__nuclear) {
      btn.addEventListener("click", function(){ setTimeout(nuclear, 50); setTimeout(nuclear, 300); }, true);
      btn.__nuclear = true;
    }
  }

  function boot(){ nuclear(); wrapLive(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  window.addEventListener("load", function(){ setTimeout(nuclear, 200); setTimeout(nuclear, 800); });
  var __nuclearResizeT = 0;
  window.addEventListener("resize", function(){
    clearTimeout(__nuclearResizeT);
    __nuclearResizeT = setTimeout(nuclear, 120);
  });
})();


/* --- clarity-security-pass-v3 --- */

(function(){
  "use strict";
  if (window.__CLARITY_SECURITY_PASS_V3__) return;
  window.__CLARITY_SECURITY_PASS_V3__ = true;

  window.claritySecurityAudit = function(){
    var report = {
      ok: true,
      ts: Date.now(),
      build: "banner-nuclear+path+curriculum",
      vault: {
        tree: !!document.getElementById("user-family-tree-card"),
        uftKey: window.UFT_KEY || "clarity_user_family_tree_v1",
        uftRead: typeof window.uftRead === "function",
        cryptoSubtle: !!(window.crypto && window.crypto.subtle)
      },
      path: {
        attr: document.documentElement.getAttribute("data-clarity-path"),
        request: typeof window.clarityRequestPath === "function",
        reset: typeof window.clarityPathResetToSeeker === "function"
      },
      banner: {
        duo: !!document.getElementById("clarity-top-duo"),
        media: !!document.getElementById("banner-media"),
        live: !!document.getElementById("banner-live"),
        visitOutsideBanner: (function(){
          var v = document.getElementById("clarity-visit-pill-bar");
          var b = document.querySelector(".banner");
          return !!(v && b && !b.contains(v));
        })()
      },
      storage: { keys: 0, suspicious: [] },
      external: { scripts: 0, frames: 0 },
      notes: []
    };
    try {
      if (report.vault.uftKey !== "clarity_user_family_tree_v1") {
        report.ok = false;
        report.notes.push("unexpected UFT_KEY");
      }
    } catch(e){}
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i) || "";
        report.storage.keys++;
        if (/passphrase|plaintext.?key|(^|_)password$|secret.?key/i.test(k)) {
          report.storage.suspicious.push(k);
          report.ok = false;
          report.notes.push("suspicious storage key: " + k);
        }
      }
    } catch(e){}
    try {
      document.querySelectorAll("script[src]").forEach(function(s){
        report.external.scripts++;
        var src = s.getAttribute("src") || "";
        if (/^https?:/i.test(src) && !/fonts\.googleapis|fonts\.gstatic|youtube|flickr/i.test(src)) {
          report.notes.push("external script: " + src.slice(0, 80));
        }
      });
      document.querySelectorAll("iframe[src]").forEach(function(f){
        report.external.frames++;
        var src = f.getAttribute("src") || "";
        if (src && !/youtube\.com|youtube-nocookie\.com/i.test(src)) {
          report.notes.push("non-youtube iframe: " + src.slice(0, 80));
        }
      });
    } catch(e){}
    try {
      document.querySelectorAll("input[type='password']").forEach(function(inp){
        if (!inp.getAttribute("autocomplete")) inp.setAttribute("autocomplete", "current-password");
      });
    } catch(e){}
    if (!report.banner.visitOutsideBanner) {
      report.notes.push("visit bar still inside banner — layout risk");
    }
    window.__CLARITY_SECURITY_REPORT__ = report;
    return report;
  };

  setTimeout(function(){ try { claritySecurityAudit(); } catch(e){} }, 1200);
})();

injectStyle('clarity-visit-strip-visible', `
#clarity-visit-pill-bar,
.cv-stitched-banner {
  display: flex !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 0.35rem !important;
  min-height: 2.35rem !important;
  max-height: none !important;
  padding: 0.35rem 0.55rem !important;
  margin: 0 !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  -webkit-overflow-scrolling: touch;
  position: relative !important;
  z-index: 25 !important;
  background: linear-gradient(180deg, #0f241c 0%, #0c1c16 100%) !important;
  border-bottom: 1px solid rgba(212, 180, 90, 0.28) !important;
  color: #e8f0ea !important;
  font-size: 0.72rem !important;
  visibility: visible !important;
  opacity: 1 !important;
}
#clarity-visit-pill-bar .cv-label {
  font-weight: 800 !important;
  letter-spacing: 0.06em !important;
  text-transform: uppercase !important;
  color: var(--gold, #d4b45a) !important;
  flex-shrink: 0 !important;
}
#clarity-visit-pill-bar .cv-hint {
  opacity: 0.75 !important;
  flex-shrink: 0 !important;
}
#clarity-visit-pill-bar a,
#clarity-visit-pill-bar button,
#clarity-visit-pill-bar .cv-pill {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.2rem !important;
  padding: 0.2rem 0.5rem !important;
  border-radius: 999px !important;
  background: rgba(255,255,255,0.08) !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  color: #e8f0ea !important;
  white-space: nowrap !important;
  text-decoration: none !important;
  font-size: 0.68rem !important;
}
html[data-theme="light"] #clarity-visit-pill-bar,
html[data-theme="day"] #clarity-visit-pill-bar {
  background: linear-gradient(180deg, #e8f5ee, #dceee4) !important;
  color: #0c1a14 !important;
  border-bottom-color: #a8c9b6 !important;
}
html[data-theme="light"] #clarity-visit-pill-bar .cv-label,
html[data-theme="day"] #clarity-visit-pill-bar .cv-label {
  color: #0a3d2e !important;
}
html[data-theme="light"] #clarity-visit-pill-bar a,
html[data-theme="light"] #clarity-visit-pill-bar .cv-pill,
html[data-theme="day"] #clarity-visit-pill-bar a,
html[data-theme="day"] #clarity-visit-pill-bar .cv-pill {
  background: rgba(13,79,60,0.08) !important;
  color: #0c1a14 !important;
  border-color: #a8c9b6 !important;
}
/* Banner may grow for stream/volume row; strip stays below in flow */
#clarity-top-duo .banner {
  max-height: none !important;
  overflow: hidden !important;
}
#clarity-visit-pill-bar,
.cv-stitched-banner {
  position: relative !important;
  z-index: 12 !important;
  top: auto !important;
  bottom: auto !important;
  margin-top: 0 !important;
  clear: both !important;
}
`);
injectStyle('clarity-tj-meme-tweet-revamp-css', `
/* —— Tajweed record level meter —— */
.tj-lmr-live-meter,
#tj-lmr-meter-host {
  margin: 0.45rem 0 0.35rem !important;
  padding: 0.4rem 0.55rem !important;
  border-radius: 12px !important;
  background: rgba(0,0,0,0.22) !important;
  border: 1px solid rgba(212,180,90,0.25) !important;
}
.tj-lmr-live-meter .meter-label,
.meter-label {
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.04em !important;
  text-transform: uppercase !important;
  color: var(--gold, #d4b45a) !important;
  margin-bottom: 0.25rem !important;
}
.tj-lmr-live-meter .meter-track,
.meter-track {
  height: 0.55rem !important;
  border-radius: 999px !important;
  background: rgba(255,255,255,0.12) !important;
  overflow: hidden !important;
  position: relative !important;
}
.tj-lmr-live-meter .meter-fill,
#tj-lmr-meter-fill,
.meter-fill {
  height: 100% !important;
  width: 0%;
  border-radius: 999px !important;
  background: linear-gradient(90deg, #1a6b52, #d4b45a 70%, #e8c84a) !important;
  transition: width 0.06s linear !important;
  box-shadow: 0 0 8px rgba(212,180,90,0.45) !important;
}
.tj-lmr-live-meter.recording .meter-track {
  box-shadow: inset 0 0 0 1px rgba(212,180,90,0.35);
}
html[data-theme="light"] .tj-lmr-live-meter,
html[data-theme="day"] .tj-lmr-live-meter {
  background: rgba(13,79,60,0.08) !important;
}
html[data-theme="light"] .meter-track,
html[data-theme="day"] .meter-track {
  background: rgba(13,79,60,0.12) !important;
}

/* Indo-Pak style hint in meme font select */
#meme-font option[value="indopak"],
#meme-font option[value="nastaliq"] {
  font-weight: 600;
}
`);

/* --- clarity-tj-meme-tweet-revamp-js --- */

(function(){
  "use strict";
  if (window.__CLARITY_TJ_MEME_TWEET_REVAMP__) return;
  window.__CLARITY_TJ_MEME_TWEET_REVAMP__ = true;

  /* ========== 1. Tajweed level meter fix ========== */
  function ensureMeterCss(){ /* style tag handles look */ }

  function startMeterFromStream(stream) {
    try {
      if (!stream) return;
      var step = document.querySelector("#tj-lmr-step3, #tj-lmr-panel, .tj-lmr-panel") || document.getElementById("tj-lmr");
      var meter = document.querySelector(".tj-lmr-live-meter");
      if (!meter && step) {
        meter = document.createElement("div");
        meter.className = "tj-lmr-live-meter";
        meter.innerHTML = '<div class="meter-label">Input level</div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill"></div></div>';
        step.appendChild(meter);
      }
      if (meter) meter.classList.add("recording");
      var fill = document.getElementById("tj-lmr-meter-fill");
      if (!fill && meter) fill = meter.querySelector(".meter-fill");

      if (window.__lmrMeterRaf) cancelAnimationFrame(window.__lmrMeterRaf);
      try { if (window.__lmrMeterCtx) window.__lmrMeterCtx.close(); } catch(e){}

      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      if (ctx.state === "suspended") ctx.resume();
      var src = ctx.createMediaStreamSource(stream);
      var an = ctx.createAnalyser();
      an.fftSize = 1024;
      an.smoothingTimeConstant = 0.45;
      src.connect(an);
      var data = new Uint8Array(an.fftSize);
      window.__lmrMeterCtx = ctx;
      window.__lmrMeterAn = an;

      (function tick(){
        if (!window.__lmrMeterAn) return;
        try {
          window.__lmrMeterAn.getByteTimeDomainData(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) {
            var v = (data[i] - 128) / 128;
            sum += v * v;
          }
          var rms = Math.sqrt(sum / data.length);
          var pct = Math.min(100, Math.max(0, Math.round(rms * 520)));
          var f = document.getElementById("tj-lmr-meter-fill") || (meter && meter.querySelector(".meter-fill"));
          if (f) f.style.width = pct + "%";
        } catch(e){}
        window.__lmrMeterRaf = requestAnimationFrame(tick);
      })();
    } catch(err) { console.warn("[Clarity] meter", err); }
  }
  function stopMeter() {
    if (window.__lmrMeterRaf) cancelAnimationFrame(window.__lmrMeterRaf);
    window.__lmrMeterRaf = null;
    window.__lmrMeterAn = null;
    try { if (window.__lmrMeterCtx) window.__lmrMeterCtx.close(); } catch(e){}
    window.__lmrMeterCtx = null;
    var f = document.getElementById("tj-lmr-meter-fill");
    if (f) f.style.width = "0%";
    document.querySelectorAll(".tj-lmr-live-meter").forEach(function(m){ m.classList.remove("recording"); });
  }
  window.clarityTjStartMeter = startMeterFromStream;
  window.clarityTjStopMeter = stopMeter;

  /* Hook getUserMedia success paths if record starts */
  var _gum = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) : null;
  if (_gum && !navigator.mediaDevices.getUserMedia.__meterHook) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return _gum(constraints).then(function(stream) {
        try {
          if (constraints && constraints.audio) startMeterFromStream(stream);
        } catch(e){}
        return stream;
      });
    };
    navigator.mediaDevices.getUserMedia.__meterHook = true;
  }
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("#tj-lmr-rec-stop, #tj-lmr-rec-btn");
    if (t && /stop/i.test(t.id || t.textContent || "")) setTimeout(stopMeter, 80);
  }, true);

  /* ========== 2. Indo-Pak Arabic (Nastaliq) for meme canvas ========== */
  var INDO_FONT = '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Scheherazade New", "Noto Naskh Arabic", serif';

  function loadIndoFont() {
    try {
      if (document.getElementById("clarity-indopak-font-link")) return;
      var link = document.createElement("link");
      link.id = "clarity-indopak-font-link";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    } catch(e){}
  }
  loadIndoFont();

  function autoFitArabic(ctx, text, maxW, maxH, basePx) {
    var size = basePx || 42;
    var min = 14;
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    while (size > min) {
      ctx.font = "600 " + size + "px " + INDO_FONT;
      var lines = String(text || "").split(/\n/);
      var widest = 0, totalH = 0;
      lines.forEach(function(line){
        var m = ctx.measureText(line);
        widest = Math.max(widest, m.width);
        totalH += size * 1.55;
      });
      if (widest <= maxW && totalH <= maxH) break;
      size -= 1;
    }
    return size;
  }

  function applyIndoToMemeState(arabic) {
    try {
      if (!window.memeState) window.memeState = {};
      memeState.font = "indopak";
      memeState.arabicFont = INDO_FONT;
      if (arabic) {
        /* prefer mid or top for Arabic block */
        if (!memeState.mid) memeState.mid = arabic;
        else if (!memeState.top) memeState.top = arabic;
      }
      var sel = document.getElementById("meme-font");
      if (sel) {
        var opt = sel.querySelector('option[value="indopak"]');
        if (!opt) {
          opt = document.createElement("option");
          opt.value = "indopak";
          opt.textContent = "Indo-Pak (Nastaliq)";
          sel.appendChild(opt);
        }
        sel.value = "indopak";
      }
    } catch(e){}
  }

  /* Wrap memeDraw to use Indo-Pak when font is indopak / arabic verse */
  function wrapMemeDraw() {
    var prev = window.memeDraw;
    if (typeof prev !== "function" || prev.__indoPak) return;
    window.memeDraw = function() {
      try {
        var st = window.memeState || {};
        var useIndo = st.font === "indopak" || st.font === "nastaliq" || st.font === "arabic";
        if (useIndo) {
          st.arabicFont = INDO_FONT;
          /* temporarily force canvas font via measure path after draw */
        }
      } catch(e){}
      var r = prev.apply(this, arguments);
      try {
        var canvas = typeof memeGetCanvas === "function" ? memeGetCanvas() : document.querySelector("#meme-canvas, canvas.meme-canvas");
        var st2 = window.memeState || {};
        if (canvas && (st2.font === "indopak" || st2.font === "nastaliq")) {
          var ctx = canvas.getContext("2d");
          var ar = st2.mid || st2.top || st2.text || "";
          if (ar && /[\u0600-\u06FF]/.test(ar)) {
            /* soft re-stamp mid Arabic with fitted Nastaliq if engine used generic font */
            var maxW = canvas.width * 0.88;
            var maxH = canvas.height * 0.35;
            var size = autoFitArabic(ctx, ar, maxW, maxH, Math.round(canvas.width * 0.07));
            ctx.font = "600 " + size + "px " + INDO_FONT;
            ctx.fillStyle = st2.style === "gold" ? "#f0d78c" : (st2.ink || "#f6f1e7");
            ctx.textAlign = "center";
            ctx.direction = "rtl";
            var y = canvas.height * 0.48;
            String(ar).split(/\n/).forEach(function(line, i){
              ctx.fillText(line, canvas.width / 2, y + i * size * 1.55);
            });
          }
        }
      } catch(e2){}
      return r;
    };
    window.memeDraw.__indoPak = true;
  }

  var _push = window.clarityMemePush;
  if (typeof _push === "function" && !_push.__indo) {
    window.clarityMemePush = function(ar, en, ref) {
      applyIndoToMemeState(ar);
      loadIndoFont();
      var r = _push.apply(this, arguments);
      setTimeout(function(){ wrapMemeDraw(); if (typeof memeDraw === "function") memeDraw(); }, 120);
      return r;
    };
    window.clarityMemePush.__indo = true;
  }
  wrapMemeDraw();
  setTimeout(wrapMemeDraw, 800);

  /* ========== 3. Tweet desk → X/Twitter app ========== */
  function openTweetApp(text) {
    var body = String(text || "").trim();
    if (!body) return;
    var encoded = encodeURIComponent(body);
    var web = "https://twitter.com/intent/tweet?text=" + encoded;
    var webX = "https://x.com/intent/tweet?text=" + encoded;
    /* Native app schemes (mobile) */
    var schemes = [
      "twitter://post?message=" + encoded,
      "twitter://post?text=" + encoded,
      "x://post?message=" + encoded
    ];
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    if (isMobile) {
      var tried = false;
      var start = Date.now();
      /* try app, fall back to web if still on page */
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = schemes[0];
      document.body.appendChild(iframe);
      setTimeout(function(){
        try { document.body.removeChild(iframe); } catch(e){}
        if (Date.now() - start < 1600) {
          window.location.href = schemes[0];
        }
        setTimeout(function(){
          /* if user still here, open web intent */
          window.open(webX, "_blank", "noopener");
        }, 700);
      }, 400);
      try {
        if (typeof tdStatus === "function") tdStatus("Opening X / Twitter app…");
      } catch(e){}
      return;
    }
    /* Desktop: prefer x.com intent */
    window.open(webX, "_blank", "noopener");
    try { if (typeof tdStatus === "function") tdStatus("Compose opened on X"); } catch(e){}
  }

  if (typeof window.tdPost === "function" && !window.tdPost.__appOpen) {
    window.tdPost = function() {
      var ta = document.getElementById("td-text");
      if (!ta || !ta.value.trim()) {
        try { if (typeof tdDraft === "function") tdDraft("verse"); } catch(e){}
      }
      var raw = ((document.getElementById("td-text") || {}).value || "");
      openTweetApp(raw);
    };
    window.tdPost.__appOpen = true;
  }
  window.clarityOpenTweetApp = openTweetApp;

  console.info("[Clarity] tajweed meter + Indo-Pak meme + tweet app hooks ready");
})();


})();
