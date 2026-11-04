/*! clarity-banner-control-n34 · single owner · still + live · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_CONTROL_N34__) return;
  w.__CLARITY_BANNER_CONTROL_N34__ = true;
  /* mark so older integrity/av don't double-bind if they check */
  w.__CLARITY_BANNER_INTEGRITY_V35__ = true;
  w.__CLARITY_BANNER_AV_V1__ = true;

  var LOG = (w.__BANNER_LOG = []);
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
    var sel = $("live-place-select");
    var v = ((sel && sel.value) || "madinah").toLowerCase();
    if (v.indexOf("makk") >= 0 || v.indexOf("mecca") >= 0) return "makkah";
    return "madinah";
  }

  function ensureStill(key) {
    var img = $("banner-img");
    if (!img) return;
    key = key || placeKey();
    if (!img.getAttribute("src")) img.src = STILLS[key] || STILLS.makkah;
    img.onerror = function () {
      img.onerror = null;
      img.src = STILLS.makkah;
    };
    img.style.display = "block";
    img.style.opacity = "1";
    img.removeAttribute("hidden");
    img.setAttribute("aria-hidden", "false");
  }

  function setLive(on) {
    var ifr = $("banner-live");
    var img = $("banner-img");
    var btn = $("live-haramain-btn");
    var label = $("live-haramain-label");
    var key = placeKey();
    var conf = PLACES[key] || PLACES.madinah;
    if (on) {
      if (ifr) {
        ifr.hidden = false;
        ifr.removeAttribute("hidden");
        ifr.style.display = "block";
        ifr.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        ifr.src = conf.embed;
      }
      if (img) {
        img.style.opacity = "0";
        img.setAttribute("aria-hidden", "true");
      }
      if (btn) btn.classList.add("active", "is-live");
      if (label) label.textContent = "Live · " + conf.label;
      try { localStorage.setItem("clarity_haramain_live", "1"); } catch (e) {}
      log("live " + key);
    } else {
      if (ifr) {
        try { ifr.src = ""; ifr.removeAttribute("src"); } catch (e2) {}
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
      try { localStorage.setItem("clarity_haramain_live", "0"); } catch (e3) {}
      log("still");
    }
  }

  w.toggleHaramainLive = function () {
    var ifr = $("banner-live");
    var live = ifr && !ifr.hidden && ifr.getAttribute("src");
    setLive(!live);
  };
  w.changeHaramainPlace = function () {
    var key = placeKey();
    try { localStorage.setItem("clarity_haramain_place", key); } catch (e) {}
    ensureStill(key);
    var ifr = $("banner-live");
    if (ifr && !ifr.hidden && ifr.getAttribute("src")) setLive(true);
  };
  w.clarityBannerPlay = function (p) {
    if (p) {
      var sel = $("live-place-select");
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (String(sel.options[i].value).toLowerCase().indexOf(String(p).slice(0, 4).toLowerCase()) >= 0) {
            sel.selectedIndex = i;
            break;
          }
        }
      }
    }
    setLive(true);
  };
  w.clarityBannerStop = function () { setLive(false); };
  w.toggleLive = w.toggleHaramainLive;

  function boot() {
    ensureStill(placeKey());
    setLive(false);
    log("boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
