/**
 * Soft gate: encourage Charter admission before deep campus use.
 * Does not block Map — educational hospitality.
 */
(function(){
  try{
    var a=JSON.parse(localStorage.getItem('cu_uni_admitted_v1')||'null');
    if(a&&a.ok) return;
    var main=document.querySelector('main.cu-wrap')||document.querySelector('main');
    if(!main||document.getElementById('cu-soft-admit')) return;
    var d=document.createElement('div');
    d.id='cu-soft-admit';
    d.style.cssText='margin:0 0 1rem;padding:.75rem 1rem;border-radius:14px;border:1px solid rgba(201,162,39,.45);background:rgba(70,124,69,.1);font-size:.9rem';
    d.innerHTML='<strong>New to the University path?</strong> Start at the <a href="/charter/#admission">Charter admission</a> (on this device only), then return to the Map.';
    main.insertBefore(d, main.firstChild);
  }catch(e){}
})();
