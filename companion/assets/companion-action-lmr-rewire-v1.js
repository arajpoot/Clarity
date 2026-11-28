/*! companion-action-lmr-rewire-v1.js
 * Ensures Deep Studio LMR works after shell tab mount (visibility + function)
 * Re-binds Pull / Play master / Record / Score if nx wire raced mount
 * Educational only — not a qāriʾ grade — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_LMR_REWIRE_V1__) return;
  w.__CLARITY_LMR_REWIRE_V1__ = true;

  function $(id) { return d.getElementById(id); }

  function isActionContext() {
    try {
      var t = (d.body && d.body.getAttribute("data-active-tab")) || "";
      if (String(t).toLowerCase() === "action") return true;
    } catch (e) {}
    return !!($("tj-lmr") || $("tj-lmr-panel") || $("tj-deep-studio"));
  }

  function show(el) {
    if (!el) return;
    el.hidden = false;
    el.style.display = "";
    el.removeAttribute("hidden");
  }

  function visibility() {
    var panel = $("tj-lmr-panel");
    if (panel && panel.tagName === "DETAILS") panel.open = true;
    /* show step1 by default so Play master is visible without extra taps */
    ["tj-lmr-step1", "tj-lmr-read-panel"].forEach(function (id) {
      show($(id));
    });
    /* do not force-hide other steps if nx manages them — but ensure step1 visible */
    var ar = $("tj-lmr-ar") || $("tj-lmr-ar-read");
    var en = $("tj-lmr-en") || $("tj-lmr-en-read");
    if (ar && !ar.textContent.trim()) {
      /* leave for pull */
    }
  }

  function everyAyahUrl(surah, ayah) {
    var s = String(surah).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_128kbps/" + s + a + ".mp3";
  }

  function surahAyah() {
    var s = parseInt(($("tj-lmr-surah") || {}).value, 10) || 1;
    var a = parseInt(($("tj-lmr-ayah") || {}).value, 10) || 1;
    return { s: s, a: a };
  }

  function setText(ar, en, ref) {
    ["tj-lmr-ar", "tj-lmr-ar-read", "tj-lmr-ar2"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = ar || "";
    });
    ["tj-lmr-en", "tj-lmr-en-read"].forEach(function (id) {
      var el = $(id);
      if (el) el.textContent = en || "";
    });
    var meta = $("tj-lmr-meta") || $("tj-lmr-meta-read");
    if (meta) meta.textContent = ref || "";
  }

  function setMaster(url) {
    var audio = $("tj-lmr-master-audio");
    if (audio && url) {
      audio.src = url;
      show(audio);
    }
    var play = $("tj-lmr-play-master");
    if (play) play.disabled = false;
    ["tj-lmr-play-master2", "tj-lmr-play-master3"].forEach(function (id) {
      var b = $(id);
      if (b) b.disabled = false;
    });
  }

  function pull() {
    if (!$("tj-lmr")) return;
    var sa = surahAyah();
    var ref = sa.s + ":" + sa.a;
    setText("…", "Loading…", ref);
    var meta = $("tj-lmr-meta");
    if (meta) meta.textContent = "Loading " + ref + "…";
    Promise.all([
      fetch("https://api.alquran.cloud/v1/ayah/" + ref + "/quran-uthmani").then(function (r) { return r.json(); }),
      fetch("https://api.alquran.cloud/v1/ayah/" + ref + "/en.sahih").then(function (r) { return r.json(); })
    ])
      .then(function (pair) {
        var arJ = pair[0], enJ = pair[1];
        var ar = (arJ && arJ.data && arJ.data.text) || "";
        var en = (enJ && enJ.data && enJ.data.text) || "";
        var num = arJ && arJ.data && arJ.data.number;
        setText(ar, en, "Qurʾān " + ref + " · educational only");
        var url = everyAyahUrl(sa.s, sa.a);
        setMaster(url);
        var audio = $("tj-lmr-master-audio");
        if (audio) {
          audio.onerror = function () {
            if (num) setMaster("https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + num + ".mp3");
          };
        }
        show($("tj-lmr-step1"));
        if (meta) meta.textContent = "Ready " + ref + " · Ḥuṣarī · educational only — not a fatwa";
      })
      .catch(function () {
        setText("", "Could not load — open /craft/tajweed/ or quran.com/" + ref, ref);
      });
  }

  function playMaster() {
    var audio = $("tj-lmr-master-audio");
    if (!audio || !audio.src) {
      pull();
      return;
    }
    try { audio.play(); } catch (e) {}
  }

  var recState = { rec: null, chunks: [], url: "", t0: 0 };

  function startRec() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      var st = $("tj-lmr-rec-status");
      if (st) st.textContent = "Mic unavailable";
      return;
    }
    recState.chunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      recState.rec = new MediaRecorder(stream);
      recState.t0 = Date.now();
      recState.rec.ondataavailable = function (ev) {
        if (ev.data && ev.data.size) recState.chunks.push(ev.data);
      };
      recState.rec.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        var blob = new Blob(recState.chunks, { type: "audio/webm" });
        if (recState.url) URL.revokeObjectURL(recState.url);
        recState.url = URL.createObjectURL(blob);
        var ua = $("tj-lmr-user-audio");
        if (ua) {
          ua.src = recState.url;
          show(ua);
        }
        var stop = $("tj-lmr-rec-stop");
        if (stop) stop.disabled = true;
        var play = $("tj-lmr-rec-play");
        if (play) play.disabled = false;
        var sc = $("tj-lmr-score-btn");
        if (sc) sc.disabled = false;
        var st = $("tj-lmr-rec-status");
        if (st) st.textContent = "Take saved on device · nothing uploaded · educational only";
      };
      recState.rec.start();
      var stop = $("tj-lmr-rec-stop");
      if (stop) stop.disabled = false;
      var st = $("tj-lmr-rec-status");
      if (st) st.textContent = "Recording… tap Stop";
      show($("tj-lmr-step3"));
    }).catch(function () {
      var st = $("tj-lmr-rec-status");
      if (st) st.textContent = "Mic permission denied";
    });
  }

  function stopRec() {
    try {
      if (recState.rec && recState.rec.state === "recording") recState.rec.stop();
    } catch (e) {}
  }

  function playUser() {
    var ua = $("tj-lmr-user-audio");
    if (ua && ua.src) try { ua.play(); } catch (e) {}
  }

  function score() {
    var master = $("tj-lmr-master-audio");
    var user = $("tj-lmr-user-audio");
    var card = $("tj-lmr-score-card");
    var val = $("tj-lmr-score-val");
    var note = $("tj-lmr-score-note");
    if (!user || !user.src) {
      if (note) note.textContent = "Record a take first";
      return;
    }
    var md = (master && master.duration) || 0;
    var ud = (user && user.duration) || 0;
    if (!ud || !isFinite(ud)) ud = Math.max(0.5, (Date.now() - recState.t0) / 1000);
    var pct = md > 0 ? Math.round((Math.min(ud, md) / Math.max(ud, md)) * 100) : 50;
    show(card);
    if (val) val.textContent = "~" + pct + "%";
    if (note) note.textContent = "Educational length proxy — not a qāriʾ grade. Learn with a teacher.";
    function bar(id, p) {
      var el = $(id);
      if (el) el.style.width = Math.max(5, Math.min(100, p)) + "%";
    }
    bar("tj-lmr-bar-len", pct);
    bar("tj-lmr-bar-time", pct);
    bar("tj-lmr-bar-energy", Math.max(40, pct - 5));
  }

  function bindDurable() {
    if (!$("tj-lmr")) return;
    function on(id, fn) {
      var el = $(id);
      if (!el || el.__rewire) return;
      el.__rewire = true;
      el.addEventListener("click", function (ev) {
        ev.preventDefault();
        fn();
      });
    }
    on("tj-lmr-fetch", pull);
    on("tj-lmr-random", function () {
      if ($("tj-lmr-ayah")) $("tj-lmr-ayah").value = String(1 + Math.floor(Math.random() * 7));
      pull();
    });
    on("tj-lmr-play-master", playMaster);
    on("tj-lmr-play-master2", playMaster);
    on("tj-lmr-play-master3", playMaster);
    on("tj-lmr-rec-btn", startRec);
    on("tj-lmr-rec-stop", stopRec);
    on("tj-lmr-rec-play", playUser);
    on("tj-lmr-score-btn", score);
    /* step chips: reveal panels */
    d.querySelectorAll(".tj-lmr-step, [data-step]").forEach(function (b) {
      if (b.__rewire) return;
      b.__rewire = true;
      b.addEventListener("click", function () {
        var step = b.getAttribute("data-step") || b.id && b.id.replace("tj-lmr-step", "");
        if (!step) return;
        var panel = $("tj-lmr-step" + step);
        show(panel);
      });
    });
  }

  function boot() {
    if (!isActionContext()) return;
    visibility();
    bindDurable();
    /* auto sample so surface never empty */
    var ar = $("tj-lmr-ar") || $("tj-lmr-ar-read");
    if (ar && !ar.textContent.trim()) {
      setTimeout(pull, 300);
    }
  }

  function onMounted(ev) {
    try {
      var tab = (ev && ev.detail && ev.detail.tab) || "";
      if (tab) {
        try { d.body.setAttribute("data-active-tab", tab); } catch (e) {}
      }
      if (tab && String(tab).toLowerCase() !== "action") return;
    } catch (e2) {}
    setTimeout(boot, 50);
    setTimeout(boot, 400);
    setTimeout(boot, 1200);
  }

  d.addEventListener("clarity:tab-mounted", onMounted);
  w.addEventListener("clarity:tab-mounted", onMounted);
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
})(window, document);
