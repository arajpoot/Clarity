/* Lab Director scores O&M-reviewed work → transcript entry */
(function (g) {
  "use strict";
  if (g.__CU_LAB_TEACHER_SCORE_V1__) return;
  g.__CU_LAB_TEACHER_SCORE_V1__ = true;

  function openPanel() {
    var P = g.ClarityLabPortfolio;
    if (!P) return;
    var pending = P.pendingTeacher();
    var scored = P.transcript().slice(0, 5);
    var old = document.getElementById("cu-lab-teacher-panel");
    if (old) old.remove();

    var wrap = document.createElement("div");
    wrap.id = "cu-lab-teacher-panel";
    wrap.className = "clarity-faculty-modal cu-wing-modal";
    wrap.innerHTML =
      '<div class="cu-lab-review-card">' +
      "<h2 style=\"margin:0 0 .35rem;color:#f3e6c0\">Lab Director · Assessment</h2>" +
      '<p style="font-size:.78rem;opacity:.75">Ustadh Itqan al-Khatt (educational persona). Issue a score for O&amp;M-reviewed lab work. On-device transcript only — not a diploma.</p>' +
      '<div id="cu-lab-teacher-list"></div>' +
      '<h3 style="font-size:.85rem;color:#e0c56a;margin:1rem 0 .35rem">Recent transcript</h3>' +
      '<div id="cu-lab-tx" style="font-size:.75rem;opacity:.8"></div>' +
      '<p style="margin-top:.75rem"><button type="button" id="cu-lab-teacher-close" class="craft-btn secondary">Close</button></p></div>';

    document.body.appendChild(wrap);
    document.body.classList.add("cu-modal-open");

    var list = wrap.querySelector("#cu-lab-teacher-list");
    if (!pending.length) {
      list.innerHTML = '<p style="font-size:.82rem;opacity:.7">No O&amp;M reports waiting. Complete a lab log, then O&amp;M review first.</p>';
    } else {
      pending.forEach(function (row) {
        var div = document.createElement("div");
        div.className = "cu-lab-item";
        var om = (row.omReport && row.omReport.summary) || "—";
        div.innerHTML =
          "<strong>" +
          (row.station || "") +
          " · " +
          (row.title || "") +
          "</strong>" +
          "<p>Student note: " +
          (row.note || "—") +
          "</p>" +
          "<p>O&amp;M report: " +
          om +
          "</p>" +
          '<label style="font-size:.75rem">Score 0–100 <input type="number" min="0" max="100" value="80" style="width:4rem;margin-left:.35rem"/></label>' +
          '<textarea placeholder="Teacher note (encouragement / one tip)…"></textarea>' +
          '<button type="button">Enter on transcript</button>';
        div.querySelector("button").onclick = function () {
          var sc = div.querySelector('input[type=number]').value;
          var note = div.querySelector("textarea").value || "Continue with presence and adab.";
          P.teacherScore(row.id, sc, note);
          div.innerHTML = '<p style="color:#7dcea0;font-size:.8rem">Scored ' + sc + ' · transcript updated.</p>';
          renderTx();
        };
        list.appendChild(div);
      });
    }

    function renderTx() {
      var tx = wrap.querySelector("#cu-lab-tx");
      var rows = P.transcript().slice(0, 6);
      if (!rows.length) {
        tx.textContent = "No scores yet.";
        return;
      }
      tx.innerHTML = rows
        .map(function (r) {
          return (
            "• " +
            (r.station || "") +
            " — " +
            (r.title || "") +
            " · <strong>" +
            r.score +
            "</strong>"
          );
        })
        .join("<br/>");
    }
    renderTx();

    wrap.querySelector("#cu-lab-teacher-close").onclick = function () {
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

  function patchFaculty() {
    var api = g.ClarityFaculty;
    if (api && !api.__labScore) {
      api.openLabAssessment = openPanel;
      api.__labScore = true;
    }
    g.ClarityLabTeacher = { open: openPanel };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", patchFaculty);
  else patchFaculty();

  g.ClarityLabTeacher = { open: openPanel };
})(typeof window !== "undefined" ? window : this);
