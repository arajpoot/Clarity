/*! companion-banner-plaques-v1 · Q2
 * Allah on Salah · Hijri grid · event countdown (Ramadan) · temps center
 * Salah city under Allah · live stream autoplay option
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_PLAQUES_V2__) return;
  w.__COMPANION_BANNER_PLAQUES_V2__ = true;
  w.__COMPANION_BANNER_PLAQUES_V1__ = true;

  function restyleSeals() {
    var right =
      d.querySelector(".banner-side.right .salah-times-section") ||
      d.querySelector(".banner-side.right");
    if (!right) return;
    var masjid = right.querySelector(".masjid-circular-seal");
    if (masjid) masjid.remove();
    var allah = d.querySelector(".banner-side.left .allah-circular-seal");
    if (allah) allah = allah.parentNode.removeChild(allah);
    if (!right.querySelector(".allah-circular-seal")) {
      if (!allah) {
        allah = d.createElement("div");
        allah.className = "allah-circular-seal";
        allah.title = "Allah";
        allah.innerHTML = '<span class="arabic seal-ar">الله</span>';
      }
      right.insertBefore(allah, right.firstChild);
    }
    /* city under Allah + title */
    var title = d.getElementById("salah-title");
    var loc = d.getElementById("hijri-local-loc");
    if (loc) {
      loc.classList.add("salah-city");
      if (title && title.nextSibling !== loc) {
        title.parentNode.insertBefore(loc, title.nextSibling);
      }
    }
  }

  function g2h(gy, gm, gd) {
    function int(n) { return Math.floor(n); }
    var jd =
      int((1461 * (gy + 4800 + int((gm - 14) / 12))) / 4) +
      int((367 * (gm - 2 - 12 * int((gm - 14) / 12))) / 12) -
      int((3 * int((gy + 4900 + int((gm - 14) / 12)) / 100)) / 4) +
      gd -
      32075;
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
    var leap = ((hy * 11 + 14) % 30) < 11;
    if (hm % 2 === 1) return 30;
    if (hm === 12) return leap ? 30 : 29;
    return 29;
  }

  /** Days until next Ramadan 1 (educational approx from current Hijri) */
  function ramadanCountdown(h) {
    var hy = h.hy;
    var hm = h.hm;
    var hd = h.hd;
    var targetY = hy;
    if (hm > 9 || (hm === 9 && hd > 1)) targetY = hy + 1;
    /* rough day count via month lengths */
    var days = 0;
    if (hm === 9 && hd <= 1) return { name: "Ramaḍān", days: 0, label: "Ramaḍān is here" };
    if (hm < 9) {
      days += daysInHijriMonth(hy, hm) - hd;
      for (var m = hm + 1; m < 9; m++) days += daysInHijriMonth(hy, m);
      days += 1; /* day 1 */
    } else {
      days += daysInHijriMonth(hy, hm) - hd;
      for (var m2 = hm + 1; m2 <= 12; m2++) days += daysInHijriMonth(hy, m2);
      for (var m3 = 1; m3 < 9; m3++) days += daysInHijriMonth(targetY, m3);
      days += 1;
    }
    return { name: "Ramaḍān", days: days, label: days + " days" };
  }

  function renderHijri() {
    var grid = d.getElementById("hijri-cal-grid");
    var meta = d.getElementById("hijri-cal-meta");
    var title = d.getElementById("hijri-cal-title");
    var ev = d.getElementById("hijri-next-event") || d.getElementById("hijri-ms-event");
    if (!grid) return;
    var now = new Date();
    var h = g2h(now.getFullYear(), now.getMonth() + 1, now.getDate());
    if (title) title.textContent = H_MONTHS[h.hm] + " " + h.hy + " AH";
    if (meta) meta.textContent = "Today: " + h.hd + " " + H_MONTHS[h.hm];

    var dim = daysInHijriMonth(h.hy, h.hm);
    var start = new Date(now);
    start.setDate(now.getDate() - (h.hd - 1));
    var startWd = start.getDay();
    var html = "";
    ["S", "M", "T", "W", "T", "F", "S"].forEach(function (L) {
      html += '<span class="hc-wd">' + L + "</span>";
    });
    for (var i = 0; i < startWd; i++) html += '<span class="hc-empty"></span>';
    for (var d0 = 1; d0 <= dim; d0++) {
      html +=
        '<span class="hc-day' +
        (d0 === h.hd ? " is-today" : "") +
        '">' +
        d0 +
        "</span>";
    }
    grid.innerHTML = html;

    var rc = ramadanCountdown(h);
    var box = d.getElementById("hijri-next-event");
    if (box) {
      box.innerHTML =
        '<span class="ev-name">☪ ' +
        rc.name +
        '</span><span class="ev-days" id="hijri-ms-event">' +
        rc.label +
        "</span>";
    } else if (ev) {
      ev.textContent = rc.name + " · " + rc.label;
    }
  }

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
    if (loc && locLabel) {
      loc.textContent = locLabel;
      loc.classList.add("salah-city");
    }
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
    var next = "Fajr";
    for (var i = 0; i < seq.length; i++) {
      if (mins < toM(times[seq[i]])) {
        next = seq[i];
        break;
      }
    }
    ul.querySelectorAll("li").forEach(function (li) {
      li.classList.toggle("is-next-salah", li.getAttribute("data-salah") === next);
    });
  }

  function tickClock() {
    var el = d.getElementById("hijri-local-time");
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString(undefined, {
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
      return fetch(
        "https://api.aladhan.com/v1/timingsByCity?city=" +
          encodeURIComponent(city) +
          "&country=" +
          encodeURIComponent(country) +
          "&method=2"
      )
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.data && j.data.timings) apply(j.data.timings, city + ", " + country);
        });
    }
    function byGeo(lat, lon) {
      return fetch(
        "https://api.aladhan.com/v1/timings?latitude=" + lat + "&longitude=" + lon + "&method=2"
      )
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.data && j.data.timings)
            apply(j.data.timings, lat.toFixed(2) + ", " + lon.toFixed(2));
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
          byCity("Edmonton", "Canada");
        },
        { maximumAge: 3600000, timeout: 8000 }
      );
    } else byCity("Edmonton", "Canada");
  }

  /** Live stream: ensure iframe allows autoplay when Live is on */
  function wireLiveAutoplay() {
    var iframe = d.getElementById("banner-live");
    var btn = d.getElementById("live-haramain-btn");
    if (iframe) {
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
      iframe.setAttribute("playsinline", "");
    }
    if (!btn || btn.__autoplayWired) return;
    btn.__autoplayWired = true;
    btn.addEventListener("click", function () {
      setTimeout(function () {
        var f = d.getElementById("banner-live");
        if (!f) return;
        f.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
        /* YouTube-style autoplay query if src is set */
        try {
          var src = f.getAttribute("src") || "";
          if (src && src.indexOf("autoplay=1") < 0) {
            f.setAttribute("src", src + (src.indexOf("?") >= 0 ? "&" : "?") + "autoplay=1&mute=1");
          }
        } catch (e) {}
      }, 80);
    });
    /* Prefer existing toggle but force mute autoplay for browser policy */
    var prev = w.toggleHaramainLive;
    if (typeof prev === "function" && !prev.__patchedAutoplay) {
      w.toggleHaramainLive = function () {
        var r = prev.apply(this, arguments);
        setTimeout(function () {
          var f = d.getElementById("banner-live");
          if (!f || f.hidden) return;
          var src = f.getAttribute("src") || "";
          if (src && src.indexOf("autoplay=") < 0) {
            f.setAttribute("src", src + (src.indexOf("?") >= 0 ? "&" : "?") + "autoplay=1&mute=1");
          }
        }, 120);
        return r;
      };
      w.toggleHaramainLive.__patchedAutoplay = true;
    }
  }

  function boot() {
    restyleSeals();
    renderHijri();
    tickClock();
    fetchSalah();
    wireLiveAutoplay();
    setInterval(tickClock, 30000);
    setInterval(renderHijri, 600000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 200);
  });
})(window, document);
