/*! craft-meme-fallback-scenes-v1 · C17R2
 * Shariah-verified scenery library for Craft Meme when online fetch fails.
 * Contract: landscapes · sacred architecture · sky · water · geometry only.
 * NO figurative people / portrait stock.
 * Remote URLs still pass clarityShariahScanUrl when available.
 * Offline ultimate fallback: procedural canvas gradients (no network).
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_FALLBACK_SCENES_C17R2__) return;
  w.__CRAFT_MEME_FALLBACK_SCENES_C17R2__ = true;

  var W = function (path) {
    return "https://upload.wikimedia.org/wikipedia/commons/" + path;
  };

  /**
   * Curated Wikimedia commons (scenery / architecture).
   * Prefer these before random stock. Verify primary use is educational scenery.
   */
  var LIBRARY = {
    holy: [
      {
        id: "kaaba",
        label: "Kaaba · Masjid al-Ḥarām",
        url: W("thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"),
        tags: ["holy", "architecture"]
      },
      {
        id: "haram",
        label: "Masjid al-Ḥarām",
        url: W("thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg"),
        tags: ["holy", "architecture"]
      },
      {
        id: "nabawi",
        label: "Al-Masjid an-Nabawī",
        url: W("thumb/8/8a/Al-Masjid_an-Nabawi_as-from_top.jpg/1280px-Al-Masjid_an-Nabawi_as-from_top.jpg"),
        tags: ["holy", "architecture"]
      }
    ],
    nature: [
      {
        id: "qatar-desert",
        label: "Desert · Qatar",
        url: W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg"),
        tags: ["nature", "desert"]
      },
      {
        id: "empty-quarter",
        label: "Empty Quarter dunes",
        url: W("thumb/1/1a/Sand_dunes_in_the_Empty_Quarter.jpg/1280px-Sand_dunes_in_the_Empty_Quarter.jpg"),
        tags: ["nature", "desert"]
      },
      {
        id: "wadi-rum",
        label: "Wadi Rum",
        url: W("thumb/3/3e/Wadi_Rum_Jordan.jpg/1280px-Wadi_Rum_Jordan.jpg"),
        tags: ["nature"]
      }
    ],
    night: [
      {
        id: "milky-way",
        label: "Night sky · stars",
        url: W("thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg"),
        tags: ["night", "sky"]
      }
    ],
    water: [
      {
        id: "calm-sea",
        label: "Calm sea",
        url: W("thumb/0/0c/Calm_sea.jpg/1280px-Calm_sea.jpg"),
        tags: ["water"]
      }
    ],
    geometry: [
      {
        id: "procedural-green",
        label: "Solid · emerald (offline)",
        procedural: "emerald",
        tags: ["geometry", "offline"]
      },
      {
        id: "procedural-night",
        label: "Gradient · night (offline)",
        procedural: "night",
        tags: ["geometry", "offline"]
      },
      {
        id: "procedural-gold",
        label: "Gradient · gold band (offline)",
        procedural: "gold",
        tags: ["geometry", "offline"]
      },
      {
        id: "procedural-arabesque",
        label: "Pattern · soft arabesque (offline)",
        procedural: "arabesque",
        tags: ["geometry", "offline"]
      }
    ]
  };

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-wire-status");
    if (el) el.textContent = msg || "";
  }

  function scanOk(url, meta) {
    if (!url) return true;
    if (typeof w.clarityShariahScanUrl !== "function") return false;
    return !!w.clarityShariahScanUrl(url, meta || "").ok;
  }

  /** Procedural offline scenes — never need network */
  function paintProcedural(ctx, cw, ch, kind) {
    kind = kind || "emerald";
    if (kind === "night") {
      var g = ctx.createLinearGradient(0, 0, 0, ch);
      g.addColorStop(0, "#020617");
      g.addColorStop(0.55, "#0f172a");
      g.addColorStop(1, "#1e293b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "rgba(248,250,252,0.85)";
      for (var i = 0; i < 40; i++) {
        var x = (i * 97) % cw;
        var y = (i * 53) % Math.floor(ch * 0.55);
        ctx.beginPath();
        ctx.arc(x, y, (i % 3) + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    if (kind === "gold") {
      var g2 = ctx.createLinearGradient(0, 0, cw, ch);
      g2.addColorStop(0, "#0b1f18");
      g2.addColorStop(0.45, "#14532d");
      g2.addColorStop(0.55, "#854d0e");
      g2.addColorStop(1, "#0b1f18");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "rgba(234,179,8,0.25)";
      ctx.fillRect(0, ch * 0.42, cw, ch * 0.08);
      return;
    }
    if (kind === "arabesque") {
      var g3 = ctx.createLinearGradient(0, 0, 0, ch);
      g3.addColorStop(0, "#052e1c");
      g3.addColorStop(1, "#0b1f18");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, cw, ch);
      ctx.strokeStyle = "rgba(212,180,90,0.22)";
      ctx.lineWidth = 2;
      for (var r = 40; r < Math.max(cw, ch); r += 48) {
        ctx.beginPath();
        ctx.arc(cw / 2, ch / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (var gx = 0; gx < cw; gx += 56) {
        for (var gy = 0; gy < ch; gy += 56) {
          ctx.strokeStyle = "rgba(212,180,90,0.12)";
          ctx.strokeRect(gx, gy, 40, 40);
        }
      }
      return;
    }
    /* emerald default */
    var g0 = ctx.createLinearGradient(0, 0, cw, ch);
    g0.addColorStop(0, "#064e3b");
    g0.addColorStop(0.5, "#0b1f18");
    g0.addColorStop(1, "#14532d");
    ctx.fillStyle = g0;
    ctx.fillRect(0, 0, cw, ch);
  }

  function loadImage(url, onOk, onFail) {
    if (!url) {
      if (onFail) onFail();
      return;
    }
    if (!scanOk(url, "fallback-library")) {
      status("Fallback URL skipped by Shariah scan");
      if (onFail) onFail();
      return;
    }
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      if (onOk) onOk(img);
    };
    img.onerror = function () {
      if (onFail) onFail();
    };
    img.src = url;
  }

  /**
   * Try library entries for kind, then procedural offline.
   * onPaint(img|null, meta) — img null means caller should use procedural via paintProcedural
   */
  function resolveScene(kind, onDone) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      onDone(null, { mode: "solid" });
      return;
    }
    var list = (LIBRARY[kind] || []).concat(LIBRARY.geometry || []);
    var i = 0;
    function next() {
      if (i >= list.length) {
        onDone(null, { mode: "procedural", procedural: "emerald" });
        return;
      }
      var item = list[i++];
      if (item.procedural) {
        onDone(null, { mode: "procedural", procedural: item.procedural, id: item.id });
        return;
      }
      if (!item.url) {
        next();
        return;
      }
      loadImage(
        item.url,
        function (img) {
          onDone(img, { mode: "remote", id: item.id, label: item.label });
        },
        function () {
          next();
        }
      );
    }
    next();
  }

  w.CraftMemeFallbackScenes = {
    version: "C17R2",
    library: LIBRARY,
    resolveScene: resolveScene,
    paintProcedural: paintProcedural,
    scanOk: scanOk
  };
})(window, document);
