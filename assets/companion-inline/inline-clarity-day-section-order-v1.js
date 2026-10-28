/**
 * Day landing section order · daily activity theme
 * Logical script: morning flow → obligations → amānah → reflection → tools → trust
 */
(function(g){
  "use strict";
  if(g.__CLARITY_DAY_SECTION_ORDER_V1__) return;
  g.__CLARITY_DAY_SECTION_ORDER_V1__=true;

  /* Priority: lower = higher on page. Match by heading text / id */
  var ORDER = [
    { re: /dual-tiles|Choose a path|Companion path|University path/i, id: "paths", key: "paths" },
    { re: /Do this today/i, key: "todo" },
    { re: /Next ṣalāh|Next salah|ṣalāh|salah/i, key: "salah" },
    { re: /Adhkār|Adhkar/i, key: "adhkar" },
    { re: /Tasbeeh|Tasbih/i, key: "tasbeeh" },
    { re: /Soft streak|streak/i, key: "streak" },
    { re: /Qaḍā|Qada/i, key: "qada" },
    { re: /Amānah Dayn|Dayn/i, key: "dayn" },
    { re: /Vault note/i, key: "vaultnote" },
    { re: /Send light ahead/i, key: "light" },
    { re: /Remember the long stay/i, key: "grave" },
    { re: /Reward that may continue/i, key: "reward" },
    { re: /Qibla/i, key: "qibla" },
    { re: /Core protection/i, key: "protect" },
    { re: /Auto review/i, key: "review" },
    { re: /Built for trust/i, key: "trust" }
  ];

  function score(el){
    var t=(el.id||"")+" "+(el.className||"")+" "+(el.textContent||"").slice(0,120);
    if(el.classList && el.classList.contains("dual-tiles")) return 0;
    for(var i=0;i<ORDER.length;i++){
      if(ORDER[i].re.test(t)) return i+1;
    }
    return 50;
  }

  function rearrange(){
    var room=document.getElementById("clarity-day-landing-room");
    if(!room) return;
    var inner=room.querySelector(".day-room-inner");
    if(!inner) return;
    var kids=Array.prototype.slice.call(inner.children);
    if(kids.length<3) return;
    kids.sort(function(a,b){ return score(a)-score(b); });
    kids.forEach(function(k){ inner.appendChild(k); });
    inner.setAttribute("data-day-order","daily-v1");
  }

  function boot(){ rearrange(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("clarity:day-room-ready", function(){ setTimeout(boot, 50); });
  document.addEventListener("clarity:landing-ready", boot);
  [700, 2200].forEach(function(ms){ setTimeout(boot, ms); });
})(typeof window!=="undefined"?window:this);
