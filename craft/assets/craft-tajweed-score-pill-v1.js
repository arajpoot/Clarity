/*! craft-tajweed-score-pill-v2 · Companion-parity alignment card · blob capture · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_SCORE_PILL_V2__) return;
  w.__CRAFT_TJ_SCORE_PILL_V2__ = true;

  function $(id) { return d.getElementById(id); }

  /** Capture every MediaRecorder stop → blob (fixes missing state.userBlob) */
  function patchMediaRecorder() {
    if (w.__craftMRPatched || !w.MediaRecorder) return;
    w.__craftMRPatched = true;
    var Orig = w.MediaRecorder;
    var proto = Orig.prototype;
    var origStart = proto.start;
    var origStop = proto.stop;
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
            var type = (self.mimeType || "audio/webm");
            var blob = new Blob(self.__craftChunks || [], { type: type });
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

  function ensureAlignmentCard() {
    var host = $("tj-alignment-card");
    if (host) return host;
    var anchor =
      $("tj-score-stats") ||
      $("tj-lmr-host") ||
      $("section-lmr") ||
      d.querySelector("#section-lmr");
    if (!anchor) return null;
    host = d.createElement("div");
    host.id = "tj-alignment-card";
    host.className = "tj-alignment-card";
    host.innerHTML =
      '<div class="tj-align-head">Practice alignment</div>' +
      '<div class="tj-align-score" id="tj-align-score-num">—</div>' +
      '<div class="tj-align-bars">' +
      '<div class="tj-align-row"><span>Timing</span><div class="tj-align-track"><i id="tj-bar-time"></i></div></div>' +
      '<div class="tj-align-row"><span>Energy shape</span><div class="tj-align-track"><i id="tj-bar-energy"></i></div></div>' +
      '<div class="tj-align-row"><span>Length match</span><div class="tj-align-track"><i id="tj-bar-len"></i></div></div>' +
      "</div>" +
      '<p class="tj-align-note" id="tj-align-note">Record, Stop, then Score vs master. Educational proxy — not a qāriʾ grade.</p>' +
      '<button type="button" class="btn primary" id="tj-score-vs-master-main">★ Score vs master</button>';
    anchor.insertBefore(host, anchor.firstChild);
    return host;
  }

  function injectCss() {
    if ($("tj-align-css")) return;
    var s = d.createElement("style");
    s.id = "tj-align-css";
    s.textContent = [
      ".tj-alignment-card{margin:.75rem 0;padding:1rem;border-radius:16px;border:1px solid rgba(212,180,90,.35);background:rgba(15,76,58,.28)}",
      ".tj-align-head{font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;opacity:.85;margin-bottom:.25rem}",
      ".tj-align-score{font-size:2rem;font-weight:700;color:#e8d5a3;margin:.2rem 0 .6rem}",
      ".tj-align-row{display:grid;grid-template-columns:7.5rem 1fr;gap:.5rem;align-items:center;margin:.35rem 0;font-size:.8rem}",
      ".tj-align-track{height:8px;border-radius:999px;background:rgba(0,0,0,.35);overflow:hidden}",
      ".tj-align-track i{display:block;height:100%;width:0;background:linear-gradient(90deg,#1e7d5e,#7dcea0);transition:width .35s ease}",
      ".tj-align-note{font-size:.78rem;opacity:.9;margin:.5rem 0}",
      "#tj-score-vs-master-btn-inline,#tj-score-vs-master-btn{display:none}" /* reduce duplicate pills */
    ].join("");
    (d.head || d.documentElement).appendChild(s);
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
    return el && el.src ? el.src : "";
  }

  function setBars(timeScore, energyScore, lenScore, overall, note) {
    ensureAlignmentCard();
    var num = $("tj-align-score-num");
    if (num) num.textContent = overall + " / 100";
    var bt = $("tj-bar-time");
    var be = $("tj-bar-energy");
    var bl = $("tj-bar-len");
    if (bt) bt.style.width = timeScore + "%";
    if (be) be.style.width = energyScore + "%";
    if (bl) bl.style.width = lenScore + "%";
    var n = $("tj-align-note");
    if (n) n.textContent = note || "";
    var val = $("tj-lmr-score-val");
    if (val) val.textContent = overall + "/100";
    var noteEl = $("tj-lmr-score-note");
    if (noteEl) noteEl.textContent = note || "";
    var te = $("tj-lmr-bar-time");
    var ee = $("tj-lmr-bar-energy");
    var le = $("tj-lmr-bar-len");
    if (te) te.textContent = timeScore + "%";
    if (ee) ee.textContent = energyScore + "%";
    if (le) le.textContent = lenScore + "%";
  }

  async function scoreVsMaster() {
    patchMediaRecorder();
    ensureAlignmentCard();
    var blob = null;
    try {
      blob = (w.state && w.state.userBlob) || w.__craftLastUserBlob;
    } catch (e) {
      blob = w.__craftLastUserBlob;
    }
    var url = masterUrl();
    if (!blob) {
      setBars(0, 0, 0, 0, "Need your recording first · Record, then Stop, then Score vs master");
      var st = $("tj-lmr-rec-status");
      if (st) st.textContent = "Need your recording first";
      return;
    }
    if (!url) {
      setBars(0, 0, 0, 0, "Play master once so the reference audio is set");
      return;
    }
    setBars(0, 0, 0, 0, "Scoring on device…");
    var st2 = $("tj-lmr-rec-status");
    if (st2) st2.textContent = "Scoring (on device)…";

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
        var peakM = 0, peakU = 0, iM = 0, iU = 0;
        for (var i = 0; i < 48; i++) {
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
        ? "Strong timing/energy match. Keep one focused rule per session."
        : overall >= 50
        ? "Decent timing/energy match. Replay master, then one focused retry."
        : "Replay master slowly, then record a shorter, clearer take.";
    setBars(
      timeScore,
      energyScore,
      lenScore,
      overall,
      tip + " Educational proxy only — not a qāriʾ grade."
    );
    if (st2) st2.textContent = "Scored · " + overall + "/100 · logged on this device";

    /* session log list */
    try {
      var surah = (w.state && w.state.surah) || 1;
      var ayah = (w.state && w.state.ayah) || 1;
      var list = $("practice-log-list") || $("tj-lmr-log-list");
      if (list) {
        var item = d.createElement("div");
        item.textContent =
          overall +
          "/100 · Qur’an " +
          surah +
          ":" +
          ayah +
          " · " +
          new Date().toLocaleString();
        list.insertBefore(item, list.firstChild);
      }
      var key = "clarity_tajweed_practice_journal_v1";
      var rows = JSON.parse(localStorage.getItem(key) || "[]") || [];
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
      localStorage.setItem(key, JSON.stringify(rows.slice(0, 200)));
      if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
        w.ClarityTajweedFlow.refreshScoreStats();
      }
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
    } catch (e3) {}
  }

  function wire() {
    injectCss();
    patchMediaRecorder();
    ensureAlignmentCard();
    var main = $("tj-score-vs-master-main");
    if (main && !main.__v2) {
      main.__v2 = true;
      main.addEventListener("click", function (e) {
        e.preventDefault();
        scoreVsMaster();
      });
    }
    ["tj-score-vs-master-btn", "tj-score-vs-master-btn-inline", "tj-lmr-score-btn"].forEach(function (id) {
      var b = $(id);
      if (b && !b.__v2) {
        b.__v2 = true;
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
    setTimeout(wire, 1500);
  });
  setTimeout(wire, 800);

  w.ClarityTajweedScorePill = { score: scoreVsMaster, patchMediaRecorder: patchMediaRecorder };
})(window, document);
