/*! craft-tajweed-score-pill-v3 · bars + journal refresh · hide legacy log · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_SCORE_PILL_V3__) return;
  w.__CRAFT_TJ_SCORE_PILL_V3__ = true;

  var JOURNAL_KEY = "clarity_tajweed_practice_journal_v1";

  function $(id) { return d.getElementById(id); }

  function patchMediaRecorder() {
    if (w.__craftMRPatched || !w.MediaRecorder) return;
    w.__craftMRPatched = true;
    var proto = w.MediaRecorder.prototype;
    var origStart = proto.start;
    proto.start = function () {
      var self = this;
      self.__craftChunks = [];
      if (!self.__craftDataHook) {
        self.__craftDataHook = true;
        self.addEventListener("dataavailable", function (ev) {
          if (ev.data && ev.data.size) self.__craftChunks.push(ev.data);
        });
        self.addEventListener("stop", function () {
          try {
            var blob = new Blob(self.__craftChunks || [], { type: self.mimeType || "audio/webm" });
            if (blob.size > 0) {
              w.__craftLastUserBlob = blob;
              if (!w.state) w.state = {};
              w.state.userBlob = blob;
              try {
                if (w.state.userBlobUrl) URL.revokeObjectURL(w.state.userBlobUrl);
              } catch (e0) {}
              w.state.userBlobUrl = URL.createObjectURL(blob);
              var ua = $("tj-lmr-user-audio");
              if (ua) ua.src = w.state.userBlobUrl;
              var st = $("tj-lmr-rec-status");
              if (st) st.textContent = "Recording saved · play or Score vs master";
            }
          } catch (e1) {}
        });
      }
      return origStart.apply(this, arguments);
    };
  }

  function injectCss() {
    if ($("tj-align-css-v3")) return;
    var s = d.createElement("style");
    s.id = "tj-align-css-v3";
    s.textContent = [
      ".tj-alignment-card{margin:.75rem 0;padding:1rem;border-radius:16px;border:1px solid rgba(212,180,90,.35);background:rgba(15,76,58,.28)}",
      ".tj-align-head{font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;opacity:.85}",
      ".tj-align-score{font-size:2rem;font-weight:700;color:#e8d5a3;margin:.25rem 0 .6rem}",
      ".tj-align-row{display:grid;grid-template-columns:7.5rem 1fr 2.6rem;gap:.4rem;align-items:center;margin:.4rem 0;font-size:.8rem}",
      ".tj-align-track{height:10px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden}",
      ".tj-align-fill{display:block;height:100%;width:0%;min-width:0;border-radius:999px;background:linear-gradient(90deg,#1e7d5e,#7dcea0);transition:width .4s ease}",
      ".tj-align-pct{text-align:right;opacity:.9;font-variant-numeric:tabular-nums}",
      ".tj-align-note{font-size:.78rem;opacity:.9;margin:.5rem 0}",
      "/* hide legacy shell session log + duplicate score stubs */",
      "#tj-lmr-log-list,.tj-lmr-session-log,#practice-log-list{display:none!important}",
      "#tj-score-vs-master-btn-inline,#tj-score-vs-master-btn{display:none!important}",
      "#tj-lmr-score-card:not(.tj-alignment-card){display:none!important}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function ensureAlignmentCard() {
    var host = $("tj-alignment-card");
    if (host && host.querySelector(".tj-align-fill")) return host;
    if (host) host.remove();
    var anchor = $("tj-score-stats") || $("tj-lmr-host") || $("section-lmr");
    if (!anchor) return null;
    host = d.createElement("div");
    host.id = "tj-alignment-card";
    host.className = "tj-alignment-card";
    host.innerHTML =
      '<div class="tj-align-head">Practice alignment</div>' +
      '<div class="tj-align-score" id="tj-align-score-num">—</div>' +
      '<div class="tj-align-bars">' +
      '<div class="tj-align-row"><span>Timing</span><div class="tj-align-track"><span class="tj-align-fill" id="tj-bar-time"></span></div><span class="tj-align-pct" id="tj-pct-time">—</span></div>' +
      '<div class="tj-align-row"><span>Energy shape</span><div class="tj-align-track"><span class="tj-align-fill" id="tj-bar-energy"></span></div><span class="tj-align-pct" id="tj-pct-energy">—</span></div>' +
      '<div class="tj-align-row"><span>Length match</span><div class="tj-align-track"><span class="tj-align-fill" id="tj-bar-len"></span></div><span class="tj-align-pct" id="tj-pct-len">—</span></div>' +
      "</div>" +
      '<p class="tj-align-note" id="tj-align-note">Record, Stop, then Score vs master. Educational proxy — not a qāriʾ grade.</p>' +
      '<button type="button" class="btn primary" id="tj-score-vs-master-main">★ Score vs master</button>';
    anchor.insertBefore(host, anchor.firstChild);
    return host;
  }

  function setBars(timeScore, energyScore, lenScore, overall, note) {
    ensureAlignmentCard();
    function clamp(n) {
      n = Math.round(Number(n) || 0);
      return Math.max(0, Math.min(100, n));
    }
    timeScore = clamp(timeScore);
    energyScore = clamp(energyScore);
    lenScore = clamp(lenScore);
    overall = clamp(overall);

    var num = $("tj-align-score-num");
    if (num) num.textContent = overall ? overall + " / 100" : "—";

    var fills = [
      ["tj-bar-time", "tj-pct-time", timeScore],
      ["tj-bar-energy", "tj-pct-energy", energyScore],
      ["tj-bar-len", "tj-pct-len", lenScore]
    ];
    fills.forEach(function (row) {
      var bar = $(row[0]);
      var pct = $(row[1]);
      var v = row[2];
      if (bar) {
        bar.style.width = v + "%";
        bar.setAttribute("data-w", String(v));
      }
      if (pct) pct.textContent = v + "%";
    });

    var n = $("tj-align-note");
    if (n) n.textContent = note || "";

    var box = $("tj-score-result");
    if (box) {
      box.hidden = false;
      box.innerHTML =
        "<strong>Score " +
        overall +
        "/100</strong>" +
        (note ? "<br/><span class='tj-muted'>" + note + "</span>" : "");
    }
  }

  function renderJournal() {
    var host = $("tj-practice-journal");
    if (!host) return;
    var rows = [];
    try {
      rows = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || [];
    } catch (e) {}
    if (!rows.length) {
      host.innerHTML = '<p class="tj-muted">No real practice sessions logged yet.</p>';
      return;
    }
    host.innerHTML =
      '<table class="tj-journal-table"><thead><tr><th>When</th><th>Ref</th><th>Score</th></tr></thead><tbody>' +
      rows.slice(0, 40).map(function (r) {
        return (
          "<tr><td>" +
          new Date(r.t).toLocaleString() +
          "</td><td>" +
          (r.surah || "?") +
          ":" +
          (r.ayah || "?") +
          "</td><td><strong>" +
          (r.score || 0) +
          "</strong></td></tr>"
        );
      }).join("") +
      "</tbody></table>";
  }

  function downsampleEnvelope(ch, buckets) {
    var len = ch.length;
    var out = new Float32Array(buckets);
    var step = Math.floor(len / buckets) || 1;
    for (var i = 0; i < buckets; i++) {
      var start = i * step;
      var end = Math.min(len, start + step);
      var sum = 0;
      for (var j = start; j < end; j++) sum += Math.abs(ch[j]);
      out[i] = sum / (end - start || 1);
    }
    return out;
  }

  function corr(a, b) {
    var n = Math.min(a.length, b.length);
    var ma = 0, mb = 0, i;
    for (i = 0; i < n; i++) {
      ma += a[i];
      mb += b[i];
    }
    ma /= n;
    mb /= n;
    var num = 0, da = 0, db = 0;
    for (i = 0; i < n; i++) {
      var xa = a[i] - ma;
      var xb = b[i] - mb;
      num += xa * xb;
      da += xa * xa;
      db += xb * xb;
    }
    return num / (Math.sqrt(da * db) || 1);
  }

  function decodeSrc(src) {
    return new Promise(function (resolve, reject) {
      var Ctx = w.AudioContext || w.webkitAudioContext;
      if (!Ctx) return reject(new Error("no ac"));
      var ctx = new Ctx();
      function finish(buf) {
        try { ctx.close(); } catch (e) {}
        resolve(buf);
      }
      if (src instanceof Blob) {
        var fr = new FileReader();
        fr.onload = function () {
          ctx.decodeAudioData(fr.result.slice(0), finish, reject);
        };
        fr.onerror = reject;
        fr.readAsArrayBuffer(src);
        return;
      }
      fetch(src, { mode: "cors" })
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (ab) {
          ctx.decodeAudioData(ab, finish, reject);
        })
        .catch(reject);
    });
  }

  function masterUrl() {
    try {
      if (w.state && w.state.audioUrl) return w.state.audioUrl;
      if (w.state && w.state.surah) {
        var s = String(w.state.surah).padStart(3, "0");
        var a = String(w.state.ayah || 1).padStart(3, "0");
        return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
      }
    } catch (e) {}
    var el = $("tj-lmr-master-audio");
    return el && el.currentSrc ? el.currentSrc : el && el.src ? el.src : "";
  }

  async function scoreVsMaster() {
    patchMediaRecorder();
    ensureAlignmentCard();
    var blob = (w.state && w.state.userBlob) || w.__craftLastUserBlob;
    var url = masterUrl();
    if (!blob) {
      setBars(0, 0, 0, 0, "Need your recording first · Record, then Stop, then Score vs master");
      return;
    }
    if (!url) {
      setBars(0, 0, 0, 0, "Play master once so the reference audio is set");
      return;
    }
    setBars(0, 0, 0, 0, "Scoring on device…");

    var lenScore = 50, energyScore = 50, timeScore = 50;
    try {
      var userBuf = await decodeSrc(blob);
      var masterBuf = null;
      try {
        masterBuf = await decodeSrc(url);
      } catch (e1) {
        masterBuf = null;
      }
      var userDur = userBuf.duration || 0;
      var masterDur = masterBuf ? masterBuf.duration : 0;
      if (!masterDur) {
        var el = $("tj-lmr-master-audio");
        if (el && isFinite(el.duration) && el.duration > 0) masterDur = el.duration;
      }
      if (!masterDur) masterDur = userDur || 1;
      var lenRatio = Math.min(userDur, masterDur) / Math.max(userDur, masterDur);
      lenScore = Math.round(lenRatio * 100);
      timeScore = lenScore;
      if (masterBuf) {
        var envM = downsampleEnvelope(masterBuf.getChannelData(0), 48);
        var envU = downsampleEnvelope(userBuf.getChannelData(0), 48);
        var c = corr(envM, envU);
        energyScore = Math.round(((c + 1) / 2) * 100);
        var peakM = 0, peakU = 0, iM = 0, iU = 0, i;
        for (i = 0; i < 48; i++) {
          if (envM[i] > peakM) {
            peakM = envM[i];
            iM = i;
          }
          if (envU[i] > peakU) {
            peakU = envU[i];
            iU = i;
          }
        }
        var peakDiff = Math.abs(iM - iU) / 48;
        timeScore = Math.round((1 - peakDiff) * lenRatio * 100);
      } else {
        energyScore = lenScore;
      }
    } catch (e2) {
      setBars(0, 0, 0, 0, "Could not decode audio — try Record again");
      return;
    }

    var overall = Math.round(0.4 * lenScore + 0.35 * energyScore + 0.25 * timeScore);
    overall = Math.max(0, Math.min(100, overall));
    var tip =
      overall >= 75
        ? "Strong timing/energy match."
        : overall >= 50
        ? "Decent match. Replay master, then one focused retry."
        : "Replay master slowly, then record a clearer take.";
    setBars(
      timeScore,
      energyScore,
      lenScore,
      overall,
      tip + " Educational proxy only — not a qāriʾ grade."
    );

    var surah = (w.state && w.state.surah) || 1;
    var ayah = (w.state && w.state.ayah) || 1;
    try {
      var rows = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]") || [];
      rows.unshift({
        t: Date.now(),
        surah: surah,
        ayah: ayah,
        score: overall,
        source: "alignment",
        timing: timeScore,
        energy: energyScore,
        length: lenScore
      });
      localStorage.setItem(JOURNAL_KEY, JSON.stringify(rows.slice(0, 200)));
    } catch (e3) {}

    renderJournal();
    if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
      try { w.ClarityTajweedFlow.refreshScoreStats(); } catch (e4) {}
    }
    try {
      var CUR = "clarity_tajweed_curriculum_v2";
      var p = JSON.parse(localStorage.getItem(CUR) || "{}") || {};
      p.phases = p.phases || {};
      var id = p.levelId || "L0";
      p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0 };
      p.phases[id].lastScore = overall;
      p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, overall);
      p.phases[id].drills = (p.phases[id].drills || 0) + 1;
      localStorage.setItem(CUR, JSON.stringify(p));
      if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
        w.ClarityTajweedCurriculum.refreshAnalysis();
      }
    } catch (e5) {}

    var st = $("tj-lmr-rec-status");
    if (st) st.textContent = "Scored · " + overall + "/100 · logged on this device";
  }

  function hideLegacyLogs() {
    ["practice-log-list", "tj-lmr-log-list"].forEach(function (id) {
      var el = $(id);
      if (el) {
        el.innerHTML = "";
        el.style.display = "none";
      }
    });
    d.querySelectorAll(".tj-lmr-session-log, [class*='session-log']").forEach(function (el) {
      if (el.closest("#tj-practice-journal")) return;
      if (el.id === "tj-practice-journal") return;
      /* hide shell session log blocks inside LMR only */
      if (el.closest("#tj-lmr-host") || el.closest("#tj-lmr")) {
        el.style.display = "none";
      }
    });
  }

  function wire() {
    injectCss();
    patchMediaRecorder();
    ensureAlignmentCard();
    hideLegacyLogs();
    renderJournal();
    var main = $("tj-score-vs-master-main");
    if (main && !main.__v3) {
      main.__v3 = true;
      main.addEventListener("click", function (e) {
        e.preventDefault();
        scoreVsMaster();
      });
    }
    ["tj-lmr-score-btn", "tj-score-vs-master-btn"].forEach(function (id) {
      var b = $(id);
      if (b && !b.__v3) {
        b.__v3 = true;
        b.addEventListener("click", function (e) {
          e.preventDefault();
          scoreVsMaster();
        });
      }
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", function () {
    setTimeout(wire, 400);
    setTimeout(wire, 1600);
  });
  setTimeout(wire, 800);

  w.ClarityTajweedScorePill = { score: scoreVsMaster, renderJournal: renderJournal };
})(window, document);
