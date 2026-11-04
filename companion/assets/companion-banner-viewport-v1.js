/*! companion-banner-viewport-v1 · mobile tighten + viewport AI
 * Hijri · Salah · AV controls · path bar · stream fallbacks
 * Companion room only. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_VIEWPORT_V1__) return;
  w.__CLARITY_BANNER_VIEWPORT_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0) return false;
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var LOG = (w.__CLARITY_VIEWPORT_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var CSS = [
    "/* === Viewport-owned banner integrity === */",
    "html[data-clarity-room=companion] .banner,#clarity-top-duo.banner{",
    "  position:relative;width:100%;max-width:100%;overflow:hidden;",
    "  border-radius:0 0 16px 16px;min-height:10rem;}",
    "html[data-clarity-room=companion] #banner-media{position:absolute;inset:0;z-index:0;background:#0a1210;}",
    "html[data-clarity-room=companion] #banner-img{width:100%;height:100%;object-fit:cover;display:block;}",
    "html[data-clarity-room=companion] #banner-live{position:absolute;inset:0;width:100%;height:100%;border:0;display:none;}",
    "html[data-clarity-room=companion] #banner-media.live-active #banner-live{display:block!important;}",
    "html[data-clarity-room=companion] #banner-media.live-active #banner-img{opacity:.12;}",
    /* Desktop / wide: 3-col grid */
    "html[data-clarity-room=companion] .banner-overlay{",
    "  position:relative;z-index:2;display:grid;",
    "  grid-template-columns:minmax(6.5rem,22%) minmax(0,1fr) minmax(6.5rem,22%);",
    "  grid-template-areas:'bleft bcenter bright';gap:0.35rem;padding:0.4rem 0.5rem;",
    "  width:100%;box-sizing:border-box;",
    "  background:linear-gradient(180deg,rgba(8,28,22,.55),rgba(8,28,22,.75));}",
    "html[data-clarity-room=companion] .banner-side.left{grid-area:bleft;min-width:0;}",
    "html[data-clarity-room=companion] .banner-center{grid-area:bcenter;min-width:0;text-align:center;",
    "  display:flex;flex-direction:column;align-items:center;justify-content:center;}",
    "html[data-clarity-room=companion] .banner-side.right{grid-area:bright;min-width:0;}",
    "html[data-clarity-room=companion] .hijri-cal-section,",
    "html[data-clarity-room=companion] .salah-times-section{",
    "  width:100%;box-sizing:border-box;border-radius:12px;",
    "  background:rgba(0,0,0,.4);border:1px solid rgba(212,180,90,.22);",
    "  padding:0.3rem 0.35rem;font-size:0.72rem;}",
    "html[data-clarity-room=companion] .salah-times-list{list-style:none;margin:0;padding:0;}",
    "html[data-clarity-room=companion] .salah-times-list li{",
    "  display:flex;justify-content:space-between;gap:0.35rem;padding:0.08rem 0;}",
    "html[data-clarity-room=companion] .stream-controls{",
    "  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.28rem;",
    "  margin-top:0.3rem;max-width:100%;}",
    "html[data-clarity-room=companion] .stream-controls select,",
    "html[data-clarity-room=companion] .stream-controls button{",
    "  height:1.75rem;border-radius:999px;font-size:0.72rem;max-width:100%;",
    "  box-sizing:border-box;}",
    "html[data-clarity-room=companion] .av-plaque,",
    "html[data-clarity-room=companion] .banner-av-row{",
    "  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.3rem;}",
    /* Path bar */
    "#clarity-grave-path-strip .gps-phases,html[data-clarity-room=companion] .gps-phases{",
    "  display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.35rem;}",
    "#clarity-grave-path-strip .gps-phase{font-size:0.7rem;padding:0.4rem 0.45rem;}",
    /* ===== Mobile / narrow ===== */
    "html[data-vp=narrow] .banner-overlay{",
    "  grid-template-columns:1fr 1fr!important;",
    "  grid-template-areas:",
    "    'bleft bright'",
    "    'bcenter bcenter'!important;",
    "  gap:0.3rem!important;padding:0.35rem!important;}",
    "html[data-vp=narrow] .banner-center{order:3;width:100%;}",
    "html[data-vp=narrow] .banner-side.left,html[data-vp=narrow] .banner-side.right{max-width:none;}",
    "html[data-vp=narrow] .hijri-cal-section,html[data-vp=narrow] .salah-times-section{",
    "  font-size:0.65rem;padding:0.25rem 0.3rem;}",
    "html[data-vp=narrow] .hijri-cal-grid{font-size:0.58rem;}",
    "html[data-vp=narrow] .bismillah{font-size:0.95rem!important;}",
    "html[data-vp=narrow] .banner-brand{font-size:1.15rem!important;}",
    "html[data-vp=narrow] .subtitle{font-size:0.75rem!important;}",
    "html[data-vp=narrow] .rabbana-box{max-width:100%;padding:0.35rem 0.4rem;}",
    "html[data-vp=narrow] .rabbana-arabic{font-size:0.95rem!important;}",
    "html[data-vp=narrow] .rabbana-english{font-size:0.72rem!important;}",
    "html[data-vp=narrow] .stream-controls{gap:0.22rem;}",
    "html[data-vp=narrow] .stream-controls select{",
    "  max-width:42vw;font-size:0.68rem;}",
    "html[data-vp=narrow] #clarity-moon-disc{width:1.55rem;height:1.55rem;}",
    "html[data-vp=narrow] #clarity-grave-path-strip .gps-phases,",
    "html[data-vp=narrow] .gps-phases{",
    "  grid-template-columns:repeat(2,minmax(0,1fr))!important;}",
    "html[data-vp=narrow] .clarity-gate-switcher,",
    "html[data-vp=narrow] [class*='path-track'],",
    "html[data-vp=narrow] .cgs-btn{font-size:0.7rem;}",
    /* Ultra-narrow */
    "html[data-vp=tiny] .banner-overlay{",
    "  grid-template-columns:1fr!important;",
    "  grid-template-areas:'bleft' 'bright' 'bcenter'!important;}",
    "html[data-vp=tiny] .stream-controls select{max-width:90vw;}",
    "html[data-vp=tiny] #clarity-grave-path-strip .gps-phases{grid-template-columns:1fr 1fr!important;}"
  ].join("\n");

  function injectCss() {
    var el = d.getElementById("companion-banner-viewport-css");
    if (el) el.remove();
    var s = d.createElement("style");
    s.id = "companion-banner-viewport-css";
    s.textContent = CSS;
    (d.head || d.documentElement).appendChild(s);
  }

  function measure() {
    var wdt = w.innerWidth || d.documentElement.clientWidth || 800;
    var mode = "wide";
    if (wdt < 420) mode = "tiny";
    else if (wdt < 720) mode = "narrow";
    d.documentElement.setAttribute("data-vp", mode);
    d.documentElement.setAttribute("data-vp-w", String(wdt));
    return mode;
  }

  /* Salah fallback if stuck on Loading */
  function salahFallback() {
    var list = d.getElementById("salah-times-list");
    if (!list) return;
    var text = (list.textContent || "").toLowerCase();
    if (text.indexOf("loading") < 0 && list.querySelectorAll("li").length > 1) return;
    /* try core hydrate */
    if (typeof w.clarityRefreshSalah === "function") {
      try { w.clarityRefreshSalah(); return; } catch (e) {}
    }
    if (typeof w.updateSalahTimes === "function") {
      try { w.updateSalahTimes(); return; } catch (e) {}
    }
    /* static educational placeholder until geo times load — not a prayer ruling */
    if (text.indexOf("loading") >= 0 || list.querySelectorAll("li").length <= 1) {
      var names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
      list.innerHTML = names.map(function (n) {
        return '<li><span class="salah-name">' + n + '</span><span class="salah-time">—:—</span></li>';
      }).join("");
      var title = d.getElementById("salah-title");
      if (title && /loading/i.test(title.textContent || "")) title.textContent = "Ṣalāh";
      log("salah-fallback-placeholder");
    }
  }

  /* Temps fallback via open-meteo */
  function loadTemps() {
    var mk = d.getElementById("temp-makkah");
    var md = d.getElementById("temp-madinah");
    if (!mk && !md) return;
    if (mk && mk.textContent && mk.textContent.trim() !== "—" && mk.textContent.trim() !== "") return;
    var cities = { makkah: [21.4225, 39.8262], madinah: [24.4672, 39.6111] };
    Object.keys(cities).forEach(function (key) {
      var lat = cities[key][0], lon = cities[key][1];
      var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
        "&longitude=" + lon + "&current=temperature_2m&timezone=auto";
      fetch(url, { mode: "cors" }).then(function (r) { return r.json(); }).then(function (data) {
        var t = data && data.current && data.current.temperature_2m;
        var el = d.getElementById(key === "makkah" ? "temp-makkah" : "temp-madinah");
        if (el && t != null) el.textContent = String(Math.round(t));
      }).catch(function () {});
    });
  }

  /* Hijri grid soft fallback */
  function hijriFallback() {
    var grid = d.getElementById("hijri-cal-grid");
    if (!grid) return;
    if (grid.children.length > 5) return;
    if (typeof w.renderHijriCalendar === "function") {
      try { w.renderHijriCalendar(); return; } catch (e) {}
    }
    /* leave empty — core may fill; ensure title */
    var title = d.getElementById("hijri-cal-title");
    if (title && (/…|\.\.\./.test(title.textContent || "") || !title.textContent.trim())) {
      title.textContent = "Hijri · تقويم";
    }
  }

  /* AV plaque: ensure stream controls not overflowing */
  function tightenAv() {
    var sc = d.querySelector(".stream-controls");
    if (!sc) return;
    sc.classList.add("av-plaque");
    /* collapse ultra-wide selects on narrow */
    if ((w.innerWidth || 800) < 720) {
      sc.querySelectorAll("select").forEach(function (sel) {
        sel.style.maxWidth = (w.innerWidth < 420) ? "90vw" : "42vw";
      });
    }
  }

  /* Path / track bar mobile */
  function tightenPaths() {
    var strip = d.getElementById("clarity-grave-path-strip");
    if (strip) strip.setAttribute("data-vp-path", d.documentElement.getAttribute("data-vp") || "wide");
  }

  function apply() {
    injectCss();
    var mode = measure();
    log("vp=" + mode);
    salahFallback();
    loadTemps();
    hijriFallback();
    tightenAv();
    tightenPaths();
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(apply, 120);
  }

  function boot() {
    apply();
    w.addEventListener("resize", onResize);
    w.addEventListener("orientationchange", function () { setTimeout(apply, 200); });
    /* watch overlay mutations (core injects salah) */
    try {
      var ov = d.querySelector(".banner-overlay");
      if (ov) {
        new MutationObserver(function () {
          setTimeout(function () { salahFallback(); hijriFallback(); }, 80);
        }).observe(ov, { childList: true, subtree: true, characterData: true });
      }
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  w.addEventListener("load", function () { setTimeout(apply, 300); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(apply, 150); });

  w.ClarityBannerViewport = { apply: apply, measure: measure, log: function () { return LOG.slice(); } };
})(window, document);
