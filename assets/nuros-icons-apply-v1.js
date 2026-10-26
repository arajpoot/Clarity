/**
 * Apply NurOS icons · tabs + dual tiles + section headings
 */
(function (g) {
  "use strict";
  if (g.__NUROS_ICONS_APPLY_V2__) return;
  g.__NUROS_ICONS_APPLY_V2__ = true;

  var TAB_MAP = [
    { match: /reminder/i, icon: "nuros-icon-reminder" },
    { match: /reality/i, icon: "nuros-icon-reality" },
    { match: /reflection/i, icon: "nuros-icon-reflection" },
    { match: /action/i, icon: "nuros-icon-action" },
    { match: /vault|amana|notes/i, icon: "nuros-icon-vault" }
  ];

  var SEC_MAP = [
    { match: /tweet desk|twitter/i, icon: "nuros-icon-tabligh" },
    { match: /calligraph/i, icon: "nuros-icon-callig" },
    { match: /meme/i, icon: "nuros-icon-tabligh" },
    { match: /tajweed|recit/i, icon: "nuros-icon-tajweed" },
    { match: /ṣalāh|salah|prayer/i, icon: "nuros-icon-salah" },
    { match: /wu[dḍ][uū]|wudu|ablution/i, icon: "nuros-icon-salah" },
    { match: /adhk|dhikr|tasb/i, icon: "nuros-icon-tasbih" },
    { match: /qur|f[aā]ti[hḥ]|verse|command/i, icon: "nuros-icon-quran" },
    { match: /path|journey|seeker|learn/i, icon: "nuros-icon-reminder" },
    { match: /university|campus/i, icon: "nuros-icon-campus" },
    { match: /companion/i, icon: "nuros-icon-quran" },
    { match: /vault|amana|legacy|will/i, icon: "nuros-icon-vault" },
    { match: /protect|light ahead|long stay|reward/i, icon: "nuros-icon-reflection" },
    { match: /do this today|next|tasbeeh/i, icon: "nuros-icon-tasbih" }
  ];

  function decorate(el, iconClass) {
    if (!el || el.querySelector(".nuros-icon")) return;
    var i = document.createElement("i");
    i.className = "nuros-icon nuros-sec-ico " + iconClass;
    i.setAttribute("aria-hidden", "true");
    el.insertBefore(i, el.firstChild);
  }

  function boot() {
    try {
      document.querySelectorAll("[data-tab], .clarity-tab-nav button, nav.tab-bar button, .mobile-tab-bar button, .door-rail-btn").forEach(function (btn) {
        var label = (btn.getAttribute("data-tab") || btn.textContent || "").trim();
        TAB_MAP.forEach(function (m) {
          if (m.match.test(label)) decorate(btn, m.icon);
        });
      });
      document.querySelectorAll(".dual-tile").forEach(function (tile) {
        var n = (tile.textContent || "").toLowerCase();
        if (n.indexOf("university") >= 0 || n.indexOf("campus") >= 0)
          decorate(tile.querySelector("strong") || tile, "nuros-icon-campus");
        else if (n.indexOf("companion") >= 0)
          decorate(tile.querySelector("strong") || tile, "nuros-icon-quran");
      });
      /* Section headings without leading emoji/icon */
      document.querySelectorAll("h2, h3, .cdl-head h2, .card > h2").forEach(function (h) {
        if (h.querySelector(".nuros-icon")) return;
        var t = (h.textContent || "").trim();
        if (!t || t.length > 80) return;
        /* skip if already starts with emoji / symbol */
        var ch0 = t.charCodeAt(0);
        if (ch0 > 255 || /^[𝕏✒️🎨🕌🌙💎🕋🛡️✨🕯️🌱]/.test(t)) return;
        for (var i = 0; i < SEC_MAP.length; i++) {
          if (SEC_MAP[i].match.test(t)) {
            decorate(h, SEC_MAP[i].icon);
            break;
          }
        }
      });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1600);
})(typeof window !== "undefined" ? window : this);
