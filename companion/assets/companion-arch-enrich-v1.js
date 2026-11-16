/*! companion-arch-enrich-v3 · KEEP enriched L1-L6 · remove shallow counts only · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_ARCH_ENRICH_V3__) return;
  w.__COMPANION_ARCH_ENRICH_V3__=true;
  var LAYERS={
    L1:{title:"Foundation", blurb:"Tawhid · salah spine · halal/haram basics. Quran first."},
    L2:{title:"Obligations", blurb:"Fard before volume — prayer, zakah, fasting, rights of people."},
    L3:{title:"Prophetic path", blurb:"Sunnah & Seerah — character, mercy, samina wa atana."},
    L4:{title:"Excellence", blurb:"Ihsan — consistent small deeds, dhikr quality, guarding the tongue."},
    L5:{title:"Aids", blurb:"Tools that serve the path — hifz, tajweed, notes — not distractions."},
    L6:{title:"Dawah aid", blurb:"Transmit with sources & adab. No spectacle. Educational only."}
  };
  function ensureEnriched(){
    var m=d.getElementById("cs-mount"); if(!m) return;
    var existing=m.querySelector("[data-higher-arch='1']");
    if(existing){
      existing.style.setProperty("display","block","important");
      existing.removeAttribute("hidden");
      return;
    }
    var host=d.createElement("section");
    host.className="cs-plaque cs-higher-arch";
    host.setAttribute("data-higher-arch","1");
    host.innerHTML='<h2>Higher arch · governance L1–L6</h2><p>Hadith Jibril frame: Islam → Iman → Ihsan · fard before volume · adab in transmission. Educational only — not a fatwa.</p><div class="cs-arch-grid"></div>';
    var grid=host.querySelector(".cs-arch-grid");
    ["L1","L2","L3","L4","L5","L6"].forEach(function(k){
      var t=d.createElement("div");
      t.className="cs-arch-tile";
      t.setAttribute("data-arch-level",k);
      t.innerHTML="<strong>"+k+" · "+LAYERS[k].title+"</strong><span class=\"cs-arch-blurb\">"+LAYERS[k].blurb+"</span>";
      grid.appendChild(t);
    });
    var hero=m.querySelector(".cs-tab-hero");
    if(hero&&hero.parentNode){
      if(hero.nextSibling) hero.parentNode.insertBefore(host, hero.nextSibling);
      else hero.parentNode.appendChild(host);
    } else m.appendChild(host);
  }
  function removeShallowOnly(){
    var m=d.getElementById("cs-mount"); if(!m) return;
    m.querySelectorAll("[data-higher-arch='1']").forEach(function(el){
      el.style.setProperty("display","block","important");
      el.removeAttribute("hidden");
    });
    m.querySelectorAll("section, .cs-plaque").forEach(function(sec){
      if(sec.getAttribute("data-higher-arch")==="1") return;
      if(sec.querySelector && sec.querySelector(".cs-arch-blurb")) return;
      var t=(sec.textContent||"");
      if(t.indexOf("Higher arch")<0) return;
      if(t.indexOf("L1")<0||t.indexOf("L6")<0||t.indexOf("Foundation")<0) return;
      if(t.indexOf("salah spine")>=0||t.indexOf("Fard before volume")>=0) return;
      if(t.indexOf("Path seeker")>=0||t.indexOf("nothing removed")>=0||t.length<900){
        sec.style.setProperty("display","none","important");
        sec.setAttribute("data-arch-counts-only","1");
      }
    });
  }
  function apply(){ ensureEnriched(); removeShallowOnly(); }
  function boot(){
    apply();
    var m=d.getElementById("cs-mount");
    if(m){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(apply,60); }).observe(m,{childList:true,subtree:true});
    }
    [0,120,400,1200,2500].forEach(function(ms){ setTimeout(apply,ms); });
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
