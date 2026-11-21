/*! companion-meme-cleanup-v1
 * Remove duplicate sliders/auto bars · calm BG pills · single peace path
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_CLEANUP_V1__) return;
  w.__COMPANION_MEME_CLEANUP_V1__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    return w.memeState;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (!el) return;
    el.textContent = (msg || "").replace(/\s*·\s*ok\s*$/i, "");
  }

  /* Remove duplicate UI */
  function stripDupes() {
    var root = d.getElementById("meme-studio-root") || d;
    // long legacy slider block from rich-v1
    var rich = d.getElementById("meme-rich-controls");
    if (rich) rich.remove();
    // any second peace slider
    var peaces = d.querySelectorAll("#meme-peace-sliders");
    if (peaces.length > 1) {
      for (var i = 1; i < peaces.length; i++) peaces[i].remove();
    }
    // hide noisy LINE SIZE dropdown row + duplicate auto-scale clusters
    root.querySelectorAll(".meme-scale-row, .meme-line-size, #meme-scale-controls, .fq-level-row").forEach(function () {});
    root.querySelectorAll("label, .meme-tool-label, div").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (/^LINE SIZE/i.test(t) || /^Text size & vertical place · drag sliders/i.test(t)) {
        var block = el.closest(".card, .meme-bar, section, div");
        if (block && block.id !== "meme-peace-sliders" && block.querySelector && block.querySelector('input[type="range"]') && block.querySelectorAll('input[type="range"]').length >= 4) {
          // old long panel
          if (block.id === "meme-rich-controls" || /Top \(Arabic\) size/.test(block.textContent || "")) {
            if (block.id !== "meme-peace-sliders") block.style.display = "none";
          }
        }
      }
    });
    // Hide dropdown LINE SIZE · TEXT STYLE block (selects at 100%)
    root.querySelectorAll("select").forEach(function (sel) {
      var id = sel.id || "";
      if (/scale|size|font|face/i.test(id) || /Top \(Arabic\)|Middle \(English\)|Bottom \(ref\)/.test((sel.previousElementSibling && sel.previousElementSibling.textContent) || "")) {
        var row = sel.closest(".meme-bar, .td-row, .meme-tool-row, div");
        if (row && !row.querySelector("#meme-peace-sliders")) {
          // if row only has selects for line size
          var selects = row.querySelectorAll("select");
          if (selects.length >= 2) row.style.display = "none";
        }
      }
    });
    // Duplicate Auto-scale / Save / Tweet Desk above canvas — keep one set near bottom if any
    var autoBars = [];
    root.querySelectorAll("button, label").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Auto-scale$/i.test(t) || (el.type === "checkbox" && /auto-scale/i.test((el.parentElement && el.parentElement.textContent) || ""))) {
        autoBars.push(el.closest(".meme-bar, .td-row, div") || el.parentElement);
      }
    });
    // hide first auto-scale cluster above canvas if multiple
    var canvas = d.getElementById("meme-canvas");
    if (canvas && autoBars.length > 1) {
      autoBars.forEach(function (bar, idx) {
        if (!bar || bar.id === "meme-peace-sliders") return;
        try {
          var beforeCanvas = !!(canvas.compareDocumentPosition(bar) & Node.DOCUMENT_POSITION_PRECEDING);
          if (beforeCanvas && idx === 0) {
            // leave top minimal chrome; hide redundant auto row only if it also has Save+Tweet
            var tx = bar.textContent || "";
            if (/Auto-scale/i.test(tx) && /Save/i.test(tx) && /Tweet/i.test(tx)) {
              bar.style.display = "none";
            }
          }
        } catch (e) {}
      });
    }
  }

  /* Calm BG catalog */
  var SCENES = {
    nature: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1280&q=80"
    ],
    holy: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Mount_Arafat.jpg/800px-Mount_Arafat.jpg",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1280&q=80"
    ],
    flowers: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1280&q=80",
      "https://images.unsplash.com/photo-1462275646964-a0e2d0693f7d?w=1280&q=80"
    ],
    night: [
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1280&q=80",
      "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1280&q=80"
    ],
    water: [
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1280&q=80",
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&q=80"
    ],
    spirit: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1280&q=80",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1280&q=80"
    ],
    free: [
      "https://picsum.photos/seed/clarity-free-b/1280/720",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&q=80"
    ],
    pattern: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1280&q=80"],
    decor: ["https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1280&q=80"]
  };
  var sceneIdx = {};
  var lock = false;

  function repaint() {
    if (typeof w.paintMeme === "function") try { w.paintMeme(); return; } catch (e) {}
    if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e2) {}
  }

  function loadScene(kind) {
    kind = String(kind || "nature").toLowerCase().replace(/\s+/g, "");
    if (kind === "blank") {
      var s = S();
      s.img = null;
      s.bgImage = null;
      status("Blank");
      repaint();
      return;
    }
    var key = kind;
    if (/context/.test(key)) key = "spirit";
    if (/décor|decor/.test(key)) key = "decor";
    if (!(key in SCENES)) key = "nature";
    var list = SCENES[key];
    if (sceneIdx[key] == null) sceneIdx[key] = 0;
    var url = list[sceneIdx[key] % list.length];
    sceneIdx[key]++;
    if (lock) return;
    lock = true;
    status("Scene · " + key);
    var img = new Image();
    img.crossOrigin = "anonymous";
    var done = false;
    function finish(ok) {
      if (done) return;
      done = true;
      lock = false;
      if (ok) {
        var st = S();
        st.img = img;
        st.bgImage = img;
        status("");
        repaint();
      } else status("Scene unavailable");
    }
    img.onload = function () { finish(true); };
    img.onerror = function () {
      var alt = list[sceneIdx[key] % list.length];
      if (alt && alt !== url) {
        var img2 = new Image();
        img2.crossOrigin = "anonymous";
        img2.onload = function () { img = img2; finish(true); };
        img2.onerror = function () { finish(false); };
        img2.src = alt;
      } else finish(false);
    };
    img.src = url;
  }

  function wireBg() {
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-bg], [data-meme-decor]").forEach(function (btn) {
      if (btn.__cleanBg) return;
      btn.__cleanBg = true;
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
            else if (/décor|decor/.test(t)) kind = "decor";
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

  function hideLongSliderPanel() {
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    root.querySelectorAll("div").forEach(function (div) {
      if (div.id === "meme-peace-sliders" || div.id === "meme-post-v2-bar") return;
      var tx = div.textContent || "";
      if (tx.indexOf("Top (Arabic) size") >= 0 && tx.indexOf("Middle (English) size") >= 0 && div.querySelectorAll('input[type="range"]').length >= 5) {
        div.style.display = "none";
      }
    });
  }

  function boot() {
    stripDupes();
    hideLongSliderPanel();
    wireBg();
    w.memeFetchBg = function (k) {
      loadScene(k);
      return Promise.resolve(true);
    };
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });

  var n = 0;
  var iv = setInterval(function () {
    n++;
    stripDupes();
    hideLongSliderPanel();
    wireBg();
    if (n > 15) clearInterval(iv);
  }, 400);
})(window, document);
