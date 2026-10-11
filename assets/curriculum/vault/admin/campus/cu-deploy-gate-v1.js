/* Clarity University deploy gate v1 — Phase 5 quality checks (browser console)
 * Run: ClarityUnivDeployGate.run()
 * Educational isolation only.
 */
(function (g) {
  "use strict";
  if (g.__CU_DEPLOY_GATE_V1__) return;
  g.__CU_DEPLOY_GATE_V1__ = true;

  function check() {
    var report = { ok: true, checks: [] };
    function add(name, pass, detail) {
      report.checks.push({ name: name, pass: !!pass, detail: detail || "" });
      if (!pass) report.ok = false;
    }
    add("learner API", !!(g.ClarityUnivLearner), "ClarityUnivLearner");
    add("boot flag", !!g.__CLARITY_VAULT_BOOT__ || !!document.querySelector("script[src*='boot.js']"), "vault boot");
    add("stage", !!document.getElementById("campus-stage-body") || !!document.getElementById("cu-phase-grid"), "map or desk");
    add("no companion tabs", !document.getElementById("tab-reminder"), "university isolation");
    try {
      var k = localStorage.getItem("clarity_curriculum_phase_v1");
      add("phase key readable", true, "phase=" + k);
    } catch (e) {
      add("phase key readable", false, String(e));
    }
    add("content depth", !!g.__CU_CONTENT_DEPTH_V1__ || !!document.querySelector("script[src*='cu-content-depth']"), "depth injector");
    g.__CU_DEPLOY_REPORT__ = report;
    try {
      console.info("%c Clarity Univ Deploy Gate ", "background:#0f4c3a;color:#e0c56a;font-weight:bold", report);
    } catch (e2) {}
    return report;
  }

  g.ClarityUnivDeployGate = { run: check };
  if (document.body && document.body.getAttribute("data-campus-page") === "desk") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () { setTimeout(check, 1500); });
    } else {
      setTimeout(check, 1500);
    }
  }
})(typeof window !== "undefined" ? window : this);
