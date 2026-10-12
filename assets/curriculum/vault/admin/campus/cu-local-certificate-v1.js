/* Phase E — local soft learning record (non-accredited) */
(function (g) {
  "use strict";
  if (g.__CU_LOCAL_CERT_V1__) return;
  g.__CU_LOCAL_CERT_V1__ = true;
  function quizPasses() {
    try { return JSON.parse(localStorage.getItem("clarity_phase_quiz_pass_v1") || "{}"); } catch (e) { return {}; }
  }
  function boot() {
    if (!document.body || document.body.getAttribute("data-campus-page") !== "desk") return;
    var q = quizPasses();
    var keys = Object.keys(q).filter(function (k) { return q[k]; });
    if (!keys.length) return;
    var host = document.querySelector(".cu-desk-main") || document.querySelector("main");
    if (!host || host.querySelector(".cu-local-cert")) return;
    var d = document.createElement("div");
    d.className = "cu-local-cert";
    d.style.cssText = "margin:0.75rem 0;padding:0.75rem 0.9rem;border-radius:14px;border:1px solid rgba(224,197,106,.35);background:rgba(31,166,122,.1);font-size:0.8rem;line-height:1.45;color:#eaf3ee";
    d.innerHTML = "<strong style=\"color:#e0c56a\">Local learning record</strong><br/>Phase quiz marks on this device: " +
      keys.join(", ") +
      ". <em>Not a diploma, transcript, or affiliation with any university.</em>";
    host.appendChild(d);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 1800); });
  else setTimeout(boot, 1800);
})(typeof window !== "undefined" ? window : this);
