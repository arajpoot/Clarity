/**
 * U-C Mīrāth educational desk — ported from quarantine for campus surface.
 * Educational only — not a fatwa, not legal advice, not Companion Amana vault tools.
 */
(function (g) {
  "use strict";
  if (g.__CU_MIRATH_DESK_V1__) return;
  g.__CU_MIRATH_DESK_V1__ = true;

  var SYL = "/assets/curriculum/mirath/syllabus-v1.json?v=20261018UC";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(data, host) {
    try {
      var card = document.getElementById("mirath-curriculum-card");
      if (!card) {
        card = el("section", "cu-plaque");
        card.id = "mirath-curriculum-card";
        host.appendChild(card);
      }
      var units = (data.units || [])
        .map(function (u, i) {
          var body = (u.body || [])
            .map(function (para) {
              return '<p style="margin:0.35rem 0;font-size:0.9rem">' + esc(para) + "</p>";
            })
            .join("");
          return (
            '<div style="margin:0.65rem 0;padding:0.65rem;border-radius:12px;border:1px solid rgba(15,76,58,0.2)">' +
            "<strong>" +
            (i + 1) +
            ". " +
            esc(u.title || "") +
            "</strong><p style=\"margin:0.25rem 0;opacity:0.9\">" +
            esc(u.goal || "") +
            "</p>" +
            body +
            "</div>"
          );
        })
        .join("");
      var q = (data.framing && data.framing.quran) || [];
      var qHtml = q
        .map(function (x) {
          return (
            "<li><strong>" +
            esc(x.ref || "") +
            "</strong> — " +
            esc(x.theme || "") +
            (x.note ? " <span style=\"opacity:0.85\">(" + esc(x.note) + ")</span>" : "") +
            "</li>"
          );
        })
        .join("");
      card.innerHTML =
        "<h2 style=\"margin:0 0 0.35rem;font-size:1.15rem\">Mīrāth — educational foundations</h2>" +
        '<p class="cu-meta" style="margin:0 0 0.65rem">' +
        esc((data.framing && data.framing.intro) || data.disclaimer || "") +
        "</p>" +
        '<p style="font-size:0.8rem;padding:0.5rem 0.65rem;border-radius:10px;background:rgba(196,92,62,0.12);border:1px solid rgba(196,92,62,0.25)"><strong>Not a fatwa.</strong> Not a court document. Not legal advice. Ask a qualified local scholar for your situation. Verify on Quran.com / Sunnah.com.</p>' +
        (qHtml
          ? "<h3 style=\"font-size:0.95rem;margin:0.85rem 0 0.35rem\">Qurʾān themes (study map)</h3><ul style=\"margin:0 0 0.75rem 1.1rem;font-size:0.88rem\">" +
            qHtml +
            "</ul>"
          : "") +
        "<h3 style=\"font-size:0.95rem;margin:0.75rem 0 0.35rem\">Units</h3>" +
        (units || "<p class=\"cu-meta\">Syllabus units load when available.</p>") +
        '<p class="cu-meta" style="margin-top:0.75rem"><a href="/library/">Library</a> · <a href="/campus/buddy/">Ask Buddy</a> · <a href="/campus/">Map</a></p>';
    } catch (e) {}
  }

  function mount() {
    var host =
      document.getElementById("cu-mirath-host") ||
      document.getElementById("cu-stage") ||
      document.querySelector("article.cu-student") ||
      document.querySelector("main.cu-wrap");
    if (!host) return;
    fetch(SYL)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        render(data || {}, host);
      })
      .catch(function () {
        var host2 = document.getElementById("cu-mirath-host") || host;
        if (!document.getElementById("mirath-curriculum-card")) {
          var card = el("section", "cu-plaque");
          card.id = "mirath-curriculum-card";
          card.innerHTML =
            "<strong>Mīrāth</strong><p class=\"cu-meta\">Syllabus could not load offline. Open when connected, or study from Library sources. Educational only — not a fatwa.</p>";
          host2.appendChild(card);
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})(window);
