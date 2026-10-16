/**
 * Campus Guided Learning — self-contained interactive module
 * No ClarityLazyWings dependency. Educational personas only.
 * 20261016GUIDE
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_ROLES_V1__) return;
  g.__CU_CAMPUS_ROLES_V1__ = true;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "/";
  }

  function allowedPage() {
    var p = path();
    return p === "/campus" || p === "/campus/" || p === "/campus/desk" || p === "/campus/desk/";
  }

  var ROLES = {
    faculty: {
      icon: "🎓",
      title: "Faculty · Guide",
      steps: [
        "Open the Seeker room for foundations (tawḥīd, short modules).",
        "Complete modules in order; spark quiz unlocks the next.",
        "When Phase 1 quiz is passed, Practice room unlocks."
      ],
      actions: [
        { label: "Open Seeker room", href: "/campus/desk/seeker/" },
        { label: "Campus map", href: "/campus/" },
        { label: "How phases", href: "#desk-how-phases" }
      ]
    },
    security: {
      icon: "◎",
      title: "Security · Privacy adab",
      steps: [
        "Vault and notes stay on this device — not on our servers.",
        "Never share a vault passphrase in chat or screenshots.",
        "Hard-refresh if a page looks stuck; clear site data only if you accept losing local progress."
      ],
      actions: [
        { label: "Open Vault", href: "/vault/" },
        { label: "Charter limits", href: "/charter/" }
      ]
    },
    it: {
      icon: "💻",
      title: "IT · Device help",
      steps: [
        "Use Day / Night / Auto in the banner for readable contrast.",
        "If scripts look old, hard-refresh (cache). Progress is localStorage.",
        "Lab stations need mic permission only when you choose Record."
      ],
      actions: [
        { label: "Lab hub", href: "/lab/" },
        { label: "Map", href: "/campus/" }
      ]
    },
    om: {
      icon: "◇",
      title: "O&M · Steady practice",
      steps: [
        "Prefer a short daily module over rare long sessions.",
        "After a desk module, open one Lab craft (tajweed / arabic).",
        "Adhkār window follows your device time on /adhkar/."
      ],
      actions: [
        { label: "Adhkār", href: "/adhkar/" },
        { label: "Tajweed lab", href: "/lab/tajweed/" },
        { label: "Arabic lab", href: "/lab/arabic/" }
      ]
    },
    registrar: {
      icon: "📋",
      title: "Registrar · Path record",
      steps: [
        "Phase unlock keys live in this browser only.",
        "There is no remote transcript or certificate authority here.",
        "Educational path: Seeker → Practice → Consistency → Transmission."
      ],
      actions: [
        { label: "Continue Seeker", href: "/campus/desk/seeker/" },
        { label: "Journey", href: "/journey/" }
      ]
    }
  };

  function ensureCss() {
    if (document.getElementById("cu-guided-css")) return;
    var s = document.createElement("style");
    s.id = "cu-guided-css";
    s.textContent =
      ".cu-campus-roles{max-width:min(52rem,100%);margin:.65rem auto;padding:.85rem 1rem;border-radius:16px;border:1px solid rgba(184,166,135,.35);background:rgba(21,32,28,.95);color:inherit}" +
      "html[data-theme=light] .cu-campus-roles{background:#fffef8}" +
      ".cu-roles-title{margin:0 0 .25rem;font-size:1.05rem;color:#d4b45a}" +
      ".cu-roles-lead{margin:0 0 .55rem;font-size:.82rem;opacity:.88}" +
      ".cu-roles-row{display:flex;flex-wrap:wrap;gap:.4rem;margin:.35rem 0}" +
      ".cu-roles-btn{min-height:40px;padding:.4rem .75rem;border-radius:999px;border:1px solid rgba(30,125,94,.35);background:rgba(30,125,94,.12);color:inherit;font-weight:700;font-size:.78rem;cursor:pointer}" +
      ".cu-roles-btn[aria-pressed=true]{background:#1e7d5e;color:#fff;border-color:#1e7d5e}" +
      ".cu-roles-panel{margin-top:.55rem;padding:.75rem .85rem;border-radius:12px;border:1px solid rgba(184,166,135,.3);background:rgba(0,0,0,.18);font-size:.86rem;line-height:1.45}" +
      "html[data-theme=light] .cu-roles-panel{background:rgba(42,35,25,.05)}" +
      ".cu-roles-panel h3{margin:0 0 .35rem;font-size:.95rem;color:#d4b45a}" +
      ".cu-roles-panel ol{margin:.25rem 0 .5rem 1.1rem;padding:0}" +
      ".cu-roles-actions{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem}" +
      ".cu-roles-actions a{display:inline-flex;padding:.35rem .7rem;border-radius:999px;background:#1e7d5e;color:#fff;text-decoration:none;font-weight:700;font-size:.78rem}" +
      ".cu-roles-note{margin:.5rem 0 0;font-size:.72rem;opacity:.75}";
    document.head.appendChild(s);
  }

  function renderPanel(id) {
    var r = ROLES[id];
    if (!r) return;
    var panel = document.getElementById("cu-roles-faculty-panel");
    if (!panel) return;
    panel.hidden = false;
    panel.className = "cu-roles-panel";
    panel.innerHTML =
      "<h3>" +
      r.icon +
      " " +
      r.title +
      "</h3><ol>" +
      r.steps
        .map(function (s) {
          return "<li>" + s + "</li>";
        })
        .join("") +
      '</ol><div class="cu-roles-actions">' +
      r.actions
        .map(function (a) {
          return '<a href="' + a.href + '">' + a.label + "</a>";
        })
        .join("") +
      '</div><p class="cu-roles-note">Educational personas only — not living staff, ijāzah, or fatwa authority.</p>';

    document.querySelectorAll(".cu-roles-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-role") === id ? "true" : "false");
    });
  }

  function mount() {
    if (!allowedPage()) return;
    if (document.getElementById("cu-campus-roles")) return;
    ensureCss();

    var box = document.createElement("section");
    box.id = "cu-campus-roles";
    box.className = "cu-campus-roles";
    box.setAttribute("aria-label", "Campus guided learning");
    box.innerHTML =
      '<h2 class="cu-roles-title">Campus roles · guided learning</h2>' +
      '<p class="cu-roles-lead">Tap a role for interactive steps and links. Works fully on-device — no wing loader required.</p>' +
      '<div class="cu-roles-row" role="toolbar">' +
      Object.keys(ROLES)
        .map(function (id) {
          return (
            '<button type="button" class="cu-roles-btn" data-role="' +
            id +
            '">' +
            ROLES[id].icon +
            " " +
            id.charAt(0).toUpperCase() +
            id.slice(1) +
            "</button>"
          );
        })
        .join("") +
      '</div><div id="cu-roles-faculty-panel" hidden></div>';

    var host = document.querySelector("main.cu-wrap") || document.querySelector("main") || document.body;
    var anchor = document.getElementById("cu-continue") || document.querySelector(".cu-pills");
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(box, anchor.nextSibling);
    } else {
      var foot = document.querySelector("footer.cu-foot");
      if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot);
      else host.appendChild(box);
    }

    box.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        renderPanel(btn.getAttribute("data-role"));
      });
    });

    /* Default open Faculty so interaction is obvious */
    renderPanel("faculty");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  setTimeout(mount, 400);
})(typeof window !== "undefined" ? window : this);
