/**
 * Clarity Day Room v3 · 20261027ROOM3
 * Vault-pattern hardened room + full prior Day sections.
 * Single fill · frozen interior · smooth internal flow.
 * Educational only — not a fatwa · not legal advice.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_DAY_ROOM_V3__) return;
  w.__CLARITY_DAY_ROOM_V3__ = true;
  /* supersede older room fillers */
  w.__CLARITY_DAY_ROOM_V2__ = true;
  w.__CLARITY_DAY_ROOM_V1__ = true;

  var KEY_TAS = "clarity_soft_tasbeeh_v1";
  var KEY_DONE = "clarity_today_done_v1";
  var KEY_ADH = "clarity_adhkar_idx_v1";
  var KEY_ADH_CNT = "clarity_adhkar_count_v1";
  var KEY_LIGHT = "clarity_send_light_v1";
  var KEY_QADA = "clarity_qada_simple_v1";

  var PROVISIONS = [
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative — a gift that may reach the grave." },
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence — a light you send into the long stay." },
    { lane: "rights", text: "Settle or note one right: a debt, a promise, or an apology owed." },
    { lane: "Qurʾān", text: "Read or listen to a short passage with meaning — even a few āyāt with presence." },
    { lane: "sadaqah", text: "Give a small continuous good: water, a kind word, or share beneficial knowledge." }
  ];

  var ADH_M = [
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
    { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ… فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      en: "O Allah, You are my Lord; there is no god but You… forgive me, for none forgives sins but You.",
      ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
  ];
  var ADH_E = [
    { ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا",
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
    { ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ… فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      en: "O Allah, You are my Lord; there is no god but You… forgive me, for none forgives sins but You.",
      ref: "Bukhārī 6306 · Sayyid al-istighfār · educational", target: 1 }
  ];

  var WUDU = [
    { n: 1, t: "Intention & Basmala", d: "Intend wuḍūʾ for ṣalāh; begin with Bismillāh." },
    { n: 2, t: "Hands", d: "Wash both hands to the wrists three times." },
    { n: 3, t: "Mouth", d: "Rinse the mouth three times." },
    { n: 4, t: "Nose", d: "Sniff water into the nose and expel, three times." },
    { n: 5, t: "Face", d: "Wash the face three times (hairline to chin, ear to ear)." },
    { n: 6, t: "Arms", d: "Wash arms to the elbows, right then left, three times." },
    { n: 7, t: "Head & ears", d: "Wipe the head once; wipe the ears." },
    { n: 8, t: "Feet", d: "Wash feet to the ankles, right then left, three times." }
  ];

  var SALAH = [
    { n: 1, t: "Stand & face Qiblah", d: "Stand calmly facing the Qiblah if able; settle the heart before takbīr." },
    { n: 2, t: "Opening takbīr", d: "Raise the hands and say Allāhu akbar; leave side talk and focus." },
    { n: 3, t: "Al-Fātiḥah", d: "Recite Sūrat al-Fātiḥah; then further Qurʾān as taught for that unit." },
    { n: 4, t: "Rukūʿ", d: "Bow with the back level; glorify Allah (e.g. Subḥāna Rabbiyal-ʿAẓīm)." },
    { n: 5, t: "Stand from rukūʿ", d: "Rise saying Samiʿallāhu liman ḥamidah; stand straight; praise Allah." },
    { n: 6, t: "Sujūd (twice)", d: "Prostrate twice with calm pauses; glorify Allah (e.g. Subḥāna Rabbiyal-Aʿlā)." },
    { n: 7, t: "Between units", d: "Sit briefly between sujūd; complete the number of units for that prayer." },
    { n: 8, t: "Tashahhud & salām", d: "Final sitting, tashahhud and ṣalāh on the Prophet ﷺ; end with salām right then left." }
  ];

  function isEvening() {
    try { return new Date().getHours() >= 15; } catch (e) { return false; }
  }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readJSON(k, fb) {
    try {
      var r = localStorage.getItem(k);
      return r ? JSON.parse(r) : fb;
    } catch (e) { return fb; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function injectCss() {
    if (document.getElementById("clarity-day-room-css-v3")) return;
    var s = document.createElement("style");
    s.id = "clarity-day-room-css-v3";
    var R = "#clarity-day-landing-room";
    s.textContent = [
      /* Vault-like containment */
      R + "{width:100%;max-width:100%;box-sizing:border-box;padding:0.65rem 0.85rem 1.25rem;",
      "contain:layout style;isolation:isolate;position:relative;z-index:2;}",
      R + " .day-room-inner{width:100%;max-width:min(52rem,100%);margin:0 auto;box-sizing:border-box;",
      "display:flex;flex-direction:column;gap:0.15rem;}",
      R + " .day-room-inner[data-frozen=\"1\"]{/* interior owned by Day Room */} ",
      R + " .dual-tiles{display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;margin-bottom:0.75rem;}",
      "@media(max-width:560px){" + R + " .dual-tiles{grid-template-columns:1fr;}}",
      R + " .dual-tile{display:block;text-decoration:none;color:inherit;border-radius:14px;padding:0.75rem 0.85rem;",
      "border:1px solid rgba(15,76,58,0.2);background:linear-gradient(135deg,#f7f3eb,#eef6f1);transition:transform .15s ease;}",
      R + " .dual-tile:active{transform:scale(0.98);}",
      "html[data-theme=dark] " + R + " .dual-tile,html[data-theme=night] " + R + " .dual-tile{",
      "background:linear-gradient(135deg,#12241c,#0c1a14);border-color:rgba(212,180,90,0.25);}",
      R + " .dual-ico{font-size:1.25rem;display:block;margin-bottom:0.2rem;}",
      R + " .dual-tile strong{display:block;font-size:1rem;}",
      R + " .dual-tile small{display:block;opacity:0.75;font-size:0.78rem;margin-top:0.2rem;}",
      R + " .cdl-hero{display:grid;gap:0.65rem;grid-template-columns:1fr;margin-bottom:0.75rem;}",
      "@media(min-width:720px){" + R + " .cdl-hero{grid-template-columns:1.2fr 1fr 0.9fr;}}",
      R + " .cdl-tile{background:linear-gradient(145deg,rgba(15,76,58,0.08),rgba(15,76,58,0.02));",
      "border:1px solid rgba(15,76,58,0.18);border-radius:16px;padding:0.75rem 0.9rem;min-height:5.2rem;",
      "display:flex;flex-direction:column;justify-content:center;}",
      "html[data-theme=dark] " + R + " .cdl-tile{",
      "background:linear-gradient(145deg,rgba(212,180,90,0.08),rgba(15,40,30,0.5));border-color:rgba(212,180,90,0.22);}",
      R + " .cdl-tile h3{margin:0 0 0.25rem;font-size:0.72rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;opacity:0.75;}",
      R + " .cdl-big{font-size:1.15rem;font-weight:800;line-height:1.35;color:var(--gold,#c9a227);}",
      R + " .cdl-sub{font-size:0.8rem;opacity:0.88;margin:0.2rem 0;}",
      R + " .cdl-card{border-radius:16px;border:1px solid rgba(15,76,58,0.15);",
      "background:var(--card-bg,rgba(255,255,255,0.78));padding:0.85rem 1rem;margin-bottom:0.65rem;}",
      "html[data-theme=dark] " + R + " .cdl-card{background:rgba(12,28,22,0.85);border-color:rgba(212,180,90,0.18);}",
      R + " .cdl-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.35rem;}",
      R + " .cdl-head h2{margin:0;font-size:1.02rem;font-weight:800;}",
      R + " .cdl-ar{font-size:1.12rem;line-height:2;text-align:right;margin:0.45rem 0;}",
      R + " .cdl-btn{border:none;border-radius:999px;padding:0.35rem 0.85rem;font-weight:700;cursor:pointer;font-size:0.82rem;",
      "background:linear-gradient(135deg,#0f4c3a,#1a6b52);color:#f7f3eb;margin:0.2rem 0.25rem 0.2rem 0;}",
      R + " .cdl-btn.secondary{background:transparent;border:1px solid rgba(15,76,58,0.3);color:inherit;}",
      R + " .cdl-oath{display:grid;gap:0.55rem;}",
      "@media(min-width:700px){" + R + " .cdl-oath{grid-template-columns:1fr 1fr;}}",
      R + " .cdl-expand-btn{width:100%;text-align:left;background:transparent;border:none;color:inherit;font-weight:700;font-size:0.95rem;cursor:pointer;padding:0.2rem 0;}",
      R + " .cdl-fold-body{margin-top:0.5rem;padding-top:0.35rem;border-top:1px solid rgba(15,76,58,0.12);}",
      R + " .cdl-steps{display:grid;gap:0.35rem;}",
      R + " .cdl-step{padding:0.45rem 0.55rem;border-radius:10px;background:rgba(15,76,58,0.05);font-size:0.88rem;}",
      R + " .cdl-verse{padding:0.9rem 1rem;border-radius:16px;border:1px solid rgba(15,76,58,0.2);margin-bottom:0.65rem;background:linear-gradient(145deg,rgba(15,76,58,0.06),transparent);}",
      R + " .cdl-note-input{width:100%;min-height:4rem;border-radius:10px;padding:0.55rem;box-sizing:border-box;border:1px solid rgba(15,76,58,0.25);background:rgba(255,255,255,0.5);color:inherit;}",
      R + " .cdl-trust-grid{display:grid;gap:0.5rem;grid-template-columns:1fr;}",
      "@media(min-width:640px){" + R + " .cdl-trust-grid{grid-template-columns:1fr 1fr 1fr;}}",
      R + " .cdl-trust-plaque{padding:0.7rem 0.8rem;border-radius:14px;border:1px solid rgba(15,76,58,0.15);font-size:0.85rem;}",
      R + " .cdl-trust-plaque h3{margin:0.25rem 0;font-size:0.9rem;}",
      R + " .cdl-light-row{display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;}",
      R + " .cdl-qada-row{display:flex;flex-wrap:wrap;gap:0.45rem;align-items:center;margin-top:0.4rem;}",
      R + " .cdl-qada-row input{width:4rem;border-radius:8px;padding:0.3rem;border:1px solid rgba(15,76,58,0.25);background:transparent;color:inherit;}",
      "html[data-shell-mode=landing] " + R + "{display:block!important;visibility:visible!important;}",
      "html[data-shell-mode=companion] " + R + "{display:none!important;}",
      /* Smooth internal expand */
      R + " .cdl-fold-body:not([hidden]){animation:cdlFade .2s ease;}",
      "@keyframes cdlFade{from{opacity:0}to{opacity:1}}"
    ].join("");
    document.head.appendChild(s);
  }

  /** Prevent foreign scripts from wiping the room interior (vault-style freeze). */
  function freezeInterior(inner) {
    if (!inner || inner.__dayFrozen) return;
    inner.__dayFrozen = true;
    inner.setAttribute("data-frozen", "1");
    try {
      var desc = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
      if (!desc || !desc.set) return;
      var originalSet = desc.set;
      Object.defineProperty(inner, "innerHTML", {
        configurable: true,
        enumerable: true,
        get: function () {
          return desc.get.call(this);
        },
        set: function (v) {
          if (this.getAttribute("data-frozen") === "1" && this.getAttribute("data-allow-write") !== "1") {
            return; /* ignore external wipes */
          }
          this.setAttribute("data-allow-write", "1");
          originalSet.call(this, v);
          this.removeAttribute("data-allow-write");
        }
      });
    } catch (e) {}
  }

  function stepsHtml(list) {
    return list.map(function (s) {
      return "<div class=\"cdl-step\"><strong>" + s.n + ". " + s.t + "</strong> — " + s.d + "</div>";
    }).join("");
  }

  function fill(room) {
    if (!room) return;
    if (room.getAttribute("data-room-filled") === "3") return;
    injectCss();
    var inner = room.querySelector(".day-room-inner");
    if (!inner) {
      inner = document.createElement("div");
      inner.className = "day-room-inner";
      room.appendChild(inner);
    }
    /* allow our write */
    inner.setAttribute("data-allow-write", "1");
    inner.removeAttribute("data-frozen");

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
    var windowLabel = isEvening() ? "Adhkār · evening window" : "Adhkār · morning window";

    var html = "";
    html += "<div class=\"dual-tiles\" role=\"navigation\" aria-label=\"Choose a path\">";
    html += "<a class=\"dual-tile\" href=\"#main-content\" id=\"day-path-companion\"><span class=\"dual-ico\" aria-hidden=\"true\">🏠</span><strong>Companion path</strong><small>Reminder · Reality · Reflection · Action — tools on this page</small></a>";
    html += "<a class=\"dual-tile\" href=\"/campus/\" id=\"day-path-university\" target=\"_blank\" rel=\"noopener\"><span class=\"dual-ico\" aria-hidden=\"true\">🎓</span><strong>University path</strong><small>Campus desk · four stages · educational</small></a></div>";

    html += "<div class=\"cdl-verse\" id=\"clarity-day-first-strip\">";
    html += "<p class=\"cdl-sub\" style=\"font-weight:800;letter-spacing:0.04em;text-transform:uppercase;opacity:0.75\">Today · Day landing</p>";
    html += "<p class=\"cdl-ar\" lang=\"ar\" dir=\"rtl\">يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ</p>";
    html += "<p>O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.</p>";
    html += "<p class=\"cdl-sub\"><a href=\"https://quran.com/2/153\" target=\"_blank\" rel=\"noopener\">Qurʾān 2:153</a> · Sahih International · educational only</p></div>";

    html += "<div class=\"cdl-hero\">";
    html += "<div class=\"cdl-tile\"><h3>Do this today" + when + "</h3><div class=\"cdl-big\">" + prov.lane + "</div><p class=\"cdl-sub\">" + prov.text + "</p>";
    html += "<div><button type=\"button\" class=\"cdl-btn\" id=\"cdl-mark-done\">" + (done ? "Done today ✓" : "Mark done") + "</button></div></div>";
    html += "<div class=\"cdl-tile\"><h3>Next ṣalāh</h3><div class=\"cdl-big\" id=\"cdl-salah-name\">" + salahName + "</div><p class=\"cdl-sub\">See banner schedule · linked to your times</p></div>";
    html += "<div class=\"cdl-tile\"><h3>Tasbeeh today</h3><div class=\"cdl-big\" id=\"cdl-tasbeeh-n\">" + tas + "</div><p class=\"cdl-sub\">Soft count on this device</p>";
    html += "<div><button type=\"button\" class=\"cdl-btn\" id=\"cdl-tas-plus\">+1</button><button type=\"button\" class=\"cdl-btn secondary\" id=\"cdl-tas-reset\">Reset</button></div></div></div>";

    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">📿</span> " + windowLabel + "</h2>";
    html += "<span class=\"cdl-sub\" id=\"cdl-adh-progress\">Count " + cnt + " / " + dh.target + " · " + (idx + 1) + "/" + pack.length + "</span></div>";
    html += "<p class=\"cdl-ar\" lang=\"ar\" dir=\"rtl\" id=\"cdl-adh-ar\">" + dh.ar + "</p>";
    html += "<p id=\"cdl-adh-en\">" + dh.en + "</p><p class=\"cdl-sub\" id=\"cdl-adh-ref\">" + dh.ref + "</p>";
    html += "<div><button type=\"button\" class=\"cdl-btn\" id=\"cdl-adh-count\">+1 count</button>";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" id=\"cdl-adh-next\">Next dhikr →</button></div></div>";

    html += "<div class=\"cdl-card\" id=\"cdl-vault-note\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">🔒</span> Vault note registry · on-device</h2></div>";
    html += "<p class=\"cdl-sub\">Write here only. Saved notes appear under Amānah Vault → Heir readiness when unlocked. On-device · educational · not legal advice.</p>";
    html += "<textarea class=\"cdl-note-input\" id=\"cdl-note-text\" placeholder=\"Write a trust note, debt reminder, or wasiyyah thought…\"></textarea>";
    html += "<div style=\"margin-top:0.45rem\"><button type=\"button\" class=\"cdl-btn\" id=\"cdl-note-save\">Save to registry</button></div>";
    html += "<p class=\"cdl-sub\">Notes stay on this device. One-way channel · not legal advice.</p></div>";

    /* Send light ahead */
    html += "<div class=\"cdl-card\" id=\"cdl-send-light\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">✨</span> Send light ahead · soft tally</h2></div>";
    html += "<p class=\"cdl-sub\">Optional on-device marks for deeds that may continue — not a score of īmān.</p>";
    html += "<div class=\"cdl-light-row\">";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" data-light=\"s\">Sadaqah <span id=\"cdl-light-s\">" + light.s + "</span></button>";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" data-light=\"k\">Knowledge <span id=\"cdl-light-k\">" + light.k + "</span></button>";
    html += "<button type=\"button\" class=\"cdl-btn secondary\" data-light=\"d\">Duʿāʾ <span id=\"cdl-light-d\">" + light.d + "</span></button>";
    html += "</div><p class=\"cdl-sub\" id=\"cdl-light-msg\">Muslim 1631 · educational</p></div>";

    html += "<div class=\"cdl-oath\">";
    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">🕯️</span> Remember the long stay</h2></div>";
    html += "<p class=\"cdl-sub\">Family and wealth turn back at the grave; <strong>deeds stay with you</strong>. Prepare a home of light.</p>";
    html += "<p class=\"cdl-sub\">Educational reminder · not a fatwa</p></div>";
    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">🌱</span> Reward that may continue</h2></div>";
    html += "<p class=\"cdl-sub\">Ongoing charity, beneficial knowledge, and a righteous child who prays for them.</p>";
    html += "<p class=\"cdl-sub\">Muslim 1631 · educational · verify with a scholar</p></div></div>";

    html += "<div class=\"cdl-card\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">🛡️</span> Core protection set</h2></div>";
    html += "<p class=\"cdl-sub\">When ready: <strong>Āyat al-Kursī</strong>, the three Quls, and Sayyid al-istighfār. Start small.</p>";
    html += "<p class=\"cdl-sub\">Hisn-style practice · educational · learn full wording with a teacher</p></div>";

    html += "<div class=\"cdl-card\" id=\"cdl-wudu\"><button type=\"button\" class=\"cdl-expand-btn\" id=\"cdl-wudu-btn\" aria-expanded=\"false\">💧 Wuḍūʾ steps · outline ▾</button>";
    html += "<div class=\"cdl-fold-body\" id=\"cdl-wudu-body\" hidden><div class=\"cdl-steps\">" + stepsHtml(WUDU) + "</div>";
    html += "<p class=\"cdl-sub\">Educational outline — schools differ. Learn with a local teacher.</p>";
    html += "<p class=\"cdl-sub\">Deepen: <a href=\"https://quran.com/5/6\" target=\"_blank\" rel=\"noopener\">Qurʾān 5:6</a> · <a href=\"https://sunnah.com/search?q=wudu\" target=\"_blank\" rel=\"noopener\">Sunnah.com</a></p></div></div>";

    html += "<div class=\"cdl-card\" id=\"cdl-salah-steps\"><button type=\"button\" class=\"cdl-expand-btn\" id=\"cdl-salah-btn\" aria-expanded=\"false\">🕌 Prayer steps · simple unit ▾</button>";
    html += "<div class=\"cdl-fold-body\" id=\"cdl-salah-body\" hidden><div class=\"cdl-steps\">" + stepsHtml(SALAH) + "</div>";
    html += "<p class=\"cdl-sub\">Simplified teaching path — not a full fiqh manual. Verify with a teacher.</p>";
    html += "<p class=\"cdl-sub\">Deepen: <a href=\"https://quran.com/1\" target=\"_blank\" rel=\"noopener\">Al-Fātiḥah</a> · <a href=\"https://quran.com/2/144\" target=\"_blank\" rel=\"noopener\">Qiblah 2:144</a></p></div></div>";

    /* Qaḍāʾ simple tracker */
    html += "<div class=\"cdl-card\" id=\"cdl-qada\" data-landing=\"qada\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">🕌</span> Making up missed ṣalāh · qaḍāʾ tracker</h2></div>";
    html += "<p class=\"cdl-sub\">Educational companion only — <strong>not a fatwa</strong>. Missing prayer without excuse is a grave matter. Obligation begins at puberty. Scholars differ on make-up after deliberate neglect; ask a qualified local teacher.</p>";
    html += "<div class=\"cdl-qada-row\">";
    ["fajr","dhuhr","asr","maghrib","isha"].forEach(function (k) {
      html += "<label>" + k.charAt(0).toUpperCase() + k.slice(1) + " <input type=\"number\" min=\"0\" data-qada=\"" + k + "\" value=\"" + (qada[k] || 0) + "\"></label>";
    });
    html += "<button type=\"button\" class=\"cdl-btn\" id=\"cdl-qada-save\">Save on device</button></div>";
    html += "<p class=\"cdl-sub\" id=\"cdl-qada-msg\">Totals stay on this device only.</p></div>";

    /* Trust plaques */
    html += "<div class=\"cdl-card\" id=\"cdl-confidence\" data-landing=\"confidence\"><div class=\"cdl-head\"><h2><span class=\"cdl-ico\" aria-hidden=\"true\">🛡️</span> Built for trust · review plaques</h2></div>";
    html += "<p class=\"cdl-sub\"><strong>Educational companion only — not a fatwa, not legal advice.</strong> For personal rulings, ask a qualified local teacher.</p>";
    html += "<div class=\"cdl-trust-grid\">";
    html += "<article class=\"cdl-trust-plaque\"><div aria-hidden=\"true\">📖</div><h3>Sources in the open</h3><p>Verses and reports point to established libraries.</p><p class=\"cdl-sub\"><a href=\"https://quran.com\" target=\"_blank\" rel=\"noopener\">Quran.com</a> · <a href=\"https://sunnah.com\" target=\"_blank\" rel=\"noopener\">Sunnah.com</a></p></article>";
    html += "<article class=\"cdl-trust-plaque\"><div aria-hidden=\"true\">💻</div><h3>On this device</h3><p>Day progress, qaḍāʾ, and notes use browser storage — no Clarity cloud account.</p><p class=\"cdl-sub\">localStorage · private by default</p></article>";
    html += "<article class=\"cdl-trust-plaque\"><div aria-hidden=\"true\">🔐</div><h3>Amānah vault</h3><p>Passphrase is never kept by the site. Encrypted payload stays local.</p><p class=\"cdl-sub\">AES-GCM on-device · not legal advice</p></article>";
    html += "</div></div>";

    html += "<div id=\"clarity-landing-slot-dayn\" data-day-slot=\"dayn\"></div>";

    inner.innerHTML = html;
    inner.removeAttribute("data-allow-write");
    freezeInterior(inner);
    room.setAttribute("data-room-filled", "3");
    room.setAttribute("data-day-room-owner", "clarity-day-room-v3");
    wire(pack, idx, cnt, light, qada);
  }

  function wire(pack, idx, cnt, light, qada) {
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
      if (prog) prog.textContent = "Count " + state.cnt + " / " + d.target + " · " + (state.idx + 1) + "/" + state.pack.length;
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
        var d = state.pack[state.idx];
        if (state.cnt >= d.target) {
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
    function wireExpand(btnId, bodyId) {
      var btn = document.getElementById(btnId);
      var body = document.getElementById(bodyId);
      if (!btn || !body || btn.__w) return;
      btn.__w = true;
      btn.addEventListener("click", function () {
        var open = body.hasAttribute("hidden");
        if (open) body.removeAttribute("hidden");
        else body.setAttribute("hidden", "");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    wireExpand("cdl-wudu-btn", "cdl-wudu-body");
    wireExpand("cdl-salah-btn", "cdl-salah-body");

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
        noteSave.textContent = "Saved on device ✓";
        setTimeout(function () { noteSave.textContent = "Save to registry"; }, 1500);
      });
    }

    /* send light */
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

    /* qada save */
    var qSave = document.getElementById("cdl-qada-save");
    if (qSave && !qSave.__w) {
      qSave.__w = true;
      qSave.addEventListener("click", function () {
        var o = {};
        document.querySelectorAll("[data-qada]").forEach(function (inp) {
          o[inp.getAttribute("data-qada")] = Math.max(0, parseInt(inp.value || "0", 10) || 0);
        });
        writeJSON(KEY_QADA, o);
        var msg = document.getElementById("cdl-qada-msg");
        if (msg) msg.textContent = "Saved on this device · educational only · not a fatwa";
      });
    }
  }

  function boot() {
    var room = document.getElementById("clarity-day-landing-room");
    if (!room) return;
    fill(room);
    try { document.dispatchEvent(new CustomEvent("clarity:day-room-ready")); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 40); });
  } else setTimeout(boot, 40);
  w.addEventListener("load", function () {
    var room = document.getElementById("clarity-day-landing-room");
    if (room && room.getAttribute("data-room-filled") !== "3") boot();
  });
  w.ClarityDayRoom = { fill: boot, version: 3 };
})(typeof window !== "undefined" ? window : this);
