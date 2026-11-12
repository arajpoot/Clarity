
/*! banner-enrich-polish-v1.6c · compact · emoji kill · educational only */
(function (w, d) {
  "use strict";
  if (w.__BANNER_ENRICH_POLISH_V16C__) return;
  w.__BANNER_ENRICH_POLISH_V16C__ = true;
  var EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

  function killEmoji(root) {
    if (!root) return;
    try {
      var walk = d.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      while (walk.nextNode()) nodes.push(walk.currentNode);
      nodes.forEach(function (n) {
        if (n.parentElement && /SCRIPT|STYLE|TEXTAREA|svg|SVG/.test(n.parentElement.tagName)) return;
        if (EMOJI_RE.test(n.nodeValue || "")) {
          n.nodeValue = (n.nodeValue || "").replace(EMOJI_RE, "");
        }
      });
      /* remove lone emoji-only elements */
      root.querySelectorAll("span, i, em").forEach(function (el) {
        var t = (el.textContent || "").trim();
        if (t && !el.querySelector("svg") && EMOJI_RE.test(t) && t.replace(EMOJI_RE, "").trim() === "") {
          el.remove();
        }
      });
    } catch (e) {}
  }

  function ensureSvgTemps() {
    var box = d.getElementById("hijri-temps");
    if (!box) return;
    if (!box.querySelector("svg.ht-svg")) {
      /* leave owner; polish only strips emoji */
    }
    killEmoji(box);
  }

  function wireSurahCombo() {
    var toggle = d.getElementById("surah-toggle");
    var panel = d.getElementById("surah-panel");
    var inp = d.getElementById("surah-search");
    var sel = d.getElementById("surah-list-pill");
    if (!toggle || !panel || !sel) return;
    try { sel.size = 8; sel.classList.add("surah-list-in"); } catch (e) {}
    function close() { panel.hidden = true; toggle.setAttribute("aria-expanded", "false"); }
    function open() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      if (inp) setTimeout(function () { inp.focus(); }, 20);
    }
    toggle.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (panel.hidden) open(); else close();
    };
    d.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== toggle) close();
    });
    if (inp && !inp.__wired) {
      inp.__wired = true;
      inp.addEventListener("input", function () {
        var q = String(inp.value || "").toLowerCase().trim();
        for (var i = 0; i < sel.options.length; i++) {
          var t = String(sel.options[i].text || "").toLowerCase();
          var show = !q || t.indexOf(q) >= 0;
          sel.options[i].hidden = !show && !!sel.options[i].value;
        }
      });
    }
    sel.addEventListener("change", function () {
      var opt = sel.options[sel.selectedIndex];
      if (opt && opt.value) {
        toggle.textContent = (opt.textContent || "Surah").slice(0, 22);
        close();
      }
    });
  }

  function postHeight() {
    try {
      var ban = d.querySelector(".banner");
      if (!ban || !w.parent || w.parent === w) return;
      var h = Math.ceil(ban.getBoundingClientRect().height);
      if (h > 40) w.parent.postMessage({ type: "clarity-banner-height", height: Math.min(Math.max(h, 200), 320) }, "*");
    } catch (e) {}
  }

  function boot() {
    ensureSvgTemps();
    wireSurahCombo();
    postHeight();
    d.documentElement.setAttribute("data-banner-enrich", "20261112E6c");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 40); setTimeout(postHeight, 200); });
  setInterval(function () { ensureSvgTemps(); }, 2500);
})(window, document);
