(function(){
  "use strict";
  if (window.__CLARITY_QUICK_NAV__) return;
  window.__CLARITY_QUICK_NAV__ = true;

  var SECTIONS = [
    { id: "journey", label: "Journey" },
    { id: "commands", label: "Commands" },
    { id: "seerah", label: "Seerah" },
    { id: "grave", label: "Grave" },
    { id: "tafseer", label: "Tafsir" },
    { id: "tajweed", label: "Tajweed" },
    { id: "notes", label: "Fiqh" },
    { id: "search", label: "Search" },
    { id: "lectures", label: "Lectures" },
    { id: "about", label: "All tools" }
  ];
  var STORE_KEY = "clarity_content_pins_v1";
  var RECENT_KEY = "clarity_recent_sections_v1";

  function loadPins(){
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch(e){ return {}; }
  }
  function loadRecent(){
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch(e){ return []; }
  }
  function pushRecent(id){
    var r = loadRecent().filter(function(x){ return x !== id; });
    r.unshift(id);
    r = r.slice(0, 6);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(r)); } catch(e){}
  }

  function goSection(id){
    pushRecent(id);
    try {
      if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor(id);
      else if (typeof switchTab === "function") switchTab(id);
    } catch(e){}
    var panel = document.getElementById("tab-" + id);
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    render();
  }

  function allPinsFlat(){
    var map = loadPins();
    var out = [];
    Object.keys(map).forEach(function(sec){
      (map[sec] || []).forEach(function(p){
        out.push({ section: sec, id: p.id, title: p.title || p.id });
      });
    });
    out.sort(function(a,b){ return (b.ts||0) - (a.ts||0); });
    return out.slice(0, 12);
  }

  function ensureDock(){
    if (document.getElementById("clarity-quick-nav")) return;
    var dock = document.createElement("div");
    dock.id = "clarity-quick-nav";
    dock.innerHTML =
      '<button type="button" id="clarity-qn-toggle" aria-expanded="false">↩ Quick access</button>' +
      '<div id="clarity-qn-panel" role="dialog" aria-label="Quick access"></div>';
    document.body.appendChild(dock);
    document.getElementById("clarity-qn-toggle").onclick = function(){
      var open = dock.classList.toggle("open");
      this.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) render();
    };
  }

  function render(){
    ensureDock();
    var panel = document.getElementById("clarity-qn-panel");
    if (!panel) return;
    var recent = loadRecent();
    var pins = allPinsFlat();
    var html = "";
    html += "<h4>Recent sections</h4>";
    if (!recent.length) html += '<p class="qn-empty">Open a section from the rail — it will appear here.</p>';
    else {
      html += '<ul class="qn-list">';
      recent.forEach(function(id){
        var lab = (SECTIONS.find(function(s){ return s.id === id; }) || {}).label || id;
        html += '<li><a href="#tab-'+id+'" onclick="window.__qnGo && __qnGo(\''+id+'\');return false;">'+lab+"</a></li>";
      });
      html += "</ul>";
    }
    html += "<h4>Pinned cards (this device)</h4>";
    if (!pins.length) html += '<p class="qn-empty">Tap 📌 on any card to pin it for quick return.</p>';
    else {
      html += '<ul class="qn-list">';
      pins.forEach(function(p){
        var t = String(p.title || p.id).replace(/</g,"").slice(0,40);
        html += '<li><a class="qn-pin" href="#'+p.id+'" onclick="window.__qnGoPin && __qnGoPin(\''+p.section+'\',\''+p.id+'\');return false;">📌 '+t+"</a></li>";
      });
      html += "</ul>";
    }
    html += "<h4>Jump</h4><ul class=\"qn-list\">";
    SECTIONS.forEach(function(s){
      html += '<li><a href="#tab-'+s.id+'" onclick="window.__qnGo && __qnGo(\''+s.id+'\');return false;">'+s.label+"</a></li>";
    });
    html += "</ul>";
    html += '<div class="qn-row"><button type="button" class="qn-btn" onclick="window.scrollTo({top:0,behavior:\'smooth\'})">↑ Top</button>';
    html += '<button type="button" class="qn-btn" onclick="document.getElementById(\'clarity-top-duo\')&&document.getElementById(\'clarity-top-duo\').scrollIntoView({behavior:\'smooth\'})">Banner</button></div>';
    panel.innerHTML = html;
  }

  window.__qnGo = goSection;
  window.__qnGoPin = function(sec, id){
    goSection(sec);
    setTimeout(function(){
      var el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  // Track section opens via rail clicks
  document.addEventListener("click", function(ev){
    var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-tab],.door-rail-btn");
    if (!t) return;
    var id = t.getAttribute("data-rail-tab") || t.getAttribute("data-tab");
    if (!id && t.getAttribute("onclick")) {
      var m = String(t.getAttribute("onclick")).match(/['\"]([a-z]+)['\"]/);
      if (m) id = m[1];
    }
    if (id) pushRecent(id);
  }, true);

  function boot(){ ensureDock(); render(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 200); });
})();