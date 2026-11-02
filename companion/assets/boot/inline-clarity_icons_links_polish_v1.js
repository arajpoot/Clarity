(function(){
"use strict";
if (window.__CLARITY_ICONS_LINKS_POLISH_V1__) return;
window.__CLARITY_ICONS_LINKS_POLISH_V1__ = true;

function fixMemeButtons(){
  document.querySelectorAll("button, a, .chip, .mv-chip").forEach(function(el){
    var t = (el.textContent || "").trim();
    var oc = el.getAttribute("onclick") || "";
    if (/meme/i.test(oc) || /meme/i.test(el.className||"")) {
      if (!/🎨|🖼|🖼️/.test(el.innerHTML) && /^meme$/i.test(t)) {
        el.innerHTML = '<span class="mp-ico" aria-hidden="true">🎨</span> Meme';
      }
    }
  });
}

/** Broken hash / old tab links → RRRA5 */
var MAP = {
  journey:"reminder", commands:"reminder", tafseer:"reminder",
  grave:"reflection", seerah:"reality", tajweed:"action",
  lectures:"reality", search:"reminder", about:"reality"
};
function fixAnchors(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    var h = (a.getAttribute("href")||"").replace(/^#/,"").replace(/^tab-/,"");
    if (MAP[h]) a.setAttribute("href", "#" + MAP[h]);
  });
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ fixMemeButtons(); fixAnchors(); });
else { fixMemeButtons(); fixAnchors(); }
window.addEventListener("load", function(){ fixMemeButtons(); fixAnchors(); });
})();