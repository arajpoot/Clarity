/*! companion-meme-show-v1
 * Force-visible studio · mobile canvas · clear · ok noise · repaint
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_SHOW_V1__) return;
  w.__COMPANION_MEME_SHOW_V1__ = true;

  function injectCss() {
    if (d.getElementById("meme-show-css")) return;
    var s = d.createElement("style");
    s.id = "meme-show-css";
    s.textContent = [
      "/* Force meme studio open on mobile + desktop */",
      "#meme-studio-root, #meme-studio-root.meme-studio {",
      "  display:flex !important; flex-direction:column !important;",
      "  visibility:visible !important; opacity:1 !important;",
      "  max-height:none !important; height:auto !important;",
      "  overflow:visible !important; width:100% !important;",
      "  gap:0.45rem !important;",
      "}",
      "#meme-bg-bar, #meme-studio-root .meme-bar-bg, #meme-studio-root .meme-chip-row {",
      "  display:flex !important; flex-wrap:wrap !important;",
      "  visibility:visible !important; gap:0.3rem !important;",
      "}",
      "#meme-stage, #meme-studio-root .meme-stage, .meme-stage-wrap {",
      "  display:block !important; visibility:visible !important;",
      "  width:100% !important; min-height:200px !important;",
      "  position:relative !important;",
      "}",
      "#meme-canvas {",
      "  display:block !important; visibility:visible !important;",
      "  width:100% !important; max-width:100% !important;",
      "  height:auto !important; min-height:180px !important;",
      "  border-radius:14px !important;",
      "}",
      "#meme-core-bar, #meme-night-size {",
      "  display:flex !important; flex-wrap:wrap !important;",
      "  visibility:visible !important; width:100% !important;",
      "}",
      "/* Mobile comfort */",
      "@media (max-width: 720px) {",
      "  #meme-studio-root { padding:0.25rem 0 !important; }",
      "  #meme-canvas { min-height:220px !important; }",
      "  #meme-studio-root .mv-chip, #meme-studio-root button.mv-chip {",
      "    font-size:0.72rem !important; padding:0.28rem 0.55rem !important;",
      "  }",
      "  #meme-core-bar { font-size:0.7rem !important; }",
      "}",
      "/* Soft status — no · ok spam */",
      "#meme-fetch-status.meme-status:empty { display:none; }"
    ].join("\n");
    (d.head || d.documentElement).appendChild(s);
  }

  function clearOkStatus() {
    var el = d.getElementById("meme-fetch-status");
    if (!el) return;
    var t = (el.textContent || "").trim();
    if (/·\s*ok\s*$/i.test(t) || /^(ok|ready)$/i.test(t)) el.textContent = "";
  }

  function forceDom() {
    var root = d.getElementById("meme-studio-root");
    if (!root) return;
    root.style.display = "flex";
    root.style.visibility = "visible";
    root.style.opacity = "1";
    root.style.maxHeight = "none";
    root.removeAttribute("hidden");
    root.setAttribute("data-meme-shown", "1");

    ["meme-stage", "meme-bg-bar", "meme-canvas"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      el.style.display = id === "meme-canvas" ? "block" : "";
      el.style.visibility = "visible";
      el.hidden = false;
    });
    var canvas = d.getElementById("meme-canvas");
    if (canvas) {
      canvas.style.width = "100%";
      canvas.style.minHeight = "200px";
    }
  }

  function repaint() {
    try {
      if (typeof w.paintMeme === "function") w.paintMeme();
      else if (typeof w.memeDraw === "function") w.memeDraw();
    } catch (e) {}
  }

  function boot() {
    injectCss();
    forceDom();
    clearOkStatus();
    repaint();
    // after layout
    setTimeout(function () {
      forceDom();
      clearOkStatus();
      repaint();
    }, 200);
    setTimeout(repaint, 600);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 50); });
  w.addEventListener("resize", function () {
    forceDom();
    repaint();
  });

  var n = 0;
  var iv = setInterval(function () {
    n++;
    forceDom();
    clearOkStatus();
    if (n === 3 || n === 8) repaint();
    if (n >= 15) clearInterval(iv);
  }, 300);
})(window, document);
