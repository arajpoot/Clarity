/* Clarity University — Grand Opening UX
 * Site-wide wayfinding, progressive density, study focus, compass palette.
 * Sits above wings; does not replace sealed curriculum foundation.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_UX_GRAND__) return;
  g.__CLARITY_UX_GRAND__ = true;

  var BASE = "./assets/curriculum/vault/admin/ux/";
  var SEEN_KEY = "clarity_ux_grand_seen_v1";
  var FOCUS_KEY = "clarity_ux_focus_v1";
  var DENSITY_KEY = "clarity_ux_density_v1";
  var policy = null;

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

  function phase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }

  function densityForPhase(p) {
    var map = (policy && policy.densityByPhase) || {};
    return map[String(p)] || (p <= 1 ? "minimal" : p === 2 ? "guided" : "full");
  }

  function applyDensity(mode) {
    mode = mode || densityForPhase(phase());
    try {
      document.documentElement.setAttribute("data-ux-density", mode);
      localStorage.setItem(DENSITY_KEY, mode);
    } catch (e) {}
    /* Progressive hall buttons: minimal shows curriculum-critical only via compass */
    var hall = document.querySelectorAll(".cnp-hall-btn");
    hall.forEach(function (btn) {
      var id = btn.id || "";
      var keep =
        mode === "full" ||
        id === "cnp-chan-btn" ||
        (mode === "guided" && (id === "cnp-faculty-btn" || id === "cnp-reg-btn" || id === "cnp-lab-btn"));
      if (mode === "minimal") {
        /* hide hall clutter — compass is the door */
        if (id.indexOf("cnp-") === 0) btn.classList.add("ux-hall-dim");
      } else if (mode === "guided") {
        btn.classList.toggle("ux-hall-dim", !keep && id !== "cnp-chan-btn");
      } else {
        btn.classList.remove("ux-hall-dim");
      }
    });
    /* Secondary floating badges */
    ["clarity-security-badge", "clarity-vault-badge"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("ux-float-dim", mode === "minimal" || isFocus());
    });
    var vein = document.getElementById("clarity-om-vein");
    if (vein) vein.classList.toggle("ux-float-dim", mode === "minimal" || isFocus());
    var crest = document.getElementById("clarity-chancellor-crest");
    if (crest) crest.classList.toggle("ux-float-dim", isFocus());
  }

  function isFocus() {
    return lsStr(FOCUS_KEY, "") === "1";
  }

  function setFocus(on) {
    try {
      localStorage.setItem(FOCUS_KEY, on ? "1" : "0");
      document.documentElement.setAttribute("data-ux-focus", on ? "1" : "0");
    } catch (e) {}
    applyDensity();
    var fab = document.getElementById("clarity-ux-fab");
    if (fab) fab.classList.toggle("is-focus", on);
    if (on) {
      toast("Study focus on — admin chrome dimmed. Press Esc or open Compass to exit.");
    } else {
      toast("Study focus off — full house visible.");
    }
  }

  function toast(msg) {
    var el = document.getElementById("clarity-ux-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "clarity-ux-toast";
      el.className = "clarity-ux-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 3200);
  }

  function runAction(action) {
    closeCompass();
    switch (action) {
      case "curriculum":
        setFocus(true);
        scrollToCurriculum();
        break;
      case "chancellor":
        if (g.ClarityChancellor && g.ClarityChancellor.openDesk) g.ClarityChancellor.openDesk();
        break;
      case "faculty":
        if (g.ClarityFaculty && g.ClarityFaculty.openDesk) g.ClarityFaculty.openDesk();
        break;
      case "registrar":
        if (g.ClarityRegistrar && g.ClarityRegistrar.openDesk) g.ClarityRegistrar.openDesk();
        break;
      case "lab":
        setFocus(false);
        if (g.clarityOpenSectionDoor) {
          try {
            g.clarityOpenSectionDoor("reality");
          } catch (e) {}
        }
        if (g.ClarityLab && g.ClarityLab.render) g.ClarityLab.render();
        var lab = document.getElementById("clarity-lab-shell");
        if (lab) lab.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "library":
        if (g.ClarityAdminOffice && g.ClarityAdminOffice.open) g.ClarityAdminOffice.open();
        else if (g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.latestIssue) {
          var issue = g.ClarityStaffLibrarian.latestIssue();
          alert(
            issue
              ? "Librarian rotation\n\n" + (issue.ux || "") + "\nRefs: " + (issue.refsOnShelves || 0)
              : "Librarian stacks will fill as Scout runs."
          );
        }
        break;
      case "security":
        if (g.ClaritySecurity && g.ClaritySecurity.openDesk) g.ClaritySecurity.openDesk();
        break;
      case "it":
        if (g.ClarityIT && g.ClarityIT.openDesk) g.ClarityIT.openDesk();
        break;
      case "om":
        if (g.ClarityOM && g.ClarityOM.openDesk) g.ClarityOM.openDesk();
        break;
      case "focus":
        setFocus(!isFocus());
        break;
      case "help":
        openHelp();
        break;
      default:
        break;
    }
  }

  function scrollToCurriculum() {
    var ids = [
      "junior-curriculum-card",
      "junior-high-curriculum-card",
      "daily-hs-curriculum-card",
      "dai-university-curriculum-card"
    ];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.offsetParent !== null) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    var plaque = document.getElementById("clarity-phase-plaque-rail");
    if (plaque) plaque.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openCompass() {
    var m = document.getElementById("clarity-ux-compass");
    if (!m) return;
    var q = document.getElementById("cux-q");
    if (q) q.value = "";
    renderCompassItems("");
    m.hidden = false;
    m.classList.add("show");
    setTimeout(function () {
      if (q) q.focus();
    }, 50);
  }

  function closeCompass() {
    var m = document.getElementById("clarity-ux-compass");
    if (!m) return;
    m.hidden = true;
    m.classList.remove("show");
  }

  function renderCompassItems(filter) {
    var host = document.getElementById("cux-list");
    if (!host || !policy) return;
    var f = String(filter || "").toLowerCase().trim();
    var items = (policy.compass || []).filter(function (c) {
      if (!f) return true;
      return (
        (c.label && c.label.toLowerCase().indexOf(f) >= 0) ||
        (c.hint && c.hint.toLowerCase().indexOf(f) >= 0)
      );
    });
    host.innerHTML = items
      .map(function (c, i) {
        return (
          '<button type="button" class="cux-item" data-action="' +
          c.action +
          '" data-idx="' +
          i +
          '"><span class="cux-label">' +
          escape(c.label) +
          '</span><span class="cux-hint">' +
          escape(c.hint) +
          "</span></button>"
        );
      })
      .join("");
  }

  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function ensureCompass() {
    if (document.getElementById("clarity-ux-compass")) return;
    var m = document.createElement("div");
    m.id = "clarity-ux-compass";
    m.className = "clarity-ux-compass";
    m.hidden = true;
    m.innerHTML =
      '<div class="cux-backdrop" data-cux-close="1"></div>' +
      '<div class="cux-panel" role="dialog" aria-label="University compass">' +
      '<div class="cux-head"><span class="cux-kicker">Clarity University</span>' +
      '<span class="cux-keys">Ctrl/⌘ K · Esc</span></div>' +
      '<input type="search" id="cux-q" class="cux-q" placeholder="Go somewhere in the house…" autocomplete="off"/>' +
      '<div id="cux-list" class="cux-list"></div>' +
      '<p class="cux-foot">One active phase · wings on demand · sealed foundation protected</p>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute("data-cux-close")) closeCompass();
    });
    m.addEventListener("click", function (ev) {
      var btn = ev.target.closest && ev.target.closest("[data-action]");
      if (btn) runAction(btn.getAttribute("data-action"));
    });
    var q = document.getElementById("cux-q");
    q.addEventListener("input", function () {
      renderCompassItems(q.value);
    });
    q.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        var first = document.querySelector("#cux-list .cux-item");
        if (first) runAction(first.getAttribute("data-action"));
      }
      if (ev.key === "Escape") closeCompass();
    });
  }

  function ensureFab() {
    if (document.getElementById("clarity-ux-fab")) return;
    var fab = document.createElement("button");
    fab.type = "button";
    fab.id = "clarity-ux-fab";
    fab.className = "clarity-ux-fab";
    fab.setAttribute("aria-label", "Open university compass");
    fab.innerHTML = "<span>✦</span>";
    fab.title = "Compass (Ctrl/⌘ K)";
    fab.onclick = function () {
      openCompass();
    };
    document.body.appendChild(fab);
  }

  function openHelp() {
    var m = document.getElementById("clarity-ux-help");
    if (!m) {
      m = document.createElement("div");
      m.id = "clarity-ux-help";
      m.className = "clarity-ux-help";
      m.hidden = true;
      m.innerHTML =
        '<div class="cuh-backdrop" data-cuh-close="1"></div>' +
        '<div class="cuh-panel">' +
        '<button type="button" class="cuh-x" data-cuh-close="1">×</button>' +
        '<div class="cuh-stamp">HOUSE MAP</div>' +
        "<h2>How Clarity University works</h2>" +
        '<ol class="cuh-steps">' +
        "<li><b>Banner stays.</b> Prayer times and plaque above; content scrolls under.</li>" +
        "<li><b>One phase at a time.</b> Finish modules → spark quiz → phase quiz → diploma.</li>" +
        "<li><b>Teacher signs.</b> Present the seal to the next phase teacher.</li>" +
        "<li><b>Compass (✦).</b> Jump to Chancellor, Faculty, Lab, Registrar without clutter.</li>" +
        "<li><b>Study focus.</b> Dims admin chrome so only learning remains.</li>" +
        "<li><b>Ask a living teacher</b> for prayer form and rulings — this house is educational.</li>" +
        "</ol>" +
        '<button type="button" class="cdm-btn" id="cuh-go">Start learning</button>' +
        "</div>";
      document.body.appendChild(m);
      m.addEventListener("click", function (ev) {
        if (ev.target && ev.target.getAttribute("data-cuh-close")) {
          m.hidden = true;
          m.classList.remove("show");
        }
      });
      document.getElementById("cuh-go").onclick = function () {
        m.hidden = true;
        m.classList.remove("show");
        runAction("curriculum");
      };
    }
    m.hidden = false;
    m.classList.add("show");
  }

  function firstRun() {
    if (lsStr(SEEN_KEY, "")) return;
    lsSet(SEEN_KEY, { at: Date.now(), v: 1 });
    setTimeout(function () {
      openHelp();
    }, 1800);
  }

  function bindKeys() {
    document.addEventListener("keydown", function (ev) {
      var meta = ev.metaKey || ev.ctrlKey;
      if (meta && (ev.key === "k" || ev.key === "K")) {
        ev.preventDefault();
        openCompass();
        return;
      }
      if (ev.key === "Escape") {
        closeCompass();
        if (isFocus()) setFocus(false);
        return;
      }
      if (meta && ev.key === ".") {
        ev.preventDefault();
        setFocus(!isFocus());
      }
    });
  }

  function calmGateSwitcher() {
    /* Soften gate switcher noise on junior density */
    var gs = document.querySelector(".clarity-gate-switcher");
    if (!gs) return;
    gs.classList.add("ux-gate-calm");
  }

  g.ClarityUX = {
    openCompass: openCompass,
    setFocus: setFocus,
    applyDensity: applyDensity,
    openHelp: openHelp
  };

  function boot() {
    fetch(BASE + "ux-policy.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        policy = j;
        ensureCompass();
        ensureFab();
        bindKeys();
        calmGateSwitcher();
        if (isFocus()) document.documentElement.setAttribute("data-ux-focus", "1");
        applyDensity();
        firstRun();
        g.addEventListener("clarity-curriculum-phase", function () {
          applyDensity();
        });
        setInterval(applyDensity, 15000);
        try {
          console.info(
            "%c Grand Opening UX ",
            "background:#0d4f3c;color:#f0e6c8",
            "Compass · focus · density"
          );
        } catch (e) {}
      })
      .catch(function () {
        policy = { compass: [], densityByPhase: {} };
        ensureCompass();
        ensureFab();
        bindKeys();
      });
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 1400);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 3600);
    });
  } else setTimeout(boot, 3600);
})(typeof window !== "undefined" ? window : this);
