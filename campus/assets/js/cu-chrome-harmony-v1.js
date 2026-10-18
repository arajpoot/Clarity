
/**
 * Chrome harmony CH1 — dedupe theme pills injected by ui-chrome
 */
(function(){
  function dedupeThemes(){
    try{
      var actions=document.querySelectorAll(".cu-banner-actions");
      actions.forEach(function(box){
        var seen={};
        box.querySelectorAll("[data-cu-theme], .cu-theme-pill").forEach(function(btn){
          var k=btn.getAttribute("data-cu-theme")||(btn.textContent||"").trim().toLowerCase();
          if(seen[k]){ btn.style.display="none"; }
          else seen[k]=true;
        });
        /* if a second cluster appears after main-link, hide those theme pills */
        var main=box.querySelector(".cu-main-link");
        if(main){
          var n=main.nextElementSibling;
          while(n){
            if(n.classList&&(n.classList.contains("cu-theme-pill")||n.hasAttribute("data-cu-theme"))){
              n.style.display="none";
            }
            n=n.nextElementSibling;
          }
        }
      });
      /* remove orphan theme bars outside banner */
      document.querySelectorAll("body > .cu-theme-bar, .cu-ui-extra-themes").forEach(function(el){
        el.style.display="none";
      });
    }catch(e){}
  }
  function markPage(){
    try{
      if(!document.body.classList.contains("cu-page")){
        if(document.querySelector(".cu-banner")||document.querySelector(".cu-pills")){
          document.body.classList.add("cu-page");
        }
      }
    }catch(e){}
  }
  function boot(){ markPage(); dedupeThemes(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ boot(); setTimeout(boot,300); });
  else { boot(); setTimeout(boot,300); }
})();
