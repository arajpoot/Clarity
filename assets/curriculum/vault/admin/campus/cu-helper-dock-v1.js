/* Helper dock + always-visible worker strip — IT, Library, O&M, Security, Faculty… */
(function (g) {
  "use strict";
  if (g.__CU_HELPER_DOCK_V2__) return;
  g.__CU_HELPER_DOCK_V2__ = true;
  g.__CU_HELPER_DOCK_V1__ = true;

  var HELPERS = [
    { id: "faculty", label: "Faculty", icon: "📖", api: "ClarityFaculty" },
    { id: "chancellor", label: "Chancellor", icon: "🏛", api: "ClarityChancellor" },
    { id: "registrar", label: "Registrar", icon: "📋", api: "ClarityRegistrar" },
    { id: "lab", label: "Lab", icon: "🧪", api: "ClarityLab", href: "/lab/" },
    { id: "library", label: "Library", icon: "📚", api: "ClarityLibrarian", href: "/library/" },
    { id: "it", label: "IT", icon: "💻", api: "ClarityIT" },
    { id: "om", label: "O&M", icon: "🔧", api: "ClarityOM" },
    { id: "security", label: "Security", icon: "◎", api: "ClaritySecurity" }
  ];

  function openHelper(h) {
    if (g.ClarityLazyWings && typeof g.ClarityLazyWings.open === "function" && h && h.id) {
      g.ClarityLazyWings.open(h.id);
      return true;
    }
    var api = g[h.api];
    try {
      if (api && typeof api.openDesk === "function") { api.openDesk(); return true; }
      if (h.id === "security" && api && typeof api.scan === "function") { api.scan(); return true; }
      if (h.id === "it" && api && typeof api.scanBridge === "function") { api.scanBridge(); return true; }
      if (h.id === "lab" && api && typeof api.render === "function") { api.render(); return true; }
      if (h.id === "lab" && api && typeof api.openStation === "function") { api.openStation("tajweed"); return true; }
      if (h.id === "library" && api && typeof api.open === "function") { api.open(); return true; }
    } catch (e) {}
    try {
      if (g.ClarityCampusWings && typeof g.ClarityCampusWings[h.id] === "function") {
        g.ClarityCampusWings[h.id]();
        return true;
      }
    } catch (e2) {}
    if (h.href) { location.href = h.href; return true; }
    return false;
  }

  function injectCss() {
    if (document.getElementById("cu-helper-dock-css")) return;
    var s = document.createElement("style");
    s.id = "cu-helper-dock-css";
    s.textContent =
      "#cu-helper-dock{position:fixed;right:0.65rem;bottom:4.2rem;z-index:8000;display:flex;flex-direction:column;align-items:flex-end;gap:0.4rem;pointer-events:none}" +
      "#cu-helper-dock *{pointer-events:auto}" +
      "#cu-helper-dock .cu-hd-toggle{width:3rem;height:3rem;border-radius:50%;border:1px solid rgba(224,197,106,.45);" +
      "background:linear-gradient(145deg,#1fa67a,#0f4c3a);color:#f7f3eb;font-size:1.15rem;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}" +
      "#cu-helper-dock .cu-hd-panel{display:none;flex-direction:column;gap:0.35rem;padding:0.45rem;border-radius:16px;" +
      "border:1px solid rgba(224,197,106,.35);background:rgba(8,16,14,.94);min-width:10rem}" +
      "#cu-helper-dock.open .cu-hd-panel{display:flex}" +
      "#cu-helper-dock .cu-hd-tile{display:flex;align-items:center;gap:0.45rem;padding:0.45rem 0.65rem;border-radius:12px;" +
      "border:1px solid rgba(224,197,106,.22);background:rgba(0,0,0,.28);color:#f3e6c0;font-size:0.78rem;font-weight:700;cursor:pointer;width:100%;text-align:left}" +
      "#cu-helper-dock .cu-hd-hint{font-size:0.62rem;color:rgba(234,243,238,.5);padding:0.15rem 0.35rem;max-width:11rem;line-height:1.3}";
    document.head.appendChild(s);
  }

  function buildDock() {
    if (document.getElementById("cu-helper-dock")) return;
    injectCss();
    var dock = document.createElement("div");
    dock.id = "cu-helper-dock";
    dock.innerHTML = '<div class="cu-hd-panel" role="menu"></div><button type="button" class="cu-hd-toggle" aria-label="Campus helpers">✦</button>';
    var panel = dock.querySelector(".cu-hd-panel");
    var hint = document.createElement("div");
    hint.className = "cu-hd-hint";
    hint.textContent = "On-device guides only — not live staff or fatwa.";
    panel.appendChild(hint);
    HELPERS.forEach(function (h) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "cu-hd-tile";
      b.innerHTML = "<span>" + h.icon + "</span><span>" + h.label + "</span>";
      b.onclick = function () {
        if (!openHelper(h)) {
          setTimeout(function () {
            if (!openHelper(h) && h.href) location.href = h.href;
          }, 500);
        }
        dock.classList.remove("open");
      };
      panel.appendChild(b);
    });
    dock.querySelector(".cu-hd-toggle").onclick = function () {
      dock.classList.toggle("open");
    };
    document.addEventListener("click", function (ev) {
      if (!dock.contains(ev.target)) dock.classList.remove("open");
    });
    document.body.appendChild(dock);
  }

  function buildWorkerStrip() {
    if (document.getElementById("cu-worker-strip")) return;
    var strip = document.createElement("div");
    strip.id = "cu-worker-strip";
    strip.setAttribute("role", "toolbar");
    strip.setAttribute("aria-label", "University workers");
    /* compact primary workers */
    var primary = ["faculty", "library", "it", "om", "security", "lab"];
    HELPERS.filter(function (h) { return primary.indexOf(h.id) >= 0; }).forEach(function (h) {
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = h.icon + " " + h.label;
      b.onclick = function () { openHelper(h); };
      strip.appendChild(b);
    });
    document.body.appendChild(strip);
    document.body.classList.add("cu-has-worker-strip");
  }

  function wirePills() {
    /* Desk role buttons */
    document.querySelectorAll("[data-role]").forEach(function (b) {
      if (b.__cuWired) return;
      b.__cuWired = true;
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        var id = (b.getAttribute("data-role") || "").toLowerCase();
        var map = { faculty: "faculty", staff: "library", it: "it", om: "om", security: "security", lab: "lab", library: "library" };
        var hid = map[id] || id;
        for (var i = 0; i < HELPERS.length; i++) {
          if (HELPERS[i].id === hid) {
            openHelper(HELPERS[i]);
            break;
          }
        }
      });
    });
    /* Nav pills — ensure links work (no preventDefault from other scripts) */
    document.querySelectorAll(".cu-pills a[href]").forEach(function (a) {
      if (a.__cuNavWired) return;
      a.__cuNavWired = true;
      a.addEventListener("click", function (ev) {
        var href = a.getAttribute("href");
        if (href && href.charAt(0) === "/") {
          /* allow normal navigation */
          return true;
        }
      }, true);
    });
  }

  function boot() {
    if (!document.body) return;
    var path = location.pathname || "";
    var onCampus =
      path.indexOf("/campus") === 0 ||
      path.indexOf("/lab") === 0 ||
      path.indexOf("/systems") === 0 ||
      path.indexOf("/library") === 0 ||
      document.body.getAttribute("data-campus-page");
    if (!onCampus) return;
    buildDock();
    buildWorkerStrip();
    wirePills();
    setTimeout(wirePills, 600);
    setTimeout(wirePills, 1500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-staff-ready", function () { setTimeout(wirePills, 100); });
  g.addEventListener("clarity-vault-ready", function () { setTimeout(wirePills, 100); });
  g.ClarityHelperDock = { open: openHelper, helpers: HELPERS };
})(typeof window !== "undefined" ? window : this);
