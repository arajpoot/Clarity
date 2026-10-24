
(function(){
  "use strict";
  if (window.__CLARITY_TJ_MEME_TWEET_REVAMP__) return;
  window.__CLARITY_TJ_MEME_TWEET_REVAMP__ = true;

  /* ========== 1. Tajweed level meter fix ========== */
  function ensureMeterCss(){ /* style tag handles look */ }

  function startMeterFromStream(stream) {
    try {
      if (!stream) return;
      var step = document.querySelector("#tj-lmr-step3, #tj-lmr-panel, .tj-lmr-panel") || document.getElementById("tj-lmr");
      var meter = document.querySelector(".tj-lmr-live-meter");
      if (!meter && step) {
        meter = document.createElement("div");
        meter.className = "tj-lmr-live-meter";
        meter.innerHTML = '<div class="meter-label">Input level</div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill-p2"></div></div>';
        step.appendChild(meter);
      }
      if (meter) meter.classList.add("recording");
      var fill = document.getElementById("tj-lmr-meter-fill");
      if (!fill && meter) fill = meter.querySelector(".meter-fill");

      if (window.__lmrMeterRaf) cancelAnimationFrame(window.__lmrMeterRaf);
      try { if (window.__lmrMeterCtx) window.__lmrMeterCtx.close(); } catch(e){}

      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      if (ctx.state === "suspended") ctx.resume();
      var src = ctx.createMediaStreamSource(stream);
      var an = ctx.createAnalyser();
      an.fftSize = 1024;
      an.smoothingTimeConstant = 0.45;
      src.connect(an);
      var data = new Uint8Array(an.fftSize);
      window.__lmrMeterCtx = ctx;
      window.__lmrMeterAn = an;

      (function tick(){
        if (!window.__lmrMeterAn) return;
        try {
          window.__lmrMeterAn.getByteTimeDomainData(data);
          var sum = 0;
          for (var i = 0; i < data.length; i++) {
            var v = (data[i] - 128) / 128;
            sum += v * v;
          }
          var rms = Math.sqrt(sum / data.length);
          var pct = Math.min(100, Math.max(0, Math.round(rms * 520)));
          var f = document.getElementById("tj-lmr-meter-fill") || (meter && meter.querySelector(".meter-fill"));
          if (f) f.style.width = pct + "%";
        } catch(e){}
        window.__lmrMeterRaf = requestAnimationFrame(tick);
      })();
    } catch(err) { console.warn("[Clarity] meter", err); }
  }
  function stopMeter() {
    if (window.__lmrMeterRaf) cancelAnimationFrame(window.__lmrMeterRaf);
    window.__lmrMeterRaf = null;
    window.__lmrMeterAn = null;
    try { if (window.__lmrMeterCtx) window.__lmrMeterCtx.close(); } catch(e){}
    window.__lmrMeterCtx = null;
    var f = document.getElementById("tj-lmr-meter-fill");
    if (f) f.style.width = "0%";
    document.querySelectorAll(".tj-lmr-live-meter").forEach(function(m){ m.classList.remove("recording"); });
  }
  window.clarityTjStartMeter = startMeterFromStream;
  window.clarityTjStopMeter = stopMeter;

  /* Hook getUserMedia success paths if record starts */
  var _gum = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
    ? navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices) : null;
  if (_gum && !navigator.mediaDevices.getUserMedia.__meterHook) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return _gum(constraints).then(function(stream) {
        try {
          if (constraints && constraints.audio) startMeterFromStream(stream);
        } catch(e){}
        return stream;
      });
    };
    navigator.mediaDevices.getUserMedia.__meterHook = true;
  }
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("#tj-lmr-rec-stop, #tj-lmr-rec-btn");
    if (t && /stop/i.test(t.id || t.textContent || "")) setTimeout(stopMeter, 80);
  }, true);

  /* ========== 2. Indo-Pak Arabic (Nastaliq) for meme canvas ========== */
  var INDO_FONT = '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Scheherazade New", "Noto Naskh Arabic", serif';

  function loadIndoFont() {
    try {
      if (document.getElementById("clarity-indopak-font-link")) return;
      var link = document.createElement("link");
      link.id = "clarity-indopak-font-link";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    } catch(e){}
  }
  loadIndoFont();

  function autoFitArabic(ctx, text, maxW, maxH, basePx) {
    var size = basePx || 42;
    var min = 14;
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    while (size > min) {
      ctx.font = "600 " + size + "px " + INDO_FONT;
      var lines = String(text || "").split(/\n/);
      var widest = 0, totalH = 0;
      lines.forEach(function(line){
        var m = ctx.measureText(line);
        widest = Math.max(widest, m.width);
        totalH += size * 1.55;
      });
      if (widest <= maxW && totalH <= maxH) break;
      size -= 1;
    }
    return size;
  }

  function applyIndoToMemeState(arabic) {
    try {
      if (!window.memeState) window.memeState = {};
      memeState.font = "indopak";
      memeState.arabicFont = INDO_FONT;
      if (arabic) {
        /* prefer mid or top for Arabic block */
        if (!memeState.mid) memeState.mid = arabic;
        else if (!memeState.top) memeState.top = arabic;
      }
      var sel = document.getElementById("meme-font");
      if (sel) {
        var opt = sel.querySelector('option[value="indopak"]');
        if (!opt) {
          opt = document.createElement("option");
          opt.value = "indopak";
          opt.textContent = "Indo-Pak (Nastaliq)";
          sel.appendChild(opt);
        }
        sel.value = "indopak";
      }
    } catch(e){}
  }

  /* Wrap memeDraw to use Indo-Pak when font is indopak / arabic verse */
  function wrapMemeDraw() {
    var prev = window.memeDraw;
    if (typeof prev !== "function" || prev.__indoPak) return;
    window.memeDraw = function() {
      try {
        var st = window.memeState || {};
        var useIndo = st.font === "indopak" || st.font === "nastaliq" || st.font === "arabic";
        if (useIndo) {
          st.arabicFont = INDO_FONT;
          /* temporarily force canvas font via measure path after draw */
        }
      } catch(e){}
      var r = prev.apply(this, arguments);
      try {
        var canvas = typeof memeGetCanvas === "function" ? memeGetCanvas() : document.querySelector("#meme-canvas, canvas.meme-canvas");
        var st2 = window.memeState || {};
        if (canvas && (st2.font === "indopak" || st2.font === "nastaliq")) {
          var ctx = canvas.getContext("2d");
          var ar = st2.mid || st2.top || st2.text || "";
          if (ar && /[\u0600-\u06FF]/.test(ar)) {
            /* soft re-stamp mid Arabic with fitted Nastaliq if engine used generic font */
            var maxW = canvas.width * 0.88;
            var maxH = canvas.height * 0.35;
            var size = autoFitArabic(ctx, ar, maxW, maxH, Math.round(canvas.width * 0.07));
            ctx.font = "600 " + size + "px " + INDO_FONT;
            ctx.fillStyle = st2.style === "gold" ? "#f0d78c" : (st2.ink || "#f6f1e7");
            ctx.textAlign = "center";
            ctx.direction = "rtl";
            var y = canvas.height * 0.48;
            String(ar).split(/\n/).forEach(function(line, i){
              ctx.fillText(line, canvas.width / 2, y + i * size * 1.55);
            });
          }
        }
      } catch(e2){}
      return r;
    };
    window.memeDraw.__indoPak = true;
  }

  var _push = window.clarityMemePush;
  if (typeof _push === "function" && !_push.__indo) {
    window.clarityMemePush = function(ar, en, ref) {
      applyIndoToMemeState(ar);
      loadIndoFont();
      var r = _push.apply(this, arguments);
      setTimeout(function(){ wrapMemeDraw(); if (typeof memeDraw === "function") memeDraw(); }, 120);
      return r;
    };
    window.clarityMemePush.__indo = true;
  }
  wrapMemeDraw();
  setTimeout(wrapMemeDraw, 800);

  /* ========== 3. Tweet desk → X/Twitter app ========== */
  function openTweetApp(text) {
    var body = String(text || "").trim();
    if (!body) return;
    var encoded = encodeURIComponent(body);
    var web = "https://twitter.com/intent/tweet?text=" + encoded;
    var webX = "https://x.com/intent/tweet?text=" + encoded;
    /* Native app schemes (mobile) */
    var schemes = [
      "twitter://post?message=" + encoded,
      "twitter://post?text=" + encoded,
      "x://post?message=" + encoded
    ];
    var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
    if (isMobile) {
      var tried = false;
      var start = Date.now();
      /* try app, fall back to web if still on page */
      var iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = schemes[0];
      document.body.appendChild(iframe);
      setTimeout(function(){
        try { document.body.removeChild(iframe); } catch(e){}
        if (Date.now() - start < 1600) {
          window.location.href = schemes[0];
        }
        setTimeout(function(){
          /* if user still here, open web intent */
          window.open(webX, "_blank", "noopener");
        }, 700);
      }, 400);
      try {
        if (typeof tdStatus === "function") tdStatus("Opening X / Twitter app…");
      } catch(e){}
      return;
    }
    /* Desktop: prefer x.com intent */
    window.open(webX, "_blank", "noopener");
    try { if (typeof tdStatus === "function") tdStatus("Compose opened on X"); } catch(e){}
  }

  if (typeof window.tdPost === "function" && !window.tdPost.__appOpen) {
    window.tdPost = function() {
      var ta = document.getElementById("td-text");
      if (!ta || !ta.value.trim()) {
        try { if (typeof tdDraft === "function") tdDraft("verse"); } catch(e){}
      }
      var raw = ((document.getElementById("td-text") || {}).value || "");
      openTweetApp(raw);
    };
    window.tdPost.__appOpen = true;
  }
  window.clarityOpenTweetApp = openTweetApp;

  console.info("[Clarity] tajweed meter + Indo-Pak meme + tweet app hooks ready");
})();
