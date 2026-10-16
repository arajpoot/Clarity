/**
 * Companion ↔ University enrichment bridge 20261015ENRICH
 * Brings useful companion practices into campus pages without cloning the full app.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_COMPANION_ENRICH_V1__) return;
  g.__CU_COMPANION_ENRICH_V1__ = true;

  var ITEMS = [
    {
      title: "Daily verse · Companion",
      blurb: "Open Reminder and pull a living āyah into reflection.",
      href: "/#reminder",
      phase: "seeker"
    },
    {
      title: "Tajweed practice",
      blurb: "Short rule + line practice — Lab booth for depth.",
      href: "/lab/tajweed/",
      phase: "consistency"
    },
    {
      title: "Calligraphy pad",
      blurb: "Stroke practice after a foundations module.",
      href: "/lab/calligraphy/",
      phase: "practice"
    },
    {
      title: "Meme reminder (scenery-safe)",
      blurb: "Build a calm reminder card with source line — Companion Meme Studio.",
      href: "/#reminder",
      phase: "transmission"
    },
    {
      title: "Commands to the believers",
      blurb: "Companion Commands card — live the command with one action.",
      href: "/#reminder",
      phase: "seeker"
    },
    {
      title: "Amana notes (device-locked)",
      blurb: "Passphrase vault for private notes — Companion Amana.",
      href: "/#notes",
      phase: "all"
    }
  ];

  function phaseKey() {
    try {
      var d = document.body.getAttribute("data-phase-room") || "";
      if (d) return d;
      var p = (location.pathname || "").toLowerCase();
      if (p.indexOf("seeker") >= 0) return "seeker";
      if (p.indexOf("practice") >= 0) return "practice";
      if (p.indexOf("consistency") >= 0) return "consistency";
      if (p.indexOf("transmission") >= 0) return "transmission";
    } catch (e) {}
    return "all";
  }

  function mount() {
    if (document.getElementById("cu-companion-enrich")) return;
    var path = (location.pathname || "").toLowerCase();
    if (path === "/" || path === "/index.html") return; /* companion has its own tools */

    var pk = phaseKey();
    var list = ITEMS.filter(function (it) {
      return it.phase === "all" || it.phase === pk || pk === "all";
    });
    if (!list.length) list = ITEMS.slice(0, 4);

    var box = document.createElement("section");
    box.id = "cu-companion-enrich";
    box.className = "cu-companion-enrich";
    box.innerHTML =
      '<h2 class="cu-enrich-title">Learning enrichment · from Companion</h2>' +
      '<p class="cu-enrich-lead">Useful companion tools linked here for study — educational only. University stays the structured desk.</p>' +
      '<div class="cu-enrich-grid">' +
      list
        .map(function (it) {
          return (
            '<a class="cu-enrich-card" href="' +
            it.href +
            '"><strong>' +
            it.title +
            "</strong><span>" +
            it.blurb +
            "</span></a>"
          );
        })
        .join("") +
      "</div>";

    var host = document.querySelector("main.cu-wrap") || document.querySelector("main") || document.body;
    var foot = document.querySelector("footer.cu-foot");
    /* Always bottom of main content — before footer */
    if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot);
    else host.appendChild(box);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  setTimeout(mount, 600);
})(typeof window !== "undefined" ? window : this);
