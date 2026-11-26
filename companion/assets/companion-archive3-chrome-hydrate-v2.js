/*! companion-archive3-chrome-hydrate-v2.js
 * Aggressive soak · stamps + attributes · re-run on tab mount · educational only
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_A3_HYDRATE_SOAK_V2__) return;
  w.__COMPANION_A3_HYDRATE_SOAK_V2__ = true;

  var ICONS = {
    meme: "🎨", names: "✨", hadith: "📜", quiz: "❓", tajweed: "📖",
    deep: "📡", reflection: "🪞", reality: "🌅", action: "🎯",
    notes: "📝", about: "ℹ️", mercy: "💚", grave: "🕯", tawbah: "🤍",
    default: "◆"
  };

  function pickIcon(el) {
    var blob = (
      (el.id || "") + " " +
      (el.className || "") + " " +
      (el.getAttribute("data-rrra") || "") + " " +
      (el.getAttribute("data-p4-tab") || "")
    ).toLowerCase();
    try {
      var h = el.querySelector("h2, h3");
      if (h) blob += " " + (h.textContent || "").toLowerCase();
    } catch (e) {}
    if (/meme/.test(blob)) return ICONS.meme;
    if (/name|asma|ism/.test(blob)) return ICONS.names;
    if (/hadith|ḥadīth|sunnah/.test(blob)) return ICONS.hadith;
    if (/quiz|fiqh|siq|sharia/.test(blob)) return ICONS.quiz;
    if (/tajweed|qur/.test(blob)) return ICONS.tajweed;
    if (/deep|lecture|video|youtube/.test(blob)) return ICONS.deep;
    if (/tawbah/.test(blob)) return ICONS.tawbah;
    if (/grave|furnish/.test(blob)) return ICONS.grave;
    if (/mercy/.test(blob)) return ICONS.mercy;
    if (/reflect/.test(blob)) return ICONS.reflection;
    if (/realit/.test(blob)) return ICONS.reality;
    if (/action/.test(blob)) return ICONS.action;
    if (/note/.test(blob)) return ICONS.notes;
    if (/about/.test(blob)) return ICONS.about;
    return ICONS.default;
  }

  function stamp(el) {
    if (!el || el.getAttribute("data-a3-stamped") === "1") return;
    var head = el.querySelector(".cs-plaque-head h2, .cs-plaque-head, h2");
    if (!head) return;
    if (head.querySelector && head.querySelector(".a3-ico")) {
      el.setAttribute("data-a3-stamped", "1");
      return;
    }
    var target = head;
    if (head.classList && head.classList.contains("cs-plaque-head")) {
      /* insert before text */
    }
    var ico = d.createElement("span");
    ico.className = "a3-ico";
    ico.setAttribute("aria-hidden", "true");
    ico.textContent = pickIcon(el);
    if (head.tagName && /^H[123]$/i.test(head.tagName)) {
      head.insertBefore(ico, head.firstChild);
    } else {
      var h2 = head.querySelector("h2");
      if (h2) h2.insertBefore(ico, h2.firstChild);
      else head.insertBefore(ico, head.firstChild);
    }
    el.setAttribute("data-a3-stamped", "1");
    el.classList.add("a3-soaked");
  }

  function soak() {
    try {
      d.documentElement.setAttribute("data-a3-chrome", "1");
      d.documentElement.setAttribute("data-a3-hydrated", "1");
      d.documentElement.setAttribute("data-a3-soak", "v2");
      if (d.body) {
        d.body.setAttribute("data-a3-chrome", "1");
        d.body.classList.add("a3-chrome-soak");
      }
    } catch (e) {}
    var root = d.getElementById("cs-mount") || d.querySelector(".meme-room") || d.body;
    if (!root) return;
    root.querySelectorAll(
      ".cs-plaque, .cs-plaque-deep, .card.card-tools, .card, .p4-glory-rail, .desk-card, .panel, .siq-suite"
    ).forEach(stamp);
  }

  function boot() {
    soak();
    setTimeout(soak, 120);
    setTimeout(soak, 600);
    setTimeout(soak, 1500);
    var root = d.getElementById("cs-mount") || d.body;
    if (root && w.MutationObserver) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(soak, 60);
      }).observe(root, { childList: true, subtree: true });
    }
    // tab switches
    d.addEventListener("click", function (ev) {
      var b = ev.target && ev.target.closest && ev.target.closest("[data-tab], [data-rrra], button, a");
      if (b) setTimeout(soak, 100);
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    soak();
    setTimeout(soak, 400);
  });
})(window, document);
