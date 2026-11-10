/*! port-room-tours-fortify-v1 · ensure pills open modal · educational only */
(function () {
  "use strict";
  if (window.__CLARITY_PORT_TOURS_FORTIFY_V1__) return;
  window.__CLARITY_PORT_TOURS_FORTIFY_V1__ = true;

  var TITLES = {
    companion: "Companion tour",
    yawm: "Yawm tour",
    amana: "Amānah tour",
    campus: "Campus tour",
    craft: "Craft tour"
  };

  function $(id) { return document.getElementById(id); }

  function openTour(room, src) {
    var modal = $("room-tour-modal");
    var video = $("room-tour-video");
    var title = $("room-tour-title");
    var missing = $("room-tour-missing");
    if (!modal || !video || !src) return;

    if (title) title.textContent = TITLES[room] || "Room tour";
    if (missing) missing.hidden = true;

    video.pause && video.pause();
    while (video.firstChild) video.removeChild(video.firstChild);
    video.removeAttribute("src");

    var source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    video.appendChild(source);
    video.load();

    fetch(src, { method: "HEAD", cache: "no-cache" })
      .then(function (r) {
        if (!r.ok && missing) missing.hidden = false;
      })
      .catch(function () {
        if (missing) missing.hidden = false;
      });

    modal.hidden = false;
    modal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  function closeTour() {
    var modal = $("room-tour-modal");
    var video = $("room-tour-video");
    if (video) {
      try { video.pause(); } catch (e) {}
      while (video.firstChild) video.removeChild(video.firstChild);
      video.removeAttribute("src");
      video.load();
    }
    if (modal) {
      modal.hidden = true;
      modal.setAttribute("hidden", "");
    }
    document.body.style.overflow = "";
  }

  function bind() {
    document.querySelectorAll(".room-tour-pill").forEach(function (btn) {
      if (btn.__tourFortifyBound) return;
      btn.__tourFortifyBound = true;
      btn.addEventListener(
        "click",
        function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          openTour(btn.getAttribute("data-tour") || "", btn.getAttribute("data-src") || "");
        },
        true
      );
    });
    var closeBtn = $("room-tour-close");
    if (closeBtn && !closeBtn.__tourFortifyBound) {
      closeBtn.__tourFortifyBound = true;
      closeBtn.addEventListener("click", closeTour);
    }
    var modal = $("room-tour-modal");
    if (modal && !modal.__tourFortifyBound) {
      modal.__tourFortifyBound = true;
      modal.addEventListener("click", function (ev) {
        if (ev.target === modal) closeTour();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
  // late bind after other deferred scripts
  setTimeout(bind, 0);
  setTimeout(bind, 500);
})();
