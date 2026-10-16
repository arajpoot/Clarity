/* Multipage flow — remember last campus page, soft nav highlight */
(function (g) {
  "use strict";
  if (g.__CU_PAGE_FLOW_V1__) return;
  g.__CU_PAGE_FLOW_V1__ = true;
  var KEY = "cu_last_campus_path_v1";
  try {
    if (location.pathname.indexOf("/campus") === 0 ||
        location.pathname.indexOf("/lab") === 0 ||
        location.pathname.indexOf("/library") === 0 ||
        location.pathname.indexOf("/journey") === 0 ||
        location.pathname.indexOf("/vault") === 0 ||
        location.pathname.indexOf("/systems") === 0 ||
        location.pathname.indexOf("/charter") === 0) {
      sessionStorage.setItem(KEY, location.pathname + location.search);
    }
  } catch (e) {}
  /* Mark current pill */
  function mark() {
    var path = location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".cu-pills a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/\/$/, "");
      if (!href) return;
      var here = path === href || (href !== "/campus" && path.indexOf(href) === 0) ||
        (href.indexOf("/campus/desk") === 0 && path.indexOf("/campus/desk") === 0);
      if (href === "/campus" && path === "/campus") here = true;
      if (href === "/campus" && path.indexOf("/campus/desk") === 0) here = false;
      a.classList.toggle("here", !!here);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mark);
  else mark();
  g.ClarityPageFlow = {
    last: function () {
      try { return sessionStorage.getItem(KEY) || "/campus/"; } catch (e) { return "/campus/"; }
    }
  };
})(typeof window !== "undefined" ? window : this);
