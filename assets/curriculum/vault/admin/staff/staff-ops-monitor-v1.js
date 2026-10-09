/* Admin Staff — Ops Steward
 * Monitors module controller health, smoothness, and event flow.
 * Resides in vault admin; does not mutate sealed foundation APIs.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STAFF_OPS__) return;
  g.__CLARITY_STAFF_OPS__ = true;

  var LOG_KEY = "clarity_staff_ops_log_v1";
  var MAX_LOG = 40;
  var state = {
    id: "ops",
    name: "Ops Steward",
    checks: 0,
    ok: 0,
    warn: 0,
    last: null,
    heartbeat: null
  };

  function pushLog(level, msg, detail) {
    var entry = { at: Date.now(), level: level, msg: msg, detail: detail || null };
    state.last = entry;
    try {
      var arr = JSON.parse(localStorage.getItem(LOG_KEY) || "[]") || [];
      arr.push(entry);
      if (arr.length > MAX_LOG) arr = arr.slice(-MAX_LOG);
      localStorage.setItem(LOG_KEY, JSON.stringify(arr));
    } catch (e) {}
    if (level === "warn" || level === "error") {
      try {
        console.info("%c Ops Steward ", "background:#0d4f3c;color:#f0e6c8", level, msg, detail || "");
      } catch (e2) {}
    }
    return entry;
  }

  function requiredApis() {
    return [
      { name: "ClarityCurriculumEngine", ok: !!g.ClarityCurriculumEngine },
      { name: "ClarityCurriculumController", ok: !!g.ClarityCurriculumController },
      { name: "ClarityUniversity", ok: !!g.ClarityUniversity },
      { name: "clarityOpenModuleSparkQuiz", ok: typeof g.clarityOpenModuleSparkQuiz === "function" },
      { name: "clarityOpenPhaseQuiz", ok: typeof g.clarityOpenPhaseQuiz === "function" },
      { name: "ClarityVault", ok: !!g.ClarityVault }
    ];
  }

  function checkDomModules() {
    var ids = [
      "junior-curriculum-card",
      "junior-high-curriculum-card",
      "daily-hs-curriculum-card",
      "dai-university-curriculum-card",
      "clarity-phase-plaque-rail",
      "clarity-name-plaque-rail"
    ];
    var present = [];
    var missing = [];
    ids.forEach(function (id) {
      if (document.getElementById(id)) present.push(id);
      else missing.push(id);
    });
    return { present: present, missing: missing };
  }

  function runHealth() {
    state.checks += 1;
    var apis = requiredApis();
    var bad = apis.filter(function (a) {
      return !a.ok;
    });
    var dom = checkDomModules();
    var vaultStatus = g.ClarityVault && g.ClarityVault.status ? g.ClarityVault.status() : null;
    var smooth = bad.length === 0;

    if (smooth) {
      state.ok += 1;
      pushLog("ok", "Controllers responsive", {
        apis: apis.length,
        domPresent: dom.present.length,
        vault: vaultStatus
      });
    } else {
      state.warn += 1;
      pushLog("warn", "Missing APIs", { bad: bad.map(function (b) { return b.name; }) });
    }

    /* Soft self-heal: re-render active track if engine present but card empty */
    try {
      if (g.ClarityCurriculumController && g.ClarityCurriculumController.syncTracks) {
        g.ClarityCurriculumController.syncTracks();
      }
    } catch (e) {
      pushLog("error", "syncTracks failed", String(e && e.message));
    }

    try {
      g.dispatchEvent(
        new CustomEvent("clarity-staff-ops", {
          detail: { smooth: smooth, apis: apis, dom: dom, state: state }
        })
      );
    } catch (e3) {}
    return smooth;
  }

  /* Listen for curriculum progress — latency sample */
  var lastProgress = 0;
  g.addEventListener("clarity-curriculum-progress", function () {
    var now = Date.now();
    var dt = lastProgress ? now - lastProgress : 0;
    lastProgress = now;
    if (dt && dt < 40) pushLog("warn", "Rapid progress events", { dt: dt });
    else pushLog("ok", "Progress event", { dt: dt });
  });
  g.addEventListener("clarity-vault-ready", function () {
    pushLog("ok", "Vault ready — Ops on duty");
    runHealth();
  });

  function startHeartbeat() {
    if (state.heartbeat) return;
    runHealth();
    state.heartbeat = setInterval(runHealth, 45000);
  }

  g.ClarityStaffOps = {
    runHealth: runHealth,
    state: function () {
      return state;
    },
    logs: function () {
      try {
        return JSON.parse(localStorage.getItem(LOG_KEY) || "[]") || [];
      } catch (e) {
        return [];
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(startHeartbeat, 1200);
    });
  } else setTimeout(startHeartbeat, 1200);
})(typeof window !== "undefined" ? window : this);
