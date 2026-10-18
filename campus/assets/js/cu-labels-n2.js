/**
 * N2 Display labels — harmonize Junior/New Muslim/Daily/Da'i → Seeker/Practice/Consistency/Transmission
 * Does not rewrite sealed foundation files; overlays visible text in desk/map chrome.
 */
(function (g) {
  "use strict";
  if (g.__CU_LABELS_N2__) return;
  g.__CU_LABELS_N2__ = true;

  var MAP = [
    [/Junior curriculum\s*[—–-]\s*Phase\s*1/gi, "Seeker · modules"],
    [/Junior curriculum/gi, "Seeker modules"],
    [/\bJunior\b(?!\s*practice)/g, "Seeker"],
    [/New Muslim path/gi, "Practice path"],
    [/\bNew Muslim\b/g, "Practice"],
    [/Daily HS/gi, "Consistency"],
    [/\bDaily\b(?=\s*Muslim|\s*·|\s*$)/g, "Consistency"],
    [/Da['']i university/gi, "Transmission"],
    [/\bDa['']i\b/g, "Transmission"],
    [/Junior High/gi, "Practice"],
    [/Phase 1 of 4 · Junior/gi, "Phase 1 of 4 · Seeker"],
    [/1 Junior/g, "1 Seeker"],
    [/2 New Muslim/g, "2 Practice"],
    [/3 Daily/g, "3 Consistency"],
    [/4 Da['']i/g, "4 Transmission"]
  ];

  function rewriteTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    var v = node.nodeValue;
    if (!v || !v.trim()) return;
    var next = v;
    MAP.forEach(function (pair) {
      next = next.replace(pair[0], pair[1]);
    });
    if (next !== v) node.nodeValue = next;
  }

  function walk(root) {
    if (!root) return;
    var skip = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1 };
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (p && skip[p.tagName]) continue;
      rewriteTextNode(n);
    }
  }

  function run() {
    try {
      walk(document.getElementById("cu-stage"));
      walk(document.getElementById("clarity-phase-plaque-host"));
      walk(document.getElementById("clarity-how-phases-slot"));
      walk(document.querySelector("main.cu-wrap"));
    } catch (e) {}
  }

  function boot() {
    run();
    var m = document.querySelector("main.cu-wrap");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      var obs = new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 120);
      });
      obs.observe(m, { childList: true, subtree: true });
    }
    setTimeout(run, 600);
    setTimeout(run, 1800);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
