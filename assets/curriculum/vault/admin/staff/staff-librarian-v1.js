/* Admin Staff — Vault Librarian
 * Gathers Resource Scout findings + Authenticity Clerk reports,
 * keeps curriculum backups in vault-local storage, and issues
 * rotation briefs to Ops Steward & Resource Scout for deployment.
 * Does not mutate sealed foundation. Educational only — not a fatwa desk.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STAFF_LIBRARIAN__) return;
  g.__CLARITY_STAFF_LIBRARIAN__ = true;

  var STACKS_KEY = "clarity_librarian_stacks_v1";
  var BACKUP_KEY = "clarity_librarian_curriculum_backup_v1";
  var ISSUES_KEY = "clarity_librarian_issues_v1";
  var LAST_ISSUE_KEY = "clarity_librarian_last_issue_v1";
  var BASE = "./assets/curriculum/vault/admin/staff/library/";

  var state = {
    id: "librarian",
    name: "Vault Librarian",
    gathers: 0,
    backups: 0,
    issues: 0,
    shelves: null,
    playbook: null
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

  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }

  function loadShelves() {
    return fetchJSON(BASE + "shelves.json")
      .then(function (j) {
        state.shelves = j;
        return j;
      })
      .catch(function () {
        state.shelves = { shelves: [], uxPrinciples: [] };
        return state.shelves;
      });
  }

  function loadPlaybook() {
    return fetchJSON(BASE + "rotation-playbook.json")
      .then(function (j) {
        state.playbook = j;
        return j;
      })
      .catch(function () {
        state.playbook = { rotations: [] };
        return state.playbook;
      });
  }

  /** Gather scout inbox + fiqh report into library stacks */
  function gather() {
    state.gathers += 1;
    var scoutInbox =
      g.ClarityStaffScout && g.ClarityStaffScout.inbox ? g.ClarityStaffScout.inbox() : [];
    var fiqh =
      g.ClarityStaffFiqh && g.ClarityStaffFiqh.report ? g.ClarityStaffFiqh.report() : null;
    var opsLogs = g.ClarityStaffOps && g.ClarityStaffOps.logs ? g.ClarityStaffOps.logs() : [];

    var stacks = lsGet(STACKS_KEY, { refs: [], authenticity: [], ops: [], updated: 0 });
    stacks.updated = Date.now();

    /* Merge scout proposals as reference candidates */
    scoutInbox.forEach(function (p) {
      if (!p || !p.url) return;
      var exists = stacks.refs.some(function (r) {
        return r.url === p.url && r.sourceId === p.sourceId;
      });
      if (!exists) {
        stacks.refs.push({
          at: p.at || Date.now(),
          sourceId: p.sourceId,
          title: p.title,
          url: p.url,
          phase: p.phase,
          moduleHint: p.moduleHint,
          kind: p.kind,
          status: p.status || "proposed",
          from: "scout"
        });
      }
    });

    /* Authenticity clerk → reference notes shelf */
    if (fiqh && fiqh.flags) {
      stacks.authenticity = {
        at: fiqh.at || Date.now(),
        scans: fiqh.scans,
        flags: fiqh.flags.slice(-30)
      };
    }

    /* Recent ops warnings for librarian awareness */
    stacks.ops = (opsLogs || []).filter(function (e) {
      return e.level === "warn" || e.level === "error";
    }).slice(-15);

    /* Static shelves from vault library file */
    if (state.shelves && state.shelves.shelves) {
      stacks.staticShelves = state.shelves.shelves;
      stacks.uxPrinciples = state.shelves.uxPrinciples || [];
    }

    if (stacks.refs.length > 80) stacks.refs = stacks.refs.slice(-80);
    lsSet(STACKS_KEY, stacks);
    try {
      console.info(
        "%c Vault Librarian ",
        "background:#3a2a10;color:#f0e6c8",
        "gathered refs",
        stacks.refs.length,
        "auth flags",
        stacks.authenticity && stacks.authenticity.flags ? stacks.authenticity.flags.length : 0
      );
    } catch (e) {}
    return stacks;
  }

  /** Curriculum backup — progress, diplomas, ledger, phase (vault-local) */
  function backupCurriculum() {
    state.backups += 1;
    var pack = {
      at: Date.now(),
      kind: "clarity-librarian-curriculum-backup",
      phase: null,
      name: null,
      junior: null,
      juniorHigh: null,
      daily: null,
      dai: null,
      ledger: null,
      diplomas: null,
      portable: null
    };
    try {
      pack.phase = localStorage.getItem("clarity_curriculum_phase_v1");
      pack.name = localStorage.getItem("clarity_learner_name_v1");
      pack.junior = localStorage.getItem("clarity_junior_progress_v1");
      pack.juniorHigh = localStorage.getItem("clarity_junior_high_progress_v1");
      pack.daily = localStorage.getItem("clarity_daily_hs_progress_v1");
      pack.dai = localStorage.getItem("clarity_dai_university_progress_v1");
      pack.ledger = localStorage.getItem("clarity_university_ledger_v1");
      pack.diplomas = localStorage.getItem("clarity_university_diplomas_v1");
      pack.portable = localStorage.getItem("clarity_university_portable_v1");
    } catch (e) {}
    /* Keep last 5 backups */
    var hist = lsGet(BACKUP_KEY, []);
    if (!Array.isArray(hist)) hist = [];
    hist.push(pack);
    if (hist.length > 5) hist = hist.slice(-5);
    lsSet(BACKUP_KEY, hist);
    return pack;
  }

  function restoreBackup(index) {
    var hist = lsGet(BACKUP_KEY, []);
    var pack = hist[index];
    if (!pack) return false;
    try {
      if (pack.phase != null) localStorage.setItem("clarity_curriculum_phase_v1", pack.phase);
      if (pack.name != null) localStorage.setItem("clarity_learner_name_v1", pack.name);
      if (pack.junior != null) localStorage.setItem("clarity_junior_progress_v1", pack.junior);
      if (pack.juniorHigh != null)
        localStorage.setItem("clarity_junior_high_progress_v1", pack.juniorHigh);
      if (pack.daily != null) localStorage.setItem("clarity_daily_hs_progress_v1", pack.daily);
      if (pack.dai != null) localStorage.setItem("clarity_dai_university_progress_v1", pack.dai);
      if (pack.ledger != null) localStorage.setItem("clarity_university_ledger_v1", pack.ledger);
      if (pack.diplomas != null)
        localStorage.setItem("clarity_university_diplomas_v1", pack.diplomas);
      if (pack.portable != null)
        localStorage.setItem("clarity_university_portable_v1", pack.portable);
      if (g.ClarityCurriculumController && g.ClarityCurriculumController.syncTracks) {
        g.ClarityCurriculumController.syncTracks();
      }
      if (g.ClarityUniversity && g.ClarityUniversity.getName) {
        try {
          g.dispatchEvent(new CustomEvent("clarity-learner-name"));
        } catch (e2) {}
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  /** Issue rotation brief to Ops + Scout */
  function issueRotation(force) {
    var now = Date.now();
    if (!force) {
      var last = parseInt(localStorage.getItem(LAST_ISSUE_KEY) || "0", 10) || 0;
      if (last && now - last < 6 * 3600000) {
        return lsGet(ISSUES_KEY, [])[0] || null;
      }
    }
    state.issues += 1;
    try {
      localStorage.setItem(LAST_ISSUE_KEY, String(now));
    } catch (e) {}

    var dayMod = Math.floor(now / 86400000) % 3;
    var rot =
      (state.playbook &&
        state.playbook.rotations &&
        state.playbook.rotations.filter(function (r) {
          return r.dayMod === dayMod;
        })[0]) || {
        ops: ["health-check"],
        scout: [],
        ux: "Keep modules sequential and disclaimers visible"
      };

    var stacks = gather();
    var backup = backupCurriculum();

    /* Authenticity-driven ops tasks */
    var authFlags =
      stacks.authenticity && stacks.authenticity.flags ? stacks.authenticity.flags : [];
    var riskCount = authFlags.filter(function (f) {
      return f.level === "risk";
    }).length;
    var opsTasks = (rot.ops || []).slice();
    if (riskCount) opsTasks.push("surface-disclaimer-check");
    if (stacks.ops && stacks.ops.length) opsTasks.push("review-ops-warnings");

    /* Scout focus: playbook + top unread proposals */
    var scoutFocus = (rot.scout || []).slice();
    stacks.refs
      .filter(function (r) {
        return r.status === "proposed";
      })
      .slice(-3)
      .forEach(function (r) {
        if (r.sourceId && scoutFocus.indexOf(r.sourceId) < 0) scoutFocus.push(r.sourceId);
      });

    var brief = {
      id: "issue-" + now,
      at: now,
      dayMod: dayMod,
      ux: rot.ux,
      uxPrinciples: (state.shelves && state.shelves.uxPrinciples) || [],
      ops: {
        tasks: opsTasks,
        note: "Run health; keep controllers smooth; do not touch foundation files"
      },
      scout: {
        focus: scoutFocus,
        note: "Probe allowlist only; proposals go to inbox for librarian"
      },
      authenticity: {
        riskCount: riskCount,
        adviseCount: authFlags.filter(function (f) {
          return f.level === "advise";
        }).length
      },
      backupAt: backup.at,
      refsOnShelves: stacks.refs.length,
      deployment: {
        mode: "rotation",
        sealedFoundation: true,
        message:
          "Deploy UX guidance only — content proposals stay in library until human accepts"
      }
    };

    var issues = lsGet(ISSUES_KEY, []);
    issues.unshift(brief);
    if (issues.length > 20) issues = issues.slice(0, 20);
    lsSet(ISSUES_KEY, issues);

    /* Notify staff */
    try {
      g.dispatchEvent(new CustomEvent("clarity-librarian-issue", { detail: brief }));
    } catch (e3) {}
    if (g.ClarityStaffOps && g.ClarityStaffOps.runHealth) {
      try {
        g.ClarityStaffOps.runHealth();
      } catch (e4) {}
    }
    if (g.ClarityStaffScout && g.ClarityStaffScout.runDaily && dayMod === 0) {
      /* soft nudge — scout still respects daily gate unless forced */
      try {
        g.ClarityStaffScout.runDaily(false);
      } catch (e5) {}
    }

    try {
      console.info(
        "%c Vault Librarian ",
        "background:#3a2a10;color:#f0e6c8",
        "issued rotation",
        brief.id,
        "ops",
        opsTasks.length,
        "scout focus",
        scoutFocus.length
      );
    } catch (e6) {}
    return brief;
  }

  function latestIssue() {
    var issues = lsGet(ISSUES_KEY, []);
    return issues[0] || null;
  }

  function stacks() {
    return lsGet(STACKS_KEY, null);
  }

  function backups() {
    return lsGet(BACKUP_KEY, []);
  }

  g.ClarityStaffLibrarian = {
    gather: gather,
    backupCurriculum: backupCurriculum,
    restoreBackup: restoreBackup,
    issueRotation: issueRotation,
    latestIssue: latestIssue,
    stacks: stacks,
    backups: backups,
    state: function () {
      return state;
    }
  };

  function boot() {
    Promise.all([loadShelves(), loadPlaybook()]).then(function () {
      gather();
      backupCurriculum();
      issueRotation(false);
    });
  }

  g.addEventListener("clarity-staff-ready", function () {
    setTimeout(boot, 600);
  });
  g.addEventListener("clarity-staff-scout", function () {
    gather();
  });
  g.addEventListener("clarity-staff-fiqh", function () {
    gather();
  });
  g.addEventListener("clarity-diploma-issued", function () {
    backupCurriculum();
  });
  g.addEventListener("clarity-curriculum-progress", function () {
    /* light backup throttle via issue gate */
  });

  if (g.__CLARITY_STAFF_OPS__) setTimeout(boot, 3500);
  else if (document.readyState === "complete") setTimeout(boot, 5000);
})(typeof window !== "undefined" ? window : this);
