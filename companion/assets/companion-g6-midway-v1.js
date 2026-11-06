/*! companion-g6-midway-v1 · wrap heavy studios in <details> — content preserved */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G6_MIDWAY_V1__) return;
  w.__CLARITY_G6_MIDWAY_V1__ = true;
  var LOG = (w.__G6_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var FOLDS = [
    {
      id: "meme-card",
      title: "🎨 Clarity Meme Studio",
      hint: "In Companion · expand when you need it",
      craft: "/craft/meme/",
      craftLabel: "Also in Craft atelier →"
    },
    {
      id: "callig-lab-card",
      title: "✍️ Calligraphy lab",
      hint: "Pad & modes stay here · expand to practice",
      craft: "/craft/calligraphy/",
      craftLabel: "Also in Craft atelier →"
    },
    {
      id: "tajweed-live-card",
      title: "📖 Tajweed studio",
      hint: "Listen · match · record · expand to open",
      craft: "/craft/tajweed/",
      craftLabel: "Also in Craft atelier →"
    },
    {
      id: "nx-tajweed-deep-studio-v1",
      title: "📖 Tajweed deep studio",
      hint: "Full rules board · expand to open",
      craft: "/craft/tajweed/",
      craftLabel: "Also in Craft atelier →"
    }
  ];

  function wrapFold(cfg) {
    var el = d.getElementById(cfg.id);
    if (!el || el.closest("details.craft-fold")) return;
    var parent = el.parentNode;
    if (!parent) return;
    var details = d.createElement("details");
    details.className = "craft-fold";
    details.setAttribute("data-fold-id", cfg.id);
    var summary = d.createElement("summary");
    summary.innerHTML =
      "<span>" + cfg.title + "</span>" +
      '<span class="cf-hint">' + cfg.hint + "</span>" +
      '<span class="cf-open"></span>';
    var body = d.createElement("div");
    body.className = "craft-fold-body";
    if (cfg.craft) {
      var a = d.createElement("a");
      a.className = "cf-also-craft";
      a.href = cfg.craft;
      a.textContent = cfg.craftLabel || "Open in Craft →";
      body.appendChild(a);
    }
    parent.insertBefore(details, el);
    details.appendChild(summary);
    details.appendChild(body);
    body.appendChild(el);
    log("fold:" + cfg.id);
  }

  function markReset() {
    var g = d.querySelector(".clarity-gate-switcher");
    if (!g) return;
    g.querySelectorAll("button, a").forEach(function (btn) {
      var t = (btn.textContent || "").toLowerCase();
      if (/reset/.test(t) || btn.id === "clarity-path-reset-btn") btn.classList.add("cgs-reset");
    });
  }

  function boot() {
    FOLDS.forEach(wrapFold);
    markReset();
    setTimeout(function () {
      FOLDS.forEach(wrapFold);
      markReset();
    }, 600);
    log("g6-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
