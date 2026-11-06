/*! companion-path-selected-only-v1 · V2 hard
 * Selected path allowlist ONLY — overrides additive union permanently.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  w.__COMPANION_PATH_SELECTED_ONLY_V2__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var ALLOW = {
    seeker: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "about-clarity-card": 1,
      "soul-compass-card": 1, "hell-sins-card": 1, "night-breath-card": 1, "seerah-live-card": 1,
      "creation-tongue-reflection": 1, "grave-path-card": 1
    },
    new_muslim: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "night-breath-card": 1,
      "hajj-guide-card": 1, "fiqh-quiz-card": 1, "grave-path-card": 1,
      "new-muslim-foundations-card": 1, "salah-starter-card": 1
    },
    practicing: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "weekly-review-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1,
      "tj-deep-studio": 1, "tj-lmr-score-card": 1, "callig-lab-card": 1, "meme-card": 1,
      "tibbe-nabwi-card": 1, "seerah-mirror-card": 1, "najiha-tafseer-card": 1,
      "tafseer-resources-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "creation-tongue-reflection": 1, "hajj-checklist-card": 1, "grave-path-card": 1,
      "daily-deed-ledger-card": 1
    },
    dai: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "tafseer-resources-card": 1, "creation-tongue-reflection": 1, "hajj-guide-card": 1,
      "hajj-checklist-card": 1, "fiqh-quiz-card": 1, "meme-card": 1, "callig-lab-card": 1,
      "tweet-desk-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1, "tj-deep-studio": 1,
      "weekly-review-card": 1, "grave-path-card": 1, "daily-deed-ledger-card": 1
    }
  };

  function gate() {
    try {
      var g = localStorage.getItem("clarity_path_override") || localStorage.getItem("clarity_committed_path") || "seeker";
      return ORDER.indexOf(g) >= 0 ? g : "seeker";
    } catch (e) { return "seeker"; }
  }

  function injectCss() {
    if (d.getElementById("path-selected-only-css")) return;
    var s = d.createElement("style");
    s.id = "path-selected-only-css";
    s.textContent =
      ".path-filtered-out{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;}";
    (d.head || d.documentElement).appendChild(s);
  }

  function apply(g) {
    g = ORDER.indexOf(g) >= 0 ? g : gate();
    injectCss();
    var allow = ALLOW[g] || ALLOW.seeker;
    d.documentElement.setAttribute("data-clarity-path", g);
    d.documentElement.setAttribute("data-path-filter", "selected-only");

    var nodes = d.querySelectorAll("[id$='-card'], [id*='-card'], #tj-deep-studio, #grave-path-card, #creation-tongue-reflection");
    nodes.forEach(function (el) {
      var id = el.id || "";
      if (!id) return;
      if (allow[id] === 1) {
        el.classList.remove("path-filtered-out");
        el.hidden = false;
        el.style.removeProperty("display");
        el.removeAttribute("aria-hidden");
      } else {
        el.classList.add("path-filtered-out");
        el.hidden = true;
        el.style.setProperty("display", "none", "important");
        el.setAttribute("aria-hidden", "true");
      }
    });
  }

  function install() {
    w.applyAdditiveFilter = function (g) { apply(g || gate()); };
    w.applyGateSectionFilter = function (g) { apply(g || gate()); };
    var prev = w.clarityRequestPath;
    if (typeof prev === "function") {
      w.clarityRequestPath = function (g) {
        var r = prev.apply(this, arguments);
        setTimeout(function () { apply(g || gate()); }, 30);
        setTimeout(function () { apply(g || gate()); }, 200);
        setTimeout(function () { apply(g || gate()); }, 600);
        return r;
      };
    }
  }

  function boot() {
    install();
    apply(gate());
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    install();
    apply(gate());
    setTimeout(function () { apply(gate()); }, 400);
    setTimeout(function () { apply(gate()); }, 1000);
  });
  setInterval(function () {
    install();
    apply(gate());
  }, 2000);

  w.ClarityPathSelectedOnly = { apply: apply, current: gate, allow: ALLOW };
})(window, document);
