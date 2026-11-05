
(function(){
  "use strict";
  if (window.__CLARITY_MEME_CANVAS_CLEAN__) return;
  window.__CLARITY_MEME_CANVAS_CLEAN__ = true;

  function bgForContent(ar, en, ref, cat){
    var blob = (ar + " " + en + " " + ref + " " + (cat || "")).toLowerCase();
    if (/death|grave|akhirah|die|mortality|قبر|موت|آخرة/.test(blob)) return "night";
    if (/mercy|forgive|repent|istighfar|رحمة|توبة|مغفرة/.test(blob)) return "spirit";
    if (/water|rain|sea|نوح|ماء|بحر/.test(blob)) return "water";
    if (/nature|earth|mountain|sky|سماء|جبل/.test(blob)) return "nature";
    if (/patient|patience|salah|prayer|صبر|صلاة|صبر/.test(blob)) return "holy";
    if (cat === "reflection") return "night";
    if (cat === "action") return "spirit";
    if (cat === "reality") return "nature";
    if (cat === "reminder") return "holy";
    return "holy";
  }
  function fetchBgReflect(ar, en, ref, cat){
    try {
      if (typeof memeFetchBg === "function") memeFetchBg(bgForContent(ar, en, ref, cat));
    } catch(e){}
  }

  function S(){
    if (!window.memeState || typeof window.memeState !== "object") {
      window.memeState = {
        vignette: 0.28, ratio: "twitter", grade: "none", img: null,
        top: "", mid: "", bottom: "", _lastRef: "",
        fontSize: 42, topSize: 34, midSize: 20, bottomSize: 16,
        outline: 4, font: "naskh", style: "outline",
        topY: 0.12, midY: 0.42, bottomY: 0.70, dragging: null,
        blankColor1: "#0f4c3a", blankColor2: "#1a2a22"
      };
    }
    return window.memeState;
  }

  function syncLegacy(s){
    try {
      if (typeof memeState !== "undefined" && memeState && memeState !== s) {
        memeState.top = s.top; memeState.mid = s.mid; memeState.bottom = s.bottom;
        memeState._lastRef = s._lastRef; memeState.ref = s._lastRef;
        memeState.topY = s.topY; memeState.midY = s.midY; memeState.bottomY = s.bottomY;
        memeState.topSize = s.topSize; memeState.midSize = s.midSize; memeState.bottomSize = s.bottomSize;
        memeState.font = s.font; memeState.outline = s.outline;
        if (s.img) memeState.img = s.img;
      }
    } catch(e){}
  }

  function writeDom(s){
    var t = document.getElementById("meme-top-input");
    var m = document.getElementById("meme-mid-input");
    var b = document.getElementById("meme-bottom-input");
    if (t) t.value = s.top || "";
    if (m) m.value = s.mid || "";
    if (b) b.value = s.bottom || "";
  }

  function paint(){
    var s = S();
    syncLegacy(s);
    writeDom(s);
    try { if (typeof memePositionBoxes === "function") memePositionBoxes(); } catch(e){}
    try { if (typeof memeDraw === "function") memeDraw(); } catch(e){}
  }

  function hasUrdu(str){
    return /[\u0679\u0688\u0691\u06BA\u06C1\u06BE\u06D2\u06AF\u0686\u06A9]/.test(str || "");
  }

  function urduFromPack(ar, en, ref){
    try {
      if (window.memeCurrentUrduDua) {
        var d = window.memeCurrentUrduDua;
        if (d.urdu || d.ur) return String(d.urdu || d.ur).trim();
      }
      var pack = (typeof MEME_URDU_DUAS !== "undefined" && MEME_URDU_DUAS) ? MEME_URDU_DUAS : [];
      var refKey = String(ref || "").replace(/\s/g, "");
      for (var i = 0; i < pack.length; i++) {
        var item = pack[i];
        var ir = String(item.ref || "").replace(/\s/g, "");
        if (refKey && ir && (ir.indexOf(refKey.replace(/[^0-9:]/g, "")) >= 0 || refKey.indexOf(ir.replace(/[^0-9:]/g, "")) >= 0))
          return String(item.urdu || item.ur || "").trim();
        if (ar && item.arabic && String(item.arabic).replace(/\s/g, "").slice(0, 36) === String(ar).replace(/\s/g, "").slice(0, 36))
          return String(item.urdu || item.ur || "").trim();
      }
    } catch(e){}
    return "";
  }

  function translateEnToUr(en, cb){
    en = String(en || "").trim();
    if (!en) { cb(""); return; }
    if (hasUrdu(en)) { cb(en); return; }
    var url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(en.slice(0, 400)) + "&langpair=en|ur";
    fetch(url, { credentials: "omit" })
      .then(function(r){ return r.json(); })
      .then(function(j){
        var out = (j && j.responseData && j.responseData.translatedText) || "";
        out = String(out).trim();
        if (/INVALID|QUERY LENGTH|MYMEMORY/i.test(out)) out = "";
        cb(out);
      })
      .catch(function(){ cb(""); });
  }

  /** Top=Arabic · Mid=English · Bot=Urdu · Yellow bar=Reference + site */
  window.clarityMemeSetCanvas = function(ar, en, ur, ref){
    var s = S();
    s.top = String(ar || "").trim();
    s.mid = String(en || "").trim();
    s.bottom = String(ur || "").trim();
    s._lastRef = String(ref || "").trim();
    s.ref = s._lastRef;
    s.topY = 0.12;
    s.midY = 0.40;
    s.bottomY = 0.64;
    s.topSize = /[\u0600-\u06FF]/.test(s.top) ? 34 : 26;
    s.midSize = s.mid.length > 120 ? 16 : 20;
    s.bottomSize = 15;
    if (!s.font || s.font === "impact") s.font = /[\u0600-\u06FF]/.test(s.top) ? "naskh" : "impact";
    syncLegacy(s);
    writeDom(s);
    paint();
    setTimeout(paint, 80);
    setTimeout(paint, 250);
    setTimeout(paint, 600);
    fetchBgReflect(s.top, s.mid, s._lastRef, "");
    setTimeout(function(){ paint(); }, 700);
    var st = document.getElementById("meme-rrra-status") || document.getElementById("meme-fetch-status");
    if (st) st.textContent = (s._lastRef || "Ready") + (s.bottom ? " · Urdu on canvas" : "");
  };

  window.clarityMemeFill = function(ar, en, ref){
    ar = String(ar || "").trim();
    en = String(en || "").trim();
    ref = String(ref || "").trim();
    var ur = urduFromPack(ar, en, ref);
    window.clarityMemeSetCanvas(ar, en, ur || "", ref);
    if (!ur && en) {
      translateEnToUr(en, function(u){
        if (u) window.clarityMemeSetCanvas(ar, en, u, ref);
      });
    }
  };

  window.clarityMemePush = function(ar, en, ref){
    window.clarityMemeFill(ar, en, ref);
    try {
      if (typeof switchTab === "function") switchTab("reminder");
      else if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor("reminder");
    } catch(e){}
    setTimeout(function(){
      var mc = document.getElementById("meme-card");
      if (mc) mc.scrollIntoView({ behavior: "smooth", block: "start" });
      paint();
    }, 200);
  };

  window.memeApplyUrduDua = function(withNature){
    try {
      if (!window.memeCurrentUrduDua && typeof memePickLocalUrduDua === "function")
        memePickLocalUrduDua();
      var d = window.memeCurrentUrduDua;
      if (!d) return;
      window.clarityMemeSetCanvas(d.arabic || d.ar, d.en, d.urdu || d.ur, d.ref);
      if (withNature && typeof memeFetchBg === "function") memeFetchBg("nature");
    } catch(e){}
  };

  window.memeFetchRrra = function(cat){
    try {
      var cats = ["reminder", "reality", "reflection", "action"];
      function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
      if (!cat || cats.indexOf(cat) < 0) cat = pick(cats);
      var pack = window.RRRA_PACKS && RRRA_PACKS[cat];
      if (!pack) {
        /* local minimal fallback */
        pack = {
          verses: [{ ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur'an 3:185" }],
          hadith: []
        };
      }
      var pool = (pack.verses || []).concat(pack.hadith || []);
      if (!pool.length) return;
      var line = pick(pool);
      var ar = line.ar || line.arabic || "";
      var en = line.en || line.english || "";
      var ref = line.ref || line.reference || "";
      window.clarityMemeFill(ar, en, ref);
      setTimeout(function(){
        try {
          if (typeof memeFetchBg === "function")
            memeFetchBg(typeof bgForContent==="function"?bgForContent(ar,en,ref,cat):({ reminder: "holy", reality: "nature", reflection: "night", action: "spirit" }[cat] || "holy"));
        } catch(e){}
        setTimeout(paint, 400);
      }, 150);
    } catch(e){}
  };

  /* Watermark: reference + clarity-dawah.fyi only */
  window.memePaintWatermark = function(ctx, w, h){
    if (!ctx) return;
    var s = S();
    var ref = String(s._lastRef || s.ref || "").trim();
    if (/[\u0600-\u06FF]/.test(ref) && ref.length > 50) ref = "";
    var mark = "clarity-dawah.fyi";
    /* Taller bar + larger type so auto-scale does not leave ref/site unreadably small */
    var barH = Math.max(ref ? 44 : 28, Math.round(h * (ref ? 0.085 : 0.05)));
    var y0 = h - barH;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "rgba(10,8,4,0.92)";
    ctx.fillRect(0, y0, w, barH);
    ctx.fillStyle = "rgba(212,180,90,0.65)";
    ctx.fillRect(0, y0, w, Math.max(1, Math.round(h * 0.003)));
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "ltr";
    if (ref) {
      var fs1 = Math.max(16, Math.min(24, Math.round(barH * 0.42)));
      ctx.font = "700 " + fs1 + "px Inter, system-ui, sans-serif";
      ctx.fillStyle = "#f5e6a8";
      while (fs1 > 13 && ctx.measureText(ref).width > w * 0.94) {
        fs1--;
        ctx.font = "700 " + fs1 + "px Inter, system-ui, sans-serif";
      }
      ctx.fillText(ref, w / 2, y0 + barH * 0.36);
      var fs2 = Math.max(13, Math.min(18, Math.round(barH * 0.30)));
      ctx.font = "600 " + fs2 + "px Inter, system-ui, sans-serif";
      ctx.fillStyle = "rgba(232,212,139,0.85)";
      ctx.fillText(mark, w / 2, y0 + barH * 0.72);
    } else {
      var fs = Math.max(14, Math.min(18, Math.round(barH * 0.45)));
      ctx.font = "600 " + fs + "px Inter, system-ui, sans-serif";
      ctx.fillStyle = "rgba(232,212,139,0.85)";
      ctx.fillText(mark, w / 2, y0 + barH / 2);
    }
    ctx.restore();
  };

  /* After bg image load, repaint text */
  var lastImg = null;
  setInterval(function(){
    var s = S();
    if (s.img && s.img !== lastImg) {
      lastImg = s.img;
      setTimeout(paint, 40);
    }
  }, 700);

  function boot(){ S(); setTimeout(paint, 500); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(paint, 800); });
})();
