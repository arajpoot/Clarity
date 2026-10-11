/* Local phase-complete note — explicit non-accreditation (Phase 6) */
(function (g) {
  "use strict";
  if (g.__CU_PHASE_PLAQUE_LOCAL_V1__) return;
  g.__CU_PHASE_PLAQUE_LOCAL_V1__ = true;

  function maybeNote() {
    var host = document.getElementById("campus-stage-body");
    if (!host || host.querySelector(".cu-local-plaque")) return;
    var q = {};
    try { q = JSON.parse(localStorage.getItem("clarity_phase_quiz_pass_v1") || "{}"); } catch (e) {}
    var passed = Object.keys(q).filter(function (k) { return q[k]; });
    if (!passed.length) return;
    var d = document.createElement("div");
    d.className = "cu-local-plaque";
    d.style.cssText = "margin:0.75rem 0;padding:0.75rem 0.9rem;border-radius:12px;border:1px solid rgba(224,197,106,.35);background:rgba(31,166,122,.12);font-size:0.8rem;line-height:1.45;color:#eaf3ee";
    d.innerHTML = "<strong style=\"color:#e0c56a\">Local phase checks on this device</strong><br/>" +
      "Recorded quiz passes: " + passed.join(", ") +
      ". This is a personal learning record only — <em>not</em> a diploma or affiliation with any university.";
    host.insertBefore(d, host.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(maybeNote, 2000); });
  else setTimeout(maybeNote, 2000);
})(typeof window !== "undefined" ? window : this);
