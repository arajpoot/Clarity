/*! banner-av-wire-v1.2 · classic AV · YouTube live choices only · educational only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_WIRE_V12__) return;
  w.__CLARITY_BANNER_AV_WIRE_V12__ = true;

  var YT = {
    "madinah-primary": { place: "madinah", url: "https://www.youtube-nocookie.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0" },
    "madinah-alt": { place: "madinah", url: "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0" },
    "makkah-primary": { place: "makkah", url: "https://www.youtube-nocookie.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0" },
    "makkah-alt": { place: "makkah", url: "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0" },
    "makkah-channel": { place: "makkah", url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0" },
    "madinah-channel": { place: "madinah", url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0" }
  };
  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };

  var place = "madinah";
  var liveOn = false;

  function $(id) { return d.getElementById(id); }

  function currentChoice() {
    var sel = $("yt-live-select");
    var key = (sel && sel.value) || "madinah-primary";
    return YT[key] || YT["madinah-primary"];
  }

  function showStill() {
    liveOn = false;
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
  }

  function showLive() {
    liveOn = true;
    var choice = currentChoice();
    place = choice.place;
    var sel = $("live-place-select");
    if (sel) sel.value = place;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (img) {
      img.hidden = false;
      img.style.display = "block";
      img.src = STILLS[place] || STILLS.makkah;
    }
    if (iframe) {
      iframe.hidden = false;
      iframe.style.display = "block";
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.src = "about:blank";
      setTimeout(function () { iframe.src = choice.url; }, 40);
    }
  }

  function mark(id) {
    ["btn-live-makkah", "btn-live-madinah", "btn-live-play", "btn-live-stop"].forEach(function (x) {
      var el = $(x);
      if (el) el.classList.toggle("is-active", x === id);
    });
  }

  function pickPlace(p) {
    place = p;
    var yt = $("yt-live-select");
    if (yt) {
      yt.value = p === "makkah" ? "makkah-primary" : "madinah-primary";
    }
    var sel = $("live-place-select");
    if (sel) sel.value = p;
  }

  function wire() {
    showStill();

    var mk = $("btn-live-makkah");
    var md = $("btn-live-madinah");
    var play = $("btn-live-play");
    var stop = $("btn-live-stop");
    var yt = $("yt-live-select");
    var streamBtn = $("stream-btn");
    var surahPlay = $("btn-surah-play");
    var surahStop = $("btn-surah-stop");
    var surahSel = $("surah-list-pill");

    if (mk) mk.addEventListener("click", function () { pickPlace("makkah"); showLive(); mark("btn-live-makkah"); });
    if (md) md.addEventListener("click", function () { pickPlace("madinah"); showLive(); mark("btn-live-madinah"); });
    if (play) play.addEventListener("click", function () { showLive(); mark("btn-live-play"); });
    if (stop) stop.addEventListener("click", function () { showStill(); mark("btn-live-stop"); });
    if (yt) yt.addEventListener("change", function () {
      var c = currentChoice();
      place = c.place;
      if (liveOn) showLive();
    });

    w.toggleHaramainLive = function () { if (liveOn) showStill(); else showLive(); };
    w.changeHaramainPlace = function () {
      var sel = $("live-place-select");
      if (sel) pickPlace(sel.value);
      if (liveOn) showLive(); else showStill();
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
      d.querySelectorAll("audio").forEach(function (a) { try { a.pause(); a.currentTime = 0; } catch (e) {} });
    });

    setTimeout(function () {
      try { if (typeof w.loadHaramainCityTemps === "function") w.loadHaramainCityTemps(); } catch (e) {}
    }, 500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(wire, 100); });
  else setTimeout(wire, 100);
})(window, document);
