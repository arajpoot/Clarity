/*! Companion backbone v1.3 · Bismillah
 * Real city name · Kaaba Makkah · next prayer countdown · hide Meme
 * Educational only — not a fatwa · enrichment held
 */
(function (w, d) {
  "use strict";
  w.__CLARITY_COMPANION_BACKBONE_V1__ = true;
  w.__CLARITY_COMPANION_BACKBONE_BUILD__ = "20261110BB13";

  var KEY = "clarity_salah_location_v1";
  var applying = false;
  var lastTimings = null;
  var countdownTimer = null;

  function isCompanion() {
    try {
      return (d.documentElement.getAttribute("data-clarity-room") || "") === "companion" ||
        /\/companion\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function readSaved() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!o || typeof o.lat !== "number" || typeof o.lon !== "number") return null;
      return o;
    } catch (e) {
      return null;
    }
  }
  function writeSaved(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
      if (o.city) localStorage.setItem("clarity_salah_city", o.city);
    } catch (e) {}
  }

  function isVagueCity(s) {
    s = (s || "").trim();
    if (!s) return true;
    if (/^near you$/i.test(s)) return true;
    if (/locating/i.test(s)) return true;
    if (/^-?\d+(\.\d+)?\s*°,?\s*-?\d+/.test(s)) return true;
    if (/tap update/i.test(s)) return true;
    return false;
  }

  function setCityLabel(label) {
    var loc = d.getElementById("hijri-local-loc");
    if (!loc) return;
    var t = (label || "").trim();
    if (isVagueCity(t)) t = "Locating…";
    loc.textContent = t;
    loc.classList.add("salah-city");
  }

  function parseHHMM(s) {
    if (!s) return null;
    s = String(s).trim().split(" ")[0];
    var p = s.split(":");
    if (p.length < 2) return null;
    var h = parseInt(p[0], 10);
    var m = parseInt(p[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return { h: h, m: m };
  }

  function ensureNextPrayerEl() {
    var host = d.querySelector(".salah-times-section");
    if (!host) return null;
    var el = d.getElementById("clarity-next-prayer");
    if (!el) {
      el = d.createElement("div");
      el.id = "clarity-next-prayer";
      el.innerHTML =
        '<span class="np-label">Next prayer</span>' +
        '<span class="np-name">—</span>' +
        '<span class="np-count">—</span>';
      var clock = d.getElementById("hijri-local-time");
      if (clock && clock.parentNode) clock.parentNode.insertBefore(el, clock);
      else host.appendChild(el);
    }
    return el;
  }

  function updateCountdown() {
    var el = ensureNextPrayerEl();
    if (!el || !lastTimings) return;
    var order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();
    var nextName = null;
    var nextDate = null;
    for (var i = 0; i < order.length; i++) {
      var name = order[i];
      var hm = parseHHMM(lastTimings[name]);
      if (!hm) continue;
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hm.h, hm.m, 0, 0);
      if (dt.getTime() > now.getTime() + 500) {
        nextName = name;
        nextDate = dt;
        break;
      }
    }
    if (!nextName) {
      /* tomorrow Fajr */
      var f = parseHHMM(lastTimings.Fajr);
      if (f) {
        nextName = "Fajr";
        nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, f.h, f.m, 0, 0);
      }
    }
    var nameEl = el.querySelector(".np-name");
    var countEl = el.querySelector(".np-count");
    if (!nextName || !nextDate) {
      if (nameEl) nameEl.textContent = "—";
      if (countEl) countEl.textContent = "—";
      return;
    }
    var ms = nextDate.getTime() - now.getTime();
    if (ms < 0) ms = 0;
    var totalMin = Math.floor(ms / 60000);
    var hh = Math.floor(totalMin / 60);
    var mm = totalMin % 60;
    var ss = Math.floor((ms % 60000) / 1000);
    if (nameEl) nameEl.textContent = nextName;
    if (countEl) {
      countEl.textContent =
        (hh > 0 ? hh + "h " : "") +
        mm + "m " +
        (hh === 0 ? ss + "s" : "");
    }
  }

  function startCountdown() {
    updateCountdown();
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
  }

  function renderTimes(t, label) {
    var list = d.getElementById("salah-times-list");
    if (!list || !t) return;
    lastTimings = t;
    var order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    list.innerHTML = order
      .map(function (name) {
        var val = t[name] || "—";
        if (typeof val === "string" && val.indexOf(" ") > -1) val = val.split(" ")[0];
        return '<li><span class="salah-name">' + name + '</span><span class="salah-time">' + val + "</span></li>";
      })
      .join("");
    if (label && !isVagueCity(label)) setCityLabel(label);
    startCountdown();
  }

  function fetchByCoords(lat, lon, label) {
    return fetch(
      "https://api.aladhan.com/v1/timings?latitude=" +
        encodeURIComponent(lat) +
        "&longitude=" +
        encodeURIComponent(lon) +
        "&method=4",
      { credentials: "omit" }
    )
      .then(function (r) {
        if (!r.ok) throw new Error("timings");
        return r.json();
      })
      .then(function (j) {
        var t = j && j.data && j.data.timings;
        if (!t) throw new Error("no timings");
        renderTimes(t, label);
      });
  }

  /** Multi-source city name — avoid leaving coordinates on screen */
  function reverseGeocode(lat, lon) {
    var bdc =
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
      lat +
      "&longitude=" +
      lon +
      "&localityLanguage=en";
    var nom =
      "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" +
      lat +
      "&lon=" +
      lon +
      "&zoom=12&addressdetails=1";

    function fromBdc(j) {
      if (!j) return "";
      return (
        j.city ||
        j.locality ||
        (j.localityInfo &&
          j.localityInfo.administrative &&
          j.localityInfo.administrative[0] &&
          j.localityInfo.administrative[0].name) ||
        j.principalSubdivision ||
        ""
      );
    }
    function fromNom(j) {
      if (!j || !j.address) return j && j.name ? j.name : "";
      var a = j.address;
      return a.city || a.town || a.village || a.municipality || a.county || a.state || "";
    }

    return fetch(bdc, { credentials: "omit" })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        var city = fromBdc(j);
        var country = (j && (j.countryName || j.countryCode)) || "";
        if (city && !isVagueCity(city)) return { city: city, country: country };
        return fetch(nom, {
          credentials: "omit",
          headers: { Accept: "application/json" }
        })
          .then(function (r2) {
            return r2.json();
          })
          .then(function (j2) {
            var c2 = fromNom(j2);
            if (c2) return { city: c2, country: country || (j2.address && j2.address.country) || "" };
            return { city: city || "Saved location", country: country };
          })
          .catch(function () {
            return { city: city || "Saved location", country: country };
          });
      })
      .catch(function () {
        return fetch(nom, {
          credentials: "omit",
          headers: { Accept: "application/json" }
        })
          .then(function (r) {
            return r.json();
          })
          .then(function (j) {
            return { city: fromNom(j) || "Saved location", country: (j.address && j.address.country) || "" };
          })
          .catch(function () {
            return { city: "Saved location", country: "" };
          });
      });
  }

  function ensureUpdateBtn() {
    var host = d.querySelector(".salah-times-section");
    if (!host || d.getElementById("clarity-salah-loc-btn")) return;
    var btn = d.createElement("button");
    btn.type = "button";
    btn.id = "clarity-salah-loc-btn";
    btn.className = "salah-loc-refresh";
    btn.textContent = "Update location";
    btn.onclick = function () {
      btn.disabled = true;
      btn.textContent = "Updating…";
      requestGeo(true)
        .then(function () {
          btn.textContent = "Location saved";
          setTimeout(function () {
            btn.textContent = "Update location";
            btn.disabled = false;
          }, 1600);
        })
        .catch(function () {
          btn.textContent = "Location unavailable";
          setTimeout(function () {
            btn.textContent = "Update location";
            btn.disabled = false;
          }, 2000);
        });
    };
    host.appendChild(btn);
  }

  function requestGeo(force) {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) return reject(new Error("no geo"));
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          var lat = pos.coords.latitude;
          var lon = pos.coords.longitude;
          reverseGeocode(lat, lon).then(function (place) {
            var saved = {
              lat: lat,
              lon: lon,
              city: place.city,
              country: place.country,
              ts: Date.now()
            };
            writeSaved(saved);
            setCityLabel(place.city);
            fetchByCoords(lat, lon, place.city)
              .then(function () {
                resolve(saved);
              })
              .catch(reject);
          });
        },
        function (err) {
          reject(err || new Error("geo denied"));
        },
        { enableHighAccuracy: false, timeout: 12000, maximumAge: force ? 0 : 300000 }
      );
    });
  }

  function applySaved() {
    var saved = readSaved();
    if (!saved || applying) return !!saved;
    applying = true;
    function done() {
      applying = false;
    }
    if (isVagueCity(saved.city)) {
      reverseGeocode(saved.lat, saved.lon)
        .then(function (place) {
          saved.city = place.city;
          saved.country = place.country;
          writeSaved(saved);
          setCityLabel(place.city);
          return fetchByCoords(saved.lat, saved.lon, place.city);
        })
        .finally(done);
      return true;
    }
    setCityLabel(saved.city);
    fetchByCoords(saved.lat, saved.lon, saved.city).finally(done);
    return true;
  }

  function patchOwnerSalah() {
    if (typeof w.loadSalah === "function" && !w.loadSalah.__bb) {
      var orig = w.loadSalah;
      w.loadSalah = function () {
        if (readSaved()) {
          applySaved();
          return;
        }
        return orig.apply(this, arguments);
      };
      w.loadSalah.__bb = true;
    }
  }

  function hideAllMeme() {
    d.querySelectorAll("button, a, [role='button']").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      var oc = (el.getAttribute("onclick") || "").toLowerCase();
      if (
        /^🎨?\s*meme\b/.test(t) ||
        t === "meme" ||
        t === "to meme studio" ||
        /sendtomeme|draft\('meme'\)|tomemestudio|calligsendenglishtomeme/.test(oc)
      ) {
        el.setAttribute("data-meme-hide", "1");
        el.style.display = "none";
      }
    });
  }

  function kaabaTempIcon() {
    var host = d.getElementById("hijri-temps");
    if (!host) return;
    /* Rebuild rows cleanly if needed */
    var mk = d.getElementById("temp-makkah");
    var md = d.getElementById("temp-madinah");
    var mkVal = mk ? mk.textContent : "—";
    var mdVal = md ? md.textContent : "—";
    host.innerHTML =
      '<span class="ht-item"><span>🕋 Makkah</span> <strong id="temp-makkah">' +
      mkVal +
      "</strong>°C</span>" +
      '<span class="ht-item"><span>🕌 Madinah</span> <strong id="temp-madinah">' +
      mdVal +
      "</strong>°C</span>";
  }

  function settle() {
    if (!isCompanion()) return;
    ensureUpdateBtn();
    ensureNextPrayerEl();
    patchOwnerSalah();
    if (!applySaved()) {
      requestGeo(false).catch(function () {
        setCityLabel("Tap Update location");
      });
    } else {
      setTimeout(function () {
        patchOwnerSalah();
        applySaved();
      }, 5500);
    }
    hideAllMeme();
    kaabaTempIcon();
    setTimeout(kaabaTempIcon, 2000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(settle, 300); });
  else setTimeout(settle, 300);
  setTimeout(settle, 1400);
  d.addEventListener("click", function () {
    setTimeout(hideAllMeme, 100);
  });
  try {
    new MutationObserver(function () {
      setTimeout(hideAllMeme, 40);
    }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})(window, document);
