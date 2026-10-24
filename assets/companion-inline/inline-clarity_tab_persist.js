(function(){
  "use strict";
  if (window.__CLARITY_TAB_PERSIST__) return;
  window.__CLARITY_TAB_PERSIST__ = true;

  var KEY = "clarity_active_section_v1";
  var VALID = ["reminder","reality","reflection","action","notes","journey","commands","seerah","grave","tafseer","tajweed","search","lectures","about"];
  var restoring = false;

  function normalize(id){
    if (!id) return null;
    id = String(id).replace(/^#/, "").replace(/^tab-/, "").split("?")[0].split("/")[0].toLowerCase();
    if (id === "fiqh" || id === "vault" || id === "amana") id = "notes";
    if (id === "tools" || id === "all-tools" || id === "alltools" || id === "about") id = "reality";
    if (id === "guidance" || id === "search") id = "action";
    if (id === "journey" || id === "commands") id = "reminder";
    if (id === "seerah" || id === "lectures") id = "reality";
    if (id === "grave" || id === "tafseer") id = "reflection";
    if (id === "tajweed") id = "action";
    if (VALID.indexOf(id) < 0) return null;
    return id;
  }

  function remember(id){
    id = normalize(id);
    if (!id) return;
    try { sessionStorage.setItem(KEY, id); } catch(e){}
    try {
      var want = "#" + id;
      if ((location.hash || "") !== want) history.replaceState(null, "", want);
    } catch(e2){}
    try { document.body.setAttribute("data-active-tab", id); } catch(e3){}
  }

  function setActiveDom(id){
    id = normalize(id);
    if (!id) return;
    document.querySelectorAll(".tab-panel").forEach(function(p){
      var on = p.id === "tab-" + id;
      p.classList.toggle("active", on);
      if (on) {
        p.style.removeProperty("display");
        p.style.display = "block";
        p.removeAttribute("hidden");
        p.setAttribute("aria-hidden", "false");
      } else {
        p.style.display = "none";
        p.setAttribute("aria-hidden", "true");
      }
    });
    document.querySelectorAll(".door-rail-btn, [data-rail-tab]").forEach(function(b){
      var t = b.getAttribute("data-rail-tab") || "";
      b.classList.toggle("active", t === id);
    });
    document.querySelectorAll("[data-tab]").forEach(function(b){
      b.classList.toggle("active", (b.getAttribute("data-tab") || "") === id);
    });
  }

  function openSection(id){
    id = normalize(id);
    if (!id) return false;
    remember(id);
    setActiveDom(id);
    try {
      if (typeof clarityOpenSectionDoor === "function" && !restoring) {
        // call original without re-entry
        var o = window.clarityOpenSectionDoor;
        if (o && o.__persistWrapped) {
          // already wrapped — call underlying if stored
          if (o.__orig) o.__orig(id);
          else o(id);
        } else if (o) o(id);
      }
    } catch(e){}
    setActiveDom(id); // re-assert after other scripts
    return true;
  }

  function resolveTarget(){
    var fromHash = normalize((location.hash || "").replace(/^#/, ""));
    if (fromHash) return fromHash;
    try {
      var s = normalize(sessionStorage.getItem(KEY));
      if (s) return s;
    } catch(e){}
    return null; // do not force journey if app has its own default
  }

  function restore(){
    if (restoring) return;
    var id = resolveTarget();
    if (!id) return;
    restoring = true;
    try {
      setActiveDom(id);
      remember(id);
    } finally {
      setTimeout(function(){ restoring = false; }, 100);
    }
  }

  function wrapOpeners(){
    if (typeof window.clarityOpenSectionDoor === "function" && !window.clarityOpenSectionDoor.__persistWrapped) {
      var orig = window.clarityOpenSectionDoor;
      var wrapped = function(id){
        remember(id);
        var r = orig.apply(this, arguments);
        setActiveDom(normalize(id) || id);
        return r;
      };
      wrapped.__persistWrapped = true;
      wrapped.__orig = orig;
      window.clarityOpenSectionDoor = wrapped;
    }
  }

  window.addEventListener("hashchange", function(){
    var id = normalize((location.hash || "").replace(/^#/, ""));
    if (id) openSection(id);
  });

  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-tab], .door-rail-btn");
    if (!t) return;
    var id = normalize(t.getAttribute("data-rail-tab") || t.getAttribute("data-tab"));
    if (id) {
      remember(id);
      setTimeout(function(){ setActiveDom(id); }, 0);
      setTimeout(function(){ setActiveDom(id); }, 100);
    }
  }, true);

  function boot(){
    wrapOpeners();
    // Single restore — avoid multi-timeout flash war
    restore();
    setTimeout(wrapOpeners, 400);
    setTimeout(function(){
      var id = resolveTarget();
      if (id) setActiveDom(id);
    }, 600);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){
    wrapOpeners();
    var id = resolveTarget();
    if (id) setActiveDom(id);
  });
})();