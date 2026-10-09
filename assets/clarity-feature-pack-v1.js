/** Clarity Feature Pack v1 — polished production merge 20261008POLISH */

/* ---- clarity-layout-fix-v10 ---- */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V10__) return;
  w.__CLARITY_LAYOUT_FIX_V10__ = true;
  function shouldPin() {
    try {
      return Math.min(w.innerWidth || 0, document.documentElement.clientWidth || 0) >= 1024;
    } catch (e) {
      return false;
    }
  }
  function apply() {
    try {
      var pin = shouldPin();
      var root = document.documentElement;
      root.classList.toggle("clarity-desktop", pin);
      root.classList.toggle("clarity-mobile", !pin);
      var duo = document.getElementById("clarity-top-duo");
      if (duo) {
        if (pin) {
          duo.style.position = "sticky";
          duo.style.top = "0";
          duo.style.zIndex = "46";
        } else {
          duo.style.position = "relative";
          duo.style.top = "";
        }
      }
    } catch (e) {}
  }
  var t = null;
  function schedule() {
    if (t) return;
    t = setTimeout(function () {
      t = null;
      requestAnimationFrame(apply);
    }, 100);
  }
  w.addEventListener("resize", schedule, { passive: true });
  w.addEventListener("orientationchange", function () {
    setTimeout(apply, 120);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})(typeof window !== "undefined" ? window : this);

/* ---- clarity-path-rail-v2 ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_RAIL_V2__) return;
  g.__CLARITY_PATH_RAIL_V2__ = true;
  var PATH_KEY = "clarity_path_focus";
  var PATHS = [
    { id: "seeker", label: "1 Seeker" },
    { id: "new_muslim", label: "2 New Muslim" },
    { id: "practicing", label: "3 Daily" },
    { id: "dai", label: "4 Da'i" }
  ];
  var MODULES = {
    seeker: [
      { id: "junior-curriculum-card", label: "Junior path" },
      { id: "commands-card", label: "Commands" },
      { id: "soul-compass-card", label: "Soul compass" },
      { id: "seerah-live-card", label: "Seerah" },
      { id: "samina-verse-card", label: "Sami'na" },
      { id: "grave-path-card", label: "Grave path" },
      { id: "about-clarity-card", label: "About" }
    ],
    new_muslim: [
      { id: "junior-high-curriculum-card", label: "Junior high" },
      { id: "salah-starter-card", label: "Salah" },
      { id: "fiqh-quiz-card", label: "Fiqh quiz" },
      { id: "commands-card", label: "Commands" },
      { id: "hajj-guide-card", label: "Hajj guide" },
      { id: "seerah-live-card", label: "Seerah" },
      { id: "notes-shell", label: "Notes" }
    ],
    practicing: [
      { id: "daily-hs-curriculum-card", label: "High school" },
      { id: "tj-lmr", label: "Tajweed" },
      { id: "weekly-review-card", label: "Weekly review" },
      { id: "deepen-study-card", label: "Deepen" },
      { id: "meme-card", label: "Meme" },
      { id: "callig-lab-card", label: "Calligraphy" },
      { id: "notes-shell", label: "Notes" }
    ],
    dai: [
      { id: "dai-university-curriculum-card", label: "Da'i uni" },
      { id: "dai-transmit-card", label: "Transmit" },
      { id: "israeliyat-card", label: "Israeliyat" },
      { id: "meme-card", label: "Meme" },
      { id: "seerah-mirror-card", label: "Seerah mirror" },
      { id: "asma-names-lecture-card", label: "Asma" },
      { id: "notes-shell", label: "Notes" }
    ]
  };
  function currentPath() {
    try {
      var p =
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem(PATH_KEY) ||
        "seeker";
      if (p === "daily" || p === "daily_muslim") p = "practicing";
      if (p === "new-muslim") p = "new_muslim";
      if (!MODULES[p]) p = "seeker";
      return p;
    } catch (e) {
      return "seeker";
    }
  }
  function setPath(id) {
    if (!MODULES[id]) return;
    try {
      localStorage.setItem(PATH_KEY, id);
      localStorage.setItem("clarity_committed_path", id === "practicing" ? "daily" : id === "new_muslim" ? "new-muslim" : id);
      document.documentElement.setAttribute("data-clarity-path", id);
      var idxMap = { seeker: 0, new_muslim: 1, practicing: 2, daily: 2, dai: 3 };
      var idx = idxMap[id] != null ? idxMap[id] : 0;
      document.documentElement.setAttribute("data-path-i", String(idx));
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { path: id, pathI: idx } }));
    } catch (e) {}
    renderRail();
  }
  function openModule(id) {
    if (!id) return;
    var map = {
      tajweed: ["tj-lmr", "tajweed-live-card", "tajweed-path-card", "tj-deep-studio", "callig-lab-card"],
      "tj-lmr": ["tj-lmr", "tajweed-live-card", "tajweed-path-card"],
      "tajweed-live-card": ["tajweed-live-card", "tj-lmr"],
      notes: ["notes-shell", "notes-card"],
      "notes-shell": ["notes-shell"],
      meme: ["meme-card"],
      "meme-card": ["meme-card"],
      calligraphy: ["callig-lab-card"],
      "callig-lab-card": ["callig-lab-card"]
    };
    var key = String(id);
    var ids = map[key] || map[key.toLowerCase()] || [key];
    var el = null;
    for (var i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (el) break;
    }
    // Fallback: query practice loop inside tajweed card
    if (!el && /tajweed|tj-lmr/i.test(key)) {
      el = document.getElementById("tj-lmr") || document.querySelector("#tajweed-live-card, #tajweed-path-card, .tj-practice-loop");
    }
    if (!el && /notes/i.test(key)) {
      el = document.getElementById("notes-shell") || document.querySelector("[id*='notes']");
    }
    if (!el) {
      console.warn("path-rail: module not found", id);
      return;
    }
    try {
      el.classList.remove("gate-hidden", "hidden");
      el.hidden = false;
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      // expand details/summary parents
      var p = el;
      for (var k = 0; k < 6 && p; k++) {
        if (p.tagName === "DETAILS") p.open = true;
        p = p.parentElement;
      }
    } catch (e) {}
    try {
      if (/tj|tajweed/i.test(el.id + key) && g.ClarityLazy && g.ClarityLazy.tjLmr) g.ClarityLazy.tjLmr();
      if (/notes/i.test(el.id + key) && g.ClarityLazy && g.ClarityLazy.notes) g.ClarityLazy.notes();
    } catch (e2) {}
    try {
      if (/meme/i.test(el.id) && typeof g.switchTab === "function") g.switchTab("reminder");
      if (/notes/i.test(el.id) && typeof g.switchTab === "function") g.switchTab("reflection");
    } catch (e4) {}
    setTimeout(function () {
      try {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e3) {}
    }, 50);
  }
  function ensureRail() {
    var rail = document.getElementById("clarity-path-rail");
    if (rail) return rail;
    ["clarity-visit-pill-bar", "clarity-path-module-strip", "clarity-daily-tools-strip"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n && n.parentNode) n.parentNode.removeChild(n);
    });
    document.querySelectorAll(".clarity-visit-strip, .clarity-daily-tools-strip").forEach(function (n) {
      try {
        n.remove();
      } catch (e) {}
    });
    rail = document.createElement("div");
    rail.id = "clarity-path-rail";
    rail.className = "clarity-path-rail";
    rail.setAttribute("role", "navigation");
    var duo = document.getElementById("clarity-top-duo");
    if (duo && duo.parentNode) {
      if (duo.nextSibling) duo.parentNode.insertBefore(rail, duo.nextSibling);
      else duo.parentNode.appendChild(rail);
    } else document.body.insertBefore(rail, document.body.firstChild);
    return rail;
  }
  function renderRail() {
    var rail = ensureRail();
    var path = currentPath();
    var html = '<div class="cpr-track-row" role="group" aria-label="Phased learning track">';
    html += '<span class="cpr-track-label">TRACK</span>';
    html += '<div class="cpr-paths">';
    PATHS.forEach(function (p) {
      html +=
        '<button type="button" class="cpr-path' +
        (p.id === path ? " is-on" : "") +
        '" data-path="' +
        p.id +
        '" aria-pressed="' +
        (p.id === path ? "true" : "false") +
        '">' +
        p.label +
        "</button>";
    });
    html +=
      '<button type="button" class="cpr-path cpr-reset" id="clarity-path-reset-btn" data-path-reset="1" title="Reset to Seeker">↻Reset</button>';
    html += "</div></div>";
    html += '<div class="cpr-modules" aria-label="Modules on this path">';
    (MODULES[path] || []).forEach(function (m) {
      html += '<button type="button" class="cpr-mod" data-mod="' + m.id + '">' + m.label + "</button>";
    });
    html += "</div>";
    rail.innerHTML = html;
  }
  function boot() {
    renderRail();
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target.closest("[data-path]");
        if (t) {
          try {
            ev.preventDefault();
          } catch (e) {}
          setPath(t.getAttribute("data-path"));
          return;
        }
        t = ev.target.closest("[data-mod]");
        if (t) {
          try {
            ev.preventDefault();
          } catch (e) {}
          openModule(t.getAttribute("data-mod"));
        }
      },
      true
    );
    g.addEventListener("clarity-path-changed", renderRail);
    setTimeout(renderRail, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/* ---- sticky action pills (no flash) ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_ACTION_PILLS_STICKY_V2__) return;
  g.__CLARITY_ACTION_PILLS_STICKY_V2__ = true;
  var ESSENTIAL = {
    "commands-card": 1,
    "samina-verse-card": 1,
    "samina-card": 1,
    "grave-path-card": 1,
    "seerah-live-card": 1,
    "seerah-mirror-card": 1,
    "soul-compass-card": 1,
    "deepen-study-card": 1,
    "tafseer-resources-card": 1,
    "cw-card": 1,
    "hell-sins-card": 1,
    "night-breath-card": 1
  };
  function ok(card) {
    if (!card || !card.id) return false;
    if (card.closest("#clarity-top-duo,#clarity-path-rail,#meme-card,#notes-shell")) return false;
    return !!(ESSENTIAL[card.id] || card.getAttribute("data-clarity-meme-ok") === "1");
  }
  function stick(card) {
    if (!ok(card) || card.getAttribute("data-clarity-pills-stuck") === "1") return;
    if (card.querySelector(".clarity-to-meme-pill") && card.querySelector(".clarity-to-notes-pill")) {
      card.setAttribute("data-clarity-pills-stuck", "1");
      return;
    }
    var row = card.querySelector(".clarity-action-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "clarity-action-row";
      card.appendChild(row);
    }
    if (!card.querySelector(".clarity-to-meme-pill")) {
      var m = document.createElement("button");
      m.type = "button";
      m.className = "clarity-to-meme-pill clarity-action-chip";
      m.textContent = "Meme";
      m.addEventListener("click", function (ev) {
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e) {}
        if (typeof g.clarityMemePushFromCard === "function") g.clarityMemePushFromCard(card, "stock");
      });
      row.appendChild(m);
    }
    if (!card.querySelector(".clarity-to-notes-pill")) {
      var n = document.createElement("button");
      n.type = "button";
      n.className = "clarity-to-notes-pill clarity-action-chip";
      n.textContent = "Notes";
      n.addEventListener("click", function (ev) {
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e) {}
        try {
          var ar = ((card.querySelector(".verse-ar,.arabic,[lang='ar'],#cmd-ar-text") || {}).textContent || "").trim();
          var en = ((card.querySelector(".verse-en,.translation,#cmd-en-text") || {}).textContent || "").trim();
          var ref = ((card.querySelector(".ref,.verse-ref") || {}).textContent || "").trim();
          function go() {
            if (typeof g.notesCreate === "function")
              g.notesCreate({ title: (ref || card.id || "Note").slice(0, 72), tag: "Qur'an", body: (ar + "\n\n" + en).trim() });
          }
          if (typeof g.notesCreate === "function") go();
          else if (g.ClarityLazy && g.ClarityLazy.notes) g.ClarityLazy.notes().then(go);
        } catch (e2) {}
      });
      row.appendChild(n);
    }
    card.setAttribute("data-clarity-pills-stuck", "1");
  }
  function pass() {
    document.querySelectorAll("[id$='-card']").forEach(stick);
  }
  function boot() {
    pass();
    setTimeout(pass, 700);
    setTimeout(pass, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);


/* ---- tj whisper restore v3 — full studio wire ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_TJ_WHISPER_RESTORE_V3__) return;
  g.__CLARITY_TJ_WHISPER_RESTORE_V3__ = true;
  g.__CLARITY_TJ_WHISPER_RESTORE_V2__ = true;

  var state = {
    rec: null,
    stream: null,
    chunks: [],
    url: null,
    recording: false,
    wired: false
  };

  function status(msg) {
    var el =
      document.getElementById("tj-lmr-rec-status") ||
      document.getElementById("tj-lmr-status") ||
      document.getElementById("tj-lmr-meta");
    if (el) el.textContent = msg;
  }

  function ensureMeterDom() {
    var host =
      document.getElementById("tj-lmr-rec-status") ||
      document.getElementById("tj-lmr-step3");
    if (!host) return;
    if (document.getElementById("tj-lmr-meter-fill")) return;
    var wrap = document.createElement("div");
    wrap.id = "tj-lmr-input-level";
    wrap.className = "tj-lmr-input-level";
    wrap.innerHTML =
      '<div class="tj-lmr-level-label">INPUT LEVEL</div>' +
      '<div class="tj-lmr-level-track"><div class="tj-lmr-level-fill" id="tj-lmr-meter-fill"></div></div>';
    if (host.parentNode) host.parentNode.insertBefore(wrap, host.nextSibling);
  }

  function loadTj() {
    if (g.__tjLmrLoaded) return Promise.resolve(true);
    if (g.ClarityLazy && typeof g.ClarityLazy.tjLmr === "function") {
      return g.ClarityLazy
        .tjLmr()
        .then(function () {
          g.__tjLmrLoaded = true;
          return true;
        })
        .catch(function () {
          return inject();
        });
    }
    return inject();
  }

  function inject() {
    return new Promise(function (res) {
      if (document.querySelector('script[data-clarity-lazy="tj-lmr"]')) {
        g.__tjLmrLoaded = true;
        res(true);
        return;
      }
      var s = document.createElement("script");
      s.src = "./assets/nx-tj-lmr-js-v1.js?v=20261008TJ2";
      s.defer = true;
      s.dataset.clarityLazy = "tj-lmr";
      s.onload = function () {
        g.__tjLmrLoaded = true;
        res(true);
      };
      s.onerror = function () {
        res(false);
      };
      (document.body || document.documentElement).appendChild(s);
    });
  }

  function stopMeter() {
    try {
      if (g.__lmrMeterRaf) cancelAnimationFrame(g.__lmrMeterRaf);
      g.__lmrMeterAn = null;
      var fill = document.getElementById("tj-lmr-meter-fill");
      if (fill) fill.style.width = "0%";
    } catch (e) {}
  }

  function startMeter(stream) {
    try {
      var Ctx = g.AudioContext || g.webkitAudioContext;
      if (!Ctx) return;
      var ctx = g.__lmrMeterCtx || new Ctx();
      g.__lmrMeterCtx = ctx;
      if (ctx.state === "suspended") ctx.resume();
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
        var lvl = Math.min(100, Math.round(420 * Math.sqrt(sum / data.length)));
        var fill = document.getElementById("tj-lmr-meter-fill");
        if (fill) fill.style.width = lvl + "%";
        g.__lmrMeterRaf = requestAnimationFrame(tick);
      }
      tick();
    } catch (e) {
      console.warn("meter", e);
    }
  }

  function setBtnState(recording) {
    var stop = document.getElementById("tj-lmr-rec-stop");
    var play = document.getElementById("tj-lmr-rec-play");
    var score = document.getElementById("tj-lmr-score-btn");
    if (stop) stop.disabled = !recording && !state.url;
    if (stop) stop.disabled = !recording;
    if (play) play.disabled = !state.url;
    if (score) score.disabled = !state.url;
  }

  function wire() {
    ensureMeterDom();
    var rec = document.getElementById("tj-lmr-rec-btn");
    if (!rec) return;
    if (rec.getAttribute("data-clarity-tj-v3") === "1") return;
    rec.setAttribute("data-clarity-tj-v3", "1");
    state.wired = true;

    var stop = document.getElementById("tj-lmr-rec-stop");
    var play = document.getElementById("tj-lmr-rec-play");
    var userAudio = document.getElementById("tj-lmr-user-audio");

    rec.addEventListener("click", function (ev) {
      try {
        ev.preventDefault();
        ev.stopPropagation();
      } catch (e) {}
      if (state.recording) return;

      if (!g.isSecureContext && location.hostname !== "localhost") {
        status("Mic needs HTTPS (or localhost). Open https://clarity-dawah.fyi");
        return;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status("Mic API not available in this browser");
        return;
      }

      status("Requesting mic…");
      navigator.mediaDevices
        .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
        .then(function (stream) {
          state.stream = stream;
          state.chunks = [];
          var mime = "";
          try {
            if (window.MediaRecorder && MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
              mime = "audio/webm;codecs=opus";
            else if (MediaRecorder.isTypeSupported("audio/webm")) mime = "audio/webm";
            else if (MediaRecorder.isTypeSupported("audio/mp4")) mime = "audio/mp4";
          } catch (e0) {}
          try {
            state.rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
          } catch (e1) {
            status("Recorder unsupported on this device");
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
              var blob = new Blob(state.chunks, { type: state.rec.mimeType || "audio/webm" });
              state.url = URL.createObjectURL(blob);
              g.__tjUserBlobUrl = state.url;
              if (userAudio) {
                userAudio.src = state.url;
                userAudio.style.display = "block";
              }
              status("Recording ready — play or score");
              setBtnState(false);
              if (play) play.disabled = false;
              if (document.getElementById("tj-lmr-score-btn"))
                document.getElementById("tj-lmr-score-btn").disabled = false;
            } catch (e2) {
              status("Could not save recording");
            }
            stopMeter();
            if (state.stream) {
              state.stream.getTracks().forEach(function (t) {
                t.stop();
              });
            }
            state.recording = false;
            if (stop) stop.disabled = true;
          };
          state.rec.start(200);
          state.recording = true;
          startMeter(stream);
          status("Recording… speak now");
          if (stop) stop.disabled = false;
        })
        .catch(function (err) {
          var name = (err && err.name) || "";
          if (name === "NotAllowedError" || name === "PermissionDeniedError")
            status("Mic permission denied — allow microphone for this site in browser settings");
          else if (name === "NotFoundError") status("No microphone found");
          else status("Mic error: " + (err && err.message ? err.message : "unavailable"));
        });
    });

    if (stop && stop.getAttribute("data-clarity-tj-v3") !== "1") {
      stop.setAttribute("data-clarity-tj-v3", "1");
      stop.addEventListener("click", function () {
        try {
          if (state.rec && state.recording) state.rec.stop();
        } catch (e) {}
      });
    }

    if (play && play.getAttribute("data-clarity-tj-v3") !== "1") {
      play.setAttribute("data-clarity-tj-v3", "1");
      play.addEventListener("click", function () {
        var url = state.url || g.__tjUserBlobUrl;
        if (!url) {
          status("No recording yet");
          return;
        }
        try {
          if (userAudio && userAudio.src) {
            userAudio.play();
          } else {
            new Audio(url).play();
          }
          status("Playing your recording");
        } catch (e) {
          status("Play failed");
        }
      });
    }

    // Master play buttons — ensure clickable even if core late
    ["tj-lmr-play-master", "tj-lmr-play-master2", "tj-lmr-play-master3"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn || btn.getAttribute("data-clarity-tj-master") === "1") return;
      btn.setAttribute("data-clarity-tj-master", "1");
      btn.addEventListener("click", function () {
        var a = document.getElementById("tj-lmr-master-audio");
        if (a && a.src) {
          try {
            a.currentTime = 0;
            a.play();
            status("Playing master");
          } catch (e) {}
        } else {
          status("Pull an āyah first for master audio");
        }
      });
    });

    status("Mic ready · tap Start whisper");
  }

  function activate() {
    loadTj().then(function () {
      setTimeout(wire, 100);
      setTimeout(wire, 500);
      setTimeout(wire, 1200);
    });
  }

  document.addEventListener(
    "click",
    function (ev) {
      try {
        var t = ev.target.closest(
          "#tj-lmr, #tj-lmr-panel, #tj-deep-studio, #tajweed-live-card, #tajweed-path-card, [data-mod='tj-lmr'], [data-mod='tajweed-live-card']"
        );
        if (t) activate();
      } catch (e) {}
    },
    true
  );

  function boot() {
    if (document.getElementById("tj-lmr") || document.getElementById("tj-lmr-rec-btn")) {
      setTimeout(activate, 600);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
/* ---- meme enhance full toolbar v5 ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_ENHANCE_V5__) return;
  g.__CLARITY_MEME_ENHANCE_V5__ = true;
  g.__CLARITY_MEME_ENHANCE_V4__ = true;

  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "" };
    var ar = "", en = "", ref = "";
    try {
      if (g.currentCommandVerse) {
        ar = g.currentCommandVerse.arabic || "";
        en = g.currentCommandVerse.english || g.currentCommandVerse.en || "";
        ref = g.currentCommandVerse.ref || "";
      }
    } catch (e) {}
    if (!ar)
      ar = ((card.querySelector("#cmd-ar-text,.verse-ar,.arabic,[lang='ar'],.hadith-ar") || {}).textContent || "").trim();
    if (!en)
      en = ((card.querySelector("#cmd-en-text,.verse-en,.translation,.english,.hadith-en") || {}).textContent || "").trim();
    if (!ref)
      ref = ((card.querySelector(".ref,.verse-ref,.hadith-ref") || {}).textContent || "").trim();
    en = en.replace(/Sahih International.*/i, "").trim();
    return { ar: ar, en: en, ref: ref };
  }

  function applyText(p) {
    try {
      if (!g.memeState) g.memeState = {};
      g.memeState.top = p.ar || "";
      g.memeState.mid = p.en || "";
      g.memeState.bottom = "";
      g.memeState.ref = p.ref || "";
      g.memeState._lastRef = p.ref || "";
      var i = document.getElementById("meme-top-input") || document.getElementById("meme-top");
      var o = document.getElementById("meme-mid-input") || document.getElementById("meme-mid");
      var b = document.getElementById("meme-bottom-input") || document.getElementById("meme-bottom");
      if (i) i.value = p.ar || "";
      if (o) o.value = p.en || "";
      if (b) b.value = "";
      if (typeof g.memeDraw === "function") g.memeDraw();
      setTimeout(function () {
        try {
          if (typeof g.memeDraw === "function") g.memeDraw();
        } catch (e) {}
      }, 120);
    } catch (e) {}
  }

  function loadBg(urls, i) {
    i = i || 0;
    if (!urls || i >= urls.length) {
      status("Could not load background");
      return;
    }
    status("Loading background…");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (!g.memeState) g.memeState = {};
        g.memeState.bgImage = img;
        g.memeState.bg = "image";
        if (typeof g.memeDraw === "function") g.memeDraw();
        status("Background ready");
      } catch (e) {}
    };
    img.onerror = function () {
      loadBg(urls, i + 1);
    };
    img.src = urls[i];
  }

  function status(msg) {
    try {
      if (typeof g.memeFetchStatus === "function") g.memeFetchStatus(msg);
      var el = document.getElementById("meme-status") || document.querySelector(".meme-status");
      if (el) el.textContent = msg;
    } catch (e) {}
  }

  var STYLES = [
    "ultra high resolution mountain valley sunrise soft golden light no people",
    "milky way galaxy stars night sky 4k no text",
    "ocean waves turquoise coastline nature photography 4k",
    "misty forest path morning light no people",
    "aurora borealis over snow 4k no people",
    "desert sand dunes golden hour empty landscape",
    "alpine lake reflection snow peaks high resolution",
    "olive grove mediterranean soft light no people"
  ];
  var aiIdx = 0;

  function fetchKind(kind) {
    var s = (Date.now() % 9000) + 1;
    var nature = [
      "https://picsum.photos/seed/n" + s + "/1920/1080",
      "https://picsum.photos/seed/nat" + (s + 3) + "/1920/1080",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80"
    ];
    var galaxy = [
      "https://picsum.photos/seed/g" + s + "/1920/1080",
      "https://picsum.photos/seed/space" + (s + 2) + "/1920/1080",
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80"
    ];
    var water = [
      "https://picsum.photos/seed/w" + s + "/1920/1080",
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80"
    ];
    var holy = [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://picsum.photos/seed/arch" + s + "/1920/1080"
    ];
    var map = {
      nature: nature,
      galaxy: galaxy,
      space: galaxy,
      night: galaxy,
      water: water,
      holy: holy,
      free: nature.concat(galaxy)
    };
    loadBg(map[kind] || nature, 0);
  }

  function fetchAi() {
    aiIdx = (aiIdx + 1) % STYLES.length;
    var style = STYLES[aiIdx];
    var st = g.memeState || {};
    var mood = String(st.mid || "peace nature").replace(/[\u0600-\u06FF]+/g, " ").slice(0, 80);
    var prompt =
      "Photorealistic " +
      style +
      ", 4k, NO human faces of prophets, NO Arabic calligraphy, NO Quran pages, scenery only, mood: " +
      mood;
    var seed = (Date.now() % 99999) + 1;
    var urls = [];
    for (var k = 0; k < 3; k++) {
      urls.push(
        "https://image.pollinations.ai/prompt/" +
          encodeURIComponent(prompt + " variant " + k) +
          "?width=1920&height=1080&nologo=true&seed=" +
          (seed + k * 17)
      );
    }
    urls = urls.concat([
      "https://picsum.photos/seed/ai" + seed + "/1920/1080"
    ]);
    status("AI scene " + (aiIdx + 1) + "/" + STYLES.length + "…");
    loadBg(urls, 0);
  }

  g.clarityMemePushFromCard = function (card, mode) {
    var p = extract(card);
    if (!p.ar && !p.en) {
      status("No verse text found");
      return;
    }
    applyText(p);
    if (mode === "ai") fetchAi();
    else fetchKind("nature");
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e) {}
    setTimeout(function () {
      var c = document.getElementById("meme-card");
      if (c) {
        c.classList.remove("gate-hidden");
        c.style.removeProperty("display");
        c.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      applyText(p);
    }, 200);
  };

  g.memeFetchBg = function (kind) {
    kind = kind || "nature";
    if (kind === "ai") {
      fetchAi();
      return;
    }
    fetchKind(kind);
  };

  function chip(label, title, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "mv-chip meme-tb-chip";
    b.textContent = label;
    b.title = title || label;
    b.addEventListener("click", function (ev) {
      try {
        ev.preventDefault();
        ev.stopPropagation();
      } catch (e) {}
      fn();
    });
    return b;
  }

  function ensureToolbar() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root) return;

    // hide legacy bg bar if present
    var legacy = root.querySelector(".meme-bar-bg");
    if (legacy) {
      legacy.style.display = "none";
    }

    var bar = root.querySelector(".clarity-meme-toolbar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "clarity-meme-toolbar";
      bar.setAttribute("data-clarity-meme-bar", "1");
      bar.appendChild(chip("✨ AI scene", "AI scenery", fetchAi));
      bar.appendChild(chip("✨ AI again", "Next AI style", fetchAi));
      bar.appendChild(
        chip("🌿 Nature", "Nature HQ", function () {
          fetchKind("nature");
        })
      );
      bar.appendChild(
        chip("🌌 Galaxy", "Galaxy HQ", function () {
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
        chip("🕌 Holy", "Architecture", function () {
          fetchKind("holy");
        })
      );
      bar.appendChild(
        chip("📷 Free", "Next free", function () {
          fetchKind("free");
        })
      );
      bar.appendChild(
        chip("⬛ Blank", "Solid blank", function () {
          try {
            if (g.memeState) {
              g.memeState.bgImage = null;
              g.memeState.bg = "blank";
            }
            if (typeof g.memeShowBlankPalette === "function") g.memeShowBlankPalette();
            else if (typeof g.memeDraw === "function") g.memeDraw();
            status("Blank canvas");
          } catch (e) {}
        })
      );
      var note = document.createElement("div");
      note.className = "clarity-meme-shariah-note";
      note.textContent = "Scenery only · no prophet likeness · no Quran as decoration";
      bar.appendChild(note);

      var stage =
        root.querySelector("#meme-stage-wrap") ||
        root.querySelector(".meme-preview-only") ||
        root.querySelector("#meme-stage") ||
        root.querySelector("canvas") && root.querySelector("canvas").parentElement;
      if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
      else {
        var title = root.querySelector("h2, h3, .card-title");
        if (title && title.parentNode) title.parentNode.insertBefore(bar, title.nextSibling);
        else root.insertBefore(bar, root.firstChild);
      }
    }

    // toggle bar
    if (!root.querySelector(".clarity-meme-toggle-bar")) {
      var tb = document.createElement("div");
      tb.className = "clarity-meme-toggle-bar";
      ["Scene", "Frame", "Grid", "4×4"].forEach(function (lab) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "mv-chip";
        b.textContent = lab;
        b.addEventListener("click", function () {
          b.classList.toggle("on");
          if (!g.memeState) g.memeState = {};
          if (lab === "Grid") g.memeState.showGrid = b.classList.contains("on");
          if (lab === "4×4") g.memeState.grid4x4 = b.classList.contains("on");
          try {
            if (typeof g.memeDraw === "function") g.memeDraw();
          } catch (e) {}
        });
        tb.appendChild(b);
      });
      if (bar.nextSibling) bar.parentNode.insertBefore(tb, bar.nextSibling);
      else bar.parentNode.appendChild(tb);
    }
  }

  function boot() {
    ensureToolbar();
    setTimeout(ensureToolbar, 400);
    setTimeout(ensureToolbar, 1200);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__memeTb);
        g.__memeTb = setTimeout(ensureToolbar, 300);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/* ---- calligraphy pad enhance v1 ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_CALLIG_ENHANCE_V1__) return;
  g.__CLARITY_CALLIG_ENHANCE_V1__ = true;

  var tips = {
    finger: "Finger: soft pressure, slower lifts. Good for learning letter shape.",
    stylus: "Stylus: steadier line; keep angle consistent across the stroke.",
    qalam: "Qalam (feather): thicker on downward pressure, thinner on release — classic naskh feel.",
    blunt: "Blunt tip: even width; focus on proportion and baseline alignment."
  };

  function ensureTipBar() {
    var card = document.getElementById("callig-lab-card");
    if (!card || card.querySelector(".clarity-callig-tip-bar")) return;
    var bar = document.createElement("div");
    bar.className = "clarity-callig-tip-bar";
    bar.innerHTML =
      '<span class="cct-label">Writing tip</span>' +
      '<button type="button" class="mv-chip" data-tip="finger">Finger</button>' +
      '<button type="button" class="mv-chip" data-tip="stylus">Stylus</button>' +
      '<button type="button" class="mv-chip" data-tip="qalam">Qalam</button>' +
      '<button type="button" class="mv-chip" data-tip="blunt">Blunt</button>';
    var hint = document.getElementById("callig-stylus-hint") || card.querySelector("h2");
    if (hint && hint.parentNode) hint.parentNode.insertBefore(bar, hint.nextSibling);
    else card.insertBefore(bar, card.firstChild);

    bar.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-tip]");
      if (!t) return;
      var mode = t.getAttribute("data-tip");
      bar.querySelectorAll("[data-tip]").forEach(function (b) {
        b.classList.toggle("on", b === t);
      });
      var badge = document.getElementById("callig-mode-badge");
      if (badge) badge.textContent = "Naskh · " + mode;
      var tip = document.getElementById("callig-tajweed-tip");
      if (tip) tip.textContent = tips[mode] || tip.textContent;
      try {
        if (g.calligState) g.calligState.tipMode = mode;
      } catch (e) {}
    });
  }

  function ensureViewportControls() {
    var bar = document.getElementById("callig-pad-control-bar");
    if (!bar || bar.querySelector(".clarity-callig-viewport")) return;
    var vp = document.createElement("span");
    vp.className = "clarity-callig-viewport";
    vp.style.cssText = "display:inline-flex;flex-wrap:wrap;gap:0.3rem;align-items:center;margin-left:0.35rem";
    vp.innerHTML =
      '<button type="button" class="btn-soft" data-vp="in" title="Zoom in">＋</button>' +
      '<button type="button" class="btn-soft" data-vp="out" title="Zoom out">－</button>' +
      '<button type="button" class="btn-soft" data-vp="reset" title="Reset view">⟲ View</button>';
    bar.appendChild(vp);

    var scale = 1;
    vp.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-vp]");
      if (!t) return;
      var act = t.getAttribute("data-vp");
      var stage = document.getElementById("callig-stage-wrap");
      var canvas = document.getElementById("callig-canvas");
      if (!stage || !canvas) return;
      if (act === "in") scale = Math.min(1.8, scale + 0.15);
      if (act === "out") scale = Math.max(0.55, scale - 0.15);
      if (act === "reset") scale = 1;
      canvas.style.transform = "scale(" + scale + ")";
      canvas.style.transformOrigin = "center top";
      stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2);
    });
  }

  function narrowPad() {
    var stage = document.getElementById("callig-stage-wrap");
    var canvas = document.getElementById("callig-canvas");
    if (stage) {
      stage.classList.add("clarity-callig-narrow");
    }
    if (canvas) {
      canvas.style.maxWidth = "min(100%, 520px)";
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.margin = "0 auto";
      canvas.style.display = "block";
    }
  }

  function boot() {
    ensureTipBar();
    ensureViewportControls();
    narrowPad();
    setTimeout(function () {
      ensureTipBar();
      ensureViewportControls();
      narrowPad();
    }, 600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener(
    "click",
    function (ev) {
      if (ev.target.closest("#callig-lab-card, [data-mod='callig-lab-card']")) {
        setTimeout(boot, 100);
      }
    },
    true
  );
})(typeof window !== "undefined" ? window : this);



/* Phase5 measure banner height for sticky path-rail */
(function (g) {
  "use strict";
  if (g.__CLARITY_STICKY_MEASURE_V1__) return;
  g.__CLARITY_STICKY_MEASURE_V1__ = true;
  function measure() {
    try {
      var nav = document.getElementById("clarity-global-nav") || document.querySelector("nav.global-nav");
      var duo = document.getElementById("clarity-top-duo");
      var nh = nav ? Math.round(nav.getBoundingClientRect().height) : 52;
      var bh = duo ? Math.round(duo.getBoundingClientRect().height) : 56;
      document.documentElement.style.setProperty("--clarity-nav-h", nh + "px");
      document.documentElement.style.setProperty("--clarity-banner-h", bh + "px");
      /* Mobile: never sticky banner — free scroll */
      var portraitPhone = false;
      try {
        portraitPhone =
          window.matchMedia &&
          window.matchMedia("(max-width: 900px) and (orientation: portrait)").matches;
      } catch (eM) {
        var w = window.innerWidth || 0;
        var h = window.innerHeight || 0;
        portraitPhone = w <= 900 && h >= w;
      }
      if (portraitPhone) {
        document.documentElement.setAttribute("data-chrome-pin", "0");
        document.documentElement.setAttribute("data-clarity-pin-banner", "0");
      } else {
        document.documentElement.setAttribute("data-chrome-pin", "1");
        document.documentElement.setAttribute("data-clarity-pin-banner", "1");
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () {
    measure();
    setTimeout(measure, 200);
    setTimeout(measure, 800);
  });
  else {
    measure();
    setTimeout(measure, 200);
  }
  g.addEventListener("resize", function () { setTimeout(measure, 100); });
  g.addEventListener("orientationchange", function () { setTimeout(measure, 150); setTimeout(measure, 400); });
})(typeof window !== "undefined" ? window : this);

;(function(g){
  if (typeof g.clarityPathResetToSeeker !== "function") {
    g.clarityPathResetToSeeker = function () {
      try {
        localStorage.setItem("clarity_path_unlocked_max", "0");
        localStorage.setItem("clarity_committed_path", "seeker");
        localStorage.setItem("clarity_path_focus", "seeker");
        localStorage.removeItem("clarity_quiz_passed_v1");
        document.documentElement.setAttribute("data-clarity-path", "seeker");
        document.documentElement.setAttribute("data-path-i", "0");
        g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { path: "seeker", pathI: 0 } }));
      } catch (e) {}
      try {
        if (typeof g.claritySwitchGate === "function") g.claritySwitchGate("seeker");
      } catch (e2) {}
    };
  }
})(typeof window !== "undefined" ? window : this);
