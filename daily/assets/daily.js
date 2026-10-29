/**
 * Clarity Daily — isolated surface (campus-style)
 * Phases A–G + local theme + long-stay provisions map
 * Shared device keys with Companion for continuity.
 * Educational only — not a fatwa. Verify with a local scholar.
 */
(function () {
  "use strict";

  var KEY_PROV = "clarity_provision_day_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";
  var KEY_DONE = "clarity_today_done_v1";
  var KEY_STREAK = "clarity_soft_streak_v1";
  var KEY_ADH = "clarity_daily_adhkar_v1";
  var KEY_HIST = "clarity_daily_history_v1";
  var KEY_LIGHT = "clarity_send_light_v1";
  var KEY_THEME = "clarity_daily_theme_v1";

  var PROVISIONS = [
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence — a light you send into the long stay." },
    { lane: "rights", text: "Settle or note one right: a debt, a trust, or an apology. The scale is real." },
    { lane: "knowledge", text: "Learn or share one beneficial sentence from Qur’ān or Sunnah — knowledge that may outlive you." },
    { lane: "character", text: "Guard the tongue for one hour: no mockery, no gossip; replace with istighfār." },
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative — a gift that may reach the grave." },
    { lane: "jariyah", text: "Intend one small ongoing good: teach something useful, water a plant, or quiet ṣadaqah." },
    { lane: "family", text: "One gentle word or act of service for family — raising hearts that may pray for you." }
  ];

  var ADHKAR = {
    morning: [
      { id: "m1", ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",
        en: "We have entered the morning and the dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day — its opening, victory, light, blessing and guidance — and I seek refuge in You from the evil of what is in it and after it.",
        ref: "Abū Dāwūd 5084 · educational", target: 1 },
      { id: "m2", ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        en: "O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { id: "m3", ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · often 3× · educational", target: 3 },
      { id: "m4", ar: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
        en: "I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.",
        ref: "Abū Dāwūd 5072 · educational", target: 3 },
      { id: "m5", ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Muslim 2691 · educational", target: 100 },
      { id: "m6", ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        en: "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant… forgive me, for none forgives sins but You.",
        ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
    ],
    evening: [
      { id: "e1", ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا",
        en: "We have entered the evening and the dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this night…",
        ref: "Abū Dāwūd 5084 · educational", target: 1 },
      { id: "e2", ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        en: "O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the return.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { id: "e3", ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · often 3× · educational", target: 3 },
      { id: "e4", ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim 2708 · educational", target: 3 },
      { id: "e5", ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Muslim 2691 · educational", target: 100 },
      { id: "e6", ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        en: "O Allah, You are my Lord; there is no god but You… forgive me, for none forgives sins but You.",
        ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
    ]
  };

  var WUDU_STEPS = [
    { n: 1, t: "Intention & Basmala", d: "Intend wuḍūʾ for ṣalāh; begin with Bismillāh when you start washing.", tip: "Actions are by intentions — let the heart lead the limbs.", src: "Bukhārī 1 · Muslim 1907 · educational", learn: "https://sunnah.com/bukhari:1" },
    { n: 2, t: "Hands to the wrists", d: "Wash both hands up to the wrists three times, including between the fingers.", tip: "Start on the right when limbs come in pairs.", src: "Prophetic wuḍūʾ descriptions · educational", learn: "https://sunnah.com/search?q=wudu" },
    { n: 3, t: "Mouth", d: "Rinse the mouth three times — move water thoroughly, then expel.", tip: "A small, calm rinse is enough; no waste of water.", src: "Wuḍūʾ of the Prophet ﷺ · educational", learn: "https://sunnah.com/search?q=rinsed%20mouth%20wudu" },
    { n: 4, t: "Nose", d: "Sniff water into the nose and expel, three times.", tip: "Gentle; do not harm yourself. Schools differ — learn with a teacher.", src: "Same prophetic reports · educational", learn: "https://sunnah.com/search?q=nose%20wudu" },
    { n: 5, t: "Face", d: "Wash the face three times: hairline to chin, ear to ear.", tip: "Cover the whole face surface; beard rules differ by school.", src: "Qurʾān 5:6 — wash your faces · educational", learn: "https://quran.com/5/6" },
    { n: 6, t: "Arms to the elbows", d: "Wash the right arm to the elbow three times, then the left — include the elbows.", tip: "Right then left. Elbows are part of the wash in the standard reading of 5:6.", src: "Qurʾān 5:6 · educational", learn: "https://quran.com/5/6" },
    { n: 7, t: "Head & ears", d: "Wipe the head once; wipe the ears (inside and out as taught).", tip: "Wiping is not the same as washing — follow what your teacher shows.", src: "Qurʾān 5:6 — wipe your heads · educational", learn: "https://quran.com/5/6" },
    { n: 8, t: "Feet to the ankles", d: "Wash the right foot to the ankle three times, then the left — between the toes.", tip: "Complete the limbs; then you may say the well-known shahāda after wuḍūʾ as taught.", src: "Qurʾān 5:6 · post-wuḍūʾ dhikr reports · educational", learn: "https://sunnah.com/search?q=wudu%20shahada" }
  ];

  var SALAH_STEPS = [
    { n: 1, t: "Stand & face Qiblah", d: "Stand calmly facing the Qiblah if able; settle the heart before takbīr.", tip: "Wherever you are, turn your face toward al-Masjid al-Ḥarām.", src: "Qurʾān 2:144 · educational", learn: "https://quran.com/2/144" },
    { n: 2, t: "Opening takbīr", d: "Raise the hands and say Allāhu akbar; place the hands as taught in your school.", tip: "The prayer opens with takbīr — leave side talk and focus.", src: "Opening of ṣalāh reports · educational", learn: "https://sunnah.com/search?q=allahu%20akbar%20prayer" },
    { n: 3, t: "Al-Fātiḥah", d: "Recite Sūrat al-Fātiḥah; then further Qur’ān as taught for that unit.", tip: "No prayer is complete without al-Fātiḥah in the standard ḥadīth teaching.", src: "Bukhārī 756 · Muslim 394 · Qurʾān 1 · educational", learn: "https://quran.com/1" },
    { n: 4, t: "Rukūʿ", d: "Bow with the back level; hands on knees; glorify Allah (e.g. Subḥāna Rabbiyal-ʿAẓīm).", tip: "Pause calmly — do not rush the bowing.", src: "Prophetic rukūʿ descriptions · educational", learn: "https://sunnah.com/search?q=ruku" },
    { n: 5, t: "Stand from rukūʿ", d: "Rise saying Samiʿallāhu liman ḥamidah; stand straight; praise Allah.", tip: "Let the spine settle upright before going to sujūd.", src: "Prophetic transition phrases · educational", learn: "https://sunnah.com/search?q=sami%20allahu" },
    { n: 6, t: "Sujūd (twice)", d: "Prostrate so forehead, nose, hands, knees, and feet touch as taught; sit briefly; prostrate again.", tip: "Closest is the servant to his Lord while prostrating — lengthen duʿāʾ if you wish.", src: "Muslim 482 · educational wording", learn: "https://sunnah.com/muslim:482" },
    { n: 7, t: "Tashahhud, units & salām", d: "Complete the required units with tashahhud where taught; end with salām to the right then left.", tip: "Learn the full tashahhud wording with a teacher; this card is only a map.", src: "Prophetic tashahhud & salām · educational", learn: "https://sunnah.com/search?q=tashahhud" }
  ];

  var LIGHT_ITEMS = [
    { id: "knowledge", label: "Beneficial knowledge", hint: "Learn or teach one sentence that may outlive you." },
    { id: "sadaqah", label: "Ongoing ṣadaqah", hint: "Intend one quiet ongoing good — water, teaching, or regular gift." },
    { id: "dua", label: "Duʿāʾ for parents / deceased", hint: "A gift that may reach the grave." }
  ];

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function read(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return h;
  }
  function isEvening() {
    var h = new Date().getHours();
    return h >= 15 || h < 4;
  }
  function dayPeriod() {
    var h = new Date().getHours();
    if (h < 5) return "Pre-dawn";
    if (h < 12) return "Morning";
    if (h < 15) return "Midday";
    if (h < 18) return "Afternoon";
    if (h < 21) return "Evening";
    return "Night";
  }

  /* Theme (local to daily) */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
    write(KEY_THEME, t === "light" ? "light" : "dark");
  }
  var savedTheme = read(KEY_THEME);
  if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(cur === "dark" ? "light" : "dark");
  });

  var day = todayKey();

  /* Provision */
  var prov = read(KEY_PROV);
  if (!prov || prov.day !== day) {
    var p = PROVISIONS[Math.abs(hash(day)) % PROVISIONS.length];
    prov = { day: day, lane: p.lane, text: p.text, done: false };
    write(KEY_PROV, prov);
  }

  var tas = read(KEY_TAS) || {};
  if (tas.day !== day) tas = { day: day, count: 0 };

  var adh = read(KEY_ADH) || {};
  if (adh.day !== day) adh = { day: day, counts: {} };

  var light = read(KEY_LIGHT) || {};
  if (light.day !== day) light = { day: day, done: {} };

  var streak = read(KEY_STREAK) || { last: "", n: 0 };

  /* Paint core */
  document.getElementById("cdl-period").textContent = dayPeriod();
  document.getElementById("cdl-lane").textContent = prov.lane;
  document.getElementById("cdl-deed").textContent = prov.text;
  document.getElementById("cdl-done").textContent = prov.done ? "Done today ✓" : "Not marked";
  document.getElementById("cdl-tas-count").textContent = tas.count || 0;
  document.getElementById("cdl-adh-window").textContent = isEvening() ? "evening" : "morning";
  if (streak.n && streak.last === day) {
    var sb = document.getElementById("cdl-streak");
    sb.textContent = "Streak " + streak.n + "d";
    sb.hidden = false;
  }

  /* Adhkār */
  var pack = isEvening() ? ADHKAR.evening : ADHKAR.morning;
  var list = document.getElementById("cdl-adhkar-list");
  pack.forEach(function (item) {
    var n = (adh.counts && adh.counts[item.id]) || 0;
    var card = document.createElement("div");
    card.className = "cdl-adhkar-item";
    card.innerHTML =
      '<p class="cdl-adhkar-ar"></p><p class="cdl-adhkar-en"></p>' +
      '<p class="cdl-adhkar-ref"></p><p class="cdl-count">Count <strong></strong> / ' + item.target + '</p>' +
      '<button type="button">+1</button>';
    card.querySelector(".cdl-adhkar-ar").textContent = item.ar;
    card.querySelector(".cdl-adhkar-en").textContent = item.en;
    card.querySelector(".cdl-adhkar-ref").textContent = item.ref;
    card.querySelector("strong").textContent = n;
    card.querySelector("button").onclick = function () {
      adh.counts = adh.counts || {};
      adh.counts[item.id] = (adh.counts[item.id] || 0) + 1;
      write(KEY_ADH, adh);
      card.querySelector("strong").textContent = adh.counts[item.id];
    };
    list.appendChild(card);
  });

  /* Wuḍūʾ */
  var wuduBox = document.getElementById("cdl-wudu");
  WUDU_STEPS.forEach(function (s) {
    var div = document.createElement("div");
    div.className = "cdl-step";
    div.innerHTML =
      "<strong>" + s.n + ". " + s.t + "</strong><p>" + s.d + "</p>" +
      '<p class="cdl-tip">' + s.tip + "</p>" +
      '<p class="cdl-adhkar-ref">' + s.src +
      (s.learn ? ' · <a href="' + s.learn + '" target="_blank" rel="noopener">learn</a>' : "") + "</p>";
    wuduBox.appendChild(div);
  });

  /* Prayer */
  var salahBox = document.getElementById("cdl-salah");
  SALAH_STEPS.forEach(function (s) {
    var div = document.createElement("div");
    div.className = "cdl-step";
    div.innerHTML =
      "<strong>" + s.n + ". " + s.t + "</strong><p>" + s.d + "</p>" +
      '<p class="cdl-tip">' + s.tip + "</p>" +
      '<p class="cdl-adhkar-ref">' + s.src +
      (s.learn ? ' · <a href="' + s.learn + '" target="_blank" rel="noopener">learn</a>' : "") + "</p>";
    salahBox.appendChild(div);
  });

  /* Provisions map (surprise) */
  var provBox = document.getElementById("cdl-provisions");
  PROVISIONS.forEach(function (p) {
    var div = document.createElement("div");
    div.className = "prov-item" + (p.lane === prov.lane ? " today" : "");
    div.innerHTML =
      '<span class="prov-lane"></span><p class="prov-text"></p>';
    div.querySelector(".prov-lane").textContent = p.lane;
    div.querySelector(".prov-text").textContent =
      (p.lane === prov.lane ? "Today · " : "") + p.text;
    provBox.appendChild(div);
  });

  /* Send light */
  var lightRow = document.getElementById("cdl-light");
  LIGHT_ITEMS.forEach(function (item) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cdl-light-btn" + (light.done[item.id] ? " done" : "");
    btn.innerHTML = "<strong></strong><small></small>";
    btn.querySelector("strong").textContent = item.label;
    btn.querySelector("small").textContent = item.hint;
    btn.onclick = function () {
      light.done = light.done || {};
      light.done[item.id] = !light.done[item.id];
      write(KEY_LIGHT, light);
      btn.classList.toggle("done", !!light.done[item.id]);
    };
    lightRow.appendChild(btn);
  });

  /* Expand toggles */
  document.querySelectorAll(".cdl-expand-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-target");
      var body = document.getElementById(id);
      var open = body.hasAttribute("hidden");
      if (open) {
        body.removeAttribute("hidden");
        btn.setAttribute("aria-expanded", "true");
        btn.querySelector(".chev").textContent = "▾";
      } else {
        body.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", "false");
        btn.querySelector(".chev").textContent = "▸";
      }
    });
  });

  /* Tasbeeh */
  document.getElementById("cdl-tas-inc").onclick = function () {
    tas.count = (tas.count || 0) + 1;
    write(KEY_TAS, tas);
    document.getElementById("cdl-tas-count").textContent = tas.count;
  };
  document.getElementById("cdl-tas-reset").onclick = function () {
    tas = { day: day, count: 0 };
    write(KEY_TAS, tas);
    document.getElementById("cdl-tas-count").textContent = 0;
  };

  /* Mark done */
  document.getElementById("cdl-mark").onclick = function () {
    prov.done = true;
    write(KEY_PROV, prov);
    document.getElementById("cdl-done").textContent = "Done today ✓";

    if (streak.last !== day) {
      var y = new Date();
      y.setDate(y.getDate() - 1);
      var yk = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
      streak.n = (streak.last === yk) ? (streak.n || 0) + 1 : 1;
      streak.last = day;
      write(KEY_STREAK, streak);
      write(KEY_DONE, { day: day, done: 1 });
      var sb = document.getElementById("cdl-streak");
      sb.textContent = "Streak " + streak.n + "d";
      sb.hidden = false;
    }

    var hist = read(KEY_HIST) || [];
    hist = hist.filter(function (h) { return h.day !== day; });
    hist.unshift({ day: day, text: prov.text, lane: prov.lane, done: true });
    hist = hist.slice(0, 7);
    write(KEY_HIST, hist);
    paintHist();
  };

  function paintHist() {
    var box = document.getElementById("cdl-hist");
    box.innerHTML = "";
    var hist = read(KEY_HIST) || [];
    if (!hist.length) {
      box.innerHTML = '<p class="cdl-note">No history yet. Mark today when you finish.</p>';
      return;
    }
    hist.forEach(function (h) {
      var p = document.createElement("p");
      p.className = "cdl-hist-row";
      p.textContent = h.day + " · " + (h.done ? "done" : "open") + " · " + (h.lane || "") + " · " + h.text;
      box.appendChild(p);
    });
  }
  paintHist();
})();
