/**
 * Gate kill + Day landing first paint harden
 */
(function(g){
  "use strict";
  if(g.__CLARITY_GATE_KILL_V1__) return;
  g.__CLARITY_GATE_KILL_V1__=true;

  function killGateDom(){
    var sels=[
      "#clarity-welcome",".clarity-welcome",".clarity-gate-switcher",
      ".cgp-track-plaque","[data-legacy-gate]"
    ];
    sels.forEach(function(s){
      document.querySelectorAll(s).forEach(function(el){
        el.setAttribute("hidden","true");
        el.style.setProperty("display","none","important");
      });
    });
    /* Gate mode buttons by text */
    document.querySelectorAll("button, a, .btn").forEach(function(el){
      var t=(el.textContent||"").trim();
      if(/^Gate mode$/i.test(t)){
        el.style.setProperty("display","none","important");
        el.setAttribute("hidden","true");
      }
    });
  }

  function preferLanding(){
    try{
      var pick=sessionStorage.getItem("clarity_shell_pick_v1");
      if(pick==="companion") return;
      document.documentElement.setAttribute("data-shell-mode","landing");
      localStorage.setItem("clarity_shell_mode_v1","landing");
      if(g.ClarityShell && g.ClarityShell.setMode) g.ClarityShell.setMode("landing");
    }catch(e){}
  }

  function boot(){ killGateDom(); preferLanding(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200,800,2000].forEach(function(ms){ setTimeout(boot, ms); });
  /* When user opens companion path, mark session pick */
  document.addEventListener("click", function(ev){
    var t=ev.target;
    if(!t) return;
    var a=t.closest && t.closest("#day-path-companion, #dual-path-companion, [data-path='companion']");
    if(a){ try{ sessionStorage.setItem("clarity_shell_pick_v1","companion"); }catch(e){} }
    if(t.closest && t.closest("#day-path-landing, [data-shell='landing'], .day-landing-btn")){
      try{ sessionStorage.setItem("clarity_shell_pick_v1","landing"); }catch(e){}
    }
  }, true);
})(typeof window!=="undefined"?window:this);
