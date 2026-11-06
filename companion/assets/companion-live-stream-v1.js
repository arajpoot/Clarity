/*! companion-live-stream-v1
 * Haramain banner live: multi-source, autoplay (muted), stills fallback.
 * Does not touch other rooms. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_LIVE_STREAM_V1__) return;
  w.__COMPANION_LIVE_STREAM_V1__ = true;

  var STILLS = {
    makkah:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };

  /**
   * Ordered sources per place. YouTube live / known public embeds.
   * autoplay+mute required by browsers.
   */
  var SOURCES = {
    madinah: [
      // Madinah live-style public streams (may rotate)
      "https://www.youtube.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1",
      "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/videoseries?list=PLxW8jPKdJKf0Q8b0ZQY5QZQZQZQZQZQZQ&autoplay=1&mute=1"
    ],
    makkah: [
      "https://www.youtube.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1",
      "https://www.youtube.com/embed/0wE7YqJfF0Q?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0"
    ]
  };

  var state = {
    live: false,
    place: "madinah",
    srcIndex: 0,
    failTimer: null
  };

  function $(id) {
    return d.getElementById(id);
  }

  function place() {
    var sel = $("live-place-select");
    if (sel && sel.value) state.place = sel.value === "makkah" ? "makkah" : "madinah";
    return state.place;
  }

  function showStill() {
    var img = $("banner-img");
    var iframe = $("banner-live");
    var p = place();
    if (img) {
      img.hidden = false;
      img.style.display = "";
      img.src = STILLS[p] || STILLS.makkah;
    }
    if (iframe) {
      iframe.hidden = true;
      iframe.removeAttribute("src");
    }
    var lab = $("live-haramain-label");
    if (lab) lab.textContent = "Stills";
    var btn = $("live-haramain-btn");
    if (btn) btn.classList.remove("is-live");
    state.live = false;
  }

  function currentSources() {
    return SOURCES[place()] || SOURCES.madinah;
  }

  function loadSource(i) {
    var list = currentSources();
    if (!list.length) {
      showStill();
      return;
    }
    state.srcIndex = ((i % list.length) + list.length) % list.length;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (!iframe) {
      showStill();
      return;
    }
    iframe.setAttribute(
      "allow",
      "autoplay; encrypted-media; picture-in-picture; fullscreen"
    );
    iframe.setAttribute("playsinline", "true");
    iframe.hidden = false;
    if (img) {
      img.style.opacity = "0.35";
    }
    var url = list[state.srcIndex];
    if (url.indexOf("autoplay=") < 0) {
      url += (url.indexOf("?") >= 0 ? "&" : "?") + "autoplay=1&mute=1&playsinline=1";
    }
    iframe.src = url;
    var lab = $("live-haramain-label");
    if (lab) lab.textContent = "Live";
    var btn = $("live-haramain-btn");
    if (btn) btn.classList.add("is-live");
    state.live = true;

    if (state.failTimer) clearTimeout(state.failTimer);
    /* If stream dies, try next source then stills */
    state.failTimer = setTimeout(function () {
      if (!state.live) return;
      tryNextOrStill();
    }, 12000);
  }

  function tryNextOrStill() {
    var list = currentSources();
    if (state.srcIndex + 1 < list.length) {
      loadSource(state.srcIndex + 1);
    } else {
      showStill();
    }
  }

  function startLive() {
    state.srcIndex = 0;
    loadSource(0);
  }

  function stopLive() {
    if (state.failTimer) clearTimeout(state.failTimer);
    showStill();
  }

  w.toggleHaramainLive = function () {
    place();
    if (state.live) stopLive();
    else startLive();
  };
  w.changeHaramainPlace = function () {
    place();
    if (state.live) startLive();
    else showStill();
  };
  w.clarityHaramainTryNextStream = tryNextOrStill;
  w.clarityHaramainShowStill = showStill;

  function wire() {
    var btn = $("live-haramain-btn");
    var sel = $("live-place-select");
    if (btn && !btn.__liveV1) {
      btn.__liveV1 = true;
      btn.addEventListener("click", function (e) {
        /* onclick attribute may also fire — debounce */
      });
    }
    if (sel && !sel.__liveV1) {
      sel.__liveV1 = true;
      sel.addEventListener("change", function () {
        w.changeHaramainPlace();
      });
    }
    /* Default: stills visible */
    showStill();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", wire);
})(window, document);
