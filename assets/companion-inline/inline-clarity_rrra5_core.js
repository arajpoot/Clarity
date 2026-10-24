(function(){
  "use strict";
  if (window.__CLARITY_RRRA5_CORE__) return;
  window.__CLARITY_RRRA5_CORE__ = true;
  var HUBS = ["reminder","reality","reflection","action"];
  var ALL = HUBS.concat(["notes"]);

  function mapId(id){
    id = String(id||"").replace(/^#/,"").replace(/^tab-/,"").toLowerCase();
    if (id==="fiqh"||id==="vault"||id==="amana") return "notes";
    if (id==="tools"||id==="all-tools"||id==="alltools"||id==="about") return "reality";
    if (id==="guidance"||id==="search") return "action";
    if (id==="journey"||id==="commands") return "reminder";
    if (id==="seerah"||id==="lectures") return "reality";
    if (id==="grave"||id==="tafseer") return "reflection";
    if (id==="tajweed") return "action";
    if (ALL.indexOf(id)>=0) return id;
    return "reminder";
  }

  function showHub(id){
    id = mapId(id);
    document.documentElement.classList.add("rrra5-on","door-rail-on");
    try{document.documentElement.setAttribute("data-section-mode","1");}catch(e){}
    ALL.forEach(function(hid){
      var p = document.getElementById("tab-"+hid);
      if (!p) return;
      var on = hid===id;
      p.classList.toggle("active", on);
      p.classList.toggle("is-active", on);
      p.style.display = on ? "block" : "none";
      p.setAttribute("aria-hidden", on?"false":"true");
    });
    document.querySelectorAll("#clarity-door-rail .door-rail-btn").forEach(function(btn){
      btn.classList.toggle("active", btn.getAttribute("data-rail-tab")===id);
    });
    try {
      document.body.setAttribute("data-active-tab", id);
      sessionStorage.setItem("clarity_active_section_v1", id);
      var want = "#"+id;
      if ((location.hash||"")!==want) history.replaceState(null,"",want);
    } catch(e){}
    try { window.scrollTo({top:0,behavior:"smooth"}); } catch(e2){}
  }

  function wrap(){
    ["clarityOpenSectionDoor","switchTab"].forEach(function(name){
      if (typeof window[name]==="function" && window[name]._rrra5core) return;
      var prev = window[name];
      window[name] = function(id){
        var m = mapId(id);
        try { if (prev) prev.call(this, m); } catch(e){}
        showHub(m);
      };
      window[name]._rrra5core = true;
    });
  }

  /* Meme RRRA fetch — safe source-only */
  var RRRA_PACKS = {
    reminder:{verses:[{ar:"يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ",en:"O you who believe, obey Allah and obey the Messenger.",ref:"Quran 4:59"},{ar:"وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ",en:"And remind, for reminder benefits the believers.",ref:"Quran 51:55"}],hadith:[{ar:"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",en:"Actions are only by intentions.",ref:"Bukhari & Muslim"}]},
    reality:{verses:[{ar:"لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ",en:"There has certainly been for you in the Messenger of Allah an excellent example.",ref:"Quran 33:21"}],hadith:[{ar:"بُعِثْتُ لأُتَمِّمَ حُسْنَ الأَخْلاَقِ",en:"I was sent to perfect good character.",ref:"Ahmad"}]},
    reflection:{verses:[{ar:"كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",en:"Every soul will taste death.",ref:"Quran 3:185"},{ar:"أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ",en:"Then do they not reflect upon the Quran?",ref:"Quran 4:82"}],hadith:[{ar:"كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ",en:"Be in this world as if you were a stranger or a traveler.",ref:"Bukhari"}]},
    action:{verses:[{ar:"وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ",en:"And say: Work, for Allah will see your work.",ref:"Quran 9:105"}],hadith:[{ar:"أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",en:"The most beloved deeds to Allah are those done consistently, even if small.",ref:"Bukhari & Muslim"}]}
  };
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  window.memeFetchRrra = async function(cat){
    var cats=["reminder","reality","reflection","action"];
    function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
    if (!cat || cats.indexOf(cat)<0) cat = pick(cats);
    var pack = (typeof RRRA_PACKS!=="undefined") ? RRRA_PACKS[cat] : null;
    if (!pack) { if(typeof memeFetchStatus==="function") memeFetchStatus("No pack for "+cat); return; }
    var line = Math.random()<0.5 ? pick(pack.hadith) : pick(pack.verses);
    try {
      var ar = line.ar || "";
      var en = line.en || "";
      var ref = (line.ref || "") + (cat ? (" · " + cat) : "");
      if (typeof clarityMemeApplyStandard === "function") {
        clarityMemeApplyStandard(ar, en, ref, cat);
      } else if (typeof memeState === "object" && memeState) {
        memeState.top = ar; memeState.mid = en; memeState.bottom = ref;
        ["meme-top-input","meme-mid-input","meme-bottom-input"].forEach(function(id,i){
          var el=document.getElementById(id); if(el) el.value=[ar,en,ref][i];
        });
        if (typeof memeDraw==="function") memeDraw();
      }
      var st=document.getElementById("meme-rrra-status")||document.getElementById("meme-fetch-status");
      if (st) st.textContent = cat.toUpperCase()+" · "+(line.ref||"");
      try { if (typeof memeFetchBg==="function") memeFetchBg({reminder:"holy",reality:"nature",reflection:"night",action:"spirit"}[cat]||"holy"); } catch(eBg){}
    } catch(e){ console.warn("memeFetchRrra", e); }
  };

  function boot(){
    document.documentElement.classList.add("rrra5-on","door-rail-on");
    wrap();
    var start="reminder";
    try {
      var h=(location.hash||"").replace(/^#/,"");
      if (h) start=mapId(h);
      else { var s=sessionStorage.getItem("clarity_active_section_v1"); if(s) start=mapId(s); }
    } catch(e){}
    showHub(start);
    // counts on rail
    HUBS.forEach(function(h){
      var body=document.getElementById("rrra-hub-body-"+h);
      var c=body ? body.querySelectorAll(".card").length : 0;
      var el=document.getElementById("rrra-count-"+h);
      if (el) el.textContent = c?String(c):"";
    });
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot,30); });
  else setTimeout(boot,30);
  window.addEventListener("load", function(){ wrap(); setTimeout(boot,80); });
  window.addEventListener("hashchange", function(){ var h=(location.hash||"").replace(/^#/,""); if(h) showHub(h); });
})();