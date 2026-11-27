/*! craft-meme-bg-v1.js · Phase A1 · single scenery fetch owner
 * Pools: nature / architecture-scenery / abstract soft · educational only — not a fatwa
 * Coexists with online-bg; prefers one quiet memeFetchBg surface.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BG_V1__) return;
  w.__CRAFT_MEME_BG_V1__ = true;

  var POOLS = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    architecture: [
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519817650390-64a5db1d0498?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1580418827493-f2b22c0dc151?auto=format&fit=crop&w=1600&q=80"
    ],
    abstract: [
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80"
    ]
  };

  w.MEME_BG_POOLS = w.MEME_BG_POOLS || {};
  Object.keys(POOLS).forEach(function (k) {
    var cur = w.MEME_BG_POOLS[k] || [];
    var seen = {};
    var merged = [];
    cur.concat(POOLS[k]).forEach(function (u) {
      if (u && !seen[u]) {
        seen[u] = 1;
        merged.push(u);
      }
    });
    w.MEME_BG_POOLS[k] = merged;
  });
  /* aliases used by older chips */
  w.MEME_BG_POOLS.holy = w.MEME_BG_POOLS.holy || w.MEME_BG_POOLS.architecture.slice();
  w.MEME_BG_POOLS.spirit = w.MEME_BG_POOLS.spirit || w.MEME_BG_POOLS.abstract.slice();
  w.MEME_BG_POOLS.night = w.MEME_BG_POOLS.night || w.MEME_BG_POOLS.nature.slice().reverse();

  var idx = w.memeBgIdx = w.memeBgIdx || {};

  function status(msg) {
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  function paintUrl(url, label) {
    if (!url) {
      status("No scenery URL");
      return;
    }
    status("Loading scenery…");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (typeof w.memeSetBackgroundImage === "function") {
          w.memeSetBackgroundImage(img);
        } else if (typeof w.setMemeBackground === "function") {
          w.setMemeBackground(url);
        } else {
          var c = d.getElementById("meme-canvas");
          if (c && c.getContext) {
            var ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0, c.width, c.height);
          }
          w.__MEME_LAST_BG__ = url;
        }
        status((label || "Scenery") + " · educational · not a fatwa");
      } catch (e) {
        status("Paint issue — try Next");
      }
    };
    img.onerror = function () {
      status("Fetch failed — try Next or offline scene");
    };
    img.src = url;
  }

  function pick(kind) {
    kind = kind || "nature";
    var pool = w.MEME_BG_POOLS[kind] || w.MEME_BG_POOLS.nature || [];
    if (!pool.length) return null;
    idx[kind] = ((idx[kind] | 0) + 1) % pool.length;
    return pool[idx[kind]];
  }

  /* Single public owner — quiet */
  w.memeFetchBg = function (kind) {
    kind = kind || "nature";
    if (kind === "blank") {
      try {
        var c = d.getElementById("meme-canvas");
        if (c && c.getContext) {
          var ctx = c.getContext("2d");
          var g = ctx.createLinearGradient(0, 0, 0, c.height);
          g.addColorStop(0, "#0b1612");
          g.addColorStop(1, "#1a3d30");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, c.width, c.height);
        }
        status("Blank gradient · ready for verse");
      } catch (e) {}
      return;
    }
    if (kind === "surprise") {
      var keys = Object.keys(w.MEME_BG_POOLS).filter(function (k) {
        return (w.MEME_BG_POOLS[k] || []).length;
      });
      kind = keys[(Math.random() * keys.length) | 0] || "nature";
    }
    paintUrl(pick(kind), kind);
  };

  function wireButtons() {
    var map = [
      ["meme-surprise-bg", "surprise"],
      ["meme-next-bg", "nature"]
    ];
    map.forEach(function (pair) {
      var el = d.getElementById(pair[0]);
      if (!el || el.__bg_v1) return;
      el.__bg_v1 = true;
      el.addEventListener("click", function () {
        w.memeFetchBg(pair[1]);
      });
    });
    d.querySelectorAll("[data-meme-bg-enrich]").forEach(function (b) {
      if (b.__bg_v1) return;
      b.__bg_v1 = true;
      b.addEventListener("click", function () {
        w.memeFetchBg(b.getAttribute("data-meme-bg-enrich") || "nature");
      });
    });
  }

  function boot() {
    wireButtons();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 2000);
})(window, document);
