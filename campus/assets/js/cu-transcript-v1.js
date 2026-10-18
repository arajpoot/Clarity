/**
 * P5 Return + P6 Transcript (device-local)
 */
(function(g){
  "use strict";
  if(g.__CU_TRANSCRIPT_V1__) return;
  g.__CU_TRANSCRIPT_V1__=true;

  var TKEY="cu_uni_transcript_v1";
  var CKEY="cu_continue_v1";
  var AKEY="cu_uni_admitted_v1";
  var NKEY="clarity_learner_name_v1";
  var SKEY="cu_uni_schedule_v1";
  var ASKEY="cu_uni_assignments_v1";

  function load(k, fb){ try{ return JSON.parse(localStorage.getItem(k)||fb); }catch(e){ return JSON.parse(fb); } }
  function save(k,o){ try{ localStorage.setItem(k, JSON.stringify(o)); }catch(e){} }

  function getTranscript(){
    var t=load(TKEY, '{"version":1,"events":[],"modules":{},"labs":{},"quizzes":{},"assignments":{}}');
    if(!t.events) t.events=[];
    if(!t.modules) t.modules={};
    if(!t.labs) t.labs={};
    if(!t.quizzes) t.quizzes={};
    if(!t.assignments) t.assignments={};
    return t;
  }

  function logEvent(type, detail){
    var t=getTranscript();
    t.events.unshift({type:type, detail:detail||{}, at:new Date().toISOString()});
    if(t.events.length>200) t.events=t.events.slice(0,200);
    if(type==="module" && detail && detail.id){
      t.modules[detail.id]={ title:detail.title||detail.id, phase:detail.phase||1, at:new Date().toISOString() };
    }
    if(type==="lab" && detail && detail.id){
      t.labs[detail.id]={ title:detail.title||detail.id, at:new Date().toISOString() };
    }
    if(type==="quiz" && detail && detail.id){
      t.quizzes[detail.id]={ passed:!!detail.passed, phase:detail.phase||1, at:new Date().toISOString() };
    }
    if(type==="assignment" && detail && detail.id){
      t.assignments[detail.id]={ title:detail.title||detail.id, done:!!detail.done, at:new Date().toISOString() };
    }
    save(TKEY,t);
    return t;
  }

  function summary(){
    var t=getTranscript();
    return {
      modules: Object.keys(t.modules).length,
      labs: Object.keys(t.labs).length,
      quizzes: Object.keys(t.quizzes).length,
      assignmentsDone: Object.keys(t.assignments).filter(function(k){return t.assignments[k].done;}).length,
      name: (function(){try{return localStorage.getItem(NKEY)||"";}catch(e){return "";}})(),
      admitted: !!(function(){try{var a=JSON.parse(localStorage.getItem(AKEY)||"null");return a&&a.ok;}catch(e){return false;}})(),
      continue: load(CKEY, "{}")
    };
  }

  function paintWelcome(el){
    if(!el) return;
    var s=summary();
    var c=s.continue||{};
    if(!s.admitted && !(c.href)){
      el.innerHTML='<div class="cu-ico-row"><span class="mark">✦</span><div><strong>Welcome</strong><br/><span class="cu-meta">Start at Charter admission when ready.</span></div></div>'+
        '<div class="cu-row"><a href="/charter/#admission">Admission</a></div>';
      return;
    }
    var label=c.unitTitle||c.phase||"Seeker path";
    var href=c.href||"/campus/desk/seeker/";
    el.innerHTML='<div class="cu-ico-row"><span class="mark">◎</span><div><strong>Welcome back'+(s.name?(", "+s.name):"")+'</strong><br/><span class="cu-meta">'+label+'</span></div></div>'+
      '<p class="cu-meta" style="margin:.4rem 0 0">Modules logged: '+s.modules+' · Lab: '+s.labs+' · Quizzes: '+s.quizzes+'</p>'+
      '<div class="cu-row"><a href="'+href+'">Continue →</a><a class="ghost" href="/campus/transcript/">Transcript</a></div>';
  }

  function paintTranscript(root){
    if(!root) return;
    var t=getTranscript();
    var s=summary();
    var rows=t.events.slice(0,40).map(function(e){
      return '<tr><td>'+((e.at||"").slice(0,10))+'</td><td>'+e.type+'</td><td>'+
        (e.detail&& (e.detail.title||e.detail.id)||"")+'</td></tr>';
    }).join("")||'<tr><td colspan="3">No events yet — complete a module or assignment.</td></tr>';
    root.innerHTML=
      '<div class="cu-plaque"><h2>Learner</h2><p>'+(s.name||"Guest learner")+'</p>'+
      '<p class="cu-meta">Modules '+s.modules+' · Labs '+s.labs+' · Quizzes '+s.quizzes+' · Assignments done '+s.assignmentsDone+'</p>'+
      '<p class="cu-meta">Local record only — not a grade of īmān, not an ijāzah.</p></div>'+
      '<div class="cu-plaque"><h2>Recent activity</h2><table class="cu-table"><thead><tr><th>Date</th><th>Type</th><th>Item</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  }

  g.ClarityTranscript={
    log:logEvent,
    get:getTranscript,
    summary:summary,
    paintWelcome:paintWelcome,
    paintTranscript:paintTranscript
  };

  document.addEventListener("DOMContentLoaded", function(){
    var w=document.getElementById("cu-welcome-back");
    if(w) paintWelcome(w);
    var tr=document.getElementById("cu-transcript-root");
    if(tr) paintTranscript(tr);
  });
})(typeof window!=="undefined"?window:this);
