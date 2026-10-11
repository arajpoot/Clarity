/* Clarity University OS — Campus Shell
 * Phase A: shelf Legacy/Print/Gate under Campus tools
 * Phase B: visible curriculum stage under plaques
 * Phase C: light bottom-rail campus styling (CSS)
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_SHELL__) return;
  g.__CLARITY_CAMPUS_SHELL__ = true;

  function qs(s, root) {
    return (root || document).querySelector(s);
  }
  function qsa(s, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(s));
  }

  function markShell() {
    try {
      document.documentElement.setAttribute("data-campus-shell", "1");
    } catch (e) {}
  }

  /** Find legacy tool buttons by text / title */
  function findToolButtons() {
    var found = { legacy: null, print: null, gate: null };
    var buttons = qsa("button, a.button, .nav-btn, [role='button']");
    buttons.forEach(function (btn) {
      if (btn.closest && btn.closest(".campus-tools-panel")) return;
      var t = ((btn.textContent || "") + " " + (btn.getAttribute("title") || "") + " " + (btn.id || "")).toLowerCase();
      if (!found.legacy && /legacy\s*pack/.test(t)) found.legacy = btn;
      if (!found.print && /print\s*vault/.test(t)) found.print = btn;
      if (!found.gate && /gate\s*mode/.test(t)) found.gate = btn;
    });
    return found;
  }

  function shelfTools() {
    if (document.getElementById("campus-tools-wrap")) return;
    var tools = findToolButtons();
    if (!tools.legacy && !tools.print && !tools.gate) return;

    var host =
      qs(".nav-right") ||
      qs("#clarity-global-nav .nav-left") ||
      qs("#clarity-global-nav") ||
      qs(".global-nav");
    if (!host) return;

    var wrap = document.createElement("div");
    wrap.id = "campus-tools-wrap";
    wrap.className = "campus-tools-host";
    wrap.style.position = "relative";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "campus-tools-toggle";
    toggle.id = "campus-tools-toggle";
    toggle.textContent = "Campus tools";
    toggle.setAttribute("aria-expanded", "false");

    var panel = document.createElement("div");
    panel.className = "campus-tools-panel";
    panel.id = "campus-tools-panel";

    function slot(label, btn) {
      if (!btn) return;
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick = function (ev) {
        ev.preventDefault();
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        try {
          btn.click();
        } catch (e) {}
      };
      panel.appendChild(b);
      /* hide original in place */
      try {
        btn.classList.add("campus-shelved");
        btn.style.display = "none";
        btn.setAttribute("aria-hidden", "true");
      } catch (e2) {}
    }

    slot("Legacy pack", tools.legacy);
    slot("Print vault pack", tools.print);
    slot("Gate mode", tools.gate);

    toggle.onclick = function () {
      var open = panel.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    document.addEventListener("click", function (ev) {
      if (!wrap.contains(ev.target)) {
        panel.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    wrap.appendChild(toggle);
    wrap.appendChild(panel);
    host.appendChild(wrap);
  }

  /** Curriculum stage under name plaque */
  function ensureStage() {
    if (document.getElementById("clarity-campus-stage")) return document.getElementById("clarity-campus-stage");
    var stage = document.createElement("section");
    stage.id = "clarity-campus-stage";
    stage.setAttribute("aria-label", "University learning stage");
    stage.innerHTML = '<p class="campus-stage-label">Learning stage · Phase desk</p><div id="campus-stage-body"></div>';

    var after =
      document.getElementById("clarity-name-plaque-rail") ||
      document.getElementById("clarity-phase-plaque-rail") ||
      document.getElementById("clarity-top-duo");
    if (after && after.parentNode) {
      if (after.nextSibling) after.parentNode.insertBefore(stage, after.nextSibling);
      else after.parentNode.appendChild(stage);
    } else {
      var main =
        document.getElementById("main-application-workspace") ||
        document.getElementById("main-application") ||
        document.body;
      main.insertBefore(stage, main.firstChild);
    }
    return stage;
  }

  function adoptCurriculumCards() {
    var stage = ensureStage();
    var body = document.getElementById("campus-stage-body") || stage;
    var ids = [
      "junior-curriculum-card",
      "junior-high-curriculum-card",
      "daily-hs-curriculum-card",
      "dai-university-curriculum-card"
    ];
    ids.forEach(function (id) {
      var card = document.getElementById(id);
      if (!card) return;
      if (body.contains(card)) return;
      try {
        body.appendChild(card);
        card.hidden = false;
        card.style.removeProperty("display");
        card.classList.remove("gate-hidden", "hidden");
      } catch (e) {}
    });
  }

  /** Soft-retitle bottom rail for campus feel (visual only) */
  function polishBottomRail() {
    var map = {
      reminder: "Reminder",
      reality: "Reality",
      reflection: "Reflection",
      action: "Action",
      vault: "Vault"
    };
    qsa("[data-rrra], .rrra-tab, .rrra-dock button, #rrra-dock button").forEach(function (btn) {
      var key = (btn.getAttribute("data-rrra") || btn.getAttribute("data-hub") || "").toLowerCase();
      var tx = (btn.textContent || "").toLowerCase();
      if (!key) {
        if (/reminder/.test(tx)) key = "reminder";
        else if (/reality/.test(tx)) key = "reality";
        else if (/reflection/.test(tx)) key = "reflection";
        else if (/action/.test(tx)) key = "action";
        else if (/amana|vault/.test(tx)) key = "vault";
      }
      if (key && map[key] && btn.childNodes.length) {
        /* leave labels; CSS handles chrome */
        btn.setAttribute("data-campus-rail", key);
      }
    });
  }

  function run() {
    markShell();
    shelfTools();
    ensureStage();
    adoptCurriculumCards();
    polishBottomRail();
  }

  g.ClarityCampus = {
    run: run,
    adoptCurriculumCards: adoptCurriculumCards,
    shelfTools: shelfTools
  };

  function boot() {
    run();
    setTimeout(run, 400);
    setTimeout(run, 1200);
    setTimeout(run, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(run, 100);
    setTimeout(adoptCurriculumCards, 300);
  });
  g.addEventListener("clarity-curriculum-phase", function () {
    setTimeout(adoptCurriculumCards, 80);
  });
  document.addEventListener("clarity-rrra-change", function () {
    setTimeout(adoptCurriculumCards, 60);
  });

  try {
    console.info("%c Campus Shell ", "background:#0d4f3c;color:#f0e6c8", "legacy tools shelved · stage open");
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
