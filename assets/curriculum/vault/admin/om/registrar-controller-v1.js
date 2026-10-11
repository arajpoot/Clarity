/* Clarity University — Registrar
 * Revamps hard "reset to seeker": resume desk, optional phase redo,
 * revised diplomas, inert future phases while one phase is active.
 * Secured under vault admin. Educational bookkeeping only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_REGISTRAR__) return;
  g.__CLARITY_REGISTRAR__ = true;

  var BASE = "./assets/curriculum/vault/admin/registrar/";
  var AUDIT_KEY = "clarity_registrar_audit_v1";
  var ACTIVE_KEY = "clarity_curriculum_phase_v1";
  var policy = null;

  var PHASE_META = [
    { id: 1, key: "seeker", label: "Junior · Seeker" },
    { id: 2, key: "new_muslim", label: "Junior High · Practice" },
    { id: 3, key: "daily", label: "Daily · Consistency" },
    { id: 4, key: "dai", label: "Da'i · Transmission" }
  ];

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
  function lsStr(k, fb) {
    try {
      return localStorage.getItem(k) || fb || "";
    } catch (e) {
      return fb || "";
    }
  }
  function lsSetStr(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function activePhase() {
    return Math.max(1, Math.min(4, parseInt(lsStr(ACTIVE_KEY, "1"), 10) || 1));
  }

  function audit(action, detail) {
    var arr = lsGet(AUDIT_KEY, []) || [];
    arr.unshift({ at: Date.now(), action: action, detail: detail || {} });
    if (arr.length > 40) arr = arr.slice(0, 40);
    lsSet(AUDIT_KEY, arr);
  }

  function progressKey(phase) {
    var map = (policy && policy.progressKeys) || {
      "1": "clarity_junior_progress_v1",
      "2": "clarity_junior_high_progress_v1",
      "3": "clarity_daily_hs_progress_v1",
      "4": "clarity_dai_university_progress_v1"
    };
    return map[String(phase)];
  }

  function pathKey(phase) {
    var map = (policy && policy.pathKeys) || {
      "1": "seeker",
      "2": "new_muslim",
      "3": "daily",
      "4": "dai"
    };
    return map[String(phase)] || "seeker";
  }

  function hasDiploma(phase) {
    try {
      var D = JSON.parse(lsStr("clarity_university_diplomas_v1", "{}") || "{}") || {};
      return !!(D[String(phase)] && D[String(phase)].seal);
    } catch (e) {
      return false;
    }
  }

  function markDiplomaSuperseded(phase) {
    try {
      var D = JSON.parse(lsStr("clarity_university_diplomas_v1", "{}") || "{}") || {};
      var dip = D[String(phase)];
      if (!dip) return;
      dip.superseded = true;
      dip.supersededAt = Date.now();
      dip.revision = (dip.revision || 1);
      D[String(phase)] = dip;
      lsSetStr("clarity_university_diplomas_v1", JSON.stringify(D));
    } catch (e) {}
  }

  /** Clear module progress for a phase only */
  function clearPhaseProgress(phase) {
    var k = progressKey(phase);
    if (k) {
      try {
        localStorage.removeItem(k);
      } catch (e) {}
    }
    /* quiz pass for this phase only */
    try {
      var qp = JSON.parse(lsStr("clarity_phase_quiz_pass_v1", "{}") || "{}") || {};
      delete qp[String(phase)];
      lsSetStr("clarity_phase_quiz_pass_v1", JSON.stringify(qp));
    } catch (e2) {}
  }

  function setActivePhase(phase) {
    phase = Math.max(1, Math.min(4, phase));
    lsSetStr(ACTIVE_KEY, String(phase));
    var pk = pathKey(phase);
    lsSetStr("clarity_path_focus", pk);
    lsSetStr("clarity_committed_path", pk);
    try {
      document.documentElement.setAttribute("data-curriculum-phase", String(phase));
      document.documentElement.setAttribute("data-clarity-path", pk);
      document.documentElement.setAttribute(
        "data-path-i",
        String({ seeker: 0, new_muslim: 1, daily: 2, practicing: 2, dai: 3 }[pk] || 0)
      );
    } catch (e) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-curriculum-phase", { detail: { phase: phase } }));
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { phase: phase } }));
    } catch (e2) {}
    if (g.ClarityCurriculumController) {
      try {
        if (g.ClarityCurriculumController.syncTracks) g.ClarityCurriculumController.syncTracks();
        if (g.ClarityCurriculumController.applyDeepLearningOrder)
          g.ClarityCurriculumController.applyDeepLearningOrder();
      } catch (e3) {}
    }
    applyInertUI();
    return phase;
  }

  /**
   * Resume / enter a phase.
   * - Future phases ( > highest unlocked) inert
   * - Can redo phase <= active or with diploma
   */
  function highestUnlocked() {
    var max = 1;
    var ap = activePhase();
    if (ap > max) max = ap;
    for (var p = 1; p <= 4; p++) {
      if (hasDiploma(p) && p + 1 > max) max = Math.min(4, p + 1);
      try {
        var qp = JSON.parse(lsStr("clarity_phase_quiz_pass_v1", "{}") || "{}") || {};
        if (qp[String(p)] && p + 1 > max) max = Math.min(4, p + 1);
      } catch (e) {}
    }
    /* faculty signature also unlocks next */
    try {
      var sigs = JSON.parse(lsStr("clarity_faculty_signatures_v1", "{}") || "{}") || {};
      for (var p2 = 1; p2 <= 4; p2++) {
        if (sigs[String(p2)] && sigs[String(p2)].signed && p2 + 1 > max)
          max = Math.min(4, p2 + 1);
      }
    } catch (e2) {}
    return max;
  }

  function canEnter(phase) {
    phase = Math.max(1, Math.min(4, phase));
    var unlock = highestUnlocked();
    var ap = activePhase();
    if (phase > unlock) {
      return {
        ok: false,
        inert: true,
        reason: "Phase " + phase + " is inert until you complete and pass the active path (unlocked through phase " + unlock + ")."
      };
    }
    return { ok: true, redo: phase < ap || hasDiploma(phase) };
  }

  function resumePhase(phase, opts) {
    opts = opts || {};
    var gate = canEnter(phase);
    if (!gate.ok) {
      alert(gate.reason);
      applyInertUI();
      return false;
    }
    var redo = !!opts.redo || phase < activePhase() || (hasDiploma(phase) && opts.forceRedo);
    if (redo) {
      if ((policy && policy.rules && policy.rules.requireConfirm !== false) && !opts.silent) {
        var ok = confirm(
          "Redo Phase " +
            phase +
            "?\n\n• Module progress for this phase will be cleared\n• Your previous diploma stays on file as superseded\n• A new diploma can be issued when you graduate again\n• Other phases are unchanged\n\nEducational bookkeeping only."
        );
        if (!ok) return false;
      }
      if (hasDiploma(phase)) markDiplomaSuperseded(phase);
      clearPhaseProgress(phase);
      /* clear faculty enrollment for this phase only — keep signature history note */
      try {
        var en = JSON.parse(lsStr("clarity_faculty_enrollment_v1", "{}") || "{}") || {};
        delete en[String(phase)];
        lsSetStr("clarity_faculty_enrollment_v1", JSON.stringify(en));
      } catch (e) {}
      audit("redo-phase", { phase: phase });
    } else {
      audit("resume-phase", { phase: phase });
    }
    setActivePhase(phase);
    if (g.ClarityFaculty && g.ClarityFaculty.enroll) {
      try {
        g.ClarityFaculty.enroll(phase);
      } catch (e2) {}
    }
    return true;
  }

  /** Soft registrar reset: return focus to phase 1 without wiping all diplomas */
  function registrarReset(mode) {
    mode = mode || "seeker-resume";
    if (mode === "seeker-resume") {
      var ok = confirm(
        "Return to Junior (Seeker) as active phase?\n\n• Later phase diplomas stay on file\n• Future phases become inert until you walk the path again\n• Seeker module progress is kept unless you choose Redo\n\nThis replaces the old hard wipe-to-seeker reset."
      );
      if (!ok) return false;
      setActivePhase(1);
      audit("reset-active-seeker", {});
      toast("Active phase: Junior. Later phases inert until unlocked.");
      return true;
    }
    if (mode === "full-academic-wipe") {
      var ok2 = confirm(
        "FULL academic wipe on this device?\n\nThis clears module progress, diplomas, scores, faculty signatures, and lab portfolio. Cannot be undone unless you exported a backup."
      );
      if (!ok2) return false;
      [
        "clarity_junior_progress_v1",
        "clarity_junior_high_progress_v1",
        "clarity_daily_hs_progress_v1",
        "clarity_dai_university_progress_v1",
        "clarity_university_diplomas_v1",
        "clarity_university_ledger_v1",
        "clarity_phase_quiz_pass_v1",
        "clarity_faculty_signatures_v1",
        "clarity_faculty_enrollment_v1",
        "clarity_lab_portfolio_v1",
        "clarity_lab_design_drafts_v1"
      ].forEach(function (k) {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      });
      setActivePhase(1);
      audit("full-wipe", {});
      toast("Academic record cleared on this device.");
      return true;
    }
    return false;
  }

  function toast(msg) {
    var el = document.getElementById("clarity-registrar-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-registrar-toast";
      el.className = "clarity-registrar-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 3800);
  }

  /** Mark plaque chips / gate buttons inert for future phases */
  function applyInertUI() {
    var unlock = highestUnlocked();
    var ap = activePhase();
    document.querySelectorAll(".cpp-chip[data-phase]").forEach(function (btn) {
      var ph = parseInt(btn.getAttribute("data-phase"), 10) || 1;
      btn.classList.remove("cpp-inert", "cpp-active-reg", "cpp-redoable");
      if (ph === ap) btn.classList.add("cpp-active-reg");
      else if (ph > unlock) {
        btn.classList.add("cpp-inert");
        btn.setAttribute("title", "Inert — complete current phase path first");
        btn.setAttribute("aria-disabled", "true");
      } else {
        btn.classList.add("cpp-redoable");
        btn.setAttribute("title", "Available — tap to resume or redo");
        btn.removeAttribute("aria-disabled");
      }
    });
    /* legacy track buttons if visible */
    document.querySelectorAll(".cgs-btn[data-gate]").forEach(function (btn) {
      var gname = btn.getAttribute("data-gate");
      var map = { seeker: 1, new_muslim: 2, practicing: 3, daily: 3, dai: 4 };
      var ph = map[gname] || 1;
      btn.classList.toggle("cgs-inert", ph > unlock);
    });
    try {
      document.documentElement.setAttribute("data-phase-unlock-max", String(unlock));
      document.documentElement.setAttribute("data-phase-active", String(ap));
    } catch (e) {}
  }

  function openDesk() {
    var ap = activePhase();
    var unlock = highestUnlocked();
    var m = document.getElementById("clarity-registrar-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-registrar-modal";
      m.className = "clarity-registrar-modal";
      m.hidden = true;
      m.innerHTML =
        '<div class="crm-backdrop" data-crm-close="1"></div>' +
        '<div class="crm-panel">' +
        '<button type="button" class="crm-x" data-crm-close="1">×</button>' +
        '<div class="crm-stamp">REGISTRAR</div>' +
        "<h2>Phase resume desk</h2>" +
        '<p class="crm-lead">One active phase. Future phases stay inert. Redo a prior phase anytime — diplomas revise, history remains.</p>' +
        '<div id="crm-body"></div>' +
        '<div class="crm-actions">' +
        '<button type="button" class="cdm-btn cdm-secondary" id="crm-soft">Return active → Junior</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="crm-wipe">Full wipe…</button>' +
        "</div></div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-crm-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("crm-soft").onclick = function () {
        registrarReset("seeker-resume");
        m.hidden = true;
        m.classList.remove("show");
        openDesk();
      };
      document.getElementById("crm-wipe").onclick = function () {
        registrarReset("full-academic-wipe");
        m.hidden = true;
        m.classList.remove("show");
      };
    }
    var body = document.getElementById("crm-body");
    body.innerHTML = PHASE_META.map(function (p) {
      var gate = canEnter(p.id);
      var dip = hasDiploma(p.id);
      var st =
        p.id === ap
          ? "ACTIVE"
          : p.id > unlock
          ? "INERT"
          : dip
          ? "COMPLETED · redoable"
          : "AVAILABLE";
      return (
        '<div class="crm-row' +
        (p.id === ap ? " is-active" : "") +
        (p.id > unlock ? " is-inert" : "") +
        '">' +
        "<div><strong>Phase " +
        p.id +
        "</strong> · " +
        p.label +
        "<br/><small>" +
        st +
        (dip ? " · diploma on file" : "") +
        "</small></div>" +
        (p.id > unlock
          ? '<span class="crm-tag">Inert</span>'
          : '<span class="crm-btns">' +
            (p.id !== ap
              ? '<button type="button" data-resume="' + p.id + '">Resume</button>'
              : "") +
            '<button type="button" data-redo="' +
            p.id +
            '">Redo</button></span>') +
        "</div>"
      );
    }).join("");
    body.onclick = function (ev) {
      var t = ev.target;
      var r = t.getAttribute && t.getAttribute("data-resume");
      var d = t.getAttribute && t.getAttribute("data-redo");
      if (r) {
        resumePhase(parseInt(r, 10), { redo: false });
        m.hidden = true;
        m.classList.remove("show");
      }
      if (d) {
        resumePhase(parseInt(d, 10), { redo: true, forceRedo: true });
        m.hidden = true;
        m.classList.remove("show");
      }
    };
    m.hidden = false;
    m.classList.add("show");
  }

  /** Override legacy hard reset */
  g.clarityPathResetToSeeker = function () {
    openDesk();
    return false;
  };

  /** Hook controller goToPhase for inert future */
  function hookController() {
    if (g.ClarityCurriculumController && g.ClarityCurriculumController.__registrarHooked) return;
    if (!g.ClarityCurriculumController) return;
    function registrarGate(target) {
      var gate = canEnter(target);
      if (!gate.ok) {
        try { alert(gate.reason || "Phase locked by Registrar."); } catch (e) {}
        return false;
      }
      return true;
    }
    if (typeof g.ClarityCurriculumController.registerGoToPhaseGate === "function") {
      g.ClarityCurriculumController.registerGoToPhaseGate(registrarGate);
      g.ClarityCurriculumController.__registrarHooked = true;
      return;
    }
    if (Object.isFrozen(g.ClarityCurriculumController)) {
      try { g.ClarityCurriculumController.__registrarHooked = true; } catch (e) {}
      return;
    }
    var prev = g.ClarityCurriculumController.goToPhase;
    if (typeof prev !== "function") return;
    try {
      g.ClarityCurriculumController.goToPhase = function (target) {
        if (registrarGate(target) === false) return false;
        return prev.call(g.ClarityCurriculumController, target);
      };
      g.ClarityCurriculumController.__registrarHooked = true;
    } catch (eReg) {}
  }

  /** Diploma issue → stamp revision if superseding */
  g.addEventListener("clarity-diploma-issued", function (ev) {
    try {
      var dip = ev.detail;
      if (!dip || !dip.phase) return;
      var D = JSON.parse(lsStr("clarity_university_diplomas_v1", "{}") || "{}") || {};
      var cur = D[String(dip.phase)];
      if (cur) {
        cur.revision = (cur.revision || 1) + (cur.superseded ? 1 : 0);
        if (cur.superseded) {
          cur.superseded = false;
          cur.reissuedAt = Date.now();
          cur.note =
            (cur.note || "") +
            " · Revised diploma (v" +
            cur.revision +
            ") after phase redo.";
        }
        D[String(dip.phase)] = cur;
        lsSetStr("clarity_university_diplomas_v1", JSON.stringify(D));
      }
      audit("diploma-issued", { phase: dip.phase, seal: dip.seal });
    } catch (e) {}
  });

  function injectDoor() {
    if (document.getElementById("cnp-reg-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-reg-btn";
    btn.className = "cnp-hall-btn cnp-reg-btn";
    btn.textContent = "Registrar";
    btn.title = "Resume, redo phases, replace old reset";
    btn.onclick = openDesk;
    host.appendChild(btn);
    /* retitle legacy reset */
    var legacy = document.getElementById("clarity-path-reset-btn");
    if (legacy) {
      legacy.title = "Registrar — resume or redo phases (no hard wipe)";
      var txt = legacy.querySelector(".cgs-txt");
      if (txt) txt.textContent = "Registrar";
    }
  }

  g.ClarityRegistrar = {
    resumePhase: resumePhase,
    canEnter: canEnter,
    activePhase: activePhase,
    highestUnlocked: highestUnlocked,
    openDesk: openDesk,
    applyInertUI: applyInertUI,
    registrarReset: registrarReset,
    auditLog: function () {
      return lsGet(AUDIT_KEY, []);
    }
  };

  function boot() {
    fetch(BASE + "registrar-policy.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        policy = j;
      })
      .catch(function () {
        policy = {};
      })
      .then(function () {
        injectDoor();
        hookController();
        applyInertUI();
        setInterval(applyInertUI, 8000);
        try {
          console.info(
            "%c Registrar ",
            "background:#1a3040;color:#cde8f5",
            "Phase desk online · future phases inert"
          );
        } catch (e) {}
      });
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 600);
  });
  g.addEventListener("clarity-curriculum-phase", function () {
    applyInertUI();
  });
  g.addEventListener("clarity-faculty-signed", function () {
    applyInertUI();
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 2400);
    });
  } else setTimeout(boot, 2400);
})(typeof window !== "undefined" ? window : this);
