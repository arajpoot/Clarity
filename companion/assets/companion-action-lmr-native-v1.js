/*! companion-action-lmr-native-v1.js · V5 Action-only · from live grab
 * NEVER paints outside Action. stripLeaks on other tabs.
 * Educational proxy only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  w.__CLARITY_LMR_NATIVE_V1__ = true;
  w.__CLARITY_LMR_NATIVE_V5__ = true;

  var state = {
    ar: "", en: "", surah: 1, ayah: 1, masterUrl: "",
    userBlob: null, userUrl: "", rec: null, chunks: [], t0: 0, masterDur: 0
  };

  function $(id) { return d.getElementById(id); }

  function activeTab() {
    try {
      var a = (d.body && d.body.getAttribute("data-active-tab")) || "";
      if (a) return String(a).toLowerCase();
    } catch (e) {}
    try {
      var btn = d.querySelector("[data-tab].active, .cs-tab.active, [data-cs-tab].active");
      if (btn) {
        return (btn.getAttribute("data-tab") || btn.getAttribute("data-cs-tab") || btn.id || "").toLowerCase();
      }
    } catch (e2) {}
    try {
      if ((w.location.hash || "").toLowerCase().indexOf("action") >= 0) return "action";
    } catch (e3) {}
    return "";
  }

  function isAction() {
    var t = activeTab();
    if (t === "action" || t.indexOf("action") >= 0) return true;
    if (!t && ($("tj-deep-studio") || $("tj-lmr-native-root") || $("tj-lmr"))) return true;
    return false;
  }

  function stripLeaks() {
    if (isAction()) return;
    d.querySelectorAll("#tj-lmr-native-bar, #tj-lmr-native-root").forEach(function (el) {
      try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
    });
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

  function host() {
    if (!isAction()) return null;
    return $("tj-lmr-native-root") || $("tj-lmr") || $("tj-lmr-panel") || $("tj-deep-studio");
  }

  function paintUI(h) {
    if (!h || !isAction()) return null;
    if ($("tj-lmr-native-bar")) return $("tj-lmr-native-bar");
    var bar = d.createElement("div");
    bar.id = "tj-lmr-native-bar";
    bar.innerHTML =
      '<div class="tj-lmr-native-grid">' +
      '<p class="td-src" style="margin:0 0 .35rem">LMR · Action only · educational proxy — not a qāriʾ grade · <a href="/craft/tajweed/">Craft atelier</a></p>' +
      '<div class="tj-lmr-native-row">' +
      '<label>Sūrah <input id="tj-lmr-n-surah" type="number" min="1" max="114" value="1"/></label>' +
      '<label>Āyah <input id="tj-lmr-n-ayah" type="number" min="1" value="1"/></label>' +
      '<button type="button" class="btn primary" id="tj-lmr-n-pull">Pull āyah</button></div>' +
      '<p id="tj-lmr-n-ar" class="tj-lmr-n-ar" dir="rtl" lang="ar"></p>' +
      '<p id="tj-lmr-n-en" class="tj-lmr-n-en"></p>' +
      '<div class="tj-lmr-native-row">' +
      '<button type="button" class="btn primary" id="tj-lmr-n-play">▶ Play master</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-rec">● Record</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-stop">Stop</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-playuser">Play take</button>' +
      '<button type="button" class="btn" id="tj-lmr-n-score">★ Score</button></div>' +
      '<audio id="tj-lmr-n-master" controls preload="none"></audio>' +
      '<audio id="tj-lmr-n-user" controls preload="none" hidden></audio>' +
      '<p id="tj-lmr-n-status" class="td-src">Ready · educational only — not a fatwa</p>' +
      '<p id="tj-lmr-n-scoreline" class="td-src"></p></div>';
    h.appendChild(bar);
    bind();
    return bar;
  }

  function bind() {
    function on(id, fn) {
      var el = $(id);
      if (el && !el.__n5) { el.__n5 = true; el.addEventListener("click", fn); }
    }
    on("tj-lmr-n-pull", pull);
    on("tj-lmr-n-play", playMaster);
    on("tj-lmr-n-rec", startRec);
    on("tj-lmr-n-stop", stopRec);
    on("tj-lmr-n-playuser", playUser);
    on("tj-lmr-n-score", score);
  }

  function pull() {
    if (!isAction()) return;
    var s = Math.max(1, Math.min(114, parseInt(($("tj-lmr-n-surah") || {}).value, 10) || 1));
    var a = Math.max(1, parseInt(($("tj-lmr-n-ayah") || {}).value, 10) || 1);
    state.surah = s; state.ayah = a;
    status("Loading " + s + ":" + a + "…");
    fetch("https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih")
      .then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
      .then(function (j) {
        var arr = (j && j.data) || [];
        if (!Array.isArray(arr)) arr = [arr];
        var ar = "", en = "", num = null;
        arr.forEach(function (item) {
          if (!item) return;
          var id = (item.edition && item.edition.identifier) || "";
          if (/uthmani|quran/i.test(id) && item.text) ar = item.text;
          if (/sahih|en\./i.test(id) && item.text) en = item.text;
          if (item.number) num = item.number;
        });
        if (!ar && arr[0]) ar = arr[0].text || "";
        if (!en && arr[1]) en = arr[1].text || "";
        state.ar = ar; state.en = en;
        state.masterUrl = everyAyahUrl(s, a);
        if ($("tj-lmr-n-ar")) $("tj-lmr-n-ar").textContent = ar;
        if ($("tj-lmr-n-en")) $("tj-lmr-n-en").textContent = en;
        var master = $("tj-lmr-n-master");
        if (master) {
          master.src = state.masterUrl;
          master.onloadedmetadata = function () { state.masterDur = master.duration || 0; };
          master.onerror = function () {
            if (num) {
              state.masterUrl = "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + num + ".mp3";
              master.src = state.masterUrl;
            }
          };
        }
        status("Ready " + s + ":" + a + " · Ḥuṣarī · educational only");
      })
      .catch(function () { status("Load failed — try /craft/tajweed/"); });
  }

  function playMaster() {
    if (!isAction()) return;
    var a = $("tj-lmr-n-master");
    if (!a || !a.src) { pull(); return; }
    try { a.play(); } catch (e) {}
  }

  function startRec() {
    if (!isAction()) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status("Mic unavailable"); return;
    }
    state.chunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      state.rec = new MediaRecorder(stream);
      state.t0 = Date.now();
      state.rec.ondataavailable = function (ev) {
        if (ev.data && ev.data.size) state.chunks.push(ev.data);
      };
      state.rec.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        state.userBlob = new Blob(state.chunks, { type: "audio/webm" });
        if (state.userUrl) URL.revokeObjectURL(state.userUrl);
        state.userUrl = URL.createObjectURL(state.userBlob);
        var u = $("tj-lmr-n-user");
        if (u) { u.hidden = false; u.src = state.userUrl; }
        status("Take saved on device · nothing uploaded");
      };
      state.rec.start();
      status("Recording…");
    }).catch(function () { status("Mic permission denied"); });
  }

  function stopRec() {
    try { if (state.rec && state.rec.state === "recording") state.rec.stop(); } catch (e) {}
  }

  function playUser() {
    var u = $("tj-lmr-n-user");
    if (!u || !u.src) return;
    try { u.play(); } catch (e) {}
  }

  function score() {
    if (!isAction()) return;
    var user = $("tj-lmr-n-user");
    if (!user || !user.src) { status("Record a take first"); return; }
    var master = $("tj-lmr-n-master");
    var md = state.masterDur || (master && master.duration) || 0;
    var ud = (user && user.duration) || 0;
    if (!ud || !isFinite(ud)) ud = Math.max(0.5, (Date.now() - state.t0) / 1000);
    var pct = md > 0 ? Math.round((Math.min(ud, md) / Math.max(ud, md)) * 100) : 50;
    var note = "Educational proxy ~" + pct + "% length match · not a qāriʾ grade · learn with a teacher";
    if ($("tj-lmr-n-scoreline")) $("tj-lmr-n-scoreline").textContent = note;
    status(note);
  }

  function boot() {
    stripLeaks();
    if (!isAction()) return;
    var h = host();
    if (!h) return;
    paintUI(h);
    if (!state.ar) setTimeout(function () { if (isAction()) pull(); }, 200);
  }

  function onMounted(ev) {
    try {
      var tab = (ev && ev.detail && ev.detail.tab) || "";
      if (tab) { try { d.body.setAttribute("data-active-tab", tab); } catch (e) {} }
      if (String(tab).toLowerCase() !== "action") { stripLeaks(); return; }
    } catch (e2) {}
    setTimeout(boot, 40);
    setTimeout(boot, 400);
  }

  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);
  function early() { stripLeaks(); if (isAction()) boot(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", early);
  else early();
  setTimeout(stripLeaks, 500);
  setTimeout(stripLeaks, 1500);
})(window, document);
