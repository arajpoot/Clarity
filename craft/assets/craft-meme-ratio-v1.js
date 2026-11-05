/*! craft-meme-ratio-v1 · adapted from nuros_meme_ratio_unlock
 * Craft Meme Studio only. Educational only — not a fatwa.
 * Ratios: 1:1 · 16:9 · 4:5 · twitter · facebook
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_RATIO_V1__) return;
  w.__CRAFT_MEME_RATIO_V1__ = true;

  var MAP = { "1:1": "1/1", twitter: "16/9", facebook: "1.91/1", "16:9": "16/9", "4:5": "4/5" };
  var DIMS = { "1:1": [1080, 1080], twitter: [1200, 675], facebook: [1200, 630], "16:9": [1200, 675], "4:5": [1080, 1350] };

  function stage() {
    return d.getElementById("meme-stage") ||
      d.querySelector(".meme-stage") ||
      d.querySelector("#mr-root .craft-canvas-wrap") ||
      d.getElementById("mr-root");
  }
  function canvas() {
    var st = stage();
    return d.getElementById("meme-canvas") ||
      d.getElementById("mr-canvas") ||
      (st && st.querySelector("canvas")) ||
      d.querySelector("#mr-root canvas");
  }

  function applyRatio(r) {
    r = r || "twitter";
    if (!MAP[r] && r !== "facebook") r = "twitter";
    var st = stage();
    var c = canvas();
    if (st) {
      st.style.setProperty("aspect-ratio", MAP[r] || "16/9", "important");
      st.style.setProperty("height", "auto", "important");
      st.style.setProperty("max-height", "52vh", "important");
      st.style.setProperty("width", "100%", "important");
      st.style.setProperty("max-width", "min(100%, 720px)", "important");
    }
    if (c && DIMS[r]) {
      c.width = DIMS[r][0];
      c.height = DIMS[r][1];
    }
    try {
      if (w.memeState) w.memeState.ratio = r;
    } catch (e) {}
    try {
      if (typeof w.memePositionBoxes === "function") w.memePositionBoxes();
    } catch (e) {}
    try {
      if (typeof w.ClarityMediaReminder === "object" && w.ClarityMediaReminder.redraw) {
        w.ClarityMediaReminder.redraw();
      }
    } catch (e) {}
    d.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-meme-ratio") === r);
    });
    var status = d.getElementById("meme-ratio-status");
    if (status) status.textContent = "Ratio · " + r + (DIMS[r] ? " · " + DIMS[r][0] + "×" + DIMS[r][1] : "");
  }

  w.craftMemeSetRatio = applyRatio;
  w.memeSetRatio = w.memeSetRatio || applyRatio;

  function bind() {
    d.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      if (btn._craftRatioBound) return;
      btn._craftRatioBound = true;
      btn.addEventListener("click", function () {
        applyRatio(btn.getAttribute("data-meme-ratio") || "twitter");
      });
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bind);
  else bind();
  setTimeout(bind, 400);
})(window, document);
