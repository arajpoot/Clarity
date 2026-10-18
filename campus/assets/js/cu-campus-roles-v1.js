/**
 * Campus Guided Roles — RP0+RP1
 * Prefer #cu-roles-host · single instance · modal panel
 * Educational personas only — not fatwa / ijāzah.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_ROLES_V1__) return;
  g.__CU_CAMPUS_ROLES_V1__ = true;

  var VER = "20261018RP1";

  var ROLES = {
    faculty: {
      icon: "◈",
      title: "Faculty · Guide",
      blurb: "Path order and steady modules.",
      steps: [
        "Open the Seeker room for foundations (tawḥīd, short modules).",
        "Complete modules in order; spark quiz unlocks the next.",
        "When the Phase 1 quiz is passed, Practice room unlocks."
      ],
      actions: [
        { label: "Open Seeker room", href: "/campus/desk/seeker/" },
        { label: "Campus map", href: "/campus/" },
        { label: "Charter", href: "/charter/" }
      ]
    },
    security: {
      icon: "◎",
      title: "Security · Privacy adab",
      blurb: "Vault and notes stay on this device.",
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
      icon: "▣",
      title: "IT · Device help",
      blurb: "Theme, cache, and lab permissions.",
      steps: [
        "Use Day / Night / Auto in the banner for readable contrast.",
        "If scripts look old, hard-refresh (cache). Progress is localStorage.",
        "Lab stations need mic permission only when you choose Record."
      ],
      actions: [
        { label: "Lab hub", href: "/lab/" },
        { label: "Arabic studio", href: "/lab/arabic/" },
        { label: "Map", href: "/campus/" }
      ]
    },
    om: {
      icon: "◇",
      title: "O&M · Steady practice",
      blurb: "Short daily sessions over rare long ones.",
      steps: [
        "Prefer a short daily module over rare long sessions.",
        "After a desk module, open one Lab craft (tajweed / arabic).",
        "Hajj 2027 language practice is separate from ritual study in Companion."
      ],
      actions: [
        { label: "Tajweed lab", href: "/lab/tajweed/" },
        { label: "Arabic lab", href: "/lab/arabic/" },
        { label: "Hajj 2027 phrases", href: "/lab/arabic/hajj2027/" }
      ]
    },
    registrar: {
      icon: "☰",
      title: "Registrar · Path record",
      blurb: "Transcript, assignments, diploma hall.",
      steps: [
        "Transcript records modules and lab practice on this device.",
        "Assignments are voluntary practice ticks — not grades of īmān.",
        "Diploma Hall is educational recognition only."
      ],
      actions: [
        { label: "Transcript", href: "/campus/transcript/" },
        { label: "Assignments", href: "/campus/assignments/" },
        { label: "Diploma Hall", href: "/campus/diploma/" }
      ]
    }
  };

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "/";
  }

  function allowedPage() {
    var p = path();
    return (
      p === "/campus" ||
      p === "/campus/" ||
      p === "/campus/desk" ||
      p === "/campus/desk/" ||
      p.indexOf("/campus/desk/") === 0
    );
  }

  function ensureCss() {
    if (document.getElementById("cu-campus-roles-css")) return;
    var link = document.createElement("link");
    link.id = "cu-campus-roles-css";
    link.rel = "stylesheet";
    link.href = "/campus/assets/css/cu-campus-roles-v1.css?v=" + VER;
    document.head.appendChild(link);
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

    var overlay = document.createElement("div");
    overlay.id = "cu-role-modal";
    overlay.className = "cu-role-modal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", role.title);

    var steps = role.steps
      .map(function (s, i) {
        return "<li>" + s + "</li>";
      })
      .join("");
    var actions = (role.actions || [])
      .map(function (a) {
        return (
          '<a class="cu-role-action" href="' +
          a.href +
          '">' +
          a.label +
          "</a>"
        );
      })
      .join("");

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
      "<ol class=\"cu-role-steps\">" +
      steps +
      "</ol>" +
      '<div class="cu-role-actions">' +
      actions +
      "</div>" +
      '<p class="cu-role-disc">Not living staff, ijāzah, or fatwa authority.</p>' +
      "</div>";

    document.body.appendChild(overlay);
    document.documentElement.style.overflow = "hidden";

    overlay.querySelector(".cu-role-modal-close").onclick = closeModal;
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
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

    /* inline panel mirror for host */
    var panel = document.getElementById("cu-roles-faculty-panel");
    if (panel) {
      panel.hidden = false;
      panel.innerHTML =
        "<strong>" +
        role.title +
        "</strong><p>" +
        (role.blurb || "") +
        '</p><p class="cu-roles-status">Modal open — or use the action links above.</p>';
    }
  }

  function renderToolbar(box) {
    box.innerHTML =
      '<p class="cu-roles-lead">Tap a role for a guide card. On-device only — no wing loader.</p>' +
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
      '</div><div id="cu-roles-faculty-panel" class="cu-roles-faculty-panel" hidden></div>';

    box.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal(btn.getAttribute("data-role"));
      });
    });
  }

  function mount() {
    if (!allowedPage()) return;
    ensureCss();

    /* RP0: prefer stream host inside details */
    var host = document.getElementById("cu-roles-host");
    var existing = document.getElementById("cu-campus-roles");

    if (host) {
      if (existing && existing.parentNode !== host) {
        try {
          existing.remove();
        } catch (e) {}
        existing = null;
      }
      var box = existing || document.createElement("section");
      box.id = "cu-campus-roles";
      box.className = "cu-campus-roles cu-roles-in-host";
      box.setAttribute("aria-label", "Campus guided learning");
      if (!host.contains(box)) {
        host.innerHTML = "";
        host.appendChild(box);
      }
      renderToolbar(box);
      return;
    }

    if (existing) return;

    var box2 = document.createElement("section");
    box2.id = "cu-campus-roles";
    box2.className = "cu-campus-roles";
    box2.setAttribute("aria-label", "Campus guided learning");
    renderToolbar(box2);

    var main = document.querySelector("main.cu-wrap") || document.querySelector("main") || document.body;
    var anchor = document.getElementById("cu-continue") || document.querySelector(".cu-pills");
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(box2, anchor.nextSibling);
    } else {
      main.appendChild(box2);
    }
  }

  function boot() {
    try {
      mount();
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      boot();
      setTimeout(boot, 300);
    });
  } else {
    boot();
    setTimeout(boot, 300);
  }

  g.ClarityCampusRoles = { open: openModal, close: closeModal, ROLES: ROLES };
})(typeof window !== "undefined" ? window : this);
