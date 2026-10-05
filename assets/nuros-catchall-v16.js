(function(){
"use strict";
if (window.__NUROS_CATCHALL_V16__) return;
window.__NUROS_CATCHALL_V16__ = true;
var g = typeof globalThis !== "undefined" ? globalThis : window;
function _stub(){ return undefined; }
function _arr(){ return []; }
function _obj(){ return {}; }
function def(name, fn){
  try {
    if (typeof g[name] !== "function") g[name] = fn;
    if (typeof window[name] !== "function") window[name] = g[name];
  } catch(e){}
}
/* Early shims — real modules overwrite later */
if (typeof g.notesState === "undefined") {
  g.notesState = { notes: [], selectedId: null, query: "", tagFilter: "", viewMode: "edit", saveTimer: null };
  window.notesState = g.notesState;
}
def("notesLoad", function(){ try { if (typeof window.__notesLoadReal === "function") return window.__notesLoadReal(); } catch(e){} });
def("notesRender", function(){ try { if (typeof notesRenderList === "function") notesRenderList(); if (typeof notesRenderPreview === "function") notesRenderPreview(); } catch(e){} });
def("notesRenderList", _stub);
def("notesRenderPreview", _stub);
def("notesRenderTags", _stub);
def("notesPersist", _stub);
def("notesSaveNow", _stub);
def("notesCreate", _stub);
def("notesSelect", _stub);
def("notesSetQuery", _stub);
def("notesSetTagFilter", _stub);
def("notesCycleView", _stub);
def("notesSetView", _stub);
def("notesExport", _stub);
def("notesImport", _stub);
def("notesRestoreSeed", _stub);
def("notes", _stub);
def("memeLoadBg", function(url){ try { if (typeof memeSetBackground==="function") memeSetBackground(url); } catch(e){} });
def("memeRefresh", _stub);
def("memeRender", _stub);
def("memeSetBackground", function(url){ try { if (window.memeState) window.memeState.bg = url; if (typeof memeDraw==="function") memeDraw(); } catch(e){} });
def("uftRenderRegList", _arr);
def("uftLoad", function(){ try { if (typeof window.__uftLoadReal === "function") return window.__uftLoadReal(); if (typeof uftRender === "function") uftRender(); } catch(e){} });
def("clarityClearSearch", _stub);
def("clarityGoogleTranslate", _stub);
def("clarityMarkWelcomeSeen", _stub);
def("clarityMediaScan", _stub);
def("clarityMemeApplyStandard", _stub);
def("clarityMemeDecorBg", _stub);
def("clarityOpenDoor", _stub);
def("clarityAzanToggle", function(on){ try { localStorage.setItem("clarity_azan_alert", on?"on":"off"); var b=document.getElementById("azan-notify-toggle"); if(b) b.checked=!!on; } catch(e){} });
def("clarityAmanaPrintPack", function(d){ try { if (typeof clarityAmanaPrintPackSafe==="function") clarityAmanaPrintPackSafe(d||{}); } catch(e){} });
def("clarityOpenModuleSource", _stub);
def("clarityPrintLegacy", _stub);
def("clarityIsraeliyatDeepFetch", _stub);
def("clarityIsraeliyatExpandScholar", _stub);
def("tjRender", _stub);
def("calligRedraw", _stub);
def("renderBookmarks", _stub);
def("prevRabbana", _stub);
def("nextRabbana", _stub);
def("saveBookmarks", _stub);
def("addBookmark", _stub);
def("removeBookmark", _stub);
def("bookmarkCurrentVerse", _stub);
def("bookmarkCurrentLesson", _stub);
def("getBookmarks", function(){ return []; });
def("switchTab", function(tabId){
  try {
    var panels = document.querySelectorAll(".tab-panel, [id^='tab-']");
    panels.forEach(function(p){ p.classList.remove("active"); p.hidden = true; });
    var el = document.getElementById("tab-"+tabId) || document.getElementById(tabId);
    if (el) { el.hidden = false; el.classList.add("active"); }
    document.body.setAttribute("data-active-tab", tabId || "");
  } catch(e){}
});
if (typeof g.MEME_BG_POOLS === "undefined") g.MEME_BG_POOLS = {nature:[],flowers:[],holy:[],spirit:[],free:[]};
if (typeof g.UFT_KEY === "undefined") g.UFT_KEY = "clarity_user_family_tree_v1";
if (typeof g.VERSE_POOL === "undefined") g.VERSE_POOL = [];
if (typeof g.memeState === "undefined") g.memeState = {img:null,text:"",bg:null};
if (typeof g.memeBgIdx === "undefined") g.memeBgIdx = {};
window.MEME_BG_POOLS = g.MEME_BG_POOLS;
window.UFT_KEY = g.UFT_KEY;
window.VERSE_POOL = g.VERSE_POOL;
window.memeState = g.memeState;
window.memeBgIdx = g.memeBgIdx;
})();