/*! companion-meme-quiet-fit-v1
 * Safe-area auto-fit · edge frame · bottom reference strip · quieter status
 * Educational only — not a fatwa. Scenery backgrounds preferred.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_QUIET_FIT_V1__) return;
  w.__COMPANION_MEME_QUIET_FIT_V1__ = true;

  var STATUS_LAST = 0;
  function softStatus(msg) {
    var now = Date.now();
    if (now - STATUS_LAST < 400 && msg && msg.indexOf("…") >= 0) return;
    STATUS_LAST = now;
    var el =
      d.getElementById("meme-fetch-status") ||
      d.getElementById("meme-rrra-status");
    if (!el) return;
    // drop noisy micro-acks like "holy · ok"
    if (msg && /·\s*ok\s*$/i.test(msg)) msg = "";
    if (msg && /^(ok|ready|done)$/i.test(String(msg).trim())) msg = "";
    el.textContent = msg || "";
  }

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") {
      w.memeState = {
        top: "",
        mid: "",
        bottom: "",
        ref: "",
        topSize: 42,
        midSize: 22,
        bottomSize: 14,
        outline: 3,
        blankColor1: "#0b1220",
        blankColor2: "#1a1030"
      };
    }
    return w.memeState;
  }

  function readInputs() {
    var s = S();
    [
      ["meme-top-input", "top"],
      ["meme-mid-input", "mid"],
      ["meme-bottom-input", "bottom"]
    ].forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) s[p[1]] = el.value || "";
    });
    var bot = (s.bottom || "").trim();
    if (/qur.?n|ḥadīth|hadith|bukhār|muslim|sunnah|ayah|āyah|:\s*\d/i.test(bot)) {
      s.ref = bot;
    }
    var refEl = d.querySelector("#meme-ref, .meme-ref, [data-verse-ref]");
    if (refEl) {
      var rv = (refEl.value || refEl.textContent || "").trim();
      if (rv) s.ref = rv;
    }
    return s;
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
    // Arabic-friendly: split on spaces; long tokens stay intact
    var words = text.split(/\s+/);
    var lines = [];
    var line = "";
    words.forEach(function (wd) {
      var test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width <= maxW || !line) {
        line = test;
      } else {
        lines.push(line);
        line = wd;
      }
    });
    if (line) lines.push(line);
    return lines.slice(0, 6);
  }

  function paintQuiet() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var rect = (stage || canvas).getBoundingClientRect();
    var cssW = Math.max(300, Math.floor(rect.width || 360));
    var ratio = 9 / 16;
    var active = d.querySelector(
      "[data-meme-ratio].is-active, .mv-chip[data-meme-ratio].active, button[data-meme-ratio].active"
    );
    if (active) {
      var r = active.getAttribute("data-meme-ratio") || "";
      if (r === "1:1") ratio = 1;
      else if (r === "9:16") ratio = 16 / 9;
      else if (r === "16:9") ratio = 9 / 16;
      else if (r.indexOf("1.91") >= 0) ratio = 1 / 1.91;
    }
    var cssH = Math.floor(cssW * ratio);
    var dpr = Math.min(2, w.devicePixelRatio || 1);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.style.display = "block";
    canvas.style.borderRadius = "12px";

    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var W = cssW;
    var H = cssH;
    var s = readInputs();

    // Background
    if (s.img && s.img.complete && s.img.naturalWidth) {
      try {
        var iw = s.img.naturalWidth,
          ih = s.img.naturalHeight;
        var sc = Math.max(W / iw, H / ih);
        var dw = iw * sc,
          dh = ih * sc;
        ctx.drawImage(s.img, (W - dw) / 2, (H - dh) / 2, dw, dh);
        ctx.fillStyle = "rgba(0,0,0,0.34)";
        ctx.fillRect(0, 0, W, H);
      } catch (e) {
        s.img = null;
      }
    }
    if (!s.img) {
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.blankColor1 || "#0b1220");
      g.addColorStop(1, s.blankColor2 || "#1a1030");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // —— Safe frame (visible border + auto-scale limit) ——
    var inset = Math.max(14, Math.floor(Math.min(W, H) * 0.045));
    var stripH = Math.max(32, Math.floor(H * 0.11));
    var safe = {
      x: inset,
      y: inset,
      w: W - inset * 2,
      h: H - inset * 2 - stripH
    };

    // outer decorative border
    ctx.save();
    ctx.strokeStyle = "rgba(212,180,90,0.55)";
    ctx.lineWidth = Math.max(2, Math.floor(inset * 0.18));
    ctx.strokeRect(inset * 0.45, inset * 0.45, W - inset * 0.9, H - inset * 0.9);
    // inner safe-area guide (subtle)
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(safe.x, safe.y, safe.w, safe.h);
    ctx.setLineDash([]);
    ctx.restore();

    // bottom reference band background
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(0, H - stripH - inset * 0.3, W, stripH + inset * 0.3);

    var maxW = safe.w * 0.96;
    var cx = W / 2;

    function drawBlock(text, yCenter, maxSize, weight) {
      text = (text || "").trim();
      if (!text) return yCenter;
      var sample = text.split(/\s+/).slice(0, 5).join(" ");
      var size = fitFont(ctx, sample, maxW, maxSize, 11);
      ctx.font = weight + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
      var lines = wrap(ctx, text, maxW);
      while (lines.length * size * 1.28 > safe.h * 0.4 && size > 11) {
        size -= 1;
        ctx.font = weight + " " + size + "px Amiri, 'Scheherazade New', 'Noto Naskh Arabic', serif";
        lines = wrap(ctx, text, maxW);
      }
      var lh = size * 1.28;
      var blockH = lines.length * lh;
      var y0 = yCenter - blockH / 2 + size;
      // clamp vertically inside safe
      if (y0 - size < safe.y) y0 = safe.y + size;
      if (y0 + blockH > safe.y + safe.h) y0 = safe.y + safe.h - blockH;

      lines.forEach(function (ln, i) {
        var y = y0 + i * lh;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.strokeStyle = "rgba(0,0,0,0.72)";
        ctx.lineWidth = Math.max(2, Math.floor(size * 0.12));
        ctx.fillStyle = "#f7f3e8";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.strokeText(ln, cx, y);
        ctx.fillText(ln, cx, y);
      });
      return y0 + blockH;
    }

    var top = s.top || "";
    var mid = s.mid || "";
    var ref = (s.ref || "").trim();
    var bot = (s.bottom || "").trim();
    if (ref && bot === ref) bot = "";
    if (!ref && /qur.?n|hadith|bukhār|muslim|:\s*\d/i.test(bot)) {
      ref = bot;
      bot = "";
    }

    // vertical slots inside safe area
    var slot1 = safe.y + safe.h * 0.28;
    var slot2 = safe.y + safe.h * 0.58;
    var slot3 = safe.y + safe.h * 0.82;
    drawBlock(top, slot1, Math.floor(W * 0.05), "700");
    drawBlock(mid, slot2, Math.floor(W * 0.036), "600");
    if (bot) drawBlock(bot, slot3, Math.floor(W * 0.03), "600");

    // reference in lower border band
    if (ref) {
      var rSize = Math.max(10, Math.floor(W * 0.028));
      ctx.font = "600 " + rSize + "px system-ui, sans-serif";
      var rLines = wrap(ctx, ref, maxW);
      while (rLines.length * rSize * 1.2 > stripH - 8 && rSize > 9) {
        rSize -= 1;
        ctx.font = "600 " + rSize + "px system-ui, sans-serif";
        rLines = wrap(ctx, ref, maxW);
      }
      ctx.fillStyle = "rgba(247,243,232,0.92)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var ry = H - stripH / 2 - inset * 0.1;
      if (rLines.length === 1) {
        ctx.fillText(rLines[0], cx, ry);
      } else {
        rLines.slice(0, 2).forEach(function (ln, i) {
          ctx.fillText(ln, cx, ry + (i - 0.5) * rSize * 1.15);
        });
      }
    }

    return true;
  }

  // Quieter auto-scale: only within safe width 82%, floor 60%
  function autoScaleQuiet() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var s = S();
    readInputs();
    var W = canvas.clientWidth || canvas.width || 360;
    var maxW = W * 0.82;
    function fit(text, base) {
      if (!text) return 100;
      var pct = 100;
      for (var g = 0; g < 30; g++) {
        var size = Math.max(11, Math.round(base * pct / 100));
        ctx.font = "bold " + size + "px Amiri, 'Noto Naskh Arabic', serif";
        if (ctx.measureText(text).width <= maxW) break;
        pct -= 4;
        if (pct < 60) break;
      }
      return Math.max(60, Math.min(120, pct));
    }
    var pt = fit(s.top || "", 36);
    var pm = fit(s.mid || "", 22);
    var pb = fit(s.ref || s.bottom || "", 14);
    s.scaleTop = pt;
    s.scaleMid = pm;
    s.scaleBottom = pb;
    s.topSize = Math.round(36 * pt / 100);
    s.midSize = Math.round(22 * pm / 100);
    s.bottomSize = Math.round(14 * pb / 100);
    ["top", "mid", "bottom"].forEach(function (which) {
      var el = d.getElementById("meme-scale-" + which);
      if (el) el.value = String(which === "top" ? pt : which === "mid" ? pm : pb);
    });
    softStatus("Fit · inside safe frame");
    paintQuiet();
  }

  // Single paint pipeline — collapse multi-timeout noise
  var paintTimer = null;
  function schedulePaint(why) {
    if (paintTimer) clearTimeout(paintTimer);
    paintTimer = setTimeout(function () {
      paintTimer = null;
      paintQuiet();
    }, 60);
  }

  // Rewire fetch helpers if present
  var prevFetchBg = w.memeFetchBg;
  var prevFetchText = null;

  function wirePills() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-bg], .mv-chip[data-meme-bg]").forEach(function (btn) {
      if (btn.__quietBg) return;
      btn.__quietBg = true;
      btn.addEventListener(
        "click",
        function () {
          var kind = btn.getAttribute("data-meme-bg") || (btn.textContent || "").trim();
          softStatus("Scene · " + kind);
          schedulePaint("bg");
        },
        true
      );
    });
    root.querySelectorAll("[data-meme-text], [data-meme-fetch], .meme-rrra-fetch-bar button").forEach(function (btn) {
      if (btn.__quietTx) return;
      btn.__quietTx = true;
      btn.addEventListener(
        "click",
        function () {
          softStatus("Text · loading");
          schedulePaint("text");
          setTimeout(function () {
            schedulePaint("text2");
            softStatus("");
          }, 700);
        },
        true
      );
    });
    var autoBtn = root.querySelector('[data-meme-act="autoscale"], button[onclick*="autoScale"], #meme-autoscale');
    // Auto-scale checkbox
    root.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      if ((cb.id || "").indexOf("auto") >= 0 || (cb.parentElement && /auto-scale/i.test(cb.parentElement.textContent || ""))) {
        cb.addEventListener("change", function () {
          if (cb.checked) autoScaleQuiet();
          else schedulePaint("manual");
        });
      }
    });
  }

  // Override global paint entry points used by studio
  w.memePaintQuiet = paintQuiet;
  var oldPaint = w.memePaint || w.paint;
  w.ClarityMemePaintV2 = w.ClarityMemePaintV2 || {};
  w.ClarityMemePaintV2.paint = paintQuiet;
  w.memeAutoScaleLines = autoScaleQuiet;

  // Hook after original meme studio paint if defined later
  function install() {
    try {
      if (typeof w.memeState === "object") {
        /* ok */
      }
      paintQuiet();
      wirePills();
    } catch (e) {}
  }

  // Replace noisy status if studio exposes it
  var tries = 0;
  var iv = setInterval(function () {
    tries++;
    install();
    if (tries > 20) clearInterval(iv);
  }, 300);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", install);
  else install();

  d.addEventListener("clarity:tab-mounted", function () {
    setTimeout(install, 100);
  });
  w.addEventListener("resize", function () {
    schedulePaint("resize");
  });

  // Debounced mutation on mount
  var m = d.getElementById("cs-mount") || d.body;
  if (m && typeof MutationObserver !== "undefined") {
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        wirePills();
        schedulePaint("mut");
      }, 120);
    }).observe(m, { childList: true, subtree: true });
  }
})(window, document);
