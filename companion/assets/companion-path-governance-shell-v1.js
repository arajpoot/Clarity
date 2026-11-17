/*! companion-path-governance-shell-v1 · Slim-1 honest · educational only */
(function(w,d){
  "use strict";
  function norm(g){
    g=String(g||"dai").toLowerCase().replace(/\s+/g,"_");
    if(g==="daily"||g==="daily_muslim") return "practicing";
    if(g==="new"||g==="newmuslim") return "new_muslim";
    return g;
  }
  function gate(){
    try{
      var b=d.querySelector("[data-cs-path].is-active,button[data-cs-path].active");
      if(b) return norm(b.getAttribute("data-cs-path"));
    }catch(e){}
    try{ return norm(localStorage.getItem("cu_companion_path_v1")||"dai"); }catch(e2){}
    return "dai";
  }
  function show(el){
    if(!el) return;
    el.style.removeProperty("display");
    el.removeAttribute("hidden");
    el.classList.remove("cpp-path-hidden","is-path-hidden","arch-hidden","is-filtered-out","is-empty","nuros-deferred");
  }
  function apply(g){
    g=norm(g||gate());
    var root=d.getElementById("cs-mount")||d;
    root.querySelectorAll("[id$='-card'],section.cs-plaque:not([data-cs-path-only]),.cs-plaque[data-cs-primary],.dl-card,.cs-rich-legacy-wrap").forEach(function(el){
      if(el.hasAttribute("data-cs-path-only")) return;
      show(el);
      el.style.setProperty("display","block","important");
    });
    root.querySelectorAll(".arch-level-shelf").forEach(function(s){
      s.classList.remove("is-filtered-out","is-empty","is-collapsed");
      s.style.setProperty("display","block","important");
      var body=s.querySelector(".arch-shelf-body");
      if(body) body.style.setProperty("display","block","important");
    });
    root.querySelectorAll("[data-cs-path-only]").forEach(function(el){
      var o=norm(el.getAttribute("data-cs-path-only")||"");
      var ok=o===g||o==="all"||(g==="practicing"&&o==="daily");
      if(ok){ show(el); el.style.setProperty("display","block","important"); }
      else { el.style.setProperty("display","none","important"); el.setAttribute("hidden",""); }
    });
    d.querySelectorAll("[data-cs-path]").forEach(function(btn){
      btn.classList.toggle("is-active", norm(btn.getAttribute("data-cs-path"))===g);
    });
  }
  function boot(){ apply(gate()); }
  var m=d.getElementById("cs-mount");
  if(m){
    var t=null;
    new MutationObserver(function(){
      if(t) clearTimeout(t);
      t=setTimeout(function(){ apply(gate()); }, 30);
    }).observe(m,{childList:true,subtree:true});
  }
  d.addEventListener("click",function(ev){
    var b=ev.target&&ev.target.closest&&ev.target.closest("[data-cs-path]");
    if(!b) return;
    try{ localStorage.setItem("cu_companion_path_v1", b.getAttribute("data-cs-path")||"dai"); }catch(e){}
    setTimeout(function(){ apply(b.getAttribute("data-cs-path")); }, 15);
  },true);
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
  w.__COMPANION_PATH_GOV_SHELL_V1__=true;
  w.ClarityPathGovernanceShell={apply:apply,applyPathGovernance:apply,gate:gate,honest:true,version:"Slim1"};
})(window,document);
