/*! companion-banner-controls-v1
 * Restore banner AV controls: live/stills, radio stream, surah, volume.
 * Safe multi-source live + stills fallback. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_BANNER_CONTROLS_V1__) return;
  w.__COMPANION_BANNER_CONTROLS_V1__ = true;

  var STILLS = {
    makkah:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
    madinah:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg/1280px-Al-Masjid_an-Nabawi_as_viewed_from_the_east.jpg"
  };
  var LIVE = {
    madinah: [
      "https://www.youtube.com/embed/NJfqVXQY5Sc?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/live_stream?channel=UCuh7oUaZwF1BeY1vSzn1wrw&autoplay=1&mute=1&playsinline=1"
    ],
    makkah: [
      "https://www.youtube.com/embed/s17YH8xrCS8?autoplay=1&mute=1&playsinline=1&rel=0",
      "https://www.youtube.com/embed/live_stream?channel=UCpO77QKWGadMHkait73uD4A&autoplay=1&mute=1&playsinline=1"
    ]
  };

  var liveOn = false;
  var liveIdx = 0;
  var audio = null;

  function $(id) { return d.getElementById(id); }
  function place() {
    var s = $("live-place-select");
    return s && s.value === "makkah" ? "makkah" : "madinah";
  }

  function setLabel(live) {
    var lab = $("live-haramain-label");
    if (lab) lab.textContent = live ? "Live" : "Stills";
    var btn = $("live-haramain-btn");
    if (btn) btn.classList.toggle("is-live", !!live);
  }

  function showStill() {
    liveOn = false;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (iframe) {
      iframe.hidden = true;
      try { iframe.removeAttribute("src"); } catch (e) {}
    }
    if (img) {
      img.hidden = false;
      img.style.display = "";
      img.style.opacity = "1";
      img.src = STILLS[place()] || STILLS.makkah;
    }
    setLabel(false);
  }

  function showLive() {
    var list = LIVE[place()] || LIVE.madinah;
    var iframe = $("banner-live");
    var img = $("banner-img");
    if (!iframe || !list.length) {
      showStill();
      return;
    }
    liveOn = true;
    liveIdx = liveIdx % list.length;
    iframe.hidden = false;
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture; fullscreen");
    iframe.src = list[liveIdx];
    if (img) img.style.opacity = "0.25";
    setLabel(true);
    setTimeout(function () {
      if (!liveOn) return;
      /* soft rotate if user stays on Live */
    }, 15000);
  }

  w.toggleHaramainLive = function () {
    if (liveOn) showStill();
    else {
      liveIdx = 0;
      showLive();
    }
  };
  w.changeHaramainPlace = function () {
    if (liveOn) {
      liveIdx = 0;
      showLive();
    } else showStill();
  };

  function ensureAudio() {
    if (audio) return audio;
    audio = d.getElementById("clarity-quran-audio");
    if (!audio) {
      audio = d.createElement("audio");
      audio.id = "clarity-quran-audio";
      audio.preload = "none";
      d.body.appendChild(audio);
    }
    var vol = d.querySelector('.banner input[type="range"], #banner-volume, .volume-wrap input');
    if (vol && !vol.__wired) {
      vol.__wired = true;
      audio.volume = Math.min(1, Math.max(0, (parseFloat(vol.value) || 50) / 100));
      vol.addEventListener("input", function () {
        audio.volume = Math.min(1, Math.max(0, (parseFloat(vol.value) || 0) / 100));
      });
    }
    return audio;
  }

  function streamUrl() {
    var sel = $("stream-select");
    return (sel && sel.value) || "https://qurango.net/radio/tarateel";
  }

  w.changeStream = function () {
    var a = ensureAudio();
    var playing = !a.paused;
    a.src = streamUrl();
    if (playing) a.play().catch(function () {});
  };

  w.toggleQuranStream = function () {
    var a = ensureAudio();
    var icon = $("stream-icon");
    var text = $("stream-text");
    if (!a.paused && a.src) {
      a.pause();
      if (icon) icon.textContent = "▶";
      if (text) text.textContent = "Listen";
      return;
    }
    a.src = streamUrl();
    a.play()
      .then(function () {
        if (icon) icon.textContent = "⏸";
        if (text) text.textContent = "Pause";
      })
      .catch(function () {
        if (icon) icon.textContent = "▶";
        if (text) text.textContent = "Listen";
      });
  };

  var RECITER = {
    afs: "ar.alafasy",
    basit: "ar.abdulsamad",
    sds: "ar.abdurrahmaansudais",
    maher: "ar.mahermuaiqly",
    ajm: "ar.ahmedajamy",
    ghamdi: "ar.saoodshuraym",
    husary: "ar.husary",
    minshawi: "ar.minshawi"
  };

  w.claritySetReciter = function (code) {
    try { localStorage.setItem("clarity_reciter", code || "afs"); } catch (e) {}
  };

  w.clarityPlaySurahFromSelect = function (sel) {
    if (!sel) return;
    var n = parseInt(sel.value, 10);
    if (!n) return;
    var code = "afs";
    try { code = localStorage.getItem("clarity_reciter") || "afs"; } catch (e) {}
    var rsel = $("surah-reciter-pill");
    if (rsel && rsel.value) code = rsel.value;
    var edition = RECITER[code] || RECITER.afs;
    var num = String(n).padStart(3, "0");
    var a = ensureAudio();
    /* everyayah pattern */
    a.src = "https://cdn.islamic.network/quran/audio-surah/128/" + edition + "/" + n + ".mp3";
    a.play().catch(function () {
      a.src = "https://server8.mp3quran.net/afs/" + num + ".mp3";
      a.play().catch(function () {});
    });
    var icon = $("stream-icon");
    var text = $("stream-text");
    if (icon) icon.textContent = "⏸";
    if (text) text.textContent = "Pause";
  };

  /* Rabbana: only define if missing */
  if (typeof w.cycleRabbana !== "function") {
    w.cycleRabbana = function () {};
  }

  function boot() {
    showStill();
    ensureAudio();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", boot);
})(window, document);
