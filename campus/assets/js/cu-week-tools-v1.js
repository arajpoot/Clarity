
(function(g){
  if (g.__CU_WEEK_TOOLS_V1__) return;
  g.__CU_WEEK_TOOLS_V1__ = true;
  var ASSIGN_KEY = "cu_uni_assign_done_v1";
  function loadDone(){ try{return JSON.parse(localStorage.getItem(ASSIGN_KEY)||"{}")||{};}catch(e){return{};} }
  function saveDone(o){ try{localStorage.setItem(ASSIGN_KEY, JSON.stringify(o));}catch(e){} }
  function phaseLabel(){
    if (!g.CuStudentStatus) return "Seeker";
    return g.CuStudentStatus.get().phaseLabel;
  }
  function phaseHref(){
    if (!g.CuStudentStatus) return "/campus/desk/seeker/";
    return g.CuStudentStatus.get().href;
  }
  function bootSchedule(){
    var root = document.getElementById("cu-schedule-root");
    if (!root) return;
    var label = phaseLabel();
    root.innerHTML =
      '<section class="cu-plaque"><strong>This week\'s open door</strong>'+
      '<p>Stay with <strong>'+label+'</strong>. One desk module · then one Lab station.</p>'+
      '<p><a href="'+phaseHref()+'">Open '+label+' desk →</a> · <a href="/lab/">Lab hub</a></p></section>'+
      '<section class="cu-plaque"><strong>Gentle rhythm</strong><ul style="margin:.4rem 0 0 1.1rem">'+
      '<li><strong>Daily</strong> — 5–15 minutes on the open module or one Lab station.</li>'+
      '<li><strong>After a module</strong> — one honest practice line · optional Library source.</li>'+
      '<li><strong>Weekly</strong> — review Transcript · clear one Assignment.</li>'+
      '</ul><p class="cu-meta">Not a binding timetable · educational only.</p></section>';
  }
  function prompts(){
    var ph = phaseLabel();
    return [
      {id:"a1", t: "Finish the open module on "+ph+" desk."},
      {id:"a2", t: "Write one practice line from that module (in Vault note or on paper)."},
      {id:"a3", t: "Open one Lab station once (Tajweed, Arabic, or Calligraphy)."}
    ];
  }
  function bootAssign(){
    var root = document.getElementById("cu-assign-root");
    if (!root) return;
    var done = loadDone();
    var list = prompts();
    root.innerHTML = "<p class=\"cu-meta\">Optional weekly prompts for <strong>"+phaseLabel()+"</strong>. Not graded īmān.</p><ul style=\"list-style:none;padding:0;margin:0\">"+
      list.map(function(p){
        var on = !!done[p.id];
        return '<li style="padding:.45rem 0;border-bottom:1px solid rgba(212,180,90,.2)">'+
          '<label style="display:flex;gap:.5rem;align-items:flex-start"><input type="checkbox" data-aid="'+p.id+'" '+(on?"checked":"")+'/> <span>'+p.t+'</span></label></li>';
      }).join("")+"</ul>"+
      '<p class="cu-meta" style="margin-top:.6rem"><a href="'+phaseHref()+'">Continue desk →</a> · <a href="/campus/transcript/">Transcript</a></p>';
    root.querySelectorAll("[data-aid]").forEach(function(c){
      c.addEventListener("change", function(){
        var d = loadDone();
        d[c.getAttribute("data-aid")] = c.checked;
        saveDone(d);
      });
    });
  }
  function boot(){ bootSchedule(); bootAssign(); }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
