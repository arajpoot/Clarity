/**
 * Tajweed + Samina restore · 20261022P17
 * - Boot daily samina verse + daily tajweed module on load
 * - Rule tiles for deep studio
 * - Embed-fold video: load iframe data-src on open
 * - LMR mode toggles + basic listen via EveryAyah when possible
 * Waits for chunk-8 if present; has local fallbacks.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_TAJWEED_RESTORE_V1__) return;
  w.__CLARITY_TAJWEED_RESTORE_V1__ = "20261022P17";

  var RULES = [
    { t: "Izhār (إظهار)", b: "Nūn sākinah or tanwīn before ء ه ع ح غ خ: keep the nūn clear — no ghunnah merge." },
    { t: "Ikhfāʾ (إخفاء)", b: "Hide nūn/tanwīn before the remaining letters with light ghunnah (غُنّة)." },
    { t: "Idghām (إدغام)", b: "Nūn/tanwīn + ي ن م و: merge; with ghunnah for ي ن م و (except some without on ل ر)." },
    { t: "Iqlāb (إقلاب)", b: "Nūn/tanwīn before ب: change to mīm with ghunnah." },
    { t: "Qalqalah (قلقلة)", b: "Bounce ق ط ب ج د when sākin — a light echo without a full vowel." },
    { t: "Madd ṭabīʿī", b: "Two counts on a long vowel not followed by hamzah or sukūn." },
    { t: "Madd lāzim", b: "Six counts when a permanent sukūn follows the madd letter." },
    { t: "Ghunnah (غُنّة)", b: "Nūn or mīm mushaddadah: two counts of nasal sound." }
  ];

  var SAMINA_FALLBACK = [
    {
      ref: "An-Nisāʾ 4:59",
      ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ",
      en: "O you who believe, obey Allah and obey the Messenger…",
      note: "Educational reflection — not a fatwa.",
      url: "https://quran.com/4/59"
    },
    {
      ref: "Āl ʿImrān 3:31",
      ar: "قُلْ إِن كُنتُمْ تُحِبُّونَ اللَّهَ فَاتَّبِعُونِي",
      en: "Say: If you love Allah, then follow me…",
      note: "Educational reflection — not a fatwa.",
      url: "https://quran.com/3/31"
    },
    {
      ref: "Al-Aḥzāb 33:36",
      ar: "وَمَا كَانَ لِمُؤْمِنٍ وَلَا مُؤْمِنَةٍ إِذَا قَضَى اللَّهُ وَرَسُولُهُ أَمْرًا",
      en: "It is not for a believing man or woman, when Allah and His Messenger have decided a matter…",
      note: "Educational reflection — not a fatwa.",
      url: "https://quran.com/33/36"
    }
  ];

  function fillSamina(force) {
    if (typeof w.clarityDailySaminaVerse === "function") {
      try {
        w.clarityDailySaminaVerse(!!force);
        return true;
      } catch (e) {}
    }
    var i = 0;
    try {
      var k = "clarity_samina_fallback";
      if (force) {
        i = ((parseInt(localStorage.getItem(k) || "0", 10) || 0) + 1) % SAMINA_FALLBACK.length;
        localStorage.setItem(k, String(i));
      } else {
        i = parseInt(localStorage.getItem(k) || "0", 10) || 0;
      }
    } catch (e2) {}
    var v = SAMINA_FALLBACK[i % SAMINA_FALLBACK.length];
    var ref = document.getElementById("samina-verse-ref");
    var ar = document.getElementById("samina-verse-ar");
    var en = document.getElementById("samina-verse-en");
    var note = document.getElementById("samina-verse-note");
    var link = document.getElementById("samina-verse-link");
    if (ref) ref.textContent = v.ref;
    if (ar) ar.textContent = v.ar;
    if (en) en.textContent = v.en;
    if (note) note.textContent = v.note;
    if (link) link.href = v.url;
    return true;
  }

  function fillTajweed(force) {
    if (typeof w.clarityLiveTajweed === "function") {
      try {
        w.clarityLiveTajweed(!!force);
        return true;
      } catch (e) {}
    }
    var a = RULES[(force ? Date.now() : Math.floor(Date.now() / 864e5)) % RULES.length];
    var n = document.getElementById("tajweed-live-title");
    var r = document.getElementById("tajweed-live-body");
    if (n) n.textContent = a.t;
    if (r) r.textContent = a.b;
    return true;
  }

  function fillRuleGrid() {
    var grid = document.getElementById("tj-rule-grid");
    if (!grid) return;
    if (grid.children.length > 0) return;
    RULES.forEach(function (rule, idx) {
      var det = document.createElement("details");
      det.className = "tj-rule-tile";
      det.setAttribute("role", "listitem");
      det.innerHTML =
        "<summary>" +
        rule.t +
        "</summary><p>" +
        rule.b +
        "</p>";
      grid.appendChild(det);
    });
  }

  
  function wireLessonPick() {
    var sel = document.getElementById("tj-lesson-pick");
    var iframe = document.getElementById("tajweed-player-x1");
    var open = document.getElementById("tj-yt-open");
    if (!sel || !iframe) return;
    if (sel.__wired) return;
    sel.__wired = true;
    sel.addEventListener("change", function () {
      var id = sel.value;
      if (!id) return;
      var base = iframe.getAttribute("data-base") || "https://www.youtube-nocookie.com/embed/";
      iframe.src = base + id + "?rel=0&modestbranding=1";
      if (open) open.href = "https://www.youtube.com/watch?v=" + id;
    });
  }

  
  function bindNewModuleButtons() {
    document.querySelectorAll('button[onclick*="clarityLiveTajweed"], #tajweed-live-card .btn-soft').forEach(function (btn) {
      var label = (btn.textContent || "").toLowerCase();
      if (label.indexOf("new module") < 0 && (btn.getAttribute("onclick") || "").indexOf("clarityLiveTajweed") < 0) return;
      if (btn.__tjNewWired) return;
      btn.__tjNewWired = true;
      btn.addEventListener("click", function (ev) {
        try {
          if (ev) {
            ev.preventDefault();
            ev.stopPropagation();
          }
          fillTajweed(true);
          if (typeof w.clarityLiveTajweed === "function") {
            try {
              w.clarityLiveTajweed(true);
            } catch (e1) {
              fillTajweed(true);
            }
          }
        } catch (e) {
          fillTajweed(true);
        }
      });
    });
  }

  function wireEmbedFolds() {
    document.querySelectorAll("details.clarity-embed-fold").forEach(function (det) {
      if (det.__clarityEmbedWired) return;
      det.__clarityEmbedWired = true;
      function activate() {
        if (!det.open) return;
        var iframe = det.querySelector("iframe[data-src]");
        if (iframe && (!iframe.src || iframe.src === "about:blank" || iframe.src.indexOf("about:") === 0)) {
          iframe.src = iframe.getAttribute("data-src");
        }
      }
      det.addEventListener("toggle", activate);
      if (det.open) activate();
    });
    /* also any summary click on tajweed-player */
    var sum = document.querySelector('details[data-embed-id="tajweed-player"]');
    if (sum && !sum.__tjClick) {
      sum.__tjClick = true;
      sum.addEventListener("click", function () {
        setTimeout(function () {
          if (sum.open) {
            var iframe = sum.querySelector("iframe[data-src]");
            if (iframe) iframe.src = iframe.getAttribute("data-src");
          }
        }, 0);
      });
    }
  }

  function wireLmr() {
    var verseBtn = document.getElementById("tj-lmr-mode-verse");
    var ruleBtn = document.getElementById("tj-lmr-mode-rule");
    var toolVerse = document.getElementById("tj-lmr-toolbar-verse");
    var toolRule = document.getElementById("tj-lmr-toolbar-rule");
    function setMode(mode) {
      if (verseBtn) verseBtn.classList.toggle("active", mode === "verse");
      if (ruleBtn) ruleBtn.classList.toggle("active", mode === "rule");
      if (toolVerse) toolVerse.style.display = mode === "verse" ? "" : "none";
      if (toolRule) toolRule.style.display = mode === "rule" ? "" : "none";
    }
    if (verseBtn && !verseBtn.__wired) {
      verseBtn.__wired = true;
      verseBtn.addEventListener("click", function () {
        setMode("verse");
      });
    }
    if (ruleBtn && !ruleBtn.__wired) {
      ruleBtn.__wired = true;
      ruleBtn.addEventListener("click", function () {
        setMode("rule");
      });
    }
    setMode("verse");

    /* Listen button if present */
    var listen = document.getElementById("tj-lmr-listen") || document.querySelector("[data-tj-listen]");
    var surah = document.getElementById("tj-lmr-surah");
    var ayah = document.getElementById("tj-lmr-ayah");
    if (listen && !listen.__wired) {
      listen.__wired = true;
      listen.addEventListener("click", function () {
        var s = surah ? surah.value : "1";
        var a = ayah ? ayah.value : "1";
        var url =
          "https://everyayah.com/data/Husary_128kbps/" +
          String(s).padStart(3, "0") +
          String(a).padStart(3, "0") +
          ".mp3";
        try {
          var audio = w.__tjLmrAudio || new Audio();
          w.__tjLmrAudio = audio;
          audio.src = url;
          audio.play();
        } catch (e) {}
      });
    }
  }

  /* Public fallbacks if chunk missing */
  if (typeof w.clarityDailySaminaVerse !== "function") {
    w.clarityDailySaminaVerse = function (force) {
      fillSamina(force);
    };
  }
  if (typeof w.clarityLiveTajweed !== "function") {
    w.clarityLiveTajweed = function (force) {
      fillTajweed(force);
    };
  }

  function boot() {
    fillSamina(false);
    fillTajweed(false);
    fillRuleGrid();
    wireEmbedFolds();
    wireLessonPick();
    wireLmr();
  }

  function waitChunkThenBoot() {
    var n = 0;
    var id = setInterval(function () {
      n++;
      var ready =
        typeof w.clarityDailySaminaVerse === "function" &&
        typeof w.clarityLiveTajweed === "function";
      /* always fill UI — prefer chunk impl by calling after ready */
      if (ready || n > 40) {
        clearInterval(id);
        boot();
        /* re-call chunk versions once more when they appear late */
        if (ready) {
          try {
            w.clarityDailySaminaVerse(false);
            w.clarityLiveTajweed(false);
          } catch (e) {}
        }
      }
    }, 200);
    boot(); /* immediate fallback paint */
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitChunkThenBoot);
  } else waitChunkThenBoot();
  w.addEventListener("load", function () {
    setTimeout(boot, 400);
  });
  w.addEventListener("clarity-companion-diet-ready", function () {
    setTimeout(boot, 100);
  });
})(typeof window !== "undefined" ? window : this);
