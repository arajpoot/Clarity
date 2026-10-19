
(function(){
  if (window.__CU_TRANSCRIPT_SURFACE_V1__) return;
  window.__CU_TRANSCRIPT_SURFACE_V1__ = true;
  function read(k){ try{return JSON.parse(localStorage.getItem(k)||"null");}catch(e){return null;} }
  function boot(){
    var root = document.getElementById("cu-transcript-root");
    if (!root) return;
    if (window.CuUniProgress && CuUniProgress.paintTranscript) {
      CuUniProgress.paintTranscript();
      return;
    }
    var keys = ["cu_uni_progress_v1","clarity_junior_progress_v1","clarity_practice_progress_v1","clarity_consistency_progress_v1","clarity_transmission_progress_v1"];
    var html = "<strong>Local progress keys</strong><ul>";
    keys.forEach(function(k){
      var v = read(k);
      var n = 0;
      if (v && v.modules) n = Object.keys(v.modules).length;
      else if (v && typeof v === "object") {
        Object.keys(v).forEach(function(id){ if (v[id]&&(v[id]===true||v[id].done)) n++; });
      }
      html += "<li>"+k+" · "+n+" marked</li>";
    });
    html += "</ul><p class=\"cu-meta\">Open a desk and mark modules complete to grow this record.</p>";
    root.innerHTML = html;
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
