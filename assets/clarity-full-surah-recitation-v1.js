
(function(){
  "use strict";
  if (window.__CLARITY_SURAH_REC__) return;
  window.__CLARITY_SURAH_REC__ = true;

  var SURAHS = [
    {n:1,en:"Al-Fatihah",ar:"الفاتحة"},{n:2,en:"Al-Baqarah",ar:"البقرة"},{n:3,en:"Ali 'Imran",ar:"آل عمران"},
    {n:4,en:"An-Nisa",ar:"النساء"},{n:5,en:"Al-Ma'idah",ar:"المائدة"},{n:6,en:"Al-An'am",ar:"الأنعام"},
    {n:7,en:"Al-A'raf",ar:"الأعراف"},{n:8,en:"Al-Anfal",ar:"الأنفال"},{n:9,en:"At-Tawbah",ar:"التوبة"},
    {n:10,en:"Yunus",ar:"يونس"},{n:11,en:"Hud",ar:"هود"},{n:12,en:"Yusuf",ar:"يوسف"},
    {n:13,en:"Ar-Ra'd",ar:"الرعد"},{n:14,en:"Ibrahim",ar:"إبراهيم"},{n:15,en:"Al-Hijr",ar:"الحجر"},
    {n:16,en:"An-Nahl",ar:"النحل"},{n:17,en:"Al-Isra",ar:"الإسراء"},{n:18,en:"Al-Kahf",ar:"الكهف"},
    {n:19,en:"Maryam",ar:"مريم"},{n:20,en:"Taha",ar:"طه"},{n:21,en:"Al-Anbiya",ar:"الأنبياء"},
    {n:22,en:"Al-Hajj",ar:"الحج"},{n:23,en:"Al-Mu'minun",ar:"المؤمنون"},{n:24,en:"An-Nur",ar:"النور"},
    {n:25,en:"Al-Furqan",ar:"الفرقان"},{n:26,en:"Ash-Shu'ara",ar:"الشعراء"},{n:27,en:"An-Naml",ar:"النمل"},
    {n:28,en:"Al-Qasas",ar:"القصص"},{n:29,en:"Al-'Ankabut",ar:"العنكبوت"},{n:30,en:"Ar-Rum",ar:"الروم"},
    {n:31,en:"Luqman",ar:"لقمان"},{n:32,en:"As-Sajdah",ar:"السجدة"},{n:33,en:"Al-Ahzab",ar:"الأحزاب"},
    {n:34,en:"Saba",ar:"سبأ"},{n:35,en:"Fatir",ar:"فاطر"},{n:36,en:"Ya-Sin",ar:"يس"},
    {n:37,en:"As-Saffat",ar:"الصافات"},{n:38,en:"Sad",ar:"ص"},{n:39,en:"Az-Zumar",ar:"الزمر"},
    {n:40,en:"Ghafir",ar:"غافر"},{n:41,en:"Fussilat",ar:"فصلت"},{n:42,en:"Ash-Shura",ar:"الشورى"},
    {n:43,en:"Az-Zukhruf",ar:"الزخرف"},{n:44,en:"Ad-Dukhan",ar:"الدخان"},{n:45,en:"Al-Jathiyah",ar:"الجاثية"},
    {n:46,en:"Al-Ahqaf",ar:"الأحقاف"},{n:47,en:"Muhammad",ar:"محمد"},{n:48,en:"Al-Fath",ar:"الفتح"},
    {n:49,en:"Al-Hujurat",ar:"الحجرات"},{n:50,en:"Qaf",ar:"ق"},{n:51,en:"Adh-Dhariyat",ar:"الذاريات"},
    {n:52,en:"At-Tur",ar:"الطور"},{n:53,en:"An-Najm",ar:"النجم"},{n:54,en:"Al-Qamar",ar:"القمر"},
    {n:55,en:"Ar-Rahman",ar:"الرحمن"},{n:56,en:"Al-Waqi'ah",ar:"الواقعة"},{n:57,en:"Al-Hadid",ar:"الحديد"},
    {n:58,en:"Al-Mujadila",ar:"المجادلة"},{n:59,en:"Al-Hashr",ar:"الحشر"},{n:60,en:"Al-Mumtahanah",ar:"الممتحنة"},
    {n:61,en:"As-Saff",ar:"الصف"},{n:62,en:"Al-Jumu'ah",ar:"الجمعة"},{n:63,en:"Al-Munafiqun",ar:"المنافقون"},
    {n:64,en:"At-Taghabun",ar:"التغابن"},{n:65,en:"At-Talaq",ar:"الطلاق"},{n:66,en:"At-Tahrim",ar:"التحريم"},
    {n:67,en:"Al-Mulk",ar:"الملك"},{n:68,en:"Al-Qalam",ar:"القلم"},{n:69,en:"Al-Haqqah",ar:"الحاقة"},
    {n:70,en:"Al-Ma'arij",ar:"المعارج"},{n:71,en:"Nuh",ar:"نوح"},{n:72,en:"Al-Jinn",ar:"الجن"},
    {n:73,en:"Al-Muzzammil",ar:"المزمل"},{n:74,en:"Al-Muddaththir",ar:"المدثر"},{n:75,en:"Al-Qiyamah",ar:"القيامة"},
    {n:76,en:"Al-Insan",ar:"الإنسان"},{n:77,en:"Al-Mursalat",ar:"المرسلات"},{n:78,en:"An-Naba",ar:"النبأ"},
    {n:79,en:"An-Nazi'at",ar:"النازعات"},{n:80,en:"'Abasa",ar:"عبس"},{n:81,en:"At-Takwir",ar:"التكوير"},
    {n:82,en:"Al-Infitar",ar:"الانفطار"},{n:83,en:"Al-Mutaffifin",ar:"المطففين"},{n:84,en:"Al-Inshiqaq",ar:"الانشقاق"},
    {n:85,en:"Al-Buruj",ar:"البروج"},{n:86,en:"At-Tariq",ar:"الطارق"},{n:87,en:"Al-A'la",ar:"الأعلى"},
    {n:88,en:"Al-Ghashiyah",ar:"الغاشية"},{n:89,en:"Al-Fajr",ar:"الفجر"},{n:90,en:"Al-Balad",ar:"البلد"},
    {n:91,en:"Ash-Shams",ar:"الشمس"},{n:92,en:"Al-Layl",ar:"الليل"},{n:93,en:"Ad-Duha",ar:"الضحى"},
    {n:94,en:"Ash-Sharh",ar:"الشرح"},{n:95,en:"At-Tin",ar:"التين"},{n:96,en:"Al-'Alaq",ar:"العلق"},
    {n:97,en:"Al-Qadr",ar:"القدر"},{n:98,en:"Al-Bayyinah",ar:"البينة"},{n:99,en:"Az-Zalzalah",ar:"الزلزلة"},
    {n:100,en:"Al-'Adiyat",ar:"العاديات"},{n:101,en:"Al-Qari'ah",ar:"القارعة"},{n:102,en:"At-Takathur",ar:"التكاثر"},
    {n:103,en:"Al-'Asr",ar:"العصر"},{n:104,en:"Al-Humazah",ar:"الهمزة"},{n:105,en:"Al-Fil",ar:"الفيل"},
    {n:106,en:"Quraysh",ar:"قريش"},{n:107,en:"Al-Ma'un",ar:"الماعون"},{n:108,en:"Al-Kawthar",ar:"الكوثر"},
    {n:109,en:"Al-Kafirun",ar:"الكافرون"},{n:110,en:"An-Nasr",ar:"النصر"},{n:111,en:"Al-Masad",ar:"المسد"},
    {n:112,en:"Al-Ikhlas",ar:"الإخلاص"},{n:113,en:"Al-Falaq",ar:"الفلق"},{n:114,en:"An-Nas",ar:"الناس"}
  ];
  var SERVERS = {
    afs:"https://server8.mp3quran.net/afs/",
    basit:"https://server7.mp3quran.net/basit/",
    sds:"https://server11.mp3quran.net/sds/",
    maher:"https://server12.mp3quran.net/maher/",
    ajm:"https://server10.mp3quran.net/ajm/",
    ghamdi:"https://server7.mp3quran.net/s_gmd/",
    husary:"https://server13.mp3quran.net/husr/",
    minshawi:"https://server10.mp3quran.net/minsh/",
    shatri:"https://server11.mp3quran.net/shatri/",
    yasser:"https://server11.mp3quran.net/yasser/"
  };
  var RECITER_KEYS = Object.keys(SERVERS);
  var currentReciter = "afs";
  var currentSurah = null;

  function pad3(n){ return String(n).padStart(3,"0"); }

  function fillDropdown(){
    var sel = document.getElementById("surah-list-pill");
    if (!sel || sel.options.length > 2) return;
    sel.innerHTML = '<option value="">📖 Surahs…</option>' +
      SURAHS.map(function(s){
        return '<option value="'+s.n+'">'+s.n+'. '+s.en+' · '+s.ar+'</option>';
      }).join("");
  }

  function ensureMiniPlayer(){
    var el = document.getElementById("clarity-surah-mini");
    if (el) return el;
    el = document.createElement("div");
    el.id = "clarity-surah-mini";
    el.style.cssText = "display:none;position:sticky;top:0;z-index:1200;background:rgba(13,79,60,0.96);color:#fff;padding:0.4rem 0.75rem;font-size:0.8rem;align-items:center;gap:0.5rem;flex-wrap:wrap;justify-content:center;border-bottom:2px solid rgba(212,180,90,0.45)";
    el.innerHTML = '<span id="clarity-surah-mini-label"></span><audio id="clarity-surah-audio" controls preload="none" style="height:1.8rem;max-width:220px"></audio><button type="button" onclick="clarityStopSurah()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:8px;padding:0.25rem 0.55rem;cursor:pointer;font-size:0.75rem">⏹</button>';
    var duo = document.getElementById("clarity-top-duo");
    if (duo && duo.parentNode) duo.parentNode.insertBefore(el, duo.nextSibling);
    else document.body.insertBefore(el, document.body.firstChild);
    return el;
  }

  window.claritySetReciter = function(key){
    if (SERVERS[key]) currentReciter = key;
    if (currentSurah) clarityPlaySurah(currentSurah);
  };

  window.clarityPlaySurahFromSelect = function(sel){
    var n = parseInt(sel && sel.value, 10);
    if (!n) return;
    clarityPlaySurah(n);
  };

  window.clarityPlaySurah = function(num){
    var s = SURAHS.find(function(x){ return x.n === num; });
    if (!s) return;
    currentSurah = num;
    var rsel = document.getElementById("surah-reciter-pill");
    if (rsel && rsel.value && SERVERS[rsel.value]) currentReciter = rsel.value;
    ensureMiniPlayer();
    var audio = document.getElementById("clarity-surah-audio");
    var mini = document.getElementById("clarity-surah-mini");
    var label = document.getElementById("clarity-surah-mini-label");
    if (!audio) return;
    var base = SERVERS[currentReciter] || SERVERS.afs;
    audio.src = base + pad3(num) + ".mp3";
    try {
      var vol = document.getElementById("volume-slider");
      if (vol) audio.volume = parseFloat(vol.value) || 0.85;
    } catch(e){}
    audio.play().catch(function(){});
    if (mini) mini.style.display = "flex";
    var rname = (rsel && rsel.selectedOptions[0]) ? rsel.selectedOptions[0].text : currentReciter;
    if (label) label.textContent = s.n + ". " + s.en + " · " + rname;
    var sel = document.getElementById("surah-list-pill");
    if (sel) sel.value = String(num);
  };

  window.clarityStopSurah = function(){
    var audio = document.getElementById("clarity-surah-audio");
    if (audio){ audio.pause(); audio.removeAttribute("src"); }
    var mini = document.getElementById("clarity-surah-mini");
    if (mini) mini.style.display = "none";
    var sel = document.getElementById("surah-list-pill");
    if (sel) sel.value = "";
    currentSurah = null;
  };

  window.claritySurpriseSurahReciter = function(){
    var rk = RECITER_KEYS[Math.floor(Math.random() * RECITER_KEYS.length)];
    var rsel = document.getElementById("surah-reciter-pill");
    if (rsel) rsel.value = rk;
    currentReciter = rk;
    clarityPlaySurah(Math.floor(Math.random() * 114) + 1);
  };
  window.claritySurpriseSurah = window.claritySurpriseSurahReciter;
  window.clarityOpenSurahPanel = function(){
    var sel = document.getElementById("surah-list-pill");
    if (sel) sel.focus();
  };
  window.clarityCloseSurahPanel = function(){};
  window.clarityFilterSurahs = function(){};
  window.clarityOnReciterChange = function(){};

  function boot(){ fillDropdown(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
