/**
 * Clarity Day Landing v4 — revamped first paint
 * Symmetric: Do this today · Next ṣalāh countdown · Tasbeeh
 * Adhkār cycle · viewport flex · freeze-safe
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_V4__) return;
  w.__CLARITY_LANDING_V4__ = true;
  // Allow rebuild if v3 left a partial flag
  w.__CDL_V3_BUILT__ = false;

  var KEY_PROV = "clarity_provision_day_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";
  var KEY_DONE = "clarity_today_done_v1";
  var KEY_STREAK = "clarity_soft_streak_v1";
  var KEY_ADH_IDX = "clarity_adhkar_idx_v1";

  var PROVISIONS = [
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence; say Bismillāh before your next ordinary task." },
    { lane: "rights", text: "Settle or note one right: a debt, a trust, or an apology you still owe." },
    { lane: "knowledge", text: "Learn or share one beneficial sentence from Qur’ān or Sunnah with sincerity." },
    { lane: "character", text: "Guard the tongue for one hour: no mockery, no gossip; replace with istighfār." },
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative; ask Allah to make you a source of ongoing good." },
    { lane: "jariyah", text: "Do one small ongoing good: teach something useful, water a plant, or give a quiet ṣadaqah." },
    { lane: "family", text: "One gentle word or act of service for family today." }
  ];

  var ADHKAR = {
    morning: [
      { ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",
        en: "We have entered the morning and the dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day—its opening, victory, light, blessing, and guidance—and I seek refuge in You from the evil in it and the evil after it.",
        ref: "Abū Dāwūd 5084 · educational wording; verify full isnād", target: 1 },
      { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        en: "O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",
        ref: "Tirmidhī 3391 · Abū Dāwūd 5068 · educational", target: 1 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · Tirmidhī 3388 · often 3× · educational", target: 3 },
      { ar: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
        en: "I am pleased with Allah as Lord, with Islam as religion, and with Muhammad ﷺ as Prophet.",
        ref: "Abū Dāwūd 5072 · educational", target: 3 },
      { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Muslim 2691 · often 100× · educational", target: 100 },
      { ar: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
        en: "I seek Allah’s forgiveness and turn to Him in repentance.",
        ref: "Bukhārī 6307 · educational", target: 100 },
      { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        en: "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant. I try to keep Your covenant and promise as much as I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour on me and I acknowledge my sin, so forgive me, for none forgives sins but You.",
        ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
    ],
    evening: [
      { ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ فَتَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا",
        en: "We have entered the evening and the dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this night—its opening, victory, light, blessing, and guidance—and I seek refuge in You from the evil in it and the evil after it.",
        ref: "Abū Dāwūd 5084 · educational wording; verify full isnād", target: 1 },
      { ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        en: "O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the return.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · often 3× · educational", target: 3 },
      { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim 2708 · educational", target: 3 },
      { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Muslim 2691 · educational", target: 100 },
      { ar: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        en: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.",
        ref: "Abū Dāwūd 5045 · educational", target: 3 },
      { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        en: "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant… forgive me, for none forgives sins but You.",
        ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
    ]
  };

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function writeJSON(k, v) {
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
  function todayProvision() {
    var k = todayKey();
    var saved = readJSON(KEY_PROV);
    if (saved && saved.day === k && saved.text) return saved;
    var p = PROVISIONS[Math.abs(hash(k)) % PROVISIONS.length];
    var out = { day: k, lane: p.lane, text: p.text };
    writeJSON(KEY_PROV, out);
    return out;
  }
  function tasState() {
    var k = todayKey();
    var s = readJSON(KEY_TAS);
    if (!s || s.day !== k) { s = { day: k, count: 0 }; writeJSON(KEY_TAS, s); }
    return s;
  }
  function bumpStreak() {
    var k = todayKey();
    var st = readJSON(KEY_STREAK) || { last: "", n: 0 };
    if (st.last === k) return st.n;
    var y = new Date(); y.setDate(y.getDate() - 1);
    var yk = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
    st.n = (st.last === yk) ? (st.n || 0) + 1 : 1;
    st.last = k;
    writeJSON(KEY_STREAK, st);
    writeJSON(KEY_DONE, { day: k, done: 1 });
    return st.n;
  }

  /** Parse next salah from live banner / schedule DOM */
  function parseNextSalah() {
    var names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var found = [];
    try {
      var side = document.querySelector(".salah-times-section, #salah-times, [class*='salah']");
      var root = side || document;
      var rows = root.querySelectorAll("tr, .salah-row, li, div");
      rows.forEach(function (row) {
        var t = (row.textContent || "").replace(/\s+/g, " ").trim();
        names.forEach(function (n) {
          if (t.toLowerCase().indexOf(n.toLowerCase()) === 0 || new RegExp("\\b" + n + "\\b", "i").test(t)) {
            var m = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
            if (m) {
              var hh = parseInt(m[1], 10);
              var mm = parseInt(m[2], 10);
              var ap = (m[3] || "").toLowerCase();
              if (ap === "pm" && hh < 12) hh += 12;
              if (ap === "am" && hh === 12) hh = 0;
              found.push({ name: n, h: hh, m: mm, skip: n === "Sunrise" });
            }
          }
        });
      });
    } catch (e) {}
    // Fallback standard-ish times if DOM empty (user still sees countdown structure)
    if (!found.length) {
      found = [
        { name: "Fajr", h: 5, m: 30 },
        { name: "Dhuhr", h: 13, m: 15 },
        { name: "Asr", h: 16, m: 30 },
        { name: "Maghrib", h: 18, m: 45 },
        { name: "Isha", h: 20, m: 15 }
      ];
    }
    var now = new Date();
    var next = null;
    var nextDate = null;
    for (var dayAdd = 0; dayAdd <= 1 && !next; dayAdd++) {
      for (var i = 0; i < found.length; i++) {
        var f = found[i];
        if (f.skip) continue;
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayAdd, f.h, f.m, 0, 0);
        if (d.getTime() > now.getTime() + 30000) {
          next = f;
          nextDate = d;
          break;
        }
      }
    }
    return { next: next, at: nextDate, all: found };
  }

  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (h > 0) return h + "h " + m + "m";
    if (m > 0) return m + "m " + sec + "s";
    return sec + "s";
  }

  function injectCss() {
    if (document.getElementById("cdl-v4-css")) return;
    var s = document.createElement("style");
    s.id = "cdl-v4-css";
    s.textContent = [
      "#clarity-day-landing{width:100%;max-width:100%;box-sizing:border-box;padding:0.65rem 0.85rem 0.85rem;margin:0 auto;}",
      "@media(min-width:901px){#clarity-day-landing{padding:0.85rem 1.25rem 1rem;}}",
      "#clarity-day-landing .cdl-hero{",
      "  display:grid;gap:0.65rem;",
      "  grid-template-columns:1fr;",
      "  margin-bottom:0.75rem;}",
      "@media(min-width:720px){#clarity-day-landing .cdl-hero{grid-template-columns:1.2fr 1fr 0.9fr;align-items:stretch;}}",
      "#clarity-day-landing .cdl-tile{",
      "  background:linear-gradient(145deg,rgba(15,76,58,0.08),rgba(15,76,58,0.02));",
      "  border:1px solid rgba(15,76,58,0.18);border-radius:16px;padding:0.75rem 0.9rem;",
      "  box-shadow:0 4px 18px rgba(0,0,0,0.04);min-height:5.5rem;display:flex;flex-direction:column;justify-content:center;}",
      "html[data-theme=dark] #clarity-day-landing .cdl-tile{",
      "  background:linear-gradient(145deg,rgba(212,180,90,0.08),rgba(15,40,30,0.5));",
      "  border-color:rgba(212,180,90,0.22);}",
      "#clarity-day-landing .cdl-tile h3{margin:0 0 0.25rem;font-size:0.78rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;opacity:0.75;}",
      "#clarity-day-landing .cdl-tile .cdl-big{font-size:1.35rem;font-weight:700;line-height:1.2;color:var(--accent,#0f4c3a);}",
      "html[data-theme=dark] #clarity-day-landing .cdl-tile .cdl-big{color:#e8d48a;}",
      "#clarity-day-landing .cdl-tile .cdl-sub{font-size:0.8rem;opacity:0.8;margin-top:0.15rem;}",
      "#clarity-day-landing .cdl-tile.cdl-salah-tile .cdl-big{font-variant-numeric:tabular-nums;}",
      "#clarity-day-landing .dual-tiles{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;}",
      "@media(max-width:560px){#clarity-day-landing .dual-tiles{grid-template-columns:1fr;}}",
      "#clarity-day-landing .dual-tile{display:block;text-decoration:none;color:inherit;",
      "  border-radius:14px;padding:0.75rem 0.85rem;border:1px solid rgba(15,76,58,0.2);",
      "  background:linear-gradient(135deg,#f7f3eb,#eef6f1);transition:transform .15s ease,box-shadow .15s;}",
      "html[data-theme=dark] #clarity-day-landing .dual-tile{background:linear-gradient(135deg,#12241c,#0c1a14);border-color:rgba(212,180,90,0.25);}",
      "#clarity-day-landing .dual-tile:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(0,0,0,0.08);}",
      "#clarity-day-landing .dual-tile strong{display:block;font-size:1rem;}",
      "#clarity-day-landing .dual-tile small{display:block;opacity:0.75;font-size:0.78rem;margin-top:0.2rem;}",
      "#clarity-day-landing .cdl-card{border-radius:16px;border:1px solid rgba(15,76,58,0.15);",
      "  background:var(--card-bg,rgba(255,255,255,0.72));padding:0.85rem 1rem;margin-bottom:0.65rem;}",
      "html[data-theme=dark] #clarity-day-landing .cdl-card{background:rgba(12,28,22,0.85);border-color:rgba(212,180,90,0.18);}",
      "#clarity-day-landing .cdl-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.4rem;margin-bottom:0.45rem;}",
      "#clarity-day-landing .cdl-head h2{margin:0;font-size:1.05rem;font-family:Georgia,'Cormorant Garamond',serif;}",
      "#clarity-day-landing .cdl-adhkar-ar{font-size:1.25rem;line-height:1.9;direction:rtl;text-align:right;",
      "  font-family:'Scheherazade New','Amiri',serif;margin:0.4rem 0;}",
      "#clarity-day-landing .cdl-actions{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.55rem;}",
      "#clarity-day-landing .cdl-btn{border:none;border-radius:999px;padding:0.4rem 0.85rem;font-weight:700;cursor:pointer;",
      "  background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;font-size:0.82rem;}",
      "#clarity-day-landing .cdl-btn.secondary{background:transparent;color:var(--accent,#0f4c3a);border:1px solid rgba(15,76,58,0.35);}",
      "html[data-theme=dark] #clarity-day-landing .cdl-btn.secondary{color:#e8d48a;border-color:rgba(212,180,90,0.35);}",
      "#clarity-day-landing .cdl-mini{border:1px solid rgba(15,76,58,0.3);background:rgba(15,76,58,0.08);",
      "  border-radius:8px;padding:0.15rem 0.45rem;cursor:pointer;font-weight:700;}",
      "/* Viewport flex for main landing sections below */",
      "#main-content,#main-application-workspace{width:100%;max-width:100%;box-sizing:border-box;}",
      "@media(min-width:901px){",
      "  #main-content .card,#main-application-workspace .card{width:100%;box-sizing:border-box;}",
      "  .page-wrapper{max-width:none!important;width:100%!important;}",
      "}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(s);
  }

  var adhIdx = 0;
  var adhCount = 0;
  var countdownTimer = null;

  function renderAdhkar(pack) {
    var dh = pack[adhIdx % pack.length];
    var ar = document.getElementById("cdl-adhkar-ar");
    var en = document.getElementById("cdl-adhkar-en");
    var ref = document.getElementById("cdl-adhkar-ref");
    var countBtn = document.getElementById("cdl-adhkar-count");
    var title = document.getElementById("cdl-adhkar-title");
    if (ar) ar.textContent = dh.ar;
    if (en) en.textContent = dh.en;
    if (ref) ref.textContent = dh.ref + " · " + (adhIdx + 1) + "/" + pack.length;
    if (countBtn) countBtn.textContent = "Count 0 / " + dh.target;
    if (title) title.textContent = "Adhkār · " + (isEvening() ? "evening" : "morning") + " window";
    adhCount = 0;
    try { writeJSON(KEY_ADH_IDX, { day: todayKey(), idx: adhIdx }); } catch (e) {}
    return dh;
  }

  function updateSalahTile() {
    var info = parseNextSalah();
    var big = document.getElementById("cdl-salah-name");
    var sub = document.getElementById("cdl-salah-cd");
    var when = document.getElementById("cdl-salah-when");
    if (!info.next || !info.at) {
      if (big) big.textContent = "Ṣalāh";
      if (sub) sub.textContent = "Open schedule in banner";
      return;
    }
    var ms = info.at.getTime() - Date.now();
    if (big) big.textContent = info.next.name;
    if (sub) sub.textContent = "in " + formatCountdown(ms);
    if (when) {
      try {
        when.textContent = info.at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      } catch (e) {
        when.textContent = info.next.h + ":" + String(info.next.m).padStart(2, "0");
      }
    }
  }

  function place(el) {
    var bar = document.getElementById("clarity-visit-strip") || document.querySelector(".visit-strip");
    var visit = document.getElementById("path-doors") || document.querySelector(".path-to-grave, #clarity-path-doors");
    var duo = document.getElementById("clarity-top-duo");
    var host = null;
    var before = null;
    if (bar && bar.parentNode) { host = bar.parentNode; before = bar.nextSibling; }
    else if (visit && visit.parentNode) { host = visit.parentNode; before = visit.nextSibling; }
    else if (duo && duo.parentNode) { host = duo.parentNode; before = duo.nextSibling; }
    else host = document.getElementById("main-content") || document.body;
    if (before) host.insertBefore(el, before);
    else host.appendChild(el);
  }

  function build() {
    if (w.__CDL_V4_BUILT__) return;
    injectCss();
    document.querySelectorAll("#clarity-day-landing").forEach(function (el) { el.remove(); });

    var prov = todayProvision();
    var tas = tasState();
    var pack = isEvening() ? ADHKAR.evening : ADHKAR.morning;
    var savedIdx = readJSON(KEY_ADH_IDX);
    adhIdx = (savedIdx && savedIdx.day === todayKey() && typeof savedIdx.idx === "number") ? savedIdx.idx % pack.length : 0;
    var dh = pack[adhIdx];

    var wrap = document.createElement("section");
    wrap.id = "clarity-day-landing";
    wrap.setAttribute("aria-label", "Daily landing");
    wrap.innerHTML =
      '<div class="dual-tiles" role="navigation">' +
        '<a class="dual-tile" href="#main-content" id="dual-path-companion">' +
          '<span class="dual-ico" aria-hidden="true">🏠</span>' +
          "<strong>Companion path</strong>" +
          "<small>Reminder · Reality · Reflection · Action on this page</small></a>" +
        '<a class="dual-tile" href="https://clarity-dawah.fyi/campus/" id="dual-path-university" target="_blank" rel="noopener">' +
          '<span class="dual-ico" aria-hidden="true">🎓</span>' +
          "<strong>University path</strong>" +
          "<small>Campus desk · four stages · Faculty</small></a>" +
      "</div>" +
      /* Symmetric hero strip */
      '<div class="cdl-hero" role="region" aria-label="Today at a glance">' +
        '<div class="cdl-tile" id="cdl-today-tile">' +
          "<h3>Do this today · " + dayPeriod() + "</h3>" +
          '<div class="cdl-big" style="font-size:1.05rem">' + (prov.lane || "deed") + "</div>" +
          '<div class="cdl-sub">' + prov.text + "</div>" +
          '<div class="cdl-actions" style="margin-top:0.5rem">' +
            '<button type="button" class="cdl-btn" id="cdl-todo-done">Mark done</button>' +
            '<span class="cdl-sub" id="cdl-streak"></span></div></div>' +
        '<div class="cdl-tile cdl-salah-tile" id="cdl-salah-tile">' +
          "<h3>Next ṣalāh</h3>" +
          '<div class="cdl-big" id="cdl-salah-name">…</div>' +
          '<div class="cdl-sub"><span id="cdl-salah-cd">calculating…</span> · <span id="cdl-salah-when"></span></div>' +
          '<div class="cdl-sub">Linked to your schedule in the banner</div></div>' +
        '<div class="cdl-tile" id="cdl-tas-tile">' +
          "<h3>Tasbeeh today</h3>" +
          '<div class="cdl-big"><span id="cdl-tas-count">' + (tas.count || 0) + "</span></div>" +
          '<div class="cdl-sub">Tap +1 · soft count on this device</div>' +
          '<div class="cdl-actions" style="margin-top:0.4rem">' +
            '<button type="button" class="cdl-btn" id="cdl-tas-inc">+1</button>' +
            '<button type="button" class="cdl-btn secondary" id="cdl-tas-reset">↺ Reset</button></div></div>' +
      "</div>" +
      /* Adhkār card with Next cycle */
      '<article class="cdl-card" id="cdl-adhkar">' +
        '<div class="cdl-head">' +
          '<h2 id="cdl-adhkar-title">Adhkār · ' + (isEvening() ? "evening" : "morning") + " window</h2>" +
          '<button type="button" class="cdl-count-btn cdl-mini" id="cdl-adhkar-count">Count 0 / ' + dh.target + "</button></div>" +
        '<p class="cdl-adhkar-ar" id="cdl-adhkar-ar" dir="rtl" lang="ar">' + dh.ar + "</p>" +
        '<p class="cdl-adhkar-en" id="cdl-adhkar-en">' + dh.en + "</p>" +
        '<p class="cdl-adhkar-ref" id="cdl-adhkar-ref" style="font-size:0.78rem;opacity:0.75">' + dh.ref + " · 1/" + pack.length + "</p>" +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn" id="cdl-adhkar-plus">+1 count</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-adhkar-next">Next dhikr →</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-adhkar-reset">↺</button></div>' +
        '<p class="cdl-sub" style="margin-top:0.45rem">Masnūn adhkār for this window · educational · not a fatwa</p>' +
      "</article>";

    place(wrap);
    w.__CDL_V4_BUILT__ = true;
    w.__CDL_V3_BUILT__ = true;

    // Wire adhkār
    var current = dh;
    function refreshCountBtn() {
      var countBtn = document.getElementById("cdl-adhkar-count");
      if (!countBtn) return;
      countBtn.textContent = adhCount >= current.target
        ? ("Done ✓ · " + adhCount)
        : ("Count " + adhCount + " / " + current.target);
    }
    var plus = document.getElementById("cdl-adhkar-plus");
    var next = document.getElementById("cdl-adhkar-next");
    var reset = document.getElementById("cdl-adhkar-reset");
    var countBtn = document.getElementById("cdl-adhkar-count");
    if (plus) plus.onclick = function () {
      adhCount = Math.min(adhCount + 1, current.target);
      refreshCountBtn();
    };
    if (countBtn) countBtn.onclick = function () {
      adhCount = Math.min(adhCount + 1, current.target);
      refreshCountBtn();
    };
    if (reset) reset.onclick = function () {
      adhCount = 0;
      refreshCountBtn();
    };
    if (next) next.onclick = function () {
      adhIdx = (adhIdx + 1) % pack.length;
      current = renderAdhkar(pack);
    };

    // Tasbeeh
    var inc = document.getElementById("cdl-tas-inc");
    var tres = document.getElementById("cdl-tas-reset");
    if (inc) inc.onclick = function () {
      var s = tasState();
      s.count = (s.count || 0) + 1;
      writeJSON(KEY_TAS, s);
      var el = document.getElementById("cdl-tas-count");
      if (el) el.textContent = s.count;
    };
    if (tres) tres.onclick = function () {
      writeJSON(KEY_TAS, { day: todayKey(), count: 0 });
      var el = document.getElementById("cdl-tas-count");
      if (el) el.textContent = "0";
    };

    var done = document.getElementById("cdl-todo-done");
    if (done) done.onclick = function () {
      this.textContent = "Done ✓";
      var st = bumpStreak();
      var el = document.getElementById("cdl-streak");
      if (el) el.textContent = "Soft streak: " + st + " day(s)";
    };

    var comp = document.getElementById("dual-path-companion");
    if (comp) {
      comp.addEventListener("click", function (ev) {
        ev.preventDefault();
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) w.ClarityShell.setMode("companion");
          var mc = document.getElementById("main-content");
          if (mc) mc.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      });
    }

    // Salah countdown — tick every second; re-parse DOM every 30s
    updateSalahTile();
    if (countdownTimer) clearInterval(countdownTimer);
    var ticks = 0;
    countdownTimer = setInterval(function () {
      ticks++;
      if (ticks % 30 === 0) updateSalahTile();
      else {
        var sub = document.getElementById("cdl-salah-cd");
        var info = parseNextSalah();
        if (sub && info.at) sub.textContent = "in " + formatCountdown(info.at.getTime() - Date.now());
      }
    }, 1000);

    try {
      if (w.ClarityShell && typeof w.ClarityShell.apply === "function") w.ClarityShell.apply();
    } catch (e) {}
  }

  function boot() {
    try {
      build();
    } catch (e) {
      console.warn("[landing-v4]", e);
      w.__CDL_V4_BUILT__ = false;
      w.__CDL_V3_BUILT__ = false;
    }
  }

  // Freeze-safe: short delay, retry on load if missing
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 50); });
  } else {
    setTimeout(boot, 50);
  }
  w.addEventListener("load", function () {
    if (!document.getElementById("clarity-day-landing")) setTimeout(boot, 100);
    // Re-sync salah after core fills schedule
    setTimeout(function () {
      try { updateSalahTile(); } catch (e) {}
    }, 2500);
  });
  document.addEventListener("clarity-core-ready", function () {
    try { updateSalahTile(); } catch (e) {}
  });
})(typeof window !== "undefined" ? window : this);
