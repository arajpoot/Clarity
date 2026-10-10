/* Clarity University — Administrator Office Controller v1
 * Loads curriculum/vault/admin/*.json as source of truth for register,
 * scores, and certificates. Surprises: office stamp, memo, roll call.
 * Educational only — not an accredited registrar.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_OFFICE_CONTROLLER_V1__) return;
  g.__CLARITY_OFFICE_CONTROLLER_V1__ = true;

  var BASE = "./assets/curriculum/vault/admin/";
  var cache = { registry: null, ledger: null, diplomas: null, loaded: false };

  function fetchJSON(url) {
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("office " + url);
        return r.json();
      });
  }

  function loadOffice(cb) {
    if (cache.loaded) {
      cb(cache);
      return;
    }
    Promise.all([
      fetchJSON(BASE + "registry.json").catch(function () {
        return null;
      }),
      fetchJSON(BASE + "ledger-schema.json").catch(function () {
        return null;
      }),
      fetchJSON(BASE + "diploma-templates.json").catch(function () {
        return null;
      })
    ]).then(function (arr) {
      cache.registry = arr[0];
      cache.ledger = arr[1];
      cache.diplomas = arr[2];
      cache.loaded = true;
      try {
        g.dispatchEvent(
          new CustomEvent("clarity-office-ready", { detail: { office: cache } })
        );
      } catch (e) {}
      cb(cache);
    });
  }

  function collegeByPhase(phase) {
    var reg = cache.registry;
    if (!reg || !reg.colleges) return null;
    for (var i = 0; i < reg.colleges.length; i++) {
      if (reg.colleges[i].phase === phase) return reg.colleges[i];
    }
    return null;
  }

  function gradeLabel(pct) {
    var bands = (cache.ledger && cache.ledger.gradeBands) || [];
    for (var i = 0; i < bands.length; i++) {
      if (pct >= bands[i].min) return bands[i].label;
    }
    return "Needs review";
  }

  function applyDiplomaTemplate(phase, dip) {
    var T = cache.diplomas;
    if (!T || !T.phases) return dip;
    var p = T.phases[String(phase)];
    if (!p) return dip;
    dip.code = p.code || dip.code;
    dip.title = p.title || dip.title;
    dip.latin = p.latin || dip.latin;
    dip.arabic = p.arabic || dip.arabic;
    dip.color = p.color || dip.color;
    dip.sealMark = p.seal || dip.sealMark;
    dip.college = p.college || dip.college;
    if (T.frame && T.frame.disclaimer) dip.note = T.frame.disclaimer;
    return dip;
  }

  /** Roll call — who is enrolled on this device */
  function rollCall() {
    var name = "";
    try {
      name = localStorage.getItem("clarity_learner_name_v1") || "";
    } catch (e) {}
    var phase = 1;
    try {
      phase = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e2) {}
    var col = collegeByPhase(phase);
    var dips = {};
    try {
      dips = JSON.parse(localStorage.getItem("clarity_university_diplomas_v1") || "{}") || {};
    } catch (e3) {}
    var ledger = {};
    try {
      ledger = JSON.parse(localStorage.getItem("clarity_university_ledger_v1") || "{}") || {};
    } catch (e4) {}
    return {
      stamp: (cache.registry && cache.registry.officeHours && cache.registry.officeHours.stamp) || "CLARITY-ADMIN",
      learner: name || "(name not set)",
      phase: phase,
      college: col,
      diplomasHeld: Object.keys(dips).length,
      diplomaCodes: Object.keys(dips).map(function (k) {
        return dips[k].seal;
      }),
      summary: ledger.summary || {},
      motto: (cache.registry && cache.registry.motto) || ""
    };
  }

  /** Formal office memo in console + optional UI toast */
  function stampMemo(msg) {
    var roll = rollCall();
    var line =
      "[" +
      roll.stamp +
      "] " +
      msg +
      " · Learner: " +
      roll.learner +
      " · Phase " +
      roll.phase;
    try {
      console.info("%c Clarity Admin Office ", "background:#0d4f3c;color:#f0e6c8;font-weight:bold", line);
    } catch (e) {}
    return line;
  }

  function openOfficePanel() {
    try { g.dispatchEvent(new CustomEvent("clarity-admin-office-open")); } catch (eOpen) {}
    loadOffice(function () {
      var roll = rollCall();
      var m = document.getElementById("clarity-office-panel");
      if (!m) {
        m = document.createElement("div");
        m.id = "clarity-office-panel";
        m.className = "clarity-office-panel";
        m.hidden = true;
        m.innerHTML =
          '<div class="cof-backdrop" data-cof-close="1"></div>' +
          '<div class="cof-desk">' +
          '<button type="button" class="cof-x" data-cof-close="1">×</button>' +
          '<div class="cof-header">' +
          '<span class="cof-stamp" id="cof-stamp">CLARITY-ADMIN</span>' +
          "<h2>Administrator Office</h2>" +
          '<p class="cof-motto" id="cof-motto"></p>' +
          "</div>" +
          '<div class="cof-body" id="cof-body"></div>' +
          '<div class="cof-actions">' +
          '<button type="button" class="cdm-btn" id="cof-hall">Diploma hall</button>' +
          '<button type="button" class="cdm-btn cdm-secondary" id="cof-transcript">Transcript</button>' +
          '<button type="button" class="cdm-btn cdm-secondary" id="cof-export">Export record</button>' +
          "</div></div>";
        document.body.appendChild(m);
        m.addEventListener("click", function (ev) {
          if (ev.target && ev.target.getAttribute("data-cof-close")) {
            m.hidden = true;
            m.classList.remove("show");
          }
        });
        document.getElementById("cof-hall").onclick = function () {
          if (g.ClarityUniversity && g.ClarityUniversity.openHall) g.ClarityUniversity.openHall();
        };
        document.getElementById("cof-transcript").onclick = function () {
          if (g.ClarityUniversity && g.ClarityUniversity.showTranscript)
            g.ClarityUniversity.showTranscript();
        };
        document.getElementById("cof-export").onclick = function () {
          if (g.ClarityUniversity && g.ClarityUniversity.exportPortable)
            g.ClarityUniversity.exportPortable();
        };
      }
      document.getElementById("cof-stamp").textContent = roll.stamp;
      document.getElementById("cof-motto").textContent = roll.motto || "";
      var colleges = (cache.registry && cache.registry.colleges) || [];
      var html =
        '<div class="cof-roll">' +
        "<strong>Roll call</strong>" +
        "<p>Learner: <b>" +
        escapeHtml(roll.learner) +
        "</b></p>" +
        "<p>Active: Phase " +
        roll.phase +
        (roll.college ? " · " + escapeHtml(roll.college.title) : "") +
        "</p>" +
        "<p>Diplomas on file: <b>" +
        roll.diplomasHeld +
        "/4</b></p>" +
        "</div>";
      html += '<div class="cof-colleges"><strong>Colleges</strong><ul>';
      colleges.forEach(function (c) {
        var sum = roll.summary[String(c.phase)];
        var band =
          sum && sum.total
            ? gradeLabel(Math.round((100 * sum.correct) / sum.total))
            : "— not scored —";
        html +=
          "<li><span class=\"cof-code\">" +
          escapeHtml(c.code) +
          "</span> " +
          escapeHtml(c.title) +
          "<br/><small>" +
          escapeHtml(c.deanNote || "") +
          " · " +
          escapeHtml(band) +
          "</small></li>";
      });
      html += "</ul></div>";
      html +=
        '<p class="cof-foot">Files: curriculum/vault/admin/registry · ledger-schema · diploma-templates. Device-local only.</p>';
      document.getElementById("cof-body").innerHTML = html;
      m.hidden = false;
      m.classList.add("show");
      stampMemo("Office panel opened");
    });
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /** Bridge: when diploma issues, restyle from office templates */
  g.addEventListener("clarity-diploma-issued", function (ev) {
    loadOffice(function () {
      var dip = ev.detail;
      if (dip && dip.phase) {
        applyDiplomaTemplate(dip.phase, dip);
        stampMemo("Diploma filed for phase " + dip.phase + " · seal " + (dip.seal || ""));
      }
    });
  });

  /* Diploma bridge — never mutate frozen ClarityUniversity (SEAL).
   * clarity-diploma-issued already restyles certificates from templates.
   */
  var __officeHooked = false;
  function hookUniversity() {
    if (__officeHooked) return;
    if (!g.ClarityUniversity) return;
    /* Never mutate ClarityUniversity (may be frozen by SEAL). Event path only. */
    try {
      g.addEventListener("clarity-diploma-issued", function (ev) {
        try {
          var phase = ev && ev.detail && ev.detail.phase;
          var dip = ev && ev.detail && ev.detail.diploma;
          if (phase) loadOffice(function () { applyDiplomaTemplate(phase, dip); });
        } catch (e) {}
      });
    } catch (e) {}
    __officeHooked = true;
  }

  function injectOfficeDoor() {
    var hall = document.getElementById("cnp-hall-btn");
    if (!hall || document.getElementById("cnp-office-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-office-btn";
    btn.className = "cnp-hall-btn cnp-office-btn";
    btn.textContent = "Admin office";
    btn.title = "University administrator office";
    btn.onclick = openOfficePanel;
    hall.parentNode.insertBefore(btn, hall.nextSibling);
  }

  g.ClarityAdminOffice = {
    load: loadOffice,
    rollCall: rollCall,
    stampMemo: stampMemo,
    open: openOfficePanel,
    gradeLabel: gradeLabel,
    collegeByPhase: collegeByPhase,
    cache: cache
  };

  function boot() {
    loadOffice(function () {
      stampMemo("Office online");
      hookUniversity();
      injectOfficeDoor();
    });
    setTimeout(injectOfficeDoor, 800);
    /* freeze-safe: single hook; event path covers post-seal */
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(function () { injectOfficeDoor(); }, 200);
  });
  g.addEventListener("load", function () {
    setTimeout(boot, 400);
  });
})(typeof window !== "undefined" ? window : this);
