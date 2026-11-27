/*! banner-av-wire-v1 · LIVE3 shim — defers to companion-banner-owner; no opacity fight */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_WIRE_V15__) return;
  w.__CLARITY_BANNER_AV_WIRE_V15__ = true;
  /* Owner owns live/stills. This file only syncs place select → owner when present. */
  function $(id) { return d.getElementById(id); }
  function wire() {
    var sel = $("yt-live-select") || $("live-place-select");
    if (sel && !sel.__live3Wire) {
      sel.__live3Wire = true;
      sel.addEventListener("change", function () {
        if (typeof w.changeHaramainPlace === "function") w.changeHaramainPlace();
        else if (typeof w.toggleHaramainLive === "function" && /live/i.test(($("live-haramain-label") || {}).textContent || "")) {
          /* keep live; owner reloads place */
          if (typeof w.changeHaramainPlace === "function") w.changeHaramainPlace();
        }
      });
    }
    var play = $("btn-live-play");
    var stop = $("btn-live-stop");
    if (play && !play.__live3Wire) {
      play.__live3Wire = true;
      play.addEventListener("click", function () {
        if (typeof w.toggleHaramainLive === "function") {
          /* force live on */
          var lab = $("live-haramain-label");
          if (!(lab && /live/i.test(lab.textContent || ""))) w.toggleHaramainLive();
          else if (typeof w.showLive === "function") w.showLive();
          else w.toggleHaramainLive();
        }
      });
    }
    if (stop && !stop.__live3Wire) {
      stop.__live3Wire = true;
      stop.addEventListener("click", function () {
        if (typeof w.showStill === "function") w.showStill();
        else if (typeof w.toggleHaramainLive === "function") {
          var lab = $("live-haramain-label");
          if (lab && /live/i.test(lab.textContent || "")) w.toggleHaramainLive();
        }
      });
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  setTimeout(wire, 500);
})(window, document);
