/* Link Daily/Da'i style modules toward Lab stations */
(function (g) {
  "use strict";
  if (g.__CU_LAB_CURR_LINK_V1__) return;
  g.__CU_LAB_CURR_LINK_V1__ = true;

  function inject() {
    if (!document.body || document.body.getAttribute("data-campus-page") !== "desk") return;
    if (document.getElementById("cu-lab-curr-links")) return;
    var host =
      document.getElementById("campus-stage-body") ||
      document.getElementById("clarity-campus-stage");
    if (!host) return;
    var bar = document.createElement("div");
    bar.id = "cu-lab-curr-links";
    bar.setAttribute(
      "style",
      "display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0 .75rem;justify-content:center"
    );
    bar.innerHTML =
      '<a href="/lab/?station=tajweed" style="font-size:.72rem;font-weight:700;padding:.35rem .7rem;border-radius:999px;border:1px solid rgba(224,197,106,.35);background:rgba(31,166,122,.2);color:#f3e6c0;text-decoration:none">Open Tajweed Lab</a>' +
      '<a href="/lab/?station=callig" style="font-size:.72rem;font-weight:700;padding:.35rem .7rem;border-radius:999px;border:1px solid rgba(224,197,106,.35);background:rgba(31,166,122,.2);color:#f3e6c0;text-decoration:none">Open Calligraphy Lab</a>' +
      '<a href="/lab/?station=media" style="font-size:.72rem;font-weight:700;padding:.35rem .7rem;border-radius:999px;border:1px solid rgba(224,197,106,.35);background:rgba(31,166,122,.2);color:#f3e6c0;text-decoration:none">Open Media Reminder</a>';
    host.insertBefore(bar, host.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(inject, 400);
  });
})(typeof window !== "undefined" ? window : this);
