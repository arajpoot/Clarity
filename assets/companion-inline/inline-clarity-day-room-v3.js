/**
 * Clarity Day Room RECOVERY · 20261027RECOVERY
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  /* DAYFIX allow single load */
if (w.__CLARITY_DAY_ROOM_V3__) return;
  w.__CLARITY_DAY_ROOM_V3__ = true;

  var KEY_TAS = "clarity_soft_tasbeeh_v1";
  var KEY_DONE = "clarity_today_done_v1";
  var KEY_ADH = "clarity_adhkar_idx_v1";
  var KEY_ADH_CNT = "clarity_adhkar_count_v1";
  var KEY_LIGHT = "clarity_send_light_v1";
  var KEY_QADA = "clarity_qada_simple_v1";

  var PROVISIONS = [
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative — a gift that may reach the grave." },
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence — a light you send into the long stay." },
    { lane: "Qurʾān", text: "Read or listen to a short passage with meaning — even a few āyāt with presence." },
    { lane: "rights", text: "Settle or note one right: a debt, a promise, or an apology owed." },
    { lane: "sadaqah", text: "Give a small continuous good: water, a kind word, or share beneficial knowledge." }
  ];
  var ADH_M = [
    { ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "We have entered the morning and the dominion belongs to Allah, Lord of the worlds.", ref: "Abū Dāwūd 5084 · educational", target: 1 },
    { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", en: "O Allah, by You we enter the morning and by You the evening…", ref: "Tirmidhī 3391 · educational", target: 1 },
    { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", en: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm…", ref: "Abū Dāwūd 5088 · often 3×", target: 3 },
    { ar: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", en: "I am pleased with Allah as Lord, Islam as religion, and Muhammad ﷺ as Prophet.", ref: "Abū Dāwūd 5072", target: 3 },
    { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", en: "Glory be to Allah and His is the praise.", ref: "Muslim 2691", target: 100 },
    { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ… فَاغْفِرْ لِي", en: "O Allah, You are my Lord; there is no god but You… forgive me.", ref: "Bukhārī 6306 · Sayyid al-istighfār", target: 1 }
  ];
  var ADH_E = [
    { ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ", en: "We have entered the evening and the dominion belongs to Allah, Lord of the worlds.", ref: "Abū Dāwūd 5084 · educational", target: 1 },
    { ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", en: "O Allah, by You we enter the evening and by You the morning…", ref: "Tirmidhī 3391", target: 1 },
    { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", en: "In the name of Allah, with whose name nothing on earth or in heaven can cause harm…", ref: "Abū Dāwūd 5088 · often 3×", target: 3 },
    { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", en: "I seek refuge in the perfect words of Allah from the evil of what He created.", ref: "Muslim 2708", target: 3 },
    { ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", en: "Glory be to Allah and His is the praise.", ref: "Muslim 2691", target: 100 },
    { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ… فَاغْفِرْ لِي", en: "O Allah, You are my Lord… forgive me.", ref: "Bukhārī 6306", target: 1 }
  ];
  var WUDU = [
    { n: 1, t: "Intention & Basmala", d: "Intend wuḍūʾ; begin with Bismillāh." },
    { n: 2, t: "Hands", d: "Wash both hands to the wrists three times." },
    { n: 3, t: "Mouth", d: "Rinse the mouth three times." },
    { n: 4, t: "Nose", d: "Sniff water into the nose and expel, three times." },
    { n: 5, t: "Face", d: "Wash the face three times." },
    { n: 6, t: "Arms", d: "Wash arms to the elbows, right then left, three times." },
    { n: 7, t: "Head & ears", d: "Wipe the head once; wipe the ears." },
    { n: 8, t: "Feet", d: "Wash feet to the ankles, right then left, three times." }
  ];
  var SALAH = [
    { n: 1, t: "Stand & Qiblah", d: "Stand calmly facing the Qiblah if able." },
    { n: 2, t: "Opening takbīr", d: "Say Allāhu akbar; leave side talk." },
    { n: 3, t: "Al-Fātiḥah", d: "Recite Sūrat al-Fātiḥah." },
    { n: 4, t: "Rukūʿ", d: "Bow; glorify Allah." },
    { n: 5, t: "Stand", d: "Rise; praise Allah." },
    { n: 6, t: "Sujūd", d: "Prostrate twice with calm pauses." },
    { n: 7, t: "Units", d: "Complete the number of units for that prayer." },
    { n: 8, t: "Tashahhud & salām", d: "Final sitting; end with salām." }
  ];

  function isEvening() { try { return new Date().getHours() >= 15; } catch (e) { return false; } }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readJSON(k, fb) {
    try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch (e) { return fb; }
  }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function injectCss() {
    if (document.getElementById("clarity-day-room-css-v3")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-room-css-v3";
    var R = "#clarity-day-landing-room";
    s.textContent = [
      R + "{width:100%;max-width:100%;box-sizing:border-box;padding:0.65rem 0.85rem 1.25rem;contain:layout style;isolation:isolate;}",
      R + " .day-room-inner{width:100%;max-width:min(52rem,100%);margin:0 auto;}",
      R + " .dual-tiles{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;}",
      "@media(max-width:560px){" + R + " .dual-tiles{grid-template-columns:1fr;}}",
      R + " .dual-tile{display:block;text-decoration:none;color:inherit;border-radius:14px;padding:0.75rem 0.85rem;border:1px solid rgba(15,76,58,0.2);background:linear-gradient(135deg,#f7f3eb,#eef6f1);}",
      "html[data-theme=dark] " + R + " .dual-tile{background:linear-gradient(135deg,#12241c,#0c1a14);border-color:rgba(212,180,90,0.25);}",
      R + " .dual-ico{font-size:1.25rem;display:block;}",
      R + " .dual-tile strong{display:block;font-size:1rem;}",
      R + " .dual-tile small{display:block;opacity:0.75;font-size:0.78rem;}",
      R + " .cdl-hero{display:grid;gap:0.65rem;grid-template-columns:1fr;margin-bottom:0.75rem;}",
      "@media(min-width:720px){" + R + " .cdl-hero{grid-template-columns:1.2fr 1fr 0.9fr;}}",
      R + " .cdl-tile{border:1px solid rgba(15,76,58,0.18);border-radius:16px;padding:0.75rem 0.9rem;background:rgba(15,76,58,0.06);}",
      "html[data-theme=dark] " + R + " .cdl-tile{background:rgba(212,180,90,0.08);border-color:rgba(212,180,90,0.22);}",
      R + " .cdl-tile h3{margin:0 0 0.25rem;font-size:0.72rem;text-transform:uppercase;opacity:0.75;}",
      R + " .cdl-big{font-size:1.15rem;font-weight:800;color:#c9a227;}",
      R + " .cdl-sub{font-size:0.8rem;opacity:0.88;margin:0.2rem 0;}",
      R + " .cdl-card{border-radius:16px;border:1px solid rgba(15,76,58,0.15);padding:0.85rem 1rem;margin-bottom:0.65rem;background:rgba(255,255,255,0.78);}",
      "html[data-theme=dark] " + R + " .cdl-card{background:rgba(12,28,22,0.85);border-color:rgba(212,180,90,0.18);}",
      R + " .cdl-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.35rem;}",
      R + " .cdl-head h2{margin:0;font-size:1.02rem;font-weight:800;}",
      R + " .cdl-ar{font-size:1.12rem;line-height:2;text-align:right;margin:0.45rem 0;}",
      R + " .cdl-btn{border:none;border-radius:999px;padding:0.35rem 0.85rem;font-weight:700;cursor:pointer;font-size:0.82rem;background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;margin:0.2rem 0.25rem 0 0;}",
      R + " .cdl-btn.secondary{background:transparent;border:1px solid rgba(15,76,58,0.3);color:inherit;}",
      R + " .cdl-oath{display:grid;gap:0.55rem;}@media(min-width:700px){" + R + " .cdl-oath{grid-template-columns:1fr 1fr;}}",
      R + " .cdl-expand-btn{width:100%;text-align:left;background:transparent;border:none;color:inherit;font-weight:700;font-size:0.95rem;cursor:pointer;}",
      R + " .cdl-fold-body{margin-top:0.5rem;padding-top:0.35rem;border-top:1px solid rgba(15,76,58,0.12);}",
      R + " .cdl-step{padding:0.45rem 0.55rem;border-radius:10px;background:rgba(15,76,58,0.05);font-size:0.88rem;margin:0.25rem 0;}",
      R + " .cdl-verse{padding:0.9rem 1rem;border-radius:16px;border:1px solid rgba(15,76,58,0.2);margin-bottom:0.65rem;}",
      R + " .cdl-note-input{width:100%;min-height:4rem;border-radius:10px;padding:0.55rem;box-sizing:border-box;border:1px solid rgba(15,76,58,0.25);background:rgba(255,255,255,0.5);color:inherit;}",
      R + " .cdl-footer-plaque{text-align:center;margin:1.15rem auto 0.6rem;padding:0.9rem 1rem;border-radius:16px;border:1px solid rgba(15,76,58,0.2);max-width:min(42rem,100%);font-size:0.82rem;}",
      R + " .cdl-qada-row{display:flex;flex-wrap:wrap;gap:0.45rem;align-items:center;}",
      R + " .cdl-qada-row input{width:3.5rem;border-radius:8px;padding:0.25rem;border:1px solid rgba(15,76,58,0.25);background:transparent;color:inherit;}"
    ].join("");
    document.head.appendChild(s);
  }

  function stepsHtml(list) {
    return list.map(function (s) {
      return "<div class=\"cdl-step\"><strong>" + s.n + ". " + s.t + "</strong> — " + s.d + "</div>";
    }).join("");
  }

  function fill(room) {
    if (!room || room.getAttribute("data-room-filled") === "3") return;
    injectCss();
    var inner = room.querySelector(".day-room-inner") || room;
    var pack = isEvening() ? ADH_E : ADH_M;
    var idx = 0;
    try { idx = parseInt(localStorage.getItem(KEY_ADH) || "0", 10) || 0; } catch (e) {}
    if (idx < 0 || idx >= pack.length) idx = 0;
    var dh = pack[idx];
    var cnt = 0;
    try { cnt = parseInt(localStorage.getItem(KEY_ADH_CNT) || "0", 10) || 0; } catch (e) {}
    var tas = 0;
    try {
      var tj = readJSON(KEY_TAS, {});
      if (tj && tj.day === todayKey()) tas = tj.n || 0;
    } catch (e) {}
    var done = false;
    try {
      var dj = readJSON(KEY_DONE, {});
      done = !!(dj && dj.day === todayKey() && dj.ok);
    } catch (e) {}
    var light = readJSON(KEY_LIGHT, { day: "", s: 0, k: 0, d: 0 });
    if (light.day !== todayKey()) light = { day: todayKey(), s: 0, k: 0, d: 0 };
    var qada = readJSON(KEY_QADA, { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 });
    var prov = PROVISIONS[Math.floor(Date.now() / 86400000) % PROVISIONS.length];
    var when = isEvening() ? " · afternoon" : " · morning";
    var windowLabel = isEvening() ? "Adhkār · evening window" : "Adhkār · morning window";
    var salahName = "See banner";
    try {
      var raw = localStorage.getItem("clarity_banner_salah_v1");
      if (raw) {
        var c = JSON.parse(raw);
        if (c && c.timings) {
          var names = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
          var now = new Date();
          var mins = now.getHours() * 60 + now.getMinutes();
          for (var i = 0; i < names.length; i++) {
            var t = c.timings[names[i]];
            if (!t) continue;
            var p = String(t).split(" ")[0].split(":");
            var tm = (+p[0]) * 60 + (+p[1] || 0);
            if (tm > mins) { salahName = names[i]; break; }
          }
        }
      }
    } catch (e) {}

    var html = "";
    html += "<div class=\"dual-tiles\" role=\"navigation\">";
    html += "<a class=\"dual-tile\" href=\"#main-content\" id=\"day-path-companion\"><span class=\"dual-ico\">🏠</span><strong>Companion path</strong><small>Reminder · Reality · Reflection · Action</small></a>";
    html += "<a class=\"dual-tile\" href=\"/campus/\" target=\"_blank\" rel=\"noopener\"><span class=\"dual-ico\">🎓</span><strong>University path</strong><small>Campus desk · educational</small></a></div>";
    html += "<div class=\"cdl-verse\"><p class=\"cdl-sub\" style=\"font-weight:800;text-transform:uppercase;opacity:0.75\">Today · Day landing</p>";
    html += "<p class=\"cdl-ar\" lang=\"ar\" dir=\"rtl\">يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>";
    html += "<p>O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.</p>";
    html += "<p class=\"cdl-sub\"><a href=\"https://quran.com/2/153\" target=\"_blank\" rel=\"noopener\">Qurʾān 2:153</a> · educational only</p></div>";
    html += "<div class=\"cdl-hero\">";
    html += "<div class=\"cdl-tile\"><h3>Do this today" + when + "</h3><div class=\"cdl-big\">" + prov.lane + "</div><p class=\"cdl-sub\">" + prov.text + "</p>";
    html += "<button type=\"button\" class=\"cdl-btn\" id=\"cdl-mark-done\">" + (done ? "Done today ✓" : "Mark done") + "</button></div>";
    html += "<div class=\"cdl-tile\"><h3>Next ṣalāh</h3><div class=\"cdl-big\">" + salahName + "</div><p class=\"cdl-sub\">See banner schedule</p></div>";
    html += "<div class=\"cdl-tile\"><h3>Tasbeeh today</h3><div class=\"cdl-big\" id=\"cdl-tasbeeh-n\">" + tas + "</div>";
    html += "<button type=\"button\" class=\"cdl-btn\" id=\"cdl-tas-plus\">+1</button><button type=\"button\" class=\"cdl-btn secondary\" id=\"cdl-tas-reset\">Reset</button></div></div>";
    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2>📿 " + windowLabel + "</h2><span class=\"cdl-sub\" id=\"cdl-adh-progress\">Count " + cnt + " / " + dh.target + "</span></div>";
    html += "<p class=\"cdl-ar\" lang=\"ar\" dir=\"rtl\" id=\"cdl-adh-ar\">" + dh.ar + "</p><p id=\"cdl-adh-en\">" + dh.en + "</p><p class=\"cdl-sub\" id=\"cdl-adh-ref\">" + dh.ref + "</p>";
    html += "<button type=\"button\" class=\"cdl-btn\" id=\"cdl-adh-count\">+1 count</button><button type=\"button\" class=\"cdl-btn secondary\" id=\"cdl-adh-next\">Next dhikr →</button></div>";
    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2>🔒 Vault note registry</h2></div>";
    html += "<p class=\"cdl-sub\">On-device · educational · not legal advice.</p>";
    html += "<textarea class=\"cdl-note-input\" id=\"cdl-note-text\" placeholder=\"Trust note, debt, wasiyyah thought…\"></textarea>";
    html += "<button type=\"button\" class=\"cdl-btn\" id=\"cdl-note-save\">Save to registry</button></div>";
    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2>✨ Send light ahead</h2></div>";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" data-light=\"s\">Sadaqah <span id=\"cdl-light-s\">" + light.s + "</span></button> ";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" data-light=\"k\">Knowledge <span id=\"cdl-light-k\">" + light.k + "</span></button> ";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" data-light=\"d\">Duʿāʾ <span id=\"cdl-light-d\">" + light.d + "</span></button>";
    html += "<p class=\"cdl-sub\">Muslim 1631 · educational · not a score of īmān</p></div>";
    html += "<div class=\"cdl-oath\"><div class=\"cdl-card\"><h2 style=\"margin:0 0 0.35rem;font-size:1rem\">🕯️ Remember the long stay</h2>";
    html += "<p class=\"cdl-sub\">Family and wealth turn back; <strong>deeds stay with you</strong>. Educational · not a fatwa.</p></div>";
    html += "<div class=\"cdl-card\"><h2 style=\"margin:0 0 0.35rem;font-size:1rem\">🌱 Reward that may continue</h2>";
    html += "<p class=\"cdl-sub\">Ongoing charity, beneficial knowledge, child who prays. Muslim 1631 · educational.</p></div></div>";
    html += "<div class=\"cdl-card\"><h2 style=\"margin:0 0 0.35rem;font-size:1rem\">🛡️ Core protection set</h2>";
    html += "<p class=\"cdl-sub\">Āyat al-Kursī, the three Quls, Sayyid al-istighfār. Learn with a teacher.</p></div>";
    html += "<div class=\"cdl-card\"><button type=\"button\" class=\"cdl-expand-btn\" id=\"cdl-wudu-btn\">💧 Wuḍūʾ steps ▾</button>";
    html += "<div class=\"cdl-fold-body\" id=\"cdl-wudu-body\" hidden>" + stepsHtml(WUDU) + "<p class=\"cdl-sub\">Educational · schools differ.</p></div></div>";
    html += "<div class=\"cdl-card\"><button type=\"button\" class=\"cdl-expand-btn\" id=\"cdl-salah-btn\">🕌 Prayer steps ▾</button>";
    html += "<div class=\"cdl-fold-body\" id=\"cdl-salah-body\" hidden>" + stepsHtml(SALAH) + "<p class=\"cdl-sub\">Simplified · not a fiqh manual.</p></div></div>";
    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2>🕌 Qaḍāʾ tracker</h2></div>";
    html += "<p class=\"cdl-sub\">Educational only — <strong>not a fatwa</strong>. Ask a local teacher for your case.</p><div class=\"cdl-qada-row\">";
    ["fajr","dhuhr","asr","maghrib","isha"].forEach(function (k) {
      html += "<label>" + k + " <input type=\"number\" min=\"0\" data-qada=\"" + k + "\" value=\"" + (qada[k] || 0) + "\"></label>";
    });
    html += "<button type=\"button\" class=\"cdl-btn\" id=\"cdl-qada-save\">Save</button></div></div>";
    html += "<div class=\"cdl-card\" id=\"clarity-landing-slot-dayn\"><div class=\"cdl-head\"><h2>📋 Amānah Dayn</h2></div>";
    html += "<p class=\"cdl-sub\">Qard ḥasan · on this device · educational only — not legal advice.</p>";
    html += "<div id=\"clarity-dayn-entry\"></div></div>";
    html += "<div class=\"cdl-card\" id=\"cdl-confidence\"><div class=\"cdl-head\"><h2>🛡️ Built for trust</h2></div>";
    html += "<p class=\"cdl-sub\"><strong>Educational companion only — not a fatwa, not legal advice.</strong></p>";
    html += "<p class=\"cdl-sub\">Sources: Quran.com · Sunnah.com · data stays on this device · vault uses on-device encryption.</p></div>";
    html += "<div class=\"cdl-footer-plaque\" id=\"cdl-footer-plaque\" role=\"contentinfo\">";
    html += "<p><strong>© Clarity Dawah · Educational companion</strong></p>";
    html += "<p>Furnish your grave · prepare for the long stay · not a fatwa · not legal advice</p>";
    html += "<p><a href=\"https://quran.com\" target=\"_blank\" rel=\"noopener\">Quran.com</a> · <a href=\"https://sunnah.com\" target=\"_blank\" rel=\"noopener\">Sunnah.com</a> · <a href=\"/campus/\">Campus</a></p></div>";

    inner.innerHTML = html;
    room.setAttribute("data-room-filled", "3");
    wire(pack, idx, cnt, light);
  }

  function wire(pack, idx, cnt, light) {
    var comp = document.getElementById("day-path-companion");
    if (comp && !comp.__w) {
      comp.__w = true;
      comp.addEventListener("click", function (ev) {
        ev.preventDefault();
        try { if (w.ClarityShell) w.ClarityShell.setMode("companion"); } catch (e) {}
      });
    }
    var mark = document.getElementById("cdl-mark-done");
    if (mark && !mark.__w) {
      mark.__w = true;
      mark.addEventListener("click", function () {
        writeJSON(KEY_DONE, { day: todayKey(), ok: true });
        mark.textContent = "Done today ✓";
      });
    }
    var tasEl = document.getElementById("cdl-tasbeeh-n");
    function tasState() {
      var tj = readJSON(KEY_TAS, {});
      if (!tj || tj.day !== todayKey()) tj = { day: todayKey(), n: 0 };
      return tj;
    }
    var plus = document.getElementById("cdl-tas-plus");
    if (plus && !plus.__w) {
      plus.__w = true;
      plus.addEventListener("click", function () {
        var tj = tasState();
        tj.n = (tj.n || 0) + 1;
        writeJSON(KEY_TAS, tj);
        if (tasEl) tasEl.textContent = String(tj.n);
      });
    }
    var reset = document.getElementById("cdl-tas-reset");
    if (reset && !reset.__w) {
      reset.__w = true;
      reset.addEventListener("click", function () {
        writeJSON(KEY_TAS, { day: todayKey(), n: 0 });
        if (tasEl) tasEl.textContent = "0";
      });
    }
    var state = { idx: idx, cnt: cnt, pack: pack };
    function renderAdh() {
      var d = state.pack[state.idx];
      var ar = document.getElementById("cdl-adh-ar");
      var en = document.getElementById("cdl-adh-en");
      var ref = document.getElementById("cdl-adh-ref");
      var prog = document.getElementById("cdl-adh-progress");
      if (ar) ar.textContent = d.ar;
      if (en) en.textContent = d.en;
      if (ref) ref.textContent = d.ref;
      if (prog) prog.textContent = "Count " + state.cnt + " / " + d.target;
      try {
        localStorage.setItem(KEY_ADH, String(state.idx));
        localStorage.setItem(KEY_ADH_CNT, String(state.cnt));
      } catch (e) {}
    }
    var adhCount = document.getElementById("cdl-adh-count");
    if (adhCount && !adhCount.__w) {
      adhCount.__w = true;
      adhCount.addEventListener("click", function () {
        state.cnt += 1;
        if (state.cnt >= state.pack[state.idx].target) {
          state.cnt = 0;
          state.idx = (state.idx + 1) % state.pack.length;
        }
        renderAdh();
      });
    }
    var adhNext = document.getElementById("cdl-adh-next");
    if (adhNext && !adhNext.__w) {
      adhNext.__w = true;
      adhNext.addEventListener("click", function () {
        state.cnt = 0;
        state.idx = (state.idx + 1) % state.pack.length;
        renderAdh();
      });
    }
    function wireExp(btnId, bodyId) {
      var btn = document.getElementById(btnId);
      var body = document.getElementById(bodyId);
      if (!btn || !body || btn.__w) return;
      btn.__w = true;
      btn.addEventListener("click", function () {
        var open = body.hasAttribute("hidden");
        if (open) body.removeAttribute("hidden");
        else body.setAttribute("hidden", "");
      });
    }
    wireExp("cdl-wudu-btn", "cdl-wudu-body");
    wireExp("cdl-salah-btn", "cdl-salah-body");
    var noteSave = document.getElementById("cdl-note-save");
    var noteText = document.getElementById("cdl-note-text");
    if (noteSave && noteText && !noteSave.__w) {
      noteSave.__w = true;
      noteSave.addEventListener("click", function () {
        var t = (noteText.value || "").trim();
        if (!t) return;
        var list = readJSON("clarity_vault_note_registry_v1", []);
        if (!Array.isArray(list)) list = [];
        list.push({ id: "n" + Date.now(), text: t, ts: Date.now() });
        writeJSON("clarity_vault_note_registry_v1", list);
        noteText.value = "";
        noteSave.textContent = "Saved ✓";
        setTimeout(function () { noteSave.textContent = "Save to registry"; }, 1200);
      });
    }
    var lightState = light || { day: todayKey(), s: 0, k: 0, d: 0 };
    document.querySelectorAll("[data-light]").forEach(function (btn) {
      if (btn.__w) return;
      btn.__w = true;
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-light");
        lightState[k] = (lightState[k] || 0) + 1;
        lightState.day = todayKey();
        writeJSON(KEY_LIGHT, lightState);
        var el = document.getElementById("cdl-light-" + k);
        if (el) el.textContent = String(lightState[k]);
      });
    });
    var qSave = document.getElementById("cdl-qada-save");
    if (qSave && !qSave.__w) {
      qSave.__w = true;
      qSave.addEventListener("click", function () {
        var o = {};
        document.querySelectorAll("[data-qada]").forEach(function (inp) {
          o[inp.getAttribute("data-qada")] = Math.max(0, parseInt(inp.value || "0", 10) || 0);
        });
        writeJSON(KEY_QADA, o);
      });
    }
  }

  function boot() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    fill(room);
    try { document.dispatchEvent(new CustomEvent("clarity:day-room-ready")); } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 40); });
  else setTimeout(boot, 40);
  w.addEventListener("load", function () {
    var room = document.getElementById("clarity-day-landing-room");
    if (room && room.getAttribute("data-room-filled") !== "3") boot();
  });
  w.ClarityDayRoom = { fill: boot, version: 3 };

  /* DAYFIX: ensure room fills even if shell raced */
  (function dayfixBoot() {
    function ensure() {
      var room = document.getElementById("clarity-day-landing-room");
      if (!room) return;
      var inner = room.querySelector(".day-room-inner");
      if (inner && !inner.children.length) {
        try { room.removeAttribute("data-room-filled"); } catch (e) {}
        try { if (window.ClarityDayRoom) window.ClarityDayRoom.fill(); } catch (e2) {}
      }
    }
    [50, 200, 600, 1200, 2500].forEach(function (ms) { setTimeout(ensure, ms); });
  })();

})(typeof window !== "undefined" ? window : this);