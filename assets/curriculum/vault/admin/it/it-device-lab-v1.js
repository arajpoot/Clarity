/* Clarity University — IT Device Lab
 * Real on-device diagnostics, O&M jobs, training assignments, sandbox simulator.
 * Uses browser Storage / Cache / SW / Performance APIs only — no server.
 * Educational ops lab — not a penetration tool.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_IT_DEVICE_LAB_V1__) return;
  g.__CLARITY_IT_DEVICE_LAB_V1__ = true;

  var ASSIGN_KEY = "clarity_it_assignments_v1";
  var LAB_LOG_KEY = "clarity_it_lab_log_v1";
  var MAINT_KEY = "clarity_it_maintenance_v1";

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
    } catch (e) {
      return false;
    }
    return true;
  }
  function labLog(msg, detail) {
    var arr = lsGet(LAB_LOG_KEY, []) || [];
    arr.unshift({ at: Date.now(), msg: msg, detail: detail || null });
    if (arr.length > 40) arr = arr.slice(0, 40);
    lsSet(LAB_LOG_KEY, arr);
  }

  /* —— Real device diagnostics —— */
  function estimateLocalStorageBytes() {
    var total = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        var v = localStorage.getItem(k) || "";
        total += (k.length + v.length) * 2;
      }
    } catch (e) {}
    return total;
  }

  function storageEstimate() {
    return new Promise(function (resolve) {
      var base = {
        localStorageBytes: estimateLocalStorageBytes(),
        localStorageKeys: 0,
        quota: null,
        usage: null,
        usageDetails: null,
        persisted: null
      };
      try {
        base.localStorageKeys = localStorage.length;
      } catch (e) {}
      if (g.navigator && g.navigator.storage && g.navigator.storage.estimate) {
        g.navigator.storage
          .estimate()
          .then(function (est) {
            base.quota = est.quota || null;
            base.usage = est.usage || null;
            base.usageDetails = est.usageDetails || null;
            if (g.navigator.storage.persisted) {
              return g.navigator.storage.persisted().then(function (p) {
                base.persisted = !!p;
                resolve(base);
              });
            }
            resolve(base);
          })
          .catch(function () {
            resolve(base);
          });
      } else {
        resolve(base);
      }
    });
  }

  function cacheReport() {
    if (!g.caches || !g.caches.keys) {
      return Promise.resolve({ supported: false, caches: [] });
    }
    return g.caches.keys().then(function (names) {
      return Promise.all(
        names.map(function (name) {
          return g.caches.open(name).then(function (c) {
            return c.keys().then(function (reqs) {
              return { name: name, entries: reqs.length };
            });
          });
        })
      ).then(function (list) {
        return { supported: true, caches: list };
      });
    });
  }

  function swReport() {
    var out = {
      supported: !!(g.navigator && g.navigator.serviceWorker),
      controller: false,
      scriptURL: null
    };
    try {
      if (g.navigator.serviceWorker && g.navigator.serviceWorker.controller) {
        out.controller = true;
        out.scriptURL = g.navigator.serviceWorker.controller.scriptURL || null;
      }
    } catch (e) {}
    return out;
  }

  function performanceSnapshot() {
    var s = {
      online: typeof navigator !== "undefined" ? navigator.onLine : true,
      deviceMemory: navigator.deviceMemory || null,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      language: navigator.language || null,
      jsHeap: null,
      timing: null
    };
    try {
      if (g.performance && g.performance.memory) {
        s.jsHeap = {
          used: g.performance.memory.usedJSHeapSize,
          total: g.performance.memory.totalJSHeapSize,
          limit: g.performance.memory.jsHeapSizeLimit
        };
      }
    } catch (e) {}
    try {
      if (g.performance && g.performance.timing) {
        var t = g.performance.timing;
        s.timing = {
          domContentLoaded: t.domContentLoadedEventEnd - t.navigationStart,
          load: t.loadEventEnd - t.navigationStart
        };
      }
    } catch (e2) {}
    return s;
  }

  function vaultBridgeSnapshot() {
    return {
      vaultBoot: !!g.__CLARITY_VAULT_BOOT__,
      vaultSealed: !!g.__CLARITY_VAULT_SEALED__,
      engine: !!g.ClarityCurriculumEngine,
      controller: !!g.ClarityCurriculumController,
      plaque: !!g.__CLARITY_PHASE_PLAQUE_V1__,
      singlePlaque: !!g.__CLARITY_SINGLE_PLAQUE__,
      phase: (function () {
        try {
          return localStorage.getItem("clarity_curriculum_phase_v1") || "1";
        } catch (e) {
          return "?";
        }
      })()
    };
  }

  function fullDiagnostic() {
    return Promise.all([storageEstimate(), cacheReport()]).then(function (pair) {
      var report = {
        at: Date.now(),
        storage: pair[0],
        caches: pair[1],
        serviceWorker: swReport(),
        performance: performanceSnapshot(),
        vault: vaultBridgeSnapshot(),
        clarityKeys: listClarityKeys()
      };
      labLog("diagnostic", { keys: report.clarityKeys.length, lsBytes: report.storage.localStorageBytes });
      lsSet(MAINT_KEY, { lastDiagnostic: report, at: Date.now() });
      return report;
    });
  }

  function listClarityKeys() {
    var keys = [];
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf("clarity") === 0) keys.push(k);
      }
    } catch (e) {}
    return keys.sort();
  }

  /* —— O&M routines (real local ops) —— */
  function omTrimLogs() {
    var trimmed = [];
    var logKeys = [
      "clarity_it_bridge_log_v1",
      "clarity_it_lab_log_v1",
      "clarity_om_log_v1",
      "clarity_it_reports_v1"
    ];
    logKeys.forEach(function (k) {
      var arr = lsGet(k, []);
      if (Array.isArray(arr) && arr.length > 20) {
        lsSet(k, arr.slice(0, 20));
        trimmed.push(k);
      }
    });
    labLog("om-trim", { trimmed: trimmed });
    return { ok: true, trimmed: trimmed };
  }

  function omPurgeOldCaches(keepPrefix) {
    keepPrefix = keepPrefix || "clarity-20261009PRIORITY";
    if (!g.caches || !g.caches.keys) {
      return Promise.resolve({ ok: false, reason: "caches-api-unavailable" });
    }
    return g.caches.keys().then(function (names) {
      var removed = [];
      return Promise.all(
        names.map(function (name) {
          if (name.indexOf("clarity-") === 0 && name !== keepPrefix && name.indexOf(keepPrefix) !== 0) {
            removed.push(name);
            return g.caches.delete(name);
          }
          return Promise.resolve(false);
        })
      ).then(function () {
        labLog("om-purge-caches", { removed: removed });
        return { ok: true, removed: removed };
      });
    });
  }

  function omHealthCheck() {
    return fullDiagnostic().then(function (r) {
      var issues = [];
      if (!r.serviceWorker.supported) issues.push("Service Worker API missing");
      if (!r.serviceWorker.controller) issues.push("No active SW controller (first visit or unregistered)");
      if (r.storage.localStorageBytes > 4.5 * 1024 * 1024) issues.push("localStorage large (>" + Math.round(r.storage.localStorageBytes / 1024) + " KB)");
      if (!r.vault.engine) issues.push("Curriculum engine not loaded");
      if (!r.performance.online) issues.push("Browser reports offline");
      return { ok: issues.length === 0, issues: issues, report: r };
    });
  }

  /* —— Training assignments (on-device) —— */
  var CURRICULUM = [
    {
      id: "it-01",
      title: "Storage survey",
      brief: "Run a storage estimate and record how many clarity_* keys exist.",
      type: "diagnostic",
      action: "storage"
    },
    {
      id: "it-02",
      title: "Cache inventory",
      brief: "List Cache Storage buckets used by Clarity and count entries.",
      type: "diagnostic",
      action: "caches"
    },
    {
      id: "it-03",
      title: "Service Worker status",
      brief: "Confirm whether a SW controls this page and note its script URL.",
      type: "diagnostic",
      action: "sw"
    },
    {
      id: "it-04",
      title: "Bridge health",
      brief: "Check vault sealed flags and curriculum engine presence.",
      type: "diagnostic",
      action: "vault"
    },
    {
      id: "it-05",
      title: "O&M log trim",
      brief: "Run the log-trim routine; confirm logs stay under 20 entries.",
      type: "om",
      action: "trim"
    },
    {
      id: "it-06",
      title: "Maintenance call simulation",
      brief: "Open a maintenance call, run health check, close with notes.",
      type: "sandbox",
      action: "maint"
    }
  ];

  function getAssignments() {
    var st = lsGet(ASSIGN_KEY, null);
    if (!st || !st.items) {
      st = {
        items: CURRICULUM.map(function (c) {
          return { id: c.id, status: "open", result: null, at: null };
        })
      };
      lsSet(ASSIGN_KEY, st);
    }
    return st;
  }

  function completeAssignment(id, result) {
    var st = getAssignments();
    st.items = (st.items || []).map(function (it) {
      if (it.id === id) {
        return { id: id, status: "done", result: result || {}, at: Date.now() };
      }
      return it;
    });
    lsSet(ASSIGN_KEY, st);
    labLog("assignment-done", { id: id });
    return st;
  }

  function runAssignment(id) {
    var meta = CURRICULUM.filter(function (c) {
      return c.id === id;
    })[0];
    if (!meta) return Promise.reject(new Error("unknown assignment"));
    if (meta.action === "storage") {
      return storageEstimate().then(function (s) {
        var keys = listClarityKeys();
        var result = { localStorageBytes: s.localStorageBytes, clarityKeys: keys.length, quota: s.quota };
        completeAssignment(id, result);
        return result;
      });
    }
    if (meta.action === "caches") {
      return cacheReport().then(function (c) {
        completeAssignment(id, c);
        return c;
      });
    }
    if (meta.action === "sw") {
      var s = swReport();
      completeAssignment(id, s);
      return Promise.resolve(s);
    }
    if (meta.action === "vault") {
      var v = vaultBridgeSnapshot();
      completeAssignment(id, v);
      return Promise.resolve(v);
    }
    if (meta.action === "trim") {
      var t = omTrimLogs();
      completeAssignment(id, t);
      return Promise.resolve(t);
    }
    if (meta.action === "maint") {
      return openMaintenanceCall("Training drill").then(function (call) {
        return omHealthCheck().then(function (h) {
          closeMaintenanceCall(call.id, h.ok ? "resolved" : "needs-review", h.issues.join("; "));
          completeAssignment(id, { callId: call.id, health: h });
          return h;
        });
      });
    }
    return Promise.resolve({});
  }

  /* —— Maintenance calls —— */
  function openMaintenanceCall(reason) {
    var calls = lsGet(MAINT_KEY + "_calls", []) || [];
    var call = {
      id: "M-" + Date.now().toString(36),
      reason: reason || "Manual maintenance",
      status: "open",
      openedAt: Date.now(),
      closedAt: null,
      notes: ""
    };
    calls.unshift(call);
    if (calls.length > 20) calls = calls.slice(0, 20);
    lsSet(MAINT_KEY + "_calls", calls);
    labLog("maint-open", call);
    try {
      g.dispatchEvent(new CustomEvent("clarity-it-maintenance", { detail: call }));
    } catch (e) {}
    return Promise.resolve(call);
  }

  function closeMaintenanceCall(id, status, notes) {
    var calls = lsGet(MAINT_KEY + "_calls", []) || [];
    calls = calls.map(function (c) {
      if (c.id === id) {
        c.status = status || "closed";
        c.closedAt = Date.now();
        c.notes = notes || "";
      }
      return c;
    });
    lsSet(MAINT_KEY + "_calls", calls);
    labLog("maint-close", { id: id, status: status });
    return calls;
  }

  /* —— Sandbox UI —— */
  function ensureLabUI() {
    if (document.getElementById("clarity-it-lab-modal")) return;
    var m = document.createElement("div");
    m.id = "clarity-it-lab-modal";
    m.className = "clarity-it-lab-modal";
    m.innerHTML =
      '<div class="citlab-backdrop" data-citlab-close="1"></div>' +
      '<div class="citlab-panel" role="dialog" aria-label="IT Device Lab">' +
      '<button type="button" class="citlab-x" data-citlab-close="1" aria-label="Close">×</button>' +
      '<div class="citlab-stamp">IT DEVICE LAB</div>' +
      "<h2>On-device operations sandbox</h2>" +
      '<p class="citlab-sub">Real browser storage, caches, and service worker — training only. No server access.</p>' +
      '<div class="citlab-actions">' +
      '<button type="button" class="citlab-btn" data-citlab="diag">Run diagnostic</button>' +
      '<button type="button" class="citlab-btn" data-citlab="health">Health check</button>' +
      '<button type="button" class="citlab-btn" data-citlab="trim">Trim logs</button>' +
      '<button type="button" class="citlab-btn" data-citlab="purge">Purge old caches</button>' +
      '<button type="button" class="citlab-btn" data-citlab="maint">Open maintenance call</button>' +
      "</div>" +
      '<h3 class="citlab-h">Training assignments</h3>' +
      '<div id="citlab-assign"></div>' +
      '<h3 class="citlab-h">Last output</h3>' +
      '<pre id="citlab-out" class="citlab-out">Ready.</pre>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", function (ev) {
      var t = ev.target;
      if (t.getAttribute("data-citlab-close")) {
        m.classList.remove("show");
        return;
      }
      var act = t.getAttribute("data-citlab");
      if (act) runLabAction(act);
      var aid = t.getAttribute("data-citlab-assign");
      if (aid) {
        setOut("Running " + aid + "…");
        runAssignment(aid)
          .then(function (r) {
            setOut(JSON.stringify(r, null, 2));
            renderAssignments();
          })
          .catch(function (e) {
            setOut(String(e && e.message ? e.message : e));
          });
      }
    });
  }

  function setOut(text) {
    var el = document.getElementById("citlab-out");
    if (el) el.textContent = text;
  }

  function renderAssignments() {
    var host = document.getElementById("citlab-assign");
    if (!host) return;
    var st = getAssignments();
    var byId = {};
    (st.items || []).forEach(function (it) {
      byId[it.id] = it;
    });
    host.innerHTML = CURRICULUM.map(function (c) {
      var it = byId[c.id] || { status: "open" };
      return (
        '<div class="citlab-card' +
        (it.status === "done" ? " done" : "") +
        '">' +
        "<strong>" +
        c.title +
        "</strong>" +
        '<p class="citlab-brief">' +
        c.brief +
        "</p>" +
        '<button type="button" class="citlab-btn citlab-btn-sm" data-citlab-assign="' +
        c.id +
        '">' +
        (it.status === "done" ? "Re-run" : "Perform") +
        "</button>" +
        (it.status === "done" ? ' <span class="citlab-done">Done</span>' : "") +
        "</div>"
      );
    }).join("");
  }

  function runLabAction(act) {
    if (act === "diag") {
      setOut("Running full diagnostic…");
      return fullDiagnostic().then(function (r) {
        setOut(JSON.stringify(r, null, 2));
      });
    }
    if (act === "health") {
      setOut("Health check…");
      return omHealthCheck().then(function (h) {
        setOut(JSON.stringify(h, null, 2));
      });
    }
    if (act === "trim") {
      setOut(JSON.stringify(omTrimLogs(), null, 2));
      return;
    }
    if (act === "purge") {
      setOut("Purging old clarity caches…");
      return omPurgeOldCaches().then(function (r) {
        setOut(JSON.stringify(r, null, 2));
      });
    }
    if (act === "maint") {
      return openMaintenanceCall("Operator request").then(function (c) {
        setOut("Opened " + c.id + " — run Health check, then close via assignment it-06 or API.");
      });
    }
  }

  function openLab() {
    ensureLabUI();
    renderAssignments();
    document.getElementById("clarity-it-lab-modal").classList.add("show");
  }

  g.ClarityITLab = {
    diagnostic: fullDiagnostic,
    health: omHealthCheck,
    trimLogs: omTrimLogs,
    purgeOldCaches: omPurgeOldCaches,
    assignments: getAssignments,
    curriculum: CURRICULUM,
    runAssignment: runAssignment,
    openMaintenanceCall: openMaintenanceCall,
    closeMaintenanceCall: closeMaintenanceCall,
    openLab: openLab,
    storageEstimate: storageEstimate
  };

  /* Auto-run light health when maintenance event fires */
  g.addEventListener("clarity-it-maintenance", function () {
    omHealthCheck().then(function (h) {
      labLog("auto-health-on-maint", { ok: h.ok, issues: h.issues });
    });
  });
})(typeof window !== "undefined" ? window : this);
