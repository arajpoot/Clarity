
(function(){
  if (window.__CU_ADMISSION_FLOW_V1__) return;
  window.__CU_ADMISSION_FLOW_V1__ = true;
  var KEY = "cu_uni_admit_v1";
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||"null"); }catch(e){ return null; } }
  function save(o){ try{ localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} }
  function show(step){
    document.querySelectorAll("[data-panel]").forEach(function(p){
      p.classList.toggle("on", p.getAttribute("data-panel") === String(step));
    });
    document.querySelectorAll("#adm-steps [data-step]").forEach(function(b){
      b.classList.toggle("on", b.getAttribute("data-step") === String(step));
    });
  }
  function boot(){
    var a = load();
    var ret = document.getElementById("adm-returning");
    if (a && a.name && ret){
      ret.hidden = false;
      var n = document.getElementById("adm-returning-name");
      if (n) n.textContent = a.name;
    }
    document.querySelectorAll("[data-next]").forEach(function(b){
      b.addEventListener("click", function(){ show(+b.getAttribute("data-next")); });
    });
    document.querySelectorAll("#adm-steps [data-step]").forEach(function(b){
      b.addEventListener("click", function(){ show(+b.getAttribute("data-step")); });
    });
    var decl = document.getElementById("adm-decl-next");
    if (decl) decl.addEventListener("click", function(){
      var ok = ["adm-d1","adm-d2","adm-d3","adm-d4"].every(function(id){
        var el = document.getElementById(id); return el && el.checked;
      });
      var err = document.getElementById("adm-decl-err");
      if (!ok){ if (err) err.hidden = false; return; }
      if (err) err.hidden = true;
      show(3);
    });
    var reg = document.getElementById("adm-register");
    if (reg) reg.addEventListener("click", function(){
      var name = (document.getElementById("adm-name")||{}).value || "";
      name = String(name).trim();
      if (!name){ alert("Please enter a preferred name."); return; }
      var intent = ((document.getElementById("adm-intent")||{}).value || "").trim();
      save({ name: name, intent: intent, at: Date.now(), declared: true });
      show(4);
      var ret = document.getElementById("adm-returning");
      if (ret){ ret.hidden = false; var n = document.getElementById("adm-returning-name"); if (n) n.textContent = name; }
    });
    var reset = document.getElementById("adm-reset");
    if (reset) reset.addEventListener("click", function(){
      try{ localStorage.removeItem(KEY); }catch(e){}
      location.reload();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
