/**
 * Companion adhkār card — mounts under “Do this today” (provision home)
 * One dhikr at a time · linked to cph tasbeeh · local only
 * Educational — not a fatwa. Sources: common morning/evening adhkār (verify with teacher).
 * Does not touch /campus/.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_ADHKAR_CARD_V1__) return;
  w.__CLARITY_ADHKAR_CARD_V1__ = "20261020ADH";

  var KEY = "clarity_adhkar_card_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";

  /* Compact offline set — morning / evening windows */
  var ADHKAR = {
    morning: [
      {
        id: "m1",
        ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
        en: "O Allah, by You we enter the morning and by You the evening, by You we live and die, and to You is the resurrection.",
        ref: "Tirmidhī 3391 · educational wording — confirm with a teacher",
        target: 1
      },
      {
        id: "m2",
        ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        en: "We have entered the morning and the dominion belongs to Allah, and all praise is for Allah.",
        ref: "Abū Dāwūd 5068 · educational",
        target: 1
      },
      {
        id: "m3",
        ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        en: "In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
        ref: "Abū Dāwūd 5088 · often 3× · educational",
        target: 3
      }
    ],
    evening: [
      {
        id: "e1",
        ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
        en: "O Allah, by You we enter the evening and by You the morning, by You we live and die, and to You is the return.",
        ref: "Tirmidhī 3391 · educational wording — confirm with a teacher",
        target: 1
      },
      {
        id: "e2",
        ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        en: "We have entered the evening and the dominion belongs to Allah, and all praise is for Allah.",
        ref: "Abū Dāwūd 5068 · educational",
        target: 1
      },
      {
        id: "e3",
        ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        en: "I seek refuge in the perfect words of Allah from the evil of what He created.",
        ref: "Muslim 2708 · educational",
        target: 3
      }
    ]
  };

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveState(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }

  function windowKind() {
    /* Prefer local hour: morning ~5–11, evening ~15–19, else night→evening set */
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return "morning";
    if (h >= 15 && h < 20) return "evening";
    if (h >= 12 && h < 15) return "morning"; /* late morning / noon still AM set */
    return "evening";
  }

  function dayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function pickDhikr() {
    var kind = windowKind();
    var list = ADHKAR[kind] || ADHKAR.morning;
    var st = loadState();
    var day = dayKey();
    if (st.day !== day) {
      st.day = day;
      st.ix = Math.abs(hash(day + kind)) % list.length;
      st.count = 0;
      saveState(st);
    }
    var item = list[st.ix % list.length];
    return { kind: kind, item: item, count: st.count || 0 };
  }

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
  }

  function bumpTasbeeh() {
    try {
      var n = parseInt(localStorage.getItem(KEY_TAS) || "0", 10) || 0;
      n += 1;
      localStorage.setItem(KEY_TAS, String(n));
      var el = document.getElementById("cph-tas-count");
      if (el) el.textContent = String(n);
      var btn = document.getElementById("cph-tas-inc");
      if (btn) {
        try {
          btn.dispatchEvent(new Event("click", { bubbles: true }));
        } catch (e) {}
      }
    } catch (e) {}
  }

  function ensureStyles() {
    if (document.getElementById("clarity-adhkar-card-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-adhkar-card-css";
    s.textContent =
      ".cph-adhkar{margin:.65rem 0 0;padding:.9rem 1rem;border-radius:16px;border:1px solid rgba(30,125,94,.35);" +
      "background:rgba(12,22,18,.92);color:inherit;max-width:100%;box-sizing:border-box}" +
      "html[data-theme=light] .cph-adhkar,body:not([data-theme=dark]) .cph-adhkar{background:#f7faf7;border-color:rgba(30,125,94,.28);color:#13201a}" +
      ".cph-adhkar h3{margin:0 0 .35rem;font-size:.95rem;font-weight:800;color:#1e7d5e}" +
      ".cph-adhkar .cph-adh-ar{font-family:Amiri,Traditional Arabic,serif;direction:rtl;unicode-bidi:isolate;" +
      "font-size:clamp(1.05rem,3.5vw,1.35rem);line-height:1.75;margin:.5rem 0;text-align:center}" +
      ".cph-adhkar .cph-adh-en{font-size:.86rem;line-height:1.45;opacity:.92;margin:.35rem 0}" +
      ".cph-adhkar .cph-adh-ref{font-size:.72rem;opacity:.75;margin:.25rem 0 .55rem}" +
      ".cph-adhkar .cph-adh-actions{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center}" +
      ".cph-adhkar button{min-height:40px;padding:.35rem .9rem;border-radius:999px;border:0;background:#1e7d5e;color:#fff;" +
      "font-weight:700;font-size:.8rem;cursor:pointer}" +
      ".cph-adhkar button.ghost{background:transparent;color:inherit;border:1px solid rgba(30,125,94,.4)}" +
      ".cph-adhkar .cph-adh-prog{font-size:.78rem;opacity:.85;margin-left:auto}";
    document.head.appendChild(s);
  }

  function renderCard(host) {
    ensureStyles();
    var existing = host.querySelector(".cph-adhkar");
    if (existing) existing.remove();

    var pick = pickDhikr();
    var item = pick.item;
    var st = loadState();
    var count = st.count || 0;
    var target = item.target || 1;

    var card = document.createElement("div");
    card.className = "cph-adhkar";
    card.setAttribute("data-adhkar-card", "1");
    card.innerHTML =
      "<h3>Morning &amp; evening adhkār · " +
      (pick.kind === "morning" ? "Morning window" : "Evening window") +
      "</h3>" +
      '<p class="cph-adh-ar" lang="ar" dir="rtl">' +
      item.ar +
      "</p>" +
      '<p class="cph-adh-en">' +
      item.en +
      "</p>" +
      '<p class="cph-adh-ref">' +
      item.ref +
      " · not a fatwa</p>" +
      '<div class="cph-adh-actions">' +
      '<button type="button" data-adh-say>Say + link tasbeeh</button>' +
      '<button type="button" class="ghost" data-adh-next>Another</button>' +
      '<a class="ghost" href="/adhkar/" style="min-height:40px;padding:.35rem .9rem;border-radius:999px;border:1px solid rgba(30,125,94,.4);text-decoration:none;display:inline-flex;align-items:center;font-size:.8rem;font-weight:700;color:inherit">About times</a>' +
      '<span class="cph-adh-prog">' +
      count +
      " / " +
      target +
      "</span>" +
      "</div>";

    card.querySelector("[data-adh-say]").addEventListener("click", function () {
      var s = loadState();
      s.count = (s.count || 0) + 1;
      saveState(s);
      bumpTasbeeh();
      renderCard(host);
    });
    card.querySelector("[data-adh-next]").addEventListener("click", function () {
      var kind = windowKind();
      var list = ADHKAR[kind] || ADHKAR.morning;
      var s = loadState();
      s.ix = ((s.ix || 0) + 1) % list.length;
      s.count = 0;
      saveState(s);
      renderCard(host);
    });

    /* Insert after main provision card */
    var provCard = host.querySelector(".cph-card.cph-provision");
    if (provCard && provCard.nextSibling) {
      host.insertBefore(card, provCard.nextSibling);
    } else if (provCard) {
      provCard.parentNode.appendChild(card);
    } else {
      host.appendChild(card);
    }
  }

  function mount() {
    var host = document.getElementById("clarity-provision-home");
    if (!host) return false;
    renderCard(host);
    return true;
  }

  function boot() {
    if (mount()) return;
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (mount() || tries > 25) clearInterval(t);
    }, 400);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 800);
  setTimeout(boot, 2000);
})(typeof window !== "undefined" ? window : this);
