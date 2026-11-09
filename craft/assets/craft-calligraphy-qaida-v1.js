/*! craft-calligraphy-qaida-v1 · C19CALLIG3
 * Noorani Qaaidah (Indo-Pak style) curriculum rail + Listen / Speak-along (Web Speech)
 * Pattern borrowed from Tajweed LMR: listen → match pace → on-device only
 * Educational primer path — not an ijāzah / fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_CALLIG_QAIDA_V1__) return;
  w.__CRAFT_CALLIG_QAIDA_V1__ = true;

  /* 17-lesson Indo-Pak Noorani-style path (skills order; edition names vary) */
  var QAIDA = [
    { id: "Q1", title: "Ḥurūf mufradāt", en: "Single letters", glyphs: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي".split(" "), tip: "Name + sound · makhārij seeds · take time on ع ح خ غ ق and heavy letters." },
    { id: "Q2", title: "Ḥurūf murakkabāt", en: "Joined forms", glyphs: ["بـ", "ـبـ", "ـب", "لـ", "ـلا", "ـك"], tip: "Initial · medial · final shapes — the muṣḥaf is joined." },
    { id: "Q3", title: "Ḥurūf muqaṭṭaʿāt", en: "Disjointed openings", glyphs: ["الم", "حم", "يس", "طه", "كهيعص"], tip: "Read by letter names where taught · educational only." },
    { id: "Q4", title: "Ḥarakāt", en: "Short vowels", glyphs: ["بَ", "بِ", "بُ", "تَ", "تِ", "تُ"], tip: "Fatḥah · kasrah · ḍammah on any letter." },
    { id: "Q5", title: "Tanwīn", en: "Double vowels", glyphs: ["بًا", "بٍ", "بٌ", "تًا"], tip: "Hidden nūn sound at the end." },
    { id: "Q6", title: "Ḥarakāt + tanwīn drill", en: "Mixed short words", glyphs: ["كَتَبَ", "مِنْ", "قُلْ"], tip: "Blend without spelling aloud every letter." },
    { id: "Q7", title: "Standing ḥarakāt", en: "Indo-Pak long marks", glyphs: ["هٰذَا", "بِهِۦ", "لَهُۥ"], tip: "Standing fatḥah / kasrah / inverted ḍammah · two counts." },
    { id: "Q8", title: "Ḥurūf maddah", en: "Long vowels", glyphs: ["بَا", "بِي", "بُو", "قَالَ"], tip: "Alif · wāw · yāʾ stretch · two counts." },
    { id: "Q9", title: "Madd + līn drill", en: "Soft + long", glyphs: ["خَوْف", "بَيْت", "قَوْم"], tip: "Līn after fatḥah · gentle glide." },
    { id: "Q10", title: "Sukūn (jazm)", en: "Silent letter", glyphs: ["مِنْ", "عَنْ", "قَدْ"], tip: "Join silent letter to the one before." },
    { id: "Q11", title: "Sukūn exercise", en: "Clusters", glyphs: ["الْحَمْدُ", "نَسْتَعِينُ"], tip: "Longer closed syllables · steady." },
    { id: "Q12", title: "Tashdīd", en: "Shaddah", glyphs: ["رَبِّ", "إِنَّ", "ثُمَّ"], tip: "Double · ghunnah on ن / م mushaddad." },
    { id: "Q13", title: "Tashdīd exercise", en: "Quranic words", glyphs: ["الرَّحْمٰنِ", "الصَّمَدُ"], tip: "Real words · educational only." },
    { id: "Q14", title: "Tashdīd + sukūn", en: "Mixed stops", glyphs: ["الْحَقُّ", "أَشَدُّ"], tip: "Shaddah near silence." },
    { id: "Q15", title: "Tashdīd + tashdīd", en: "Double doubles", glyphs: ["رَبِّ النَّاسِ"], tip: "Two doubled letters in sequence." },
    { id: "Q16", title: "Tashdīd + madd", en: "Long then double", glyphs: ["الضَّالِّينَ"], tip: "Stretch then double cleanly." },
    { id: "Q17", title: "Nūn sākinah & tanwīn", en: "Early rules", glyphs: ["مِنْ رَبِّ", "مِنْ بَعْدِ", "أَنْبِيَاء"], tip: "Izhar · idghām · iqlāb · ikhfāʾ seeds — review with a teacher." }
  ];

  var active = 0;
  var glyphIdx = 0;
  var rec = null;
  var listening = false;

  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("cal-lmr-status");
    if (el) el.textContent = msg || "";
    var st = $("cal-status");
    if (st && msg) st.textContent = msg;
  }

  function currentGlyph() {
    var lesson = QAIDA[active];
    if (!lesson) return "ا";
    var g = lesson.glyphs[glyphIdx % lesson.glyphs.length];
    return g || lesson.glyphs[0];
  }

  function speakArabic(text) {
    return new Promise(function (resolve) {
      if (!w.speechSynthesis) {
        status("Speech synthesis not available on this device");
        resolve(false);
        return;
      }
      try { w.speechSynthesis.cancel(); } catch (e) {}
      var u = new SpeechSynthesisUtterance(String(text || ""));
      u.lang = "ar-SA";
      u.rate = 0.75;
      u.pitch = 1;
      /* prefer Arabic voice if listed */
      try {
        var voices = w.speechSynthesis.getVoices() || [];
        var ar = voices.filter(function (v) { return /^ar/i.test(v.lang); });
        if (ar.length) u.voice = ar[0];
      } catch (e2) {}
      u.onend = function () { resolve(true); };
      u.onerror = function () { resolve(false); };
      w.speechSynthesis.speak(u);
      status("Listening model · follow with your voice, then the pad");
    });
  }

  function stopSpeak() {
    try { w.speechSynthesis && w.speechSynthesis.cancel(); } catch (e) {}
  }

  function startWhisperMatch() {
    var SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      status("Speak-along needs Chrome/Edge mic permission · still practice on the pad");
      return;
    }
    stopWhisper();
    rec = new SR();
    rec.lang = "ar-SA";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    listening = true;
    var hear = $("cal-lmr-hear");
    if (hear) hear.classList.add("cal-pulse");
    status("Mic open · whisper the letter/word with the same pace · on-device only");
    rec.onresult = function (ev) {
      var said = "";
      try {
        said = (ev.results[0] && ev.results[0][0] && ev.results[0][0].transcript) || "";
      } catch (e) {}
      status("Heard: « " + said + " » · now write it on the pad · educational only");
      if (hear) hear.classList.remove("cal-pulse");
      listening = false;
    };
    rec.onerror = function () {
      status("Mic paused · check permission · pad still works");
      if (hear) hear.classList.remove("cal-pulse");
      listening = false;
    };
    rec.onend = function () {
      if (hear) hear.classList.remove("cal-pulse");
      listening = false;
    };
    try { rec.start(); } catch (e2) {
      status("Could not start mic");
      listening = false;
    }
  }

  function stopWhisper() {
    try { if (rec) rec.stop(); } catch (e) {}
    rec = null;
    listening = false;
    var hear = $("cal-lmr-hear");
    if (hear) hear.classList.remove("cal-pulse");
  }

  function pushToPad(glyph) {
    try {
      if (w.CraftCalligPad && typeof w.CraftCalligPad.setFocus === "function") {
        /* use ruqah track for primer letters */
        w.CraftCalligPad.setFocus("ruqah", glyph.charAt(0));
      }
      var layer = $("cal-guide-layer");
      if (layer) layer.textContent = glyph;
      var hear = $("cal-lmr-hear");
      if (hear) hear.textContent = glyph;
    } catch (e) {}
  }

  function selectLesson(i) {
    active = i;
    glyphIdx = 0;
    var lesson = QAIDA[active];
    renderRail();
    renderGlyphs();
    pushToPad(currentGlyph());
    var tip = $("cal-qaida-tip");
    if (tip && lesson) {
      tip.innerHTML =
        "<strong>" + lesson.id + " · " + lesson.title + "</strong> — " + lesson.en +
        "<br/><span class='panel-note'>" + lesson.tip + "</span>";
    }
    status("Qaida " + lesson.id + " · " + lesson.en);
  }

  function renderRail() {
    var rail = $("cal-qaida-rail");
    if (!rail) return;
    rail.innerHTML = "";
    QAIDA.forEach(function (ls, i) {
      var b = d.createElement("button");
      b.type = "button";
      b.innerHTML = ls.id + " · " + ls.title + "<small>" + ls.en + "</small>";
      if (i === active) b.classList.add("active");
      b.addEventListener("click", function () { selectLesson(i); });
      rail.appendChild(b);
    });
  }

  function renderGlyphs() {
    var grid = $("cal-qaida-glyphs");
    if (!grid) return;
    grid.innerHTML = "";
    var lesson = QAIDA[active];
    (lesson.glyphs || []).forEach(function (g, i) {
      var b = d.createElement("button");
      b.type = "button";
      b.textContent = g;
      b.style.fontFamily = "Amiri, 'Noto Naskh Arabic', serif";
      b.style.fontSize = "1.15rem";
      if (i === glyphIdx) b.classList.add("active");
      b.addEventListener("click", function () {
        glyphIdx = i;
        renderGlyphs();
        pushToPad(g);
        status("Focus · " + g);
      });
      grid.appendChild(b);
    });
  }

  function inject() {
    if ($("cal-qaida-root")) return;
    var main = d.querySelector("main.craft-main") || d.querySelector("main");
    if (!main) return;

    var sec = d.createElement("section");
    sec.className = "cal-glass tool-section";
    sec.id = "cal-qaida-root";
    sec.innerHTML =
      "<h2>Noorani Qaaidah path · Indo-Pak skill order</h2>" +
      '<p class="panel-note">Seventeen progressive skills (letters → joined → ḥarakāt → tanwīn → standing marks → madd → sukūn → tashdīd → early nūn rules). ' +
      "Listen, whisper-match on-device, then write on the pad. Educational primer — not a substitute for a teacher.</p>" +
      '<div id="cal-qaida-tip" class="panel-note"></div>' +
      '<div class="cal-qaida-rail" id="cal-qaida-rail" role="group" aria-label="Qaida lessons"></div>' +
      '<div class="cal-glyph-grid" id="cal-qaida-glyphs" role="group" aria-label="Lesson items"></div>' +
      '<div class="cal-lmr">' +
      '<span class="cal-hear" id="cal-lmr-hear" lang="ar" dir="rtl">ا</span>' +
      '<button type="button" class="btn primary" id="cal-listen">▶ Listen</button>' +
      '<button type="button" class="btn" id="cal-listen-slow">▶ Slow</button>' +
      '<button type="button" class="btn" id="cal-speak">🎤 Speak along</button>' +
      '<button type="button" class="btn" id="cal-stop-audio">Stop</button>' +
      '<button type="button" class="btn" id="cal-next-glyph">Next item →</button>' +
      "</div>" +
      '<p class="cal-lmr-status" id="cal-lmr-status" aria-live="polite">Listen once fully, then whisper with the same pace · pad keeps the hand honest.</p>';

    var curr = $("cal-curriculum-root");
    if (curr && curr.parentNode) curr.parentNode.insertBefore(sec, curr.nextSibling);
    else {
      var pad = $("cal-fallback");
      if (pad) main.insertBefore(sec, pad);
      else main.appendChild(sec);
    }

    $("cal-listen").addEventListener("click", function () {
      speakArabic(currentGlyph());
    });
    $("cal-listen-slow").addEventListener("click", function () {
      if (!w.speechSynthesis) return speakArabic(currentGlyph());
      var u = new SpeechSynthesisUtterance(currentGlyph());
      u.lang = "ar-SA";
      u.rate = 0.55;
      try {
        var voices = w.speechSynthesis.getVoices() || [];
        var ar = voices.filter(function (v) { return /^ar/i.test(v.lang); });
        if (ar.length) u.voice = ar[0];
      } catch (e) {}
      w.speechSynthesis.cancel();
      w.speechSynthesis.speak(u);
      status("Slow model · breathe with the letter");
    });
    $("cal-speak").addEventListener("click", startWhisperMatch);
    $("cal-stop-audio").addEventListener("click", function () {
      stopSpeak();
      stopWhisper();
      status("Audio stopped");
    });
    $("cal-next-glyph").addEventListener("click", function () {
      var lesson = QAIDA[active];
      glyphIdx = (glyphIdx + 1) % Math.max(1, lesson.glyphs.length);
      renderGlyphs();
      pushToPad(currentGlyph());
    });

    /* warm voices list */
    try {
      if (w.speechSynthesis) w.speechSynthesis.getVoices();
      w.speechSynthesis && w.speechSynthesis.addEventListener("voiceschanged", function () {});
    } catch (e) {}

    selectLesson(0);
  }

  function boot() {
    inject();
  }

  w.CraftCalligQaida = { lessons: QAIDA, selectLesson: selectLesson, speak: speakArabic };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 300); });
})(window, document);
