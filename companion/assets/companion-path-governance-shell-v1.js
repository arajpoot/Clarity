/*! companion-path-governance-shell-v1
 * ALLOW map from pre-shell path governance · applies inside #cs-mount
 * seeker < new_muslim < practicing < dai (dai = maximum card set)
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_GOV_SHELL_V1__) return;
  w.__COMPANION_PATH_GOV_SHELL_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var ALLOW = {
    seeker: { "mercy-path-card": 1, "furnish-grave-card": 1, "ledger-return-card": 1, "samina-ataana-card": 1, "calling-adab-card": 1, "steady-deeds-card": 1, "building-pillars-card": 1, "tawbah-nasuhah-card": 1,
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "about-clarity-card": 1,
      "soul-compass-card": 1, "hell-sins-card": 1, "night-breath-card": 1, "seerah-live-card": 1,
      "creation-tongue-reflection": 1, "grave-path-card": 1
    },
    new_muslim: { "mercy-path-card": 1, "furnish-grave-card": 1, "ledger-return-card": 1, "samina-ataana-card": 1, "calling-adab-card": 1, "steady-deeds-card": 1, "building-pillars-card": 1, "tawbah-nasuhah-card": 1,
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "night-breath-card": 1,
      "hajj-guide-card": 1, "fiqh-quiz-card": 1, "grave-path-card": 1,
      "new-muslim-foundations-card": 1, "salah-starter-card": 1
    },
    practicing: { "mercy-path-card": 1, "furnish-grave-card": 1, "ledger-return-card": 1, "samina-ataana-card": 1, "calling-adab-card": 1, "steady-deeds-card": 1, "building-pillars-card": 1, "tawbah-nasuhah-card": 1,
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "weekly-review-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1,
      "tj-deep-studio": 1, "tj-lmr-score-card": 1, "callig-lab-card": 1, "meme-card": 1,
      "tibbe-nabwi-card": 1, "seerah-mirror-card": 1, "najiha-tafseer-card": 1,
      "tafseer-resources-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "creation-tongue-reflection": 1, "hajj-checklist-card": 1, "grave-path-card": 1,
      "daily-deed-ledger-card": 1
    },
    dai: { "mercy-path-card": 1, "furnish-grave-card": 1, "ledger-return-card": 1, "samina-ataana-card": 1, "calling-adab-card": 1, "steady-deeds-card": 1, "building-pillars-card": 1, "tawbah-nasuhah-card": 1,
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "tafseer-resources-card": 1, "creation-tongue-reflection": 1, "hajj-guide-card": 1,
      "hajj-checklist-card": 1, "fiqh-quiz-card": 1, "meme-card": 1, "callig-lab-card": 1,
      "tweet-desk-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1, "tj-deep-studio": 1,
      "tj-lmr-score-card": 1, "weekly-review-card": 1, "tibbe-nabwi-card": 1, "seerah-mirror-card": 1,
      "najiha-tafseer-card": 1, "israeliyat-card": 1, "sealed-nectar-card": 1,
      "tajalliyat-lecture-card": 1, "tafseer-live-card": 1, "authentic-learning-stack": 1,
      "voice-translator-card": 1, "grave-path-card": 1, "daily-deed-ledger-card": 1,
      "dai-transmit-card": 1, "new-muslim-foundations-card": 1, "salah-starter-card": 1
    }
  };

  /* Union of all allow ids — cards not in selected path hide when governed */
  var ALL_IDS = {};
  ORDER.forEach(function (p) {
    Object.keys(ALLOW[p]).forEach(function (id) {
      ALL_IDS[id] = 1;
    });
  });

  function normPath(p) {
    p = String(p || "").toLowerCase();
    if (p.indexOf("new") >= 0) return "new_muslim";
    if (p.indexOf("dai") >= 0 || p.indexOf("da'i") >= 0) return "dai";
    if (p.indexOf("practic") >= 0 || p.indexOf("daily") >= 0) return "practicing";
    if (p.indexOf("seeker") >= 0) return "seeker";
    return ORDER.indexOf(p) >= 0 ? p : "seeker";
  }

  function gate() {
    try {
      if (w.ClarityCompanionShell && w.ClarityCompanionShell.getPath) {
        return normPath(w.ClarityCompanionShell.getPath());
      }
    } catch (e) {}
    try {
      return normPath(
        localStorage.getItem("clarity_gate_v1") ||
          localStorage.getItem("clarity_path_override") ||
          localStorage.getItem("clarity_committed_path") ||
          "seeker"
      );
    } catch (e2) {
      return "seeker";
    }
  }

  function setVisible(el, on) {
    if (!el) return;
    if (on) {
      el.style.removeProperty("display");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden");
    } else {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("hidden", "");
      el.classList.add("cpp-path-hidden");
    }
  }

  function apply(g) {
    g = normPath(g || gate());
    var allow = ALLOW[g] || ALLOW.seeker;
    var root = d.getElementById("cs-mount") || d;
    Object.keys(ALL_IDS).forEach(function (id) {
      var el = root.querySelector("#" + id) || d.getElementById(id);
      if (!el) return;
      /* only govern nodes inside mount when shell active */
      if (root.id === "cs-mount" && !root.contains(el) && el.id !== id) return;
      setVisible(el, !!allow[id]);
    });
    /* path-only plaques from stream */
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var only = (el.getAttribute("data-cs-path-only") || "").split(/\s+/);
      setVisible(el, only.indexOf(g) >= 0 || only.indexOf("all") >= 0);
    });
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-cs-path") === g);
    });
  }

  function boot() {
    apply(gate());
  }

  /* Re-apply after shell mounts tab HTML */
  var mount = d.getElementById("cs-mount");
  if (mount) {
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        apply(gate());
      }, 40);
    }).observe(mount, { childList: true });
  }

  d.addEventListener(
    "click",
    function (ev) {
      var btn = ev.target && ev.target.closest && ev.target.closest("[data-cs-path]");
      if (!btn) return;
      setTimeout(function () {
        apply(btn.getAttribute("data-cs-path"));
      }, 30);
    },
    true
  );

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);

  w.ClarityPathGovernanceShell = { apply: apply, gate: gate, allow: ALLOW, order: ORDER };
  w.ALLOW = w.ALLOW || ALLOW;
})(window, document);
