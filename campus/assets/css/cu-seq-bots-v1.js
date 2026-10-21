/**
 * cu-seq-bots-v1.js — Security / IT / O&M from sequential progress
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_BOTS_V1__) return;
  g.__CU_SEQ_BOTS_V1__ = true;

  function boot() {
    if (!g.CuSeq) return;
    var sec = document.getElementById("seq-bot-security");
    var it = document.getElementById("seq-bot-it");
    var om = document.getElementById("seq-bot-om");
    var next = g.CuSeq.getNext();
    var counts = g.CuSeq.counts();

    if (sec) {
      sec.innerHTML =
        "<p><strong>Security</strong> · Progress is stored only in this browser (localStorage). Nothing is uploaded by this sequence tool.</p>" +
        '<button type="button" class="seq-btn" id="seq-sec-ok">Confirm local-only checklist</button>' +
        '<p id="seq-sec-msg" class="cu-meta"></p>';
      var b = document.getElementById("seq-sec-ok");
      if (b)
        b.onclick = function () {
          try {
            localStorage.setItem("cu_uni_seq_security_v1", JSON.stringify({ ok: true, at: new Date().toISOString() }));
          } catch (e) {}
          var m = document.getElementById("seq-sec-msg");
          if (m) m.textContent = "Confirmed on this device.";
        };
    }

    if (it) {
      var lines = g.CuSeq.STAGES.map(function (st) {
        var c = counts[st];
        return (
          "<li>" +
          g.CuSeq.stageLabel(st) +
          ": " +
          c.done +
          "/" +
          c.total +
          (c.unlocked ? "" : " (locked)") +
          "</li>"
        );
      });
      it.innerHTML =
        "<p><strong>IT</strong> · Incomplete work on this device:</p><ul>" +
        lines.join("") +
        "</ul>" +
        (next && next.moduleId
          ? "<p>Next required: <a href=\"" +
            g.CuSeq.deskHref(next.stage, next.moduleId) +
            '">' +
            next.moduleId +
            "</a></p>"
          : "<p>Sequence complete on this device.</p>");
    }

    if (om) {
      om.innerHTML =
        "<p><strong>O&amp;M</strong> · Mark one quiet step only if it matches the next required module.</p>" +
        '<button type="button" class="seq-btn primary" id="seq-om-step">Mark one quiet step</button>' +
        '<p id="seq-om-msg" class="cu-meta"></p>';
      var ob = document.getElementById("seq-om-step");
      if (ob)
        ob.onclick = function () {
          var n = g.CuSeq.getNext();
          var msg = document.getElementById("seq-om-msg");
          if (!n || !n.moduleId) {
            if (msg) msg.textContent = "No next module — sequence complete on this device.";
            return;
          }
          g.CuSeq.markModuleDone(n.moduleId);
          if (msg)
            msg.textContent =
              "Marked " + n.moduleId + " done (educational only). Refresh desk to see advance.";
        };
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
