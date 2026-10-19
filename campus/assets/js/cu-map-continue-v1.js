
(function(){
  if (window.__CU_MAP_CONTINUE_V1__) return;
  window.__CU_MAP_CONTINUE_V1__ = true;
  var PHASES = [
    {id:"seeker", label:"Seeker", href:"/campus/desk/seeker/", hint:"Foundations · one module at a time"},
    {id:"practice", label:"Practice", href:"/campus/desk/practice/", hint:"Skills after foundations"},
    {id:"consistency", label:"Consistency", href:"/campus/desk/consistency/", hint:"Steady craft and review"},
    {id:"transmission", label:"Transmission", href:"/campus/desk/transmission/", hint:"Share with adab and sources"}
  ];
  function boot(){
    var phase = "seeker";
    try { phase = localStorage.getItem("clarity_curriculum_phase_v1") || "seeker"; } catch(e){}
    var p = PHASES[0];
    for (var i=0;i<PHASES.length;i++) if (PHASES[i].id===phase) p = PHASES[i];
    var strong = document.querySelector("#cu-continue strong");
    var hint = document.getElementById("cu-map-continue-hint");
    var a = document.getElementById("cu-map-continue-href");
    if (strong) strong.textContent = "Continue · " + p.label;
    if (hint) hint.textContent = p.hint;
    if (a) { a.href = p.href; }
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
