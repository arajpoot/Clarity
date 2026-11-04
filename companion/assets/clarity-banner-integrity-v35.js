/*! Clarity banner integrity v35 · Archive2 stream brains · companion room · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_INTEGRITY_V35__) return;
  w.__CLARITY_BANNER_INTEGRITY_V35__ = true;

  var LOG = (w.__BANNER_INTEGRITY_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var STILLS = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/1280px-Al-Masjid_an-Nabawi_as-from_top.jpg"
  ];

  /** Archive2-style official live embed (nocookie, muted, playsinline) */
  w.officialLiveEmbedUrl = function (opt) {
    opt = opt || {};
    var id = opt.id || "Rs7St51oDDc"; /* Makkah default */
    var place = "";
    try {
      var sel = d.getElementById("live-place-select") || d.getElementById("stream-select");
      place = (sel && sel.value) || "";
    } catch (e) {}
    if (opt.place) place = opt.place;
    if (String(place).toLowerCase().indexOf("madinah") >= 0 || String(place).toLowerCase().indexOf("medina") >= 0) {
      id = "27cln-IxOGo";
    }
    if (opt.kind === "channel") id = id || "Rs7St51oDDc";
    return (
      "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(id) +
      "?autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1"
    );
  };

  function ensureIframe(src) {
    var host =
      d.getElementById("banner-live") ||
      d.getElementById("banner-media") ||
      d.querySelector(".banner-live-host");
    if (!host) {
      log("no banner-live host");
      return null;
    }
    var iframe = host.querySelector("iframe");
    if (!iframe) {
      iframe = d.createElement("iframe");
      iframe.setAttribute("title", "Haramain live");
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("loading", "lazy");
      iframe.style.cssText = "width:100%;height:100%;border:0;border-radius:12px;min-height:180px;background:#0a1210";
      host.appendChild(iframe);
    }
    if (src) iframe.src = src;
    return iframe;
  }

  function showStill(on) {
    var img = d.getElementById("banner-img");
    var live = d.getElementById("banner-live");
    if (img) {
      if (on) {
        if (!img.getAttribute("src")) img.src = STILLS[0];
        img.style.setProperty("display", "block", "important");
        img.style.opacity = "1";
        img.removeAttribute("hidden");
      }
    }
    if (live && on) {
      /* keep host but dim iframe if stopped */
      var iframe = live.querySelector("iframe");
      if (iframe && !iframe.src) {
        /* empty */
      }
    }
    log(on ? "still-on" : "still-off");
  }

  function setStream(place) {
    place = place || "makkah";
    var url = w.officialLiveEmbedUrl({ place: place });
    var iframe = ensureIframe(url);
    showStill(false);
    var img = d.getElementById("banner-img");
    if (img) img.style.opacity = "0.35";
    log("stream " + place);
    return iframe;
  }

  function stopStream() {
    var host = d.getElementById("banner-live");
    if (host) {
      var iframe = host.querySelector("iframe");
      if (iframe) {
        try {
          iframe.src = "about:blank";
        } catch (e) {}
      }
    }
    showStill(true);
    var img = d.getElementById("banner-img");
    if (img) {
      if (!img.getAttribute("src") || img.getAttribute("src") === "") img.src = STILLS[0];
      img.style.opacity = "1";
      img.style.setProperty("display", "block", "important");
    }
    log("stream-stopped still");
  }

  /* Safe wrappers — Archive2 pattern */
  function wrap(name) {
    if (typeof w[name] !== "function" || w[name]._v35) return;
    var orig = w[name];
    w[name] = function () {
      try {
        return orig.apply(this, arguments);
      } catch (e) {
        log(name + " err " + e);
      }
    };
    w[name]._v35 = true;
  }

  w.clarityBannerPlay = function (place) {
    return setStream(place || "makkah");
  };
  w.clarityBannerStop = function () {
    stopStream();
  };
  w.clarityBannerMadinah = function () {
    return setStream("madinah");
  };
  w.clarityBannerMakkah = function () {
    return setStream("makkah");
  };

  function bindControls() {
    wrap("changeStream");
    wrap("toggleQuranStream");
    wrap("setDailyBanner");
    wrap("toggleHaramain");

    var pairs = [
      ["stream-btn", function () { setStream("makkah"); }],
      ["live-haramain-btn", function () { setStream("makkah"); }],
      ["btn-stream-makkah", function () { setStream("makkah"); }],
      ["btn-stream-madinah", function () { setStream("madinah"); }],
      ["btn-stream-stop", function () { stopStream(); }]
    ];
    pairs.forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el && !el.__v35) {
        el.addEventListener("click", function (ev) {
          try {
            ev.preventDefault();
          } catch (e) {}
          p[1]();
        });
        el.__v35 = true;
      }
    });

    /* data-action hooks */
    d.querySelectorAll("[data-banner-stream]").forEach(function (el) {
      if (el.__v35) return;
      el.addEventListener("click", function () {
        var v = el.getAttribute("data-banner-stream");
        if (v === "stop") stopStream();
        else setStream(v || "makkah");
      });
      el.__v35 = true;
    });

    var sel = d.getElementById("stream-select") || d.getElementById("live-place-select");
    if (sel && !sel.__v35) {
      sel.addEventListener("change", function () {
        setStream(sel.value || "makkah");
      });
      sel.__v35 = true;
    }

    /* Ensure still exists */
    var img = d.getElementById("banner-img");
    if (img && (!img.getAttribute("src") || img.getAttribute("src") === "")) {
      img.src = STILLS[0];
      img.alt = img.alt || "Masjid al-Haram";
    }
    log("controls bound");
  }

  function softSticky() {
    try {
      var duo = d.getElementById("clarity-top-duo") || d.querySelector(".banner-shell, .top-banner");
      if (duo && w.matchMedia && w.matchMedia("(min-width: 1024px)").matches) {
        duo.style.position = "sticky";
        duo.style.top = "0";
        duo.style.zIndex = duo.style.zIndex || "40";
      }
    } catch (e) {}
  }

  function boot() {
    bindControls();
    softSticky();
    showStill(true);
    log("boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    bindControls();
  });
})(window, document);
