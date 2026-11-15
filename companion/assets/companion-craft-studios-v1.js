/*! companion-craft-studios-v1 · mount-safe Meme + Calligraphy rehydrate
 * Shell innerHTML does not run archive inline scripts — this restores honest drawing.
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CRAFT_STUDIOS_V1__) return;
  w.__COMPANION_CRAFT_STUDIOS_V1__ = true;

  var loaded = {};

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (loaded[src]) return resolve();
      if (d.querySelector('script[src="' + src + '"]')) {
        loaded[src] = true;
        return resolve();
      }
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        loaded[src] = true;
        resolve();
      };
      s.onerror = function () {
        resolve();
      };
      d.head.appendChild(s);
    });
  }

  function loadCss(href) {
    if (d.querySelector('link[href="' + href + '"]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    d.head.appendChild(l);
  }

  /* —— Meme canvas (self-sufficient paint) —— */
  function memeState() {
    if (!w.memeState || typeof w.memeState !== "object") {
      w.memeState = {
        top: "",
        mid: "",
        bottom: "",
        fontSize: 42,
        topSize: 34,
        midSize: 20,
        bottomSize: 16,
        outline: 4,
        ratio: "twitter",
        blankColor1: "#0b1f18",
        blankColor2: "#1a3d2e"
      };
    }
    return w.memeState;
  }

  function syncInputsFromState() {
    var s = memeState();
    var map = [
      ["meme-top-input", "top"],
      ["meme-mid-input", "mid"],
      ["meme-bottom-input", "bottom"]
    ];
    map.forEach(function (pair) {
      var el = d.getElementById(pair[0]);
      if (el && s[pair[1]] && !el.value) el.value = s[pair[1]];
      if (el) s[pair[1]] = el.value || s[pair[1]] || "";
    });
  }

  function paintMeme() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return false;
    var stage = d.getElementById("meme-stage") || canvas.parentElement;
    var rect = (stage || canvas).getBoundingClientRect();
    var wdt = Math.max(320, Math.floor(rect.width || 360));
    var hgt = Math.max(180, Math.floor(wdt * 9 / 16));
    if (canvas.width !== wdt * 2) {
      canvas.width = wdt * 2;
      canvas.height = hgt * 2;
      canvas.style.width = "100%";
      canvas.style.height = "auto";
      canvas.style.display = "block";
      canvas.style.maxWidth = "100%";
    }
    var ctx = canvas.getContext("2d");
    if (!ctx) return false;
    var s = memeState();
    syncInputsFromState();
    // background gradient (honest default when no image)
    var g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    g.addColorStop(0, s.blankColor1 || "#0b1f18");
    g.addColorStop(1, s.blankColor2 || "#1a3d2e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (s.img && s.img.complete) {
      try {
        ctx.drawImage(s.img, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (e) {}
    }
    function drawLine(text, yFrac, size) {
      text = (text || "").trim();
      if (!text) return;
      var fontPx = Math.max(18, (size || 28) * (canvas.width / 1200));
      ctx.font = "700 " + fontPx + "px Amiri, Scheherazade New, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = Math.max(2, (s.outline || 4) * (canvas.width / 1200));
      ctx.strokeStyle = "rgba(0,0,0,0.85)";
      ctx.fillStyle = "#f7f0dd";
      var x = canvas.width / 2;
      var y = canvas.height * yFrac;
      // simple wrap
      var words = text.split(/\s+/);
      var lines = [];
      var line = "";
      var maxW = canvas.width * 0.88;
      words.forEach(function (wd) {
        var test = line ? line + " " + wd : wd;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = wd;
        } else line = test;
      });
      if (line) lines.push(line);
      var lh = fontPx * 1.25;
      var startY = y - ((lines.length - 1) * lh) / 2;
      lines.forEach(function (ln, i) {
        var yy = startY + i * lh;
        ctx.strokeText(ln, x, yy);
        ctx.fillText(ln, x, yy);
      });
    }
    drawLine(s.top || d.getElementById("meme-top-input") && d.getElementById("meme-top-input").value, 0.14, s.topSize || 34);
    drawLine(s.mid || d.getElementById("meme-mid-input") && d.getElementById("meme-mid-input").value, 0.45, s.midSize || 22);
    drawLine(s.bottom || d.getElementById("meme-bottom-input") && d.getElementById("meme-bottom-input").value, 0.82, s.bottomSize || 18);
    // watermark
    ctx.font = "600 " + Math.max(12, canvas.width * 0.018) + "px system-ui,sans-serif";
    ctx.fillStyle = "rgba(247,240,221,0.55)";
    ctx.textAlign = "right";
    ctx.fillText("clarity-dawah.fyi · educational", canvas.width - 24, canvas.height - 20);
    return true;
  }

  function bindMemeInputs() {
    ["meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el || el.__craftBound) return;
      el.__craftBound = true;
      el.addEventListener("input", function () {
        var s = memeState();
        if (id.indexOf("top") >= 0) s.top = el.value;
        if (id.indexOf("mid") >= 0) s.mid = el.value;
        if (id.indexOf("bottom") >= 0) s.bottom = el.value;
        paintMeme();
      });
    });
    // bg chips
    d.querySelectorAll("#cs-mount [data-meme-bg], #cs-mount .meme-bar button, #cs-mount .mv-chip").forEach(function (btn) {
      if (btn.__craftBg) return;
      btn.__craftBg = true;
      btn.addEventListener("click", function () {
        var label = (btn.textContent || "").toLowerCase();
        var s = memeState();
        if (/night/.test(label)) {
          s.blankColor1 = "#0a0f1c";
          s.blankColor2 = "#1a2744";
        } else if (/water/.test(label)) {
          s.blankColor1 = "#0a2a32";
          s.blankColor2 = "#0e4a5c";
        } else if (/spirit|holy/.test(label)) {
          s.blankColor1 = "#1a1528";
          s.blankColor2 = "#2d2150";
        } else if (/nature|flower/.test(label)) {
          s.blankColor1 = "#0f2418";
          s.blankColor2 = "#1e4d32";
        } else {
          s.blankColor1 = "#0b1f18";
          s.blankColor2 = "#1a3d2e";
        }
        paintMeme();
      });
    });
  }

  // public API compatible with canvas-clean
  w.clarityMemeFill = w.clarityMemeFill || function (ar, en, ref) {
    var s = memeState();
    s.top = ar || s.top;
    s.mid = en || s.mid;
    s.bottom = ref || s.bottom;
    var t = d.getElementById("meme-top-input");
    var m = d.getElementById("meme-mid-input");
    var b = d.getElementById("meme-bottom-input");
    if (t) t.value = s.top;
    if (m) m.value = s.mid;
    if (b) b.value = s.bottom;
    paintMeme();
  };

  /* —— Calligraphy pad —— */
  function initCallig() {
    var canvas = d.getElementById("callig-canvas");
    if (!canvas || canvas.__calligReady) return !!canvas;
    var wrap = d.getElementById("callig-stage-wrap") || canvas.parentElement;
    var wdt = Math.max(280, Math.floor((wrap && wrap.clientWidth) || 320));
    var hgt = Math.max(200, Math.floor(wdt * 0.55));
    canvas.width = wdt * 2;
    canvas.height = hgt * 2;
    canvas.style.width = "100%";
    canvas.style.height = hgt + "px";
    canvas.style.display = "block";
    canvas.style.touchAction = "none";
    canvas.style.background = "linear-gradient(180deg,#f7f0dd,#ebe2c8)";
    canvas.style.borderRadius = "12px";
    var ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 4;
    var drawing = false;
    function pos(ev) {
      var r = canvas.getBoundingClientRect();
      var src = ev.touches ? ev.touches[0] : ev;
      return {
        x: ((src.clientX - r.left) / r.width) * canvas.width,
        y: ((src.clientY - r.top) / r.height) * canvas.height
      };
    }
    function start(ev) {
      drawing = true;
      var p = pos(ev);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ev.preventDefault();
    }
    function move(ev) {
      if (!drawing) return;
      var p = pos(ev);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ev.preventDefault();
    }
    function end() {
      drawing = false;
    }
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);
    canvas.__calligReady = true;
    // clear button if present
    d.querySelectorAll("#callig-lab-card button").forEach(function (btn) {
      if (/clear/i.test(btn.textContent || "") && !btn.__calligClear) {
        btn.__calligClear = true;
        btn.addEventListener("click", function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      }
    });
    return true;
  }

  function tryRehydrate() {
    var root = d.getElementById("cs-mount");
    if (!root) return;
    var hasMeme = !!root.querySelector("#meme-canvas, #companion-meme-studio, #meme-card");
    var hasCallig = !!root.querySelector("#callig-canvas, #callig-lab-card");
    if (hasMeme) {
      loadCss("/assets/clarity-meme-layout-v1.css");
      Promise.all([
        loadScript("/assets/clarity-meme-canvas-clean-v1.js"),
        loadScript("/assets/clarity-meme-bg-fetch-v1.js")
      ]).then(function () {
        bindMemeInputs();
        paintMeme();
        // seed sample educational line if empty
        var s = memeState();
        if (!s.top && !s.mid) {
          w.clarityMemeFill(
            "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
            "Qurʾān 1:1 · educational only"
          );
        } else paintMeme();
      });
    }
    if (hasCallig) {
      loadScript("/assets/craft/calligraphy-studio-v1.js").then(function () {
        initCallig();
      });
      initCallig();
    }
    // unlock gated UI if unlock script present
    try {
      if (typeof w.syncMemeUi === "function") w.syncMemeUi();
    } catch (e) {}
  }

  function boot() {
    tryRehydrate();
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(tryRehydrate, 100);
      }).observe(mount, { childList: true, subtree: false });
    }
    w.addEventListener("resize", function () {
      paintMeme();
    });
  }

  w.ClarityCompanionCraft = { rehydrate: tryRehydrate, paintMeme: paintMeme, initCallig: initCallig };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
