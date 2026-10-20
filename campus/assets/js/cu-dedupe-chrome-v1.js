(function(){
  if (window.__CU_DEDUPE_CHROME_V1__) return;
  window.__CU_DEDUPE_CHROME_V1__ = true;
  function dedupe(){
    function trim(sel){
      var n = document.querySelectorAll(sel);
      for (var i = 1; i < n.length; i++) n[i].remove();
    }
    trim("header.cu-banner");
    trim("nav.cu-pills");
    trim("nav.lab-station-nav");
    trim("[data-cu-student-status]");
    trim("#cu-day-flow");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", dedupe);
  else dedupe();
  setTimeout(dedupe, 250);
  setTimeout(dedupe, 900);
})();
