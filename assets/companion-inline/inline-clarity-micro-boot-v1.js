/**
 * Companion micro-boot bundle · v1
 * Merged early guards/boot only. Order preserved.
 */


;/* ---- inline-clarity-shell-mode-early.js ---- */
(function(){
  try {
    var m = localStorage.getItem("clarity_shell_mode_v1");
    if (m !== "landing" && m !== "companion") m = "landing";
    /* Mobile first paint: Day landing is default (companion only after explicit path) */
    try {
      var mobile = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
      var forceLand = sessionStorage.getItem("clarity_force_landing_once") === "1";
      var userPicked = sessionStorage.getItem("clarity_shell_user_pick_v1") === "1";
      if (mobile && !userPicked) m = "landing";
      if (forceLand) m = "landing";
    } catch (e2) {}
    document.documentElement.setAttribute("data-shell-mode", m);
    try { if (m === "landing") localStorage.setItem("clarity_shell_mode_v1", "landing"); } catch (e3) {}
  } catch (e) { document.documentElement.setAttribute("data-shell-mode", "landing"); }
})();


;/* ---- inline-clarity-path-boot-v1.js ---- */
(function(){try{var g=localStorage.getItem("clarity_committed_path")||localStorage.getItem("clarity_path_override")||"seeker";document.documentElement.setAttribute("data-clarity-path",g);}catch(e){}})();


;/* ---- inline-clarity_loader_guard_v1.js ---- */
(function(){
  "use strict";
  if (window.__CLARITY_LOADER_GUARD_V1__) return;
  window.__CLARITY_LOADER_GUARD_V1__ = true;

  /* Prevent double path-progress init if both defer + lazy fire */
  var _pp = window.clarityPathProgress;
  Object.defineProperty(window, "__clarityPathProgressOnce", {
    value: true,
    writable: false
  });

  /* After core ready, re-assert theme from user chips (stub may have run first) */
  document.addEventListener("clarity-core-ready", function(){
    try {
      var mode = localStorage.getItem("clarity_theme_mode") || localStorage.getItem("clarity_theme") || "system";
      if (typeof window.claritySetThemeMode === "function") window.claritySetThemeMode(mode);
    } catch(e){}
    try {
      if (typeof window.loadCommand === "function") window.loadCommand();
    } catch(e){}
  });

  /* Soft report failed lazy assets once */
  window.addEventListener("load", function(){
    setTimeout(function(){
      try {
        var f = typeof window.ClarityLoaderFailed === "function" ? window.ClarityLoaderFailed() : [];
        if (f && f.length) console.info("[Clarity] lazy failures:", f.join(", "));
      } catch(e){}
    }, 8000);
  });
})();


;/* ---- inline-clarity-scroll-unlock-v3.js ---- */
(function(){
  function unlock(){
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.documentElement.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("position", "static", "important");
      document.documentElement.style.touchAction = "pan-x pan-y pinch-zoom";
      document.body.style.touchAction = "pan-x pan-y pinch-zoom";
    } catch (e) {}
  }
  unlock();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unlock);
  window.addEventListener("load", unlock);
  setInterval(unlock, 12000);
})();


;/* ---- inline-clarity_mobile_unstick.js ---- */
(function(){
  "use strict";
  if (window.__CLARITY_MOBILE_UNSTICK__) return;
  window.__CLARITY_MOBILE_UNSTICK__ = true;
  function unstick(){
    if (window.matchMedia && !window.matchMedia("(max-width: 900px)").matches) return;
    document.querySelectorAll(".banner, #clarity-top-duo, .global-nav, nav.global-nav").forEach(function(el){
      try {
        el.style.setProperty("position", "relative", "important");
        el.style.setProperty("top", "auto", "important");
      } catch(e){}
    });
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("position", "static", "important");
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unstick);
  else unstick();
  window.addEventListener("load", unstick);
  window.addEventListener("resize", unstick);
})();


;/* ---- inline-clarity-polish-security-v1.js ---- */
(function(){
"use strict";
if (window.__CLARITY_POLISH_SECURITY_V1__) return;
window.__CLARITY_POLISH_SECURITY_V1__ = true;
window.claritySecurityAudit = function(){
  var r = {ok:true,ts:Date.now(),vault:{uftKey:window.UFT_KEY||"clarity_user_family_tree_v1",
    tree:!!document.getElementById("user-family-tree-card"),
    uftRead:typeof window.uftRead==="function"},
    path:{reset:typeof window.clarityPathResetToSeeker==="function",
      request:typeof window.clarityRequestPath==="function"},
    zoom:typeof window.clarityUftZoom==="object",
    storage:{suspicious:[]},notes:[]};
  try{
    if(r.vault.uftKey!=="clarity_user_family_tree_v1"){r.ok=false;r.notes.push("UFT_KEY");}
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i)||"";
      if(/passphrase|plaintext.?key|(^|_)password$/i.test(k)){r.storage.suspicious.push(k);r.ok=false;}
    }
  }catch(e){}
  window.__CLARITY_SECURITY_REPORT__=r;
  return r;
};
setTimeout(function(){try{claritySecurityAudit();}catch(e){}},1000);
})();


;/* ---- inline-clarity_final_boot_v1.js ---- */
(function(){
  "use strict";
  if (window.__CLARITY_FINAL_BOOT_V1__) return;
  window.__CLARITY_FINAL_BOOT_V1__ = true;
  function safe(fn){ try { if (typeof fn === "function") fn(); } catch(e){} }
  function boot(){
    safe(window.__notesLoadReal || window.notesLoad);
    safe(window.uftLoad);
    safe(window.claritySecurityAudit);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 500); });
  else setTimeout(boot, 500);
  window.addEventListener("load", function(){ setTimeout(boot, 1000); });
})();
