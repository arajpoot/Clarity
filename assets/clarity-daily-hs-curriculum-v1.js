/* Clarity Daily High-School Curriculum v1 — under Daily/practicing path */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAILY_HS_V1__) return;
  g.__CLARITY_DAILY_HS_V1__ = true;
  var PK = "clarity_daily_hs_progress_v1";
  var UNITS = [
    {
      id: "hs-u1",
      title: "Unit 1 — Tajweed lab",
      goal: "Move from reading to measured practice.",
      lessons: [
        {
          id: "hs-u1-l1",
          title: "One rule, one āyah",
          minutes: 15,
          points: ["Open Tajweed studio.", "Pick one rule (e.g. qalqalah).", "Record and compare once."],
          openCard: "tj-lmr",
          activity: { type: "project", prompt: "Note rule + āyah + one improvement in Notes." }
        }
      ]
    },
    {
      id: "hs-u2",
      title: "Unit 2 — Tafseer & deepen",
      goal: "Read meaning with tools, not vibes alone.",
      lessons: [
        {
          id: "hs-u2-l1",
          title: "Deepen study path",
          minutes: 15,
          points: ["Open Deepen / Tafseer resources.", "Write three takeaways."],
          openCard: "deepen-study-card",
          activity: { type: "write", prompt: "Three takeaways + one question for a teacher." }
        }
      ]
    },
    {
      id: "hs-u3",
      title: "Unit 3 — Weekly review & deeds",
      goal: "Close the week with honest review.",
      lessons: [
        {
          id: "hs-u3-l1",
          title: "Weekly review",
          minutes: 12,
          points: ["Open Weekly Review.", "Score honesty over perfection."],
          openCard: "weekly-review-card",
          activity: { type: "write", prompt: "Wins · misses · one next-week intention." }
        }
      ]
    },
    {
      id: "hs-u4",
      title: "Unit 4 — Calligraphy / Asma enrichment",
      goal: "Beauty and Names as study, not decoration only.",
      lessons: [
        {
          id: "hs-u4-l1",
          title: "Callig or Asma session",
          minutes: 12,
          points: ["Practice one letter form or one Name reflection."],
          openCard: "callig-lab-card",
          activity: { type: "project", prompt: "Photo or note of practice → Notes." }
        }
      ]
    }
  ];
  function load(){try{return JSON.parse(localStorage.getItem(PK)||"{}");}catch(e){return{};}}
  function save(p){try{localStorage.setItem(PK,JSON.stringify(p));}catch(e){}}
  function done(id){var p=load();return !!(p[id]&&p[id].done);}
  function mark(id){var p=load();p[id]={done:true,at:Date.now()};save(p);render();}
  function openCard(id){var el=document.getElementById(id);if(!el)return;try{el.classList.remove("gate-hidden","hidden");el.hidden=false;el.style.removeProperty("display");el.scrollIntoView({behavior:"smooth",block:"start"});}catch(e){}}
  function ensure(){
    var c=document.getElementById("daily-hs-curriculum-card");
    if(c){
      try{
        c.setAttribute("data-min-i","2");
        c.setAttribute("data-clarity-path","daily");
        c.setAttribute("data-curriculum-phase","daily");
        c.setAttribute("data-rrra","reality");
        c.setAttribute("data-curriculum-exclusive","1");
      }catch(eA){}
      return c;
    }
    c=document.createElement("section");
    c.id="daily-hs-curriculum-card";
    c.className="card curriculum-phase-card";
    c.setAttribute("data-min-i","2");
    c.setAttribute("data-clarity-path","daily");
    c.setAttribute("data-curriculum-phase","daily");
    c.setAttribute("data-rrra","reality");
    c.setAttribute("data-curriculum-exclusive","1");
    c.innerHTML='<h2 class="card-title">High school — Daily path</h2><p class="card-lead">Tajweed, tafseer, weekly review, enrichment. Assignments stay on-device.</p><div id="daily-hs-progress" class="junior-progress"></div><div id="daily-hs-body" class="junior-body"></div>';
    var tab=document.getElementById("tab-reality");
    var anchors=["weekly-review-card","deepen-study-card"];
    var placed=false;
    for(var i=0;i<anchors.length;i++){
      var a=document.getElementById(anchors[i]);
      if(a&&a.parentNode){
        try{
          if(a.nextSibling)a.parentNode.insertBefore(c,a.nextSibling);
          else a.parentNode.appendChild(c);
          placed=true;break;
        }catch(eB){}
      }
    }
    if(!placed&&tab){try{tab.appendChild(c);placed=true;}catch(eC){}}
    if(!placed){try{(document.getElementById("main")||document.body).appendChild(c);}catch(eD){}}
    return c;
  }
  function render(){ensure();var prog=document.getElementById("daily-hs-progress"),body=document.getElementById("daily-hs-body");if(!prog||!body)return;var t=0,d=0;UNITS.forEach(function(u){u.lessons.forEach(function(l){t++;if(done(l.id))d++;});});var pct=t?Math.round(100*d/t):0;prog.innerHTML='<div class="junior-bar"><div class="junior-bar-fill" style="width:'+pct+'%"></div></div><span>'+d+' / '+t+' · '+pct+'%</span>';var h="";UNITS.forEach(function(u){h+='<article class="junior-unit"><h3>'+u.title+'</h3><p class="junior-goal">'+u.goal+'</p>';u.lessons.forEach(function(les){var is=done(les.id);h+='<div class="junior-lesson'+(is?' is-done':'')+'"><h4>'+(is?'✓ ':'')+les.title+'</h4><ul>';(les.points||[]).forEach(function(pt){h+='<li>'+pt+'</li>';});h+='</ul>';if(les.activity)h+='<div class="curr-activity"><div class="curr-act-label">Assignment</div><p>'+les.activity.prompt+'</p></div>';h+='<div class="junior-actions">';if(les.openCard)h+='<button type="button" class="mv-chip" data-open="'+les.openCard+'">Open module</button>';if(!is)h+='<button type="button" class="mv-chip" data-mark="'+les.id+'">Mark done</button>';h+='</div></div>';});h+='</article>';});body.innerHTML=h;body.onclick=function(ev){var t=ev.target;if(!t)return;if(t.getAttribute('data-open'))openCard(t.getAttribute('data-open'));if(t.getAttribute('data-mark'))mark(t.getAttribute('data-mark'));};}
    function mountBoost(){
    var card=document.getElementById("daily-hs-curriculum-card");
    if(!card){
      try{ if(typeof ensureCard==="function")ensureCard(); else if(typeof ensure==="function")ensure(); }catch(eE){}
      card=document.getElementById("daily-hs-curriculum-card");
    }
    if(!card)return;
    var pathI=0;
    try{
      var de=document.documentElement;
      var raw=(de&&de.getAttribute("data-path-i"))||"";
      pathI=parseInt(raw,10);
      if(isNaN(pathI)){
        var p="";
        try{p=localStorage.getItem("clarity_path_focus")||localStorage.getItem("clarity_committed_path")||localStorage.getItem("clarity_path_override")||"seeker";}catch(eL){p="seeker";}
        p=String(p).toLowerCase().replace(/_/g,"-");
        var map={seeker:0,"new-muslim":1,daily:2,practicing:2,dai:3};
        pathI=map[p]!=null?map[p]:0;
      }
    }catch(e0){pathI=0;}
    try{
      card.setAttribute("data-min-i","2");
      card.setAttribute("data-clarity-path","daily");
      card.setAttribute("data-curriculum-phase","daily");
      card.setAttribute("data-rrra","reality");
      card.setAttribute("data-curriculum-exclusive","1");
    }catch(e1){}
    /* Phase 4: keep card inside its RRRA tab (not main/body orphan) */
    try{
      var tab=document.getElementById("tab-reality");
      if(tab&&card.parentNode!==tab&&!tab.contains(card)){
        var hub=tab.querySelector(".rrra-hub-body, [id^=\"rrra-hub-body\"]")||tab;
        hub.appendChild(card);
      }
    }catch(eR){}
    if(pathI!==2){
      try{
        card.classList.add("gate-hidden");
        card.setAttribute("data-gate-hidden","1");
        card.style.setProperty("display","none","important");
      }catch(e2){}
      return;
    }
    try{
      card.classList.remove("gate-hidden","hidden");
      card.removeAttribute("data-gate-hidden");
      card.hidden=false;
      card.style.removeProperty("display");
      card.style.visibility="visible";
    }catch(e3){}
  }
  function boot(){
    render();
    try{mountBoost();}catch(e0){}
    g.addEventListener('clarity-path-changed',function(){
      render();
      setTimeout(function(){try{mountBoost();}catch(e){}},50);
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();

  g.addEventListener("hashchange", function () { setTimeout(mountBoost, 60); });
  document.addEventListener("clarity-rrra-change", function () { setTimeout(mountBoost, 60); });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") setTimeout(mountBoost, 80);
  });
})(typeof window!=='undefined'?window:this);
