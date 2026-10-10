/**
 * Clarity Workers Ops Pack v1 — IT · Security · O&M skill upgrade + on-device IT sandbox
 * Educational runtime ops only. Does not touch SEAL foundation hashes.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_WORKERS_OPS_V1__) return;
  g.__CLARITY_WORKERS_OPS_V1__ = true;
  var VER = "20261009VAULT";

  var SIM_KEY = "clarity_it_sandbox_sim_v1";
  var DRILL_KEY = "clarity_workers_drill_log_v1";

  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      if (v == null) return fb;
      return JSON.parse(v);
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function now() {
    return Date.now();
  }

  /* ---------- probes ---------- */
  function probeSealed() {
    return {
      vaultSealed: !!g.__CLARITY_VAULT_SEALED__,
      vaultApi: !!(g.ClarityVault && g.ClarityVault.status),
      engine: !!g.ClarityCurriculumEngine,
      controller: !!g.ClarityCurriculumController,
      university: !!g.ClarityUniversity,
      junior: !!g.ClarityJuniorCurriculum,
      door: typeof g.clarityOpenSectionDoor === "function"
    };
  }
  function probeEdge() {
    return {
      it: !!(g.ClarityIT || g.__CLARITY_IT_WING__),
      om: !!g.ClarityOM,
      security: !!g.ClaritySecurity,
      registrar: !!g.ClarityRegistrar,
      faculty: !!g.ClarityFaculty,
      lab: !!g.ClarityLab,
      ux: !!g.ClarityUX,
      chancellor: !!g.ClarityChancellor,
      campus: !!g.ClarityCampus
    };
  }
  function probeDom() {
    return {
      stage: !!document.getElementById("clarity-campus-stage"),
      stageBody: !!document.getElementById("campus-stage-body"),
      labShell: !!document.getElementById("clarity-lab-shell"),
      juniorCard: !!document.getElementById("junior-curriculum-card"),
      doorRail: !!document.getElementById("clarity-door-rail"),
      banner: !!document.getElementById("clarity-top-duo")
    };
  }

  /* ---------- Security skill: deep pipe map ---------- */
  function securityDeepScan() {
    var sealed = probeSealed();
    var edge = probeEdge();
    var dom = probeDom();
    var pipes = [];
    function pipe(name, ok, detail) {
      pipes.push({ name: name, ok: !!ok, detail: detail || null });
    }
    pipe("vault→engine", sealed.engine, sealed.engine ? "present" : "missing ClarityCurriculumEngine");
    pipe("vault→junior", sealed.junior, sealed.junior ? "college-seeker online" : "junior API missing");
    pipe("door→chunk", sealed.door, sealed.door ? "clarityOpenSectionDoor callable" : "door API missing");
    pipe("stage→lab", dom.stageBody && (edge.lab || dom.labShell), "lab mount target");
    pipe("IT↔Security", edge.it && edge.security, "wings present");
    pipe("IT↔O&M", edge.it && edge.om, "line crew present");
    pipe("campus shell", edge.campus || dom.stage, "stage host");
    var broken = pipes.filter(function (p) {
      return !p.ok;
    });
    var report = {
      at: now(),
      pipes: pipes,
      broken: broken.map(function (p) {
        return p.name;
      }),
      score: Math.round(((pipes.length - broken.length) / Math.max(1, pipes.length)) * 100)
    };
    if (g.ClaritySecurity && typeof g.ClaritySecurity.scan === "function") {
      try {
        g.ClaritySecurity.scan();
      } catch (e) {}
    }
    try {
      g.dispatchEvent(new CustomEvent("clarity-security-deep", { detail: report }));
    } catch (e) {}
    return report;
  }

  /* ---------- O&M skill: circulation + soft clean ---------- */
  function omFullPulse() {
    var steps = [];
    try {
      if (g.ClarityOM && g.ClarityOM.pulse) {
        g.ClarityOM.pulse();
        steps.push("pulse");
      }
    } catch (e) {}
    try {
      if (g.ClarityOM && g.ClarityOM.clean) {
        g.ClarityOM.clean();
        steps.push("clean");
      }
    } catch (e2) {}
    /* soft: re-adopt campus cards */
    try {
      if (g.ClarityCampus && g.ClarityCampus.adoptCurriculumCards) {
        g.ClarityCampus.adoptCurriculumCards();
        steps.push("adopt-cards");
      }
    } catch (e3) {}
    try {
      if (g.ClarityLab && g.ClarityLab.render) {
        g.ClarityLab.render();
        steps.push("lab-render");
      }
    } catch (e4) {}
    var report = { at: now(), steps: steps };
    try {
      g.dispatchEvent(new CustomEvent("clarity-om-pulse", { detail: report }));
    } catch (e5) {}
    return report;
  }

  /* ---------- IT on-device sandbox simulation ---------- */
  var SCENARIOS = [
    {
      id: "door-offline",
      title: "Door API offline",
      describe: "Simulate missing clarityOpenSectionDoor; verify polyfill / rescue path."
    },
    {
      id: "lab-unmounted",
      title: "Lab shell unmounted",
      describe: "Simulate empty lab; O&M + Lab.render should remount into stage."
    },
    {
      id: "edge-gap",
      title: "Edge wing gap",
      describe: "Report which edge APIs are absent without touching SEAL."
    },
    {
      id: "full-drill",
      title: "Night-watch drill",
      describe: "Security deep scan → O&M pulse → bridge summary (coordinated)."
    }
  ];

  function runScenario(id) {
    var started = now();
    var log = { id: id, at: started, steps: [], pass: false };
    var sealed = probeSealed();
    var edge = probeEdge();
    var dom = probeDom();

    if (id === "door-offline") {
      log.steps.push({ check: "door-present", ok: sealed.door });
      log.steps.push({
        check: "polyfill-or-real",
        ok: typeof g.clarityOpenSectionDoor === "function"
      });
      try {
        g.clarityOpenSectionDoor("reminder");
        log.steps.push({ check: "door-call", ok: true });
      } catch (e) {
        log.steps.push({ check: "door-call", ok: false, err: String(e && e.message) });
      }
      log.pass = log.steps.every(function (s) {
        return s.ok;
      });
    } else if (id === "lab-unmounted") {
      log.steps.push({ check: "stage-body", ok: dom.stageBody });
      try {
        if (g.ClarityLab && g.ClarityLab.render) g.ClarityLab.render();
        log.steps.push({ check: "lab-render", ok: true });
      } catch (e) {
        log.steps.push({ check: "lab-render", ok: false });
      }
      var after = !!document.getElementById("clarity-lab-shell");
      log.steps.push({ check: "lab-shell-after", ok: after });
      log.pass = after;
    } else if (id === "edge-gap") {
      var missing = Object.keys(edge).filter(function (k) {
        return !edge[k];
      });
      log.steps.push({ check: "edge-map", ok: true, missing: missing });
      log.pass = missing.length < 4;
      log.missing = missing;
    } else if (id === "full-drill") {
      var sec = securityDeepScan();
      log.steps.push({ check: "security", ok: sec.score >= 50, score: sec.score });
      var om = omFullPulse();
      log.steps.push({ check: "om", ok: om.steps.length > 0, steps: om.steps });
      if (g.ClarityIT && typeof g.ClarityIT.scanBridge === "function") {
        try {
          g.ClarityIT.scanBridge();
          log.steps.push({ check: "it-scan", ok: true });
        } catch (e) {
          log.steps.push({ check: "it-scan", ok: false });
        }
      } else {
        log.steps.push({ check: "it-scan", ok: false, note: "ClarityIT.scanBridge missing" });
      }
      log.pass = log.steps.filter(function (s) {
        return s.ok;
      }).length >= 2;
    } else {
      log.steps.push({ check: "unknown-scenario", ok: false });
      log.pass = false;
    }

    log.ms = now() - started;
    var hist = lsGet(SIM_KEY, { runs: [] }) || { runs: [] };
    hist.runs.unshift(log);
    if (hist.runs.length > 30) hist.runs = hist.runs.slice(0, 30);
    lsSet(SIM_KEY, hist);
    try {
      g.dispatchEvent(new CustomEvent("clarity-it-sim", { detail: log }));
    } catch (e) {}
    return log;
  }

  function runAllSims() {
    return SCENARIOS.map(function (s) {
      return runScenario(s.id);
    });
  }

  /* ---------- Surprise: Night-watch coordinated drill chip ---------- */
  function showDrillChip(summary) {
    var el = document.getElementById("clarity-workers-drill-chip");
    if (el) el.remove();
    el = document.createElement("div");
    el.id = "clarity-workers-drill-chip";
    el.setAttribute("role", "status");
    el.style.cssText =
      "position:fixed;bottom:5rem;left:50%;transform:translateX(-50%);z-index:99980;" +
      "max-width:min(92vw,320px);background:linear-gradient(145deg,#0a2a40,#0d4f3c);color:#e7efe9;" +
      "padding:.75rem 1rem;border-radius:14px;font:600 13px/1.4 system-ui,sans-serif;" +
      "box-shadow:0 10px 32px rgba(0,0,0,.35);border:1px solid rgba(168,212,240,.35);" +
      "opacity:0;transition:opacity .35s";
    el.innerHTML =
      '<div style="opacity:.8;font-size:11px;letter-spacing:.06em;color:#a8d4f0">NIGHT WATCH · WORKERS</div>' +
      "<div style=\"margin-top:.25rem\">" +
      summary +
      "</div>";
    el.onclick = function () {
      el.remove();
    };
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
    });
    setTimeout(function () {
      try {
        el.style.opacity = "0";
        setTimeout(function () {
          el.remove();
        }, 350);
      } catch (e) {}
    }, 5500);
  }

  function nightWatchDrill() {
    var sec = securityDeepScan();
    var om = omFullPulse();
    var sims = runAllSims();
    var passed = sims.filter(function (r) {
      return r.pass;
    }).length;
    var summary =
      "Security pipes " +
      sec.score +
      "% · O&M " +
      (om.steps.join(", ") || "idle") +
      " · Sandbox " +
      passed +
      "/" +
      sims.length +
      " scenarios";
    var entry = { at: now(), sec: sec.score, om: om.steps, simPass: passed, simTotal: sims.length };
    var log = lsGet(DRILL_KEY, []) || [];
    log.unshift(entry);
    if (log.length > 20) log = log.slice(0, 20);
    lsSet(DRILL_KEY, log);
    showDrillChip(summary);
    try {
      console.info("%c Night Watch ", "background:#0a2a40;color:#a8d4f0", summary);
    } catch (e) {}
    return entry;
  }

  /* ---------- Enhance IT panel if present ---------- */
  function enhanceITPanel() {
    var panel = document.getElementById("cit-scan");
    if (!panel || document.getElementById("cit-sandbox")) return;
    var bar = panel.parentNode;
    if (!bar) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cit-sandbox";
    btn.className = "cdm-btn cdm-secondary";
    btn.textContent = "Sandbox sim";
    btn.title = "On-device IT simulation — no foundation writes";
    btn.onclick = function () {
      var results = runAllSims();
      var ok = results.filter(function (r) {
        return r.pass;
      }).length;
      showDrillChip("Sandbox: " + ok + "/" + results.length + " scenarios passed");
      if (g.ClarityIT && g.ClarityIT.scanBridge) {
        try {
          g.ClarityIT.scanBridge();
        } catch (e) {}
      }
    };
    bar.appendChild(btn);
    var drill = document.createElement("button");
    drill.type = "button";
    drill.id = "cit-nightwatch";
    drill.className = "cdm-btn cdm-secondary";
    drill.textContent = "Night watch";
    drill.title = "Coordinate Security → O&M → IT sandbox";
    drill.onclick = function () {
      nightWatchDrill();
    };
    bar.appendChild(drill);
  }

  /* Public API */
  g.ClarityWorkersOps = {
    version: VER,
    securityDeepScan: securityDeepScan,
    omFullPulse: omFullPulse,
    runScenario: runScenario,
    runAllSims: runAllSims,
    nightWatchDrill: nightWatchDrill,
    scenarios: SCENARIOS,
    probeSealed: probeSealed,
    probeEdge: probeEdge,
    probeDom: probeDom
  };

  /* Wire IT public aliases if wing loaded */
  function aliasIT() {
    if (!g.ClarityIT) return;
    try {
      g.ClarityIT.runSandbox = runAllSims;
      g.ClarityIT.runScenario = runScenario;
      g.ClarityIT.nightWatch = nightWatchDrill;
    } catch (e) {}
  }

  function boot() {
    aliasIT();
    enhanceITPanel();
    /* soft lab ensure */
    try {
      if (g.ClarityLab && g.ClarityLab.render) g.ClarityLab.render();
    } catch (e) {}
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 600);
    setTimeout(enhanceITPanel, 1500);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 2000);
      setTimeout(enhanceITPanel, 3500);
    });
  } else {
    setTimeout(boot, 2000);
    setTimeout(enhanceITPanel, 3500);
  }

  try {
    console.info("%c Workers Ops ", "background:#0a2a40;color:#a8d4f0", VER, "IT sandbox · Security pipes · O&M pulse");
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);

/* ---- WORKERS v2 append: IT report card + O&M realtime ticker ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_WORKERS_V2__) return;
  g.__CLARITY_WORKERS_V2__ = true;

  var RT_KEY = "clarity_om_realtime_v1";
  var IT_REP = "clarity_it_reports_rich_v1";

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

  /** Rich IT report after scan */
  function writeITReport(extra) {
    var ops = g.ClarityWorkersOps;
    var sealed = ops && ops.probeSealed ? ops.probeSealed() : {};
    var edge = ops && ops.probeEdge ? ops.probeEdge() : {};
    var dom = ops && ops.probeDom ? ops.probeDom() : {};
    var rep = {
      at: Date.now(),
      sealed: sealed,
      edge: edge,
      dom: dom,
      extra: extra || null,
      ver: (ops && ops.version) || "workers"
    };
    var arr = lsGet(IT_REP, []) || [];
    arr.unshift(rep);
    if (arr.length > 25) arr = arr.slice(0, 25);
    lsSet(IT_REP, arr);
    try {
      console.info(
        "%c IT Report ",
        "background:#0a2a40;color:#a8d4f0",
        "sealed",
        Object.keys(sealed).filter(function (k) {
          return sealed[k];
        }).length +
          "/" +
          Object.keys(sealed).length,
        "edge",
        Object.keys(edge).filter(function (k) {
          return edge[k];
        }).length +
          "/" +
          Object.keys(edge).length
      );
    } catch (e) {}
    return rep;
  }

  /** Hook scanBridge if present */
  function hookIT() {
    if (!g.ClarityIT || typeof g.ClarityIT.scanBridge !== "function") return;
    if (g.ClarityIT.scanBridge.__rich) return;
    var prev = g.ClarityIT.scanBridge;
    g.ClarityIT.scanBridge = function () {
      var r = prev.apply(this, arguments);
      try {
        writeITReport({ kind: "scanBridge" });
      } catch (e) {}
      return r;
    };
    g.ClarityIT.scanBridge.__rich = true;
    g.ClarityIT.lastReports = function () {
      return lsGet(IT_REP, []);
    };
  }

  /** O&M realtime ticker — lightweight DOM health every 20s when page visible */
  var omTimer = null;
  function omTick() {
    if (document.hidden) return;
    var issues = [];
    if (!document.getElementById("clarity-door-rail")) issues.push("door-rail");
    if (!document.getElementById("clarity-top-duo")) issues.push("banner");
    var vaultFocus = document.documentElement.getAttribute("data-vault-focus") === "1";
    if (vaultFocus) {
      var gate = document.getElementById("amana-vault-gate");
      if (gate && gate.offsetTop > 120) {
        /* soft nudge scroll if gate pushed down by void */
        try {
          gate.scrollIntoView({ block: "nearest", behavior: "auto" });
        } catch (e) {}
      }
    }
    try {
      if (g.ClarityOM && g.ClarityOM.pulse && issues.length) g.ClarityOM.pulse();
    } catch (e2) {}
    var entry = { at: Date.now(), issues: issues, vaultFocus: vaultFocus };
    var log = lsGet(RT_KEY, []) || [];
    log.unshift(entry);
    if (log.length > 40) log = log.slice(0, 40);
    lsSet(RT_KEY, log);
    try {
      g.dispatchEvent(new CustomEvent("clarity-om-realtime", { detail: entry }));
    } catch (e3) {}
  }

  function startOMRealtime() {
    if (omTimer) return;
    omTick();
    if (typeof setInterval === "function") omTimer = setInterval(omTick, 20000);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) omTick();
    });
    try {
      console.info("%c O&M Realtime ", "background:#4a1020;color:#f5d0dc", "20s heartbeat · vault focus guard");
    } catch (e) {}
  }

  if (g.ClarityWorkersOps) {
    g.ClarityWorkersOps.writeITReport = writeITReport;
    g.ClarityWorkersOps.omRealtimeStart = startOMRealtime;
  }

  function boot() {
    hookIT();
    startOMRealtime();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () {
    setTimeout(boot, 2500);
  });
  else setTimeout(boot, 2500);
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 800);
  });
})(typeof window !== "undefined" ? window : this);
