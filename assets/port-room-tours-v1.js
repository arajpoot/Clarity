/*! Port room tour pills · Phase A
 * Opens a small modal player for per-room tours.
 * Educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (window.__CLARITY_PORT_ROOM_TOURS_V1__) return;
  window.__CLARITY_PORT_ROOM_TOURS_V1__ = true;

  var TITLES = {
    companion: "Companion tour",
    yawm: "Yawm tour",
    amana: "Amānah tour",
    campus: "Campus tour",
    craft: "Craft tour"
  };

  function $(id) {
    return document.getElementById(id);
  }

  function openTour(room, src) {
    var modal = $("room-tour-modal");
    var video = $("room-tour-video");
    var title = $("room-tour-title");
    var missing = $("room-tour-missing");
    if (!modal || !video) return;

    title.textContent = TITLES[room] || "Room tour";
    missing.hidden = true;
    video.removeAttribute("src");
    while (video.firstChild) video.removeChild(video.firstChild);

    var source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    video.appendChild(source);
    video.load();

    // Probe availability — if 404, show gentle message (Amānah should work)
    fetch(src, { method: "HEAD", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) {
          missing.hidden = false;
        }
      })
      .catch(function () {
        missing.hidden = false;
      });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    try {
      video.play().catch(function () {});
    } catch (e) {}
  }

  function closeTour() {
    var modal = $("room-tour-modal");
    var video = $("room-tour-video");
    if (video) {
      try {
        video.pause();
      } catch (e) {}
      video.removeAttribute("src");
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
    }
    if (modal) modal.hidden = true;
    document.body.style.overflow = "";
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function () {
    document.querySelectorAll(".room-tour-pill").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        openTour(btn.getAttribute("data-tour") || "", btn.getAttribute("data-src") || "");
      });
    });

    var closeBtn = $("room-tour-close");
    if (closeBtn) closeBtn.addEventListener("click", closeTour);

    var modal = $("room-tour-modal");
    if (modal) {
      modal.addEventListener("click", function (ev) {
        if (ev.target === modal) closeTour();
      });
    }

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeTour();
    });

    // Mark pills ready when file exists (optional polish)
    document.querySelectorAll(".room-tour-pill").forEach(function (btn) {
      var src = btn.getAttribute("data-src");
      if (!src) return;
      fetch(src, { method: "HEAD", cache: "no-cache" })
        .then(function (r) {
          if (r.ok) btn.classList.add("is-ready");
        })
        .catch(function () {});
    });
  });
})();
