/*! craft-meme-automation-v1 · C19MEME1
 * Scenery-only BG · hardened fetch · daily verse+scene · post-ready desks
 * Educational only — not a fatwa · no free-type scripture as revelation
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_AUTO_C19MEME1__) return;
  w.__CRAFT_MEME_AUTO_C19MEME1__ = true;

  var SAFE_KINDS = ["nature", "night", "water", "flowers", "solid"];
  var KIND_QUERIES = {
    nature: ["nature landscape mountains forest trees sky clouds", "green valley sunrise landscape", "desert dunes golden hour"],
    night: ["night sky stars milky way", "moon night landscape quiet", "aurora night nature"],
    water: ["ocean calm water waves", "lake reflection mountains", "waterfall nature river"],
    flowers: ["flower garden soft petals", "wildflowers meadow landscape", "blossom tree spring nature"]
  };
  var KIND_GRADIENTS = {
    solid: [
      ["#0f4c3a", "#1a1a2e"],
      ["#1e3a5f", "#0d1b2a"],
      ["#2d4a3e", "#1a1510"],
      ["#3d2b1f", "#1a120c"]
    ]
  };

  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  /* ——— Shariah-safe scan reinforce ——— */
  if (typeof w.clarityShariahScanUrl !== "function") {
    w.clarityShariahScanUrl = function (url, meta) {
      var blob = (String(url || "") + " " + String(meta || "")).toLowerCase();
      if (/\b(nude|naked|bikini|porn|party-crowd|portrait|selfie|model|celebrity)\b/i.test(blob))
        return { ok: false, reason: "blocked" };
      return { ok: true, reason: "neutral" };
    };
  }

  /* ——— Hardened online fetch (scenery only) ——— */
  var cache = w._memeAutoCache = w._memeAutoCache || {};
  var idx = w._memeAutoIdx = w._memeAutoIdx || {};

  function picsumSeed(kind) {
    idx[kind] = (idx[kind] || 0) + 1;
    var n = (Date.now() + idx[kind] * 37) % 1800;
    return "https://picsum.photos/seed/clarity-" + kind + "-" + n + "/1280/720.jpg";
  }

  function fetchCommons(query) {
    var key = "c:" + query;
    if (cache[key] && cache[key].length) return Promise.resolve(cache[key]);
    var api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
      encodeURIComponent(query + " landscape") +
      "&gsrnamespace=6&gsrlimit=24&prop=imageinfo&iiprop=url&iiurlwidth=1280&format=json&origin=*";
    return fetch(api, { mode: "cors" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (json) {
      var pages = (json && json.query && json.query.pages) || {};
      var urls = [];
      Object.keys(pages).forEach(function (id) {
        var ii = pages[id].imageinfo && pages[id].imageinfo[0];
        var title = pages[id].title || "";
        var u = ii && (ii.thumburl || ii.url);
        if (!u || !/\.(jpe?g|png|webp)/i.test(u)) return;
        if (!w.clarityShariahScanUrl(u, title).ok) return;
        urls.push(u);
      });
      cache[key] = urls;
      return urls;
    });
  }

  function applySolid(kind) {
    var g = KIND_GRADIENTS.solid;
    idx.solid = (idx.solid || 0) + 1;
    var pair = g[idx.solid % g.length];
    /* try canvas API if present */
    try {
      if (typeof w.memeSetSolidBackground === "function") {
        w.memeSetSolidBackground(pair[0], pair[1]);
        status("Background: solid gradient");
        return;
      }
    } catch (e) {}
    var c = $("meme-canvas") || $("mr-canvas") || d.querySelector("#mr-root canvas");
    if (c && c.getContext) {
      var ctx = c.getContext("2d");
      var gr = ctx.createLinearGradient(0, 0, 0, c.height);
      gr.addColorStop(0, pair[0]);
      gr.addColorStop(1, pair[1]);
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, c.width, c.height);
      if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e2) {}
      status("Background: solid gradient");
    } else {
      status("Solid mode · open canvas first");
    }
  }

  function loadUrl(url) {
    if (!w.clarityShariahScanUrl(url, "").ok) {
      status("Skipped non-compliant · trying another…");
      return Promise.reject(new Error("scan"));
    }
    return new Promise(function (resolve, reject) {
      if (typeof w.memeLoadImageFromUrl === "function") {
        try {
          w.memeLoadImageFromUrl(url, "Load failed");
          status("Scenery loaded");
          resolve(url);
          return;
        } catch (e) {}
      }
      var im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = function () {
        try {
          if (typeof w.memeSetBackgroundImage === "function") w.memeSetBackgroundImage(im);
          else if (typeof w.memeDraw === "function") {
            w.__memeBgImage = im;
            w.memeDraw();
          }
        } catch (e2) {}
        status("Scenery loaded");
        resolve(url);
      };
      im.onerror = function () { reject(new Error("img")); };
      im.src = url;
    });
  }

  function fetchKind(kind) {
    kind = (kind || "nature").toLowerCase();
    if (SAFE_KINDS.indexOf(kind) === -1) kind = "nature";
    if (kind === "solid") {
      applySolid(kind);
      return Promise.resolve("solid");
    }
    status("Fetching " + kind + " scenery…");
    var queries = KIND_QUERIES[kind] || KIND_QUERIES.nature;
    var q = queries[Math.floor(Math.random() * queries.length)];

    return fetchCommons(q).then(function (urls) {
      if (urls && urls.length) {
        idx[kind] = (idx[kind] || 0) + 1;
        var u = urls[idx[kind] % urls.length];
        return loadUrl(u);
      }
      throw new Error("empty");
    }).catch(function () {
      /* fallback picsum seeded scenery */
      return loadUrl(picsumSeed(kind)).catch(function () {
        applySolid("solid");
        status("Offline fallback · solid gradient");
        return "fallback";
      });
    });
  }

  /* Public API used by chips */
  w.__memeOnlineFetch = function (kind) {
    return fetchKind(kind);
  };
  w.memeFetchBg = w.__memeOnlineFetch;

  /* Restrict chip set: hide non-scenery pills if present */
  function restrictBgChips() {
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      var k = (btn.getAttribute("data-meme-bg") || "").toLowerCase();
      if (SAFE_KINDS.indexOf(k) === -1 && k !== "blank") {
        btn.style.display = "none";
        btn.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* ——— Text format for desks ——— */
  function currentLine() {
    var card = $("craft-verse-card");
    var t = (card && card.textContent) || "";
    t = t.replace(/\s+/g, " ").trim();
    return t;
  }

  function formatForX(text) {
    var base = text || currentLine();
    var stamp = "\n\nEducational only — not a fatwa · verify primary texts";
    var max = 280 - stamp.length - 2;
    if (base.length > max) base = base.slice(0, max - 1).trim() + "…";
    return base + stamp;
  }

  function formatForFB(text) {
    var base = text || currentLine();
    return base + "\n\n—\nEducational only — not a fatwa.\nVerify on quran.com / sunnah.com · Clarity Craft";
  }

  function fillDesks() {
    var xText = formatForX();
    var fbText = formatForFB();
    var xBox = $("meme-x-text") || $("desk-x-text") || d.querySelector("[data-desk='x'] textarea, #x-desk-text");
    var fbBox = $("meme-fb-text") || $("desk-fb-text") || d.querySelector("[data-desk='fb'] textarea, #fb-desk-text");
    if (xBox) {
      xBox.value = xText;
      xBox.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (fbBox) {
      fbBox.value = fbText;
      fbBox.dispatchEvent(new Event("input", { bubbles: true }));
    }
    var xc = $("meme-x-count");
    if (xc) xc.textContent = xText.length + " / 280";
    return { x: xText, fb: fbText };
  }

  function openIntent(network) {
    var packed = fillDesks();
    var url;
    if (network === "x") {
      url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(packed.x);
    } else {
      url = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent("https://clarity-dawah.fyi/craft/meme/") +
        "&quote=" + encodeURIComponent(packed.fb.slice(0, 500));
    }
    w.open(url, "_blank", "noopener,noreferrer");
  }

  /* ——— Daily automation: verse + matching scene ——— */
  var SECTION_BG = {
    reminder: "nature",
    reality: "night",
    reflection: "water",
    action: "flowers"
  };

  function dailyPack() {
    status("Daily pack · loading line + scenery…");
    var sections = ["reminder", "reality", "reflection", "action"];
    /* rotate by day of year */
    var day = Math.floor(Date.now() / 86400000);
    var sec = sections[day % sections.length];
    var btn = d.querySelector('[data-meme-section="' + sec + '"]');
    if (btn) {
      d.querySelectorAll("[data-meme-section]").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      btn.click();
    }
    var kind = SECTION_BG[sec] || "nature";
    setTimeout(function () {
      fetchKind(kind).then(function () {
        fillDesks();
        if (typeof w.memeAutoScaleLines === "function") try { w.memeAutoScaleLines(); } catch (e) {}
        status("Daily pack ready · " + sec + " + " + kind + " · desks filled");
      });
    }, 450);
  }

  function wireUi() {
    restrictBgChips();

    /* re-bind BG chips to hardened fetch */
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      if (btn._autoBound) return;
      btn._autoBound = true;
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-bg]").forEach(function (x) { x.classList.remove("active"); });
        btn.classList.add("active");
        var kind = btn.getAttribute("data-meme-bg") || "nature";
        if (kind === "blank") {
          applySolid("solid");
          return;
        }
        fetchKind(kind);
      });
    });

    var daily = $("meme-daily-pack");
    if (daily && !daily._auto) {
      daily._auto = true;
      daily.addEventListener("click", dailyPack);
    }
    var postX = $("meme-post-x");
    if (postX && !postX._auto) {
      postX._auto = true;
      postX.addEventListener("click", function () { openIntent("x"); });
    }
    var postFb = $("meme-post-fb");
    if (postFb && !postFb._auto) {
      postFb._auto = true;
      postFb.addEventListener("click", function () { openIntent("fb"); });
    }
    var fill = $("meme-fill-desks");
    if (fill && !fill._auto) {
      fill._auto = true;
      fill.addEventListener("click", function () {
        fillDesks();
        status("Desks filled · post-ready text");
      });
    }
    var next = $("meme-next-bg");
    if (next && !next._auto) {
      next._auto = true;
      next.addEventListener("click", function () {
        var a = d.querySelector("[data-meme-bg].active");
        var kind = (a && a.getAttribute("data-meme-bg")) || "nature";
        if (SAFE_KINDS.indexOf(kind) === -1) kind = "nature";
        fetchKind(kind);
      });
    }
  }

  function injectCss() {
    if ($("meme-auto-css")) return;
    var s = d.createElement("style");
    s.id = "meme-auto-css";
    s.textContent = [
      ".craft-hero-banner{position:relative;width:100%;max-height:200px;overflow:hidden}",
      ".craft-hero-banner img{width:100%;height:200px;object-fit:cover;display:block}",
      ".craft-hero-banner .banner-credit{position:absolute;right:.6rem;bottom:.4rem;font-size:.65rem;opacity:.75;background:rgba(0,0,0,.4);padding:.1rem .4rem;border-radius:6px}",
      ".meme-charter{border-radius:14px;border:1px solid rgba(212,180,90,.35);background:rgba(15,76,58,.2);padding:.85rem 1rem;margin:1rem 0;font-size:.85rem;line-height:1.45}",
      ".meme-charter ol{margin:.35rem 0 0;padding-left:1.15rem}",
      ".meme-auto-bar{display:flex;flex-wrap:wrap;gap:.45rem;margin:.75rem 0}",
      ".meme-auto-bar .btn{border-radius:10px;border:1px solid rgba(212,180,90,.4);background:#1e7d5e;color:#fff;padding:.45rem .85rem;font-weight:700;font-size:.8rem;cursor:pointer}",
      ".meme-auto-bar .btn.secondary{background:rgba(15,76,58,.45)}",
      ".meme-surprise-ribbon{display:inline-block;font-size:.68rem;font-weight:700;letter-spacing:.04em;padding:.15rem .5rem;border-radius:6px;background:rgba(212,180,90,.28);color:#e8d5a3;margin-left:.35rem}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    wireUi();
    setTimeout(wireUi, 500);
    setTimeout(wireUi, 1500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 400); });

  w.ClarityMemeAutomation = {
    fetchKind: fetchKind,
    dailyPack: dailyPack,
    fillDesks: fillDesks,
    formatForX: formatForX,
    formatForFB: formatForFB,
    openIntent: openIntent
  };
})(window, document);
