(function(w){"use strict";if(w.__CLARITY_PATHWAY_FOCUS_HINT__)return;w.__CLARITY_PATHWAY_FOCUS_HINT__=!0;
function pathI(){try{var n=parseInt(document.documentElement.getAttribute("data-path-i")||"0",10);return isNaN(n)?0:n}catch(e){return 0}}
function show(){
  if(pathI()<2)return;
  if(document.getElementById("clarity-daily-focus-bar"))return;
  var bar=document.createElement("div");
  bar.id="clarity-daily-focus-bar";
  bar.setAttribute("role","region");
  bar.setAttribute("aria-label","Daily study focus");
  bar.style.cssText="position:sticky;top:0;z-index:40;background:linear-gradient(90deg,rgba(26,46,36,.96),rgba(40,60,48,.94));color:#e7efe9;padding:.45rem .75rem;font:600 12.5px/1.35 system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.2)";
  bar.innerHTML='<span style="opacity:.8">Daily path · use the tools</span>'
    +'<button type="button" data-go="tajweed-path-card" style="border:0;background:#c9a227;color:#1a2e24;font:700 11px system-ui;padding:.3rem .55rem;border-radius:999px;cursor:pointer">Tajweed</button>'
    +'<button type="button" data-go="callig-lab-card" style="border:0;background:rgba(255,255,255,.12);color:#e7efe9;font:600 11px system-ui;padding:.3rem .55rem;border-radius:999px;cursor:pointer;border:1px solid rgba(255,255,255,.2)">Calligraphy</button>'
    +'<button type="button" data-go="notes-shell" style="border:0;background:rgba(255,255,255,.12);color:#e7efe9;font:600 11px system-ui;padding:.3rem .55rem;border-radius:999px;cursor:pointer;border:1px solid rgba(255,255,255,.2)">Notes</button>'
    +'<button type="button" data-go="meme-card" style="border:0;background:rgba(255,255,255,.12);color:#e7efe9;font:600 11px system-ui;padding:.3rem .55rem;border-radius:999px;cursor:pointer;border:1px solid rgba(255,255,255,.2)">Meme</button>';
  bar.addEventListener("click",function(ev){
    var b=ev.target.closest("[data-go]");
    if(!b)return;
    var id=b.getAttribute("data-go");
    var el=document.getElementById(id);
    if(el){el.classList.remove("gate-hidden");el.scrollIntoView({behavior:"smooth",block:"start"});}
    if(id==="notes-shell"&&w.ClarityCurriculumTools)w.ClarityCurriculumTools.ensureNotes();
    if((id==="tajweed-path-card"||id==="tj-lmr-score-card")&&w.ClarityCurriculumTools)w.ClarityCurriculumTools.ensureTajweed();
  });
  var host=document.querySelector("main")||document.body;
  host.insertBefore(bar,host.firstChild);
}
function boot(){setTimeout(show,800);w.addEventListener("clarity-path-changed",function(){setTimeout(show,300)});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})(typeof window!=="undefined"?window:this);
