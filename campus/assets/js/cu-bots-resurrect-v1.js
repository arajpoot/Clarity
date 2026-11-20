/*! cu-bots-resurrect-v1 · U31
 * Surfaces workers ops + scout + tips on /campus/bots/
 * Educational on-device ops only — not a fatwa · not production SRE for īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_BOTS_RESURRECT_V1__) return;
  w.__CU_BOTS_RESURRECT_V1__ = true;

  function isBots() {
    var p = (location.pathname || "").replace(/\/+$/, "");
    return p === "/campus/bots" || p.endsWith("/bots");
  }

  function ensurePanel() {
    if (d.getElementById("cu-bots-ops")) return;
    var sec = d.createElement("section");
    sec.id = "cu-bots-ops";
    sec.className = "cu-bots-ops";
    sec.setAttribute("data-clarity-owned", "bots-u31");
    sec.innerHTML =
      '<div class="cbo-card">' +
      "  <h2>Campus bots · on-device ops</h2>" +
      "  <p>Resurrected workers tools for this browser only. They probe curriculum readiness and local progress — not a live server farm, not a fatwa desk.</p>" +
      '  <div class="cbo-grid">' +
      '    <div class="cbo-tile"><strong>Seq bots</strong> Stage progress bus · next unfinished module</div>' +
      '    <div class="cbo-tile"><strong>Workers ops</strong> IT sandbox · drill log · seal probe</div>' +
      '    <div class="cbo-tile"><strong>Resource scout</strong> Staff-style link scout (educational)</div>' +
      '    <div class="cbo-tile"><strong>Persona tips</strong> Soft orientation prompts</div>' +
      "  </div>" +
      '  <div id="cit-scan" class="cit-scan" aria-live="polite"></div>' +
      '  <div id="clarity-workers-drill-chip"></div>' +
      '  <div class="cbo-actions">' +
      '    <button type="button" id="cbo-probe">Probe curriculum APIs</button>' +
      '    <a class="cbo-btn" href="/campus/desk/">Desk</a>' +
      '    <a class="cbo-btn" href="/campus/lab/">Lab</a>' +
      '    <a class="cbo-btn" href="/campus/portal/">Portal</a>' +
      "  </div>" +
      '  <p class="cbo-stamp">Educational only — not a fatwa · not a grade of īmān · ops stay on this device</p>' +
      "</div>";
    var main = d.querySelector("main") || d.body;
    var h1 = main.querySelector("h1, h2");
    if (h1 && h1.parentNode) h1.parentNode.insertBefore(sec, h1.nextSibling);
    else main.insertBefore(sec, main.firstChild);

    var btn = d.getElementById("cbo-probe");
    if (btn) {
      btn.addEventListener("click", function () {
        var scan = d.getElementById("cit-scan");
        if (!scan) return;
        var lines = [];
        lines.push("Vault sealed: " + (!!w.__CLARITY_VAULT_SEALED__ ? "yes" : "no"));
        lines.push("ClarityVault: " + (w.ClarityVault ? "present" : "missing"));
        lines.push("Engine: " + (w.ClarityCurriculumEngine ? "present" : "missing"));
        lines.push("Junior curriculum: " + (w.ClarityJuniorCurriculum ? "present" : "missing"));
        lines.push("CuSeq: " + (w.CuSeq ? "present" : "missing"));
        if (w.CuSeq && w.CuSeq.getNext) {
          try {
            var n = w.CuSeq.getNext();
            lines.push("Next module: " + (n && n.moduleId ? n.moduleId : "none"));
          } catch (e) {}
        }
        scan.innerHTML = "<pre style=\"white-space:pre-wrap;font-size:0.8rem\">" + lines.join("\n") + "</pre>";
      });
    }
  }

  function boot() {
    if (!isBots()) return;
    try {
      ensurePanel();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
})(window, document);
