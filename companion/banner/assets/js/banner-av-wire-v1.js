/*! banner-av-wire-v1 · SVG control mapping · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_WIRE__) return;
  w.__CLARITY_BANNER_AV_WIRE__ = true;

  function $(id) { return d.getElementById(id); }
  function setPlace(p) {
    var sel = $("live-place-select");
    if (sel) sel.value = p;
    try { if (typeof w.changeHaramainPlace === "function") w.changeHaramainPlace(); } catch (e) {}
  }
  function goLive() {
    try {
      var btn = $("live-haramain-btn");
      if (btn && btn.getAttribute("aria-pressed") !== "true" && typeof w.toggleHaramainLive === "function") {
        w.toggleHaramainLive();
      } else if (typeof w.toggleHaramainLive === "function" && btn && btn.getAttribute("aria-pressed") !== "true") {
        btn.click();
      }
    } catch (e) {}
  }
  function goStill() {
    try {
      var btn = $("live-haramain-btn");
      if (btn && btn.getAttribute("aria-pressed") === "true" && typeof w.toggleHaramainLive === "function") {
        w.toggleHaramainLive();
      }
    } catch (e) {}
  }
  function mark(el, on) {
    if (!el) return;
    el.classList.toggle("is-active", !!on);
  }

  function wire() {
    var mk = $("btn-live-makkah");
    var md = $("btn-live-madinah");
    var play = $("btn-live-play");
    var stop = $("btn-live-stop");
    var stop2 = $("btn-live-stop-2");
    var toggle = $("live-haramain-btn");
    var streamBtn = $("stream-btn");
    var surahPlay = $("btn-surah-play");
    var surahStop = $("btn-surah-stop");
    var surahSel = $("surah-list-pill");

    if (mk) mk.addEventListener("click", function () {
      setPlace("makkah"); goLive(); mark(mk, true); mark(md, false);
    });
    if (md) md.addEventListener("click", function () {
      setPlace("madinah"); goLive(); mark(md, true); mark(mk, false);
    });
    if (play) play.addEventListener("click", function () { goLive(); });
    if (stop) stop.addEventListener("click", function () { goStill(); mark(mk, false); mark(md, false); });
    if (stop2) stop2.addEventListener("click", function () { goStill(); mark(mk, false); mark(md, false); });
    if (toggle) toggle.addEventListener("click", function () {
      try { if (typeof w.toggleHaramainLive === "function") w.toggleHaramainLive(); } catch (e) {}
    });

    if (streamBtn) streamBtn.addEventListener("click", function () {
      try {
        if (typeof w.toggleQuranStream === "function") w.toggleQuranStream();
        else if (typeof w.changeStream === "function") w.changeStream();
      } catch (e) {}
    });
    if (surahPlay) surahPlay.addEventListener("click", function () {
      try {
        if (surahSel && !surahSel.value) surahSel.selectedIndex = 1;
        if (typeof w.clarityPlaySurahFromSelect === "function") w.clarityPlaySurahFromSelect(surahSel);
      } catch (e) {}
    });
    if (surahStop) surahStop.addEventListener("click", function () {
      try {
        d.querySelectorAll("audio").forEach(function (a) { try { a.pause(); a.currentTime = 0; } catch (e2) {} });
      } catch (e) {}
    });

    // Keep temps emoji-free even if haramain-temps rewrites DOM
    function scrubTemps() {
      var host = $("hijri-temps");
      if (!host) return;
      var mkEl = $("temp-makkah"), mdEl = $("temp-madinah");
      var mkV = mkEl ? (mkEl.textContent || "—").replace(/[^\d.\-]/g, "") || "—" : "—";
      var mdV = mdEl ? (mdEl.textContent || "—").replace(/[^\d.\-]/g, "") || "—" : "—";
      host.innerHTML =
        '<span class="ht-item"><span class="ht-name">Makkah</span> <strong id="temp-makkah">' + mkV + '</strong><span class="ht-unit">°C</span></span>' +
        '<span class="ht-item"><span class="ht-name">Madinah</span> <strong id="temp-madinah">' + mdV + '</strong><span class="ht-unit">°C</span></span>';
    }
    scrubTemps();
    setInterval(scrubTemps, 4000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(wire, 200); });
  else setTimeout(wire, 200);
})(window, document);
