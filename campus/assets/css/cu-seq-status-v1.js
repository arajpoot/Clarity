/**
 * cu-seq-status-v1.js — Student status chip from sequential bus
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_STATUS_V1__) return;
  g.__CU_SEQ_STATUS_V1__ = true;
  function paint() {
    if (!g.CuSeq) return;
    var el = document.getElementById("cu-student-status") || document.querySelector("[data-student-status]");
    if (!el) {
      var host = document.querySelector("main.cu-desk-main") || document.querySelector("main");
      if (!host) return;
      el = document.createElement("div");
      el.id = "cu-student-status";
      el.className = "cu-student-status seq-status";
      var verse = host.querySelector(".cu-desk-verse");
      if (verse && verse.nextSibling) host.insertBefore(el, verse.nextSibling);
      else host.insertBefore(el, host.firstChild);
    }
    var n = g.CuSeq.getNext();
    var c = g.CuSeq.counts();
    var stage = (document.body.getAttribute("data-phase-room") || (n && n.stage) || "seeker");
    var st = c[stage] || { done: 0, total: 0 };
    el.innerHTML =
      "<strong>Status</strong> · " +
      g.CuSeq.stageLabel(stage) +
      " · " +
      st.done +
      "/" +
      st.total +
      (n && n.moduleId ? " · Next: " + n.moduleId : " · Path complete on device");
  }
  function boot() {
    paint();
    document.addEventListener("cu-seq-progress", paint);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
