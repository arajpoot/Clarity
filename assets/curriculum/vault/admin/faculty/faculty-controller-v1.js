/* Clarity University — Secured Faculty Wing
 * One teacher per phase; authorized diploma countersign;
 * handoff to next phase; in-module help popups.
 * Assisted by Librarian + Scout. Educational personas only — not living ijazah.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_FACULTY_WING__) return;
  g.__CLARITY_FACULTY_WING__ = true;

  var BASE = "./assets/curriculum/vault/admin/faculty/";
  var SIG_KEY = "clarity_faculty_signatures_v1";
  var ENROLL_KEY = "clarity_faculty_enrollment_v1";
  var HELP_KEY = "clarity_faculty_help_log_v1";

  var roster = null;
  var helpbook = null;
  var state = { ready: false, lastHelpAt: 0 };

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

  function teacherFor(phase) {
    if (!roster || !roster.teachers) return null;
    for (var i = 0; i < roster.teachers.length; i++) {
      if (roster.teachers[i].phase === phase) return roster.teachers[i];
    }
    return null;
  }

  function getSignatures() {
    return lsGet(SIG_KEY, {}) || {};
  }
  function getEnrollment() {
    return lsGet(ENROLL_KEY, {}) || {};
  }

  function currentPhase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }

  /** Can user start phase? Phase 1 always; else need prior phase faculty signature */
  function canStartPhase(phase) {
    if (phase <= 1) return { ok: true };
    var sigs = getSignatures();
    var prior = sigs[String(phase - 1)];
    if (prior && prior.signed) return { ok: true, prior: prior };
    var t = teacherFor(phase);
    var prev = teacherFor(phase - 1);
    return {
      ok: false,
      reason:
        "Present the signed diploma from " +
        ((prev && prev.name) || "the previous teacher") +
        " to begin with " +
        ((t && t.name) || "this phase teacher") +
        "."
    };
  }

  function enroll(phase) {
    phase = phase || currentPhase();
    var gate = canStartPhase(phase);
    if (!gate.ok) {
      showHandoffModal(phase, gate);
      return false;
    }
    var t = teacherFor(phase);
    var en = getEnrollment();
    en[String(phase)] = {
      teacherId: t && t.id,
      teacherName: t && t.name,
      at: Date.now()
    };
    lsSet(ENROLL_KEY, en);
    try {
      g.dispatchEvent(
        new CustomEvent("clarity-faculty-enroll", { detail: { phase: phase, teacher: t } })
      );
    } catch (e) {}
    toast(
      (t && t.greeting) || "You are enrolled for this phase.",
      t
    );
    return true;
  }

  /** Faculty countersign on diploma after phase quiz pass */
  function signDiploma(phase, dip) {
    phase = phase || currentPhase();
    var t = teacherFor(phase);
    if (!t || !t.signatory) return null;
    var name = "";
    try {
      name = localStorage.getItem("clarity_learner_name_v1") || "Seeker";
    } catch (e) {}
    var sig = {
      phase: phase,
      signed: true,
      at: Date.now(),
      teacherId: t.id,
      teacherName: t.name,
      teacherTitle: t.title,
      seal: t.seal,
      learner: name,
      diplomaSeal: dip && dip.seal,
      statement:
        "I, " +
        t.name +
        ", educational guide for " +
        t.college +
        ", countersign this device-local certificate of completion for phase " +
        phase +
        ". Not a formal ijazah."
    };
    var sigs = getSignatures();
    sigs[String(phase)] = sig;
    lsSet(SIG_KEY, sigs);

    /* Attach to stored diploma */
    try {
      var D = JSON.parse(localStorage.getItem("clarity_university_diplomas_v1") || "{}") || {};
      if (D[String(phase)]) {
        D[String(phase)].facultySignature = sig;
        localStorage.setItem("clarity_university_diplomas_v1", JSON.stringify(D));
      }
    } catch (e2) {}

    /* Librarian backup nudge */
    if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.backupCurriculum) {
      try {
        g.ClarityStaffLibrarian.backupCurriculum();
      } catch (e3) {}
    }

    showSignedDiploma(sig, dip, t);
    try {
      g.dispatchEvent(new CustomEvent("clarity-faculty-signed", { detail: sig }));
    } catch (e4) {}
    return sig;
  }

  function showSignedDiploma(sig, dip, t) {
    var m = ensureModal("clarity-faculty-sign-modal", "cfs");
    var body = m.querySelector(".cfs-body");
    body.innerHTML =
      '<div class="cfs-sign-card">' +
      '<p class="cfs-kicker">Faculty countersignature</p>' +
      "<h3>" +
      escape(t.name) +
      "</h3>" +
      "<p class=\"cfs-title\">" +
      escape(t.title) +
      " · " +
      escape(t.college) +
      "</p>" +
      '<p class="cfs-stmt">' +
      escape(sig.statement) +
      "</p>" +
      '<p class="cfs-seal">Seal <code>' +
      escape(sig.seal) +
      "</code></p>" +
      (dip && dip.seal
        ? '<p class="cfs-dip">Diploma <code>' + escape(dip.seal) + "</code></p>"
        : "") +
      '<p class="cfs-next">Present this signature to the next phase teacher to enroll.</p>' +
      '<p class="cfs-disc">Educational guide only — not a living scholarly license.</p>' +
      "</div>";
    openModal(m);
  }

  function showHandoffModal(phase, gate) {
    var t = teacherFor(phase);
    var prev = teacherFor(phase - 1);
    var m = ensureModal("clarity-faculty-handoff-modal", "cfh");
    var body = m.querySelector(".cfh-body");
    var sigs = getSignatures();
    var prior = sigs[String(phase - 1)];
    body.innerHTML =
      '<div class="cfh-card">' +
      "<h3>Faculty handoff</h3>" +
      "<p>" +
      escape(gate.reason || "") +
      "</p>" +
      (prior
        ? "<p>Found signature from <b>" +
          escape(prior.teacherName) +
          "</b> · <code>" +
          escape(prior.seal) +
          "</code></p>" +
          '<button type="button" class="cdm-btn" id="cfh-accept">Present signature & enroll</button>'
        : "<p>No prior faculty signature on this device yet. Complete the previous phase quiz so your teacher can sign.</p>") +
      (t ? "<p class=\"cfh-wait\">Waiting room of <b>" + escape(t.name) + "</b></p>" : "") +
      "</div>";
    openModal(m);
    var btn = document.getElementById("cfh-accept");
    if (btn && prior) {
      btn.onclick = function () {
        /* mark enrollment despite canStart already true when prior exists */
        var en = getEnrollment();
        en[String(phase)] = {
          teacherId: t && t.id,
          teacherName: t && t.name,
          at: Date.now(),
          presentedSeal: prior.seal
        };
        lsSet(ENROLL_KEY, en);
        closeModal(m);
        toast("Enrolled with " + (t && t.name), t);
        if (g.ClarityCurriculumController && g.ClarityCurriculumController.goToPhase) {
          g.ClarityCurriculumController.goToPhase(phase);
        }
      };
    }
  }

  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function ensureModal(id, prefix) {
    var m = document.getElementById(id);
    if (m) return m;
    m = document.createElement("div");
    m.id = id;
    m.className = "clarity-faculty-modal";
    m.hidden = true;
    m.innerHTML =
      '<div class="cfm-backdrop" data-cfm-close="1"></div>' +
      '<div class="cfm-panel">' +
      '<button type="button" class="cfm-x" data-cfm-close="1">×</button>' +
      '<div class="' +
      prefix +
      '-body"></div></div>';
    document.body.appendChild(m);
    m.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute("data-cfm-close")) closeModal(m);
    });
    return m;
  }
  function openModal(m) {
    m.hidden = false;
    m.classList.add("show");
  }
  function closeModal(m) {
    m.hidden = true;
    m.classList.remove("show");
  }

  function toast(msg, teacher) {
    var el = document.getElementById("clarity-faculty-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-faculty-toast";
      el.className = "clarity-faculty-toast";
      document.body.appendChild(el);
    }
    el.innerHTML =
      (teacher
        ? '<span class="cft-name">' + escape(teacher.name) + "</span> "
        : "") +
      "<span>" +
      escape(msg) +
      "</span>";
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 4200);
  }

  /** In-module help popup — assisted by librarian stacks when available */
  function offerHelp(force) {
    var now = Date.now();
    var cd = (helpbook && helpbook.defaultCooldownSec) || 90;
    if (!force && state.lastHelpAt && now - state.lastHelpAt < cd * 1000) return;
    state.lastHelpAt = now;

    var phase = currentPhase();
    var t = teacherFor(phase);
    if (!t) return;

    var lines = (helpbook && helpbook.byPhase && helpbook.byPhase[String(phase)]) || [];
    var tip = lines[Math.floor(Math.random() * lines.length)] || t.greeting;

    /* Librarian enrichment */
    var extra = "";
    if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.stacks) {
      var st = g.ClarityStaffLibrarian.stacks();
      if (st && st.refs && st.refs.length) {
        var phaseRefs = st.refs.filter(function (r) {
          return r.phase === phase;
        });
        var pick = (phaseRefs.length ? phaseRefs : st.refs)[
          Math.floor(Math.random() * (phaseRefs.length ? phaseRefs.length : st.refs.length))
        ];
        if (pick) {
          extra =
            '<p class="cfhelp-ref">Librarian shelf: <a href="' +
            escape(pick.url) +
            '" target="_blank" rel="noopener noreferrer">' +
            escape(pick.title) +
            "</a></p>";
        }
      }
    }

    /* Scout partnership note */
    var scoutNote = "";
    if (g.ClarityStaffScout && g.ClarityStaffScout.inbox) {
      var inbox = g.ClarityStaffScout.inbox();
      if (inbox && inbox.length) {
        scoutNote =
          '<p class="cfhelp-scout">Scout is keeping sources fresh for your teacher (' +
          inbox.length +
          " proposals in library).</p>";
      }
    }

    var pop = document.getElementById("clarity-faculty-help");
    if (!pop) {
      pop = document.createElement("div");
      pop.id = "clarity-faculty-help";
      pop.className = "clarity-faculty-help";
      pop.innerHTML =
        '<button type="button" class="cfhelp-x" aria-label="Close">×</button>' +
        '<div class="cfhelp-avatar" aria-hidden="true">۞</div>' +
        '<div class="cfhelp-main">' +
        '<p class="cfhelp-who"></p>' +
        '<p class="cfhelp-tip"></p>' +
        '<div class="cfhelp-extra"></div>' +
        '<button type="button" class="cfhelp-ask">Ask for another tip</button>' +
        "</div>";
      document.body.appendChild(pop);
      pop.querySelector(".cfhelp-x").onclick = function () {
        pop.classList.remove("show");
      };
      pop.querySelector(".cfhelp-ask").onclick = function () {
        state.lastHelpAt = 0;
        offerHelp(true);
      };
    }
    pop.querySelector(".cfhelp-who").textContent = t.name + " · " + t.title;
    pop.querySelector(".cfhelp-tip").textContent = tip;
    pop.querySelector(".cfhelp-extra").innerHTML = extra + scoutNote;
    pop.classList.add("show");

    var log = lsGet(HELP_KEY, []);
    log.push({ at: now, phase: phase, teacherId: t.id });
    if (log.length > 30) log = log.slice(-30);
    lsSet(HELP_KEY, log);
  }

  function observeModules() {
    /* When current module is in view / spark button focused, offer help */
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t) return;
        if (t.closest && (t.closest(".junior-lesson.is-current") || t.closest("[data-spark]"))) {
          setTimeout(function () {
            offerHelp(false);
          }, 1200);
        }
      },
      true
    );
    /* Periodic soft offer while on curriculum card */
    setInterval(function () {
      var cur = document.querySelector(".junior-lesson.is-current");
      if (cur && isInViewport(cur)) offerHelp(false);
    }, 120000);
  }

  function isInViewport(el) {
    try {
      var r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    } catch (e) {
      return false;
    }
  }

  function injectFacultyDoor() {
    if (document.getElementById("cnp-faculty-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-faculty-btn";
    btn.className = "cnp-hall-btn cnp-faculty-btn";
    btn.textContent = "Faculty";
    btn.title = "Phase teachers & handoff";
    btn.onclick = openFacultyDesk;
    host.appendChild(btn);
  }

  function openFacultyDesk() {
    var phase = currentPhase();
    var t = teacherFor(phase);
    var sigs = getSignatures();
    var m = ensureModal("clarity-faculty-desk-modal", "cfd");
    var body = m.querySelector(".cfd-body");
    var rows = (roster.teachers || [])
      .map(function (th) {
        var sig = sigs[String(th.phase)];
        var en = getEnrollment()[String(th.phase)];
        return (
          '<div class="cfd-row' +
          (th.phase === phase ? " is-active" : "") +
          '">' +
          "<strong>" +
          escape(th.name) +
          "</strong>" +
          "<span>" +
          escape(th.title) +
          " · Phase " +
          th.phase +
          "</span>" +
          "<small>" +
          escape(th.specialty) +
          "</small>" +
          (sig
            ? '<span class="cfd-sig">Signed · ' + escape(sig.seal) + "</span>"
            : '<span class="cfd-sig muted">No signature yet</span>') +
          (en ? '<span class="cfd-en">Enrolled</span>' : "") +
          "</div>"
        );
      })
      .join("");
    body.innerHTML =
      '<h3>Faculty desk</h3>' +
      '<p class="cfd-lead">' +
      escape((roster && roster.motto) || "") +
      "</p>" +
      (t
        ? '<p class="cfd-current">Your teacher now: <b>' +
          escape(t.name) +
          "</b> — " +
          escape(t.greeting) +
          "</p>"
        : "") +
      '<div class="cfd-list">' +
      rows +
      "</div>" +
      '<div class="cfd-actions">' +
      '<button type="button" class="cdm-btn" id="cfd-enroll">Enroll / present handoff</button>' +
      '<button type="button" class="cdm-btn cdm-secondary" id="cfd-help">Ask teacher for a tip</button>' +
      "</div>" +
      '<p class="cfd-disc">' +
      escape((roster && roster.disclaimer) || "") +
      "</p>";
    openModal(m);
    document.getElementById("cfd-enroll").onclick = function () {
      closeModal(m);
      enroll(phase);
    };
    document.getElementById("cfd-help").onclick = function () {
      closeModal(m);
      state.lastHelpAt = 0;
      offerHelp(true);
    };
  }

  /** Hook phase quiz pass → faculty sign */
  var prevPass = g.clarityOnPhaseQuizPass;
  g.clarityOnPhaseQuizPass = function (phase) {
    if (typeof prevPass === "function") prevPass(phase);
    setTimeout(function () {
      var dip = null;
      try {
        var D = JSON.parse(localStorage.getItem("clarity_university_diplomas_v1") || "{}") || {};
        dip = D[String(phase)] || null;
      } catch (e) {}
      signDiploma(phase, dip);
      /* Offer enroll to next */
      if (phase < 4) {
        setTimeout(function () {
          var gate = canStartPhase(phase + 1);
          if (gate.ok) toast("You may present your seal to the next teacher.", teacherFor(phase + 1));
        }, 2000);
      }
    }, 500);
  };

  /** Gate goToPhase — freeze-safe via registerGoToPhaseGate */
  var __facultyHooked = false;
  function hookController() {
    if (__facultyHooked) return;
    if (!g.ClarityCurriculumController) return;
    function facultyGate(target) {
      var gate = canStartPhase(target);
      if (target > currentPhase() && !gate.ok) {
        showHandoffModal(target, gate);
        return false;
      }
      if (target > 1 && !getEnrollment()[String(target)]) {
        enroll(target);
      }
      return true;
    }
    if (typeof g.ClarityCurriculumController.registerGoToPhaseGate === "function") {
      g.ClarityCurriculumController.registerGoToPhaseGate(facultyGate);
      __facultyHooked = true;
      return;
    }
    /* Fallback only if controller not frozen */
    if (Object.isFrozen(g.ClarityCurriculumController)) {
      __facultyHooked = true;
      return;
    }
    var prev = g.ClarityCurriculumController.goToPhase;
    if (typeof prev !== "function") {
      __facultyHooked = true;
      return;
    }
    try {
      g.ClarityCurriculumController.goToPhase = function (target) {
        if (facultyGate(target) === false) return false;
        return prev.call(g.ClarityCurriculumController, target);
      };
    } catch (e) {}
    __facultyHooked = true;
  }

  g.ClarityFaculty = {
    teacherFor: teacherFor,
    canStartPhase: canStartPhase,
    enroll: enroll,
    signDiploma: signDiploma,
    offerHelp: offerHelp,
    openDesk: openFacultyDesk,
    getSignatures: getSignatures
  };

  function boot() {
    Promise.all([
      fetchJSON(BASE + "faculty-roster.json").catch(function () {
        return null;
      }),
      fetchJSON(BASE + "help-book.json").catch(function () {
        return null;
      })
    ]).then(function (arr) {
      roster = arr[0] || { teachers: [] };
      helpbook = arr[1] || {};
      state.ready = true;
      injectFacultyDoor();
      observeModules();
      hookController();
      /* Auto-enroll phase 1 if needed */
      if (!getEnrollment()["1"]) enroll(1);
      try {
        console.info(
          "%c Faculty Wing ",
          "background:#2a1a40;color:#e8dcf5",
          "Teachers on duty · signatories ready"
        );
      } catch (e) {}
    });
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 400);
  });
  g.addEventListener("clarity-staff-ready", function () {
    setTimeout(hookController, 200);
    setTimeout(injectFacultyDoor, 300);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 2000);
    });
  } else setTimeout(boot, 2000);
})(typeof window !== "undefined" ? window : this);
