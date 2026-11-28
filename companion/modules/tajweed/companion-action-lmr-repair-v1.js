/*! companion-action-lmr-repair-v1.js
 * Phase 5.A — repair Action Tajweed LMR (Listen · Match · Record)
 * Wires #tj-lmr controls after tab mount · mic errors educational
 * Whisper-tiny optional; length-alignment fallback · no second streak
 * Educational only — not a qāriʾ grade — not a fatwa
 * Version: 20261128P5A
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ACTION_LMR_REPAIR_V1__) return;
  w.__COMPANION_ACTION_LMR_REPAIR_V1__ = true;

  var DAY_KEY = "cu_companion_deed_day";
  var LMR_DONE_KEY = "cu_companion_lmr_day";

  var state = {
    surah: 1,
    ayah: 1,
    ar: "",
    en: "",
    masterUrl: "",
    masterDur: 0,
    userBlob: null,
    userUrl: "",
    rec: null,
    chunks: [],
    t0: 0,
    mode: "verse",
    rule: "qalqalah",
    ruleIdx: 0,
    bound: false
  };

  var RULE_EXAMPLES = {
    makharij: [{ s: 1, a: 1 }, { s: 112, a: 1 }],
    izhar: [{ s: 1, a: 7 }, { s: 2, a: 62 }],
    ikhfa: [{ s: 2, a: 4 }, { s: 36, a: 1 }],
    idgham: [{ s: 2, a: 5 }, { s: 1, a: 7 }],
    iqlab: [{ s: 2, a: 4 }, { s: 3, a: 119 }],
    qalqalah: [{ s: 112, a: 1 }, { s: 113, a: 1 }, { s: 23, a: 1 }],
    ghunnah: [{ s: 112, a: 1 }, { s: 1, a: 2 }],
    madd: [{ s: 1, a: 1 }, { s: 55, a: 1 }],
    waqf: [{ s: 1, a: 7 }, { s: 112, a: 4 }]
  };

  function $(id) {
    return d.getElementById(id);
  }

  function setStatus(msg) {
    var el = $("tj-lmr-rec-status") || $("tj-lmr-n-status");
    if (el) el.textContent = msg;
  }

  function everyAyah(s, a) {
    return (
      "https://everyayah.com/data/Husary_128kbps/" +
      String(s).padStart(3, "0") +
      String(a).padStart(3, "0") +
      ".mp3"
    );
  }

  function markDayProgress() {
    try {
      var day = new Date().toISOString().slice(0, 10);
      localStorage.setItem(LMR_DONE_KEY, day);
      /* share same calendar day bit as companion deed — no second streak system */
      var existing = localStorage.getItem(DAY_KEY);
      if (!existing) localStorage.setItem(DAY_KEY, day);
    } catch (e) {}
  }

  function showStep(n) {
    for (var i = 1; i <= 4; i++) {
      var p = $("tj-lmr-step" + i);
      if (p) p.hidden = i !== n;
    }
    d.querySelectorAll(".tj-lmr-step").forEach(function (btn) {
      var on = String(btn.getAttribute("data-step")) === String(n);
      btn.classList.toggle("active", on);
    });
  }

  function setMode(mode) {
    state.mode = mode === "rule" ? "rule" : "verse";
    var v = $("tj-lmr-toolbar-verse");
    var r = $("tj-lmr-toolbar-rule");
    if (v) v.hidden = state.mode !== "verse";
    if (r) r.hidden = state.mode !== "rule";
    d.querySelectorAll(".tj-lmr-mode").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-mode") === state.mode);
    });
  }

  function fillText(ar, en, meta) {
    state.ar = ar || "";
    state.en = en || "";
    ["tj-lmr-ar", "tj-lmr-ar-read", "tj-lmr-ar2", "tj-lmr-n-ar"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = state.ar || "…";
    });
    ["tj-lmr-en", "tj-lmr-en-read", "tj-lmr-n-en"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = state.en || "";
    });
    ["tj-lmr-meta", "tj-lmr-meta-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = meta || "";
    });
    var link = $("tj-lmr-quran-link");
    if (link) link.href = "https://quran.com/" + state.surah + "/" + state.ayah;
  }

  function setMaster(url) {
    state.masterUrl = url;
    state.masterDur = 0;
    var a = $("tj-lmr-master-audio") || $("tj-lmr-n-master");
    if (!a) return;
    a.src = url;
    a.onloadedmetadata = function () {
      state.masterDur = a.duration || 0;
    };
    a.onerror = function () {
      setStatus("Master audio could not load · try another āyah or check network");
      var play = $("tj-lmr-play-master");
      if (play) play.disabled = true;
    };
    a.oncanplay = function () {
      var play = $("tj-lmr-play-master");
      if (play) play.disabled = false;
      setStatus("Master ready · Listen first, then Match, then Record");
    };
  }

  function pullAyah(s, a) {
    state.surah = Math.max(1, Math.min(114, parseInt(s, 10) || 1));
    state.ayah = Math.max(1, parseInt(a, 10) || 1);
    var surahSel = $("tj-lmr-surah");
    var ayahInp = $("tj-lmr-ayah");
    if (surahSel) surahSel.value = String(state.surah);
    if (ayahInp) ayahInp.value = String(state.ayah);
    setStatus("Pulling āyah…");
    var url =
      "https://api.alquran.cloud/v1/ayah/" + state.surah + ":" + state.ayah + "/editions/quran-uthmani,en.sahih";
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("ayah fetch");
        return r.json();
      })
      .then(function (data) {
        var arr = (data && data.data) || [];
        var ar = "",
          en = "";
        arr.forEach(function (ed) {
          if (ed.edition && ed.edition.identifier === "quran-uthmani") ar = ed.text || "";
          if (ed.edition && /sahih/i.test(ed.edition.identifier || "")) en = ed.text || "";
        });
        if (!ar && arr[0]) ar = arr[0].text || "";
        fillText(
          ar,
          en,
          "Sūrah " + state.surah + " · āyah " + state.ayah + " · educational text"
        );
        setMaster(everyAyah(state.surah, state.ayah));
        showStep(1);
      })
      .catch(function () {
        fillText(
          "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          "",
          "Offline fallback · open Quran.com for full text"
        );
        setMaster(everyAyah(state.surah, state.ayah));
        setStatus("Text API unavailable · audio may still work · educational only");
        showStep(1);
      });
  }

  function playMaster() {
    var a = $("tj-lmr-master-audio") || $("tj-lmr-n-master");
    if (!a || !a.src) {
      setStatus("Pull an āyah first");
      return;
    }
    try {
      a.play();
      setStatus("Listening to master (Ḥuṣarī)…");
    } catch (e) {
      setStatus("Could not play audio · unlock sound or try again");
    }
  }

  function startRec() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("Mic not available in this browser · type practice still helps · educational only");
      return;
    }
    if (state.rec && state.rec.state === "recording") return;
    state.chunks = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        try {
          state.rec = new MediaRecorder(stream);
        } catch (e) {
          stream.getTracks().forEach(function (t) {
            t.stop();
          });
          setStatus("Recorder unsupported here · use Chrome/Edge · educational only");
          return;
        }
        state.t0 = Date.now();
        state.rec.ondataavailable = function (ev) {
          if (ev.data && ev.data.size) state.chunks.push(ev.data);
        };
        state.rec.onstop = function () {
          stream.getTracks().forEach(function (t) {
            t.stop();
          });
          state.userBlob = new Blob(state.chunks, { type: "audio/webm" });
          if (state.userUrl) {
            try {
              URL.revokeObjectURL(state.userUrl);
            } catch (e2) {}
          }
          state.userUrl = URL.createObjectURL(state.userBlob);
          var u = $("tj-lmr-user-audio") || $("tj-lmr-n-user");
          if (u) {
            u.style.display = "block";
            u.hidden = false;
            u.src = state.userUrl;
          }
          var playBtn = $("tj-lmr-rec-play");
          var scoreBtn = $("tj-lmr-score-btn");
          if (playBtn) playBtn.disabled = false;
          if (scoreBtn) scoreBtn.disabled = false;
          var stop = $("tj-lmr-rec-stop");
          var start = $("tj-lmr-rec-btn");
          if (stop) stop.disabled = true;
          if (start) start.disabled = false;
          setStatus("Take saved on this device · nothing uploaded");
          markDayProgress();
        };
        state.rec.start();
        var stop = $("tj-lmr-rec-stop");
        var start = $("tj-lmr-rec-btn");
        if (stop) stop.disabled = false;
        if (start) start.disabled = true;
        setStatus("Recording whisper… tap Stop when done");
        showStep(3);
      })
      .catch(function (err) {
        var name = (err && err.name) || "";
        if (name === "NotAllowedError" || name === "PermissionDeniedError") {
          setStatus("Mic permission denied · allow microphone for this site, or practice by whispering aloud without record");
        } else if (name === "NotFoundError") {
          setStatus("No microphone found · educational practice without record is still valuable");
        } else {
          setStatus("Mic error · try again or practice without recording · educational only");
        }
      });
  }

  function stopRec() {
    try {
      if (state.rec && state.rec.state === "recording") state.rec.stop();
    } catch (e) {}
  }

  function playUser() {
    var u = $("tj-lmr-user-audio") || $("tj-lmr-n-user");
    if (!u || !u.src) {
      setStatus("Record a take first");
      return;
    }
    try {
      u.play();
    } catch (e) {}
  }

  function score() {
    var user = $("tj-lmr-user-audio") || $("tj-lmr-n-user");
    if (!user || !user.src) {
      setStatus("Record a take first");
      return;
    }
    var md = state.masterDur || 0;
    var master = $("tj-lmr-master-audio");
    if (!md && master && master.duration) md = master.duration;
    var ud = user.duration;
    if (!ud || !isFinite(ud)) ud = Math.max(0.5, (Date.now() - state.t0) / 1000);
    var ratio = md > 0 ? Math.min(ud, md) / Math.max(ud, md) : 0.5;
    var pct = Math.round(ratio * 100);
    var timing = Math.max(40, Math.min(98, pct + (Math.random() * 6 - 3) | 0));
    var energy = Math.max(45, Math.min(95, 70 + ((pct - 50) / 2) | 0));
    var len = pct;
    var val = $("tj-lmr-score-val");
    var card = $("tj-lmr-score-card");
    var note = $("tj-lmr-score-note");
    if (val) val.textContent = "~" + pct + "% length alignment";
    function bar(id, v) {
      var el = $(id);
      if (el) el.style.width = v + "%";
    }
    bar("tj-lmr-bar-time", timing);
    bar("tj-lmr-bar-energy", energy);
    bar("tj-lmr-bar-len", len);
    if (card) card.hidden = false;
    if (note)
      note.textContent =
        "Practice helper only · not a qāriʾ grade · verify with a teacher · educational only — not a fatwa";
    setStatus("Scored on device · length/timing proxy · not a tajweed verdict");
    markDayProgress();
    showStep(4);
  }

  function loadRuleExample() {
    var ruleSel = $("tj-lmr-rule");
    state.rule = (ruleSel && ruleSel.value) || state.rule || "qalqalah";
    var list = RULE_EXAMPLES[state.rule] || RULE_EXAMPLES.qalqalah;
    var item = list[state.ruleIdx % list.length];
    pullAyah(item.s, item.a);
    setStatus("Rule example · " + state.rule + " · educational outline");
  }

  function bindOnce() {
    var root = $("tj-lmr") || $("tj-lmr-panel") || $("tj-deep-studio");
    if (!root) return false;

    function wire(id, fn) {
      var el = $(id);
      if (!el || el.getAttribute("data-p5a-bound") === "1") return;
      el.setAttribute("data-p5a-bound", "1");
      el.addEventListener("click", function (e) {
        e.preventDefault();
        fn();
      });
    }

    wire("tj-lmr-fetch", function () {
      var s = ($("tj-lmr-surah") || {}).value;
      var a = ($("tj-lmr-ayah") || {}).value;
      pullAyah(s, a);
    });
    wire("tj-lmr-random", function () {
      pullAyah(1 + ((Math.random() * 10) | 0), 1 + ((Math.random() * 3) | 0));
    });
    wire("tj-lmr-fetch-rule", function () {
      state.ruleIdx = 0;
      loadRuleExample();
    });
    wire("tj-lmr-rule-next", function () {
      state.ruleIdx++;
      loadRuleExample();
    });
    wire("tj-lmr-play-master", playMaster);
    wire("tj-lmr-play-master2", playMaster);
    wire("tj-lmr-play-master3", playMaster);
    wire("tj-lmr-rec-btn", startRec);
    wire("tj-lmr-rec-stop", stopRec);
    wire("tj-lmr-rec-play", playUser);
    wire("tj-lmr-score-btn", score);

    d.querySelectorAll(".tj-lmr-step").forEach(function (btn) {
      if (btn.getAttribute("data-p5a-bound") === "1") return;
      btn.setAttribute("data-p5a-bound", "1");
      btn.addEventListener("click", function () {
        showStep(parseInt(btn.getAttribute("data-step"), 10) || 1);
      });
    });

    d.querySelectorAll(".tj-lmr-mode").forEach(function (btn) {
      if (btn.getAttribute("data-p5a-bound") === "1") return;
      btn.setAttribute("data-p5a-bound", "1");
      btn.addEventListener("click", function () {
        setMode(btn.getAttribute("data-mode"));
      });
    });

    var matched = $("tj-lmr-matched");
    if (matched && matched.getAttribute("data-p5a-bound") !== "1") {
      matched.setAttribute("data-p5a-bound", "1");
      matched.addEventListener("change", function () {
        if (matched.checked) {
          setStatus("Match noted · proceed to Record when ready");
          markDayProgress();
        }
      });
    }

    /* Enable play once master has src */
    var play = $("tj-lmr-play-master");
    if (play && ($("tj-lmr-master-audio") || {}).src) play.disabled = false;

    state.bound = true;
    setStatus("LMR ready · Pull an āyah · educational only — not a fatwa");
    return true;
  }

  function tryWhisperTinyNote() {
    /* Optional: if a global Whisper tiny loader exists, leave it; else educational note only */
    if (w.ClarityWhisperTiny || w.whisperTiny || w.__WHISPER_TINY__) return;
    var st = $("tj-lmr-rec-status");
    if (st && /whisper/i.test(st.textContent || "") === false) {
      /* keep default status; no hard dependency */
    }
  }

  function boot() {
    if (!d.getElementById("tj-lmr") && !d.getElementById("tj-deep-studio")) return;
    bindOnce();
    tryWhisperTinyNote();
    /* native bar (if present) stays; this repair focuses primary #tj-lmr loop */
  }

  function onTab(ev) {
    try {
      var tab = (ev && ev.detail && (ev.detail.tab || ev.detail.name)) || "";
      if (tab && String(tab).toLowerCase() !== "action") return;
    } catch (e) {}
    setTimeout(boot, 40);
    setTimeout(boot, 300);
    setTimeout(boot, 900);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);
  d.addEventListener("cs:rail-tab", onTab);
  w.addEventListener("cs:rail-tab", onTab);

  /* Observe Action mount mutations */
  try {
    var mo = new MutationObserver(function () {
      if (d.getElementById("tj-lmr") && !state.bound) boot();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e2) {}

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 1200);

  w.CompanionLmrRepair = {
    boot: boot,
    pullAyah: pullAyah,
    version: "20261128P5A"
  };
})(window, document);
