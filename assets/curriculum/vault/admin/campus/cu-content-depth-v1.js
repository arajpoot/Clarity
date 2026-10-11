/* Clarity University — Content depth injector v1 (Phase 3)
 * Enhances visible lesson cards without rewriting sealed foundation/*.js
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_CONTENT_DEPTH_V1__) return;
  g.__CU_CONTENT_DEPTH_V1__ = true;

  var PACK_URL = "/assets/curriculum/shared/lesson-packs-v1.json?v=20261011P34";
  var pack = null;
  var applied = {};

  function phaseId() {
    try {
      if (g.ClarityUnivLearner && g.ClarityUnivLearner.phases) {
        var n = g.ClarityUnivLearner.currentPhaseNum();
        var ph = g.ClarityUnivLearner.phases[n - 1];
        if (ph) return ph.id;
      }
    } catch (e) {}
    try {
      var u = new URL(location.href);
      var q = (u.searchParams.get("phase") || "seeker").toLowerCase();
      if (q === "junior") q = "seeker";
      return q;
    } catch (e2) {
      return "seeker";
    }
  }

  function loadPack() {
    if (pack) return Promise.resolve(pack);
    return fetch(PACK_URL, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("pack");
        return r.json();
      })
      .then(function (j) {
        pack = j;
        return j;
      })
      .catch(function () {
        pack = { phases: {} };
        return pack;
      });
  }

  function lessonFromPack(id) {
    if (!pack || !pack.phases) return null;
    var pid = phaseId();
    var phase = pack.phases[pid];
    if (!phase || !phase.lessons) {
      /* search all phases */
      var keys = Object.keys(pack.phases);
      for (var i = 0; i < keys.length; i++) {
        var L = pack.phases[keys[i]].lessons || {};
        if (L[id]) return L[id];
      }
      return null;
    }
    return phase.lessons[id] || null;
  }

  function enhanceNode(node) {
    if (!node || node.nodeType !== 1) return;
    var id =
      node.getAttribute("data-lesson-id") ||
      node.getAttribute("data-module-id") ||
      node.getAttribute("data-id") ||
      "";
    if (!id) {
      /* try child markers */
      var marked = node.querySelector("[data-lesson-id], [data-module-id]");
      if (marked) {
        id =
          marked.getAttribute("data-lesson-id") ||
          marked.getAttribute("data-module-id") ||
          "";
      }
    }
    if (!id || applied[id + node.className]) return;
    var les = lessonFromPack(id);
    if (!les) return;
    applied[id + node.className] = 1;

    if (node.querySelector(".cu-depth-panel")) return;
    var panel = document.createElement("div");
    panel.className = "cu-depth-panel";
    panel.setAttribute("data-cu-depth", id);
    var html = "";
    if (les.summary) {
      html += '<p class="cu-depth-sum">' + escapeHtml(les.summary) + "</p>";
    }
    if (les.points && les.points.length) {
      html += "<ul class=\"cu-depth-points\">";
      les.points.forEach(function (p) {
        html += "<li>" + escapeHtml(p) + "</li>";
      });
      html += "</ul>";
    }
    if (les.ayah && les.ayah.ref) {
      html +=
        '<div class="cu-depth-ayah"><strong>' +
        escapeHtml(les.ayah.ref) +
        "</strong> — " +
        escapeHtml(les.ayah.en || "") +
        "</div>";
    }
    if (les.links && les.links.length) {
      html += '<div class="cu-depth-links">';
      les.links.forEach(function (l) {
        html +=
          '<a href="' +
          escapeAttr(l.href) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(l.label || "Source") +
          "</a> ";
      });
      html += "</div>";
    }
    html +=
      '<p class="cu-depth-note">Educational only — not a fatwa. Verify with Qurʾān, Sunnah, and a local scholar.</p>';
    panel.innerHTML = html;
    node.appendChild(panel);
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

  function scan() {
    var roots = [
      document.getElementById("junior-curriculum-body"),
      document.getElementById("campus-stage-body"),
      document.getElementById("clarity-campus-stage")
    ];
    roots.forEach(function (root) {
      if (!root) return;
      root.querySelectorAll("[data-lesson-id], [data-module-id], .junior-module, .cu-module, .module-card").forEach(enhanceNode);
      /* also match headings that equal pack titles */
      if (!pack || !pack.phases) return;
      var phase = pack.phases[phaseId()];
      if (!phase || !phase.lessons) return;
      Object.keys(phase.lessons).forEach(function (lid) {
        var title = phase.lessons[lid].title;
        if (!title) return;
        root.querySelectorAll("h3, h4, .junior-lesson-title, strong").forEach(function (h) {
          var t = (h.textContent || "").trim();
          if (t === title || t.indexOf(title) === 0) {
            var card = h.closest(".junior-module, .module-card, article, section, li, div");
            if (card) {
              if (!card.getAttribute("data-lesson-id")) card.setAttribute("data-lesson-id", lid);
              enhanceNode(card);
            }
          }
        });
      });
    });
  }

  function injectStyles() {
    if (document.getElementById("cu-depth-css")) return;
    var s = document.createElement("style");
    s.id = "cu-depth-css";
    s.textContent =
      ".cu-depth-panel{margin-top:.55rem;padding:.65rem .75rem;border-radius:12px;border:1px solid rgba(224,197,106,.28);background:rgba(0,0,0,.22);font-size:.8rem;line-height:1.45;color:rgba(234,243,238,.9)}" +
      ".cu-depth-sum{margin:0 0 .4rem;color:#f3e6c0;font-weight:600}" +
      ".cu-depth-points{margin:.2rem 0 .45rem 1.1rem;padding:0}" +
      ".cu-depth-points li{margin:.2rem 0}" +
      ".cu-depth-ayah{margin:.35rem 0;padding:.4rem .55rem;border-left:3px solid #e0c56a;background:rgba(224,197,106,.08)}" +
      ".cu-depth-links a{color:#e0c56a;margin-right:.5rem;font-weight:600;text-decoration:none}" +
      ".cu-depth-links a:hover{text-decoration:underline}" +
      ".cu-depth-note{margin:.45rem 0 0;font-size:.68rem;opacity:.8}";
    document.head.appendChild(s);
  }

  function boot() {
    injectStyles();
    loadPack().then(function () {
      scan();
      setTimeout(scan, 800);
      setTimeout(scan, 2000);
      setTimeout(scan, 4000);
    });
    try {
      var body = document.getElementById("campus-stage-body") || document.body;
      if (body && !body.__cuDepthObs) {
        body.__cuDepthObs = true;
        var mo = new MutationObserver(function () {
          scan();
        });
        mo.observe(body, { childList: true, subtree: true });
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(boot, 300); });
  g.addEventListener("cu-phase-selected", function () {
    applied = {};
    setTimeout(scan, 400);
  });
})(typeof window !== "undefined" ? window : this);
