/* Phase C — opt-in deep shelf (external, non-affiliated) */
(function (g) {
  "use strict";
  if (g.__CU_DEEP_SHELF_V1__) return;
  g.__CU_DEEP_SHELF_V1__ = true;
  var URL = "/assets/curriculum/shared/deep-shelves-v1.json?v=20261012BF";
  function phaseId() {
    try {
      var u = new URL(location.href);
      var q = (u.searchParams.get("phase") || "seeker").toLowerCase();
      if (q === "junior") q = "seeker";
      return q;
    } catch (e) {
      return "seeker";
    }
  }
  function boot() {
    if (!document.body || document.body.getAttribute("data-campus-page") !== "desk") return;
    fetch(URL, { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var host = document.querySelector(".cu-desk-main") || document.querySelector("main");
        if (!host || host.querySelector(".cu-deep-shelf")) return;
        var box = document.createElement("details");
        box.className = "cu-deep-shelf";
        box.style.cssText =
          "margin:0.75rem 0;padding:0.65rem 0.85rem;border-radius:14px;border:1px dashed rgba(224,197,106,.35);background:rgba(0,0,0,.2);color:#eaf3ee;font-size:0.8rem";
        box.innerHTML =
          "<summary style=\"cursor:pointer;font-weight:700;color:#e0c56a\">Go deeper (optional external links)</summary>" +
          "<p style=\"margin:0.45rem 0;opacity:0.8;line-height:1.4\">" +
          (data.disclaimer || "") +
          "</p>";
        var row = document.createElement("div");
        row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.35rem";
        var links = (data.phases && data.phases[phaseId()]) || [];
        links.forEach(function (L) {
          var a = document.createElement("a");
          a.href = L.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = L.title;
          a.style.cssText =
            "font-size:0.72rem;font-weight:600;padding:0.28rem 0.55rem;border-radius:999px;border:1px solid rgba(224,197,106,.3);background:rgba(0,0,0,.25);color:#e0c56a;text-decoration:none";
          row.appendChild(a);
        });
        box.appendChild(row);
        host.appendChild(box);
      })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
