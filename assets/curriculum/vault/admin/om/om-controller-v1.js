/* Clarity University — O&M Crew
 * Operations & Maintenance: the bloodstream of the form factor.
 * Circulate events, clean DOM debris, trim logs, liaise with wings.
 * Never mutate sealed foundation. Educational runtime care only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_OM_CREW__) return;
  g.__CLARITY_OM_CREW__ = true;

  var BASE = "./assets/curriculum/vault/admin/om/";
  var LOG_KEY = "clarity_om_log_v1";
  var STATS_KEY = "clarity_om_stats_v1";
  var roster = null;
  var stats = {
    pulses: 0,
    cleans: 0,
    trims: 0,
    liaisons: 0,
    last: null
  };
  var timers = [];

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

  function omLog(who, msg) {
    var entry = { at: Date.now(), who: who, msg: msg };
    var arr = lsGet(LOG_KEY, []) || [];
    arr.unshift(entry);
    if (arr.length > 40) arr = arr.slice(0, 40);
    lsSet(LOG_KEY, arr);
  }

  function persistStats() {
    stats.last = Date.now();
    lsSet(STATS_KEY, stats);
  }

  /** 🩸 Circulation — phase + path attributes + soft events */
  function jobCirculation() {
    stats.pulses += 1;
    try {
      var phase = localStorage.getItem("clarity_curriculum_phase_v1") || "1";
      document.documentElement.setAttribute("data-curriculum-phase", phase);
      document.documentElement.setAttribute("data-phase-active", phase);
    } catch (e) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-om-pulse", { detail: { at: Date.now() } }));
    } catch (e2) {}
    if (g.ClarityRegistrar && g.ClarityRegistrar.applyInertUI) {
      try {
        g.ClarityRegistrar.applyInertUI();
      } catch (e3) {}
    }
    if (stats.pulses % 5 === 0) omLog("circulation", "Pulse " + stats.pulses);
    persistStats();
  }

  /** 🧊 Cache Orderly — light SW ping, no aggressive wipe */
  
  /** Device storage orderly — real localStorage byte estimate */
  function jobDeviceStorage() {
    try {
      var bytes = 0;
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        var v = localStorage.getItem(k) || "";
        bytes += (k.length + v.length) * 2;
      }
      omLog("storage", "localStorage ~" + Math.round(bytes / 1024) + " KB, keys " + localStorage.length);
      if (bytes > 4.5 * 1024 * 1024 && g.ClarityITLab && g.ClarityITLab.trimLogs) {
        g.ClarityITLab.trimLogs();
        omLog("storage", "Triggered IT lab log trim (large localStorage)");
      }
    } catch (e) {
      omLog("storage", "estimate failed");
    }
    persistStats();
  }

  function jobCache() {
    try {
      if (g.navigator && g.navigator.serviceWorker && g.navigator.serviceWorker.controller) {
        g.navigator.serviceWorker.controller.postMessage({ type: "clarity-om-ping", at: Date.now() });
      }
    } catch (e) {}
    omLog("cache", "Orderly ping");
    persistStats();
  }

  /** 🧹 DOM Janitor — stuck overlays & orphan toasts */
  function jobDom() {
    var cleaned = 0;
    try {
      document.querySelectorAll(".clarity-faculty-toast.show, .clarity-lab-toast.show, .clarity-registrar-toast.show").forEach(function (el) {
        var shown = el.getAttribute("data-om-shown");
        if (!shown) {
          el.setAttribute("data-om-shown", String(Date.now()));
          return;
        }
        if (Date.now() - parseInt(shown, 10) > 12000) {
          el.classList.remove("show");
          cleaned++;
        }
      });
      /* orphan backdrop without visible panel */
      document.querySelectorAll(".cfm-backdrop, .crm-backdrop, .csm-backdrop").forEach(function (bd) {
        var panel = bd.parentElement;
        if (panel && panel.hidden) {
          /* fine */
        } else if (panel && !panel.classList.contains("show") && panel.id && panel.id.indexOf("modal") >= 0) {
          if (panel.hidden !== true && !panel.classList.contains("show")) {
            panel.hidden = true;
            cleaned++;
          }
        }
      });
      /* duplicate vault breach banners */
      var breaches = document.querySelectorAll("#clarity-vault-breach");
      for (var i = 1; i < breaches.length; i++) {
        try {
          breaches[i].remove();
          cleaned++;
        } catch (e) {}
      }
    } catch (e2) {}
    if (cleaned) {
      stats.cleans += cleaned;
      omLog("dom", "Cleaned " + cleaned);
    }
    persistStats();
  }

  /** 📦 Storage Steward — trim long logs */
  function jobStorage() {
    var keys = [
      "clarity_security_audit_log_v1",
      "clarity_om_log_v1",
      "clarity_staff_ops_log_v1",
      "clarity_registrar_audit_v1",
      "clarity_faculty_help_log_v1"
    ];
    var trimmed = 0;
    keys.forEach(function (k) {
      try {
        var arr = JSON.parse(localStorage.getItem(k) || "[]");
        if (Array.isArray(arr) && arr.length > 50) {
          localStorage.setItem(k, JSON.stringify(arr.slice(0, 40)));
          trimmed++;
        }
      } catch (e) {}
    });
    if (trimmed) {
      stats.trims += trimmed;
      omLog("storage", "Trimmed " + trimmed + " log shelves");
    }
    persistStats();
  }

  /** 🔗 Wing Liaison — keep wings in the loop */
  function jobLiaison() {
    stats.liaisons += 1;
    try {
      if (g.ClaritySecurity && g.ClaritySecurity.scan && stats.liaisons % 2 === 0) {
        /* light: do not force full scan every time — only when security badge warns */
        var badge = document.getElementById("clarity-security-badge");
        if (badge && badge.classList.contains("sec-warn")) g.ClaritySecurity.scan();
      }
    } catch (e) {}
    try {
      if (g.ClarityStaffOps && g.ClarityStaffOps.runHealth && stats.liaisons % 3 === 0) {
        g.ClarityStaffOps.runHealth();
      }
    } catch (e2) {}
    try {
      if (g.ClarityLab && g.ClarityLab.render && !document.getElementById("clarity-lab-shell")) {
        g.ClarityLab.render();
      }
    } catch (e3) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-om-liaison", { detail: { at: Date.now() } }));
    } catch (e4) {}
    if (stats.liaisons % 4 === 0) omLog("liaison", "Wings checked");
    persistStats();
  }

  var JOBS = {
    circulation: jobCirculation,
    cache: jobCache,
    dom: jobDom,
    storage: jobStorage,
    liaison: jobLiaison
  };

  function startCrew() {
    stopCrew();
    var crew = (roster && roster.crew) || [];
    crew.forEach(function (member) {
      var fn = JOBS[member.id];
      if (!fn) return;
      try {
        fn();
      } catch (e) {}
      var ms = member.intervalMs || 30000;
      var t = setInterval(function () {
        try {
          fn();
        } catch (e2) {}
      }, ms);
      timers.push(t);
    });
    injectDoor();
    injectVein();
    try {
      console.info(
        "%c O&M Crew ",
        "background:#4a1020;color:#f5d0dc",
        "Bloodstream online ·",
        crew.length,
        "roles"
      );
    } catch (e) {}
  }

  function stopCrew() {
    timers.forEach(function (t) {
      try {
        clearInterval(t);
      } catch (e) {}
    });
    timers = [];
  }

  function injectVein() {
    if (document.getElementById("clarity-om-vein")) return;
    var el = document.createElement("div");
    el.id = "clarity-om-vein";
    el.className = "clarity-om-vein";
    el.title = "O&M circulation";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }

  function injectDoor() {
    if (document.getElementById("cnp-om-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-om-btn";
    btn.className = "cnp-hall-btn cnp-om-btn";
    btn.textContent = "O&M";
    btn.title = "Operations & Maintenance crew";
    btn.onclick = openDesk;
    host.appendChild(btn);
  }

  function openDesk() {
    var m = document.getElementById("clarity-om-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-om-modal";
      m.className = "clarity-om-modal";
      m.hidden = true;
      m.innerHTML =
        '<div class="com-backdrop" data-com-close="1"></div>' +
        '<div class="com-panel">' +
        '<button type="button" class="com-x" data-com-close="1">×</button>' +
        '<div class="com-stamp">O & M</div>' +
        "<h2>Operations & Maintenance</h2>" +
        '<p class="com-lead">The bloodstream of Clarity University — quiet circulation through every wing.</p>' +
        '<div id="com-body"></div>' +
        '<div class="com-actions">' +
        '<button type="button" class="cdm-btn" id="com-pulse">Pulse now</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="com-clean">Deep clean</button>' +
        "</div></div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-com-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("com-pulse").onclick = function () {
        jobCirculation();
        jobLiaison();
        renderBody();
      };
      document.getElementById("com-clean").onclick = function () {
        jobDom();
        jobStorage();
        renderBody();
      };
    }
    renderBody();
    m.hidden = false;
    m.classList.add("show");
  }

  function renderBody() {
    var body = document.getElementById("com-body");
    if (!body) return;
    var crew = (roster && roster.crew) || [];
    var html =
      "<p><b>Pulses:</b> " +
      stats.pulses +
      " · <b>Cleans:</b> " +
      stats.cleans +
      " · <b>Trims:</b> " +
      stats.trims +
      " · <b>Liaisons:</b> " +
      stats.liaisons +
      "</p><ul class=\"com-crew\">";
    crew.forEach(function (c) {
      html +=
        "<li>" +
        (c.badge || "") +
        " <b>" +
        c.name +
        "</b> — " +
        c.role +
        " <small>(" +
        Math.round((c.intervalMs || 0) / 1000) +
        "s)</small></li>";
    });
    html += "</ul>";
    html +=
      '<p class="com-foot">' +
      ((roster && roster.motto) || "") +
      " · " +
      ((roster && roster.disclaimer) || "") +
      "</p>";
    body.innerHTML = html;
  }

  g.ClarityOM = {
    pulse: jobCirculation,
    clean: function () {
      jobDom();
      jobStorage();
    },
    openDesk: openDesk,
    stats: function () {
      return stats;
    },
    log: function () {
      return lsGet(LOG_KEY, []);
    }
  };

  function boot() {
    fetch(BASE + "om-roster.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        roster = j;
        var saved = lsGet(STATS_KEY, null);
        if (saved && typeof saved === "object") {
          stats.pulses = saved.pulses || 0;
          stats.cleans = saved.cleans || 0;
          stats.trims = saved.trims || 0;
          stats.liaisons = saved.liaisons || 0;
        }
        startCrew();
      })
      .catch(function () {
        roster = { crew: [] };
        startCrew();
      });
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 1100);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 3200);
    });
  } else setTimeout(boot, 3200);
})(typeof window !== "undefined" ? window : this);
