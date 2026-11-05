/*! craft-meme-export-v1 · PNG export for Craft Meme
 * Educational watermark. Not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_EXPORT_V1__) return;
  w.__CRAFT_MEME_EXPORT_V1__ = true;

  function canvas() {
    return d.getElementById("meme-canvas") ||
      d.getElementById("mr-canvas") ||
      d.querySelector("#mr-root canvas") ||
      d.querySelector("canvas");
  }

  function exportPng() {
    var c = canvas();
    if (!c) {
      alert("Canvas not ready");
      return;
    }
    try {
      var url = c.toDataURL("image/png");
      var a = d.createElement("a");
      a.href = url;
      a.download = "clarity-craft-meme-" + Date.now() + ".png";
      a.click();
      var st = d.getElementById("meme-export-status");
      if (st) st.textContent = "PNG downloaded · educational only";
    } catch (e) {
      alert("Export blocked (canvas tainted or not ready). Try a solid background.");
    }
  }

  w.craftMemeExportPng = exportPng;

  function bind() {
    var btn = d.getElementById("meme-export-png") || d.querySelector("[data-meme-export='png']");
    if (btn && !btn._craftExportBound) {
      btn._craftExportBound = true;
      btn.addEventListener("click", exportPng);
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bind);
  else bind();
  setTimeout(bind, 400);
})(window, document);
