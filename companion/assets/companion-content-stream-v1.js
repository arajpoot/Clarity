/*! companion-content-stream-v1 · intelligent tab×path streamliner
 * Research-informed progressive disclosure (fard ʿayn → practice → character → daʿwah adab)
 * Peer patterns: SeekersGuidance steps, adult step-by-step roadmaps, structured dawah modules
 * Educational only — not a fatwa. Companion isolation only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CONTENT_STREAM_V1__) return;
  w.__COMPANION_CONTENT_STREAM_V1__ = true;

  /**
   * Tab intent (RRRA) — what the user comes for
   * Path phase — depth / audience (seeker → new_muslim → practicing → dai)
   */
  var TAB_INTENT = {
    reminder: "revelation",   /* Qurʾān, commands, Names — what was taught */
    reality: "narrative",     /* Seerah, nations, lectures — what happened */
    reflection: "heart",      /* Character, dhikr, soul audit */
    action: "practice",       /* Deeds, tajweed, craft tools */
    notes: "capture",
    about: "charter"
  };

  /** Primary card id tokens per tab (shown first; others collapse under More) */
  var TAB_PRIMARY = {
    reminder: [
      "commands-card",
      "samina-verse-card",
      "hadith",
      "prophet-name-box",
      "ilm-pathway-card"
    ],
    reality: [
      "seerah-live-card",
      "samina-card",
      "deepen-study-card",
      "weekly-review-card",
      "seerah-content"
    ],
    reflection: [
      "soul-compass-card",
      "night-breath-card",
      "creation-tongue-reflection",
      "asma-box",
      "istighfar-count",
      "salawat-count",
      "zikr"
    ],
    action: [
      "tj-deep-studio",
      "tajweed-live-card",
      "meme-studio",
      "clarity-daily-deep"
    ],
    notes: [],
    about: ["about-clarity-card", "companion-about-feedback"]
  };

  /** Path emphasis — which tabs get a “focus” badge and denser primary set */
  var PATH_TAB_WEIGHT = {
    seeker: { reminder: 2, reflection: 2, reality: 1, action: 1 },
    new_muslim: { action: 2, reminder: 2, reality: 1, reflection: 1 },
    practicing: { reflection: 2, action: 2, reminder: 1, reality: 1 },
    dai: { reality: 2, action: 2, reminder: 1, reflection: 1 }
  };

  var PATH_LABEL = {
    seeker: "Seeker · wake the heart",
    new_muslim: "New Muslim · establish pillars",
    practicing: "Daily · consistency",
    dai: "Daʿi · transmission with adab"
  };

  var FOCUS_COPY = {
    reminder: {
      seeker: "One command-verse. Read · pause · one small act today.",
      new_muslim: "Short reminder with clear meaning — stability before volume.",
      practicing: "Refresh a known command; teach it to your own limbs.",
      dai: "Choose a verse you can share with source and adab — not argument."
    },
    reality: {
      seeker: "One Seerah spark: how the Prophet ﷺ faced a hard day.",
      new_muslim: "A gentle timeline moment — belonging to a real story.",
      practicing: "Weekly review of what you lived, not only what you read.",
      dai: "Study a transmitted report with isnād care — name the source."
    },
    reflection: {
      seeker: "Soul audit: one hope, one fear, return to Allah.",
      new_muslim: "A Name of Allah and one feeling it steadies.",
      practicing: "Dhikr streak honesty — quality over count.",
      dai: "Check intention before speech: guidance, not winning."
    },
    action: {
      seeker: "One deed you can finish before sleep.",
      new_muslim: "Wuḍūʾ / ṣalāh practice card — slow and correct.",
      practicing: "Tajweed or craft: one rule, one line.",
      dai: "Prepare one clear shareable note with a primary source link."
    },
    notes: {
      seeker: "Write one line you want waiting in the grave.",
      new_muslim: "Note a question for a local teacher — not the internet alone.",
      practicing: "Log a debt of thanks or a trust to settle.",
      dai: "Draft a transmission note: source · audience · adab limit."
    },
    about: {
      seeker: "This room is educational only — not a fatwa desk.",
      new_muslim: "Charter: private by default; Amānah holds vault tools.",
      practicing: "Feedback improves the craft — kind and specific.",
      dai: "Limits: verify before you transmit."
    }
  };

  function pathKey() {
    try {
      var g =
        localStorage.getItem("clarity_gate_v1") ||
        localStorage.getItem("clarity_path_gate_v1") ||
        localStorage.getItem("clarity_companion_gate_v1") ||
        "";
      g = String(g).toLowerCase();
      if (g.indexOf("new") >= 0) return "new_muslim";
      if (g.indexOf("dai") >= 0 || g.indexOf("da'i") >= 0 || g.indexOf("transmit") >= 0) return "dai";
      if (g.indexOf("practic") >= 0 || g.indexOf("daily") >= 0) return "practicing";
      if (g.indexOf("seeker") >= 0) return "seeker";
    } catch (e) {}
    /* body / tiles */
    var tile = d.querySelector(".cpt-tile.is-active, .cpt-tile[aria-current='true']");
    if (tile) {
      var g2 = (tile.getAttribute("data-gate") || "").toLowerCase();
      if (g2 === "new_muslim") return "new_muslim";
      if (g2 === "practicing") return "practicing";
      if (g2 === "dai") return "dai";
      if (g2 === "seeker") return "seeker";
    }
    return "seeker";
  }

  function activeTab() {
    var t = (d.body && d.body.getAttribute("data-active-tab")) || "";
    t = String(t).toLowerCase();
    if (TAB_INTENT[t]) return t;
    return "reminder";
  }

  function ensureFocusStrip() {
    var id = "cc-stream-focus";
    var el = d.getElementById(id);
    if (el) return el;
    el = d.createElement("section");
    el.id = id;
    el.className = "cc-stream-focus";
    el.setAttribute("aria-label", "Today focus");
    el.innerHTML =
      '<div class="cc-stream-plaque">' +
      '<p class="cc-stream-kicker">Streamlined focus</p>' +
      '<p class="cc-stream-path" id="cc-stream-path"></p>' +
      '<p class="cc-stream-msg" id="cc-stream-msg"></p>' +
      '<p class="cc-stream-disc">Educational only — not a fatwa. Prefer a local teacher for rulings.</p>' +
      "</div>";
    var banner = d.getElementById("companion-banner-shell");
    var pathTiles = d.getElementById("clarity-path-tiles");
    var anchor = pathTiles || banner;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(el, anchor.nextSibling);
    } else {
      d.body.insertBefore(el, d.body.firstChild);
    }
    return el;
  }

  function cardMatchesPrimary(card, primaryIds) {
    var id = card.id || "";
    if (id && primaryIds.indexOf(id) >= 0) return true;
    for (var i = 0; i < primaryIds.length; i++) {
      if (id.indexOf(primaryIds[i]) >= 0) return true;
      if (card.querySelector && card.querySelector("#" + primaryIds[i])) return true;
    }
    return false;
  }

  function streamlinePanel(tab) {
    var panel = d.getElementById("tab-" + tab);
    if (!panel) return;
    var primary = TAB_PRIMARY[tab] || [];
    var cards = panel.querySelectorAll(
      ":scope > .card, :scope .rrra-hub-body > .card, :scope .card[id], :scope [data-rrra] > .card"
    );
    if (!cards.length) {
      cards = panel.querySelectorAll(".card");
    }
    var extras = [];
    cards.forEach(function (card) {
      if (card.id === "cc-stream-focus" || card.closest("#cc-stream-focus")) return;
      if (card.classList.contains("cc-stream-more")) return;
      var isPrimary = !primary.length || cardMatchesPrimary(card, primary);
      if (isPrimary) {
        card.classList.add("cc-stream-primary");
        card.classList.remove("cc-stream-secondary");
        card.style.removeProperty("display");
      } else {
        card.classList.add("cc-stream-secondary");
        card.classList.remove("cc-stream-primary");
        extras.push(card);
      }
    });
    /* Collapse secondaries into details */
    var more = panel.querySelector(":scope > .cc-stream-more");
    if (!more) {
      more = d.createElement("details");
      more.className = "cc-stream-more card";
      more.innerHTML = "<summary>More in this tab · optional depth</summary><div class=\"cc-stream-more-body\"></div>";
      panel.appendChild(more);
    }
    var body = more.querySelector(".cc-stream-more-body");
    extras.forEach(function (card) {
      if (card.parentNode !== body) body.appendChild(card);
    });
    if (!extras.length) more.hidden = true;
    else more.hidden = false;
  }

  function paintFocus() {
    ensureFocusStrip();
    var path = pathKey();
    var tab = activeTab();
    var pathEl = d.getElementById("cc-stream-path");
    var msgEl = d.getElementById("cc-stream-msg");
    if (pathEl) pathEl.textContent = (PATH_LABEL[path] || path) + " · " + tab;
    var bag = FOCUS_COPY[tab] || {};
    if (msgEl) msgEl.textContent = bag[path] || bag.seeker || "One sincere step is enough today.";
    /* Dim path tiles not in weight emphasis */
    var weights = PATH_TAB_WEIGHT[path] || {};
    d.querySelectorAll("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
      var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
      var wgt = weights[t] || 0;
      btn.classList.toggle("cc-stream-emph", wgt >= 2);
      btn.classList.toggle("cc-stream-soft", wgt === 1);
    });
  }

  function run() {
    if ((location.pathname || "").indexOf("/companion") !== 0) return;
    d.documentElement.setAttribute("data-clarity-room", d.documentElement.getAttribute("data-clarity-room") || "companion");
    paintFocus();
    ["reminder", "reality", "reflection", "action", "notes", "about"].forEach(streamlinePanel);
  }

  function boot() {
    run();
    setTimeout(run, 400);
    setTimeout(run, 1200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.addEventListener("hashchange", function () {
    setTimeout(run, 50);
  });
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest("#clarity-door-rail, .cpt-tile, #clarity-path-tiles")) {
        setTimeout(run, 80);
        setTimeout(run, 350);
      }
    },
    true
  );

  w.ClarityContentStream = { run: run, pathKey: pathKey, activeTab: activeTab };
})(window, document);
