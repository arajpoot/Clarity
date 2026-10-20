
(function(){
  if (window.__CU_UNI_VAULT_V1__) return;
  window.__CU_UNI_VAULT_V1__ = true;
  var NOTE_KEY = "cu_uni_vault_note_v1";
  var PIN_KEY = "cu_uni_vault_pins_v1";
  function loadPins(){
    try { return JSON.parse(localStorage.getItem(PIN_KEY)||"[]")||[]; } catch(e){ return []; }
  }
  function savePins(p){ try{ localStorage.setItem(PIN_KEY, JSON.stringify(p.slice(0,20))); }catch(e){} }
  function boot(){
    var note = document.getElementById("cu-uv-note");
    var save = document.getElementById("cu-uv-save");
    var status = document.getElementById("cu-uv-status");
    var list = document.getElementById("cu-uv-pins");
    if (note) {
      try { note.value = localStorage.getItem(NOTE_KEY)||""; } catch(e){}
    }
    if (save) save.onclick = function(){
      try {
        localStorage.setItem(NOTE_KEY, (note&&note.value)||"");
        if (status) status.textContent = "Saved on this device · " + new Date().toLocaleString();
      } catch(e){ if (status) status.textContent = "Could not save."; }
    };
    function renderPins(){
      if (!list) return;
      var pins = loadPins();
      if (!pins.length) {
        list.innerHTML = '<p class="cu-meta">No custom pins yet. Defaults are listed above.</p>';
        return;
      }
      list.innerHTML = pins.map(function(p,i){
        return '<div class="cu-plaque" style="margin:.35rem 0">'+
          '<a href="'+String(p.url||"#").replace(/"/g,"")+'">'+String(p.label||p.url||"").replace(/</g,"")+'</a>'+
          ' <button type="button" data-del="'+i+'" style="margin-left:.5rem;min-height:32px;border-radius:999px;padding:.2rem .6rem">Remove</button></div>';
      }).join("");
      list.querySelectorAll("[data-del]").forEach(function(b){
        b.onclick = function(){
          var pins = loadPins();
          pins.splice(+b.getAttribute("data-del"),1);
          savePins(pins);
          renderPins();
        };
      });
    }
    var add = document.getElementById("cu-uv-pin-add");
    if (add) add.onclick = function(){
      var label = (document.getElementById("cu-uv-pin-label")||{}).value||"";
      var url = (document.getElementById("cu-uv-pin-url")||{}).value||"";
      if (!url.trim()) return;
      var pins = loadPins();
      pins.unshift({label: label.trim()||url.trim(), url: url.trim()});
      savePins(pins);
      renderPins();
    };
    renderPins();
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
