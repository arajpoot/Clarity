(function(){
  "use strict";
  if (window.__CLARITY_DOORS_FLOW_V1__) return;
  window.__CLARITY_DOORS_FLOW_V1__ = true;

  var ORDER = ["seeker","new_muslim","practicing","dai"];

  function pathNow(){
    try {
      return document.documentElement.getAttribute("data-clarity-path")
        || localStorage.getItem("clarity_committed_path")
        || "seeker";
    } catch(e){ return "seeker"; }
  }

  function showEl(el){
    if (!el) return;
    el.classList.remove("gate-hidden");
    el.removeAttribute("data-gate-hidden");
    el.hidden = false;
    try {
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.style.removeProperty("height");
      el.style.removeProperty("max-height");
      el.style.removeProperty("opacity");
      el.style.removeProperty("pointer-events");
      el.style.removeProperty("overflow");
    } catch(e){}
  }

  function openAllSections(){
    document.querySelectorAll(".card, [id$='-card']").forEach(showEl);
    /* kill path-lock CSS that hides modules */
    var lock = document.getElementById("clarity-path-lock");
    if (lock) lock.textContent = "/* dai: all open */";
    document.body.setAttribute("data-meme-studio-open", "1");
    try { if (typeof window.clarityMemeUiSync === "function") window.clarityMemeUiSync(); } catch(e){}
  }

  function unlockPathUi(){
    document.querySelectorAll(".cgs-btn.path-locked").forEach(function(btn){
      btn.classList.remove("path-locked");
    });
  }

  function onPath(gate){
    gate = gate || pathNow();
    try {
      document.documentElement.setAttribute("data-clarity-path", gate);
      document.body.setAttribute("data-clarity-path", gate);
    } catch(e){}
    if (gate === "dai") {
      openAllSections();
      unlockPathUi();
    }
  }

  /* Smooth door open — ensure panel + rail stay in sync */
  var prevDoor = window.clarityOpenSectionDoor;
  if (typeof prevDoor === "function" && !prevDoor.__flowV1) {
    window.clarityOpenSectionDoor = function(tabId){
      tabId = String(tabId || "journey");
      /* If on dai, make sure nothing is gate-hidden before switch */
      if (pathNow() === "dai") openAllSections();
      var r;
      try { r = prevDoor.apply(this, arguments); } catch(e){ console.warn(e); }
      try {
        document.querySelectorAll(".tab-panel").forEach(function(p){
          var on = p.id === ("tab-" + tabId);
          p.classList.toggle("active", on);
          if (on) {
            p.hidden = false;
            p.style.removeProperty("display");
          }
        });
        document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function(btn){
          btn.classList.toggle("active", btn.getAttribute("data-rail-tab") === tabId);
        });
        document.body.setAttribute("data-active-tab", tabId);
      } catch(e2){}
      return r;
    };
    window.clarityOpenSectionDoor.__flowV1 = true;
  }

  /* Hook path changes */
  function wrapPath(name){
    var fn = window[name];
    if (typeof fn !== "function" || fn.__doorsFlow) return;
    window[name] = function(g){
      var r = fn.apply(this, arguments);
      setTimeout(function(){ onPath(g || pathNow()); }, 30);
      setTimeout(function(){ onPath(g || pathNow()); }, 250);
      setTimeout(function(){ onPath(g || pathNow()); }, 700);
      return r;
    };
    window[name].__doorsFlow = true;
  }
  ["clarityRequestPath","applyAdditiveFilter","applyGateSectionFilter","claritySwitchGate"].forEach(wrapPath);

  /* Force max unlock so dai is reachable without stuck quiz gate (user asked highest phase open) */
  try {
    if (localStorage.getItem("clarity_path_max") != null) {
      /* leave progress, but if already dai committed, open all */
    }
  } catch(e){}

  function boot(){
    onPath(pathNow());
    if (pathNow() === "dai") openAllSections();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 300); });
  else setTimeout(boot, 300);
  window.addEventListener("load", function(){ setTimeout(boot, 600); setTimeout(boot, 1500); });

  /* Interval heal: if path is dai but cards still hidden, reopen */
  setInterval(function(){
    if (pathNow() !== "dai") return;
    var hidden = document.querySelectorAll(".card.gate-hidden, [id$='-card'][data-gate-hidden='1']");
    if (hidden.length) openAllSections();
  }, 2000);

  window.clarityDoorsFlow = { openAll: openAllSections, onPath: onPath };
})();
