/* Maps Lab stations to craft studios + curriculum phase hints */
(function (g) {
  "use strict";
  if (g.__CU_CRAFT_BRIDGE_V1__) return;
  g.__CU_CRAFT_BRIDGE_V1__ = true;

  function stage() {
    return document.getElementById("lab-stage") || document.getElementById("clarity-lab-root") || document.getElementById("craft-stage");
  }

  function phaseNum() {
    try {
      if (g.ClarityUnivLearner) return g.ClarityUnivLearner.currentPhaseNum();
    } catch (e) {}
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e2) {
      return 1;
    }
  }

  function gateNote(station) {
    var n = phaseNum();
    if (n >= 3) return "";
    if (station === "tajweed" || station === "callig" || station === "media") {
      return "Preview unlocked. Full craft is emphasized from Phase 3 (Daily · Itqān). Continue Junior modules when ready.";
    }
    return "";
  }

  function openStation(stationId) {
    var root = stage();
    if (!root) return false;
    var note = gateNote(stationId);
    if (stationId === "callig" && g.ClarityCalligraphy) {
      g.ClarityCalligraphy.open(root);
    } else if (stationId === "tajweed" && g.ClarityTajweedStudio) {
      g.ClarityTajweedStudio.open(root);
    } else if ((stationId === "media" || stationId === "meme") && g.ClarityMediaReminder) {
      g.ClarityMediaReminder.open(root);
    } else if (stationId === "research") {
      root.innerHTML =
        '<div class="craft-root"><h2>📚 Research Bench</h2><p class="craft-lead">Open Library shelves, capture three takeaways and one question for a teacher.</p>' +
        '<p><a class="craft-btn" href="/library/">Open Library →</a></p></div>';
    } else if (stationId === "design") {
      root.innerHTML =
        '<div class="craft-root"><h2>🧪 Module Design Atelier</h2><p class="craft-lead">Draft title, goal, steps, and source for librarian review. Educational prototype only.</p>' +
        '<textarea class="craft-field" id="des-draft" rows="5" style="width:100%" placeholder="Title…\nGoal…\nSteps…\nSource…"></textarea>' +
        '<p style="margin-top:.5rem"><button type="button" class="craft-btn" id="des-save">Save draft on device</button></p>' +
        '<p class="craft-log" id="des-log"></p></div>';
      var b = root.querySelector("#des-save");
      if (b)
        b.onclick = function () {
          try {
            localStorage.setItem("cu_craft_design_draft_v1", (root.querySelector("#des-draft") || {}).value || "");
            root.querySelector("#des-log").textContent = "Draft saved on this device.";
          } catch (e) {}
        };
    } else {
      root.innerHTML = '<div class="craft-root"><p class="craft-lead">Studio still loading… hard-refresh once.</p></div>';
      return false;
    }
    if (note) {
      var p = document.createElement("p");
      p.className = "craft-note";
      p.textContent = note;
      root.appendChild(p);
    }
    try {
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
    return true;
  }

  /* Query ?station= */
  function bootFromQuery() {
    try {
      var u = new URL(location.href);
      var s = u.searchParams.get("station");
      if (s) setTimeout(function () { openStation(s); }, 200);
    } catch (e) {}
  }

  g.ClarityCraftBridge = { openStation: openStation };
  /* Prefer bridge when Lab API missing openStation detail */
  var prev = g.ClarityLab;
  if (prev && typeof prev.openStation === "function") {
    var old = prev.openStation;
    prev.openStation = function (id) {
      if (openStation(id)) return;
      return old.apply(prev, arguments);
    };
  } else {
    g.ClarityLab = g.ClarityLab || {};
    g.ClarityLab.openStation = openStation;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootFromQuery);
  else bootFromQuery();
})(typeof window !== "undefined" ? window : this);
