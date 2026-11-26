/*! companion-archive3-chrome-hydrate-v1.js
 * Soft hydration · plaque depth markers · icon stamps · no content deletion
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_A3_CHROME_HYDRATE_V1__) return;
  w.__COMPANION_A3_CHROME_HYDRATE_V1__ = true;

  var ICONS = {
    reminder: "🕊️",
    reality: "🌅",
    reflection: "🪞",
    action: "🎯",
    notes: "📝",
    about: "ℹ️",
    meme: "🎨",
    names: "✨",
    hadith: "📜",
    quiz: "❓",
    tajweed: "📖",
    deep: "📡",
    default: "◆"
  };

  function pickIcon(el) {
    var id = ((el.id || "") + " " + (el.className || "") + " " + (el.getAttribute("data-rrra") || "")).toLowerCase();
    var t = "";
    try {
      var h = el.querySelector("h2,h3");
      t = (h && h.textContent) || "";
    } catch (e) {}
    var blob = id + " " + t.toLowerCase();
    if (/meme/.test(blob)) return ICONS.meme;
    if (/name|asma|ism/.test(blob)) return ICONS.names;
    if (/hadith|ḥadīth|sunnah/.test(blob)) return ICONS.hadith;
    if (/quiz|fiqh|siq|sharia/.test(blob)) return ICONS.quiz;
    if (/tajweed|quran|qur/.test(blob)) return ICONS.tajweed;
    if (/deep|lecture|video/.test(blob)) return ICONS.deep;
    if (/reflect/.test(blob)) return ICONS.reflection;
    if (/realit/.test(blob)) return ICONS.reality;
    if (/action/.test(blob)) return ICONS.action;
    if (/note/.test(blob)) return ICONS.notes;
    if (/about/.test(blob)) return ICONS.about;
    return ICONS.default;
  }

  function stamp(el) {
    if (!el || el.getAttribute("data-a3-stamped") === "1") return;
    var head = el.querySelector(".cs-plaque-head, h2");
    if (!head) return;
    if (head.querySelector(".a3-ico")) {
      el.setAttribute("data-a3-stamped", "1");
      return;
    }
    var ico = d.createElement("span");
    ico.className = "a3-ico";
    ico.setAttribute("aria-hidden", "true");
    ico.textContent = pickIcon(el);
    if (head.classList && head.classList.contains("cs-plaque-head")) {
      head.insertBefore(ico, head.firstChild);
    } else {
      head.insertBefore(ico, head.firstChild);
    }
    el.setAttribute("data-a3-stamped", "1");
  }

  function hydrate() {
    try {
      d.documentElement.setAttribute("data-a3-chrome", "1");
      d.documentElement.setAttribute("data-a3-hydrated", "1");
      if (d.body) d.body.setAttribute("data-a3-chrome", "1");
    } catch (e) {}
    var root = d.getElementById("cs-mount") || d.querySelector(".meme-room") || d.body;
    if (!root) return;
    root.querySelectorAll(".cs-plaque, .cs-plaque-deep, .card.card-tools, .p4-glory-rail, .desk-card, .panel").forEach(stamp);
  }

  function boot() {
    hydrate();
    var root = d.getElementById("cs-mount") || d.body;
    if (root && w.MutationObserver) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(hydrate, 80);
      }).observe(root, { childList: true, subtree: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", hydrate);
})(window, document);
