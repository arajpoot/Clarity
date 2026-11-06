/*! craft-meme-bench-logic-v1
 * Reorder Craft Meme benches into a natural studio flow.
 * Does not remove sections — only reorders + labels.
 * Flow: Message → Surprise pack → Canvas → Scenery → Scale → Export → Desks
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_BENCH_LOGIC_V1__) return;
  w.__CRAFT_MEME_BENCH_LOGIC_V1__ = true;

  function main() {
    return d.querySelector("main") || d.body;
  }

  function sections() {
    return Array.prototype.slice.call(d.querySelectorAll("main .tool-section, .craft-main .tool-section, section.tool-section"));
  }

  function classify(sec) {
    var h = (sec.querySelector("h2") || {}).textContent || "";
    h = h.toLowerCase();
    var id = sec.id || "";
    if (/section source|1 ·/.test(h) || sec.querySelector("[data-meme-section]")) return "sources";
    if (/background|scenery|2 ·/.test(h) || sec.querySelector("[data-meme-bg]")) return "background";
    if (/scale|ratio|3 ·/.test(h) || id === "meme-ratio-section") return "scale";
    if (/canvas|media reminder|4 ·/.test(h) || sec.querySelector("#mr-root")) return "canvas";
    if (/desk|5 ·/.test(h) || id === "desks") return "desks";
    if (/export/.test(h)) return "export";
    return "other";
  }

  function ensureFlowBanner(root) {
    if (d.getElementById("meme-bench-flow")) return;
    var bar = d.createElement("div");
    bar.id = "meme-bench-flow";
    bar.setAttribute("role", "note");
    bar.innerHTML =
      "<strong>Studio flow</strong> · " +
      "<span>1 Message</span> → <span>2 Full surprise</span> → <span>3 Canvas</span> → " +
      "<span>4 Scenery</span> → <span>5 Scale</span> → <span>6 Export</span> → <span>7 Desks</span>" +
      "<small>Educational only — not a fatwa. Enrichment kept; order only.</small>";
    root.insertBefore(bar, root.firstChild);
  }

  function ensureSurprisePack(sourcesSec) {
    if (d.getElementById("meme-full-surprise-pack")) return;
    var pack = d.createElement("div");
    pack.id = "meme-full-surprise-pack";
    pack.className = "tool-section meme-surprise-pack";
    pack.innerHTML =
      "<h2>✨ Full surprise · verse + scene</h2>" +
      "<p class=\"panel-note\">Picks a section line from studio fetch banks, paints it, then matches scenery to the words. Uses the same sources as the chips — no free-type scripture.</p>" +
      "<div class=\"wire-actions\">" +
      "<button type=\"button\" class=\"btn primary\" id=\"meme-full-surprise\">✨ Full surprise</button>" +
      "<button type=\"button\" class=\"btn\" id=\"meme-surprise-verse-only\">📖 Surprise line</button>" +
      "<button type=\"button\" class=\"btn\" id=\"meme-surprise-scene-only\">🖼 Surprise scene</button>" +
      "</div>" +
      "<p id=\"meme-surprise-status\" class=\"panel-note\" aria-live=\"polite\">Ready when you are.</p>";
    if (sourcesSec && sourcesSec.parentNode) {
      sourcesSec.parentNode.insertBefore(pack, sourcesSec.nextSibling);
    } else {
      main().appendChild(pack);
    }
  }

  function reorder() {
    var root = main();
    if (!root) return;
    var list = sections();
    if (list.length < 3) return;

    var map = { sources: null, background: null, scale: null, canvas: null, desks: null, other: [] };
    list.forEach(function (sec) {
      var k = classify(sec);
      if (k === "other") map.other.push(sec);
      else if (!map[k]) map[k] = sec;
      else map.other.push(sec);
    });

    ensureFlowBanner(root);
    if (map.sources) ensureSurprisePack(map.sources);

    var order = [];
    ["sources"].forEach(function (k) { if (map[k]) order.push(map[k]); });
    var pack = d.getElementById("meme-full-surprise-pack");
    if (pack) order.push(pack);
    ["canvas", "background", "scale", "desks"].forEach(function (k) {
      if (map[k]) order.push(map[k]);
    });
    map.other.forEach(function (s) { order.push(s); });

    /* Renumber headings lightly */
    var labels = {
      sources: "1 · Message · section sources",
      canvas: "2 · Canvas",
      background: "3 · Scenery backgrounds",
      scale: "4 · Scale · ratio · text",
      desks: "5 · Desks · share"
    };
    order.forEach(function (sec) {
      if (sec.id === "meme-full-surprise-pack" || sec.id === "meme-bench-flow") return;
      var k = classify(sec);
      var h2 = sec.querySelector("h2");
      if (h2 && labels[k]) h2.textContent = labels[k];
    });

    order.forEach(function (sec) {
      try { root.appendChild(sec); } catch (e) {}
    });

    /* keep footer after */
    var foot = root.querySelector("footer, .craft-footer");
    if (foot) root.appendChild(foot);
  }

  function injectCss() {
    if (d.getElementById("meme-bench-logic-css")) return;
    var s = d.createElement("style");
    s.id = "meme-bench-logic-css";
    s.textContent = [
      "#meme-bench-flow{max-width:52rem;margin:0.5rem auto 0.75rem;padding:0.55rem 0.75rem;",
      "border-radius:12px;border:1px solid rgba(201,162,39,0.35);background:rgba(15,76,58,0.14);font-size:0.8rem;line-height:1.45;}",
      "#meme-bench-flow span{white-space:nowrap;opacity:0.95;}",
      "#meme-bench-flow small{display:block;margin-top:0.25rem;opacity:0.8;font-size:0.72rem;}",
      "#meme-full-surprise-pack{border:1px solid rgba(201,162,39,0.4);border-radius:14px;",
      "padding:0.75rem 0.85rem;margin:0.65rem 0;background:linear-gradient(165deg,rgba(15,76,58,0.25),rgba(8,20,16,0.4));}",
      "#meme-full-surprise-pack h2{margin:0 0 0.35rem;font-size:1.05rem;}",
      ".bg-chips{display:flex;flex-wrap:wrap;gap:0.35rem;}",
      ".bg-chips button{border-radius:999px;}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function boot() {
    injectCss();
    reorder();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 120); });
})(window, document);
