/*! Companion salah location v1 · Bismillah
 * Location-based salah city; retain until user refetches
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_SALAH_LOCATION_V1__) return;
  w.__CLARITY_COMPANION_SALAH_LOCATION_V1__ = true;

  var KEY = "clarity_salah_location_v1";
  /* { lat, lon, city, country, ts } */

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
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
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
    if (loc) {
      loc.textContent = label || "—";
      loc.classList.add("salah-city");
    }
    var title = d.querySelector(".salah-times-section .salah-city-title, #salah-title");
    if (title && label) title.setAttribute("data-city", label);
  }

  function renderTimes(t, label) {
    var list = d.getElementById("salah-times-list");
    if (!list || !t) return;
    var order = [
      ["Fajr", "Fajr"],
      ["Sunrise", "Sunrise"],
      ["Dhuhr", "Dhuhr"],
      ["Asr", "Asr"],
      ["Maghrib", "Maghrib"],
      ["Isha", "Isha"]
    ];
    list.innerHTML = order
      .map(function (pair) {
        var k = pair[0];
        var name = pair[1];
        var val = t[k] || t[name] || "—";
        if (typeof val === "string" && val.indexOf(" ") > -1) val = val.split(" ")[0];
        return (
          '<li><span class="salah-name">' +
          name +
          '</span><span class="salah-time">' +
          val +
          "</span></li>"
        );
      })
      .join("");
    setCityLabel(label);
  }

  function fetchByCoords(lat, lon, label) {
    var url =
      "https://api.aladhan.com/v1/timings?latitude=" +
      encodeURIComponent(lat) +
      "&longitude=" +
      encodeURIComponent(lon) +
      "&method=4";
    return fetch(url, { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error("timings");
        return r.json();
      })
      .then(function (j) {
        var t = j && j.data && j.data.timings;
        if (!t) throw new Error("no timings");
        renderTimes(t, label || "Near you");
        return t;
      });
  }

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
        return {
          city: (j && (j.city || j.locality || j.principalSubdivision)) || "Near you",
          country: (j && (j.countryName || j.countryCode)) || ""
        };
      })
      .catch(function () {
        return { city: "Near you", country: "" };
      });
  }

  function ensureUpdateBtn() {
    var host =
      d.querySelector(".salah-times-section") ||
      d.querySelector(".banner-side.right");
    if (!host || d.getElementById("clarity-salah-loc-btn")) return;
    var btn = d.createElement("button");
    btn.type = "button";
    btn.id = "clarity-salah-loc-btn";
    btn.className = "salah-loc-refresh";
    btn.textContent = "Update location";
    btn.title = "Fetch prayer times for your current location (saved on this device)";
    btn.style.cssText =
      "margin-top:0.35rem;width:100%;font-size:0.68rem;font-weight:700;padding:0.28rem 0.45rem;border-radius:8px;border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.22);color:inherit;cursor:pointer";
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
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: force ? 0 : 600000
        }
      );
    });
  }

  function load() {
    if (!isCompanion()) return;
    ensureUpdateBtn();
    var saved = readSaved();
    if (saved) {
      /* retain — no re-prompt */
      setCityLabel(saved.city || "Saved location");
      fetchByCoords(saved.lat, saved.lon, saved.city || "Saved location").catch(function () {
        setCityLabel((saved.city || "Saved") + " (offline)");
      });
      return;
    }
    /* First time only: try geo once, then persist */
    requestGeo(false).catch(function () {
      /* leave owner/enrich fallbacks; label gently */
      var loc = d.getElementById("hijri-local-loc");
      if (loc && (!loc.textContent || loc.textContent === "…" || loc.textContent === "—")) {
        loc.textContent = "Tap Update location";
      }
    });
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(load, 400); });
  else setTimeout(load, 400);
  setTimeout(load, 1800);
})(window, document);
