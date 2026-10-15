/* Recitation lab v2 — fetch āyah, continue tiles, assessment, Tajweed link */
(function (g) {
  "use strict";
  if (g.__CU_LAB_RECITE_V2__) return;
  g.__CU_LAB_RECITE_V2__ = true;

  var KEY = "clarity_recite_progress_v1";
  var UNITS = [
    { id: "1:1", sura: 1, ayah: 1, title: "Al-Fātiḥah 1" },
    { id: "1:2", sura: 1, ayah: 2, title: "Al-Fātiḥah 2" },
    { id: "112:1", sura: 112, ayah: 1, title: "Al-Ikhlāṣ 1" },
    { id: "112:2", sura: 112, ayah: 2, title: "Al-Ikhlāṣ 2" },
    { id: "103:1", sura: 103, ayah: 1, title: "Al-ʿAṣr 1" },
    { id: "103:2", sura: 103, ayah: 2, title: "Al-ʿAṣr 2" }
  ];

  var FALLBACK = {
    "1:1": { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    "1:2": { ar: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", en: "All praise is for Allah — Lord of all worlds." },
    "112:1": { ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", en: "Say: He is Allah, One." },
    "112:2": { ar: "ٱللَّهُ ٱلصَّمَدُ", en: "Allah, the Self-Sufficient." },
    "103:1": { ar: "وَٱلْعَصْرِ", en: "By time." },
    "103:2": { ar: "إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ", en: "Indeed, mankind is in loss." }
  };

  var idx = 0;
  var step = "listen";
  var cache = {};

  function $(id) {
    return document.getElementById(id);
  }

  function progress() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function markDone(id) {
    var p = progress();
    p[id] = Date.now();
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
      localStorage.setItem("clarity_lab_last_v1", String(Date.now()));
    } catch (e) {}
  }

  function unit() {
    return UNITS[idx];
  }

  function fetchAyah(sura, ayah) {
    var key = sura + ":" + ayah;
    if (cache[key]) return Promise.resolve(cache[key]);
    var url =
      "https://api.alquran.cloud/v1/ayah/" +
      sura +
      ":" +
      ayah +
      "/editions/quran-uthmani,en.sahih";
    return fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var ar = "",
          en = "";
        try {
          var arr = data.data;
          if (Array.isArray(arr)) {
            ar = arr[0].text;
            en = arr[1].text;
          } else {
            ar = data.data.text;
          }
        } catch (e) {}
        var row = { ar: ar || FALLBACK[key].ar, en: en || FALLBACK[key].en };
        cache[key] = row;
        return row;
      })
      .catch(function () {
        return FALLBACK[key] || { ar: "…", en: "Offline — using local text." };
      });
  }

  function renderTiles() {
    var box = $("rc-tiles");
    if (!box) return;
    box.innerHTML = "";
    var p = progress();
    UNITS.forEach(function (u, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "rc-tile" + (i === idx ? " here" : "") + (p[u.id] ? " done" : "");
      b.textContent = (p[u.id] ? "✓ " : "") + u.title;
      b.addEventListener("click", function () {
        idx = i;
        step = "listen";
        loadUnit();
      });
      box.appendChild(b);
    });
  }

  function loadUnit() {
    var u = unit();
    renderTiles();
    $("rc-title").textContent = u.title;
    $("rc-status").textContent = "Loading…";
    fetchAyah(u.sura, u.ayah).then(function (row) {
      $("rc-ar").textContent = row.ar;
      $("rc-en").textContent = row.en;
      $("rc-status").textContent = "";
      showStep();
    });
  }

  function showStep() {
    $("rc-step").textContent =
      step === "listen"
        ? "Step 1 · Listen"
        : step === "read"
          ? "Step 2 · Read along"
          : step === "check"
            ? "Step 3 · Self-check"
            : step === "quiz"
              ? "Step 4 · Assessment"
              : "Step";
    $("rc-quiz").hidden = step !== "quiz";
    $("rc-actions").hidden = step === "quiz";
    if (step === "quiz") buildQuiz();
  }

  function buildQuiz() {
    var u = unit();
    var row = cache[u.sura + ":" + u.ayah] || FALLBACK[u.id];
    $("rc-q").textContent = "Which translation matches this āyah?";
    var opts = [row.en];
    UNITS.forEach(function (x) {
      var f = FALLBACK[x.id];
      if (f && f.en !== row.en && opts.length < 3) opts.push(f.en);
    });
    var box = $("rc-options");
    box.innerHTML = "";
    opts.sort(function () {
      return Math.random() - 0.5;
    }).forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = opt;
      b.addEventListener("click", function () {
        if (opt === row.en) {
          b.classList.add("ok");
          $("rc-status").textContent = "Correct — mark complete and continue.";
          markDone(u.id);
          renderTiles();
        } else {
          b.classList.add("bad");
          $("rc-status").textContent = "Not that — listen once more.";
        }
      });
      box.appendChild(b);
    });
  }

  function speak() {
    var u = unit();
    if (g.ClarityLabAV) g.ClarityLabAV.playMaster(u.sura, u.ayah);
    else if (g.speechSynthesis) {
      var ut = new SpeechSynthesisUtterance($("rc-ar").textContent);
      ut.lang = "ar-SA";
      g.speechSynthesis.speak(ut);
    }
  }

  function nextStep() {
    if (step === "listen") step = "read";
    else if (step === "read") step = "check";
    else if (step === "check") step = "quiz";
    else {
      idx = Math.min(idx + 1, UNITS.length - 1);
      step = "listen";
      loadUnit();
      return;
    }
    showStep();
  }

  function boot() {
    if ($("rc-hear")) $("rc-hear").onclick = speak;
    if ($("rc-next")) $("rc-next").onclick = nextStep;
    if ($("rc-continue")) {
      $("rc-continue").onclick = function () {
        markDone(unit().id);
        idx = Math.min(idx + 1, UNITS.length - 1);
        step = "listen";
        loadUnit();
      };
    }
    loadUnit();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
