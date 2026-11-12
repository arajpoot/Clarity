/*! banner-av-wire-v1.1 · live fallback · no Stills leak · educational only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_WIRE_V11__) return;
  w.__CLARITY_BANNER_AV_WIRE_V11__ = true;

  var STREAMS = {
    makkah: [
      "https://www.youtube-nocookie.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0"
    ],
    madinah: [
      "https://www.youtube-nocookie.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube-nocookie.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0"
    ]
  };
  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };

  var place = "madinah";
  var liveOn = false;
  var idx = 0;
  var failTimer = null;

  function $(id) { return d.getElementById(id); }

  function hideLegacyToggle() {
    var btn = $("live-haramain-btn");
    if (btn) {
      btn.hidden = true;
      btn.setAttribute("aria-hidden", "true");
      btn.style.display = "none";
    }
    var lab = $("live-haramain-label");
    if (lab) lab.style.display = "none";
  }

  function setPlace(p) {
    place = p === "makkah" ? "makkah" : "madinah";
    var sel = $("live-place-select");
    if (sel) sel.value = place;
  }

  function showStill() {
    liveOn = false;
    if (failTimer) { clearTimeout(failTimer); failTimer = null; }
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (iframe) {
      iframe.hidden = true;
      try { iframe.removeAttribute("src"); } catch (e) {}
    }
    if (img) {
      img.hidden = false;
      img.style.display = "block";
      img.src = STILLS[place] || STILLS.makkah;
    }
    hideLegacyToggle();
    markActive(null);
  }

  function showLive(reset) {
    if (reset) idx = 0;
    liveOn = true;
    hideLegacyToggle();
    var list = STREAMS[place] || STREAMS.madinah;
    if (idx >= list.length) {
      showStill();
      return;
    }
    var url = list[idx];
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (img) {
      /* keep still under iframe in case embed fails */
      img.hidden = false;
      img.style.display = "block";
      img.src = STILLS[place] || STILLS.makkah;
    }
    if (iframe) {
      iframe.hidden = false;
      iframe.style.display = "block";
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.src = "about:blank";
      setTimeout(function () { iframe.src = url; }, 40);
    }
    if (failTimer) clearTimeout(failTimer);
    /* If YouTube shows unavailable, rotate fallback after a few seconds when user stays on live */
    failTimer = setTimeout(function () {
      if (!liveOn) return;
      idx += 1;
      if (idx < list.length) showLive(false);
      else showStill();
    }, 8000);
  }

  function markActive(which) {
    ["btn-live-makkah", "btn-live-madinah", "btn-live-play", "btn-live-stop"].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle("is-active", id === which);
    });
  }

  function wire() {
    hideLegacyToggle();
    showStill(); /* default: still — avoids Video is unavailable on load */

    var mk = $("btn-live-makkah");
    var md = $("btn-live-madinah");
    var play = $("btn-live-play");
    var stop = $("btn-live-stop");
    var streamBtn = $("stream-btn");
    var surahPlay = $("btn-surah-play");
    var surahStop = $("btn-surah-stop");
    var surahSel = $("surah-list-pill");

    if (mk) mk.addEventListener("click", function () {
      setPlace("makkah"); showLive(true); markActive("btn-live-makkah");
    });
    if (md) md.addEventListener("click", function () {
      setPlace("madinah"); showLive(true); markActive("btn-live-madinah");
    });
    if (play) play.addEventListener("click", function () {
      showLive(true); markActive("btn-live-play");
    });
    if (stop) stop.addEventListener("click", function () {
      showStill(); markActive("btn-live-stop");
    });

    /* Neutralize owner toggle writing "Stills" into visible UI */
    w.toggleHaramainLive = function () {
      if (liveOn) showStill();
      else showLive(true);
    };
    w.changeHaramainPlace = function () {
      var sel = $("live-place-select");
      if (sel) setPlace(sel.value);
      if (liveOn) showLive(true);
      else showStill();
    };

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
      d.querySelectorAll("audio").forEach(function (a) {
        try { a.pause(); a.currentTime = 0; } catch (e) {}
      });
    });

    /* Ensure temps numbers can fill */
    setTimeout(function () {
      try {
        if (typeof w.loadHaramainCityTemps === "function") w.loadHaramainCityTemps();
      } catch (e) {}
    }, 600);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(wire, 120); });
  else setTimeout(wire, 120);
})(window, document);
