/*! banner-av-wire-v1.5 · Official Haramain live only · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_WIRE_V15__) return;
  w.__CLARITY_BANNER_AV_WIRE_V15__ = true;

  /**
   * Only Haramain live channel embeds (youtube-nocookie live_stream).
   * No third-party VOD / alternate entertainment feeds.
   */
  var YT = {
    "makkah-official": {
      place: "makkah",
      url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0"
    },
    "madinah-official": {
      place: "madinah",
      url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0"
    }
  };
  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };

  var place = "madinah";
  var liveOn = false;

  function $(id) { return d.getElementById(id); }

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
      img.style.opacity = "1";
      img.src = STILLS[place] || STILLS.makkah;
    }
    var stop = $("btn-live-stop");
    var play = $("btn-live-play");
    if (stop) {
      stop.classList.add("is-active");
      stop.setAttribute("aria-pressed", "true");
    }
    if (play) {
      play.classList.remove("is-active");
      play.setAttribute("aria-pressed", "false");
    }
  }

  function showLive(key) {
    key = YT[key] ? key : "madinah-official";
    var meta = YT[key];
    place = meta.place;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (!iframe) return showStill();
    liveOn = true;
    iframe.hidden = false;
    iframe.src = meta.url;
    if (img) img.style.opacity = "0.15";
    var stop = $("btn-live-stop");
    var play = $("btn-live-play");
    if (play) {
      play.classList.add("is-active");
      play.setAttribute("aria-pressed", "true");
    }
    if (stop) {
      stop.classList.remove("is-active");
      stop.setAttribute("aria-pressed", "false");
    }
    var lp = $("live-place-select");
    if (lp) lp.value = place;
  }

  function key() {
    var sel = $("yt-live-select");
    return (sel && sel.value) || "madinah-official";
  }

  function wire() {
    var stop = $("btn-live-stop");
    var play = $("btn-live-play");
    var sel = $("yt-live-select");
    if (stop) stop.onclick = function () { showStill(); };
    if (play) play.onclick = function () { showLive(key()); };
    if (sel) {
      /* hard-prune any non-official options */
      [].slice.call(sel.options).forEach(function (opt) {
        if (!YT[opt.value]) opt.remove();
      });
      if (!sel.options.length) {
        sel.innerHTML =
          '<option value="makkah-official">Makkah · official live</option>' +
          '<option value="madinah-official" selected>Madinah · official live</option>';
      }
      sel.onchange = function () {
        place = (YT[sel.value] || {}).place || place;
        if (liveOn) showLive(sel.value);
        else {
          var img = $("banner-img");
          if (img) img.src = STILLS[place] || STILLS.makkah;
        }
      };
    }
    showStill();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", wire);
})(window, document);
