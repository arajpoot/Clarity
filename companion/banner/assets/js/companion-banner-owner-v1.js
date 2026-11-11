/*! companion-banner-owner-v1 · C5b · location salah · autoplay · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  /* allow upgrade */
  w.__COMPANION_BANNER_OWNER_V1__ = true;
  w.__CLARITY_BANNER_MODULE_OWNER__ = "20261111BU1";

  function $(id) { return d.getElementById(id); }

  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };
  var STREAMS = {
    makkah: [
      "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube-nocookie.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube-nocookie.com/embed/5IDQ-h5fEHc?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1"
    ],
    madinah: [
      "https://www.youtube-nocookie.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube-nocookie.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube-nocookie.com/embed/2xyRm2q9Y7g?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1"
    ]
  };

  var liveOn = false;
  var liveIdx = 0;
  var userLocLabel = null;

  function place() {
    var s = $("live-place-select") || $("stream-select");
    if (s && /makkah|mecca/i.test(String(s.value || ""))) return "makkah";
    if (s && /madinah|medina/i.test(String(s.value || ""))) return "madinah";
    /* place dropdown on banner may say Madinah */
    var opts = d.querySelectorAll("select option:checked");
    for (var i = 0; i < opts.length; i++) {
      if (/madinah|medina/i.test(opts[i].textContent || "")) return "madinah";
      if (/makkah|mecca/i.test(opts[i].textContent || "")) return "makkah";
    }
    return "makkah";
  }

  function setLabel(live) {
    var lab = $("live-haramain-label") || $("stream-text");
    if (lab && lab.closest && lab.closest("#live-haramain-btn, .live-haramain-btn, #stream-btn")) {
      lab.textContent = live ? "Live" : "Stills";
    }
    var btn = $("live-haramain-btn");
    if (btn) {
      btn.setAttribute("aria-pressed", live ? "true" : "false");
      var span = btn.querySelector("#live-haramain-label") || btn;
      if (btn.childNodes.length && !lab) {
        /* button may be the Stills pill itself */
      }
    }
    /* Match UI pill text "Stills" */
    d.querySelectorAll("#live-haramain-btn, .live-haramain-btn, [data-live-toggle]").forEach(function (el) {
      if (el.id === "stream-btn") return;
      var t = (el.textContent || "").trim();
      if (/still|live/i.test(t) && t.length < 12) {
        el.childNodes.forEach(function (n) {
          if (n.nodeType === 3 && /still|live/i.test(n.textContent)) {
            n.textContent = live ? " Live " : " Stills ";
          }
        });
      }
    });
  }

  function showStill() {
    liveOn = false;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (iframe) {
      iframe.hidden = true;
      iframe.style.pointerEvents = "none";
      try { iframe.removeAttribute("src"); } catch (e1) {}
    }
    if (img) {
      img.hidden = false;
      img.style.display = "";
      img.src = STILLS[place()] || STILLS.makkah;
    }
    setLabel(false);
  }

  function showLive() {
    liveOn = true;
    var iframe = $("banner-live");
    var img = $("banner-img");
    var list = STREAMS[place()] || STREAMS.makkah;
    liveIdx = liveIdx % list.length;
    var url = list[liveIdx];
    if (url.indexOf("autoplay=1") < 0) {
      url += (url.indexOf("?") >= 0 ? "&" : "?") + "autoplay=1&mute=1&playsinline=1";
    }
    if (img) {
      img.hidden = true;
      img.style.display = "none";
    }
    if (iframe) {
      iframe.hidden = false;
      iframe.style.display = "block";
      iframe.style.pointerEvents = "auto";
      iframe.style.zIndex = "2";
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.setAttribute("playsinline", "true");
      /* force reload for autoplay */
      iframe.src = "about:blank";
      setTimeout(function () {
        iframe.src = url;
      }, 30);
    }
    setLabel(true);
    /* pause competing audio */
    try {
      if (w.ClarityBannerAudio && w.ClarityBannerAudio.stop) w.ClarityBannerAudio.stop();
      d.querySelectorAll("audio").forEach(function (a) { try { a.pause(); } catch (e) {} });
    } catch (e2) {}
  }

  w.toggleHaramainLive = function () {
    if (liveOn) showStill();
    else { liveIdx = 0; showLive(); }
  };
  w.changeHaramainPlace = function () {
    if (liveOn) { liveIdx = 0; showLive(); }
    else showStill();
  };
  w.changeStream = function () {
    /* video next OR radio — if audio module owns radio, only cycle video when live */
    if (liveOn) {
      liveIdx = (liveIdx + 1) % (STREAMS[place()] || STREAMS.makkah).length;
      showLive();
    }
  };

  function fmtTime(t) {
    if (!t) return "—";
    t = String(t).split(" ")[0];
    var p = t.split(":");
    if (p.length < 2) return t;
    var h = parseInt(p[0], 10), m = p[1];
    if (isNaN(h)) return t;
    var ap = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    return h + ":" + m + " " + ap;
  }

  function renderSalah(times, label) {
    var ul = $("salah-times-list");
    if (!ul || !times) return;
    var order = [
      ["Fajr", times.Fajr], ["Sunrise", times.Sunrise], ["Dhuhr", times.Dhuhr],
      ["Asr", times.Asr], ["Maghrib", times.Maghrib], ["Isha", times.Isha]
    ];
    ul.innerHTML = order.map(function (row) {
      return '<li class="salah-row"><span class="salah-name">' + row[0] +
        '</span><span class="salah-time">' + fmtTime(row[1]) + "</span></li>";
    }).join("");
    setCityLabel(label);
    markNext(times);
  }

  function setCityLabel(label) {
    if (!label) return;
    var loc = $("hijri-local-loc") || d.querySelector(".salah-city, .salah-times-section .city, #salah-title + *");
    var title = $("salah-title");
    /* Prefer dedicated city line under SALAH */
    var cityEl = d.querySelector(".salah-times-section .salah-city, .banner-side.right .salah-city, [data-salah-city]");
    if (!cityEl) {
      cityEl = $("hijri-local-loc");
    }
    if (cityEl) {
      cityEl.textContent = label;
      cityEl.classList.add("salah-city", "c5-city-label");
    }
    if (title) title.setAttribute("data-city", label);
  }

  function markNext(times) {
    try {
      var now = new Date();
      var mins = now.getHours() * 60 + now.getMinutes();
      var keys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
      var next = null;
      keys.forEach(function (k) {
        if (!times[k] || next) return;
        var p = String(times[k]).split(" ")[0].split(":");
        var tm = parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
        if (tm > mins) next = k;
      });
      if (!next) next = "Fajr";
      d.querySelectorAll("#salah-times-list .salah-row").forEach(function (li) {
        var n = li.querySelector(".salah-name");
        if (n && n.textContent === next) li.classList.add("is-next");
        else li.classList.remove("is-next");
      });
    } catch (e3) {}
  }

  function fetchSalahByCoords(lat, lon, label) {
    var url = "https://api.aladhan.com/v1/timings?latitude=" + lat +
      "&longitude=" + lon + "&method=4";
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("geo");
      return r.json();
    }).then(function (j) {
      var t = j && j.data && j.data.timings;
      if (!t) throw new Error("empty");
      renderSalah(t, label || userLocLabel || "Your location");
      return t;
    });
  }

  function fetchSalahByCity(city, country) {
    var url = "https://api.aladhan.com/v1/timingsByCity?city=" +
      encodeURIComponent(city) + "&country=" + encodeURIComponent(country || "") + "&method=4";
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("city");
      return r.json();
    }).then(function (j) {
      var t = j && j.data && j.data.timings;
      if (!t) throw new Error("empty");
      renderSalah(t, city);
      return t;
    });
  }

  function loadSalah() {
    /* Location-first (as before) */
    function geo() {
      return new Promise(function (resolve, reject) {
        if (!navigator.geolocation) return reject(new Error("no geo"));
        navigator.geolocation.getCurrentPosition(function (pos) {
          var lat = pos.coords.latitude, lon = pos.coords.longitude;
          /* reverse label soft */
          userLocLabel = "Near you";
          fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
            lat + "&longitude=" + lon + "&localityLanguage=en", { credentials: "omit" })
            .then(function (r) { return r.json(); })
            .then(function (j) {
              var name = (j && (j.city || j.locality || j.principalSubdivision)) || "Near you";
              userLocLabel = name;
              return fetchSalahByCoords(lat, lon, name);
            })
            .then(resolve)
            .catch(function () {
              fetchSalahByCoords(lat, lon, "Near you").then(resolve).catch(reject);
            });
        }, function () { reject(new Error("geo denied")); }, {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 600000
        });
      });
    }

    geo().catch(function () {
      /* fallback Haramain if user denied location */
      var p = place();
      var city = p === "madinah" ? "Madinah" : "Makkah";
      return fetchSalahByCity(city, "SA");
    }).catch(function () {
      return fetchSalahByCity("Mecca", "Saudi Arabia");
    }).catch(function () {
      renderSalah({
        Fajr: "05:00", Sunrise: "06:20", Dhuhr: "12:20",
        Asr: "15:40", Maghrib: "18:00", Isha: "19:30"
      }, "Offline approx");
    });
  }

  var HIJRI_MONTHS = [
    "Muḥarram", "Ṣafar", "Rabīʿ I", "Rabīʿ II", "Jumādā I", "Jumādā II",
    "Rajab", "Shaʿbān", "Ramaḍān", "Shawwāl", "Dhū al-Qaʿdah", "Dhū al-Ḥijjah"
  ];

  function renderHijriLocal() {
    var grid = $("hijri-cal-grid");
    var title = $("hijri-cal-title");
    /* Remove educational disclaimer lines on calendar plaque */
    var meta = $("hijri-cal-meta");
    if (meta) {
      meta.textContent = "";
      meta.hidden = true;
      meta.style.display = "none";
    }
    d.querySelectorAll(".hijri-cal-section .disc, .hijri-cal-meta, #hijri-cal-meta").forEach(function (el) {
      var t = (el.textContent || "").toLowerCase();
      if (t.indexOf("educational") >= 0 || t.indexOf("not a fatwa") >= 0 || t.indexOf("verify") >= 0) {
        el.textContent = "";
        el.hidden = true;
        el.style.display = "none";
      }
    });
    /* Approximate until API returns */
    try {
      var date = new Date();
      var jd = Math.floor(date.getTime() / 86400000 + 2440587.5);
      var l = jd - 1948440 + 10632;
      var n = Math.floor((l - 1) / 10631);
      l = l - 10631 * n + 354;
      var j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
        Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
      l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
        Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
      var m = Math.floor((24 * l) / 709);
      var day = l - Math.floor((709 * m) / 24);
      var year = 30 * n + j - 30;
      if (title && !title.textContent) {
        title.textContent = (HIJRI_MONTHS[(m - 1 + 12) % 12] || "") + " " + year;
      }
      if (grid && !grid.children.length) {
        var html = "";
        for (var i = 1; i <= 30; i++) {
          html += '<span class="hijri-day' + (i === day ? " is-today" : "") + '">' + i + "</span>";
        }
        grid.innerHTML = html;
      }
    } catch (e4) {}
  }

  function fetchHijri() {
    var n = new Date();
    var dd = String(n.getDate()).padStart(2, "0");
    var mm = String(n.getMonth() + 1).padStart(2, "0");
    var url = "https://api.aladhan.com/v1/gToH?date=" + dd + "-" + mm + "-" + n.getFullYear();
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("hijri");
      return r.json();
    }).then(function (j) {
      var hj = j && j.data && j.data.hijri;
      if (!hj) throw new Error("empty");
      var title = $("hijri-cal-title");
      if (title) {
        var month = (hj.month && (hj.month.en || hj.month.ar)) || "";
        title.textContent = (month + " " + hj.year).trim();
      }
      var grid = $("hijri-cal-grid");
      if (grid) {
        var day = parseInt(hj.day, 10) || 1;
        var html = "";
        for (var i = 1; i <= 30; i++) {
          html += '<span class="hijri-day' + (i === day ? " is-today" : "") + '">' + i + "</span>";
        }
        grid.innerHTML = html;
      }
      /* hide disclaimer meta */
      var meta = $("hijri-cal-meta");
      if (meta) { meta.hidden = true; meta.style.display = "none"; meta.textContent = ""; }
    });
  }

  function loadTemps() {
    function temp(lat, lon) {
      return fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
          "&longitude=" + lon + "&current=temperature_2m",
        { credentials: "omit" }
      ).then(function (r) { return r.json(); })
        .then(function (j) {
          return j && j.current ? Math.round(j.current.temperature_2m) : null;
        });
    }
    Promise.all([temp(21.4225, 39.8262), temp(24.4672, 39.6111)]).then(function (arr) {
      var host = $("hijri-temps") || d.querySelector(".hijri-temps");
      if (!host) return;
      var m = arr[0] != null ? arr[0] + "°C" : "—";
      var md = arr[1] != null ? arr[1] + "°C" : "—";
      host.innerHTML =
        '<div class="c5-temp-row"><span class="c5-temp-ico" aria-hidden="true">🕌</span> ' +
        '<span class="c5-temp-label">Makkah</span> <strong>' + m + "</strong></div>" +
        '<div class="c5-temp-row"><span class="c5-temp-ico" aria-hidden="true">🕌</span> ' +
        '<span class="c5-temp-label">Madinah</span> <strong>' + md + "</strong></div>";
      host.classList.add("c5-temps");
    }).catch(function () {});
  }

  function injectCss() {
    if ($("c5-banner-polish-css")) return;
    var s = d.createElement("style");
    s.id = "c5-banner-polish-css";
    s.textContent = [
      "/* City under SALAH — larger */",
      ".c5-city-label, .salah-city, #hijri-local-loc.salah-city, .salah-times-section .salah-city {",
      "  font-size: 1.05rem !important; font-weight: 700 !important; letter-spacing: 0.02em;",
      "  color: #e8d5a3 !important; opacity: 1 !important; display: block !important;",
      "  margin: 0.15rem 0 0.35rem !important;",
      "}",
      "/* Calendar symmetry */",
      ".hijri-cal-section, .salah-times-section {",
      "  display: flex !important; flex-direction: column !important;",
      "  min-height: 100%; justify-content: flex-start;",
      "}",
      ".hijri-cal-grid {",
      "  display: grid !important; grid-template-columns: repeat(7, 1fr) !important;",
      "  gap: 0.28rem !important; flex: 1; align-content: start;",
      "  margin-top: 0.4rem !important;",
      "}",
      ".hijri-day {",
      "  text-align: center; font-size: 0.78rem; padding: 0.28rem 0;",
      "  border-radius: 8px; background: rgba(0,0,0,0.22);",
      "}",
      ".hijri-day.is-today {",
      "  background: rgba(30,125,94,0.55) !important; color: #e8d5a3 !important; font-weight: 700;",
      "}",
      "/* Hide calendar educational disclaimer lines */",
      "#hijri-cal-meta, .hijri-cal-section .disc { display: none !important; }",
      "/* Temp icons */",
      ".c5-temps { margin: 0.35rem 0; font-size: 0.85rem; }",
      ".c5-temp-row { display: flex; align-items: center; gap: 0.35rem; margin: 0.2rem 0; }",
      ".c5-temp-ico { font-size: 1rem; }",
      ".c5-temp-label { opacity: 0.9; min-width: 4.2rem; }",
      "/* Live iframe above stills, clickable */",
      "#banner-live:not([hidden]) {",
      "  position: relative; z-index: 3 !important; pointer-events: auto !important;",
      "  width: 100% !important; min-height: 12rem;",
      "}",
      "#banner-img[hidden], #banner-img[style*='display: none'] { pointer-events: none !important; }"
    ].join("\n");
    (d.head || d.documentElement).appendChild(s);
  }

  function wire() {
    injectCss();
    var liveBtn = $("live-haramain-btn");
    if (liveBtn && !liveBtn.__c5b) {
      liveBtn.__c5b = true;
      liveBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        w.toggleHaramainLive();
      });
    }
    /* Stills pill may be separate */
    d.querySelectorAll("[data-live-toggle], .live-haramain-btn").forEach(function (el) {
      if (el.__c5b) return;
      el.__c5b = true;
      el.addEventListener("click", function (ev) {
        if (el.id === "stream-btn") return;
        ev.preventDefault();
        w.toggleHaramainLive();
      });
    });
    var placeSel = $("live-place-select");
    if (placeSel && !placeSel.__c5b) {
      placeSel.__c5b = true;
      placeSel.addEventListener("change", function () {
        w.changeHaramainPlace();
      });
    }
  }

  function boot() {
    wire();
    renderHijriLocal();
    fetchHijri().catch(function () {});
    loadSalah();
    loadTemps();
    /* default still until user asks live */
    if (!liveOn) {
      var iframe = $("banner-live");
      if (iframe && iframe.src && iframe.src.indexOf("youtube") >= 0) {
        /* leave if already live */
        liveOn = true;
      }
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 1000);
  setTimeout(function () { loadSalah(); loadTemps(); }, 5000);

  w.ClarityBannerOwner = {
    showStill: showStill,
    showLive: showLive,
    loadSalah: loadSalah,
    loadTemps: loadTemps
  };
})(window, document);
