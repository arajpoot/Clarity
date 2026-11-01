/*! T3 companion shell — ensure day landing + tab panels not display-collapsed by mistake */
(function(){
  "use strict";
  if (window.__CLARITY_SHELL_T3__) return;
  window.__CLARITY_SHELL_T3__ = true;
  function fix(){
    var land = document.getElementById("clarity-day-landing");
    if (land) {
      try {
        if (land.style.display === "none" && document.body.getAttribute("data-landing") !== "off") {
          /* do not force if user dismissed */
        }
      } catch(e) {}
    }
    /* ensure banner overlay children visible */
    var ov = document.querySelector(".banner-overlay");
    if (ov) {
      ov.style.visibility = "visible";
      ov.style.opacity = "1";
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fix);
  else fix();
  setTimeout(fix, 500);
})();
