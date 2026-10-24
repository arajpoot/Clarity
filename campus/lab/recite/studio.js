/**
 * Recite studio · 20261017TQ
 * 114 sūrahs via CuVersePractice · Hear · hide/show · link to Tajweed LMR
 */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  var hidden = false;
  var last = null;
  function boot() {
    var VP = window.CuVersePractice;
    if (!VP) {
      if ($("recite-status")) $("recite-status").textContent = "Verse helper missing.";
      return;
    }
    VP.fillSurahSelect($("recite-surah"));
    function load(s, a) {
      if ($("recite-status")) $("recite-status").textContent = "Loading…";
      VP.fetchAyah(s, a).then(function (p) {
        last = p;
        if ($("recite-ar")) { $("recite-ar").textContent = p.ar; $("recite-ar").style.visibility = "visible"; }
        if ($("recite-en")) { $("recite-en").textContent = p.en; $("recite-en").style.visibility = "visible"; }
        if ($("recite-meta")) $("recite-meta").textContent = "Qurʾān " + p.surah + ":" + p.ayah;
        if ($("recite-ayah")) $("recite-ayah").value = p.ayah;
        var tj = $("recite-to-tj");
        if (tj) tj.href = "/campus/lab/tajweed/?surah=" + p.surah + "&ayah=" + p.ayah;
        if ($("recite-status"))
          $("recite-status").textContent = p.offline ? "Offline — audio URL may still work" : "Ready · educational practice";
        hidden = false;
      });
    }
    $("recite-pull") && ($("recite-pull").onclick = function () {
      load(($("recite-surah") && $("recite-surah").value) || 1, ($("recite-ayah") && $("recite-ayah").value) || 1);
    });
    $("recite-hear") && ($("recite-hear").onclick = function () {
      if (!last) return;
      VP.playAudio(last.audio || VP.audioUrl(last.surah, last.ayah));
    });
    $("recite-hide") && ($("recite-hide").onclick = function () {
      hidden = true;
      if ($("recite-ar")) $("recite-ar").style.visibility = "hidden";
      if ($("recite-en")) $("recite-en").style.visibility = "hidden";
    });
    $("recite-show") && ($("recite-show").onclick = function () {
      hidden = false;
      if ($("recite-ar")) $("recite-ar").style.visibility = "visible";
      if ($("recite-en")) $("recite-en").style.visibility = "visible";
    });
    $("recite-speak-en") && ($("recite-speak-en").onclick = function () {
      if (last && last.en) VP.speakEn(last.en);
    });
    load(1, 1);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
