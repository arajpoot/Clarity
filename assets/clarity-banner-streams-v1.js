/**
 * Clarity Banner Streams + Salah + Hijri repair v1 · 20261012BANNER
 * Educational companion only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_BANNER_REPAIR_V1__) return;
  g.__CLARITY_BANNER_REPAIR_V1__ = true;

  var RECITER_CDN = {
    afs: "https://cdn.islamic.network/quran/audio/128/ar.alafasy/",
    basit: "https://cdn.islamic.network/quran/audio/128/ar.abdulsamad/",
    sds: "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/",
    maher: "https://cdn.islamic.network/quran/audio/128/ar.mahermuaiqly/",
    ajm: "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/",
    ghamdi: "https://cdn.islamic.network/quran/audio/128/ar.saadalghamdi/",
    husary: "https://cdn.islamic.network/quran/audio/128/ar.husary/",
    minshawi: "https://cdn.islamic.network/quran/audio/128/ar.minshawi/",
    shatri: "https://cdn.islamic.network/quran/audio/128/ar.abdullahbasfar/",
    yasser: "https://cdn.islamic.network/quran/audio/128/ar.yasserdussary/"
  };
  /* everyayah style fallbacks for full surah: https://everyayah.com/data/... */
  var EVERYAYAH = {
    afs: "https://everyayah.com/data/Alafasy_128kbps/",
    basit: "https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/",
    sds: "https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/",
    maher: "https://everyayah.com/data/MaherAlMuaiqly128kbps/",
    ajm: "https://everyayah.com/data/Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net/",
    ghamdi: "https://everyayah.com/data/Ghamadi_40kbps/",
    husary: "https://everyayah.com/data/Husary_128kbps/",
    minshawi: "https://everyayah.com/data/Minshawy_Murattal_128kbps/",
    shatri: "https://everyayah.com/data/Abu_Bakr_Ash-Shaatree_128kbps/",
    yasser: "https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/"
  };

  var SURAH_NAMES = [
    "", "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah",
    "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
    "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut",
    "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
    "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat",
    "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila",
    "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim",
    "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah",
    "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq",
    "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha",
    "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur",
    "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad",
    "Al-Ikhlas", "Al-Falaq", "An-Nas"
  ];

  var state = { playing: false, reciter: "afs", mode: "radio" };

  function $(id) {
    return document.getElementById(id);
  }
  function audioEl() {
    return $("quran-audio") || $("stream-audio");
  }

  function populateSurahList() {
    var sel = $("surah-list-pill");
    if (!sel || sel.options.length > 5) return;
    sel.innerHTML = '<option value="">📖 Surahs…</option>';
    for (var i = 1; i <= 114; i++) {
      var o = document.createElement("option");
      var n = String(i).padStart(3, "0");
      o.value = String(i);
      o.textContent = n + " · " + (SURAH_NAMES[i] || "Surah " + i);
      sel.appendChild(o);
    }
  }

  function expandRadioOptions() {
    var sel = $("stream-select");
    if (!sel) return;
    var extras = [
      ["https://qurango.net/radio/tarateel", "Tarateel"],
      ["https://qurango.net/radio/salma", "Salma"],
      ["https://qurango.net/radio/ibrahim_aljibreen", "Al-Jibreen"],
      ["https://qurango.net/radio/abdulbasit_abdussamad_mojawwad", "Basit Mujawwad"],
      ["https://backup.qurango.net/radio/translation_quran_english_basit", "English Translation"],
      ["https://backup.qurango.net/radio/translation_quran_urdu_basit", "Urdu Translation"],
      ["https://qurango.net/radio/mix", "Beautiful Mix"],
      ["https://qurango.net/radio/ghamdi", "Saad Al-Ghamdi"],
      ["https://qurango.net/radio/alafasy", "Alafasy Radio"],
      ["https://qurango.net/radio/sudais", "As-Sudais Radio"],
      ["https://qurango.net/radio/ajmy", "Al-Ajmy Radio"],
      ["https://qurango.net/radio/maher", "Maher Al-Muaiqly"]
    ];
    var have = {};
    for (var i = 0; i < sel.options.length; i++) have[sel.options[i].value] = true;
    extras.forEach(function (pair) {
      if (have[pair[0]]) return;
      var o = document.createElement("option");
      o.value = pair[0];
      o.textContent = pair[1];
      sel.appendChild(o);
    });
  }

  function setStreamButton(playing) {
    state.playing = !!playing;
    var icon = $("stream-icon");
    var text = $("stream-text");
    if (icon) icon.textContent = playing ? "⏸" : "▶";
    if (text) text.textContent = playing ? "Pause" : "Listen";
  }

  function changeStream() {
    var sel = $("stream-select");
    var a = audioEl();
    if (!sel || !a) return;
    var url = sel.value;
    if (!url) return;
    state.mode = "radio";
    try {
      a.pause();
      a.src = url;
      a.load();
      var p = a.play();
      if (p && p.then) p.then(function () { setStreamButton(true); }).catch(function () { setStreamButton(false); });
      else setStreamButton(true);
    } catch (e) {
      setStreamButton(false);
    }
  }

  function toggleQuranStream() {
    var a = audioEl();
    if (!a) return;
    if (!a.src || a.src === window.location.href) {
      changeStream();
      return;
    }
    if (a.paused) {
      var p = a.play();
      if (p && p.then) p.then(function () { setStreamButton(true); }).catch(function () { setStreamButton(false); });
      else setStreamButton(true);
    } else {
      a.pause();
      setStreamButton(false);
    }
  }

  function pad3(n) {
    return String(n).padStart(3, "0");
  }

  function playSurah(num) {
    num = parseInt(num, 10);
    if (!(num >= 1 && num <= 114)) return;
    var a = audioEl();
    if (!a) return;
    var rec = state.reciter || "afs";
    var base = EVERYAYAH[rec] || EVERYAYAH.afs;
    /* full surah as first ayah chain - play 001001 style folder: many CDNs use SURAH001.mp3 */
    var candidates = [
      base + pad3(num) + ".mp3",
      (RECITER_CDN[rec] || RECITER_CDN.afs) + num + ".mp3",
      "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" + num + ".mp3"
    ];
    state.mode = "surah";
    var idx = 0;
    function tryNext() {
      if (idx >= candidates.length) {
        setStreamButton(false);
        return;
      }
      a.src = candidates[idx++];
      a.load();
      var p = a.play();
      if (p && p.then) {
        p.then(function () { setStreamButton(true); }).catch(function () { tryNext(); });
      } else setStreamButton(true);
    }
    a.onerror = function () { tryNext(); };
    tryNext();
  }

  function clarityPlaySurahFromSelect(sel) {
    if (!sel) return;
    var v = sel.value;
    if (!v) return;
    playSurah(v);
  }

  function claritySetReciter(val) {
    if (val) state.reciter = val;
    try {
      localStorage.setItem("clarity_reciter_v1", state.reciter);
    } catch (e) {}
  }

  function claritySurpriseSurahReciter() {
    var n = 1 + Math.floor(Math.random() * 114);
    var keys = Object.keys(EVERYAYAH);
    state.reciter = keys[Math.floor(Math.random() * keys.length)];
    var rp = $("surah-reciter-pill");
    if (rp) rp.value = state.reciter;
    var sp = $("surah-list-pill");
    if (sp) sp.value = String(n);
    playSurah(n);
  }

  /* —— Salah via AlAdhan —— */
  function fillSalah(data) {
    var ul = $("salah-times-list");
    if (!ul || !data || !data.data || !data.data.timings) return;
    var t = data.data.timings;
    var order = [
      ["Fajr", t.Fajr],
      ["Dhuhr", t.Dhuhr],
      ["Asr", t.Asr],
      ["Maghrib", t.Maghrib],
      ["Isha", t.Isha]
    ];
    ul.innerHTML = "";
    order.forEach(function (row) {
      var li = document.createElement("li");
      li.innerHTML =
        '<span class="salah-name">' +
        row[0] +
        '</span><span class="salah-time">' +
        String(row[1]).slice(0, 5) +
        "</span>";
      ul.appendChild(li);
    });
    if (data.data.date && data.data.date.hijri) {
      var h = data.data.date.hijri;
      var title = $("hijri-cal-title") || $("hijri-local-time");
      var label = (h.day || "") + " " + (h.month && h.month.en ? h.month.en : "") + " " + (h.year || "");
      if ($("hijri-cal-meta")) $("hijri-cal-meta").textContent = label + " AH";
      var side = document.querySelector(".hijri-date, #hijri-date, .banner-hijri-date");
      if (side) side.textContent = label;
      /* update plaque text nodes carefully */
      var plaque = document.querySelector("#hijri-cal-title");
      if (plaque) plaque.textContent = (h.month && (h.month.ar || h.month.en)) || "Hijri";
    }
  }

  function loadSalah(lat, lon) {
    var url =
      "https://api.aladhan.com/v1/timings?latitude=" +
      encodeURIComponent(lat) +
      "&longitude=" +
      encodeURIComponent(lon) +
      "&method=2";
    fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(fillSalah)
      .catch(function () {
        /* Makkah fallback */
        return fetch("https://api.aladhan.com/v1/timingsByCity?city=Makkah&country=SA&method=2")
          .then(function (r) {
            return r.json();
          })
          .then(fillSalah);
      });
  }

  function loadSalahSmart() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          loadSalah(pos.coords.latitude, pos.coords.longitude);
          try {
            var loc = $("hijri-local-loc");
            if (loc) loc.textContent = pos.coords.latitude.toFixed(2) + "°, " + pos.coords.longitude.toFixed(2) + "°";
          } catch (e) {}
        },
        function () {
          loadSalah(21.4225, 39.8262); /* Makkah */
        },
        { timeout: 8000, maximumAge: 600000 }
      );
    } else {
      loadSalah(21.4225, 39.8262);
    }
  }

  function tickLocalTime() {
    var el = $("hijri-local-time");
    if (!el) return;
    try {
      el.textContent = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch (e) {}
  }

  function boot() {
    try {
      state.reciter = localStorage.getItem("clarity_reciter_v1") || "afs";
    } catch (e) {}
    populateSurahList();
    expandRadioOptions();
    loadSalahSmart();
    tickLocalTime();
    setInterval(tickLocalTime, 30000);
    var a = audioEl();
    if (a) {
      a.addEventListener("ended", function () {
        setStreamButton(false);
      });
      a.addEventListener("pause", function () {
        if (a.paused) setStreamButton(false);
      });
      a.addEventListener("play", function () {
        setStreamButton(true);
      });
    }
  }

  g.changeStream = changeStream;
  g.toggleQuranStream = toggleQuranStream;
  g.clarityPlaySurahFromSelect = clarityPlaySurahFromSelect;
  g.claritySetReciter = claritySetReciter;
  g.claritySurpriseSurahReciter = claritySurpriseSurahReciter;
  g.clarityPlaySurah = playSurah;
  g.clarityReloadSalah = loadSalahSmart;


  function formatDDMMYYYY(d) {
    var dd = String(d.getDate()).padStart(2, "0");
    var mm = String(d.getMonth() + 1).padStart(2, "0");
    return dd + "-" + mm + "-" + d.getFullYear();
  }
  function buildMiniGrid(todayDay) {
    var grid = document.getElementById("hijri-cal-grid");
    if (!grid) return;
    var html = "";
    ["S","M","T","W","T","F","S"].forEach(function (d) {
      html += '<span class="dow">' + d + "</span>";
    });
    for (var i = 1; i <= 30; i++) {
      html += '<span class="day' + (i === todayDay ? " today" : "") + '">' + i + "</span>";
    }
    grid.innerHTML = html;
  }
  function loadHijriCalendar() {
    fetch("https://api.aladhan.com/v1/gToH?date=" + formatDDMMYYYY(new Date()))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var h = j && j.data && j.data.hijri;
        if (!h) return;
        var meta = document.getElementById("hijri-cal-meta");
        if (meta) meta.textContent = "Today: " + h.day + " " + (h.month && h.month.en) + " " + h.year;
        var title = document.getElementById("hijri-cal-title");
        if (title) title.textContent = ((h.month && h.month.en) || "Hijri").toUpperCase() + " · " + h.year;
        buildMiniGrid(parseInt(h.day, 10) || 1);
        /* side plaque */
        var plaque = document.querySelector(".hijri-plaque-date, #hijri-side-date");
        if (plaque) plaque.textContent = h.day + " " + (h.month && h.month.en) + " " + h.year + " AH";
        /* temps placeholder — optional open-meteo later */
        var t1 = document.getElementById("hijri-temps");
        if (t1 && (!t1.textContent || t1.textContent.indexOf("—") >= 0)) {
          t1.textContent = "Makkah · Madinah";
        }
      })
      .catch(function () {
        buildMiniGrid(1);
        var meta = document.getElementById("hijri-cal-meta");
        if (meta) meta.textContent = "Hijri unavailable offline";
      });
  }

  /** Bottom rail tabs — base door (path-pack only wraps if this exists) */
  function clarityOpenSectionDoor(name) {
    name = String(name || "reminder").toLowerCase();
    var map = { reminder: "tab-reminder", reality: "tab-reality", reflection: "tab-reflection", action: "tab-action", notes: "tab-notes", amana: "tab-notes", journey: "tab-reminder" };
    var id = map[name] || "tab-" + name;
    document.querySelectorAll(".tab-panel").forEach(function (panel) {
      var on = panel.id === id;
      panel.classList.toggle("active", on);
      panel.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        panel.hidden = false;
        panel.style.display = "block";
        panel.style.removeProperty("visibility");
      } else {
        panel.style.display = "none";
      }
    });
    document.querySelectorAll("[data-rail-tab], .door-rail-btn, .dr-btn").forEach(function (btn) {
      var t = btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "";
      btn.classList.toggle("active", t === name);
    });
    try {
      document.body.setAttribute("data-active-tab", name);
    } catch (e) {}
    var panel = document.getElementById(id);
    if (panel) {
      try {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e2) {}
    }
    return panel;
  }

  g.clarityOpenSectionDoor = clarityOpenSectionDoor;
  g.buildMiniGrid = buildMiniGrid;
  g.loadHijriCalendar = loadHijriCalendar;

  var _boot = boot;
  boot = function () {
    _boot();
    try {
      loadHijriCalendar();
    } catch (e) {}
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
