/**
 * Qaḍāʾ tracker calendar · on-device marks
 * Educational only — not a fatwa
 */
(function(g){
  "use strict";
  if(g.__CLARITY_QADA_CAL_V1__) return;
  g.__CLARITY_QADA_CAL_V1__=true;

  var CAL_KEY="clarity_qada_cal_v1";
  var COUNT_KEY="clarity_qada_counts_v1";

  function readCal(){
    try{ return JSON.parse(localStorage.getItem(CAL_KEY)||"{}")||{}; }catch(e){ return {}; }
  }
  function writeCal(o){
    try{ localStorage.setItem(CAL_KEY, JSON.stringify(o)); }catch(e){}
  }
  function ymd(d){
    return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  }

  function findQadaHost(){
    var host=null;
    document.querySelectorAll("#clarity-day-landing-room .cdl-card").forEach(function(c){
      if(/qaḍā|qada/i.test(c.textContent||"")) host=c;
    });
    return host;
  }

  function renderCal(host){
    if(!host) return;
    var box=host.querySelector("#cdl-qada-calendar");
    if(!box){
      box=document.createElement("div");
      box.id="cdl-qada-calendar";
      box.className="cdl-qada-cal";
      box.setAttribute("aria-label","Qaḍā calendar on this device");
      host.appendChild(box);
    }
    var now=new Date();
    var y=now.getFullYear(), m=now.getMonth();
    var first=new Date(y,m,1);
    var startPad=first.getDay(); // 0 Sun
    var daysInMonth=new Date(y,m+1,0).getDate();
    var marks=readCal();
    var monthKey=y+"-"+String(m+1).padStart(2,"0");
    var html="<div class='cdl-qada-cal-head'><strong>"+first.toLocaleString(undefined,{month:"long",year:"numeric"})+
      "</strong><span class='cdl-sub'> Tap a day to mark qaḍāʾ work · educational only</span></div>";
    html+="<div class='cdl-qada-cal-grid'>";
    ["S","M","T","W","T","F","S"].forEach(function(d){ html+="<span class='cdl-qada-dow'>"+d+"</span>"; });
    for(var i=0;i<startPad;i++) html+="<span class='cdl-qada-empty'></span>";
    for(var d=1;d<=daysInMonth;d++){
      var key=monthKey+"-"+String(d).padStart(2,"0");
      var on=!!marks[key];
      var isToday=d===now.getDate();
      html+="<button type='button' class='cdl-qada-day"+(on?" is-marked":"")+(isToday?" is-today":"")+
        "' data-qada-day='"+key+"'>"+d+"</button>";
    }
    html+="</div>";
    var markedCount=Object.keys(marks).filter(function(k){ return marks[k]; }).length;
    html+="<p class='cdl-sub cdl-qada-cal-foot'>Marked days on this device: "+markedCount+
      " · Not a fatwa · confirm makeup with a local teacher</p>";
    box.innerHTML=html;
    box.querySelectorAll("[data-qada-day]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var k=btn.getAttribute("data-qada-day");
        var o=readCal();
        o[k]=!o[k];
        if(!o[k]) delete o[k];
        writeCal(o);
        renderCal(host);
      });
    });
  }

  function boot(){
    try{ renderCal(findQadaHost()); }catch(e){ console.warn("[qada cal]", e); }
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("clarity:day-room-ready", function(){ setTimeout(boot, 80); });
  document.addEventListener("clarity:landing-ready", boot);
  [900, 2500].forEach(function(ms){ setTimeout(boot, ms); });
})(typeof window!=="undefined"?window:this);
