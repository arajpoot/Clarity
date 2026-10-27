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
    { n: 1, t: "Intention & Basmala", d: "Intend wuḍūʾ for ṣalāh; begin with Bismillāh when you start washing.",
      tip: "Actions are by intentions — let the heart lead the limbs.",
      src: "Bukhārī 1 · Muslim 1907 · educational",
      learn: "https://sunnah.com/bukhari:1" },
    { n: 2, t: "Hands to the wrists", d: "Wash both hands up to the wrists three times, including between the fingers.",
      tip: "Start on the right when limbs come in pairs, as in the prophetic pattern.",
      src: "Prophetic wuḍūʾ descriptions · educational outline",
      learn: "https://sunnah.com/search?q=wudu" },
    { n: 3, t: "Mouth", d: "Rinse the mouth three times — move water thoroughly, then expel.",
      tip: "A small, calm rinse is enough; no waste of water.",
      src: "Wuḍūʾ of the Prophet ﷺ · educational",
      learn: "https://sunnah.com/search?q=rinsed%20mouth%20wudu" },
    { n: 4, t: "Nose", d: "Sniff water into the nose and expel, three times.",
      tip: "Gentle; do not harm yourself. Schools differ on details — learn with a teacher.",
      src: "Same prophetic reports · educational",
      learn: "https://sunnah.com/search?q=nose%20wudu" },
    { n: 5, t: "Face", d: "Wash the face three times: hairline to chin, ear to ear.",
      tip: "Cover the whole face surface; beard rules differ by school.",
      src: "Qurʾān 5:6 — wash your faces · educational",
      learn: "https://quran.com/5/6" },
    { n: 6, t: "Arms to the elbows", d: "Wash the right arm to the elbow three times, then the left — include the elbows.",
      tip: "Right then left. Elbows are part of the wash in the standard reading of 5:6.",
      src: "Qurʾān 5:6 · educational",
      learn: "https://quran.com/5/6" },
    { n: 7, t: "Head & ears", d: "Wipe the head once; wipe the ears (inside and out as taught).",
      tip: "Wiping is not the same as washing — follow what your teacher shows.",
      src: "Qurʾān 5:6 — wipe your heads · educational",
      learn: "https://quran.com/5/6" },
    { n: 8, t: "Feet to the ankles", d: "Wash the right foot to the ankle three times, then the left — between the toes.",
      tip: "Complete the limbs; then you may say the well-known shahāda after wuḍūʾ as taught.",
      src: "Qurʾān 5:6 · post-wuḍūʾ dhikr reports · educational",
      learn: "https://sunnah.com/search?q=wudu%20shahada" }
  ];

  /* Phase D — prayer steps (simplified educational unit) */
  var SALAH_STEPS = [
    { n: 1, t: "Stand & face Qiblah", d: "Stand calmly facing the Qiblah if able; settle the heart before takbīr.",
      tip: "Wherever you are, turn your face toward al-Masjid al-Ḥarām.",
      src: "Qurʾān 2:144 · educational",
      learn: "https://quran.com/2/144" },
    { n: 2, t: "Opening takbīr", d: "Raise the hands and say Allāhu akbar; place the hands as taught in your school.",
      tip: "The prayer opens with takbīr — leave side talk and focus.",
      src: "Opening of ṣalāh reports · educational",
      learn: "https://sunnah.com/search?q=allahu%20akbar%20prayer" },
    { n: 3, t: "Al-Fātiḥah", d: "Recite Sūrat al-Fātiḥah; then further Qur’ān as taught for that unit.",
      tip: "No prayer is complete without al-Fātiḥah in the standard ḥadīth teaching.",
      src: "Bukhārī 756 · Muslim 394 · Qurʾān 1 · educational",
      learn: "https://quran.com/1" },
    { n: 4, t: "Rukūʿ", d: "Bow with the back level; hands on knees; glorify Allah (e.g. Subḥāna Rabbiyal-ʿAẓīm).",
      tip: "Pause calmly — do not rush the bowing.",
      src: "Prophetic rukūʿ descriptions · educational",
      learn: "https://sunnah.com/search?q=ruku" },
    { n: 5, t: "Stand from rukūʿ", d: "Rise saying Samiʿallāhu liman ḥamidah; stand straight; praise Allah.",
      tip: "Let the spine settle upright before going to sujūd.",
      src: "Prophetic transition phrases · educational",
      learn: "https://sunnah.com/search?q=sami%20allahu" },
    { n: 6, t: "Sujūd (twice)", d: "Prostrate so forehead, nose, hands, knees, and feet touch as taught; sit briefly; prostrate again.",
      tip: "Closest is the servant to his Lord while prostrating — lengthen duʿāʾ if you wish.",
      src: "Muslim 482 · educational wording",
      learn: "https://sunnah.com/muslim:482" },
    { n: 7, t: "Tashahhud, units & salām", d: "Complete the required units with tashahhud where taught; end with salām to the right then left.",
      tip: "Learn the full tashahhud wording with a teacher; this card is only a map.",
      src: "Prophetic tashahhud & salām · educational",
      learn: "https://sunnah.com/search?q=tashahhud" }
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
    var order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var found = [];
    try {
      var list = document.getElementById("salah-times-list") ||
        document.querySelector("#clarity-top-duo .salah-times-list, .salah-times-section ul");
      if (list) {
        list.querySelectorAll("li").forEach(function (li) {
          var nameEl = li.querySelector(".salah-name");
          var timeEl = li.querySelector(".salah-time");
          var name = (nameEl ? nameEl.textContent : li.textContent || "").replace(/\s+/g, " ").trim();
          var time = (timeEl ? timeEl.textContent : "").replace(/\s+/g, " ").trim();
          if (!time) {
            var m0 = (li.textContent || "").match(/(\d{1,2}):(\d{2})/);
            if (m0) time = m0[0];
          }
          var base = "";
          order.forEach(function (n) {
            if (new RegExp("^" + n + "\\b", "i").test(name) || name.toLowerCase() === n.toLowerCase()) base = n;
          });
          if (!base) {
            order.forEach(function (n) {
              if (new RegExp("\\b" + n + "\\b", "i").test(name)) base = n;
            });
          }
          var m = String(time).match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
          if (base && m) {
            var hh = parseInt(m[1], 10), mm = parseInt(m[2], 10);
            var ap = (m[3] || "").toLowerCase();
            if (ap === "pm" && hh < 12) hh += 12;
            if (ap === "am" && hh === 12) hh = 0;
            // Banner uses 24h when no am/pm — keep as-is if hour > 12 or explicit
            found.push({ name: base, h: hh, m: mm, skip: base === "Sunrise" });
          }
        });
      }
    } catch (e) {}
    // Do not invent times if list empty — wait for banner
    if (!found.length) return { next: null, at: null };
    var now = new Date(), next = null, nextDate = null;
    for (var dayAdd = 0; dayAdd <= 1 && !next; dayAdd++) {
      for (var i = 0; i < found.length; i++) {
        var f = found[i];
        if (f.skip) continue;
        var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayAdd, f.h, f.m, 0, 0);
        if (d.getTime() > now.getTime() + 15000) { next = f; nextDate = d; break; }
      }
    }
    return { next: next, at: nextDate, all: found };
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
    var _oldCdl = document.getElementById("cdl-v5-css"); if (_oldCdl) _oldCdl.remove();
    if (document.getElementById("cdl-v6-css")) return;
    var s = document.createElement("style");
    s.id = "cdl-v6-css";
    s.textContent = [
      "#clarity-day-landing{width:100%;max-width:100%;box-sizing:border-box;padding:0.65rem 0.85rem 1rem;}",
      "@media(min-width:901px){#clarity-day-landing{padding:0.85rem 1.25rem 1.15rem;}}",
      "#clarity-day-landing .dual-tiles{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;}",
      "@media(max-width:560px){#clarity-day-landing .dual-tiles{grid-template-columns:1fr;}}",
      "#clarity-day-landing .dual-tile{display:block;text-decoration:none;color:inherit;border-radius:14px;padding:0.75rem 0.85rem;",
      "  border:1px solid rgba(15,76,58,0.2);background:linear-gradient(135deg,#f7f3eb,#eef6f1);}",
      "html[data-theme=dark] #clarity-day-landing .dual-tile{background:linear-gradient(135deg,#12241c,#0c1a14);border-color:rgba(212,180,90,0.25);}",
      "#clarity-day-landing .dual-ico{font-size:1.25rem;display:block;margin-bottom:0.2rem;}#clarity-day-landing .dual-tile strong{display:block;font-size:1rem;}",
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
      "@media(min-width:640px){#clarity-day-landing .cdl-steps{grid-template-columns:1fr;}}",
      "#clarity-day-landing .cdl-step{display:flex;gap:0.55rem;align-items:flex-start;padding:0.45rem 0.5rem;border-radius:12px;",
      "  background:rgba(15,76,58,0.06);border:1px solid rgba(15,76,58,0.1);}",
      "html[data-theme=dark] #clarity-day-landing .cdl-step{background:rgba(212,180,90,0.06);border-color:rgba(212,180,90,0.12);}",
      "#clarity-day-landing .cdl-step-num{flex:0 0 1.75rem;height:1.75rem;border-radius:50%;display:flex;align-items:center;justify-content:center;",
      "  font-weight:800;font-size:0.8rem;background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;}",
      "#clarity-day-landing .cdl-step strong{display:block;font-size:0.88rem;}",
      "#clarity-day-landing .cdl-step span{font-size:0.78rem;opacity:0.85;}",
      "#clarity-day-landing .cdl-expand-btn{display:flex;align-items:center;justify-content:space-between;width:100%;gap:0.5rem;border:none;background:transparent;color:inherit;font:inherit;font-weight:700;cursor:pointer;padding:0.15rem 0;text-align:left;}#clarity-day-landing .cdl-expand-btn .cdl-chev{transition:transform 0.15s ease;font-size:0.9rem;opacity:0.8;}#clarity-day-landing .cdl-expand-btn[aria-expanded=true] .cdl-chev{transform:rotate(180deg);}#clarity-day-landing .cdl-fold-body{padding:0.45rem 0 0.15rem;}#clarity-day-landing .cdl-expand-card{position:relative;z-index:2;}#clarity-day-landing details.cdl-fold{margin-bottom:0.65rem;}",
      "#clarity-day-landing details.cdl-fold>summary{cursor:pointer;font-weight:700;padding:0.65rem 0.85rem;border-radius:14px;",
      "  background:linear-gradient(145deg,rgba(15,76,58,0.1),rgba(15,76,58,0.03));border:1px solid rgba(15,76,58,0.18);list-style:none;}",
      "#clarity-day-landing details.cdl-fold>summary::-webkit-details-marker{display:none;}",
      "#clarity-day-landing details.cdl-fold[open]>summary{border-color:rgba(212,180,90,0.35);}",
      "#clarity-day-landing .cdl-card{border-radius:18px;border:1px solid rgba(212,180,90,0.28);padding:0.85rem 1rem;margin-bottom:0.75rem;background:linear-gradient(145deg,rgba(255,255,255,0.05),rgba(15,76,58,0.07));box-shadow:inset 0 1px 0 rgba(255,255,255,0.07),0 8px 22px rgba(0,0,0,0.2);}",
      "html[data-theme=light] #clarity-day-landing .cdl-card{background:linear-gradient(165deg,#fbf8f1,#eef5f0);box-shadow:inset 0 1px 0 #fff,0 6px 16px rgba(15,76,58,0.08);}",
      "#clarity-day-landing .cdl-steps{display:flex!important;flex-direction:column!important;gap:0.25rem;}",
      "#clarity-day-landing .cdl-step,#clarity-day-landing .cdl-step-rich{display:flex!important;width:100%!important;flex-direction:row;gap:0.65rem;padding:0.7rem 0.35rem;border-bottom:1px solid rgba(212,180,90,0.12);align-items:flex-start;box-sizing:border-box;grid-column:1/-1;}",
      "#clarity-day-landing .cdl-step-num{flex:0 0 1.65rem;height:1.65rem;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;background:rgba(15,76,58,0.25);border:1px solid rgba(212,180,90,0.4);}",
      "#clarity-day-landing .cdl-step-body{flex:1;min-width:0;}",
      "#clarity-day-landing .cdl-step-body strong{display:block;font-size:0.92rem;}",
      "#clarity-day-landing .cdl-step-d{display:block!important;font-size:0.82rem;line-height:1.45;margin-top:0.15rem;opacity:0.92;}",
      "#clarity-day-landing .cdl-step-tip{display:block!important;margin:0.3rem 0 0;font-size:0.78rem;font-style:italic;opacity:0.82;line-height:1.4;}",
      "#clarity-day-landing .cdl-step-src{display:block!important;margin:0.2rem 0 0;font-size:0.7rem;opacity:0.72;}",
      "#clarity-day-landing .cdl-learn{display:inline-block!important;visibility:visible!important;margin:0.4rem 0.55rem 0 0;font-size:0.76rem;font-weight:700;color:#e8d48a!important;text-decoration:none;border-bottom:1px solid rgba(232,212,138,0.45);}",
      "html[data-theme=light] #clarity-day-landing .cdl-learn{color:#0f4c3a!important;}",
      "#clarity-day-landing .cdl-fold-body{display:block!important;max-height:none!important;overflow:visible!important;}",
      "#clarity-day-landing .cdl-fold-body[hidden]{display:none!important;}",
      "#clarity-day-landing .cdl-rakah-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:0.4rem;margin:0.65rem 0;}",
      "@media(max-width:560px){#clarity-day-landing .cdl-rakah-grid{grid-template-columns:repeat(3,1fr);}}",
      "#clarity-day-landing .cdl-rakah{text-align:center;padding:0.55rem 0.25rem;border-radius:14px;border:1px solid rgba(212,180,90,0.22);background:rgba(0,0,0,0.18);}",
      "#clarity-day-landing .cdl-rakah-n{display:block;font-size:1.35rem;font-weight:800;color:#e8d48a;}",
      "html[data-theme=light] #clarity-day-landing .cdl-rakah-n{color:#0f4c3a;}",
      "#clarity-day-landing .cdl-rakah strong{display:block;font-size:0.78rem;}",
      "#clarity-day-landing .cdl-rakah small{opacity:0.7;font-size:0.68rem;}",
      "#clarity-day-landing .cdl-qibla-row{display:grid;grid-template-columns:130px 1fr;gap:0.85rem;align-items:center;margin-top:0.55rem;}",
      "@media(max-width:560px){#clarity-day-landing .cdl-qibla-row{grid-template-columns:1fr;justify-items:center;text-align:center;}}",
      "#clarity-day-landing .cdl-compass-dial{width:118px;height:118px;border-radius:50%;position:relative;border:2px solid rgba(212,180,90,0.45);background:radial-gradient(circle at 40% 35%,rgba(255,255,255,0.08),rgba(0,0,0,0.4));box-shadow:inset 0 0 18px rgba(0,0,0,0.35);}",
      "#clarity-day-landing .cdl-compass-kaaba{position:absolute;top:8px;left:50%;transform:translateX(-50%);font-size:1rem;}",
      "#clarity-day-landing .cdl-compass-needle{position:absolute;left:50%;top:50%;width:4px;height:46%;margin-left:-2px;margin-top:-46%;background:linear-gradient(180deg,#e8d48a,transparent);border-radius:2px;transform-origin:bottom center;transition:transform 0.2s ease-out;}",
      "#clarity-day-landing .cdl-pillar-grid{display:grid;grid-template-columns:1fr;gap:0.65rem;}",
      "@media(min-width:800px){#clarity-day-landing .cdl-pillar-grid{grid-template-columns:1fr 1fr 1fr;}}",
      "#clarity-day-landing .cdl-ico{margin-right:0.35rem;}",
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
      var learn = s.learn
        ? '<a class="cdl-learn" href="' + s.learn + '" target="_blank" rel="noopener">Deepen · source ↗</a>'
        : "";
      var tip = s.tip ? '<p class="cdl-step-tip">' + s.tip + "</p>" : "";
      var src = s.src ? '<p class="cdl-step-src">' + s.src + " · not a fatwa</p>" : "";
      return '<div class="cdl-step cdl-step-rich">' +
        '<div class="cdl-step-num">' + s.n + "</div>" +
        '<div class="cdl-step-body"><strong>' + s.t + "</strong>" +
        '<span class="cdl-step-d">' + s.d + "</span>" + tip + src + learn +
        "</div></div>";
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
    if (w.__CDL_V12_BUILT__) return;
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
    wrap.setAttribute("data-landing-root", "1");
    wrap.innerHTML =
      '<div class="dual-tiles" data-landing="paths" role="navigation" aria-label="Choose a path">' +
        '<a class="dual-tile" href="#main-content" id="dual-path-companion">' +
          '<span class="dual-ico" aria-hidden="true">🏠</span><strong>Companion path</strong>' +
          '<small>Reminder · Reality · Reflection · Action — tools on this page</small></a>' +
        '<a class="dual-tile" href="https://clarity-dawah.fyi/campus/" target="_blank" rel="noopener" id="dual-path-university">' +
          '<span class="dual-ico" aria-hidden="true">🎓</span><strong>University path</strong>' +
          '<small>Campus desk · four stages · Faculty</small></a></div>' +

      '<div class="cdl-hero" data-landing="pulse" role="region" aria-label="Today at a glance">' +
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

      /* Adhkār */
      '<article class="cdl-card" id="cdl-adhkar" data-landing="adhkar"><div class="cdl-head">' +
        '<h2>Adhkār · ' + (isEvening() ? "evening" : "morning") + " window</h2>" +
        '<button type="button" class="cdl-mini" id="cdl-adhkar-count">Count 0 / ' + dh.target + "</button></div>" +
        '<p class="cdl-adhkar-ar" id="cdl-adhkar-ar" dir="rtl" lang="ar">' + dh.ar + "</p>" +
        '<p id="cdl-adhkar-en">' + dh.en + "</p>" +
        '<p id="cdl-adhkar-ref" class="cdl-sub">' + dh.ref + " · 1/" + pack.length + "</p>" +
        '<div class="cdl-actions">' +
          '<button type="button" class="cdl-btn" id="cdl-adhkar-plus">+1 count</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-adhkar-next">Next dhikr →</button>' +
          '<button type="button" class="cdl-btn secondary" id="cdl-adhkar-reset">↺</button></div></article>' +

      '<div class="cdl-card cdl-plaque" id="cdl-amana-note-host" data-landing="amana-note">' +
        '<div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🔒</span> Vault note registry · on-device</h2></div>' +
        '<p class="cdl-sub">Write here only. Saved notes appear under Amānah Vault → Heir readiness (collapsed) — not listed on this page. On-device · educational · not legal advice.</p>' +
        '<div id="amana-note-registry-landing"></div></div>' +


      /* Phase A — oath plaque */
      '<div class="cdl-oath" role="region" aria-label="Furnish your grave">' +
        '<div class="cdl-card cdl-oath-warn"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🕯️</span> Remember the long stay</h2></div>' +
          '<p class="cdl-sub">Family and wealth turn back at the grave; <strong>deeds stay with you</strong>. Prepare a home of light — not only a warning, an invitation to send good ahead today.</p>' +
          '<p class="cdl-sub">Educational reminder · not a fatwa</p></div>' +
        '<div class="cdl-card cdl-oath-hope"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🌱</span> Reward that may continue</h2></div>' +
          '<p class="cdl-sub">When a person dies, deeds end except <strong>ongoing charity</strong>, <strong>beneficial knowledge</strong>, and a <strong>righteous child who prays</strong> for them.</p>' +
          '<p class="cdl-sub">Muslim 1631 · educational wording · verify with a scholar</p></div></div>' +

      /* Phase G — short protection note */
      '<div class="cdl-card"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🛡️</span> Core protection set</h2></div>' +
        '<p class="cdl-sub">When ready, add from authentic collections: <strong>Āyat al-Kursī</strong>, the three Quls (Ikhlāṣ, Falaq, Nās) often 3×, and Sayyid al-istighfār. Start small; consistency is furniture for the heart.</p>' +
        '<p class="cdl-sub">Hisn-style practice · educational · learn full wording with a teacher</p></div>' +

      /* Phase C/D — explicit expand pills (no native details) */
      '<div class="cdl-card cdl-expand-card" id="cdl-wudu">' +
        '<button type="button" class="cdl-expand-btn" id="cdl-wudu-btn" aria-expanded="false" aria-controls="cdl-wudu-body">' +
          "💧 Wuḍūʾ steps · illustrated outline <span class=\"cdl-chev\">▾</span></button>" +
        '<div class="cdl-fold-body" id="cdl-wudu-body" hidden>' +
          '<div class="cdl-steps">' + stepsHtml(WUDU_STEPS) + "</div>" +
          '<p class="cdl-sub">Educational outline — schools differ on details. Learn with a local teacher.</p>' +
          '<p class="cdl-sub cdl-deep-strip">Deepen: <a href="https://quran.com/5/6" target="_blank" rel="noopener">Qurʾān 5:6</a> · <a href="https://sunnah.com/search?q=wudu" target="_blank" rel="noopener">Sunnah.com · wuḍūʾ</a> · not a fatwa</p></div></div>' +

      '<div class="cdl-card cdl-expand-card" id="cdl-salah-steps">' +
        '<button type="button" class="cdl-expand-btn" id="cdl-salah-btn" aria-expanded="false" aria-controls="cdl-salah-body">' +
          "🕌 Prayer steps · simple unit <span class=\"cdl-chev\">▾</span></button>" +
        '<div class="cdl-fold-body" id="cdl-salah-body" hidden>' +
          '<div class="cdl-steps">' + stepsHtml(SALAH_STEPS) + "</div>" +
          '<p class="cdl-sub">Simplified teaching path — not a full fiqh manual. Pillars first; verify with a teacher.</p>' +
          '<p class="cdl-sub cdl-deep-strip">Deepen: <a href="https://quran.com/1" target="_blank" rel="noopener">Al-Fātiḥah</a> · <a href="https://quran.com/2/144" target="_blank" rel="noopener">Qiblah 2:144</a> · <a href="https://sunnah.com/search?q=prayer" target="_blank" rel="noopener">Sunnah.com · prayer</a> · not a fatwa</p></div></div>' +

      /* Phase E — send light ahead */
      '<div class="cdl-card"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">✨</span> Send light ahead today</h2></div>' +
        '<p class="cdl-sub">Three small intentions that echo ongoing reward themes (Muslim 1631 · educational).</p>' +
        '<div class="cdl-light">' +
          '<button type="button" class="cdl-btn secondary" data-light="knowledge" id="cdl-light-k">📖 Beneficial knowledge' +
            (light.knowledge ? " · ✓" : "") + "</button>" +
          '<button type="button" class="cdl-btn secondary" data-light="sadaqah" id="cdl-light-s">💧 Ṣadaqah intention' +
            (light.sadaqah ? " · ✓" : "") + "</button>" +
          '<button type="button" class="cdl-btn secondary" data-light="dua" id="cdl-light-d">🤲 Duʿāʾ for parents' +
            (light.dua ? " · ✓" : "") + "</button></div>" +
        '<p class="cdl-sub" id="cdl-light-msg">Tap to mark an intention on this device — act happens offline, with sincerity.</p></div>' +


      '<div class="cdl-plaque cdl-card" id="cdl-rakahs">' +
        '<div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🕌</span> Farḍ rakʿahs · daily map</h2></div>' +
        '<p class="cdl-sub">Standard farḍ units taught widely — sunnah units vary by school. Educational map · not a fatwa.</p>' +
        '<div class="cdl-rakah-grid">' +
          '<div class="cdl-rakah"><span class="cdl-rakah-n">2</span><strong>Fajr</strong><small>Farḍ</small></div>' +
          '<div class="cdl-rakah"><span class="cdl-rakah-n">4</span><strong>Dhuhr</strong><small>Farḍ</small></div>' +
          '<div class="cdl-rakah"><span class="cdl-rakah-n">4</span><strong>ʿAṣr</strong><small>Farḍ</small></div>' +
          '<div class="cdl-rakah"><span class="cdl-rakah-n">3</span><strong>Maghrib</strong><small>Farḍ</small></div>' +
          '<div class="cdl-rakah"><span class="cdl-rakah-n">4</span><strong>ʿIshāʾ</strong><small>Farḍ</small></div>' +
        '</div>' +
        '<div class="cdl-qibla-row">' +
          '<div class="cdl-compass" id="cdl-compass" aria-label="Qibla compass">' +
            '<div class="cdl-compass-dial"><div class="cdl-compass-kaaba">🕋</div>' +
            '<div class="cdl-compass-needle" id="cdl-compass-needle"></div></div>' +
            '<p class="cdl-sub" id="cdl-qibla-label">Qibla helper · allow location / sensors</p></div>' +
          '<div><p class="cdl-sub"><strong>Qiblah</strong> — toward al-Masjid al-Ḥarām (2:144). Helper only, not a certified instrument.</p>' +
            '<a class="cdl-learn" href="https://quran.com/2/144" target="_blank" rel="noopener">Deepen · 2:144 ↗</a> ' +
            '<button type="button" class="cdl-btn secondary" id="cdl-qibla-cal">Calibrate compass</button></div></div></div>' +

      '<div class="cdl-pillar-grid">' +
        '<article class="cdl-plaque cdl-card" id="cdl-fasting"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🌙</span> Ṣawm · fasting</h2></div>' +
          '<p class="cdl-sub"><strong>Aim</strong> — Fast Ramaḍān when able; niyyah before dawn; abstain dawn to sunset.</p>' +
          '<p class="cdl-step-tip">Fasting is prescribed for you… (2:183). Make-ups and fidyah: ask a teacher.</p>' +
          '<p class="cdl-step-src">Qurʾān 2:183–185 · educational · not a fatwa</p>' +
          '<a class="cdl-learn" href="https://quran.com/2/183" target="_blank" rel="noopener">Deepen · 2:183 ↗</a> ' +
          '<a class="cdl-learn" href="https://sunnah.com/search?q=ramadan%20fast" target="_blank" rel="noopener">Sunnah · Ramaḍān ↗</a></article>' +


        '<article class="cdl-plaque cdl-card" id="cdl-zakat"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">💎</span> Zakāt · purifying dues</h2></div>' +
          '<p class="cdl-sub"><strong>Aim</strong> — When niṣāb and a lunar year pass, give the due share (9:60). No live calculator verdict here.</p>' +
          '<p class="cdl-step-tip">Zakāt is worship and right of the poor — not optional charity branding.</p>' +
          '<p class="cdl-step-src">Qurʾān 9:60 · 2:267 · educational · not a fatwa</p>' +
          '<a class="cdl-learn" href="https://quran.com/9/60" target="_blank" rel="noopener">Deepen · 9:60 ↗</a> ' +
          '<a class="cdl-learn" href="https://quran.com/2/267" target="_blank" rel="noopener">2:267 ↗</a></article>' +

        '<article class="cdl-plaque cdl-card" id="cdl-hajj"><div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🕋</span> Ḥajj · pilgrimage</h2></div>' +
          '<p class="cdl-sub"><strong>Aim</strong> — Once when able. Follow your group’s muṭawwif; this is a map, not manāsik fatwa.</p>' +
          '<p class="cdl-step-tip">Ability includes safety, health, and means — sincerity before the crowd.</p>' +
          '<p class="cdl-step-src">Qurʾān 3:97 · 22:27 · educational · not a fatwa</p>' +
          '<a class="cdl-learn" href="https://quran.com/3/97" target="_blank" rel="noopener">Deepen · 3:97 ↗</a> ' +
          '<a class="cdl-learn" href="https://sunnah.com/search?q=hajj" target="_blank" rel="noopener">Sunnah · ḥajj ↗</a></article></div>' +

      '<section class="cdl-qada-section" data-landing="qada" aria-label="Qaḍāʾ tracker">' +
      '<article class="cdl-card cdl-plaque" id="cdl-qada" data-landing="qada">' +
        '<div class="cdl-head"><h2><span class="cdl-ico" aria-hidden="true">🕌</span> Making up missed ṣalāh · qaḍāʾ tracker</h2></div>' +
        '<p class="cdl-sub">Educational companion only — <strong>not a fatwa</strong>. Missing prayer without excuse is a grave matter. Obligation begins at puberty (bulūgh). Scholars differ on make-up after deliberate neglect; ask a qualified local teacher for your case.</p>' +
        '<div id="cdl-qada-root"></div></article>' +
      '</section>' +




      
      '<section class="cdl-confidence-wrap" id="cdl-confidence" data-landing="confidence" aria-label="Why you can trust this companion">' +
        '<section class=\"cdl-block cdl-quiz-section\" id=\"cdl-quiz-section\" aria-label=\"Daily quiz\">' +
          '<div class=\"cdl-quiz-section-head\">' +
            '<h2 class=\"cdl-h\">🧠 Daily quiz</h2>' +
            '<p class=\"cdl-sub\">Fiqh &amp; Sharia IQ · educational only — not a fatwa · on this device + optional online deck</p>' +
          '</div>' +
          '<div id=\"cdl-fiqh-quiz-slot\" class=\"cdl-fiqh-quiz-slot\"></div>' +
        '</section>' +
        '<div class="cdl-head" style="margin-bottom:0.55rem"><h2><span class="cdl-ico" aria-hidden="true">🛡️</span> Built for trust · review plaques</h2></div>' +
        '<p class="cdl-sub" style="margin-bottom:0.65rem"><strong>Educational companion only — not a fatwa, not legal advice.</strong> For personal rulings, ask a qualified local teacher.</p>' +
        '<div class="cdl-trust-grid" id="cdl-trust-grid">' +
          '<article class="cdl-trust-plaque" data-trust="sources">' +
            '<div class="cdl-trust-ico" aria-hidden="true">📖</div>' +
            '<h3>Sources in the open</h3>' +
            '<p>Verses and reports point to established libraries. Educational wording only.</p>' +
            '<div class="cdl-trust-links">' +
              '<a href="https://quran.com" target="_blank" rel="noopener">Quran.com ↗</a>' +
              '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com ↗</a>' +
            '</div></article>' +
          '<article class="cdl-trust-plaque" data-trust="device">' +
            '<div class="cdl-trust-ico" aria-hidden="true">📱</div>' +
            '<h3>On this device</h3>' +
            '<p>Day progress, qaḍāʾ checks, and notes use browser storage — no Clarity cloud account for them.</p>' +
            '<div class="cdl-trust-links"><span class="cdl-trust-tag">localStorage · private by default</span></div></article>' +
          '<article class="cdl-trust-plaque" data-trust="amana">' +
            '<div class="cdl-trust-ico" aria-hidden="true">🔐</div>' +
            '<h3>Amānah vault</h3>' +
            '<p>Passphrase is never kept by the site. Encrypted payload stays local; heirs use Heir readiness after unlock.</p>' +
            '<div class="cdl-trust-links"><span class="cdl-trust-tag">AES-GCM on-device · not legal advice</span></div></article>' +
          '<article class="cdl-trust-plaque" data-trust="fiqh">' +
            '<div class="cdl-trust-ico" aria-hidden="true">⚖️</div>' +
            '<h3>Scholarly humility</h3>' +
            '<p>Where schools differ (e.g. long-term missed ṣalāh), both lines are named and you are sent to a teacher.</p>' +
            '<div class="cdl-trust-links">' +
              '<a href="https://islamqa.info/en/answers/111783" target="_blank" rel="noopener">Overview · missed prayer ↗</a>' +
            '</div></article>' +
          '<article class="cdl-trust-plaque" data-trust="doors">' +
            '<div class="cdl-trust-ico" aria-hidden="true">🚪</div>' +
            '<h3>Calm doors</h3>' +
            '<p>Day landing for daily light · Companion for deeper tools · University campus for structured study.</p>' +
            '<div class="cdl-trust-links">' +
              '<a href="https://clarity-dawah.fyi/campus/" target="_blank" rel="noopener">Campus ↗</a>' +
            '</div></article>' +
          '<article class="cdl-trust-plaque" data-trust="review" id="cdl-trust-review-plaque">' +
            '<div class="cdl-trust-ico" aria-hidden="true">🔎</div>' +
            '<h3>Auto review · this device</h3>' +
            '<p id="cdl-trust-review-body">Tap below to re-check shell mode, Day landing, qaḍāʾ host, and trust plaques after a revamp.</p>' +
            '<div class="cdl-trust-links">' +
              '<button type="button" class="cdl-btn" id="cdl-trust-review-btn">Run trust check</button>' +
              '<span class="cdl-trust-tag" id="cdl-trust-review-stamp">Not run yet</span>' +
            '</div></article>' +
        '</div>' +
        '<p class="cdl-sub" style="margin-top:0.65rem">Furnish your grave with small, sincere steps. This app holds a map — the walk is yours.</p>' +
      '</section>' +


      '<footer class="cdl-copyright" role="contentinfo">' +
        '<p class="cdl-copy-line">© Clarity Dawah · Educational companion</p>' +
        '<p class="cdl-copy-sub">Furnish your grave · prepare for the long stay · not a fatwa · not legal advice</p>' +
        '<p class="cdl-copy-links">' +
          '<a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a>' +
          '<span aria-hidden="true"> · </span>' +
          '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a>' +
          '<span aria-hidden="true"> · </span>' +
          '<a href="https://clarity-dawah.fyi/campus/" target="_blank" rel="noopener">Campus</a>' +
        '</p>' +
      '</footer>';


    place(wrap);

    (function bindTrustReview(){
      var btn = document.getElementById("cdl-trust-review-btn");
      var body = document.getElementById("cdl-trust-review-body");
      var stamp = document.getElementById("cdl-trust-review-stamp");
      if (!btn || btn.__trustBound) return;
      btn.__trustBound = true;
      btn.addEventListener("click", function () {
        var checks = [];
        var mode = document.documentElement.getAttribute("data-shell-mode") || "?";
        checks.push("Shell mode: " + mode);
        checks.push("Day landing: " + (document.getElementById("clarity-day-landing") ? "present" : "missing"));
        checks.push("Path tiles: " + (document.querySelector("[data-landing=paths]") ? "present" : "missing"));
        checks.push("Qaḍāʾ host: " + (document.getElementById("cdl-qada-root") ? "present" : "missing"));
        checks.push("Trust plaques: " + document.querySelectorAll(".cdl-trust-plaque").length);
        checks.push("Samina card: " + (document.getElementById("samina-verse-card") || document.getElementById("samina-verse-ar") ? "in DOM / companion" : "n/a on Day"));
        if (body) body.innerHTML = checks.map(function (c) { return "• " + c; }).join("<br>");
        if (stamp) {
          try {
            stamp.textContent = "Checked " + new Date().toLocaleString();
          } catch (e) { stamp.textContent = "Checked"; }
        }
        try {
          localStorage.setItem("clarity_trust_review_last_v1", JSON.stringify({ at: Date.now(), checks: checks }));
        } catch (e2) {}
      });
      // Soft auto-run once per session after paint (no network)
      try {
        if (sessionStorage.getItem("clarity_trust_review_auto_v1") !== "1") {
          sessionStorage.setItem("clarity_trust_review_auto_v1", "1");
          setTimeout(function () { btn.click(); }, 900);
        }
      } catch (e3) {}
    })();


    var dualComp = document.getElementById("dual-path-companion");
    if (dualComp && !dualComp.__bound) {
      dualComp.__bound = true;
      dualComp.addEventListener("click", function (ev) {
        try {
          if (w.ClarityShell && w.ClarityShell.setMode) {
            ev.preventDefault();
            w.ClarityShell.setMode("companion");
            try { w.location.hash = "reminder"; } catch (e) {}
          }
        } catch (e2) {}
      });
    }

    w.__CDL_V9_BUILT__ = true;
    w.__CDL_V8_BUILT__ = true;
    w.__CDL_V7_BUILT__ = true;
    w.__CDL_V6_BUILT__ = true;
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


    function bindExpand(btnId, bodyId) {
      var btn = document.getElementById(btnId);
      var body = document.getElementById(bodyId);
      if (!btn || !body) return;
      btn.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var open = btn.getAttribute("aria-expanded") === "true";
        open = !open;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          body.removeAttribute("hidden");
          body.style.display = "block";
        } else {
          body.setAttribute("hidden", "");
          body.style.display = "none";
        }
      };
    }
    bindExpand("cdl-wudu-btn", "cdl-wudu-body");
    bindExpand("cdl-salah-btn", "cdl-salah-body");
    /* Deep-learning steps: start open so expand content is visible */
    ["cdl-wudu-body", "cdl-salah-body"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) { b.setAttribute("hidden", ""); b.style.display = "none"; }
    });
    ["cdl-wudu-btn", "cdl-salah-btn"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.setAttribute("aria-expanded", "false");
    });

    (function initQibla(){
      var needle = document.getElementById("cdl-compass-needle");
      var label = document.getElementById("cdl-qibla-label");
      var btn = document.getElementById("cdl-qibla-cal");
      if (!needle) return;
      var KAABA = { lat: 21.4225, lng: 39.8262 };
      function toRad(d){ return d * Math.PI / 180; }
      function toDeg(r){ return r * 180 / Math.PI; }
      function bearing(lat1, lng1, lat2, lng2){
        var φ1 = toRad(lat1), φ2 = toRad(lat2), Δλ = toRad(lng2 - lng1);
        var y = Math.sin(Δλ) * Math.cos(φ2);
        var x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
        return (toDeg(Math.atan2(y, x)) + 360) % 360;
      }
      var qiblaBearing = 0, heading = 0;
      function paint(){ needle.style.transform = "rotate(" + (qiblaBearing - heading) + "deg)"; }
      function setPos(lat, lng){
        qiblaBearing = bearing(lat, lng, KAABA.lat, KAABA.lng);
        if (label) label.textContent = "Qibla ≈ " + Math.round(qiblaBearing) + "° from north · educational";
        paint();
      }
      /* Performance: do not request geolocation on load — only on Calibrate */
      if (label && !label.textContent) label.textContent = "Location off — tap Calibrate when you want a bearing (educational)";
      if (btn && !btn.__geoBound) {
        btn.__geoBound = true;
        btn.addEventListener("click", function () {
          if (!navigator.geolocation) {
            if (label) label.textContent = "Geolocation not available on this device";
            return;
          }
          if (label) label.textContent = "Requesting location…";
          navigator.geolocation.getCurrentPosition(function(p){ setPos(p.coords.latitude, p.coords.longitude); },
            function(){ if (label) label.textContent = "Location off — align needle with 🕋 as a gentle reminder"; },
            { maximumAge: 600000, timeout: 8000 });
        });
      }
      function onOrient(ev){
        var h = ev.webkitCompassHeading;
        if (typeof h !== "number" && ev.alpha != null) h = 360 - ev.alpha;
        if (typeof h === "number" && !isNaN(h)) { heading = h; paint(); }
      }
      function bindOrient(){
        if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
          DeviceOrientationEvent.requestPermission().then(function(s){
            if (s === "granted") window.addEventListener("deviceorientation", onOrient, true);
          }).catch(function(){});
        } else window.addEventListener("deviceorientation", onOrient, true);
      }
      if (btn) btn.addEventListener("click", bindOrient);
      bindOrient();
    })();


    updateSalahTile();
    if (countdownTimer) clearInterval(countdownTimer);
    var ticks = 0;
    countdownTimer = setInterval(function () {
      if (document.hidden) return;
      ticks++;
      if (ticks % 30 === 0) updateSalahTile();
      else {
        var sub = document.getElementById("cdl-salah-cd");
        var info = parseNextSalah();
        if (sub && info.at) sub.textContent = "in " + formatCountdown(info.at.getTime() - Date.now());
      }
    }, 5000);

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
    setTimeout(function(){ try { updateSalahTile(); } catch (e) {} }, 1500);
  });
  // Poll until banner list has real times
  var _salahPoll = 0;
  var _salahTimer = setInterval(function () {
    if (document.hidden) return;
    _salahPoll++;
    try {
      var list = document.getElementById("salah-times-list");
      var txt = list ? list.textContent || "" : "";
      if (txt && txt.indexOf("Loading") < 0 && /\d:\d{2}/.test(txt)) {
        updateSalahTile();
        if (_salahPoll > 8) clearInterval(_salahTimer);
      }
      if (_salahPoll > 40) clearInterval(_salahTimer);
    } catch (e) { clearInterval(_salahTimer); }
  }, 5000);
})(typeof window !== "undefined" ? window : this);
