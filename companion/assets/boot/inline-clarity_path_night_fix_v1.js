(function(){
"use strict";
if (window.__CLARITY_PATH_NIGHT_FIX_V1__) return;
window.__CLARITY_PATH_NIGHT_FIX_V1__ = true;

function nightPolish(){
  if (document.documentElement.getAttribute("data-theme") !== "dark") return;
  document.querySelectorAll(".card div, .card section, .card li").forEach(function(el){
    try {
      var bg = (window.getComputedStyle(el).backgroundColor || "").replace(/\s/g,"");
      /* light grays/whites → deepen */
      if (/^rgb\((24[0-9]|25[0-5]),(24[0-9]|25[0-5]),(24[0-9]|25[0-5])\)/.test(bg) ||
          /^rgb\((2[0-3][0-9]),(2[0-3][0-9]),(2[0-3][0-9])\)/.test(bg) ||
          bg === "rgb(255,255,255)" || bg === "rgba(0,0,0,0)") {
        /* skip fully transparent */
        if (bg === "rgba(0,0,0,0)") return;
        var lum = 0;
        var m = bg.match(/rgb\((\d+),(\d+),(\d+)/);
        if (m) lum = (+m[1]+ +m[2]+ +m[3]) / 3;
        if (lum > 200) {
          el.style.setProperty("background", "#1a2820", "important");
          el.style.setProperty("color", "#e8f0ea", "important");
        }
      }
    } catch(e){}
  });
}

function forcePathFilter(){
  try {
    var g = localStorage.getItem("clarity_committed_path")
      || document.documentElement.getAttribute("data-clarity-path")
      || "seeker";
    if (typeof window.applyAdditiveFilter === "function") window.applyAdditiveFilter(g);
    else if (typeof window.applyGateSectionFilter === "function") window.applyGateSectionFilter(g);
  } catch(e){}
}

/* When track Seeker clicked — already via requestPath; reinforce after any badge update */
document.addEventListener("click", function(ev){
  var btn = ev.target && ev.target.closest && ev.target.closest("[data-gate], .cgs-btn");
  if (!btn) return;
  setTimeout(forcePathFilter, 120);
  setTimeout(forcePathFilter, 500);
  setTimeout(nightPolish, 200);
}, true);

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(nightPolish, 400); setTimeout(forcePathFilter, 500); });
else { setTimeout(nightPolish, 400); setTimeout(forcePathFilter, 500); }
window.addEventListener("load", function(){ setTimeout(nightPolish, 800); });

/* Theme toggle */
var obs = new MutationObserver(function(){
  if (document.documentElement.getAttribute("data-theme") === "dark") setTimeout(nightPolish, 50);
});
try { obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] }); } catch(e){}
})();