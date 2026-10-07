/**
 * Clarity Meme Enhance v3 — sleek toolbar, no ref on canvas, nature/galaxy HQ
 * Watermark strip already carries site reference.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_ENHANCE_V3__) return;
  g.__CLARITY_MEME_ENHANCE_V3__ = true;
  g.__CLARITY_MEME_ENHANCE_V2__ = true;

  function hash(s) {
    s = String(s || "");
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function textOf(el) {
    if (!el) return "";
    try {
      var body = el.querySelector(".tts-body, .verse-text, .ayah-text");
      return String((body || el).textContent || "")
        .replace(/\s+/g, " ")
        .replace(/🔊/g, "")
        .trim();
    } catch (e) {
      return String(el.textContent || "").trim();
    }
  }

  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "" };
    var ar = "", en = "", ref = "";
    try {
      if (card.id === "commands-card" && g.currentCommandVerse) {
        ar = g.currentCommandVerse.arabic || "";
        en = g.currentCommandVerse.english || g.currentCommandVerse.en || "";
        ref = g.currentCommandVerse.ref || "";
      }
      if ((!ar || !en) && g.currentJourneyVerse) {
        ar = ar || g.currentJourneyVerse.arabic || "";
        en = en || g.currentJourneyVerse.en || g.currentJourneyVerse.english || "";
        ref = ref || g.currentJourneyVerse.ref || "";
      }
    } catch (e0) {}
    if (!ar)
      ar = textOf(
        card.querySelector(
          "#cmd-ar-text, #cmd-arabic, .arabic, [lang='ar'], .cmd-ar, .sr-ar, .verse-ar, .ayah-ar, .hadith-ar"
        )
      );
    if (!en)
      en = textOf(
        card.querySelector(
          "#cmd-en-text, .cmd-en, .sr-en, .verse-en, .translation, .ayah-en, .english, .hadith-en"
        )
      );
    var refEl = card.querySelector(
      ".ref, .verse-ref, .sr-ref, .citation, [data-ref], .hadith-ref, .source"
    );
    if (!ref && refEl)
      ref = textOf(refEl) || (refEl.getAttribute("data-ref") || "").trim();
    en = en
      .replace(/Sahih International.*/i, "")
      .replace(/Recommended follow-up[\s\S]*/i, "")
      .replace(/I am working on this.*/i, "")
      .trim();
    if (!en) {
      var ps = card.querySelectorAll("p");
      for (var i = 0; i < ps.length; i++) {
        var t = textOf(ps[i]);
        if (t.length > 20 && !/[\u0600-\u06FF]{10}/.test(t) && !/Recommended/i.test(t)) {
          en = t.slice(0, 500);
          break;
        }
      }
    }
    return { ar: ar, en: en, ref: ref };
  }

  /** Apply Arabic + English only — no reference on canvas (watermark handles site) */
  function applyText(payload) {
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
      g.memeState.top = ar;
      g.memeState.mid = en;
      g.memeState.bottom = ""; // ref off canvas
      g.memeState.ref = ref; // keep for status / AI mood only
      g.memeState._lastRef = ref;
      g.memeState.outline = Math.max(g.memeState.outline || 0, 5);
      if (!g.memeState.topSize) g.memeState.topSize = 40;
      if (!g.memeState.midSize) g.memeState.midSize = 28;
      if (!g.memeState.bottomSize) g.memeState.bottomSize = 18;
      try {
        var i = document.getElementById("meme-top-input");
        var o = document.getElementById("meme-mid-input");
        var s = document.getElementById("meme-bottom-input");
        if (i) i.value = ar;
        if (o) o.value = en;
        if (s) s.value = ""; // clear bot ref field
      } catch (e1) {}
      if (typeof g.memeApplyVerseCard === "function") {
        try {
          g.memeApplyVerseCard(ar, en, "", ""); // empty ref on canvas
        } catch (e2) {}
      }
      g.memeState.top = ar || g.memeState.top;
      g.memeState.mid = en || g.memeState.mid;
      g.memeState.bottom = "";
      g.memeState.ref = ref;
      if (typeof g.memeAutoFitSizes === "function") {
        try {
          g.memeAutoFitSizes();
        } catch (e3) {}
      }
      function redraw() {
        try {
          if (g.memeState) {
            if (ar) g.memeState.top = ar;
            if (en) g.memeState.mid = en;
            g.memeState.bottom = "";
          }
          if (typeof g.memeDraw === "function") g.memeDraw();
        } catch (e4) {}
      }
      redraw();
      setTimeout(redraw, 100);
      setTimeout(redraw, 300);
    } catch (e) {
      console.warn("meme applyText", e);
    }
  }

  // Broader nature + galaxy styles (still no prophet likeness / no Quran calligraphy)
  var STYLES = [
    "ultra high resolution nature landscape mountains valley soft light, no people",
    "milky way galaxy stars night sky astrophotography high resolution, no text",
    "deep space nebula colorful cosmos high resolution astronomy photo, no figures",
    "ocean waves aerial coastline nature photography high resolution, no people",
    "forest path misty morning light nature only high resolution",
    "aurora borealis northern lights night sky high resolution, no people",
    "desert sand dunes golden hour vast landscape high resolution",
    "snow peaks alpine lake crystal clear reflection high resolution nature",
    "tropical waterfall lush greenery nature photography high resolution",
    "starfield long exposure night photography high resolution, no text"
  ];

  var BLOCK = /prophet|muhammad|messenger|sahaba|jesus|isa ibn|idol|crucifix|anime|cartoon god/i;

  function sanitizeTheme(text) {
    text = String(text || "")
      .replace(/[\u0600-\u06FF]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (BLOCK.test(text)) return "peaceful nature landscape soft light high resolution";
    return text.slice(0, 120) || "serene nature landscape";
  }

  function aiPrompt(en, ar, ref, styleIdx) {
    var base = sanitizeTheme(en || "peace patience nature");
    var style = STYLES[(styleIdx || 0) % STYLES.length];
    return (
      "Photorealistic " +
      style +
      ", 4k, NO human faces of prophets, NO Arabic calligraphy, NO Quran pages: mood " +
      base
    );
  }

  function stockFor(kind, payload) {
    var seed = hash((payload && payload.en) || "" + (kind || "") + Date.now());
    var s1 = seed % 9000;
    var s2 = (seed * 7) % 9000;
    var s3 = (seed * 13) % 9000;
    // High-res nature / space oriented chains
    var nature = [
      "https://picsum.photos/seed/n" + s1 + "/1920/1080",
      "https://picsum.photos/seed/n" + s2 + "/1920/1080",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nature_landscape.jpg/1280px-Nature_landscape.jpg"
    ];
    var galaxy = [
      "https://picsum.photos/seed/g" + s1 + "/1920/1080",
      "https://picsum.photos/seed/g" + s2 + "/1920/1080",
      "https://picsum.photos/seed/space" + s3 + "/1920/1080"
    ];
    var water = [
      "https://picsum.photos/seed/w" + s1 + "/1920/1080",
      "https://picsum.photos/seed/ocean" + s2 + "/1920/1080"
    ];
    var holy = [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Great_Mosque_of_Kairouan_Panorama.jpg/1280px-Great_Mosque_of_Kairouan_Panorama.jpg",
      "https://picsum.photos/seed/arch" + s1 + "/1920/1080"
    ];
    var map = {
      nature: nature,
      galaxy: galaxy,
      space: galaxy,
      night: galaxy,
      water: water,
      flowers: nature,
      spirit: nature,
      holy: holy,
      free: nature.concat(galaxy),
      dynamic: nature.concat(galaxy),
      flickr: nature
    };
    return map[kind] || nature.concat(galaxy);
  }

  function loadBgChain(urls, i) {
    i = i || 0;
    if (!urls || i >= urls.length) {
      if (typeof g.memeFetchStatus === "function")
        g.memeFetchStatus("Could not load background");
      return;
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (g.memeState) {
          g.memeState.bgImage = img;
          g.memeState.bg = "image";
        }
        if (typeof g.memeDraw === "function") g.memeDraw();
        if (typeof g.memeFetchStatus === "function")
          g.memeFetchStatus("Background ready · HQ");
      } catch (e) {}
    };
    img.onerror = function () {
      loadBgChain(urls, i + 1);
    };
    img.src = urls[i];
  }

  var aiStyleIdx = 0;

  function fetchAiBackground(payload) {
    payload = payload || {};
    aiStyleIdx = (aiStyleIdx + 1) % STYLES.length;
    var prompt = aiPrompt(
      payload.en || payload.english,
      payload.ar || payload.arabic,
      payload.ref,
      aiStyleIdx
    );
    var seed = (hash(prompt + aiStyleIdx + Date.now()) % 99999) + 1;
    var urls = [];
    for (var k = 0; k < 3; k++) {
      var p = aiPrompt(payload.en, payload.ar, payload.ref, aiStyleIdx + k * 2);
      var sd = (seed * (k + 3)) % 99999;
      urls.push(
        "https://image.pollinations.ai/prompt/" +
          encodeURIComponent(p) +
          "?width=1920&height=1080&nologo=true&seed=" +
          sd
      );
    }
    urls = urls.concat(stockFor("nature", payload));
    if (typeof g.memeFetchStatus === "function")
      g.memeFetchStatus(
        "AI scene " + (aiStyleIdx + 1) + "/" + STYLES.length + " · nature/galaxy…"
      );
    loadBgChain(urls, 0);
  }

  function fetchKind(kind) {
    var st = g.memeState || {};
    loadBgChain(stockFor(kind, { en: st.mid, ref: st.ref }), 0);
  }

  // Bridge native memeFetchBg if present
  var _nativeFetch = typeof g.memeFetchBg === "function" ? g.memeFetchBg : null;
  g.memeFetchBg = function (kind) {
    kind = kind || "nature";
    if (kind === "galaxy" || kind === "space" || kind === "nature" || kind === "night") {
      fetchKind(kind);
      return;
    }
    if (_nativeFetch) {
      try {
        _nativeFetch(kind);
        return;
      } catch (e) {}
    }
    fetchKind(kind);
  };

  function push(payload, mode) {
    payload = payload || {};
    applyText(payload);
    if (mode === "ai") fetchAiBackground(payload);
    else loadBgChain(stockFor("nature", payload), 0);
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e) {}
    setTimeout(function () {
      var card = document.getElementById("meme-card");
      if (card) {
        card.classList.remove("gate-hidden");
        card.style.removeProperty("display");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      applyText(payload);
    }, 200);
  }

  g.clarityMemePushFromCard = function (card, mode) {
    var p = extract(card);
    if (!p.ar && !p.en) {
      if (typeof g.memeFetchStatus === "function")
        g.memeFetchStatus("No verse text found");
      return;
    }
    push(p, mode || "stock");
  };

  function bannedCard(card) {
    if (!card) return true;
    if (card.closest("#clarity-top-duo, #clarity-global-nav, .banner")) return true;
    if (card.id === "meme-card" || card.id === "tweet-desk-card" || card.id === "notes-shell")
      return true;
    return false;
  }

  function ensurePills() {
    document.querySelectorAll(".card[id$='-card'], [id$='-card']").forEach(function (card) {
      if (bannedCard(card)) return;
      if (card.querySelector(".clarity-to-meme-pill")) return;
      var sample = extract(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 20) return;
      var row = card.querySelector(".clarity-action-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-action-row";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clarity-to-meme-pill clarity-action-chip";
      btn.textContent = "Meme";
      btn.title = "Push Arabic + translation (ref stays on watermark only)";
      btn.addEventListener("click", function (ev) {
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e0) {}
        g.clarityMemePushFromCard(card, "stock");
      });
      row.appendChild(btn);
    });
  }

  /** Single sleek toolbar: AI + all background options in one row above canvas */
  function ensureToolbar() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root) return;

    // Hide legacy top background bar
    var legacy = root.querySelector(".meme-bar-bg");
    if (legacy) {
      legacy.style.display = "none";
      legacy.setAttribute("aria-hidden", "true");
    }

    if (root.querySelector(".clarity-meme-toolbar")) return;

    var bar = document.createElement("div");
    bar.className = "clarity-meme-toolbar clarity-meme-ai-bar";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;margin:0.45rem 0 0.55rem;padding:0.25rem 0;";

    function chip(label, title, fn) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mv-chip";
      b.textContent = label;
      b.title = title || label;
      b.addEventListener("click", fn);
      return b;
    }

    function st() {
      return g.memeState || {};
    }

    bar.appendChild(
      chip("✨ AI scene", "New AI nature / galaxy scene", function () {
        fetchAiBackground({ ar: st().top, en: st().mid, ref: st().ref });
      })
    );
    bar.appendChild(
      chip("✨ AI again", "Another AI style", function () {
        fetchAiBackground({ ar: st().top, en: st().mid, ref: st().ref });
      })
    );
    bar.appendChild(
      chip("🌿 Nature", "HQ nature photo", function () {
        fetchKind("nature");
      })
    );
    bar.appendChild(
      chip("🌌 Galaxy", "HQ galaxy / space", function () {
        fetchKind("galaxy");
      })
    );
    bar.appendChild(
      chip("🌙 Night", "Night sky / aurora mood", function () {
        fetchKind("night");
      })
    );
    bar.appendChild(
      chip("💧 Water", "Ocean / water", function () {
        fetchKind("water");
      })
    );
    bar.appendChild(
      chip("🕌 Holy", "Mosque architecture", function () {
        fetchKind("holy");
      })
    );
    bar.appendChild(
      chip("📷 Free", "Next free HQ photo", function () {
        fetchKind("free");
      })
    );
    bar.appendChild(
      chip("⬛ Blank", "Solid blank", function () {
        try {
          if (typeof g.memeShowBlankPalette === "function") g.memeShowBlankPalette();
        } catch (e) {}
      })
    );
    bar.appendChild(
      chip("◈ Pattern", "Geometric décor", function () {
        try {
          if (typeof g.clarityMemeDecorBg === "function") g.clarityMemeDecorBg("geometry");
        } catch (e) {}
      })
    );

    var note = document.createElement("div");
    note.style.cssText =
      "flex:1 1 100%;font-size:0.7rem;opacity:0.82;line-height:1.3";
    note.textContent =
      "Scenery only · ref on watermark · discard images that resemble prophets or use Quran as decoration.";
    bar.appendChild(note);

    var stage =
      root.querySelector("#meme-stage-wrap") ||
      root.querySelector(".meme-preview-only");
    if (stage && stage.parentNode) stage.parentNode.insertBefore(bar, stage);
    else root.insertBefore(bar, root.firstChild);
  }

  function boot() {
    ensureToolbar();
    ensurePills();
    setTimeout(ensureToolbar, 500);
    setTimeout(ensurePills, 800);
    setTimeout(ensurePills, 2500);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__memeTb);
        g.__memeTb = setTimeout(function () {
          ensureToolbar();
          ensurePills();
        }, 400);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/**
 * Meme toggles + grid show/hide + 4x4 collage
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_GRID_TOGGLES_V2__) return;
  g.__CLARITY_MEME_GRID_TOGGLES_V2__ = true;
  g.__CLARITY_MEME_GRID_TOGGLES_V1__ = true;

  var opts = {
    showVerse: true,
    showCanvasFrame: true,
    showScene: true,
    showGrid: false,
    grid4x4: false
  };

  function state() {
    if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
    return g.memeState;
  }

  function redraw() {
    try {
      if (typeof g.memeDraw === "function") g.memeDraw();
    } catch (e) {}
  }

  function wrapDraw() {
    if (typeof g.memeDraw !== "function" || g.memeDraw.__gridWrapped2) return;
    var orig = g.memeDraw;
    function wrapped() {
      var st = state();
      var saved = {
        top: st.top,
        mid: st.mid,
        bottom: st.bottom,
        bgImage: st.bgImage
      };
      try {
        if (!opts.showVerse) {
          st.top = "";
          st.mid = "";
          st.bottom = "";
        }
        if (!opts.showScene) {
          st.bgImage = null;
          if (st.bg === "image") st.bg = "blank";
        }
        if (opts.grid4x4) {
          drawGrid4x4(saved);
        } else {
          orig.apply(this, arguments);
          if (opts.showGrid) drawGridOverlay();
          if (opts.showCanvasFrame) drawFrame();
        }
      } finally {
        st.top = saved.top;
        st.mid = saved.mid;
        st.bottom = saved.bottom;
        st.bgImage = saved.bgImage;
      }
    }
    wrapped.__gridWrapped2 = true;
    wrapped.__gridWrapped = true;
    g.memeDraw = wrapped;
  }

  function canvasCtx() {
    var canvas = document.getElementById("meme-canvas");
    if (!canvas || !canvas.getContext) return null;
    return { canvas: canvas, ctx: canvas.getContext("2d"), W: canvas.width || 1200, H: canvas.height || 675 };
  }

  function drawGridOverlay() {
    var c = canvasCtx();
    if (!c) return;
    var ctx = c.ctx, W = c.W, H = c.H;
    var cols = 4, rows = 4;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    for (var i = 1; i < cols; i++) {
      var x = (W / cols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (var j = 1; j < rows; j++) {
      var y = (H / rows) * j;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFrame() {
    var c = canvasCtx();
    if (!c) return;
    c.ctx.save();
    c.ctx.strokeStyle = "rgba(184,146,42,0.55)";
    c.ctx.lineWidth = 4;
    c.ctx.strokeRect(3, 3, c.W - 6, c.H - 6);
    c.ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    var words = String(text).split(/\s+/);
    var line = "", lines = [];
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

  function drawGrid4x4(saved) {
    var c = canvasCtx();
    if (!c) return;
    var ctx = c.ctx, W = c.W, H = c.H;
    var cols = 4, rows = 4;
    var cw = W / cols, ch = H / rows;
    ctx.fillStyle = "#0c1410";
    ctx.fillRect(0, 0, W, H);
    var img = opts.showScene ? saved.bgImage : null;
    for (var r = 0; r < rows; r++) {
      for (var col = 0; col < cols; col++) {
        var x = col * cw, y = r * ch;
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, cw, ch);
        ctx.clip();
        if (img && img.complete) {
          try {
            var sx = (col / cols) * (img.width - cw) * 0.15;
            var sy = (r / rows) * (img.height - ch) * 0.15;
            ctx.drawImage(img, sx, sy, img.width * 0.7, img.height * 0.7, x, y, cw, ch);
          } catch (e1) {
            ctx.fillStyle = "#1a2a22";
            ctx.fillRect(x, y, cw, ch);
          }
        } else {
          var gfill = ctx.createLinearGradient(x, y, x + cw, y + ch);
          gfill.addColorStop(0, "#0d4f3c");
          gfill.addColorStop(1, "#1a2a22");
          ctx.fillStyle = gfill;
          ctx.fillRect(x, y, cw, ch);
        }
        if (opts.showGrid) {
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, cw - 2, ch - 2);
        }
        ctx.restore();
      }
    }
    if (opts.showVerse) {
      var ar = saved.top || "";
      var en = saved.mid || "";
      var ref = saved.bottom || "";
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, H * 0.28, W, H * 0.44);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (ar) {
        ctx.fillStyle = "#fff";
        ctx.font = "600 " + Math.max(18, Math.floor(W / 28)) + "px Scheherazade New, serif";
        wrapText(ctx, ar, W / 2, H * 0.38, W * 0.9, Math.floor(W / 26));
      }
      if (en) {
        ctx.fillStyle = "#f0f4f1";
        ctx.font = "500 " + Math.max(14, Math.floor(W / 42)) + "px Inter, system-ui, sans-serif";
        wrapText(ctx, en, W / 2, H * 0.52, W * 0.88, Math.floor(W / 40));
      }
      if (ref) {
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "600 " + Math.max(12, Math.floor(W / 55)) + "px Inter, system-ui, sans-serif";
        ctx.fillText(ref, W / 2, H * 0.66);
      }
      ctx.restore();
    }
    if (opts.showCanvasFrame) drawFrame();
  }

  function toggle(key) {
    opts[key] = !opts[key];
    // Grid lines default on when entering 4x4
    if (key === "grid4x4" && opts.grid4x4 && !opts.showGrid) opts.showGrid = true;
    redraw();
    syncUi();
  }

  function syncUi() {
    var root = document.querySelector(".clarity-meme-toggle-bar");
    if (!root) return;
    root.querySelectorAll("[data-meme-toggle]").forEach(function (btn) {
      var k = btn.getAttribute("data-meme-toggle");
      var on = !!opts[k];
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("is-on", on);
    });
  }

  function ensureToggleBar() {
    var root =
      document.getElementById("meme-studio-root") ||
      document.getElementById("meme-card");
    if (!root) return;
    // Upgrade old bar
    var existing = root.querySelector(".clarity-meme-toggle-bar");
    if (existing) existing.remove();

    var bar = document.createElement("div");
    bar.className = "clarity-meme-toggle-bar";
    bar.style.cssText =
      "display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;margin:0.4rem 0 0.5rem;";

    function chip(key, label, title) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mv-chip clarity-meme-tog";
      b.setAttribute("data-meme-toggle", key);
      b.textContent = label;
      b.title = title;
      b.addEventListener("click", function () {
        toggle(key);
      });
      return b;
    }

    bar.appendChild(chip("showVerse", "Verse", "Show or hide verse text on canvas"));
    bar.appendChild(chip("showScene", "Scene", "Show or hide background / AI scene"));
    bar.appendChild(chip("showCanvasFrame", "Frame", "Show or hide canvas frame"));
    bar.appendChild(chip("showGrid", "Grid", "Show or hide 4×4 grid lines on canvas"));
    bar.appendChild(chip("grid4x4", "4×4 collage", "Collage mode: scene split into 4×4 cells"));

    var tip = document.createElement("span");
    tip.style.cssText = "font-size:0.7rem;opacity:0.8;margin-left:0.25rem";
    tip.textContent = "Grid = lines · 4×4 = collage layout";
    bar.appendChild(tip);

    var stage =
      root.querySelector("#meme-stage-wrap") ||
      root.querySelector(".meme-preview-only") ||
      root.querySelector(".clarity-meme-ai-bar");
    if (stage && stage.parentNode) {
      if (stage.classList.contains("clarity-meme-ai-bar") && stage.nextSibling) {
        stage.parentNode.insertBefore(bar, stage.nextSibling);
      } else {
        stage.parentNode.insertBefore(bar, stage);
      }
    } else {
      root.insertBefore(bar, root.firstChild);
    }
    syncUi();
  }

  function boot() {
    wrapDraw();
    ensureToggleBar();
    setTimeout(function () {
      wrapDraw();
      ensureToggleBar();
      syncUi();
    }, 700);
    setTimeout(function () {
      wrapDraw();
      ensureToggleBar();
    }, 2000);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityMemeToggles = {
    opts: opts,
    redraw: redraw,
    set: function (k, v) {
      opts[k] = !!v;
      redraw();
      syncUi();
    }
  };
})(typeof window !== "undefined" ? window : this);
