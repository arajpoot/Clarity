/*! university-path-markers-v1 · Phase 5c · true campus map
 * Study mirror only. Companion assets never required.
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
    "#university-path-markers{max-width:40rem;margin:0.75rem auto 1rem;padding:0.65rem 0.75rem;",
    "  border-radius:16px;border:1px solid rgba(201,162,39,0.3);",
    "  background:linear-gradient(165deg,rgba(15,76,58,0.2),rgba(8,20,16,0.45));}",
    "#university-path-markers .upm-title{margin:0 0 0.2rem;font-size:0.95rem;font-weight:700;}",
    "#university-path-markers .upm-note{margin:0 0 0.55rem;font-size:0.75rem;line-height:1.4;opacity:0.9;}",
    "#university-path-markers .upm-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.35rem;}",
    "@media(max-width:640px){#university-path-markers .upm-row{grid-template-columns:repeat(2,minmax(0,1fr));}}",
    "#university-path-markers .upm-step{border:1px solid rgba(212,180,90,0.25);border-radius:12px;",
    "  background:rgba(0,0,0,0.22);padding:0.45rem 0.4rem;cursor:pointer;text-align:left;font:inherit;color:inherit;}",
    "#university-path-markers .upm-step.active{border-color:rgba(201,162,39,0.7);}",
    "#university-path-markers .upm-step .n{font-weight:700;font-size:0.82rem;display:block;}",
    "#university-path-markers .upm-step .ar{font-family:Amiri,serif;font-size:0.85rem;direction:rtl;}",
    "#university-path-markers .upm-step .b{display:block;font-size:0.68rem;opacity:0.88;margin-top:0.15rem;}"
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

  function fixNavHere() {
    try {
      d.documentElement.setAttribute("data-clarity-room", "university");
      d.querySelectorAll(".clarity-room-nav a").forEach(function (a) {
        var uni = a.getAttribute("data-room-link") === "university" ||
          ((a.getAttribute("href") || "").indexOf("/campus") === 0);
        a.classList.toggle("is-here", !!uni);
        if (uni) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    } catch (e) {}
  }

  function render() {
    injectCss();
    fixNavHere();
    var host = d.getElementById("university-path-markers");
    if (!host) {
      host = d.createElement("section");
      host.id = "university-path-markers";
      host.setAttribute("aria-label", "University study path markers");
      var main = d.querySelector("main.cu-wrap") || d.querySelector("main") || d.body;
      var cont = d.getElementById("cu-continue");
      if (cont && cont.parentNode) cont.parentNode.insertBefore(host, cont.nextSibling);
      else main.appendChild(host);
    }
    var cur = current();
    var html = [];
    html.push('<p class="upm-title">University path · study mirror</p>');
    html.push('<p class="upm-note">Campus stance only — does not change Companion, Yawm, or Amānah.</p>');
    html.push('<div class="upm-row">');
    STEPS.forEach(function (s, i) {
      html.push('<button type="button" class="upm-step' + (s.id === cur ? ' active' : '') + '" data-upm="' + s.id + '">');
      html.push('<span class="n">' + (i + 1) + '. ' + s.label + '</span>');
      html.push('<span class="ar" lang="ar" dir="rtl">' + s.ar + '</span>');
      html.push('<span class="b">' + s.blurb + '</span></button>');
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

  function boot() { fixNavHere(); render(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 150); });
})(window, document);
