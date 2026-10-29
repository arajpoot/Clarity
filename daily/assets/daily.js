/* Clarity Daily — self-contained day pulse
   Educational only — not a fatwa. On this device.
*/
(function () {
  "use strict";

  var KEY_DEED = "clarity.daily.deed.v1";
  var KEY_TAS = "clarity.daily.tasbeeh.v1";
  var KEY_STREAK = "clarity.daily.streak.v1";
  var KEY_LIGHT = "clarity.daily.light.v1";
  var KEY_THEME = "clarity.daily.theme.v1";
  var KEY_ADH = "clarity.daily.adhkar.v1";
  var KEY_FARD = "clarity.daily.fard.v1";
  var KEY_HIST = "clarity.daily.hist.v1";

  /* ---- Embedded packs (Phase 2) — from package adhkar/data ---- */
  var MORNING = [{"id": "m-istighfar", "ar": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", "en": "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant. I uphold Your covenant and promise as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me; none forgives sins but You.", "count": 1, "source": "Bukhārī 6306", "grade": "ṣaḥīḥ", "note": "Sayyid al-istighfār — morning or evening."}, {"id": "m-subhan-100", "ar": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "en": "Glory and praise be to Allah.", "count": 100, "source": "Muslim 2692", "grade": "ṣaḥīḥ", "note": "Morning and evening."}, {"id": "m-bika-asbahna", "ar": "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", "en": "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.", "count": 1, "source": "Abū Dāwūd 5068; Tirmidhī 3391", "grade": "ḥasan / ṣaḥīḥ (widely accepted)", "note": "Morning wording."}, {"id": "m-la-ilaha-10", "ar": "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "en": "There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He is over all things competent.", "count": 10, "source": "See Muslim 2691 and related morning/evening reports", "grade": "ṣaḥīḥ (core wording)", "note": "Often recited morning and evening; counts vary by report."}, {"id": "m-asbahna", "ar": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "en": "We have entered the morning and the dominion belongs to Allah. Praise be to Allah. There is no god but Allah alone, without partner; His is the dominion and His is the praise, and He is over all things competent.", "count": 1, "source": "Muslim 2723 (related morning formulae)", "grade": "ṣaḥīḥ (related)", "note": "Morning formula; educational compilation."}, {"id": "m-a3udhu", "ar": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", "en": "I seek refuge in the perfect words of Allah from the evil of what He created.", "count": 3, "source": "Muslim 2708", "grade": "ṣaḥīḥ", "note": "Evening emphasis in some reports; also used generally."}];
  var EVENING = [{"id": "e-istighfar", "ar": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", "en": "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant. I uphold Your covenant and promise as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me; none forgives sins but You.", "count": 1, "source": "Bukhārī 6306", "grade": "ṣaḥīḥ", "note": "Sayyid al-istighfār — morning or evening."}, {"id": "e-subhan-100", "ar": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", "en": "Glory and praise be to Allah.", "count": 100, "source": "Muslim 2692", "grade": "ṣaḥīḥ", "note": "Morning and evening."}, {"id": "e-bika-amsayna", "ar": "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", "en": "O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the return.", "count": 1, "source": "Abū Dāwūd 5068; Tirmidhī 3391", "grade": "ḥasan / ṣaḥīḥ (widely accepted)", "note": "Evening wording."}, {"id": "e-la-ilaha-10", "ar": "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "en": "There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He is over all things competent.", "count": 10, "source": "See Muslim 2691 and related reports", "grade": "ṣaḥīḥ (core wording)", "note": "Often recited morning and evening."}, {"id": "e-amsayna", "ar": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "en": "We have entered the evening and the dominion belongs to Allah. Praise be to Allah. There is no god but Allah alone, without partner; His is the dominion and His is the praise, and He is over all things competent.", "count": 1, "source": "Muslim 2723 (related evening formulae)", "grade": "ṣaḥīḥ (related)", "note": "Evening formula; educational compilation."}, {"id": "e-a3udhu", "ar": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", "en": "I seek refuge in the perfect words of Allah from the evil of what He created.", "count": 3, "source": "Muslim 2708", "grade": "ṣaḥīḥ", "note": "Reported for evening protection."}];
  var POST_SALAH = [{"id": "ps-subhan", "ar": "سُبْحَانَ اللَّهِ", "en": "Glory be to Allah.", "count": 33, "source": "Muslim 595", "ref": "After ṣalāh · educational"}, {"id": "ps-hamd", "ar": "الْحَمْدُ لِلَّهِ", "en": "All praise is for Allah.", "count": 33, "source": "Muslim 595", "ref": "After ṣalāh · educational"}, {"id": "ps-akbar", "ar": "اللَّهُ أَكْبَرُ", "en": "Allah is the Greatest.", "count": 33, "source": "Muslim 595", "ref": "After ṣalāh · educational"}, {"id": "ps-tahlil", "ar": "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "en": "There is no god but Allah alone, without partner. His is the dominion and His is the praise, and He is over all things competent.", "count": 1, "source": "Muslim 597", "ref": "After ṣalāh · educational"}];
  var SLEEP_PACK = [{"id": "sl-kursi", "ar": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ…", "en": "Āyat al-Kursī (2:255) — recite the full āyah as taught.", "count": 1, "source": "Bukhārī 2311", "ref": "Before sleep · educational"}, {"id": "sl-ikhlas", "ar": "قُلْ هُوَ اللَّهُ أَحَدٌ", "en": "Sūrat al-Ikhlāṣ — recite as taught (often with al-Falaq and an-Nās).", "count": 3, "source": "Bukhārī 5017", "ref": "Before sleep · educational"}, {"id": "sl-falaq", "ar": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", "en": "Sūrat al-Falaq — recite as taught.", "count": 3, "source": "Bukhārī 5017", "ref": "Before sleep · educational"}, {"id": "sl-nas", "ar": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", "en": "Sūrat an-Nās — recite as taught.", "count": 3, "source": "Bukhārī 5017", "ref": "Before sleep · educational"}, {"id": "sl-istighfar", "ar": "أَسْتَغْفِرُ اللَّهَ", "en": "I seek Allah’s forgiveness.", "count": 3, "source": "Educational practice", "ref": "Before sleep · educational"}];

  var PROVISIONS = [
    { lane: "Faith", text: "Renew shahāda in the heart — no god but Allah, Muhammad is His Messenger ﷺ." },
    { lane: "Prayer", text: "Guard the five farḍ — the first deed asked about on the Day of Standing." },
    { lane: "Dhikr", text: "Morning and evening adhkār — a daily shield of remembrance." },
    { lane: "Charity", text: "One ongoing good: water, knowledge, or a kind habit that outlasts you." },
    { lane: "Truth", text: "Speak and live truth — enjoin one another to ḥaqq (al-ʿAṣr)." },
    { lane: "Patience", text: "Meet hardship with ṣabr — and enjoin one another to patience." },
    { lane: "Legacy", text: "Beneficial knowledge or a child who prays for you (Muslim 1631 · educational)." }
  ];

  var WUDU_STEPS = [
    { n: 1, t: "Intention & Bismillah", d: "Intend wuḍūʾ for ṣalāh. Begin with Bismillāh as taught.", tip: "Intention is in the heart.", src: "Qurʾān 5:6 · educational" },
    { n: 2, t: "Wash the hands", d: "Wash both hands to the wrists three times.", tip: "Start with the right.", src: "Prophetic practice · educational" },
    { n: 3, t: "Mouth", d: "Rinse the mouth three times.", tip: "Use the right hand.", src: "Prophetic practice · educational" },
    { n: 4, t: "Nose", d: "Sniff water into the nose and expel three times.", tip: "Gentle; do not harm yourself.", src: "Prophetic practice · educational" },
    { n: 5, t: "Face", d: "Wash the face three times — hairline to chin, ear to ear.", tip: "Include the beard area as taught in your school.", src: "Qurʾān 5:6 · educational" },
    { n: 6, t: "Arms to elbows", d: "Wash right arm to elbow three times, then left.", tip: "Include the elbows.", src: "Qurʾān 5:6 · educational" },
    { n: 7, t: "Head & ears", d: "Wipe the head once; wipe the ears as taught.", tip: "Schools differ on details — learn with a teacher.", src: "Qurʾān 5:6 · educational" },
    { n: 8, t: "Feet to ankles", d: "Wash right foot to ankle three times, then left — between the toes.", tip: "Complete the limbs.", src: "Qurʾān 5:6 · educational" }
  ];

  var SALAH_STEPS = [
    { n: 1, t: "Face the qiblah", d: "Stand facing the direction of the Kaʿbah as best you can.", tip: "Use a trusted qiblah aid when travelling.", src: "Educational" },
    { n: 2, t: "Intention & takbīr", d: "Intend the prayer; raise the hands and say Allāhu akbar.", tip: "Intention is in the heart.", src: "Educational" },
    { n: 3, t: "Standing (qiyām)", d: "Recite al-Fātiḥah and what is easy from the Qurʾān.", tip: "Learn al-Fātiḥah with a teacher.", src: "Educational" },
    { n: 4, t: "Bowing (rukūʿ)", d: "Bow with back level; say the tasbīḥ of rukūʿ as taught.", tip: "Hands on knees.", src: "Educational" },
    { n: 5, t: "Prostration (sujūd)", d: "Prostrate with forehead, nose, hands, knees, and toes.", tip: "Seven limbs — learn the form with a teacher.", src: "Educational" },
    { n: 6, t: "Sitting & tashahhud", d: "Sit for the testimony and ṣalāh upon the Prophet ﷺ as taught.", tip: "Schools differ on details.", src: "Educational" },
    { n: 7, t: "Taslim", d: "End with salām to the right, then the left.", tip: "This completes the farḍ unit structure.", src: "Educational" }
  ];

  var LIGHTS = [
    { id: "sadaqa", title: "Ongoing charity", sub: "One small continuous good" },
    { id: "ilm", title: "Beneficial knowledge", sub: "Learn or share one useful thing" },
    { id: "dua", title: "Pray for someone", sub: "A righteous prayer that may outlast you" }
  ];

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  function hour() { return new Date().getHours(); }
  function dayPeriod() {
    var h = hour();
    if (h >= 4 && h < 12) return "morning";
    if (h >= 12 && h < 15) return "midday";
    if (h >= 15 && h < 19) return "afternoon";
    return "evening";
  }
  function isEveningWindow() {
    var h = hour();
    return h >= 15 || h < 4;
  }

  /* Theme */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
    write(KEY_THEME, t === "light" ? "light" : "dark");
  }
  var savedTheme = read(KEY_THEME);
  if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  var day = todayKey();
  var period = dayPeriod();

  /* Phase 1 — Now cue */
  var nowEl = document.getElementById("cdl-now");
  var nowMap = {
    morning: "Morning window — adhkār after Fajr, then one deed that stays.",
    midday: "Midday — guard Dhuhr; send one light ahead.",
    afternoon: "Afternoon — evening adhkār approach; hold to truth and ṣabr.",
    evening: "Evening window — adhkār, protect the heart, prepare the long stay."
  };
  if (nowEl) {
    nowEl.querySelector(".now-text").textContent = nowMap[period] || nowMap.morning;
    nowEl.querySelector(".now-period").textContent = period;
  }
  var periodEl = document.getElementById("cdl-period");
  if (periodEl) periodEl.textContent = period.charAt(0).toUpperCase() + period.slice(1);

  /* Deed of the day from provisions */
  var prov = PROVISIONS[hash(day) % PROVISIONS.length];
  var laneEl = document.getElementById("cdl-lane");
  var deedEl = document.getElementById("cdl-deed");
  if (laneEl) laneEl.textContent = prov.lane.toLowerCase();
  if (deedEl) deedEl.textContent = prov.text;

  /* Streak + mark done */
  var streak = read(KEY_STREAK) || { last: "", n: 0 };
  var deedState = read(KEY_DEED) || {};
  var doneEl = document.getElementById("cdl-done");
  var markBtn = document.getElementById("cdl-mark");
  function refreshDeed() {
    if (deedState.day === day && deedState.done) {
      if (doneEl) doneEl.textContent = "Marked done today — may Allah accept.";
      if (markBtn) markBtn.textContent = "Done ✓";
    } else {
      if (doneEl) doneEl.textContent = "Not marked";
      if (markBtn) markBtn.textContent = "Mark done";
    }
    var sb = document.getElementById("cdl-streak");
    if (sb && streak.n && streak.last === day) {
      sb.hidden = false;
      sb.textContent = "Streak " + streak.n + "d";
    } else if (sb && streak.n && streak.last) {
      sb.hidden = false;
      sb.textContent = "Streak " + streak.n + "d";
    }
  }
  refreshDeed();
  if (markBtn) markBtn.addEventListener("click", function () {
    deedState = { day: day, done: true, lane: prov.lane };
    write(KEY_DEED, deedState);
    if (streak.last === day) {
      /* already counted */
    } else {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var yk = yesterday.getFullYear() + "-" + String(yesterday.getMonth() + 1).padStart(2, "0") + "-" + String(yesterday.getDate()).padStart(2, "0");
      streak.n = streak.last === yk ? (streak.n || 0) + 1 : 1;
      streak.last = day;
      write(KEY_STREAK, streak);
    }
    /* hist */
    var hist = read(KEY_HIST) || [];
    hist = hist.filter(function (h) { return h.day !== day; });
    hist.unshift({ day: day, lane: prov.lane, adh: null });
    write(KEY_HIST, hist.slice(0, 14));
    refreshDeed();
    renderHist();
  });

  /* Tasbeeh */
  var tas = read(KEY_TAS) || { day: day, n: 0 };
  if (tas.day !== day) tas = { day: day, n: 0 };
  var tasCount = document.getElementById("cdl-tas-count");
  function paintTas() { if (tasCount) tasCount.textContent = String(tas.n || 0); }
  paintTas();
  var tasInc = document.getElementById("cdl-tas-inc");
  var tasReset = document.getElementById("cdl-tas-reset");
  if (tasInc) tasInc.addEventListener("click", function () {
    tas.n = (tas.n || 0) + 1;
    tas.day = day;
    write(KEY_TAS, tas);
    paintTas();
  });
  if (tasReset) tasReset.addEventListener("click", function () {
    tas = { day: day, n: 0 };
    write(KEY_TAS, tas);
    paintTas();
  });

  /* ---- Adhkār helpers ---- */
  function normalizePack(items) {
    return (items || []).map(function (it) {
      return {
        id: it.id,
        ar: it.ar,
        en: it.en,
        target: it.count || it.target || 1,
        ref: (it.source || it.ref || "") + (it.grade ? " · " + it.grade : "") + (it.note ? " · " + it.note : "")
      };
    });
  }

  function renderAdhkar(containerId, pack, storageKey) {
    var list = document.getElementById(containerId);
    if (!list) return;
    list.innerHTML = "";
    var state = read(storageKey) || {};
    if (state.day !== day) state = { day: day, counts: {} };
    var done = 0;
    pack.forEach(function (item) {
      var c = state.counts[item.id] || 0;
      if (c >= item.target) done++;
      var card = document.createElement("div");
      card.className = "cdl-adhkar-item";
      card.innerHTML =
        '<p class="cdl-adhkar-ar"></p><p class="cdl-adhkar-en"></p>' +
        '<p class="cdl-adhkar-ref"></p><p class="cdl-count">Count <strong></strong> / ' + item.target + "</p>" +
        '<button type="button">+1</button>';
      card.querySelector(".cdl-adhkar-ar").textContent = item.ar;
      card.querySelector(".cdl-adhkar-en").textContent = item.en;
      card.querySelector(".cdl-adhkar-ref").textContent = item.ref;
      card.querySelector("strong").textContent = String(c);
      if (c >= item.target) card.classList.add("adh-done");
      card.querySelector("button").onclick = function () {
        state.counts[item.id] = Math.min(item.target, (state.counts[item.id] || 0) + 1);
        write(storageKey, state);
        renderAdhkar(containerId, pack, storageKey);
        updateAdhProgress();
      };
      list.appendChild(card);
    });
    return { done: done, total: pack.length };
  }

  var windowIsEve = isEveningWindow();
  var mainPack = normalizePack(windowIsEve ? EVENING : MORNING);
  var adhWin = document.getElementById("cdl-adh-window");
  if (adhWin) adhWin.textContent = windowIsEve ? "evening" : "morning";

  function updateAdhProgress() {
    var el = document.getElementById("cdl-adh-progress");
    if (!el) return;
    var state = read(KEY_ADH) || { day: day, counts: {} };
    if (state.day !== day) state = { day: day, counts: {} };
    var done = 0;
    mainPack.forEach(function (it) {
      if ((state.counts[it.id] || 0) >= it.target) done++;
    });
    el.textContent = done + " of " + mainPack.length + " complete";
  }

  renderAdhkar("cdl-adhkar-list", mainPack, KEY_ADH);
  updateAdhProgress();
  renderAdhkar("cdl-post-list", normalizePack(POST_SALAH), "clarity.daily.post.v1");
  renderAdhkar("cdl-sleep-list", normalizePack(SLEEP_PACK), "clarity.daily.sleep.v1");

  /* Farḍ checklist today */
  var FARD_NAMES = ["Fajr", "Dhuhr", "ʿAṣr", "Maghrib", "ʿIshāʾ"];
  var fardBox = document.getElementById("cdl-fard-check");
  if (fardBox) {
    var fardState = read(KEY_FARD) || {};
    if (fardState.day !== day) fardState = { day: day, done: {} };
    fardBox.innerHTML = "";
    FARD_NAMES.forEach(function (name) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "fard-check-btn" + (fardState.done[name] ? " done" : "");
      btn.innerHTML = "<strong>" + name + "</strong>";
      btn.onclick = function () {
        fardState.done[name] = !fardState.done[name];
        fardState.day = day;
        write(KEY_FARD, fardState);
        btn.classList.toggle("done", !!fardState.done[name]);
      };
      fardBox.appendChild(btn);
    });
  }

  /* Wuḍūʾ / Prayer expanders */
  function fillSteps(id, steps) {
    var box = document.getElementById(id);
    if (!box) return;
    box.innerHTML = "";
    steps.forEach(function (s) {
      var div = document.createElement("div");
      div.className = "cdl-step";
      div.innerHTML = "<strong>" + s.n + ". " + s.t + "</strong><p></p><p class='cdl-tip'></p><p class='cdl-adhkar-ref'></p>";
      div.querySelector("p").textContent = s.d;
      div.querySelector(".cdl-tip").textContent = s.tip || "";
      div.querySelector(".cdl-adhkar-ref").textContent = s.src || "";
      box.appendChild(div);
    });
  }
  fillSteps("cdl-wudu", WUDU_STEPS);
  fillSteps("cdl-salah", SALAH_STEPS);

  /* Provisions */
  var provBox = document.getElementById("cdl-provisions");
  if (provBox) {
    provBox.innerHTML = "";
    PROVISIONS.forEach(function (p, i) {
      var div = document.createElement("div");
      div.className = "prov-item" + (p.lane === prov.lane ? " today" : "");
      div.innerHTML = '<span class="prov-lane"></span><p class="prov-text"></p>';
      div.querySelector(".prov-lane").textContent = p.lane;
      div.querySelector(".prov-text").textContent = p.text;
      provBox.appendChild(div);
    });
  }

  /* Send light */
  var light = read(KEY_LIGHT) || {};
  if (light.day !== day) light = { day: day, done: {} };
  var lightBox = document.getElementById("cdl-light");
  if (lightBox) {
    lightBox.innerHTML = "";
    LIGHTS.forEach(function (L) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cdl-light-btn" + (light.done[L.id] ? " done" : "");
      btn.innerHTML = "<strong></strong><small></small>";
      btn.querySelector("strong").textContent = L.title;
      btn.querySelector("small").textContent = L.sub;
      btn.onclick = function () {
        light.done[L.id] = !light.done[L.id];
        light.day = day;
        write(KEY_LIGHT, light);
        btn.classList.toggle("done", !!light.done[L.id]);
      };
      lightBox.appendChild(btn);
    });
  }

  /* History */
  function renderHist() {
    var box = document.getElementById("cdl-hist");
    if (!box) return;
    var hist = read(KEY_HIST) || [];
    box.innerHTML = "";
    if (!hist.length) {
      box.innerHTML = '<p class="cdl-note">No days marked yet — begin with one deed.</p>';
      return;
    }
    hist.slice(0, 7).forEach(function (h) {
      var row = document.createElement("div");
      row.className = "cdl-hist-row";
      row.textContent = h.day + " · " + (h.lane || "deed");
      box.appendChild(row);
    });
  }
  renderHist();

  /* Expand toggles */
  document.querySelectorAll(".cdl-expand-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-target");
      var body = document.getElementById(id);
      if (!body) return;
      var open = body.hidden;
      body.hidden = !open;
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      var chev = btn.querySelector(".chev");
      if (chev) chev.textContent = open ? "▾" : "▸";
    });
  });

  /* Continuity line */
  var cont = document.getElementById("cdl-continuity");
  if (cont) {
    cont.textContent = "Time is passing. Return tomorrow with faith, a deed, truth, and ṣabr — furnish the grave one day at a time.";
  }
})();
