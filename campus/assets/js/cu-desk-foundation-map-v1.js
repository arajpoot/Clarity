/*! cu-desk-foundation-map-v1 · U36 CF2 — ensure A+B+C links on desk hub */
(function (w, d) {
  "use strict";
  if (w.__CU_DESK_FOUNDATION_MAP_V1__) return;
  w.__CU_DESK_FOUNDATION_MAP_V1__ = true;
  function isDeskHub() {
    var p = (location.pathname || "").replace(/\/+$/, "");
    return p === "/campus/desk";
  }
  function boot() {
    if (!isDeskHub()) return;
    if (d.getElementById("cu-desk-atlas")) return; /* U27 atlas already */
    /* minimal fallback map */
    var sec = d.createElement("section");
    sec.id = "cu-desk-atlas";
    sec.className = "cu-desk-atlas";
    sec.innerHTML =
      '<h2 style="color:#e8c76b;text-align:center">Campus desk map</h2>' +
      '<p style="text-align:center;font-size:0.88rem">Stages · Shelves · Halls — educational only</p>' +
      '<p style="text-align:center;font-size:0.85rem">' +
      '<a href="/campus/desk/seeker/">Seeker</a> · ' +
      '<a href="/campus/desk/practice/">Practice</a> · ' +
      '<a href="/campus/desk/consistency/">Consistency</a> · ' +
      '<a href="/campus/desk/transmission/">Transmission</a><br/>' +
      '<a href="/campus/desk/foundation/">Foundation</a> · ' +
      '<a href="/campus/desk/pillars/">Pillars</a> · ' +
      '<a href="/campus/desk/ihsan/">Iḥsān</a> · ' +
      '<a href="/campus/desk/amanah/">Amānah of knowledge</a><br/>' +
      '<a href="/campus/lab/">Lab</a> · <a href="/campus/library/">Library</a> · ' +
      '<a href="/campus/portal/">Portal</a> · <a href="/campus/bots/">Bots</a>' +
      "</p>";
    var main = d.querySelector("main") || d.body;
    main.insertBefore(sec, main.firstChild);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
