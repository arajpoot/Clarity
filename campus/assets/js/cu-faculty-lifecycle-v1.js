/**
 * cu-faculty-lifecycle-v1.js — R0–R9 Faculty + Librarian/Scout bridge
 * Educational personas & staff scripts only. Not fatwa. Not accredited degree.
 */
(function (g) {
  "use strict";
  if (g.__CU_FACULTY_LIFECYCLE_V1__) return;
  g.__CU_FACULTY_LIFECYCLE_V1__ = true;

  var FAC = "/campus/assets/faculty/";
  var KEY_ASSESS = "cu_uni_assess_v1";
  var KEY_ASSIGN = "cu_uni_assign_v1";
  var KEY_MENTOR = "cu_uni_mentor_log_v1";
  var KEY_HELP_TS = "cu_uni_tutor_last_v1";
  var COOLDOWN_MS = 90 * 1000;

  var state = { roster: null, help: null, resources: null, staff: null, phase: 1 };

  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v == null ? fb : JSON.parse(v);
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
  function currentPhase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }
  function emit(name, detail) {
    try {
      document.dispatchEvent(new CustomEvent("cu-faculty-event", { detail: Object.assign({ type: name }, detail || {}) }));
    } catch (e) {}
  }
  function chipById(id) {
    if (!state.resources || !state.resources.chips) return null;
    for (var i = 0; i < state.resources.chips.length; i++) {
      if (state.resources.chips[i].id === id) return state.resources.chips[i];
    }
    return null;
  }
  function chipsForPhase(phase) {
    if (!state.resources || !state.resources.chips) return [];
    return state.resources.chips.filter(function (c) {
      return !c.phases || c.phases.indexOf(phase) >= 0;
    });
  }
  function renderChips(host, list, limit) {
    if (!host) return;
    limit = limit || 6;
    var html = (list || [])
      .slice(0, limit)
      .map(function (c) {
        var href = c.url || "#";
        var ext = c.internal ? "" : ' target="_blank" rel="noopener noreferrer"';
        return (
          '<a class="cu-res-chip" href="' +
          esc(href) +
          '"' +
          ext +
          "><strong>" +
          esc(c.title) +
          "</strong><span>" +
          esc(c.why) +
          "</span></a>"
        );
      })
      .join("");
    host.innerHTML =
      html ||
      '<p class="cu-res-empty">Pointers load when online. Library and Lab remain available offline.</p>';
  }

  /* ---------- R0 chips mount ---------- */
  function mountResourceRails() {
    document.querySelectorAll("[data-cu-resources]").forEach(function (el) {
      var ph = parseInt(el.getAttribute("data-phase") || String(state.phase), 10) || state.phase;
      renderChips(el, chipsForPhase(ph), parseInt(el.getAttribute("data-limit") || "6", 10));
    });
  }

  /* ---------- Popover (tutor / mentor) ---------- */
  function ensurePop() {
    var el = document.getElementById("cu-life-pop");
    if (el) return el;
    el = document.createElement("div");
    el.id = "cu-life-pop";
    el.hidden = true;
    el.innerHTML =
      '<div class="cu-life-card" role="dialog" aria-modal="true">' +
      '<button type="button" class="cu-life-x" aria-label="Close">×</button>' +
      '<p class="cu-life-seal" id="cu-life-seal"></p>' +
      '<h3 id="cu-life-title"></h3>' +
      '<p id="cu-life-aim" class="cu-life-aim"></p>' +
      '<p id="cu-life-body"></p>' +
      '<div id="cu-life-chips" class="cu-res-rail"></div>' +
      '<p class="cu-life-foot">Educational only — not a fatwa. Verify with a local teacher.</p>' +
      '<div class="cu-life-actions">' +
      '<a id="cu-life-try" class="cu-life-btn" href="#">Try on campus →</a>' +
      '<button type="button" id="cu-life-close">Close</button>' +
      "</div></div>";
    document.body.appendChild(el);
    el.querySelector(".cu-life-x").onclick = closePop;
    el.querySelector("#cu-life-close").onclick = closePop;
    el.addEventListener("click", function (e) {
      if (e.target === el) closePop();
    });
    return el;
  }
  function closePop() {
    var el = document.getElementById("cu-life-pop");
    if (el) el.hidden = true;
  }
  function teacherFor(phase) {
    if (g.ClarityFaculty && g.ClarityFaculty.teacherFor) return g.ClarityFaculty.teacherFor(phase);
    if (!state.roster || !state.roster.teachers) return null;
    for (var i = 0; i < state.roster.teachers.length; i++) {
      if (state.roster.teachers[i].phase === phase) return state.roster.teachers[i];
    }
    return null;
  }
  function pickTip(phase) {
    var arr = (state.help && state.help.byPhase && state.help.byPhase[String(phase)]) || [];
    if (!arr.length) return { tip: "Begin with Allah. One module at a time.", aim: "Counsel" };
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function openCounsel(opts) {
    opts = opts || {};
    var phase = opts.phase || state.phase;
    var t = teacherFor(phase) || { name: "Faculty guide", seal: "✦", rank: "Guide" };
    var tip = opts.tip || pickTip(phase);
    var el = ensurePop();
    el.querySelector("#cu-life-seal").textContent = t.seal || "✦";
    el.querySelector("#cu-life-title").textContent = (t.name || "Advisor") + " · " + (t.rank || "");
    el.querySelector("#cu-life-aim").textContent = tip.aim ? "Aim: " + tip.aim : "";
    el.querySelector("#cu-life-body").textContent = tip.tip || tip;
    var tryA = el.querySelector("#cu-life-try");
    tryA.href = tip.tryInternal || "/campus/desk/";
    var outward = [];
    (tip.goOutward || []).forEach(function (id) {
      var c = chipById(id);
      if (c) outward.push(c);
    });
    if (!outward.length) outward = chipsForPhase(phase).slice(0, 3);
    renderChips(el.querySelector("#cu-life-chips"), outward, 4);
    el.hidden = false;
    var log = lsGet(KEY_MENTOR, []);
    if (!Array.isArray(log)) log = [];
    log.unshift({ at: Date.now(), phase: phase, kind: opts.kind || "counsel" });
    lsSet(KEY_MENTOR, log.slice(0, 40));
    lsSet(KEY_HELP_TS, Date.now());
    emit(opts.kind || "mentor", { phase: phase });
    try {
      if (g.ClarityFaculty && g.ClarityFaculty.offerHelp) g.ClarityFaculty.offerHelp(phase);
    } catch (e) {}
  }

  /* ---------- R1 Welcome + soft assess ---------- */
  function ensureWelcome() {
    if (lsGet(KEY_ASSESS, null) && lsGet(KEY_ASSESS, {}).done) return;
    if (document.getElementById("cu-assess-modal")) return;
    var page = document.body.getAttribute("data-campus-page") || "";
    if (page && page.indexOf("lab") === 0) return; // don't block labs
    var box = document.createElement("div");
    box.id = "cu-assess-modal";
    box.innerHTML =
      '<div class="cu-life-card cu-assess-card">' +
      "<h3>Welcome, seeker</h3>" +
      '<p class="cu-life-foot">A short placement mirror — not a test of īmān. Educational only.</p>' +
      '<label class="cu-assess-q">Arabic reading comfort?' +
      '<select id="cu-a-ar"><option value="new">New / learning letters</option><option value="some">Some words</option><option value="ok">Comfortable reading</option></select></label>' +
      '<label class="cu-assess-q">Main goal right now?' +
      '<select id="cu-a-goal"><option value="1">Foundations of faith</option><option value="2">Prayer & practice</option><option value="3">Consistency & tajweed</option><option value="4">Sharing with adab</option></select></label>' +
      '<label class="cu-assess-q">Local teacher available?' +
      '<select id="cu-a-local"><option value="yes">Yes</option><option value="seeking">Still seeking</option><option value="no">Not yet</option></select></label>' +
      '<div class="cu-life-actions">' +
      '<button type="button" id="cu-a-go" class="cu-life-btn">Show my start path →</button>' +
      '<button type="button" id="cu-a-skip">Skip for now</button>' +
      "</div>" +
      '<div id="cu-a-result" hidden></div></div>';
    document.body.appendChild(box);
    document.getElementById("cu-a-skip").onclick = function () {
      lsSet(KEY_ASSESS, { done: true, skipped: true, at: Date.now() });
      box.remove();
      emit("assess", { skipped: true });
    };
    document.getElementById("cu-a-go").onclick = function () {
      var goal = parseInt(document.getElementById("cu-a-goal").value, 10) || 1;
      var ar = document.getElementById("cu-a-ar").value;
      var local = document.getElementById("cu-a-local").value;
      var plan = {
        done: true,
        at: Date.now(),
        phase: goal,
        arabic: ar,
        localTeacher: local,
        lab: ar === "ok" ? "/campus/lab/tajweed/" : "/campus/lab/arabic/",
        desk:
          goal === 1
            ? "/campus/desk/seeker/"
            : goal === 2
            ? "/campus/desk/practice/"
            : goal === 3
            ? "/campus/desk/consistency/"
            : "/campus/desk/transmission/"
      };
      lsSet(KEY_ASSESS, plan);
      try {
        localStorage.setItem("clarity_curriculum_phase_v1", String(goal));
      } catch (e) {}
      var res = document.getElementById("cu-a-result");
      res.hidden = false;
      res.innerHTML =
        "<p><strong>Your start path</strong></p><ul>" +
        '<li><a href="' +
        plan.desk +
        '">Phase desk</a></li>' +
        '<li><a href="' +
        plan.lab +
        '">Suggested lab</a></li>' +
        '<li><a href="/campus/charter/">Read the Charter</a></li>' +
        (local !== "yes"
          ? "<li>Seek a trusted local teacher alongside this path.</li>"
          : "") +
        "</ul>" +
        '<p><button type="button" id="cu-a-close" class="cu-life-btn">Continue</button></p>';
      document.getElementById("cu-a-close").onclick = function () {
        box.remove();
      };
      emit("assess", plan);
    };
  }

  /* ---------- R2 Admission Faculty strip ---------- */
  function mountAdmissionFaculty() {
    var host = document.getElementById("adm-faculty-slot") || document.querySelector("[data-panel='1']");
    if (!host || host.querySelector(".cu-adm-fac")) return;
    var t = teacherFor(1) || { name: "Shaykh Nur al-Yaqeen", greeting: "We open with Allah." };
    var div = document.createElement("div");
    div.className = "cu-adm-fac";
    div.innerHTML =
      "<p><strong>Faculty at admission:</strong> " +
      esc(t.name) +
      "</p><p>" +
      esc(t.greeting || "") +
      "</p>" +
      "<p class=\"cu-life-foot\">Limits first — see <a href=\"/campus/charter/\">Charter</a>. Educational only.</p>" +
      '<div class="cu-res-rail" data-cu-resources data-phase="1" data-limit="3"></div>';
    host.appendChild(div);
    mountResourceRails();
  }

  /* ---------- R3 Mentor strip ---------- */
  function mountMentorStrip() {
    var main = document.querySelector("main");
    if (!main || document.getElementById("cu-mentor-strip")) return;
    if ((document.body.getAttribute("data-campus-page") || "").indexOf("lab") === 0) return;
    var strip = document.createElement("div");
    strip.id = "cu-mentor-strip";
    strip.className = "cu-mentor-strip";
    var t = teacherFor(state.phase);
    strip.innerHTML =
      '<span class="pulse"></span><span><strong>Today’s counsel</strong> · ' +
      esc(t ? t.name : "Faculty") +
      ' <button type="button" id="cu-mentor-btn">Listen</button></span>';
    main.insertBefore(strip, main.firstChild);
    document.getElementById("cu-mentor-btn").onclick = function () {
      openCounsel({ kind: "mentor", phase: state.phase });
    };
  }

  /* ---------- R4 Tutor buttons on desk ---------- */
  function mountTutorButtons() {
    document.querySelectorAll("[data-cu-tutor], .module-card, .cu-mod-card, .desk-module").forEach(function (card) {
      if (card.querySelector(".cu-tutor-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cu-tutor-btn";
      btn.textContent = "Ask advisor";
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var last = lsGet(KEY_HELP_TS, 0) || 0;
        if (Date.now() - last < COOLDOWN_MS) {
          openCounsel({ kind: "tutor", phase: state.phase, tip: { aim: "Pace", tip: "Take a breath. One tip every few minutes is enough — sincerity over speed." } });
          return;
        }
        openCounsel({ kind: "tutor", phase: state.phase });
      });
      card.appendChild(btn);
    });
    // global floating on desk pages
    var page = document.body.getAttribute("data-campus-page") || "";
    if (page.indexOf("desk") >= 0 || page.indexOf("seeker") >= 0 || location.pathname.indexOf("/desk/") >= 0) {
      if (!document.getElementById("cu-tutor-fab")) {
        var fab = document.createElement("button");
        fab.id = "cu-tutor-fab";
        fab.type = "button";
        fab.textContent = "Ask advisor";
        fab.onclick = function () {
          openCounsel({ kind: "tutor", phase: state.phase });
        };
        document.body.appendChild(fab);
      }
    }
  }

  /* ---------- R5 Soft assignment ---------- */
  function ensureAssignment() {
    var a = lsGet(KEY_ASSIGN, null);
    if (a && a.phase === state.phase && a.week === weekKey()) return a;
    var packs = {
      1: { title: "Foundations practice", tasks: ["Open one Seeker module", "Pin one source in University Vault", "Read Al-Fātiḥah on Quran.com"] },
      2: { title: "Practice hall", tasks: ["One Practice desk module", "Three Arabic studio cards", "Confirm one prayer detail with a local teacher"] },
      3: { title: "Consistency", tasks: ["One Tajweed LMR pass", "One Consistency module", "Review last week’s notes"] },
      4: { title: "Transmission adab", tasks: ["One Transmission module", "Read Charter limits again", "Share only what you can source clearly"] }
    };
    var pack = packs[state.phase] || packs[1];
    a = { phase: state.phase, week: weekKey(), title: pack.title, tasks: pack.tasks, done: [] };
    lsSet(KEY_ASSIGN, a);
    return a;
  }
  function weekKey() {
    var d = new Date();
    return d.getFullYear() + "-W" + Math.ceil((d.getDate() + 6 - d.getDay()) / 7);
  }
  function mountAssignment() {
    var host = document.getElementById("cu-assign-slot");
    if (!host) return;
    var a = ensureAssignment();
    host.innerHTML =
      "<h3>" +
      esc(a.title) +
      '</h3><ul>' +
      a.tasks
        .map(function (t, i) {
          var on = (a.done || []).indexOf(i) >= 0;
          return (
            "<li><label><input type=\"checkbox\" data-ai=\"" +
            i +
            "\"" +
            (on ? " checked" : "") +
            "/> " +
            esc(t) +
            "</label></li>"
          );
        })
        .join("") +
      '</ul><p class="cu-life-foot">Optional practice pack · mirror only · not a grade of īmān</p>';
    host.querySelectorAll("input[data-ai]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var i = parseInt(inp.getAttribute("data-ai"), 10);
        var cur = lsGet(KEY_ASSIGN, a);
        cur.done = cur.done || [];
        if (inp.checked && cur.done.indexOf(i) < 0) cur.done.push(i);
        if (!inp.checked) cur.done = cur.done.filter(function (x) {
          return x !== i;
        });
        lsSet(KEY_ASSIGN, cur);
        emit("assign", cur);
      });
    });
  }

  /* ---------- R6 Mirror line ---------- */
  function mountMirror() {
    var host = document.getElementById("cu-mirror-line");
    if (!host) return;
    var t = teacherFor(state.phase);
    host.textContent =
      (t ? t.name + ": " : "") +
      "Progress on this device is a study mirror — not a scoreboard of īmān. Keep a living teacher for rulings.";
  }

  /* ---------- R7 Seal hint ---------- */
  function mountSealHint() {
    var host = document.getElementById("cu-seal-slot");
    if (!host) return;
    var t = teacherFor(state.phase);
    host.innerHTML =
      "<p>When this phase’s modules are complete, " +
      esc(t ? t.name : "your Amid") +
      " may countersign a local educational seal (not an ijāzah).</p>" +
      '<button type="button" id="cu-seal-btn" class="cu-life-btn">View handoff guidance</button>';
    document.getElementById("cu-seal-btn").onclick = function () {
      openCounsel({
        kind: "seal",
        phase: state.phase,
        tip: {
          aim: "Handoff",
          tip: "Complete modules with sincerity. The next phase teacher looks for the prior educational seal on this device. For real authorization, only a living scholar can grant ijāzah.",
          tryInternal: "/campus/grading.html",
          goOutward: ["campus-charter", "seekers-home"]
        }
      });
    };
  }

  /* ---------- R8 Graduation blurb ---------- */
  function mountGrad() {
    var host = document.getElementById("cu-grad-slot");
    if (!host) return;
    host.innerHTML =
      "<p><strong>After Transmission</strong> — a local completion card may list four educational seals. It is a souvenir of study on this device, not a seminary degree.</p>" +
      "<p>Then step outward: local teachers, structured courses you trust, and continued Lab practice.</p>" +
      '<div class="cu-res-rail" data-cu-resources data-phase="4" data-limit="4"></div>';
    mountResourceRails();
  }

  /* ---------- Staff strip (librarian + scout) ---------- */
  function mountStaffStrip() {
    var host = document.getElementById("cu-staff-strip");
    if (!host || !state.staff) return;
    var workers = state.staff.workers || [];
    host.innerHTML =
      "<p class=\"cu-staff-title\">Support services · " +
      esc(state.staff.motto || "") +
      "</p><div class=\"cu-staff-grid\">" +
      workers
        .map(function (w) {
          return (
            '<div class="cu-staff-card"><span>' +
            esc(w.badge || "") +
            "</span><strong>" +
            esc(w.title || w.name) +
            "</strong><p>" +
            esc(w.role) +
            "</p></div>"
          );
        })
        .join("") +
      "</div><p class=\"cu-life-foot\">Librarian gathers references · Scout proposes allowlisted sources · Ops keeps modules smooth · Authenticity clerk guards tone. On-device only.</p>";
  }

  /* ---------- Faculty page grid (if empty) ---------- */
  function paintFacultyPage() {
    var grid = document.getElementById("fac-grid");
    if (!grid || !state.roster) return;
    if (grid.children.length && grid.querySelector(".fac-card")) return;
    grid.className = "fac-grid";
    grid.innerHTML = (state.roster.teachers || [])
      .map(function (t) {
        return (
          '<article class="fac-card"><span class="role">' +
          esc(t.title) +
          "</span><strong>" +
          esc(t.name) +
          "</strong><p class=\"spec\">" +
          esc(t.specialty) +
          '</p><button type="button" class="fac-ask" data-ph="' +
          t.phase +
          '">Ask advisor</button></article>'
        );
      })
      .join("");
    grid.querySelectorAll(".fac-ask").forEach(function (b) {
      b.onclick = function () {
        openCounsel({ kind: "tutor", phase: parseInt(b.getAttribute("data-ph"), 10) || 1 });
      };
    });
  }

  function boot() {
    state.phase = currentPhase();
    Promise.all([
      fetchJSON(FAC + "faculty-roster.json").catch(function () {
        return null;
      }),
      fetchJSON(FAC + "help-book.json").catch(function () {
        return null;
      }),
      fetchJSON(FAC + "resource-map.json").catch(function () {
        return null;
      }),
      fetchJSON("/campus/assets/staff/staff-roster.json").catch(function () {
        return null;
      })
    ]).then(function (arr) {
      state.roster = arr[0];
      state.help = arr[1];
      state.resources = arr[2];
      state.staff = arr[3];
      mountResourceRails();
      mountAdmissionFaculty();
      mountMentorStrip();
      mountTutorButtons();
      mountAssignment();
      mountMirror();
      mountSealHint();
      mountGrad();
      mountStaffStrip();
      paintFacultyPage();
      // Welcome/assess on map & faculty
      var path = location.pathname || "";
      if (path.indexOf("/campus/") >= 0 && path.indexOf("/lab/") < 0) {
        setTimeout(ensureWelcome, 400);
      }
      emit("boot", { phase: state.phase });
    });
  }

  g.CuFacultyLife = {
    openCounsel: openCounsel,
    chipsForPhase: chipsForPhase,
    assess: function () {
      localStorage.removeItem(KEY_ASSESS);
      ensureWelcome();
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
