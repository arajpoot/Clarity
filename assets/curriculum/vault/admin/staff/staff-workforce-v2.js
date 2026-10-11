/* Staff Workforce v2 — Phase Usher, Curriculum Runner, Help Desk, Stage Orderly
 * Plus trainAll / duty roster for the whole staff wing.
 * Educational on-device helpers only — not a fatwa desk.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STAFF_WORKFORCE_V2__) return;
  g.__CLARITY_STAFF_WORKFORCE_V2__ = true;

  var DUTY_KEY = "clarity_staff_duty_log_v1";

  function duty(who, msg) {
    try {
      var arr = JSON.parse(localStorage.getItem(DUTY_KEY) || "[]") || [];
      arr.unshift({ at: Date.now(), who: who, msg: msg });
      if (arr.length > 50) arr = arr.slice(0, 50);
      localStorage.setItem(DUTY_KEY, JSON.stringify(arr));
    } catch (e) {}
  }

  /* —— Phase Usher —— */
  var usher = {
    id: "usher",
    name: "Phase Usher",
    runs: 0,
    sync: function () {
      usher.runs++;
      try {
        var ph = localStorage.getItem("clarity_curriculum_phase_v1") || "1";
        document.documentElement.setAttribute("data-curriculum-phase", ph);
        document.documentElement.setAttribute("data-phase-active", ph);
      } catch (e) {}
      duty("usher", "phase sync");
      return usher.state();
    },
    escortToStage: function () {
      var stage = document.getElementById("cu-stage") || document.getElementById("campus-stage-body");
      if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
      duty("usher", "escort stage");
    },
    state: function () {
      return { id: "usher", runs: usher.runs };
    }
  };
  g.ClarityStaffUsher = usher;

  /* —— Curriculum Runner —— */
  var runner = {
    id: "runner",
    name: "Curriculum Runner",
    runs: 0,
    report: function () {
      runner.runs++;
      var keys = [
        "clarity_junior_progress_v1",
        "clarity_junior_high_progress_v1",
        "clarity_daily_hs_progress_v1",
        "clarity_dai_progress_v1"
      ];
      var counts = {};
      keys.forEach(function (k) {
        try {
          var o = JSON.parse(localStorage.getItem(k) || "{}") || {};
          counts[k] = Object.keys(o).filter(function (id) {
            return o[id] && (o[id].done || o[id] === true);
          }).length;
        } catch (e) {
          counts[k] = 0;
        }
      });
      var phase = 1;
      try {
        phase = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
      } catch (e2) {}
      var body = document.getElementById("campus-stage-body");
      var empty = body && !(body.textContent || "").replace(/\s+/g, "").length;
      duty("runner", "report phase " + phase);
      return { phase: phase, counts: counts, stageEmpty: !!empty };
    },
    nudge: function () {
      var r = runner.report();
      var host = document.getElementById("campus-stage-body");
      if (host && r.stageEmpty && !document.getElementById("staff-runner-nudge")) {
        var p = document.createElement("p");
        p.id = "staff-runner-nudge";
        p.className = "cu-note";
        p.style.cssText = "opacity:.8;font-size:.85rem";
        p.textContent = "Curriculum Runner: stage waiting for vault colleges — ensure boot.js loaded.";
        host.appendChild(p);
      }
      return r;
    },
    state: function () {
      return { id: "runner", runs: runner.runs };
    }
  };
  g.ClarityStaffRunner = runner;

  /* —— Help Desk —— */
  var helpTips = [
    "Educational modules only — personal rulings need a local qualified teacher.",
    "Use /library/ for primary source maps (Qur'an.com, Sunnah.com).",
    "Complete modules in order; phase quiz opens the next college.",
    "Amana Vault on Companion is separate from curriculum study records.",
    "Systems desk runs on-device IT diagnostics — no remote access."
  ];
  var helpdesk = {
    id: "helpdesk",
    name: "Help Desk Attendant",
    tipsServed: 0,
    tip: function () {
      var t = helpTips[helpdesk.tipsServed % helpTips.length];
      helpdesk.tipsServed++;
      duty("helpdesk", "tip");
      return t;
    },
    openBrief: function () {
      alert("Help Desk\n\n" + helpTips.map(function (t, i) { return (i + 1) + ". " + t; }).join("\n\n"));
    },
    state: function () {
      return { id: "helpdesk", tipsServed: helpdesk.tipsServed };
    }
  };
  g.ClarityStaffHelpdesk = helpdesk;

  /* —— Stage Orderly —— */
  var janitor = {
    id: "janitor",
    name: "Stage Orderly",
    cleans: 0,
    clean: function () {
      janitor.cleans++;
      try {
        var hint = document.getElementById("campus-loading-hint");
        if (hint && g.__CLARITY_VAULT_SEALED__) hint.remove();
      } catch (e) {}
      try {
        document.querySelectorAll(".staff-runner-nudge-dup").forEach(function (n) {
          n.remove();
        });
      } catch (e2) {}
      duty("janitor", "clean");
      return janitor.state();
    },
    state: function () {
      return { id: "janitor", cleans: janitor.cleans };
    }
  };
  g.ClarityStaffJanitor = janitor;

  /* —— Orchestration —— */
  function trainAll() {
    var report = { at: Date.now(), staff: [] };
    try {
      if (g.ClarityStaffOps && g.ClarityStaffOps.check) {
        g.ClarityStaffOps.check();
        report.staff.push("ops");
      }
    } catch (e) {}
    try {
      if (g.ClarityStaffFiqh && g.ClarityStaffFiqh.scan) {
        g.ClarityStaffFiqh.scan();
        report.staff.push("fiqh");
      }
    } catch (e2) {}
    try {
      if (g.ClarityStaffScout && g.ClarityStaffScout.propose) {
        g.ClarityStaffScout.propose();
        report.staff.push("scout");
      }
    } catch (e3) {}
    try {
      if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.gather) {
        g.ClarityStaffLibrarian.gather();
        report.staff.push("librarian");
      }
    } catch (e4) {}
    usher.sync();
    runner.nudge();
    janitor.clean();
    report.staff.push("usher", "runner", "janitor", "helpdesk");
    duty("workforce", "trainAll " + report.staff.join(","));
    try {
      g.dispatchEvent(new CustomEvent("clarity-staff-trained", { detail: report }));
    } catch (e5) {}
    return report;
  }

  function roster() {
    return {
      ops: g.ClarityStaffOps && g.ClarityStaffOps.state ? g.ClarityStaffOps.state() : null,
      fiqh: g.ClarityStaffFiqh && g.ClarityStaffFiqh.state ? g.ClarityStaffFiqh.state() : null,
      scout: g.ClarityStaffScout && g.ClarityStaffScout.state ? g.ClarityStaffScout.state() : null,
      librarian: g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.state ? g.ClarityStaffLibrarian.state() : null,
      usher: usher.state(),
      runner: runner.state(),
      helpdesk: helpdesk.state(),
      janitor: janitor.state()
    };
  }

  g.ClarityStaffWorkforce = {
    trainAll: trainAll,
    roster: roster,
    dutyLog: function () {
      try {
        return JSON.parse(localStorage.getItem(DUTY_KEY) || "[]");
      } catch (e) {
        return [];
      }
    }
  };
  g.ClarityNurArsenal = g.ClarityNurArsenal || {};
  g.ClarityNurArsenal.trainAll = trainAll;
  g.ClarityNurArsenal.roster = roster;

  g.addEventListener("clarity-path-changed", function () {
    usher.sync();
    setTimeout(function () {
      runner.nudge();
      janitor.clean();
    }, 100);
  });
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(trainAll, 500);
  });
  g.addEventListener("clarity-staff-ready", function () {
    setTimeout(trainAll, 300);
  });
})(typeof window !== "undefined" ? window : this);
