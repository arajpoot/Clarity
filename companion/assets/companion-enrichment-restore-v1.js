/*! companion-enrichment-restore-v1
 * Restores full body visibility: path may emphasize, must not strip enrichment.
 * Root cause: path-governance ALLOW used display:none on non-listed cards (Seeker saw a thin slice).
 * Educational only — not a fatwa. Governance §7 body richness.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ENRICHMENT_RESTORE_V1__) return;
  w.__COMPANION_ENRICHMENT_RESTORE_V1__ = true;

  var LOG = (w.__COMPANION_ENRICHMENT_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* Soft emphasis sets per path — never exclusive allowlists for hide */
  var EMPHASIS = {
    seeker: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "samina-ataana-card": 1,
      "beautiful-names-card": 1, "guard-tongue-card": 1, "building-pillars-card": 1,
      "steady-deeds-card": 1, "tawbah-nasuhah-card": 1, "soul-compass-card": 1,
      "furnish-grave-card": 1, "grave-path-card": 1, "mercy-path-card": 1,
      "night-breath-card": 1, "seerah-live-card": 1, "about-clarity-card": 1
    },
    new_muslim: {
      "commands-card": 1, "building-pillars-card": 1, "guard-tongue-card": 1,
      "ilm-pathway-card": 1, "tawbah-nasuhah-card": 1, "soul-compass-card": 1,
      "hajj-guide-card": 1, "fiqh-quiz-card": 1, "samina-verse-card": 1
    },
    practicing: {},
    dai: {
      "calling-adab-card": 1, "commands-card": 1, "seerah-mirror-card": 1
    }
  };
  EMPHASIS.daily = EMPHASIS.practicing;

  function showAllInMount() {
    var root = d.getElementById("cs-mount");
    if (!root) return 0;
    var n = 0;
    root.querySelectorAll(".cpp-path-hidden, [hidden], [data-arch-level], .card, [data-rrra], [id$='-card']").forEach(function (el) {
      if (el.style && el.style.display === "none") {
        el.style.removeProperty("display");
        n++;
      }
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden");
    });
    /* also clear inline none on any mount descendant that looks like a section */
    root.querySelectorAll("[style*='display: none'], [style*='display:none']").forEach(function (el) {
      /* don't unhide intentional UI chrome like collapsed details content if needed — still enrichment-first */
      if (el.closest("summary")) return;
      el.style.removeProperty("display");
      el.classList.remove("cpp-path-hidden");
      el.removeAttribute("hidden");
      n++;
    });
    return n;
  }

  function pathKey() {
    try {
      if (w.ClarityPathGovernanceShell && typeof w.ClarityPathGovernanceShell.gate === "function") {
        return w.ClarityPathGovernanceShell.gate() || "seeker";
      }
    } catch (e) {}
    try {
      return (
        localStorage.getItem("clarity_companion_path") ||
        localStorage.getItem("cs_path") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker"
      );
    } catch (e2) {
      return "seeker";
    }
  }

  function softEmphasis() {
    var root = d.getElementById("cs-mount");
    if (!root) return;
    var g = pathKey();
    if (g === "practicing" || g === "daily") g = "practicing";
    var map = EMPHASIS[g] || EMPHASIS.seeker;
    root.querySelectorAll(".card, [data-rrra], [id$='-card']").forEach(function (el) {
      el.classList.remove("path-emphasis", "path-secondary");
      var id = el.id || "";
      if (!Object.keys(map).length) {
        el.classList.add("path-emphasis");
        return;
      }
      if (map[id]) el.classList.add("path-emphasis");
      else el.classList.add("path-secondary");
    });
  }

  function patchGovernance() {
    var G = w.ClarityPathGovernanceShell;
    if (!G || typeof G.apply !== "function") return false;
    if (G.__enrichmentPatched) return true;
    var prev = G.apply.bind(G);
    G.apply = function (g) {
      /* run original then immediately restore visibility */
      try {
        prev(g);
      } catch (e) {}
      var restored = showAllInMount();
      softEmphasis();
      log("path-apply-restore:" + restored);
    };
    G.__enrichmentPatched = true;
    log("gov-patched");
    return true;
  }

  function run() {
    patchGovernance();
    var restored = showAllInMount();
    softEmphasis();
    log("restore:" + restored);
    w.__COMPANION_ENRICHMENT_STATUS__ = {
      version: "ER1-20261116",
      restored: restored,
      mode: "show-all + soft path emphasis",
      governance: "§7 body richness"
    };
  }

  function boot() {
    run();
    var n = 0;
    var iv = setInterval(function () {
      n++;
      patchGovernance();
      run();
      if (n > 25) clearInterval(iv);
    }, 200);
    var mount = d.getElementById("cs-mount");
    if (mount) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 50);
      }).observe(mount, { childList: true, subtree: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
