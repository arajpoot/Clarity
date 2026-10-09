/* Clarity University — Chancellor (Head of House)
 * Top academic officer persona: convocation, integrity, circulation, pastoral care.
 * Educational only — not a living mujtahid or fatwa authority.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CHANCELLOR__) return;
  g.__CLARITY_CHANCELLOR__ = true;

  var BASE = "./assets/curriculum/vault/admin/chancellor/";
  var LOG_KEY = "clarity_chancellor_log_v1";
  var office = null;
  var state = { briefs: 0, convocations: 0, last: null };

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
  function chLog(kind, msg) {
    var arr = lsGet(LOG_KEY, []) || [];
    arr.unshift({ at: Date.now(), kind: kind, msg: msg });
    if (arr.length > 30) arr = arr.slice(0, 30);
    lsSet(LOG_KEY, arr);
  }

  function chancellor() {
    return (office && office.chancellor) || null;
  }

  function toast(msg) {
    var c = chancellor();
    var el = document.getElementById("clarity-chancellor-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-chancellor-toast";
      el.className = "clarity-chancellor-toast";
      document.body.appendChild(el);
    }
    el.innerHTML =
      (c ? '<span class="cct-name">' + escape(c.name) + "</span> " : "") + escape(msg);
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 4500);
  }

  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function activePhase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }

  function diplomaCount() {
    try {
      var D = JSON.parse(localStorage.getItem("clarity_university_diplomas_v1") || "{}") || {};
      return Object.keys(D).filter(function (k) {
        return D[k] && D[k].seal;
      }).length;
    } catch (e) {
      return 0;
    }
  }

  /** State of the House summary */
  function stateOfHouse() {
    var phase = activePhase();
    var dips = diplomaCount();
    var sec =
      g.ClaritySecurity && g.ClaritySecurity.state
        ? g.ClaritySecurity.state()
        : { broken: [], scans: 0 };
    var om = g.ClarityOM && g.ClarityOM.stats ? g.ClarityOM.stats() : {};
    var lab =
      g.ClarityLab && g.ClarityLab.portfolio
        ? (g.ClarityLab.portfolio().projects || []).length
        : 0;
    var unlock =
      g.ClarityRegistrar && g.ClarityRegistrar.highestUnlocked
        ? g.ClarityRegistrar.highestUnlocked()
        : phase;
    return {
      phase: phase,
      unlock: unlock,
      diplomas: dips,
      securityBroken: (sec.broken || []).length,
      securityScans: sec.scans || 0,
      omPulses: om.pulses || 0,
      labProjects: lab,
      learner: (function () {
        try {
          return localStorage.getItem("clarity_learner_name_v1") || "Seeker";
        } catch (e) {
          return "Seeker";
        }
      })()
    };
  }

  function integrityBrief() {
    state.briefs += 1;
    state.last = Date.now();
    var house = stateOfHouse();
    var notes = [];
    if (house.securityBroken > 0) {
      notes.push("Security reports " + house.securityBroken + " open wiring issue(s).");
    }
    try {
      if (g.ClarityStaffFiqh && g.ClarityStaffFiqh.report) {
        var rep = g.ClarityStaffFiqh.report();
        if (rep && rep.flags) {
          var risks = rep.flags.filter(function (f) {
            return f.level === "risk";
          });
          if (risks.length) notes.push("Authenticity Clerk flagged " + risks.length + " risk tone item(s).");
        }
      }
    } catch (e) {}
    if (!notes.length) notes.push("House integrity quiet — no critical flags in view.");
    chLog("integrity", notes.join(" "));
    return notes;
  }

  function pastoralPrompt() {
    var c = chancellor();
    var lines = [
      "Slow is fine when sincerity is present.",
      "A map is not the journey — keep a living teacher for worship.",
      "When unsure of a ruling, pause; knowledge is trust.",
      "Beauty of craft must not outrun truth of source.",
      "One phase, one step — future doors open when this one is honest."
    ];
    var tip = lines[Math.floor(Math.random() * lines.length)];
    toast(tip);
    chLog("pastoral", tip);
    return tip;
  }

  function onConvocation(detail) {
    state.convocations += 1;
    var c = chancellor();
    var phase = (detail && detail.phase) || activePhase();
    toast(
      "Convocation noted for phase " +
        phase +
        ". Present your seal to the next teacher when ready."
    );
    chLog("convocation", "Phase " + phase + " graduation acknowledged");
  }

  function openDesk() {
    var c = chancellor();
    var house = stateOfHouse();
    var notes = integrityBrief();
    var m = document.getElementById("clarity-chancellor-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-chancellor-modal";
      m.className = "clarity-chancellor-modal";
      m.hidden = true;
      m.innerHTML =
        '<div class="cch-backdrop" data-cch-close="1"></div>' +
        '<div class="cch-panel">' +
        '<button type="button" class="cch-x" data-cch-close="1">×</button>' +
        '<div class="cch-stamp">CHANCELLOR</div>' +
        '<div id="cch-body"></div>' +
        '<div class="cch-actions">' +
        '<button type="button" class="cdm-btn" id="cch-state">State of the House</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cch-pastoral">Counsel</button>' +
        '<button type="button" class="cdm-btn cdm-secondary" id="cch-integrity">Integrity brief</button>' +
        "</div></div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-cch-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("cch-state").onclick = function () {
        var h = stateOfHouse();
        alert(
          "State of the House\n\n" +
            "Learner: " +
            h.learner +
            "\nActive phase: " +
            h.phase +
            "\nUnlocked through: " +
            h.unlock +
            "\nDiplomas on file: " +
            h.diplomas +
            "\nLab projects: " +
            h.labProjects +
            "\nSecurity scans: " +
            h.securityScans +
            " (open: " +
            h.securityBroken +
            ")\nO&M pulses: " +
            h.omPulses
        );
      };
      document.getElementById("cch-pastoral").onclick = function () {
        pastoralPrompt();
      };
      document.getElementById("cch-integrity").onclick = function () {
        var n = integrityBrief();
        alert("Integrity brief\n\n" + n.join("\n"));
      };
    }
    var body = document.getElementById("cch-body");
    body.innerHTML =
      "<h2>" +
      escape((c && c.name) || "Chancellor") +
      "</h2>" +
      '<p class="cch-title">' +
      escape((c && c.title) || "") +
      " · Seal <code>" +
      escape((c && c.seal) || "") +
      "</code></p>" +
      '<p class="cch-greet">' +
      escape((c && c.greeting) || "") +
      "</p>" +
      '<div class="cch-house">' +
      "<p><b>" +
      escape(house.learner) +
      "</b> · Phase " +
      house.phase +
      " · Diplomas " +
      house.diplomas +
      "</p>" +
      "<p class=\"cch-notes\">" +
      notes.map(escape).join(" · ") +
      "</p>" +
      "</div>" +
      '<ul class="cch-duties">' +
      ((office && office.operationalDuties) || [])
        .map(function (d) {
          return "<li><b>" + escape(d.label) + "</b> — " + escape(d.desc) + "</li>";
        })
        .join("") +
      "</ul>" +
      '<p class="cch-disc">' +
      escape((office && office.disclaimer) || "") +
      "</p>";
    m.hidden = false;
    m.classList.add("show");
  }

  function injectDoor() {
    if (document.getElementById("cnp-chan-btn")) return;
    var host =
      document.querySelector(".cnp-inner") || document.getElementById("clarity-name-plaque-rail");
    if (!host) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "cnp-chan-btn";
    btn.className = "cnp-hall-btn cnp-chan-btn";
    btn.textContent = "Chancellor";
    btn.title = "Office of the Chancellor";
    btn.onclick = openDesk;
    /* insert first among hall buttons if possible */
    if (host.firstChild) host.insertBefore(btn, host.firstChild);
    else host.appendChild(btn);
  }

  function injectCrest() {
    if (document.getElementById("clarity-chancellor-crest")) return;
    var el = document.createElement("button");
    el.type = "button";
    el.id = "clarity-chancellor-crest";
    el.className = "clarity-chancellor-crest";
    el.title = "Chancellor of Clarity University";
    el.textContent = "⚜";
    el.onclick = openDesk;
    document.body.appendChild(el);
  }

  g.ClarityChancellor = {
    openDesk: openDesk,
    stateOfHouse: stateOfHouse,
    integrityBrief: integrityBrief,
    pastoralPrompt: pastoralPrompt,
    chancellor: chancellor
  };

  g.addEventListener("clarity-diploma-issued", function (ev) {
    onConvocation(ev.detail || {});
  });
  g.addEventListener("clarity-faculty-signed", function (ev) {
    onConvocation(ev.detail || {});
  });
  g.addEventListener("clarity-security-scan", function (ev) {
    if (ev.detail && ev.detail.broken && ev.detail.broken.length >= 3) {
      toast("Integrity: several pipes need attention — Security wing is on it.");
    }
  });

  function boot() {
    fetch(BASE + "chancellor-office.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        office = j;
        injectDoor();
        injectCrest();
        try {
          console.info(
            "%c Chancellor ",
            "background:#2a2040;color:#e8dcf5",
            (j.chancellor && j.chancellor.name) || "Head of House",
            "· office open"
          );
        } catch (e) {}
        /* First visit soft greeting once per session */
        if (!g.__CLARITY_CHAN_GREETED__) {
          g.__CLARITY_CHAN_GREETED__ = true;
          setTimeout(function () {
            var c = chancellor();
            if (c) toast(c.greeting);
          }, 3500);
        }
      })
      .catch(function () {
        office = { chancellor: { name: "Chancellor", title: "Head of House", seal: "CHAN" } };
        injectDoor();
        injectCrest();
      });
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 700);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 3000);
    });
  } else setTimeout(boot, 3000);
})(typeof window !== "undefined" ? window : this);
