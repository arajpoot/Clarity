/*! companion-g7-content-live-v1
 * Banner live autoplay fortify · Commands + Samiʿnā verses · Ilm 7-day · path-gate craft folds
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G7_CONTENT_LIVE_V1__) return;
  w.__CLARITY_G7_CONTENT_LIVE_V1__ = true;
  var LOG = (w.__G7_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  /* —— Banner live autoplay —— */
  var LIVE = {
    madinah: [
      "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1&rel=0"
    ],
    makkah: [
      "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",
      "https://www.youtube.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1&rel=0"
    ]
  };
  var liveOn = false;
  var liveIdx = 0;

  function place() {
    var sel = d.querySelector("#banner-place, select[data-haramain-place], .banner-place-select");
    if (sel && /makkah/i.test(String(sel.value || sel.textContent || ""))) return "makkah";
    var t = (d.body && d.body.getAttribute("data-haramain-place")) || "";
    if (/makkah/i.test(t)) return "makkah";
    return "madinah";
  }

  function fortifyLive() {
    var iframe = $("banner-live");
    if (!iframe) return;
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    iframe.setAttribute("playsinline", "true");
    iframe.setAttribute("allowfullscreen", "true");
  }

  function showStill() {
    liveOn = false;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (iframe) {
      iframe.hidden = true;
      iframe.removeAttribute("src");
      iframe.setAttribute("aria-hidden", "true");
    }
    if (img) {
      img.style.opacity = "1";
      img.hidden = false;
    }
    d.querySelectorAll(".banner-live-label, #banner-live-label").forEach(function (el) {
      el.textContent = "Stills";
    });
    log("still");
  }

  function showLive() {
    fortifyLive();
    var list = LIVE[place()] || LIVE.madinah;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (!iframe || !list.length) {
      showStill();
      return;
    }
    liveOn = true;
    liveIdx = liveIdx % list.length;
    var url = list[liveIdx];
    iframe.hidden = false;
    iframe.setAttribute("aria-hidden", "false");
    /* force reload for autoplay */
    iframe.src = "about:blank";
    setTimeout(function () {
      if (!liveOn) return;
      iframe.src = url;
      log("live:" + place() + ":" + liveIdx);
    }, 40);
    if (img) img.style.opacity = "0.2";
    d.querySelectorAll(".banner-live-label, #banner-live-label").forEach(function (el) {
      el.textContent = "Live";
    });
  }

  var prevToggle = w.toggleHaramainLive;
  w.toggleHaramainLive = function () {
    if (liveOn) showStill();
    else {
      liveIdx = 0;
      showLive();
    }
  };
  w.clarityBannerShowLive = showLive;
  w.clarityBannerShowStill = showStill;

  /* Wire Live / Stills buttons if present */
  function wireBannerBtns() {
    d.querySelectorAll("[data-banner-live], .btn-live, #banner-btn-live").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        try { e.preventDefault(); } catch (err) {}
        liveIdx = 0;
        showLive();
      });
    });
    d.querySelectorAll("[data-banner-still], .btn-stills, #banner-btn-still").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        try { e.preventDefault(); } catch (err) {}
        showStill();
      });
    });
  }

  /* —— Commands: يَا أَيُّهَا الَّذِينَ آمَنُوا —— */
  var COMMAND_KEYS = [
    "2:153", "2:172", "2:183", "2:208", "2:254", "2:278", "3:102", "3:130", "3:200",
    "4:1", "4:19", "4:29", "4:43", "4:59", "4:135", "4:136", "5:1", "5:6", "5:8", "5:35",
    "5:90", "8:20", "8:24", "8:27", "8:45", "9:119", "22:77", "24:27", "33:41", "33:56",
    "33:70", "49:1", "49:6", "49:11", "49:12", "57:28", "59:18", "61:14", "66:6", "66:8"
  ];
  var cmdIdx = 0;
  var cmdCache = {};

  function parseKey(k) {
    var p = String(k).split(":");
    return { s: parseInt(p[0], 10), a: parseInt(p[1], 10) };
  }

  function fetchAyah(s, a) {
    var key = s + ":" + a;
    if (cmdCache[key]) return Promise.resolve(cmdCache[key]);
    var url =
      "https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih";
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var eds = (j && j.data) || [];
        var ar = "", en = "";
        eds.forEach(function (ed) {
          if (ed && ed.edition && /uthmani|quran/i.test(ed.edition.identifier || "") && !ar)
            ar = ed.text || "";
          if (ed && ed.edition && /sahih|en\./i.test(ed.edition.identifier || "") && !en)
            en = ed.text || "";
          if (!ar && ed && ed.text && ed.edition && ed.edition.language === "ar") ar = ed.text;
          if (!en && ed && ed.text && ed.edition && ed.edition.language === "en") en = ed.text;
        });
        if (Array.isArray(eds) && eds[0] && !ar) ar = eds[0].text || "";
        if (Array.isArray(eds) && eds[1] && !en) en = eds[1].text || "";
        var row = { s: s, a: a, ar: ar, en: en };
        cmdCache[key] = row;
        return row;
      });
  }

  function renderCommand(row) {
    var box = $("command-box");
    if (!box || !row) return;
    box.innerHTML =
      '<div class="arabic" dir="rtl" lang="ar" style="font-size:1.25rem;line-height:1.9;margin:0.35rem 0">' +
      (row.ar || "") +
      "</div>" +
      '<p class="verse-en" style="font-size:0.95rem;line-height:1.55;margin:0.35rem 0">' +
      (row.en || "") +
      "</p>" +
      '<p class="td-src" style="font-size:0.82rem;opacity:0.9">Qur’an ' +
      row.s +
      ":" +
      row.a +
      ' · Sahih International · educational only</p>';
  }

  function showCommand(i) {
    cmdIdx = ((i % COMMAND_KEYS.length) + COMMAND_KEYS.length) % COMMAND_KEYS.length;
    var p = parseKey(COMMAND_KEYS[cmdIdx]);
    var box = $("command-box");
    if (box) box.innerHTML = '<div class="loading-msg">Loading…</div>';
    fetchAyah(p.s, p.a)
      .then(renderCommand)
      .catch(function () {
        if (box)
          box.innerHTML =
            '<p class="td-src">Could not load verse. Check connection, then try Next Command. Educational only — not a fatwa.</p>';
        log("cmd-fail");
      });
  }

  w.nextCommand = function () {
    showCommand(cmdIdx + 1);
  };
  w.prevCommand = function () {
    showCommand(cmdIdx - 1);
  };

  /* —— Daily Samiʿnā verse —— */
  var SAMINA_KEYS = [
    "2:285", "4:59", "4:80", "5:92", "8:1", "8:20", "8:46", "24:51", "24:52", "33:36", "47:33", "64:16"
  ];
  var samIdx = 0;

  function renderSamina(row) {
    var ref = $("samina-verse-ref");
    var ar = $("samina-verse-ar");
    var en = $("samina-verse-en");
    var note = $("samina-verse-note");
    var link = $("samina-verse-link");
    if (ref) ref.textContent = "Qur’an " + row.s + ":" + row.a;
    if (ar) ar.textContent = row.ar || "";
    if (en) en.textContent = row.en || "";
    if (note)
      note.textContent =
        "Reflection: hear and obey — educational reminder only; not a fatwa.";
    if (link) link.href = "https://quran.com/" + row.s + "/" + row.a;
  }

  w.clarityDailySaminaVerse = function (next) {
    if (next) samIdx = (samIdx + 1) % SAMINA_KEYS.length;
    else {
      /* day-stable index */
      var day = Math.floor(Date.now() / 86400000);
      samIdx = day % SAMINA_KEYS.length;
    }
    var p = parseKey(SAMINA_KEYS[samIdx]);
    fetchAyah(p.s, p.a)
      .then(renderSamina)
      .catch(function () {
        log("samina-fail");
      });
  };

  /* —— Ilm pathway 7-day —— */
  var ILM_DAYS = [
    { day: 1, title: "Intention & shahāda", body: "Renew intention for Allāh alone. Review the meaning of the shahāda. Educational reflection — not a conversion ritual." },
    { day: 2, title: "Ṣalāh as covenant", body: "Learn or firm the five daily prayers. Pray on time once today with presence. Verify form with a local teacher." },
    { day: 3, title: "Wuḍūʾ & purity", body: "Practice wuḍūʾ steps carefully. Clean space for prayer. Educational only — ask a scholar for edge cases." },
    { day: 4, title: "Al-Fātiḥah & short surahs", body: "Recite Al-Fātiḥah slowly. Add one short surah (e.g. Al-Ikhlāṣ). Tajweed perfection comes with practice." },
    { day: 5, title: "Morning & evening adhkār", body: "Say a short morning and evening set from authenticated collections (e.g. Hisn al-Muslim themes). Quality over quantity." },
    { day: 6, title: "Character in one deed", body: "Pick one character deed: truthfulness, gentleness, or joining family ties. Act once today for Allāh’s sake." },
    { day: 7, title: "Review & gratitude", body: "Review the week’s foci. Thank Allāh for any consistency. Plan next week lightly — not a grade of īmān." }
  ];

  function ilmKey() {
    return "clarity.ilmPathway.v1";
  }

  function ilmLoadState() {
    try {
      return JSON.parse(localStorage.getItem(ilmKey()) || "{}");
    } catch (e) {
      return {};
    }
  }

  function ilmSaveState(st) {
    try {
      localStorage.setItem(ilmKey(), JSON.stringify(st));
    } catch (e) {}
  }

  function renderIlm() {
    var list = $("ilm-pathway-list");
    if (!list) return;
    var st = ilmLoadState();
    list.innerHTML = "";
    ILM_DAYS.forEach(function (day) {
      var done = !!st["d" + day.day];
      var row = d.createElement("div");
      row.className = "ilm-day-row";
      row.style.cssText =
        "display:flex;gap:0.5rem;align-items:flex-start;padding:0.55rem 0.35rem;border-bottom:1px solid rgba(255,255,255,0.06)";
      row.innerHTML =
        '<label style="display:flex;gap:0.5rem;align-items:flex-start;width:100%;cursor:pointer">' +
        '<input type="checkbox" data-ilm-day="' +
        day.day +
        '" ' +
        (done ? "checked" : "") +
        ' style="margin-top:0.25rem"/>' +
        '<span><strong>Day ' +
        day.day +
        " · " +
        day.title +
        "</strong><br/><span style=\"font-size:0.84rem;opacity:0.9;line-height:1.45\">" +
        day.body +
        "</span></span></label>";
      list.appendChild(row);
    });
    list.querySelectorAll("input[data-ilm-day]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var st2 = ilmLoadState();
        st2["d" + inp.getAttribute("data-ilm-day")] = !!inp.checked;
        ilmSaveState(st2);
        var n = Object.keys(st2).filter(function (k) {
          return st2[k];
        }).length;
        var meta = $("ilm-pathway-summary-meta");
        if (meta) meta.textContent = n + " / 7 marked · one focus per day";
      });
    });
    var n = Object.keys(st).filter(function (k) {
      return st[k];
    }).length;
    var meta = $("ilm-pathway-summary-meta");
    if (meta) meta.textContent = n + " / 7 marked · one focus per day";
    log("ilm-rendered");
  }

  w.ilmPathwayReset = function () {
    ilmSaveState({});
    renderIlm();
  };

  /* —— Path gate: hide meme/callig folds on Seeker + New Muslim —— */
  function pathId() {
    try {
      return (
        d.documentElement.getAttribute("data-clarity-path") ||
        d.body.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_path_gate_v1") ||
        "seeker"
      ).toLowerCase();
    } catch (e) {
      return "seeker";
    }
  }

  function gateCraftFolds() {
    var p = pathId();
    var early = p === "seeker" || p === "new_muslim";
    var ids = ["meme-card", "callig-lab-card", "meme-studio-root"];
    ids.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      var fold = el.closest("details.craft-fold");
      var target = fold || el;
      if (early) {
        target.style.setProperty("display", "none", "important");
        target.setAttribute("hidden", "hidden");
        target.setAttribute("data-path-hidden", "1");
      } else {
        target.style.removeProperty("display");
        target.removeAttribute("hidden");
        target.removeAttribute("data-path-hidden");
      }
    });
    /* also hide fold summaries left empty */
    d.querySelectorAll("details.craft-fold[data-fold-id='meme-card'], details.craft-fold[data-fold-id='callig-lab-card']").forEach(function (f) {
      if (early) {
        f.style.setProperty("display", "none", "important");
        f.setAttribute("hidden", "hidden");
      } else {
        f.style.removeProperty("display");
        f.removeAttribute("hidden");
      }
    });
    log("path-gate:" + p + ":early=" + early);
  }

  var prevSwitch = w.claritySwitchGate;
  w.claritySwitchGate = function (g) {
    if (typeof prevSwitch === "function") {
      try {
        prevSwitch.apply(this, arguments);
      } catch (e) {}
    }
    setTimeout(gateCraftFolds, 50);
    setTimeout(gateCraftFolds, 400);
  };

  function boot() {
    wireBannerBtns();
    fortifyLive();
    showCommand(0);
    w.clarityDailySaminaVerse(false);
    renderIlm();
    gateCraftFolds();
    setTimeout(gateCraftFolds, 800);
    log("g7-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("clarity-path-change", gateCraftFolds);
})(window, document);
