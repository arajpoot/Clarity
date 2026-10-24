(function(){
"use strict";
if (window.__CLARITY_RRRA5_LEGACY_CLEANUP_V1__) return;
window.__CLARITY_RRRA5_LEGACY_CLEANUP_V1__ = true;

var LEGACY = {
  journey:"reminder", commands:"reminder", tafseer:"reminder",
  grave:"reflection", seerah:"reality", tajweed:"action",
  lectures:"reality", search:"reminder", about:"reality",
  notes:"notes", reminder:"reminder", reality:"reality",
  reflection:"reflection", action:"action"
};

function mapTab(id){
  id = String(id || "").toLowerCase().replace(/^#/, "").replace(/^tab-/, "");
  return LEGACY[id] || (["reminder","reality","reflection","action","notes"].indexOf(id) >= 0 ? id : "reminder");
}

var _sw = window.switchTab;
if (typeof _sw === "function") {
  window.switchTab = function(tabId, opts){
    return _sw.call(this, mapTab(tabId), opts);
  };
}

/* Hash router: #seerah → reality, etc. */
function routeHash(){
  try {
    var h = (location.hash || "").replace(/^#/, "");
    if (!h) return;
    var t = mapTab(h);
    if (typeof switchTab === "function") switchTab(t, { fromRouter: true });
  } catch(e){}
}
window.addEventListener("hashchange", routeHash);
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(routeHash, 300); });
else setTimeout(routeHash, 300);

/* Hide empty legacy tab panels if any linger */
["journey","commands","tafseer","grave","seerah","tajweed","lectures","search","about"].forEach(function(id){
  var el = document.getElementById("tab-" + id);
  if (el && !el.querySelector(".card, [data-rrra], .rrra-hub-body")) {
    el.hidden = true;
    el.style.display = "none";
  }
});
})();