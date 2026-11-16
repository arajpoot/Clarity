/*! companion-arch-enrich-v1 · L1–L6 deep learning · educational only */
(function(w,d){
  "use strict";
  if(w.__COMPANION_ARCH_ENRICH_V1__) return;
  w.__COMPANION_ARCH_ENRICH_V1__=true;
  var LAYERS={
    L1:{title:"Foundation", blurb:"Tawḥīd · ṣalāh spine · ḥalāl/ḥarām basics. Qurʾān first."},
    L2:{title:"Obligations", blurb:"Farḍ before volume — prayer, zakāh, fasting, rights of people."},
    L3:{title:"Prophetic path", blurb:"Sunnah & Seerah — character, mercy, samiʿnā wa aṭaʿnā."},
    L4:{title:"Excellence", blurb:"Iḥsān — consistent small deeds, dhikr quality, guarding the tongue."},
    L5:{title:"Aids", blurb:"Tools that serve the path — ḥifẓ, tajweed, notes — not distractions."},
    L6:{title:"Daʿwah aid", blurb:"Transmit with sources & adab. No spectacle. Educational only."}
  };
  function enhance(){
    var m=d.getElementById("cs-mount")||d;
    var nodes=m.querySelectorAll("[data-arch-level], .cs-arch-tile, .arch-tile");
    if(!nodes.length){
      var focus=m.querySelector(".cs-focus-plaque, [data-cs-focus], .cs-tab-hero");
      var host=d.createElement("section");
      host.className="cs-plaque cs-higher-arch";
      host.setAttribute("data-higher-arch","1");
      host.innerHTML='<h2>Higher arch · governance L1–L6</h2><p>Ḥadīth Jibrīl frame: Islām → Īmān → Iḥsān · farḍ before volume · adab in transmission. Educational only — not a fatwa.</p><div class="cs-arch-grid"></div>';
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
      return;
    }
    nodes.forEach(function(el){
      var k=el.getAttribute("data-arch-level");
      if(!k){
        var tx=el.textContent||"";
        ["L1","L2","L3","L4","L5","L6"].forEach(function(id){ if(tx.indexOf(id)>=0) k=id; });
      }
      if(!k||!LAYERS[k]) return;
      el.classList.add("cs-arch-tile");
      if(!el.querySelector(".cs-arch-blurb")){
        var s=d.createElement("span");
        s.className="cs-arch-blurb";
        s.textContent=LAYERS[k].blurb;
        el.appendChild(s);
      }
    });
  }
  function boot(){
    enhance();
    var m=d.getElementById("cs-mount");
    if(m){
      var t=null;
      new MutationObserver(function(){ if(t) clearTimeout(t); t=setTimeout(enhance,80); }).observe(m,{childList:true});
    }
    [200,800,2000].forEach(function(ms){ setTimeout(enhance,ms); });
  }
  if(d.readyState==="loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window,document);
