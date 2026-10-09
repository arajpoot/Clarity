/* Clarity University — Security Wing · Smart Auditors
 * Continuously scan form-factor wiring (vault, curriculum, staff, faculty, lab, registrar).
 * Soft-repair pipes without touching sealed foundation files.
 * Educational runtime hygiene — not a penetration-test product.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SECURITY_WING__) return;
  g.__CLARITY_SECURITY_WING__ = true;

  var BASE = "./assets/curriculum/vault/admin/security/";
  var LOG_KEY = "clarity_security_audit_log_v1";
  var STATE_KEY = "clarity_security_state_v1";
  var map = null;
  var state = {
    scans: 0,
    repairs: 0,
    last: null,
    broken: [],
    ok: [],
    interval: null
  };

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

  function log(level, pipe, msg, detail) {
    var entry = {
      at: Date.now(),
      level: level,
      pipe: pipe || "",
      msg: msg,
      detail: detail || null
    };
    var arr = lsGet(LOG_KEY, []) || [];
    arr.unshift(entry);
    if (arr.length > 60) arr = arr.slice(0, 60);
    lsSet(LOG_KEY, arr);
    if (level === "repair" || level === "error") {
      try {
        console.info(
          "%c Security Auditor ",
          "background:#3a1010;color:#f5d0d0",
          level,
          pipe,
          msg
        );
      } catch (e) {}
    }
    return entry;
  }

  function resolveApi(path) {
    if (!path) return undefined;
    if (path.indexOf(".") >= 0) {
      var parts = path.split(".");
      var cur = g;
      for (var i = 0; i < parts.length; i++) {
        if (cur == null) return undefined;
        cur = cur[parts[i]];
      }
      return cur;
    }
    return g[path];
  }

  function checkPipe(pipe) {
    var issues = [];
    (pipe.apis || []).forEach(function (name) {
      var val = resolveApi(name);
      var missing =
        val === undefined ||
        val === null ||
        (name.indexOf("__") === 0 && val !== true && !val);
      if (name === "__CLARITY_VAULT_SEALED__") {
        if (!g.__CLARITY_VAULT_SEALED__) issues.push({ type: "api", name: name });
      } else if (val === undefined || val === null) {
        issues.push({ type: "api", name: name });
      }
    });
    if (pipe.methods) {
      Object.keys(pipe.methods).forEach(function (apiName) {
        var obj = resolveApi(apiName);
        (pipe.methods[apiName] || []).forEach(function (m) {
          if (!obj || typeof obj[m] !== "function") {
            issues.push({ type: "method", name: apiName + "." + m });
          }
        });
      });
    }
    (pipe.dom || []).forEach(function (id) {
      if (!document.getElementById(id)) issues.push({ type: "dom", name: id });
    });
    return issues;
  }

  function repairPipe(pipe, issues) {
    var did = 0;
    var max = (map && map.maxRepairsPerScan) || 4;
    if (did >= max) return 0;
    var action = pipe.repair || "none";
    if (action === "none") return 0;

    try {
      if (action === "syncTracks" && g.ClarityCurriculumController && g.ClarityCurriculumController.syncTracks) {
        g.ClarityCurriculumController.syncTracks();
        if (g.ClarityCurriculumController.applyDeepLearningOrder) {
          g.ClarityCurriculumController.applyDeepLearningOrder();
        }
        log("repair", pipe.id, "Re-synced curriculum tracks");
        did++;
      }
      if (action === "staff-health" && g.ClarityStaffOps && g.ClarityStaffOps.runHealth) {
        g.ClarityStaffOps.runHealth();
        log("repair", pipe.id, "Ops health re-run");
        did++;
      }
      if (action === "lab-render" && g.ClarityLab && g.ClarityLab.render) {
        g.ClarityLab.render();
        log("repair", pipe.id, "Lab shell re-rendered");
        did++;
      }
      if (action === "inert-ui" && g.ClarityRegistrar && g.ClarityRegistrar.applyInertUI) {
        g.ClarityRegistrar.applyInertUI();
        log("repair", pipe.id, "Registrar inert UI reapplied");
        did++;
      }
    } catch (e) {
      log("error", pipe.id, "Repair failed", String(e && e.message));
    }
    return did;
  }

  /** Event-pipe probe: are critical listeners responsive? */
  function probeEvents() {
    var issues = [];
    try {
      var heard = false;
      function once() {
        heard = true;
      }
      g.addEventListener("clarity-security-ping", once, { once: true });
      g.dispatchEvent(new CustomEvent("clarity-security-ping"));
      if (!heard) issues.push({ type: "event", name: "clarity-security-ping" });
    } catch (e) {
      issues.push({ type: "event", name: "dispatch-failed" });
    }
    return issues;
  }

  function scan() {
    state.scans += 1;
    var pipes = (map && map.pipelines) || [];
    var broken = [];
    var ok = [];
    var repairCount = 0;

    pipes.forEach(function (pipe) {
      var issues = checkPipe(pipe);
      if (issues.length) {
        broken.push({ id: pipe.id, label: pipe.label, issues: issues });
        repairCount += repairPipe(pipe, issues);
        log("warn", pipe.id, "Wiring issues", issues);
      } else {
        ok.push(pipe.id);
      }
    });

    var evIssues = probeEvents();
    if (evIssues.length) {
      broken.push({ id: "events", label: "Event bus", issues: evIssues });
    }

    /* Re-check after repairs */
    if (repairCount) {
      state.repairs += repairCount;
      pipes.forEach(function (pipe) {
        if ((pipe.repair || "none") === "none") return;
        var issues = checkPipe(pipe);
        if (!issues.length) {
          log("repair", pipe.id, "Pipe healthy after rewire");
        }
      });
    }

    state.broken = broken;
    state.ok = ok;
    state.last = Date.now();
    lsSet(STATE_KEY, {
      scans: state.scans,
      repairs: state.repairs,
      last: state.last,
      broken: broken.map(function (b) {
        return b.id;
      }),
      okCount: ok.length
    });

    try {
      g.dispatchEvent(
        new CustomEvent("clarity-security-scan", {
          detail: { broken: broken, ok: ok, repairs: repairCount, scans: state.scans }
        })
      );
    } catch (e) {}

    updateBadge();
    return { broken: broken, ok: ok, repairs: repairCount };
  }

  function updateBadge() {
    var el = document.getElementById("clarity-security-badge");
    if (!el) return;
    var n = (state.broken || []).length;
    el.textContent = n ? "🔐 Audit " + n : "🔐 Secure";
    el.classList.toggle("sec-warn", n > 0);
    el.title =
      "Security wing · scans " +
      state.scans +
      " · repairs " +
      state.repairs +
      " · open issues " +
      n;
  }

  function injectBadge() {
    if (document.getElementById("clarity-security-badge")) return;
    var el = document.createElement("button");
    el.type = "button";
    el.id = "clarity-security-badge";
    el.className = "clarity-security-badge";
    el.textContent = "🔐 Secure";
    el.onclick = openDesk;
    document.body.appendChild(el);
  }

  function injectDoor() {
    if (document.getElementById("cnp-sec-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-sec-btn";
    btn.className = "cnp-hall-btn cnp-sec-btn";
    btn.textContent = "Security";
    btn.title = "Security wing auditors";
    btn.onclick = openDesk;
    host.appendChild(btn);
  }

  function openDesk() {
    var m = document.getElementById("clarity-security-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-security-modal";
      m.className = "clarity-security-modal";
      m.hidden = true;
      m.innerHTML =
        '<div class="csm-backdrop" data-csm-close="1"></div>' +
        '<div class="csm-panel">' +
        '<button type="button" class="csm-x" data-csm-close="1">×</button>' +
        '<div class="csm-stamp">SECURITY</div>' +
        "<h2>Auditor desk</h2>" +
        '<p class="csm-lead">Continuous form-factor scan. Soft rewiring only — sealed foundation stays untouched.</p>' +
        '<div id="csm-body"></div>' +
        '<div class="csm-actions">' +
        '<button type="button" class="cdm-btn" id="csm-scan">Scan now</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="csm-log">Recent log</button>' +
        "</div></div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-csm-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("csm-scan").onclick = function () {
        scan();
        renderBody();
      };
      document.getElementById("csm-log").onclick = function () {
        var arr = lsGet(LOG_KEY, []) || [];
        var lines = arr.slice(0, 12).map(function (e) {
          return (
            new Date(e.at).toLocaleTimeString() +
            " · " +
            e.level +
            " · " +
            (e.pipe || "") +
            " · " +
            e.msg
          );
        });
        alert(lines.length ? lines.join("\n") : "No audit log yet.");
      };
    }
    renderBody();
    m.hidden = false;
    m.classList.add("show");
  }

  function renderBody() {
    var body = document.getElementById("csm-body");
    if (!body) return;
    var html =
      "<p><b>Scans:</b> " +
      state.scans +
      " · <b>Repairs:</b> " +
      state.repairs +
      " · <b>Open breaks:</b> " +
      (state.broken || []).length +
      "</p>";
    if (state.broken && state.broken.length) {
      html += '<ul class="csm-breaks">';
      state.broken.forEach(function (b) {
        html +=
          "<li><b>" +
          (b.label || b.id) +
          "</b> — " +
          (b.issues || [])
            .map(function (i) {
              return i.type + ":" + i.name;
            })
            .join(", ") +
          "</li>";
      });
      html += "</ul>";
    } else {
      html += '<p class="csm-ok">All mapped pipes reporting green.</p>';
    }
    html +=
      '<p class="csm-foot">Auditors: Wire Sentinel · Pipe Fitter · Event Watch. Foundation seal is never rewritten.</p>';
    body.innerHTML = html;
  }

  g.ClaritySecurity = {
    scan: scan,
    openDesk: openDesk,
    state: function () {
      return state;
    },
    log: function () {
      return lsGet(LOG_KEY, []);
    }
  };

  function startLoop() {
    injectBadge();
    injectDoor();
    scan();
    var ms = (map && map.scanIntervalMs) || 30000;
    if (state.interval) clearInterval(state.interval);
    state.interval = setInterval(scan, ms);
    try {
      console.info(
        "%c Security Wing ",
        "background:#3a1010;color:#f5d0d0",
        "Auditors on duty · interval " + ms + "ms"
      );
    } catch (e) {}
  }

  function boot() {
    fetch(BASE + "wiring-map.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        map = j;
        startLoop();
      })
      .catch(function () {
        map = { pipelines: [], scanIntervalMs: 30000, maxRepairsPerScan: 3 };
        startLoop();
      });
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 900);
  });
  g.addEventListener("clarity-staff-ready", function () {
    setTimeout(function () {
      if (state.scans) scan();
    }, 500);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 2800);
    });
  } else setTimeout(boot, 2800);
})(typeof window !== "undefined" ? window : this);
