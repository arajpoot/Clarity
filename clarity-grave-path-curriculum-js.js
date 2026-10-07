(function(){
  "use strict";
  if (window.__CLARITY_GRAVE_PATH_CURRICULUM__) return;
  window.__CLARITY_GRAVE_PATH_CURRICULUM__ = true;

  /* inject curriculum card + link styles (missing when factored out of monolith) */
  (function injectCurriculumCss(){
    try {
      if (document.getElementById("clarity-grave-path-curriculum-css-inject")) return;
      var s = document.createElement("style");
      s.id = "clarity-grave-path-curriculum-css-inject";
      s.textContent = '.gpc-links{display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.55rem}.gpc-links a{font-size:0.72rem;font-weight:600;padding:0.28rem 0.55rem;border-radius:999px;background:rgba(13,79,60,0.1);color:#0a3d2e;text-decoration:none;border:1px solid rgba(13,79,60,0.18);white-space:normal;line-height:1.35}.gpc-links a:hover{background:rgba(13,79,60,0.18)}.gpc-note{font-size:0.72rem;margin-top:0.55rem;padding:0.4rem 0.55rem;border-radius:10px;background:#f3f0e4;color:#2a3228;border:1px solid #d0c6a4}#grave-path-card,#new-muslim-foundations-card,#salah-starter-card,#daily-deed-ledger-card,#dai-transmit-card{border-radius:16px;padding:1rem 1.1rem;margin-bottom:1rem;background:linear-gradient(145deg,#f7fcf9,#eef6f1)!important;border:1px solid #a8c9b6!important;color:#1c2a22!important}#grave-path-card h2,#new-muslim-foundations-card h2,#salah-starter-card h2,#daily-deed-ledger-card h2,#dai-transmit-card h2{color:#0d4f3c!important}#grave-path-card p,#new-muslim-foundations-card p,#salah-starter-card p,#daily-deed-ledger-card p,#dai-transmit-card p,#grave-path-card li,#new-muslim-foundations-card li,#salah-starter-card li,#daily-deed-ledger-card li,#dai-transmit-card li{color:#1c2a22!important;opacity:1!important}html[data-theme="dark"] #grave-path-card,html[data-theme="dark"] #new-muslim-foundations-card,html[data-theme="dark"] #salah-starter-card,html[data-theme="dark"] #daily-deed-ledger-card,html[data-theme="dark"] #dai-transmit-card{background:linear-gradient(145deg,#152820,#0f1c18)!important;border-color:rgba(212,180,90,0.28)!important;color:#e8f0ea!important}html[data-theme="dark"] #grave-path-card h2,html[data-theme="dark"] #new-muslim-foundations-card h2,html[data-theme="dark"] #salah-starter-card h2,html[data-theme="dark"] #daily-deed-ledger-card h2,html[data-theme="dark"] #dai-transmit-card h2{color:#e8d48a!important}html[data-theme="dark"] #grave-path-card p,html[data-theme="dark"] #new-muslim-foundations-card p,html[data-theme="dark"] #salah-starter-card p,html[data-theme="dark"] #daily-deed-ledger-card p,html[data-theme="dark"] #dai-transmit-card p,html[data-theme="dark"] #grave-path-card li,html[data-theme="dark"] #new-muslim-foundations-card li,html[data-theme="dark"] #salah-starter-card li,html[data-theme="dark"] #daily-deed-ledger-card li,html[data-theme="dark"] #dai-transmit-card li{color:#d8e8de!important}html[data-theme="dark"] .gpc-note{background:rgba(40,36,24,0.9);color:#e8e0d0;border-color:rgba(212,180,90,0.3)}html[data-theme="dark"] .gpc-links a{background:rgba(212,180,90,0.12);color:#e8d48a;border-color:rgba(212,180,90,0.3)}';
      (document.head || document.documentElement).appendChild(s);
    } catch(e){}
  })();

  var PHASES = {
    seeker: {
      title: "Seeker · Wake the heart",
      goal: "Remember death. Send small light ahead. No overwhelm.",
      focus: "Soul audit · short reminders · seerah spark",
      hideExtra: true
    },
    new_muslim: {
      title: "New Muslim · Establish pillars",
      goal: "Wudu, salah, short surahs, clear belief — stability first.",
      focus: "Prayer · purification · basic fiqh · gentle path",
      hideExtra: true
    },
    practicing: {
      title: "Daily Muslim · Craft & consistency",
      goal: "Habits that outlive you: Qur'an craft, character, weekly review.",
      focus: "Tajweed · calligraphy · deed ledger · seerah mirror",
      hideExtra: false
    },
    dai: {
      title: "Aspiring Da'i · Transmit light",
      goal: "Teach with adab. Guard sources. Leave beneficial knowledge.",
      focus: "Dawah tools · critical study · family legacy",
      hideExtra: false
    }
  };

  function pathNow(){
    try {
      return document.documentElement.getAttribute("data-clarity-path")
        || localStorage.getItem("clarity_committed_path") || "seeker";
    } catch(e){ return "seeker"; }
  }

  function card(id, html){
    var el = document.getElementById(id);
    if (el) { el.innerHTML = html; return el; }
    el = document.createElement("div");
    el.id = id;
    el.className = "card";
    el.innerHTML = html;
    return el;
  }

  function gravePathHtml(){
    return '<div class="cred-stamp">Educational only — not a fatwa. Verify with Qur\'an, Sunnah, and a local scholar.</div>'
      + '<h2>🕯️ Furnish Your Grave · the real path</h2>'
      + '<p>The Prophet ﷺ taught that when a person dies, deeds end except ongoing charity, beneficial knowledge, and a righteous child who prays for them (Muslim). This track is ordered so each phase builds light you can send ahead.</p>'
      + '<ul style="margin:0.4rem 0 0.5rem;padding-left:1.2rem;font-size:0.88rem;line-height:1.5">'
      + '<li><strong>Seeker</strong> — softens the heart with death-awareness and small daily deeds.</li>'
      + '<li><strong>New Muslim</strong> — locks in prayer, purity, and clear belief before advanced tools.</li>'
      + '<li><strong>Daily</strong> — crafts Qur\'an, character, and a deed ledger that compounds.</li>'
      + '<li><strong>Da\'i</strong> — transmits carefully: sources, manners, family legacy.</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://sunnah.com/muslim:1631" target="_blank" rel="noopener">Muslim 1631 · three continuing deeds</a>'
      + '<a href="https://quran.com/59/18" target="_blank" rel="noopener">Qur\'an 59:18 · let every soul look to what it sends forth</a>'
      + '<a href="https://islamqa.info/en/answers/69948" target="_blank" rel="noopener">IslamQA · sadaqah jariyah</a>'
      + '<a href="https://quran.com/2/201" target="_blank" rel="noopener">Qur\'an 2:201 · Rabbana</a>'
      + '</div>'
      + '<p class="gpc-note">Not a ruling service. Links are for study. Ask a qualified local teacher for personal guidance.</p>';
  }

  function foundationsHtml(){
    return '<h2>🌱 New Muslim foundations · first order</h2>'
      + '<p>Islamic learning has an order: belief, then daily worship, then manners and ḥalāl living — then deeper study. Quality and consistency beat speed.</p>'
      + '<ol style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem;line-height:1.5">'
      + '<li><strong>Week focus:</strong> Wuḍū\' and the five prayers — even imperfectly, begin.</li>'
      + '<li><strong>Memorize:</strong> Al-Fātiḥah + a few short surahs for prayer.</li>'
      + '<li><strong>Belief:</strong> Six articles of faith in plain language.</li>'
      + '<li><strong>Character:</strong> Truthfulness, prayer on time, guarding the tongue.</li>'
      + '</ol>'
      + '<div class="gpc-links">'
      + '<a href="https://quran.com/1" target="_blank" rel="noopener">Al-Fātiḥah · Qur\'an.com</a>'
      + '<a href="https://sunnah.com/bukhari:8" target="_blank" rel="noopener">Hadith · pillars of Islam</a>'
      + '<a href="https://quran.com/4/103" target="_blank" rel="noopener">Qur\'an 4:103 · prayer at fixed times</a>'
      + '<a href="https://seekersguidance.org" target="_blank" rel="noopener">SeekersGuidance · Absolute Essentials</a>'
      + '</div>'
      + '<p class="gpc-note">Educational outline only. Learn prayer with a living teacher when you can.</p>';
  }

  function salahHtml(){
    return '<h2>🕌 Salah starter · non-negotiable light</h2>'
      + '<p>The covenant between us and them is the prayer. Start with purity, then movements, then short recitation. Steady beats perfect-on-day-one.</p>'
      + '<ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem">'
      + '<li>Learn wuḍū\' steps; practice once after each prayer time reminder.</li>'
      + '<li>Pray the five — use a guide until memorized.</li>'
      + '<li>Add Al-Fātiḥah, then three short surahs.</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://quran.com/23/1-2" target="_blank" rel="noopener">Qur\'an 23:1–2 · successful are the believers</a>'
      + '<a href="https://sunnah.com/nasai:463" target="_blank" rel="noopener">Prayer as covenant · study link</a>'
      + '<a href="https://quran.com/2/45" target="_blank" rel="noopener">Qur\'an 2:45 · seek help in patience and prayer</a>'
      + '</div>'
      + '<p class="gpc-note">Not a video course substitute — pair with a local mosque or trusted teacher.</p>';
  }

  function ledgerHtml(){
    return '<h2>📒 Daily deed ledger · send light ahead</h2>'
      + '<p>The most beloved deeds are those done consistently, even if small. Count for the grave — not for pride.</p>'
      + '<ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem">'
      + '<li>One page of Qur\'an with meaning</li>'
      + '<li>Istighfār &amp; ṣalawāt block</li>'
      + '<li>One kindness that costs little</li>'
      + '<li>One note for family legacy (private, on this device)</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://sunnah.com/bukhari:6465" target="_blank" rel="noopener">Most beloved deeds · consistency</a>'
      + '<a href="https://sunnah.com/muslim:2699" target="_blank" rel="noopener">Gatherings of dhikr</a>'
      + '<a href="https://quran.com/18/46" target="_blank" rel="noopener">Qur\'an 18:46 · lasting righteous deeds</a>'
      + '</div>'
      + '<p class="gpc-note">Counts stay on this device. Educational habit tool — not a scoreboard for pride.</p>';
  }

  function daiHtml(){
    return '<h2>🕊️ Transmit · Da\'i with adab</h2>'
      + '<p>Call to Allah with wisdom. Beneficial knowledge continues after death. Guard sources; avoid inventing rulings.</p>'
      + '<ul style="margin:0.35rem 0;padding-left:1.2rem;font-size:0.86rem">'
      + '<li>Share only what you can source (Qur\'an / authentic Hadith / reliable teachers).</li>'
      + '<li>Prefer manners over winning arguments.</li>'
      + '<li>Leave written or taught knowledge that helps others worship correctly.</li>'
      + '</ul>'
      + '<div class="gpc-links">'
      + '<a href="https://quran.com/16/125" target="_blank" rel="noopener">Qur\'an 16:125 · invite with wisdom</a>'
      + '<a href="https://sunnah.com/muslim:1631" target="_blank" rel="noopener">Beneficial knowledge after death</a>'
      + '<a href="https://islamqa.info/en/answers/237764" target="_blank" rel="noopener">IslamQA · knowledge that benefits</a>'
      + '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com · primary texts</a>'
      + '</div>'
      + '<p class="gpc-note">Clarity is educational only — not a fatwa desk. Personal rulings: ask a qualified local scholar.</p>';
  }

  function ensureCards(){
    var host = document.querySelector("#tab-reminder .main-content, #tab-reminder, #main-application-workspace, .page-wrapper")
      || document.body;
    var specs = [
      ["grave-path-card", gravePathHtml()],
      ["new-muslim-foundations-card", foundationsHtml()],
      ["salah-starter-card", salahHtml()],
      ["daily-deed-ledger-card", ledgerHtml()],
      ["dai-transmit-card", daiHtml()]
    ];
    specs.forEach(function(pair){
      var id = pair[0], html = pair[1];
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement("section");
        el.id = id;
        el.className = "card";
        el.setAttribute("data-grave-path-module", "1");
        var tab = document.getElementById("tab-reminder");
        if (tab) {
          /* Keep hub/intro first; append curriculum after existing intro blocks */
          var hub = tab.querySelector(".rrra-hub-body, #rrra-hub-body-reminder, .card-commands, #commands-card");
          if (hub && hub.parentNode === tab) {
            if (hub.nextSibling) tab.insertBefore(el, hub.nextSibling);
            else tab.appendChild(el);
          } else {
            tab.appendChild(el);
          }
        } else if (host) host.appendChild(el);
      }
      el.innerHTML = html;
    });
  }

  function ensureStrip(){
    /* OFFLOADED: path cards live only in first-visit doors + track rail */
    try {
      var strip = document.getElementById("clarity-grave-path-strip");
      if (strip && strip.parentNode) strip.parentNode.removeChild(strip);
    } catch(e){}
    return;
  }

  var ORDER = ["seeker","new_muslim","practicing","dai"];

  function syncVisibility(){
    var g = pathNow();
    ensureCards();
    ensureStrip();
    /* phase-specific show/hide for new modules only */
    var map = {
      seeker: ["grave-path-card"],
      new_muslim: ["grave-path-card","new-muslim-foundations-card","salah-starter-card"],
      practicing: ["grave-path-card","daily-deed-ledger-card"],
      dai: ["grave-path-card","dai-transmit-card","daily-deed-ledger-card","new-muslim-foundations-card"]
    };
    ["grave-path-card","new-muslim-foundations-card","salah-starter-card","daily-deed-ledger-card","dai-transmit-card"].forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      var show = (map[g] || []).indexOf(id) >= 0;
      if (show) {
        el.classList.remove("gate-hidden");
        el.removeAttribute("data-gate-hidden");
        el.style.removeProperty("display");
      } else {
        el.classList.add("gate-hidden");
        el.setAttribute("data-gate-hidden","1");
        el.style.setProperty("display","none","important");
      }
    });
  }

  function boot(){ syncVisibility(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  window.addEventListener("load", function(){ setTimeout(boot, 900); });

  window.addEventListener("clarity-path-changed", function () {
    setTimeout(syncVisibility, 50);
  });

  window.clarityGravePathSync = syncVisibility;
})();