/*! banner enrich restore · Rabbana + AV + city + countdown · Bismillah */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_ENRICH_V2__) return;
  w.__CLARITY_BANNER_ENRICH_V2__ = true;

  var KEY = "clarity_salah_location_v1";
  var lastT = null, timer = null, ri = 0;

  /* Short Rabbana set — educational; full cycle on companion content pages */
  var RABBANA = [
    { ar: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ", en: "Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing.", ref: "Qurʾān 2:127" },
    { ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", en: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", ref: "Qurʾān 2:201" },
    { ar: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا", en: "Our Lord, do not impose blame upon us if we have forgotten or erred.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا", en: "Our Lord, lay not upon us a burden like that which You laid upon those before us.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ", en: "Our Lord, burden us not with that which we have no ability to bear.", ref: "Qurʾān 2:286" },
    { ar: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ", en: "Our Lord, pour upon us patience and let us die as Muslims.", ref: "Qurʾān 7:126" },
    { ar: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ", en: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", ref: "Qurʾān 7:23" },
    { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", en: "Our Lord, grant us from our spouses and offspring comfort to our eyes, and make us a leader for the righteous.", ref: "Qurʾān 25:74" }
  ];

  function $(id) { return d.getElementById(id); }

  function showRabbana() {
    var item = RABBANA[ri % RABBANA.length];
    var ar = $("rabbana-arabic"), en = $("rabbana-english"), ref = $("rabbana-ref"), c = $("rabbana-count");
    if (ar) ar.textContent = item.ar;
    if (en) en.textContent = item.en;
    if (ref) ref.textContent = item.ref;
    if (c) c.textContent = (ri % RABBANA.length) + 1 + " / " + RABBANA.length;
  }
  w.cycleRabbana = function (dir) {
    ri = (ri + (dir || 1) + RABBANA.length * 10) % RABBANA.length;
    showRabbana();
  };

  function fillSurahs() {
    var sel = $("surah-list-pill");
    if (!sel || sel.options.length > 5) return;
    sel.innerHTML = '<option value="">Surahs…</option>';
    var names = [
      [1,"Al-Fātiḥah"],[2,"Al-Baqarah"],[3,"Āl ʿImrān"],[18,"Al-Kahf"],[19,"Maryam"],
      [32,"As-Sajdah"],[36,"Yā-Sīn"],[55,"Ar-Raḥmān"],[56,"Al-Wāqiʿah"],[67,"Al-Mulk"],
      [78,"An-Nabaʾ"],[112,"Al-Ikhlāṣ"],[113,"Al-Falaq"],[114,"An-Nās"]
    ];
    names.forEach(function (p) {
      var o = d.createElement("option");
      o.value = String(p[0]);
      o.textContent = p[0] + " " + p[1];
      sel.appendChild(o);
    });
  }

  function vague(s) {
    s = (s || "").trim();
    return !s || /^near you$/i.test(s) || /^-?\d+(\.\d+)?\s*°/.test(s) ||
      /locating|saved location/i.test(s) || /^madinah$/i.test(s) && !readLoc();
  }
  /* Don't treat real city Madinah as vague when user is actually there — only when it's owner fallback without save */

  function setCity(label) {
    var el = $("hijri-local-loc");
    if (!el) return;
    var t = (label || "").trim();
    if (!t || /^near you$/i.test(t) || /^-?\d+(\.\d+)?\s*°/.test(t) || /locating/i.test(t)) {
      el.textContent = "Locating…";
      return;
    }
    if (/^saved location$/i.test(t)) {
      el.textContent = "Tap Update location";
      return;
    }
    el.textContent = t;
  }

  function parseHM(s) {
    if (!s) return null;
    s = String(s).replace(/[ap]m/i, "").trim().split(" ")[0];
    var p = s.split(":");
    if (p.length < 2) return null;
    var h = parseInt(p[0], 10), m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return { h: h, m: m };
  }

  function tick() {
    var box = $("clarity-next-prayer");
    if (!box || !lastT) return;
    var order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date(), nextN = null, nextD = null;
    for (var i = 0; i < order.length; i++) {
      var hm = parseHM(lastT[order[i]]);
      if (!hm) continue;
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hm.h, hm.m, 0, 0);
      if (dt > now) { nextN = order[i]; nextD = dt; break; }
    }
    if (!nextN) {
      var f = parseHM(lastT.Fajr);
      if (f) {
        nextN = "Fajr";
        nextD = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, f.h, f.m, 0, 0);
      }
    }
    if (!nextN || !nextD) return;
    var ms = Math.max(0, nextD - now);
    var totalMin = Math.floor(ms / 60000);
    var hh = Math.floor(totalMin / 60), mm = totalMin % 60, ss = Math.floor((ms % 60000) / 1000);
    var name = box.querySelector(".np-name"), count = box.querySelector(".np-count");
    if (name) name.textContent = nextN;
    if (count) count.textContent = (hh ? hh + "h " : "") + mm + "m" + (hh ? "" : " " + ss + "s");
  }

  function renderTimes(t, label) {
    lastT = t;
    var list = $("salah-times-list");
    if (list && t) {
      list.innerHTML = ["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha"].map(function (n) {
        var val = (t[n] || "—").toString().split(" ")[0];
        return '<li class="salah-row"><span class="salah-name">' + n + '</span><span class="salah-time">' + val + "</span></li>";
      }).join("");
    }
    if (label) setCity(label);
    if (!timer) timer = setInterval(tick, 1000);
    tick();
  }

  function reverse(lat, lon) {
    return fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + lat +
        "&longitude=" + lon + "&localityLanguage=en",
      { credentials: "omit" }
    )
      .then(function (r) { return r.json(); })
      .then(function (j) {
        return (j && (j.city || j.locality || j.principalSubdivision)) || "";
      })
      .catch(function () { return ""; });
  }

  function saveLoc(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function readLoc() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && typeof o.lat === "number") return o;
    } catch (e) {}
    return null;
  }

  function fetchTimes(lat, lon, label) {
    return fetch(
      "https://api.aladhan.com/v1/timings?latitude=" + lat + "&longitude=" + lon + "&method=4",
      { credentials: "omit" }
    )
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var t = j && j.data && j.data.timings;
        if (t) renderTimes(t, label);
      });
  }

  function applySaved() {
    var s = readLoc();
    if (!s) return false;
    if (s.city && !/saved location/i.test(s.city)) setCity(s.city);
    else setCity("Locating…");
    fetchTimes(s.lat, s.lon, s.city);
    if (!s.city || /saved location|near you/i.test(s.city)) {
      reverse(s.lat, s.lon).then(function (city) {
        if (city) {
          s.city = city;
          saveLoc(s);
          setCity(city);
        }
      });
    }
    return true;
  }

  function geo(force) {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) return reject();
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude, lon = pos.coords.longitude;
          reverse(lat, lon).then(function (city) {
            var o = { lat: lat, lon: lon, city: city || "Saved location", ts: Date.now() };
            saveLoc(o);
            setCity(o.city);
            fetchTimes(lat, lon, o.city).then(resolve).catch(reject);
          });
        },
        reject,
        { enableHighAccuracy: false, timeout: 12000, maximumAge: force ? 0 : 300000 }
      );
    });
  }

  function forceKaaba() {
    var host = $("hijri-temps");
    if (!host) return;
    var mk = $("temp-makkah"), md = $("temp-madinah");
    var mkV = mk ? mk.textContent.replace(/[^0-9.\-]/g, "") || "—" : "—";
    var mdV = md ? md.textContent.replace(/[^0-9.\-]/g, "") || "—" : "—";
    if (!mkV) mkV = "—";
    if (!mdV) mdV = "—";
    host.innerHTML =
      '<span class="ht-item"><span><span class="ht-ico">🕋</span> Makkah</span> <strong id="temp-makkah">' + mkV + "</strong>°C</span>" +
      '<span class="ht-item"><span><span class="ht-ico">🕌</span> Madinah</span> <strong id="temp-madinah">' + mdV + "</strong>°C</span>";
  }

  function patchOwnerCity() {
    /* After owner paints Madinah fallback, re-apply saved city */
    if (typeof w.loadSalah === "function" && !w.loadSalah.__enrich) {
      var orig = w.loadSalah;
      w.loadSalah = function () {
        if (readLoc()) {
          applySaved();
          return;
        }
        return orig.apply(this, arguments);
      };
      w.loadSalah.__enrich = true;
    }
  }

  function wire() {
    if (/\bsolo=1\b/.test(location.search) || w.top === w) {
      d.body.classList.add("solo");
    }
    showRabbana();
    fillSurahs();
    forceKaaba();
    setTimeout(forceKaaba, 1500);

    var prev = $("rabbana-prev"), next = $("rabbana-next");
    if (prev) prev.onclick = function () { w.cycleRabbana(-1); };
    if (next) next.onclick = function () { w.cycleRabbana(1); };

    var btn = $("clarity-salah-loc-btn");
    if (btn) {
      btn.onclick = function () {
        btn.disabled = true;
        btn.textContent = "Updating…";
        geo(true)
          .then(function () { btn.textContent = "Location saved"; })
          .catch(function () { btn.textContent = "Unavailable"; })
          .then(function () {
            setTimeout(function () {
              btn.textContent = "Update location";
              btn.disabled = false;
            }, 1500);
          });
      };
    }

    patchOwnerCity();
    if (!applySaved()) {
      geo(false).catch(function () { setCity("Tap Update location"); });
    } else {
      setTimeout(function () { patchOwnerCity(); applySaved(); }, 5000);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(wire, 300); });
  else setTimeout(wire, 300);
})(window, document);
