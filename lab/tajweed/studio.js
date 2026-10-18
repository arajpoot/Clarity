/**
 * Tajweed surface bridge · 20261017TQ
 * Wires rule chips + verse pull using CuVersePractice; loads LMR if present
 */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function boot() {
    var VP = window.CuVersePractice;
    if (VP) {
      VP.fillSurahSelect($("tj-lmr-surah"));
    }
    function load(s, a) {
      if (!VP) return;
      $("tj-lmr-status") && ($("tj-lmr-status").textContent = "Loading…");
      VP.fetchAyah(s, a).then(function (p) {
        if ($("tj-lmr-ar")) $("tj-lmr-ar").textContent = p.ar;
        if ($("tj-lmr-en")) $("tj-lmr-en").textContent = p.en;
        if ($("tj-lmr-ayah")) $("tj-lmr-ayah").value = p.ayah;
        if ($("tj-lmr-surah")) $("tj-lmr-surah").value = String(p.surah);
        var link = $("tj-lmr-quran-link");
        if (link) link.href = "https://quran.com/" + p.surah + "/" + p.ayah;
        if ($("tj-lmr-status"))
          $("tj-lmr-status").textContent = p.offline ? "Offline fallback" : ("Qurʾān " + p.surah + ":" + p.ayah);
      });
    }
    var pull = $("tj-lmr-pull");
    if (pull) pull.onclick = function () {
      load(($("tj-lmr-surah") && $("tj-lmr-surah").value) || 1, ($("tj-lmr-ayah") && $("tj-lmr-ayah").value) || 1);
    };
    var play = $("tj-lmr-play-master");
    if (play) play.onclick = function () {
      var s = ($("tj-lmr-surah") && $("tj-lmr-surah").value) || 1;
      var a = ($("tj-lmr-ayah") && $("tj-lmr-ayah").value) || 1;
      if (VP) VP.playAudio(VP.audioUrl(s, a));
    };
    var listen = $("tj-lmr-listen");
    if (listen) listen.onclick = function () {
      var s = ($("tj-lmr-surah") && $("tj-lmr-surah").value) || 1;
      var a = ($("tj-lmr-ayah") && $("tj-lmr-ayah").value) || 1;
      if (VP) VP.playAudio(VP.audioUrl(s, a));
    };
    document.querySelectorAll("[data-lab-load]").forEach(function (b) {
      b.onclick = function () {
        var parts = (b.getAttribute("data-lab-load") || "1:1").split(":");
        load(parts[0], parts[1]);
      };
    });
    // initial
    load(1, 1);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
