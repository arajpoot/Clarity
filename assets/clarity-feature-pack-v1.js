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


/* ---- clarity-tj-whisper-restore-v2.js ---- */
/**
 * Clarity Tajweed + Whisper Restore v2
 * Eager wire: mic, meter, MediaRecorder, play file, site links, Whisper soft path
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_TJ_WHISPER_RESTORE_V2__) return;
  g.__CLARITY_TJ_WHISPER_RESTORE_V2__ = true;
  g.__CLARITY_TJ_WHISPER_RESTORE_V1__ = true;

  function loadTj() {
    if (g.__tjLmrLoaded) return Promise.resolve(true);
    if (g.ClarityLazy && typeof g.ClarityLazy.tjLmr === "function") {
      return g.ClarityLazy.tjLmr()
        .then(function () {
          g.__tjLmrLoaded = true;
          wireFallback();
          return true;
        })
        .catch(function () {
          return injectScript();
        });
    }
    return injectScript();
  }

  function injectScript() {
    return new Promise(function (res) {
      if (document.querySelector('script[data-clarity-lazy="tj-lmr"]')) {
        g.__tjLmrLoaded = true;
        wireFallback();
        res(true);
        return;
      }
      var s = document.createElement("script");
      s.src = "./assets/nx-tj-lmr-js-v1.js?v=20261008TJ";
      s.defer = true;
      s.dataset.clarityLazy = "tj-lmr";
      s.onload = function () {
        g.__tjLmrLoaded = true;
        wireFallback();
        res(true);
      };
      s.onerror = function () {
        wireFallback();
        res(false);
      };
      (document.body || document.documentElement).appendChild(s);
    });
  }

  /** Fallback mic + level meter if core buttons exist but handlers missing */
  function wireFallback() {
    try {
      var rec = document.getElementById("tj-lmr-rec-btn");
      var stop = document.getElementById("tj-lmr-rec-stop");
      var play = document.getElementById("tj-lmr-rec-play");
      var fill = document.getElementById("tj-lmr-meter-fill");
      if (!rec) return;

      // If core module already bound click, skip rebind
      if (rec.getAttribute("data-clarity-tj-wired") === "1") return;
      rec.setAttribute("data-clarity-tj-wired", "1");

      var state = { rec: null, chunks: [], stream: null, url: null, recording: false };

      function setStatus(msg) {
        var el = document.getElementById("tj-lmr-status") || document.getElementById("tj-lmr-meta");
        if (el) el.textContent = msg;
      }

      function startMeter(stream) {
        try {
          var Ctx = g.AudioContext || g.webkitAudioContext;
          if (!Ctx) return;
          var ctx = new Ctx();
          var src = ctx.createMediaStreamSource(stream);
          var an = ctx.createAnalyser();
          an.fftSize = 512;
          src.connect(an);
          var data = new Uint8Array(an.fftSize);
          g.__lmrMeterAn = an;
          function tick() {
            if (!g.__lmrMeterAn || !state.recording) return;
            an.getByteTimeDomainData(data);
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
              var v = (data[i] - 128) / 128;
              sum += v * v;
            }
            var lvl = Math.min(100, Math.round(400 * Math.sqrt(sum / data.length)));
            if (fill) fill.style.width = lvl + "%";
            g.__lmrMeterRaf = requestAnimationFrame(tick);
          }
          tick();
        } catch (e) {}
      }

      function stopMeter() {
        try {
          if (g.__lmrMeterRaf) cancelAnimationFrame(g.__lmrMeterRaf);
          g.__lmrMeterAn = null;
          if (fill) fill.style.width = "0%";
        } catch (e) {}
      }

      rec.addEventListener("click", function () {
        if (state.recording) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setStatus("Mic not available in this browser");
          return;
        }
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
            state.stream = stream;
            state.chunks = [];
            try {
              state.rec = new MediaRecorder(stream);
            } catch (e) {
              setStatus("Recorder unsupported");
              stream.getTracks().forEach(function (t) {
                t.stop();
              });
              return;
            }
            state.rec.ondataavailable = function (ev) {
              if (ev.data && ev.data.size) state.chunks.push(ev.data);
            };
            state.rec.onstop = function () {
              try {
                if (state.url) URL.revokeObjectURL(state.url);
                var blob = new Blob(state.chunks, { type: "audio/webm" });
                state.url = URL.createObjectURL(blob);
                g.__tjUserBlobUrl = state.url;
                setStatus("Recording ready — Play");
              } catch (e2) {}
              stopMeter();
              if (state.stream) {
                state.stream.getTracks().forEach(function (t) {
                  t.stop();
                });
              }
              state.recording = false;
            };
            state.rec.start();
            state.recording = true;
            startMeter(stream);
            setStatus("Recording…");
          })
          .catch(function () {
            setStatus("Mic permission denied");
          });
      });

      if (stop) {
        stop.addEventListener("click", function () {
          try {
            if (state.rec && state.recording) state.rec.stop();
          } catch (e) {}
        });
      }

      if (play) {
        play.addEventListener("click", function () {
          var url = state.url || g.__tjUserBlobUrl;
          if (!url) {
            setStatus("No recording yet");
            return;
          }
          try {
            var a = new Audio(url);
            a.play();
            setStatus("Playing recording");
          } catch (e) {
            setStatus("Play failed");
          }
        });
      }

      // File upload play if input exists
      var fileIn = document.getElementById("tj-lmr-file") || document.querySelector("#tj-lmr input[type=file]");
      if (fileIn && !fileIn.getAttribute("data-clarity-tj-wired")) {
        fileIn.setAttribute("data-clarity-tj-wired", "1");
        fileIn.addEventListener("change", function () {
          try {
            var f = fileIn.files && fileIn.files[0];
            if (!f) return;
            if (state.url) URL.revokeObjectURL(state.url);
            state.url = URL.createObjectURL(f);
            g.__tjUserBlobUrl = state.url;
            setStatus("File loaded — Play");
          } catch (e) {}
        });
      }
    } catch (e) {
      console.warn("tj wireFallback", e);
    }
  }

  function maybeLoad(ev) {
    try {
      var t = ev && ev.target;
      if (!t || !t.closest) return;
      var hit = t.closest(
        "#tj-lmr, #tj-lmr-panel, #tj-deep-studio, #tajweed-path-card, #tajweed-live-card, [data-rail-tab='tajweed'], .door-rail-btn[data-rail-tab='tajweed'], #callig-lab-card, [href*='tajweed'], [data-tab='tajweed']"
      );
      if (hit) loadTj().then(function () {
        setTimeout(wireFallback, 200);
        setTimeout(wireFallback, 800);
      });
    } catch (e) {}
  }

  document.addEventListener("click", maybeLoad, true);
  document.addEventListener("pointerdown", maybeLoad, true);

  // Sitewide deep-link: #tajweed or ?tajweed
  function deepLink() {
    try {
      var h = (location.hash || "") + (location.search || "");
      if (/tajweed|tj-lmr|deep.?studio/i.test(h)) {
        loadTj().then(function () {
          setTimeout(wireFallback, 300);
          var el =
            document.getElementById("tj-lmr") ||
            document.getElementById("tajweed-path-card") ||
            document.getElementById("tj-deep-studio");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } catch (e) {}
  }

  function boot() {
    deepLink();
    // If panel already in DOM and visible-ish, load
    var panel =
      document.getElementById("tj-lmr") || document.getElementById("tj-lmr-panel");
    if (panel) {
      setTimeout(function () {
        loadTj().then(function () {
          wireFallback();
        });
      }, 600);
    }
    g.addEventListener("hashchange", deepLink);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-meme-enhance-v4.js ---- */
/**
 * Clarity Meme Enhance v4 — mobile layout, HQ online BG, wide AI, essentials pills
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_ENHANCE_V4__) return;
  g.__CLARITY_MEME_ENHANCE_V4__ = true;
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
      .trim();
    return { ar: ar, en: en, ref: ref };
  }

  function applyText(payload) {
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
      g.memeState.top = ar;
      g.memeState.mid = en;
      g.memeState.bottom = "";
      g.memeState.ref = ref;
      g.memeState._lastRef = ref;
      g.memeState.outline = Math.max(g.memeState.outline || 0, 5);
      try {
        var i = document.getElementById("meme-top-input");
        var o = document.getElementById("meme-mid-input");
        var s = document.getElementById("meme-bottom-input");
        if (i) i.value = ar;
        if (o) o.value = en;
        if (s) s.value = "";
      } catch (e1) {}
      if (typeof g.memeApplyVerseCard === "function") {
        try {
          g.memeApplyVerseCard(ar, en, "", "");
        } catch (e2) {}
      }
      g.memeState.top = ar || g.memeState.top;
      g.memeState.mid = en || g.memeState.mid;
      g.memeState.bottom = "";
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
      setTimeout(redraw, 120);
      setTimeout(redraw, 350);
    } catch (e) {
      console.warn("meme applyText", e);
    }
  }

  // Wide Shariah-safe scenery (no prophet likeness, no Quran as decoration)
  var STYLES = [
    "ultra high resolution mountain valley sunrise soft golden light no people",
    "milky way galaxy stars night sky astrophotography 4k no text",
    "deep space nebula colorful cosmos astronomy photo high resolution",
    "ocean waves aerial turquoise coastline nature photography 4k",
    "misty forest path morning light evergreen trees no people",
    "aurora borealis northern lights over snow 4k no people",
    "desert sand dunes golden hour vast empty landscape 4k",
    "alpine lake crystal reflection snow peaks high resolution",
    "tropical waterfall lush greenery nature only 4k",
    "starfield long exposure night photography no text",
    "olive grove mediterranean hills soft light no people",
    "clouds above vast plain aerial landscape 4k",
    "moonrise over calm sea long exposure no people",
    "autumn forest canopy aerial high resolution",
    "iceland black sand beach ocean mist 4k no people"
  ];

  var BLOCK = /prophet|muhammad|messenger|sahaba|jesus|isa ibn|idol|crucifix|anime|cartoon god|quran page|mushaf face/i;

  function sanitizeTheme(text) {
    text = String(text || "")
      .replace(/[\u0600-\u06FF]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (BLOCK.test(text)) return "peaceful nature landscape soft light high resolution";
    return text.slice(0, 120) || "serene nature landscape";
  }

  function aiPrompt(en, styleIdx) {
    var base = sanitizeTheme(en || "peace patience nature");
    var style = STYLES[(styleIdx || 0) % STYLES.length];
    return (
      "Photorealistic " +
      style +
      ", 4k, NO human faces of prophets, NO Arabic calligraphy, NO Quran pages, scenery only: mood " +
      base
    );
  }

  // Online free photo chains — nature / architecture / space (Shariah-leaning)
  function stockFor(kind, payload) {
    var seed = hash(((payload && payload.en) || "") + (kind || "") + Date.now());
    var s1 = seed % 9000;
    var s2 = (seed * 7) % 9000;
    var s3 = (seed * 13) % 9000;
    var s4 = (seed * 17) % 9000;
    var nature = [
      "https://picsum.photos/seed/n" + s1 + "/1920/1080",
      "https://picsum.photos/seed/nat" + s2 + "/1920/1080",
      "https://picsum.photos/seed/forest" + s3 + "/1920/1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
    ];
    var galaxy = [
      "https://picsum.photos/seed/g" + s1 + "/1920/1080",
      "https://picsum.photos/seed/space" + s2 + "/1920/1080",
      "https://picsum.photos/seed/stars" + s3 + "/1920/1080",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80"
    ];
    var water = [
      "https://picsum.photos/seed/w" + s1 + "/1920/1080",
      "https://picsum.photos/seed/ocean" + s2 + "/1920/1080",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80"
    ];
    var holy = [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Great_Mosque_of_Kairouan_Panorama.jpg/1280px-Great_Mosque_of_Kairouan_Panorama.jpg",
      "https://picsum.photos/seed/arch" + s1 + "/1920/1080",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80"
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
      free: nature.concat(galaxy).concat(water),
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
    var urls = [];
    for (var k = 0; k < 4; k++) {
      var p = aiPrompt(payload.en || payload.english, aiStyleIdx + k * 2);
      var sd = (hash(p + Date.now() + k) % 99999) + 1;
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
        "AI scene " + (aiStyleIdx + 1) + "/" + STYLES.length + " · scenery only…"
      );
    loadBgChain(urls, 0);
  }

  function fetchKind(kind) {
    var st = g.memeState || {};
    if (typeof g.memeFetchStatus === "function")
      g.memeFetchStatus("Fetching " + kind + "…");
    loadBgChain(stockFor(kind, { en: st.mid, ref: st.ref }), 0);
  }

  var _nativeFetch = typeof g.memeFetchBg === "function" ? g.memeFetchBg : null;
  g.memeFetchBg = function (kind) {
    kind = kind || "nature";
    if (
      kind === "galaxy" ||
      kind === "space" ||
      kind === "nature" ||
      kind === "night" ||
      kind === "water" ||
      kind === "holy" ||
      kind === "free" ||
      kind === "dynamic" ||
      kind === "flowers" ||
      kind === "spirit" ||
      kind === "flickr"
    ) {
      fetchKind(kind);
      return;
    }
    if (_nativeFetch) {
      try {
        _nativeFetch(kind);
        return;
      } catch (e) {}
    }
    fetchKind("nature");
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

  function isEssentialMemeCard(card) {
    if (!card || !card.id) return false;
    var allow = {
      "commands-card": 1,
      "journey-card": 1,
      "grave-card": 1,
      "seerah-card": 1,
      "hadith-card": 1,
      "verse-card": 1,
      "daily-verse-card": 1,
      "tafseer-card": 1,
      "quran-card": 1,
      "character-card": 1,
      "life-events-card": 1
    };
    if (allow[card.id]) return true;
    if (card.getAttribute("data-clarity-meme-ok") === "1") return true;
    if (
      card.querySelector(".verse-ar, .ayah-ar, #cmd-ar-text") &&
      card.querySelector(".verse-en, .ayah-en, #cmd-en-text, .translation")
    )
      return true;
    return false;
  }

  function ensurePills() {
    document.querySelectorAll(".clarity-to-meme-pill").forEach(function (btn) {
      var card = btn.closest("[id$='-card'], .card");
      if (!card || !isEssentialMemeCard(card)) {
        try {
          btn.parentNode && btn.parentNode.removeChild(btn);
        } catch (e) {}
      }
    });
    document.querySelectorAll(".card[id$='-card'], [id$='-card']").forEach(function (card) {
      if (bannedCard(card)) return;
      if (!isEssentialMemeCard(card)) return;
      if (card.querySelector(".clarity-to-meme-pill")) return;
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
      btn.className = "clarity-to-meme-pill clarity-action-chip";
      btn.textContent = "Meme";
      btn.title = "Push Arabic + translation to Meme Studio";
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

  /** Unified toolbar + toggle bar — column stack on mobile */
  function ensureToolbar() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root) return;

    var legacy = root.querySelector(".meme-bar-bg");
    if (legacy) {
      legacy.style.display = "none";
      legacy.setAttribute("aria-hidden", "true");
    }

    // Move stray toggle bars that sit on canvas
    root.querySelectorAll(".clarity-meme-toggle-bar, .meme-grid-toggles").forEach(function (tb) {
      tb.style.cssText =
        "display:flex;flex-wrap:wrap;gap:0.3rem;width:100%;max-width:100%;clear:both;float:none;position:relative;margin:0.3rem 0;z-index:6;";
    });

    if (root.querySelector(".clarity-meme-toolbar")) return;

    var bar = document.createElement("div");
    bar.className = "clarity-meme-toolbar clarity-meme-ai-bar";
    bar.setAttribute("data-clarity-meme-bar", "1");

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
      chip("✨ AI scene", "New AI scenery", function () {
        fetchAiBackground({ ar: st().top, en: st().mid, ref: st().ref });
      })
    );
    bar.appendChild(
      chip("✨ AI again", "Next AI style", function () {
        fetchAiBackground({ ar: st().top, en: st().mid, ref: st().ref });
      })
    );
    bar.appendChild(
      chip("🌿 Nature", "HQ nature", function () {
        fetchKind("nature");
      })
    );
    bar.appendChild(
      chip("🌌 Galaxy", "HQ space", function () {
        fetchKind("galaxy");
      })
    );
    bar.appendChild(
      chip("🌙 Night", "Night sky", function () {
        fetchKind("night");
      })
    );
    bar.appendChild(
      chip("💧 Water", "Ocean", function () {
        fetchKind("water");
      })
    );
    bar.appendChild(
      chip("🕌 Holy", "Mosque architecture", function () {
        fetchKind("holy");
      })
    );
    bar.appendChild(
      chip("📷 Free", "Next free HQ", function () {
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

    var note = document.createElement("div");
    note.className = "clarity-meme-shariah-note";
    note.textContent =
      "Scenery only · discard images that resemble prophets or use Quran as decoration.";
    bar.appendChild(note);

    var stage =
      root.querySelector("#meme-stage-wrap") ||
      root.querySelector(".meme-preview-only") ||
      root.querySelector("#meme-stage");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
    else root.insertBefore(bar, root.firstChild);
  }

  function boot() {
    ensureToolbar();
    ensurePills();
    setTimeout(ensureToolbar, 400);
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


/* ---- MEME_GRID_TOGGLES_V4 ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_GRID_V4__) return;
  g.__CLARITY_MEME_GRID_V4__ = true;

  function ensureToggles() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root || root.querySelector(".clarity-meme-toggle-bar")) return;
    var bar = document.createElement("div");
    bar.className = "clarity-meme-toggle-bar";
    bar.innerHTML =
      '<button type="button" class="mv-chip" data-tg="scene">Scene</button>' +
      '<button type="button" class="mv-chip" data-tg="frame">Frame</button>' +
      '<button type="button" class="mv-chip" data-tg="grid">Grid</button>' +
      '<button type="button" class="mv-chip" data-tg="grid4">4×4 collage</button>';
    var stage =
      root.querySelector("#meme-stage-wrap") ||
      root.querySelector(".meme-preview-only");
    var toolbar = root.querySelector(".clarity-meme-toolbar");
    if (toolbar && toolbar.parentNode)
      toolbar.parentNode.insertBefore(bar, toolbar.nextSibling);
    else if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
    else root.appendChild(bar);

    if (!g.memeState) g.memeState = {};
    g.memeState.showGrid = !!g.memeState.showGrid;
    g.memeState.grid4x4 = !!g.memeState.grid4x4;

    bar.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-tg]");
      if (!t) return;
      var k = t.getAttribute("data-tg");
      if (k === "grid") {
        g.memeState.showGrid = !g.memeState.showGrid;
        t.classList.toggle("on", g.memeState.showGrid);
      } else if (k === "grid4") {
        g.memeState.grid4x4 = !g.memeState.grid4x4;
        t.classList.toggle("on", g.memeState.grid4x4);
      } else if (k === "scene") {
        t.classList.toggle("on");
      } else if (k === "frame") {
        t.classList.toggle("on");
      }
      try {
        if (typeof g.memeDraw === "function") g.memeDraw();
      } catch (e) {}
    });
  }

  // Hook draw for grid lines
  var tries = 0;
  function hookDraw() {
    if (typeof g.memeDraw !== "function") {
      if (tries++ < 30) setTimeout(hookDraw, 400);
      return;
    }
    if (g.__memeDrawGridHooked) return;
    g.__memeDrawGridHooked = true;
    var orig = g.memeDraw;
    g.memeDraw = function () {
      orig.apply(this, arguments);
      try {
        var canvas = document.getElementById("meme-canvas");
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        var w = canvas.width,
          h = canvas.height;
        if (g.memeState && g.memeState.showGrid) {
          ctx.save();
          ctx.strokeStyle = "rgba(255,255,255,0.22)";
          ctx.lineWidth = 1;
          for (var i = 1; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo((i * w) / 4, 0);
            ctx.lineTo((i * w) / 4, h);
            ctx.moveTo(0, (i * h) / 4);
            ctx.lineTo(w, (i * h) / 4);
            ctx.stroke();
          }
          ctx.restore();
        }
      } catch (e) {}
    };
  }

  function boot() {
    ensureToggles();
    hookDraw();
    setTimeout(ensureToggles, 600);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
