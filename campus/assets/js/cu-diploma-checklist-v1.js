
(function(g){
  if (g.__CU_DIPLOMA_CHECK_V1__) return;
  g.__CU_DIPLOMA_CHECK_V1__ = true;
  function boot(){
    var root = document.getElementById("cu-diploma-root");
    if (!root || !g.CuStudentStatus) return;
    var s = g.CuStudentStatus.get();
    var rows = g.CuStudentStatus.phases.map(function(ph){
      var pr = g.CuStudentStatus.progressFor(ph.id);
      var ok = pr.done > 0;
      return '<li>'+(ok?"✓":"○")+' <strong>'+ph.label+'</strong> — '+pr.done+' module(s) recorded · <a href="'+ph.href+'">desk</a></li>';
    }).join("");
    root.innerHTML =
      '<section class="cu-plaque"><strong>Milestone checklist</strong><ul style="margin:.4rem 0 0 1.1rem">'+rows+
      '</ul></section>'+
      '<section class="cu-plaque"><strong>Soft recognition</strong>'+
      (s.name?'<p>Prepared for <strong>'+s.name+'</strong> on this device.</p>':'<p class="cu-meta">Optional: complete <a href="/charter/">Charter admission</a> to put a name here.</p>')+
      '<p class="cu-meta">This is <strong>not</strong> an ijāzah, <strong>not</strong> an Al-Azhar certificate, <strong>not</strong> a grade of īmān. Educational milestone only.</p>'+
      '<p><a href="/campus/transcript/">Transcript</a> · <a href="'+s.href+'">Continue path</a></p></section>';
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
