(function(){
  if (window.__CU_NO_GUIDES_V1__) return;
  window.__CU_NO_GUIDES_V1__ = true;
  function scrub(){
    document.querySelectorAll(".cu-personas-dock,#cu-personas-dock,[data-cu-personas],.cu-guides-bubble,.faculty-guide,#guides-root").forEach(function(el){ el.remove(); });
  }
  scrub();
  document.addEventListener("DOMContentLoaded", scrub);
  setTimeout(scrub, 400);
})();
