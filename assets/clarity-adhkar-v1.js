/**
 * Companion daily adhkār · 20261020ADH
 * One dhikr at a time under Do this today · morning/evening windows
 * Bridges to tasbeeh counter · local only · educational — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_ADHKAR_V1__ === "20261020ADH") return;
  w.__CLARITY_ADHKAR_V1__ = "20261020ADH";

  var KEY_PROG = "clarity_adhkar_progress_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";
  var morningCache = null;
  var eveningCache = null;

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function readJSON(k) {
    try {
      return JSON.parse(localStorage.getItem(k) || "null");
    } catch (e) {
      return null;
    }
  }
  function writeJSON(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }

  function parseSalahMap() {
    var map = {};
    var text = "";
    try {
      text = (document.getElementById("clarity-top-duo") || document.body).innerText || "";
    } catch (e) {}
    var re = /(Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha)\s*[:\s]*([0-2]?\d:[0-5]\d)/gi;
    var m;
    while ((m = re.exec(text))) {
      var key = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
      if (m[1].toLowerCase() === "dhuhr") key = "Dhuhr";
      if (m[1].toLowerCase() === "isha") key = "Isha";
      map[key] = m[2];
    }
    return map;
  }

  function hmToToday(hm) {
    if (!hm) return null;
    var p = hm.split(":");
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), +p[0], +p[1], 0);
  }

  /** preferred windows; soft fallbacks documented in UI */
  function resolveWindow() {
    var map = parseSalahMap();
    var now = new Date();
    var fajr = hmToToday(map.Fajr);
    var sunrise = hmToToday(map.Sunrise);
    var asr = hmToToday(map.Asr);
    var maghrib = hmToToday(map.Maghrib);
    var isha = hmToToday(map.Isha);

    if (fajr && sunrise && now >= fajr && now < sunrise) {
      return { id: "morning", preferred: true, label: "Morning adhkār", label_ar: "أذكار الصباح" };
    }
    if (fajr && asr && now >= fajr && now < asr && (!sunrise || now < sunrise || now < asr)) {
      /* after sunrise until Asr: still allow morning list as soft */
      if (sunrise && now >= sunrise) {
        return { id: "morning", preferred: false, label: "Morning adhkār (soft window)", label_ar: "أذكار الصباح" };
      }
    }
    if (asr && maghrib && now >= asr && now < maghrib) {
      return { id: "evening", preferred: true, label: "Evening adhkār", label_ar: "أذكار المساء" };
    }
    if (maghrib && isha && now >= maghrib && now < isha) {
      return { id: "evening", preferred: false, label: "Evening adhkār (soft window)", label_ar: "أذكار المساء" };
    }
    if (isha && now >= isha) {
      return { id: "evening", preferred: false, label: "Evening adhkār (night)", label_ar: "أذكار المساء" };
    }
    if (fajr && now < fajr) {
      return { id: "evening", preferred: false, label: "Evening adhkār (before Fajr)", label_ar: "أذكار المساء" };
    }
    /* clock fallback if salah times missing */
    var h = now.getHours();
    if (h >= 4 && h < 12) return { id: "morning", preferred: false, label: "Morning adhkār", label_ar: "أذكار الصباح" };
    return { id: "evening", preferred: false, label: "Evening adhkār", label_ar: "أذكار المساء" };
  }

  function fetchPack(which) {
    if (which === "morning" && morningCache) return Promise.resolve(morningCache);
    if (which === "evening" && eveningCache) return Promise.resolve(eveningCache);
    var url = "/adhkar/data/" + which + ".json?v=20261020ADH";
    return fetch(url, { credentials: "same-origin" })
      .then(function (r) {
        if (!r.ok) throw new Error("adhkar fetch");
        return r.json();
      })
      .then(function (data) {
        if (which === "morning") morningCache = data;
        else eveningCache = data;
        return data;
      })
      .catch(function () {
        return embeddedFallback(which);
      });
  }

  function embeddedFallback(which) {
    /* minimal offline seed if JSON 404 */
    var item = {
      id: which + "-istighfar",
      ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      en: "O Allah, You are my Lord; there is no god but You… (Sayyid al-istighfār).",
      count: 1,
      source: "Bukhārī 6306",
      grade: "ṣaḥīḥ",
      note: "Offline seed."
    };
    return {
      window: which,
      label: which === "morning" ? "Morning adhkār" : "Evening adhkār",
      label_ar: which === "morning" ? "أذكار الصباح" : "أذكار المساء",
      items: [item]
    };
  }

  function progState(winId) {
    var day = todayKey();
    var s = readJSON(KEY_PROG) || {};
    if (s.day !== day) s = { day: day, morning: 0, evening: 0, done: {} };
    if (typeof s[winId] !== "number") s[winId] = 0;
    if (!s.done) s.done = {};
    return s;
  }

  function saveProg(s) {
    writeJSON(KEY_PROG, s);
  }

  function bumpTasbeeh(n) {
    n = n || 1;
    var day = todayKey();
    var s = readJSON(KEY_TAS) || {};
    if (s.day !== day) s = { day: day, count: 0 };
    s.count = (s.count || 0) + n;
    writeJSON(KEY_TAS, s);
    var el = document.getElementById("cph-tas-count");
    if (el) el.textContent = String(s.count);
  }

  function hostParent() {
    var prov = document.getElementById("clarity-provision-home");
    if (prov && prov.parentNode) return { parent: prov.parentNode, after: prov };
    var main =
      document.getElementById("main-application-workspace") ||
      document.querySelector("main") ||
      document.body;
    return { parent: main, after: null };
  }

  function renderCard(win, pack, index) {
    var items = (pack && pack.items) || [];
    if (!items.length) return;
    var i = ((index % items.length) + items.length) % items.length;
    var item = items[i];
    var root = document.getElementById("clarity-adhkar-daily");
    if (!root) {
      root = document.createElement("section");
      root.id = "clarity-adhkar-daily";
      root.className = "clarity-adhkar-daily";
      root.setAttribute("aria-label", "Daily adhkār");
      var hp = hostParent();
      if (hp.after && hp.after.nextSibling) {
        hp.parent.insertBefore(root, hp.after.nextSibling);
      } else if (hp.after) {
        hp.parent.appendChild(root);
      } else {
        hp.parent.insertBefore(root, hp.parent.firstChild);
      }
    }

    var soft = win.preferred ? "" : '<span class="cad-soft">Preferred window may have passed — still beneficial to remember Allah.</span>';
    root.innerHTML =
      '<div class="cad-card">' +
      '<div class="cad-head">' +
      '<span class="cad-window">' +
      (win.label_ar || "") +
      " · " +
      (win.label || "") +
      "</span>" +
      '<span class="cad-pos">' +
      (i + 1) +
      " / " +
      items.length +
      "</span></div>" +
      soft +
      '<p class="cad-ar" dir="rtl" lang="ar">' +
      (item.ar || "") +
      "</p>" +
      '<p class="cad-en">' +
      (item.en || "") +
      "</p>" +
      '<p class="cad-meta"><strong>×' +
      (item.count || 1) +
      "</strong> · " +
      (item.source || "") +
      " · " +
      (item.grade || "") +
      "</p>" +
      (item.note ? '<p class="cad-note">' + item.note + "</p>" : "") +
      '<div class="cad-actions">' +
      '<button type="button" class="cad-btn" id="cad-tas" data-n="' +
      (item.count || 1) +
      '">📿 Count with tasbeeh</button>' +
      '<button type="button" class="cad-btn ghost" id="cad-next">Next</button>' +
      '<button type="button" class="cad-btn ghost" id="cad-prev">Prev</button>' +
      "</div>" +
      '<p class="cad-foot">Educational only — not a fatwa. Acceptance is with Allah.</p>' +
      "</div>";

    var s = progState(win.id);
    s[win.id] = i;
    saveProg(s);

    var next = root.querySelector("#cad-next");
    var prev = root.querySelector("#cad-prev");
    var tas = root.querySelector("#cad-tas");
    if (next) {
      next.onclick = function () {
        var st = progState(win.id);
        st[win.id] = i + 1;
        saveProg(st);
        renderCard(win, pack, i + 1);
      };
    }
    if (prev) {
      prev.onclick = function () {
        var st = progState(win.id);
        st[win.id] = i - 1;
        saveProg(st);
        renderCard(win, pack, i - 1);
      };
    }
    if (tas) {
      tas.onclick = function () {
        var n = parseInt(tas.getAttribute("data-n") || "1", 10) || 1;
        /* single tap adds 1 toward count; long lists: add 1 for mindful pace */
        bumpTasbeeh(1);
        tas.classList.add("cad-pulse");
        setTimeout(function () {
          tas.classList.remove("cad-pulse");
        }, 280);
      };
    }
  }

  function boot() {
    try {
      var win = resolveWindow();
      var st = progState(win.id);
      fetchPack(win.id).then(function (pack) {
        renderCard(win, pack, st[win.id] || 0);
      });
    } catch (e) {
      try {
        console.warn("adhkar", e);
      } catch (e2) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 900);
  setTimeout(boot, 2800);
  /* re-resolve when provision may have painted */
  setInterval(function () {
    if (!document.getElementById("clarity-adhkar-daily")) boot();
  }, 15000);
})(typeof window !== "undefined" ? window : this);
