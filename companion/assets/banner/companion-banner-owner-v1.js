/*! companion-banner-owner-v1 · C5 · self-contained banner SoT · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_OWNER_V1__) return;
  w.__COMPANION_BANNER_OWNER_V1__ = true;

  function $(id) { return d.getElementById(id); }

  /* —— AV streams + still fallbacks —— */
  var STILLS = {
    makkah: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };
  var STREAMS = {
    makkah: [
      "https://www.youtube-nocookie.com/embed/N9Z3JZqJqJ0?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube-nocookie.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0"
    ],
    madinah: [
      "https://www.youtube-nocookie.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube-nocookie.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0"
    ]
  };
  /* Prefer known working embeds from controls module when present */
  try {
    if (w.__CLARITY_BANNER_STREAMS__) {
      STREAMS.makkah = w.__CLARITY_BANNER_STREAMS__.makkah || STREAMS.makkah;
      STREAMS.madinah = w.__CLARITY_BANNER_STREAMS__.madinah || STREAMS.madinah;
    }
  } catch (e0) {}

  var liveOn = false;
  var liveIdx = 0;

  function place() {
    var s = $("live-place-select") || $("stream-select");
    if (s && /makkah|mecca/i.test(String(s.value || ""))) return "makkah";
    if (s && /madinah|medina/i.test(String(s.value || ""))) return "madinah";
    return "makkah";
  }

  function setLabel(live) {
    var lab = $("live-haramain-label") || $("stream-text");
    if (lab) lab.textContent = live ? "Live" : "Still";
    var btn = $("live-haramain-btn") || $("stream-btn");
    if (btn) btn.setAttribute("aria-pressed", live ? "true" : "false");
  }

  function showStill() {
    liveOn = false;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (iframe) {
      iframe.hidden = true;
      try { iframe.removeAttribute("src"); } catch (e1) {}
    }
    if (img) {
      img.hidden = false;
      img.src = STILLS[place()] || STILLS.makkah;
      img.alt = place() === "madinah" ? "Al-Masjid an-Nabawi" : "Masjid al-Haram";
    }
    setLabel(false);
  }

  function showLive() {
    liveOn = true;
    var iframe = $("banner-live");
    var img = $("banner-img");
    var list = STREAMS[place()] || STREAMS.makkah;
    liveIdx = liveIdx % list.length;
    if (img) img.hidden = true;
    if (iframe) {
      iframe.hidden = false;
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("allowfullscreen", "true");
      iframe.src = list[liveIdx];
    }
    setLabel(true);
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
    if (!liveOn) { showLive(); return; }
    liveIdx = (liveIdx + 1) % (STREAMS[place()] || STREAMS.makkah).length;
    showLive();
  };

  /* —— Salah times (Aladhan + fallback) —— */
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
      ["Fajr", times.Fajr],
      ["Sunrise", times.Sunrise],
      ["Dhuhr", times.Dhuhr],
      ["Asr", times.Asr],
      ["Maghrib", times.Maghrib],
      ["Isha", times.Isha]
    ];
    ul.innerHTML = order.map(function (row) {
      return '<li class="salah-row"><span class="salah-name">' + row[0] +
        '</span><span class="salah-time">' + fmtTime(row[1]) + "</span></li>";
    }).join("");
    var title = $("salah-title");
    if (title && label) title.setAttribute("data-city", label);
    var loc = $("hijri-local-loc");
    if (loc && label) loc.textContent = label;
    markNext(times);
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
      var lis = d.querySelectorAll("#salah-times-list .salah-row");
      lis.forEach(function (li) {
        var n = li.querySelector(".salah-name");
        if (n && n.textContent === next) li.classList.add("is-next");
        else li.classList.remove("is-next");
      });
    } catch (e2) {}
  }

  function salahFallback() {
    /* Approximate Makkah schedule placeholder — clearly educational */
    var approx = {
      Fajr: "05:00", Sunrise: "06:20", Dhuhr: "12:20",
      Asr: "15:40", Maghrib: "18:00", Isha: "19:30"
    };
    renderSalah(approx, "Makkah (offline approx · educational)");
  }

  function fetchSalahByCity(city, country) {
    var url = "https://api.aladhan.com/v1/timingsByCity?city=" +
      encodeURIComponent(city) + "&country=" + encodeURIComponent(country || "") +
      "&method=4";
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("salah http");
      return r.json();
    }).then(function (j) {
      var t = j && j.data && j.data.timings;
      if (!t) throw new Error("salah empty");
      renderSalah(t, city);
      return t;
    });
  }

  function fetchSalahByCoords(lat, lon) {
    var url = "https://api.aladhan.com/v1/timings?latitude=" + lat +
      "&longitude=" + lon + "&method=4";
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("salah geo http");
      return r.json();
    }).then(function (j) {
      var t = j && j.data && j.data.timings;
      if (!t) throw new Error("salah geo empty");
      renderSalah(t, "Near you");
      return t;
    });
  }

  function loadSalah() {
    var citySel = $("salah-city-select") || $("live-place-select");
    var city = "Makkah";
    var country = "SA";
    if (citySel && /madinah/i.test(citySel.value || "")) {
      city = "Madinah"; country = "SA";
    }
    fetchSalahByCity(city, country).catch(function () {
      return fetchSalahByCity("Mecca", "Saudi Arabia");
    }).catch(function () {
      if (navigator.geolocation) {
        return new Promise(function (resolve, reject) {
          navigator.geolocation.getCurrentPosition(function (pos) {
            fetchSalahByCoords(pos.coords.latitude, pos.coords.longitude)
              .then(resolve).catch(reject);
          }, function () { reject(new Error("geo")); }, { timeout: 4000 });
        });
      }
      return Promise.reject(new Error("no geo"));
    }).catch(function () {
      salahFallback();
    });
  }

  /* —— Hijri calendar —— */
  var HIJRI_MONTHS = [
    "Muḥarram", "Ṣafar", "Rabīʿ I", "Rabīʿ II", "Jumādā I", "Jumādā II",
    "Rajab", "Shaʿbān", "Ramaḍān", "Shawwāl", "Dhū al-Qaʿdah", "Dhū al-Ḥijjah"
  ];

  function gregorianToHijriApprox(date) {
    /* Kuwaiti algorithm-ish approx for UI when API fails */
    var jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
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
    return { day: day, month: m, year: year };
  }

  function renderHijri() {
    var grid = $("hijri-cal-grid");
    var title = $("hijri-cal-title");
    var meta = $("hijri-cal-meta");
    var h = gregorianToHijriApprox(new Date());
    var monthName = HIJRI_MONTHS[(h.month - 1 + 12) % 12] || ("M" + h.month);
    if (title) title.textContent = monthName + " " + h.year;
    if (meta) meta.textContent = "Hijrī · educational outline · verify moon sighting locally";
    if (!grid) return;
    /* simple 7-col month grid with today marked */
    var days = 30;
    var html = "";
    for (var i = 1; i <= days; i++) {
      var cls = i === h.day ? "hijri-day is-today" : "hijri-day";
      html += '<span class="' + cls + '">' + i + "</span>";
    }
    grid.innerHTML = html;
  }

  function fetchHijriFromAladhan() {
    var url = "https://api.aladhan.com/v1/gToH?date=" +
      (function () {
        var n = new Date();
        var dd = String(n.getDate()).padStart(2, "0");
        var mm = String(n.getMonth() + 1).padStart(2, "0");
        return dd + "-" + mm + "-" + n.getFullYear();
      })();
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("hijri");
      return r.json();
    }).then(function (j) {
      var hj = j && j.data && j.data.hijri;
      if (!hj) throw new Error("hijri empty");
      var title = $("hijri-cal-title");
      var meta = $("hijri-cal-meta");
      if (title) title.textContent = (hj.month.en || hj.month) + " " + hj.year;
      if (meta) meta.textContent = "Hijrī " + hj.date + " · educational · not a fatwa";
      var grid = $("hijri-cal-grid");
      if (grid) {
        var day = parseInt(hj.day, 10) || 1;
        var html = "";
        for (var i = 1; i <= 30; i++) {
          html += '<span class="hijri-day' + (i === day ? " is-today" : "") + '">' + i + "</span>";
        }
        grid.innerHTML = html;
      }
      var local = $("hijri-local-time");
      if (local) {
        try {
          local.textContent = new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
        } catch (e3) {}
      }
    });
  }

  /* —— Temperatures Makkah / Madinah —— */
  function setTemps(makkahC, madinahC) {
    var host = $("hijri-temps");
    if (!host) return;
    host.innerHTML =
      '<span class="temp-city">Makkah <strong>' + (makkahC != null ? makkahC + "°C" : "—") +
      "</strong></span> · <span class=\"temp-city\">Madinah <strong>" +
      (madinahC != null ? madinahC + "°C" : "—") + "</strong></span>";
  }

  function fetchTemp(lat, lon) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
      "&longitude=" + lon + "&current=temperature_2m";
    return fetch(url, { credentials: "omit" }).then(function (r) {
      if (!r.ok) throw new Error("temp");
      return r.json();
    }).then(function (j) {
      return j && j.current && j.current.temperature_2m;
    });
  }

  function loadTemps() {
    Promise.all([
      fetchTemp(21.4225, 39.8262),
      fetchTemp(24.4672, 39.6111)
    ]).then(function (arr) {
      setTemps(
        arr[0] != null ? Math.round(arr[0]) : null,
        arr[1] != null ? Math.round(arr[1]) : null
      );
    }).catch(function () {
      setTemps(null, null);
    });
  }

  /* —— Wire UI —— */
  function wireButtons() {
    var liveBtn = $("live-haramain-btn") || $("stream-btn");
    if (liveBtn && !liveBtn.__c5Wired) {
      liveBtn.__c5Wired = true;
      liveBtn.addEventListener("click", function (ev) {
        ev.preventDefault();
        w.toggleHaramainLive();
      });
    }
    var placeSel = $("live-place-select") || $("stream-select");
    if (placeSel && !placeSel.__c5Wired) {
      placeSel.__c5Wired = true;
      placeSel.addEventListener("change", function () {
        w.changeHaramainPlace();
        loadSalah();
      });
    }
  }

  function boot() {
    wireButtons();
    showStill();
    renderHijri();
    fetchHijriFromAladhan().catch(function () { renderHijri(); });
    loadSalah();
    loadTemps();
    try {
      d.dispatchEvent(new CustomEvent("clarity-banner-owner-ready"));
    } catch (e4) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  /* re-run after late DOM inject */
  w.setTimeout(boot, 1200);
  w.setTimeout(function () { loadSalah(); loadTemps(); }, 4000);

  w.ClarityBannerOwner = {
    showStill: showStill,
    showLive: showLive,
    loadSalah: loadSalah,
    loadTemps: loadTemps,
    refreshHijri: function () { return fetchHijriFromAladhan().catch(renderHijri); }
  };
})(window, document);
