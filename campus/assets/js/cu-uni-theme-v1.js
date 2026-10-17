(function(){
  function apply(t){
    if(t==='day') t='light';
    if(t==='night') t='dark';
    if(!t) t='light';
    document.documentElement.setAttribute('data-theme', t);
    try{ document.documentElement.style.colorScheme = (t==='dark'?'dark': t==='light'?'light':'light dark'); }catch(e){}
    try{ localStorage.setItem('cu_uni_theme_v1', t); }catch(e){}
  }
  function boot(){
    var t='light';
    try{ t=localStorage.getItem('cu_uni_theme_v1')||'light'; }catch(e){}
    apply(t);
    document.querySelectorAll('[data-cu-theme]').forEach(function(btn){
      btn.addEventListener('click', function(){
        apply(btn.getAttribute('data-cu-theme')||'light');
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
