/*! craft-meme-bridge-v1 · C15R4 · governance-bound
 * Connects: section sources → mr fields → wire paint
 *           online BG fetch → wire bgImage → canvas
 *           ensures #mr-root has a paintable canvas after MediaReminder open
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BRIDGE_C15R4__) return;
  w.__CRAFT_MEME_BRIDGE_C15R4__ = true;
  /* GOVERNANCE: G1 paint→scan · G2 sources-not-free-type-as-revelation · fail closed without clarityShariahScanUrl */

  function $(id) { return d.getElementById(id); }

  function ensureCanvas() {
    var root = $("mr-root");
    if (!root) return null;
    var c = $("meme-canvas") || $("mr-canvas") || root.querySelector("canvas");
    if (c) return c;
    var wrap = d.createElement("div");
    wrap.className = "craft-canvas-wrap";
    wrap.style.cssText = "width:100%;max-width:720px;margin:0.5rem auto;";
    c = d.createElement("canvas");
    c.id = "meme-canvas";
    c.width = 1200;
    c.height = 675;
    c.style.cssText = "width:100%;height:auto;display:block;border-radius:12px;background:#0b1f18;";
    wrap.appendChild(c);
    root.appendChild(wrap);
    return c;
  }

  function setFields(line) {
    if (!line) return;
    var t = $("mr-text");
    var s = $("mr-src");
    var card = $("craft-verse-card");
    var text = [line.ar, line.en].filter(Boolean).join("\n");
    var src = line.ref || "";
    if (t) {
      t.value = text;
      t.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (s) {
      s.value = src;
      s.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (card) {
      card.textContent = (line.ar ? line.ar + "\n" : "") + (line.en || "") + (src ? "\n" + src : "");
    }
  }

  function applyBgImage(img, kind) {
    if (!img) return;
    /* Prefer wire's paint path */
    try {
      if (typeof w.__craftMemePaint === "function") {
        /* set internal bg via load path: poke a custom event */
      }
    } catch (e) {}
    var c = ensureCanvas();
    if (!c) return;
    var ctx = c.getContext("2d");
    if (!ctx) return;
    var cw = c.width, ch = c.height;
    ctx.fillStyle = "#0b1f18";
    ctx.fillRect(0, 0, cw, ch);
    try {
      var ir = img.width / img.height;
      var cr = cw / ch;
      var dw, dh, dx, dy;
      if (ir > cr) {
        dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0;
      } else {
        dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    } catch (e) {
      ctx.fillStyle = "#12352a";
      ctx.fillRect(0, 0, cw, ch);
    }
    /* overlay last line if any */
    var card = $("craft-verse-card");
    var t = $("mr-text");
    var s = $("mr-src");
    var body = (t && t.value) || (card && card.textContent) || "";
    var src = (s && s.value) || "";
    if (body) {
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, ch * 0.28, cw, ch * 0.44);
      ctx.fillStyle = "#f3e6c0";
      ctx.textAlign = "center";
      ctx.font = "600 28px Amiri, serif";
      var lines = String(body).split(/\n/).slice(0, 4);
      var y = ch * 0.42;
      lines.forEach(function (ln, i) {
        ctx.fillText(ln.slice(0, 80), cw / 2, y + i * 36);
      });
      if (src) {
        ctx.fillStyle = "rgba(224,197,106,0.95)";
        ctx.font = "500 16px Quicksand, system-ui, sans-serif";
        ctx.fillText(src, cw / 2, ch - 48);
      }
      ctx.fillStyle = "rgba(243,230,192,0.55)";
      ctx.font = "12px Quicksand, system-ui, sans-serif";
      ctx.fillText("clarity-dawah.fyi · educational reminder", cw / 2, ch - 24);
    }
    var st = $("meme-fetch-status");
    if (st) st.textContent = "Background: " + (kind || "ready") + " · painted";
  }

  function loadUrlAsBg(url, kind) {
    if (!url) return;
    /* G1: Shariah scan mandatory — no paint path may skip */
    if (typeof w.clarityShariahScanUrl === "function") {
      var scan = w.clarityShariahScanUrl(url, kind || "");
      if (!scan.ok) {
        var st0 = $("meme-fetch-status");
        if (st0) st0.textContent = "Skipped non-compliant image (" + (scan.reason || "blocked") + ") · try another";
        return;
      }
    } else {
      var st1 = $("meme-fetch-status");
      if (st1) st1.textContent = "Shariah scan unavailable — refusing unscoped load";
      return; /* fail closed if audit missing */
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () { applyBgImage(img, kind); };
    img.onerror = function () {
      var st = $("meme-fetch-status");
      if (st) st.textContent = "BG failed · try another";
    };
    img.src = url;
  }

  /* Wrap online fetch so successful loads also paint Craft canvas */
  function wrapOnlineFetch() {
    var orig = w.__memeOnlineFetch;
    if (typeof orig !== "function" || orig._craftBridge) return;
    w.__memeOnlineFetch = function (kind) {
      kind = String(kind || "nature").toLowerCase();
      var st = $("meme-fetch-status");
      if (st) st.textContent = "Fetching " + kind + "…";
      /* Also try catalog from bg-fetch if pools empty */
      try { orig(kind); } catch (e) {}
      /* Direct safe fallbacks so paint always happens */
      var FALLBACK = {
        holy: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
        nature: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
        night: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80",
        water: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80",
        flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80",
        flickr: "https://picsum.photos/seed/clarity-craft-free/1280/720"
      };
      setTimeout(function () {
        /* If memeState has img, use it */
        try {
          if (w.memeState && w.memeState.img) {
            applyBgImage(w.memeState.img, kind);
            return;
          }
          if (w.memeState && w.memeState.bgImage) {
            applyBgImage(w.memeState.bgImage, kind);
            return;
          }
        } catch (e) {}
        if (FALLBACK[kind]) loadUrlAsBg(FALLBACK[kind], kind);
      }, 800);
    };
    w.__memeOnlineFetch._craftBridge = true;
    w.memeFetchBg = w.__memeOnlineFetch;
  }

  function bindSections() {
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      if (btn._bridgeSec) return;
      btn._bridgeSec = true;
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-section]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var id = btn.getAttribute("data-meme-section") || "reminder";
        var line = null;
        try {
          if (w.CraftMemeSource && typeof w.CraftMemeSource.fetchSection === "function") {
            line = w.CraftMemeSource.fetchSection(id);
          }
        } catch (e) {}
        if (line) setFields(line);
        var st = $("meme-source-status");
        if (st) st.textContent = "Section · " + id;
        /* re-paint if canvas exists */
        ensureCanvas();
        try {
          if (typeof w.__craftMemePaint === "function") w.__craftMemePaint();
        } catch (e) {}
      });
    });
  }

  function bindBg() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      if (btn._bridgeBg) return;
      btn._bridgeBg = true;
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var kind = btn.getAttribute("data-meme-bg") || "blank";
        if (kind === "blank") {
          var c = ensureCanvas();
          if (c) {
            var ctx = c.getContext("2d");
            ctx.fillStyle = "#0b1f18";
            ctx.fillRect(0, 0, c.width, c.height);
          }
          var st = $("meme-fetch-status");
          if (st) st.textContent = "Background: solid";
          return;
        }
        if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch(kind);
      });
    });
  }

  function bindExport() {
    var btn = $("meme-export-png") || d.querySelector("[data-meme-export='png']");
    if (btn && !btn._bridgeEx) {
      btn._bridgeEx = true;
      btn.addEventListener("click", function () {
        var c = ensureCanvas() || d.querySelector("#mr-root canvas");
        if (!c) return;
        try {
          var a = d.createElement("a");
          a.href = c.toDataURL("image/png");
          a.download = "clarity-craft-meme-" + Date.now() + ".png";
          a.click();
        } catch (e) {
          alert("Export blocked (tainted canvas or empty). Try solid BG.");
        }
      });
    }
    var prev = $("meme-wire-preview");
    if (prev && !prev._bridgePrev) {
      prev._bridgePrev = true;
      prev.addEventListener("click", function () {
        ensureCanvas();
        try {
          if (typeof w.__craftMemePaint === "function") w.__craftMemePaint();
        } catch (e) {}
        /* force redraw from fields */
        var t = $("mr-text");
        var card = $("craft-verse-card");
        if (t && t.value) setFields({ ar: "", en: t.value, ref: ($("mr-src") || {}).value || "" });
        var st = $("meme-fetch-status");
        if (st && /painted|ready|Background/.test(st.textContent || "")) {
          /* keep */
        }
      });
    }
  }

  function boot() {
    try {
      if (w.ClarityCraftStudioBoot) w.ClarityCraftStudioBoot.media();
      else if (w.ClarityMediaReminder) w.ClarityMediaReminder.open($("mr-root"));
    } catch (e) {}
    setTimeout(function () {
      ensureCanvas();
      wrapOnlineFetch();
      bindSections();
      bindBg();
      bindExport();
      var active = d.querySelector("[data-meme-section].active");
      if (active) active.click();
    }, 500);
    setTimeout(function () {
      wrapOnlineFetch();
      bindSections();
      bindBg();
      ensureCanvas();
    }, 1500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
