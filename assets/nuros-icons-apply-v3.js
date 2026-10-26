/**
 * NurOS v3 apply — color plaques, strip emoji doubles
 */
(function (g) {
  "use strict";
  if (g.__NUROS_ICONS_V3__) return;
  g.__NUROS_ICONS_V3__ = true;

  var TAB_MAP = [
    { match: /reminder/i, icon: "reminder" },
    { match: /reality/i, icon: "reality" },
    { match: /reflection/i, icon: "reflection" },
    { match: /action/i, icon: "action" },
    { match: /vault|amana/i, icon: "vault" }
  ];

  function make(name) {
    var el = document.createElement("span");
    el.className = "nuros-icon nuros-icon-" + name;
    el.setAttribute("aria-hidden", "true");
    el.setAttribute("role", "img");
    return el;
  }

  function stripEmoji(el) {
    if (!el) return;
    var child = el.firstChild, guard = 0;
    while (child && guard++ < 8) {
      if (child.nodeType === 1) {
        var cls = (child.className || "").toString();
        if (cls.indexOf("nuros-") >= 0) break;
        var t = (child.textContent || "").trim();
        if ((child.tagName === "SPAN" || child.tagName === "I") && (t.length <= 3 || /[\u{1F300}-\u{1FAFF}]/u.test(t))) {
          var n = child.nextSibling;
          try { child.parentNode.removeChild(child); } catch (e) {}
          child = n;
          continue;
        }
        break;
      }
      if (child.nodeType === 3) {
        child.textContent = (child.textContent || "").replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D⌂🏠🎓📚🕌🌙✦◉☾➤🔒🌱🛡️]+/u, "");
        break;
      }
      break;
    }
  }

  function decorate(el, name) {
    if (!el) return;
    el.querySelectorAll(":scope > .nuros-icon, :scope > .nuros-plaque").forEach(function (n) {
      try { n.parentNode.removeChild(n); } catch (e) {}
    });
    stripEmoji(el);
    el.insertBefore(make(name), el.firstChild);
    el.setAttribute("data-nuros-iconized", "1");
  }

  function boot() {
    try {
      document.querySelectorAll("#clarity-door-rail button, .door-rail-btn, nav.tab-bar button").forEach(function (btn) {
        var label = (btn.getAttribute("data-tab") || btn.getAttribute("aria-label") || btn.textContent || "").trim();
        TAB_MAP.forEach(function (m) {
          if (m.match.test(label)) decorate(btn, m.icon);
        });
      });
      document.querySelectorAll(".dual-tile, [id*='dual-path']").forEach(function (tile) {
        var n = (tile.textContent || "").toLowerCase();
        if (/university|campus/.test(n)) decorate(tile, "campus");
        else if (/companion/.test(n)) decorate(tile, "companion");
      });
      document.querySelectorAll(".cdl-card h2, .cdl-card h3, #cdl-today h2, #cdl-adhkar h2").forEach(function (h) {
        if (h.getAttribute("data-nuros-iconized") === "1") return;
        var t = (h.textContent || "").toLowerCase();
        if (/adhk|dhikr|tasb/.test(t)) decorate(h, "tasbih");
        else if (/do this|today/.test(t)) decorate(h, "today");
        else if (/vault|note|registry|am[aā]nah/.test(t)) decorate(h, "vault");
        else if (/ṣalāh|salah|next/.test(t)) decorate(h, "salah");
      });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [400, 1200, 2500].forEach(function (ms) { setTimeout(boot, ms); });
  document.addEventListener("clarity:companion-ready", boot);
})(typeof window !== "undefined" ? window : this);
