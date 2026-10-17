/**
 * Quiet phase room v2 + P5 craft CTA — one college, strip chrome, craft handoff, next riwāq.
 * data-phase-room: seeker | practice | consistency | transmission
 * Educational only. Lab pill stays free reference.
 */
(function (g) {
  "use strict";
  if (g.__CU_PHASE_ROOM_V2__) return;
  g.__CU_PHASE_ROOM_V2__ = true;
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
  /* Phase 2 — one craft handoff per phase (Lab = reference) */
  /* Phase 5 — after-module craft CTA: Lab practice + Companion deep link */
  var CRAFT = {
    seeker: {
      href: "/lab/arabic/?deck=everyday",
      label: "Arabic — flash a few everyday words",
      blurb: "Lock vocabulary with flashcards, then one calligraphy stroke if you wish.",
      companionHref: "/#reminder",
      companionLabel: "Companion · Reminder",
      altHref: "/lab/calligraphy/",
      altLabel: "Calligraphy — one letter"
    },
    practice: {
      href: "/lab/tajweed/",
      label: "Tajweed — one rule, one āyah",
      blurb: "Serve prayer confidence. One rule, one short āyah.",
      companionHref: "/#reality",
      companionLabel: "Companion · Reality"
    },
    consistency: {
      href: "/lab/recite/",
      label: "Recite — short steady portion",
      blurb: "Daily itqān. A small portion you can repeat with care.",
      companionHref: "/#reflection",
      companionLabel: "Companion · Reflection"
    },
    transmission: {
      href: "/lab/media/",
      label: "Media — one verified reminder",
      blurb: "Source honesty before sharing. One short, checked reminder.",
      companionHref: "/#action",
      companionLabel: "Companion · Action"
    }
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
    return phaseNow() >= (ROOM_TO_NUM[room()] || 1);
  }

  function stripChrome() {
    [
      "clarity-phase-plaque-host",
      "clarity-phase-plaque-rail",
      "clarity-name-plaque-rail",
      "clarity-how-phases-slot",
      "campus-staff-strip",
      "campus-rescue-card",
      "cu-stage-skeleton",
      "campus-loading-hint"
    ].forEach(function (id) {
      var n = document.getElementById(id);
      if (n && (id !== "campus-loading-hint" || document.querySelector("[id$='-curriculum-card'], .junior-module"))) {
        try {
          if (id === "campus-loading-hint") n.remove();
          else n.remove();
        } catch (e) {}
      }
    });
    document.querySelectorAll(
      ".clarity-phase-plaque, .cu-skel, [data-chancellor-root], #clarity-chancellor-fab"
    ).forEach(function (n) {
      try {
        n.remove();
      } catch (e) {}
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
      try { el.remove(); } catch (e) {}
    });
    /* C2: remove foreign module lists that auto-mounted without card ids */
    var allow = {
      seeker: /junior|seeker/i,
      practice: /junior-high|practice|new.?muslim/i,
      consistency: /daily|consistency/i,
      transmission: /dai|transmission|university/i
    };
    var re = allow[room()];
    document.querySelectorAll("#cu-stage > *, #campus-stage-body, [id*='curriculum']").forEach(function (el) {
      if (!el || !el.id) return;
      if (id && el.id === id) return;
      if (re && re.test(el.id || el.className || "")) return;
      if (/curriculum-card|junior-curriculum|junior-high|daily-hs|dai-university/i.test(el.id || "")) {
        if (id && el.id === id) return;
        if (id && el.id !== id) { try { el.remove(); } catch (e2) {} }
      }
    });
  }

  function clearStageForeign() {
    var stage = document.getElementById("cu-stage") || document.getElementById("campus-stage-body");
    if (!stage) return;
    /* keep hosts empty of prior multi-curriculum dumps before exclusive render */
  }

  /* C1: only the active room's curriculum may render */
  function isolateCurriculumApis() {
    var map = {
      ClarityJuniorCurriculum: "seeker",
      ClarityJuniorHighCurriculum: "practice",
      ClarityDailyHsCurriculum: "consistency",
      ClarityDaiUniversity: "transmission",
      ClarityDaiUniversityCurriculum: "transmission"
    };
    Object.keys(map).forEach(function (name) {
      var api = g[name];
      if (!api || typeof api.render !== "function" || api.__cu_room_isolated) return;
      var orig = api.render;
      api.render = function () {
        if (room() !== map[name]) return;
        return orig.apply(api, arguments);
      };
      api.__cu_room_isolated = true;
    });
  }

  function modulesComplete() {
    var body = document.getElementById("campus-stage-body");
    if (!body) return false;
    var locks = body.querySelectorAll(".junior-module .lock, [data-locked='1'], .is-locked");
    var modules = body.querySelectorAll(".junior-module, [data-module-id], .curriculum-module");
    /* Heuristic: phase quiz button or "phase complete" block, or no locked modules with some modules present */
    if (body.querySelector(".junior-phase-quiz-btn, .junior-phase-complete, [data-phase-complete]"))
      return true;
    if (modules.length && locks.length === 0) return true;
    /* Progress text e.g. 11/11 */
    var txt = body.textContent || "";
    var m = txt.match(/(\d+)\s*\/\s*(\d+)\s*modules/i);
    if (m && m[1] === m[2] && parseInt(m[1], 10) > 0) return true;
    return false;
  }

  function ensureCraftSlot() {
    var r = room();
    var craft = CRAFT[r];
    if (!craft) return;
    var host = document.getElementById("cu-phase-craft");
    if (!host) {
      host = document.createElement("div");
      host.id = "cu-phase-craft";
      host.className = "cu-phase-craft";
      var stage = document.getElementById("clarity-campus-stage");
      if (stage && stage.parentNode) stage.parentNode.insertBefore(host, stage.nextSibling);
      else {
        var main = document.querySelector("main") || document.body;
        main.appendChild(host);
      }
    }
    var done = modulesComplete() || phaseNow() > (ROOM_TO_NUM[r] || 1);
    host.hidden = false;
    if (!done) {
      /* Soft preview — after-module craft waiting */
      host.className = "cu-phase-craft is-waiting";
      host.innerHTML =
        '<p class="cu-craft-kicker">After this phase\'s modules</p>' +
        '<p class="cu-craft-blurb">Complete the modules (and phase quiz when shown). Then a focused craft opens here: <strong>' +
        craft.label +
        "</strong>.</p>" +
        '<p class="cu-craft-hint">' +
        craft.blurb +
        "</p>" +
        '<p class="cu-craft-actions">' +
        '<a class="cu-btn ghost" href="/lab/">Lab stations</a> ' +
          (craft.altHref ? '<a class="cu-btn ghost" href="' + craft.altHref + '">' + (craft.altLabel || 'More lab') + '</a> ' : '') +
           +
        '<a class="cu-btn ghost" href="' +
        (craft.companionHref || "/") +
        '">' +
        (craft.companionLabel || "Companion") +
        "</a></p>";
      return;
    }
    host.className = "cu-phase-craft is-ready";
    host.innerHTML =
      '<p class="cu-craft-kicker">Practice this level · craft unlocked</p>' +
      '<p class="cu-craft-blurb">' +
      craft.blurb +
      "</p>" +
      '<p class="cu-craft-actions">' +
      '<a class="cu-btn" href="' +
      craft.href +
      '">' +
      craft.label +
      " →</a> " +
      '<a class="cu-btn" href="' +
      (craft.companionHref || "/") +
      '">' +
      (craft.companionLabel || "Companion") +
      "</a> " +
      '<a class="cu-btn ghost" href="/lab/">All Lab stations</a></p>';
  }

  
  function injectCraftStyles() {
    if (document.getElementById("cu-phase-craft-css")) return;
    var s = document.createElement("style");
    s.id = "cu-phase-craft-css";
    s.textContent =
      ".cu-phase-craft{margin:1rem 0;padding:0.85rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,.35);" +
      "background:rgba(0,0,0,.22);max-width:40rem}" +
      ".cu-phase-craft.is-waiting{opacity:.92;border-style:dashed}" +
      ".cu-phase-craft.is-ready{border-color:rgba(31,166,122,.55);background:rgba(13,79,60,.25)}" +
      ".cu-craft-kicker{font-weight:800;color:#e8c47a;margin:0 0 .35rem;font-size:.9rem}" +
      ".cu-craft-blurb,.cu-craft-hint{font-size:.82rem;line-height:1.45;margin:0 0 .5rem}" +
      ".cu-craft-actions{display:flex;flex-wrap:wrap;gap:.4rem;margin:0}" +
      ".cu-phase-craft .cu-btn{display:inline-block;padding:.35rem .75rem;border-radius:999px;font-size:.78rem;" +
      "border:1px solid rgba(212,180,90,.45);background:rgba(13,79,60,.4);color:#f3ead0;text-decoration:none}" +
      ".cu-phase-craft .cu-btn.ghost{background:transparent;opacity:.9}";
    document.head.appendChild(s);
  }

  
  function renderRoom() {
    /* F4: curriculum owned by campus/assets/curriculum/{room}.js
       phase-room only isolates, strips, paints gate/craft */
    try { isolateCurriculumApis(); } catch (e0) {}
    try { stripOtherCards(); } catch (e1) {}
    /* If surface loader already rendered, do not call all APIs.
       Only fallback-render if API present and stage still empty. */
    try {
      var r = room();
      var stage = document.getElementById("cu-stage");
      var empty = stage && !(stage.textContent || "").trim();
      var apiName = {
        seeker: "ClarityJuniorCurriculum",
        practice: "ClarityJuniorHighCurriculum",
        consistency: "ClarityDailyHsCurriculum",
        transmission: "ClarityDaiUniversity"
      }[r];
      if (empty && apiName && g[apiName] && typeof g[apiName].render === "function") {
        g[apiName].render();
      }
    } catch (e2) {}
    try { stripOtherCards(); } catch (e3) {}
    setTimeout(function () { try { isolateCurriculumApis(); stripOtherCards(); } catch (e4) {} }, 400);
setTimeout(stripOtherCards, 400);
    setTimeout(stripOtherCards, 1200);
    setTimeout(isolateCurriculumApis, 100);
    stripChrome();
    injectCraftStyles();
    paintGate();
    ensureCraftSlot();
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
        '<p><a class="cu-btn" href="' +
        ROOM_PATH[prev] +
        '">Return to ' +
        ROOM_LABEL[prev] +
        "</a> " +
        '<a class="cu-btn ghost" href="/campus/desk/">All riwāq</a></p>';
      var craft = document.getElementById("cu-phase-craft");
      if (craft) {
        craft.hidden = true;
        craft.innerHTML = "";
      }
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
        "<p>You may enter " +
        ROOM_LABEL[next] +
        ".</p>" +
        '<a class="cu-btn" href="' +
        ROOM_PATH[next] +
        '">Continue to ' +
        ROOM_LABEL[next] +
        " →</a>";
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
  
  /* C3: when foundation scripts auto-mount, re-isolate */
  (function watchMount() {
    var main = document.querySelector("main") || document.body;
    if (!main || typeof MutationObserver === "undefined") return;
    var t = null;
    var obs = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        try { isolateCurriculumApis(); stripOtherCards(); } catch (eW) {}
      }, 150);
    });
    obs.observe(main, { childList: true, subtree: true });
  })();

  document.addEventListener("cu-curriculum-ready", function () {
    try { isolateCurriculumApis(); stripOtherCards(); paintGate(); } catch (eR) {}
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityPhaseRoom = { render: renderRoom, phaseNow: phaseNow, room: room };
})(typeof window !== "undefined" ? window : this);
