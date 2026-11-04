/*! companion-banner-owner-v3 · Phase 5 banner rebuild
 * Sole owner: still/live, layout, moon, controls. Companion room only.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_OWNER_V3__) return;
  w.__CLARITY_BANNER_OWNER_V3__ = true;
  /* claim all legacy banner flags */
  w.__CLARITY_BANNER_OWNER_V2__ = true;
  w.__CLARITY_BANNER_CONTROL_N34__ = true;
  w.__CLARITY_BANNER_INTEGRITY_V35__ = true;
  w.__CLARITY_BANNER_AV_V1__ = true;
  w.__CLARITY_BANNER_MOON_V2__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0 || p.indexOf("/daily") === 0) return false;
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/640px-Al-Masjid_an-Nabawi_as-from_top.jpg"
  };
  var PLACES = {
    madinah: { label: "Madinah", embed: "https://www.youtube-nocookie.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1" },
    makkah: { label: "Makkah", embed: "https://www.youtube-nocookie.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1" }
  };

  var CSS = [
    "html[data-clarity-room=companion] .banner,#clarity-top-duo.banner,.banner{",
    "  position:relative;width:100%;max-width:100%;overflow:hidden;",
    "  border-radius:0 0 18px 18px;min-height:200px;}",
    "html[data-clarity-room=companion] #banner-media{position:absolute;inset:0;z-index:0;",
    "  background:#0a1210;min-height:200px;}",
    "html[data-clarity-room=companion] #banner-img.banner-still-img{",
    "  width:100%;height:100%;object-fit:cover;display:block;opacity:1;transition:opacity .25s;}",
    "html[data-clarity-room=companion] #banner-live.banner-live-iframe{",
    "  position:absolute;inset:0;width:100%;height:100%;border:0;display:none;}",
    "html[data-clarity-room=companion] #banner-media.live-active #banner-live{display:block!important;}",
    "html[data-clarity-room=companion] #banner-media.live-active #banner-img{opacity:0.12;}",
    "html[data-clarity-room=companion] .banner-overlay{",
    "  position:relative;z-index:2;display:flex;align-items:stretch;justify-content:space-between;",
    "  gap:0.4rem;padding:0.45rem 0.5rem;width:100%;box-sizing:border-box;",
    "  background:linear-gradient(180deg,rgba(8,28,22,0.55),rgba(8,28,22,0.72));}",
    "html[data-clarity-room=companion] .banner-side{",
    "  flex:0 0 clamp(6rem,21vw,10.5rem);max-width:24%;min-width:5.5rem;}",
    "html[data-clarity-room=companion] .banner-center{",
    "  flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:center;",
    "  text-align:center;justify-content:center;}",
    "html[data-clarity-room=companion] .hijri-cal-section,",
    "html[data-clarity-room=companion] .salah-times-section{",
    "  width:100%;height:100%;box-sizing:border-box;border-radius:14px;",
    "  background:rgba(0,0,0,0.38);box-shadow:inset 0 0 0 1px rgba(255,255,255,0.1);",
    "  padding:0.3rem 0.35rem;display:flex;flex-direction:column;gap:0.1rem;}",
    "html[data-clarity-room=companion] #clarity-moon-phase{display:flex;flex-direction:column;align-items:center;gap:0.1rem;}",
    "html[data-clarity-room=companion] #clarity-moon-disc{width:2rem;height:2rem;border-radius:50%;position:relative;overflow:hidden;",
    "  background:#1a1a22;box-shadow:inset -3px -2px 6px rgba(0,0,0,0.5);}",
    "html[data-clarity-room=companion] #clarity-moon-disc .moon-lit{position:absolute;inset:0;border-radius:50%;",
    "  background:radial-gradient(circle at 35% 35%,#f5f0d8,#c8b88a 55%,#8a7a55);}",
    "html[data-clarity-room=companion] #clarity-moon-disc .moon-shade{position:absolute;top:0;bottom:0;border-radius:50%;background:#0c0c12;}",
    "html[data-clarity-room=companion] #clarity-moon-label{font-size:0.58rem;opacity:0.9;text-align:center;}",
    "html[data-clarity-room=companion] .allah-circular-seal{margin:0 auto 0.1rem;text-align:center;}",
    "html[data-clarity-room=companion] .allah-circular-seal .seal-ar{font-size:1.1rem;}",
    "html[data-clarity-room=companion] .banner-controls,.banner-av-row{",
    "  display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0.3rem;margin-top:0.35rem;}",
    "html[data-clarity-room=companion] .live-haramain-btn.is-live,",
    "html[data-clarity-room=companion] #live-haramain-btn.active{outline:1px solid rgba(201,162,39,0.7);}",
    "@media(max-width:640px){",
    "  html[data-clarity-room=companion] .banner-side{flex-basis:clamp(4.8rem,28vw,7.5rem);max-width:30%;}",
    "  html[data-clarity-room=companion] #clarity-moon-disc{width:1.7rem;height:1.7rem;}",
    "}"
  ].join("\n");

  function $(id) { return d.getElementById(id); }

  function injectCss() {
    var old = d.getElementById("companion-banner-owner-v3-css");
    if (old) old.remove();
    var s = d.createElement("style");
    s.id = "companion-banner-owner-v3-css";
    s.textContent = CSS;
    (d.head || d.documentElement).appendChild(s);
  }

  function placeKey() {
    var sel = $("live-place-select");
    var v = ((sel && sel.value) || "madinah").toLowerCase();
    if (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) return "makkah";
    return "madinah";
  }

  function ensureStill(key) {
    var img = $("banner-img");
    if (!img) return;
    key = key || placeKey();
    var src = STILLS[key] || STILLS.makkah;
    if (!img.getAttribute("src") || /about:blank/i.test(img.getAttribute("src") || "")) img.src = src;
    img.onerror = function () { img.onerror = null; img.src = STILLS.makkah; };
    img.style.display = "block";
    img.removeAttribute("hidden");
  }

  function setLive(on) {
    var ifr = $("banner-live");
    var img = $("banner-img");
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var media = $("banner-media");
    var conf = PLACES[placeKey()] || PLACES.madinah;
    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        ifr.src = conf.embed;
      }
      if (media) media.classList.add("live-active");
      if (btn) { btn.classList.add("active", "is-live"); btn.setAttribute("aria-pressed", "true"); }
      if (label) label.textContent = "Live";
      try { localStorage.setItem("clarity_banner_live_v1", "1"); } catch (e) {}
    } else {
      if (ifr) {
        ifr.hidden = true;
        ifr.setAttribute("hidden", "");
        ifr.src = "about:blank";
      }
      if (media) media.classList.remove("live-active");
      if (btn) { btn.classList.remove("active", "is-live"); btn.setAttribute("aria-pressed", "false"); }
      if (label) label.textContent = "Stills";
      ensureStill(placeKey());
      try { localStorage.setItem("clarity_banner_live_v1", "0"); } catch (e) {}
    }
  }

  w.toggleHaramainLive = function () {
    var ifr = $("banner-live");
    var live = ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0;
    setLive(!live);
  };
  w.toggleLive = w.toggleHaramainLive;

  w.changeHaramainPlace = function () {
    var ifr = $("banner-live");
    var live = ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0;
    ensureStill(placeKey());
    if (live) setLive(true);
  };

  if (typeof w.toggleQuranStream !== "function") {
    w.toggleQuranStream = function () {
      var a = $("quran-audio") || $("quran-audio-dup1");
      if (!a) return;
      try { if (a.paused) a.play(); else a.pause(); } catch (e) {}
    };
  }
  if (typeof w.changeStream !== "function") {
    w.changeStream = function () {
      var sel = $("stream-select");
      var a = $("quran-audio") || $("quran-audio-dup1");
      if (sel && a && sel.value) {
        try { a.src = sel.value; } catch (e) {}
      }
    };
  }

  function moonPhase(date) {
    var d0 = date || new Date();
    var ref = Date.UTC(2000, 0, 6, 18, 14, 0);
    var synodic = 29.53058867;
    var days = (d0.getTime() - ref) / 86400000;
    var age = ((days % synodic) + synodic) % synodic;
    var frac = age / synodic;
    var names = [
      [0.03, "New moon"], [0.22, "Waxing crescent"], [0.28, "First quarter"],
      [0.47, "Waxing gibbous"], [0.53, "Full moon"], [0.72, "Waning gibbous"],
      [0.78, "Last quarter"], [0.97, "Waning crescent"], [1.01, "New moon"]
    ];
    var label = "Moon";
    for (var i = 0; i < names.length; i++) {
      if (frac <= names[i][0]) { label = names[i][1]; break; }
    }
    return { frac: frac, label: label };
  }

  function paintMoon(disc, phase) {
    disc.innerHTML = "";
    var lit = d.createElement("div");
    lit.className = "moon-lit";
    disc.appendChild(lit);
    var shade = d.createElement("div");
    shade.className = "moon-shade";
    var f = phase.frac;
    if (f < 0.03 || f > 0.97) {
      shade.style.left = "0"; shade.style.width = "100%";
    } else if (f < 0.5) {
      shade.style.left = "0"; shade.style.width = ((0.5 - f) * 2 * 100) + "%";
    } else {
      shade.style.right = "0"; shade.style.left = "auto";
      shade.style.width = ((f - 0.5) * 2 * 100) + "%";
    }
    disc.appendChild(shade);
  }

  function ensureMoon() {
    var cal = d.querySelector(".hijri-cal-section");
    if (!cal) return;
    cal.querySelectorAll(".masjid-circular-seal,.cal-masjid-accent").forEach(function (n) { n.remove(); });
    var wrap = $("clarity-moon-phase");
    if (!wrap) {
      wrap = d.createElement("div");
      wrap.id = "clarity-moon-phase";
      var disc = d.createElement("div");
      disc.id = "clarity-moon-disc";
      disc.setAttribute("aria-hidden", "true");
      var lab = d.createElement("div");
      lab.id = "clarity-moon-label";
      wrap.appendChild(disc);
      wrap.appendChild(lab);
      var title = cal.querySelector(".cal-title");
      if (title) cal.insertBefore(wrap, title);
      else cal.insertBefore(wrap, cal.firstChild);
    }
    var phase = moonPhase(new Date());
    paintMoon($("clarity-moon-disc"), phase);
    var lab = $("clarity-moon-label");
    if (lab) lab.textContent = phase.label;
  }

  function layoutSides() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    if (!right) {
      right = d.createElement("div");
      right.className = "banner-side right";
    }
    var salah = ov.querySelector(".salah-times-section") || d.querySelector(".salah-times-section");
    var cal = ov.querySelector(".hijri-cal-section");
    if (salah) right.appendChild(salah);
    if (cal && left) left.appendChild(cal);
    if (left) ov.appendChild(left);
    if (center) ov.appendChild(center);
    ov.appendChild(right);
  }

  /* Neutralize competing owners' layout if they still run */
  function claimGlobals() {
    w.toggleHaramainLive = w.toggleHaramainLive;
    w.toggleLive = w.toggleHaramainLive;
    w.changeHaramainPlace = w.changeHaramainPlace;
  }

  function boot() {
    injectCss();
    d.documentElement.setAttribute("data-clarity-room", "companion");
    ensureStill(placeKey());
    layoutSides();
    ensureMoon();
    claimGlobals();
    try {
      if (localStorage.getItem("clarity_banner_live_v1") === "1") setLive(true);
    } catch (e) {}
    var sel = $("live-place-select");
    if (sel && !sel.__owner3) {
      sel.__owner3 = true;
      sel.addEventListener("change", function () { w.changeHaramainPlace(); });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 30); });
  else setTimeout(boot, 30);
  w.addEventListener("load", function () { setTimeout(boot, 180); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(boot, 60); });
  d.addEventListener("clarity-a2-spine-ready", function () { setTimeout(boot, 60); });
})(window, document);
