
/** R2 last-wins Guides closer (20261018R2R3) */
(function(){
  if (window.__CU_GUIDES_CLOSE_R2__) return;
  window.__CU_GUIDES_CLOSE_R2__ = true;
  function close(){
    var dock = document.getElementById("cu-personas-dock");
    if (!dock) return;
    var panel = dock.querySelector(".cu-personas-dock-panel");
    var toggle = dock.querySelector(".cu-personas-dock-toggle");
    if (panel){ panel.hidden = true; panel.setAttribute("hidden",""); panel.style.display="none"; }
    if (toggle) toggle.setAttribute("aria-expanded","false");
    dock.classList.remove("open");
  }
  document.addEventListener("click", function(e){
    var dock = document.getElementById("cu-personas-dock");
    if (!dock) return;
    if (!dock.contains(e.target)) close();
  }, true);
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape") close();
  });
})();
