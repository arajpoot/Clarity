/**
 * P4 spine strip + P7 assignments + P8 phase exam bridge
 */
(function(g){
  "use strict";
  if(g.__CU_ASSIGN_V1__) return;
  g.__CU_ASSIGN_V1__=true;

  var ASKEY="cu_uni_assignments_v1";
  var PHASE_QUIZ_HINT={
    1:{title:"Junior phase check", href:"/campus/desk/seeker/", note:"Complete open modules, then the phase quiz when shown on the Seeker desk."},
    2:{title:"Practice phase check", href:"/campus/desk/practice/", note:"Unlock arrives after Junior quiz. Exam = phase quiz only."},
    3:{title:"Consistency phase check", href:"/campus/desk/consistency/", note:"Steady craft — phase quiz when the desk offers it."},
    4:{title:"Transmission phase check", href:"/campus/desk/transmission/", note:"Sources before sharing. Phase quiz when offered."}
  };

  var WEEKLY={
    seeker:[
      {id:"s-ar", title:"Arabic · 10 everyday flashcards", lab:"/lab/arabic/?deck=everyday"},
      {id:"s-read", title:"Re-read open Seeker module once with presence", lab:"/campus/desk/seeker/"},
      {id:"s-lib", title:"Library · open ʿAqīdah shelf pointer", lab:"/library/#aqidah"}
    ],
    practice:[
      {id:"p-tj", title:"Tajweed · one rule practice", lab:"/lab/tajweed/"},
      {id:"p-ar", title:"Arabic · ṣalāh lexicon flash", lab:"/lab/arabic/?deck=salah"},
      {id:"p-desk", title:"Practice desk open module", lab:"/campus/desk/practice/"}
    ],
    consistency:[
      {id:"c-rec", title:"Recite · short portion", lab:"/lab/recite/"},
      {id:"c-stem", title:"Arabic stems review", lab:"/lab/arabic/?deck=stems"},
      {id:"c-desk", title:"Consistency desk module", lab:"/campus/desk/consistency/"}
    ],
    transmission:[
      {id:"t-src", title:"Name one primary source before any share", lab:"/library/#hadith"},
      {id:"t-media", title:"Media lab · source-checked only", lab:"/lab/media/"},
      {id:"t-desk", title:"Transmission desk module", lab:"/campus/desk/transmission/"}
    ]
  };

  function room(){
    return (document.body&&document.body.getAttribute("data-phase-room"))||"seeker";
  }
  function load(){ try{return JSON.parse(localStorage.getItem(ASKEY)||"{}");}catch(e){return {};} }
  function save(o){ try{localStorage.setItem(ASKEY, JSON.stringify(o));}catch(e){} }

  function paintSpine(el){
    if(!el) return;
    var sum=g.ClarityTranscript?g.ClarityTranscript.summary():{modules:0,labs:0,quizzes:0};
    var cont={}; try{cont=JSON.parse(localStorage.getItem("cu_continue_v1")||"{}");}catch(e){}
    el.innerHTML='<div class="cu-ico-row"><span class="mark">▦</span><div><strong>Learning spine</strong><br/><span class="cu-meta">'+(cont.unitTitle||"Seeker path")+'</span></div></div>'+
      '<p class="cu-meta">Logged modules '+ (sum.modules||0) +' · Lab '+ (sum.labs||0) +' · Phase checks '+ (sum.quizzes||0) +'</p>'+
      '<div class="cu-row"><a href="'+(cont.href||"/campus/desk/seeker/")+'">Open desk</a><a class="ghost" href="/campus/assignments/">Assignments</a><a class="ghost" href="/campus/transcript/">Transcript</a></div>';
  }

  function paintAssignments(root){
    if(!root) return;
    var r=room();
    if(root.getAttribute("data-phase")) r=root.getAttribute("data-phase");
    var list=WEEKLY[r]||WEEKLY.seeker;
    var st=load();
    var html=list.map(function(a){
      var done=!!st[a.id];
      return '<div class="cu-plaque" style="margin:.4rem 0">'+
        '<strong>'+a.title+'</strong>'+
        (done?' <span class="cu-badge-soft">Done</span>':'')+
        '<div class="cu-row">'+
        '<a href="'+a.lab+'">Open</a>'+
        '<button type="button" class="ghost" data-asg="'+a.id+'" data-title="'+a.title.replace(/"/g,'')+'">'+(done?"Undo":"Mark done")+'</button>'+
        '</div></div>';
    }).join("");
    var phase=1;
    if(r==="practice") phase=2; else if(r==="consistency") phase=3; else if(r==="transmission") phase=4;
    var ex=PHASE_QUIZ_HINT[phase];
    html+='<div class="cu-plaque"><h2>Phase check · exam</h2><p>'+ex.note+'</p>'+
      '<div class="cu-row"><a href="'+ex.href+'">'+ex.title+' →</a></div>'+
      '<p class="cu-meta">No timed proctor. Unlock only — not a public grade.</p></div>';
    root.innerHTML=html;
    root.querySelectorAll("[data-asg]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id=btn.getAttribute("data-asg");
        var st2=load();
        st2[id]=!st2[id];
        save(st2);
        if(g.ClarityTranscript) g.ClarityTranscript.log("assignment",{id:id,title:btn.getAttribute("data-title"),done:!!st2[id]});
        paintAssignments(root);
      });
    });
  }

  g.ClarityAssignments={paintSpine:paintSpine,paintAssignments:paintAssignments,WEEKLY:WEEKLY};

  document.addEventListener("DOMContentLoaded", function(){
    var sp=document.getElementById("cu-spine-strip");
    if(sp) paintSpine(sp);
    var as=document.getElementById("cu-assignments-root");
    if(as) paintAssignments(as);
  });
})(typeof window!=="undefined"?window:this);
