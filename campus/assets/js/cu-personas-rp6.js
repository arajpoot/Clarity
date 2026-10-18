
/**
 * Clarity University Personas RP2-RP6
 * Tips/interview · surface pack · dock · desk/lab embed
 * Educational only — not fatwa / ijazah / living staff.
 */
(function (g) {
  "use strict";
  if (g.__CU_PERSONAS_RP6__) return;
  g.__CU_PERSONAS_RP6__ = true;

  var VER = "20261018RP6";
  var TIPS_URL = "/campus/assets/data/persona-tips-v1.json?v=" + VER;
  var tipsCache = null;
  var tipIx = {};

  var ROLES = {
    faculty: {
      icon: "◈",
      title: "Faculty · Guide",
      blurb: "Path order and steady modules.",
      interview: "A short guidance exchange — educational persona only.",
      steps: [
        "Open Seeker for foundations (tawhid, short modules).",
        "Complete modules in order; quizzes unlock the next door.",
        "After Phase 1, Practice opens for new-Muslim skills."
      ],
      actions: [
        { label: "Seeker desk", href: "/campus/desk/seeker/" },
        { label: "Map", href: "/campus/" },
        { label: "Charter", href: "/charter/" }
      ]
    },
    security: {
      icon: "◎",
      title: "Security · Privacy adab",
      blurb: "Vault and notes stay on this device.",
      interview: "Privacy checklist before you store amanah.",
      steps: [
        "Vault data stays on-device — not on our servers.",
        "Never share a passphrase in chat or screenshots.",
        "Clear site data only if you accept losing local progress."
      ],
      actions: [
        { label: "Vault", href: "/vault/" },
        { label: "Charter limits", href: "/charter/" }
      ]
    },
    it: {
      icon: "▣",
      title: "IT · Device help",
      blurb: "Theme, cache, lab permissions.",
      interview: "Device lab — quick fixes.",
      steps: [
        "Use Day / Night / Auto for readable contrast.",
        "Hard-refresh after deploys if UI looks stale.",
        "Mic only when you choose Record — Hear uses playback."
      ],
      actions: [
        { label: "Lab", href: "/lab/" },
        { label: "Arabic", href: "/lab/arabic/" },
        { label: "Tajweed", href: "/lab/tajweed/" }
      ]
    },
    om: {
      icon: "◇",
      title: "O&M · Steady practice",
      blurb: "Short daily sessions.",
      interview: "Operations coach — rhythm over intensity.",
      steps: [
        "Prefer a short daily module over rare long sessions.",
        "After desk study, open one lab craft.",
        "Language packs help travel; rites need a teacher."
      ],
      actions: [
        { label: "Arabic", href: "/lab/arabic/" },
        { label: "Hajj 2027 phrases", href: "/lab/arabic/hajj2027/" },
        { label: "Tajweed", href: "/lab/tajweed/" }
      ]
    },
    registrar: {
      icon: "☰",
      title: "Registrar · Path record",
      blurb: "Transcript and assignments.",
      interview: "Records office — local only.",
      steps: [
        "Transcript logs modules and lab practice on this device.",
        "Assignments are voluntary practice ticks.",
        "Diploma Hall is educational recognition only."
      ],
      actions: [
        { label: "Transcript", href: "/campus/transcript/" },
        { label: "Assignments", href: "/campus/assignments/" },
        { label: "Diploma", href: "/campus/diploma/" }
      ]
    }
  };

  function pathName() {
    return (location.pathname || "").replace(/\/+$/, "") || "/";
  }

  function detectPhase() {
    var p = pathName();
    if (p.indexOf("/desk/practice") >= 0) return "practice";
    if (p.indexOf("/desk/consistency") >= 0) return "consistency";
    if (p.indexOf("/desk/transmission") >= 0) return "transmission";
    if (p.indexOf("/desk/seeker") >= 0) return "seeker";
    return "default";
  }

  function loadTips(cb) {
    if (tipsCache) {
      cb(tipsCache);
      return;
    }
    fetch(TIPS_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("tips");
        return r.json();
      })
      .then(function (j) {
        tipsCache = j;
        cb(j);
      })
      .catch(function () {
        tipsCache = { byRole: {} };
        cb(tipsCache);
      });
  }

  function nextTip(roleId, phase) {
    phase = phase || detectPhase();
    var list = [];
    try {
      var by = (tipsCache && tipsCache.byRole && tipsCache.byRole[roleId]) || {};
      list = by[phase] || by.default || [];
    } catch (e) {}
    if (!list.length) {
      return "One honest step is enough for now.";
    }
    var key = roleId + ":" + phase;
    var i = tipIx[key] || 0;
    var tip = list[i % list.length];
    tipIx[key] = i + 1;
    return tip;
  }

  function ensureCss() {
    if (document.getElementById("cu-campus-roles-css")) return;
    var l = document.createElement("link");
    l.id = "cu-campus-roles-css";
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-campus-roles-v1.css?v=" + VER;
    document.head.appendChild(l);
    if (!document.getElementById("cu-personas-dock-css")) {
      var l2 = document.createElement("link");
      l2.id = "cu-personas-dock-css";
      l2.rel = "stylesheet";
      l2.href = "/campus/assets/css/cu-personas-dock-v1.css?v=" + VER;
      document.head.appendChild(l2);
    }
  }

  function closeModal() {
    var m = document.getElementById("cu-role-modal");
    if (m) m.remove();
    document.documentElement.style.overflow = "";
  }

  function openModal(roleId) {
    var role = ROLES[roleId];
    if (!role) return;
    closeModal();
    ensureCss();

    function paint(tip) {
      var steps = role.steps
        .map(function (s) {
          return "<li>" + s + "</li>";
        })
        .join("");
      var actions = (role.actions || [])
        .map(function (a) {
          return '<a class="cu-role-action" href="' + a.href + '">' + a.label + "</a>";
        })
        .join("");

      var overlay = document.createElement("div");
      overlay.id = "cu-role-modal";
      overlay.className = "cu-role-modal";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML =
        '<div class="cu-role-modal-card">' +
        '<button type="button" class="cu-role-modal-close" aria-label="Close">×</button>' +
        '<p class="cu-role-modal-kicker">Campus guide · educational persona</p>' +
        "<h2>" +
        role.icon +
        " " +
        role.title +
        "</h2>" +
        '<p class="cu-role-modal-blurb">' +
        (role.blurb || "") +
        "</p>" +
        '<div class="cu-role-interview">' +
        "<strong>Guide line</strong>" +
        "<p>" +
        (role.interview || "") +
        "</p>" +
        '<blockquote class="cu-role-tip">“' +
        tip +
        '”</blockquote>' +
        '<button type="button" class="cu-role-tip-next" data-tip-role="' +
        roleId +
        '">Another tip</button>' +
        "</div>" +
        '<ol class="cu-role-steps">' +
        steps +
        "</ol>" +
        '<div class="cu-role-actions">' +
        actions +
        "</div>" +
        '<p class="cu-role-disc">Not living staff, ijazah, or fatwa authority.</p>' +
        "</div>";

      document.body.appendChild(overlay);
      document.documentElement.style.overflow = "hidden";
      overlay.querySelector(".cu-role-modal-close").onclick = closeModal;
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeModal();
      });
      var tipBtn = overlay.querySelector(".cu-role-tip-next");
      if (tipBtn) {
        tipBtn.onclick = function () {
          var q = overlay.querySelector(".cu-role-tip");
          if (q) q.textContent = "“" + nextTip(roleId) + "”";
        };
      }
      document.addEventListener(
        "keydown",
        function onKey(e) {
          if (e.key === "Escape") {
            closeModal();
            document.removeEventListener("keydown", onKey);
          }
        },
        { once: true }
      );
    }

    loadTips(function () {
      paint(nextTip(roleId));
    });
  }

  function renderToolbar(box) {
    box.innerHTML =
      '<p class="cu-roles-lead">Tap a role for a guide card with interview tips. On-device only.</p>' +
      '<div class="cu-roles-row" role="toolbar">' +
      Object.keys(ROLES)
        .map(function (id) {
          var r = ROLES[id];
          return (
            '<button type="button" class="cu-roles-btn" data-role="' +
            id +
            '">' +
            r.icon +
            " " +
            id.charAt(0).toUpperCase() +
            id.slice(1) +
            "</button>"
          );
        })
        .join("") +
      "</div>";
    box.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-role"));
      });
    });
  }

  function mountHost() {
    var p = pathName();
    var onCampus =
      p === "/campus" ||
      p === "/campus/" ||
      p === "/campus/desk" ||
      p.indexOf("/campus/desk") === 0;
    if (!onCampus) return;

    ensureCss();
    var host = document.getElementById("cu-roles-host");
    var existing = document.getElementById("cu-campus-roles");
    if (host) {
      if (existing && existing.parentNode !== host) {
        try {
          existing.remove();
        } catch (e) {}
      }
      var box = document.getElementById("cu-campus-roles") || document.createElement("section");
      box.id = "cu-campus-roles";
      box.className = "cu-campus-roles cu-roles-in-host";
      if (!host.contains(box)) {
        host.innerHTML = "";
        host.appendChild(box);
      }
      renderToolbar(box);
      return;
    }
    if (document.getElementById("cu-campus-roles")) return;
  }

  /* RP4 — floating dock */
  function mountDock() {
    if (document.getElementById("cu-personas-dock")) return;
    var p = pathName();
    var show =
      p.indexOf("/campus") === 0 ||
      p.indexOf("/lab") === 0 ||
      p.indexOf("/vault") === 0 ||
      p.indexOf("/library") === 0 ||
      p.indexOf("/charter") === 0;
    if (!show) return;

    ensureCss();
    var dock = document.createElement("div");
    dock.id = "cu-personas-dock";
    dock.className = "cu-personas-dock";
    dock.innerHTML =
      '<button type="button" class="cu-personas-dock-toggle" aria-expanded="false" aria-label="Campus guides">◈ Guides</button>' +
      '<div class="cu-personas-dock-panel" hidden>' +
      Object.keys(ROLES)
        .map(function (id) {
          return (
            '<button type="button" class="cu-personas-dock-item" data-role="' +
            id +
            '">' +
            ROLES[id].icon +
            " " +
            ROLES[id].title.split("·")[0].trim() +
            "</button>"
          );
        })
        .join("") +
      "</div>";
    document.body.appendChild(dock);

    var toggle = dock.querySelector(".cu-personas-dock-toggle");
    var panel = dock.querySelector(".cu-personas-dock-panel");
    toggle.onclick = function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      dock.classList.toggle("open", open);
    };
    dock.querySelectorAll("[data-role]").forEach(function (b) {
      b.onclick = function () {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        dock.classList.remove("open");
        openModal(b.getAttribute("data-role"));
      };
    });
  }

  /* RP5 — embed footer on desk / lab */
  function mountEmbed() {
    var p = pathName();
    var embed =
      p.indexOf("/campus/desk/") === 0 ||
      p.indexOf("/lab/") === 0 ||
      p === "/lab";
    if (!embed) return;
    if (document.getElementById("cu-personas-embed")) return;

    var main = document.querySelector("main.cu-wrap") || document.querySelector("main");
    if (!main) return;
    var el = document.createElement("div");
    el.id = "cu-personas-embed";
    el.className = "cu-personas-embed";
    var pref = "faculty";
    if (p.indexOf("/lab") === 0) pref = "it";
    if (p.indexOf("/vault") === 0) pref = "security";
    el.innerHTML =
      '<span>Need a guide?</span> ' +
      '<button type="button" class="cu-roles-btn" data-role="' +
      pref +
      '">' +
      (ROLES[pref].icon + " " + ROLES[pref].title.split("·")[0].trim()) +
      "</button> " +
      '<button type="button" class="cu-roles-btn" data-role="om">◇ O&amp;M</button> ' +
      '<button type="button" class="cu-roles-btn" data-role="faculty">◈ Faculty</button>';
    main.appendChild(el);
    el.querySelectorAll("[data-role]").forEach(function (b) {
      b.onclick = function () {
        openModal(b.getAttribute("data-role"));
      };
    });
  }

  function boot() {
    try {
      loadTips(function () {});
      mountHost();
      mountDock();
      mountEmbed();
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 50);
      setTimeout(boot, 400);
    });
  } else {
    setTimeout(boot, 50);
    setTimeout(boot, 400);
  }

  g.ClarityPersonas = {
    open: openModal,
    close: closeModal,
    tip: function (role) {
      loadTips(function () {
        return nextTip(role || "faculty");
      });
    },
    ROLES: ROLES,
    VER: VER
  };
})(typeof window !== "undefined" ? window : this);
