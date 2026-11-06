/*! companion-g10-action-hajj-parity-v1
 * Action: Hajj guide + checklist full content · hifz · seerah mirror · tajweed daily
 * G10 campus-parity spirit + governance. Educational only — not a fatwa. Follow your teacher / local hajj authority.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_G10_ACTION_HAJJ_V1__) return;
  w.__CLARITY_G10_ACTION_HAJJ_V1__ = true;
  var LOG = (w.__G10_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function $(id) { return d.getElementById(id); }

  /* —— Hajj steps (educational outline — verify with scholar / official guide) —— */
  var HAJJ_STEPS = {
    tamattu: [
      { id: "ihram_umrah", title: "Iḥrām for ʿUmrah", body: "Enter iḥrām from the mīqāt with intention for ʿUmrah. Men: iḥrām garments. Women: normal modest dress without face-veil/gloves in iḥrām rules as taught. Begin talbiyah. Educational outline — confirm details with your teacher / official guide." },
      { id: "tawaf_umrah", title: "Ṭawāf of ʿUmrah", body: "Seven circuits around the Kaʿbah, starting at the Black Stone line. Keep the Kaʿbah on your left. Duʿāʾ as you know; there is no required fixed duʿāʾ for each circuit. Educational only." },
      { id: "sai_umrah", title: "Saʿī of ʿUmrah", body: "Seven legs between Ṣafā and Marwah. Begin at Ṣafā. Men: green-light jog zone if able. Then exit iḥrām for ʿUmrah (trim/shave per ruling you follow)." },
      { id: "ihram_hajj", title: "Iḥrām for Ḥajj (8 Dhū al-Ḥijjah)", body: "Re-enter iḥrām for Ḥajj from Makkah. Talbiyah. Prepare for Mina." },
      { id: "mina_8", title: "Mina — 8 Dhū al-Ḥijjah", body: "Proceed to Mina; pray as a traveler if applicable per your school; rest and remember Allah. Educational schedule — follow group leader." },
      { id: "arafah", title: "ʿArafah — 9 Dhū al-Ḥijjah", body: "Stand at ʿArafah after zawāl until sunset. This is the pillar of Ḥajj. Much duʿāʾ and istighfār. Do not leave before sunset (for Ḥajj)." },
      { id: "muzdalifah", title: "Muzdalifah", body: "After sunset move to Muzdalifah. Maghrib + ʿIshāʾ as taught; collect pebbles; rest. Weak/excused may leave early per scholarly opinion you follow." },
      { id: "jamarat_10", title: "Jamarāt & sacrifice — 10th", body: "Stone Jamarat al-ʿAqabah; sacrifice (hady) for tamattuʿ; men shave/trim; ṭawāf al-ifāḍah and saʿī of Ḥajj as sequenced by your guide." },
      { id: "tashriq", title: "Days of Tashrīq", body: "Mina; stone the three jamarāt each day after zawāl (exceptions exist). Keep dhikr and patience." },
      { id: "wada", title: "Farewell ṭawāf", body: "Ṭawāf al-wadāʿ before leaving Makkah (women in menses: rulings differ — ask a scholar)." }
    ],
    qiran: null,
    ifrad: null
  };
  /* Qirān / Ifrād: shared skeleton with note */
  HAJJ_STEPS.qiran = HAJJ_STEPS.tamattu.map(function (s) {
    return Object.assign({}, s, {
      body: s.body + " (Qirān: ʿUmrah+Ḥajj in one iḥrām; hady required — confirm with your teacher.)"
    });
  });
  HAJJ_STEPS.ifrad = HAJJ_STEPS.tamattu.filter(function (s) {
    return s.id.indexOf("umrah") === -1;
  }).map(function (s) {
    return Object.assign({}, s, {
      body: s.body + " (Ifrād: Ḥajj only — no ʿUmrah in this nusk.)"
    });
  });

  var hajjState = { nusk: "tamattu", step: 0, done: {} };
  try {
    var saved = JSON.parse(localStorage.getItem("clarity.hajj.v1") || "null");
    if (saved) hajjState = saved;
  } catch (e) {}

  function hajjSave() {
    try {
      localStorage.setItem("clarity.hajj.v1", JSON.stringify(hajjState));
    } catch (e) {}
  }

  function hajjSteps() {
    return HAJJ_STEPS[hajjState.nusk] || HAJJ_STEPS.tamattu;
  }

  function hajjFillSelect() {
    var sel = $("hajj-step-select");
    if (!sel) return;
    var steps = hajjSteps();
    sel.innerHTML = steps
      .map(function (s, i) {
        return '<option value="' + i + '">' + (i + 1) + ". " + s.title + "</option>";
      })
      .join("");
    sel.value = String(hajjState.step || 0);
  }

  function hajjRenderProgress() {
    var el = $("hajj-progress");
    if (!el) return;
    var steps = hajjSteps();
    var done = 0;
    steps.forEach(function (s) {
      if (hajjState.done[hajjState.nusk + ":" + s.id]) done++;
    });
    el.textContent = "Progress: " + done + " / " + steps.length + " marked on this device · educational only — not a fatwa";
  }

  w.hajjShowStep = function (val) {
    var i = parseInt(val, 10);
    if (isNaN(i)) i = 0;
    hajjState.step = i;
    var steps = hajjSteps();
    var s = steps[i] || steps[0];
    var panel = $("hajj-panel");
    if (panel && s) {
      var key = hajjState.nusk + ":" + s.id;
      var marked = hajjState.done[key] ? " ✓" : "";
      panel.innerHTML =
        "<h3 style=\"margin:0 0 .35rem;color:var(--accent)\">" +
        s.title +
        marked +
        "</h3><p style=\"line-height:1.55;font-size:.92rem;margin:0\">" +
        s.body +
        "</p><p class=\"td-src\" style=\"margin-top:.5rem\">Follow haj.gov.sa / your group scholar for binding practice. Not a fatwa.</p>";
    }
    hajjSave();
    hajjRenderProgress();
    try {
      w.hajjChecklistRender();
    } catch (e) {}
  };

  w.hajjMarkDone = function () {
    var steps = hajjSteps();
    var s = steps[hajjState.step];
    if (!s) return;
    hajjState.done[hajjState.nusk + ":" + s.id] = true;
    hajjSave();
    w.hajjShowStep(hajjState.step);
  };
  w.hajjMarkUndone = function () {
    var steps = hajjSteps();
    var s = steps[hajjState.step];
    if (!s) return;
    delete hajjState.done[hajjState.nusk + ":" + s.id];
    hajjSave();
    w.hajjShowStep(hajjState.step);
  };
  w.hajjWhereAmI = function () {
    var steps = hajjSteps();
    var first = 0;
    for (var i = 0; i < steps.length; i++) {
      if (!hajjState.done[hajjState.nusk + ":" + steps[i].id]) {
        first = i;
        break;
      }
      first = i;
    }
    var sel = $("hajj-step-select");
    if (sel) sel.value = String(first);
    w.hajjShowStep(first);
  };
  w.hajjPrintChecklist = function () {
    w.hajjChecklistPrint();
  };
  w.hajjChecklistPrint = function () {
    var steps = hajjSteps();
    var lines = steps.map(function (s, i) {
      var ok = hajjState.done[hajjState.nusk + ":" + s.id] ? "[x]" : "[ ]";
      return ok + " " + (i + 1) + ". " + s.title;
    });
    var wdw = w.open("", "_blank");
    if (!wdw) return;
    wdw.document.write(
      "<pre>Hajj checklist (" +
        hajjState.nusk +
        ")\nEducational only — not a fatwa.\n\n" +
        lines.join("\n") +
        "</pre>"
    );
    wdw.document.close();
  };
  w.hajjChecklistReset = function () {
    Object.keys(hajjState.done).forEach(function (k) {
      if (k.indexOf(hajjState.nusk + ":") === 0) delete hajjState.done[k];
    });
    hajjSave();
    w.hajjShowStep(hajjState.step);
  };
  w.hajjChecklistSetNusk = function (v) {
    hajjState.nusk = v || "tamattu";
    var nusk = $("hajj-nusk");
    if (nusk) nusk.value = hajjState.nusk;
    hajjFillSelect();
    w.hajjShowStep(0);
  };
  w.hajjChecklistRender = function () {
    var list = $("hajj-checklist-list");
    var prog = $("hajj-checklist-progress");
    var steps = hajjSteps();
    if (prog) {
      var done = 0;
      steps.forEach(function (s) {
        if (hajjState.done[hajjState.nusk + ":" + s.id]) done++;
      });
      prog.textContent = done + " / " + steps.length + " complete on this device";
    }
    if (!list) return;
    list.innerHTML = steps
      .map(function (s, i) {
        var ok = !!hajjState.done[hajjState.nusk + ":" + s.id];
        return (
          '<label style="display:flex;gap:.5rem;padding:.35rem 0;border-bottom:1px solid rgba(255,255,255,.06)"><input type="checkbox" data-hajj-id="' +
          s.id +
          '" ' +
          (ok ? "checked" : "") +
          "/> <span>" +
          (i + 1) +
          ". " +
          s.title +
          "</span></label>"
        );
      })
      .join("");
    list.querySelectorAll("input[data-hajj-id]").forEach(function (inp) {
      inp.addEventListener("change", function () {
        var id = inp.getAttribute("data-hajj-id");
        var key = hajjState.nusk + ":" + id;
        if (inp.checked) hajjState.done[key] = true;
        else delete hajjState.done[key];
        hajjSave();
        hajjRenderProgress();
        w.hajjChecklistRender();
      });
    });
  };

  var talbiyahCount = 0;
  try {
    talbiyahCount = parseInt(localStorage.getItem("clarity.talbiyah") || "0", 10) || 0;
  } catch (e) {}
  function talbiyahShow() {
    var el = $("hajj-talbiyah-count");
    if (el) el.textContent = String(talbiyahCount);
  }
  w.hajjTalbiyah = function (delta) {
    talbiyahCount = Math.max(0, talbiyahCount + (delta || 1));
    try {
      localStorage.setItem("clarity.talbiyah", String(talbiyahCount));
    } catch (e) {}
    talbiyahShow();
  };
  w.hajjPlayTalbiyah = function () {
    try {
      var u = new SpeechSynthesisUtterance(
        "Labbayka Allahumma labbayk. Labbayka la shareeka laka labbayk. Inna al-hamda wan-ni'mata laka wal-mulk. La shareeka lak."
      );
      u.lang = "ar-SA";
      w.speechSynthesis.speak(u);
    } catch (e) {
      log("talbiyah-tts");
    }
  };

  /* nusk change on guide select */
  d.addEventListener("change", function (ev) {
    if (ev.target && ev.target.id === "hajj-nusk") {
      w.hajjChecklistSetNusk(ev.target.value);
    }
  });

  /* —— Seerah mirror —— */
  var MIRROR = [
    { t: "Truthfulness", m: "He ﷺ was known as al-Amīn before prophecy.", p: "Where can I tell the truth today when it costs me comfort?", src: "Sīrah character · educational" },
    { t: "Mercy", m: "He ﷺ was gentle even when wronged.", p: "Whom can I treat more gently before night?", src: "Sīrah character · educational" },
    { t: "Courage with wisdom", m: "Standing for truth without oppression.", p: "What boundary do I need to keep without harshness?", src: "Sīrah character · educational" },
    { t: "Trust in Allah", m: "In the cave: ‘Allah is with us.’", p: "What anxiety can I hand to Allah in duʿāʾ now?", src: "Qur’an 9:40 theme · educational" },
    { t: "Humility", m: "He ﷺ mended his own sandals and served family.", p: "What small service can I do without being seen?", src: "Sīrah character · educational" },
    { t: "Justice", m: "Even against one’s own people.", p: "Where must I be fair though my ego resists?", src: "Qur’an 4:135 theme · educational" },
    { t: "Consistency", m: "The most beloved deeds are those done regularly.", p: "What one deed can I keep small and daily?", src: "Ḥadīth theme · verify on Sunnah.com · educational" }
  ];
  var smIdx = 0;
  try {
    smIdx = parseInt(localStorage.getItem("clarity.seerahMirror.idx") || "0", 10) || 0;
  } catch (e) {}
  function renderMirror() {
    smIdx = ((smIdx % MIRROR.length) + MIRROR.length) % MIRROR.length;
    var row = MIRROR[smIdx];
    var lab = $("sm-step-label");
    var title = $("sm-title");
    var moment = $("sm-moment");
    var src = $("sm-src");
    var prompt = $("sm-prompt");
    var fill = $("sm-prog-fill");
    var prog = $("sm-progress-text");
    if (lab) lab.textContent = "Step " + (smIdx + 1) + " of " + MIRROR.length;
    if (title) title.textContent = row.t;
    if (moment) moment.textContent = row.m;
    if (src) src.textContent = row.src;
    if (prompt) prompt.textContent = row.p;
    if (fill) fill.style.width = ((smIdx + 1) / MIRROR.length) * 100 + "%";
    if (prog) prog.textContent = smIdx + 1 + " / " + MIRROR.length;
  }
  w.claritySeerahMirrorNext = function () {
    smIdx = (smIdx + 1) % MIRROR.length;
    try {
      localStorage.setItem("clarity.seerahMirror.idx", String(smIdx));
    } catch (e) {}
    renderMirror();
  };
  w.claritySeerahMirrorDone = function () {
    try {
      localStorage.setItem("clarity.seerahMirror.done." + smIdx, "1");
    } catch (e) {}
    w.claritySeerahMirrorNext();
  };
  w.claritySeerahMirrorNote = function () {
    if (typeof w.notesQuickFromSection === "function") {
      w.notesQuickFromSection("Seerah", "Mirror: " + (MIRROR[smIdx] && MIRROR[smIdx].t));
    }
  };

  /* —— Daily tajweed —— */
  var TJ = [
    { t: "Ikhfāʾ", b: "When nūn sākinah or tanwīn meets the ikhfāʾ letters, conceal the nūn with ghunnah. Practice slowly with a teacher." },
    { t: "Idghām", b: "Merge nūn sākinah/tanwīn into ي ن م و (with ghunnah) or ل ر (without) as rules apply." },
    { t: "Iẓhār", b: "Clear nūn when followed by throat letters. Do not hide or merge." },
    { t: "Qalqalah", b: "Echo on ق ط ب ج د when sākin. Lighter in middle, fuller at stop." },
    { t: "Madd ṭabīʿī", b: "Natural stretch two counts on letters of madd when not blocked." },
    { t: "Ghunnah", b: "Nasal sound on م and ن mushaddad — two counts." }
  ];
  var tjIdx = Math.floor(Date.now() / 86400000) % TJ.length;
  w.clarityLiveTajweed = function (next) {
    if (next) tjIdx = (tjIdx + 1) % TJ.length;
    var t = $("tajweed-live-title");
    var b = $("tajweed-live-body");
    var s = $("tajweed-live-src");
    if (t) t.textContent = TJ[tjIdx].t;
    if (b) b.textContent = TJ[tjIdx].b;
    if (s)
      s.innerHTML =
        'Educational Hafs ʿan ʿĀṣim note · practice with a teacher · <a href="/craft/tajweed/">Craft atelier</a>';
  };

  /* —— Ḥifẓ helper —— */
  var hifz = { s: 1, a: 1 };
  function hifzRender(row) {
    var ar = $("hifz-arabic");
    var tr = $("hifz-translation");
    var disp = $("hifz-display");
    if (ar) ar.textContent = row.ar || "";
    if (tr) tr.textContent = row.en || "";
    if (disp) disp.textContent = "Qur’an " + row.s + ":" + row.a;
  }
  function hifzLoad() {
    var sEl = $("hifz-surah");
    var aEl = $("hifz-ayah-num");
    var s = parseInt((sEl && sEl.value) || hifz.s, 10) || 1;
    var a = parseInt((aEl && aEl.value) || hifz.a, 10) || 1;
    hifz.s = s;
    hifz.a = a;
    fetch("https://api.alquran.cloud/v1/ayah/" + s + ":" + a + "/editions/quran-uthmani,en.sahih")
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        var eds = (j && j.data) || [];
        hifzRender({
          s: s,
          a: a,
          ar: (eds[0] && eds[0].text) || "",
          en: (eds[1] && eds[1].text) || ""
        });
      })
      .catch(function () {
        log("hifz-fail");
      });
  }
  w.nextHifzAyah = function () {
    hifz.a += 1;
    var aEl = $("hifz-ayah-num");
    if (aEl) aEl.value = String(hifz.a);
    hifzLoad();
  };
  w.playHifzAudio = function () {
    try {
      var a = d.createElement("audio");
      a.src =
        "https://cdn.islamic.network/quran/audio/128/ar.alafasy/" + hifz.s + "/" + hifz.a + ".mp3";
      a.play();
    } catch (e) {}
  };
  w.markMemorized = function () {
    try {
      var k = "clarity.hifz." + hifz.s + "." + hifz.a;
      localStorage.setItem(k, "1");
      var c = $("hifz-today-count");
      if (c) c.textContent = String((parseInt(c.textContent, 10) || 0) + 1);
    } catch (e) {}
  };
  w.toggleRecall = function () {
    var tr = $("hifz-translation");
    if (tr) tr.style.visibility = tr.style.visibility === "hidden" ? "visible" : "hidden";
  };
  w.loadHifz = hifzLoad;

  var prevRefresh = w.clarityRefreshSection;
  w.clarityRefreshSection = function (sec) {
    if (sec === "tajweed") {
      w.clarityLiveTajweed(true);
      return;
    }
    if (typeof prevRefresh === "function") {
      try {
        return prevRefresh.apply(this, arguments);
      } catch (e) {}
    }
  };

  function bootAction() {
    var nusk = $("hajj-nusk");
    if (nusk) {
      nusk.value = hajjState.nusk || "tamattu";
    }
    var cn = $("hajj-check-nusk");
    if (cn) cn.value = hajjState.nusk || "tamattu";
    hajjFillSelect();
    w.hajjShowStep(hajjState.step || 0);
    w.hajjChecklistRender();
    talbiyahShow();
    renderMirror();
    w.clarityLiveTajweed(false);
    hifzLoad();
    log("g10-boot");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bootAction);
  else bootAction();
})(window, document);
