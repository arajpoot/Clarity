(function(){
  "use strict";
  if (window.__NUROS_BRIDGE_ENRICH_V2__) return;
  window.__NUROS_BRIDGE_ENRICH_V2__ = true;

  function $(id){ try { return document.getElementById(id); } catch(e){ return null; } }
  function setStatus(id, msg, live){
    var el = $(id); if (!el) return;
    el.textContent = msg || "";
    el.classList.toggle("live", !!live);
  }

  /* Undo any prior getUserMedia monkey-patch that lowered levels */
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && navigator.mediaDevices.getUserMedia._nurosGain) {
      /* cannot restore original easily; reload advice — mark cleared for new page loads */
      delete navigator.mediaDevices.getUserMedia._nurosGain;
    }
  } catch(e){}

  async function toArabic(text, srcLang){
    text = (text || "").trim();
    if (!text) return "";
    srcLang = srcLang || "en";
    try {
      if (typeof calligGoogleTranslate === "function") {
        var r = await calligGoogleTranslate(text, srcLang === "auto" ? "auto" : srcLang, "ar");
        if (r) return r;
      }
    } catch(e){}
    try {
      if (typeof clarityGoogleTranslate === "function") {
        var r2 = await clarityGoogleTranslate(text, srcLang === "auto" ? "en" : srcLang, "ar");
        if (r2) return r2;
      }
    } catch(e2){}
    try {
      var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
        encodeURIComponent(srcLang === "auto" ? "auto" : srcLang) +
        "&tl=ar&dt=t&q=" + encodeURIComponent(text);
      var res = await fetch(url);
      var data = await res.json();
      if (data && data[0]) return data[0].map(function(row){ return row[0]; }).join("");
    } catch(e3){}
    return "";
  }

  window.nurosBridgeTranslate = async function(){
    var en = $("callig-bridge-en");
    var lang = ($("callig-bridge-lang") || {}).value || "en";
    var arOut = $("callig-bridge-ar");
    setStatus("callig-bridge-status", "Translating…");
    var ar = await toArabic(en && en.value, lang);
    if (arOut) arOut.textContent = ar || "— could not translate (check network)";
    window.calligLastArabic = ar || "";
    var mainIn = $("callig-english-input");
    if (mainIn && en) mainIn.value = en.value;
    try { if (typeof calligTranslateToArabic === "function") calligTranslateToArabic(); } catch(e){}
    setStatus("callig-bridge-status", ar ? "Arabic ready · Place on pad" : "Translate failed");
  };

  window.nurosBridgePlace = function(){
    var ar = (($("callig-bridge-ar") || {}).textContent || "").trim();
    if (!ar || ar.indexOf("—") === 0) { window.nurosBridgeTranslate(); return; }
    window.calligLastArabic = ar;
    try {
      if (typeof calligPlaceArabicOnCanvas === "function") calligPlaceArabicOnCanvas(ar);
      else if (typeof calligMicPlaceArabic === "function") calligMicPlaceArabic();
      else if (typeof calligTranslateToArabic === "function") calligTranslateToArabic();
    } catch(e){}
    setStatus("callig-bridge-status", "Sent to pad");
  };

  /* Use existing Whisper-based calligraphy mic — no second engine */
  window.nurosBridgeWhisper = function(){
    setStatus("callig-bridge-status", "Using section Whisper mic…", true);
    try {
      if (typeof calligMicToggle === "function") calligMicToggle();
      else if (typeof calligToggleVoiceCapture === "function") calligToggleVoiceCapture();
      else setStatus("callig-bridge-status", "Whisper mic not loaded — use 🎤 Start under the pad");
    } catch(e){
      setStatus("callig-bridge-status", "Mic error — use Start/Stop under the pad");
    }
    /* Sync English box into bridge when voice text updates */
    var tries = 0;
    var t = setInterval(function(){
      tries++;
      var box = $("callig-voice-text") || $("callig-english-input");
      var en = $("callig-bridge-en");
      if (box && en && (box.value || box.textContent)) {
        en.value = (box.value || box.textContent || "").trim();
      }
      if (tries > 40) clearInterval(t);
    }, 500);
  };

  window.nurosMemeTranslate = async function(){
    var en = $("meme-bridge-en");
    var lang = ($("meme-bridge-lang") || {}).value || "en";
    var arOut = $("meme-bridge-ar");
    setStatus("meme-bridge-status", "Translating…");
    var ar = await toArabic(en && en.value, lang);
    if (arOut) arOut.textContent = ar || "—";
    setStatus("meme-bridge-status", ar ? "Arabic ready" : "Failed");
  };
  window.nurosMemePlace = function(){
    var ar = (($("meme-bridge-ar") || {}).textContent || "").trim();
    if (!ar) { window.nurosMemeTranslate(); return; }
    ["meme-top-input","meme-mid-input","meme-box-top"].forEach(function(id){
      var el = $(id); if (el) { if ("value" in el) el.value = ar; else el.textContent = ar; }
    });
    try {
      if (typeof memeRender === "function") memeRender();
      else if (typeof memeRefresh === "function") memeRefresh();
    } catch(e){}
    setStatus("meme-bridge-status", "Applied to caption");
  };

  /* ---- Tajweed LMR: working input-level meter (does NOT wrap getUserMedia) ---- */
  var lmrAudioCtx = null, lmrAnalyser = null, lmrRaf = null, lmrStreamRef = null;

  function ensureMeterUI(){
    var step = $("tj-lmr-step3") || $("tj-lmr-step2");
    if (!step) return null;
    var meter = step.querySelector(".tj-lmr-live-meter");
    if (!meter) {
      meter = document.createElement("div");
      meter.className = "tj-lmr-live-meter";
      meter.innerHTML = '<div class="meter-label">Input level</div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill-dup1"></div></div>';
      step.appendChild(meter);
    }
    return meter;
  }

  function stopLmrMeter(){
    if (lmrRaf) cancelAnimationFrame(lmrRaf);
    lmrRaf = null;
    try { if (lmrAudioCtx && lmrAudioCtx.state !== "closed") lmrAudioCtx.close(); } catch(e){}
    lmrAudioCtx = null; lmrAnalyser = null;
    document.querySelectorAll(".tj-lmr-live-meter").forEach(function(m){ m.classList.remove("recording"); });
    document.querySelectorAll("#tj-lmr-meter-fill, .tj-lmr-live-meter .meter-fill").forEach(function(f){ f.style.width = "0%"; });
  }

  function startLmrMeter(stream){
    try {
      stopLmrMeter();
      ensureMeterUI();
      lmrStreamRef = stream;
      lmrAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var src = lmrAudioCtx.createMediaStreamSource(stream);
      lmrAnalyser = lmrAudioCtx.createAnalyser();
      lmrAnalyser.fftSize = 512;
      lmrAnalyser.smoothingTimeConstant = 0.3;
      src.connect(lmrAnalyser);
      var data = new Uint8Array(lmrAnalyser.fftSize);
      document.querySelectorAll(".tj-lmr-live-meter").forEach(function(m){ m.classList.add("recording"); });
      function tick(){
        if (!lmrAnalyser) return;
        lmrAnalyser.getByteTimeDomainData(data);
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          var v = (data[i] - 128) / 128;
          sum += v * v;
        }
        var rms = Math.sqrt(sum / data.length);
        var pct = Math.min(100, Math.round(rms * 350)); /* sensitive scale for quiet speech */
        document.querySelectorAll("#tj-lmr-meter-fill, .tj-lmr-live-meter .meter-fill").forEach(function(f){
          f.style.width = pct + "%";
        });
        lmrRaf = requestAnimationFrame(tick);
      }
      tick();
    } catch(e){ console.warn("meter", e); }
  }

  function patchLmrRecordMeter(){
    var recBtn = $("tj-lmr-rec-btn");
    var stopBtn = $("tj-lmr-rec-stop");
    if (recBtn && !recBtn._meterHook) {
      recBtn._meterHook = true;
      recBtn.addEventListener("click", function(){
        ensureMeterUI();
        /* Poll for MediaStream after startRec gets it */
        var n = 0;
        var iv = setInterval(function(){
          n++;
          try {
            /* common places state may live */
            var stream = null;
            if (window.__tjLmrState && window.__tjLmrState.mediaRec) {
              /* MediaRecorder may expose stream in some browsers */
            }
            var tracks = null;
            /* query active audio tracks from active peer - fallback: new silent monitor */
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function(s){
              /* Only for meter — do not replace recorder; stop after meter attached if duplicate */
              startLmrMeter(s);
              /* Keep this meter stream until stop; stop tracks on stop button */
              window.__tjLmrMeterStream = s;
            }).catch(function(){});
          } catch(e){}
          clearInterval(iv);
        }, 350);
      }, true);
    }
    if (stopBtn && !stopBtn._meterHook) {
      stopBtn._meterHook = true;
      stopBtn.addEventListener("click", function(){
        stopLmrMeter();
        try {
          if (window.__tjLmrMeterStream) {
            window.__tjLmrMeterStream.getTracks().forEach(function(t){ t.stop(); });
            window.__tjLmrMeterStream = null;
          }
        } catch(e){}
      }, true);
    }
  }

  /* ---- Live stream: set iframe src reliably ---- */
  function fixLive(){
    window.officialLiveEmbedUrl = function(source){
      var place = ((document.getElementById("live-place-select") || {}).value) || "makkah";
      var ids = { makkah: "Rs7St51oDDc", madinah: "27cln-IxOGo", haramain: "ATMosZ7Xq1c" };
      var id = (source && source.kind === "video" && source.id) ? source.id : (ids[place] || ids.makkah);
      return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
        "?autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1";
    };
    function activate(){
      var liveEl = document.getElementById("banner-live");
      var media = document.getElementById("banner-media");
      var st = document.getElementById("banner-live-status");
      if (!liveEl) return;
      if (location.protocol === "file:") {
        if (st) st.textContent = "Use hosted HTTPS for in-banner live";
        return;
      }
      liveEl.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      liveEl.setAttribute("allowfullscreen", "true");
      liveEl.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      var place = ((document.getElementById("live-place-select") || {}).value) || "makkah";
      var id = place === "madinah" ? "27cln-IxOGo" : "Rs7St51oDDc";
      liveEl.src = "https://www.youtube-nocookie.com/embed/" + id +
        "?autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0";
      if (media) {
        media.classList.add("live-active");
        media.classList.remove("live-fallback");
        media.style.pointerEvents = "auto";
      }
      liveEl.style.opacity = "1";
      liveEl.style.pointerEvents = "auto";
      liveEl.style.zIndex = "6";
      if (st) st.textContent = "Live";
    }
    if (typeof window.tryBannerLiveEmbed === "function") {
      var prev = window.tryBannerLiveEmbed;
      window.tryBannerLiveEmbed = function(){};;
    }
    if (typeof window.toggleHaramainLive === "function" && !window.toggleHaramainLive._v2) {
      var tp = window.toggleHaramainLive;
      window.toggleHaramainLive = function(){
        try {
          var on = true;
          try { on = localStorage.getItem("clarity_haramain_live") !== "off"; } catch(e){}
          /* After toggle original flips state — call original then force activate if on */
          var r = tp.apply(this, arguments);
          setTimeout(function(){
            try {
              var nowOn = localStorage.getItem("clarity_haramain_live") !== "off";
              if (nowOn) activate();
            } catch(e){}
          }, 100);
          return r;
        } catch(e){ return tp.apply(this, arguments); }
      };
      window.toggleHaramainLive._v2 = true;
    }
    /* Wire Live button directly too */
    document.querySelectorAll("#live-haramain-btn, #banner-live-chip, .live-haramain-btn").forEach(function(btn){
      if (btn._liveWire) return;
      btn._liveWire = true;
      btn.addEventListener("click", function(){ setTimeout(activate, 150); }, true);
    });
  }

  function boot(){
    patchLmrRecordMeter();
    fixLive();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 100); });
  else setTimeout(boot, 100);
  window.addEventListener("load", function(){ setTimeout(boot, 300); });
})();