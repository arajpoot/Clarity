/*! Clarity banner integrity v35.1 · works with banner-live iframe · still fallback */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_INTEGRITY_V35__) return;
  w.__CLARITY_BANNER_INTEGRITY_V35__ = true;

  var LOG = (w.__BANNER_INTEGRITY_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/640px-Al-Masjid_an-Nabawi_as-from_top.jpg"
  };

  var PLACES = {
    madinah: {
      label: "Madinah",
      embed: "https://www.youtube-nocookie.com/embed/5RJkL7vLHLs?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1"
    },
    makkah: {
      label: "Makkah",
      embed: "https://www.youtube-nocookie.com/embed/NJooZDDcV1E?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1"
    }
  };

  function $(id) { return d.getElementById(id); }

  function placeKey() {
    var sel = $("live-place-select") || $("stream-select");
    var v = (sel && sel.value) || "madinah";
    v = String(v).toLowerCase();
    if (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) return "makkah";
    return "madinah";
  }

  function ensureStill(key) {
    var img = $("banner-img");
    if (!img) return;
    var src = STILLS[key] || STILLS.makkah;
    if (!img.getAttribute("src") || img.getAttribute("src") === "") {
      img.src = src;
    }
    img.onerror = function () {
      img.onerror = null;
      img.src = STILLS.makkah;
    };
    img.style.setProperty("display", "block", "important");
    img.style.opacity = "1";
    img.removeAttribute("hidden");
    img.setAttribute("aria-hidden", "false");
    log("still " + key);
  }

  function setLiveActive(on) {
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var ifr = $("banner-live"); /* THIS is the iframe */
    var img = $("banner-img");
    var key = placeKey();
    var conf = PLACES[key] || PLACES.madinah;

    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.style.display = "block";
        ifr.style.opacity = "1";
        try {
          ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
          ifr.setAttribute("src", conf.embed);
        } catch (e) { log("iframe " + e); }
      }
      if (img) {
        img.style.opacity = "0";
        img.setAttribute("aria-hidden", "true");
      }
      if (btn) btn.classList.add("active", "is-live");
      if (label) label.textContent = "Live · " + conf.label;
      try { localStorage.setItem("clarity_haramain_live", "1"); } catch (e2) {}
      log("live on " + key);
    } else {
      if (ifr) {
        try { ifr.removeAttribute("src"); ifr.src = ""; } catch (e3) {}
        ifr.hidden = true;
        ifr.setAttribute("hidden", "");
        ifr.style.display = "none";
      }
      ensureStill(key);
      if (img) {
        img.style.opacity = "1";
        img.removeAttribute("aria-hidden");
      }
      if (btn) btn.classList.remove("active", "is-live");
      if (label) label.textContent = "Live";
      try { localStorage.setItem("clarity_haramain_live", "0"); } catch (e4) {}
      log("live off still");
    }
  }

  /* Override / reinforce AV API so one path wins */
  w.toggleHaramainLive = function () {
    try {
      var ifr = $("banner-live");
      var on = !(ifr && !ifr.hidden && ifr.getAttribute("src"));
      /* if currently has src and visible → turn off */
      if (ifr && !ifr.hidden && ifr.getAttribute("src") && ifr.getAttribute("src") !== "") {
        setLiveActive(false);
      } else {
        setLiveActive(true);
      }
    } catch (e) {
      log("toggle " + e);
    }
  };

  w.changeHaramainPlace = function () {
    try {
      var ifr = $("banner-live");
      var live = ifr && !ifr.hidden && ifr.getAttribute("src");
      var key = placeKey();
      try { localStorage.setItem("clarity_haramain_place", key); } catch (e) {}
      ensureStill(key);
      if (live) setLiveActive(true);
      log("place " + key);
    } catch (e2) {
      log("place err " + e2);
    }
  };

  w.officialLiveEmbedUrl = function (opt) {
    opt = opt || {};
    var key = opt.place ? String(opt.place).toLowerCase() : placeKey();
    if (key.indexOf("makk") >= 0) key = "makkah";
    else key = "madinah";
    return (PLACES[key] || PLACES.madinah).embed;
  };

  w.clarityBannerPlay = function (place) {
    if (place) {
      var sel = $("live-place-select");
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (String(sel.options[i].value).toLowerCase().indexOf(String(place).slice(0, 4).toLowerCase()) >= 0) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
    }
    setLiveActive(true);
  };
  w.clarityBannerStop = function () { setLiveActive(false); };
  w.clarityBannerMadinah = function () { w.clarityBannerPlay("madinah"); };
  w.clarityBannerMakkah = function () { w.clarityBannerPlay("makkah"); };

  function boot() {
    ensureStill(placeKey());
    /* default: still visible, live off (privacy/data) */
    setLiveActive(false);
    log("boot still");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    /* if iframe empty, force still visible */
    var ifr = $("banner-live");
    var img = $("banner-img");
    if (img && (!ifr || ifr.hidden || !ifr.getAttribute("src"))) {
      ensureStill(placeKey());
      img.style.opacity = "1";
    }
  });
})(window, document);
