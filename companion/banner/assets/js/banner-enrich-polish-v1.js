/*! banner-enrich-polish-v1.2 · pills + surah fill + tight height · educational only */
(function (w, d) {
  "use strict";
  if (w.__BANNER_ENRICH_POLISH_V12__) return;
  w.__BANNER_ENRICH_POLISH_V12__ = true;

  var SURAH = [
    "Al-Fatihah","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
    "Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
    "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
    "Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
    "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
    "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
    "As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
    "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa",
    "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
    "Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
    "Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
    "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
  ];

  function fillSurahs() {
    var sel = d.getElementById("surah-list-pill");
    if (!sel || sel.options.length > 20) return;
    var html = '<option value="">📖 Surahs…</option>';
    for (var i = 0; i < 114; i++) {
      html += '<option value="' + (i + 1) + '">' + (i + 1) + ". " + SURAH[i] + "</option>";
    }
    sel.innerHTML = html;
  }

  function syncPlaceFromYt() {
    var yt = d.getElementById("yt-live-select");
    var place = d.getElementById("live-place-select");
    if (!yt || !place) return;
    function apply() {
      var v = String(yt.value || "");
      place.value = /makkah/i.test(v) ? "makkah" : "madinah";
    }
    yt.addEventListener("change", apply);
    apply();
  }

  function postHeight() {
    try {
      var ban = d.querySelector(".banner") || d.body;
      var h = Math.ceil((ban && ban.getBoundingClientRect().height) || d.documentElement.scrollHeight || 0);
      if (h > 60 && w.parent && w.parent !== w) {
        w.parent.postMessage({ type: "clarity-banner-height", height: Math.min(h + 8, 520) }, "*");
      }
    } catch (e) {}
  }

  function boot() {
    fillSurahs();
    syncPlaceFromYt();
    postHeight();
    d.documentElement.setAttribute("data-banner-enrich", "20261112E2");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 80);
    setTimeout(postHeight, 300);
    setTimeout(postHeight, 900);
  });
  setInterval(postHeight, 2500);
})(window, document);
