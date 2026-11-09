/*! craft-tajweed-score-pill-v1 · Score vs master · self-contained · educational only */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_TJ_SCORE_PILL_V1__) return;
  w.__CRAFT_TJ_SCORE_PILL_V1__ = true;

  function $(id) { return d.getElementById(id); }

  function setCard(val, note) {
    var v = $("tj-lmr-score-val");
    var n = $("tj-lmr-score-note");
    var box = $("tj-score-result");
    if (v) v.textContent = val;
    if (n) n.textContent = note || "";
    if (box) {
      box.hidden = false;
      box.innerHTML = "<strong>" + val + "</strong><br/><span class='tj-muted'>" + (note || "") + "</span>";
    }
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function decodeUrlOrBlob(src) {
    return new Promise(function (resolve, reject) {
      var ctx = new (w.AudioContext || w.webkitAudioContext)();
      function done(buf) {
        try { ctx.close(); } catch (e) {}
        resolve(buf);
      }
      if (src instanceof Blob) {
        var fr = new FileReader();
        fr.onload = function () {
          ctx.decodeAudioData(fr.result.slice(0), done, reject);
        };
        fr.onerror = reject;
        fr.readAsArrayBuffer(src);
        return;
      }
      fetch(src, { mode: "cors" })
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (ab) {
          ctx.decodeAudioData(ab, done, function () {
            /* fallback duration via audio element */
            reject(new Error("decode"));
          });
        })
        .catch(reject);
    });
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
    var ma = 0, mb = 0;
    for (var i = 0; i < n; i++) {
      ma += a[i];
      mb += b[i];
    }
    ma /= n;
    mb /= n;
    var num = 0, da = 0, db = 0;
    for (var k = 0; k < n; k++) {
      var xa = a[k] - ma;
      var xb = b[k] - mb;
      num += xa * xb;
      da += xa * xa;
      db += xb * xb;
    }
    var den = Math.sqrt(da * db) || 1;
    return num / den;
  }

  async function scoreSelfContained() {
    var status = $("tj-lmr-rec-status");
    var st = w.state || {};
    var blob = st.userBlob || w.__craftLastUserBlob || null;
    var audioUrl = st.audioUrl || "";
    if (!audioUrl && st.surah) {
      audioUrl = everyAyahUrl(st.surah, st.ayah || 1);
    }
    if (!audioUrl) {
      var el = $("tj-lmr-master-audio");
      if (el && el.src) audioUrl = el.src;
    }
    if (!blob) {
      setCard("—", "Need a recording first · Record, then Stop, then Score vs master");
      if (status) status.textContent = "Need your recording first";
      return;
    }
    if (!audioUrl) {
      setCard("—", "Play master once so audio URL is set, then score");
      return;
    }
    setCard("…", "Scoring on device…");
    if (status) status.textContent = "Scoring (on device)…";

    var userDur = 0, masterDur = 0, energyScore = 50, lenScore = 50;
    try {
      var userBuf = await decodeUrlOrBlob(blob);
      userDur = userBuf.duration || 0;
      var masterBuf = null;
      try {
        masterBuf = await decodeUrlOrBlob(audioUrl);
        masterDur = masterBuf.duration || 0;
      } catch (e1) {
        var el2 = $("tj-lmr-master-audio");
        if (el2 && isFinite(el2.duration) && el2.duration > 0) masterDur = el2.duration;
      }
      if (!masterDur) masterDur = userDur || 1;
      var lenRatio = Math.min(userDur, masterDur) / Math.max(userDur, masterDur);
      lenScore = Math.round(lenRatio * 100);
      if (masterBuf && userBuf) {
        try {
          var envM = downsampleEnvelope(masterBuf.getChannelData(0), 48);
          var envU = downsampleEnvelope(userBuf.getChannelData(0), 48);
          var c = corr(envM, envU);
          energyScore = Math.round(Math.max(0, Math.min(1, (c + 1) / 2)) * 100);
        } catch (e2) {
          energyScore = lenScore;
        }
      } else {
        energyScore = lenScore;
      }
    } catch (e3) {
      /* duration via object URL only */
      try {
        userDur = await new Promise(function (res) {
          var u = URL.createObjectURL(blob);
          var a = new Audio(u);
          a.addEventListener("loadedmetadata", function () {
            res(a.duration || 0);
            URL.revokeObjectURL(u);
          });
          a.addEventListener("error", function () {
            res(0);
            URL.revokeObjectURL(u);
          });
        });
        var el3 = $("tj-lmr-master-audio");
        masterDur = el3 && isFinite(el3.duration) ? el3.duration : userDur;
        var r = masterDur > 0 ? Math.min(userDur, masterDur) / Math.max(userDur, masterDur) : 0.5;
        lenScore = Math.round(r * 100);
        energyScore = lenScore;
      } catch (e4) {
        setCard("0/100", "Could not analyse — try again after Record + Stop");
        return;
      }
    }

    var score = Math.round(lenScore * 0.55 + energyScore * 0.45);
    score = Math.max(0, Math.min(100, score));
    var note =
      "Length " +
      lenScore +
      "% · energy envelope " +
      energyScore +
      "% · educational proxy only — not a qāriʾ grade";
    setCard(score + "/100", note);
    if (status) status.textContent = "Score " + score + "/100";

    /* journal + stats */
    try {
      var surah = (st.surah) || 1;
      var ayah = (st.ayah) || 1;
      var key = "clarity_tajweed_practice_journal_v1";
      var rows = JSON.parse(localStorage.getItem(key) || "[]") || [];
      rows.unshift({ t: Date.now(), surah: surah, ayah: ayah, score: score, source: "score-vs-master" });
      localStorage.setItem(key, JSON.stringify(rows.slice(0, 200)));
      if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
        w.ClarityTajweedFlow.refreshScoreStats();
      }
      var CUR = "clarity_tajweed_curriculum_v2";
      var p = JSON.parse(localStorage.getItem(CUR) || "{}") || {};
      p.phases = p.phases || {};
      var id = p.levelId || "L0";
      p.phases[id] = p.phases[id] || { drills: 0, listens: 0, marks: 0, lastScore: 0, bestScore: 0 };
      p.phases[id].lastScore = score;
      p.phases[id].bestScore = Math.max(p.phases[id].bestScore || 0, score);
      p.phases[id].drills = (p.phases[id].drills || 0) + 1;
      localStorage.setItem(CUR, JSON.stringify(p));
      if (w.ClarityTajweedCurriculum && w.ClarityTajweedCurriculum.refreshAnalysis) {
        w.ClarityTajweedCurriculum.refreshAnalysis();
      }
    } catch (e5) {}
  }

  function tryNativeThenSelf() {
    /* Prefer original LMR scorer if wired */
    var nativeBtn = $("tj-lmr-score-btn");
    if (nativeBtn && w.state && w.state.userBlob) {
      try {
        nativeBtn.click();
        setTimeout(function () {
          var val = $("tj-lmr-score-val");
          if (val && val.textContent && val.textContent !== "—" && val.textContent.indexOf("…") < 0) {
            if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
              w.ClarityTajweedFlow.refreshScoreStats();
            }
            return;
          }
          scoreSelfContained();
        }, 800);
        return;
      } catch (e) {}
    }
    scoreSelfContained();
  }

  /** Keep last blob if LMR exposes it late */
  function watchBlob() {
    setInterval(function () {
      try {
        if (w.state && w.state.userBlob) w.__craftLastUserBlob = w.state.userBlob;
      } catch (e) {}
    }, 1000);
  }

  function wire() {
    var b1 = $("tj-score-vs-master-btn");
    var b2 = $("tj-lmr-score-btn");
    if (b1 && !b1.__pill) {
      b1.__pill = true;
      b1.addEventListener("click", function (e) {
        e.preventDefault();
        tryNativeThenSelf();
      });
    }
    if (b2 && !b2.__pill) {
      b2.__pill = true;
      b2.addEventListener("click", function (e) {
        /* let native handler run; also self after */
        setTimeout(function () {
          var val = $("tj-lmr-score-val");
          if (!val || !val.textContent || val.textContent === "—" || /need/i.test(val.textContent)) {
            scoreSelfContained();
          } else if (w.ClarityTajweedFlow && w.ClarityTajweedFlow.refreshScoreStats) {
            w.ClarityTajweedFlow.refreshScoreStats();
          }
        }, 900);
      });
    }
    /* also inject pill into LMR host if buttons missing */
    var host = $("tj-lmr-host");
    if (host && !host.querySelector("#tj-score-vs-master-btn-inline")) {
      var row = d.createElement("div");
      row.className = "tj-toolbar-row";
      row.style.margin = "0.5rem 0";
      row.innerHTML =
        '<button type="button" class="btn primary" id="tj-score-vs-master-btn-inline">★ Score vs master</button>';
      host.appendChild(row);
      var bi = $("tj-score-vs-master-btn-inline");
      if (bi) bi.addEventListener("click", function (e) {
        e.preventDefault();
        tryNativeThenSelf();
      });
    }
    watchBlob();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
  w.addEventListener("load", function () { setTimeout(wire, 600); setTimeout(wire, 2000); });
  setTimeout(wire, 1000);

  w.ClarityTajweedScorePill = { score: scoreSelfContained };
})(window, document);
