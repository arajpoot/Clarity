/*! companion-action-lmr-native-v1.js · N2 align
 * One clean Action LMR card · no stacked legacy chrome
 * Pull · Play Ḥuṣarī · Record · Score · fixes mount into #tj-lmr-native-root
 * Educational only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  /* allow reinstall over older native */
  w.__CLARITY_LMR_NATIVE_V1__ = true;
  w.__CLARITY_LMR_NATIVE_V2__ = true;

  var state = {
    ar: "",
    en: "",
    surah: 1,
    ayah: 1,
    masterUrl: "",
    userBlob: null,
    userUrl: "",
    rec: null,
    chunks: [],
    t0: 0,
    masterDur: 0
  };

  function $(id) {
    return d.getElementById(id);
  }

  function status(msg) {
    var el = $("tj-lmr-n-status");
    if (el) el.textContent = msg || "";
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function killDupes() {
    var dup = $("action-tj-lmr-panel");
    if (dup && dup.parentNode) dup.parentNode.removeChild(dup);
    /* hide any leftover native bars from v1 stacked on old chrome */
    d.querySelectorAll("#tj-lmr-native-bar").forEach(function (el, idx) {
      if (idx > 0 && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function host() {
    return (
      $("tj-lmr-native-root") ||
      $("tj-lmr") ||
      $("tj-lmr-panel") ||
      $("tj-deep-studio")
    );
  }

  function paintUI(h) {
    if (!h) return null;
    killDupes();
    var bar = $("tj-lmr-native-bar");
    if (bar) return bar;
    bar = d.createElement("div");
    bar.id = "tj-lmr-native-bar";
    bar.innerHTML =
      '<div class="tj-lmr-native-grid">' +
      '<div class="tj-lmr-native-row">' +
      '<label>Sūrah <input id="tj-lmr-n-surah" type="number" min="1" max="114" value="1"/></label>' +
      '<label>Āyah <input id="tj-lmr-n-ayah" type="number" min="1" value="1"/></label>' +
      '<button type="button" class="btn primary" id="tj-lmr-n-pull">Pull āyah</button>' +
      "</div>" +
      '<p id="tj-lmr-n-ar" class="tj-lmr-n-ar" dir="rtl" lang="ar"></p>' +
      '<p id="tj-lmr-n-en" class="tj-lmr-n-en"></p>' +
      '<div class="tj-lmr-native-row">' +
      '<button type="button" class="btn primary" id="tj-lmr-n-play">▶ Play master</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-rec">● Record</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-stop">Stop</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-playuser">Play take</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-score">★ Score</button>' +
      "</div>" +
      '<audio id="tj-lmr-n-master" controls preload="none"></audio>' +
      '<audio id="tj-lmr-n-user" controls preload="none" hidden></audio>' +
      '<p id="tj-lmr-n-status" class="td-src">Ready · educational only — not a fatwa</p>' +
      '<p id="tj-lmr-n-scoreline" class="td-src"></p>' +
      "</div>";
    h.appendChild(bar);
    bind();
    return bar;
  }

  function bind() {
    function on(id, fn) {
      var el = $(id);
      if (el && !el.__n2) {
        el.__n2 = true;
        el.addEventListener("click", fn);
      }
    }
    on("tj-lmr-n-pull", pull);
    on("tj-lmr-n-play", playMaster);
    on("tj-lmr-n-rec", startRec);
    on("tj-lmr-n-stop", stopRec);
    on("tj-lmr-n-playuser", playUser);
    on("tj-lmr-n-score", score);
  }

  function pull() {
    var s = Math.max(1, Math.min(114, parseInt(($("tj-lmr-n-surah") || {}).value, 10) || 1));
    var a = Math.max(1, parseInt(($("tj-lmr-n-ayah") || {}).value, 10) || 1);
    state.surah = s;
    state.ayah = a;
    status("Loading " + s + ":" + a + "…");
    fetch(
      "https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih"
    )
      .then(function (r) {
        if (!r.ok) throw new Error("http");
        return r.json();
      })
      .then(function (j) {
        var arr = (j && j.data) || [];
        if (!Array.isArray(arr)) arr = [arr];
        var ar = "",
          en = "",
          num = null;
        arr.forEach(function (item) {
          if (!item) return;
          var id = (item.edition && item.edition.identifier) || "";
          if (/uthmani|quran/i.test(id) && item.text) ar = item.text;
          if (/sahih|en\./i.test(id) && item.text) en = item.text;
          if (item.number) num = item.number;
        });
        if (!ar && arr[0]) ar = arr[0].text || "";
        if (!en && arr[1]) en = arr[1].text || "";
        state.ar = ar;
        state.en = en;
        state.masterUrl = everyAyahUrl(s, a);
        if ($("tj-lmr-n-ar")) $("tj-lmr-n-ar").textContent = ar;
        if ($("tj-lmr-n-en")) $("tj-lmr-n-en").textContent = en;
        var master = $("tj-lmr-n-master");
        if (master) {
          master.src = state.masterUrl;
          master.onloadedmetadata = function () {
            state.masterDur = master.duration || 0;
          };
          master.onerror = function () {
            if (num) {
              state.masterUrl =
                "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + num + ".mp3";
              master.src = state.masterUrl;
            }
          };
        }
        status("Ready " + s + ":" + a + " · Ḥuṣarī · educational only");
      })
      .catch(function () {
        status("Load failed — try again or open /craft/tajweed/");
      });
  }

  function playMaster() {
    var a = $("tj-lmr-n-master");
    if (!a || !a.src) {
      pull();
      return;
    }
    try {
      a.play();
    } catch (e) {
      status("Tap Play again");
    }
  }

  function startRec() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status("Mic unavailable");
      return;
    }
    state.chunks = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        state.rec = new MediaRecorder(stream);
        state.t0 = Date.now();
        state.rec.ondataavailable = function (ev) {
          if (ev.data && ev.data.size) state.chunks.push(ev.data);
        };
        state.rec.onstop = function () {
          stream.getTracks().forEach(function (t) {
            t.stop();
          });
          state.userBlob = new Blob(state.chunks, { type: "audio/webm" });
          if (state.userUrl) URL.revokeObjectURL(state.userUrl);
          state.userUrl = URL.createObjectURL(state.userBlob);
          var u = $("tj-lmr-n-user");
          if (u) {
            u.hidden = false;
            u.src = state.userUrl;
          }
          status("Take saved on device · nothing uploaded");
        };
        state.rec.start();
        status("Recording…");
      })
      .catch(function () {
        status("Mic permission denied");
      });
  }

  function stopRec() {
    try {
      if (state.rec && state.rec.state === "recording") state.rec.stop();
    } catch (e) {}
  }

  function playUser() {
    var u = $("tj-lmr-n-user");
    if (!u || !u.src) {
      status("Record first");
      return;
    }
    try {
      u.play();
    } catch (e) {}
  }

  function score() {
    var master = $("tj-lmr-n-master");
    var user = $("tj-lmr-n-user");
    if (!user || !user.src) {
      status("Record a take first");
      return;
    }
    var md = state.masterDur || (master && master.duration) || 0;
    var ud = (user && user.duration) || 0;
    if (!ud || !isFinite(ud)) ud = Math.max(0.5, (Date.now() - state.t0) / 1000);
    var pct = md > 0 ? Math.round((Math.min(ud, md) / Math.max(ud, md)) * 100) : 50;
    var note =
      "Educational proxy ~" + pct + "% length match · not a qāriʾ grade · learn with a teacher";
    if ($("tj-lmr-n-scoreline")) $("tj-lmr-n-scoreline").textContent = note;
    status(note);
  }

  function boot() {
    killDupes();
    var h = host();
    if (!h) return;
    paintUI(h);
    if (!state.ar) setTimeout(pull, 200);
  }

  function onMounted(ev) {
    try {
      var tab = (ev && ev.detail && ev.detail.tab) || "";
      if (tab && String(tab).toLowerCase() !== "action") return;
    } catch (e) {}
    setTimeout(boot, 30);
    setTimeout(boot, 350);
  }

  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 900);
})(window, document);
