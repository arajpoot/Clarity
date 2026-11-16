/*! companion-arch-enrich-v2 · single grid · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_ARCH_ENRICH_V2__) return;
  w.__COMPANION_ARCH_ENRICH_V2__=true;
  var LAYERS={
    L1:{title:"Foundation", blurb:"Tawhid · salah spine · halal/haram basics. Quran first."},
    L2:{title:"Obligations", blurb:"Fard before volume — prayer, zakah, fasting, rights of people."},
    L3:{title:"Prophetic path", blurb:"Sunnah & Seerah — character, mercy, samina wa atana."},
    L4:{title:"Excellence", blurb:"Ihsan — consistent small deeds, dhikr quality, guarding the tongue."},
    L5:{title:"Aids", blurb:"Tools that serve the path — hifz, tajweed, notes — not distractions."},
    L6:{title:"Dawah aid", blurb:"Transmit with sources & adab. No spectacle. Educational only."}
  };
  function enhance(){
    var m=d.getElementById("cs-mount"); if(!m) return;
    if(m.querySelector("[data-higher-arch='1']")) return;
    var focus=m.querySelector(".cs-tab-hero, .cs-focus-plaque");
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
    if(focus&&focus.parentNode){
      if(focus.nextSibling) focus.parentNode.insertBefore(host, focus.nextSibling);
      else focus.parentNode.appendChild(host);
    } else m.appendChild(host);
  }
  function boot(){ enhance(); setTimeout(enhance,500); }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})(window,document);
