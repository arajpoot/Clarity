(function(){
"use strict";
if (window.__CLARITY_POLISH_SECURITY_V1__) return;
window.__CLARITY_POLISH_SECURITY_V1__ = true;
window.claritySecurityAudit = function(){
  var r = {ok:true,ts:Date.now(),vault:{uftKey:window.UFT_KEY||"clarity_user_family_tree_v1",
    tree:!!document.getElementById("user-family-tree-card"),
    uftRead:typeof window.uftRead==="function"},
    path:{reset:typeof window.clarityPathResetToSeeker==="function",
      request:typeof window.clarityRequestPath==="function"},
    zoom:typeof window.clarityUftZoom==="object",
    storage:{suspicious:[]},notes:[]};
  try{
    if(r.vault.uftKey!=="clarity_user_family_tree_v1"){r.ok=false;r.notes.push("UFT_KEY");}
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i)||"";
      if(/passphrase|plaintext.?key|(^|_)password$/i.test(k)){r.storage.suspicious.push(k);r.ok=false;}
    }
  }catch(e){}
  window.__CLARITY_SECURITY_REPORT__=r;
  return r;
};
setTimeout(function(){try{claritySecurityAudit();}catch(e){}},1000);
})();
