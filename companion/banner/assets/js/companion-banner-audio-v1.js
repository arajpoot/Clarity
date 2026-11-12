/*! companion-banner-audio-v1 · C5 · exclusive radio/surah · volume · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_AUDIO_V1__) return;
  w.__COMPANION_BANNER_AUDIO_V1__ = true;

  var RECITER = {
    afs: "afs",
    alafasy: "afs",
    "ar.alafasy": "afs",
    basit: "basit",
    "ar.abdulsamad": "basit",
    sds: "sds",
    sudais: "sds",
    "ar.abdurrahmaansudais": "sds",
    ajm: "ajm",
    ajmi: "ajm"
  };

  var audio = null;
  var DEFAULT_VOL = 0.82;

  function $(id) { return d.getElementById(id); }

  function pauseOtherAudio(except) {
    try {
      d.querySelectorAll("audio").forEach(function (el) {
        if (el === except) return;
        try { el.pause(); } catch (e) {}
      });
    } catch (e2) {}
  }

  function muteLiveVideo() {
    /* Live Ḥaramain iframe must not compete with Qurʾān audio */
    var iframe = $("banner-live");
    if (iframe && !iframe.hidden && iframe.src) {
      try {
        /* Prefer still while audio plays — avoids dual sound */
        if (typeof w.showStill === "function") {
          /* controls may use internal showStill — use toggle path */
        }
        if (typeof w.toggleHaramainLive === "function") {
          var lab = $("live-haramain-label") || $("stream-text");
          var isLive = lab && /live/i.test(lab.textContent || "");
          if (isLive && typeof w.ClarityBannerOwner === "object" && w.ClarityBannerOwner.showStill) {
            w.ClarityBannerOwner.showStill();
          } else if (isLive) {
            /* force still via owner or DOM */
            iframe.hidden = true;
            try { iframe.removeAttribute("src"); } catch (e3) {}
            var img = $("banner-img");
            if (img) img.hidden = false;
            if (lab) lab.textContent = "Still";
          }
        } else {
          iframe.hidden = true;
          try { iframe.removeAttribute("src"); } catch (e4) {}
          var img2 = $("banner-img");
          if (img2) img2.hidden = false;
        }
      } catch (e5) {}
    }
  }

  function volumeControl() {
    return (
      $("volume-slider") ||
      $("banner-volume") ||
      d.querySelector(".volume-wrap input[type='range']") ||
      d.querySelector(".banner input[type='range']") ||
      d.querySelector("#clarity-final-banner-controls-v2 input[type='range']")
    );
  }

  function applyVolume(a) {
    if (!a) return;
    var vol = volumeControl();
    var v = DEFAULT_VOL;
    if (vol) {
      var raw = parseFloat(vol.value);
      if (!isNaN(raw)) {
        /* support 0–1 or 0–100 */
        v = raw > 1 ? raw / 100 : raw;
      }
      if (v < 0.05) {
        /* restore from silent default */
        v = DEFAULT_VOL;
        try {
          vol.value = vol.max && parseFloat(vol.max) > 1 ? String(Math.round(v * 100)) : String(v);
        } catch (e6) {}
      }
    }
    a.volume = Math.min(1, Math.max(0, v));
  }

  function ensureAudio() {
    if (audio && audio.parentNode) return audio;
    audio =
      $("clarity-quran-audio") ||
      $("quran-audio") ||
      d.querySelector("audio#clarity-quran-audio");
    if (!audio) {
      audio = d.createElement("audio");
      audio.id = "clarity-quran-audio";
      audio.preload = "none";
      audio.setAttribute("playsinline", "true");
      d.body.appendChild(audio);
    }
    applyVolume(audio);
    var vol = volumeControl();
    if (vol && !vol.__c5AudioWired) {
      vol.__c5AudioWired = true;
      if (!vol.value || parseFloat(vol.value) < 0.05) {
        vol.value = parseFloat(vol.max) > 1 ? "82" : "0.82";
      }
      vol.addEventListener("input", function () {
        applyVolume(audio);
      });
      vol.addEventListener("change", function () {
        applyVolume(audio);
      });
    }
    audio.addEventListener("play", function () {
      pauseOtherAudio(audio);
      muteLiveVideo();
      applyVolume(audio);
      setStreamUi(true);
    });
    audio.addEventListener("pause", function () {
      setStreamUi(false);
    });
    audio.addEventListener("ended", function () {
      setStreamUi(false);
    });
    return audio;
  }

  function setStreamUi(playing) {
    var icon = $("stream-icon");
    var text = $("stream-text");
    if (icon) icon.textContent = playing ? "⏸" : "▶";
    if (text) text.textContent = playing ? "Pause" : "Listen";
    var btn = $("stream-btn");
    if (btn) btn.setAttribute("aria-pressed", playing ? "true" : "false");
  }

  function streamUrl() {
    var sel = $("stream-select");
    return (sel && sel.value) || "https://qurango.net/radio/tarateel";
  }

  function playSrc(src) {
    var a = ensureAudio();
    pauseOtherAudio(a);
    muteLiveVideo();
    applyVolume(a);
    try { a.pause(); } catch (e7) {}
    a.src = src;
    a.load();
    return a.play().then(function () {
      applyVolume(a);
      setStreamUi(true);
      return true;
    }).catch(function () {
      setStreamUi(false);
      return false;
    });
  }

  /* Override / enrich globals — last writer wins for audio */
  w.toggleQuranStream = function () {
    var a = ensureAudio();
    if (!a.paused && a.src) {
      a.pause();
      setStreamUi(false);
      return;
    }
    playSrc(streamUrl());
  };

  w.changeStream = function () {
    var a = ensureAudio();
    var playing = !a.paused;
    a.src = streamUrl();
    applyVolume(a);
    if (playing) {
      pauseOtherAudio(a);
      muteLiveVideo();
      a.play().catch(function () {});
    }
  };

  w.clarityPlaySurahFromSelect = function (sel) {
    if (!sel) return;
    var n = parseInt(sel.value, 10);
    if (!n) return;
    var code = "afs";
    try { code = localStorage.getItem("clarity_reciter") || "afs"; } catch (e8) {}
    var rsel = $("surah-reciter-pill") || $("reciter-select");
    if (rsel && rsel.value) code = rsel.value;
    var edition = RECITER[code] || RECITER.afs || "ar.alafasy";
    var num = String(n).padStart(3, "0");
    var servers = {
      afs: "https://server8.mp3quran.net/afs/",
      basit: "https://server7.mp3quran.net/basit/",
      sds: "https://server11.mp3quran.net/sds/",
      ajm: "https://server10.mp3quran.net/ajm/"
    };
    var base = servers[edition] || servers.afs;
    var primary = base + num + ".mp3";
    var fallback = "https://server8.mp3quran.net/afs/" + num + ".mp3";
    var fallback2 = "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/" + n + ".mp3";
    var a = ensureAudio();
    applyVolume(a);
    pauseOtherAudio(a);
    muteLiveVideo();
    a.src = primary;
    a.play().then(function () {
      applyVolume(a);
      setStreamUi(true);
    }).catch(function () {
      a.src = fallback;
      applyVolume(a);
      a.play().then(function () {
        applyVolume(a);
        setStreamUi(true);
      }).catch(function () {
        setStreamUi(false);
      });
    });
  };

  /* When user starts live video, pause Qurʾān audio */
  function wrapLiveExclusive() {
    var prevToggle = w.toggleHaramainLive;
    if (typeof prevToggle === "function" && !prevToggle.__c5AudioExclusive) {
      w.toggleHaramainLive = function () {
        var lab = $("live-haramain-label");
        var goingLive = !(lab && /live/i.test(lab.textContent || ""));
        if (goingLive) {
          try {
            var a = ensureAudio();
            if (!a.paused) a.pause();
          } catch (e9) {}
        }
        return prevToggle.apply(this, arguments);
      };
      w.toggleHaramainLive.__c5AudioExclusive = true;
    }
  }

  function wirePills() {
    var streamBtn = $("stream-btn");
    if (streamBtn && !streamBtn.__c5Audio) {
      streamBtn.__c5Audio = true;
      streamBtn.addEventListener("click", function (ev) {
        /* onclick may also fire — prevent double toggle by relying on one path */
        if (streamBtn.getAttribute("onclick")) return;
        ev.preventDefault();
        w.toggleQuranStream();
      });
    }
    var surah = $("surah-list-pill");
    if (surah && !surah.__c5Audio) {
      surah.__c5Audio = true;
      surah.addEventListener("change", function () {
        w.clarityPlaySurahFromSelect(surah);
      });
    }
    var reciter = $("surah-reciter-pill") || $("reciter-select");
    if (reciter && !reciter.__c5Audio) {
      reciter.__c5Audio = true;
      reciter.addEventListener("change", function () {
        try { localStorage.setItem("clarity_reciter", reciter.value); } catch (e10) {}
        if (surah && surah.value) w.clarityPlaySurahFromSelect(surah);
      });
    }
    var streamSel = $("stream-select");
    if (streamSel && !streamSel.__c5Audio) {
      streamSel.__c5Audio = true;
      streamSel.addEventListener("change", function () {
        w.changeStream();
      });
    }
  }

  function boot() {
    ensureAudio();
    applyVolume(ensureAudio());
    wirePills();
    wrapLiveExclusive();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    wrapLiveExclusive();
  });
  setTimeout(function () { boot(); wrapLiveExclusive(); }, 800);
  setTimeout(function () { boot(); wrapLiveExclusive(); }, 2000);

  w.ClarityBannerAudio = {
    ensureAudio: ensureAudio,
    playSrc: playSrc,
    applyVolume: function () { applyVolume(ensureAudio()); },
    stop: function () {
      var a = ensureAudio();
      try { a.pause(); } catch (e11) {}
      setStreamUi(false);
    }
  };
})(window, document);
