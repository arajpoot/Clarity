/**
 * Transcript — academic record surface (T1)
 * Local-only · educational · not official · not Al-Azhar
 */
(function (g) {
  "use strict";
  if (g.__CU_TRANSCRIPT_RECORD_V1__) return;
  g.__CU_TRANSCRIPT_RECORD_V1__ = true;

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function collectModules(phaseId) {
    var items = [];
    var prog = {};
    try {
      prog = JSON.parse(localStorage.getItem("cu_uni_progress_v1") || "{}") || {};
    } catch (e) {}
    var p = prog[phaseId];
    if (p && Array.isArray(p.completed)) {
      p.completed.forEach(function (m, i) {
        items.push({
          title: typeof m === "string" ? m : m.title || m.id || "Module " + (i + 1),
          at: m.at || m.date || ""
        });
      });
    } else if (p && typeof p === "object") {
      Object.keys(p).forEach(function (k) {
        if (p[k] === true || (p[k] && p[k].done)) {
          items.push({ title: k, at: (p[k] && p[k].at) || "" });
        }
      });
    }
    // scan related keys
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key) continue;
        if (key.indexOf(phaseId) >= 0 && /complete|done|finish/i.test(key)) {
          items.push({ title: key.replace(/^cu_/, "").replace(/_/g, " "), at: "" });
        }
      }
    } catch (e) {}
    // dedupe by title
    var seen = {};
    return items.filter(function (it) {
      var t = it.title;
      if (seen[t]) return false;
      seen[t] = 1;
      return true;
    });
  }

  function boot() {
    var root = document.getElementById("cu-transcript-root");
    if (!root || !g.CuStudentStatus) return;
    var phases = g.CuStudentStatus.phases;
    var s = g.CuStudentStatus.get();
    var html =
      '<p class="cu-meta">Device-local academic record · last opened ' +
      esc(new Date().toLocaleString()) +
      "</p>";
    if (s.name) {
      html += "<p><strong>Learner:</strong> " + esc(s.name) + "</p>";
    }
    phases.forEach(function (ph) {
      var mods = collectModules(ph.id);
      var pr = g.CuStudentStatus.progressFor(ph.id);
      html +=
        '<section class="cu-plaque" style="margin:.65rem 0">' +
        "<strong>" +
        esc(ph.label) +
        "</strong> · <span class=\"cu-meta\">" +
        esc(ph.sub) +
        " · " +
        pr.done +
        " recorded</span>";
      if (!mods.length) {
        html += '<p class="cu-meta">No modules marked complete yet. Open the desk and finish one module.</p>';
      } else {
        html += "<ul style=\"margin:.4rem 0 0 1.1rem\">";
        mods.slice(0, 24).forEach(function (m) {
          html +=
            "<li>" +
            esc(m.title) +
            (m.at ? ' <span class="cu-meta">· ' + esc(String(m.at)) + "</span>" : "") +
            "</li>";
        });
        html += "</ul>";
      }
      html +=
        '<p class="cu-meta"><a href="' +
        ph.href +
        '">Open ' +
        esc(ph.label) +
        " desk →</a></p></section>";
    });
    html +=
      '<p class="cu-meta">Not an official transcript · not affiliated with Al-Azhar · not a grade of īmān · educational only.</p>' +
      '<p><button type="button" id="cu-tr-print" style="min-height:42px;padding:.4rem .9rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:transparent;color:inherit;font-weight:700">Print / Save as PDF</button></p>';
    root.innerHTML = html;
    var btn = document.getElementById("cu-tr-print");
    if (btn) btn.onclick = function () { window.print(); };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
