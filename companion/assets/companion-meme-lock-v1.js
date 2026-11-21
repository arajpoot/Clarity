/*! companion-meme-lock-v1
 * Quarantine re-injected duplicate sliders · one compact strip · calm BG · less interval noise
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_LOCK_V1__) return;
  w.__COMPANION_MEME_LOCK_V1__ = true;

  function $(id) { return d.getElementById(id); }

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    var s = w.memeState;
    if (s.posTop == null) s.posTop = 26;
    if (s.posMid == null) s.posMid = 50;
    if (s.posBot == null) s.posBot = 72;
    if (s.scaleTop == null) s.scaleTop = 100;
    if (s.scaleMid == null) s.scaleMid = 100;
    if (s.scaleBot == null) s.scaleBot = 95;
    return s;
  }

  function status(msg) {
    var el = $("meme-fetch-status") || $("meme-rrra-status");
    if (el) el.textContent = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
  }

  /* Plant hidden dummy so rich-v1 injectControls() thinks panel exists and stops re-adding visible UI */
  function quarantineRich() {
    var nodes = d.querySelectorAll("#meme-rich-controls");
    nodes.forEach(function (n, i) {
      if (n.getAttribute("data-quarantine") === "1") return;
      n.remove();
    });
    if (!$("meme-rich-controls")) {
      var dummy = d.createElement("div");
      dummy.id = "meme-rich-controls";
      dummy.setAttribute("data-quarantine", "1");
      dummy.style.display = "none";
      dummy.setAttribute("aria-hidden", "true");
      (d.body || d.documentElement).appendChild(dummy);
    }
  }

  function ensureOnePeaceSlider() {
    var root = $("meme-studio-root");
    var list = d.querySelectorAll("#meme-peace-sliders");
    var keep = null;
    list.forEach(function (el) {
      if (root && root.contains(el) && !keep) keep = el;
      else if (keep) el.remove();
      else if (!keep) keep = el;
    });
    // remove extras not keep
    d.querySelectorAll("#meme-peace-sliders").forEach(function (el) {
      if (keep && el !== keep) el.remove();
    });
    if (!keep && root) {
      var box = d.createElement("div");
      box.id = "meme-peace-sliders";
      box.style.cssText =
        "margin:.4rem 0;padding:.45rem .65rem;border:1px solid rgba(212,180,90,.3);border-radius:10px;background:rgba(0,0,0,.18);font-size:.72rem";
      box.innerHTML =
        '<div style="opacity:.85;margin-bottom:.25rem">Size 40–180% · Place · drag handles on canvas</div>' +
        '<div style="display:grid;grid-template-columns:auto 1fr;gap:.2rem .5rem;align-items:center">' +
        '<span>Top size <b id="ps-st">100</b>%</span><input type="range" id="ps-scale-top" min="40" max="180" value="100"/>' +
        '<span>Top place <b id="ps-pt">26</b>%</span><input type="range" id="ps-pos-top" min="8" max="90" value="26"/>' +
        '<span>Mid size <b id="ps-sm">100</b>%</span><input type="range" id="ps-scale-mid" min="40" max="180" value="100"/>' +
        '<span>Mid place <b id="ps-pm">50</b>%</span><input type="range" id="ps-pos-mid" min="8" max="90" value="50"/>' +
        '<span>Bot size <b id="ps-sb">95</b>%</span><input type="range" id="ps-scale-bot" min="40" max="180" value="95"/>' +
        '<span>Bot place <b id="ps-pb">72</b>%</span><input type="range" id="ps-pos-bot" min="8" max="90" value="72"/>' +
        "</div>";
      var stage = $("meme-stage");
      if (stage && stage.parentNode) stage.parentNode.insertBefore(box, stage.nextSibling);
      else root.appendChild(box);
      keep = box;
      wireSliders(box);
    } else if (keep) {
      wireSliders(keep);
    }
  }

  function wireSliders(box) {
    if (!box || box.__locked) return;
    box.__locked = true;
    function bind(id, key, lab) {
      var el = $(id);
      if (!el || el.__locked) return;
      el.__locked = true;
      el.addEventListener("input", function () {
        var v = parseInt(el.value, 10);
        S()[key] = v;
        var L = $(lab);
        if (L) L.textContent = String(v);
        if (typeof w.paintMeme === "function") w.paintMeme();
        else if (typeof w.memeDraw === "function") w.memeDraw();
      });
    }
    bind("ps-scale-top", "scaleTop", "ps-st");
    bind("ps-scale-mid", "scaleMid", "ps-sm");
    bind("ps-scale-bot", "scaleBot", "ps-sb");
    bind("ps-pos-top", "posTop", "ps-pt");
    bind("ps-pos-mid", "posMid", "ps-pm");
    bind("ps-pos-bot", "posBot", "ps-pb");
  }

  function hideChromeNoise() {
    var root = $("meme-studio-root");
    if (!root) return;
    // LINE SIZE dropdown row
    root.querySelectorAll("div, section").forEach(function (el) {
      if (el.id === "meme-peace-sliders" || el.id === "meme-post-v2-bar") return;
      var tx = el.textContent || "";
      if (/LINE SIZE\s*[·•]\s*TEXT STYLE/i.test(tx) && el.querySelectorAll("select").length >= 3) {
        el.style.display = "none";
      }
      // long labeled slider panel text
      if (/Top \(Arabic\) size/.test(tx) && /Middle \(English\) size/.test(tx) && el.querySelectorAll('input[type="range"]').length >= 5) {
        if (el.id !== "meme-peace-sliders") el.style.display = "none";
      }
    });
    // duplicate Auto-scale Save Tweet above canvas
    var canvas = $("meme-canvas");
    if (!canvas) return;
    root.querySelectorAll("div").forEach(function (bar) {
      if (bar.id === "meme-post-v2-bar") return;
      var tx = (bar.textContent || "").replace(/\s+/g, " ");
      if (/Auto-scale/i.test(tx) && /Save/i.test(tx) && /Tweet Desk/i.test(tx)) {
        try {
          if (canvas.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_PRECEDING) {
            bar.style.display = "none";
          }
        } catch (e) {}
      }
    });
  }

  /* Calm BG */
  var SCENES = {
    nature: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80"],
    holy: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg", "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1280&q=80"],
    flowers: ["https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80"],
    night: ["https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80", "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1280&q=80"],
    water: ["https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80"],
    spirit: ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80"],
    free: ["https://picsum.photos/seed/clarity-lock/1280/720"],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"]
  };
  var idx = {}, lockBg = false;

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      S().img = null;
      S().bgImage = null;
      status("");
      if (w.paintMeme) w.paintMeme();
      return;
    }
    if (/context/.test(kind)) kind = "spirit";
    if (/décor|decor/.test(kind)) kind = "decor";
    if (!SCENES[kind]) kind = "nature";
    var list = SCENES[kind];
    if (idx[kind] == null) idx[kind] = 0;
    var url = list[idx[kind] % list.length];
    idx[kind]++;
    if (lockBg) return;
    lockBg = true;
    status("Scene · " + kind);
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      lockBg = false;
      S().img = img;
      S().bgImage = img;
      status("");
      if (w.paintMeme) w.paintMeme();
      else if (w.memeDraw) w.memeDraw();
    };
    img.onerror = function () {
      lockBg = false;
      status("Scene unavailable");
    };
    img.src = url;
  }

  function wireBg() {
    var root = $("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-bg], [data-meme-decor]").forEach(function (btn) {
      if (btn.__lockBg) return;
      btn.__lockBg = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var kind = btn.getAttribute("data-meme-bg") || btn.getAttribute("data-meme-decor");
          if (!kind) {
            var t = (btn.textContent || "").toLowerCase();
            if (/nature/.test(t)) kind = "nature";
            else if (/holy/.test(t)) kind = "holy";
            else if (/flower/.test(t)) kind = "flowers";
            else if (/night/.test(t)) kind = "night";
            else if (/water/.test(t)) kind = "water";
            else if (/spirit/.test(t)) kind = "spirit";
            else if (/free/.test(t)) kind = "free";
            else if (/blank/.test(t)) kind = "blank";
            else if (/pattern/.test(t)) kind = "pattern";
            else if (/decor|décor/.test(t)) kind = "decor";
            else if (/context/.test(t)) kind = "spirit";
            else return;
          }
          ev.preventDefault();
          ev.stopImmediatePropagation();
          loadScene(kind);
        },
        true
      );
    });
  }

  function tick() {
    quarantineRich();
    ensureOnePeaceSlider();
    hideChromeNoise();
    wireBg();
  }

  function boot() {
    tick();
    w.memeFetchBg = function (k) {
      loadScene(k);
      return Promise.resolve(true);
    };
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 60); });

  /* MutationObserver instead of noisy long intervals */
  try {
    var mo = new MutationObserver(function () {
      quarantineRich();
      // if rich re-added a visible panel, kill it
      d.querySelectorAll("#meme-rich-controls:not([data-quarantine])").forEach(function (n) {
        n.remove();
      });
      if (!$("meme-rich-controls")) quarantineRich();
      var pe = d.querySelectorAll("#meme-peace-sliders");
      if (pe.length > 1) ensureOnePeaceSlider();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  // short settle only
  var n = 0;
  var iv = setInterval(function () {
    n++;
    tick();
    if (n >= 20) clearInterval(iv);
  }, 250);
})(window, document);
