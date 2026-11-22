/*! cu-vle-tutorial-v1 · U56
 * Smart logical scanner + user tutorial for Campus virtual learning.
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_TUTORIAL_V1__) return;
  w.__CU_VLE_TUTORIAL_V1__ = true;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function isBots() {
    return path() === "/campus/bots";
  }

  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v == null ? fb : v;
    } catch (e) {
      return fb;
    }
  }

  function scanVle() {
    var lines = [];
    var ok = 0;
    var total = 0;
    function row(name, pass, detail) {
      total++;
      if (pass) ok++;
      lines.push((pass ? "PASS" : "WAIT") + " · " + name + (detail ? " · " + detail : ""));
    }

    var phase = parseInt(lsGet("clarity_curriculum_phase_v1", "1"), 10) || 1;
    row("Phase key", phase >= 1 && phase <= 4, "phase=" + phase);

    var junior = 0;
    try {
      var o = JSON.parse(lsGet("clarity_junior_progress_v1", "{}") || "{}");
      Object.keys(o || {}).forEach(function (k) {
        if (o[k]) junior++;
      });
    } catch (e) {}
    row("Junior marks", true, junior + "/12 on this device");

    row("Gate seen", lsGet("cu_campus_gate_seen_v1", "") === "1" || !!lsGet("cu_campus_gate_mode_v1", ""), "first-visit modal state");
    row("Path AI", !!w.ClarityPathAI, w.ClarityPathAI ? "ClarityPathAI " + (w.ClarityPathAI.version || "") : "open /campus/ once");
    row("Command center script", !!w.__CU_BOTS_COMMAND_V1__ || !!d.querySelector('script[src*="cu-bots-command"]'), "bots command");
    row("VLE HUD script", !!w.__CU_VLE_HUD_V1__ || !!d.querySelector('script[src*="cu-vle-hud"]'), "hud");
    row("Research desk", !!w.__CU_VLE_RESEARCH_V1__ || !!d.querySelector('script[src*="cu-vle-research"]'), "allowlisted research");
    row("Faculty research", !!w.__CU_VLE_FACULTY_RESEARCH_V1__ || !!d.querySelector('script[src*="cu-vle-faculty"]'), "assigned guide");
    row("CuSeq bus", !!(w.CuSeq && typeof w.CuSeq.getNext === "function"), "progress bus");

    lines.push("");
    lines.push("Scanner: " + ok + "/" + total + " ready on this device");
    lines.push("Educational scan only — not a security audit · not a fatwa");
    return { ok: ok, total: total, text: lines.join("\n") };
  }

  function ensureCss() {
    if (d.querySelector('link[data-cu-vle-tut]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-vle-tutorial-v1.css?v=20261121U56";
    l.setAttribute("data-cu-vle-tut", "1");
    d.head.appendChild(l);
  }

  function mount() {
    if (!isBots() || d.getElementById("cu-vle-tutorial")) return;
    ensureCss();
    var sec = d.createElement("section");
    sec.id = "cu-vle-tutorial";
    sec.className = "cu-vle-tut";
    sec.setAttribute("data-clarity-owned", "vle-tutorial-v1");
    sec.innerHTML =
      '<div class="cvt-card">' +
      '<p class="cvt-kicker">Tutorial · virtual learning</p>' +
      "<h2>How to use Campus VLE</h2>" +
      '<p class="cvt-lead">A calm path on <strong>this device</strong>. Nothing here is a fatwa, a certificate, or a grade of īmān.</p>' +
      '<ol class="cvt-steps">' +
      "<li><strong>Enter Campus</strong> — first visit may show two doors (new / returning). Choice stays in this browser.</li>" +
      '<li><strong>Seeker station</strong> — open <a href="/campus/desk/seeker/">Junior modules</a> only on Seeker. One door at a time.</li>' +
      '<li><strong>Nur Path Engine</strong> — on the gate/desk, route to <a href="/craft/">Craft benches</a> (notes, tajweed, quiz…).</li>' +
      '<li><strong>Assigned guide</strong> — ask topics or verse keys; for <em>wasiyyah</em> use the Amānah bridge (study only).</li>' +
      '<li><strong>Research desk</strong> — allowlisted Qurʾān / Sunnah / SeekersGuidance links — verify with a local teacher.</li>' +
      '<li><strong>Bots ops</strong> — Seq / Workers / Scout / Persona pills check <em>local</em> readiness, not a live server farm.</li>' +
      "</ol>" +
      '<div class="cvt-actions">' +
      '<button type="button" id="cvt-scan-btn">Run smart scanner</button>' +
      '<a href="/campus/desk/seeker/">Start Seeker</a>' +
      '<a class="ghost" href="/campus/">Campus gate</a>' +
      '<a class="ghost" href="/craft/">Craft room</a>' +
      "</div>" +
      '<div class="cvt-scan" id="cvt-scan-out" hidden><h3>Logical scanner</h3><pre id="cvt-scan-pre"></pre></div>' +
      '<p class="cvt-stamp">Educational only — not a fatwa · not a grade of īmān · teachers of flesh and blood remain the guide.</p>' +
      "</div>";

    var main = d.querySelector("main") || d.body;
    var cmd = d.getElementById("cu-bots-command");
    if (cmd && cmd.parentNode) cmd.parentNode.insertBefore(sec, cmd.nextSibling);
    else {
      var h1 = main.querySelector("h1, h2");
      if (h1 && h1.parentNode) h1.parentNode.insertBefore(sec, h1.nextSibling);
      else main.insertBefore(sec, main.firstChild);
    }

    d.getElementById("cvt-scan-btn").addEventListener("click", function () {
      var r = scanVle();
      var box = d.getElementById("cvt-scan-out");
      var pre = d.getElementById("cvt-scan-pre");
      box.hidden = false;
      pre.textContent = r.text;
    });
  }

  function boot() {
    try {
      mount();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
})(window, document);
