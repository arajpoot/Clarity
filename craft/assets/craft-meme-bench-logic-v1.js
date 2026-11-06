/*! craft-meme-bench-logic-v1 · C18.2
 * Strict bench order (scenery + surprise ABOVE desks):
 * Message → Full surprise → Scenery → Canvas/export → Scale → Desks
 */
(function (w, d) {
  "use strict";
  w.__CRAFT_MEME_BENCH_LOGIC_V1__ = true;

  function root() {
    return d.querySelector("main.craft-main") || d.querySelector("main") || d.body;
  }

  function classify(sec) {
    if (!sec || !sec.getAttribute) return "other";
    if (sec.id === "meme-full-surprise-pack") return "surprise";
    if (sec.id === "meme-bench-flow") return "flow";
    if (sec.id === "desks" || sec.classList.contains("desks-row")) return "desks";
    if (sec.id === "meme-ratio-section") return "scale";
    if (sec.querySelector && sec.querySelector("#mr-root")) return "canvas";
    if (sec.querySelector && sec.querySelector("[data-meme-bg], .bg-chips")) return "background";
    if (sec.querySelector && sec.querySelector("[data-meme-section]")) return "sources";
    var h = ((sec.querySelector("h2") || {}).textContent || "").toLowerCase();
    if (/surprise|verse \+ scene/.test(h)) return "surprise";
    if (/scenery|background/.test(h)) return "background";
    if (/scale|ratio/.test(h)) return "scale";
    if (/canvas|media reminder/.test(h)) return "canvas";
    if (/desk/.test(h)) return "desks";
    if (/section source|message/.test(h)) return "sources";
    return "other";
  }

  function reorder() {
    var r = root();
    if (!r) return;
    var secs = Array.prototype.slice.call(r.querySelectorAll(":scope > section.tool-section, :scope > #meme-full-surprise-pack, :scope > #meme-bench-flow"));
    if (!secs.length) {
      secs = Array.prototype.slice.call(d.querySelectorAll("section.tool-section, #meme-full-surprise-pack"));
    }
    var buckets = {
      flow: [], sources: [], surprise: [], background: [], canvas: [], scale: [], desks: [], other: []
    };
    secs.forEach(function (sec) {
      var k = classify(sec);
      (buckets[k] || buckets.other).push(sec);
    });

    var order = []
      .concat(buckets.flow)
      .concat(buckets.sources)
      .concat(buckets.surprise)
      .concat(buckets.background)
      .concat(buckets.canvas)
      .concat(buckets.scale)
      .concat(buckets.desks)
      .concat(buckets.other);

    order.forEach(function (sec) {
      try { r.appendChild(sec); } catch (e) {}
    });

    /* Renumber visible titles */
    var titleMap = {
      sources: "1 · Message · section sources",
      surprise: "✨ Full surprise · verse + scene",
      background: "2 · Scenery backgrounds",
      canvas: "3 · Canvas · export",
      scale: "4 · Scale · ratio · text",
      desks: "5 · Desks · share"
    };
    order.forEach(function (sec) {
      var k = classify(sec);
      var h2 = sec.querySelector && sec.querySelector("h2");
      if (h2 && titleMap[k]) h2.textContent = titleMap[k];
    });
  }

  function boot() {
    reorder();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 50);
    setTimeout(boot, 300);
    setTimeout(boot, 900);
  });
  /* late layout shifts from media bench */
  setInterval(function () {
    var desks = d.getElementById("desks");
    var bg = d.querySelector(".bg-chips");
    if (desks && bg) {
      var pos = desks.compareDocumentPosition(bg.parentElement || bg);
      /* if bg is AFTER desks, reorder */
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) {
        /* bg follows desks? actually FOLLOWING means bg is after desks in tree — bad */
        boot();
      }
    }
  }, 2000);
})(window, document);
