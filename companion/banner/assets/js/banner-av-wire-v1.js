/*! banner-av-wire-v1.3 · Haramain live only · no third-party video feeds · educational only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AV_WIRE_V13__) return;
  w.__CLARITY_BANNER_AV_WIRE_V13__ = true;

  /* Official-style Haramain channel live embeds only */
  var YT = {
    "madinah-primary": {
      place: "madinah",
      url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0"
    },
    "madinah-alt": {
      place: "madinah",
      url: "https://www.youtube.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0"
    },
    "makkah-primary": {
      place: "makkah",
      url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0"
    },
    "makkah-alt": {
      place: "makkah",
      url: "https://www.youtube.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0"
    },
    "makkah-channel": {
      place: "makkah",
      url: "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0"
    },
    "madinah-channel": {
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
    if (stop) stop.classList.add("is-active");
    if (play) play.classList.remove("is-active");
  }

  function showLive(key) {
    var meta = YT[key] || YT["madinah-primary"];
    place = meta.place || place;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (!iframe) return showStill();
    liveOn = true;
    iframe.hidden = false;
    iframe.src = meta.url;
    if (img) img.style.opacity = "0.2";
    var stop = $("btn-live-stop");
    var play = $("btn-live-play");
    if (play) play.classList.add("is-active");
    if (stop) stop.classList.remove("is-active");
    var lp = $("live-place-select");
    if (lp) lp.value = place;
  }

  function currentKey() {
    var sel = $("yt-live-select");
    return (sel && sel.value) || "madinah-primary";
  }

  function wire() {
    var stop = $("btn-live-stop");
    var play = $("btn-live-play");
    var sel = $("yt-live-select");
    if (stop) stop.onclick = function () { showStill(); };
    if (play) play.onclick = function () { showLive(currentKey()); };
    if (sel) {
      sel.onchange = function () {
        var k = sel.value;
        if (YT[k]) place = YT[k].place;
        if (liveOn) showLive(k);
        else {
          var img = $("banner-img");
          if (img) img.src = STILLS[place] || STILLS.makkah;
        }
      };
    }
    /* strip any non-Haramain options if present */
    if (sel) {
      [].slice.call(sel.options).forEach(function (opt) {
        if (!YT[opt.value]) opt.remove();
      });
    }
    showStill();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", wire);
})(window, document);
