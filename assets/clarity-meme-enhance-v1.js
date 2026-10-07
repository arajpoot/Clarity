/**
 * Clarity Meme Studio Enhance v1
 * - Pills push Arabic + English + reference
 * - Thematic stock backgrounds
 * - AI scene from text (pollinations) — high-res educational illustration
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_ENHANCE_V1__) return;
  g.__CLARITY_MEME_ENHANCE_V1__ = true;

  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "" };
    var arEl = card.querySelector('.arabic,[lang="ar"],.cmd-ar,.sr-ar,.verse-ar,.ayah-ar,.hadith-ar,.rabbana-arabic');
    var enEl = card.querySelector('.cmd-en,.sr-en,.verse-en,.translation,.ayah-en,.english,.hadith-en');
    var refEl = card.querySelector('.ref,.verse-ref,.sr-ref,.citation,[data-ref],.hadith-ref,.source');
    var ar = arEl ? (arEl.textContent || "").trim() : "";
    var en = enEl ? (enEl.textContent || "").trim() : "";
    var ref = refEl ? (refEl.textContent || refEl.getAttribute("data-ref") || "").trim() : "";
    if (!ref) {
      var h = ((card.querySelector("h2,h3,.card-title") || {}).textContent || "");
      var m = h.match(/(\d+\s*:\s*\d+)/);
      if (m) ref = "Qur\u2019an " + m[1].replace(/\s/g, "");
    }
    if (!ar && g.currentCommandVerse && card.id === "commands-card") {
      ar = g.currentCommandVerse.arabic || "";
      en = en || g.currentCommandVerse.english || "";
      ref = ref || g.currentCommandVerse.ref || "";
    }
    return { ar: ar, en: en, ref: ref };
  }

  function themeQuery(ar, en, ref) {
    var blob = [ar, en, ref].join(" ");
    var pairs = [
      [/grave|death|akhirah|qabr/i, "peaceful islamic garden night soft light"],
      [/salah|prayer|sujud/i, "mosque prayer hall soft daylight architecture"],
      [/mercy|rahman|forgiv|tawba/i, "sunrise over calm hills golden light"],
      [/jannah|paradise|garden/i, "lush green garden river soft mist"],
      [/kaaba|makkah|haram/i, "kaaba masjid al haram wide peaceful"],
      [/madinah|nabawi/i, "madinah green dome mosque serene"],
      [/night|qiyam|tahajjud/i, "night sky stars mosque silhouette"],
      [/parent|mother|father/i, "warm home light family silhouette respectful"],
      [/water|rain|sea/i, "calm water reflection soft sky"],
      [/quran|ayah|kitab/i, "open quran soft bokeh warm lamp"]
    ];
    for (var i = 0; i < pairs.length; i++) {
      if (pairs[i][0].test(blob)) return pairs[i][1];
    }
    return "islamic architecture peaceful soft light high detail";
  }

  function loadImage(url, onOk, onFail) {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
        g.memeState.img = img;
        g.memeState.blank = false;
        if (typeof g.memeDraw === "function") g.memeDraw();
        if (typeof g.memeFetchStatus === "function") g.memeFetchStatus("Background ready");
      } catch (e) {}
      if (onOk) onOk(img);
    };
    img.onerror = function () { if (onFail) onFail(); };
    img.src = url;
  }

  function loadBgChain(urls, i) {
    i = i || 0;
    if (i >= urls.length) return;
    loadImage(urls[i], null, function () { loadBgChain(urls, i + 1); });
  }

    var BLOCK = /prophet|muhammad|messenger|sahaba|companion face|jesus|isa ibn|musa face|idol|statue of|crucifix|church icon|anime|cartoon god/i;
  function sanitizeTheme(text) {
    text = String(text || "").replace(/[\u0600-\u06FF]+/g, " ").replace(/\s+/g, " ").trim();
    if (BLOCK.test(text)) {
      return "peaceful mosque architecture soft daylight empty courtyard respectful educational";
    }
    text = text.replace(/\b(kill|blood|war|fire of hell|torture)\b/gi, "solemn reflection");
    return text.slice(0, 160) || "peaceful islamic architecture soft light";
  }
  function aiPrompt(en, ar, ref) {
    var base = sanitizeTheme(en || "peaceful reflection");
    return (
      "Photorealistic landscape or architecture only, educational, respectful Islamic cultural setting, " +
      "NO human faces of prophets or companions, NO Arabic calligraphy, NO Quran mushaf pages as art, " +
      "NO idols or statues of living beings for worship, empty or distant anonymous figures only if needed, " +
      "high resolution, soft natural light, serene: " + base +
      (ref ? " mood inspired by " + String(ref).slice(0, 40) : "")
    );
  }

  function fetchAiBackground(payload) {
    payload = payload || {};
    var prompt = aiPrompt(payload.en || payload.english, payload.ar || payload.arabic, payload.ref);
    var url =
      "https://image.pollinations.ai/prompt/" +
      encodeURIComponent(prompt) +
      "?width=1600&height=900&nologo=true&seed=" +
      (Math.abs(hash(prompt)) % 99999);
    if (typeof g.memeFetchStatus === "function")
      g.memeFetchStatus("Designing AI scene…");
    loadBgChain(
      [
        url,
        "https://picsum.photos/seed/clarity" + (hash(prompt) % 9000) + "/1600/900",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"
      ],
      0
    );
  }

  function hash(s) {
    s = String(s || "");
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
  }

  function stockFor(payload) {
    var q = themeQuery(payload.ar, payload.en, payload.ref);
    var seed = hash(q + (payload.ref || ""));
    return [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Great_Mosque_of_Kairouan_Panorama.jpg/1280px-Great_Mosque_of_Kairouan_Panorama.jpg",
      "https://picsum.photos/seed/c" + (seed % 9000) + "/1600/900"
    ];
  }

  function applyText(payload) {
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      if (typeof g.memeApplyVerseCard === "function") {
        g.memeApplyVerseCard(ar, en, "", ref);
      } else if (g.memeState) {
        g.memeState.top = ar;
        g.memeState.mid = en;
        g.memeState.bottom = ref;
        g.memeState.ref = ref;
        g.memeState._lastRef = ref;
        if (typeof g.memeDraw === "function") g.memeDraw();
      }
      if (g.memeState) {
        g.memeState.outline = Math.max(g.memeState.outline || 0, 4);
        if (typeof g.memeAutoFitSizes === "function") g.memeAutoFitSizes();
      }
    } catch (e) {}
  }

  function push(payload, mode) {
    payload = payload || {};
    applyText(payload);
    if (mode === "ai") fetchAiBackground(payload);
    else loadBgChain(stockFor(payload), 0);
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
    }, 80);
  }

  /* Override global push to always include mid+ref and bg */
  g.clarityPushToMemeDesk = function (payload) {
    push(payload, "stock");
  };
  g.clarityMemeAiBackground = function (payload) {
    payload = payload || {
      ar: (g.memeState && g.memeState.top) || "",
      en: (g.memeState && g.memeState.mid) || "",
      ref: (g.memeState && g.memeState.ref) || ""
    };
    fetchAiBackground(payload);
  };

  function ensureStudioControls() {
    var root = document.getElementById("meme-studio-root") || document.getElementById("meme-card");
    if (!root || root.querySelector(".clarity-meme-ai-btn")) return;
    var row = root.querySelector(".meme-bg-row, .meme-tools, .clarity-meme-pill-row") || root;
    var bar = document.createElement("div");
    bar.className = "clarity-meme-ai-bar";
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.5rem 0;align-items:center";
    var ai = document.createElement("button");
    ai.type = "button";
    ai.className = "btn-soft clarity-meme-ai-btn";
    ai.textContent = "✨ AI scene";
    ai.title = "AI scenery from meaning — no prophet likeness, no Quran calligraphy as decoration. Educational. Review before share.";
    ai.addEventListener("click", function () {
      g.clarityMemeAiBackground();
    });
    var stock = document.createElement("button");
    stock.type = "button";
    stock.className = "btn-soft";
    stock.textContent = "🖼️ Match photo";
    stock.title = "Fetch a photo matching the message";
    stock.addEventListener("click", function () {
      var p = {
        ar: (g.memeState && g.memeState.top) || "",
        en: (g.memeState && g.memeState.mid) || "",
        ref: (g.memeState && g.memeState.ref) || ""
      };
      loadBgChain(stockFor(p), 0);
    });
    bar.appendChild(ai);
    bar.appendChild(stock); var note=document.createElement("span"); note.style.cssText="font-size:0.72rem;opacity:0.85;max-width:100%"; note.textContent="Scenery only — discard images that resemble prophets or use Quran as decoration."; bar.appendChild(note);
    try {
      var anchor = root.querySelector("#meme-canvas, canvas, .meme-preview");
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(bar, anchor);
      else row.appendChild(bar);
    } catch (e) {
      row.appendChild(bar);
    }
  }

  function bannedCard(card) {
    if (!card) return true;
    if (card.closest("#clarity-top-duo, #clarity-global-nav, .global-nav, .banner")) return true;
    if (card.id === "meme-card" || card.id === "tweet-desk-card" || card.id === "notes-shell") return true;
    return false;
  }
  function ensurePills() {
    var memeOk = true;
    try {
      memeOk = document.documentElement.getAttribute("data-clarity-meme-ok") !== "0";
    } catch (e) {}
    document.querySelectorAll(".card[id], [id$='-card'], .search-result, .cmd-card, .verse-card, .hadith-card").forEach(function (card) {
      if (bannedCard(card)) return;
      if (card.querySelector(".clarity-to-meme-pill")) return;
      var sample = extract(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 18) return;
      var row = card.querySelector(".sr-actions, .card-actions, .clarity-meme-pill-row, .clarity-notes-pill-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-action-row";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clarity-to-meme-pill clarity-action-chip";
      btn.textContent = "Meme";
      btn.style.display = memeOk ? "inline-flex" : "none";
      btn.addEventListener("click", function (ev) {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
        var p = extract(card);
        push({ arabic: p.ar, en: p.en, ref: p.ref }, "stock");
      });
      row.appendChild(btn);
    });
    ensureStudioControls();
  }

  function boot() {
    ensurePills();
    setTimeout(ensurePills, 900);
    setTimeout(ensurePills, 2800);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__memeEnhT);
        g.__memeEnhT = setTimeout(ensurePills, 400);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(ensurePills, 500); });
})(typeof window !== "undefined" ? window : this);
