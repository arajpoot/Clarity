/*! port-room-tours-repair-v1 · PORTREVAMP
 * Fixes room tour wiring: data-room + data-src, multi-path fallback, intro as last resort.
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (window.__CLARITY_PORT_TOURS_REPAIR_V1__) return;
  window.__CLARITY_PORT_TOURS_REPAIR_V1__ = true;

  var TITLES = {
    companion: "Companion tour",
    yawm: "Yawm tour",
    amana: "Amānah tour",
    campus: "Campus / University tour",
    craft: "Craft tour",
    port: "Castle introduction"
  };

  var FALLBACK_PATHS = {
    companion: [
      "/assets/media/tours/companion-tour.mp4",
      "/assets/tours/companion-tour.mp4",
      "/assets/media/tours/clarity-port-intro-v1.mp4"
    ],
    yawm: [
      "/assets/media/tours/yawm-tour.mp4",
      "/assets/tours/yawm-tour.mp4",
      "/assets/media/tours/clarity-port-intro-v1.mp4"
    ],
    amana: [
      "/assets/media/tours/amana-tour.mp4",
      "/assets/tours/amana-tour.mp4",
      "/assets/media/tours/clarity-port-intro-v1.mp4"
    ],
    campus: [
      "/assets/media/tours/campus-tour.mp4",
      "/assets/tours/campus-tour.mp4",
      "/assets/media/tours/clarity-port-intro-v1.mp4"
    ],
    craft: [
      "/assets/media/tours/craft-tour.mp4",
      "/assets/tours/craft-tour.mp4",
      "/assets/media/tours/clarity-port-intro-v1.mp4"
    ]
  };

  var INTRO = "/assets/media/tours/clarity-port-intro-v1.mp4";

  function $(id) { return document.getElementById(id); }

  function headOk(url) {
    return fetch(url, { method: "HEAD", cache: "no-cache" })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  function resolveSrc(room, preferred) {
    var list = [];
    if (preferred) list.push(preferred);
    var fb = FALLBACK_PATHS[room] || [];
    fb.forEach(function (u) {
      if (list.indexOf(u) < 0) list.push(u);
    });
    if (list.indexOf(INTRO) < 0) list.push(INTRO);

    return list.reduce(function (chain, url) {
      return chain.then(function (found) {
        if (found) return found;
        return headOk(url).then(function (ok) { return ok ? url : null; });
      });
    }, Promise.resolve(null));
  }

  function openTour(room, preferredSrc) {
    var modal = $("room-tour-modal");
    var video = $("room-tour-video");
    var title = $("room-tour-title");
    var missing = $("room-tour-missing");
    if (!modal || !video) return;

    if (title) title.textContent = TITLES[room] || "Room tour";
    if (missing) {
      missing.hidden = true;
      missing.textContent = "Tour video not available on this device.";
    }

    video.pause && video.pause();
    while (video.firstChild) video.removeChild(video.firstChild);
    video.removeAttribute("src");

    resolveSrc(room, preferredSrc).then(function (src) {
      if (!src) {
        if (missing) {
          missing.hidden = false;
          missing.textContent = "No tour file found yet for this room.";
        }
        modal.hidden = false;
        modal.removeAttribute("hidden");
        document.body.style.overflow = "hidden";
        return;
      }
      var source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);
      video.load();
      if (missing) {
        /* If we fell back to castle intro, note it gently */
        if (src.indexOf("clarity-port-intro") >= 0 && room !== "port") {
          missing.hidden = false;
          missing.textContent = "Room tour file not on server yet — showing castle introduction.";
        } else {
          missing.hidden = true;
        }
      }
      modal.hidden = false;
      modal.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
  }

  function closeTour() {
    var modal = $("room-tour-modal");
    var video = $("room-tour-video");
    if (video) {
      try { video.pause(); } catch (e) {}
      while (video.firstChild) video.removeChild(video.firstChild);
      video.removeAttribute("src");
      try { video.load(); } catch (e2) {}
    }
    if (modal) {
      modal.hidden = true;
      modal.setAttribute("hidden", "");
    }
    document.body.style.overflow = "";
  }

  function bind() {
    document.querySelectorAll(".room-tour-pill").forEach(function (btn) {
      if (btn.__tourRepairBound) return;
      btn.__tourRepairBound = true;
      btn.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var room =
            btn.getAttribute("data-room") ||
            btn.getAttribute("data-tour") ||
            "";
          var src = btn.getAttribute("data-tour-src") || btn.getAttribute("data-src") || "";
          openTour(room, src);
        },
        true
      );
    });

    var closeBtn = $("room-tour-close");
    if (closeBtn && !closeBtn.__tourRepairBound) {
      closeBtn.__tourRepairBound = true;
      closeBtn.addEventListener("click", closeTour);
    }
    var modal = $("room-tour-modal");
    if (modal && !modal.__tourRepairBound) {
      modal.__tourRepairBound = true;
      modal.addEventListener("click", function (ev) {
        if (ev.target === modal) closeTour();
      });
    }
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeTour();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
  setTimeout(bind, 400);
})();
