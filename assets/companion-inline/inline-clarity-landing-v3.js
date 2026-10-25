/**
 * Clarity Day Landing v5 — Furnish your grave
 * Phases A–G: oath + reward, adhkār, wuḍūʾ, prayer steps, send light ahead
 * Educational only — not a fatwa. Verify with a local scholar.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_V5__) return;
  w.__CLARITY_LANDING_V5__ = true;
  w.__CDL_V3_BUILT__ = false;
  w.__CDL_V4_BUILT__ = false;

  var KEY_PROV = "clarity_provision_day_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";
  var KEY_DONE = "clarity_today_done_v1";
  var KEY_STREAK = "clarity_soft_streak_v1";
  var KEY_ADH_IDX = "clarity_adhkar_idx_v1";
  var KEY_LIGHT = "clarity_send_light_v1";

  /* Phase A — provisions framed as grave-furniture */
  var PROVISIONS = [
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence — a light you send into the long stay." },
    { lane: "rights", text: "Settle or note one right: a debt, a trust, or an apology. The scale is real." },
    { lane: "knowledge", text: "Learn or share one beneficial sentence from Qur’ān or Sunnah — knowledge that may outlive you." },
    { lane: "character", text: "Guard the tongue for one hour: no mockery, no gossip; replace with istighfār." },
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative — a gift that may reach the grave." },
    { lane: "jariyah", text: "Intend one small ongoing good: teach something useful, water, or quiet ṣadaqah." },
    { lane: "family", text: "One gentle word or act of service for family — raising hearts that may pray for you." }
  ];

  var ADHKAR = {
    morning: [
      { ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",
        en: "We have entered the morning and the dominion belongs to Allah, Lord of the worlds. O Allah, I ask You for the good of this day…",
        ref: "Abū Dāwūd 5084 · educational", target: 1 },
      { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        en: "O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm…",
        ref: "Abū Dāwūd 5088 · often 3× · educational", target: 3 },
      { ar: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
        en: "I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.",
        ref: "Abū Dāwūd 5072 · educational", target: 3 },
      { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Muslim 2691 · educational", target: 100 },
      { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        en: "O Allah, You are my Lord; there is no god but You… forgive me, for none forgives sins but You.",
        ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
    ],
    evening: [
      { ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ فَتَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا",
        en: "We have entered the evening and the dominion belongs to Allah, Lord of the worlds…",
        ref: "Abū Dāwūd 5084 · educational", target: 1 },
      { ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        en: "O Allah, by You we enter the evening and by You the morning… and to You is the return.",
        ref: "Tirmidhī 3391 · educational", target: 1 },
      { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm…",
        ref: "Abū Dāwūd 5088 · often 3× · educational", target: 3 },
      { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim 2708 · educational", target: 3 },
      { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        en: "Glory be to Allah and His is the praise.",
        ref: "Muslim 2691 · educational", target: 100 },
      { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        en: "O Allah, You are my Lord… forgive me, for none forgives sins but You.",
        ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
    ]
  };

  /* Phase C — wuḍūʾ steps (educational outline) */
  var WUDU_STEPS = [
    { n: 1, t: "Intention & Basmala", d: "Intend wuḍūʾ for ṣalāh; begin with Bismillāh." },
    { n: 2, t: "Hands", d: "Wash both hands up to the wrists three times." },
    { n: 3, t: "Mouth", d: "Rinse the mouth three times." },
    { n: 4, t: "Nose", d: "Sniff water into the nose and expel, three times." },
    { n: 5, t: "Face", d: "Wash the face three times (hairline to chin, ear to ear)." },
    { n: 6, t: "Arms", d: "Wash right then left arm to the elbow, three times each." },
    { n: 7, t: "Head", d: "Wipe the head once; wipe the ears." },
    { n: 8, t: "Feet", d: "Wash right then left foot to the ankle, three times each." }
  ];

  /* Phase D — prayer steps (simplified educational unit) */
  var SALAH_STEPS = [
    { n: 1, t: "Stand & face Qiblah", d: "Stand calmly facing the Qiblah if able." },
    { n: 2, t: "Opening takbīr", d: "Raise hands and say Allāhu akbar; fold hands." },
    { n: 3, t: "Al-Fātiḥah", d: "Recite Sūrat al-Fātiḥah (and more Qur’ān as taught)." },
    { n: 4, t: "Rukūʿ", d: "Bow with back level; glorify Allah." },
    { n: 5, t: "Stand", d: "Rise from bowing; praise Allah." },
    { n: 6, t: "Sujūd", d: "Prostrate twice with a brief sit between." },
    { n: 7, t: "Complete & salām", d: "Finish the required units; end with salām to the right then left." }
  ];

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

  function parseNextSalah() {
    var names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var found = [];
    try {
      var root = document.querySelector(".salah-times-section") || document;
      root.querySelectorAll("tr, .salah-row, li, div").forEach(function (row) {
        var t = (row.textContent || "").replace(/\s+/g, " ").trim();
        names.forEach(function (n) {
          if (new RegExp("\\b" + n + "\\b", "i").test(t)) {
            var m = t.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
            if (m) {
              var hh = parseInt(m[1], 10), mm = parseInt(m[2], 10);
              var ap = (m[3] || "").toLowerCase();
              if (ap === "pm" && hh < 12) hh += 12;
              if (ap === "am" && hh === 12) hh = 0;
              found.push({ name: n, h: hh, m: mm, skip: n === "Sunrise" });
            }
          }
        });
      });
    } catch (e) {}
    if (!found.length) {
      found = [
        { name: "Fajr", h: 5, m: 30 }, { name: "Dhuhr", h: 13, m: 15 },
        { name: "Asr", h: 16, m: 30 }, { name: "Maghrib", h: 18, m: 45 },
        { name: "Isha", h: 20, m: 15 }
      ];
    }
    var now = new Date(), next = null, nextDate = null;
    for (var dayAdd = 0; dayAdd <= 1 && !next; dayAdd++) {
      for (var i = 0; i < found.length; i++) {
        var f = found[i];
        if (f.skip) continue;
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayAdd, f.h, f.m, 0, 0);
        if (d.getTime() > now.getTime() + 30000) { next = f; nextDate = d; break; }
      }
    }
    return { next: next, at: nextDate };
  }
  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (h > 0) return h + "h " + m + "m";
    if (m > 0) return m + "m " + sec + "s";
    return sec + "s";
  }

  function injectCss() {
    if (document.getElementById("cdl-v5-css")) return;
    var s = document.createElement("style");
    s.id = "cdl-v5-css";
    s.textContent = [
      "#clarity-day-landing{width:100%;max-width:100%;box-sizing:border-box;padding:0.65rem 0.85rem 1rem;}",
      "@media(min-width:901px){#clarity-day-landing{padding:0.85rem 1.25rem 1.15rem;}}",
      "#clarity-day-landing .dual-tiles{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;}",
      "@media(max-width:560px){#clarity-day-landing .dual-tiles{grid-template-columns:1fr;}}",
      "#clarity-day-landing .dual-tile{display:block;text-decoration:none;color:inherit;border-radius:14px;padding:0.75rem 0.85rem;",
      "  border:1px solid rgba(15,76,58,0.2);background:linear-gradient(135deg,#f7f3eb,#eef6f1);}",
      "html[data-theme=dark] #clarity-day-landing .dual-tile{background:linear-gradient(135deg,#12241c,#0c1a14);border-color:rgba(212,180,90,0.25);}",
      "#clarity-day-landing .dual-tile strong{display:block;font-size:1rem;}",
      "#clarity-day-landing .dual-tile small{display:block;opacity:0.75;font-size:0.78rem;margin-top:0.2rem;}",
      "#clarity-day-landing .cdl-hero{display:grid;gap:0.65rem;grid-template-columns:1fr;margin-bottom:0.75rem;}",
      "@media(min-width:720px){#clarity-day-landing .cdl-hero{grid-template-columns:1.2fr 1fr 0.9fr;}}",
      "#clarity-day-landing .cdl-tile{background:linear-gradient(145deg,rgba(15,76,58,0.08),rgba(15,76,58,0.02));",
      "  border:1px solid rgba(15,76,58,0.18);border-radius:16px;padding:0.75rem 0.9rem;min-height:5.2rem;",
      "  display:flex;flex-direction:column;justify-content:center;}",
      "html[data-theme=dark] #clarity-day-landing .cdl-tile{background:linear-gradient(145deg,rgba(212,180,90,0.08),rgba(15,40,30,0.5));border-color:rgba(212,180,90,0.22);}",
      "#clarity-day-landing .cdl-tile h3{margin:0 0 0.25rem;font-size:0.72rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;opacity:0.75;}",
      "#clarity-day-landing .cdl-tile .cdl-big{font-size:1.25rem;font-weight:700;line-height:1.2;color:var(--accent,#0f4c3a);}",
      "html[data-theme=dark] #clarity-day-landing .cdl-tile .cdl-big{color:#e8d48a;}",
      "#clarity-day-landing .cdl-tile .cdl-sub{font-size:0.8rem;opacity:0.85;margin-top:0.15rem;}",
      /* Phase A oath */
      "#clarity-day-landing .cdl-oath{display:grid;gap:0.55rem;grid-template-columns:1fr;margin-bottom:0.75rem;}",
      "@media(min-width:700px){#clarity-day-landing .cdl-oath{grid-template-columns:1fr 1fr;}}",
      "#clarity-day-landing .cdl-oath-warn{border-left:4px solid #8a3030;}",
      "#clarity-day-landing .cdl-oath-hope{border-left:4px solid #1a6b52;}",
      "#clarity-day-landing .cdl-card{border-radius:16px;border:1px solid rgba(15,76,58,0.15);",
      "  background:var(--card-bg,rgba(255,255,255,0.78));padding:0.85rem 1rem;margin-bottom:0.65rem;}",
      "html[data-theme=dark] #clarity-day-landing .cdl-card{background:rgba(12,28,22,0.85);border-color:rgba(212,180,90,0.18);}",
      "#clarity-day-landing .cdl-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.4rem;margin-bottom:0.45rem;}",
      "#clarity-day-landing .cdl-head h2{margin:0;font-size:1.05rem;font-family:Georgia,'Cormorant Garamond',serif;}",
      "#clarity-day-landing .cdl-adhkar-ar{font-size:1.22rem;line-height:1.9;direction:rtl;text-align:right;",
      "  font-family:'Scheherazade New','Amiri',serif;margin:0.4rem 0;}",
      "#clarity-day-landing .cdl-actions{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.55rem;}",
      "#clarity-day-landing .cdl-btn{border:none;border-radius:999px;padding:0.4rem 0.85rem;font-weight:700;cursor:pointer;",
      "  background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;font-size:0.82rem;}",
      "#clarity-day-landing .cdl-btn.secondary{background:transparent;color:var(--accent,#0f4c3a);border:1px solid rgba(15,76,58,0.35);}",
      "html[data-theme=dark] #clarity-day-landing .cdl-btn.secondary{color:#e8d48a;border-color:rgba(212,180,90,0.35);}",
      "#clarity-day-landing .cdl-mini{border:1px solid rgba(15,76,58,0.3);background:rgba(15,76,58,0.08);border-radius:8px;padding:0.15rem 0.45rem;cursor:pointer;font-weight:700;}",
      /* Steps grid C/D */
      "#clarity-day-landing .cdl-steps{display:grid;gap:0.4rem;grid-template-columns:1fr;}",
      "@media(min-width:640px){#clarity-day-landing .cdl-steps{grid-template-columns:1fr 1fr;}}",
      "#clarity-day-landing .cdl-step{display:flex;gap:0.55rem;align-items:flex-start;padding:0.45rem 0.5rem;border-radius:12px;",
      "  background:rgba(15,76,58,0.06);border:1px solid rgba(15,76,58,0.1);}",
      "html[data-theme=dark] #clarity-day-landing .cdl-step{background:rgba(212,180,90,0.06);border-color:rgba(212,180,90,0.12);}",
      "#clarity-day-landing .cdl-step-num{flex:0 0 1.75rem;height:1.75rem;border-radius:50%;display:flex;align-items:center;justify-content:center;",
      "  font-weight:800;font-size:0.8rem;background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-day-landing .cdl-step strong{display:block;font-size:0.88rem;}",
      "#clarity-day-landing .cdl-step span{font-size:0.78rem;opacity:0.85;}",
      "#clarity-day-landing details.cdl-fold{margin-bottom:0.65rem;}",
      "#clarity-day-landing details.cdl-fold>summary{cursor:pointer;font-weight:700;padding:0.65rem 0.85rem;border-radius:14px;",
      "  background:linear-gradient(145deg,rgba(15,76,58,0.1),rgba(15,76,58,0.03));border:1px solid rgba(15,76,58,0.18);list-style:none;}",
      "#clarity-day-landing details.cdl-fold>summary::-webkit-details-marker{display:none;}",
      "#clarity-day-landing details.cdl-fold[open]>summary{margin-bottom:0.5rem;border-radius:14px 14px 0 0;}",
      "#clarity-day-landing details.cdl-fold .cdl-fold-body{padding:0.25rem 0.15rem 0.5rem;}",
      /* Phase E light row */
      "#clarity-day-landing .cdl-light{display:grid;gap:0.45rem;grid-template-columns:1fr;margin-bottom:0.65rem;}",
      "@media(min-width:700px){#clarity-day-landing .cdl-light{grid-template-columns:1fr 1fr 1fr;}}",
      "#clarity-day-landing .cdl-light button{text-align:left;}",
      "#clarity-day-landing .cdl-foot{font-size:0.72rem;opacity:0.75;text-align:center;margin-top:0.35rem;}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(s);
  }

  var adhIdx = 0, adhCount = 0, countdownTimer = null;

  function renderAdhkar(pack) {
    var dh = pack[adhIdx % pack.length];
    var ar = document.getElementById("cdl-adhkar-ar");
    var en = document.getElementById("cdl-adhkar-en");
    var ref = document.getElementById("cdl-adhkar-ref");
    var countBtn = document.getElementById("cdl-adhkar-count");
    if (ar) ar.textContent = dh.ar;
    if (en) en.textContent = dh.en;
    if (ref) ref.textContent = dh.ref + " · " + (adhIdx + 1) + "/" + pack.length;
    if (countBtn) countBtn.textContent = "Count 0 / " + dh.target;
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
      if (sub) sub.textContent = "See banner schedule";
      return;
    }
    if (big) big.textContent = info.next.name;
    if (sub) sub.textContent = "in " + formatCountdown(info.at.getTime() - Date.now());
    if (when) {
      try { when.textContent = info.at.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }); }
      catch (e) { when.textContent = info.next.h + ":" + String(info.next.m).padStart(2, "0"); }
    }
  }

  function stepsHtml(list) {
    return list.map(function (s) {
      return '<div class="cdl-step"><div class="cdl-step-num">' + s.n + "</div><div><strong>" + s.t +
        "</strong><span>" + s.d + "</span></div></div>";
    }).join("");
  }

  function place(el) {
    var bar = document.getElementById("clarity-visit-strip") || document.querySelector(".visit-strip");
    var duo = document.getElementById("clarity-top-duo");
    var host = null, before = null;
    if (bar && bar.parentNode) { host = bar.parentNode; before = bar.nextSibling; }
    else if (duo && duo.parentNode) { host = duo.parentNode; before = duo.nextSibling; }
    else host = document.getElementById("main-content") || document.body;
    if (before) host.insertBefore(el, before);
    else host.appendChild(el);
  }

  function build() {
    if (w.__CDL_V5_BUILT__) return;
    injectCss();
    document.querySelectorAll("#clarity-day-landing").forEach(function (el) { el.remove(); });

    var prov = todayProvision();
    var tas = tasState();
    var pack = isEvening() ? ADHKAR.evening : ADHKAR.morning;
    var savedIdx = readJSON(KEY_ADH_IDX);
    adhIdx = (savedIdx && savedIdx.day === todayKey() && typeof savedIdx.idx === "number") ? savedIdx.idx % pack.length : 0;
    var dh = pack[adhIdx];
    var light = readJSON(KEY_LIGHT) || {};

    var wrap = document.createElement("section");
    wrap.id = "clarity-day-landing";
    wrap.setAttribute("aria-label", "Daily landing — furnish your grave");
    wrap.innerHTML =
      '<div class="dual-tiles" role="navigation">' +
        '<a class="dual-tile" href="#main-content" id="dual-path-companion"><strong>Companion path</strong>' +
          "<small>Reminder · Reality · Reflection · Action — tools on this page</small></a>" +
        '<a class="dual-tile" href="https://clarity-dawah.fyi/campus/" target="_blank" rel="noopener"><strong>University path</strong>' +
          "<small>Campus desk · four stages · Faculty</small></a></div>" +

      '<div class="cdl-hero" role="region" aria-label="Today at a glance">' +
        '<div class="cdl-tile"><h3>Do this today · ' + dayPeriod() + "</h3>" +
          '<div class="cdl-big" style="font-size:1.05rem">' + (prov.lane || "deed") + "</div>" +
          '<div class="cdl-sub">' + prov.text + "</div>" +
          '<div class="cdl-actions"><button type="button" class="cdl-btn" id="cdl-todo-done">Mark done</button>' +
          '<span class="cdl-sub" id="cdl-streak"></span></div></div>' +
        '<div class="cdl-tile"><h3>Next ṣalāh</h3><div class="cdl-big" id="cdl-salah-name">…</div>' +
          '<div class="cdl-sub"><span id="cdl-salah-cd">…</span> · <span id="cdl-salah-when"></span></div>' +
          '<div class="cdl-sub">Linked to your banner schedule</div></div>' +
        '<div class="cdl-tile"><h3>Tasbeeh today</h3><div class="cdl-big"><span id="cdl-tas-count">' + (tas.count || 0) + "</span></div>" +
          '<div class="cdl-sub">Soft count on this device</div>' +
          '<div class="cdl-actions"><button type="button" class="cdl-btn" id="cdl-tas-inc">+1</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-tas-reset">↺</button></div></div></div>' +

      /* Phase A — oath plaque */
      '<div class="cdl-oath" role="region" aria-label="Furnish your grave">' +
        '<div class="cdl-card cdl-oath-warn"><div class="cdl-head"><h2>Remember the long stay</h2></div>' +
          '<p class="cdl-sub">Family and wealth turn back at the grave; <strong>deeds stay with you</strong>. Prepare a home of light — not only a warning, an invitation to send good ahead today.</p>' +
          '<p class="cdl-sub">Educational reminder · not a fatwa</p></div>' +
        '<div class="cdl-card cdl-oath-hope"><div class="cdl-head"><h2>Reward that may continue</h2></div>' +
          '<p class="cdl-sub">When a person dies, deeds end except <strong>ongoing charity</strong>, <strong>beneficial knowledge</strong>, and a <strong>righteous child who prays</strong> for them.</p>' +
          '<p class="cdl-sub">Muslim 1631 · educational wording · verify with a scholar</p></div></div>' +

      /* Adhkār */
      '<article class="cdl-card" id="cdl-adhkar"><div class="cdl-head">' +
        '<h2>Adhkār · ' + (isEvening() ? "evening" : "morning") + " window</h2>" +
        '<button type="button" class="cdl-mini" id="cdl-adhkar-count">Count 0 / ' + dh.target + "</button></div>" +
        '<p class="cdl-adhkar-ar" id="cdl-adhkar-ar" dir="rtl" lang="ar">' + dh.ar + "</p>" +
        '<p id="cdl-adhkar-en">' + dh.en + "</p>" +
        '<p id="cdl-adhkar-ref" class="cdl-sub">' + dh.ref + " · 1/" + pack.length + "</p>" +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn" id="cdl-adhkar-plus">+1 count</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-adhkar-next">Next dhikr →</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-adhkar-reset">↺</button></div></article>' +

      /* Phase G — short protection note */
      '<div class="cdl-card"><div class="cdl-head"><h2>Core protection set</h2></div>' +
        '<p class="cdl-sub">When ready, add from authentic collections: <strong>Āyat al-Kursī</strong>, the three Quls (Ikhlāṣ, Falaq, Nās) often 3×, and Sayyid al-istighfār. Start small; consistency is furniture for the heart.</p>' +
        '<p class="cdl-sub">Hisn-style practice · educational · learn full wording with a teacher</p></div>' +

      /* Phase C — wuḍūʾ */
      '<details class="cdl-fold" id="cdl-wudu"><summary>💧 Wuḍūʾ steps · illustrated outline (tap to expand)</summary>' +
        '<div class="cdl-fold-body"><div class="cdl-steps">' + stepsHtml(WUDU_STEPS) + "</div>" +
        '<p class="cdl-sub">Educational outline — schools differ on details. Learn with a local teacher.</p></div></details>' +

      /* Phase D — prayer */
      '<details class="cdl-fold" id="cdl-salah-steps"><summary>🕌 Prayer steps · simple unit (tap to expand)</summary>' +
        '<div class="cdl-fold-body"><div class="cdl-steps">' + stepsHtml(SALAH_STEPS) + "</div>" +
        '<p class="cdl-sub">Simplified teaching path — not a full fiqh manual. Pillars first; verify with a teacher.</p></div></details>' +

      /* Phase E — send light ahead */
      '<div class="cdl-card"><div class="cdl-head"><h2>Send light ahead today</h2></div>' +
        '<p class="cdl-sub">Three small intentions that echo ongoing reward themes (Muslim 1631 · educational).</p>' +
        '<div class="cdl-light">' +
          '<button type="button" class="cdl-btn secondary" data-light="knowledge" id="cdl-light-k">📖 Beneficial knowledge' +
            (light.knowledge ? " · ✓" : "") + "</button>" +
          '<button type="button" class="cdl-btn secondary" data-light="sadaqah" id="cdl-light-s">💧 Ṣadaqah intention' +
            (light.sadaqah ? " · ✓" : "") + "</button>" +
          '<button type="button" class="cdl-btn secondary" data-light="dua" id="cdl-light-d">🤲 Duʿāʾ for parents' +
            (light.dua ? " · ✓" : "") + "</button></div>" +
        '<p class="cdl-sub" id="cdl-light-msg">Tap to mark an intention on this device — act happens offline, with sincerity.</p></div>' +

      '<p class="cdl-foot">Furnish your grave · prepare for the long stay · educational companion · not a fatwa</p>';

    place(wrap);
    w.__CDL_V5_BUILT__ = true;
    w.__CDL_V4_BUILT__ = true;
    w.__CDL_V3_BUILT__ = true;

    var current = dh;
    function refreshCountBtn() {
      var countBtn = document.getElementById("cdl-adhkar-count");
      if (!countBtn) return;
      countBtn.textContent = adhCount >= current.target ? ("Done ✓ · " + adhCount) : ("Count " + adhCount + " / " + current.target);
    }
    var plus = document.getElementById("cdl-adhkar-plus");
    var next = document.getElementById("cdl-adhkar-next");
    var reset = document.getElementById("cdl-adhkar-reset");
    var countBtn = document.getElementById("cdl-adhkar-count");
    if (plus) plus.onclick = function () { adhCount = Math.min(adhCount + 1, current.target); refreshCountBtn(); };
    if (countBtn) countBtn.onclick = function () { adhCount = Math.min(adhCount + 1, current.target); refreshCountBtn(); };
    if (reset) reset.onclick = function () { adhCount = 0; refreshCountBtn(); };
    if (next) next.onclick = function () { adhIdx = (adhIdx + 1) % pack.length; current = renderAdhkar(pack); };

    var inc = document.getElementById("cdl-tas-inc");
    var tres = document.getElementById("cdl-tas-reset");
    if (inc) inc.onclick = function () {
      var s = tasState(); s.count = (s.count || 0) + 1; writeJSON(KEY_TAS, s);
      var el = document.getElementById("cdl-tas-count"); if (el) el.textContent = s.count;
    };
    if (tres) tres.onclick = function () {
      writeJSON(KEY_TAS, { day: todayKey(), count: 0 });
      var el = document.getElementById("cdl-tas-count"); if (el) el.textContent = "0";
    };

    var done = document.getElementById("cdl-todo-done");
    if (done) done.onclick = function () {
      this.textContent = "Done ✓";
      var st = bumpStreak();
      var el = document.getElementById("cdl-streak");
      if (el) el.textContent = "Soft streak: " + st + " day(s)";
    };

    document.querySelectorAll("[data-light]").forEach(function (btn) {
      btn.onclick = function () {
        var k = this.getAttribute("data-light");
        var o = readJSON(KEY_LIGHT) || {};
        o[k] = 1; o.day = todayKey();
        writeJSON(KEY_LIGHT, o);
        if (this.textContent.indexOf("✓") < 0) this.textContent += " · ✓";
        var msg = document.getElementById("cdl-light-msg");
        if (msg) {
          if (k === "knowledge") msg.textContent = "Intention noted: share or review one beneficial sentence today.";
          else if (k === "sadaqah") msg.textContent = "Intention noted: give or arrange a small ongoing good when you can.";
          else msg.textContent = "Intention noted: make duʿāʾ for your parents or the deceased — educational practice.";
        }
      };
    });

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

    try { if (w.ClarityShell && typeof w.ClarityShell.apply === "function") w.ClarityShell.apply(); } catch (e) {}
  }

  function boot() {
    try { build(); }
    catch (e) {
      console.warn("[landing-v5]", e);
      w.__CDL_V5_BUILT__ = false;
      w.__CDL_V4_BUILT__ = false;
      w.__CDL_V3_BUILT__ = false;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 50); });
  } else setTimeout(boot, 50);
  w.addEventListener("load", function () {
    if (!document.getElementById("clarity-day-landing")) setTimeout(boot, 100);
    setTimeout(function () { try { updateSalahTile(); } catch (e) {} }, 2500);
  });
  document.addEventListener("clarity-core-ready", function () {
    try { updateSalahTile(); } catch (e) {}
  });
})(typeof window !== "undefined" ? window : this);
