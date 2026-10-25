(function(){
"use strict";
if (window.__CLARITY_FINAL_SECURITY_SWEEP_V1__) return;
window.__CLARITY_FINAL_SECURITY_SWEEP_V1__ = true;
window.claritySecurityAudit = function(){
  var report = {ok:true,ts:Date.now(),vault:{
    gate:!!document.getElementById("amana-vault-gate"),
    interior:!!document.getElementById("amana-vault-interior"),
    unlocked:!!(document.getElementById("tab-notes")&&document.getElementById("tab-notes").classList.contains("amana-unlocked")),
    uftRead:typeof window.uftRead==="function",
    uftCollect:typeof window.uftCollect==="function",
    uftKey:window.UFT_KEY||null,
    cryptoSubtle:!!(window.crypto&&window.crypto.subtle),
    pathFilter:typeof window.applyGateSectionFilter==="function",
    pathAttr:document.documentElement.getAttribute("data-clarity-path"),
    pathLock:!!document.getElementById("clarity-path-lock")
  },notes:[],storageScan:{keys:0,suspicious:[]}};
  try{
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i)||"";
      report.storageScan.keys++;
      if(/passphrase|plaintext.?key|(^|_)password$/i.test(k)){
        report.storageScan.suspicious.push(k);
        report.ok=false;
        report.notes.push("suspicious key:"+k);
      }
    }
  }catch(e){report.notes.push(String(e));}
  try{
    document.querySelectorAll("#amana-vault-gate input[type='password']").forEach(function(inp){
      inp.setAttribute("autocomplete","current-password");
      inp.setAttribute("spellcheck","false");
    });
  }catch(e){}
  if(report.vault.uftKey&&report.vault.uftKey!=="clarity_user_family_tree_v1"){
    report.ok=false;report.notes.push("unexpected UFT_KEY");
  }
  window.__CLARITY_SECURITY_REPORT__=report;
  return report;
};
function boot(){
  try{
    var g=localStorage.getItem("clarity_committed_path")||"seeker";
    document.documentElement.setAttribute("data-clarity-path",g);
    if(typeof applyGateSectionFilter==="function")applyGateSectionFilter(g);
  }catch(e){}
  try{claritySecurityAudit();}catch(e){}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",function(){setTimeout(boot,400);});
else setTimeout(boot,400);
})();
