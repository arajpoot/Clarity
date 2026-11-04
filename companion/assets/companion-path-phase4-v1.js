/*! companion-path-phase4-v1 · Phase 4
 * Path plaques with icons; hide TRACK bar — companion room only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_PATH_PHASE4_V1__) return;
  w.__CLARITY_PATH_PHASE4_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var ICONS = { seeker: "🔭", new_muslim: "🌱", practicing: "📿", dai: "🕊️" };

  var CSS = [
    ".clarity-gate-switcher,#clarity-path-rail,#clarity-path-intro{display:none!important;}",
    "#clarity-grave-path-strip{width:100%;margin:0.5rem auto;box-sizing:border-box;text-align:center;",
    "  padding:0.65rem 0.75rem;border-radius:16px;border:1px solid rgba(212,180,90,0.22);}",
    "#clarity-grave-path-strip .gps-phases{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.4rem;}",
    "@media(max-width:720px){#clarity-grave-path-strip .gps-phases{grid-template-columns:repeat(2,minmax(0,1fr));}}",
    "#clarity-grave-path-strip .gps-phase{display:flex;flex-direction:column;align-items:flex-start;gap:0.15rem;",
    "  padding:0.5rem 0.55rem;border-radius:12px;border:1px solid rgba(212,180,90,0.25);",
    "  background:rgba(0,0,0,0.2);cursor:pointer;font:inherit;color:inherit;width:100%;text-align:left;}",
    "#clarity-grave-path-strip .gps-phase.active{border-color:rgba(201,162,39,0.7);box-shadow:0 0 0 1px rgba(201,162,39,0.35);}",
    "#clarity-grave-path-strip .gps-ico{font-size:1.2rem;line-height:1;}"
  ].join("\n");

  function injectCss() {
    if (d.getElementById("companion-path-phase4-css")) return;
    var s = d.createElement("style");
    s.id = "companion-path-phase4-css";
    s.textContent = CSS;
    (d.head || d.documentElement).appendChild(s);
  }

  function decorate() {
    injectCss();
    d.querySelectorAll("#clarity-grave-path-strip .gps-phase").forEach(function (btn) {
      if (btn.querySelector(".gps-ico")) return;
      var g = btn.getAttribute("data-gate") || "";
      var span = d.createElement("span");
      span.className = "gps-ico";
      span.setAttribute("aria-hidden", "true");
      span.textContent = ICONS[g] || "✦";
      btn.insertBefore(span, btn.firstChild);
    });
  }

  function boot() { decorate(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  w.addEventListener("load", function () { setTimeout(boot, 250); });
  d.addEventListener("clarity-a2-spine-ready", function () { setTimeout(boot, 100); });
  try {
    new MutationObserver(function () { setTimeout(decorate, 50); }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})(window, document);
