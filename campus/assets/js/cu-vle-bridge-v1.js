/*! cu-vle-bridge-v1 · Virtual Learning Experience bridge
 * Integrates vault admin/staff + faculty personas with campus Faculty · Bots · Library
 * Does NOT rewrite SEAL foundation hashes. Educational personas only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_BRIDGE_V1__) return;
  w.__CU_VLE_BRIDGE_V1__ = true;

  var STAFF_BASE = "/assets/curriculum/vault/admin/staff/";
  var FAC_BASE = "/assets/curriculum/vault/admin/faculty/";
  var STAFF_ROSTER = STAFF_BASE + "staff-roster.json";
  var FAC_ROSTER = FAC_BASE + "faculty-roster.json";
  var HELP_BOOK = FAC_BASE + "help-book.json";

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "/";
  }
  function pageKind() {
    var p = path();
    if (p.indexOf("/campus/faculty") === 0) return "faculty";
    if (p.indexOf("/campus/bots") === 0) return "bots";
    if (p.indexOf("/campus/library") === 0) return "library";
    if (p.indexOf("/campus/lab") === 0) return "lab";
    return null;
  }
  function fetchJSON(url) {
    return fetch(url, { credentials: "same-origin", cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
  }
  function loadScript(src) {
    return new Promise(function (resolve) {
      if (d.querySelector('script[src*="' + src.split("?")[0].split("/").pop() + '"]')) {
        resolve("already");
        return;
      }
      var s = d.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=vle1";
      s.defer = true;
      s.onload = function () { resolve("ok"); };
      s.onerror = function () { resolve("missing"); };
      (d.head || d.documentElement).appendChild(s);
    });
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureDesk(kind) {
    var id = "cu-vle-desk";
    var desk = d.getElementById(id);
    if (desk) return desk;
    desk = d.createElement("section");
    desk.id = id;
    desk.className = "cu-vle-desk";
    desk.setAttribute("aria-label", "Virtual learning desk");
    desk.innerHTML =
      '<div class="cu-vle-plaque">' +
      '<p class="cu-vle-kicker">Virtual learning experience · on-device</p>' +
      "<h2 id=\"cu-vle-title\">Learning desk</h2>" +
      '<p class="cu-vle-lead" id="cu-vle-lead"></p>' +
      '<div id="cu-vle-personas" class="cu-vle-grid"></div>' +
      '<div id="cu-vle-panel" class="cu-vle-panel" hidden></div>' +
      '<p class="cu-vle-disc">Educational personas only — not living scholars, not a fatwa desk. Verify with Qurʾān, Sunnah, and a local teacher.</p>' +
      "</div>";
    var main = d.querySelector("main") || d.body;
    main.appendChild(desk);
    var titles = {
      faculty: ["Faculty desk", "Phase teachers (educational guides) with help prompts and stage adab."],
      bots: ["Bots & workers desk", "Staff wing automation: ops, authenticity, scout, librarian — on-device helpers."],
      library: ["Library desk", "Librarian + Resource Scout shelves and rotation briefs."],
      lab: ["Lab desk", "Practice tools with staff hygiene checks."]
    };
    var t = titles[kind] || ["Learning desk", ""];
    desk.querySelector("#cu-vle-title").textContent = t[0];
    desk.querySelector("#cu-vle-lead").textContent = t[1];
    return desk;
  }

  function personaCard(p) {
    return (
      '<button type="button" class="cu-vle-card" data-vle-id="' + esc(p.id) + '">' +
      '<span class="cu-vle-badge" aria-hidden="true">' + esc(p.badge || "●") + "</span>" +
      "<strong>" + esc(p.title || p.name || p.id) + "</strong>" +
      "<span>" + esc(p.role || p.bio || "") + "</span>" +
      "</button>"
    );
  }

  function showPanel(html) {
    var panel = d.getElementById("cu-vle-panel");
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = html;
  }

  function wirePersonaClicks(kind, staff, faculty, helpbook) {
    d.querySelectorAll("#cu-vle-personas .cu-vle-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-vle-id");
        var worker = (staff.workers || []).find(function (w) { return w.id === id; });
        var teacher = (faculty.teachers || []).find(function (t) {
          return t.id === id || String(t.phase) === id || t.name === id;
        });
        if (worker) {
          showPanel(
            "<h3>" + esc(worker.name) + "</h3>" +
            "<p>" + esc(worker.role) + "</p>" +
            "<p><em>Script:</em> " + esc(worker.script || "bundled") + "</p>" +
            "<p>On-device helper. Does not replace a qualified teacher.</p>"
          );
          /* soft-load worker script for real automation if present */
          if (worker.script) loadScript(STAFF_BASE + worker.script);
          return;
        }
        if (teacher) {
          var tips = [];
          try {
            if (helpbook && helpbook.byPhase && helpbook.byPhase[String(teacher.phase)]) {
              tips = helpbook.byPhase[String(teacher.phase)] || [];
            }
          } catch (e) {}
          showPanel(
            "<h3>" + esc(teacher.name || teacher.title || "Teacher") + "</h3>" +
            "<p>" + esc(teacher.role || teacher.focus || "") + "</p>" +
            (tips.length
              ? "<ul>" + tips.slice(0, 5).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>"
              : "<p>Ask for sources. Pause when a ruling is unclear.</p>")
          );
          return;
        }
        showPanel("<p>Persona unavailable offline.</p>");
      });
    });
  }

  function render(kind, staff, faculty, helpbook) {
    ensureDesk(kind);
    var grid = d.getElementById("cu-vle-personas");
    if (!grid) return;
    var html = "";
    if (kind === "bots" || kind === "lab") {
      (staff.workers || []).forEach(function (w) {
        html += personaCard(w);
      });
    } else if (kind === "faculty") {
      (faculty.teachers || []).forEach(function (t) {
        html += personaCard({
          id: t.id || String(t.phase),
          badge: t.badge || "ن",
          title: t.title || t.name,
          role: t.role || t.focus || ("Phase " + t.phase + " guide")
        });
      });
    } else if (kind === "library") {
      (staff.workers || [])
        .filter(function (w) { return w.id === "librarian" || w.id === "scout" || w.id === "fiqh"; })
        .forEach(function (w) { html += personaCard(w); });
    }
    grid.innerHTML = html || "<p>No personas loaded.</p>";
    wirePersonaClicks(kind, staff, faculty, helpbook);
  }

  function boot() {
    var kind = pageKind();
    if (!kind) return;
    /* campus isolation */
    if ((location.pathname || "").indexOf("/campus") !== 0) return;

    Promise.all([
      fetchJSON(STAFF_ROSTER).catch(function () {
        return {
          workers: [
            { id: "ops", name: "Ops Steward", role: "Module flow health", badge: "⚙" },
            { id: "fiqh", name: "Authenticity Clerk", role: "Educational tone hygiene", badge: "⚖" },
            { id: "scout", name: "Resource Scout", role: "Allowlisted sources", badge: "◈" },
            { id: "librarian", name: "Vault Librarian", role: "Shelves & rotation briefs", badge: "📚" }
          ],
          disclaimer: "Fallback roster"
        };
      }),
      fetchJSON(FAC_ROSTER).catch(function () {
        return {
          teachers: [
            { phase: 1, name: "Seeker guide", role: "Foundations of īmān", badge: "1" },
            { phase: 2, name: "Practice guide", role: "Ṭahārah & ṣalāh map", badge: "2" },
            { phase: 3, name: "Consistency guide", role: "Habits & iḥsān", badge: "3" },
            { phase: 4, name: "Transmission guide", role: "Adab of sharing", badge: "4" }
          ]
        };
      }),
      fetchJSON(HELP_BOOK).catch(function () { return null; })
    ]).then(function (trio) {
      render(kind, trio[0], trio[1], trio[2]);
      /* Soft staff dispatcher on bots page only — after vault policy */
      if (kind === "bots") {
        loadScript(STAFF_BASE + "staff-dispatcher-v1.js");
      }
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
