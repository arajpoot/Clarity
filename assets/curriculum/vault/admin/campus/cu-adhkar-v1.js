
(function(g){"use strict";if(g.__CU_ADHKAR_V1__)return;g.__CU_ADHKAR_V1__=true;
var morning=["Aʿūdhu billāhi min ash-shayṭāni r-rajīm","Bismillāh","Sayyid al-istighfār (summary: O Allah, You are my Lord…)","Āyat al-Kursī — recommended morning remembrance","3× Sūrat al-Ikhlāṣ, al-Falaq, an-Nās (common practice — verify locally)"];
var evening=["Aʿūdhu billāhi min ash-shayṭāni r-rajīm","Bismillāh","Evening istighfār and tahlīl as taught in authentic collections","Āyat al-Kursī","Seek refuge with the muʿawwidhāt"];
function boot(){
  var h=new Date().getHours();
  var isM=h>=4&&h<15;
  var t=document.getElementById("adhkar-title");
  var list=document.getElementById("adhkar-list");
  var slot=document.getElementById("adhkar-slot");
  if(t)t.textContent=isM?"Morning window (device time)":"Evening window (device time)";
  if(slot)slot.textContent=(isM?"Morning":"Evening")+" adhkār suggestions · device clock · educational only.";
  (isM?morning:evening).forEach(function(line){
    var li=document.createElement("li");li.textContent=line;list&&list.appendChild(li);
  });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})(typeof window!=="undefined"?window:this);
