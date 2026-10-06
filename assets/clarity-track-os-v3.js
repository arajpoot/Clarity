try{window.__CLARITY_BOOT_TS=window.__CLARITY_BOOT_TS||Date.now();}catch(e){}
/* __TRACK_SCROLL_GUARD__ */
/*! Clarity Track OS v3 — one active track expanded; others collapse to switch bar;
    routines wire to in-app sections + authentic external sources. Educational only. */
(function(){
  "use strict";

  var TRACK_ORDER = ["seeker","new_muslim","practicing","dai"];

  /* Enrich modules with routine actions + authentic sources (does not remove existing fields) */
  var ROUTINE_ENRICH = {
    seeker: {
      s1: { action:"Read a short piece on Tawhid, then note one purpose of your creation.", section:"journey", source:"https://quran.com/51/56", sourceLabel:"Qur’an 51:56" },
      s2: { action:"Open Seerah and capture one proof of prophethood in Notes.", section:"seerah", source:"https://sunnah.com/bukhari:7", sourceLabel:"Bukhari on revelation" },
      s3: { action:"Skim how the Qur’an was compiled; verify a verse on Quran.com.", section:"tafseer", source:"https://quran.com", sourceLabel:"Quran.com" },
      s4: { action:"Spend 10 minutes with the Grave tab — one istighfar with presence.", section:"grave", source:"https://sunnah.com/tirmidhi:2307", sourceLabel:"Remember death" },
      s5: { action:"Use Guidance search for one common doubt; answer with adab.", section:"search", source:"https://islamqa.info", sourceLabel:"IslamQA (edu)" }
    },
    new_muslim: {
      n1: { action:"Write the Shahada meaning in your own words in Notes.", section:"journey", source:"https://quran.com/3/18", sourceLabel:"Qur’an 3:18" },
      n2: { action:"Practice wudu steps, then open Commands for prayer outline.", section:"commands", source:"https://www.islamicity.org/covers/how-to-pray/", sourceLabel:"Prayer outline" },
      n3: { action:"List how each pillar appears in your week (even imperfectly).", section:"commands", source:"https://sunnah.com/bukhari:8", sourceLabel:"Five pillars hadith" },
      n4: { action:"One kindness to family today; open Seerah for character models.", section:"seerah", source:"https://sunnah.com/bukhari:5971", sourceLabel:"Kindness to parents" },
      n5: { action:"10× istighfar + 10× salawat; visit Grave tab for context.", section:"grave", source:"https://sunnah.com/muslim:486", sourceLabel:"Salawat" }
    },
    practicing: {
      p1: { action:"Mark today’s deed on the Today surface; keep the streak honest.", section:"journey", source:"https://sunnah.com/bukhari:6464", sourceLabel:"Consistent deeds" },
      p2: { action:"Recite a short surah with tajweed awareness in Tajweed tab.", section:"tajweed", source:"https://quran.com/1", sourceLabel:"Al-Fatiha" },
      p3: { action:"Weekly light review: open Journey stats; forgive one shortfall.", section:"journey", source:"https://quran.com/103", sourceLabel:"Surah Al-Asr" },
      p4: { action:"Open Fiqh tools — sketch debts / wasiyyah notes (not a fatwa).", section:"notes", source:"https://quran.com/4/11", sourceLabel:"Inheritance verses" },
      p5: { action:"Share one authentic reminder (Meme Studio or copy light).", section:"about", source:"https://sunnah.com", sourceLabel:"Sunnah.com" }
    },
    dai: {
      d1: { action:"Read one Seerah moment on sincerity before inviting others.", section:"seerah", source:"https://sunnah.com/nawawi:1", sourceLabel:"Actions by intention" },
      d2: { action:"Open Guidance; practice citing Qur’an.com / Sunnah.com only.", section:"search", source:"https://sunnah.com", sourceLabel:"Hadith grades" },
      d3: { action:"Answer one misconception calmly — note sources, avoid anger.", section:"search", source:"https://yaqeeninstitute.org", sourceLabel:"Yaqeen (edu)" },
      d4: { action:"Prepare a 3-minute micro-lesson; check Lectures for structure.", section:"lectures", source:"https://quran.com", sourceLabel:"Qur’an first" },
      d5: { action:"Identify local masjid contact; write one community kindness.", section:"about", source:"https://islamqa.info", sourceLabel:"Community fiqh (edu)" }
    }
  };

  function enrichPaths(){
    if (typeof CLARITY_PATHS === "undefined") return;
    TRACK_ORDER.forEach(function(key){
      var path = CLARITY_PATHS[key];
      if (!path || !path.modules) return;
      var pack = ROUTINE_ENRICH[key] || {};
      path.modules.forEach(function(m){
        var e = pack[m.id];
        if (!e) return;
        if (!m.action) m.action = e.action;
        if (!m.section) m.section = e.section || m.tab;
        if (!m.source) m.source = e.source;
        if (!m.sourceLabel) m.sourceLabel = e.sourceLabel;
      });
    });
  }

  function esc(s){
    return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function activeTrack(){
    try {
      if (typeof clarityActiveTrack === "function") return clarityActiveTrack();
    } catch(e){}
    try {
      var o = localStorage.getItem("clarity_path_override") || localStorage.getItem("clarity_committed_path") || "";
      if (o && CLARITY_PATHS[o]) return o;
    } catch(e2){}
    return "seeker";
  }

  function progOf(track){
    try {
      if (typeof clarityGetPathProgress === "function") return clarityGetPathProgress(track);
    } catch(e){}
    try {
      return JSON.parse(localStorage.getItem("clarity_path_prog_"+track) || '{"done":[],"minutes":0}');
    } catch(e2){ return {done:[],minutes:0}; }
  }

  function nextModule(path, doneMap){
    for (var i=0;i<path.modules.length;i++){
      if (!doneMap[path.modules[i].id]) return path.modules[i];
    }
    return null;
  }

  function remainingMins(path, doneMap){
    var n=0;
    path.modules.forEach(function(m){ if(!doneMap[m.id]) n += (m.mins||5); });
    return n;
  }

  window.clarityStudyModule = function(track, modId){
    var path = CLARITY_PATHS[track];
    if (!path) return;
    var mod = null;
    for (var i=0;i<path.modules.length;i++) if (path.modules[i].id===modId) mod = path.modules[i];
    if (!mod) return;
    var section = mod.section || mod.tab || "journey";
    try {
      if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor(section);
      else if (typeof switchTab === "function") switchTab(section);
    } catch(e){}
    try {
      if (typeof notesOpenDeedNote === "function" && mod.action) {
        notesOpenDeedNote({
          title: path.label + " · " + mod.title,
          tag: "Practice",
          pathLine: path.label,
          deed: mod.action,
          grave: section === "grave"
        });
      }
    } catch(e2){}
    /* Soft scroll after tab switch */
    setTimeout(function(){
      var panel = document.getElementById("tab-"+section) || document.getElementById("main-content");
      if (panel && panel.scrollIntoView) try { Date.now()<(window.__CLARITY_BOOT_TS||0)+1800?0:panel.scrollIntoView({behavior:"smooth",block:"start"}); } catch(e3){}
    }, 220);
  };

  window.clarityOpenModuleSource = function(url){
    if (!url) return;
    try { window.open(url, "_blank", "noopener,noreferrer"); } catch(e){}
  };

  function renderActiveCard(track){
    var path = CLARITY_PATHS[track];
    if (!path) return "";
    var prog = progOf(track);
    var doneMap = {};
    (prog.done||[]).forEach(function(id){ doneMap[id]=true; });
    var total = path.modules.length;
    var doneN = path.modules.filter(function(m){ return doneMap[m.id]; }).length;
    var pct = total ? Math.round(100*doneN/total) : 0;
    var next = nextModule(path, doneMap);
    var rem = remainingMins(path, doneMap);

    var html = '<div class="path-card path-card-active is-active" data-track="'+esc(track)+'">';
    html += '<div class="pca-head"><div>';
    html += '<h3>'+esc(path.label)+'</h3>';
    html += '<div class="path-meta">'+esc(path.blurb)+'</div></div>';
    html += '<span class="pca-badge">● Active track</span></div>';

    html += '<div class="path-prog"><div class="fill" style="width:'+pct+'%"></div></div>';
    html += '<div class="path-routine-stats">';
    html += '<span class="prs"><strong>'+doneN+'/'+total+'</strong> modules</span>';
    html += '<span class="prs"><strong>~'+rem+'</strong> min left</span>';
    html += '<span class="prs"><strong>'+(prog.minutes||0)+'</strong> min logged</span>';
    html += '</div>';

    if (next) {
      html += '<div class="path-next-routine">';
      html += '<div class="pnr-kicker">Next up · ~'+(next.mins||5)+' min</div>';
      html += '<div class="pnr-title">'+esc(next.title)+'</div>';
      if (next.action) html += '<div class="mod-action">'+esc(next.action)+'</div>';
      html += '<div class="pnr-btns">';
      html += '<button type="button" class="btn" onclick="clarityStudyModule(\''+track+'\',\''+next.id+'\')">Study this →</button>';
      if (next.source) html += '<button type="button" class="btn-soft" onclick="clarityOpenModuleSource(\''+esc(next.source)+'\')">Verify · '+esc(next.sourceLabel||'Source')+'</button>';
      html += '<button type="button" class="btn-soft" onclick="clarityToggleModule(\''+track+'\',\''+next.id+'\')">Mark done</button>';
      html += '</div></div>';
    } else {
      html += '<div class="path-next-routine"><div class="pnr-kicker">Track complete</div>';
      html += '<div class="pnr-title">Barakallahu feek — all modules checked on this device.</div>';
      html += '<div class="pnr-btns"><button type="button" class="btn-soft" onclick="document.getElementById(\'path-switch-select\')&&document.getElementById(\'path-switch-select\').focus()">Explore another track</button></div></div>';
    }

    html += '<ul class="path-mods path-mods-active">';
    path.modules.forEach(function(m){
      var locked = m.prereq && !doneMap[m.prereq];
      var isDone = !!doneMap[m.id];
      var isNext = next && next.id === m.id;
      var cls = (isDone?'done':'')+(locked?' locked':'')+(isNext?' next-up':'');
      html += '<li class="'+cls.trim()+'">';
      html += '<input type="checkbox" class="mod-check" '+(isDone?'checked':'')+' '+(locked?'disabled':'');
      html += ' onclick="event.stopPropagation();clarityToggleModule(\''+track+'\',\''+m.id+'\')" aria-label="Toggle '+esc(m.title)+'" />';
      html += '<div class="mod-body">';
      html += '<div class="mod-title">'+(locked?'🔒 ':'')+esc(m.title)+'</div>';
      if (m.action) html += '<div class="mod-action">'+esc(m.action)+'</div>';
      html += '<div class="mod-links">';
      if (!locked) {
        html += '<button type="button" onclick="clarityStudyModule(\''+track+'\',\''+m.id+'\')">Open section</button>';
        if (m.source) html += '<a href="'+esc(m.source)+'" target="_blank" rel="noopener noreferrer">'+esc(m.sourceLabel||'Source')+'</a>';
      } else {
        html += '<span class="mod-time">Complete previous step first</span>';
      }
      html += '</div></div>';
      html += '<span class="mod-time">~'+(m.mins||5)+' min</span>';
      html += '</li>';
    });
    html += '</ul>';
    html += '<p style="font-size:.78rem;margin-top:.75rem;color:var(--text-muted);line-height:1.4">Educational routine only — verify primary texts on <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> / <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a>. Not a fatwa.</p>';
    html += '</div>';
    return html;
  }

  function renderSwitchBar(active){
    var html = '<div class="path-switch-bar" role="group" aria-label="Switch learning track">';
    html += '<span class="psb-label">Tracks</span>';
    html += '<select class="path-switch-select" id="path-switch-select" aria-label="Switch track" onchange="claritySwitchTrack(this.value)">';
    TRACK_ORDER.forEach(function(key){
      var path = CLARITY_PATHS[key];
      if (!path) return;
      var prog = progOf(key);
      var doneN = (prog.done||[]).length;
      var total = path.modules.length;
      var sel = key===active ? ' selected' : '';
      html += '<option value="'+esc(key)+'"'+sel+'>'+esc(path.label)+' · '+doneN+'/'+total+'</option>';
    });
    html += '</select>';
    html += '<span class="psb-hint">Other tracks stay one tap away — focus stays on the active routine.</span>';
    html += '</div>';
    return html;
  }

  function renderTrackOS(forceTrack){
    enrichPaths();
    var board = document.getElementById("path-board");
    if (!board || typeof CLARITY_PATHS === "undefined") return;
    var track = forceTrack || activeTrack();
    if (!CLARITY_PATHS[track]) track = "seeker";

    board.classList.add("path-board-managed");
    var html = renderSwitchBar(track) + renderActiveCard(track);
    board.innerHTML = html;
    board.hidden = false;

    /* Dashboard pill */
    try {
      var label = document.getElementById("cd-track-label");
      if (label) label.textContent = CLARITY_PATHS[track].label;
    } catch(e){}
  }

  /* Override render + switch to keep collapse behavior */
  var _prevRender = window.clarityRenderPaths;
  window.clarityRenderPaths = function(forceTrack){
    try { renderTrackOS(forceTrack); }
    catch(e){
      console.warn("Track OS render fallback", e);
      if (typeof _prevRender === "function") try { _prevRender(forceTrack); } catch(e2){}
    }
  };

  var _prevSwitch = window.claritySwitchTrack;
  window.claritySwitchTrack = function(key){
    if (!key || !CLARITY_PATHS[key]) return;
    /* Track keys align with path gates: seeker | new_muslim | practicing | dai */
    try { localStorage.setItem("clarity_path_override", key); } catch(e){}
    try { localStorage.setItem("clarity_committed_path", key); } catch(e2){}
    try { localStorage.setItem("clarity_active_gate", key); } catch(e3){}
    /* Prefer progressive path API so quiz/unlock rules stay consistent */
    try {
      if (typeof window.clarityRequestPath === "function") window.clarityRequestPath(key);
      else if (typeof applyGateConfiguration === "function") applyGateConfiguration(key);
    } catch(e4){}
    if (typeof _prevSwitch === "function" && _prevSwitch !== window.claritySwitchTrack) {
      try { _prevSwitch(key); } catch(e5){}
    }
    renderTrackOS(key);
    if (typeof clarityRefreshDashboard === "function") try { clarityRefreshDashboard(); } catch(e6){}
    if (typeof clarityDailyLesson === "function") try { clarityDailyLesson(false); } catch(e7){}
  };

  /* After module toggle, re-render OS layout */
  var _prevToggle = window.clarityToggleModule;
  window.clarityToggleModule = function(track, modId){
    if (typeof _prevToggle === "function") {
      try { _prevToggle(track, modId); } catch(e){}
    }
    renderTrackOS(track);
  };

  function boot(){
    enrichPaths();
    var board = document.getElementById("path-board");
    if (board && !board.hidden) renderTrackOS();
    else {
      /* Still prepare if learn OS visible */
      var los = document.getElementById("clarity-learn-os");
      if (los && !los.classList.contains("hidden")) {
        try { renderTrackOS(); } catch(e){}
      }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 90); });
  else setTimeout(boot, 90);
  window.addEventListener("load", function(){ setTimeout(boot, 180); });
})();