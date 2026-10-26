/**
 * NurOS Icon Pack v2 apply — single plaque icons, strip emoji doubles
 */
(function (g) {
  "use strict";
  if (g.__NUROS_ICONS_V2__) return;
  g.__NUROS_ICONS_V2__ = true;

  var TAB_MAP = [
    { match: /reminder/i, icon: "reminder" },
    { match: /reality/i, icon: "reality" },
    { match: /reflection/i, icon: "reflection" },
    { match: /action/i, icon: "action" },
    { match: /vault|amana/i, icon: "vault" }
  ];

  function makeIcon(name, plaque) {
    var ic = document.createElement("span");
    ic.className = "nuros-icon nuros-icon-" + name;
    ic.setAttribute("aria-hidden", "true");
    if (plaque) {
      var wrap = document.createElement("span");
      wrap.className = "nuros-plaque";
      wrap.setAttribute("aria-hidden", "true");
      wrap.appendChild(ic);
      return wrap;
    }
    return ic;
  }

  function stripLeadingEmoji(el) {
    if (!el) return;
    // Remove pure-emoji text nodes / spans at start
    var child = el.firstChild;
    var guard = 0;
    while (child && guard++ < 6) {
      if (child.nodeType === 1) {
        var cls = (child.className || "").toString();
        if (cls.indexOf("nuros-") >= 0) break;
        var t = (child.textContent || "").trim();
        if (child.tagName === "SPAN" || child.tagName === "I" || child.tagName === "EM") {
          if (/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]+$/u.test(t) || t.length <= 2 && /[^\x00-\x7F]/.test(t)) {
            var next = child.nextSibling;
            child.parentNode.removeChild(child);
            child = next;
            continue;
          }
        }
        break;
      }
      if (child.nodeType === 3) {
        var s = child.textContent || "";
        var stripped = s.replace(/^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D⌂🏠🎓📚🕌🌙✦◉☾➤]+/u, "");
        if (stripped !== s) child.textContent = stripped.replace(/^\s+/, "");
        break;
      }
      break;
    }
    // Also scrub innerHTML leading emoji in strong titles
    el.querySelectorAll("strong, .tile-title, h2, h3").forEach(function (h) {
      if (h.querySelector(".nuros-icon")) return;
      var ht = h.innerHTML || "";
      h.innerHTML = ht.replace(/^(\s|<[^>]+>)*([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D⌂🏠🎓📚]{1,4}\s*)+/u, "");
    });
  }

  function decorate(el, iconName, plaque) {
    if (!el || el.getAttribute("data-nuros-iconized") === "1") return;
    // remove prior nuros icons to avoid triple
    el.querySelectorAll(":scope > .nuros-icon, :scope > .nuros-plaque").forEach(function (n) {
      n.parentNode.removeChild(n);
    });
    stripLeadingEmoji(el);
    var node = makeIcon(iconName, plaque);
    el.insertBefore(node, el.firstChild);
    el.setAttribute("data-nuros-iconized", "1");
  }

  function boot() {
    try {
      // Door rail / tabs
      document.querySelectorAll(
        "#clarity-door-rail button, .door-rail-btn, nav.tab-bar button, .mobile-tab-bar button"
      ).forEach(function (btn) {
        var label = (btn.getAttribute("data-tab") || btn.getAttribute("aria-label") || btn.textContent || "").trim();
        TAB_MAP.forEach(function (m) {
          if (m.match.test(label)) decorate(btn, m.icon, true);
        });
      });

      // Dual path tiles
      document.querySelectorAll(".dual-tile, #dual-path-companion, #dual-path-university, [id*='dual-path']").forEach(function (tile) {
        var n = (tile.textContent || "").toLowerCase();
        if (/university|campus/.test(n)) decorate(tile, "campus", true);
        else if (/companion/.test(n)) decorate(tile, "companion", true);
      });

      // Landing daily cards
      document.querySelectorAll(".cdl-card, #cdl-today, #cdl-adhkar, [class*='do-this'], [class*='adhkar']").forEach(function (card) {
        if (card.getAttribute("data-nuros-iconized") === "1") return;
        var t = (card.textContent || "").toLowerCase();
        if (/adhk|dhikr|tasb/.test(t)) decorate(card.querySelector("h2,h3,.cdl-head") || card, "tasbih", false);
        else if (/do this|today|ṣalāh|salah/.test(t)) decorate(card.querySelector("h2,h3,.cdl-head") || card, "today", false);
        else if (/vault|note registry|am[aā]nah/.test(t)) decorate(card.querySelector("h2,h3,.cdl-head") || card, "vault", false);
      });
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  setTimeout(boot, 2500);
  // Re-run when shell switches
  document.addEventListener("clarity:companion-ready", boot);
})(typeof window !== "undefined" ? window : this);
