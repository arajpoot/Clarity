/*! companion-meme-portal-v1 · CM14 — single portal */
(function(w,d){
  if (w.__CM_MEME_PORTAL_CM14__) return;
  w.__CM_MEME_PORTAL_CM14__ = true;
  function dedupe(){
    var all = d.querySelectorAll("#cm-meme-portal, section.cm-meme-portal");
    for (var i=1;i<all.length;i++){ try{ all[i].parentNode.removeChild(all[i]); }catch(e){} }
  }
  function boot(){ dedupe(); }
  if (d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
