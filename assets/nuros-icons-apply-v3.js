/**
 * NurOS v3 sitewide apply — companion section deep coverage
 */
(function (g) {
  "use strict";
  if (g.__NUROS_ICONS_V3_SITE__) return;
  g.__NUROS_ICONS_V3_SITE__ = true;
  g.__NUROS_ICONS_V3__ = true;
  g.__NUROS_ICONS_APPLY_V2__ = true;
  g.__NUROS_ICONS_V2__ = true;

  var RULES = [
    { re: /reminder/i, icon: "reminder" },
    { re: /reality/i, icon: "reality" },
    { re: /reflection/i, icon: "reflection" },
    { re: /action/i, icon: "action" },
    { re: /vault|am[aā]nah|notes? registry|heir/i, icon: "vault" },
    { re: /companion path|companion\b/i, icon: "companion" },
    { re: /university|campus/i, icon: "campus" },
    { re: /adhk|dhikr|tasb/i, icon: "tasbih" },
    { re: /do this today|today\b|mark done/i, icon: "today" },
    { re: /ṣalāh|salah|next ṣ|prayer|wu[dḍ]/i, icon: "salah" },
    { re: /qur|f[aā]ti[hḥ]|command|verse|sami/i, icon: "quran" },
    { re: /scroll|commands to the believers/i, icon: "scroll" },
    { re: /seerah|s[iī]rah|prophet.*life|timeline/i, icon: "seerah" },
    { re: /pedigree|family tree|nasab|genealogy/i, icon: "tree" },
    { re: /tajweed|recit|tarateel/i, icon: "tajweed" },
    { re: /listen|audio|sound|speaker/i, icon: "audio" },
    { re: /tweet|tabl[iī]gh|share|facebook desk/i, icon: "tabligh" },
    { re: /callig|pen|kit[aā]bah/i, icon: "callig" },
    { re: /meme|studio/i, icon: "meme" },
    { re: /print|legacy pack|print vault/i, icon: "print" },
    { re: /search|find/i, icon: "search" },
    { re: /protect|shield|ḥi[sṣ]n|core protection/i, icon: "shield" },
    { re: /seed|plant|grow|character/i, icon: "character" },
    { re: /kaaba|ḥaram|haramain|makkah/i, icon: "kaaba" },
    { re: /du[aā]|supplicat|hands/i, icon: "hands" },
    { re: /path|journey|seeker|gate mode/i, icon: "path" },
    { re: /legacy|wasiyy|will|heir readiness/i, icon: "legacy" },
    { re: /reward|long stay|grave|light ahead/i, icon: "star" },
    { re: /water|wu[dḍ][uū]|ablution/i, icon: "water" },
    { re: /seedling|ongoing charity|ṣadaqah/i, icon: "seed" }
  ];

  function make(name, sm) {
    var el = document.createElement("span");
    el.className = "nuros-icon nuros-icon-" + name + (sm ? " sm" : "");
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  function stripEmoji(el) {
    if (!el) return;
    var child = el.firstChild, g2 = 0;
    while (child && g2++ < 10) {
      if (child.nodeType === 1) {
        var cls = (child.className || "").toString();
        if (cls.indexOf("nuros-") >= 0) break;
        var t = (child.textContent || "").trim();
        if ((child.tagName === "SPAN" || child.tagName === "I" || child.tagName === "EM") &&
            (t.length <= 3 || /[\u{1F300}-\u{1FAFF}]/u.test(t))) {
          var n = child.nextSibling;
          try { child.parentNode.removeChild(child); } catch (e) {}
          child = n;
          continue;
        }
        break;
      }
      if (child.nodeType === 3) {
        child.textContent = (child.textContent || "").replace(
          /^[\s\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D⌂🏠🎓📚🕌🌙✦◉☾➤🔒🌱🛡️📜📖🌳✦]+/u, "");
        break;
      }
      break;
    }
  }

  function pick(text) {
    text = String(text || "");
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].re.test(text)) return RULES[i].icon;
    }
    return null;
  }

  function decorate(el, name, force) {
    if (!el || !name) return;
    if (!force && el.getAttribute("data-nuros-iconized") === "1") return;
    el.querySelectorAll(":scope > .nuros-icon").forEach(function (n) {
      try { n.parentNode.removeChild(n); } catch (e) {}
    });
    stripEmoji(el);
    // strip leading symbol chars from first text
    if (el.childNodes[0] && el.childNodes[0].nodeType === 3) {
      el.childNodes[0].textContent = (el.childNodes[0].textContent || "").replace(
        /^[\s✦◉☾➤📖📜🌳✨]+/, "");
    }
    var sm = el.closest && el.closest("#clarity-door-rail, .door-rail-btn, nav.tab-bar");
    el.insertBefore(make(name, !!sm), el.firstChild);
    el.setAttribute("data-nuros-iconized", "1");
  }

  function boot() {
    try {
      // Door rail
      document.querySelectorAll("#clarity-door-rail button, .door-rail-btn").forEach(function (btn) {
        var label = (btn.getAttribute("data-tab") || btn.getAttribute("aria-label") || btn.textContent || "").trim();
        var ic = pick(label);
        if (ic) decorate(btn, ic, true);
      });

      // Dual paths
      document.querySelectorAll(".dual-tile, [id*='dual-path']").forEach(function (tile) {
        var ic = pick(tile.textContent || "");
        if (ic) decorate(tile, ic, true);
      });

      // RRRA / tab hubs
      document.querySelectorAll(".rrra-hub > h2, .tab-panel > h2, #main-content h2.section-title").forEach(function (h) {
        var ic = pick(h.textContent || "");
        if (ic) decorate(h, ic, false);
      });

      // Cards and section heads in companion + landing
      document.querySelectorAll(
        ".card > h2, .card > h3, .cdl-card h2, .cdl-card h3, .section-head, " +
        "#cdl-today h2, #cdl-adhkar h2, .ilm-pathway-card h2, .ilm-pathway-card summary, " +
        ".trust-plaque h2, .trust-plaque h3"
      ).forEach(function (h) {
        if ((h.textContent || "").length > 90) return;
        var ic = pick(h.textContent || "");
        if (ic) decorate(h, ic, false);
      });

      // Section pills / chips
      document.querySelectorAll(".section-pill, .clarity-section-pill, [data-section-pill]").forEach(function (p) {
        var ic = pick(p.textContent || p.getAttribute("data-section") || "");
        if (ic) decorate(p, ic, false);
      });

      // Top tools
      document.querySelectorAll("button, a.chip, .tool-chip").forEach(function (el) {
        var t = (el.textContent || "").trim();
        if (t.length < 3 || t.length > 40) return;
        if (/legacy pack|print vault|gate mode/i.test(t)) {
          var ic = pick(t);
          if (ic && !el.querySelector(".nuros-icon")) decorate(el, ic, false);
        }
      });
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [300, 900, 1800, 3200].forEach(function (ms) { setTimeout(boot, ms); });
  document.addEventListener("clarity:companion-ready", boot);
  // Re-apply on tab switches
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("#clarity-door-rail button, .door-rail-btn");
    if (t) setTimeout(boot, 200);
  }, true);
})(typeof window !== "undefined" ? window : this);
