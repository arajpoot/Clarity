
(function(){
  "use strict";
  if (window.__CLARITY_LANDING_DAY_V2__) return;
  window.__CLARITY_LANDING_DAY_V2__ = true;

  var KEY_PROV = "clarity_provision_day_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";
  var KEY_CONT = "clarity_continue_v1";
  var KEY_LAND_HIDE = "clarity_day_landing_collapsed_v1";

  var PROVISIONS = [
    { lane: "jariyah", text: "Do one small ongoing good: teach something useful, water a plant, or give a quiet ṣadaqah." },
    { lane: "knowledge", text: "Learn or share one beneficial sentence from Qur’ān or Sunnah with sincerity." },
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative; ask Allah to make you a source of ongoing good." },
    { lane: "rights", text: "Settle or note one right: a debt, a trust, or an apology you still owe." },
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence; say Bismillāh before your next ordinary task." },
    { lane: "character", text: "Guard the tongue for one hour: no mockery, no gossip; replace with istighfār." }
  ];
  var ADHKAR = {
    morning: [
      { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        en: "O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · often 3× · educational", target: 3 }
    ],
    evening: [
      { ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        en: "O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the return.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim 2708 · educational", target: 3 }
    ]
  };

  function todayKey(){ var d=new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
  function readJSON(k){ try{return JSON.parse(localStorage.getItem(k)||"null");}catch(e){return null;} }
  function writeJSON(k,v){ try{localStorage.setItem(k,JSON.stringify(v));}catch(e){} }
  function hash(s){ var h=0; for(var i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i); return h; }
  function dayPeriod(){ var h=new Date().getHours(); if(h<5)return "Night"; if(h<12)return "Morning"; if(h<15)return "Midday"; if(h<18)return "Afternoon"; if(h<21)return "Evening"; return "Night"; }
  function isEvening(){ var h=new Date().getHours(); return h>=15||h<5; }
  function todayProvision(){
    var day=todayKey(), saved=readJSON(KEY_PROV);
    if(saved&&saved.day===day&&saved.text) return saved;
    var pick=PROVISIONS[Math.abs(hash(day))%PROVISIONS.length];
    var out={day:day,lane:pick.lane,text:pick.text}; writeJSON(KEY_PROV,out); return out;
  }
  function tasState(){ var day=todayKey(), s=readJSON(KEY_TAS)||{}; if(s.day!==day) s={day:day,count:0}; return s; }
  function trackContinue(a,d){ writeJSON(KEY_CONT,{action:a||"landing",detail:d||"",ts:Date.now()}); }
  function openTab(id){
    try{ if(typeof switchTab==="function") switchTab(id);
      else if(typeof clarityOpenSectionDoor==="function") clarityOpenSectionDoor(id);
      else if(typeof clarityCompanionShowTab==="function") clarityCompanionShowTab(id);
    }catch(e){}
    trackContinue(id,"tab-"+id);
  }

  function buildLanding(){
    /* Dedup: only one landing */
    document.querySelectorAll("#clarity-day-landing").forEach(function(el,i){ if(i>0) el.remove(); });
    document.querySelectorAll("#clarity-reopen-bar").forEach(function(el,i){ if(i>0) el.remove(); });
    if (document.getElementById("clarity-day-landing")) return;

    var prov=todayProvision(), tas=tasState();
    var pack=isEvening()?ADHKAR.evening:ADHKAR.morning;
    var dh=pack[Math.abs(hash(todayKey()+"dh"))%pack.length];

    var wrap=document.createElement("section");
    wrap.id="clarity-day-landing";
    wrap.setAttribute("aria-label","Today provision and paths");
    wrap.innerHTML=
      '<div class="dual-tiles" role="navigation" aria-label="Companion or University">' +
        '<a class="dual-tile dual-tile-companion" href="#main-content" id="dual-path-companion">' +
          '<span class="dual-ico" aria-hidden="true">🏠</span>' +
          '<span class="dual-name">Companion path</span>' +
          '<small>Reminder · Reality · Reflection · Action · tools on this page</small>' +
        '</a>' +
        '<a class="dual-tile dual-tile-university" href="https://clarity-dawah.fyi/campus/" id="dual-path-university" target="_blank" rel="noopener">' +
          '<span class="dual-ico" aria-hidden="true">🎓</span>' +
          '<span class="dual-name">University path</span>' +
          '<small>Four colleges · phase desk · Faculty · Security · IT — on Campus pages</small>' +
        '</a>' +
      '</div>' +
      '<div class="cdl-card" id="cdl-today">' +
        '<div class="cdl-head"><h2>Do this today</h2><span class="cdl-period" id="cdl-period">'+dayPeriod()+'</span></div>' +
        '<div class="cdl-row">' +
          '<span class="cdl-salah">🕌 <span id="cdl-salah-txt">Next ṣalāh · see banner</span></span>' +
          '<span class="cdl-tas">📿 <strong id="cdl-tas-count">'+(tas.count||0)+'</strong> ' +
            '<button type="button" id="cdl-tas-inc">+1</button> ' +
            '<button type="button" id="cdl-tas-reset">↺</button></span>' +
        '</div>' +
        '<div class="cdl-lane">'+(prov.lane||"provision")+'</div>' +
        '<p class="cdl-deed">'+prov.text+'</p>' +
        '<p class="cdl-note">Educational only — not a fatwa. Acceptance is with Allah.</p>' +
      '</div>' +
      '<div class="cdl-card" id="cdl-adhkar">' +
        '<div class="cdl-head"><h2>Adhkār · '+(isEvening()?"evening":"morning")+'</h2>' +
          '<button type="button" class="cdl-count-btn" id="cdl-adhkar-count">Count 0 / '+dh.target+'</button></div>' +
        '<p class="cdl-adhkar-ar">'+dh.ar+'</p>' +
        '<p class="cdl-adhkar-en">'+dh.en+'</p>' +
        '<p class="cdl-adhkar-ref">'+dh.ref+'</p>' +
        '<div class="cdl-pills">' +
          '<button type="button" data-cdl-tab="reminder">✦ Reminder</button>' +
          '<button type="button" data-cdl-tab="reality">◉ Reality</button>' +
          '<button type="button" data-cdl-tab="reflection">☾ Reflection</button>' +
          '<button type="button" data-cdl-tab="action">➤ Action</button>' +
          '<button type="button" data-cdl-tab="notes">🏦 Vault</button>' +
        '</div>' +
      '</div>';

    var reopen=document.createElement("div");
    reopen.id="clarity-reopen-bar";
    reopen.innerHTML='<span>Day landing</span> <button type="button" id="cdl-reopen-show">Open Do this today</button> <button type="button" id="cdl-reopen-hide">Hide for now</button> <span style="opacity:.75">Revisit any time today</span>';

    /* Insert as FIRST child of main workspace, or right after visit bar — never below Reminder */
    var main = document.getElementById("main-application-workspace") || document.querySelector(".main-content");
    var visit = document.getElementById("clarity-visit-pill-bar");
    var duo = document.getElementById("clarity-top-duo");

    if (main) {
      main.insertBefore(wrap, main.firstChild);
      main.insertBefore(reopen, wrap.nextSibling);
    } else if (visit && visit.parentNode) {
      if (visit.nextSibling) visit.parentNode.insertBefore(wrap, visit.nextSibling);
      else visit.parentNode.appendChild(wrap);
      wrap.parentNode.insertBefore(reopen, wrap.nextSibling);
    } else if (duo && duo.parentNode) {
      if (duo.nextSibling) duo.parentNode.insertBefore(wrap, duo.nextSibling);
      else duo.parentNode.appendChild(wrap);
      wrap.parentNode.insertBefore(reopen, wrap.nextSibling);
    } else {
      document.body.appendChild(wrap);
      document.body.appendChild(reopen);
    }

    function applyCollapse(){
      var hide = localStorage.getItem(KEY_LAND_HIDE) === todayKey();
      wrap.style.display = hide ? "none" : "grid";
    }
    applyCollapse();
    document.getElementById("cdl-reopen-hide").onclick=function(){ localStorage.setItem(KEY_LAND_HIDE, todayKey()); applyCollapse(); };
    document.getElementById("cdl-reopen-show").onclick=function(){ localStorage.removeItem(KEY_LAND_HIDE); applyCollapse(); wrap.scrollIntoView({behavior:"smooth",block:"start"}); };
    document.getElementById("cdl-tas-inc").onclick=function(){ var s=tasState(); s.count=(s.count||0)+1; writeJSON(KEY_TAS,s); document.getElementById("cdl-tas-count").textContent=s.count; };
    document.getElementById("cdl-tas-reset").onclick=function(){ writeJSON(KEY_TAS,{day:todayKey(),count:0}); document.getElementById("cdl-tas-count").textContent=0; };
    var adhCount=0;
    document.getElementById("cdl-adhkar-count").onclick=function(){ adhCount++; var t=dh.target||1; this.textContent = adhCount>=t ? ("Done ✓ · "+adhCount) : ("Count "+adhCount+" / "+t); };
    wrap.querySelectorAll("[data-cdl-tab]").forEach(function(btn){ btn.addEventListener("click", function(){ openTab(btn.getAttribute("data-cdl-tab")); }); });
    var comp = document.getElementById("dual-path-companion");
    if (comp) comp.addEventListener("click", function(ev){ ev.preventDefault(); openTab("reminder"); var t=document.getElementById("tab-reminder")||document.getElementById("main-content"); if(t) t.scrollIntoView({behavior:"smooth"}); });
    trackContinue("landing");
  }

  function boot(){ try{ buildLanding(); }catch(e){ console.warn("[landing]",e); } }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot,120); });
  else setTimeout(boot,120);
  window.addEventListener("load", function(){ setTimeout(boot,400); });
})();
