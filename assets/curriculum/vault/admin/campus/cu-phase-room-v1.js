/**
 * Quiet phase room — mount only one college, strip extra chrome.
 * data-phase-room: seeker | practice | consistency | transmission
 * Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_PHASE_ROOM__) return;
  g.__CU_PHASE_ROOM__ = true;

  var PHASE_KEY = "clarity_curriculum_phase_v1";
  var ROOM_TO_NUM = { seeker: 1, practice: 2, consistency: 3, transmission: 4 };
  var NUM_TO_ROOM = { 1: "seeker", 2: "practice", 3: "consistency", 4: "transmission" };
  var ROOM_PATH = {
    seeker: "/campus/desk/seeker/",
    practice: "/campus/desk/practice/",
    consistency: "/campus/desk/consistency/",
    transmission: "/campus/desk/transmission/"
  };
  var ROOM_LABEL = {
    seeker: "Foundations (Junior)",
    practice: "Practice (New Muslim)",
    consistency: "Consistency (Daily)",
    transmission: "Transmission (Daʿī)"
  };

  function room() {
    return (document.body && document.body.getAttribute("data-phase-room")) || "seeker";
  }

  function phaseNow() {
    try {
      return parseInt(localStorage.getItem(PHASE_KEY) || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }

  function allowed() {
    var r = room();
    var need = ROOM_TO_NUM[r] || 1;
    return phaseNow() >= need;
  }

  function stripChrome() {
    [
      "clarity-phase-plaque-host",
      "clarity-phase-plaque-rail",
      "clarity-name-plaque-rail",
      "clarity-how-phases-slot",
      "campus-staff-strip",
      "campus-rescue-card",
      "cu-stage-skeleton"
    ].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) try { n.remove(); } catch (e) {}
    });
    document.querySelectorAll(
      ".clarity-phase-plaque, .cu-skel, [data-chancellor-root], #clarity-chancellor-fab"
    ).forEach(function (n) {
      try { n.remove(); } catch (e) {}
    });
  }

  function stripOtherCards() {
    var keep = {
      seeker: "junior-curriculum-card",
      practice: "junior-high-curriculum-card",
      consistency: "daily-hs-curriculum-card",
      transmission: "dai-university-curriculum-card"
    };
    var id = keep[room()];
    document.querySelectorAll("[id$='-curriculum-card'], .curriculum-phase-card").forEach(function (el) {
      if (id && el.id === id) return;
      if (id && el.querySelector && el.querySelector("#" + id)) return;
      try { el.remove(); } catch (e) {}
    });
  }

  function renderRoom() {
    try {
      var r = room();
      if (r === "seeker" && g.ClarityJuniorCurriculum && g.ClarityJuniorCurriculum.render)
        g.ClarityJuniorCurriculum.render();
      if (r === "practice" && g.ClarityJuniorHighCurriculum && g.ClarityJuniorHighCurriculum.render)
        g.ClarityJuniorHighCurriculum.render();
      if (r === "consistency" && g.ClarityDailyHsCurriculum && g.ClarityDailyHsCurriculum.render)
        g.ClarityDailyHsCurriculum.render();
      if (r === "transmission" && g.ClarityDaiUniversity && g.ClarityDaiUniversity.render)
        g.ClarityDaiUniversity.render();
      else if (r === "transmission" && g.ClarityDaiUniversityCurriculum && g.ClarityDaiUniversityCurriculum.render)
        g.ClarityDaiUniversityCurriculum.render();
    } catch (e) {}
    stripOtherCards();
    stripChrome();
    paintGate();
    paintNext();
  }

  function paintGate() {
    var gate = document.getElementById("cu-phase-gate");
    if (!gate) return;
    if (allowed()) {
      gate.hidden = true;
      var stage = document.getElementById("clarity-campus-stage");
      if (stage) stage.hidden = false;
    } else {
      gate.hidden = false;
      var stage2 = document.getElementById("clarity-campus-stage");
      if (stage2) stage2.hidden = true;
      var need = ROOM_TO_NUM[room()] || 1;
      var prev = NUM_TO_ROOM[need - 1] || "seeker";
      gate.innerHTML =
        "<h2>This riwāq is still sealed</h2>" +
        "<p>Complete the previous phase and its phase quiz first. Progress stays on this device.</p>" +
        '<p><a class="cu-btn" href="' + ROOM_PATH[prev] + '">Return to ' + ROOM_LABEL[prev] + "</a> " +
        '<a class="cu-btn ghost" href="/campus/desk/">All riwāq</a></p>';
    }
  }

  function paintNext() {
    var el = document.getElementById("cu-next-riwaq");
    if (!el) return;
    var r = room();
    var n = ROOM_TO_NUM[r] || 1;
    var unlocked = phaseNow();
    if (unlocked > n && n < 4) {
      var next = NUM_TO_ROOM[n + 1];
      el.hidden = false;
      el.innerHTML =
        "<strong>Next riwāq open</strong>" +
        "<p>You may enter " + ROOM_LABEL[next] + ".</p>" +
        '<a class="cu-btn" href="' + ROOM_PATH[next] + '">Continue to ' + ROOM_LABEL[next] + " →</a>";
    } else if (n === 4 && unlocked >= 4) {
      el.hidden = false;
      el.innerHTML =
        "<strong>Path complete on this device</strong>" +
        '<p><a class="cu-btn" href="/campus/">Campus map</a> <a class="cu-btn ghost" href="/lab/">Lab</a></p>';
    } else {
      el.hidden = true;
      el.innerHTML = "";
    }
  }

  function boot() {
    stripChrome();
    paintGate();
    if (!allowed()) return;
    renderRoom();
    setTimeout(renderRoom, 400);
    setTimeout(renderRoom, 1200);
    setTimeout(renderRoom, 2500);
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 50);
    setTimeout(boot, 500);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityPhaseRoom = { render: renderRoom, phaseNow: phaseNow, room: room };
})(typeof window !== "undefined" ? window : this);
