/* Phase 2 — Continue learning flow + Phase 3 portfolio strip */
(function (g) {
  "use strict";
  if (g.__CU_CONTINUE_FLOW_V1__) return;
  g.__CU_CONTINUE_FLOW_V1__ = true;

  var PROGRESS_KEY = "clarity_junior_progress_v1";

  function loadDone() {
    try {
      var o = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      return o.done || o || {};
    } catch (e) {
      return {};
    }
  }

  function juniorApi() {
    return g.ClarityJuniorCurriculum || g.ClaritySeekerCollege || null;
  }

  function nextLessonLabel() {
    var api = juniorApi();
    if (api && api.UNITS && typeof api.activeModuleIndex === "function") {
      try {
        var mods = [];
        api.UNITS.forEach(function (u) {
          (u.lessons || []).forEach(function (les) {
            mods.push({ unit: u.title, lesson: les });
          });
        });
        var idx =
          typeof api.activeModuleIndex === "function"
            ? api.activeModuleIndex()
            : 0;
        if (idx >= mods.length) {
          return { title: "Phase 1 complete — phase quiz when ready", done: true };
        }
        var m = mods[idx];
        return {
          title: (m.lesson && m.lesson.title) || "Next lesson",
          unit: m.unit,
          done: false
        };
      } catch (e) {}
    }
    /* fallback from progress */
    return { title: "Open Junior curriculum", unit: "Uṣūl", done: false };
  }

  function injectCss() {
    if (document.getElementById("cu-continue-css")) return;
    var s = document.createElement("style");
    s.id = "cu-continue-css";
    s.textContent =
      "#cu-continue-bar{margin:.5rem 0 1rem;padding:.85rem 1rem;border-radius:14px;" +
      "border:1px solid rgba(224,197,106,.4);background:linear-gradient(135deg,rgba(15,76,58,.55),rgba(10,18,16,.9));" +
      "color:#eaf3ee}" +
      "#cu-continue-bar .cu-kicker{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#7dcea0;font-weight:700}" +
      "#cu-continue-bar strong{display:block;margin:.2rem 0 .45rem;font-size:1rem;color:#f3e6c0}" +
      "#cu-continue-bar .cu-actions{display:flex;flex-wrap:wrap;gap:.4rem}" +
      "#cu-continue-bar a,#cu-continue-bar button{font:inherit;font-size:.78rem;font-weight:700;min-height:44px;" +
      "padding:.4rem .85rem;border-radius:999px;border:1px solid rgba(224,197,106,.35);cursor:pointer;" +
      "text-decoration:none;display:inline-flex;align-items:center;background:linear-gradient(135deg,#1fa67a,#0f4c3a);color:#f7f3eb}" +
      "#cu-continue-bar a.secondary,#cu-continue-bar button.secondary{background:transparent;color:#f3e6c0}" +
      "#cu-portfolio-strip{margin:0 0 1rem;padding:.65rem .85rem;border-radius:12px;border:1px solid rgba(224,197,106,.22);" +
      "background:rgba(0,0,0,.25);font-size:.78rem;color:rgba(234,243,238,.85)}" +
      "#cu-portfolio-strip strong{color:#e0c56a}";
    document.head.appendChild(s);
  }

  function scrollToJunior() {
    var card = document.getElementById("junior-curriculum-card");
    if (card) {
      try {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        location.hash = "junior-curriculum-card";
      }
      return;
    }
    /* trigger college render */
    if (g.ClarityJuniorCurriculum && g.ClarityJuniorCurriculum.render) {
      g.ClarityJuniorCurriculum.render();
      setTimeout(function () {
        var c = document.getElementById("junior-curriculum-card");
        if (c) c.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }

  function renderContinue(host) {
    injectCss();
    var next = nextLessonLabel();
    var bar = document.getElementById("cu-continue-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "cu-continue-bar";
      host.insertBefore(bar, host.firstChild);
    }
    bar.innerHTML =
      '<div class="cu-kicker">Continue learning</div>' +
      "<strong>" +
      (next.unit ? next.unit + " · " : "") +
      (next.title || "Junior path") +
      "</strong>" +
      '<div class="cu-actions">' +
      '<button type="button" id="cu-btn-continue">' +
      (next.done ? "Review curriculum" : "Continue here") +
      "</button>" +
      '<a class="secondary" href="/lab/">Practice in Lab</a>' +
      '<a class="secondary" href="/journey/">Journey map</a></div>';
    bar.querySelector("#cu-btn-continue").onclick = function () {
      scrollToJunior();
    };
  }

  function renderPortfolioStrip(host) {
    var P = g.ClarityLabPortfolio;
    var rows = [];
    if (P && typeof P.transcript === "function") {
      rows = P.transcript().slice(0, 3);
    } else {
      try {
        rows = JSON.parse(localStorage.getItem("cu_lab_transcript_v1") || "[]").slice(0, 3);
      } catch (e) {}
    }
    var el = document.getElementById("cu-portfolio-strip");
    if (!el) {
      el = document.createElement("div");
      el.id = "cu-portfolio-strip";
      var cont = document.getElementById("cu-continue-bar");
      if (cont && cont.parentNode) cont.parentNode.insertBefore(el, cont.nextSibling);
      else host.insertBefore(el, host.firstChild);
    }
    if (!rows.length) {
      el.innerHTML =
        "<strong>Lab transcript</strong> — empty. Complete a Lab practice, O&amp;M review, then Director score.";
      return;
    }
    el.innerHTML =
      "<strong>Lab transcript</strong> (latest) · " +
      rows
        .map(function (r) {
          return (r.station || "") + " " + (r.title || "") + " · " + r.score;
        })
        .join(" · ");
  }

  /* Journey page: reflect junior progress */
  function syncJourney() {
    if ((location.pathname || "").indexOf("/journey") !== 0) return;
    var host =
      document.querySelector(".cu-wrap") ||
      document.querySelector("main") ||
      document.body;
    var next = nextLessonLabel();
    injectCss();
    var n = document.getElementById("cu-journey-sync");
    if (!n) {
      n = document.createElement("div");
      n.id = "cu-journey-sync";
      n.style.cssText =
        "margin:0.75rem 0;padding:0.75rem 1rem;border-radius:12px;border:1px solid rgba(224,197,106,.3);background:rgba(15,76,58,.25);color:#eaf3ee;font-size:.84rem";
      host.insertBefore(n, host.firstChild);
    }
    n.innerHTML =
      "<strong style=\"color:#e0c56a\">Your Junior path</strong><br/>" +
      (next.done
        ? "Phase 1 modules complete — return to Desk for phase quiz when ready."
        : "Next: " +
          (next.unit ? next.unit + " — " : "") +
          next.title) +
      ' <a href="/campus/desk/?phase=seeker" style="color:#7dcea0">Open Desk</a>';
  }

  function boot() {
    var path = location.pathname || "";
    if (path.indexOf("/campus/desk") === 0) {
      var host =
        document.getElementById("campus-stage-body") ||
        document.querySelector(".cu-wrap") ||
        document.querySelector("main");
      if (host) {
        renderContinue(host);
        /* portfolio after idle so lab-portfolio may load */
        setTimeout(function () {
          renderPortfolioStrip(host);
        }, 600);
        g.addEventListener("cu-desk-idle-ready", function () {
          renderPortfolioStrip(host);
        });
      }
    }
    if (path.indexOf("/journey") === 0) syncJourney();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("cu-mahtaab-ready", boot);

  g.ClarityContinueFlow = { refresh: boot, scrollToJunior: scrollToJunior };
})(typeof window !== "undefined" ? window : this);
