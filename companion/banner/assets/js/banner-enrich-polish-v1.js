/*! banner-enrich-polish-v1.5 · surah combo · viewport lock · emoji kill · educational only */
(function (w, d) {
  "use strict";
  if (w.__BANNER_ENRICH_POLISH_V15__) return;
  w.__BANNER_ENRICH_POLISH_V15__ = true;

  var EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

  function killEmoji(root) {
    try {
      var walk = d.createTreeWalker(root || d.body, NodeFilter.SHOW_TEXT, null);
      var nodes = [];
      while (walk.nextNode()) nodes.push(walk.currentNode);
      nodes.forEach(function (n) {
        if (n.parentElement && /SCRIPT|STYLE|TEXTAREA/.test(n.parentElement.tagName)) return;
        if (EMOJI_RE.test(n.nodeValue || "")) {
          n.nodeValue = (n.nodeValue || "").replace(EMOJI_RE, "");
        }
      });
    } catch (e) {}
  }

  function wireSurahCombo() {
    var toggle = d.getElementById("surah-toggle");
    var panel = d.getElementById("surah-panel");
    var inp = d.getElementById("surah-search");
    var sel = d.getElementById("surah-list-pill");
    if (!toggle || !panel || !sel) return;

    function close() {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
    function open() {
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      if (inp) setTimeout(function () { inp.focus(); }, 30);
    }

    toggle.onclick = function (e) {
      e.preventDefault();
      if (panel.hidden) open();
      else close();
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
          var show = !q || t.indexOf(q) >= 0 || String(sel.options[i].value) === q;
          sel.options[i].hidden = !show && !!sel.options[i].value;
        }
      });
    }
    sel.addEventListener("change", function () {
      var opt = sel.options[sel.selectedIndex];
      if (opt && opt.value) {
        toggle.textContent = opt.textContent.slice(0, 18);
        close();
        if (typeof w.clarityPlaySurahFromSelect === "function") {
          /* user still presses Play — only update label */
        }
      }
    });
  }

  function lockViewport() {
    try {
      d.documentElement.style.overflow = "hidden";
      d.body.style.overflow = "hidden";
      var ban = d.querySelector(".banner");
      if (!ban) return;
      var h = Math.round(ban.getBoundingClientRect().height);
      if (w.parent && w.parent !== w && h > 40) {
        w.parent.postMessage({ type: "clarity-banner-height", height: Math.min(h, 420) }, "*");
      }
    } catch (e) {}
  }

  function boot() {
    killEmoji(d.body);
    wireSurahCombo();
    lockViewport();
    d.documentElement.setAttribute("data-banner-enrich", "20261112E5");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 50);
    setTimeout(lockViewport, 300);
  });
  setInterval(function () {
    killEmoji(d.getElementById("hijri-temps") || d.body);
    lockViewport();
  }, 3000);
})(window, document);
