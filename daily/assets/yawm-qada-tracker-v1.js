/*! Yawm qada tracker - not a fatwa */
(function(w){"use strict";if(w.__YAWM_QADA_V1__)return;w.__YAWM_QADA_V1__=true;
var KEY="clarity_qada_log_v1",CURSOR="clarity_qada_cursor_v1";
var PRAYERS=[{id:"fajr",label:"Fajr"},{id:"dhuhr",label:"Dhuhr"},{id:"asr",label:"Asr"},{id:"maghrib",label:"Maghrib"},{id:"isha",label:"Isha"}];
function readLog(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}}
function writeLog(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function pad(n){n=+n;return(n<10?"0":"")+n}
function dayKey(y,m,d){return y+"-"+pad(m)+"-"+pad(d)}
function parseKey(k){var p=String(k||"").split("-");if(p.length!==3)return null;return{y:+p[0],m:+p[1],d:+p[2]}}
function readCursor(){try{var c=JSON.parse(localStorage.getItem(CURSOR)||"null");if(c&&+c.y>0)return{y:+c.y,m:+c.m,d:+c.d}}catch(e){}return null}
function writeCursor(y,m,d){try{localStorage.setItem(CURSOR,JSON.stringify({y:+y,m:+m,d:+d}))}catch(e){}}
function daysInMonth(y,m){return new Date(+y,+m,0).getDate()}
function clampDay(y,m,d){var max=daysInMonth(y,m);if(d>max)d=max;if(d<1)d=1;return d}
function toDateInput(y,m,d){return dayKey(y,m,d)}
function fromDateInput(val){var p=parseKey(val);if(!p||!p.y)return null;p.d=clampDay(p.y,p.m,p.d);return p}
function stats(log){var days=Object.keys(log).length,done=0;Object.keys(log).forEach(function(k){var row=log[k]||{};PRAYERS.forEach(function(pr){if(row[pr.id])done++})});return{days:days,done:done,pct:days?Math.round((done/(days*5))*100):0}}
function mount(){var root=document.getElementById("yawm-qada-root");if(!root)return;
var now=new Date(),cur=readCursor(),y0=cur?cur.y:now.getFullYear(),m0=cur?cur.m:now.getMonth()+1,d0=cur?cur.d:now.getDate();d0=clampDay(y0,m0,d0);
if(root.getAttribute("data-ready")==="1"&&document.getElementById("qada-date")){paint();return}
root.setAttribute("data-ready","1");
root.innerHTML="<div class=\"qada-guide\"><p><strong>Repentance includes repairing what can be repaired.</strong> Prayer is the covenant of the din.</p><ul><li>Obligation from <strong>bulugh</strong> (puberty).</li><li>Forgot / slept: pray when you remember (Bukhari, Muslim).</li><li>Scholars differ on deliberate long neglect — ask a local teacher. This log is a private aid only.</li></ul><p class=\"qada-hint\">Pick a working day once — it stays selected on this device.</p></div><div class=\"qada-stats\" id=\"qada-stats\"></div><div class=\"qada-pick\"><label>Working day<input type=\"date\" id=\"qada-date\" value=\""+toDateInput(y0,m0,d0)+"\" max=\""+toDateInput(now.getFullYear(),now.getMonth()+1,now.getDate())+"\"/></label><button type=\"button\" class=\"qada-btn\" id=\"qada-prev-day\">←</button><button type=\"button\" class=\"qada-btn\" id=\"qada-next-day\">→</button></div><p class=\"qada-hint\" id=\"qada-day-label\"></p><div class=\"qada-prayers\" id=\"qada-prayers\"></div><div class=\"qada-actions\"><button type=\"button\" class=\"qada-btn primary\" id=\"qada-mark-all\">Mark all five</button><button type=\"button\" class=\"qada-btn\" id=\"qada-clear-day\">Clear this day</button><button type=\"button\" class=\"qada-btn\" id=\"qada-export\">Export CSV</button></div>";
var dateInp=document.getElementById("qada-date");
function current(){var p=fromDateInput(dateInp&&dateInp.value);if(!p){var n=new Date();return{y:n.getFullYear(),m:n.getMonth()+1,d:n.getDate()}}return p}
function persist(){var p=current();writeCursor(p.y,p.m,p.d)}
function paint(){var p=current();persist();var key=dayKey(p.y,p.m,p.d),log=readLog(),row=log[key]||{},st=stats(log);
var statsEl=document.getElementById("qada-stats");if(statsEl)statsEl.innerHTML="<div class=\"qada-stat\"><strong>"+st.days+"</strong><span>days logged</span></div><div class=\"qada-stat\"><strong>"+st.done+"</strong><span>fard checked</span></div><div class=\"qada-stat\"><strong>"+st.pct+"%</strong><span>fill rate</span></div>";
var lab=document.getElementById("qada-day-label");if(lab)lab.textContent="Working on "+key+" — saved on this device.";
var box=document.getElementById("qada-prayers");if(box){box.innerHTML=PRAYERS.map(function(pr){var on=!!row[pr.id];return "<label class=\"qada-pr"+(on?" on":"")+"\"><input type=\"checkbox\" data-pr=\""+pr.id+"\""+(on?" checked":"")+"/> "+pr.label+"</label>"}).join("");
box.querySelectorAll("input").forEach(function(inp){inp.addEventListener("change",function(){var log2=readLog(),k=dayKey(current().y,current().m,current().d);log2[k]=log2[k]||{};log2[k][inp.getAttribute("data-pr")]=!!inp.checked;var empty=true;PRAYERS.forEach(function(pr){if(log2[k][pr.id])empty=false});if(empty)delete log2[k];writeLog(log2);paint()})})}
}
dateInp.addEventListener("change",paint);
document.getElementById("qada-prev-day").onclick=function(){var p=current(),dt=new Date(p.y,p.m-1,p.d-1);dateInp.value=toDateInput(dt.getFullYear(),dt.getMonth()+1,dt.getDate());paint()};
document.getElementById("qada-next-day").onclick=function(){var p=current(),dt=new Date(p.y,p.m-1,p.d+1),n=new Date();if(dt>n)return;dateInp.value=toDateInput(dt.getFullYear(),dt.getMonth()+1,dt.getDate());paint()};
document.getElementById("qada-mark-all").onclick=function(){var log2=readLog(),k=dayKey(current().y,current().m,current().d);log2[k]={};PRAYERS.forEach(function(pr){log2[k][pr.id]=true});writeLog(log2);paint()};
document.getElementById("qada-clear-day").onclick=function(){var log2=readLog();delete log2[dayKey(current().y,current().m,current().d)];writeLog(log2);paint()};
document.getElementById("qada-export").onclick=function(){var log2=readLog(),lines=["date,fajr,dhuhr,asr,maghrib,isha"];Object.keys(log2).sort().forEach(function(k){var r=log2[k]||{};lines.push([k,r.fajr?1:0,r.dhuhr?1:0,r.asr?1:0,r.maghrib?1:0,r.isha?1:0].join(","))});var blob=new Blob([lines.join("\n")],{type:"text/csv"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="qada-log.csv";a.click()};
paint()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
})(window);
