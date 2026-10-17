(function(){
  try{
    var k="cu_theme_pref";
    function apply(t){
      var r=document.documentElement;
      if(t==="system"){
        r.removeAttribute("data-theme");
        var dark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;
        r.setAttribute("data-theme", dark?"dark":"light");
        r.dataset.themePref="system";
      }else{
        r.setAttribute("data-theme", t);
        r.dataset.themePref=t;
      }
    }
    var saved=localStorage.getItem(k)||"system";
    apply(saved);
    document.addEventListener("click",function(e){
      var b=e.target.closest("[data-cu-theme]");
      if(!b) return;
      var t=b.getAttribute("data-cu-theme");
      localStorage.setItem(k,t);
      apply(t);
    });
  }catch(e){}
})();
