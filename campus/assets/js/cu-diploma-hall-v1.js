/**
 * P9 Diploma hall — educational certificates from local transcript
 */
(function(g){
  "use strict";
  if(g.__CU_DIPLOMA_HALL_V1__) return;
  g.__CU_DIPLOMA_HALL_V1__=true;

  var PHASES=[
    {id:1,code:"JR",title:"Junior · Seeker Foundations",needModules:6},
    {id:2,code:"JH",title:"Junior High · Practice",needModules:4},
    {id:3,code:"DY",title:"Daily · Consistency",needModules:4},
    {id:4,code:"DI",title:"Da'i · Transmission",needModules:3}
  ];

  function name(){ try{return localStorage.getItem("clarity_learner_name_v1")||"Learner";}catch(e){return "Learner";} }
  function modulesCount(){
    if(g.ClarityTranscript) return g.ClarityTranscript.summary().modules;
    return 0;
  }
  function quizzes(){
    if(!g.ClarityTranscript) return {};
    return g.ClarityTranscript.get().quizzes||{};
  }

  function paint(root){
    if(!root) return;
    var n=name();
    var mc=modulesCount();
    var q=quizzes();
    var cards=PHASES.map(function(p){
      var eligible=mc>=p.needModules || !!(q["phase-"+p.id]&&q["phase-"+p.id].passed);
      return '<div class="cu-plaque">'+
        '<div class="cu-ico-row"><span class="mark">✧</span><div><strong>'+p.title+'</strong><br/><span class="cu-meta">Code '+p.code+'</span></div></div>'+
        '<p class="cu-meta">'+(eligible?"Eligible to preview on this device.":"Keep studying — eligibility is a local guide only.")+'</p>'+
        '<div class="cu-row"><button type="button" data-dip="'+p.id+'" '+(eligible?"":"disabled style=opacity:.5")+'">Preview certificate</button></div></div>';
    }).join("");
    root.innerHTML=
      '<div class="cu-plaque cu-welcome"><p>Certificates recognise <strong>'+n+'</strong> for work logged on this device.</p>'+
      '<p class="cu-meta">Educational recognition only — not a formal ijāzah, not a fatwa license, not institutional credit.</p></div>'+
      cards+
      '<div id="cu-dip-preview" class="cu-plaque" hidden></div>';
    root.querySelectorAll("[data-dip]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id=+btn.getAttribute("data-dip");
        var p=PHASES.filter(function(x){return x.id===id;})[0];
        var box=document.getElementById("cu-dip-preview");
        if(!box||!p) return;
        box.hidden=false;
        box.innerHTML='<p class="cu-meta" style="text-align:center">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>'+
          '<h2 style="text-align:center">Certificate of Completion</h2>'+
          '<p style="text-align:center">This device recognises that</p>'+
          '<p style="text-align:center;font-size:1.2rem;color:#c9a227"><strong>'+n+'</strong></p>'+
          '<p style="text-align:center">has completed study milestones for</p>'+
          '<p style="text-align:center"><strong>'+p.title+'</strong></p>'+
          '<p class="cu-meta" style="text-align:center">Clarity University · Nur Path · Educational only</p>'+
          '<div class="cu-row" style="justify-content:center"><button type="button" class="ghost" onclick="window.print()">Print</button></div>';
        if(g.ClarityTranscript) g.ClarityTranscript.log("diploma",{id:"dip-"+p.id,title:p.title});
      });
    });
  }

  g.ClarityDiplomaHall={paint:paint};
  document.addEventListener("DOMContentLoaded", function(){
    var r=document.getElementById("cu-diploma-root");
    if(r) paint(r);
  });
})(typeof window!=="undefined"?window:this);
