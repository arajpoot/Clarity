/*! craft-meme-bg-enrich-v1.js · Phase A0 from NurOS pools
 * Expands MEME_BG_POOLS · scenery / architecture only · educational
 * Does not replace online-bg — enriches pools + surprise + blank
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BG_ENRICH_V1__) return;
  w.__CRAFT_MEME_BG_ENRICH_V1__ = true;

  var NUR = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80"],
    holy: ["https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1519817650390-64a5db1d0498?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1580418827493-f2b22c0dc151?auto=format&fit=crop&w=1600&q=80", "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1519817650390-64a5db1d0498?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580418827493-f2b22c0dc151?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1542816417-0983c9c0b5b9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/The_Kaaba_during_Hajj.jpg/1280px-The_Kaaba_during_Hajj.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Great_Mosque_of_Mecca_at_night.jpg/1280px-Great_Mosque_of_Mecca_at_night.jpg"],
    night: [],
    free: ["https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1433086966358-548436cbae3c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1465146633011-14f8e0781093?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1499002238440-d219ceb90176?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1455659817273-f968077415a9?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1487530811176-3780da811eaf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1496060169243-453fde45943b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1200&q=80"],
    water: [],
    flowers: [],
    spirit: [],
    decor: [],
    pattern: []
  };

  // soft geometric blanks (no figurative art)
  var BLANKS = [
    "linear-gradient(135deg,#0d4f3c 0%,#1a6b52 45%,#0a2e22 100%)",
    "linear-gradient(160deg,#1c2a22 0%,#2c4a3a 50%,#0f4c3a 100%)",
    "linear-gradient(180deg,#0a1812 0%,#1a2a22 40%,#2a4a3a 100%)",
    "linear-gradient(120deg,#2a5f7a 0%,#0d4f3c 55%,#1c2a22 100%)",
    "linear-gradient(200deg,#5a4a7a 0%,#2c4a3a 50%,#0a1812 100%)",
    "radial-gradient(ellipse at 30% 20%,#3d8ab5 0%,#0d4f3c 45%,#0a1812 100%)"
  ];

  function ensurePools() {
    if (!w.MEME_BG_POOLS) w.MEME_BG_POOLS = {};
    var P = w.MEME_BG_POOLS;
    Object.keys(NUR).forEach(function (k) {
      if (!Array.isArray(P[k])) P[k] = [];
      (NUR[k] || []).forEach(function (u) {
        if (u && P[k].indexOf(u) < 0) P[k].push(u);
      });
    });
    // alias
    if (!P.stock || !P.stock.length) P.stock = P.free.slice();
    if (!P.online || !P.online.length) P.online = P.free.concat(P.nature);
  }

  function status(msg) {
    try { if (typeof w.memeFetchStatus === "function") w.memeFetchStatus(msg); } catch (e) {}
    var el = d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  function applyUrl(url) {
    if (!url) return;
    w.__memeBgUrl = url;
    if (typeof w.memeLoadImageFromUrl === "function") {
      try { w.memeLoadImageFromUrl(url, "Could not load scenery"); status("Background ready"); return; }
      catch (e) {}
    }
    var im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = function () {
      w.__memeBgImage = im;
      try {
        if (w.memeState) w.memeState.img = im;
        if (typeof w.memePaint === "function") w.memePaint();
        else if (typeof w.paint === "function") w.paint();
      } catch (e2) {}
      status("Background ready · scenery");
    };
    im.onerror = function () { status("Image blocked — try another or Blank"); };
    im.src = url;
  }

  function applyBlank() {
    if (!w.memeBgIdx) w.memeBgIdx = {};
    if (typeof w.memeBgIdx.blank !== "number") w.memeBgIdx.blank = -1;
    w.memeBgIdx.blank = (w.memeBgIdx.blank + 1) % BLANKS.length;
    var g = BLANKS[w.memeBgIdx.blank];
    w.__memeBgGradient = g;
    w.__memeBgUrl = "";
    w.__memeBgImage = null;
    try {
      if (w.memeState) { w.memeState.img = null; w.memeState.gradient = g; }
      if (typeof w.memePaint === "function") w.memePaint();
      else if (typeof w.paint === "function") w.paint();
      // canvas direct fallback
      var c = d.getElementById("meme-canvas") || d.querySelector("canvas.meme-canvas, #meme-stage canvas");
      if (c && c.getContext) {
        var ctx = c.getContext("2d");
        var css = g;
        // simple fill via temp
        ctx.save();
        var gr;
        if (g.indexOf("radial") >= 0) {
          gr = ctx.createRadialGradient(c.width*0.3, c.height*0.2, 10, c.width*0.5, c.height*0.5, c.width*0.8);
          gr.addColorStop(0, "#3d8ab5"); gr.addColorStop(0.45, "#0d4f3c"); gr.addColorStop(1, "#0a1812");
        } else {
          gr = ctx.createLinearGradient(0, 0, c.width, c.height);
          gr.addColorStop(0, "#0d4f3c"); gr.addColorStop(0.5, "#1a6b52"); gr.addColorStop(1, "#0a1812");
        }
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.restore();
      }
    } catch (e) {}
    status("Blank gradient " + (w.memeBgIdx.blank + 1) + "/" + BLANKS.length + " · educational");
  }

  // Enrich memeFetchBg without destroying online-bg
  var _prev = w.memeFetchBg;
  w.memeFetchBg = function (kind) {
    ensurePools();
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank" || kind === "gradient" || kind === "solid") {
      applyBlank();
      return;
    }
    if (kind === "surprise" || kind === "random") {
      var keys = ["nature", "holy", "free", "night"].filter(function (k) {
        return w.MEME_BG_POOLS[k] && w.MEME_BG_POOLS[k].length;
      });
      kind = keys[Math.floor(Math.random() * keys.length)] || "nature";
    }
    if (kind === "flickr" || kind === "stock" || kind === "online" || kind === "commons") {
      // prefer existing online handler if present
      if (typeof _prev === "function" && _prev !== w.memeFetchBg) {
        try { return _prev.call(w, kind === "commons" ? "free" : kind); } catch (e) {}
      }
      kind = "free";
    }
    var pool = w.MEME_BG_POOLS[kind];
    if (!pool || !pool.length) {
      if (typeof _prev === "function") {
        try { return _prev.call(w, kind); } catch (e2) {}
      }
      status("No images for " + kind);
      return;
    }
    if (!w.memeBgIdx) w.memeBgIdx = {};
    if (typeof w.memeBgIdx[kind] !== "number") w.memeBgIdx[kind] = -1;
    w.memeBgIdx[kind] = (w.memeBgIdx[kind] + 1) % pool.length;
    var url = pool[w.memeBgIdx[kind]];
    status("Fetching " + kind + " (" + (w.memeBgIdx[kind] + 1) + "/" + pool.length + ")…");
    applyUrl(url);
  };

  w.memeFetchNature = function () { w.memeFetchBg("nature"); };
  w.memeFetchHoly = function () { w.memeFetchBg("holy"); };
  w.memeFetchSurpriseScene = function () { w.memeFetchBg("surprise"); };
  w.memeShowBlankPalette = applyBlank;

  function injectChips() {
    var host = d.querySelector("#meme-bg-chips, .opt-chips[aria-label*='Scenery' i], section.tool-section .opt-chips");
    // find scenery section chips
    var sections = d.querySelectorAll("section.tool-section");
    var chipRow = null;
    sections.forEach(function (sec) {
      if (/Scenery/i.test(sec.textContent || "") && sec.querySelector(".opt-chips")) {
        chipRow = sec.querySelector(".opt-chips");
      }
    });
    if (!chipRow) chipRow = d.querySelector(".tool-section .opt-chips");
    if (!chipRow || chipRow.querySelector("[data-meme-bg-enrich]")) return;
    var extras = [
      { k: "holy", label: "Mosque · ḥaramain" },
      { k: "surprise", label: "✨ Surprise scene" },
      { k: "blank", label: "Blank gradient" }
    ];
    extras.forEach(function (x) {
      var b = d.createElement("button");
      b.type = "button";
      b.setAttribute("data-meme-bg-enrich", x.k);
      b.textContent = x.label;
      b.addEventListener("click", function () { w.memeFetchBg(x.k); });
      chipRow.appendChild(b);
    });
    if (!d.getElementById("meme-fetch-status")) {
      var p = d.createElement("p");
      p.id = "meme-fetch-status";
      p.className = "panel-note";
      p.setAttribute("aria-live", "polite");
      chipRow.parentNode.appendChild(p);
    }
  }

  function boot() {
    ensurePools();
    injectChips();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1500);
})(window, document);
