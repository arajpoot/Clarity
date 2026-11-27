/*! companion-banner-audio-v1 · LIVE3 rewire
 * Radio stream ⊥ Surah recitation ⊥ Live video
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_AUDIO_LIVE3__) return;
  w.__CLARITY_BANNER_AUDIO_LIVE3__ = true;
  /* allow re-init over older audio build */
  w.__CLARITY_BANNER_AUDIO_V1__ = true;

  var RECITER_SERVER = {
    afs: "https://server8.mp3quran.net/afs/",
    alafasy: "https://server8.mp3quran.net/afs/",
    basit: "https://server7.mp3quran.net/basit/",
    sds: "https://server11.mp3quran.net/sds/",
    sudais: "https://server11.mp3quran.net/sds/",
    ajm: "https://server10.mp3quran.net/ajm/",
    ajmy: "https://server10.mp3quran.net/ajm/",
    maher: "https://server12.mp3quran.net/maher/",
    ghamdi: "https://server7.mp3quran.net/ghamdi/",
    husary: "https://server13.mp3quran.net/husr/",
    minshawi: "https://server8.mp3quran.net/minsh/",
    "ar.alafasy": "https://server8.mp3quran.net/afs/"
  };

  var audio = null;
  var mode = "idle"; /* idle | radio | surah */
  var DEFAULT_VOL = 0.82;

  function $(id) { return d.getElementById(id); }

  function ensureAudio() {
    if (audio) return audio;
    audio = d.getElementById("banner-quran-audio");
    if (!audio) {
      audio = d.createElement("audio");
      audio.id = "banner-quran-audio";
      audio.preload = "none";
      audio.playsInline = true;
      d.body.appendChild(audio);
    }
    return audio;
  }

  function applyVolume(a) {
    var sl = $("volume-slider");
    var v = DEFAULT_VOL;
    if (sl) {
      var n = parseInt(sl.value, 10);
      if (!isNaN(n)) v = Math.max(0, Math.min(1, n / 100));
    }
    try { a.volume = v; } catch (e) {}
  }

  function pauseOtherAudio(except) {
    try {
      d.querySelectorAll("audio").forEach(function (el) {
        if (el === except) return;
        try { el.pause(); } catch (e) {}
      });
    } catch (e2) {}
  }

  function muteLiveVideo() {
    /* optional: keep live visual; user can still watch muted */
    try {
      if (w.ClarityBannerAudio && w.ClarityBannerAudio._keepLive) return;
    } catch (e) {}
  }

  function setStreamUi(on) {
    var icon = $("stream-icon");
    var text = $("stream-text");
    var btn = $("stream-btn");
    if (icon) icon.textContent = on && mode === "radio" ? "Stop" : "Play";
    if (text) text.textContent = on && mode === "radio" ? "Stop" : "Listen";
    if (btn) btn.classList.toggle("is-active", !!(on && mode === "radio"));
  }

  function setSurahUi(on) {
    var play = $("btn-surah-play");
    var stop = $("btn-surah-stop");
    if (play) play.classList.toggle("is-active", !!on);
    if (stop) stop.classList.toggle("is-active", !on);
  }

  function streamUrl() {
    var sel = $("stream-select");
    return (sel && sel.value) || "https://qurango.net/radio/tarateel";
  }

  function stopAll() {
    var a = ensureAudio();
    try { a.pause(); } catch (e) {}
    try { a.removeAttribute("src"); a.load(); } catch (e2) {}
    mode = "idle";
    setStreamUi(false);
    setSurahUi(false);
  }

  function playSrc(src, kind) {
    var a = ensureAudio();
    pauseOtherAudio(a);
    muteLiveVideo();
    applyVolume(a);
    try { a.pause(); } catch (e7) {}
    a.src = src;
    a.load();
    return a.play().then(function () {
      applyVolume(a);
      mode = kind || "radio";
      setStreamUi(mode === "radio");
      setSurahUi(mode === "surah");
      return true;
    }).catch(function () {
      mode = "idle";
      setStreamUi(false);
      setSurahUi(false);
      return false;
    });
  }

  w.toggleQuranStream = function () {
    var a = ensureAudio();
    if (mode === "radio" && !a.paused && a.src) {
      a.pause();
      mode = "idle";
      setStreamUi(false);
      return;
    }
    /* switching from surah → radio */
    playSrc(streamUrl(), "radio");
  };

  w.changeStream = function () {
    if (mode !== "radio") return;
    var a = ensureAudio();
    a.src = streamUrl();
    applyVolume(a);
    pauseOtherAudio(a);
    a.play().catch(function () {});
  };

  function reciterBase() {
    var rsel = $("surah-reciter-pill") || $("reciter-select");
    var code = "afs";
    try { code = localStorage.getItem("clarity_reciter") || "afs"; } catch (e) {}
    if (rsel && rsel.value) code = rsel.value;
    code = String(code || "afs").toLowerCase();
    return RECITER_SERVER[code] || RECITER_SERVER.afs;
  }

  w.clarityPlaySurahFromSelect = function (sel) {
    if (!sel) sel = $("surah-list-pill");
    if (!sel) return;
    var n = parseInt(sel.value, 10);
    if (!n) return;
    var num = String(n).padStart(3, "0");
    var base = reciterBase();
    var primary = base + num + ".mp3";
    var fallback = "https://server8.mp3quran.net/afs/" + num + ".mp3";
    var fallback2 = "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" + n + ".mp3";
    var a = ensureAudio();
    applyVolume(a);
    pauseOtherAudio(a);
    muteLiveVideo();
    function tryPlay(src, next) {
      a.src = src;
      a.load();
      return a.play().then(function () {
        applyVolume(a);
        mode = "surah";
        setStreamUi(false);
        setSurahUi(true);
      }).catch(function () {
        if (next) return next();
        mode = "idle";
        setSurahUi(false);
      });
    }
    tryPlay(primary, function () {
      return tryPlay(fallback, function () {
        return tryPlay(fallback2);
      });
    });
  };

  w.clarityStopSurah = function () {
    if (mode === "surah") stopAll();
    else {
      var a = ensureAudio();
      try { a.pause(); } catch (e) {}
      setSurahUi(false);
    }
  };

  function wirePills() {
    var streamBtn = $("stream-btn");
    if (streamBtn) {
      streamBtn.removeAttribute("onclick");
      streamBtn.onclick = function (ev) {
        if (ev) ev.preventDefault();
        w.toggleQuranStream();
      };
    }
    var surah = $("surah-list-pill");
    if (surah) {
      surah.onchange = function () {
        w.clarityPlaySurahFromSelect(surah);
      };
    }
    var reciter = $("surah-reciter-pill") || $("reciter-select");
    if (reciter) {
      reciter.onchange = function () {
        try { localStorage.setItem("clarity_reciter", reciter.value); } catch (e10) {}
        if (surah && surah.value) w.clarityPlaySurahFromSelect(surah);
      };
    }
    var streamSel = $("stream-select");
    if (streamSel) {
      streamSel.onchange = function () {
        if (mode === "radio") w.changeStream();
      };
    }
    var vol = $("volume-slider");
    if (vol) {
      vol.oninput = function () {
        applyVolume(ensureAudio());
      };
    }
    var sp = $("btn-surah-play");
    if (sp) {
      sp.onclick = function (ev) {
        if (ev) ev.preventDefault();
        var sel = $("surah-list-pill");
        if (sel && sel.value) w.clarityPlaySurahFromSelect(sel);
        else {
          /* open panel */
          var panel = $("surah-panel");
          var tog = $("surah-toggle");
          if (panel) panel.hidden = false;
          if (tog) tog.setAttribute("aria-expanded", "true");
        }
      };
    }
    var ss = $("btn-surah-stop");
    if (ss) {
      ss.onclick = function (ev) {
        if (ev) ev.preventDefault();
        w.clarityStopSurah();
      };
    }
    var st = $("surah-toggle");
    if (st) {
      st.onclick = function () {
        var panel = $("surah-panel");
        if (!panel) return;
        var open = panel.hidden;
        panel.hidden = !open;
        st.setAttribute("aria-expanded", open ? "true" : "false");
      };
    }
    var search = $("surah-search");
    if (search && surah) {
      search.oninput = function () {
        var q = (search.value || "").toLowerCase();
        Array.prototype.forEach.call(surah.options, function (opt) {
          if (!opt.value) { opt.hidden = false; return; }
          opt.hidden = q && (opt.textContent || "").toLowerCase().indexOf(q) < 0;
        });
      };
    }
  }

  function boot() {
    ensureAudio();
    applyVolume(ensureAudio());
    wirePills();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
  setTimeout(boot, 400);
  setTimeout(boot, 1200);

  w.ClarityBannerAudio = {
    ensureAudio: ensureAudio,
    playSrc: function (src) { return playSrc(src, "radio"); },
    applyVolume: function () { applyVolume(ensureAudio()); },
    stop: stopAll,
    mode: function () { return mode; }
  };
})(window, document);
