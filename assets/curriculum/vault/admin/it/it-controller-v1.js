/* Clarity University — IT Wing
 * CIO: bridge sealed vault ↔ upgradable form factor.
 * O&M as line crew; Security/Staff reports ingested; safe repair & upgrade queue.
 * Educational runtime ops — does not rewrite foundation SEAL.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_IT_WING__) return;
  g.__CLARITY_IT_WING__ = true;

  var BASE = "./assets/curriculum/vault/admin/it/";
  var LOG_KEY = "clarity_it_bridge_log_v1";
  var QUEUE_KEY = "clarity_it_upgrade_queue_v1";
  var REPORT_KEY = "clarity_it_reports_v1";
  var roster = null;
  var queueTpl = null;
  var state = {
    scans: 0,
    bridgeOk: true,
    upgradesRun: 0,
    reports: 0,
    last: null
  };
  var timer = null;

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

  function log(level, msg, detail) {
    var entry = { at: Date.now(), level: level, msg: msg, detail: detail || null };
    var arr = lsGet(LOG_KEY, []) || [];
    arr.unshift(entry);
    if (arr.length > 50) arr = arr.slice(0, 50);
    lsSet(LOG_KEY, arr);
    if (level === "upgrade" || level === "warn") {
      try {
        console.info("%c IT Wing ", "background:#0a2a40;color:#a8d4f0", level, msg);
      } catch (e) {}
    }
    return entry;
  }

  function director() {
    return (roster && roster.director) || null;
  }

  /** Bridge health: sealed APIs present + upgradable wings respond */
  function scanBridge() {
    state.scans += 1;
    state.last = Date.now();
    var sealedOk =
      !!g.__CLARITY_VAULT_SEALED__ ||
      !!(g.ClarityVault && g.ClarityVault.status);
    var foundation = {
      engine: !!g.ClarityCurriculumEngine,
      controller: !!g.ClarityCurriculumController,
      university: !!g.ClarityUniversity
    };
    var edge = {
      om: !!g.ClarityOM,
      security: !!g.ClaritySecurity,
      registrar: !!g.ClarityRegistrar,
      faculty: !!g.ClarityFaculty,
      lab: !!g.ClarityLab,
      ux: !!g.ClarityUX,
      chancellor: !!g.ClarityChancellor
    };
    var sealedMissing = Object.keys(foundation).filter(function (k) {
      return !foundation[k];
    });
    var edgeMissing = Object.keys(edge).filter(function (k) {
      return !edge[k];
    });
    state.bridgeOk = sealedOk && sealedMissing.length === 0;

    var report = {
      at: Date.now(),
      sealedOk: sealedOk,
      foundation: foundation,
      edge: edge,
      sealedMissing: sealedMissing,
      edgeMissing: edgeMissing,
      bridgeOk: state.bridgeOk
    };

    /* Ingest staff reports */
    var ingested = ingestStaffReports();
    report.ingested = ingested;

    /* Soft repairs on edge only */
    var repairs = softRepair(edge, edgeMissing);
    report.repairs = repairs;

    /* Run upgrade queue items that are safe */
    var up = runUpgradeQueue();
    report.upgrades = up;

    state.reports += 1;
    var reps = lsGet(REPORT_KEY, []) || [];
    reps.unshift(report);
    if (reps.length > 15) reps = reps.slice(0, 15);
    lsSet(REPORT_KEY, reps);

    log(
      state.bridgeOk ? "ok" : "warn",
      state.bridgeOk ? "Bridge nominal" : "Bridge soft-degraded",
      { sealedMissing: sealedMissing, edgeMissing: edgeMissing, repairs: repairs.length }
    );

    try {
      if (g.ClarityITLab && g.ClarityITLab.health) {
        g.ClarityITLab.health().then(function (h) {
          report.deviceHealth = { ok: h.ok, issues: h.issues };
          if (!h.ok) state.bridgeOk = false;
          updateBadge();
        });
      }
    } catch (eH) {}
    updateBadge();
    try {
      g.dispatchEvent(new CustomEvent("clarity-it-scan", { detail: report }));
    } catch (e) {}
    return report;
  }

  function ingestStaffReports() {
    var notes = [];
    try {
      if (g.ClaritySecurity && g.ClaritySecurity.state) {
        var s = g.ClaritySecurity.state();
        if (s.broken && s.broken.length) {
          notes.push({ from: "security", n: s.broken.length, kind: "broken-pipes" });
        }
      }
    } catch (e) {}
    try {
      if (g.ClarityStaffOps && g.ClarityStaffOps.state) {
        var o = g.ClarityStaffOps.state();
        if (o.warn) notes.push({ from: "ops", n: o.warn, kind: "ops-warn" });
      }
    } catch (e2) {}
    try {
      if (g.ClarityOM && g.ClarityOM.stats) {
        var om = g.ClarityOM.stats();
        notes.push({ from: "om", pulses: om.pulses, cleans: om.cleans, kind: "om-stats" });
      }
    } catch (e3) {}
    try {
      if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.latestIssue) {
        var issue = g.ClarityStaffLibrarian.latestIssue();
        if (issue) notes.push({ from: "librarian", id: issue.id, kind: "rotation" });
      }
    } catch (e4) {}
    return notes;
  }

  function softRepair(edge, missing) {
    var done = [];
    missing = missing || [];
    try {
      if (missing.indexOf("om") < 0 && g.ClarityOM && g.ClarityOM.pulse) {
        /* periodic alignment only when security warns */
        var badge = document.getElementById("clarity-security-badge");
        if (badge && badge.classList.contains("sec-warn") && g.ClarityOM.clean) {
          g.ClarityOM.clean();
          done.push("om-clean");
        }
      }
    } catch (e) {}
    try {
      if (g.ClarityUX && g.ClarityUX.applyDensity) {
        g.ClarityUX.applyDensity();
        done.push("ux-density");
      }
    } catch (e2) {}
    try {
      if (g.ClarityRegistrar && g.ClarityRegistrar.applyInertUI) {
        g.ClarityRegistrar.applyInertUI();
        done.push("registrar-inert");
      }
    } catch (e3) {}
    try {
      if (g.ClarityLab && !document.getElementById("clarity-lab-shell") && g.ClarityLab.render) {
        g.ClarityLab.render();
        done.push("lab-render");
      }
    } catch (e4) {}
    try {
      if (g.ClaritySecurity && g.ClaritySecurity.scan && missing.indexOf("security") < 0) {
        /* don't recurse heavy — only if bridge degraded */
        if (!state.bridgeOk) g.ClaritySecurity.scan();
      }
    } catch (e5) {}
    if (done.length) log("upgrade", "Soft edge repair", done);
    return done;
  }

  function getQueue() {
    var q = lsGet(QUEUE_KEY, null);
    if (q && q.pending) return q;
    return queueTpl || { pending: [] };
  }

  function runUpgradeQueue() {
    var q = getQueue();
    var ran = [];
    (q.pending || []).slice().forEach(function (item) {
      if (!item || item.layer === "sealed") return; /* never auto-upgrade sealed */
      var ok = false;
      try {
        if (item.action === "ux-density" && g.ClarityUX && g.ClarityUX.applyDensity) {
          g.ClarityUX.applyDensity();
          ok = true;
        } else if (item.action === "om-pulse" && g.ClarityOM && g.ClarityOM.pulse) {
          g.ClarityOM.pulse();
          ok = true;
        } else if (item.action === "sec-ingest") {
          ingestStaffReports();
          ok = true;
        }
      } catch (e) {}
      if (ok) {
        ran.push(item.id);
        state.upgradesRun += 1;
        item.lastRun = Date.now();
      }
    });
    lsSet(QUEUE_KEY, q);
    if (ran.length) log("upgrade", "Queue applied", ran);
    return ran;
  }

  /** Explicit safe UI improvement pass */
  function improveUI() {
    var steps = [];
    try {
      if (g.ClarityUX && g.ClarityUX.applyDensity) {
        g.ClarityUX.applyDensity();
        steps.push("density");
      }
    } catch (e) {}
    try {
      if (g.ClarityOM && g.ClarityOM.clean) {
        g.ClarityOM.clean();
        steps.push("dom-storage-clean");
      }
    } catch (e2) {}
    try {
      document.querySelectorAll(".junior-lesson.is-current").forEach(function (el) {
        el.classList.add("it-focus-ring");
        setTimeout(function () {
          el.classList.remove("it-focus-ring");
        }, 2000);
      });
      steps.push("focus-ring");
    } catch (e3) {}
    log("upgrade", "UI improvement pass", steps);
    toast("UI pass complete · " + steps.join(", "));
    return steps;
  }

  function toast(msg) {
    var d = director();
    var el = document.getElementById("clarity-it-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-it-toast";
      el.className = "clarity-it-toast";
      document.body.appendChild(el);
    }
    el.innerHTML =
      (d ? '<span class="cit-name">' + escape(d.name) + "</span> " : "") + escape(msg);
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 3800);
  }
  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function updateBadge() {
    var el = document.getElementById("clarity-it-badge");
    if (!el) return;
    el.textContent = state.bridgeOk ? "🖧 IT" : "🖧 Bridge";
    el.classList.toggle("it-warn", !state.bridgeOk);
    el.title =
      "IT Wing · scans " +
      state.scans +
      " · upgrades " +
      state.upgradesRun +
      " · bridge " +
      (state.bridgeOk ? "OK" : "check");
  }

  function injectBadge() {
    if (document.getElementById("clarity-it-badge")) return;
    var el = document.createElement("button");
    el.type = "button";
    el.id = "clarity-it-badge";
    el.className = "clarity-it-badge";
    el.textContent = "🖧 IT";
    el.onclick = openDesk;
    document.body.appendChild(el);
  }

  function injectDoor() {
    if (document.getElementById("cnp-it-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-it-btn";
    btn.className = "cnp-hall-btn cnp-it-btn";
    btn.textContent = "IT";
    btn.title = "IT Wing · CIO bridge";
    btn.onclick = openDesk;
    host.appendChild(btn);
  }

  function openDesk() {
    var d = director();
    var m = document.getElementById("clarity-it-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-it-modal";
      m.className = "clarity-it-modal";
      m.hidden = true;
      m.innerHTML =
        '<div class="cit-backdrop" data-cit-close="1"></div>' +
        '<div class="cit-panel">' +
        '<button type="button" class="cit-x" data-cit-close="1">×</button>' +
        '<div class="cit-stamp">IT WING</div>' +
        '<div id="cit-body"></div>' +
        '<div class="cit-actions">' +
        '<button type="button" class="cdm-btn" id="cit-scan">Scan bridge</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cit-ui">Improve UI</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cit-om">Dispatch O&M</button>' +
        "</div></div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-cit-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("cit-scan").onclick = function () {
        scanBridge();
        renderBody();
      };
      document.getElementById("cit-ui").onclick = function () {
        improveUI();
        renderBody();
      };
      document.getElementById("cit-om").onclick = function () {
        if (g.ClarityOM && g.ClarityOM.pulse) g.ClarityOM.pulse();
        if (g.ClarityOM && g.ClarityOM.clean) g.ClarityOM.clean();
        toast("O&M line crew dispatched");
        log("upgrade", "O&M dispatched by CIO");
        renderBody();
      };
    }
    renderBody();
    m.hidden = false;
    m.classList.add("show");
  }

  function renderBody() {
    var body = document.getElementById("cit-body");
    if (!body) return;
    var d = director();
    var last = (lsGet(REPORT_KEY, []) || [])[0];
    var crew = (roster && roster.lineCrew) || [];
    body.innerHTML =
      "<h2>" +
      escape((d && d.name) || "CIO") +
      "</h2>" +
      '<p class="cit-title">' +
      escape((d && d.title) || "IT Wing") +
      " · <code>" +
      escape((d && d.seal) || "") +
      "</code></p>" +
      '<p class="cit-greet">' +
      escape((d && d.greeting) || "") +
      "</p>" +
      '<div class="cit-bridge ' +
      (state.bridgeOk ? "ok" : "warn") +
      '">' +
      "<b>Bridge:</b> " +
      (state.bridgeOk ? "Nominal" : "Soft-degraded") +
      " · scans " +
      state.scans +
      " · upgrades " +
      state.upgradesRun +
      "</div>" +
      (last
        ? "<p class=\"cit-meta\">Last report · sealed gaps: " +
          (last.sealedMissing || []).join(", ") +
          " · edge gaps: " +
          (last.edgeMissing || []).join(", ") +
          "</p>"
        : "") +
      "<h3>Line crew</h3><ul class=\"cit-crew\">" +
      crew
        .map(function (c) {
          return (
            "<li><b>" +
            escape(c.unit) +
            "</b> — " +
            escape(c.role) +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      '<p class="cit-rule">' +
      escape((roster && roster.bridgeMap && roster.bridgeMap.rule) || "") +
      "</p>" +
      '<p class="cit-disc">' +
      escape((roster && roster.disclaimer) || "") +
      "</p>";
  }

  /* Register O&M under IT command metaphorically — listen om events */
  g.addEventListener("clarity-om-pulse", function () {
    /* circulation acknowledged */
  });
  g.addEventListener("clarity-security-scan", function (ev) {
    if (ev.detail && ev.detail.broken && ev.detail.broken.length) {
      log("warn", "Security report ingested", { n: ev.detail.broken.length });
    }
  });

  g.ClarityIT = {
    scanBridge: scanBridge,
    improveUI: improveUI,
    openDesk: openDesk,
    state: function () {
      return state;
    },
    log: function () {
      return lsGet(LOG_KEY, []);
    },
    reports: function () {
      return lsGet(REPORT_KEY, []);
    }
  };

  function boot() {
    Promise.all([
      fetch(BASE + "it-roster.json").then(function (r) {
        return r.json();
      }),
      fetch(BASE + "upgrade-queue.json")
        .then(function (r) {
          return r.json();
        })
        .catch(function () {
          return { pending: [] };
        })
    ])
      .then(function (arr) {
        roster = arr[0];
        queueTpl = arr[1];
        if (!lsGet(QUEUE_KEY, null) && queueTpl) lsSet(QUEUE_KEY, queueTpl);
        injectBadge();
        injectDoor();
        scanBridge();
        var ms = (roster && roster.scanIntervalMs) || 40000;
        if (timer) clearInterval(timer);
        timer = setInterval(scanBridge, ms);
        try {
          console.info(
            "%c IT Wing ",
            "background:#0a2a40;color:#a8d4f0",
            (roster.director && roster.director.name) || "CIO",
            "· bridge online"
          );
        } catch (e) {}
      })
      .catch(function () {
        roster = { director: { name: "CIO", title: "IT Wing", seal: "IT" } };
        injectBadge();
        injectDoor();
        scanBridge();
      });
  }

  function openDeviceLab() {
    try {
      if (g.ClarityITLab && g.ClarityITLab.openLab) return g.ClarityITLab.openLab();
    } catch (e) {}
    try {
      var s = document.createElement("script");
      s.src = BASE + "it-device-lab-v1.js?v=20261009ITLAB";
      s.onload = function () {
        if (g.ClarityITLab) g.ClarityITLab.openLab();
      };
      document.head.appendChild(s);
    } catch (e2) {}
  }
  g.clarityOpenITLab = openDeviceLab;

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 1600);
  });
  g.addEventListener("clarity-om-liaison", function () {
    if (state.scans && state.scans % 2 === 0) return;
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 4000);
    });
  } else setTimeout(boot, 4000);
})(typeof window !== "undefined" ? window : this);
