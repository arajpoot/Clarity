/**
 * Companion ↔ University enrichment bridge 20261016U3
 * Mounts once at bottom of main. Skips if #cu-companion-enrich already in HTML.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_COMPANION_ENRICH_V1__) return;
  g.__CU_COMPANION_ENRICH_V1__ = true;

  var ITEMS = [
    { title: "Daily verse", blurb: "Open Companion Reminder for a living āyah.", href: "/#reminder" },
    { title: "Tajweed (Lab)", blurb: "Rules and line practice in the Lab booth.", href: "/lab/tajweed/" },
    { title: "Calligraphy (Lab)", blurb: "Stroke practice after a foundations module.", href: "/lab/calligraphy/" },
    { title: "Media reminder", blurb: "Calm scenery-safe reminder — Lab media station.", href: "/lab/media/" },
    { title: "Commands", blurb: "Companion Commands — one action with the verse.", href: "/#commands" },
    { title: "Amana / Vault", blurb: "University vault for private on-device notes.", href: "/vault/" }
  ];

  function mount() {
    if (document.getElementById("cu-companion-enrich")) return;
    var path = (location.pathname || "").toLowerCase();
    if (path === "/" || path === "/index.html") return;

    var box = document.createElement("section");
    box.id = "cu-companion-enrich";
    box.className = "cu-companion-enrich";
    box.innerHTML =
      '<h2 class="cu-enrich-title">Learning enrichment · from Companion</h2>' +
      '<p class="cu-enrich-lead">Linked for study — educational only. Depth stays in Lab / Desk.</p>' +
      '<div class="cu-enrich-grid">' +
      ITEMS.map(function (it) {
        return (
          '<a class="cu-enrich-card" href="' +
          it.href +
          '"><strong>' +
          it.title +
          "</strong><span>" +
          it.blurb +
          "</span></a>"
        );
      }).join("") +
      "</div>";

    var main = document.querySelector("main.cu-wrap") || document.querySelector("main");
    var foot = document.querySelector("footer.cu-foot");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot);
    else if (main) main.appendChild(box);
    else document.body.appendChild(box);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(typeof window !== "undefined" ? window : this);
