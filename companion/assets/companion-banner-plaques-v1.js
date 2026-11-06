/*! companion-banner-plaques-v1
 * - Allah plaque on Salah card (remove masjid seal)
 * - Repair Hijri month grid + meta
 * - Repair Salah times (AlAdhan, method 2) + local clock
 * Companion only. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_PLAQUES_V1__) return;
  w.__COMPANION_BANNER_PLAQUES_V1__ = true;

  /* —— DOM: move Allah seal to Salah, drop masjid —— */
  function restyleSeals() {
    var left = d.querySelector(".banner-side.left .hijri-cal-section");
    var right = d.querySelector(".banner-side.right .salah-times-section") ||
      d.querySelector(".banner-side.right");
    if (!right) return;

    var masjid = right.querySelector(".masjid-circular-seal");
    if (masjid) masjid.remove();

    var allah = d.querySelector(".allah-circular-seal");
    if (allah && left && allah.closest(".hijri-cal-section")) {
      allah = allah.parentNode.removeChild(allah);
    }
    if (!right.querySelector(".allah-circular-seal")) {
      if (!allah) {
        allah = d.createElement("div");
        allah.className = "allah-circular-seal";
        allah.title = "Allah";
        allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
      }
      right.insertBefore(allah, right.firstChild);
    }
    /* moon can stay on left under title */
    var title = d.getElementById("salah-title");
    if (title) title.textContent = "Ṣalāh";
  }

  /* —— Hijri calendar (approx Kuwaiti algorithm) —— */
  function g2h(gy, gm, gd) {
    var i = parseInt;
    function int(n) { return Math.floor(n); }
    var jd =
      int((1461 * (gy + 4800 + int((gm - 14) / 12))) / 4) +
      int((367 * (gm - 2 - 12 * int((gm - 14) / 12))) / 12) -
      int((3 * int((gy + 4900 + int((gm - 14) / 12)) / 100)) / 4) +
      gd - 32075;
    var l = jd - 1948440 + 10632;
    var n = int((l - 1) / 10631);
    l = l - 10631 * n + 354;
    var j =
      int((10985 - l) / 5316) * int((50 * l) / 17719) +
      int(l / 5670) * int((43 * l) / 15238);
    l =
      l -
      int((30 - j) / 15) * int((17719 * j) / 50) -
      int(j / 16) * int((15238 * j) / 43) +
      29;
    var hm = int((24 * l) / 709);
    var hd = l - int((709 * hm) / 24);
    var hy = 30 * n + j - 30;
    return { hy: hy, hm: hm, hd: hd };
  }

  var H_MONTHS = [
    "", "Muḥarram", "Ṣafar", "Rabīʿ al-awwal", "Rabīʿ al-thānī",
    "Jumādā al-ūlā", "Jumādā al-ākhirah", "Rajab", "Shaʿbān",
    "Ramaḍān", "Shawwāl", "Dhū al-Qaʿdah", "Dhū al-Ḥijjah"
  ];

  function daysInHijriMonth(hy, hm) {
    /* 29/30 alternating with simple leap */
    var leap = ((hy * 11 + 14) % 30) < 11;
    if (hm % 2 === 1) return 30;
    if (hm === 12) return leap ? 30 : 29;
    return 29;
  }

  function renderHijri() {
    var grid = d.getElementById("hijri-cal-grid");
    var meta = d.getElementById("hijri-cal-meta");
    var title = d.getElementById("hijri-cal-title");
    if (!grid) return;
    var now = new Date();
    var h = g2h(now.getFullYear(), now.getMonth() + 1, now.getDate());
    if (title) title.textContent = H_MONTHS[h.hm] + " " + h.hy + " AH";
    if (meta) meta.textContent = "Today: " + h.hd + " " + H_MONTHS[h.hm];

    var dim = daysInHijriMonth(h.hy, h.hm);
    /* weekday of day 1 approx from today offset */
    var start = new Date(now);
    start.setDate(now.getDate() - (h.hd - 1));
    var startWd = start.getDay(); /* 0 Sun */

    var html = "";
    var labels = ["S", "M", "T", "W", "T", "F", "S"];
    labels.forEach(function (L) {
      html += '<span class="hc-wd">' + L + "</span>";
    });
    for (var i = 0; i < startWd; i++) html += '<span class="hc-empty"></span>';
    for (var d0 = 1; d0 <= dim; d0++) {
      var cls = d0 === h.hd ? "hc-day is-today" : "hc-day";
      html += '<span class="' + cls + '">' + d0 + "</span>";
    }
    grid.innerHTML = html;
    grid.setAttribute("data-hijri-ok", "1");
  }

  /* —— Salah times via AlAdhan —— */
  function fmtTime(t) {
    if (!t) return "—";
    var p = String(t).split(":");
    if (p.length < 2) return t;
    var hh = parseInt(p[0], 10);
    var mm = p[1].slice(0, 2);
    return (hh < 10 ? "0" : "") + hh + ":" + mm;
  }

  function renderSalahList(times, locLabel) {
    var ul = d.getElementById("salah-times-list");
    if (!ul) return;
    var order = [
      ["Fajr", times.Fajr],
      ["Sunrise", times.Sunrise],
      ["Dhuhr", times.Dhuhr],
      ["Asr", times.Asr],
      ["Maghrib", times.Maghrib],
      ["Isha", times.Isha]
    ];
    ul.innerHTML = order
      .map(function (row) {
        return (
          '<li data-salah="' +
          row[0] +
          '"><span class="salah-name">' +
          row[0] +
          '</span><span class="salah-time">' +
          fmtTime(row[1]) +
          "</span></li>"
        );
      })
      .join("");
    var loc = d.getElementById("hijri-local-loc");
    if (loc && locLabel) loc.textContent = locLabel;
    markNextSalah(times);
  }

  function markNextSalah(times) {
    var ul = d.getElementById("salah-times-list");
    if (!ul) return;
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    function toM(t) {
      var p = String(t || "0:0").split(":");
      return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
    }
    var seq = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var next = seq[0];
    for (var i = 0; i < seq.length; i++) {
      if (mins < toM(times[seq[i]])) {
        next = seq[i];
        break;
      }
      next = "Fajr";
    }
    ul.querySelectorAll("li").forEach(function (li) {
      li.classList.toggle("is-next-salah", li.getAttribute("data-salah") === next);
    });
  }

  function tickClock() {
    var el = d.getElementById("hijri-local-time");
    if (!el) return;
    var n = new Date();
    el.textContent = n.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function fetchSalah() {
    var done = false;
    function apply(data, label) {
      if (done) return;
      done = true;
      renderSalahList(data, label);
    }
    function byCity(city, country) {
      var url =
        "https://api.aladhan.com/v1/timingsByCity?city=" +
        encodeURIComponent(city) +
        "&country=" +
        encodeURIComponent(country) +
        "&method=2";
      return fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.data && j.data.timings) {
            apply(j.data.timings, city + (country ? ", " + country : ""));
          }
        });
    }
    function byGeo(lat, lon) {
      var url =
        "https://api.aladhan.com/v1/timings?latitude=" +
        lat +
        "&longitude=" +
        lon +
        "&method=2";
      return fetch(url)
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.data && j.data.timings) {
            apply(j.data.timings, lat.toFixed(2) + ", " + lon.toFixed(2));
          }
        });
    }

    if (w.navigator.geolocation) {
      w.navigator.geolocation.getCurrentPosition(
        function (pos) {
          byGeo(pos.coords.latitude, pos.coords.longitude).catch(function () {
            byCity("Edmonton", "Canada");
          });
        },
        function () {
          byCity("Edmonton", "Canada").catch(function () {
            byCity("Makkah", "Saudi Arabia");
          });
        },
        { maximumAge: 3600000, timeout: 8000 }
      );
    } else {
      byCity("Edmonton", "Canada");
    }
  }

  function boot() {
    restyleSeals();
    renderHijri();
    tickClock();
    fetchSalah();
    setInterval(tickClock, 30000);
    setInterval(renderHijri, 600000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 200);
  });
})(window, document);
