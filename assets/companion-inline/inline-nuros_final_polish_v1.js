(function(){
  "use strict";
  if (window.__NUROS_FINAL_POLISH_V1__) return;
  window.__NUROS_FINAL_POLISH_V1__ = true;

  function ensureDoorRailOn() {
    try {
      var rail = document.getElementById("clarity-door-rail");
      if (!rail) return;
      document.documentElement.classList.add("door-rail-on");
      rail.classList.remove("rail-hidden");
      // RRRA five-door rail (Reminder · Reality · Reflection · Action · Amana Vault)
      var need = ["reminder","reality","reflection","action","notes"];
      var labels = {
        reminder:"Reminder", reality:"Reality", reflection:"Reflection", action:"Action",
        notes:"Amana Vault",
        journey:"Reminder", commands:"Reminder", seerah:"Reality", grave:"Reflection",
        tafseer:"Reflection", tajweed:"Action", search:"Action", lectures:"Reality", about:"Reality"
      };
      var icons = {
        reminder:"✦", reality:"◉", reflection:"☾", action:"➤", notes:"🏦",
        journey:"✦", commands:"✦", seerah:"◉", grave:"☾",
        tafseer:"☾", tajweed:"➤", search:"➤", lectures:"◉", about:"◉"
      };
      var existing = {};
      rail.querySelectorAll("[data-rail-tab]").forEach(function(b){
        existing[b.getAttribute("data-rail-tab")] = b;
      });
      need.forEach(function(tab){
        if (existing[tab]) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "door-rail-btn";
        btn.setAttribute("data-rail-tab", tab);
        btn.setAttribute("onclick", "clarityOpenSectionDoor('" + tab + "')");
        btn.innerHTML = '<span class="dr-ico">' + icons[tab] + '</span><span class="dr-label">' + labels[tab] + '</span>';
        rail.appendChild(btn);
      });
      // remove unknown extras beyond the 10
      rail.querySelectorAll("[data-rail-tab]").forEach(function(b){
        var t = b.getAttribute("data-rail-tab");
        if (need.indexOf(t) < 0) b.remove();
      });
    } catch (e) {}
  }

  function scaleMemeViewport() {
    try {
      var stages = document.querySelectorAll(".meme-stage, #meme-stage");
      stages.forEach(function(st){
        st.style.maxWidth = "100%";
        st.style.maxHeight = "min(46vh, 380px)";
      });
      var wraps = document.querySelectorAll(".meme-stage-wrap, #meme-stage-wrap");
      wraps.forEach(function(w){
        w.style.maxWidth = "min(100%, 340px)";
        w.style.maxHeight = "min(46vh, 380px)";
        w.style.marginLeft = "auto";
        w.style.marginRight = "auto";
      });
    } catch (e) {}
  }

  function boot() {
    ensureDoorRailOn();
    scaleMemeViewport();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  window.addEventListener("load", function(){ setTimeout(boot, 250); });
  // re-apply when About / meme tab opens
  document.addEventListener("click", function(ev){
    var t = ev.target;
    if (!t) return;
    var tab = t.closest && t.closest("[data-rail-tab], [data-tab], .mb-tab, .nav-tab");
    if (tab) setTimeout(function(){ scaleMemeViewport(); ensureDoorRailOn(); }, 120);
  }, true);
})();