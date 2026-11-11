/*! Companion backbone v1.2 · Bismillah
 * City name resolve · hide all Meme icons · Kaaba Makkah temp · glass settle
 * Educational only — not a fatwa · enrichment held
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_BACKBONE_V1__) {
    /* allow hot-upgrade of functions via re-settle only if same build flag soft */
  }
  w.__CLARITY_COMPANION_BACKBONE_V1__ = true;
  w.__CLARITY_COMPANION_BACKBONE_BUILD__ = "20261110BB12";

  var KEY = "clarity_salah_location_v1";
  var applying = false;

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
  function setCityLabel(label) {
    var loc = d.getElementById("hijri-local-loc");
    if (!loc) return;
    var t = (label || "").trim();
    if (!t || /^near you$/i.test(t)) t = "Locating…";
    loc.textContent = t;
    loc.classList.add("salah-city");
  }
  function renderTimes(t, label) {
    var list = d.getElementById("salah-times-list");
    if (!list || !t) return;
    var order = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    list.innerHTML = order
      .map(function (name) {
        var val = t[name] || "—";
        if (typeof val === "string" && val.indexOf(" ") > -1) val = val.split(" ")[0];
        return '<li><span class="salah-name">' + name + '</span><span class="salah-time">' + val + "</span></li>";
      })
      .join("");
    if (label && !/^near you$/i.test(label)) setCityLabel(label);
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
  /** Prefer a real city name — never leave "Near you" if reverse-geo works */
  function reverseGeocode(lat, lon) {
    return fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
        lat +
        "&longitude=" +
        lon +
        "&localityLanguage=en",
      { credentials: "omit" }
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        var city =
          (j &&
            (j.city ||
              j.locality ||
              j.localityInfo && j.localityInfo.administrative && j.localityInfo.administrative[0] && j.localityInfo.administrative[0].name ||
              j.principalSubdivision)) ||
          "";
        var country = (j && (j.countryName || j.countryCode)) || "";
        if (!city && country) city = country;
        if (!city) city = lat.toFixed(2) + "°, " + lon.toFixed(2) + "°";
        return { city: city, country: country };
      })
      .catch(function () {
        return { city: lat.toFixed(2) + "°, " + lon.toFixed(2) + "°", country: "" };
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
        { enableHighAccuracy: false, timeout: 10000, maximumAge: force ? 0 : 600000 }
      );
    });
  }
  function applySaved() {
    var saved = readSaved();
    if (!saved || applying) return !!saved;
    applying = true;
    var label = saved.city;
    if (!label || /^near you$/i.test(label)) {
      /* refresh name once if old save was vague */
      reverseGeocode(saved.lat, saved.lon).then(function (place) {
        saved.city = place.city;
        saved.country = place.country;
        writeSaved(saved);
        setCityLabel(place.city);
        return fetchByCoords(saved.lat, saved.lon, place.city);
      }).finally(function () {
        applying = false;
      });
      return true;
    }
    setCityLabel(label);
    fetchByCoords(saved.lat, saved.lon, label)
      .catch(function () {
        setCityLabel(label + " (cached)");
      })
      .then(function () {
        applying = false;
      });
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

  /* ─── Remove ALL Meme icons/buttons site-wide ─── */
  function hideAllMeme() {
    d.querySelectorAll("button, a, [role='button']").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      var title = (el.getAttribute("title") || "").toLowerCase();
      var oc = (el.getAttribute("onclick") || "").toLowerCase();
      var meme =
        /^🎨?\s*meme\b/.test(t) ||
        t === "meme" ||
        t === "to meme studio" ||
        t === "to meme" ||
        /meme/.test(title) && t.length < 28 ||
        /sendtomeme|draft\('meme'\)|claritymem|tomemestudio|calligsendenglishtomeme/.test(oc);
      if (meme) {
        el.setAttribute("data-meme-hide", "1");
        el.style.display = "none";
        el.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* Kaaba icon for Makkah temperature row */
  function kaabaTempIcon() {
    var host = d.getElementById("hijri-temps");
    if (!host) return;
    host.querySelectorAll(".ht-item, span").forEach(function (el) {
      var t = el.textContent || "";
      if (/Makkah|Mecca/i.test(t)) {
        /* replace leading mosque/kaaba-ish with Kaaba */
        if (el.childNodes.length && el.childNodes[0].nodeType === 3) {
          el.childNodes[0].textContent = el.childNodes[0].textContent.replace(/^[🕌🕋]\s*/, "🕋 ");
        } else {
          var html = el.innerHTML;
          if (/Makkah|Mecca/i.test(html) && !/🕋/.test(html)) {
            el.innerHTML = html.replace(/(🕌\s*)?(Makkah|Mecca)/i, "🕋 $2");
          } else if (/🕌/.test(html) && /Makkah|Mecca/i.test(html)) {
            el.innerHTML = html.replace(/🕌/g, "🕋");
          }
        }
      }
    });
    var mk = d.getElementById("temp-makkah");
    if (mk) {
      var row = mk.closest(".ht-item") || mk.parentElement;
      if (row && !/🕋/.test(row.textContent || "")) {
        row.innerHTML = row.innerHTML.replace(/🕌/g, "🕋");
        if (!/🕋/.test(row.innerHTML)) {
          row.innerHTML = "🕋 Makkah <strong id=\"temp-makkah\">" + (mk.textContent || "—") + "</strong>°C";
        }
      }
    }
  }

  function hardenPaths() {
    var track = d.querySelector(".cgs-track, #clarity-gate-strip");
    if (track) track.setAttribute("data-path-hardened", "1");
  }

  function settle() {
    if (!isCompanion()) return;
    ensureUpdateBtn();
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
    hardenPaths();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(settle, 300); });
  else setTimeout(settle, 300);
  setTimeout(settle, 1200);
  setTimeout(function () {
    hideAllMeme();
    kaabaTempIcon();
  }, 2500);
  d.addEventListener("click", function () {
    setTimeout(hideAllMeme, 120);
  });
  try {
    new MutationObserver(function () {
      setTimeout(function () {
        hideAllMeme();
        kaabaTempIcon();
      }, 30);
    }).observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})(window, document);
