/*! companion-banner-owner-v2 · Phase 2
 * Sole live still/live controller for /companion/ only.
 * Other rooms untouched. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_OWNER_V2__) return;
  w.__CLARITY_BANNER_OWNER_V2__ = true;
  /* claim ownership so legacy layers no-op if they check */
  w.__CLARITY_BANNER_CONTROL_N34__ = true;
  w.__CLARITY_BANNER_INTEGRITY_V35__ = true;
  w.__CLARITY_BANNER_AV_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      if (p.indexOf("/campus") === 0 || p.indexOf("/amana") === 0 || p.indexOf("/daily") === 0) return false;
      return p.indexOf("/companion") === 0 || (d.documentElement.getAttribute("data-clarity-room") === "companion");
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

  function $(id) { return d.getElementById(id); }

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
    if (!img.getAttribute("src") || img.getAttribute("src").indexOf("about:") === 0) img.src = src;
    img.onerror = function () { img.onerror = null; img.src = STILLS.makkah; };
    img.style.display = "block";
    img.style.opacity = "1";
    img.removeAttribute("hidden");
    img.setAttribute("aria-hidden", "false");
    var media = $("banner-media");
    if (media) media.classList.remove("live-active");
  }

  function setLive(on) {
    var ifr = $("banner-live");
    var img = $("banner-img");
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var media = $("banner-media");
    var key = placeKey();
    var conf = PLACES[key] || PLACES.madinah;
    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.style.display = "block";
        ifr.style.opacity = "1";
        ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        ifr.src = conf.embed;
      }
      if (img) { img.style.opacity = "0.15"; img.setAttribute("aria-hidden", "true"); }
      if (media) media.classList.add("live-active");
      if (btn) { btn.classList.add("active", "is-live"); btn.setAttribute("aria-pressed", "true"); }
      if (label) label.textContent = "Live";
      try { localStorage.setItem("clarity_banner_live_v1", "1"); } catch (e) {}
    } else {
      if (ifr) {
        ifr.hidden = true;
        ifr.setAttribute("hidden", "");
        ifr.src = "about:blank";
        ifr.style.display = "none";
      }
      if (img) { img.style.opacity = "1"; img.setAttribute("aria-hidden", "false"); }
      if (media) media.classList.remove("live-active");
      if (btn) { btn.classList.remove("active", "is-live"); btn.setAttribute("aria-pressed", "false"); }
      if (label) label.textContent = "Stills";
      ensureStill(key);
      try { localStorage.setItem("clarity_banner_live_v1", "0"); } catch (e) {}
    }
  }

  w.toggleHaramainLive = function () {
    var ifr = $("banner-live");
    var on = !(ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0);
    setLive(on);
  };
  w.toggleLive = w.toggleHaramainLive;

  w.changeHaramainPlace = function () {
    var ifr = $("banner-live");
    var live = ifr && !ifr.hidden && ifr.src && ifr.src.indexOf("youtube") >= 0;
    ensureStill(placeKey());
    if (live) setLive(true);
  };

  /* Quran stream — soft stub if core missing */
  if (typeof w.toggleQuranStream !== "function") {
    w.toggleQuranStream = function () {
      var a = $("quran-audio") || $("quran-audio-dup1");
      if (!a) return;
      try {
        if (a.paused) a.play();
        else a.pause();
      } catch (e) {}
    };
  }

  function layoutSides() {
    var ov = d.querySelector("#clarity-top-duo .banner-overlay") || d.querySelector(".banner-overlay");
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

  function boot() {
    ensureStill(placeKey());
    layoutSides();
    try {
      if (localStorage.getItem("clarity_banner_live_v1") === "1") setLive(true);
    } catch (e) {}
    var sel = $("live-place-select");
    if (sel && !sel.__ownerBound) {
      sel.__ownerBound = true;
      sel.addEventListener("change", function () { w.changeHaramainPlace(); });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 40); });
  else setTimeout(boot, 40);
  w.addEventListener("load", function () { setTimeout(boot, 200); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(boot, 80); });
})(window, document);
