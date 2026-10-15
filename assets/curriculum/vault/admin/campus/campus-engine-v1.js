/**
 * Clarity Campus Engine v1 — 22nd-century steering core
 * Lands → orients → learns → crafts → vault. IT · Security · O&M as gears.
 * Educational runtime only. Never writes SEAL foundation.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_ENGINE_V1__) return;
  g.__CLARITY_CAMPUS_ENGINE_V1__ = true;
  var VER = "20261009ENGINE";

  var STATE_KEY = "clarity_campus_engine_state_v1";
  var STAGES = ["land", "orient", "learn", "craft", "vault"];
  var STAGE_LABEL = {
    land: "Arrival",
    orient: "Orientation",
    learn: "Learning desk",
    craft: "Laboratory",
    vault: "Amana Vault"
  };

  var state = {
    stage: "land",
    gears: { it: "idle", security: "idle", om: "idle" },
    lastTick: 0,
    guided: false
  };

  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v == null ? fb : JSON.parse(v);
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function loadState() {
    var s = lsGet(STATE_KEY, null);
    if (s && s.stage) state.stage = s.stage;
    if (s && s.guided) state.guided = !!s.guided;
  }
  function saveState() {
    lsSet(STATE_KEY, { stage: state.stage, guided: state.guided, at: Date.now() });
  }

  /* ---------- Gears ---------- */
  function gearIT() {
    state.gears.it = "spin";
    var ok = true;
    try {
      if (g.ClarityIT && typeof g.ClarityIT.scanBridge === "function") g.ClarityIT.scanBridge();
      else if (g.ClarityWorkersOps && g.ClarityWorkersOps.probeSealed) {
        var s = g.ClarityWorkersOps.probeSealed();
        ok = !!(s.door || s.junior || s.vaultApi);
      }
    } catch (e) {
      ok = false;
    }
    state.gears.it = ok ? "ok" : "warn";
    return ok;
  }
  function gearSecurity() {
    state.gears.security = "spin";
    var score = 100;
    try {
      if (g.ClarityWorkersOps && g.ClarityWorkersOps.securityDeepScan) {
        score = g.ClarityWorkersOps.securityDeepScan().score || 0;
      } else if (g.ClaritySecurity && g.ClaritySecurity.scan) {
        g.ClaritySecurity.scan();
      }
    } catch (e) {
      score = 50;
    }
    state.gears.security = score >= 60 ? "ok" : "warn";
    return score;
  }
  function gearOM() {
    state.gears.om = "spin";
    try {
      if (g.ClarityWorkersOps && g.ClarityWorkersOps.omFullPulse) g.ClarityWorkersOps.omFullPulse();
      else if (g.ClarityOM && g.ClarityOM.pulse) g.ClarityOM.pulse();
      if (g.ClarityCampus && g.ClarityCampus.run) g.ClarityCampus.run();
      if (g.ClarityLab && g.ClarityLab.render) g.ClarityLab.render();
    } catch (e) {}
    state.gears.om = "ok";
    return true;
  }
  function spinGears(which) {
    var w = which || ["it", "security", "om"];
    if (w.indexOf("it") >= 0) gearIT();
    if (w.indexOf("security") >= 0) gearSecurity();
    if (w.indexOf("om") >= 0) gearOM();
    paintHUD();
    try {
      g.dispatchEvent(new CustomEvent("clarity-engine-gears", { detail: { gears: state.gears } }));
    } catch (e) {}
  }

  /* ---------- Stage transitions ---------- */
  function detectStage() {
    try {
      var tab = document.documentElement.getAttribute("data-active-tab") || "";
      if (tab === "notes" || tab === "vault") return "vault";
      if (document.getElementById("clarity-lab-shell") && document.getElementById("clab-workbench")) {
        var wb = document.getElementById("clab-workbench");
        if (wb && wb.querySelector(".clab-proj, .clab-wb-head")) return "craft";
      }
      var phase = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
      if (document.getElementById("junior-curriculum-card") || phase >= 1) return "learn";
      var wel = document.getElementById("clarity-welcome");
      if (wel && wel.classList.contains("show")) return "land";
      return state.stage || "orient";
    } catch (e) {
      return state.stage;
    }
  }

  function setStage(stage, opts) {
    opts = opts || {};
    if (STAGES.indexOf(stage) < 0) return;
    var prev = state.stage;
    state.stage = stage;
    saveState();
    try {
      document.documentElement.setAttribute("data-campus-stage", stage);
    } catch (e) {}
    paintHUD();
    if (!opts.silent) {
      try {
        g.dispatchEvent(
          new CustomEvent("clarity-engine-stage", { detail: { from: prev, to: stage } })
        );
      } catch (e2) {}
    }
    if (opts.navigate) navigateStage(stage);
  }

  function navigateStage(stage) {
    try {
      if (stage === "land") {
        if (typeof g.clarityShowWelcome === "function") g.clarityShowWelcome();
        else {
          var w = document.getElementById("clarity-welcome");
          if (w) {
            w.classList.add("show");
            w.setAttribute("aria-hidden", "false");
          }
        }
      } else if (stage === "orient" || stage === "learn") {
        if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("reminder");
        var plaque = document.getElementById("clarity-phase-plaque-rail");
        if (plaque) plaque.scrollIntoView({ behavior: "smooth", block: "start" });
        else {
          var stageEl = document.getElementById("clarity-campus-stage");
          if (stageEl) stageEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        spinGears(["om"]);
      } else if (stage === "craft") {
        if (g.ClarityLab && g.ClarityLab.render) g.ClarityLab.render();
        if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("reflection");
        setTimeout(function () {
          var lab = document.getElementById("clarity-lab-shell");
          if (lab) lab.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
        spinGears(["om", "it"]);
      } else if (stage === "vault") {
        if (typeof g.clarityOpenVault === "function") g.clarityOpenVault();
        else if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("notes");
        spinGears(["security", "it"]);
      }
    } catch (e) {}
  }

  function nextStage() {
    var i = STAGES.indexOf(state.stage);
    if (i < 0) i = 0;
    if (i >= STAGES.length - 1) return setStage("vault", { navigate: true });
    setStage(STAGES[i + 1], { navigate: true });
  }

  /* ---------- HUD (22nd-c ambient strip) ---------- */
  function ensureHUD() {
    var el = document.getElementById("clarity-engine-hud");
    if (el) return el;
    el = document.createElement("div");
    el.id = "clarity-engine-hud";
    el.className = "clarity-engine-hud";
    el.setAttribute("role", "navigation");
    el.setAttribute("aria-label", "Campus journey");
    el.innerHTML =
      '<div class="ceh-gears" aria-hidden="true">' +
      '<span class="ceh-gear" data-gear="it" title="IT">⚙</span>' +
      '<span class="ceh-gear" data-gear="security" title="Security">◎</span>' +
      '<span class="ceh-gear" data-gear="om" title="O&M">◇</span></div>' +
      '<div class="ceh-path" id="ceh-path"></div>' +
      '<button type="button" class="ceh-next" id="ceh-next" title="Continue journey">Continue</button>';
    var host =
      document.getElementById("clarity-global-nav") ||
      document.body;
    if (host && host.parentNode && host.id === "clarity-global-nav") {
      host.parentNode.insertBefore(el, host.nextSibling);
    } else {
      document.body.appendChild(el);
    }
    document.getElementById("ceh-next").onclick = function () {
      state.guided = true;
      saveState();
      nextStage();
    };
    el.querySelector(".ceh-path").onclick = function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-stage]");
      if (!b) return;
      setStage(b.getAttribute("data-stage"), { navigate: true });
    };
    return el;
  }

  function paintHUD() {
    var el = ensureHUD();
    var path = document.getElementById("ceh-path");
    if (path) {
      path.innerHTML = STAGES.map(function (s) {
        var cls = "ceh-step";
        if (s === state.stage) cls += " is-active";
        var idx = STAGES.indexOf(s);
        var cur = STAGES.indexOf(state.stage);
        if (idx < cur) cls += " is-done";
        return (
          '<button type="button" class="' +
          cls +
          '" data-stage="' +
          s +
          '"><span class="ceh-dot"></span><span class="ceh-lab">' +
          STAGE_LABEL[s] +
          "</span></button>"
        );
      }).join('<span class="ceh-rail" aria-hidden="true"></span>');
    }
    el.querySelectorAll(".ceh-gear").forEach(function (gEl) {
      var k = gEl.getAttribute("data-gear");
      gEl.setAttribute("data-state", state.gears[k] || "idle");
    });
    el.setAttribute("data-stage", state.stage);
  }

  /* ---------- First-run soft guide ---------- */
  function maybeFirstGuide() {
    if (state.guided) return;
    var seen = false;
    try {
      seen = localStorage.getItem("clarity_ux_grand_seen_v1") === "1";
    } catch (e) {}
    /* After welcome dismissed, orient once */
    setTimeout(function () {
      if (state.guided) return;
      var wel = document.getElementById("clarity-welcome");
      if (wel && wel.classList.contains("show")) return;
      setStage("orient", { navigate: false });
      paintHUD();
    }, 4000);
  }

  /* ---------- Wire door / vault into engine ---------- */
  function wireSignals() {
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], .door-rail-btn");
        if (!t) return;
        var tab = t.getAttribute("data-rail-tab") || t.getAttribute("data-rrra") || "";
        if (tab === "notes" || tab === "vault") setStage("vault", { silent: true });
        else if (tab === "reflection") setStage("craft", { silent: true });
        else if (tab === "reminder" || tab === "reality" || tab === "action")
          setStage("learn", { silent: true });
      },
      true
    );
    g.addEventListener("clarity-vault-ready", function () {
      spinGears(["it", "security"]);
      setTimeout(function () {
        spinGears(["om"]);
      }, 600);
    });
    g.addEventListener("clarity-curriculum-phase", function () {
      setStage("learn", { silent: true });
      spinGears(["om"]);
    });
  }

  /* ---------- Public API ---------- */
  g.ClarityCampusEngine = {
    version: VER,
    stages: STAGES.slice(),
    getStage: function () {
      return state.stage;
    },
    setStage: setStage,
    next: nextStage,
    spinGears: spinGears,
    gears: function () {
      return Object.assign({}, state.gears);
    },
    navigate: navigateStage
  };

  function boot() {
    loadState();
    ensureHUD();
    paintHUD();
    wireSignals();
    state.stage = detectStage() || state.stage;
    paintHUD();
    maybeFirstGuide();
    /* quiet gear warm-up */
    setTimeout(function () {
      spinGears(["it"]);
    }, 2500);
    setTimeout(function () {
      spinGears(["security", "om"]);
    }, 4000);
    try {
      console.info(
        "%c Campus Engine ",
        "background:linear-gradient(90deg,#0a2a40,#0d4f3c);color:#e8d48a",
        VER,
        "· gears IT/SEC/OM · stage",
        state.stage
      );
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 600);
    });
  } else setTimeout(boot, 600);
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 400);
  });
})(typeof window !== "undefined" ? window : this);
