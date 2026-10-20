
(function(){
  if (window.__CU_BUDDY_SURFACE_V1__) return;
  window.__CU_BUDDY_SURFACE_V1__ = true;
  var KB = [
    {q:["seeker","start","begin","new","foundation","tawhid","tawḥīd"], a:"Begin at Charter admission, then open Seeker desk. One module at a time; mark complete to unlock the next. Lab practice is optional after the module.", links:[["/charter/","Charter"],["/campus/desk/seeker/","Seeker"]]},
    {q:["tajweed","recite","quran","qurʾān","makharij"], a:"Tajweed lab is Listen · Match · Record — a practice helper, not a qāriʾ certificate. Open Lab → Tajweed. Rule chips load example āyāt.", links:[["/lab/tajweed/","Tajweed lab"],["/lab/recite/","Recite"]]},
    {q:["library","hadith","quran.com","sunnah"], a:"Library holds source shelves and outward pointers. Always verify on Quran.com / Sunnah.com and with a trusted teacher.", links:[["/library/","Library"]]},
    {q:["module","after","practice","lab"], a:"After a desk module: pause until the idea is clear, do one honest practice, then optional Lab skill and Library source. No second streak.", links:[["/lab/","Labs"],["/campus/desk/seeker/","Seeker"]]},
    {q:["practice","new muslim","phase 2"], a:"Practice desk opens after Seeker foundations and the phase quiz when shown. It is skills after foundations — not a fatwa track.", links:[["/campus/desk/practice/","Practice"]]},
    {q:["transcript","progress"], a:"Transcript is a local learning record on this device only — not a public grade of īmān.", links:[["/campus/transcript/","Transcript"]]},
    {q:["fatwa","ruling","halal","haram"], a:"I do not issue fatwas or personal rulings. Ask a qualified local scholar. This path is educational only.", links:[["/charter/","Charter"]]},
    {q:["arabic","translate","lingua","urdu"], a:"Arabic studio has EN ↔ AR offline packs and conversation practice. Open Lab → Arabic.", links:[["/lab/arabic/","Arabic studio"],["/lab/arabic/hajj2027/","Hajj phrases"]]},
    {q:["map","campus"], a:"Journey Map lists Seeker, Practice, Consistency, Transmission, Lab, and Library.", links:[["/campus/","Map"]]}
  ];
  function reply(text){
    text = (text||"").toLowerCase();
    for (var i=0;i<KB.length;i++){
      var hit = KB[i].q.some(function(k){ return text.indexOf(k)>=0; });
      if (hit) return KB[i];
    }
    return {a:"Search campus tools or ask where to study next. I point to modules and primary-text libraries — I do not issue fatwas.", links:[["/charter/","Charter"],["/campus/desk/seeker/","Seeker"],["/lab/","Lab"]]};
  }
  function addBubble(html, mine){
    var box = document.getElementById("cu-buddy-chat");
    if (!box) return;
    var d = document.createElement("div");
    d.className = "cu-plaque";
    d.style.margin = ".4rem 0";
    if (mine) d.style.opacity = ".85";
    d.innerHTML = html;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }
  function answer(text){
    addBubble("<strong>You</strong><br/>"+text.replace(/</g,""), true);
    var r = reply(text);
    var links = (r.links||[]).map(function(l){ return '<a href="'+l[0]+'">'+l[1]+"</a>"; }).join(" · ");
    addBubble(r.a+(links?"<br/>"+links:""), false);
  }
  function search(){
    var q = (document.getElementById("cu-buddy-q")||{}).value || "";
    var r = reply(q);
    var host = document.getElementById("cu-buddy-results");
    if (!host) return;
    host.innerHTML = "<p>"+r.a+"</p><p>"+(r.links||[]).map(function(l){return '<a href="'+l[0]+'">'+l[1]+"</a>";}).join(" · ")+"</p>";
  }
  function boot(){
    addBubble("Assalamu alaykum. Search campus tools or ask where to study next. I point to modules and primary-text libraries — I do not issue fatwas.<br/><a href=\"/charter/\">Charter</a> · <a href=\"/campus/desk/seeker/\">Seeker</a>", false);
    var send = document.getElementById("cu-buddy-send");
    var input = document.getElementById("cu-buddy-input");
    if (send) send.onclick = function(){ var v=(input&&input.value||"").trim(); if(!v)return; input.value=""; answer(v); };
    if (input) input.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); send&&send.click(); }});
    document.querySelectorAll(".cu-buddy-prompt").forEach(function(b){
      b.addEventListener("click", function(){ answer(b.getAttribute("data-prompt")||b.textContent); });
    });
    var sbtn = document.getElementById("cu-buddy-search");
    if (sbtn) sbtn.onclick = search;
    var clr = document.getElementById("cu-buddy-clear");
    if (clr) clr.onclick = function(){ var box=document.getElementById("cu-buddy-chat"); if(box) box.innerHTML=""; boot(); };
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
