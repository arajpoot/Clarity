/**
 * Clarity Banner Restore 20261027BAN1
 * Salah (AlAdhan) · Hijri meta · Makkah/Madinah temps (Open-Meteo) · live iframe toggle
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_BANNER_RESTORE_V1__) return;
  w.__CLARITY_BANNER_RESTORE_V1__ = true;

  function $(id) { return document.getElementById(id); }
  function setText(id, t) {
    var el = $(id);
    if (el) el.textContent = t;
  }

  function fillSalahList(timings, meta) {
    var ul = $("salah-times-list");
    if (!ul || !timings) return;
    var order = [
      ["Fajr", "Fajr"], ["Sunrise", "Sunrise"], ["Dhuhr", "Dhuhr"],
      ["Asr", "Asr"], ["Maghrib", "Maghrib"], ["Isha", "Isha"]
    ];
    ul.innerHTML = "";
    order.forEach(function (pair) {
      var key = pair[0], label = pair[1];
      var raw = timings[key] || timings[label] || "—";
      var time = String(raw).split(" ")[0];
      var li = document.createElement("li");
      li.innerHTML = '<span class="salah-name">' + label + '</span><span class="salah-time">' + time + "</span>";
      ul.appendChild(li);
    });
    if (meta && meta.loc) {
      setText("hijri-local-loc", meta.loc);
      var locEl = $("hijri-local-loc");
      if (locEl) locEl.textContent = meta.loc;
    }
  }

  function fillHijri(data) {
    try {
      var h = data.data && data.data.date && data.data.date.hijri;
      if (!h) return;
      var line = (h.day || "") + " " + ((h.month && h.month.en) || "") + " " + (h.year || "") + " AH";
      setText("hijri-cal-meta", line);
      setText("hijri-cal-title", "Hijri · " + (h.month && h.month.ar ? h.month.ar : "تقويم"));
      var grid = $("hijri-cal-grid");
      if (grid && !grid.textContent.trim()) {
        grid.textContent = (h.weekday && h.weekday.en ? h.weekday.en + " · " : "") + line;
      }
      var next = $("hijri-ms-event");
      if (next && (!next.textContent || next.textContent.indexOf("…") >= 0)) {
        next.textContent = line;
      }
    } catch (e) {}
  }

  function nextSalahName(timings) {
    if (!timings) return;
    var names = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    function toMins(t) {
      var p = String(t).split(" ")[0].split(":");
      return (+p[0]) * 60 + (+p[1] || 0);
    }
    for (var i = 0; i < names.length; i++) {
      var t = timings[names[i]];
      if (t && toMins(t) > mins) {
        setText("salah-title", "Ṣalāh · " + names[i]);
        var cdl = $("cdl-salah-name");
        if (cdl) cdl.textContent = names[i];
        var df = $("df-salah");
        if (df) df.textContent = names[i] + " · see list in banner";
        return names[i];
      }
    }
    setText("salah-title", "Ṣalāh · Fajr");
  }

  function loadPrayer(lat, lon, cityLabel) {
    var url = "https://api.aladhan.com/v1/timings?latitude=" + lat + "&longitude=" + lon + "&method=2";
    return fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      if (!data || data.code !== 200 || !data.data) return;
      fillSalahList(data.data.timings, { loc: cityLabel || "" });
      fillHijri(data);
      nextSalahName(data.data.timings);
      try {
        localStorage.setItem("clarity_banner_salah_v1", JSON.stringify({
          ts: Date.now(), timings: data.data.timings, hijri: data.data.date && data.data.date.hijri, loc: cityLabel
        }));
      } catch (e) {}
    }).catch(function () {});
  }

  function loadTemps() {
    function one(lat, lon) {
      var u = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m";
      return fetch(u).then(function (r) { return r.json(); }).then(function (j) {
        return j && j.current ? Math.round(j.current.temperature_2m) : null;
      }).catch(function () { return null; });
    }
    Promise.all([one(21.4225, 39.8262), one(24.4672, 39.6024)]).then(function (arr) {
      if (arr[0] != null) setText("temp-makkah", String(arr[0]));
      if (arr[1] != null) setText("temp-madinah", String(arr[1]));
    });
  }

  function wireLive() {
    var btn = $("live-haramain-btn") || $("stream-btn");
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (!btn || !iframe) return;
    if (btn.__brWired) return;
    btn.__brWired = true;
    btn.addEventListener("click", function () {
      try {
        var sel = $("stream-select") || $("live-place-select");
        var place = sel ? (sel.value || "madinah") : "madinah";
        // YouTube Haramain-style placeholders — user may have real embeds elsewhere
        var map = {
          madinah: "https://www.youtube.com/embed/live_stream?channel=UCq5PHwm3PFmpgmqt26HzW4Q",
          makkah: "https://www.youtube.com/embed/live_stream?channel=UCq5PHwm3PFmpgmqt26HzW4Q"
        };
        // Prefer existing data-src on iframe
        var src = iframe.getAttribute("data-src") || iframe.src || "";
        if (!src || src === "about:blank" || src.indexOf("youtube") < 0) {
          src = map[place] || map.madinah;
        }
        iframe.hidden = false;
        iframe.style.display = "block";
        if (img) img.style.display = "none";
        if (!iframe.src || iframe.src === "about:blank" || iframe.src.indexOf(src) < 0) {
          iframe.src = src;
        }
        var lab = $("live-haramain-label") || $("stream-text");
        if (lab) lab.textContent = "Live";
      } catch (e) {}
    });
  }

  function fromCache() {
    try {
      var raw = localStorage.getItem("clarity_banner_salah_v1");
      if (!raw) return false;
      var c = JSON.parse(raw);
      if (!c || !c.ts || Date.now() - c.ts > 6 * 3600 * 1000) return false;
      fillSalahList(c.timings, { loc: c.loc });
      if (c.hijri) fillHijri({ data: { date: { hijri: c.hijri } } });
      nextSalahName(c.timings);
      return true;
    } catch (e) { return false; }
  }

  function run() {
    wireLive();
    loadTemps();
    fromCache();
    function withCoords(lat, lon, label) {
      loadPrayer(lat, lon, label);
    }
    // Default Edmonton from UI if shown, else try geo
    var locEl = $("hijri-local-loc");
    var shown = locEl && locEl.textContent ? locEl.textContent : "";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          withCoords(pos.coords.latitude, pos.coords.longitude, shown || "Local");
        },
        function () {
          // Edmonton fallback from screenshot region
          withCoords(53.5461, -113.4938, "Edmonton, Alberta, Canada");
        },
        { timeout: 8000, maximumAge: 600000 }
      );
    } else {
      withCoords(53.5461, -113.4938, "Edmonton, Alberta, Canada");
    }
  }

  w.clarityRefreshBanner = run;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 100); });
  } else setTimeout(run, 100);
  w.addEventListener("load", function () { setTimeout(run, 400); });
  document.addEventListener("clarity-banner-nudge", function () { setTimeout(run, 50); });
})(typeof window !== "undefined" ? window : this);
