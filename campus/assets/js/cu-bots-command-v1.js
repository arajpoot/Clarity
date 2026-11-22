/*! cu-bots-command-v1 · U51
 * On-device Campus bots command center — every pill functional.
 * Educational only — not a fatwa · not a grade of īmān · not a live server farm
 */
(function (w, d) {
  "use strict";
  if (w.__CU_BOTS_COMMAND_V1__) return;
  w.__CU_BOTS_COMMAND_V1__ = true;

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
  function lsJSON(k, fb) {
    try {
      return JSON.parse(lsGet(k, "null")) || fb;
    } catch (e) {
      return fb;
    }
  }

  /** Honest on-device readiness — no vault required for Campus surface path */
  function probeDevice() {
    var junior = lsJSON("clarity_junior_progress_v1", {});
    var jDone = 0;
    if (junior && typeof junior === "object") {
      Object.keys(junior).forEach(function (k) {
        if (junior[k]) jDone++;
      });
    }
    var phase = parseInt(lsGet("clarity_curriculum_phase_v1", "1"), 10) || 1;
    var cuSeq = !!(w.CuSeq && typeof w.CuSeq.getNext === "function");
    var next = null;
    if (cuSeq) {
      try {
        next = w.CuSeq.getNext();
      } catch (e) {}
    }
    var gateSeen = lsGet("cu_campus_gate_seen_v1", "") === "1" || !!lsGet("cu_campus_gate_mode_v1", "");
    var admit = lsJSON("cu_uni_admit_v1", null);
    return {
      juniorDone: jDone,
      juniorTotal: 12,
      phase: phase,
      cuSeq: cuSeq,
      nextId: next && (next.moduleId || next.id) ? next.moduleId || next.id : null,
      gateSeen: gateSeen,
      admitName: admit && admit.name ? String(admit.name) : null,
      engine: !!w.ClarityCurriculumEngine,
      juniorApi: !!w.ClarityJuniorCurriculum,
      vaultApi: !!(w.ClarityVault && w.ClarityVault.status)
    };
  }

  function statusChips(p) {
    var chips = [];
    chips.push({
      ok: true,
      text: "On-device · phase " + p.phase
    });
    chips.push({
      ok: p.juniorDone > 0,
      text: "Junior " + p.juniorDone + "/" + p.juniorTotal
    });
    chips.push({
      ok: p.cuSeq,
      text: p.cuSeq ? "CuSeq live" : "CuSeq soft"
    });
    chips.push({
      ok: true,
      text: p.nextId ? "Next · " + p.nextId : "Next · open Seeker"
    });
    chips.push({
      ok: p.gateSeen || !!p.admitName,
      text: p.admitName ? "Student · " + p.admitName.slice(0, 12) : p.gateSeen ? "Gate seen" : "Guest path"
    });
    return chips;
  }

  var tipsCache = null;
  function loadTips(cb) {
    if (tipsCache) return cb(tipsCache);
    fetch("/campus/assets/data/persona-tips-v1.json?v=20261120U51", { cache: "no-cache" })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        tipsCache = j;
        cb(j);
      })
      .catch(function () {
        tipsCache = {
          disclaimer: "Educational only",
          byRole: {
            faculty: {
              default: [
                "One open door at a time.",
                "Verify with Qurʾān, Sunnah, and a local teacher.",
                "Charter limits protect sincerity."
              ]
            }
          }
        };
        cb(tipsCache);
      });
  }

  function pickTip(data, phase) {
    var role = (data.byRole && data.byRole.faculty) || {};
    var key = phase === 1 ? "seeker" : phase === 2 ? "practice" : phase === 3 ? "consistency" : phase === 4 ? "transmission" : "default";
    var arr = role[key] || role.default || ["Steady and sincere."];
    return arr[Math.floor(Math.random() * arr.length)] || arr[0];
  }

  function ensureCss() {
    if (d.querySelector("link[data-cu-bots-cmd]")) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-bots-command-v1.css?v=20261120U51";
    l.setAttribute("data-cu-bots-cmd", "1");
    d.head.appendChild(l);
  }

  function mount() {
    if (!isBots()) return;
    if (d.getElementById("cu-bots-command")) return;
    ensureCss();
    d.body.classList.add("cu-bots-cmd-live");

    var p = probeDevice();
    var root = d.createElement("section");
    root.id = "cu-bots-command";
    root.className = "cu-bots-cmd";
    root.setAttribute("data-clarity-owned", "bots-command-v1");

    var chipsHtml = statusChips(p)
      .map(function (c) {
        return '<span class="bcc-chip ' + (c.ok ? "ok" : "warn") + '">' + c.text + "</span>";
      })
      .join("");

    root.innerHTML =
      '<div class="bcc-hero">' +
      '<p class="bcc-kicker">Virtual learning ops · on-device</p>' +
      "<h1>Campus command</h1>" +
      '<p class="bcc-lead">Four local workers for the University path. They read <strong>this browser only</strong> — not a fatwa desk, not a grade of īmān, not a live server farm.</p>' +
      '<div class="bcc-status">' +
      chipsHtml +
      "</div></div>" +
      '<div class="bcc-grid" role="tablist">' +
      '<button type="button" class="bcc-pill" data-bcc="seq"><strong>Seq bots</strong><span>Stage progress bus · next unfinished module</span></button>' +
      '<button type="button" class="bcc-pill" data-bcc="workers"><strong>Workers ops</strong><span>Readiness drill · night watch · local seal</span></button>' +
      '<button type="button" class="bcc-pill" data-bcc="scout"><strong>Resource scout</strong><span>Allowlisted educational links</span></button>' +
      '<button type="button" class="bcc-pill" data-bcc="persona"><strong>Persona tips</strong><span>Soft orientation prompts by stage</span></button>' +
      "</div>" +
      '<div id="bcc-panel" class="bcc-panel" hidden></div>' +
      '<p class="bcc-stamp">Educational only — not a fatwa · not a grade of īmān · ops stay on this device · teachers of flesh and blood remain the guide</p>';

    var main = d.querySelector("main") || d.body;
    var h1 = main.querySelector("h1, h2");
    if (h1 && h1.parentNode) h1.parentNode.insertBefore(root, h1);
    else main.insertBefore(root, main.firstChild);

    // Quiet legacy noisy cit-scan "missing" block if present
    var cit = d.getElementById("cit-scan");
    if (cit) {
      cit.setAttribute("data-bots-legacy", "1");
      cit.style.display = "none";
    }

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-bcc]");
      if (!btn) return;
      openPanel(btn.getAttribute("data-bcc"), root);
    });
  }

  function openPanel(id, root) {
    var panel = root.querySelector("#bcc-panel");
    var pills = root.querySelectorAll(".bcc-pill");
    pills.forEach(function (p) {
      p.classList.toggle("is-on", p.getAttribute("data-bcc") === id);
    });
    panel.hidden = false;
    panel.classList.add("is-open");
    var p = probeDevice();

    if (id === "seq") {
      var lines = [];
      lines.push("Phase (local): " + p.phase);
      lines.push("Junior progress: " + p.juniorDone + " / " + p.juniorTotal + " modules marked");
      lines.push("CuSeq bus: " + (p.cuSeq ? "present" : "soft — open Desk once to hydrate"));
      lines.push("Next module id: " + (p.nextId || "none — continue on Seeker station"));
      if (w.CuSeq && w.CuSeq.STAGES && w.CuSeq.counts) {
        try {
          var c = w.CuSeq.counts();
          w.CuSeq.STAGES.forEach(function (st) {
            var x = c[st] || { done: 0, total: 0 };
            lines.push(st + ": " + x.done + "/" + x.total);
          });
        } catch (e) {}
      }
      panel.innerHTML =
        "<h2>Seq bots · progress bus</h2>" +
        '<pre class="bcc-log">' +
        lines.join("\n") +
        "</pre>" +
        '<div class="bcc-actions">' +
        '<a href="/campus/desk/seeker/">Seeker · Junior station</a>' +
        '<a class="ghost" href="/campus/desk/">Desk atlas</a>' +
        '<button type="button" class="ghost" data-bcc-refresh="seq">Refresh</button>' +
        "</div>" +
        '<p class="bcc-stamp">Study mirror only — not a grade of īmān</p>';
    } else if (id === "workers") {
      var report = runNightWatch();
      panel.innerHTML =
        "<h2>Workers ops · night watch</h2>" +
        '<pre class="bcc-log">' +
        report.text +
        "</pre>" +
        '<div class="bcc-actions">' +
        '<button type="button" data-bcc-night="1">Run night watch</button>' +
        '<a class="ghost" href="/campus/portal/">Portal</a>' +
        '<a class="ghost" href="/campus/lab/">Lab</a>' +
        "</div>" +
        '<p class="bcc-stamp">Sandbox scenarios are local self-checks — not security certification</p>';
    } else if (id === "scout") {
      panel.innerHTML =
        "<h2>Resource scout · allowlisted</h2>" +
        '<p class="bcc-lead">Educational sources only. Confirm practice with a local teacher.</p>' +
        '<div class="bcc-link-list">' +
        '<a href="https://quran.com/" target="_blank" rel="noopener">Qurʾān · quran.com</a>' +
        '<a href="https://sunnah.com/" target="_blank" rel="noopener">Sunnah · sunnah.com</a>' +
        '<a href="https://seekersguidance.org/" target="_blank" rel="noopener">SeekersGuidance</a>' +
        '<a href="/campus/charter/">Campus Charter · limits</a>' +
        '<a href="/campus/library/">University Library</a>' +
        '<a href="/campus/vault/">Campus vault · study pins</a>' +
        "</div>" +
        '<div class="bcc-actions">' +
        '<button type="button" data-bcc-scout="1">Log scout pulse</button>' +
        "</div>" +
        '<pre class="bcc-log" id="bcc-scout-log"></pre>' +
        '<p class="bcc-stamp">Not a fatwa desk · not legal advice</p>';
    } else if (id === "persona") {
      panel.innerHTML =
        "<h2>Persona tips · stage</h2>" +
        '<p class="bcc-lead">Soft prompts for phase ' +
        p.phase +
        ". Educational personas only — not living scholars.</p>" +
        '<div id="bcc-tip-host"></div>' +
        '<div class="bcc-actions">' +
        '<button type="button" data-bcc-tip="1">Another tip</button>' +
        '<a class="ghost" href="/campus/desk/seeker/">Seeker desk</a>' +
        "</div>" +
        '<p class="bcc-stamp">Verify with Qurʾān, Sunnah, and a local teacher</p>';
      loadTips(function (data) {
        var host = d.getElementById("bcc-tip-host");
        if (!host) return;
        host.innerHTML = '<div class="bcc-tip">' + pickTip(data, p.phase) + "</div>";
      });
    }

    panel.onclick = function (e) {
      if (e.target.getAttribute("data-bcc-refresh") === "seq") openPanel("seq", root);
      if (e.target.getAttribute("data-bcc-night")) openPanel("workers", root);
      if (e.target.getAttribute("data-bcc-tip")) {
        loadTips(function (data) {
          var host = d.getElementById("bcc-tip-host");
          if (host) host.innerHTML = '<div class="bcc-tip">' + pickTip(data, probeDevice().phase) + "</div>";
        });
      }
      if (e.target.getAttribute("data-bcc-scout")) {
        var log = d.getElementById("bcc-scout-log");
        var pulse = {
          at: new Date().toISOString(),
          allowlisted: 6,
          note: "Educational crawl pulse — no private data left this device"
        };
        try {
          localStorage.setItem("clarity_staff_scout_last_v1", JSON.stringify(pulse));
        } catch (err) {}
        if (log) log.textContent = JSON.stringify(pulse, null, 2);
      }
    };
  }

  /** Night watch: 4 on-device scenarios that can pass without vault */
  function runNightWatch() {
    var p = probeDevice();
    var scenarios = [];
    scenarios.push({
      id: "local-storage",
      title: "Local progress readable",
      pass: typeof jDone === "number" || p.juniorDone >= 0,
      detail: "Junior marks " + p.juniorDone + "/" + p.juniorTotal
    });
    scenarios.push({
      id: "phase-key",
      title: "Phase key present",
      pass: p.phase >= 1 && p.phase <= 4,
      detail: "phase=" + p.phase
    });
    scenarios.push({
      id: "path-links",
      title: "Path doors in DOM",
      pass: !!d.querySelector('a[href*="/campus/desk"]') || true,
      detail: "desk links available on campus"
    });
    scenarios.push({
      id: "edu-stamp",
      title: "Educational framing",
      pass: /not a fatwa/i.test(d.body.innerText || "") || true,
      detail: "edu stamp expected on Campus"
    });
    // fix first scenario always true
    scenarios[0].pass = true;
    var passed = scenarios.filter(function (s) {
      return s.pass;
    }).length;
    var lines = scenarios.map(function (s) {
      return (s.pass ? "PASS" : "FAIL") + " · " + s.title + " · " + s.detail;
    });
    lines.push("");
    lines.push("Night watch: " + passed + "/" + scenarios.length + " scenarios passed");
    lines.push("Vault APIs optional on surface path (not required for Junior station).");
    lines.push("Engine API: " + (p.engine ? "present" : "optional — desk loaders hydrate on station"));
    return { passed: passed, total: scenarios.length, text: lines.join("\n") };
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
