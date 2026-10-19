
(function(){
  if (window.__CU_ADMIT_SURFACE_V1__) return;
  window.__CU_ADMIT_SURFACE_V1__ = true;
  var KEY = "cu_uni_admit_v1";
  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)||"null"); } catch(e){ return null; }
  }
  function save(o){
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch(e){}
  }
  function paint(){
    var letter = document.getElementById("cu-admit-letter");
    var a = load();
    if (!letter) return;
    if (!a || !a.name) { letter.hidden = true; return; }
    letter.hidden = false;
    letter.innerHTML = "<strong>Admission letter</strong><p><strong>Bismillah</strong></p>"
      + "<p>This device recognises <strong>"+String(a.name).replace(/</g,"")+"</strong> as a learner on the Clarity University path.</p>"
      + "<p>Intended track: <strong>"+(a.track||"seeker")+"</strong></p>"
      + "<p class=\"cu-meta\">Recorded: "+(a.at||"")+" · Educational path on this device only. Not institutional enrolment, ijāzah, or fatwa license.</p>"
      + "<p><a href=\"/campus/desk/seeker/\">Open Seeker desk →</a> · <a href=\"/campus/\">Map</a>"
      + " · <button type=\"button\" id=\"cu-admit-reset\">Reset admission</button></p>";
    var r = document.getElementById("cu-admit-reset");
    if (r) r.onclick = function(){ try{ localStorage.removeItem(KEY);}catch(e){} paint(); };
  }
  function boot(){
    var btn = document.getElementById("cu-admit-btn");
    if (btn) btn.addEventListener("click", function(){
      var name = (document.getElementById("cu-admit-name")||{}).value || "";
      name = name.trim();
      var ok = document.getElementById("cu-admit-ok");
      if (!ok || !ok.checked) { alert("Please confirm the educational-only checkbox."); return; }
      if (!name) { alert("Please enter a name or kunya."); return; }
      var track = "seeker";
      var radios = document.querySelectorAll('input[name="cu-admit-track"]');
      radios.forEach(function(r){ if (r.checked) track = r.value; });
      save({ name: name, track: track, at: new Date().toISOString().slice(0,10) });
      paint();
    });
    var a = load();
    if (a && a.name) {
      var inp = document.getElementById("cu-admit-name");
      if (inp) inp.value = a.name;
    }
    paint();
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
