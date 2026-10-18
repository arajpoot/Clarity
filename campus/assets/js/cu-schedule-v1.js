/**
 * P3 week rhythm + P10 study circle / orientation
 */
(function(g){
  "use strict";
  if(g.__CU_SCHEDULE_V1__) return;
  g.__CU_SCHEDULE_V1__=true;

  var SKEY="cu_uni_schedule_v1";
  var OKEY="cu_uni_orient_v1";

  function load(){ try{return JSON.parse(localStorage.getItem(SKEY)||"{}");}catch(e){return {};} }
  function save(o){ try{localStorage.setItem(SKEY,JSON.stringify(o));}catch(e){} }

  var DEFAULT={
    note:"Three short desk sessions and one lab this week — quality over quantity.",
    slots:[
      {day:"Day 1", act:"Desk · open module", href:"/campus/desk/seeker/"},
      {day:"Day 3", act:"Lab · Arabic or Tajweed", href:"/lab/"},
      {day:"Day 5", act:"Desk · review + assignment tick", href:"/campus/assignments/"},
      {day:"Day 7", act:"Library pointer + rest", href:"/library/"}
    ]
  };

  function paintSchedule(root){
    if(!root) return;
    var s=load();
    if(!s.slots) s=DEFAULT;
    var rows=s.slots.map(function(x){
      return '<div class="cu-plaque" style="margin:.35rem 0"><strong>'+x.day+'</strong> — '+x.act+
        '<div class="cu-row"><a href="'+x.href+'">Open</a></div></div>';
    }).join("");
    root.innerHTML='<div class="cu-plaque cu-welcome"><div class="cu-ico-row"><span class="mark">◷</span><div><strong>This week\'s rhythm</strong><br/><span class="cu-meta">'+(s.note||DEFAULT.note)+'</span></div></div></div>'+rows;
  }

  function paintCircle(el){
    if(!el) return;
    var cont={}; try{cont=JSON.parse(localStorage.getItem("cu_continue_v1")||"{}");}catch(e){}
    var href=cont.href||"/campus/desk/seeker/";
    el.innerHTML='<div class="cu-ico-row"><span class="mark">◉</span><div><strong>Next 15 minutes</strong><br/><span class="cu-meta">One honest session — then stop while the heart is present.</span></div></div>'+
      '<div class="cu-row"><a href="'+href+'">Start session</a><a class="ghost" href="/lab/arabic/">Arabic lab</a><a class="ghost" href="/lab/tajweed/">Tajweed lab</a></div>';
  }

  function orientation(){
    try{ if(localStorage.getItem(OKEY)) return; }catch(e){}
    if(!document.getElementById("cu-orient")) return;
    var el=document.getElementById("cu-orient");
    el.hidden=false;
    el.innerHTML='<div class="cu-plaque"><h2>Orientation · 90 seconds</h2><ol style="margin:.3rem 0 .4rem 1.1rem;font-size:.9rem">'+
      '<li>Charter — limits and admission</li><li>Map — phases</li><li>Desk — one module</li><li>Lab — one skill</li></ol>'+
      '<div class="cu-row"><a href="/charter/#admission">Begin</a><button type="button" class="ghost" id="cu-orient-dismiss">Dismiss</button></div></div>';
    var b=document.getElementById("cu-orient-dismiss");
    if(b) b.onclick=function(){ try{localStorage.setItem(OKEY,"1");}catch(e){} el.hidden=true; };
  }

  g.ClaritySchedule={paint:paintSchedule,paintCircle:paintCircle,saveDefault:function(){save(DEFAULT);}};
  document.addEventListener("DOMContentLoaded", function(){
    var s=document.getElementById("cu-schedule-root"); if(s) paintSchedule(s);
    var c=document.getElementById("cu-study-circle"); if(c) paintCircle(c);
    orientation();
  });
})(typeof window!=="undefined"?window:this);
