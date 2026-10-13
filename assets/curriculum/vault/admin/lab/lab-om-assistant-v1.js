/* O&M as Lab Assistant — digital review of student lab logs */
(function (g) {
  "use strict";
  if (g.__CU_LAB_OM_ASSIST_V1__) return;
  g.__CU_LAB_OM_ASSIST_V1__ = true;

  function openPanel() {
    var P = g.ClarityLabPortfolio;
    if (!P) {
      alert("Lab portfolio not loaded.");
      return;
    }
    var pending = P.pendingOm();
    var old = document.getElementById("cu-lab-om-panel");
    if (old) old.remove();

    var wrap = document.createElement("div");
    wrap.id = "cu-lab-om-panel";
    wrap.className = "clarity-om-modal cu-wing-modal";
    wrap.innerHTML =
      '<div class="cu-lab-review-card">' +
      "<h2 style=\"margin:0 0 .35rem;color:#f3e6c0\">O&amp;M · Lab Assistant</h2>" +
      '<p style="font-size:.78rem;opacity:.75;margin:0 0 .75rem">Review student lab logs, then present a short report to the Lab Director. On-device only — educational UX.</p>' +
      '<div id="cu-lab-om-list"></div>' +
      '<p style="margin-top:.75rem"><button type="button" id="cu-lab-om-close" class="craft-btn secondary">Close</button></p></div>';

    var style = document.getElementById("cu-lab-review-css");
    if (!style) {
      style = document.createElement("style");
      style.id = "cu-lab-review-css";
      style.textContent =
        ".cu-lab-review-card{max-width:26rem;width:100%;margin:auto;padding:1.1rem;border-radius:16px;" +
        "border:1px solid rgba(224,197,106,.4);background:rgba(12,20,18,.98);color:#eaf3ee}" +
        ".cu-lab-item{border:1px solid rgba(224,197,106,.22);border-radius:12px;padding:.65rem .75rem;margin:.4rem 0}" +
        ".cu-lab-item strong{color:#e0c56a;font-size:.85rem}" +
        ".cu-lab-item p{font-size:.78rem;margin:.25rem 0;line-height:1.4}" +
        ".cu-lab-item textarea{width:100%;box-sizing:border-box;min-height:3rem;margin:.35rem 0;border-radius:8px;" +
        "border:1px solid rgba(224,197,106,.3);background:rgba(0,0,0,.35);color:#f3e6c0;font:inherit;font-size:.78rem}" +
        ".cu-lab-item button{font:inherit;font-size:.75rem;font-weight:700;margin-top:.25rem;padding:.35rem .7rem;" +
        "border-radius:999px;border:1px solid rgba(224,197,106,.35);background:rgba(31,166,122,.35);color:#f7f3eb;cursor:pointer}";
      document.head.appendChild(style);
    }

    document.body.appendChild(wrap);
    document.body.classList.add("cu-modal-open");

    var list = wrap.querySelector("#cu-lab-om-list");
    if (!pending.length) {
      list.innerHTML = '<p style="font-size:.82rem;opacity:.7">No submissions waiting for O&amp;M review.</p>';
    } else {
      pending.forEach(function (row) {
        var div = document.createElement("div");
        div.className = "cu-lab-item";
        div.innerHTML =
          "<strong>" +
          (row.station || "") +
          " · " +
          (row.title || "") +
          "</strong>" +
          "<p>" +
          (row.note || "—") +
          "</p>" +
          '<textarea placeholder="Assistant notes (effort, clarity, adab)…"></textarea>' +
          '<button type="button">Send report to Lab Director</button>';
        div.querySelector("button").onclick = function () {
          var summary = div.querySelector("textarea").value || "Reviewed — present to teacher.";
          P.omReview(row.id, {
            summary: summary,
            checklist: { complete: true, adab: true },
            recommend: "ready_for_teacher"
          });
          div.innerHTML = "<p style=\"color:#7dcea0;font-size:.8rem\">Report filed for teacher assessment.</p>";
        };
        list.appendChild(div);
      });
    }

    wrap.querySelector("#cu-lab-om-close").onclick = function () {
      wrap.remove();
      document.body.classList.remove("cu-modal-open");
    };
    wrap.addEventListener("click", function (ev) {
      if (ev.target === wrap) {
        wrap.remove();
        document.body.classList.remove("cu-modal-open");
      }
    });
  }

  /* Hook O&M openDesk if present */
  function patch() {
    var api = g.ClarityOM;
    if (api && !api.__labAssist) {
      var prev = api.openDesk;
      api.openDesk = function () {
        openPanel();
        if (typeof prev === "function") {
          try {
            prev();
          } catch (e) {}
        }
      };
      api.__labAssist = true;
      api.openLabAssistant = openPanel;
    } else {
      g.ClarityOM = g.ClarityOM || {};
      g.ClarityOM.openLabAssistant = openPanel;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", patch);
  else patch();
  g.addEventListener("cu-mahtaab-ready", patch);

  g.ClarityLabOmAssist = { open: openPanel };
})(typeof window !== "undefined" ? window : this);
