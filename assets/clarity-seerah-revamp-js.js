
(function(){
  "use strict";
  var TIBBE_REMEDIES = [
    {
      title: "Black seed (الحبّة السوداء) — al-ḥabba al-sawdāʾ",
      ar: "فِي الْحَبَّةِ السَّوْدَاءِ شِفَاءٌ مِنْ كُلِّ دَاءٍ إِلَّا السَّامَ",
      en: "The Prophet ﷺ said: “In the black seed there is healing for every disease except death (as-sām).”",
      ref: "Bukhārī 5688 · Muslim 2215",
      url: "https://sunnah.com/bukhari:5688",
      classical: "Scholars understood this as a general blessing in the seed (Nigella sativa), not a claim that it replaces every treatment by itself. Ibn Ḥajar and others noted that “every disease” can mean many illnesses known in that context, or broad benefit with exceptions known to Allah — and death is explicitly excluded.",
      contemporary: "Modern Muslim physicians often discuss black seed as a supportive wellness food — never a substitute for diagnosis or prescribed care. Prophetic medicine is studied with prevention, moderation, and tawakkul, alongside the command to seek treatment."
    },
    {
      title: "Honey (العسل) — healing in the bee’s produce",
      ar: "فِيهِ شِفَاءٌ لِلنَّاسِ",
      en: "Allah says of honey: “In it is healing for people” (16:69). The Prophet ﷺ also recommended honey in reported medical contexts; it is from the Prophetic pharmacy of natural means.",
      ref: "Qur’an 16:69 · see also Bukhārī on honey",
      url: "https://quran.com/16/69",
      classical: "Ibn al-Qayyim and others wrote extensively on honey as a gentle, beneficial food and remedy in the Prophetic tradition — always within the limits of experience and avoiding harm.",
      contemporary: "Contemporary Islamic herbal educators stress purity of source, moderation, and that honey does not replace professional care for serious illness. Educational reflection only."
    },
    {
      title: "ʿAjwah dates — Madinah’s blessing",
      ar: "مَنْ تَصَبَّحَ بِسَبْعِ تَمَرَاتٍ عَجْوَةً لَمْ يَضُرَّهُ ذَلِكَ الْيَوْمَ سُمٌّ وَلاَ سِحْرٌ",
      en: "The Prophet ﷺ said of ʿajwah: Whoever eats seven ʿajwah dates in the morning, neither poison nor magic will harm him that day (wording varies by report).",
      ref: "Bukhārī 5445 · Muslim 2047",
      url: "https://sunnah.com/bukhari:5445",
      classical: "Scholars linked this to the barakah of Madinah’s dates and the specific ʿajwah type known to the people of Madinah. It is a report of blessing and protection by Allah’s leave — not a mechanical formula.",
      contemporary: "Muslim dietitians note dates as nutrient-dense food. The ḥadīth is taken with īmān and without neglecting ordinary safety and medicine. Not a fatwa for poisoning cases."
    },
    {
      title: "Seek treatment — medicine is from Allah’s means",
      ar: "تَدَاوَوْا فَإِنَّ اللَّهَ عَزَّ وَجَلَّ لَمْ يَضَعْ دَاءً إِلاَّ وَضَعَ لَهُ دَوَاءً",
      en: "The Prophet ﷺ said: Seek treatment, for Allah has not placed a disease without placing a cure for it (except aging/death in some wordings).",
      ref: "Abū Dāwūd 3855 · graded ṣaḥīḥ by many",
      url: "https://sunnah.com/abudawud:3855",
      classical: "This undercuts fatalism: using medicine is part of tawakkul when the heart relies on Allah, not on the bottle alone.",
      contemporary: "Contemporary scholars repeatedly cite this to encourage vaccination, hospitals, and evidence-based care as compatible with faith — Ṭibb Nabawī and modern medicine are not enemies when ethics are kept."
    }
  ];
  var tibbeIdx = 0;
  try { tibbeIdx = parseInt(localStorage.getItem("clarity_tibbe_idx") || "0", 10) || 0; } catch(e){}

  function renderTibbe(i){
    var r = TIBBE_REMEDIES[i % TIBBE_REMEDIES.length];
    var set = function(id, val, html){
      var el = document.getElementById(id);
      if (!el) return;
      if (html) el.innerHTML = val; else el.textContent = val;
    };
    set("tibbe-title", r.title);
    set("tibbe-ar", r.ar);
    set("tibbe-en", r.en);
    var ref = document.getElementById("tibbe-ref");
    if (ref) ref.innerHTML = r.ref + ' · <a href="' + r.url + '" target="_blank" rel="noopener">Open source</a>';
    var body = document.getElementById("tibbe-remedy-body");
    if (body) {
      var boxes = body.querySelectorAll(".ponder-box p, .modern-context ul");
      /* rewrite classical + contemporary blocks simply */
      var classical = body.querySelector(".ponder-box p");
      if (classical) classical.textContent = r.classical;
      var modern = body.querySelector(".modern-context ul");
      if (modern) modern.innerHTML = "<li>" + r.contemporary + "</li><li>Always verify primary texts; consult physicians for health decisions.</li>";
    }
  }
  window.clarityTibbeNext = function(){
    tibbeIdx = (tibbeIdx + 1) % TIBBE_REMEDIES.length;
    try { localStorage.setItem("clarity_tibbe_idx", String(tibbeIdx)); } catch(e){}
    renderTibbe(tibbeIdx);
  };

  /* ===== Seerah Mirror Walk ===== */
  var MIRROR_STEPS = [
    { title: "Mercy in strength", moment: "At the Conquest of Makkah the Prophet ﷺ entered with power yet declared general amnesty for most of those who had driven him out.", prompt: "Where do I hold power (voice, status, information) — and how can I choose mercy without abandoning justice?", src: "Sīrah · Fatḥ Makkah", url: "https://sunnah.com/search?q=conquest+of+makkah" },
    { title: "Truth under pressure", moment: "In the cave of Thawr, Abū Bakr feared discovery. The Prophet ﷺ said: What do you think of two when Allah is their third?", prompt: "Name one fear that makes me silent about truth. What would tawakkul look like in that moment?", src: "Qur’an 9:40 · Bukhārī", url: "https://quran.com/9/40" },
    { title: "Justice without favouritism", moment: "When a noble woman stole, intercession was refused: even if Fāṭimah stole, the ḥadd would be applied.", prompt: "Do I apply standards more softly to people I like? One concrete correction this week.", src: "Bukhārī 3475", url: "https://sunnah.com/bukhari:3475" },
    { title: "Consultation before courage", moment: "Before Uḥud he consulted the Companions, then committed once the decision was made.", prompt: "Where do I need shūrā before acting — and where do I need to stop reopening a decided matter?", src: "Qur’an 3:159", url: "https://quran.com/3/159" },
    { title: "Service in the home", moment: "ʿĀʾishah reported that he was in the service of his family; when the prayer was called he went out.", prompt: "One chore or kindness at home I will do today without being asked.", src: "Bukhārī 676", url: "https://sunnah.com/bukhari:676" },
    { title: "Honour of the neighbour", moment: "He stressed the neighbour until the Companions thought he would make the neighbour an heir.", prompt: "Who is my nearest neighbour in need of a small good — visit, message, or help?", src: "Bukhārī 6015", url: "https://sunnah.com/bukhari:6015" },
    { title: "Leaving the world lightly", moment: "He left little wealth; his armour was pledged for food for his family. He taught that the grave is the first stage of the next life.", prompt: "What attachment am I polishing more than my ākhirah this week? One act of sending light ahead.", src: "Bukhārī · zuhd reports", url: "https://sunnah.com/search?q=armour+pledged" }
  ];

  function mirrorProg(){
    try { return JSON.parse(localStorage.getItem("clarity_seerah_mirror") || '{"done":[],"idx":0}'); }
    catch(e){ return {done:[], idx:0}; }
  }
  function saveMirrorProg(p){
    try { localStorage.setItem("clarity_seerah_mirror", JSON.stringify(p)); } catch(e){}
  }
  function renderMirror(){
    var p = mirrorProg();
    var idx = p.idx || 0;
    if (idx >= MIRROR_STEPS.length) idx = 0;
    var s = MIRROR_STEPS[idx];
    var set = function(id, t){ var el = document.getElementById(id); if (el) el.textContent = t; };
    set("sm-step-label", "Step " + (idx+1) + " of " + MIRROR_STEPS.length);
    set("sm-title", s.title);
    set("sm-moment", s.moment);
    set("sm-src", s.src);
    set("sm-prompt", s.prompt);
    var link = document.getElementById("sm-link");
    if (link) link.href = s.url;
    var doneN = (p.done || []).length;
    var fill = document.getElementById("sm-prog-fill");
    if (fill) fill.style.width = Math.round(100 * doneN / MIRROR_STEPS.length) + "%";
    var pt = document.getElementById("sm-progress-text");
    if (pt) pt.textContent = doneN + " / " + MIRROR_STEPS.length + " steps on this device";
    window._clarityMirrorStep = { idx: idx, step: s };
  }
  window.claritySeerahMirrorNext = function(){
    var p = mirrorProg();
    p.idx = ((p.idx || 0) + 1) % MIRROR_STEPS.length;
    saveMirrorProg(p);
    renderMirror();
  };
  window.claritySeerahMirrorDone = function(){
    var p = mirrorProg();
    var idx = p.idx || 0;
    if ((p.done || []).indexOf(idx) < 0) {
      p.done = (p.done || []).concat([idx]);
    }
    p.idx = (idx + 1) % MIRROR_STEPS.length;
    saveMirrorProg(p);
    renderMirror();
  };
  window.claritySeerahMirrorNote = function(){
    var cur = window._clarityMirrorStep || {};
    var s = cur.step || {};
    if (typeof notesOpenDeedNote === "function") {
      notesOpenDeedNote({
        title: "Seerah Mirror · " + (s.title || "Step"),
        tag: "Seerah",
        pathLine: "Mirror Walk",
        deed: (s.prompt || s.moment || "Character reflection"),
        grave: false
      });
    } else if (typeof notesQuickFromSection === "function") {
      notesQuickFromSection("Seerah", "Seerah Mirror · " + (s.title || ""));
    }
  };

  function boot(){
    try { renderTibbe(tibbeIdx); } catch(e){}
    try { renderMirror(); } catch(e2){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 60); });
  else setTimeout(boot, 60);
})();
