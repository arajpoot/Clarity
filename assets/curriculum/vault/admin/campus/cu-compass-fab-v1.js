/* App-like compass FAB — 20261016ROLES · panel hidden until open */
(function (g) {
  "use strict";
  if (g.__CU_COMPASS_FAB_V1__) return;
  g.__CU_COMPASS_FAB_V1__ = true;

  function pathOk() {
    var p = location.pathname || "";
    return (
      p.indexOf("/campus") === 0 ||
      p.indexOf("/lab") === 0 ||
      p.indexOf("/library") === 0 ||
      p.indexOf("/journey") === 0 ||
      p.indexOf("/systems") === 0 ||
      p.indexOf("/vault") === 0 ||
      p.indexOf("/charter") === 0
    );
  }

  function ensureCss() {
    if (document.getElementById("cu-compass-fab-css")) return;
    var s = document.createElement("style");
    s.id = "cu-compass-fab-css";
    s.textContent =
      "#cu-compass-fab{position:fixed;right:1rem;bottom:5.5rem;z-index:9998;width:3rem;height:3rem;border-radius:999px;border:1px solid rgba(184,166,135,.4);background:#1e7d5e;color:#fff;font-size:1.1rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.25)}" +
      "#cu-compass-panel{display:none;position:fixed;right:1rem;bottom:9rem;z-index:9998;width:min(16rem,calc(100vw - 2rem));padding:.75rem;border-radius:14px;border:1px solid rgba(184,166,135,.35);background:#15201c;color:#e8f0ea;font-size:.82rem;line-height:1.4;box-shadow:0 8px 24px rgba(0,0,0,.35)}" +
      "#cu-compass-panel.open{display:block}" +
      "#cu-compass-panel a,#cu-compass-panel button{display:block;width:100%;text-align:left;margin:.25rem 0;padding:.4rem .5rem;border-radius:8px;border:0;background:rgba(255,255,255,.06);color:inherit;text-decoration:none;cursor:pointer;font:inherit}" +
      "#cu-compass-panel .hint{opacity:.75;font-size:.72rem;margin-bottom:.35rem}" +
      "html[data-theme=light] #cu-compass-panel{background:#fffef8;color:#2a2319}";
    document.head.appendChild(s);
  }

  function openWing(id) {
    if (g.ClarityLazyWings && g.ClarityLazyWings.openWing) return g.ClarityLazyWings.openWing(id);
    if (g.ClarityLazyWings && g.ClarityLazyWings.open) return g.ClarityLazyWings.open(id);
    if (id === "lab") location.href = "/lab/";
    if (id === "library") location.href = "/library/";
    if (id === "faculty") location.href = "/campus/desk/seeker/";
  }

  function build() {
    if (!pathOk() || document.getElementById("cu-compass-fab")) return;
    ensureCss();

    var panel = document.createElement("div");
    panel.id = "cu-compass-panel";
    var hasRoles = !!document.getElementById("cu-campus-roles");
    var wingBtns = hasRoles
      ? ""
      : '<button type="button" data-wing="faculty">Faculty</button>' +
        '<button type="button" data-wing="it">IT</button>' +
        '<button type="button" data-wing="security">Security</button>' +
        '<button type="button" data-wing="om">O&amp;M</button>';
    panel.innerHTML =
      '<div class="hint">On-device guides · not live staff or fatwa</div>' +
      '<a href="/campus/">Campus map</a>' +
      '<a href="/campus/desk/">Desk</a>' +
      '<a href="/lab/">Lab</a>' +
      '<a href="/library/">Library</a>' +
      '<a href="/lab/arabic/">Arabic studio</a>' +
      (wingBtns ? wingBtns : '<div class="hint">Roles strip is on this page</div>') +
      '<a href="/">← Companion</a>';

    var fab = document.createElement("button");
    fab.type = "button";
    fab.id = "cu-compass-fab";
    fab.setAttribute("aria-label", "Campus compass");
    fab.setAttribute("aria-expanded", "false");
    fab.title = "Campus compass";
    fab.textContent = "⚜";

    fab.onclick = function (ev) {
      ev.stopPropagation();
      var on = panel.classList.toggle("open");
      fab.setAttribute("aria-expanded", on ? "true" : "false");
    };
    panel.querySelectorAll("[data-wing]").forEach(function (b) {
      b.onclick = function () {
        openWing(b.getAttribute("data-wing"));
        panel.classList.remove("open");
        fab.setAttribute("aria-expanded", "false");
      };
    });
    document.addEventListener("click", function (ev) {
      if (!panel.contains(ev.target) && ev.target !== fab) {
        panel.classList.remove("open");
        fab.setAttribute("aria-expanded", "false");
      }
    });

    document.body.appendChild(panel);
    document.body.appendChild(fab);

    var old = document.getElementById("cu-helper-dock");
    if (old) old.style.display = "none";
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(build, 700);
    });
  else setTimeout(build, 700);
})(typeof window !== "undefined" ? window : this);
