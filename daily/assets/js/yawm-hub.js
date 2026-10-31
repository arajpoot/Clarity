/*! Yawm hub S10 — source-led · educational only — not a fatwa */
(function(){
"use strict";
var VER="20261030S10F";
var KEY={
  deed:"clarity.daily.deed.v1",
  tas:"clarity.daily.tasbeeh.v1",
  adh:"clarity.daily.adhkar.v1",
  fard:"clarity.daily.fard.v1"
};
function $(id){return document.getElementById(id)}
function load(k,fb){try{var x=localStorage.getItem(k);return x?JSON.parse(x):fb}catch(e){return fb}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function dayKey(){return new Date().toDateString()}
function period(){
  var h=new Date().getHours();
  if(h>=4&&h<12)return "morning";
  if(h>=12&&h<17)return "afternoon";
  if(h>=17&&h<20)return "evening";
  return "night";
}
function portionLine(){
  var h=new Date().getHours();
  if(h>=4&&h<6)return "Before Fajr · dhikr and optional night prayer if able";
  if(h>=6&&h<12)return "After Fajr · morning adhkār";
  if(h>=12&&h<17)return "Through the day · between the prayers";
  if(h>=17&&h<20)return "Evening · evening adhkār";
  return "Night · seek forgiveness and rest with remembrance";
}
function isEvening(){var h=new Date().getHours();return !(h>=4&&h<15)}

var tg=$("theme-toggle");
if(tg)tg.onclick=function(){
  var d=document.documentElement;
  var next=d.getAttribute("data-theme")==="light"?"dark":"light";
  d.setAttribute("data-theme",next);
  try{localStorage.setItem("clarity.daily.theme.v1",next)}catch(e){}
};
try{var th=localStorage.getItem("clarity.daily.theme.v1");if(th)document.documentElement.setAttribute("data-theme",th)}catch(e){}

/* Now tile */
(function(){
  var el=$("tile-now-line");
  if(el)el.textContent=portionLine();
})();

/* Deed tile + mark */
(function(){
  var DEEDS=[
    "Say Bismillāh before the next ordinary task.",
    "One gentle word or act of service for family.",
    "Share one beneficial sentence from Qur'an or Sunnah with sincerity.",
    "Pray one ṣalāh with fuller calm in rukūʿ and sujūd.",
    "Seek forgiveness with presence before sleep."
  ];
  var st=load(KEY.deed,{});
  if(st.day!==dayKey())st={day:dayKey(),i:Math.floor(Math.random()*DEEDS.length),done:false};
  if(typeof st.i!=="number"||st.i>=DEEDS.length)st.i=0;
  var line=$("tile-deed-line"), stEl=$("tile-deed-status");
  function paint(){
    if(line)line.textContent=DEEDS[st.i];
    if(stEl)stEl.textContent=st.done?"Marked done today":"Not marked · mirror, not scoreboard";
    save(KEY.deed,st);
  }
  paint();
  var mk=$("tile-deed-mark");
  if(mk)mk.onclick=function(){st.done=true;paint()};
})();

/* Tasbeeh tile */
(function(){
  var n=0;try{n=parseInt(localStorage.getItem(KEY.tas)||"0",10)||0}catch(e){}
  var el=$("tile-tas-count"); if(el)el.textContent=n;
  var ar=$("tile-tas-ar"); if(ar)ar.textContent="سُبْحَانَ اللَّهِ وَبِحَمْدِهِ";
})();

/* Salah tile */
(function(){
  var el=$("tile-salah-line"), sub=$("tile-salah-sub");
  function approx(){
    var h=new Date().getHours();
    var names=["Fajr","Dhuhr","ʿAṣr","Maghrib","ʿIshāʾ"];
    var approxH=[5,13,16,19,21];
    var i=0;
    for(var k=0;k<approxH.length;k++){if(h<approxH[k]){i=k;break}i=0}
    if(el)el.textContent=names[i];
    if(sub)sub.textContent="Cue only — not a mosque timetable. Open Companion for city times if needed.";
  }
  approx();
  if(!navigator.geolocation)return;
  try{
    navigator.geolocation.getCurrentPosition(function(pos){
      var url="https://api.aladhan.com/v1/timings?latitude="+pos.coords.latitude+"&longitude="+pos.coords.longitude+"&method=2";
      fetch(url).then(function(r){return r.json()}).then(function(data){
        var t=data&&data.data&&data.data.timings; if(!t)return;
        var order=["Fajr","Dhuhr","Asr","Maghrib","Isha"];
        var labels=["Fajr","Dhuhr","ʿAṣr","Maghrib","ʿIshāʾ"];
        var now=new Date();
        for(var i=0;i<order.length;i++){
          var parts=(t[order[i]]||"00:00").split(":");
          var d=new Date(now); d.setHours(+parts[0],+parts[1],0,0);
          if(d>now){
            if(el)el.textContent=labels[i];
            if(sub)sub.textContent=t[order[i]]+" · device location · verify with a local source";
            break;
          }
        }
      }).catch(function(){});
    },function(){
      if(el)el.textContent="Open Companion for times";
      if(sub)sub.textContent="Location unavailable — city times stay on the Companion banner.";
    },{timeout:8000,maximumAge:600000});
  }catch(e){}
})();

/* Adhkar tile — first line from pack */
(function(){
  var arEl=$("tile-adh-ar"), metaEl=$("tile-adh-meta");
  var evening=isEvening();
  var file="assets/adhkar/"+(evening?"evening":"morning")+".json?v="+VER;
  var fallbackAr=evening
    ? "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ"
    : "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ";
  var fallbackMeta=evening
    ? "Evening pack · educational"
    : "Abū Dāwūd 5084 · verify grade · educational";
  if(arEl)arEl.textContent=fallbackAr;
  if(metaEl)metaEl.textContent=fallbackMeta;
  fetch(file).then(function(r){return r.json()}).then(function(data){
    var items=data.items||[];
    if(!items.length)return;
    var item=items[0];
    if(arEl)arEl.textContent=item.ar||fallbackAr;
    var meta=(item.source||"")+(item.grade?" · "+item.grade:" · verify grade");
    if(metaEl)metaEl.textContent=meta+" · educational";
  }).catch(function(){});
})();

/* Light tile is static in HTML */
})();


/* Path wire S11 — Companion must set dest BEFORE leaving Yawm or root early-redirect loops back to /daily/ */
(function(){
  "use strict";
  function markCompanion(){
    try{
      sessionStorage.setItem("clarity_landing_dest_v1","companion");
      sessionStorage.setItem("clarity_shell_user_pick_v1","1");
      sessionStorage.setItem("clarity_daily_first_skip_v1","1");
      localStorage.setItem("clarity_shell_mode_v1","companion");
    }catch(e){}
  }
  function markCampus(){
    try{ sessionStorage.setItem("clarity_landing_dest_v1","campus"); }catch(e){}
  }
  function wire(){
    document.querySelectorAll('a[data-yawm-to="companion"], a[href*="enter=companion"]').forEach(function(a){
      if(a.__yawmPath) return;
      a.__yawmPath = true;
      a.addEventListener("click", function(){ markCompanion(); }, true);
    });
    document.querySelectorAll('a[href="/campus/"], a[href*="/campus"]').forEach(function(a){
      if(a.__yawmCampus) return;
      a.__yawmCampus = true;
      a.addEventListener("click", function(){ markCampus(); }, true);
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();

