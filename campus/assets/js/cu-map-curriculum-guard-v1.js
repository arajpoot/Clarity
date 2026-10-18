
(function(){
  if (window.__CU_MAP_CURRICULUM_GUARD__) return;
  window.__CU_MAP_CURRICULUM_GUARD__ = true;
  var p = (location.pathname || "").replace(/\/+$/, "") || "/";
  if (p !== "/campus" && p !== "/campus/") return;
  function strip(){
    document.querySelectorAll(".junior-curriculum, #junior-root, .college-seeker-root, .mv-junior").forEach(function(n){
      try { n.remove(); } catch(e) {}
    });
    /* if stage host appeared on map, clear it */
    var st = document.getElementById("cu-stage");
    if (st && /Junior curriculum/i.test(st.textContent || "")) {
      try { st.innerHTML = ""; } catch(e) {}
    }
  }
  setTimeout(strip, 200);
  setTimeout(strip, 1000);
  setTimeout(strip, 2500);
})();
