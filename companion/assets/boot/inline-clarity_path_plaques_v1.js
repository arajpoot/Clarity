/**
 * Path plaques v1 — icons on path tiles, hide TRACK bar, compact single row
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_PATH_PLAQUES_V1__) return;
  w.__CLARITY_PATH_PLAQUES_V1__ = true;

  var ICONS = {
    seeker: "🔭",
    new_muslim: "🌱",
    practicing: "📿",
    dai: "🕊️"
  };

  var CSS = [
    "/* Hide TRACK / gate switcher — icons live on path plaques */",
    ".clarity-gate-switcher,#clarity-path-rail,#clarity-path-intro,",
    ".cgs-btn-row,[aria-label=\"Learning track — switch anytime\"]{",
    "  display:none!important;}",
    "/* Path strip: full width centered */",
    "#clarity-grave-path-strip,.grave-path-strip,.path-to-grave{",
    "  width:100%!important;max-width:100%!important;margin:0.5rem auto 0.75rem!important;",
    "  box-sizing:border-box!important;text-align:center!important;",
    "  padding:0.65rem 0.75rem!important;border-radius:16px!important;",
    "  border:1px solid rgba(15,76,58,0.18)!important;",
    "  background:linear-gradient(145deg,rgba(15,76,58,0.06),rgba(15,76,58,0.02))!important;}",
    "html[data-theme=dark] #clarity-grave-path-strip,html[data-theme=dark] .grave-path-strip{",
    "  border-color:rgba(212,180,90,0.2)!important;background:linear-gradient(145deg,rgba(212,180,90,0.06),rgba(12,28,22,0.5))!important;}",
    "#clarity-grave-path-strip h3,.grave-path-strip h3{",
    "  margin:0 0 0.2rem!important;font-size:1.05rem!important;text-align:center!important;}",
    "#clarity-grave-path-strip .gps-goal,.grave-path-strip .gps-goal{",
    "  margin:0 0 0.55rem!important;font-size:0.8rem!important;opacity:0.8;text-align:center!important;}",
    "/* Single row of smaller plaques */",
    "#clarity-grave-path-strip .gps-phases,.grave-path-strip .gps-phases,",
    ".path-to-grave .doors,.path-doors-grid{",
    "  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;",
    "  gap:0.4rem!important;width:100%!important;margin:0 auto!important;}",
    "@media(max-width:720px){",
    "  #clarity-grave-path-strip .gps-phases,.grave-path-strip .gps-phases{",
    "    grid-template-columns:repeat(2,minmax(0,1fr))!important;}",
    "}",
    "#clarity-grave-path-strip .gps-phase,.grave-path-strip .gps-phase,",
    ".path-to-grave .door{",
    "  display:flex!important;flex-direction:column!important;align-items:flex-start!important;",
    "  gap:0.15rem!important;min-height:0!important;padding:0.5rem 0.55rem!important;",
    "  border-radius:12px!important;border:1px solid rgba(15,76,58,0.22)!important;",
    "  background:rgba(255,255,255,0.04)!important;cursor:pointer!important;",
    "  text-align:left!important;font:inherit!important;color:inherit!important;",
    "  box-sizing:border-box!important;width:100%!important;}",
    "html[data-theme=dark] #clarity-grave-path-strip .gps-phase{",
    "  border-color:rgba(212,180,90,0.22)!important;background:rgba(0,0,0,0.2)!important;}",
    "#clarity-grave-path-strip .gps-phase.active,.gps-phase.is-active{",
    "  border-color:rgba(201,162,39,0.65)!important;",
    "  box-shadow:0 0 0 1px rgba(201,162,39,0.35),0 4px 14px rgba(0,0,0,0.12)!important;}",
    "#clarity-grave-path-strip .gps-ico{",
    "  font-size:1.25rem!important;line-height:1!important;margin-bottom:0.15rem!important;}",
    "#clarity-grave-path-strip .gps-phase strong{",
    "  font-size:0.82rem!important;line-height:1.25!important;display:block!important;}",
    "#clarity-grave-path-strip .gps-phase{",
    "  font-size:0.72rem!important;line-height:1.3!important;opacity:0.95;}",
    "#clarity-grave-path-strip .gps-tag{",
    "  display:block!important;margin-top:0.25rem!important;font-size:0.65rem!important;",
    "  letter-spacing:0.03em!important;text-transform:uppercase!important;",
    "  color:#c9a227!important;opacity:0.95!important;}"
  ].join("\n");

  function injectCss() {
    if (document.getElementById("clarity-path-plaques-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-path-plaques-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function decorate() {
    injectCss();
    // Hide track
    try {
      document.querySelectorAll(".clarity-gate-switcher, #clarity-path-rail, #clarity-path-intro").forEach(function (el) {
        el.style.setProperty("display", "none", "important");
      });
    } catch (e) {}

    var phases = document.querySelectorAll("#clarity-grave-path-strip .gps-phase, .grave-path-strip .gps-phase");
    phases.forEach(function (btn) {
      if (btn.querySelector(".gps-ico")) return;
      var g = btn.getAttribute("data-gate") || "";
      var ico = ICONS[g] || "✦";
      var span = document.createElement("span");
      span.className = "gps-ico";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ico;
      btn.insertBefore(span, btn.firstChild);
    });
  }

  function boot() { decorate(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 60); });
  else setTimeout(boot, 60);
  w.addEventListener("load", function () { setTimeout(boot, 250); });
  document.addEventListener("clarity-core-ready", function () { setTimeout(boot, 150); });
  // Observe strip rebuilds
  try {
    var obs = new MutationObserver(function () { setTimeout(decorate, 40); });
    if (document.documentElement) obs.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);
