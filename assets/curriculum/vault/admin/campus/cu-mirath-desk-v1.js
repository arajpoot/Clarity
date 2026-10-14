/* I1 — Mīrāth syllabus card on Desk (skeleton) */
(function (g) {
  "use strict";
  if (g.__CU_MIRATH_DESK_V1__) return;
  g.__CU_MIRATH_DESK_V1__ = true;

  var SYL = "/assets/curriculum/mirath/syllabus-v1.json?v=20261013V0I1";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function render(data, host) {
    var card = document.getElementById("mirath-curriculum-card");
    if (!card) {
      card = el("section", "card curriculum-phase-card");
      card.id = "mirath-curriculum-card";
      host.insertBefore(card, host.firstChild);
    }
    var units = (data.units || [])
      .map(function (u, i) {
        var lab = u.lab
          ? '<a class="mv-chip" href="/vault/">Vault lab</a>'
          : "";
        return (
          '<div class="mirath-unit"><strong>' +
          (i + 1) +
          ". " +
          u.title +
          "</strong><p>" +
          u.goal +
          "</p>" +
          lab +
          "</div>"
        );
      })
      .join("");
    var q = (data.framing && data.framing.quran) || [];
    var qHtml = q
      .slice(0, 3)
      .map(function (x) {
        return "<li><strong>" + x.ref + "</strong> — " + x.theme + "</li>";
      })
      .join("");
    card.innerHTML =
      '<h2 class="card-title">Mīrāth — educational foundations</h2>' +
      '<p class="card-lead">' +
      (data.framing && data.framing.intro
        ? data.framing.intro
        : "Inheritance education with adab.") +
      "</p>" +
      '<p class="cu-note" style="font-size:.78rem">' +
      (data.disclaimer || "") +
      "</p>" +
      "<h3 style=\"color:#e0c56a;font-size:.9rem;margin:0.75rem 0 0.35rem\">From the Qurʾān (study pointers)</h3>" +
      "<ul style=\"font-size:.82rem;line-height:1.45;margin:0 0 0.75rem 1.1rem\">" +
      qHtml +
      "</ul>" +
      "<h3 style=\"color:#e0c56a;font-size:.9rem;margin:0.5rem 0 0.35rem\">Units</h3>" +
      '<div class="mirath-units">' +
      units +
      "</div>" +
      '<p style="margin-top:0.75rem"><a class="mv-chip" href="/vault/">Open Amana Vault</a></p>';
  }

  function boot() {
    if ((location.pathname || "").indexOf("/campus/desk") !== 0) return;
    var q = {};
    try {
      location.search
        .replace(/^\?/, "")
        .split("&")
        .forEach(function (p) {
          var kv = p.split("=");
          if (kv[0]) q[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || "");
        });
    } catch (e) {}
    var want =
      q.track === "mirath" ||
      q.phase === "mirath" ||
      (location.hash || "").indexOf("mirath") >= 0;
    /* Always available: light card at top when track=mirath; else skip auto */
    if (!want) return;
    var host =
      document.getElementById("campus-stage-body") ||
      document.querySelector(".cu-wrap") ||
      document.querySelector("main");
    if (!host) return;
    fetch(SYL, { credentials: "same-origin" })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        render(data, host);
      })
      .catch(function () {
        host.insertBefore(
          el(
            "section",
            "card",
            "<h2>Mīrāth</h2><p>Syllabus loading failed. Educational branch is defined in syllabus-v1.json.</p>"
          ),
          host.firstChild
        );
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
})(typeof window !== "undefined" ? window : this);
