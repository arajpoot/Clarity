window.__CLARITY_GATE_HANDS_OFF__=true;
/** Clarity Aux Pack v1 (idle) — merged lean pack */


/* ---- clarity-track-os-v3.js ---- */
try{window.__CLARITY_BOOT_TS=window.__CLARITY_BOOT_TS||Date.now()}catch(e){}!function(){"use strict";var e=["seeker","new_muslim","practicing","dai"],t={seeker:{s1:{action:"Read a short piece on Tawhid, then note one purpose of your creation.",section:"journey",source:"https://quran.com/51/56",sourceLabel:"Qur’an 51:56"},s2:{action:"Open Seerah and capture one proof of prophethood in Notes.",section:"seerah",source:"https://sunnah.com/bukhari:7",sourceLabel:"Bukhari on revelation"},s3:{action:"Skim how the Qur’an was compiled; verify a verse on Quran.com.",section:"tafseer",source:"https://quran.com",sourceLabel:"Quran.com"},s4:{action:"Spend 10 minutes with the Grave tab — one istighfar with presence.",section:"grave",source:"https://sunnah.com/tirmidhi:2307",sourceLabel:"Remember death"},s5:{action:"Use Guidance search for one common doubt; answer with adab.",section:"search",source:"https://islamqa.info",sourceLabel:"IslamQA (edu)"}},new_muslim:{n1:{action:"Write the Shahada meaning in your own words in Notes.",section:"journey",source:"https://quran.com/3/18",sourceLabel:"Qur’an 3:18"},n2:{action:"Practice wudu steps, then open Commands for prayer outline.",section:"commands",source:"https://www.islamicity.org/covers/how-to-pray/",sourceLabel:"Prayer outline"},n3:{action:"List how each pillar appears in your week (even imperfectly).",section:"commands",source:"https://sunnah.com/bukhari:8",sourceLabel:"Five pillars hadith"},n4:{action:"One kindness to family today; open Seerah for character models.",section:"seerah",source:"https://sunnah.com/bukhari:5971",sourceLabel:"Kindness to parents"},n5:{action:"10× istighfar + 10× salawat; visit Grave tab for context.",section:"grave",source:"https://sunnah.com/muslim:486",sourceLabel:"Salawat"}},practicing:{p1:{action:"Mark today’s deed on the Today surface; keep the streak honest.",section:"journey",source:"https://sunnah.com/bukhari:6464",sourceLabel:"Consistent deeds"},p2:{action:"Recite a short surah with tajweed awareness in Tajweed tab.",section:"tajweed",source:"https://quran.com/1",sourceLabel:"Al-Fatiha"},p3:{action:"Weekly light review: open Journey stats; forgive one shortfall.",section:"journey",source:"https://quran.com/103",sourceLabel:"Surah Al-Asr"},p4:{action:"Open Fiqh tools — sketch debts / wasiyyah notes (not a fatwa).",section:"notes",source:"https://quran.com/4/11",sourceLabel:"Inheritance verses"},p5:{action:"Share one authentic reminder (Meme Studio or copy light).",section:"about",source:"https://sunnah.com",sourceLabel:"Sunnah.com"}},dai:{d1:{action:"Read one Seerah moment on sincerity before inviting others.",section:"seerah",source:"https://sunnah.com/nawawi:1",sourceLabel:"Actions by intention"},d2:{action:"Open Guidance; practice citing Qur’an.com / Sunnah.com only.",section:"search",source:"https://sunnah.com",sourceLabel:"Hadith grades"},d3:{action:"Answer one misconception calmly — note sources, avoid anger.",section:"search",source:"https://yaqeeninstitute.org",sourceLabel:"Yaqeen (edu)"},d4:{action:"Prepare a 3-minute micro-lesson; check Lectures for structure.",section:"lectures",source:"https://quran.com",sourceLabel:"Qur’an first"},d5:{action:"Identify local masjid contact; write one community kindness.",section:"about",source:"https://islamqa.info",sourceLabel:"Community fiqh (edu)"}}};function a(){"undefined"!=typeof CLARITY_PATHS&&e.forEach(function(e){var a=CLARITY_PATHS[e];if(a&&a.modules){var o=t[e]||{};a.modules.forEach(function(e){var t=o[e.id];t&&(e.action||(e.action=t.action),e.section||(e.section=t.section||e.tab),e.source||(e.source=t.source),e.sourceLabel||(e.sourceLabel=t.sourceLabel))})}})}function o(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function n(e){try{if("function"==typeof clarityGetPathProgress)return clarityGetPathProgress(e)}catch(e){}try{return JSON.parse(localStorage.getItem("clarity_path_prog_"+e)||'{"done":[],"minutes":0}')}catch(e){return{done:[],minutes:0}}}function c(t){a();var c=document.getElementById("path-board");if(c&&"undefined"!=typeof CLARITY_PATHS){var i=t||function(){try{if("function"==typeof clarityActiveTrack)return clarityActiveTrack()}catch(e){}try{var e=localStorage.getItem("clarity_path_override")||localStorage.getItem("clarity_committed_path")||"";if(e&&CLARITY_PATHS[e])return e}catch(e){}return"seeker"}();CLARITY_PATHS[i]||(i="seeker"),c.classList.add("path-board-managed");var r=function(t){var a='<div class="path-switch-bar" role="group" aria-label="Switch learning track">';return a+='<span class="psb-label">Tracks</span>',a+='<select class="path-switch-select" id="path-switch-select" aria-label="Switch track" onchange="claritySwitchTrack(this.value)">',e.forEach(function(e){var c=CLARITY_PATHS[e];if(c){var i=(n(e).done||[]).length,r=c.modules.length,s=e===t?" selected":"";a+='<option value="'+o(e)+'"'+s+">"+o(c.label)+" · "+i+"/"+r+"</option>"}}),a+="</select>",a+='<span class="psb-hint">Other tracks stay one tap away — focus stays on the active routine.</span>',a+="</div>"}(i)+function(e){var t=CLARITY_PATHS[e];if(!t)return"";var a=n(e),c={};(a.done||[]).forEach(function(e){c[e]=!0});var i=t.modules.length,r=t.modules.filter(function(e){return c[e.id]}).length,s=i?Math.round(100*r/i):0,l=function(e,t){for(var a=0;a<e.modules.length;a++)if(!t[e.modules[a].id])return e.modules[a];return null}(t,c),u=function(e,t){var a=0;return e.modules.forEach(function(e){t[e.id]||(a+=e.mins||5)}),a}(t,c),d='<div class="path-card path-card-active is-active" data-track="'+o(e)+'">';return d+='<div class="pca-head"><div>',d+="<h3>"+o(t.label)+"</h3>",d+='<div class="path-meta">'+o(t.blurb)+"</div></div>",d+='<span class="pca-badge">● Active track</span></div>',d+='<div class="path-prog"><div class="fill" style="width:'+s+'%"></div></div>',d+='<div class="path-routine-stats">',d+='<span class="prs"><strong>'+r+"/"+i+"</strong> modules</span>",d+='<span class="prs"><strong>~'+u+"</strong> min left</span>",d+='<span class="prs"><strong>'+(a.minutes||0)+"</strong> min logged</span>",d+="</div>",l?(d+='<div class="path-next-routine">',d+='<div class="pnr-kicker">Next up · ~'+(l.mins||5)+" min</div>",d+='<div class="pnr-title">'+o(l.title)+"</div>",l.action&&(d+='<div class="mod-action">'+o(l.action)+"</div>"),d+='<div class="pnr-btns">',d+='<button type="button" class="btn" onclick="clarityStudyModule(\''+e+"','"+l.id+"')\">Study this →</button>",l.source&&(d+='<button type="button" class="btn-soft" onclick="clarityOpenModuleSource(\''+o(l.source)+"')\">Verify · "+o(l.sourceLabel||"Source")+"</button>"),d+='<button type="button" class="btn-soft" onclick="clarityToggleModule(\''+e+"','"+l.id+"')\">Mark done</button>",d+="</div></div>"):(d+='<div class="path-next-routine"><div class="pnr-kicker">Track complete</div>',d+='<div class="pnr-title">Barakallahu feek — all modules checked on this device.</div>',d+='<div class="pnr-btns"><button type="button" class="btn-soft" onclick="document.getElementById(\'path-switch-select\')&&document.getElementById(\'path-switch-select\').focus()">Explore another track</button></div></div>'),d+='<ul class="path-mods path-mods-active">',t.modules.forEach(function(t){var a=t.prereq&&!c[t.prereq],n=!!c[t.id],i=l&&l.id===t.id;d+='<li class="'+((n?"done":"")+(a?" locked":"")+(i?" next-up":"")).trim()+'">',d+='<input type="checkbox" class="mod-check" '+(n?"checked":"")+" "+(a?"disabled":""),d+=" onclick=\"event.stopPropagation();clarityToggleModule('"+e+"','"+t.id+'\')" aria-label="Toggle '+o(t.title)+'" />',d+='<div class="mod-body">',d+='<div class="mod-title">'+(a?"🔒 ":"")+o(t.title)+"</div>",t.action&&(d+='<div class="mod-action">'+o(t.action)+"</div>"),d+='<div class="mod-links">',a?d+='<span class="mod-time">Complete previous step first</span>':(d+='<button type="button" onclick="clarityStudyModule(\''+e+"','"+t.id+"')\">Open section</button>",t.source&&(d+='<a href="'+o(t.source)+'" target="_blank" rel="noopener noreferrer">'+o(t.sourceLabel||"Source")+"</a>")),d+="</div></div>",d+='<span class="mod-time">~'+(t.mins||5)+" min</span>",d+="</li>"}),d+="</ul>",d+='<p style="font-size:.78rem;margin-top:.75rem;color:var(--text-muted);line-height:1.4">Educational routine only — verify primary texts on <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> / <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a>. Not a fatwa.</p>',d+="</div>"}(i);c.innerHTML=r,c.hidden=!1;try{var s=document.getElementById("cd-track-label");s&&(s.textContent=CLARITY_PATHS[i].label)}catch(e){}}}window.clarityStudyModule=function(e,t){var a=CLARITY_PATHS[e];if(a){for(var o=null,n=0;n<a.modules.length;n++)a.modules[n].id===t&&(o=a.modules[n]);if(o){var c=o.section||o.tab||"journey";try{"function"==typeof clarityOpenSectionDoor?clarityOpenSectionDoor(c):"function"==typeof switchTab&&switchTab(c)}catch(e){}try{"function"==typeof notesOpenDeedNote&&o.action&&notesOpenDeedNote({title:a.label+" · "+o.title,tag:"Practice",pathLine:a.label,deed:o.action,grave:"grave"===c})}catch(e){}setTimeout(function(){var e=document.getElementById("tab-"+c)||document.getElementById("main-content");if(e&&e.scrollIntoView)try{!(Date.now()<(window.__CLARITY_BOOT_TS||0)+1800)&&e.scrollIntoView({behavior:"smooth",block:"start"})}catch(e){}},220)}}},window.clarityOpenModuleSource=function(e){if(e)try{window.open(e,"_blank","noopener,noreferrer")}catch(e){}};var i=window.clarityRenderPaths;window.clarityRenderPaths=function(e){try{c(e)}catch(t){if(console.warn("Track OS render fallback",t),"function"==typeof i)try{i(e)}catch(e){}}};var r=window.claritySwitchTrack;window.claritySwitchTrack=function(e){if(e&&CLARITY_PATHS[e]){try{localStorage.setItem("clarity_path_override",e)}catch(e){}try{localStorage.setItem("clarity_committed_path",e)}catch(e){}try{localStorage.setItem("clarity_active_gate",e)}catch(e){}try{"function"==typeof window.clarityRequestPath?window.clarityRequestPath(e):"function"==typeof applyGateConfiguration&&applyGateConfiguration(e)}catch(e){}if("function"==typeof r&&r!==window.claritySwitchTrack)try{r(e)}catch(e){}if(c(e),"function"==typeof clarityRefreshDashboard)try{clarityRefreshDashboard()}catch(e){}if("function"==typeof clarityDailyLesson)try{clarityDailyLesson(!1)}catch(e){}}};var s=window.clarityToggleModule;function l(){a();var e=document.getElementById("path-board");if(e&&!e.hidden)c();else{var t=document.getElementById("clarity-learn-os");if(t&&!t.classList.contains("hidden"))try{c()}catch(e){}}}window.clarityToggleModule=function(e,t){if("function"==typeof s)try{s(e,t)}catch(e){}c(e)},"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(l,90)}):setTimeout(l,90),window.addEventListener("load",function(){setTimeout(l,180)})}();


/* ---- nuros-bridge-enrich-js.js ---- */
!function(){"use strict";if(!window.__NUROS_BRIDGE_ENRICH_V2__){window.__NUROS_BRIDGE_ENRICH_V2__=!0;try{navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&navigator.mediaDevices.getUserMedia._nurosGain&&delete navigator.mediaDevices.getUserMedia._nurosGain}catch(e){}window.nurosBridgeTranslate=async function(){var e=n("callig-bridge-en"),t=(n("callig-bridge-lang")||{}).value||"en",a=n("callig-bridge-ar");i("callig-bridge-status","Translating…");var l=await r(e&&e.value,t);a&&(a.textContent=l||"— could not translate (check network)"),window.calligLastArabic=l||"";var o=n("callig-english-input");o&&e&&(o.value=e.value);try{"function"==typeof calligTranslateToArabic&&calligTranslateToArabic()}catch(e){}i("callig-bridge-status",l?"Arabic ready · Place on pad":"Translate failed")},window.nurosBridgePlace=function(){var e=((n("callig-bridge-ar")||{}).textContent||"").trim();if(e&&0!==e.indexOf("—")){window.calligLastArabic=e;try{"function"==typeof calligPlaceArabicOnCanvas?calligPlaceArabicOnCanvas(e):"function"==typeof calligMicPlaceArabic?calligMicPlaceArabic():"function"==typeof calligTranslateToArabic&&calligTranslateToArabic()}catch(e){}i("callig-bridge-status","Sent to pad")}else window.nurosBridgeTranslate()},window.nurosBridgeWhisper=function(){i("callig-bridge-status","Using section Whisper mic…",!0);try{"function"==typeof calligMicToggle?calligMicToggle():"function"==typeof calligToggleVoiceCapture?calligToggleVoiceCapture():i("callig-bridge-status","Whisper mic not loaded — use 🎤 Start under the pad")}catch(e){i("callig-bridge-status","Mic error — use Start/Stop under the pad")}var e=0,t=setInterval(function(){e++;var a=n("callig-voice-text")||n("callig-english-input"),i=n("callig-bridge-en");a&&i&&(a.value||a.textContent)&&(i.value=(a.value||a.textContent||"").trim()),e>40&&clearInterval(t)},500)},window.nurosMemeTranslate=async function(){var e=n("meme-bridge-en"),t=(n("meme-bridge-lang")||{}).value||"en",a=n("meme-bridge-ar");i("meme-bridge-status","Translating…");var l=await r(e&&e.value,t);a&&(a.textContent=l||"—"),i("meme-bridge-status",l?"Arabic ready":"Failed")},window.nurosMemePlace=function(){var e=((n("meme-bridge-ar")||{}).textContent||"").trim();if(e){["meme-top-input","meme-mid-input","meme-box-top"].forEach(function(t){var a=n(t);a&&("value"in a?a.value=e:a.textContent=e)});try{"function"==typeof memeRender?memeRender():"function"==typeof memeRefresh&&memeRefresh()}catch(e){}i("meme-bridge-status","Applied to caption")}else window.nurosMemeTranslate()};var e=null,t=null,a=null;"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(c,100)}):setTimeout(c,100),window.addEventListener("load",function(){setTimeout(c,300)})}function n(e){try{return document.getElementById(e)}catch(e){return null}}function i(e,t,a){var i=n(e);i&&(i.textContent=t||"",i.classList.toggle("live",!!a))}async function r(e,t){if(!(e=(e||"").trim()))return"";t=t||"en";try{if("function"==typeof calligGoogleTranslate){var a=await calligGoogleTranslate(e,"auto"===t?"auto":t,"ar");if(a)return a}}catch(e){}try{if("function"==typeof clarityGoogleTranslate){var n=await clarityGoogleTranslate(e,"auto"===t?"en":t,"ar");if(n)return n}}catch(e){}try{var i="https://translate.googleapis.com/translate_a/single?client=gtx&sl="+encodeURIComponent("auto"===t?"auto":t)+"&tl=ar&dt=t&q="+encodeURIComponent(e),r=await fetch(i),l=await r.json();if(l&&l[0])return l[0].map(function(e){return e[0]}).join("")}catch(e){}return""}function l(){var e=n("tj-lmr-step3")||n("tj-lmr-step2");if(!e)return null;var t=e.querySelector(".tj-lmr-live-meter");return t||((t=document.createElement("div")).className="tj-lmr-live-meter",t.innerHTML='<div class="meter-label">Input level</div><div class="meter-track"><div class="meter-fill" id="tj-lmr-meter-fill-dup1"></div></div>',e.appendChild(t)),t}function o(){a&&cancelAnimationFrame(a),a=null;try{e&&"closed"!==e.state&&e.close()}catch(e){}e=null,t=null,document.querySelectorAll(".tj-lmr-live-meter").forEach(function(e){e.classList.remove("recording")}),document.querySelectorAll("#tj-lmr-meter-fill, .tj-lmr-live-meter .meter-fill").forEach(function(e){e.style.width="0%"})}function c(){var i,r;i=n("tj-lmr-rec-btn"),r=n("tj-lmr-rec-stop"),i&&!i._meterHook&&(i._meterHook=!0,i.addEventListener("click",function(){l();var n=setInterval(function(){try{window.__tjLmrState&&window.__tjLmrState.mediaRec,navigator.mediaDevices.getUserMedia({audio:!0}).then(function(n){!function(n){try{o(),l();var i=(e=new(window.AudioContext||window.webkitAudioContext)).createMediaStreamSource(n);(t=e.createAnalyser()).fftSize=512,t.smoothingTimeConstant=.3,i.connect(t);var r=new Uint8Array(t.fftSize);function c(){if(t){t.getByteTimeDomainData(r);for(var e=0,n=0;n<r.length;n++){var i=(r[n]-128)/128;e+=i*i}var l=Math.sqrt(e/r.length),o=Math.min(100,Math.round(350*l));document.querySelectorAll("#tj-lmr-meter-fill, .tj-lmr-live-meter .meter-fill").forEach(function(e){e.style.width=o+"%"}),a=requestAnimationFrame(c)}}document.querySelectorAll(".tj-lmr-live-meter").forEach(function(e){e.classList.add("recording")}),c()}catch(u){console.warn("meter",u)}}(n),window.__tjLmrMeterStream=n}).catch(function(){})}catch(e){}clearInterval(n)},350)},!0)),r&&!r._meterHook&&(r._meterHook=!0,r.addEventListener("click",function(){o();try{window.__tjLmrMeterStream&&(window.__tjLmrMeterStream.getTracks().forEach(function(e){e.stop()}),window.__tjLmrMeterStream=null)}catch(e){}},!0)),function(){function e(){var e=document.getElementById("banner-live"),t=document.getElementById("banner-media"),a=document.getElementById("banner-live-status");if(e)if("file:"!==location.protocol){e.setAttribute("allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),e.setAttribute("allowfullscreen","true"),e.setAttribute("referrerpolicy","strict-origin-when-cross-origin");var n="madinah"===((document.getElementById("live-place-select")||{}).value||"makkah")?"27cln-IxOGo":"Rs7St51oDDc";e.src="https://www.youtube-nocookie.com/embed/"+n+"?autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0",t&&(t.classList.add("live-active"),t.classList.remove("live-fallback"),t.style.pointerEvents="auto"),e.style.opacity="1",e.style.pointerEvents="auto",e.style.zIndex="6",a&&(a.textContent="Live")}else a&&(a.textContent="Use hosted HTTPS for in-banner live")}if(window.officialLiveEmbedUrl=function(e){var t=(document.getElementById("live-place-select")||{}).value||"makkah",a={makkah:"Rs7St51oDDc",madinah:"27cln-IxOGo",haramain:"ATMosZ7Xq1c"},n=e&&"video"===e.kind&&e.id?e.id:a[t]||a.makkah;return"https://www.youtube-nocookie.com/embed/"+encodeURIComponent(n)+"?autoplay=0&mute=1&controls=1&modestbranding=1&playsinline=1&rel=0&enablejsapi=1"},"function"==typeof window.tryBannerLiveEmbed&&(window.tryBannerLiveEmbed,window.tryBannerLiveEmbed=function(){}),"function"==typeof window.toggleHaramainLive&&!window.toggleHaramainLive._v2){var t=window.toggleHaramainLive;window.toggleHaramainLive=function(){try{try{localStorage.getItem("clarity_haramain_live")}catch(e){}var a=t.apply(this,arguments);return setTimeout(function(){try{"off"!==localStorage.getItem("clarity_haramain_live")&&e()}catch(e){}},100),a}catch(e){return t.apply(this,arguments)}},window.toggleHaramainLive._v2=!0}document.querySelectorAll("#live-haramain-btn, #banner-live-chip, .live-haramain-btn").forEach(function(t){t._liveWire||(t._liveWire=!0,t.addEventListener("click",function(){setTimeout(e,150)},!0))})}()}}();


/* ---- clarity-seeker-ease-v1.js ---- */
/**
 * Clarity Seeker Ease v1 — first-session comfort + one sincere deed
 * Lightweight, Seeker-safe, no path unlock required.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SEEKER_EASE_V1__) return;
  w.__CLARITY_SEEKER_EASE_V1__ = true;

  var KEY = "clarity_seeker_ease_v1";
  var DEED_KEY = "clarity_one_deed_day";

  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }
  function today() {
    try { return new Date().toDateString(); } catch (e) { return "x"; }
  }

  var DEEDS = [
    { ar: "استغفر الله", en: "One sincere istighfār" },
    { ar: "سبحان الله", en: "Say Subḥānallāh with presence" },
    { ar: "الحمد لله", en: "Thank Allah for one blessing" },
    { ar: "اللهم صل على محمد", en: "One ṣalawāt upon the Prophet ﷺ" },
    { ar: "بسم الله", en: "Begin the next act with Bismillāh" },
    { ar: "حسبي الله", en: "Remind the heart: Ḥasbiyallāh" }
  ];

  function pickDeed() {
    var i = Math.floor(Math.random() * DEEDS.length);
    return DEEDS[i];
  }

  function ensureChip() {
    if (document.getElementById("clarity-one-deed-chip")) return;
    var d = pickDeed();
    var stored = lsGet(DEED_KEY);
    var day = today();
    if (stored && stored.indexOf(day) === 0) {
      try { d = JSON.parse(stored.slice(day.length + 1)); } catch (e) {}
    } else {
      lsSet(DEED_KEY, day + "|" + JSON.stringify(d));
    }

    var el = document.createElement("div");
    el.id = "clarity-one-deed-chip";
    el.setAttribute("role", "status");
    el.style.cssText = "position:fixed;bottom:1.1rem;right:1rem;z-index:9997;max-width:min(92vw,280px);background:rgba(26,46,36,.94);color:#e7efe9;padding:.65rem .9rem;border-radius:14px;font:600 13px/1.35 system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.28);backdrop-filter:blur(8px);opacity:0;transform:translateY(8px);transition:opacity .35s,transform .35s";
    el.innerHTML = '<div style="opacity:.75;font-size:11px;margin-bottom:.2rem">Today · one sincere deed</div>' +
      '<div style="font-family:Scheherazade New,serif;font-size:1.15rem;direction:rtl">' + (d.ar || "") + "</div>" +
      '<div style="margin-top:.25rem;font-weight:500;opacity:.92">' + (d.en || "") + "</div>" +
      '<button type="button" id="clarity-deed-done" style="margin-top:.55rem;border:0;background:#c9a227;color:#1a2e24;font:700 12px system-ui;padding:.35rem .7rem;border-radius:999px;cursor:pointer">Done · الحمد لله</button>';
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    var btn = document.getElementById("clarity-deed-done");
    if (btn) btn.addEventListener("click", function () {
      el.style.opacity = "0";
      setTimeout(function () { el.remove(); }, 320);
      lsSet(KEY, "welcomed");
    });
    // Auto-hide after 14s if untouched
    setTimeout(function () {
      if (el.parentNode && el.style.opacity !== "0") {
        el.style.opacity = "0";
        setTimeout(function () { try { el.remove(); } catch (e) {} }, 400);
      }
    }, 14000);
  }

  function firstVisitTip() {
    if (lsGet(KEY) === "welcomed") return;
    // Delay so shell paints first
    setTimeout(ensureChip, 1600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", firstVisitTip);
  } else {
    firstVisitTip();
  }

  w.ClaritySeekerEase = { showDeed: ensureChip, version: "20261009CAMPUS4" };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-dhikr-rail-v1.js ---- */
/**
 * Clarity Dhikr Rail v2 — tab-colored chip, seeker-ease style, rises from pressed pill
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DHIKR_RAIL_V2__) return;
  w.__CLARITY_DHIKR_RAIL_V2__ = true;
  var VER = "20261009CAMPUS4";

  var MAP = {
    reminder: {
      ar: "سُبْحَانَ اللَّهِ", en: "Subḥānallāh", note: "Glory be to Allah",
      bg: "linear-gradient(145deg,#1a4d3a 0%,#0d4f3c 55%,#163e32 100%)",
      accent: "#6bc49a", border: "rgba(107,196,154,.45)"
    },
    reality: {
      ar: "الْحَمْدُ لِلَّهِ", en: "Alḥamdulillāh", note: "All praise is for Allah",
      bg: "linear-gradient(145deg,#1e3a5f 0%,#243b55 55%,#1a2f45 100%)",
      accent: "#7eb6e8", border: "rgba(126,182,232,.45)"
    },
    reflection: {
      ar: "لَا إِلَٰهَ إِلَّا اللَّهُ", en: "Lā ilāha illallāh", note: "There is no god but Allah",
      bg: "linear-gradient(145deg,#3d2a55 0%,#4a3560 55%,#2f2140 100%)",
      accent: "#c4a0e8", border: "rgba(196,160,232,.45)"
    },
    action: {
      ar: "اللَّهُ أَكْبَرُ", en: "Allāhu akbar", note: "Allah is the Greatest",
      bg: "linear-gradient(145deg,#5c3a12 0%,#6b4423 55%,#4a3010 100%)",
      accent: "#e8c47a", border: "rgba(232,196,122,.5)"
    },
    notes: {
      ar: "أَسْتَغْفِرُ اللَّهَ", en: "Astaghfirullāh", note: "I seek Allah's forgiveness",
      bg: "linear-gradient(145deg,#1a2e24 0%,#243830 55%,#152019 100%)",
      accent: "#c9a227", border: "rgba(201,162,39,.5)"
    },
    vault: null,
    amana: null
  };
  MAP.vault = MAP.notes;
  MAP.amana = MAP.notes;

  var hideT = null, lastKey = "", lastAt = 0;

  function removeChip() {
    var el = document.getElementById("clarity-dhikr-rail-chip");
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = (el.dataset.baseTransform || "translateX(-50%)") + " translateY(12px) scale(.96)";
    setTimeout(function () { try { el.remove(); } catch (e) {} }, 300);
  }

  function show(key, fromEl) {
    var d = MAP[key];
    if (!d) return;
    var now = Date.now();
    if (key === lastKey && now - lastAt < 850) return;
    lastKey = key;
    lastAt = now;
    removeChip();
    if (hideT) clearTimeout(hideT);

    var el = document.createElement("div");
    el.id = "clarity-dhikr-rail-chip";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");

    // Origin: rise from the pressed tab pill when possible
    var left = "50%";
    var baseT = "translateX(-50%)";
    try {
      if (fromEl && fromEl.getBoundingClientRect) {
        var r = fromEl.getBoundingClientRect();
        if (r.width > 0) {
          left = Math.round(r.left + r.width / 2) + "px";
          baseT = "translateX(-50%)";
        }
      }
    } catch (e) {}

    el.dataset.baseTransform = baseT;
    el.style.cssText =
      "position:fixed;bottom:4.5rem;left:" + left + ";z-index:9997;" +
      "max-width:min(92vw,280px);min-width:11rem;" +
      "background:" + d.bg + ";color:#e7efe9;" +
      "padding:.65rem .9rem;border-radius:14px;" +
      "font:600 13px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;" +
      "box-shadow:0 8px 28px rgba(0,0,0,.28),0 0 0 1px " + d.border + ",0 -6px 20px " + d.border.replace(")", ",.12)").replace("rgba", "rgba") + ";" +
      "backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);" +
      "opacity:0;transform:" + baseT + " translateY(14px) scale(.94);" +
      "transition:opacity .35s ease,transform .35s ease;text-align:center;pointer-events:auto;" +
      "border:1px solid " + d.border + ";";

    // little tail pointing to tab
    el.innerHTML =
      '<div style="position:absolute;bottom:-6px;left:50%;transform:translateX(-50%) rotate(45deg);width:12px;height:12px;background:inherit;border-right:1px solid ' + d.border + ';border-bottom:1px solid ' + d.border + ';border-radius:2px"></div>' +
      '<div style="opacity:.8;font-size:11px;margin-bottom:.2rem;color:' + d.accent + '">Dhikr · remember</div>' +
      '<div style="font-family:Scheherazade New,serif;font-size:1.2rem;direction:rtl;line-height:1.45">' + d.ar + "</div>" +
      '<div style="margin-top:.25rem;font-weight:500;opacity:.95">' + d.en + "</div>" +
      '<div style="opacity:.72;font-size:11px;margin-top:.15rem">' + d.note + "</div>";

    el.addEventListener("click", removeChip);
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.style.opacity = "1";
      el.style.transform = baseT + " translateY(0) scale(1)";
    });
    hideT = setTimeout(removeChip, 4500);
  }

  function keyFromTarget(t) {
    if (!t || !t.closest) return null;
    var btn = t.closest("[data-rail-tab], [data-rrra], .door-rail-btn");
    if (!btn) return null;
    return { key: btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra"), el: btn };
  }

  function bind() {
    var rail = document.getElementById("clarity-door-rail");
    if (rail) {
      rail.addEventListener("click", function (ev) {
        var info = keyFromTarget(ev.target);
        if (info && info.key) show(info.key, info.el);
      }, true);
    }
    function wrap() {
      var fn = w.clarityOpenSectionDoor;
      if (typeof fn === "function" && !fn.__dhikrWrapped) {
        var wrapped = function (tab) {
          try {
            var btn = document.querySelector('[data-rail-tab="' + tab + '"]') ||
              document.querySelector('[data-rrra="' + tab + '"]');
            if (tab) show(String(tab), btn);
          } catch (e) {}
          return fn.apply(this, arguments);
        };
        wrapped.__dhikrWrapped = true;
        w.clarityOpenSectionDoor = wrapped;
      }
    }
    wrap();
    setTimeout(wrap, 600);
    setTimeout(wrap, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.ClarityDhikrRail = { version: VER, show: show, map: MAP };
})(typeof window !== "undefined" ? window : this);


/* ---- clarity-ui-shine-v1.js ---- */
!function(){"use strict";function t(){try{var t=document.querySelector(".clarity-gate-switcher.rrra-sitewide, .clarity-gate-switcher");if(!t)return;t.classList.add("cgp-track-plaque");return;/* GATE OBLITERATED — no DOM moves */var n=t.querySelector(".cgp-intro");n||(n=t.querySelector("p"));var a=t.querySelector(".cgp-track-row");a||((a=document.createElement("div")).className="cgp-track-row",t.appendChild(a));var r=t.querySelector(".cgs-label"),e=Array.prototype.slice.call(t.querySelectorAll(".cgs-btn"));if(r&&r.parentNode!==a&&!r.contains(a))try{a.appendChild(r)}catch(t){}if(e.forEach(function(t){if(t.parentNode!==a&&!t.contains(a))try{a.appendChild(t)}catch(t){}}),!a.querySelector('[data-gate="seeker"]')){var i=document.createElement("button");i.type="button",i.className="cgs-btn cgs-seeker",i.setAttribute("data-gate","seeker"),i.onclick=function(){window.claritySwitchGate&&window.claritySwitchGate("seeker")},i.innerHTML='<span class="cgs-txt"><span class="cgs-num">1</span> Seeker</span>',a.insertBefore(i,a.querySelector('[data-gate="new_muslim"]')||a.firstChild)}if(n&&n.parentNode===t&&a&&!n.contains(a))try{t.insertBefore(n,a)}catch(t){}}catch(t){}}function n(){try{document.querySelectorAll(".temp-live, #place-temp, #place-temp-alt").forEach(function(t){var n=(t.textContent||"").trim();n&&"—°C"!==n&&"Loading..."!==n&&(n=n.replace(/°C\s*°C/g,"°C").replace(/\s+/g," "),t.textContent=n)}),document.querySelectorAll(".hijri-cal-meta, .banner-event-strip, .banner-mobile-strip").forEach(function(t){var n=(t.textContent||"").replace(/\s+/g," ").trim();t.textContent=n})}catch(t){}}function a(){try{var t=document.getElementById("clarity-visit-pill-bar"),n=document.getElementById("clarity-top-duo");if(!t||!n||!n.parentNode)return;t.previousElementSibling!==n&&(n.nextSibling?n.parentNode.insertBefore(t,n.nextSibling):n.parentNode.appendChild(t)),t.style.setProperty("position","relative","important"),t.style.setProperty("top","auto","important"),t.style.setProperty("bottom","auto","important"),t.style.setProperty("left","auto","important"),t.style.setProperty("right","auto","important"),t.style.setProperty("transform","none","important"),t.style.setProperty("margin-top","0","important"),t.style.setProperty("z-index","12","important");var a=n.querySelector(".banner");a&&a.style.setProperty("max-height","none","important")}catch(t){}}function r(){try{var t=document.getElementById("clarity-visit-pill-bar");if(!t)return;var n=document.querySelector("#clarity-top-duo .banner, .banner"),a=document.getElementById("clarity-top-duo");n&&n.contains(t)&&a?a.nextSibling?a.parentNode.insertBefore(t,a.nextSibling):a.parentNode.appendChild(t):a&&t.previousElementSibling!==a&&a.contains(t)}catch(t){}}function e(){var e;(e=document.getElementById("clarity-ui-shine-css"))||((e=document.createElement("style")).id="clarity-ui-shine-css",(document.head||document.documentElement).appendChild(e)),e.textContent='\n/* ===== Pan/scroll restored — do not lock touch-action on document ===== */\nhtml, body {\n  touch-action: auto !important;\n  -ms-touch-action: auto !important;\n  overflow-x: hidden !important;\n  overflow-y: auto !important;\n  height: auto !important;\n  min-height: 100% !important;\n  overscroll-behavior-y: auto !important;\n}\n.page-wrapper, .main-content, .tab-panel, #main-application-workspace {\n  touch-action: auto !important;\n  overflow: visible !important;\n}\n/* Only nav chrome uses manipulation (faster taps, no double-zoom) */\n.nav-tabs, #clarity-door-rail, .mobile-bottom-nav, .stream-controls, .cgs-btn {\n  touch-action: manipulation !important;\n}\n\n/* ===== Track plaque: intro ABOVE, all phases ONE strip ===== */\n.cgp-intro, .clarity-gate-switcher .cgp-intro, p.cgp-intro {\n  display: block !important;\n  width: 100% !important;\n  flex: 0 0 100% !important;\n  margin: 0.25rem 0 0.45rem !important;\n  padding: 0 !important;\n  font-size: 0.8rem !important;\n  line-height: 1.45 !important;\n  opacity: 0.9 !important;\n  background: none !important;\n  border: none !important;\n  box-shadow: none !important;\n}\n.clarity-gate-switcher.rrra-sitewide,\n.clarity-gate-switcher,\n.cgp-track-plaque {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: stretch !important;\n  gap: 0.4rem !important;\n  margin: 0.55rem 0 0.85rem !important;\n  padding: 0.65rem 0.75rem !important;\n  border-radius: 16px !important;\n  background: linear-gradient(145deg, rgba(255,253,248,0.98), rgba(232,242,236,0.94)) !important;\n  border: 1px solid rgba(13,79,60,0.2) !important;\n  box-shadow: 0 4px 16px rgba(13,50,40,0.08), inset 0 1px 0 rgba(255,255,255,0.9) !important;\n}\n.cgp-track-row {\n  display: flex !important;\n  flex-wrap: nowrap !important;\n  align-items: center !important;\n  gap: 0.35rem !important;\n  overflow-x: auto !important;\n  -webkit-overflow-scrolling: touch !important;\n  padding-bottom: 0.1rem !important;\n  width: 100% !important;\n}\n.cgp-track-row .cgs-label {\n  flex-shrink: 0 !important;\n  font-size: 0.65rem !important;\n  font-weight: 800 !important;\n  letter-spacing: 0.06em !important;\n  text-transform: uppercase !important;\n  color: #0d4f3c !important;\n  margin: 0 0.15rem 0 0 !important;\n}\n.cgp-track-row .cgs-btn {\n  flex: 0 0 auto !important;\n  white-space: nowrap !important;\n  border-radius: 999px !important;\n  padding: 0.34rem 0.65rem !important;\n  font-size: 0.72rem !important;\n  font-weight: 700 !important;\n  border: 1.5px solid transparent !important;\n}\n.cgs-seeker, .cgs-btn[data-gate="seeker"] {\n  background: linear-gradient(180deg,#f8f0d8,#f0e4c0) !important;\n  color: #6a4a18 !important; border-color: #d4b45a !important;\n}\n.cgs-new_muslim, .cgs-btn[data-gate="new_muslim"], .cgs-new {\n  background: linear-gradient(180deg,#d8f5e8,#c0ecd8) !important;\n  color: #0a3d2e !important; border-color: #5a9e7a !important;\n}\n.cgs-practicing, .cgs-btn[data-gate="practicing"], .cgs-daily {\n  background: linear-gradient(180deg,#d8eef5,#c0e0ec) !important;\n  color: #1a4a5a !important; border-color: #4a8ab0 !important;\n}\n.cgs-dai, .cgs-btn[data-gate="dai"] {\n  background: linear-gradient(180deg,#e8e0f5,#d8d0ec) !important;\n  color: #3a2a5a !important; border-color: #7a6ab0 !important;\n}\n.cgs-reset {\n  background: rgba(13,79,60,0.08) !important;\n  color: #0d4f3c !important; border-color: rgba(13,79,60,0.25) !important;\n}\n.cgs-btn.active, .cgs-btn.is-active {\n  box-shadow: 0 0 0 2px rgba(13,79,60,0.28), 0 2px 8px rgba(0,0,0,0.1) !important;\n}\n\nhtml[data-theme="dark"] .clarity-gate-switcher,\nhtml[data-theme="dark"] .cgp-track-plaque {\n  background: linear-gradient(145deg, rgba(18,28,24,0.96), rgba(12,22,18,0.94)) !important;\n  border-color: rgba(212,180,90,0.28) !important;\n}\nhtml[data-theme="dark"] .cgp-track-row .cgs-label { color: #d4b45a !important; }\n\n/* ===== Hub plaques (tab intros) ===== */\n.rrra-hub-hero {\n  border-radius: 18px !important;\n  padding: 1rem 1.15rem !important;\n  margin: 0.35rem 0 0.55rem !important;\n  box-shadow: 0 6px 18px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.55) !important;\n}\n.rrra-hub-summary {\n  border-radius: 14px !important;\n  padding: 0.65rem 0.9rem !important;\n  margin: 0 0 0.65rem !important;\n  font-size: 0.84rem !important;\n  line-height: 1.45 !important;\n}\n#tab-reminder .rrra-hub-hero {\n  background: linear-gradient(145deg, #d8f0e4, #e8f8f0) !important;\n  border: 1px solid rgba(13,79,60,0.28) !important;\n}\n#tab-reminder .rrra-hub-hero h2 { color: #0d4f3c !important; }\n#tab-reminder .rrra-hub-summary {\n  background: #eef8f2 !important;\n  border: 1px solid rgba(13,79,60,0.18) !important;\n}\n#tab-reality .rrra-hub-hero {\n  background: linear-gradient(145deg, #f5edd6, #faf6e8) !important;\n  border: 1px solid rgba(184,146,42,0.4) !important;\n}\n#tab-reality .rrra-hub-hero h2 { color: #8a6a28 !important; }\n#tab-reality .rrra-hub-summary {\n  background: #faf6e8 !important;\n  border: 1px solid rgba(184,146,42,0.28) !important;\n}\n#tab-reflection .rrra-hub-hero {\n  background: linear-gradient(145deg, #e4f0d4, #eef5e0) !important;\n  border: 1px solid rgba(61,122,53,0.35) !important;\n}\n#tab-reflection .rrra-hub-hero h2 { color: #2c4a3a !important; }\n#tab-reflection .rrra-hub-summary {\n  background: #eef5e0 !important;\n  border: 1px solid rgba(61,122,53,0.25) !important;\n}\n#tab-action .rrra-hub-hero {\n  background: linear-gradient(145deg, #e0f0f5, #e8f4fa) !important;\n  border: 1px solid rgba(42,95,122,0.35) !important;\n}\n#tab-action .rrra-hub-hero h2 { color: #2a5f7a !important; }\n#tab-action .rrra-hub-summary {\n  background: #e8f4fa !important;\n  border: 1px solid rgba(42,95,122,0.25) !important;\n}\n\n/* Bottom nav colors */\n.door-rail-btn.rrra-rail-rem { background: linear-gradient(180deg,#1a6b52,#0d4f3c) !important; color:#f0faf4 !important; }\n.door-rail-btn.rrra-rail-real { background: linear-gradient(180deg,#b8922a,#8a6a28) !important; color:#1a1208 !important; }\n.door-rail-btn.rrra-rail-refl { background: linear-gradient(180deg,#3d7a35,#2c4a3a) !important; color:#f0f8e8 !important; }\n.door-rail-btn.rrra-rail-act { background: linear-gradient(180deg,#356a90,#2a5f7a) !important; color:#f0f8fc !important; }\n.door-rail-btn.rrra-rail-vault { background: linear-gradient(180deg,#5a4a90,#4a3a70) !important; color:#f4f0fc !important; }\n.door-rail-btn.active {\n  box-shadow: 0 0 0 2px rgba(255,255,255,0.5) !important;\n  filter: brightness(1.08);\n}\n\n/* ===== Banner declutter: calendar / salah / temps ===== */\n.banner-side {\n  max-width: 7.5rem !important;\n  width: 7.2rem !important;\n  overflow: hidden !important;\n}\n.hijri-cal-section, .salah-times-section {\n  padding: 0.28rem 0.32rem !important;\n  overflow: hidden !important;\n}\n.hijri-cal-grid {\n  font-size: 0.52rem !important;\n  gap: 0 !important;\n  line-height: 1.1 !important;\n}\n.hijri-cal-grid .day, .hijri-cal-grid .dow {\n  padding: 0.06rem 0 !important;\n}\n.hijri-cal-meta, .salah-meta {\n  font-size: 0.55rem !important;\n  margin-top: 0.08rem !important;\n  line-height: 1.2 !important;\n  max-height: 2.4em !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n}\n.hijri-local-time { font-size: 0.7rem !important; margin-top: 0.1rem !important; }\n.hijri-local-loc {\n  font-size: 0.5rem !important;\n  max-width: 100% !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n  opacity: 0.85 !important;\n}\n.salah-times-list { font-size: 0.56rem !important; }\n.salah-times-list li { padding: 0.06rem 0 !important; }\n.salah-times-list .salah-time {\n  font-size: 0.52rem !important;\n  padding: 0.02rem 0.2rem !important;\n}\n/* Hide duplicate temp noise in place-name / side if double-filled */\n.banner-side .temp-live + .temp-live { display: none !important; }\n#place-temp-alt:empty, #place-temp:empty { display: none !important; }\n/* Festival strip: single line, no wrap flood */\n.banner-event-strip, .banner-mobile-strip {\n  font-size: 0.62rem !important;\n  max-width: 100% !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n\n/* ===== Banner vs visit strip — no overlap with volume/stream row ===== */\n#clarity-top-duo {\n  position: relative !important;\n  z-index: 20 !important;\n  overflow: visible !important;\n  margin-bottom: 0 !important;\n  padding-bottom: 0 !important;\n}\n#clarity-top-duo .banner {\n  overflow: hidden !important;\n  /* room for stream row inside overlay */\n  padding-bottom: 0 !important;\n}\n#clarity-top-duo .banner-overlay {\n  padding-bottom: 0.45rem !important;\n}\n#clarity-top-duo .banner-center {\n  padding-bottom: 0.15rem !important;\n}\n#clarity-top-duo .stream-controls {\n  position: relative !important;\n  z-index: 6 !important;\n  margin-top: 0.35rem !important;\n  margin-bottom: 0.15rem !important;\n  flex-wrap: wrap !important;\n  justify-content: center !important;\n  gap: 0.3rem !important;\n  max-width: 100% !important;\n}\n#clarity-top-duo .volume-control {\n  display: inline-flex !important;\n  align-items: center !important;\n  position: relative !important;\n  z-index: 7 !important;\n  flex-shrink: 0 !important;\n  background: rgba(255,255,255,0.22) !important;\n  border-radius: 18px !important;\n  padding: 0.22rem 0.55rem !important;\n}\n#clarity-top-duo .volume-control input[type="range"] {\n  width: 52px !important;\n  min-width: 44px !important;\n}\n\n/* Visit / LAST strip sits fully BELOW banner — never over stream controls */\n#clarity-visit-pill-bar,\n.cv-stitched-banner {\n  position: relative !important;\n  z-index: 15 !important;\n  clear: both !important;\n  display: flex !important;\n  margin: 0 !important;\n  margin-top: 0 !important;\n  transform: none !important;\n  top: auto !important;\n  /* pull out of any negative overlap */\n  border-top: 1px solid rgba(13,79,60,0.12) !important;\n}\n/* If strip was absolutely positioned over banner, kill that */\n#clarity-top-duo #clarity-visit-pill-bar,\n.banner #clarity-visit-pill-bar {\n  position: relative !important;\n  inset: auto !important;\n}\n\n/* Ensure main content starts cleanly under strip */\n#clarity-visit-pill-bar + *,\n#main-application-workspace,\n.page-wrapper {\n  position: relative !important;\n  z-index: 2 !important;\n}\n\n\n/* ===== Night: intro plaques + track strip match dark chrome ===== */\nhtml[data-theme="dark"] .rrra-hub-hero,\nhtml[data-theme="dark"] #tab-reminder .rrra-hub-hero {\n  background: linear-gradient(145deg, #0e2820, #0a1c16) !important;\n  border: 1px solid rgba(212,180,90,0.22) !important;\n  color: #e8f0ea !important;\n}\nhtml[data-theme="dark"] #tab-reminder .rrra-hub-hero h2 { color: #7dcea0 !important; }\nhtml[data-theme="dark"] #tab-reminder .rrra-hub-sub,\nhtml[data-theme="dark"] #tab-reminder .rrra-hub-meta { color: #c8ddd0 !important; }\nhtml[data-theme="dark"] #tab-reminder .rrra-hub-summary {\n  background: rgba(20,36,28,0.95) !important;\n  border: 1px solid rgba(212,180,90,0.15) !important;\n  color: #d0e4d8 !important;\n}\nhtml[data-theme="dark"] #tab-reality .rrra-hub-hero {\n  background: linear-gradient(145deg, #2a2210, #1a160c) !important;\n  border-color: rgba(212,180,90,0.35) !important;\n  color: #f5edd6 !important;\n}\nhtml[data-theme="dark"] #tab-reality .rrra-hub-hero h2 { color: #e8d48a !important; }\nhtml[data-theme="dark"] #tab-reality .rrra-hub-summary {\n  background: rgba(40,32,16,0.95) !important;\n  border-color: rgba(212,180,90,0.2) !important;\n  color: #e8dcc0 !important;\n}\nhtml[data-theme="dark"] #tab-reflection .rrra-hub-hero {\n  background: linear-gradient(145deg, #142414, #0c180c) !important;\n  border-color: rgba(120,180,100,0.3) !important;\n  color: #e4f0d4 !important;\n}\nhtml[data-theme="dark"] #tab-reflection .rrra-hub-hero h2 { color: #a8d48a !important; }\nhtml[data-theme="dark"] #tab-reflection .rrra-hub-summary {\n  background: rgba(20,32,18,0.95) !important;\n  color: #d4e8c8 !important;\n}\nhtml[data-theme="dark"] #tab-action .rrra-hub-hero {\n  background: linear-gradient(145deg, #0c2428, #0a1a1c) !important;\n  border-color: rgba(80,140,180,0.35) !important;\n  color: #e0f0f5 !important;\n}\nhtml[data-theme="dark"] #tab-action .rrra-hub-hero h2 { color: #7ec8e0 !important; }\nhtml[data-theme="dark"] #tab-action .rrra-hub-summary {\n  background: rgba(12,28,32,0.95) !important;\n  color: #c8e4ec !important;\n}\n\nhtml[data-theme="dark"] .clarity-gate-switcher,\nhtml[data-theme="dark"] .cgp-track-plaque {\n  background: linear-gradient(145deg, rgba(18,28,24,0.98), rgba(12,20,16,0.96)) !important;\n  border: 1px solid rgba(212,180,90,0.28) !important;\n  color: #e8f0ea !important;\n}\nhtml[data-theme="dark"] .cgp-intro,\nhtml[data-theme="dark"] p.cgp-intro {\n  color: #c8ddd0 !important;\n  opacity: 1 !important;\n}\nhtml[data-theme="dark"] .cgp-track-row .cgs-label { color: #d4b45a !important; }\nhtml[data-theme="dark"] .cgs-reset {\n  background: rgba(212,180,90,0.12) !important;\n  color: #e8d48a !important;\n  border-color: rgba(212,180,90,0.35) !important;\n}\n\n/* Reset pill always tappable */\n.cgs-reset, #clarity-path-reset-btn {\n  pointer-events: auto !important;\n  cursor: pointer !important;\n  opacity: 1 !important;\n  flex-shrink: 0 !important;\n}\n\n/* Bottom nav fonts — readable desktop + mobile */\n#clarity-door-rail.door-rail-bottom .door-rail-btn,\n#clarity-door-rail .door-rail-btn {\n  font-size: 0.78rem !important;\n  min-height: 2.75rem !important;\n  padding: 0.4rem 0.55rem !important;\n}\n#clarity-door-rail .dr-label {\n  font-size: 0.78rem !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.01em !important;\n}\n#clarity-door-rail .dr-ico {\n  font-size: 1rem !important;\n}\n@media (min-width: 901px) {\n  #clarity-door-rail.door-rail-bottom .door-rail-btn,\n  #clarity-door-rail .door-rail-btn {\n    font-size: 0.88rem !important;\n    min-height: 3rem !important;\n    padding: 0.5rem 0.75rem !important;\n  }\n  #clarity-door-rail .dr-label { font-size: 0.88rem !important; }\n  #clarity-door-rail .dr-ico { font-size: 1.1rem !important; }\n}\n.mobile-bottom-nav .mb-tab {\n  font-size: 0.72rem !important;\n  font-weight: 700 !important;\n}\n.mobile-bottom-nav .mb-tab .mb-icon { font-size: 1.2rem !important; }\n@media (min-width: 901px) {\n  .mobile-bottom-nav .mb-tab { font-size: 0.82rem !important; }\n}\n\n/* Live iframe must paint above stills */\n#banner-media.live-active #banner-live,\n#banner-media.live-active .banner-live {\n  opacity: 1 !important;\n  visibility: visible !important;\n  display: block !important;\n  z-index: 5 !important;\n  pointer-events: none !important;\n  width: 100% !important;\n  height: 100% !important;\n}\n#banner-media.live-active img,\n#banner-media.live-active .banner-still-fallback {\n  opacity: 0 !important;\n  z-index: 0 !important;\n}\n\n\n/* ===== Desktop: snug content to viewport edges ===== */\n@media (min-width: 901px) {\n  .page-wrapper,\n  #main-content,\n  .main-content,\n  #main-application-workspace {\n    max-width: none !important;\n    width: 100% !important;\n    padding-left: 0.85rem !important;\n    padding-right: 0.85rem !important;\n    margin-left: 0 !important;\n    margin-right: 0 !important;\n  }\n  .tab-panel.active,\n  .rrra-hub-body,\n  #tab-reminder, #tab-reality, #tab-reflection, #tab-action, #tab-notes {\n    max-width: none !important;\n    width: 100% !important;\n  }\n  .card, .rrra-hub-hero, .rrra-hub-summary, .cgp-track-plaque {\n    max-width: none !important;\n  }\n  /* slight side padding only so text isn\'t glued to chrome */\n  #main-application-workspace > .tab-panel {\n    padding-left: 0.25rem !important;\n    padding-right: 0.25rem !important;\n  }\n}\n@media (min-width: 1200px) {\n  .page-wrapper,\n  #main-content {\n    padding-left: 1rem !important;\n    padding-right: 1rem !important;\n  }\n}\n\n/* ===== Snappy phase transitions (less baggy) ===== */\n.tab-panel {\n  transition: opacity 0.18s ease, transform 0.18s ease !important;\n}\n.tab-panel:not(.active) {\n  display: none !important;\n}\n.tab-panel.active {\n  display: block !important;\n  animation: clarityTabIn 0.2s ease both;\n}\n@keyframes clarityTabIn {\n  from { opacity: 0.55; transform: translateY(6px); }\n  to { opacity: 1; transform: none; }\n}\n.gate-hidden {\n  transition: none !important;\n}\n.cgs-btn, .gps-btn {\n  transition: box-shadow 0.12s ease, transform 0.1s ease, filter 0.12s ease !important;\n}\n#clarity-path-quiz-modal {\n  transition: opacity 0.15s ease !important;\n}\n#clarity-path-quiz-modal .cpq-card {\n  transition: transform 0.15s ease !important;\n}\n.card {\n  transition: opacity 0.15s ease !important;\n}\n\n/* meme accent chip */\n.mv-chip.mv-accent {\n  background: linear-gradient(180deg, #1a6b52, #0d4f3c) !important;\n  color: #f0faf4 !important;\n  border-color: rgba(255,255,255,0.2) !important;\n}\n.clarity-to-meme-pill {\n  font-size: 0.72rem !important;\n  font-weight: 700 !important;\n  padding: 0.28rem 0.6rem !important;\n  border-radius: 999px !important;\n  cursor: pointer !important;\n}\n\n\n/* ===== Brand font restore ===== */\n.banner-center h1,\n.banner-title,\n.clarity-brand,\n#clarity-top-duo .banner-center .brand-name,\n#clarity-top-duo h1,\n.logo-text, .site-title {\n  font-family: \'Cormorant Garamond\', Georgia, \'Times New Roman\', serif !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.02em !important;\n}\n.rrra-hub-hero h2,\n.card h2 {\n  font-family: \'Cormorant Garamond\', Georgia, serif !important;\n}\n\n/* ===== Live: lighten overlay so stream is visible ===== */\n#banner-media.live-active ~ .banner-overlay,\n.banner:has(.live-active) .banner-overlay,\n#clarity-top-duo .banner:has(.live-active) .banner-overlay {\n  background: linear-gradient(to bottom, rgba(8,28,22,0.08), rgba(8,28,22,0.18)) !important;\n}\n#banner-media.live-active #banner-live,\n#banner-media.live-active .banner-live {\n  opacity: 1 !important;\n  z-index: 4 !important;\n}\n/* Keep center controls readable without blacking out video */\n#clarity-top-duo .banner-center {\n  background: transparent !important;\n}\n#clarity-top-duo .banner-center .rabbana-box,\n#clarity-top-duo .banner-center .verse-box {\n  background: rgba(8,28,22,0.45) !important;\n  backdrop-filter: blur(4px);\n}\n\n/* ===== Calendar + Salah: circular plaque icons ===== */\n.hijri-cal-section .cal-title,\n.salah-times-section .salah-title {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 0.25rem !important;\n}\n.hijri-cal-section,\n.salah-times-section {\n  border-radius: 16px !important;\n  background: rgba(0,0,0,0.28) !important;\n  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12) !important;\n}\n/* circular icon badges at top of side plaques */\n.banner-side .cal-title::before,\n.banner-side .salah-title::before {\n  content: none;\n}\n.banner-side .hijri-cal-section .cal-title,\n.banner-side .salah-times-section .salah-title {\n  width: auto !important;\n  margin: 0 auto 0.2rem !important;\n  padding: 0.2rem 0.45rem !important;\n  border-radius: 999px !important;\n  background: rgba(255,255,255,0.14) !important;\n  font-size: 0.65rem !important;\n}\n/* circular day cells for today */\n.hijri-cal-grid .day.today {\n  border-radius: 50% !important;\n  background: rgba(255,255,255,0.4) !important;\n}\n\n/* ===== Meme card never fully gate-hidden when practicing/dai ===== */\n/* Meme only when path allows — never force on Seeker */\nhtml[data-clarity-meme-ok="1"] #meme-card:not([data-gate-hidden="1"]) {\n  display: block !important;\n}\nhtml:not([data-clarity-meme-ok="1"]) #meme-card,\nhtml:not([data-clarity-meme-ok="1"]) #tweet-desk-card {\n  display: none !important;\n  visibility: hidden !important;\n}\n.clarity-to-meme-pill {\n  display: inline-flex !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  background: linear-gradient(180deg, #e8f5ee, #d4ecd8) !important;\n  color: #0a3d2e !important;\n  border: 1px solid #8fd4b0 !important;\n}\nhtml[data-theme="dark"] .clarity-to-meme-pill {\n  background: rgba(212,180,90,0.15) !important;\n  color: #e8d48a !important;\n  border-color: rgba(212,180,90,0.35) !important;\n}\n\n/* Surah dropdown readable */\n#surah-list-pill, #surah-reciter-pill {\n  max-width: 9.5rem !important;\n  color: #fff !important;\n}\n#surah-list-pill option, #surah-reciter-pill option {\n  color: #1a2a22 !important;\n  background: #fff !important;\n}\n\n/* Live button */\n.live-haramain-btn.on { background: #0f4c3a !important; }\n.live-haramain-btn.on .live-dot { background: #7dff9a !important; }\n\n@media (max-width: 900px) {\n  .banner-side { display: none !important; } /* mobile: less litter; salah often in strip */\n  .cgp-track-row { flex-wrap: nowrap !important; }\n}\n',t(),n(),function(){if(!window.__shineLiveWired){window.__shineLiveWired=!0;var t={makkah:"https://www.youtube-nocookie.com/embed/Rs7St51oDDc?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1",madinah:"https://www.youtube-nocookie.com/embed/27cln-IxOGo?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1"};window.toggleHaramainLive=function(){var t=document.getElementById("banner-media");t&&t.classList.contains("live-active")?i():o()};var n=document.getElementById("live-haramain-btn");n&&(n.onclick=function(t){t.preventDefault(),window.toggleHaramainLive()});var a=document.getElementById("live-place-select");a&&(a.onchange=function(){try{localStorage.setItem("clarity_haramain_place",r())}catch(t){}var t=document.getElementById("banner-media");t&&t.classList.contains("live-active")?o():i()})}function r(){try{return((document.getElementById("live-place-select")||{}).value||localStorage.getItem("clarity_haramain_place")||"makkah").toLowerCase()}catch(t){return"makkah"}}function e(t){var n=document.getElementById("live-haramain-btn"),a=document.getElementById("live-haramain-label");n&&n.classList.toggle("on",!!t),a&&(a.textContent=t?"Live":"Stills");try{localStorage.setItem("clarity_banner_live",t?"1":"0"),localStorage.setItem("clarity_haramain_live",t?"on":"off")}catch(t){}}function i(){var t=document.getElementById("banner-media"),n=document.getElementById("banner-live");if(t&&(t.classList.remove("live-active"),t.classList.add("live-fallback")),n){try{n.src="about:blank",n.removeAttribute("src")}catch(t){}n.setAttribute("hidden","")}e(!1);try{"function"==typeof setDailyBanner&&setDailyBanner("number"==typeof bannerPlaceIdx?bannerPlaceIdx:0)}catch(t){}}function o(){if("file:"!==location.protocol){var n=document.getElementById("banner-media");if(n){var a=document.getElementById("banner-live");a||((a=document.createElement("iframe")).id="banner-live",a.className="banner-live banner-live-iframe",a.title="Haramain live",a.setAttribute("allow","autoplay; encrypted-media; picture-in-picture; fullscreen"),a.setAttribute("allowfullscreen",""),n.appendChild(a));var o=r(),m=t[o]||t.makkah;a.removeAttribute("hidden"),a.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:0;opacity:1;z-index:5;",a.src=m,n.classList.add("live-active"),n.classList.remove("live-fallback"),e(!0)}}else i()}}(),function(){try{var n=document.getElementById("clarity-path-reset-btn")||document.querySelector(".cgs-reset");if(!n||n.__resetWired)return;n.addEventListener("click",function(n){n.preventDefault(),n.stopPropagation();try{"function"==typeof window.clarityPathResetToSeeker?window.clarityPathResetToSeeker():window.clarityPathProgress&&"function"==typeof window.clarityPathProgress.reset?window.clarityPathProgress.reset():(localStorage.setItem("clarity_path_unlocked_max","0"),localStorage.setItem("clarity_committed_path","seeker"),localStorage.removeItem("clarity_quiz_passed_v1"),"function"==typeof window.clarityRequestPath&&window.clarityRequestPath("seeker"))}catch(t){console.warn("reset",t)}try{t()}catch(t){}},!0),n.__resetWired=!0}catch(t){}}(),function(){try{var t=0;try{t=parseInt(localStorage.getItem("clarity_path_unlocked_max")||"0",10)||0}catch(t){}if(t<2)return;var n=document.getElementById("meme-card");if(!n)return;n.classList.remove("gate-hidden"),n.removeAttribute("data-gate-hidden"),n.style.removeProperty("display"),n.style.removeProperty("visibility")}catch(t){}}(),r(),a()}window.__CLARITY_UI_SHINE_V2__||(window.__CLARITY_UI_SHINE_V2__=!0,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",function(){setTimeout(e,60)}):setTimeout(e,60),window.addEventListener("load",function(){setTimeout(e,200),setTimeout(t,500),setTimeout(n,800),setTimeout(n,2500),setTimeout(r,100),setTimeout(r,600);var i=0,o=setInterval(function(){a(),++i>24&&clearInterval(o)},500)}))}();


;(function(g){
  "use strict";
  if (g.__CLARITY_SAFE_STUBS_V1__) return;
  g.__CLARITY_SAFE_STUBS_V1__ = true;
  function stub(name, impl) {
    if (typeof g[name] === "function") return;
    g[name] = typeof impl === "function" ? impl : function () {
      try { console.warn("[Clarity] " + name + " is not available in this build"); } catch (e) {}
    };
  }
  stub("clarityIsraeliyatDeepFetch");
  stub("clarityIsraeliyatExpandScholar");
  stub("claritySeerahMirrorDone");
  stub("claritySeerahMirrorNext");
  stub("claritySeerahMirrorNote");
  stub("claritySurpriseSurahReciter");
  stub("clarityTibbeNext");
  stub("uftPrintPedigreeView", function () {
    try {
      if (typeof g.uftPrintFamilySheet === "function") return g.uftPrintFamilySheet();
      if (typeof g.uftSetView === "function") g.uftSetView("pedigree");
      g.print && g.print();
    } catch (e) {
      try { console.warn("[Clarity] uftPrintPedigreeView", e); } catch (e2) {}
    }
  });
})(typeof window !== "undefined" ? window : this);
