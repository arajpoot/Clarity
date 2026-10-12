/* Floating systems helper dock — IT · O&M · Security · Library · Faculty
 * Reactivates interactive helper tiles for university desk/map.
 * Personas are educational only — not living staff or fatwa authority.
 */
(function (g) {
  "use strict";
  if (g.__CU_HELPER_DOCK_V1__) return;
  g.__CU_HELPER_DOCK_V1__ = true;

  var HELPERS = [
    { id: "faculty", label: "Faculty", icon: "📖", title: "Faculty desk", api: "ClarityFaculty" },
    { id: "chancellor", label: "Chancellor", icon: "🏛", title: "Chancellor office", api: "ClarityChancellor" },
    { id: "registrar", label: "Registrar", icon: "📋", title: "Registrar", api: "ClarityRegistrar" },
    { id: "lab", label: "Lab", icon: "🧪", title: "Craft Laboratory", api: "ClarityLab", href: "/lab/" },
    { id: "library", label: "Library", icon: "📚", title: "Librarian", api: "ClarityLibrarian", href: "/library/" },
    { id: "it", label: "IT", icon: "💻", title: "IT desk", api: "ClarityIT" },
    { id: "om", label: "O&M", icon: "🔧", title: "Operations", api: "ClarityOM" },
    { id: "security", label: "Security", icon: "◎", title: "Security audit", api: "ClaritySecurity" }
  ];

  function injectCss() {
    if (document.getElementById("cu-helper-dock-css")) return;
    var s = document.createElement("style");
    s.id = "cu-helper-dock-css";
    s.textContent =
      "#cu-helper-dock{position:fixed;right:0.65rem;bottom:4.5rem;z-index:8000;display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;pointer-events:none}" +
      "#cu-helper-dock *{pointer-events:auto}" +
      "#cu-helper-dock .cu-hd-toggle{width:3rem;height:3rem;border-radius:50%;border:1px solid rgba(224,197,106,.45);" +
      "background:linear-gradient(145deg,#1fa67a,#0f4c3a);color:#f7f3eb;font-size:1.15rem;font-weight:800;cursor:pointer;" +
      "box-shadow:0 8px 24px rgba(0,0,0,.35)}" +
      "#cu-helper-dock .cu-hd-panel{display:none;flex-direction:column;gap:0.35rem;padding:0.45rem;border-radius:16px;" +
      "border:1px solid rgba(224,197,106,.35);background:rgba(8,16,14,.94);backdrop-filter:blur(10px);" +
      "box-shadow:0 12px 32px rgba(0,0,0,.4);min-width:9.5rem}" +
      "#cu-helper-dock.open .cu-hd-panel{display:flex}" +
      "#cu-helper-dock .cu-hd-tile{display:flex;align-items:center;gap:0.45rem;padding:0.45rem 0.65rem;border-radius:12px;" +
      "border:1px solid rgba(224,197,106,.22);background:rgba(0,0,0,.28);color:#f3e6c0;font-size:0.78rem;font-weight:700;" +
      "cursor:pointer;text-align:left;width:100%}" +
      "#cu-helper-dock .cu-hd-tile:hover{border-color:rgba(224,197,106,.55);background:rgba(31,166,122,.2)}" +
      "#cu-helper-dock .cu-hd-tile .ico{font-size:1rem;width:1.4rem;text-align:center}" +
      "#cu-helper-dock .cu-hd-tile.loading{opacity:0.55}" +
      "#cu-helper-dock .cu-hd-hint{font-size:0.65rem;color:rgba(234,243,238,.55);padding:0.15rem 0.35rem;line-height:1.3;max-width:11rem}" +
      "@media(max-width:520px){#cu-helper-dock{bottom:5.25rem;right:0.45rem}}";
    document.head.appendChild(s);
  }

  function openHelper(h) {
    var api = g[h.api];
    try {
      if (api && typeof api.openDesk === "function") {
        api.openDesk();
        return true;
      }
      if (h.id === "security" && api && typeof api.scan === "function") {
        api.scan();
        return true;
      }
      if (h.id === "it" && api && typeof api.scanBridge === "function") {
        api.scanBridge();
        return true;
      }
      if (h.id === "library" && api && typeof api.open === "function") {
        api.open();
        return true;
      }
      if (h.id === "lab" && api && typeof api.render === "function") {
        api.render();
        return true;
      }
    } catch (e) {}
    /* wings bridge map */
    try {
      if (g.ClarityCampusWings && g.ClarityCampusWings[h.id]) {
        g.ClarityCampusWings[h.id]();
        return true;
      }
    } catch (e2) {}
    if (h.href) {
      location.href = h.href;
      return true;
    }
    return false;
  }

  function build() {
    if (document.getElementById("cu-helper-dock")) return;
    injectCss();
    var dock = document.createElement("div");
    dock.id = "cu-helper-dock";
    dock.innerHTML =
      '<div class="cu-hd-panel" role="menu" aria-label="Campus helpers"></div>' +
      '<button type="button" class="cu-hd-toggle" aria-expanded="false" title="Campus helpers">✦</button>';
    var panel = dock.querySelector(".cu-hd-panel");
    var hint = document.createElement("div");
    hint.className = "cu-hd-hint";
    hint.textContent = "Educational guides only — not live staff or fatwa.";
    panel.appendChild(hint);
    HELPERS.forEach(function (h) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cu-hd-tile";
      b.setAttribute("role", "menuitem");
      b.innerHTML = '<span class="ico">' + h.icon + "</span><span>" + h.label + "</span>";
      b.title = h.title;
      b.onclick = function () {
        var ok = openHelper(h);
        if (!ok) {
          b.classList.add("loading");
          b.querySelector("span:last-child").textContent = "Loading…";
          setTimeout(function () {
            if (!openHelper(h)) {
              if (h.href) location.href = h.href;
              else alert(h.label + " desk is still loading. Hard-refresh once, then try again.");
            }
            b.classList.remove("loading");
            b.querySelector("span:last-child").textContent = h.label;
          }, 600);
        }
        dock.classList.remove("open");
        dock.querySelector(".cu-hd-toggle").setAttribute("aria-expanded", "false");
      };
      panel.appendChild(b);
    });
    var toggle = dock.querySelector(".cu-hd-toggle");
    toggle.onclick = function () {
      var on = dock.classList.toggle("open");
      toggle.setAttribute("aria-expanded", on ? "true" : "false");
    };
    document.addEventListener("click", function (ev) {
      if (!dock.contains(ev.target)) {
        dock.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.body.appendChild(dock);
  }

  /* Also wire existing role buttons on desk */
  function wireRoleButtons() {
    document.querySelectorAll("#roles button[data-role]").forEach(function (b) {
      if (b.__cuHelperWired) return;
      b.__cuHelperWired = true;
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-role");
        var map = { faculty: "faculty", staff: "library", it: "it", om: "om", security: "security" };
        var hid = map[id] || id;
        for (var i = 0; i < HELPERS.length; i++) {
          if (HELPERS[i].id === hid) {
            openHelper(HELPERS[i]);
            break;
          }
        }
      });
    });
  }

  function boot() {
    if (!document.body) return;
    /* desk + map + systems */
    var page = document.body.getAttribute("data-campus-page") || "";
    var path = location.pathname || "";
    if (
      page === "desk" ||
      path.indexOf("/campus") === 0 ||
      path.indexOf("/systems") === 0 ||
      path.indexOf("/lab") === 0
    ) {
      build();
      wireRoleButtons();
      setTimeout(wireRoleButtons, 800);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-staff-ready", function () {
    setTimeout(wireRoleButtons, 100);
  });
  g.ClarityHelperDock = { open: openHelper, helpers: HELPERS };
})(typeof window !== "undefined" ? window : this);
