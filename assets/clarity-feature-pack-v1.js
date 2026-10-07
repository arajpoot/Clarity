/** Clarity Feature Pack v1 — merged lean pack */


/* ---- clarity-layout-fix-v1.js ---- */
/**
 * Clarity Layout Fix v10 — desktop sticky chrome, no fixed double-paint
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V10__) return;
  w.__CLARITY_LAYOUT_FIX_V10__ = true;
  w.__CLARITY_LAYOUT_FIX_V9__ = true;

  var raf = 0;

  function shouldPin() {
    try {
      var width = Math.min(w.innerWidth || 0, document.documentElement.clientWidth || 0);
      return width >= 1024;
    } catch (e) {
      return false;
    }
  }

  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav");
      var root = document.documentElement;
      var body = document.body;
      var pin = shouldPin();

      root.setAttribute("data-chrome-pin", pin ? "1" : "0");
      root.classList.toggle("clarity-pin-banner", pin);
      if (body) {
        body.classList.toggle("clarity-chrome-pinned", pin);
        // Never use padding-top spacer with sticky — causes double paint
        body.style.paddingTop = "";
        body.style.removeProperty("padding-top");
      }

      var h = 52;
      if (nav) h = Math.max(44, Math.round(nav.offsetHeight || 52));
      root.style.setProperty("--clarity-nav-h", h + "px");
      root.style.setProperty("--clarity-chrome-h", "0px");
    } catch (e) {}
  }

  function schedule() {
    if (raf) return;
    raf = w.requestAnimationFrame(function () {
      raf = 0;
      measure();
    });
  }

  function bind() {
    measure();
    w.addEventListener("resize", schedule, { passive: true });
    w.addEventListener("orientationchange", function () {
      setTimeout(measure, 150);
    });
    try {
      var mq = w.matchMedia("(min-width:1024px)");
      if (mq.addEventListener) mq.addEventListener("change", schedule);
    } catch (e) {}
    w.addEventListener("load", schedule);
    setTimeout(measure, 120);
    setTimeout(measure, 500);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityLayoutFix = { version: "20261007H", measure: measure, shouldPin: shouldPin };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-strips-v1.js ---- */
/**
 * Clarity Strips v1 — last-visited pills + path module pills
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STRIPS_V1__) return;
  g.__CLARITY_STRIPS_V1__ = true;

  var VISIT_KEY = "clarity_last_visited_v1";
  var MAX_VISIT = 6;

  var LABELS = {
    "commands-card": "Commands",
    "samina-verse-card": "Sami'na",
    "samina-card": "Sami'na live",
    "soul-compass-card": "Soul compass",
    "hell-sins-card": "Hell & sins",
    "night-breath-card": "Night breath",
    "seerah-live-card": "Seerah",
    "seerah-mirror-card": "Seerah mirror",
    "grave-path-card": "Grave path",
    "ilm-pathway-card": "Ilm pathway",
    "meme-card": "Meme studio",
    "tajweed-live-card": "Tajweed",
    "tajweed-path-card": "Tajweed path",
    "tj-lmr-score-card": "LMR score",
    "tafseer-resources-card": "Tafseer",
    "najiha-tafseer-card": "Najiha",
    "deepen-study-card": "Deepen",
    "hajj-checklist-card": "Hajj list",
    "hajj-guide-card": "Hajj guide",
    "fiqh-quiz-card": "Fiqh quiz",
    "weekly-review-card": "Weekly review",
    "about-clarity-card": "About",
    "tibbe-nabwi-card": "Tibb Nabawi",
    "asma-names-lecture-card": "Asma",
    "callig-lab-card": "Calligraphy",
    "cw-card": "Character",
    "wasiyyah-card": "Wasiyyah",
    "faraid-card": "Faraid",
    "user-family-tree-card": "Family tree",
    "notes-shell": "Notes"
  };

  // Modules shown per educational path (Daily = practicing)
  var PATH_MODULES = {
    seeker: ["commands-card", "samina-verse-card", "soul-compass-card", "seerah-live-card", "grave-path-card", "about-clarity-card"],
    new_muslim: ["commands-card", "samina-verse-card", "ilm-pathway-card", "fiqh-quiz-card", "hajj-guide-card", "seerah-live-card"],
    practicing: ["commands-card", "samina-verse-card", "weekly-review-card", "tajweed-live-card", "meme-card", "deepen-study-card", "hajj-checklist-card", "tibbe-nabwi-card"],
    dai: ["commands-card", "meme-card", "deepen-study-card", "seerah-mirror-card", "asma-names-lecture-card", "callig-lab-card"]
  };

  function loadVisits() {
    try {
      return JSON.parse(localStorage.getItem(VISIT_KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }

  function saveVisits(list) {
    try {
      localStorage.setItem(VISIT_KEY, JSON.stringify(list.slice(0, MAX_VISIT)));
    } catch (e) {}
  }

  function pushVisit(id) {
    if (!id || !LABELS[id] && !document.getElementById(id)) return;
    var list = loadVisits().filter(function (x) {
      return x !== id;
    });
    list.unshift(id);
    saveVisits(list);
    renderVisitBar();
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.classList.remove("gate-hidden");
      el.hidden = false;
      el.style.removeProperty("display");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
  }

  function renderVisitBar() {
    var bar = document.getElementById("clarity-visit-pill-bar");
    if (!bar) return;
    var list = loadVisits();
    // Keep label + hint, replace pills
    var keep = [];
    bar.querySelectorAll(".cv-label, .cv-hint").forEach(function (n) {
      keep.push(n);
    });
    bar.innerHTML = "";
    keep.forEach(function (n) {
      bar.appendChild(n);
    });
    if (!bar.querySelector(".cv-label")) {
      var lab = document.createElement("span");
      lab.className = "cv-label";
      lab.textContent = "Last";
      bar.appendChild(lab);
    }
    if (!list.length) {
      var hint = bar.querySelector(".cv-hint");
      if (!hint) {
        hint = document.createElement("span");
        hint.className = "cv-hint";
        bar.appendChild(hint);
      }
      hint.textContent = "Scroll a section to pin it";
      return;
    }
    var hint = bar.querySelector(".cv-hint");
    if (hint) hint.remove();
    list.forEach(function (id) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cv-pill";
      btn.textContent = LABELS[id] || id.replace(/-card$/, "").replace(/-/g, " ");
      btn.title = "Open " + btn.textContent;
      btn.addEventListener("click", function () {
        scrollToId(id);
      });
      bar.appendChild(btn);
    });
  }

  function currentPath() {
    try {
      var p =
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_path_focus") ||
        localStorage.getItem("clarity_committed_path") ||
        "practicing";
      if (p === "daily" || p === "daily_muslim") p = "practicing";
      return p;
    } catch (e) {
      return "practicing";
    }
  }

  function ensurePathStrip() {
    var bar = document.getElementById("clarity-path-module-strip");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "clarity-path-module-strip";
    bar.className = "clarity-path-module-strip";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Modules for current path");
    var visit = document.getElementById("clarity-visit-pill-bar");
    if (visit && visit.parentNode) {
      if (visit.nextSibling) visit.parentNode.insertBefore(bar, visit.nextSibling);
      else visit.parentNode.appendChild(bar);
    } else {
      var duo = document.getElementById("clarity-top-duo");
      if (duo && duo.parentNode) {
        if (duo.nextSibling) duo.parentNode.insertBefore(bar, duo.nextSibling);
        else duo.parentNode.appendChild(bar);
      }
    }
    return bar;
  }

  function renderPathStrip() {
    var bar = ensurePathStrip();
    var path = currentPath();
    var mods = PATH_MODULES[path] || PATH_MODULES.practicing;
    bar.innerHTML = "";
    var lab = document.createElement("span");
    lab.className = "pm-label";
    lab.textContent =
      path === "practicing" ? "Daily" : path === "new_muslim" ? "New Muslim" : path === "dai" ? "Da'i" : "Seeker";
    bar.appendChild(lab);
    mods.forEach(function (id) {
      var el = document.getElementById(id);
      // Dynamic: only show if module exists in DOM (opened path content)
      if (!el) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pm-pill";
      btn.textContent = LABELS[id] || id.replace(/-card$/, "");
      btn.title = btn.textContent;
      btn.addEventListener("click", function () {
        scrollToId(id);
        pushVisit(id);
      });
      bar.appendChild(btn);
    });
    if (bar.querySelectorAll(".pm-pill").length === 0) {
      var empty = document.createElement("span");
      empty.className = "pm-hint";
      empty.textContent = "Open a module on this path";
      bar.appendChild(empty);
    }
  }

  function observeCards() {
    var cards = document.querySelectorAll(
      ".card[id$='-card'], #notes-shell, [id$='-card']"
    );
    if (!("IntersectionObserver" in g)) {
      cards.forEach(function (card) {
        card.addEventListener(
          "click",
          function () {
            pushVisit(card.id);
          },
          { passive: true }
        );
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= 0.35) {
            var id = en.target.id;
            if (id) pushVisit(id);
          }
        });
      },
      { threshold: [0.35], rootMargin: "-10% 0px -40% 0px" }
    );
    cards.forEach(function (c) {
      if (c.id) io.observe(c);
    });
  }

  function boot() {
    renderVisitBar();
    renderPathStrip();
    observeCards();
    setTimeout(function () {
      renderPathStrip();
      observeCards();
    }, 800);
    setTimeout(renderPathStrip, 2000);
    g.addEventListener("clarity-path-changed", renderPathStrip);
    // Watch path attribute
    try {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          if (m.attributeName === "data-clarity-path") renderPathStrip();
        });
      });
      mo.observe(document.documentElement, { attributes: true });
    } catch (e) {}
    // After layout measure
    if (g.ClarityLayoutFix && g.ClarityLayoutFix.measure)
      setTimeout(g.ClarityLayoutFix.measure, 300);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityStrips = {
    pushVisit: pushVisit,
    renderVisitBar: renderVisitBar,
    renderPathStrip: renderPathStrip
  };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-notes-restore-v1.js ---- */
/**
 * Clarity Notes Restore v1 — fix broken notepad when recovery is lazy
 * Provides stubs for HTML onclicks, loads recovery, drains queue
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTES_RESTORE_V1__) return;
  g.__CLARITY_NOTES_RESTORE_V1__ = true;

  var loading = null;

  function loadNotes() {
    if (typeof g.notesCreate === "function" && g.notesCreate.__real) return Promise.resolve(true);
    if (typeof g.notesCreate === "function" && !g.notesCreate.__stub) return Promise.resolve(true);
    if (loading) return loading;
    loading = Promise.resolve()
      .then(function () {
        if (g.ClarityLazy && typeof g.ClarityLazy.notes === "function")
          return g.ClarityLazy.notes();
        return new Promise(function (res, rej) {
          var s = document.createElement("script");
          s.src = "./assets/clarity-notes-recovery-v1.js?v=20261006G";
          s.defer = true;
          s.onload = function () { res(true); };
          s.onerror = function () { rej(new Error("notes load")); };
          (document.body || document.documentElement).appendChild(s);
        });
      })
      .then(function () {
        try {
          if (typeof g.notesLoad === "function") g.notesLoad();
          if (typeof g.notesRender === "function") g.notesRender();
        } catch (e) {}
        return true;
      })
      .catch(function (e) {
        console.warn("notes restore", e);
        return false;
      });
    return loading;
  }

  function stub(name, fn) {
    if (typeof g[name] === "function" && !g[name].__stub) return;
    var s = function () {
      var args = arguments;
      return loadNotes().then(function (ok) {
        if (ok && typeof g[name] === "function" && !g[name].__stub)
          return g[name].apply(g, args);
        if (typeof fn === "function") return fn.apply(g, args);
      });
    };
    s.__stub = true;
    g[name] = s;
  }

  stub("notesCreate");
  stub("notesSetQuery");
  stub("notesSelect");
  stub("notesSaveNow");
  stub("notesRequestDelete");
  stub("notesToggleGrave");
  stub("notesUpdateField");
  stub("notesExport");
  stub("notesImport");
  stub("notesCycleView");
  stub("notesSetView");
  stub("notesOpenDeedNote");
  stub("notesQuickFromSection");

  g.clarityOpenNotesEditor = function () {
    return loadNotes().then(function () {
      try {
        if (typeof g.switchTab === "function") g.switchTab("notes");
      } catch (e) {}
      try {
        var shell = document.getElementById("notes-shell");
        if (shell) {
          shell.classList.remove("gate-hidden");
          shell.hidden = false;
          shell.style.removeProperty("display");
          shell.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e2) {}
      try {
        if (typeof g.notesRender === "function") g.notesRender();
      } catch (e3) {}
    });
  };

  // Eager load after first paint so notepad works
  function boot() {
    var run = function () {
      loadNotes();
    };
    if ("requestIdleCallback" in g)
      requestIdleCallback(run, { timeout: 2500 });
    else setTimeout(run, 1200);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(loadNotes, 400); });

  g.ClarityNotesRestore = { load: loadNotes };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-notes-bridge-v1.js ---- */
/**
 * Clarity Notes Bridge v2 — sleek section chips only (never banner)
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTES_BRIDGE_V2__) return;
  g.__CLARITY_NOTES_BRIDGE_V2__ = true;

  function ensureNotes() {
    if (g.ClarityNotesRestore && typeof g.ClarityNotesRestore.load === "function")
      return g.ClarityNotesRestore.load();
    if (g.ClarityLazy && typeof g.ClarityLazy.notes === "function")
      return g.ClarityLazy.notes().catch(function () { return false; });
    return Promise.resolve(typeof g.notesCreate === "function");
  }

  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "", title: "" };
    var arEl = card.querySelector('.arabic,[lang="ar"],.cmd-ar,.sr-ar,.verse-ar,.ayah-ar,.hadith-ar,.rabbana-arabic');
    var enEl = card.querySelector('.cmd-en,.sr-en,.verse-en,.translation,.ayah-en,.english,.hadith-en');
    var refEl = card.querySelector('.ref,.verse-ref,.sr-ref,.citation,[data-ref],.hadith-ref');
    var ar = arEl ? (arEl.textContent || "").trim() : "";
    var en = enEl ? (enEl.textContent || "").trim() : "";
    var ref = refEl ? (refEl.textContent || refEl.getAttribute("data-ref") || "").trim() : "";
    var title = ((card.querySelector("h2,h3,.card-title") || {}).textContent || "").trim().slice(0, 80);
    if (!ar && !en) {
      var paras = card.querySelectorAll("p, blockquote");
      for (var i = 0; i < Math.min(paras.length, 6); i++) {
        var t = (paras[i].textContent || "").trim();
        if (t.length < 12) continue;
        if (/[\u0600-\u06FF]/.test(t) && !ar) ar = t;
        else if (!en && !/[\u0600-\u06FF]/.test(t)) en = t.slice(0, 400);
      }
    }
    return { ar: ar, en: en, ref: ref, title: title };
  }

  function buildBody(p, source) {
    var lines = ["**Source:** " + (source || "section")];
    if (p.ref) lines.push("**Ref:** " + p.ref);
    lines.push("");
    if (p.ar) { lines.push("> " + p.ar); lines.push(""); }
    if (p.en) lines.push(p.en);
    lines.push("");
    lines.push("### My reflection");
    lines.push("");
    lines.push("- [ ] I read this with presence");
    lines.push("- [ ] One action I will take:");
    return lines.join("\n");
  }

  function pushToNotes(payload) {
    payload = payload || {};
    return ensureNotes().then(function () {
      try {
        if (typeof g.notesCreate === "function") {
          g.notesCreate({
            title: (payload.title || "Reflection").slice(0, 72),
            tag: payload.tag || "Reflection",
            body: payload.body || "",
            grave: !!payload.grave
          });
        }
      } catch (e) { console.warn(e); }
      try {
        if (typeof g.clarityOpenNotesEditor === "function") g.clarityOpenNotesEditor();
        else {
          var shell = document.getElementById("notes-shell");
          if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e2) {}
      setTimeout(function () {
        try {
          var bodyEl = document.getElementById("notes-body");
          if (bodyEl && payload.body) {
            if (!bodyEl.value || bodyEl.value.length < 8) {
              bodyEl.value = payload.body;
              if (typeof g.notesUpdateField === "function") g.notesUpdateField("body", payload.body);
            }
          }
          if (typeof g.notesRender === "function") g.notesRender();
        } catch (e3) {}
      }, 280);
    });
  }
  g.clarityPushToNotes = pushToNotes;

  function banned(card) {
    if (!card) return true;
    if (card.closest("#clarity-top-duo, #clarity-global-nav, .global-nav, .banner, #banner-media")) return true;
    if (card.id === "notes-shell" || card.id === "meme-card" || card.id === "tweet-desk-card") return true;
    return false;
  }

  function ensurePills() {
    document.querySelectorAll(".card[id$='-card'], .card[id], [id$='-card']").forEach(function (card) {
      if (banned(card)) return;
      if (card.querySelector(".clarity-to-notes-pill")) return;
      var sample = extract(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 24) return;
      var row = card.querySelector(".clarity-action-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-action-row";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clarity-to-notes-pill clarity-action-chip";
      btn.textContent = "Notes";
      btn.title = "Save to notepad";
      btn.addEventListener("click", function (ev) {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
        var p = extract(card);
        var tag = /hadith|bukhari|muslim/i.test(p.ref + p.title) ? "Hadith"
          : /qur|ayah|\d+\s*:\s*\d+/i.test(p.ref) ? "Qur'an" : "Reflection";
        pushToNotes({
          title: (p.title || p.ref || "Reflection").slice(0, 72),
          tag: tag,
          body: buildBody(p, card.id || "section"),
          grave: /grave|death|akhirah/i.test(p.en + p.title + (card.id || ""))
        });
      });
      row.appendChild(btn);
    });
  }

  function boot() {
    ensurePills();
    setTimeout(ensurePills, 1000);
    setTimeout(ensurePills, 3000);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__notesPillT);
        g.__notesPillT = setTimeout(ensurePills, 500);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-tj-whisper-restore-v1.js ---- */
/**
 * Clarity Tajweed + Whisper Restore v1
 * - Loads nx-tj-lmr when tajweed UI is shown / rail clicked
 * - Ensures Whisper CDN is allowed path; soft fallback to Web Speech API
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_TJ_WHISPER_RESTORE_V1__) return;
  g.__CLARITY_TJ_WHISPER_RESTORE_V1__ = true;

  function loadTj() {
    if (g.__tjLmrLoaded) return Promise.resolve(true);
    if (g.ClarityLazy && typeof g.ClarityLazy.tjLmr === "function") {
      return g.ClarityLazy.tjLmr().then(function () {
        g.__tjLmrLoaded = true;
        try {
          if (typeof g.nurosStartLmrMeter === "function") { /* ready */ }
        } catch (e) {}
        return true;
      }).catch(function () { return false; });
    }
    return new Promise(function (res) {
      if (document.querySelector('script[data-clarity-lazy="tj-lmr"]')) {
        g.__tjLmrLoaded = true;
        res(true);
        return;
      }
      var s = document.createElement("script");
      s.src = "./assets/nx-tj-lmr-js-v1.js?v=20261006C";
      s.defer = true;
      s.dataset.clarityLazy = "tj-lmr";
      s.onload = function () { g.__tjLmrLoaded = true; res(true); };
      s.onerror = function () { res(false); };
      (document.body || document.documentElement).appendChild(s);
    });
  }

  function maybeLoadFromClick(ev) {
    try {
      var t = ev.target;
      if (!t || !t.closest) return;
      var hit = t.closest(
        "#tj-lmr, #tj-lmr-panel, #tj-deep-studio, #tajweed-path-card, #tajweed-live-card, [data-rail-tab='tajweed'], .door-rail-btn[data-rail-tab='tajweed'], #callig-lab-card"
      );
      if (hit) loadTj();
    } catch (e) {}
  }

  document.addEventListener("click", maybeLoadFromClick, true);
  document.addEventListener("pointerdown", maybeLoadFromClick, true);

  /* Prefetch when path allows practicing+ */
  function prefetchIfReady() {
    try {
      var max = parseInt(document.documentElement.getAttribute("data-clarity-unlocked-max") || "0", 10);
      if (max >= 2) {
        if ("requestIdleCallback" in g)
          requestIdleCallback(function () { loadTj(); }, { timeout: 8000 });
        else setTimeout(loadTj, 5000);
      }
    } catch (e) {}
  }
  g.addEventListener("load", function () { setTimeout(prefetchIfReady, 2000); });
  g.addEventListener("clarity-path-changed", function () { setTimeout(prefetchIfReady, 500); });

  /* Whisper: wrap ensure to fall back to webkitSpeechRecognition */
  function installWhisperFallback() {
    var prev = g.clarityVoiceEnsureWhisper;
    if (typeof prev !== "function" || prev.__restored) return false;
    g.clarityVoiceEnsureWhisper = async function () {
      try {
        return await prev.apply(this, arguments);
      } catch (e) {
        console.warn("Whisper load failed, using Web Speech if available", e);
        return null;
      }
    };
    g.clarityVoiceEnsureWhisper.__restored = true;
    return true;
  }

  /* Soft speech recognition helper for studio */
  g.claritySpeechCapture = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve, reject) {
      var SR = g.SpeechRecognition || g.webkitSpeechRecognition;
      if (!SR) {
        reject(new Error("Speech recognition unavailable"));
        return;
      }
      var rec = new SR();
      rec.lang = opts.lang || "ar-SA";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      var done = false;
      rec.onresult = function (ev) {
        done = true;
        try {
          resolve((ev.results[0][0].transcript || "").trim());
        } catch (e) {
          reject(e);
        }
      };
      rec.onerror = function (ev) {
        if (!done) reject(new Error((ev && ev.error) || "speech-error"));
      };
      rec.onend = function () {
        if (!done) reject(new Error("no-speech"));
      };
      try { rec.start(); } catch (e2) { reject(e2); }
    });
  };

  function boot() {
    installWhisperFallback();
    setTimeout(installWhisperFallback, 1500);
    setTimeout(installWhisperFallback, 4000);
    /* If tajweed panel already in DOM and visible, load */
    try {
      var panel = document.getElementById("tj-lmr-panel");
      if (panel && panel.open) loadTj();
    } catch (e) {}
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", boot);

  g.ClarityTjRestore = { load: loadTj, speech: g.claritySpeechCapture };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-meme-enhance-v1.js ---- */
/**
 * Clarity Meme Enhance v3 — sleek toolbar, no ref on canvas, nature/galaxy HQ
 * Watermark strip already carries site reference.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_ENHANCE_V3__) return;
  g.__CLARITY_MEME_ENHANCE_V3__ = true;
  g.__CLARITY_MEME_ENHANCE_V2__ = true;

  function hash(s) {
    s = String(s || "");
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function textOf(el) {
    if (!el) return "";
    try {
      var body = el.querySelector(".tts-body, .verse-text, .ayah-text");
      return String((body || el).textContent || "")
        .replace(/\s+/g, " ")
        .replace(/🔊/g, "")
        .trim();
    } catch (e) {
      return String(el.textContent || "").trim();
    }
  }

  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "" };
    var ar = "", en = "", ref = "";
    try {
      if (card.id === "commands-card" && g.currentCommandVerse) {
        ar = g.currentCommandVerse.arabic || "";
        en = g.currentCommandVerse.english || g.currentCommandVerse.en || "";
        ref = g.currentCommandVerse.ref || "";
      }
      if ((!ar || !en) && g.currentJourneyVerse) {
        ar = ar || g.currentJourneyVerse.arabic || "";
        en = en || g.currentJourneyVerse.en || g.currentJourneyVerse.english || "";
        ref = ref || g.currentJourneyVerse.ref || "";
      }
    } catch (e0) {}
    if (!ar)
      ar = textOf(
        card.querySelector(
          "#cmd-ar-text, #cmd-arabic, .arabic, [lang='ar'], .cmd-ar, .sr-ar, .verse-ar, .ayah-ar, .hadith-ar"
        )
      );
    if (!en)
      en = textOf(
        card.querySelector(
          "#cmd-en-text, .cmd-en, .sr-en, .verse-en, .translation, .ayah-en, .english, .hadith-en"
        )
      );
    var refEl = card.querySelector(
      ".ref, .verse-ref, .sr-ref, .citation, [data-ref], .hadith-ref, .source"
    );
    if (!ref && refEl)
      ref = textOf(refEl) || (refEl.getAttribute("data-ref") || "").trim();
    en = en
      .replace(/Sahih International.*/i, "")
      .replace(/Recommended follow-up[\s\S]*/i, "")
      .replace(/I am working on this.*/i, "")
      .trim();
    if (!en) {
      var ps = card.querySelectorAll("p");
      for (var i = 0; i < ps.length; i++) {
        var t = textOf(ps[i]);
        if (t.length > 20 && !/[\u0600-\u06FF]{10}/.test(t) && !/Recommended/i.test(t)) {
          en = t.slice(0, 500);
          break;
        }
      }
    }
    return { ar: ar, en: en, ref: ref };
  }

  /** Apply Arabic + English only — no reference on canvas (watermark handles site) */
  function applyText(payload) {
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
      g.memeState.top = ar;
      g.memeState.mid = en;
      g.memeState.bottom = ""; // ref off canvas
      g.memeState.ref = ref; // keep for status / AI mood only
      g.memeState._lastRef = ref;
      g.memeState.outline = Math.max(g.memeState.outline || 0, 5);
      if (!g.memeState.topSize) g.memeState.topSize = 40;
      if (!g.memeState.midSize) g.memeState.midSize = 28;
      if (!g.memeState.bottomSize) g.memeState.bottomSize = 18;
      try {
        var i = document.getElementById("meme-top-input");
        var o = document.getElementById("meme-mid-input");
        var s = document.getElementById("meme-bottom-input");
        if (i) i.value = ar;
        if (o) o.value = en;
        if (s) s.value = ""; // clear bot ref field
      } catch (e1) {}
      if (typeof g.memeApplyVerseCard === "function") {
        try {
          g.memeApplyVerseCard(ar, en, "", ""); // empty ref on canvas
        } catch (e2) {}
      }
      g.memeState.top = ar || g.memeState.top;
      g.memeState.mid = en || g.memeState.mid;
      g.memeState.bottom = "";
      g.memeState.ref = ref;
      if (typeof g.memeAutoFitSizes === "function") {
        try {
          g.memeAutoFitSizes();
        } catch (e3) {}
      }
      function redraw() {
        try {
          if (g.memeState) {
            if (ar) g.memeState.top = ar;
            if (en) g.memeState.mid = en;
            g.memeState.bottom = "";
          }
          if (typeof g.memeDraw === "function") g.memeDraw();
        } catch (e4) {}
      }
      redraw();
      setTimeout(redraw, 100);
      setTimeout(redraw, 300);
    } catch (e) {
      console.warn("meme applyText", e);
    }
  }

  // Broader nature + galaxy styles (still no prophet likeness / no Quran calligraphy)
  var STYLES = [
    "ultra high resolution nature landscape mountains valley soft light, no people",
    "milky way galaxy stars night sky astrophotography high resolution, no text",
    "deep space nebula colorful cosmos high resolution astronomy photo, no figures",
    "ocean waves aerial coastline nature photography high resolution, no people",
    "forest path misty morning light nature only high resolution",
    "aurora borealis northern lights night sky high resolution, no people",
    "desert sand dunes golden hour vast landscape high resolution",
    "snow peaks alpine lake crystal clear reflection high resolution nature",
    "tropical waterfall lush greenery nature photography high resolution",
    "starfield long exposure night photography high resolution, no text"
  ];

  var BLOCK = /prophet|muhammad|messenger|sahaba|jesus|isa ibn|idol|crucifix|anime|cartoon god/i;

  function sanitizeTheme(text) {
    text = String(text || "")
      .replace(/[\u0600-\u06FF]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (BLOCK.test(text)) return "peaceful nature landscape soft light high resolution";
    return text.slice(0, 120) || "serene nature landscape";
  }

  function aiPrompt(en, ar, ref, styleIdx) {
    var base = sanitizeTheme(en || "peace patience nature");
    var style = STYLES[(styleIdx || 0) % STYLES.length];
    return (
      "Photorealistic " +
      style +
      ", 4k, NO human faces of prophets, NO Arabic calligraphy, NO Quran pages: mood " +
      base
    );
  }

  function stockFor(kind, payload) {
    var seed = hash((payload && payload.en) || "" + (kind || "") + Date.now());
    var s1 = seed % 9000;
    var s2 = (seed * 7) % 9000;
    var s3 = (seed * 13) % 9000;
    // High-res nature / space oriented chains
    var nature = [
      "https://picsum.photos/seed/n" + s1 + "/1920/1080",
      "https://picsum.photos/seed/n" + s2 + "/1920/1080",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nature_landscape.jpg/1280px-Nature_landscape.jpg"
    ];
    var galaxy = [
      "https://picsum.photos/seed/g" + s1 + "/1920/1080",
      "https://picsum.photos/seed/g" + s2 + "/1920/1080",
      "https://picsum.photos/seed/space" + s3 + "/1920/1080"
    ];
    var water = [
      "https://picsum.photos/seed/w" + s1 + "/1920/1080",
      "https://picsum.photos/seed/ocean" + s2 + "/1920/1080"
    ];
    var holy = [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Great_Mosque_of_Kairouan_Panorama.jpg/1280px-Great_Mosque_of_Kairouan_Panorama.jpg",
      "https://picsum.photos/seed/arch" + s1 + "/1920/1080"
    ];
    var map = {
      nature: nature,
      galaxy: galaxy,
      space: galaxy,
      night: galaxy,
      water: water,
      flowers: nature,
      spirit: nature,
      holy: holy,
      free: nature.concat(galaxy),
      dynamic: nature.concat(galaxy),
      flickr: nature
    };
    return map[kind] || nature.concat(galaxy);
  }

  function loadBgChain(urls, i) {
    i = i || 0;
    if (!urls || i >= urls.length) {
      if (typeof g.memeFetchStatus === "function")
        g.memeFetchStatus("Could not load background");
      return;
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (g.memeState) {
          g.memeState.bgImage = img;
          g.memeState.bg = "image";
        }
        if (typeof g.memeDraw === "function") g.memeDraw();
        if (typeof g.memeFetchStatus === "function")
          g.memeFetchStatus("Background ready · HQ");
      } catch (e) {}
    };
    img.onerror = function () {
      loadBgChain(urls, i + 1);
    };
    img.src = urls[i];
  }

  var aiStyleIdx = 0;

  function fetchAiBackground(payload) {
    payload = payload || {};
    aiStyleIdx = (aiStyleIdx + 1) % STYLES.length;
    var prompt = aiPrompt(
      payload.en || payload.english,
      payload.ar || payload.arabic,
      payload.ref,
      aiStyleIdx
    );
    var seed = (hash(prompt + aiStyleIdx + Date.now()) % 99999) + 1;
    var urls = [];
    for (var k = 0; k < 3; k++) {
      var p = aiPrompt(payload.en, payload.ar, payload.ref, aiStyleIdx + k * 2);
      var sd = (seed * (k + 3)) % 99999;
      urls.push(
        "https://image.pollinations.ai/prompt/" +
          encodeURIComponent(p) +
          "?width=1920&height=1080&nologo=true&seed=" +
          sd
      );
    }
    urls = urls.concat(stockFor("nature", payload));
    if (typeof g.memeFetchStatus === "function")
      g.memeFetchStatus(
        "AI scene " + (aiStyleIdx + 1) + "/" + STYLES.length + " · nature/galaxy…"
      );
    loadBgChain(urls, 0);
  }

  function fetchKind(kind) {
    var st = g.memeState || {};
    loadBgChain(stockFor(kind, { en: st.mid, ref: st.ref }), 0);
  }

  // Bridge native memeFetchBg if present
  var _nativeFetch = typeof g.memeFetchBg === "function" ? g.memeFetchBg : null;
  g.memeFetchBg = function (kind) {
    kind = kind || "nature";
    if (kind === "galaxy" || kind === "space" || kind === "nature" || kind === "night") {
      fetchKind(kind);
      return;
    }
    if (_nativeFetch) {
      try {
        _nativeFetch(kind);
        return;
      } catch (e) {}
    }
    fetchKind(kind);
  };

  function push(payload, mode) {
    payload = payload || {};
    applyText(payload);
    if (mode === "ai") fetchAiBackground(payload);
    else loadBgChain(stockFor("nature", payload), 0);
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e) {}
    setTimeout(function () {
      var card = document.getElementById("meme-card");
      if (card) {
        card.classList.remove("gate-hidden");
        card.style.removeProperty("display");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      applyText(payload);
    }, 200);
  }

  g.clarityMemePushFromCard = function (card, mode) {
    var p = extract(card);
    if (!p.ar && !p.en) {
      if (typeof g.memeFetchStatus === "function")
        g.memeFetchStatus("No verse text found");
      return;
    }
    push(p, mode || "stock");
  };

  function bannedCard(card) {
    if (!card) return true;
    if (card.closest("#clarity-top-duo, #clarity-global-nav, .banner")) return true;
    if (card.id === "meme-card" || card.id === "tweet-desk-card" || card.id === "notes-shell")
      return true;
    return false;
  }

  function ensurePills() {
    document.querySelectorAll(".card[id$='-card'], [id$='-card']").forEach(function (card) {
      if (bannedCard(card)) return;
      if (card.querySelector(".clarity-to-meme-pill")) return;
      var sample = extract(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 20) return;
      var row = card.querySelector(".clarity-action-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-action-row";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clarity-to-meme-pill clarity-action-chip";
      btn.textContent = "Meme";
      btn.title = "Push Arabic + translation (ref stays on watermark only)";
      btn.addEventListener("click", function (ev) {
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e0) {}
        g.clarityMemePushFromCard(card, "stock");
      });
      row.appendChild(btn);
    });
  }

  /** Single sleek toolbar: AI + all background options in one row above canvas */
  function ensureToolbar() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root) return;

    // Hide legacy top background bar
    var legacy = root.querySelector(".meme-bar-bg");
    if (legacy) {
      legacy.style.display = "none";
      legacy.setAttribute("aria-hidden", "true");
    }

    if (root.querySelector(".clarity-meme-toolbar")) return;

    var bar = document.createElement("div");
    bar.className = "clarity-meme-toolbar clarity-meme-ai-bar";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;margin:0.45rem 0 0.55rem;padding:0.25rem 0;";

    function chip(label, title, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mv-chip";
      b.textContent = label;
      b.title = title || label;
      b.addEventListener("click", fn);
      return b;
    }

    function st() {
      return g.memeState || {};
    }

    bar.appendChild(
      chip("✨ AI scene", "New AI nature / galaxy scene", function () {
        fetchAiBackground({ ar: st().top, en: st().mid, ref: st().ref });
      })
    );
    bar.appendChild(
      chip("✨ AI again", "Another AI style", function () {
        fetchAiBackground({ ar: st().top, en: st().mid, ref: st().ref });
      })
    );
    bar.appendChild(
      chip("🌿 Nature", "HQ nature photo", function () {
        fetchKind("nature");
      })
    );
    bar.appendChild(
      chip("🌌 Galaxy", "HQ galaxy / space", function () {
        fetchKind("galaxy");
      })
    );
    bar.appendChild(
      chip("🌙 Night", "Night sky / aurora mood", function () {
        fetchKind("night");
      })
    );
    bar.appendChild(
      chip("💧 Water", "Ocean / water", function () {
        fetchKind("water");
      })
    );
    bar.appendChild(
      chip("🕌 Holy", "Mosque architecture", function () {
        fetchKind("holy");
      })
    );
    bar.appendChild(
      chip("📷 Free", "Next free HQ photo", function () {
        fetchKind("free");
      })
    );
    bar.appendChild(
      chip("⬛ Blank", "Solid blank", function () {
        try {
          if (typeof g.memeShowBlankPalette === "function") g.memeShowBlankPalette();
        } catch (e) {}
      })
    );
    bar.appendChild(
      chip("◈ Pattern", "Geometric décor", function () {
        try {
          if (typeof g.clarityMemeDecorBg === "function") g.clarityMemeDecorBg("geometry");
        } catch (e) {}
      })
    );

    var note = document.createElement("div");
    note.style.cssText =
      "flex:1 1 100%;font-size:0.7rem;opacity:0.82;line-height:1.3";
    note.textContent =
      "Scenery only · ref on watermark · discard images that resemble prophets or use Quran as decoration.";
    bar.appendChild(note);

    var stage =
      root.querySelector("#meme-stage-wrap") ||
      root.querySelector(".meme-preview-only");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
    else root.insertBefore(bar, root.firstChild);
  }

  function boot() {
    ensureToolbar();
    ensurePills();
    setTimeout(ensureToolbar, 500);
    setTimeout(ensurePills, 800);
    setTimeout(ensurePills, 2500);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__memeTb);
        g.__memeTb = setTimeout(function () {
          ensureToolbar();
          ensurePills();
        }, 400);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/**
 * Meme toggles + grid show/hide + 4x4 collage
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_GRID_TOGGLES_V2__) return;
  g.__CLARITY_MEME_GRID_TOGGLES_V2__ = true;
  g.__CLARITY_MEME_GRID_TOGGLES_V1__ = true;

  var opts = {
    showVerse: true,
    showCanvasFrame: true,
    showScene: true,
    showGrid: false,
    grid4x4: false
  };

  function state() {
    if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
    return g.memeState;
  }

  function redraw() {
    try {
      if (typeof g.memeDraw === "function") g.memeDraw();
    } catch (e) {}
  }

  function wrapDraw() {
    if (typeof g.memeDraw !== "function" || g.memeDraw.__gridWrapped2) return;
    var orig = g.memeDraw;
    function wrapped() {
      var st = state();
      var saved = {
        top: st.top,
        mid: st.mid,
        bottom: st.bottom,
        bgImage: st.bgImage
      };
      try {
        if (!opts.showVerse) {
          st.top = "";
          st.mid = "";
          st.bottom = "";
        }
        if (!opts.showScene) {
          st.bgImage = null;
          if (st.bg === "image") st.bg = "blank";
        }
        if (opts.grid4x4) {
          drawGrid4x4(saved);
        } else {
          orig.apply(this, arguments);
          if (opts.showGrid) drawGridOverlay();
          if (opts.showCanvasFrame) drawFrame();
        }
      } finally {
        st.top = saved.top;
        st.mid = saved.mid;
        st.bottom = saved.bottom;
        st.bgImage = saved.bgImage;
      }
    }
    wrapped.__gridWrapped2 = true;
    wrapped.__gridWrapped = true;
    g.memeDraw = wrapped;
  }

  function canvasCtx() {
    var canvas = document.getElementById("meme-canvas");
    if (!canvas || !canvas.getContext) return null;
    return { canvas: canvas, ctx: canvas.getContext("2d"), W: canvas.width || 1200, H: canvas.height || 675 };
  }

  function drawGridOverlay() {
    var c = canvasCtx();
    if (!c) return;
    var ctx = c.ctx, W = c.W, H = c.H;
    var cols = 4, rows = 4;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    for (var i = 1; i < cols; i++) {
      var x = (W / cols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (var j = 1; j < rows; j++) {
      var y = (H / rows) * j;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFrame() {
    var c = canvasCtx();
    if (!c) return;
    c.ctx.save();
    c.ctx.strokeStyle = "rgba(184,146,42,0.55)";
    c.ctx.lineWidth = 4;
    c.ctx.strokeRect(3, 3, c.W - 6, c.H - 6);
    c.ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    var words = String(text).split(/\s+/);
    var line = "", lines = [];
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
      } else line = test;
    }
    if (line) lines.push(line);
    var start = y - ((lines.length - 1) * lineH) / 2;
    for (var j = 0; j < lines.length; j++) ctx.fillText(lines[j], x, start + j * lineH);
  }

  function drawGrid4x4(saved) {
    var c = canvasCtx();
    if (!c) return;
    var ctx = c.ctx, W = c.W, H = c.H;
    var cols = 4, rows = 4;
    var cw = W / cols, ch = H / rows;
    ctx.fillStyle = "#0c1410";
    ctx.fillRect(0, 0, W, H);
    var img = opts.showScene ? saved.bgImage : null;
    for (var r = 0; r < rows; r++) {
      for (var col = 0; col < cols; col++) {
        var x = col * cw, y = r * ch;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cw, ch);
        ctx.clip();
        if (img && img.complete) {
          try {
            var sx = (col / cols) * (img.width - cw) * 0.15;
            var sy = (r / rows) * (img.height - ch) * 0.15;
            ctx.drawImage(img, sx, sy, img.width * 0.7, img.height * 0.7, x, y, cw, ch);
          } catch (e1) {
            ctx.fillStyle = "#1a2a22";
            ctx.fillRect(x, y, cw, ch);
          }
        } else {
          var gfill = ctx.createLinearGradient(x, y, x + cw, y + ch);
          gfill.addColorStop(0, "#0d4f3c");
          gfill.addColorStop(1, "#1a2a22");
          ctx.fillStyle = gfill;
          ctx.fillRect(x, y, cw, ch);
        }
        if (opts.showGrid) {
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, cw - 2, ch - 2);
        }
        ctx.restore();
      }
    }
    if (opts.showVerse) {
      var ar = saved.top || "";
      var en = saved.mid || "";
      var ref = saved.bottom || "";
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, H * 0.28, W, H * 0.44);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (ar) {
        ctx.fillStyle = "#fff";
        ctx.font = "600 " + Math.max(18, Math.floor(W / 28)) + "px Scheherazade New, serif";
        wrapText(ctx, ar, W / 2, H * 0.38, W * 0.9, Math.floor(W / 26));
      }
      if (en) {
        ctx.fillStyle = "#f0f4f1";
        ctx.font = "500 " + Math.max(14, Math.floor(W / 42)) + "px Inter, system-ui, sans-serif";
        wrapText(ctx, en, W / 2, H * 0.52, W * 0.88, Math.floor(W / 40));
      }
      if (ref) {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "600 " + Math.max(12, Math.floor(W / 55)) + "px Inter, system-ui, sans-serif";
        ctx.fillText(ref, W / 2, H * 0.66);
      }
      ctx.restore();
    }
    if (opts.showCanvasFrame) drawFrame();
  }

  function toggle(key) {
    opts[key] = !opts[key];
    // Grid lines default on when entering 4x4
    if (key === "grid4x4" && opts.grid4x4 && !opts.showGrid) opts.showGrid = true;
    redraw();
    syncUi();
  }

  function syncUi() {
    var root = document.querySelector(".clarity-meme-toggle-bar");
    if (!root) return;
    root.querySelectorAll("[data-meme-toggle]").forEach(function (btn) {
      var k = btn.getAttribute("data-meme-toggle");
      var on = !!opts[k];
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
    });
  }

  function ensureToggleBar() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root) return;
    // Upgrade old bar
    var existing = root.querySelector(".clarity-meme-toggle-bar");
    if (existing) existing.remove();

    var bar = document.createElement("div");
    bar.className = "clarity-meme-toggle-bar";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;margin:0.4rem 0 0.5rem;";

    function chip(key, label, title) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mv-chip clarity-meme-tog";
      b.setAttribute("data-meme-toggle", key);
      b.textContent = label;
      b.title = title;
      b.addEventListener("click", function () {
        toggle(key);
      });
      return b;
    }

    bar.appendChild(chip("showVerse", "Verse", "Show or hide verse text on canvas"));
    bar.appendChild(chip("showScene", "Scene", "Show or hide background / AI scene"));
    bar.appendChild(chip("showCanvasFrame", "Frame", "Show or hide canvas frame"));
    bar.appendChild(chip("showGrid", "Grid", "Show or hide 4×4 grid lines on canvas"));
    bar.appendChild(chip("grid4x4", "4×4 collage", "Collage mode: scene split into 4×4 cells"));

    var tip = document.createElement("span");
    tip.style.cssText = "font-size:0.7rem;opacity:0.8;margin-left:0.25rem";
    tip.textContent = "Grid = lines · 4×4 = collage layout";
    bar.appendChild(tip);

    var stage =
      root.querySelector("#meme-stage-wrap") ||
      root.querySelector(".meme-preview-only") ||
      root.querySelector(".clarity-meme-ai-bar");
    if (stage && stage.parentNode) {
      if (stage.classList.contains("clarity-meme-ai-bar") && stage.nextSibling) {
        stage.parentNode.insertBefore(bar, stage.nextSibling);
      } else {
        stage.parentNode.insertBefore(bar, stage);
      }
    } else {
      root.insertBefore(bar, root.firstChild);
    }
    syncUi();
  }

  function boot() {
    wrapDraw();
    ensureToggleBar();
    setTimeout(function () {
      wrapDraw();
      ensureToggleBar();
      syncUi();
    }, 700);
    setTimeout(function () {
      wrapDraw();
      ensureToggleBar();
    }, 2000);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityMemeToggles = {
    opts: opts,
    redraw: redraw,
    set: function (k, v) {
      opts[k] = !!v;
      redraw();
      syncUi();
    }
  };
})(typeof window !== "undefined" ? window : this);
