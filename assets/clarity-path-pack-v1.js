/** Clarity Path Pack v1 — merged lean pack */


/* ---- curriculum/pathway-hydrator-v1.js ---- */
!function(e){"use strict";if(!e.__CLARITY_PATHWAY_HYDRATOR_V1__){e.__CLARITY_PATHWAY_HYDRATOR_V1__=!0;var t=["seeker","new-muslim","daily","dai"],a={seeker:0,"new-muslim":1,daily:2,dai:3},n="clarity_pathway_flags",r=Object.create(null),i=Object.create(null),s="./assets/curriculum/",c="20261009CAMPUS5",l={shared:{id:"shared",label:"Always-on shell",minI:0,always:!0,scripts:[],features:["vault","notes","about","family-tree-shell"]},seeker:{id:"seeker",label:"Seeker",minI:0,scripts:[],features:["grave-path","soul-compass","commands","seerah-live","ilm-pathway"]},"new-muslim":{id:"new-muslim",label:"New Muslim",minI:1,scripts:[],features:["salah-starter","fiqh-quiz","hajj-guide","tibbe-nabwi","foundations"]},daily:{id:"daily",label:"Daily Muslim",minI:2,scripts:[],features:["tajweed","tafseer","meme","deed-ledger","weekly-review","callig-lab"]},dai:{id:"dai",label:"Da'i",minI:3,scripts:[],features:["transmit","israeliyat","sealed-nectar","voice-translator","tajalliyat"]}};e.ClarityPathway={version:c,phases:t.slice(),hydrate:f,hydrateUpTo:p,setFlag:function(t,a){var r=u();if(void 0===r[t])return!1;r[t]=!!a;try{e.localStorage.setItem(n,JSON.stringify(r))}catch(e){}return o("flag",t,a),a?f(t):e.dispatchEvent(new CustomEvent("clarity-pathway-flag",{detail:{phase:t,on:!1}})),!0},getFlags:u,report:function(){var e=u(),n=Object.keys(r);return console.table(t.map(function(t){return{phase:t,index:a[t],flag:e[t],label:(l[t]||{}).label}})),console.log("Loaded scripts:",n),console.log("Current path-i:",h()),{flags:e,loaded:n,pathI:h()}},loadScript:d,manifests:l},"loading"===document.readyState?document.addEventListener("DOMContentLoaded",y):setTimeout(y,0)}function o(){if(e.localStorage&&"1"===e.localStorage.getItem("clarity_perf"))try{console.log.apply(console,["[PathwayHydrator]"].concat([].slice.call(arguments)))}catch(e){}}function u(){var a={seeker:!0,"new-muslim":!0,daily:!0,dai:!0,shared:!0};try{var r=e.localStorage.getItem(n);if(r){var i=JSON.parse(r);Object.keys(i).forEach(function(e){e in a&&(a[e]=!!i[e])})}}catch(e){}try{var s=new URLSearchParams(e.location.search),c=s.get("pathway-off");c&&void 0!==a[c]&&(a[c]=!1),"1"===s.get("hydrate")&&t.forEach(function(e){a[e]=!0})}catch(e){}return a}function d(e){return new Promise(function(t,a){return r[e]?t(e):(i[e]||(i[e]=new Promise(function(t,a){var n=document.createElement("script");n.src=e+(e.indexOf("?")>=0?"&":"?")+"v="+c,n.async=!0,n.defer=!0,n.onload=function(){r[e]=!0,delete i[e],o("loaded",e),t(e)},n.onerror=function(){delete i[e],o("fail",e),a(new Error("Failed "+e))},(document.head||document.documentElement).appendChild(n)})),i[e].then(t,a))})}function f(t){return u()[t]||"shared"===t?function(e){return fetch(s+e+"/manifest.json?v="+c,{cache:"force-cache"}).then(function(e){return e.ok?e.json():null}).catch(function(){return null}).then(function(t){return t||l[e]||{id:e,scripts:[],features:[]}})}(t).then(function(a){var n=(a.scripts||[]).map(function(e){return/^https?:\/\//.test(e)||0===e.indexOf("./")||0===e.indexOf("/")?e:s+t+"/"+e});return n.length?Promise.all(n.map(function(e){return d(e).catch(function(e){return null})})).then(function(n){return e.dispatchEvent(new CustomEvent("clarity-pathway-hydrated",{detail:{phase:t,scripts:n.filter(Boolean),features:a.features||[]}})),{phase:t,scripts:n}}):(o("no scripts for",t),e.dispatchEvent(new CustomEvent("clarity-pathway-hydrated",{detail:{phase:t,scripts:[],features:a.features||[]}})),{phase:t,scripts:[]})}):(o("skip (flag off)",t),Promise.resolve({phase:t,skipped:!0}))}function h(){try{var e=parseInt(document.documentElement.getAttribute("data-path-i")||"0",10);return isNaN(e)?0:e}catch(e){return 0}}function p(e){var n=u(),r=[f("shared")];return t.forEach(function(t){a[t]<=e&&n[t]&&r.push(f(t))}),Promise.all(r)}function m(e){var t=e&&e.detail&&e.detail.gate||null,n=h();t&&void 0!==a[t]&&(n=a[t]),"new_muslim"===t&&(n=1),"practicing"===t&&(n=2),o("path-changed → hydrate up to",n),p(n)}function y(){var t=h();p(t).then(function(){o("boot complete, path-i=",t)}),e.addEventListener("clarity-path-changed",m);try{new MutationObserver(function(e){e.forEach(function(e){"data-path-i"===e.attributeName&&m()})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-path-i"]})}catch(e){}}}("undefined"!=typeof window?window:this);


/* ---- curriculum/shared/modules/curriculum-tools-bridge-v1.js ---- */
/**
 * Curriculum Tools Bridge v1 — wires Notes, Calligraphy, Tajweed into pathway use
 * Shared shell: notes always available (lazy). Daily: tajweed LMR + callig practice cues.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_CURRICULUM_TOOLS_V1__) return;
  w.__CLARITY_CURRICULUM_TOOLS_V1__ = true;
  var VER = "20261009CAMPUS5";

  function inject(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src*="' + src.replace(/^\.\//, "") + '"]')) {
        resolve("already");
        return;
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
      s.defer = true;
      s.onload = function () { resolve("loaded"); };
      s.onerror = function () { reject(new Error("fail " + src)); };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  function pathI() {
    try {
      var n = parseInt(document.documentElement.getAttribute("data-path-i") || "0", 10);
      return isNaN(n) ? 0 : n;
    } catch (e) { return 0; }
  }

  var notesLoaded = false, tjLoaded = false;

  function ensureNotes() {
    if (notesLoaded || w.__CLARITY_NOTES_RECOVERY_V1__) {
      notesLoaded = true;
      return Promise.resolve("ready");
    }
    return inject("./assets/clarity-notes-recovery-v1.js").then(function () {
      notesLoaded = true;
      try { w.dispatchEvent(new CustomEvent("clarity-tool-ready", { detail: { tool: "notes" } })); } catch (e) {}
      return "loaded";
    }).catch(function () { return "fail"; });
  }

  function ensureTajweed() {
    if (pathI() < 2) return Promise.resolve("gated");
    if (tjLoaded || w.__CLARITY_TJ_LMR__) {
      tjLoaded = true;
      return Promise.resolve("ready");
    }
    return inject("./assets/nx-tj-lmr-js-v1.js").then(function () {
      tjLoaded = true;
      try { w.dispatchEvent(new CustomEvent("clarity-tool-ready", { detail: { tool: "tajweed" } })); } catch (e) {}
      return "loaded";
    }).catch(function () { return "fail"; });
  }

  function bindNotesOpen() {
    // Load notes script when user opens notes shell or clicks notes nav
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t) return;
      var el = t.closest && t.closest("#notes-shell, [data-open-notes], [href*='notes'], button[aria-controls*='notes']");
      if (el || (t.id && /notes/i.test(t.id))) ensureNotes();
    }, true);
    // Intersection: notes-shell enters viewport
    try {
      var ns = document.getElementById("notes-shell");
      if (ns && "IntersectionObserver" in w) {
        var io = new IntersectionObserver(function (ents) {
          ents.forEach(function (e) { if (e.isIntersecting) { ensureNotes(); io.disconnect(); } });
        }, { rootMargin: "80px" });
        io.observe(ns);
      }
    } catch (e) {}
  }

  function bindTajweedCards() {
    var ids = ["tajweed-path-card", "tj-lmr-score-card", "tj-deep-studio", "tajweed-live-card"];
    try {
      if (!("IntersectionObserver" in w)) return;
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (e) {
          if (e.isIntersecting && pathI() >= 2) {
            ensureTajweed();
            io.disconnect();
          }
        });
      }, { rootMargin: "100px" });
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    } catch (e) {}
    document.addEventListener("clarity-path-changed", function () {
      if (pathI() >= 2) ensureTajweed();
    });
  }

  function calligCue() {
    // Soft utilization tip when callig card is visible on Daily+
    if (pathI() < 2) return;
    var card = document.getElementById("callig-lab-card");
    if (!card || card.querySelector(".clarity-tool-cue")) return;
    try {
      var cue = document.createElement("p");
      cue.className = "clarity-tool-cue";
      cue.style.cssText = "margin:.5rem 0 0;font-size:.85rem;opacity:.9;line-height:1.4";
      cue.textContent = "Practice path: one letter today · EN→AR · mark Practiced. Pair with Tajweed makhārij.";
      var tools = card.querySelector(".callig-canvas-tools, .callig-topbar, h2, h3");
      if (tools && tools.parentNode) tools.parentNode.insertBefore(cue, tools.nextSibling);
      else card.appendChild(cue);
    } catch (e) {}
  }

  function notesCue() {
    var card = document.getElementById("notes-shell");
    if (!card || card.querySelector(".clarity-tool-cue")) return;
    try {
      var cue = document.createElement("p");
      cue.className = "clarity-tool-cue";
      cue.style.cssText = "margin:.4rem 0;font-size:.85rem;opacity:.9";
      cue.textContent = "On-device only · use for lesson notes, wasiyyah drafts, and reflections. Export often.";
      var h = card.querySelector("h2, h3, .card-title");
      if (h && h.parentNode) h.parentNode.insertBefore(cue, h.nextSibling);
      else card.insertBefore(cue, card.firstChild);
    } catch (e) {}
  }

  function boot() {
    bindNotesOpen();
    bindTajweedCards();
    setTimeout(notesCue, 900);
    setTimeout(calligCue, 1200);
    w.addEventListener("clarity-path-changed", function () {
      setTimeout(calligCue, 400);
      if (pathI() >= 2) ensureTajweed();
    });
    // Shared path always may preload notes on idle
    if ("requestIdleCallback" in w) {
      requestIdleCallback(function () { if (pathI() >= 0) ensureNotes(); }, { timeout: 8000 });
    } else {
      setTimeout(function () { ensureNotes(); }, 6000);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.ClarityCurriculumTools = {
    version: VER,
    ensureNotes: ensureNotes,
    ensureTajweed: ensureTajweed,
    pathI: pathI
  };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-path-progress-v1.js ---- */
!function(){"use strict";if(!window.__CLARITY_PATH_PROGRESS_V6__){window.__CLARITY_PATH_PROGRESS_V6__=!0;var t=["seeker","new_muslim","practicing","dai"],e={seeker:"Seeker",new_muslim:"New Muslim",practicing:"Daily Muslim",dai:"Da'i"},a="clarity_path_unlocked_max",r="clarity_quiz_passed_v1",i={seeker:{"commands-card":1,"samina-verse-card":1,"samina-card":1,"about-clarity-card":1,"soul-compass-card":1,"hell-sins-card":1,"night-breath-card":1,"seerah-live-card":1,"creation-tongue-reflection":1,"grave-path-card":1,"cw-card":1,"ilm-pathway-card":1},new_muslim:{"commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,"about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,"night-breath-card":1,"hajj-guide-card":1,"fiqh-quiz-card":1,"grave-path-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1,"hell-sins-card":1,"cw-card":1,"tibbe-nabwi-card":1},practicing:{"commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,"about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,"hell-sins-card":1,"night-breath-card":1,"weekly-review-card":1,"tajweed-live-card":1,"tajweed-path-card":1,"tj-deep-studio":1,"tj-lmr-score-card":1,"callig-lab-card":1,"meme-card":1,"tibbe-nabwi-card":1,"seerah-mirror-card":1,"najiha-tafseer-card":1,"tafseer-resources-card":1,"deepen-study-card":1,"asma-names-lecture-card":1,"creation-tongue-reflection":1,"hajj-checklist-card":1,"grave-path-card":1,"daily-deed-ledger-card":1,"hajj-guide-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1,"cw-card":1,"tafseer-live-card":1,"tweet-desk-card":1},dai:{"commands-card":1,"samina-verse-card":1,"samina-card":1,"ilm-pathway-card":1,"about-clarity-card":1,"soul-compass-card":1,"seerah-live-card":1,"hell-sins-card":1,"night-breath-card":1,"deepen-study-card":1,"asma-names-lecture-card":1,"tafseer-resources-card":1,"creation-tongue-reflection":1,"hajj-guide-card":1,"hajj-checklist-card":1,"fiqh-quiz-card":1,"meme-card":1,"callig-lab-card":1,"tweet-desk-card":1,"tajweed-live-card":1,"tajweed-path-card":1,"tj-deep-studio":1,"tj-lmr-score-card":1,"weekly-review-card":1,"tibbe-nabwi-card":1,"seerah-mirror-card":1,"najiha-tafseer-card":1,"israeliyat-card":1,"sealed-nectar-card":1,"tajalliyat-lecture-card":1,"tafseer-live-card":1,"voice-translator-card":1,"grave-path-card":1,"daily-deed-ledger-card":1,"dai-transmit-card":1,"new-muslim-foundations-card":1,"salah-starter-card":1,"cw-card":1}},c={"user-family-tree-card":1,"faraid-card":1,"wasiyyah-card":1,"about-clarity-card":1,"cw-card":1,"notes-shell":1},n={1:[{q:"Shahāda affirms belief in:",opts:["Allah alone and Muhammad ﷺ as His Messenger","Culture only","Any idol","Travel alone"],a:0},{q:"Before ṣalāh when required, one performs:",opts:["Wudu (ablution)","A social media post","A payment","Silence only"],a:0},{q:"The five daily prayers are:",opts:["A core practiced pillar of the religion","Optional decoration","Only for imams","Replaced by intention alone"],a:0}],2:[{q:"Steady growth is best as:",opts:["Consistent sincere deeds","Only online debates","Abandoning prayer when busy","Never opening the Qur'an"],a:0},{q:"Tajweed primarily helps:",opts:["Correct Qur'an recitation","Business ads","Astrology","Skipping ṣalāh"],a:0},{q:"Family legacy notes are:",opts:["Educational readiness — not a website fatwa","Final court orders","Public shaming tools","A way to hide debts"],a:0}],3:[{q:"Calm dawah prioritises:",opts:["Sincerity, authentic sources, manners","Winning by mockery","Invented rulings","Hiding references"],a:0},{q:"If unsure of a ruling:",opts:["Ask qualified local scholarship / trusted sources","Post a confident guess","Follow the angriest comment","Ignore harm"],a:0},{q:"Sharing scripture publicly needs:",opts:["Care for authenticity and context","Editing the text for drama","No reference","Guaranteed salvation claims"],a:0}]},o=!1,d=null,l=!1,s=0,u=null,m=null;window.clarityPathResetToSeeker=function(){try{localStorage.setItem(a,"0"),localStorage.setItem("clarity_committed_path","seeker"),localStorage.setItem("clarity_path_override","seeker"),localStorage.setItem("clarity_path_focus","seeker"),localStorage.removeItem(r),localStorage.removeItem("clarity_path_quiz_done"),localStorage.removeItem("clarity_quiz_passed_v1")}catch(t){}d=null;m=null;window.__clarityPathBypass=!0;try{q("seeker",{goReminder:!0})}finally{window.__clarityPathBypass=!1}setTimeout(function(){window.__clarityPathBypass=!0;try{q("seeker",{goReminder:!0})}finally{window.__clarityPathBypass=!1}},120);return{ok:!0,path:"seeker"}},window.clarityWelcomePickTrack=function(e){e=String(e||"seeker"),t.indexOf(e)<0&&(e="seeker");try{localStorage.setItem("clarity_welcome_seen_v2","1"),localStorage.setItem("clarity_welcome_seen","1"),localStorage.setItem("clarity_committed_path",e),localStorage.setItem("clarity_path_override",e),localStorage.setItem("clarity_path_focus",e),v(h(e));for(var a=0;a<=h(e);a++)f(t[a])}catch(t){}try{if("function"==typeof window.clarityFinishWelcome)window.clarityFinishWelcome(!1);else{var r=document.getElementById("clarity-welcome");r&&(r.classList.remove("show"),r.setAttribute("aria-hidden","true"))}}catch(t){}try{var i=document.getElementById("clarity-three-doors");i&&(i.classList.add("hidden"),i.style.setProperty("display","none","important"))}catch(t){}d=null,q(e,{goReminder:!0});try{window.clarityUnlockScroll&&window.clarityUnlockScroll()}catch(t){}return{ok:!0,path:e}},window.clarityWelcomeSkipToName=function(){return window.clarityWelcomePickTrack("seeker")},window.clarityCommitGate=function(t){return window.clarityWelcomePickTrack(t)},window.clarityPickPrimaryDoor=function(t){var e={today:"seeker",learn:"practicing",prepare:"dai"};if(e[t])return window.clarityWelcomePickTrack(e[t]);try{var a=document.getElementById("clarity-three-doors");a&&(a.classList.add("hidden"),a.style.display="none")}catch(t){}},window.clarityRequestPath=function(e){if(e=String(e||"seeker"),t.indexOf(e)<0&&(e="seeker"),window.__clarityPathBypass)return q(e),{ok:!0};var a=h(e),r=w();if(g(e)||a<=r){v(Math.max(r,a));try{localStorage.setItem("clarity_path_focus",e),localStorage.setItem("clarity_committed_path",e),localStorage.setItem("clarity_path_override",e)}catch(t){}return q(e),{ok:!0,reason:"unlocked"}}var i=t[Math.min(r+1,t.length-1)];return a>r+1?(A(t[r],i),k(t[r]),{ok:!1,reason:"quiz-next",next:i}):(A(t[r],e),{ok:!1,reason:"quiz"})};var y=!1;"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(T,60)}):setTimeout(T,60),window.addEventListener("load",function(){setTimeout(function(){y?(b(),_(S())):T()},200),setTimeout(function(){try{var t=S();_(t),k(t)}catch(t){}},600)}),window.clarityPathProgress={order:t,getMax:w,doorCleared:g,apply:_,reapply:function(){b(),d=null;var t=S();_(t),k(t)},reset:function(){return window.clarityPathResetToSeeker()}}}function h(e){var a=t.indexOf(String(e||""));return a<0?0:a}function p(){try{var t=localStorage.getItem(r);if(!t)return{};var e=JSON.parse(t);return e&&"object"==typeof e?e:{}}catch(t){return{}}}function f(t){try{var e=p();e[t]=!0,localStorage.setItem(r,JSON.stringify(e))}catch(t){}}function g(t){var e=h(t);return e<=0||w()>=e||!!p()[t]}function w(){try{var e=parseInt(localStorage.getItem(a)||"0",10);(isNaN(e)||e<0)&&(e=0);var r=p();return t.forEach(function(t,a){r[t]&&a>e&&(e=a)}),Math.min(t.length-1,e)}catch(t){return 0}}function v(e){e=Math.max(0,Math.min(t.length-1,0|e));try{localStorage.setItem(a,String(e))}catch(t){}return e}function b(){if(!o){o=!0;var e=function(){if(u)return u;var e={};return t.forEach(function(t,a){var r=i[t]||{};Object.keys(r).forEach(function(t){r[t]&&(void 0===e[t]||a<e[t])&&(e[t]=a)})}),Object.keys(c).forEach(function(t){e[t]=0}),u=e,e}();try{document.querySelectorAll(".card[id], [id$='-card']").forEach(function(t){var a=t.id;if(a)return c[a]?(t.setAttribute("data-always","1"),void t.setAttribute("data-min-i","0")):void(void 0!==e[a]?t.setAttribute("data-min-i",String(e[a])):t.setAttribute("data-min-i","2"))}),["meme-card","meme-studio-root","meme","tweet-desk-card"].forEach(function(t){var e=document.getElementById(t);e&&!e.hasAttribute("data-min-i")&&e.setAttribute("data-min-i","2")})}catch(t){}}}function S(){var e="seeker";try{e=localStorage.getItem("clarity_path_focus")||localStorage.getItem("clarity_committed_path")||localStorage.getItem("clarity_path_override")||document.documentElement.getAttribute("data-clarity-path")||"seeker"}catch(t){}t.indexOf(e)<0&&(e="seeker");var a=w();return h(e)>a&&(e=t[a]),e}function _(e){if(!l){e=t.indexOf(e)>=0?e:"seeker";var a=w(),r=h(e);if(!window.__clarityPathBypass&&r>a&&(e=t[a],r=a),d!==e){l=!0;try{b();var i=document.documentElement,c=document.body;i.setAttribute("data-clarity-path",e),i.setAttribute("data-path-i",String(r)),i.setAttribute("data-clarity-unlocked-max",String(a)),c&&(c.setAttribute("data-clarity-path",e),c.setAttribute("data-path-i",String(r)));var n=r>=2&&a>=2;i.setAttribute("data-clarity-meme-ok",n?"1":"0"),c&&c.setAttribute("data-clarity-meme-ok",n?"1":"0");try{localStorage.setItem("clarity_committed_path",e),localStorage.setItem("clarity_path_override",e),localStorage.setItem("clarity_path_focus",e)}catch(t){}k(e);var o=d!==e;d=e,o&&(clearTimeout(s),s=setTimeout(function(){try{window.dispatchEvent(new CustomEvent("clarity-path-changed",{detail:{gate:e}}))}catch(t){}},0))}finally{l=!1}}else k(e)}}function k(e){var a=w();e=t.indexOf(e)>=0?e:t[Math.min(a,t.length-1)],document.querySelectorAll(".gps-btn, .gps-phase, .cgs-btn, [data-gate]").forEach(function(r){var i=r.getAttribute("data-gate");if(i&&!(t.indexOf(i)<0)){var c=h(i)<=a||g(i),n=i===e;r.classList.toggle("active",n),r.classList.toggle("is-active",n),r.classList.toggle("path-locked",!c),r.setAttribute("aria-disabled",c?"false":"true"),r.setAttribute("aria-pressed",n?"true":"false"),c&&r.removeAttribute("disabled")}});try{var r=document.getElementById("clarity-mode-badge")||document.querySelector(".seeker-mode-pill, .path-mode-badge");r&&(r.textContent={seeker:"SEEKER JOURNEY MODE",new_muslim:"NEW MUSLIM TRACK",practicing:"DAILY MUSLIM / LEGACY",dai:"ASPIRING DA'I TRACK"}[e]||r.textContent)}catch(t){}}function q(t,e){e=e||{},window.__clarityPathBypass=!0;try{_(t);try{var a=window.__clarityPathDoSwitchRaw;if("function"==typeof a)a(t)}catch(x){}}catch(y){}finally{window.__clarityPathBypass=!1}if(e.goReminder)try{"function"==typeof switchTab&&switchTab("reminder")}catch(t){}}function I(t){var e=document.getElementById("clarity-path-quiz-modal");e&&e.classList.remove("open");var a=m&&m.target;m=null,t&&a?(f(a),v(Math.max(w(),h(a))),q(a,{goReminder:!0})):k(S())}function A(t,e){if(g(e))return v(Math.max(w(),h(e))),void q(e);var a=h(e),r=n[a];if(!r||!r.length)return f(e),v(Math.max(w(),a)),void q(e,{goReminder:!0});m={from:t,target:e,qs:r,step:0,correct:0,busy:!1};var i=function(){var t=document.getElementById("clarity-path-quiz-modal");return t||((t=document.createElement("div")).id="clarity-path-quiz-modal",t.innerHTML='<div class="cpq-card" id="cpq-inner"></div>',document.body.appendChild(t),t.addEventListener("click",function(e){e.target===t&&I(!1)}),t)}();E(),requestAnimationFrame(function(){i.classList.add("open")})}function E(){var t=document.getElementById("cpq-inner");if(t&&m)if(m.step>=m.qs.length){var a=Math.max(1,Math.ceil(2*m.qs.length/3)),r=m.correct>=a;t.innerHTML="<h3>"+(r?"Door unlocked":"Not yet")+'</h3><p class="cpq-sub">'+(r?"Welcome to <strong>"+e[m.target]+"</strong>. This door stays open — you will not be quizzed again for it.":"Score "+m.correct+"/"+m.qs.length+" (need "+a+"). Stay on <strong>"+e[m.from]+"</strong> and try again.")+'</p><div class="cpq-actions">'+(r?'<button type="button" class="cpq-primary" id="cpq-go">Enter path</button>':'<button type="button" class="cpq-primary" id="cpq-retry">Try again</button>')+'<button type="button" id="cpq-x">Close</button></div>';var i=document.getElementById("cpq-go");i&&(i.onclick=function(){I(!0)});var c=document.getElementById("cpq-retry");c&&(c.onclick=function(){var t=m.from,e=m.target;m=null,A(t,e)});var n=document.getElementById("cpq-x");n&&(n.onclick=function(){I(!1)})}else{var o=m.qs[m.step];t.innerHTML="<h3>Unlock "+e[m.target]+'</h3><p class="cpq-sub">Question '+(m.step+1)+" of "+m.qs.length+' · Need most correct · Cleared doors are never re-asked</p><div class="cpq-q">'+o.q+"</div>"+(function(){var _o=o.opts,_ord=_o.map(function(_,i){return i});for(var _i=_ord.length-1;_i>0;_i--){var _j=Math.floor(Math.random()*(_i+1)),_t=_ord[_i];_ord[_i]=_ord[_j];_ord[_j]=_t}try{var _md=document.getElementById("clarity-path-quiz-modal");_md&&(_md.setAttribute("data-quiz-target",m.target),_md.classList.add("cpq-phase-"+m.target))}catch(_e){}return _ord.map(function(oi){return'<button type="button" class="cpq-opt" data-i="'+oi+'">'+_o[oi]+"</button>"}).join("")})()+'<div class="cpq-actions"><button type="button" id="cpq-stay">Stay on '+e[m.from]+"</button></div>",t.querySelectorAll(".cpq-opt").forEach(function(e){e.onclick=function(){if(m&&!m.busy){m.busy=!0;var a=parseInt(e.getAttribute("data-i"),10)===o.a;a&&m.correct++,e.classList.add(a?"correct":"wrong"),t.querySelectorAll(".cpq-opt").forEach(function(t){parseInt(t.getAttribute("data-i"),10)===o.a&&t.classList.add("correct"),t.disabled=!0}),setTimeout(function(){m&&(m.busy=!1,m.step++,E())},320)}}});var d=document.getElementById("cpq-stay");d&&(d.onclick=function(){I(!1)})}}function T(){if(y)return b(),void _(S());y=!0;try{null==localStorage.getItem(a)&&v(0)}catch(t){}"function"!=typeof window.__clarityPathDoSwitchRaw&&("function"!=typeof window.claritySwitchGate||window.claritySwitchGate.__isRequest?"function"==typeof window.applyGateSectionFilter&&(window.__clarityPathDoSwitchRaw=function(t){try{window.applyGateSectionFilter(t)}catch(t){}}):window.__clarityPathDoSwitchRaw=window.claritySwitchGate),window.claritySwitchGate=function(t){return window.clarityRequestPath(t)},window.claritySwitchGate.__isRequest=!0,window.applyGateConfiguration=window.claritySwitchGate,window.applyGateSectionFilter=function(t){_(t||S())},window.applyAdditiveFilter=window.applyGateSectionFilter,window.applyExclusiveFilter=window.applyGateSectionFilter,function(){try{var t=document.querySelector(".clarity-gate-switcher, #clarity-path-strip, .gps-strip");if(!t||t.querySelector(".cgp-intro"))return;var e=document.createElement("p");e.className="cgp-intro",e.style.cssText="font-size:0.82rem;opacity:0.9;margin:0.35rem 0 0.5rem;line-height:1.45",e.innerHTML="<strong>Phased learning</strong> — start as Seeker. A short quiz unlocks the next door once; earlier sections stay with you.",t.insertBefore(e,t.firstChild)}catch(t){}}(),b(),q(S())}}();


/* ---- clarity-grave-path-curriculum-js.js ---- */
!function(){"use strict";function e(){var e,a=function(){try{return document.documentElement.getAttribute("data-clarity-path")||localStorage.getItem("clarity_committed_path")||"seeker"}catch(e){return"seeker"}}();e=document.querySelector("#tab-reminder .main-content, #tab-reminder, #main-application-workspace, .page-wrapper")||document.body,[["grave-path-card",'<div class="cred-stamp">Educational only — not a fatwa. Verify with Qur\'an, Sunnah, and a local scholar.</div><h2>🕯️ Furnish Your Grave · the real path</h2><p>The Prophet ﷺ taught that when a person dies, deeds end except ongoing charity, beneficial knowledge, and a righteous child who prays for them (Muslim). This track is ordered so each phase builds light you can send ahead.</p><ul style="margin:0.4rem 0 0.5rem;padding-left:1.2rem;font-size:0.88rem;line-height:1.5"><li><strong>Seeker</strong> — softens the heart with death-awareness and small daily deeds.</li><li><strong>New Muslim</strong> — locks in prayer, purity, and clear belief before advanced tools.</li><li><strong>Daily</strong> — crafts Qur\'an, character, and a deed ledger that compounds.</li><li><strong>Da\'i</strong> — transmits carefully: sources, manners, family legacy.</li></ul><div class="gpc-links"><a href="https://sunnah.com/muslim:1631" target="_blank" rel="noopener">Muslim 1631 · three continuing deeds</a><a href="https://quran.com/59/18" target="_blank" rel="noopener">Qur\'an 59:18 · let every soul look to what it sends forth</a><a href="https://islamqa.info/en/answers/69948" target="_blank" rel="noopener">IslamQA · sadaqah jariyah</a><a href="https://quran.com/2/201" target="_blank" rel="noopener">Qur\'an 2:201 · Rabbana</a></div><p class="gpc-note">Not a ruling service. Links are for study. Ask a qualified local teacher for personal guidance.</p>'],["new-muslim-foundations-card",'<h2>🌱 New Muslim foundations · first order</h2><p>Islamic learning has an order: belief, then daily worship, then manners and ḥalāl living — then deeper study. Quality and consistency beat speed.</p><ol style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem;line-height:1.5"><li><strong>Week focus:</strong> Wuḍū\' and the five prayers — even imperfectly, begin.</li><li><strong>Memorize:</strong> Al-Fātiḥah + a few short surahs for prayer.</li><li><strong>Belief:</strong> Six articles of faith in plain language.</li><li><strong>Character:</strong> Truthfulness, prayer on time, guarding the tongue.</li></ol><div class="gpc-links"><a href="https://quran.com/1" target="_blank" rel="noopener">Al-Fātiḥah · Qur\'an.com</a><a href="https://sunnah.com/bukhari:8" target="_blank" rel="noopener">Hadith · pillars of Islam</a><a href="https://quran.com/4/103" target="_blank" rel="noopener">Qur\'an 4:103 · prayer at fixed times</a><a href="https://seekersguidance.org" target="_blank" rel="noopener">SeekersGuidance · Absolute Essentials</a></div><p class="gpc-note">Educational outline only. Learn prayer with a living teacher when you can.</p>'],["salah-starter-card",'<h2>🕌 Salah starter · non-negotiable light</h2><p>The covenant between us and them is the prayer. Start with purity, then movements, then short recitation. Steady beats perfect-on-day-one.</p><ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem"><li>Learn wuḍū\' steps; practice once after each prayer time reminder.</li><li>Pray the five — use a guide until memorized.</li><li>Add Al-Fātiḥah, then three short surahs.</li></ul><div class="gpc-links"><a href="https://quran.com/23/1-2" target="_blank" rel="noopener">Qur\'an 23:1–2 · successful are the believers</a><a href="https://sunnah.com/nasai:463" target="_blank" rel="noopener">Prayer as covenant · study link</a><a href="https://quran.com/2/45" target="_blank" rel="noopener">Qur\'an 2:45 · seek help in patience and prayer</a></div><p class="gpc-note">Not a video course substitute — pair with a local mosque or trusted teacher.</p>'],["daily-deed-ledger-card",'<h2>📒 Daily deed ledger · send light ahead</h2><p>The most beloved deeds are those done consistently, even if small. Count for the grave — not for pride.</p><ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem"><li>One page of Qur\'an with meaning</li><li>Istighfār &amp; ṣalawāt block</li><li>One kindness that costs little</li><li>One note for family legacy (private, on this device)</li></ul><div class="gpc-links"><a href="https://sunnah.com/bukhari:6465" target="_blank" rel="noopener">Most beloved deeds · consistency</a><a href="https://sunnah.com/muslim:2699" target="_blank" rel="noopener">Gatherings of dhikr</a><a href="https://quran.com/18/46" target="_blank" rel="noopener">Qur\'an 18:46 · lasting righteous deeds</a></div><p class="gpc-note">Counts stay on this device. Educational habit tool — not a scoreboard for pride.</p>'],["dai-transmit-card",'<h2>🕊️ Transmit · Da\'i with adab</h2><p>Call to Allah with wisdom. Beneficial knowledge continues after death. Guard sources; avoid inventing rulings.</p><ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem"><li>Share only what you can source (Qur\'an / authentic Hadith / reliable teachers).</li><li>Prefer manners over winning arguments.</li><li>Leave written or taught knowledge that helps others worship correctly.</li></ul><div class="gpc-links"><a href="https://quran.com/16/125" target="_blank" rel="noopener">Qur\'an 16:125 · invite with wisdom</a><a href="https://sunnah.com/muslim:1631" target="_blank" rel="noopener">Beneficial knowledge after death</a><a href="https://islamqa.info/en/answers/237764" target="_blank" rel="noopener">IslamQA · knowledge that benefits</a><a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com · primary texts</a></div><p class="gpc-note">Clarity is educational only — not a fatwa desk. Personal rulings: ask a qualified local scholar.</p>']].forEach(function(a){var t=a[0],r=a[1],n=document.getElementById(t);if(!n){(n=document.createElement("section")).id=t,n.className="card",n.setAttribute("data-grave-path-module","1");var i=document.getElementById("tab-reminder");if(i){var d=i.querySelector(".rrra-hub-body, #rrra-hub-body-reminder, .card-commands, #commands-card");d&&d.parentNode===i&&d.nextSibling?i.insertBefore(n,d.nextSibling):i.appendChild(n)}else e&&e.appendChild(n)}n.innerHTML=r}),function(){try{var e=document.getElementById("clarity-grave-path-strip");e&&e.parentNode&&e.parentNode.removeChild(e)}catch(e){}}();var t={seeker:["grave-path-card"],new_muslim:["grave-path-card","new-muslim-foundations-card","salah-starter-card"],practicing:["grave-path-card","daily-deed-ledger-card"],dai:["grave-path-card","dai-transmit-card","daily-deed-ledger-card","new-muslim-foundations-card"]};["grave-path-card","new-muslim-foundations-card","salah-starter-card","daily-deed-ledger-card","dai-transmit-card"].forEach(function(e){var r=document.getElementById(e);r&&((t[a]||[]).indexOf(e)>=0?(r.classList.remove("gate-hidden"),r.removeAttribute("data-gate-hidden"),r.style.removeProperty("display")):(r.classList.add("gate-hidden"),r.setAttribute("data-gate-hidden","1"),r.style.setProperty("display","none","important")))})}function a(){e()}window.__CLARITY_GRAVE_PATH_CURRICULUM__||(window.__CLARITY_GRAVE_PATH_CURRICULUM__=!0,function(){try{if(document.getElementById("clarity-grave-path-curriculum-css-inject"))return;var e=document.createElement("style");e.id="clarity-grave-path-curriculum-css-inject",e.textContent='.gpc-links{display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.55rem}.gpc-links a{font-size:0.72rem;font-weight:600;padding:0.28rem 0.55rem;border-radius:999px;background:rgba(13,79,60,0.1);color:#0a3d2e;text-decoration:none;border:1px solid rgba(13,79,60,0.18);white-space:normal;line-height:1.35}.gpc-links a:hover{background:rgba(13,79,60,0.18)}.gpc-note{font-size:0.72rem;margin-top:0.55rem;padding:0.4rem 0.55rem;border-radius:10px;background:#f3f0e4;color:#2a3228;border:1px solid #d0c6a4}#grave-path-card,#new-muslim-foundations-card,#salah-starter-card,#daily-deed-ledger-card,#dai-transmit-card{border-radius:16px;padding:1rem 1.1rem;margin-bottom:1rem;background:linear-gradient(145deg,#f7fcf9,#eef6f1)!important;border:1px solid #a8c9b6!important;color:#1c2a22!important}#grave-path-card h2,#new-muslim-foundations-card h2,#salah-starter-card h2,#daily-deed-ledger-card h2,#dai-transmit-card h2{color:#0d4f3c!important}#grave-path-card p,#new-muslim-foundations-card p,#salah-starter-card p,#daily-deed-ledger-card p,#dai-transmit-card p,#grave-path-card li,#new-muslim-foundations-card li,#salah-starter-card li,#daily-deed-ledger-card li,#dai-transmit-card li{color:#1c2a22!important;opacity:1!important}html[data-theme="dark"] #grave-path-card,html[data-theme="dark"] #new-muslim-foundations-card,html[data-theme="dark"] #salah-starter-card,html[data-theme="dark"] #daily-deed-ledger-card,html[data-theme="dark"] #dai-transmit-card{background:linear-gradient(145deg,#152820,#0f1c18)!important;border-color:rgba(212,180,90,0.28)!important;color:#e8f0ea!important}html[data-theme="dark"] #grave-path-card h2,html[data-theme="dark"] #new-muslim-foundations-card h2,html[data-theme="dark"] #salah-starter-card h2,html[data-theme="dark"] #daily-deed-ledger-card h2,html[data-theme="dark"] #dai-transmit-card h2{color:#e8d48a!important}html[data-theme="dark"] #grave-path-card p,html[data-theme="dark"] #new-muslim-foundations-card p,html[data-theme="dark"] #salah-starter-card p,html[data-theme="dark"] #daily-deed-ledger-card p,html[data-theme="dark"] #dai-transmit-card p,html[data-theme="dark"] #grave-path-card li,html[data-theme="dark"] #new-muslim-foundations-card li,html[data-theme="dark"] #salah-starter-card li,html[data-theme="dark"] #daily-deed-ledger-card li,html[data-theme="dark"] #dai-transmit-card li{color:#d8e8de!important}html[data-theme="dark"] .gpc-note{background:rgba(40,36,24,0.9);color:#e8e0d0;border-color:rgba(212,180,90,0.3)}html[data-theme="dark"] .gpc-links a{background:rgba(212,180,90,0.12);color:#e8d48a;border-color:rgba(212,180,90,0.3)}',(document.head||document.documentElement).appendChild(e)}catch(e){}}(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(a,400)}):setTimeout(a,400),window.addEventListener("load",function(){setTimeout(a,900)}),window.addEventListener("clarity-path-changed",function(){setTimeout(e,50)}),window.clarityGravePathSync=e)}();


/* ---- clarity-polish-wiring-v2.js ---- */
!function(){"use strict";function t(t,e){try{if(document.getElementById(t))return;var n=document.createElement("style");n.id=t,n.textContent=e,document.head.appendChild(n)}catch(t){}}window.__CLARITY_POLISH_WIRING_V2__||(window.__CLARITY_POLISH_WIRING_V2__=!0,t("clarity-doors-flow-css-v1",'\n/* Dai phase — never force-hide content cards */\nhtml[data-clarity-path="dai"] .card.gate-hidden,\nhtml[data-clarity-path="dai"] [id$="-card"].gate-hidden,\nhtml[data-clarity-path="dai"] .card[data-gate-hidden="1"],\nhtml[data-clarity-path="dai"] [id$="-card"][data-gate-hidden="1"] {\n  display: block !important;\n  visibility: visible !important;\n  height: auto !important;\n  max-height: none !important;\n  overflow: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\nhtml[data-clarity-path="dai"] .cgs-btn.path-locked {\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n/* Smooth door panel transitions */\n.tab-panel {\n  transition: opacity 0.2s ease;\n}\n.tab-panel.active {\n  display: block !important;\n  opacity: 1 !important;\n}\nbody.section-open #main-application-workspace,\nbody.section-open .page-wrapper {\n  scroll-margin-top: 0.5rem;\n}\n'),function(){if(!window.__CLARITY_DOORS_FLOW_V1__){window.__CLARITY_DOORS_FLOW_V1__=!0;var t=window.clarityOpenSectionDoor;"function"!=typeof t||t.__flowV1||(window.clarityOpenSectionDoor=function(e){var i;e=String(e||"journey"),"dai"===n()&&a();try{i=t.apply(this,arguments)}catch(t){console.warn(t)}try{document.querySelectorAll(".tab-panel").forEach(function(t){var n=t.id==="tab-"+e;t.classList.toggle("active",n),n&&(t.hidden=!1,t.style.removeProperty("display"))}),document.querySelectorAll("#clarity-door-rail .door-rail-btn[data-rail-tab]").forEach(function(t){t.classList.toggle("active",t.getAttribute("data-rail-tab")===e)}),document.body.setAttribute("data-active-tab",e)}catch(t){}return i},window.clarityOpenSectionDoor.__flowV1=!0),window.addEventListener("clarity-path-changed",function(t){r(t&&t.detail&&t.detail.gate||n())});try{localStorage.getItem("clarity_path_max")}catch(t){}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(o,300)}):setTimeout(o,300),window.addEventListener("load",function(){setTimeout(o,500)});var e=!1;setTimeout(l,800),setTimeout(l,2200),window.addEventListener("clarity-path-changed",function(){e=!1,"dai"===n()&&setTimeout(l,400)}),window.clarityDoorsFlow={openAll:a,onPath:r}}function n(){try{return document.documentElement.getAttribute("data-clarity-path")||localStorage.getItem("clarity_committed_path")||"seeker"}catch(t){return"seeker"}}function i(t){if(t){t.classList.remove("gate-hidden"),t.removeAttribute("data-gate-hidden"),t.hidden=!1;try{t.style.removeProperty("display"),t.style.removeProperty("visibility"),t.style.removeProperty("height"),t.style.removeProperty("max-height"),t.style.removeProperty("opacity"),t.style.removeProperty("pointer-events"),t.style.removeProperty("overflow")}catch(t){}}}function a(){if("dai"===n()){document.querySelectorAll(".card, [id$='-card']").forEach(i);var t=document.getElementById("clarity-path-lock");t&&(t.textContent="/* dai: all open */"),document.body.setAttribute("data-meme-studio-open","1");try{document.documentElement.setAttribute("data-clarity-meme-ok","1"),document.body.setAttribute("data-clarity-meme-ok","1")}catch(t){}try{"function"==typeof window.clarityMemeUiSync&&window.clarityMemeUiSync()}catch(t){}}}function r(t){t=t||n();try{document.documentElement.setAttribute("data-clarity-path",t),document.body.setAttribute("data-clarity-path",t)}catch(t){}"dai"===t&&(a(),document.querySelectorAll(".cgs-btn.path-locked").forEach(function(t){t.classList.remove("path-locked")}))}function o(){r(n()),"dai"===n()&&a()}function l(){e||"dai"===n()&&(document.querySelectorAll(".card.gate-hidden, [id$='-card'][data-gate-hidden='1']").length&&a(),e=!0)}}(),t("clarity-banner-nuclear-css",'\n/* Nuclear: banner is a fixed clip box. Media cannot affect document flow. */\n#clarity-top-duo {\n  position: relative !important;\n  z-index: 20 !important;\n  overflow: visible !important;\n}\n#clarity-top-duo .banner,\n.banner {\n  position: relative !important;\n  display: block !important;\n  overflow: hidden !important;\n  isolation: isolate !important;\n  /* height comes only from overlay; media never contributes */\n  height: auto !important;\n  min-height: 0 !important;\n  max-height: none !important;\n  z-index: 1 !important;\n}\n#clarity-top-duo .banner-overlay,\n.banner-overlay {\n  position: relative !important;\n  z-index: 3 !important;\n  display: flex !important;\n}\n/* Media layer: painted only inside banner, zero layout size contribution */\n#clarity-top-duo .banner-media,\n.banner-media,\n#banner-media {\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  overflow: hidden !important;\n  z-index: 0 !important;\n  pointer-events: none !important;\n  /* critical: do not let children escape paint */\n  contain: strict !important;\n  clip: rect(0, auto, auto, 0) !important;\n  clip-path: inset(0) !important;\n}\n#banner-img,\n.banner-still-img,\n#banner-live,\n.banner-live-iframe,\n.banner-media img,\n.banner-media iframe {\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-width: 100% !important;\n  max-height: 100% !important;\n  min-width: 0 !important;\n  min-height: 0 !important;\n  margin: 0 !important;\n  border: 0 !important;\n  padding: 0 !important;\n  object-fit: cover !important;\n  transform: none !important;\n  inset: auto !important; /* override any inset:-18% leftovers */\n}\n/* Hidden live = no paint, no decode */\n#banner-live[hidden],\n.banner-live-iframe[hidden],\n#banner-live:not([src]),\n.banner-media:not(.live-active) #banner-live {\n  display: none !important;\n  visibility: hidden !important;\n  width: 0 !important;\n  height: 0 !important;\n  opacity: 0 !important;\n}\n/* Anything that escaped the banner — kill it */\nbody > #banner-live,\nbody > #banner-img,\nbody > .banner-media,\n#main-application-workspace > #banner-live,\n#main-application-workspace > #banner-img,\n.page-wrapper > iframe[src*="youtube"] {\n  display: none !important;\n  height: 0 !important;\n  width: 0 !important;\n}\n/* Content must start cleanly under duo */\n#clarity-visit-pill-bar,\n#clarity-grave-path-strip,\n#main-application-workspace,\n.main-content {\n  position: relative !important;\n  z-index: 2 !important;\n  clear: both !important;\n}\n'),function(){if(!window.__CLARITY_BANNER_NUCLEAR__){window.__CLARITY_BANNER_NUCLEAR__=!0,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(n,50)}):setTimeout(n,50),window.addEventListener("load",function(){setTimeout(e,200),setTimeout(e,800)});var t=0;window.addEventListener("resize",function(){clearTimeout(t),t=setTimeout(e,120)})}function e(){var t=document.querySelector("#clarity-top-duo .banner")||document.querySelector(".banner");if(t){try{t.style.overflow="hidden"}catch(t){}var e=document.getElementById("banner-media")||t.querySelector(".banner-media");if(e)try{e.setAttribute("aria-hidden","true")}catch(t){}var n=document.getElementById("banner-live");if(n&&e&&!e.classList.contains("live-active"))try{n.setAttribute("hidden",""),n.getAttribute("src")&&"about:blank"!==n.getAttribute("src")&&(n.src="about:blank")}catch(t){}try{document.querySelectorAll("body > #banner-live, body > #banner-img, body > .banner-media").forEach(function(t){try{t.style.display="none"}catch(t){}})}catch(t){}}}function n(){var t;e(),(t=document.getElementById("live-haramain-btn"))&&!t.__nuclear&&(t.addEventListener("click",function(){setTimeout(e,50),setTimeout(e,300)},!0),t.__nuclear=!0)}}(),window.__CLARITY_SECURITY_PASS_V3__||(window.__CLARITY_SECURITY_PASS_V3__=!0,window.claritySecurityAudit=function(){var t,e,n={ok:!0,ts:Date.now(),build:"banner-nuclear+path+curriculum",vault:{tree:!!document.getElementById("user-family-tree-card"),uftKey:window.UFT_KEY||"clarity_user_family_tree_v1",uftRead:"function"==typeof window.uftRead,cryptoSubtle:!(!window.crypto||!window.crypto.subtle)},path:{attr:document.documentElement.getAttribute("data-clarity-path"),request:"function"==typeof window.clarityRequestPath,reset:"function"==typeof window.clarityPathResetToSeeker},banner:{duo:!!document.getElementById("clarity-top-duo"),media:!!document.getElementById("banner-media"),live:!!document.getElementById("banner-live"),visitOutsideBanner:(t=document.getElementById("clarity-visit-pill-bar"),e=document.querySelector(".banner"),!(!t||!e||e.contains(t)))},storage:{keys:0,suspicious:[]},external:{scripts:0,frames:0},notes:[]};try{"clarity_user_family_tree_v1"!==n.vault.uftKey&&(n.ok=!1,n.notes.push("unexpected UFT_KEY"))}catch(t){}try{for(var i=0;i<localStorage.length;i++){var a=localStorage.key(i)||"";n.storage.keys++,/passphrase|plaintext.?key|(^|_)password$|secret.?key/i.test(a)&&(n.storage.suspicious.push(a),n.ok=!1,n.notes.push("suspicious storage key: "+a))}}catch(t){}try{document.querySelectorAll("script[src]").forEach(function(t){n.external.scripts++;var e=t.getAttribute("src")||"";/^https?:/i.test(e)&&!/fonts\.googleapis|fonts\.gstatic|youtube|flickr/i.test(e)&&n.notes.push("external script: "+e.slice(0,80))}),document.querySelectorAll("iframe[src]").forEach(function(t){n.external.frames++;var e=t.getAttribute("src")||"";e&&!/youtube\.com|youtube-nocookie\.com/i.test(e)&&n.notes.push("non-youtube iframe: "+e.slice(0,80))})}catch(t){}try{document.querySelectorAll("input[type='password']").forEach(function(t){t.getAttribute("autocomplete")||t.setAttribute("autocomplete","current-password")})}catch(t){}return n.banner.visitOutsideBanner||n.notes.push("visit bar still inside banner — layout risk"),window.__CLARITY_SECURITY_REPORT__=n,n},setTimeout(function(){try{claritySecurityAudit()}catch(t){}},1200)),t("clarity-visit-strip-visible",'\n#clarity-visit-pill-bar,\n.cv-stitched-banner {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  align-items: center !important;\n  gap: 0.35rem !important;\n  min-height: 2.35rem !important;\n  max-height: none !important;\n  padding: 0.35rem 0.55rem !important;\n  margin: 0 !important;\n  overflow-x: auto !important;\n  overflow-y: hidden !important;\n  -webkit-overflow-scrolling: touch;\n  position: relative !important;\n  z-index: 25 !important;\n  background: linear-gradient(180deg, #0f241c 0%, #0c1c16 100%) !important;\n  border-bottom: 1px solid rgba(212, 180, 90, 0.28) !important;\n  color: #e8f0ea !important;\n  font-size: 0.72rem !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n}\n#clarity-visit-pill-bar .cv-label {\n  font-weight: 800 !important;\n  letter-spacing: 0.06em !important;\n  text-transform: uppercase !important;\n  color: var(--gold, #d4b45a) !important;\n  flex-shrink: 0 !important;\n}\n#clarity-visit-pill-bar .cv-hint {\n  opacity: 0.75 !important;\n  flex-shrink: 0 !important;\n}\n#clarity-visit-pill-bar a,\n#clarity-visit-pill-bar button,\n#clarity-visit-pill-bar .cv-pill {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 0.2rem !important;\n  padding: 0.2rem 0.5rem !important;\n  border-radius: 999px !important;\n  background: rgba(255,255,255,0.08) !important;\n  border: 1px solid rgba(255,255,255,0.12) !important;\n  color: #e8f0ea !important;\n  white-space: nowrap !important;\n  text-decoration: none !important;\n  font-size: 0.68rem !important;\n}\nhtml[data-theme="light"] #clarity-visit-pill-bar,\nhtml[data-theme="day"] #clarity-visit-pill-bar {\n  background: linear-gradient(180deg, #e8f5ee, #dceee4) !important;\n  color: #0c1a14 !important;\n  border-bottom-color: #a8c9b6 !important;\n}\nhtml[data-theme="light"] #clarity-visit-pill-bar .cv-label,\nhtml[data-theme="day"] #clarity-visit-pill-bar .cv-label {\n  color: #0a3d2e !important;\n}\nhtml[data-theme="light"] #clarity-visit-pill-bar a,\nhtml[data-theme="light"] #clarity-visit-pill-bar .cv-pill,\nhtml[data-theme="day"] #clarity-visit-pill-bar a,\nhtml[data-theme="day"] #clarity-visit-pill-bar .cv-pill {\n  background: rgba(13,79,60,0.08) !important;\n  color: #0c1a14 !important;\n  border-color: #a8c9b6 !important;\n}\n/* Banner may grow for stream/volume row; strip stays below in flow */\n#clarity-top-duo .banner {\n  max-height: none !important;\n  overflow: hidden !important;\n}\n#clarity-visit-pill-bar,\n.cv-stitched-banner {\n  position: relative !important;\n  z-index: 12 !important;\n  top: auto !important;\n  bottom: auto !important;\n  margin-top: 0 !important;\n  clear: both !important;\n}\n'),t("clarity-tj-meme-tweet-revamp-css",'\n/* —— Tajweed record level meter —— */\n.tj-lmr-live-meter,\n#tj-lmr-meter-host {\n  margin: 0.45rem 0 0.35rem !important;\n  padding: 0.4rem 0.55rem !important;\n  border-radius: 12px !important;\n  background: rgba(0,0,0,0.22) !important;\n  border: 1px solid rgba(212,180,90,0.25) !important;\n}\n.tj-lmr-live-meter .meter-label,\n.meter-label {\n  font-size: 0.68rem !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.04em !important;\n  text-transform: uppercase !important;\n  color: var(--gold, #d4b45a) !important;\n  margin-bottom: 0.25rem !important;\n}\n.tj-lmr-live-meter .meter-track,\n.meter-track {\n  height: 0.55rem !important;\n  border-radius: 999px !important;\n  background: rgba(255,255,255,0.12) !important;\n  overflow: hidden !important;\n  position: relative !important;\n}\n.tj-lmr-live-meter .meter-fill,\n#tj-lmr-meter-fill,\n.meter-fill {\n  height: 100% !important;\n  width: 0%;\n  border-radius: 999px !important;\n  background: linear-gradient(90deg, #1a6b52, #d4b45a 70%, #e8c84a) !important;\n  transition: width 0.06s linear !important;\n  box-shadow: 0 0 8px rgba(212,180,90,0.45) !important;\n}\n.tj-lmr-live-meter.recording .meter-track {\n  box-shadow: inset 0 0 0 1px rgba(212,180,90,0.35);\n}\nhtml[data-theme="light"] .tj-lmr-live-meter,\nhtml[data-theme="day"] .tj-lmr-live-meter {\n  background: rgba(13,79,60,0.08) !important;\n}\nhtml[data-theme="light"] .meter-track,\nhtml[data-theme="day"] .meter-track {\n  background: rgba(13,79,60,0.12) !important;\n}\n\n/* Indo-Pak style hint in meme font select */\n#meme-font option[value="indopak"],\n#meme-font option[value="nastaliq"] {\n  font-weight: 600;\n}\n'),function(){if(!window.__CLARITY_TJ_MEME_TWEET_REVAMP__){window.__CLARITY_TJ_MEME_TWEET_REVAMP__=!0,window.clarityTjStartMeter=i,window.clarityTjStopMeter=a;var t=navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices):null;t&&!navigator.mediaDevices.getUserMedia.__meterHook&&(navigator.mediaDevices.getUserMedia=function(e){return t(e).then(function(t){try{e&&e.audio&&i(t)}catch(t){}return t})},navigator.mediaDevices.getUserMedia.__meterHook=!0),document.addEventListener("click",function(t){var e=t.target&&t.target.closest&&t.target.closest("#tj-lmr-rec-stop, #tj-lmr-rec-btn");e&&/stop/i.test(e.id||e.textContent||"")&&setTimeout(a,80)},!0);var e='"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Scheherazade New", "Noto Naskh Arabic", serif';r();var n=window.clarityMemePush;"function"!=typeof n||n.__indo||(window.clarityMemePush=function(t,i,a){!function(t){try{window.memeState||(window.memeState={}),memeState.font="indopak",memeState.arabicFont=e,t&&(memeState.mid?memeState.top||(memeState.top=t):memeState.mid=t);var n=document.getElementById("meme-font");if(n){var i=n.querySelector('option[value="indopak"]');i||((i=document.createElement("option")).value="indopak",i.textContent="Indo-Pak (Nastaliq)",n.appendChild(i)),n.value="indopak"}}catch(t){}}(t),r();var l=n.apply(this,arguments);return setTimeout(function(){o(),"function"==typeof memeDraw&&memeDraw()},120),l},window.clarityMemePush.__indo=!0),o(),setTimeout(o,800),"function"!=typeof window.tdPost||window.tdPost.__appOpen||(window.tdPost=function(){var t=document.getElementById("td-text");if(!t||!t.value.trim())try{"function"==typeof tdDraft&&tdDraft("verse")}catch(t){}l((document.getElementById("td-text")||{}).value||"")},window.tdPost.__appOpen=!0),window.clarityOpenTweetApp=l,console.info("[Clarity] tajweed meter + Indo-Pak meme + tweet app hooks ready")}function i(t){try{if(!t)return;var e=document.querySelector("#tj-lmr-step3, #tj-lmr-panel, .tj-lmr-panel")||document.getElementById("tj-lmr"),n=document.querySelector(".tj-lmr-live-meter");!n&&e&&((n=document.createElement("div")).className="tj-lmr-live-meter",n.innerHTML='<div class="meter-label">Input level</div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill"></div></div>',e.appendChild(n)),n&&n.classList.add("recording");var i=document.getElementById("tj-lmr-meter-fill");!i&&n&&(i=n.querySelector(".meter-fill")),window.__lmrMeterRaf&&cancelAnimationFrame(window.__lmrMeterRaf);try{window.__lmrMeterCtx&&window.__lmrMeterCtx.close()}catch(t){}var a=window.AudioContext||window.webkitAudioContext;if(!a)return;var r=new a;"suspended"===r.state&&r.resume();var o=r.createMediaStreamSource(t),l=r.createAnalyser();l.fftSize=1024,l.smoothingTimeConstant=.45,o.connect(l);var m=new Uint8Array(l.fftSize);window.__lmrMeterCtx=r,window.__lmrMeterAn=l,function t(){if(window.__lmrMeterAn){try{window.__lmrMeterAn.getByteTimeDomainData(m);for(var e=0,i=0;i<m.length;i++){var a=(m[i]-128)/128;e+=a*a}var r=Math.sqrt(e/m.length),o=Math.min(100,Math.max(0,Math.round(520*r))),l=document.getElementById("tj-lmr-meter-fill")||n&&n.querySelector(".meter-fill");l&&(l.style.width=o+"%")}catch(t){}window.__lmrMeterRaf=requestAnimationFrame(t)}}()}catch(t){console.warn("[Clarity] meter",t)}}function a(){window.__lmrMeterRaf&&cancelAnimationFrame(window.__lmrMeterRaf),window.__lmrMeterRaf=null,window.__lmrMeterAn=null;try{window.__lmrMeterCtx&&window.__lmrMeterCtx.close()}catch(t){}window.__lmrMeterCtx=null;var t=document.getElementById("tj-lmr-meter-fill");t&&(t.style.width="0%"),document.querySelectorAll(".tj-lmr-live-meter").forEach(function(t){t.classList.remove("recording")})}function r(){try{if(document.getElementById("clarity-indopak-font-link"))return;var t=document.createElement("link");t.id="clarity-indopak-font-link",t.rel="stylesheet",t.href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap",document.head.appendChild(t)}catch(t){}}function o(){var t=window.memeDraw;"function"!=typeof t||t.__indoPak||(window.memeDraw=function(){try{var n=window.memeState||{};("indopak"===n.font||"nastaliq"===n.font||"arabic"===n.font)&&(n.arabicFont=e)}catch(t){}var i=t.apply(this,arguments);try{var a="function"==typeof memeGetCanvas?memeGetCanvas():document.querySelector("#meme-canvas, canvas.meme-canvas"),r=window.memeState||{};if(a&&("indopak"===r.font||"nastaliq"===r.font)){var o=a.getContext("2d"),l=r.mid||r.top||r.text||"";if(l&&/[\u0600-\u06FF]/.test(l)){var m=.88*a.width,d=.35*a.height,c=function(t,n,i,a,r){var o=r||42;for(t.textAlign="center",t.direction="rtl";o>14;){t.font="600 "+o+"px "+e;var l=String(n||"").split(/\n/),m=0,d=0;if(l.forEach(function(e){var n=t.measureText(e);m=Math.max(m,n.width),d+=1.55*o}),m<=i&&d<=a)break;o-=1}return o}(o,l,m,d,Math.round(.07*a.width));o.font="600 "+c+"px "+e,o.fillStyle="gold"===r.style?"#f0d78c":r.ink||"#f6f1e7",o.textAlign="center",o.direction="rtl";var p=.48*a.height;String(l).split(/\n/).forEach(function(t,e){o.fillText(t,a.width/2,p+e*c*1.55)})}}}catch(t){}return i},window.memeDraw.__indoPak=!0)}function l(t){var e=String(t||"").trim();if(e){var n=encodeURIComponent(e),i="https://x.com/intent/tweet?text="+n,a=["twitter://post?message="+n,"twitter://post?text="+n,"x://post?message="+n];if(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent||"")){var r=Date.now(),o=document.createElement("iframe");o.style.display="none",o.src=a[0],document.body.appendChild(o),setTimeout(function(){try{document.body.removeChild(o)}catch(t){}Date.now()-r<1600&&(window.location.href=a[0]),setTimeout(function(){window.open(i,"_blank","noopener")},700)},400);try{"function"==typeof tdStatus&&tdStatus("Opening X / Twitter app…")}catch(t){}}else{window.open(i,"_blank","noopener");try{"function"==typeof tdStatus&&tdStatus("Compose opened on X")}catch(t){}}}}}())}();



/* ---- clarity-strip-wire-v3 ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_STRIP_WIRE_V3__) return;
  g.__CLARITY_STRIP_WIRE_V3__ = true;

  var ALIAS = {
    tajweed: ["tj-lmr", "tajweed-live-card", "tajweed-path-card", "tj-deep-studio", "callig-lab-card"],
    notes: ["notes-shell", "notes-card", "tab-notes"],
    meme: ["meme-card", "meme-studio-root"],
    "meme studio": ["meme-card"],
    calligraphy: ["callig-lab-card"],
    commands: ["commands-card"],
    deepen: ["deepen-study-card"],
    seerah: ["seerah-live-card", "seerah-mirror-card"],
    asma: ["asma-names-lecture-card"]
  };

  function findTarget(raw) {
    if (!raw) return null;
    var id = String(raw).replace(/^#/, "").trim();
    var el = document.getElementById(id);
    if (el) return el;
    var key = id.toLowerCase().replace(/[_-]+/g, " ");
    var list = ALIAS[key] || ALIAS[id.toLowerCase()];
    if (list) {
      for (var i = 0; i < list.length; i++) {
        el = document.getElementById(list[i]);
        if (el) return el;
      }
    }
    // text match on strip buttons
    return null;
  }

  function openTarget(el) {
    if (!el) return;
    try {
      el.classList.remove("gate-hidden", "hidden");
      el.style.removeProperty("display");
      el.style.removeProperty("visibility");
      el.hidden = false;
    } catch (e) {}
    try {
      if (/notes/i.test(el.id) && g.ClarityLazy && g.ClarityLazy.notes) g.ClarityLazy.notes();
      if (/tj-lmr|tajweed/i.test(el.id) && g.ClarityLazy && g.ClarityLazy.tjLmr) g.ClarityLazy.tjLmr();
    } catch (e2) {}
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e3) {
      try {
        el.scrollIntoView(true);
      } catch (e4) {}
    }
    try {
      if (/meme/i.test(el.id) && typeof g.switchTab === "function") g.switchTab("reminder");
      if (/notes/i.test(el.id) && typeof g.switchTab === "function") g.switchTab("reflection");
    } catch (e5) {}
  }

  document.addEventListener(
    "click",
    function (ev) {
      try {
        var t = ev.target.closest(
          "[data-clarity-goto], [data-target], [data-card], .clarity-visit-pill, .clarity-path-pill, .clarity-module-pill, .path-module-pill"
        );
        if (!t) {
          // Daily path strip text buttons
          t = ev.target.closest(
            "#clarity-path-modules button, #clarity-last-visited button, .clarity-path-strip button, .daily-path-tools button, [data-rail-tab]"
          );
        }
        if (!t) return;

        var raw =
          t.getAttribute("data-clarity-goto") ||
          t.getAttribute("data-target") ||
          t.getAttribute("data-card") ||
          t.getAttribute("data-rail-tab") ||
          t.getAttribute("data-module") ||
          (t.textContent || "").trim();

        // Map visible labels
        var label = (t.textContent || "").trim().toLowerCase();
        if (/tajweed/i.test(label)) raw = "tajweed";
        else if (/^notes$/i.test(label)) raw = "notes";
        else if (/meme/i.test(label)) raw = "meme";
        else if (/calligraph/i.test(label)) raw = "calligraphy";

        var el = findTarget(raw);
        if (!el && label) {
          for (var k in ALIAS) {
            if (label.indexOf(k) >= 0) {
              el = findTarget(k);
              if (el) break;
            }
          }
        }
        if (!el) return;
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e0) {}
        openTarget(el);
      } catch (e) {}
    },
    true
  );
})(typeof window !== "undefined" ? window : this);

/* ---- strip-nuke-v1: remove legacy straps; path rail owns chrome ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_STRIP_NUKE_V1__) return;
  g.__CLARITY_STRIP_NUKE_V1__ = true;
  var KILL_IDS = [
    "clarity-visit-pill-bar",
    "clarity-path-module-strip",
    "clarity-daily-tools-strip",
    "clarity-last-visited",
    "clarity-tools-strip"
  ];
  var KILL_SEL =
    ".clarity-visit-strip, .cv-stitched-banner, .clarity-path-module-strip, .clarity-daily-tools-strip, .daily-path-tools, #clarity-path-tools, .path-tools-row";
  function nuke() {
    KILL_IDS.forEach(function (id) {
      var n = document.getElementById(id);
      if (n && n.parentNode) {
        try {
          n.parentNode.removeChild(n);
        } catch (e) {}
      }
    });
    try {
      document.querySelectorAll(KILL_SEL).forEach(function (n) {
        try {
          n.remove();
        } catch (e) {}
      });
    } catch (e) {}
    // Hide TRACK row if path pack injects it with common text
    try {
      document.querySelectorAll("div, section, nav").forEach(function (el) {
        if (el.id === "clarity-path-rail" || el.id === "tab-notes" || el.id === "amana-vault-gate" || el.id === "amana-vault-interior") return;
        var t = (el.textContent || "").trim();
        if (el.children.length <= 8 && /^TRACK/i.test(t) && /Seeker/i.test(t) && /Da.?i/i.test(t)) {
          el.style.display = "none";
          el.setAttribute("data-clarity-nuked-track", "1");
        }
        if (/^LAST$/i.test((el.querySelector && el.querySelector(".cv-label") || {}).textContent || "")) {
          el.style.display = "none";
        }
      });
    } catch (e2) {}
  }
  function boot() {
    nuke();
    setTimeout(nuke, 200);
    setTimeout(nuke, 800);
    setTimeout(nuke, 2000);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__stripNukeT);
        g.__stripNukeT = setTimeout(nuke, 100);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
