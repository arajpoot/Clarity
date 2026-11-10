/*! craft-meme-automation-v1 · C19MEME11
 * Scenery-only BG · hardened fetch · daily verse+scene · post-ready desks
 * Educational only — not a fatwa · no free-type scripture as revelation
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_AUTO_C19MEME11__) return;
  w.__CRAFT_MEME_AUTO_C19MEME11__ = true;

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

  function readDraft(id) {
    var el = $(id);
    return el ? String(el.value || "").trim() : "";
  }

  /** Layer parse — same discipline as paint-standard (ar / en / ref) */
  function parsePostLayers(raw) {
    if (typeof w.craftMemeParseLayers === "function") {
      try { return w.craftMemeParseLayers(raw); } catch (e) {}
    }
    raw = String(raw || "").replace(/\s+/g, " ").trim();
    var ar = "", en = "", ref = "";
    var mRef = raw.match(/(?:Qur[’']an|Quran|Qurʾān|Surah|Sūrat?)\s*([0-9]{1,3})\s*[:：]\s*([0-9]{1,3}(?:\s*[-–]\s*[0-9]{1,3})?)/i);
    if (mRef) {
      ref = "Qur’an " + mRef[1] + ":" + mRef[2].replace(/\s+/g, "");
      raw = raw.replace(mRef[0], " ").trim();
    } else {
      var mRef2 = raw.match(/\(([0-9]{1,3})\s*[:：]\s*([0-9]{1,3})\)/);
      if (mRef2) {
        ref = "Qur’an " + mRef2[1] + ":" + mRef2[2];
        raw = raw.replace(mRef2[0], " ").trim();
      }
    }
    var arParts = raw.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s،؟؛]+/g);
    if (arParts && arParts.length) {
      ar = arParts.map(function (s) { return s.trim(); }).filter(Boolean).join(" ").trim();
      raw = raw.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g, " ");
    }
    en = raw.replace(/\s+/g, " ").replace(/\(\s*\)/g, " ").replace(/\(\s*\)/g, "").replace(/^[\s\-–—:·\(]+|[\s\-–—:·\)]+$/g, "").trim();
    en = en.replace(/\s*clarity-dawah\.fyi.*$/i, "").replace(/\s*educational only.*$/i, "").replace(/\(\s*\)/g, "").replace(/\s+/g, " ").trim();
    if (!ref) ref = "";
    return { ar: ar, en: en, ref: ref };
  }

  /**
   * Standard post body (matches your live X style):
   *   Arabic
   *   English
   *   (Qur’an x:y)
   *   clarity-dawah.fyi · educational only —
   */
  function formatStandardPost(raw, network) {
    var src = (raw || currentLine() || readDraft(network === "x" ? "x-draft" : "fb-draft") || "").trim();
    src = src.replace(/clarity-dawah\.fyi[\s\S]*$/i, "").replace(/educational only[\s\S]*$/i, "").replace(/not a fatwa[\s\S]*$/i, "").trim();
    var L = parsePostLayers(src);
    var parts = [];
    if (L.ar) parts.push(L.ar);
    if (L.en) parts.push(L.en);
    if (L.ref) parts.push("(" + L.ref + ")");
    var body = parts.join("\n\n");
    if (!body) body = src || "Educational reminder · Clarity Craft";

    var stamp = "clarity-dawah.fyi · educational only —";
    if (network === "x") {
      var max = 280;
      var room = max - stamp.length - 2;
      if (body.length > room) {
        /* prefer keeping Arabic + ref; trim English */
        if (L.ar && L.ref) {
          var core = L.ar + "\n\n";
          var tail = "(" + L.ref + ")";
          var midRoom = room - core.length - tail.length - 2;
          var en = L.en || "";
          if (midRoom > 20 && en) {
            if (en.length > midRoom) en = en.slice(0, midRoom - 1).trim() + "…";
            body = core + en + "\n\n" + tail;
          } else {
            body = (L.ar + "\n\n" + tail).slice(0, room);
          }
        } else {
          body = body.slice(0, room - 1).trim() + "…";
        }
      }
      var out = body + "\n\n" + stamp;
      return out.slice(0, 280);
    }
    /* Facebook — fuller stamp, no hard 280 */
    var fbStamp = "clarity-dawah.fyi · educational only —\nNot a fatwa · verify primary texts";
    return body + "\n\n" + fbStamp;
  }

  function formatForX(text) {
    return formatStandardPost(text, "x");
  }

  function formatForFB(text) {
    return formatStandardPost(text, "fb");
  }

  function setDraft(id, value, countId, statusId, statusMsg) {
    var box = $(id);
    if (!box) return;
    box.value = value;
    try { box.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
    if (countId) {
      var c = $(countId);
      if (c) c.textContent = value.length + (id === "x-draft" ? " / 280" : "");
    }
    if (statusId) {
      var s = $(statusId);
      if (s) s.textContent = statusMsg || ("Post-ready · " + value.length + " chars");
    }
  }

  function fillDesks(preferExisting) {
    var line = currentLine();
    var xExisting = readDraft("x-draft");
    var fbExisting = readDraft("fb-draft");
    var xSrc = line || xExisting;
    var fbSrc = line || fbExisting;
    if (preferExisting) {
      xSrc = xExisting || line;
      fbSrc = fbExisting || line;
    }
    var xText = formatForX(xSrc);
    var fbText = formatForFB(fbSrc);
    setDraft("x-draft", xText, "x-count", "x-status", "Post-ready · " + xText.length + " / 280");
    setDraft("fb-draft", fbText, null, "fb-status", "Post-ready · Facebook");
    return { x: xText, fb: fbText };
  }

  function copyText(t) {
    t = String(t || "");
    if (!t) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(t).then(function () { return true; }).catch(function () { return false; });
    }
    try {
      var ta = d.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      d.body.appendChild(ta);
      ta.select();
      d.execCommand("copy");
      d.body.removeChild(ta);
      return Promise.resolve(true);
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  /** Export meme PNG for attach-in-compose (platforms block silent image upload) */
  function exportMemePng() {
    return new Promise(function (resolve) {
      try {
        if (typeof w.memeCopyPng === "function") {
          try { w.memeCopyPng(); } catch (e0) {}
        }
        if (typeof w.craftMemeExportPng === "function") {
          try { w.craftMemeExportPng(); resolve("export-fn"); return; } catch (e1) {}
        }
        var c = $("meme-canvas") || $("mr-canvas") || d.querySelector("#mr-root canvas") || d.querySelector("canvas");
        if (c && c.toDataURL) {
          var url = c.toDataURL("image/png");
          var a = d.createElement("a");
          a.href = url;
          a.download = "clarity-meme-" + Date.now() + ".png";
          d.body.appendChild(a);
          a.click();
          setTimeout(function () { try { d.body.removeChild(a); } catch (e2) {} }, 500);
          /* also try clipboard image */
          if (navigator.clipboard && w.ClipboardItem && c.toBlob) {
            c.toBlob(function (blob) {
              if (!blob) { resolve("download"); return; }
              try {
                navigator.clipboard.write([new w.ClipboardItem({ "image/png": blob })]).then(function () {
                  resolve("clipboard+download");
                }).catch(function () { resolve("download"); });
              } catch (e3) { resolve("download"); }
            }, "image/png");
            return;
          }
          resolve("download");
          return;
        }
      } catch (e) {}
      resolve("none");
    });
  }

  /**
   * 1-click publish:
   * 1) ensure desk text is post-ready
   * 2) copy text
   * 3) export/download meme PNG for attachment
   * 4) open platform compose with text prefilled (X) or sharer + clipboard (FB)
   */

  function openIntent(network) {
    var packed = fillDesks(false);
    var text = network === "x" ? packed.x : packed.fb;
    if (!text || !String(text).trim()) {
      text = formatStandardPost(currentLine() || "Educational reminder · Clarity Craft", network);
    }

    function afterExport() {
      return copyText(text).then(function () {
        if (network === "x") {
          var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
          w.open(url, "_blank", "noopener,noreferrer");
          status("𝕏 opened · caption prefilled");
          var xs = $("x-status");
          if (xs) xs.textContent = "Tweet compose · text prefilled ✓";
          return;
        }
        /* Facebook: quote param + clipboard; avoid generic site-only share */
        var quote = String(text).slice(0, 1200);
        var shareUrl =
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent("https://clarity-dawah.fyi/craft/meme/") +
          "&quote=" + encodeURIComponent(quote);
        /* Mobile deep-link style fallback via facebook.com with quote */
        var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
        var url = shareUrl;
        if (isMobile) {
          url =
            "https://m.facebook.com/composer/?text=" + encodeURIComponent(quote);
        }
        w.open(url, "_blank", "noopener,noreferrer");
        status("Facebook · caption on clipboard + share window");
        var fs = $("fb-status");
        if (fs) fs.textContent = "Facebook · paste caption if needed (copied) ✓";
      });
    }

    if (typeof exportMemePng === "function") {
      exportMemePng().then(afterExport).catch(afterExport);
    } else {
      afterExport();
    }
  }


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
    var fill = $("meme-fill-desks");
    if (fill && !fill._auto) {
      fill._auto = true;
      fill.addEventListener("click", function () {
        fillDesks(false);
        status("Desks filled · post-ready text");
      });
    }

    /* 1-click publish — top bar + desk cards (does not replace data-action=open) */
    function bindPublish(id, network) {
      var b = $(id);
      if (!b || b._pubBound) return;
      b._pubBound = true;
      b.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openIntent(network);
      });
    }
    bindPublish("meme-post-x", "x");
    bindPublish("meme-post-fb", "fb");

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


  /* hard-bind top-rail 1-click (survive late DOM) */
  function bindTopRail() {
    function on(id, net) {
      var b = d.getElementById(id);
      if (!b) return;
      b.onclick = function (e) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        openIntent(net);
      };
    }
    on("meme-post-x", "x");
    on("meme-post-fb", "fb");
  }
  setTimeout(bindTopRail, 0);
  setTimeout(bindTopRail, 600);
  setTimeout(bindTopRail, 1500);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 400); });

  w.formatForX = formatForX;
  w.formatForFB = formatForFB;
  w.formatStandardPost = formatStandardPost;
  w.ClarityMemeAutomation = {
    fetchKind: fetchKind,
    dailyPack: dailyPack,
    fillDesks: fillDesks,
    formatForX: formatForX,
    formatForFB: formatForFB,
    formatStandardPost: formatStandardPost,
    parsePostLayers: parsePostLayers,
    openIntent: openIntent
  };
})(window, document);
