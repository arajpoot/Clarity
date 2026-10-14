/* Mīrāth desk card — hardened V2B */
(function (g) {
  "use strict";
  if (g.__CU_MIRATH_DESK_V1__) return;
  g.__CU_MIRATH_DESK_V1__ = true;

  var SYL = "/assets/curriculum/mirath/syllabus-v1.json?v=20261013V2B";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function render(data, host) {
    try {
      var card = document.getElementById("mirath-curriculum-card");
      if (!card) {
        card = el("section", "card curriculum-phase-card");
        card.id = "mirath-curriculum-card";
        host.insertBefore(card, host.firstChild);
      }
      var units = (data.units || [])
        .map(function (u, i) {
          var lab = u.lab
            ? '<p><a class="mv-chip" href="/vault/">Vault lab</a></p>'
            : "";
          var body = (u.body || [])
            .map(function (para) {
              return '<p class="mirath-body">' + para + "</p>";
            })
            .join("");
          return (
            '<div class="mirath-unit" style="margin:0.65rem 0;padding:0.65rem;border-radius:12px;border:1px solid rgba(224,197,106,0.2)">' +
            "<strong>" +
            (i + 1) +
            ". " +
            (u.title || "") +
            "</strong><p>" +
            (u.goal || "") +
            "</p>" +
            body +
            lab +
            "</div>"
          );
        })
        .join("");
      var q = (data.framing && data.framing.quran) || [];
      var qHtml = q
        .map(function (x) {
          return (
            "<li><strong>" +
            (x.ref || "") +
            "</strong> — " +
            (x.theme || "") +
            "</li>"
          );
        })
        .join("");
      card.innerHTML =
        '<h2 class="card-title">Mīrāth — educational foundations</h2>' +
        '<p class="card-lead">' +
        ((data.framing && data.framing.intro) || "") +
        "</p>" +
        '<p style="font-size:.78rem;opacity:.85">' +
        (data.disclaimer || "") +
        "</p>" +
        '<h3 style="color:#e0c56a;font-size:.9rem;margin:0.75rem 0 0.35rem">From the Qurʾān (study pointers)</h3>' +
        '<ul style="font-size:.82rem;line-height:1.45;margin:0 0 0.75rem 1.1rem">' +
        qHtml +
        "</ul>" +
        '<h3 style="color:#e0c56a;font-size:.9rem">Units</h3>' +
        '<div class="mirath-units">' +
        units +
        "</div>" +
        '<p style="margin-top:0.75rem"><a class="mv-chip" href="/vault/">Open Amana Vault</a></p>';
    } catch (e) {
      try {
        console.warn("[mirath]", e);
      } catch (e2) {}
    }
  }

  function boot() {
    try {
      if ((location.pathname || "").indexOf("/campus/desk") !== 0) return;
      var track = "";
      try {
        track = new URLSearchParams(location.search).get("track") || "";
      } catch (e) {}
      if (track !== "mirath" && (location.hash || "").indexOf("mirath") < 0) return;
      var host =
        document.getElementById("campus-stage-body") ||
        document.querySelector(".cu-wrap") ||
        document.querySelector("main");
      if (!host) return;
      fetch(SYL, { credentials: "same-origin" })
        .then(function (r) {
          if (!r.ok) throw new Error("syllabus " + r.status);
          return r.json();
        })
        .then(function (data) {
          render(data, host);
        })
        .catch(function () {
          var card = el(
            "section",
            "card",
            "<h2>Mīrāth</h2><p>Educational branch. Open Vault for private lab notes. Syllabus file will load when assets are deployed.</p><p><a href=\"/vault/\">Amana Vault</a></p>"
          );
          card.id = "mirath-curriculum-card";
          host.insertBefore(card, host.firstChild);
        });
    } catch (e) {
      try {
        console.warn("[mirath boot]", e);
      } catch (e2) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    try {
      boot();
    } catch (e) {}
  }
})(typeof window !== "undefined" ? window : this);
