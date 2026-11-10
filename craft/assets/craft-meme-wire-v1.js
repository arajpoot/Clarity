/*! craft-meme-wire-v1 · C19MEME5 · paint delegates to standard */
/*! craft-meme-wire-v1 · C15R1
 * Unifies: Companion section sources → canvas (mr-text/mr-src) + X/FB desks
 * Background scenery chips · push canvas → desks · responsive scale
 * Educational only — not a fatwa · scenery/geometry only for BG
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_MEME_WIRE_C15R1__) return;
  w.__CLARITY_CRAFT_MEME_WIRE_C15R1__ = true;

  var bgImage = null;
  var lastLine = { ar: "", en: "", ref: "" };

  function $(id) { return d.getElementById(id); }

  function setInput(id, val) {
    var el = $(id);
    if (!el) return;
    el.value = val || "";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function paintCanvas() {
    var btn = $("mr-render");
    if (btn) btn.click();
    else {
      var c = $("mr-canvas");
      if (c && typeof w.__craftMemePaint === "function") w.__craftMemePaint();
    }
  }

  /** Fill media bench + verse card + desks from one line object */
  function applyLine(line) {
    if (!line) return;
    var ar = line.ar || line.arabic || "";
    var en = line.en || line.english || "";
    var ref = line.ref || line.reference || "";
    lastLine = { ar: ar, en: en, ref: ref };

    var text = en || ar;
    if (ar && en) text = ar + " — " + en;
    else if (ar) text = ar;

    setInput("mr-text", text.slice(0, 280));
    setInput("mr-src", ref || "Educational source · clarity-dawah.fyi");

    var card = $("craft-verse-card");
    if (card) {
      card.textContent = [ar, en, ref ? "(" + ref + ")" : "", "— clarity-dawah.fyi · educational only"]
        .filter(Boolean)
        .join("\n");
      card.hidden = false;
    }

    var deskText = [ar, en, ref ? "(" + ref + ")" : "", "— clarity-dawah.fyi · educational only"]
      .filter(Boolean)
      .join("\n");
    setInput("x-draft", deskText.slice(0, 280));
    setInput("fb-draft", deskText);
    setInput("tw-draft", deskText.slice(0, 280));

    var st = $("meme-source-status");
    if (st) st.textContent = "Source on canvas + desks · educational only";

    /* defer paint until media bench exists */
    setTimeout(paintCanvas, 80);
    setTimeout(paintCanvas, 320);
  }

  /* Companion-compatible shims */
  w.clarityMemeFill = function (ar, en, ref) {
    applyLine({ ar: ar || "", en: en || "", ref: ref || "" });
  };
  w.clarityMemeSetCanvas = function (ar, en, ur, ref) {
    applyLine({ ar: ar || "", en: en || "", ref: ref || "" });
  };
  w.clarityMemePush = function (ar, en, ref) {
    applyLine({ ar: ar || "", en: en || "", ref: ref || "" });
  };

  /** Push current canvas fields → desks only */
  function pushCanvasToDesks() {
    var text = (($("mr-text") || {}).value || "").trim();
    var src = (($("mr-src") || {}).value || "").trim();
    if (!text) {
      var st = $("meme-wire-status");
      if (st) st.textContent = "Canvas text empty — load a section or type a reminder.";
      return;
    }
    var block = text + (src ? "\n(" + src + ")" : "") + "\n— clarity-dawah.fyi · educational only";
    setInput("x-draft", block.slice(0, 280));
    setInput("fb-draft", block);
    setInput("tw-draft", block.slice(0, 280));
    var st2 = $("meme-wire-status");
    if (st2) st2.textContent = "Pushed canvas → 𝕏 + Facebook desks";
  }

  /** Background scenery (no figurative people lists) */
  var BG = {
    nature: "https://picsum.photos/seed/clarity-nature-craft/1280/720",
    night: "https://picsum.photos/seed/clarity-night-craft/1280/720",
    water: "https://picsum.photos/seed/clarity-water-craft/1280/720",
    holy: "https://picsum.photos/seed/clarity-geom-craft/1280/720",
    blank: null
  };

    function loadBg(kind) {
    kind = (kind || "blank").toLowerCase();
    /* C15R1: prefer online catalog (holy/nature pools) when available */
    if (kind !== "blank" && typeof w.__memeOnlineFetch === "function") {
      try {
        w.__memeOnlineFetch(kind);
        var st = $("meme-fetch-status") || $("meme-wire-status");
        if (st) st.textContent = "Background: " + kind + " (online)";
        return;
      } catch (e) {}
    }
    var map = {
      nature: "https://picsum.photos/seed/clarity-nature-craft/1280/720",
      night: "https://picsum.photos/seed/clarity-night-craft/1280/720",
      water: "https://picsum.photos/seed/clarity-water-craft/1280/720",
      holy: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      flowers: "https://picsum.photos/seed/clarity-flowers-craft/1280/720",
      flickr: "https://picsum.photos/seed/clarity-free-craft/1280/720",
      geometry: "https://picsum.photos/seed/clarity-geom-craft/1280/720",
      blank: null
    };
    var url = map[kind];
    if (!url) {
      bgImage = null;
      var st0 = $("meme-fetch-status") || $("meme-wire-status");
      if (st0) st0.textContent = "Background: solid";
      try { paintWithBg(); } catch (e) {}
      return;
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      bgImage = img;
      var st1 = $("meme-fetch-status") || $("meme-wire-status");
      if (st1) st1.textContent = "Background: " + kind;
      try { paintWithBg(); } catch (e) {}
    };
    img.onerror = function () {
      bgImage = null;
      var st2 = $("meme-fetch-status") || $("meme-wire-status");
      if (st2) st2.textContent = "BG fetch failed · solid";
    };
    img.src = url;
  }

  function paintWithBg() {
    var canvas = $("mr-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var text = (($("mr-text") || {}).value || "").trim() || "Remember Allah with a calm heart.";
    var src = (($("mr-src") || {}).value || "").trim() || "Add source before sharing";
    var w = canvas.width, h = canvas.height;

    if (bgImage) {
      try {
        /* cover scale */
        var ir = bgImage.width / bgImage.height;
        var cr = w / h;
        var dw, dh, dx, dy;
        if (ir > cr) {
          dh = h; dw = h * ir; dx = (w - dw) / 2; dy = 0;
        } else {
          dw = w; dh = w / ir; dx = 0; dy = (h - dh) / 2;
        }
        ctx.drawImage(bgImage, dx, dy, dw, dh);
        ctx.fillStyle = "rgba(7, 20, 16, 0.55)";
        ctx.fillRect(0, 0, w, h);
      } catch (e) {
        bgImage = null;
      }
    }
    if (!bgImage) {
      var g1 = ctx.createLinearGradient(0, 0, w, h);
      g1.addColorStop(0, "#0d3d32");
      g1.addColorStop(1, "#071410");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.strokeStyle = "rgba(224,197,106,0.55)";
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    ctx.fillStyle = "#f3e6c0";
    ctx.font = "600 28px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    wrap(ctx, text, w / 2, h * 0.36, w - 100, 34);
    ctx.fillStyle = "rgba(224,197,106,0.95)";
    ctx.font = "500 16px Inter, system-ui, sans-serif";
    ctx.fillText(src, w / 2, h - 48);
    ctx.fillStyle = "rgba(243,230,192,0.55)";
    ctx.font = "12px Inter, system-ui, sans-serif";
    ctx.fillText("clarity-dawah.fyi · educational reminder", w / 2, h - 24);
  }

  function wrap(ctx, text, x, y, maxW, lineH) {
    var words = String(text).split(/\s+/);
    var line = "";
    var lines = [];
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = words[i];
      } else line = test;
    }
    if (line) lines.push(line);
    var start = y - ((lines.length - 1) * lineH) / 2;
    for (var j = 0; j < lines.length; j++) ctx.fillText(lines[j], x, start + j * lineH);
  }

  w.__craftMemePaint = paintWithBg;

  /** Hook CraftMemeSource.applyToDesks → also canvas */
  function patchSource() {
    if (!w.CraftMemeSource || w.CraftMemeSource.__wiredC14) return;
    var prev = w.CraftMemeSource.applyToDesks;
    w.CraftMemeSource.applyToDesks = function (text) {
      if (typeof prev === "function") prev(text);
      /* also try structured last fetch */
      var active = d.querySelector("[data-meme-section].active");
      var id = active ? active.getAttribute("data-meme-section") : "reminder";
      try {
        var result = w.CraftMemeSource.fetchSection(id);
        if (result && result.line) applyLine(result.line);
        else {
          setInput("mr-text", (text || "").split("\n")[0] || "");
          setTimeout(paintCanvas, 60);
        }
      } catch (e) {
        setInput("mr-text", (text || "").slice(0, 280));
        setTimeout(paintCanvas, 60);
      }
    };
    w.CraftMemeSource.__wiredC14 = true;
  }

  function scaleCanvas() {
    var c = $("mr-canvas");
    if (!c) return;
    var wrap = c.parentElement;
    if (!wrap) return;
    var maxW = Math.min(wrap.clientWidth || w.innerWidth, 720);
    if (maxW < 120) return;
    c.style.width = maxW + "px";
    c.style.height = "auto";
    c.style.maxWidth = "100%";
    c.style.display = "block";
    c.style.margin = "0 auto";
  }

  function bindUi() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        loadBg(btn.getAttribute("data-meme-bg"));
      });
    });
    var push = $("meme-push-desks");
    if (push) push.addEventListener("click", pushCanvasToDesks);
    var prev = $("meme-wire-preview");
    if (prev) prev.addEventListener("click", function () { paintWithBg(); });

    /* intercept media bench Preview to use our painter when bg set */
    var mr = $("mr-render");
    if (mr && !mr.__wiredC14) {
      mr.addEventListener("click", function () {
        setTimeout(function () {
          if (bgImage) paintWithBg();
          scaleCanvas();
        }, 30);
      });
      mr.__wiredC14 = true;
    }

    /* section chips already bound by craft-meme-source; reinforce */
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTimeout(patchSource, 0);
        setTimeout(function () {
          if (w.CraftMemeSource) {
            var id = btn.getAttribute("data-meme-section");
            var result = w.CraftMemeSource.fetchSection(id);
            if (result && result.line) applyLine(result.line);
          }
        }, 40);
      });
    });

    w.addEventListener("resize", scaleCanvas);
    scaleCanvas();
  }

  function boot() {
    patchSource();
    bindUi();
    /* after media studio mounts */
    setTimeout(function () {
      patchSource();
      bindUi();
      scaleCanvas();
      var active = d.querySelector("[data-meme-section].active");
      if (active && w.CraftMemeSource) {
        var result = w.CraftMemeSource.fetchSection(active.getAttribute("data-meme-section"));
        if (result && result.line) applyLine(result.line);
      }
    }, 500);
    setTimeout(function () { bindUi(); scaleCanvas(); }, 1200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 200); });
})(window, document);

(function(w){
  function toStd(){ if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch(e){} }
  w.paintWithBg = toStd;
  w.paintCanvas = toStd;
  setTimeout(function(){ w.paintWithBg = toStd; w.paintCanvas = toStd; }, 600);
})(window);
