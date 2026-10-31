/*! Clarity Banner Integrity v1 · 20261031BI1
 * Hijri plaque · Makkah/Madinah temps · Ṣalāh list · local clock
 * Educational display only — not a fatwa · verify with local mosque.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_INTEGRITY_V1__) return;
  w.__CLARITY_BANNER_INTEGRITY_V1__ = true;

  function $(id) {
    return document.getElementById(id);
  }

  function setTxt(el, t) {
    if (!el) return;
    el.textContent = t;
  }

  /* ----- Hijri ----- */
  function hijriLabel(d) {
    try {
      return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(d);
    } catch (e) {
      return d.toDateString();
    }
  }

  function hijriParts(d) {
    try {
      var parts = new Intl.DateTimeFormat("en-u-ca-islamic", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      }).formatToParts(d);
      var o = {};
      parts.forEach(function (p) {
        if (p.type !== "literal") o[p.type] = p.value;
      });
      return o;
    } catch (e) {
      return null;
    }
  }

  function repairHijri() {
    var now = new Date();
    var label = hijriLabel(now);
    setTxt($("hijri-cal-title"), "Hijri · تقويم");
    setTxt($("hijri-cal-meta"), label);
    setTxt($("hijri-ms-event"), "Educational calendar · not a fatwa");

    var grid = $("hijri-cal-grid");
    if (grid && (!grid.children.length || /loading|…/i.test(grid.textContent || ""))) {
      var p = hijriParts(now) || {};
      grid.innerHTML = "";
      var day = document.createElement("div");
      day.className = "hcg-day";
      day.textContent = p.day || String(now.getDate());
      var mon = document.createElement("div");
      mon.className = "hcg-month";
      mon.textContent = (p.month ? "M" + p.month + " · " : "") + label.split(" ").slice(0, 2).join(" ");
      grid.appendChild(day);
      grid.appendChild(mon);
    }

    var greg = now.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    var meta = $("hijri-cal-meta");
    if (meta && meta.textContent.indexOf(greg) < 0) {
      meta.textContent = label + " · " + greg;
    }
  }

  /* ----- Temps (Open-Meteo, no key) ----- */
  function repairTemps() {
    var mk = $("temp-makkah");
    var md = $("temp-madinah");
    if (!mk && !md) return;
    if (mk && mk.textContent && !/[—–\-]/.test(mk.textContent) && !/…/.test(mk.textContent)) return;

    function fill(lat, lon, el) {
      if (!el) return Promise.resolve();
      var url =
        "https://api.open-meteo.com/v1/forecast?latitude=" +
        lat +
        "&longitude=" +
        lon +
        "&current=temperature_2m";
      return fetch(url, { credentials: "omit" })
        .then(function (r) {
          return r.json();
        })
        .then(function (j) {
          var t = j && j.current && j.current.temperature_2m;
          if (typeof t === "number") setTxt(el, String(Math.round(t)));
        })
        .catch(function () {
          if (/[—–\-…]/.test(el.textContent || "")) setTxt(el, "—");
        });
    }
    /* Makkah ~21.42,39.83 · Madinah ~24.47,39.61 */
    fill(21.4225, 39.8262, mk);
    fill(24.4672, 39.6117, md);
  }

  /* ----- Ṣalāh list ----- */
  function cityPrefs() {
    var city = "Makkah";
    var country = "SA";
    try {
      var c = localStorage.getItem("clarity_salah_city");
      var co = localStorage.getItem("clarity_salah_country");
      if (c) city = c;
      if (co) country = co;
    } catch (e) {}
    return { city: city, country: country };
  }

  function paintSalahList(timings, cityLabel) {
    var list = $("salah-times-list");
    if (!list || !timings) return;
    var order = [
      ["Fajr", "Fajr"],
      ["Dhuhr", "Dhuhr"],
      ["Asr", "ʿAṣr"],
      ["Maghrib", "Maghrib"],
      ["Isha", "ʿIshāʾ"],
    ];
    var html = "";
    order.forEach(function (pair) {
      var key = pair[0];
      var name = pair[1];
      var raw = timings[key] || "—";
      var time = String(raw).split(" ")[0].slice(0, 5);
      html +=
        '<li><span class="salah-name">' +
        name +
        '</span><span class="salah-time" data-salah="' +
        key +
        '">' +
        time +
        "</span></li>";
    });
    list.innerHTML = html;
    setTxt($("salah-title"), "Ṣalāh");
    setTxt($("hijri-local-loc"), cityLabel + " · method 2 · educational");
  }

  function repairSalah() {
    var list = $("salah-times-list");
    if (!list) return;
    var filled = list.querySelectorAll(".salah-time");
    var ok = false;
    filled.forEach(function (el) {
      if (el.textContent && /^\d{1,2}:\d{2}/.test(el.textContent.trim())) ok = true;
    });
    if (ok && filled.length >= 5) return;

    var pref = cityPrefs();
    var url =
      "https://api.aladhan.com/v1/timingsByCity?city=" +
      encodeURIComponent(pref.city) +
      "&country=" +
      encodeURIComponent(pref.country) +
      "&method=2";
    fetch(url, { credentials: "omit" })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        var t = j && j.data && j.data.timings;
        if (!t) throw new Error("no timings");
        paintSalahList(t, pref.city);
      })
      .catch(function () {
        /* Fallback: Makkah fixed educational placeholder times cleared — show offline note */
        if (!list.querySelector(".salah-time") || /loading|…/i.test(list.textContent || "")) {
          list.innerHTML =
            '<li><span class="salah-name">Offline</span><span class="salah-time">—</span></li>';
          setTxt($("hijri-local-loc"), "Times unavailable · try again online");
        }
      });
  }

  /* ----- Local clock ----- */
  function tickClock() {
    var el = $("hijri-local-time");
    if (!el) return;
    var n = new Date();
    var hh = String(n.getHours()).padStart(2, "0");
    var mm = String(n.getMinutes()).padStart(2, "0");
    setTxt(el, hh + ":" + mm);
  }

  /* ----- AV / control strip soft heal ----- */
  function healAv() {
    try {
      var live = $("banner-live");
      var img = $("banner-img");
      if (img && !img.getAttribute("src")) {
        img.src =
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg";
      }
      /* ensure media container not aria-blocking clicks on overlay */
      var media = $("banner-media");
      if (media) media.style.pointerEvents = "none";
      var overlay = document.querySelector("#clarity-top-duo .banner-overlay");
      if (overlay) overlay.style.pointerEvents = "auto";
    } catch (e) {}
  }

  function run() {
    repairHijri();
    repairTemps();
    repairSalah();
    tickClock();
    healAv();
  }

  function boot() {
    run();
    setInterval(tickClock, 30000);
    setTimeout(run, 600);
    setTimeout(run, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(run, 400);
  });

  w.ClarityBannerIntegrity = { run: run, repairSalah: repairSalah, repairTemps: repairTemps };
})(typeof window !== "undefined" ? window : this);
