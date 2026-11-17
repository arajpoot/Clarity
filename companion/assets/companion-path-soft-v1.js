/*! companion-path-soft-v1 · P17 restore-only · educational only */
(function(w,d){
  "use strict";
  function restore(){
    var root=d.getElementById("cs-mount"); if(!root) return;
    root.querySelectorAll("[id$='-card']").forEach(function(el){
      if(el.hasAttribute("data-cs-path-only")) return;
      el.style.removeProperty("display");
      el.removeAttribute("hidden");
      el.classList.remove("cpp-path-hidden");
    });
  }
  function boot(){
    restore();
    [50,200,600,1500].forEach(function(ms){ setTimeout(restore,ms); });
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
