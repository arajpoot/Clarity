/*! companion-g8-reality-stable-v1
 * Reality hub loaders + Phase 5 stability (noise dampen, single nav, tab isolation)
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G8_REALITY_STABLE_V1__) return;
  w.__CLARITY_G8_REALITY_STABLE_V1__ = true;
  var LOG = (w.__G8_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  /* —— shared ayah fetch —— */
  var cache = {};
  function parseKey(k) {
    var p = String(k).split(":");
    return { s: parseInt(p[0], 10), a: parseInt(p[1], 10) };
  }
  function fetchAyah(s, a) {
    var key = s + ":" + a;
    if (cache[key]) return Promise.resolve(cache[key]);
    var url = "https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih";
    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var eds = (j && j.data) || [];
        var ar = "", en = "";
        if (Array.isArray(eds)) {
          if (eds[0]) ar = eds[0].text || "";
          if (eds[1]) en = eds[1].text || "";
        }
        var row = { s: s, a: a, ar: ar, en: en };
        cache[key] = row;
        return row;
      });
  }

  /* Live sīrah ayah — verses traditionally linked to the Prophet’s ﷺ mission (educational) */
  var SEERAH_AYAH = [
    "33:21", "33:40", "33:56", "9:128", "9:129", "21:107", "48:29", "3:31", "3:32",
    "4:80", "7:158", "33:45", "33:46", "61:6", "94:1", "94:2", "94:3", "108:1", "110:1", "110:2", "110:3"
  ];
  var seerahIdx = Math.floor(Date.now() / 86400000) % SEERAH_AYAH.length;

  function renderSeerahLive(row) {
    var ar = $("seerah-live-ar");
    var en = $("seerah-live-en");
    var note = $("seerah-live-note");
    if (ar) ar.textContent = row.ar || "";
    if (en) en.textContent = row.en || "";
    if (note) {
      var btn = note.querySelector("button");
      note.innerHTML = "";
      note.appendChild(d.createTextNode("Qur’an " + row.s + ":" + row.a + " · educational sīrah-linked reminder · not a fatwa "));
      if (btn) note.appendChild(btn);
      else {
        var b = d.createElement("button");
        b.type = "button";
        b.className = "btn-soft";
        b.style.cssText = "font-size:.72rem;padding:.2rem .5rem;margin-left:.35rem";
        b.textContent = "☁ Online";
        b.onclick = function () {
          w.open("https://quran.com/" + row.s + "/" + row.a, "_blank", "noopener");
        };
        note.appendChild(b);
      }
    }
  }

  w.clarityLiveSeerah = function (next) {
    if (next) seerahIdx = (seerahIdx + 1) % SEERAH_AYAH.length;
    var p = parseKey(SEERAH_AYAH[seerahIdx]);
    fetchAyah(p.s, p.a).then(renderSeerahLive).catch(function () {
      log("seerah-ayah-fail");
    });
  };

  /* Prophetic judgements & governance — curated educational cards (not legal rulings) */
  var JUDGEMENTS = [
    {
      title: "Treaty of Ḥudaybiyyah — restraint as strength",
      ar: "وَإِن جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا وَتَوَكَّلْ عَلَى اللَّهِ",
      en: "If they incline to peace, incline to it also, and rely upon Allah. (Qur’an 8:61 theme — study with tafsīr.)",
      src: "Educational note on peacemaking in the Prophet’s ﷺ sīrah · verify on Quran.com / classical sīrah · not a fatwa"
    },
    {
      title: "Constitutional care in Madinah",
      ar: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
      en: "The Muslim is the one from whose tongue and hand the Muslims are safe. (Bukhārī / Muslim — wording varies by route.)",
      src: "Sunnah.com · character as public safety · educational only — not a fatwa"
    },
    {
      title: "Justice even against oneself",
      ar: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ",
      en: "O you who believe, be persistently standing firm in justice… (Qur’an 4:135 — opening).",
      src: "Qur’an 4:135 · governance ethic · educational only — not a fatwa"
    },
    {
      title: "Return trusts; judge with justice",
      ar: "إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا",
      en: "Allah commands you to restore trusts to their owners, and when you judge between people, judge with justice… (Qur’an 4:58).",
      src: "Qur’an 4:58 · verify tafsīr · educational only — not a fatwa"
    },
    {
      title: "Mercy in leadership",
      ar: "فَبِمَا رَحْمَةٍ مِّنَ اللَّهِ لِنتَ لَهُمْ",
      en: "By mercy from Allah you were gentle with them… (Qur’an 3:159 — opening).",
      src: "Qur’an 3:159 · Prophetic leadership · educational only — not a fatwa"
    },
    {
      title: "Public rights — the road",
      ar: "إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ",
      en: "Removing harmful things from the road is a charity. (Muslim — and similar routes).",
      src: "Sunnah.com · civic care · educational only — not a fatwa"
    }
  ];
  var judIdx = Math.floor(Date.now() / 86400000) % JUDGEMENTS.length;

  function renderJudgement(row) {
    var t = $("samina-title");
    var ar = $("samina-ar");
    var en = $("samina-en");
    var src = $("samina-src");
    if (t) t.textContent = row.title;
    if (ar) ar.textContent = row.ar || "";
    if (en) en.textContent = row.en || "";
    if (src) src.textContent = row.src || "";
  }

  w.clarityLiveSamina = function (next) {
    if (next) judIdx = (judIdx + 1) % JUDGEMENTS.length;
    renderJudgement(JUDGEMENTS[judIdx]);
    log("judgement:" + judIdx);
  };

  /* Ṭibb Nabawī — rotate educational remedies (NOT medical advice) */
  var TIBBE = [
    {
      title: "Black seed (الحبّة السوداء) — al-ḥabba al-sawdāʾ",
      ar: "فِي الْحَبَّةِ السَّوْدَاءِ شِفَاءٌ مِنْ كُلِّ دَاءٍ إِلَّا السَّامَ",
      en: "In black seed there is healing from every disease except death. (Bukhārī / Muslim — wording by route.)",
      ref: "Educational only — not medical advice or a fatwa. Ask a physician. Verify on Sunnah.com."
    },
    {
      title: "Honey — شفاء",
      ar: "فِيهِ شِفَاءٌ لِلنَّاسِ",
      en: "In it (honey) is healing for people. (Qur’an 16:69 theme — read full ayah with tafsīr.)",
      ref: "Qur’an 16:69 · educational only — not medical advice or a fatwa."
    },
    {
      title: "Hijāmah (cupping) — Prophetic practice reports",
      ar: "خَيْرُ مَا تَدَاوَيْتُمْ بِهِ الْحِجَامَةُ",
      en: "The best of that with which you treat yourselves is hijāmah. (Reports in the Sunnah — verify grading on Sunnah.com.)",
      ref: "Educational history of practice — not a prescription. Consult qualified care."
    },
    {
      title: "Moderation in eating",
      ar: "مَا مَلَأَ آدَمِيٌّ وِعَاءً شَرًّا مِنْ بَطْنٍ",
      en: "A human does not fill any vessel worse than the stomach… (Tirmidhī and others — verify text/grade).",
      ref: "Educational adab of food — not medical advice or a fatwa."
    }
  ];
  var tibbeIdx = 0;

  function renderTibbe(row) {
    var t = $("tibbe-title");
    var ar = $("tibbe-ar");
    var en = $("tibbe-en");
    var ref = $("tibbe-ref");
    if (t) t.innerHTML = row.title;
    if (ar) ar.textContent = row.ar || "";
    if (en) en.textContent = row.en || "";
    if (ref) ref.textContent = row.ref || "";
  }

  w.clarityTibbeNext = function () {
    tibbeIdx = (tibbeIdx + 1) % TIBBE.length;
    renderTibbe(TIBBE[tibbeIdx]);
  };

  /* Safe stubs for other Reality onclick (avoid console noise) */
  function stub(name, fn) {
    if (typeof w[name] !== "function") {
      w[name] = fn || function () { log("stub:" + name); };
    }
  }
  stub("loadSeerah", function () {
    w.clarityLiveSeerah(false);
  });
  stub("loadLifeEvent", function () {
    log("loadLifeEvent");
  });
  stub("loadProphetStory", function () {
    log("loadProphetStory");
  });
  stub("loadIsraeliyat", function () {
    log("loadIsraeliyat");
  });
  stub("clarityRefreshSection", function (sec) {
    if (sec === "seerah") w.clarityLiveSeerah(true);
  });
  stub("expandAllSeerahTl");
  stub("fetchSeerahOnlineSummaries");
  stub("clarityIsraeliyatDeepFetch");
  stub("clarityIsraeliyatExpandScholar");
  stub("qaToggleList");
  stub("clarityPrintLegacy");
  stub("copyShareLight");

  /* Phase 5 stability — campus-like calm */
  function stabilityPass() {
    d.documentElement.setAttribute("data-clarity-room", "companion");
    /* single room-nav */
    var navs = d.querySelectorAll("nav.clarity-room-nav");
    for (var i = 1; i < navs.length; i++) {
      try {
        navs[i].parentNode.removeChild(navs[i]);
      } catch (e) {}
    }
    /* inactive tabs */
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      if (!p.classList.contains("is-active") && !p.classList.contains("active")) {
        p.style.setProperty("display", "none", "important");
      }
    });
    /* damp banner thrash */
    var duo = $("clarity-top-duo");
    if (duo) {
      duo.style.setProperty("transition", "none", "important");
    }
    log("stability-pass");
  }

  function bootReality() {
    w.clarityLiveSeerah(false);
    w.clarityLiveSamina(false);
    renderTibbe(TIBBE[0]);
    stabilityPass();
    log("g8-boot");
  }

  /* When user opens Reality tab, refresh once */
  d.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t) return;
    var rail = t.closest && t.closest("[data-rail-tab='reality'], [data-rrra='reality']");
    if (rail) {
      setTimeout(function () {
        if (!$("seerah-live-ar") || !($("seerah-live-ar").textContent || "").trim()) w.clarityLiveSeerah(false);
        if (!$("samina-title") || !($("samina-title").textContent || "").trim()) w.clarityLiveSamina(false);
      }, 100);
    }
  });

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bootReality);
  else bootReality();
})(window, document);
