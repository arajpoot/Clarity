(function(){
  "use strict";
  if (window.__CLARITY_MEME_INTERLINK_V1__) return;
  window.__CLARITY_MEME_INTERLINK_V1__ = true;

  /** Online background fetch with multiple safe scenery sources (no figurative lists) */
  window.__memeOnlineFetch = window.__memeOnlineFetch || function(kind){
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      if (typeof memeShowBlankPalette === "function") memeShowBlankPalette();
      return;
    }
    var seeds = {
      nature: ["forest","mountains","ocean","desert-dunes","green-hills"],
      flowers: ["garden-flowers","wildflowers","spring-meadow"],
      holy: ["mosque-architecture","islamic-geometry","arabesque"],
      night: ["starry-night","night-sky","moonlit"],
      water: ["clear-water","river","lake"],
      flickr: ["nature-landscape","architecture-stone"]
    };
    var list = seeds[kind] || seeds.nature;
    var seed = list[Math.floor(Math.random() * list.length)] + "-" + (Date.now() % 9973);
    var urls = [
      "https://picsum.photos/seed/clarity-" + encodeURIComponent(seed) + "/1280/900.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons.jpg/1280px-Tour_Eiffel_Wikimedia_Commons.jpg"
    ];
    // Prefer picsum; geometry-safe fallbacks for décor
    if (kind === "holy" || kind === "pattern") {
      urls = [
        "https://picsum.photos/seed/clarity-geom-" + (Date.now()%5000) + "/1280/900.jpg"
      ];
    }
    var u = urls[0];
    function apply(url){
      if (typeof memeLoadImageFromUrl === "function") memeLoadImageFromUrl(url);
      else if (window.memeState) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function(){
          memeState.img = img;
          if (typeof memeDraw === "function") memeDraw();
        };
        img.src = url;
      }
    }
    apply(u);
    try {
      var st = document.getElementById("meme-rrra-status") || document.getElementById("meme-fetch-status");
      if (st) st.textContent = "Background: " + kind + " · loaded";
    } catch(e){}
  };

  if (typeof window.memeFetchBg === "function" && !window.memeFetchBg.__online) {
    var prev = window.memeFetchBg;
    window.memeFetchBg = function(kind){
      try { return window.__memeOnlineFetch(kind); }
      catch(e){ try { return prev(kind); } catch(e2){} }
    };
    window.memeFetchBg.__online = true;
  } else if (typeof window.memeFetchBg !== "function") {
    window.memeFetchBg = window.__memeOnlineFetch;
  }

  /** Interlink pills: rail ↔ tabs ↔ meme/tweet */
  function wirePills(){
    document.querySelectorAll("[data-rail-tab]").forEach(function(btn){
      if (btn.__wired) return;
      btn.addEventListener("click", function(){
        var t = btn.getAttribute("data-rail-tab");
        if (typeof switchTab === "function") switchTab(t);
        else if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor(t);
      });
      btn.__wired = true;
    });
    // "To Meme" / From studio bridges
    document.querySelectorAll("[data-to-meme], .to-meme-btn").forEach(function(btn){
      if (btn.__wired) return;
      btn.addEventListener("click", function(){
        if (typeof claritySendToMeme === "function") claritySendToMeme();
        else if (typeof switchTab === "function") switchTab("reminder");
      });
      btn.__wired = true;
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(wirePills, 300); });
  else setTimeout(wirePills, 300);
  window.addEventListener("load", function(){ setTimeout(wirePills, 800); });
})();