/*! companion-path-selected-only-v1
 * Four-path module: show ONLY the selected path's allowlist (no additive leak).
 * Unlock order + quizzes unchanged. Companion room only.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_SELECTED_ONLY_V1__) return;
  w.__COMPANION_PATH_SELECTED_ONLY_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];

  /* Mirrors path-progress ALLOW — selected path only */
  var ALLOW = {
    seeker: {
      "commands-card": 1,
      "samina-verse-card": 1,
      "samina-card": 1,
      "about-clarity-card": 1,
      "soul-compass-card": 1,
      "hell-sins-card": 1,
      "night-breath-card": 1,
      "seerah-live-card": 1,
      "creation-tongue-reflection": 1,
      "grave-path-card": 1
    },
    new_muslim: {
      "commands-card": 1,
      "samina-verse-card": 1,
      "samina-card": 1,
      "ilm-pathway-card": 1,
      "about-clarity-card": 1,
      "soul-compass-card": 1,
      "seerah-live-card": 1,
      "night-breath-card": 1,
      "hajj-guide-card": 1,
      "fiqh-quiz-card": 1,
      "grave-path-card": 1,
      "new-muslim-foundations-card": 1,
      "salah-starter-card": 1
    },
    practicing: {
      "commands-card": 1,
      "samina-verse-card": 1,
      "samina-card": 1,
      "ilm-pathway-card": 1,
      "about-clarity-card": 1,
      "soul-compass-card": 1,
      "seerah-live-card": 1,
      "hell-sins-card": 1,
      "night-breath-card": 1,
      "weekly-review-card": 1,
      "tajweed-live-card": 1,
      "tajweed-path-card": 1,
      "tj-deep-studio": 1,
      "tj-lmr-score-card": 1,
      "callig-lab-card": 1,
      "meme-card": 1,
      "tibbe-nabwi-card": 1,
      "seerah-mirror-card": 1,
      "najiha-tafseer-card": 1,
      "tafseer-resources-card": 1,
      "deepen-study-card": 1,
      "asma-names-lecture-card": 1,
      "creation-tongue-reflection": 1,
      "hajj-checklist-card": 1,
      "grave-path-card": 1,
      "daily-deed-ledger-card": 1
    },
    dai: {
      "commands-card": 1,
      "samina-verse-card": 1,
      "samina-card": 1,
      "ilm-pathway-card": 1,
      "about-clarity-card": 1,
      "soul-compass-card": 1,
      "seerah-live-card": 1,
      "hell-sins-card": 1,
      "night-breath-card": 1,
      "deepen-study-card": 1,
      "asma-names-lecture-card": 1,
      "tafseer-resources-card": 1,
      "creation-tongue-reflection": 1,
      "hajj-guide-card": 1,
      "hajj-checklist-card": 1,
      "fiqh-quiz-card": 1,
      "meme-card": 1,
      "callig-lab-card": 1,
      "tweet-desk-card": 1,
      "tajweed-live-card": 1,
      "tajweed-path-card": 1,
      "tj-deep-studio": 1,
      "weekly-review-card": 1,
      "grave-path-card": 1,
      "daily-deed-ledger-card": 1
    }
  };

  /* Always-visible chrome (not path curriculum cards) */
  var ALWAYS = {
    "clarity-top-duo": 1,
    "clarity-visit-pill-bar": 1,
    "clarity-three-doors": 1
  };

  function currentGate() {
    try {
      var g =
        localStorage.getItem("clarity_path_override") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker";
      if (ORDER.indexOf(g) < 0) g = "seeker";
      return g;
    } catch (e) {
      return "seeker";
    }
  }

  function showEl(el) {
    if (!el) return;
    el.hidden = false;
    el.style.removeProperty("display");
    el.removeAttribute("aria-hidden");
    el.classList.remove("path-filtered-out");
  }
  function hideEl(el) {
    if (!el) return;
    el.hidden = true;
    el.style.display = "none";
    el.setAttribute("aria-hidden", "true");
    el.classList.add("path-filtered-out");
  }

  function applySelectedOnly(gate) {
    gate = ORDER.indexOf(gate) >= 0 ? gate : "seeker";
    var allow = ALLOW[gate] || ALLOW.seeker;
    d.documentElement.setAttribute("data-clarity-path", gate);
    d.documentElement.setAttribute("data-path-filter", "selected-only");

    var cards = d.querySelectorAll(
      ".card[id], section.card[id], [data-rrra] .card[id], #main-content .card[id]"
    );
    if (!cards.length) {
      cards = d.querySelectorAll("[id$='-card'], [id*='-card']");
    }

    cards.forEach(function (el) {
      var id = el.id || "";
      if (!id || ALWAYS[id]) return;
      if (allow[id] === 1) showEl(el);
      else hideEl(el);
    });

    /* known ids even if not .card */
    Object.keys(allow).forEach(function (id) {
      if (allow[id]) showEl(d.getElementById(id));
    });
  }

  function patch() {
    /* Override additive filter used by path-progress */
    w.applyAdditiveFilter = function (gate) {
      applySelectedOnly(gate || currentGate());
    };
    w.applyGateSectionFilter = function (gate) {
      applySelectedOnly(gate || currentGate());
    };
    /* After clarityRequestPath / applyContent */
    var prev = w.clarityRequestPath;
    if (typeof prev === "function" && !prev.__selectedOnly) {
      w.clarityRequestPath = function (gate) {
        var r = prev.apply(this, arguments);
        setTimeout(function () {
          applySelectedOnly(gate || currentGate());
        }, 50);
        setTimeout(function () {
          applySelectedOnly(gate || currentGate());
        }, 300);
        return r;
      };
      w.clarityRequestPath.__selectedOnly = true;
    }
  }

  function boot() {
    patch();
    applySelectedOnly(currentGate());
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 500);
    setTimeout(boot, 1200);
  });
  setInterval(function () {
    patch();
    applySelectedOnly(currentGate());
  }, 2500);

  w.ClarityPathSelectedOnly = {
    apply: applySelectedOnly,
    current: currentGate,
    allow: ALLOW
  };
})(window, document);
