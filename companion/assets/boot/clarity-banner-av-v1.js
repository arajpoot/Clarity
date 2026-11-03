/*! clarity-banner-av-v1 · Haramain live + radio · educational streams may change */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_V1__) return;
  w.__CLARITY_BANNER_AV_V1__ = true;

  /* Public educational embeds — not affiliated; fall back to still if blocked */
  var PLACES = {
    madinah: {
      label: "Madinah",
      embed: "https://www.youtube.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0"
    },
    makkah: {
      label: "Makkah",
      embed: "https://www.youtube.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0"
    }
  };

  function $(id) { return document.getElementById(id); }

  function placeKey() {
    var sel = $("live-place-select");
    var v = (sel && sel.value) || "madinah";
    v = String(v).toLowerCase();
    if (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) return "makkah";
    return "madinah";
  }

  function setLiveActive(on) {
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var ifr = $("banner-live");
    var img = $("banner-img");
    var key = placeKey();
    var conf = PLACES[key] || PLACES.madinah;

    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.style.display = "";
        try {
          ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
          ifr.setAttribute("src", conf.embed);
        } catch (e) {}
      }
      if (img) {
        img.style.opacity = "0";
        img.setAttribute("aria-hidden", "true");
      }
      if (btn) btn.classList.add("active", "is-live");
      if (label) label.textContent = "Live · " + conf.label;
      try { localStorage.setItem("clarity_haramain_live", "1"); } catch (e2) {}
    } else {
      if (ifr) {
        try { ifr.removeAttribute("src"); } catch (e3) {}
        ifr.hidden = true;
        ifr.setAttribute("hidden", "");
        ifr.style.display = "none";
      }
      if (img) {
        img.style.opacity = "";
        img.removeAttribute("aria-hidden");
        if (!img.getAttribute("src")) {
          img.setAttribute("src", "/companion/assets/banner-still-haramain.jpg");
        }
      }
      if (btn) btn.classList.remove("active", "is-live");
      if (label) label.textContent = "Live";
      try { localStorage.setItem("clarity_haramain_live", "0"); } catch (e4) {}
    }
  }

  function isLiveOn() {
    var ifr = $("banner-live");
    if (!ifr) return false;
    if (ifr.hidden) return false;
    var src = ifr.getAttribute("src") || "";
    return !!src;
  }

  w.toggleHaramainLive = function () {
    try {
      setLiveActive(!isLiveOn());
    } catch (e) {
      try { console.warn("[Clarity] toggleHaramainLive", e); } catch (e2) {}
    }
  };

  w.changeHaramainPlace = function () {
    try {
      var key = placeKey();
      try { localStorage.setItem("clarity_haramain_place", key); } catch (e) {}
      if (isLiveOn()) {
        setLiveActive(true); /* reload embed for new place */
      } else {
        var label = $("live-haramain-label");
        var conf = PLACES[key] || PLACES.madinah;
        if (label && label.textContent && /live/i.test(label.textContent)) {
          /* keep Off label */
        }
      }
    } catch (e2) {
      try { console.warn("[Clarity] changeHaramainPlace", e2); } catch (e3) {}
    }
  };

  w.changeStream = function () {
    try {
      var sel = $("stream-select");
      var audio = $("quran-audio") || $("quran-audio-dup1");
      if (!sel || !audio) return;
      var url = sel.value || "";
      if (!url) return;
      try {
        audio.pause();
      } catch (e) {}
      audio.src = url;
      audio.load();
      var play = audio.play();
      if (play && typeof play.catch === "function") {
        play.catch(function () { /* autoplay policy — user can press Listen */ });
      }
      try { localStorage.setItem("clarity_quran_radio", url); } catch (e2) {}
    } catch (e3) {
      try { console.warn("[Clarity] changeStream", e3); } catch (e4) {}
    }
  };

  function restore() {
    try {
      var sel = $("live-place-select");
      var saved = localStorage.getItem("clarity_haramain_place");
      if (sel && saved) {
        for (var i = 0; i < sel.options.length; i++) {
          if (String(sel.options[i].value).toLowerCase().indexOf(saved.slice(0, 4)) >= 0) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
      var radio = localStorage.getItem("clarity_quran_radio");
      var stream = $("stream-select");
      if (stream && radio) {
        for (var j = 0; j < stream.options.length; j++) {
          if (stream.options[j].value === radio) {
            stream.selectedIndex = j;
            break;
          }
        }
      }
      /* do not auto-start live video (data/privacy) — only restore place */
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", restore);
  else restore();

  /* Quran stream listen toggle */
  w.toggleQuranStream = function () {
    try {
      var audio = document.getElementById("quran-audio") || document.getElementById("quran-audio-dup1");
      if (!audio) {
        w.changeStream && w.changeStream();
        audio = document.getElementById("quran-audio") || document.getElementById("quran-audio-dup1");
      }
      if (!audio) return;
      if (audio.paused) {
        if (!audio.src || audio.src === location.href) {
          if (typeof w.changeStream === "function") w.changeStream();
        }
        var p = audio.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
      } else {
        try { audio.pause(); } catch (e) {}
      }
    } catch (e2) {
      try { console.warn("[Clarity] toggleQuranStream", e2); } catch (e3) {}
    }
  };

  /* Aliases used by some archive onclicks */
  w.toggleLive = w.toggleHaramainLive;
  w.changeQuranStream = w.changeStream;

})(window);
