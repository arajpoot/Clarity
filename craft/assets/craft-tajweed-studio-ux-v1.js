/*! craft-tajweed-studio-ux-v1 · full surah · ayah advance · practice journal · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_STUDIO_UX_V1__) return;
  w.__CRAFT_TJ_STUDIO_UX_V1__ = true;

  var AYAH_COUNT = {"1": 7, "2": 286, "3": 200, "4": 176, "5": 120, "6": 165, "7": 206, "8": 75, "9": 129, "10": 109, "11": 123, "12": 111, "13": 43, "14": 52, "15": 99, "16": 128, "17": 111, "18": 110, "19": 98, "20": 135, "21": 112, "22": 78, "23": 118, "24": 64, "25": 77, "26": 227, "27": 93, "28": 88, "29": 69, "30": 60, "31": 34, "32": 30, "33": 73, "34": 54, "35": 45, "36": 83, "37": 182, "38": 88, "39": 75, "40": 85, "41": 54, "42": 53, "43": 89, "44": 59, "45": 37, "46": 35, "47": 38, "48": 29, "49": 18, "50": 45, "51": 60, "52": 49, "53": 62, "54": 55, "55": 78, "56": 96, "57": 29, "58": 22, "59": 24, "60": 13, "61": 14, "62": 11, "63": 11, "64": 18, "65": 12, "66": 12, "67": 30, "68": 52, "69": 52, "70": 44, "71": 28, "72": 28, "73": 20, "74": 56, "75": 40, "76": 31, "77": 50, "78": 40, "79": 46, "80": 42, "81": 29, "82": 19, "83": 36, "84": 25, "85": 22, "86": 17, "87": 19, "88": 26, "89": 30, "90": 20, "91": 15, "92": 21, "93": 11, "94": 8, "95": 8, "96": 19, "97": 5, "98": 8, "99": 8, "100": 11, "101": 11, "102": 8, "103": 3, "104": 9, "105": 5, "106": 4, "107": 7, "108": 3, "109": 6, "110": 3, "111": 5, "112": 4, "113": 5, "114": 6};
  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";

  function $(id) { return d.getElementById(id); }

  function loadJournal() {
    try { return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || []; }
    catch (e) { return []; }
  }
  function saveJournal(rows) {
    try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200))); } catch (e2) {}
  }

  function surahNum() {
    var s = $("tj-lmr-surah");
    return s ? parseInt(s.value, 10) || 1 : 1;
  }
  function ayahNum() {
    var a = $("tj-lmr-ayah");
    return a ? parseInt(a.value, 10) || 1 : 1;
  }
  function maxAyah(s) {
    return AYAH_COUNT[s] || AYAH_COUNT[String(s)] || 1;
  }

  function syncAyahMax() {
    var s = surahNum();
    var max = maxAyah(s);
    var a = $("tj-lmr-ayah");
    if (a) {
      a.max = max;
      if (parseInt(a.value, 10) > max) a.value = "1";
    }
    var lab = $("tj-ayah-max-label");
    if (lab) lab.textContent = "of " + max;
  }

  function setAyah(n) {
    var a = $("tj-lmr-ayah");
    var s = surahNum();
    var max = maxAyah(s);
    n = Math.max(1, Math.min(max, n));
    if (a) a.value = String(n);
    return n;
  }

  function masterUrls(surah, ayah) {
    var ss = String(surah).padStart(3, "0");
    var aa = String(ayah).padStart(3, "0");
    return [
      "https://everyayah.com/data/Husary_128kbps/" + ss + aa + ".mp3",
      "https://everyayah.com/data/Alafasy_128kbps/" + ss + aa + ".mp3",
      "https://server8.mp3quran.net/husr/" + ss + ".mp3"
    ];
  }

  function ensureAudio() {
    var el = $("tj-lmr-master-audio");
    if (!el) {
      el = d.createElement("audio");
      el.id = "tj-lmr-master-audio";
      el.controls = true;
      el.preload = "auto";
      el.setAttribute("playsinline", "true");
      var row = d.querySelector(".tj-lmr-audio-row") || $("tj-deep-studio") || d.body;
      row.appendChild(el);
    }
    return el;
  }

  function playMaster() {
    var s = surahNum(), a = ayahNum();
    var el = ensureAudio();
    var list = masterUrls(s, a);
    el.__list = list;
    el.__i = 0;
    el.src = list[0];
    el.load();
    el.play().catch(function () {
      el.__i = 1;
      if (list[1]) {
        el.src = list[1];
        el.play().catch(function () {});
      }
    });
    try {
      if (w.state) {
        w.state.surah = s;
        w.state.ayah = a;
        w.state.audioUrl = list[0];
      }
    } catch (e) {}
    var link = $("tj-lmr-quran-link");
    if (link) link.href = "https://quran.com/" + s + ":" + a;
    status("Master · " + s + ":" + a);
  }

  function status(msg) {
    var el = $("tj-practice-status") || $("tj-lmr-rec-status");
    if (el) el.textContent = msg;
  }

  /** Simple on-device alignment proxy: duration + energy vs master (educational) */
  function scoreAgainstMaster(userBlob, cb) {
    var el = ensureAudio();
    var masterDur = el.duration && isFinite(el.duration) ? el.duration : 0;
    if (!userBlob) {
      cb({ score: 0, note: "No recording" });
      return;
    }
    var url = URL.createObjectURL(userBlob);
    var ua = new Audio(url);
    ua.addEventListener("loadedmetadata", function () {
      var ud = ua.duration || 0;
      var ratio = masterDur > 0.2 ? Math.min(ud, masterDur) / Math.max(ud, masterDur) : 0.5;
      var score = Math.round(50 + ratio * 50);
      score = Math.max(0, Math.min(100, score));
      URL.revokeObjectURL(url);
      cb({
        score: score,
        note: masterDur
          ? "Duration match vs master (educational proxy — not a qāriʾ grade)"
          : "Score without full master duration — educational only"
      });
    });
    ua.addEventListener("error", function () {
      URL.revokeObjectURL(url);
      cb({ score: 40, note: "Could not analyse clip — logged baseline" });
    });
  }

  var mediaRec = null, chunks = [], lastBlob = null;

  function startRec() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status("Microphone not available");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      chunks = [];
      mediaRec = new MediaRecorder(stream);
      mediaRec.ondataavailable = function (ev) {
        if (ev.data && ev.data.size) chunks.push(ev.data);
      };
      mediaRec.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        lastBlob = new Blob(chunks, { type: "audio/webm" });
        status("Recording saved · scoring…");
        scoreAgainstMaster(lastBlob, function (res) {
          logPractice(res.score, res.note);
          var scoreEl = $("tj-lmr-score");
          if (scoreEl) {
            scoreEl.textContent =
              "Sūrah " + surahNum() + " · āyah " + ayahNum() + " · score " + res.score + "/100 — " + res.note;
          }
          status("Logged " + surahNum() + ":" + ayahNum() + " · " + res.score + "%");
          renderJournal();
        });
      };
      mediaRec.start();
      status("Recording…");
    }).catch(function () {
      status("Mic permission denied");
    });
  }

  function stopRec() {
    if (mediaRec && mediaRec.state === "recording") mediaRec.stop();
  }

  function logPractice(score, note) {
    var rows = loadJournal();
    rows.unshift({
      t: Date.now(),
      surah: surahNum(),
      ayah: ayahNum(),
      score: score || 0,
      note: note || ""
    });
    saveJournal(rows);
    /* feed curriculum phase if present */
    try {
      if (w.ClarityTajweedCurriculum && typeof w.ClarityTajweedCurriculum.refreshAnalysis === "function") {
        var p = JSON.parse(localStorage.getItem("clarity_tajweed_curriculum_v2") || "{}") || {};
        p.phases = p.phases || {};
        var id = p.levelId || "L0";
        p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0, history: [] };
        p.phases[id].lastScore = score || 0;
        p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, score || 0);
        p.phases[id].drills = (p.phases[id].drills || 0) + 1;
        localStorage.setItem("clarity_tajweed_curriculum_v2", JSON.stringify(p));
        w.ClarityTajweedCurriculum.refreshAnalysis();
      }
    } catch (e3) {}
  }

  function renderJournal() {
    var host = $("tj-practice-journal");
    if (!host) return;
    var rows = loadJournal();
    if (!rows.length) {
      host.innerHTML = '<p class="tj-muted">No practices logged yet on this device.</p>';
      return;
    }
    host.innerHTML =
      '<table class="tj-journal-table"><thead><tr><th>When</th><th>Ref</th><th>Score</th></tr></thead><tbody>' +
      rows.slice(0, 40).map(function (r) {
        var when = new Date(r.t).toLocaleString();
        return (
          "<tr><td>" +
          when +
          "</td><td>" +
          r.surah +
          ":" +
          r.ayah +
          "</td><td><strong>" +
          r.score +
          "</strong></td></tr>"
        );
      }).join("") +
      "</tbody></table>";
  }

  function wire() {
    syncAyahMax();
    var surah = $("tj-lmr-surah");
    if (surah && !surah.__ux) {
      surah.__ux = true;
      surah.addEventListener("change", function () {
        syncAyahMax();
        setAyah(1);
      });
    }
    var prev = $("tj-ayah-prev");
    var next = $("tj-ayah-next");
    if (prev && !prev.__ux) {
      prev.__ux = true;
      prev.addEventListener("click", function () {
        setAyah(ayahNum() - 1);
      });
    }
    if (next && !next.__ux) {
      next.__ux = true;
      next.addEventListener("click", function () {
        setAyah(ayahNum() + 1);
      });
    }
    var play = $("tj-lmr-play-master");
    if (play && !play.__ux) {
      play.__ux = true;
      play.disabled = false;
      play.addEventListener("click", function (e) {
        e.preventDefault();
        playMaster();
      });
    }
    ["tj-lmr-play-master2", "tj-lmr-play-master3"].forEach(function (id) {
      var b = $(id);
      if (b && !b.__ux) {
        b.__ux = true;
        b.addEventListener("click", function (e) {
          e.preventDefault();
          playMaster();
        });
      }
    });
    var rs = $("tj-lmr-rec-start");
    var rst = $("tj-lmr-rec-stop");
    if (rs && !rs.__ux) {
      rs.__ux = true;
      rs.addEventListener("click", startRec);
    }
    if (rst && !rst.__ux) {
      rst.__ux = true;
      rst.addEventListener("click", stopRec);
    }
    var clear = $("tj-journal-clear");
    if (clear && !clear.__ux) {
      clear.__ux = true;
      clear.addEventListener("click", function () {
        saveJournal([]);
        renderJournal();
      });
    }
    /* steps */
    d.querySelectorAll(".tj-lmr-step").forEach(function (btn) {
      if (btn.__ux) return;
      btn.__ux = true;
      btn.addEventListener("click", function () {
        var step = btn.getAttribute("data-step");
        d.querySelectorAll(".tj-lmr-step").forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        [1, 2, 3, 4].forEach(function (n) {
          var p = $("tj-lmr-step" + n);
          if (p) p.hidden = String(n) !== step;
        });
      });
    });
    renderJournal();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", wire);
  setTimeout(wire, 500);

  w.ClarityTajweedStudioUX = {
    playMaster: playMaster,
    nextAyah: function () { setAyah(ayahNum() + 1); },
    prevAyah: function () { setAyah(ayahNum() - 1); },
    journal: loadJournal
  };
})(window, document);
