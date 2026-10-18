
/**
 * Map curriculum guard — Junior/college must not paint on /campus/ map
 */
(function(){
  if (window.__CU_MAP_CURRICULUM_GUARD__) return;
  window.__CU_MAP_CURRICULUM_GUARD__ = true;
  var p = (location.pathname || "").replace(/\/+$/, "") || "/";
  var isMap = p === "/campus" || p === "/campus/";
  if (!isMap) return;
  /* neutralize accidental college render hooks */
  var noop = function(){};
  try {
    if (window.ClarityCollegeSeeker && window.ClarityCollegeSeeker.render) {
      window.ClarityCollegeSeeker.render = noop;
    }
  } catch(e) {}
  /* remove junior blocks if injected */
  function strip(){
    document.querySelectorAll(".junior-curriculum, #junior-root, .college-seeker-root").forEach(function(n){
      try { n.remove(); } catch(e) {}
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(strip, 300); setTimeout(strip, 1200); });
  else { setTimeout(strip, 300); setTimeout(strip, 1200); }
})();
