/* App-like compass FAB — one float for helpers + quick campus links */
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

  function openWing(id) {
    if (g.ClarityLazyWings && g.ClarityLazyWings.open) return g.ClarityLazyWings.open(id);
    if (g.ClarityHelperDock && g.ClarityHelperDock.open) {
      return g.ClarityHelperDock.open({ id: id, api: "" });
    }
    if (id === "lab") location.href = "/lab/";
    if (id === "library") location.href = "/library/";
  }

  function build() {
    if (!pathOk() || document.getElementById("cu-compass-fab")) return;

    var panel = document.createElement("div");
    panel.id = "cu-compass-panel";
    panel.innerHTML =
      '<div class="hint">On-device guides · not live staff or fatwa</div>' +
      '<a href="/campus/">Campus map</a>' +
      '<a href="/campus/desk/?phase=seeker">Desk</a>' +
      '<a href="/lab/">Lab</a>' +
      '<a href="/library/">Library</a>' +
      '<a href="/journey/">Journey</a>' +
      '<button type="button" data-wing="faculty">Faculty</button>' +
      '<button type="button" data-wing="it">IT</button>' +
      '<button type="button" data-wing="security">Security</button>' +
      '<button type="button" data-wing="om">O&amp;M</button>' +
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

    /* Hide old ✦ dock toggle to avoid two FABs — keep strip on desktop only via CSS */
    var old = document.getElementById("cu-helper-dock");
    if (old) old.style.display = "none";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})(typeof window !== "undefined" ? window : this);
