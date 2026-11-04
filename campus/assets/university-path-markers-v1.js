/*! university-path-markers-v1 · Phase 5
 * Seeker → Practice → Consistency → Transmission — STUDY MIRROR only.
 * Does not gate other rooms, does not write Amānah ledger, does not remove campus content.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__UNIVERSITY_PATH_MARKERS_V1__) return;
  w.__UNIVERSITY_PATH_MARKERS_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p === "/campus" || p.indexOf("/campus/") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var KEY = "clarity_university_path_marker_v1";
  var STEPS = [
    { id: "seeker", label: "Seeker", ar: "طالب", blurb: "Open the door — learn with humility." },
    { id: "practice", label: "Practice", ar: "عمل", blurb: "Repeat small deeds with sincerity." },
    { id: "consistency", label: "Consistency", ar: "ثبات", blurb: "Stay on the path day after day." },
    { id: "transmission", label: "Transmission", ar: "تبليغ", blurb: "Share what you learned — gently." }
  ];

  var CSS = [
    "#university-path-markers{max-width:52rem;margin:0.75rem auto 1rem;padding:0.65rem 0.75rem;",
    "  border-radius:16px;border:1px solid rgba(201,162,39,0.3);",
    "  background:linear-gradient(165deg,rgba(15,76,58,0.2),rgba(8,20,16,0.45));",
    "  font-family:var(--nuros-font-en,\"Quicksand\",system-ui,sans-serif);}",
    "#university-path-markers .upm-title{margin:0 0 0.2rem;font-size:0.95rem;font-weight:700;}",
    "#university-path-markers .upm-note{margin:0 0 0.55rem;font-size:0.75rem;line-height:1.4;opacity:0.9;}",
    "#university-path-markers .upm-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.35rem;}",
    "@media(max-width:640px){#university-path-markers .upm-row{grid-template-columns:repeat(2,minmax(0,1fr));}}",
    "#university-path-markers .upm-step{border:1px solid rgba(212,180,90,0.25);border-radius:12px;",
    "  background:rgba(0,0,0,0.22);padding:0.45rem 0.4rem;cursor:pointer;text-align:left;font:inherit;color:inherit;}",
    "#university-path-markers .upm-step.active{border-color:rgba(201,162,39,0.7);box-shadow:0 0 0 1px rgba(201,162,39,0.35);}",
    "#university-path-markers .upm-step .n{font-weight:700;font-size:0.82rem;}",
    "#university-path-markers .upm-step .ar{font-family:var(--nuros-font-ar,Amiri,serif);font-size:0.85rem;direction:rtl;}",
    "#university-path-markers .upm-step .b{display:block;font-size:0.68rem;opacity:0.88;margin-top:0.15rem;line-height:1.3;}"
  ].join("\n");

  function injectCss() {
    if (d.getElementById("university-path-markers-css")) return;
    var s = d.createElement("style");
    s.id = "university-path-markers-css";
    s.textContent = CSS;
    (d.head || d.documentElement).appendChild(s);
  }

  function current() {
    try { return localStorage.getItem(KEY) || "seeker"; } catch (e) { return "seeker"; }
  }
  function setCurrent(id) {
    try { localStorage.setItem(KEY, id); } catch (e) {}
  }

  function render() {
    injectCss();
    var host = d.getElementById("university-path-markers");
    if (!host) {
      host = d.createElement("section");
      host.id = "university-path-markers";
      host.setAttribute("aria-label", "University study path markers");
      var main = d.querySelector("main") || d.body;
      var anchor = d.getElementById("ilm-pathway-card") || main.firstElementChild;
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(host, anchor);
      else main.insertBefore(host, main.firstChild);
    }
    var cur = current();
    var html = [];
    html.push('<p class="upm-title">University path · study mirror</p>');
    html.push('<p class="upm-note">Markers track <strong>your study stance</strong> on campus only. They do not grade you, do not open Amānah, and do not change Companion or Yawm. Educational only — not a fatwa.</p>');
    html.push('<div class="upm-row">');
    STEPS.forEach(function (s, i) {
      html.push('<button type="button" class="upm-step' + (s.id === cur ? ' active' : '') + '" data-upm="' + s.id + '">');
      html.push('<span class="n">' + (i + 1) + '. ' + s.label + '</span>');
      html.push('<span class="ar" lang="ar" dir="rtl">' + s.ar + '</span>');
      html.push('<span class="b">' + s.blurb + '</span>');
      html.push('</button>');
    });
    html.push('</div>');
    host.innerHTML = html.join('');
    host.querySelectorAll("[data-upm]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setCurrent(btn.getAttribute("data-upm"));
        render();
      });
    });
  }

  
  function fixNavHere() {
    try {
      d.documentElement.setAttribute("data-clarity-room", "university");
      d.querySelectorAll(".clarity-room-nav a, nav.clarity-room-nav a").forEach(function (a) {
        var uni = a.getAttribute("data-room-link") === "university" ||
          ((a.getAttribute("href") || "").indexOf("/campus") === 0);
        a.classList.toggle("is-here", !!uni);
        if (uni) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    } catch (e) {}
  }

  function boot() {
    fixNavHere();
    try {
      d.documentElement.setAttribute("data-clarity-room", "university");
    } catch (e) {}
    render();
    fixNavHere();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(render, 200); });
})(window, document);
