/*! Amānah UFT/Fiqh · Phase C · enrichment cohesion
 * - Gender checklist from outline (educational)
 * - ?from=tree auto-refresh outline on fiqh
 * - Does not write binding shares · not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FIQH_PHASE_C__) return;
  w.__CLARITY_AMANA_UFT_FIQH_PHASE_C__ = true;

  function isFiqh() { return /\/amana\/fiqh\/?/.test(location.pathname || ""); }
  function isTree() { return /\/amana\/tree\/?/.test(location.pathname || ""); }

  function enhanceFiqh() {
    if (!isFiqh()) return;
    var strip = d.getElementById("fiqh-workflow-enrich-strip");
    if (!strip || strip.getAttribute("data-phase-c") === "1") return;
    strip.setAttribute("data-phase-c", "1");
    var box = d.createElement("div");
    box.id = "fiqh-phase-c-gender";
    box.style.cssText = "margin-top:0.55rem;font-size:0.78rem;line-height:1.4;opacity:0.95";
    strip.appendChild(box);
    function render() {
      var o = null;
      try {
        if (typeof w.clarityAmanaLoadFiqhOutline === "function") o = w.clarityAmanaLoadFiqhOutline();
        else o = JSON.parse(localStorage.getItem("clarity_amana_fiqh_outline_v1") || "null");
      } catch (e) {}
      if (!o || !o.people || !o.people.length) {
        box.textContent = "Phase C: no outline yet — save from Family tree.";
        return;
      }
      var miss = (o.missingGender || []).slice();
      if (!miss.length) {
        o.people.forEach(function (p) { if (p && !p.gender) miss.push(p.name); });
      }
      box.textContent = "";
      var t = d.createElement("p");
      t.style.margin = "0 0 0.25rem";
      t.textContent = miss.length
        ? ("People missing gender (" + miss.length + ") — set on tree registry, then Refresh outline:")
        : "All outlined people have gender set · ready for study load.";
      box.appendChild(t);
      if (miss.length) {
        var ul = d.createElement("ul");
        ul.style.margin = "0.2rem 0 0 1.1rem";
        miss.slice(0, 12).forEach(function (name) {
          var li = d.createElement("li");
          li.textContent = String(name);
          ul.appendChild(li);
        });
        box.appendChild(ul);
      }
      var note = d.createElement("p");
      note.style.cssText = "margin:0.35rem 0 0;font-size:0.72rem;opacity:0.85";
      note.textContent = "Educational checklist only — not a fatwa · other madhāhib differ.";
      box.appendChild(note);
    }
    render();
    var ref = d.getElementById("fiqh-wf-refresh-outline");
    if (ref && !ref.__phaseC) {
      ref.__phaseC = true;
      ref.addEventListener("click", function () { setTimeout(render, 100); });
    }
    try {
      if (/from=tree/i.test(location.search || "")) {
        if (typeof w.clarityAmanaBuildFiqhOutline === "function") w.clarityAmanaBuildFiqhOutline();
        setTimeout(render, 50);
      }
    } catch (e) {}
  }

  function enhanceTreeLink() {
    if (!isTree()) return;
    var a = d.getElementById("uft-wf-open-fiqh");
    if (a && a.tagName === "A") {
      try {
        var u = new URL(a.href, location.origin);
        u.searchParams.set("from", "tree");
        a.href = u.pathname + u.search;
      } catch (e) {
        a.href = "/amana/fiqh/?from=tree";
      }
    }
  }

  function boot() {
    enhanceTreeLink();
    enhanceFiqh();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 700);
  setTimeout(boot, 1800);
})(window, document);
