/*! companion-meme-night-v1
 * Bottom strip → clarity-dawah.fyi (clickable) · size dropdowns (no sliders) · calm close
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_NIGHT_V1__) return;
  w.__COMPANION_MEME_NIGHT_V1__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.topY == null) s.topY = 0.26;
    if (s.midY == null) s.midY = 0.48;
    if (s.botY == null) s.botY = 0.7;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    return s;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  function injectCss() {
    if (d.getElementById("meme-night-css")) return;
    var s = d.createElement("style");
    s.id = "meme-night-css";
    s.textContent = [
      "#meme-rich-controls, #meme-peace-sliders, #meme-stable-size, #meme-post-v2-bar, #meme-stable-share { display:none !important; }",
      "#meme-night-size { margin:.35rem 0; padding:.4rem .55rem; border:1px solid rgba(212,180,90,.3); border-radius:10px; background:rgba(0,0,0,.18); font-size:.72rem; display:flex; flex-wrap:wrap; gap:.4rem .65rem; align-items:center; }",
      "#meme-night-size label { display:inline-flex; align-items:center; gap:.25rem; }",
      "#meme-night-size select { font-size:.72rem; padding:.15rem .3rem; border-radius:6px; }",
      "#meme-strip-link { position:absolute; left:10%; width:80%; bottom:4%; height:10%; z-index:8; cursor:pointer; border:0; background:transparent; }",
      "#meme-stage, .meme-stage-wrap { position:relative; }"
    ].join("\n");
    (d.head || d.documentElement).appendChild(s);
  }

  function stripNoise() {
    ["meme-rich-controls", "meme-peace-sliders", "meme-stable-size"].forEach(function (id) {
      d.querySelectorAll("#" + id).forEach(function (n) {
        n.style.display = "none";
        n.setAttribute("data-quarantine", "1");
      });
    });
    if (!d.getElementById("meme-rich-controls")) {
      var dummy = d.createElement("div");
      dummy.id = "meme-rich-controls";
      dummy.style.display = "none";
      dummy.setAttribute("data-quarantine", "1");
      (d.body || d.documentElement).appendChild(dummy);
    }
  }

  function injectDropdowns() {
    if (d.getElementById("meme-night-size")) return;
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    var box = d.createElement("div");
    box.id = "meme-night-size";
    var opts = [60, 80, 90, 100, 110, 120, 140, 160].map(function (n) {
      return '<option value="' + n + '">' + n + "%</option>";
    }).join("");
    box.innerHTML =
      '<span style="opacity:.85">Text size</span>' +
      '<label>Arabic <select id="nt-top">' + opts + "</select></label>" +
      '<label>English <select id="nt-mid">' + opts + "</select></label>" +
      '<label>Urdu/body <select id="nt-bot">' + opts + "</select></label>" +
      '<button type="button" class="btn-soft" id="nt-copy">Copy X text</button>' +
      '<button type="button" class="btn-soft" id="nt-post">Post on X</button>' +
      '<button type="button" class="btn-soft" id="nt-save">Save PNG</button>';
    var stage = d.getElementById("meme-stage") || d.getElementById("meme-canvas");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(box, stage.nextSibling);
    else root.appendChild(box);

    function setSel(id, val) {
      var el = d.getElementById(id);
      if (el) el.value = String(val);
    }
    setSel("nt-top", S().scaleTop || 100);
    setSel("nt-mid", S().scaleMid || 100);
    setSel("nt-bot", S().scaleBot || 95);

    ["nt-top", "nt-mid", "nt-bot"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el || el.__night) return;
      el.__night = true;
      el.addEventListener("change", function () {
        var map = { "nt-top": "scaleTop", "nt-mid": "scaleMid", "nt-bot": "scaleBot" };
        S()[map[id]] = parseInt(el.value, 10) || 100;
        paint();
      });
    });
    d.getElementById("nt-copy").onclick = function () {
      var t = sharePayload();
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { status("Copied"); });
    };
    d.getElementById("nt-post").onclick = function () {
      w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(sharePayload()), "_blank", "noopener");
    };
    d.getElementById("nt-save").onclick = function () {
      paint();
      try {
        var a = d.createElement("a");
        a.download = "clarity-meme.png";
        a.href = d.getElementById("meme-canvas").toDataURL("image/png");
        a.click();
      } catch (e) { status("Save blocked"); }
    };
  }

  function ensureStripLink() {
    var stage = d.getElementById("meme-stage") || (d.getElementById("meme-canvas") && d.getElementById("meme-canvas").parentElement);
    if (!stage) return;
    if (getComputedStyle(stage).position === "static") stage.style.position = "relative";
    var link = d.getElementById("meme-strip-link");
    if (!link) {
      link = d.createElement("a");
      link.id = "meme-strip-link";
      link.href = "https://clarity-dawah.fyi/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = "clarity-dawah.fyi · educational";
      link.setAttribute("aria-label", "Open clarity-dawah.fyi");
      stage.appendChild(link);
    }
  }

  function sharePayload() {
    var s = S();
    var ref = (s.ref || "").trim();
    if (ref && !/^Qur/i.test(ref) && /^\d+:\d+$/.test(ref)) ref = "Qur'an " + ref;
    var parts = [s.top, s.mid, ref, "educational only · clarity-dawah.fyi"].filter(Boolean);
    return parts.join("\n\n").slice(0, 280);
  }

  function fitFont(ctx, sample, maxW, maxSize, minSize) {
    var size = maxSize;
    ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    while (size > minSize && ctx.measureText(sample).width > maxW) {
      size -= 1;
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
    }
    return size;
  }
  function wrap(ctx, text, maxW) {
    text = (text || "").trim();
    if (!text) return [];
    var words = text.split(/\s+/), lines = [], line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width <= maxW || !line) line = test;
      else { lines.push(line); line = wd; }
    });
    if (line) lines.push(line);
    return lines.slice(0, 5);
  }

  function cleanRef(s) {
    var r = (s.ref || "").trim();
    var bot = (s.bottom || "").trim();
    if (!r && bot && /^Qur['']?an\s+\d+:\d+/i.test(bot)) r = bot;
    if (!r && bot && /^\d{1,3}:\d{1,3}$/.test(bot)) r = "Qur'an " + bot;
    // strip clock-like pollution from body
    if (bot && /^\d{1,2}:\d{2}$/.test(bot) && !/^Qur/i.test(bot)) s.bottom = "";
    r = r.replace(/^[\s"']+|[\s"']+$/g, "");
    var q = r.match(/(?:Qur['']?a?n)?\s*(\d{1,3})\s*[:：]\s*(\d{1,3})/i);
    if (q) {
      var a = parseInt(q[1], 10), b = parseInt(q[2], 10);
      if (a >= 1 && a <= 114 && b >= 1 && b <= 286) return "Qur'an " + a + ":" + b;
      return "";
    }
    if (/bukhārī|muslim|tirmidhī/i.test(r)) return r.slice(0, 60);
    return "";
  }

  function paint() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var rect = (stage || canvas).getBoundingClientRect();
    var cssW = Math.max(300, Math.floor(rect.width || 360));
    var ratio = 9 / 16;
    var active = d.querySelector("[data-meme-ratio].is-active, .mv-chip[data-meme-ratio].active");
    if (active) {
      var rr = active.getAttribute("data-meme-ratio") || "";
      if (rr === "1:1") ratio = 1;
      else if (rr === "9:16") ratio = 16 / 9;
      else if (rr === "16:9") ratio = 9 / 16;
    }
    var cssH = Math.floor(cssW * ratio);
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.borderRadius = "14px";
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var W = cssW, H = cssH;
    var s = S();
    var ti = d.getElementById("meme-top-input");
    var mi = d.getElementById("meme-mid-input");
    var bi = d.getElementById("meme-bottom-input");
    if (ti) s.top = ti.value;
    if (mi) s.mid = mi.value;
    if (bi) {
      var bv = (bi.value || "").trim();
      if (/qur|hadith|\d+:\d+/i.test(bv) && bv.length < 60) s.ref = bv;
      else if (bv) s.bottom = bv;
    }
    var verseRef = cleanRef(s);
    s.ref = verseRef;

    var bg = s.bgImage || s.img;
    if (bg && bg.complete && bg.naturalWidth) {
      try {
        var iw = bg.naturalWidth, ih = bg.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        ctx.drawImage(bg, (W - iw * sc) / 2, (H - ih * sc) / 2, iw * sc, ih * sc);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) { bg = null; }
    }
    if (!bg || !bg.naturalWidth) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1 || "#0b1220");
      g.addColorStop(1, s.blankColor2 || "#1a1030");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    var inset = Math.max(16, Math.floor(Math.min(W, H) * 0.05));
    var stripH = Math.max(28, Math.floor(H * 0.1));
    var safe = { x: inset, y: inset, w: W - inset * 2, h: H - inset * 2 - stripH * 0.9 };
    ctx.strokeStyle = "rgba(212,175,55,0.85)";
    ctx.lineWidth = Math.max(3, Math.floor(inset * 0.2));
    ctx.strokeRect(inset * 0.5, inset * 0.5, W - inset, H - inset);
    ctx.strokeStyle = "rgba(255,230,150,0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(inset * 0.85, inset * 0.85, W - inset * 1.7, H - inset * 1.7);

    // bottom promo band
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(inset, H - stripH - inset * 0.1, W - inset * 2, stripH);

    var maxW = safe.w * 0.92, cx = W / 2;
    function drawBlock(text, yFrac, scalePct, base) {
      text = (text || "").trim();
      if (!text) return;
      var yCenter = safe.y + safe.h * Math.max(0.08, Math.min(0.9, yFrac));
      var maxSize = Math.floor(base * (Math.max(50, Math.min(180, scalePct)) / 100));
      var size = fitFont(ctx, text.split(/\s+/).slice(0, 6).join(" "), maxW, maxSize, 10);
      ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.34 && size > 10) {
        size -= 1;
        ctx.font = "700 " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.28, blockH = lines.length * lh;
      var y0 = yCenter - blockH / 2 + size;
      if (y0 - size < safe.y) y0 = safe.y + size;
      if (y0 + blockH > safe.y + safe.h) y0 = Math.max(safe.y + size, safe.y + safe.h - blockH);
      lines.forEach(function (ln, i) {
        var y = y0 + i * lh;
        ctx.lineJoin = "round";
        ctx.strokeStyle = "rgba(0,0,0,0.65)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.1));
        ctx.fillStyle = "#fff8e7";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
    }

    drawBlock(s.top, s.topY, s.scaleTop, Math.floor(W * 0.055));
    drawBlock(s.mid, s.midY, s.scaleMid, Math.floor(W * 0.036));
    // verse reference in content band (not strip)
    if (verseRef) drawBlock(verseRef, Math.min(0.88, (s.botY || 0.7) + 0.02), Math.min(100, s.scaleBot || 95), Math.floor(W * 0.028));
    else if (s.bottom && !/^\d+:\d+$/.test(s.bottom)) drawBlock(s.bottom, s.botY, s.scaleBot, Math.floor(W * 0.032));

    // STRIP = clarity-dawah.fyi promo (never 21:87)
    var promo = "clarity-dawah.fyi";
    var pSize = Math.max(11, Math.floor(W * 0.028));
    ctx.font = "600 " + pSize + "px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255, 230, 150, 0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(promo, cx, H - stripH / 2 - inset * 0.05);

    ensureStripLink();
    return true;
  }

  function claim() {
    w.paintMeme = paint;
    w.memeDraw = paint;
    w.memePaintQuiet = paint;
    if (!w.ClarityMemePaintV2) w.ClarityMemePaintV2 = {};
    w.ClarityMemePaintV2.paint = paint;
    w.tdPost = function () {
      w.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(sharePayload()), "_blank", "noopener");
    };
    w.memeSharePayload = sharePayload;
  }

  function boot() {
    injectCss();
    stripNoise();
    injectDropdowns();
    claim();
    paint();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });
  w.addEventListener("resize", function () { paint(); });

  try {
    new MutationObserver(function () {
      stripNoise();
      if (!d.getElementById("meme-night-size")) injectDropdowns();
    }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  var n = 0;
  var iv = setInterval(function () {
    n++;
    stripNoise();
    claim();
    if (n >= 12) clearInterval(iv);
  }, 350);
})(window, document);
