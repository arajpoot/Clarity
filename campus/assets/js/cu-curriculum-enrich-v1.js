/*! cu-curriculum-enrich-v1 · campus stages from /assets/curriculum
 * Educational only — not a fatwa. Study mirror, not a grade of īmān.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CURRICULUM_ENRICH_V1__) return;
  w.__CU_CURRICULUM_ENRICH_V1__ = true;

  var PACK_URL = "/assets/curriculum/shared/lesson-packs-v1.json";
  var ENR_URL = "/assets/curriculum/shared/content-enrichment-v1.json";

  /** Map sequential campus stages → curriculum phase ids in lesson-packs */
  var STAGE_PHASE = {
    seeker: "seeker",
    practice: "new-muslim",
    consistency: "daily",
    transmission: "dai"
  };

  function stageId() {
    var s = (d.body && d.body.getAttribute("data-seq-stage")) || "";
    if (s) return s;
    var m = (location.pathname || "").match(/\/campus\/desk\/(seeker|practice|consistency|transmission)/);
    return m ? m[1] : "";
  }

  function el(id) { return d.getElementById(id); }

  function ensureMount() {
    var mount = el("cu-curr-lessons");
    if (mount) return mount;
    var host =
      d.querySelector(".cu-glass[aria-label='Lesson body']") ||
      d.querySelector("main .cu-glass") ||
      d.querySelector("main");
    if (!host) return null;
    mount = d.createElement("section");
    mount.id = "cu-curr-lessons";
    mount.className = "cu-glass cu-curr-lessons";
    mount.setAttribute("aria-label", "Curriculum lessons");
    mount.innerHTML =
      '<h2>Curriculum lessons</h2>' +
      '<p class="cu-curr-note">Loaded from on-site curriculum packs. Educational only — not a fatwa.</p>' +
      '<div id="cu-curr-lessons-list" class="cu-curr-list"></div>';
    host.parentNode.insertBefore(mount, host.nextSibling);
    return mount;
  }

  function card(id, lesson) {
    var ayah = lesson.ayah || {};
    var points = (lesson.points || []).map(function (p) {
      return "<li>" + escapeHtml(p) + "</li>";
    }).join("");
    var links = (lesson.links || []).map(function (L) {
      return '<a class="cu-btn ghost" href="' + escapeAttr(L.href) + '" target="_blank" rel="noopener">' +
        escapeHtml(L.label || "Source") + "</a>";
    }).join(" ");
    return (
      '<article class="cu-curr-card" data-lesson-id="' + escapeAttr(id) + '">' +
      "<h3>" + escapeHtml(lesson.title || id) + "</h3>" +
      (lesson.summary ? "<p>" + escapeHtml(lesson.summary) + "</p>" : "") +
      (ayah.ref || ayah.en
        ? '<div class="cu-curr-ayah"><div class="ref">' + escapeHtml(ayah.ref || "") +
          "</div><div class=\"en\">" + escapeHtml(ayah.en || "") + "</div></div>"
        : "") +
      (points ? "<ul>" + points + "</ul>" : "") +
      (links ? '<div class="cu-curr-links">' + links + "</div>" : "") +
      "</article>"
    );
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function paint(phaseKey, phase, enrichment) {
    var mount = ensureMount();
    if (!mount) return;
    var list = el("cu-curr-lessons-list");
    if (!list) return;
    var lessons = (phase && phase.lessons) || {};
    var ids = Object.keys(lessons);
    if (!ids.length) {
      list.innerHTML = "<p>No lesson pack units found for this stage.</p>";
      return;
    }
    var html = "";
    if (phase.label || phase.goal) {
      html += '<header class="cu-curr-head">';
      if (phase.label) html += "<strong>" + escapeHtml(phase.label) + "</strong>";
      if (phase.goal) html += "<p>" + escapeHtml(phase.goal) + "</p>";
      html += "</header>";
    }
    ids.forEach(function (id) {
      html += card(id, lessons[id] || {});
    });
    /* optional enrichment bullets */
    try {
      var en = enrichment && enrichment.phases && enrichment.phases[phaseKey];
      if (en && en.units && en.units.length) {
        html += '<div class="cu-curr-extra"><h3>Extra study pointers</h3>';
        en.units.forEach(function (u) {
          html += "<div><strong>" + escapeHtml(u.id || "") + "</strong><ul>";
          (u.extra_points || []).forEach(function (p) {
            html += "<li>" + escapeHtml(p) + "</li>";
          });
          html += "</ul></div>";
        });
        html += "</div>";
      }
    } catch (e) {}
    list.innerHTML = html;
  }

  function loadJson(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function boot() {
    var path = location.pathname || "";
    if (path.indexOf("/campus") !== 0) return;
    var stage = stageId();
    if (!stage || !STAGE_PHASE[stage]) return;
    var phaseKey = STAGE_PHASE[stage];
    Promise.all([
      loadJson(PACK_URL).catch(function () { return null; }),
      loadJson(ENR_URL).catch(function () { return null; })
    ]).then(function (pair) {
      var packs = pair[0];
      var enr = pair[1];
      if (!packs || !packs.phases || !packs.phases[phaseKey]) return;
      paint(phaseKey, packs.phases[phaseKey], enr);
    }).catch(function () {});
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
