(function (g) {
  "use strict";
  if (g.__CU_LAB_HIFZ_V1__) return;
  g.__CU_LAB_HIFZ_V1__ = true;
  var BANK = {
    "1:1": { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    "1:2": { ar: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", en: "All praise is for Allah — Lord of all worlds." },
    "112:1": { ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", en: "Say: He is Allah, One." },
    "112:2": { ar: "ٱللَّهُ ٱلصَّمَدُ", en: "Allah, the Self-Sufficient." },
    "103:1": { ar: "وَٱلْعَصْرِ", en: "By time." }
  };
  var cur = "1:1";
  function $(id) { return document.getElementById(id); }
  function show(ref) {
    cur = ref;
    var row = BANK[ref] || BANK["1:1"];
    if ($("hifz-ar")) {
      $("hifz-ar").textContent = row.ar;
      $("hifz-ar").style.visibility = "visible";
    }
    if ($("hifz-en")) {
      $("hifz-en").textContent = row.en;
      $("hifz-en").style.visibility = "visible";
    }
    if ($("hifz-meta")) $("hifz-meta").textContent = "Qurʾān " + ref;
    if ($("hifz-status")) $("hifz-status").textContent = "";
  }
  function boot() {
    document.querySelectorAll("[data-hifz]").forEach(function (b) {
      b.addEventListener("click", function () {
        show(b.getAttribute("data-hifz"));
      });
    });
    if ($("hifz-hear")) {
      $("hifz-hear").onclick = function () {
        var m = cur.match(/(\d+):(\d+)/);
        if (m && g.ClarityLabAV) g.ClarityLabAV.playMaster(+m[1], +m[2]);
      };
    }
    if ($("hifz-hide")) {
      $("hifz-hide").onclick = function () {
        if ($("hifz-ar")) $("hifz-ar").style.visibility = "hidden";
        if ($("hifz-en")) $("hifz-en").style.visibility = "hidden";
        if ($("hifz-status")) $("hifz-status").textContent = "Hidden — recite from memory, then Show.";
      };
    }
    if ($("hifz-show")) {
      $("hifz-show").onclick = function () {
        if ($("hifz-ar")) $("hifz-ar").style.visibility = "visible";
        if ($("hifz-en")) $("hifz-en").style.visibility = "visible";
      };
    }
    if ($("hifz-mark")) {
      $("hifz-mark").onclick = function () {
        try {
          localStorage.setItem("clarity_hifz_last_v1", cur + "|" + Date.now());
          localStorage.setItem("clarity_lab_last_v1", String(Date.now()));
        } catch (e) {}
        if ($("hifz-status")) $("hifz-status").textContent = "Practiced on this device · " + cur;
      };
    }
    show("1:1");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
