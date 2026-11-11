/*! Companion backbone v1 · campus-quiet · single owner of polish
 * Merges: salah location retain · meme dedupe · path harden · city labels
 * Does NOT replace banner-owner / audio / pathway-loader (core jobs)
 * Bismillah · educational only — not a fatwa · enrichment held
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_BACKBONE_V1__) return;
  w.__CLARITY_COMPANION_BACKBONE_V1__ = true;

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

  /* ─── Salah location (retain until Update) ─── */
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
    if (loc) {
      loc.textContent = label || "—";
      loc.classList.add("salah-city");
    }
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
    setCityLabel(label);
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
        renderTimes(t, label || "Near you");
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
            var saved = { lat: lat, lon: lon, city: place.city, country: place.country, ts: Date.now() };
            writeSaved(saved);
            fetchByCoords(lat, lon, place.city).then(function () { resolve(saved); }).catch(reject);
          });
        },
        function (err) { reject(err || new Error("geo denied")); },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: force ? 0 : 600000 }
      );
    });
  }
  function applySaved() {
    var saved = readSaved();
    if (!saved || applying) return !!saved;
    applying = true;
    setCityLabel(saved.city || "Saved location");
    fetchByCoords(saved.lat, saved.lon, saved.city || "Saved location")
      .catch(function () { setCityLabel((saved.city || "Saved") + " (cached)"); })
      .then(function () { applying = false; });
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

  /* ─── Meme dedupe ─── */
  function normLabel(el) {
    return (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/^🎨\s*/, "");
  }
  function isMemeish(label) {
    return label === "meme" || label === "to meme studio" || label === "to meme" || /^meme\b/.test(label);
  }
  function dedupeMemeInScope(scope) {
    if (!scope) return;
    var found = false;
    scope.querySelectorAll("button, a.btn-soft, a.btn-secondary, [role='button']").forEach(function (el) {
      if (!isMemeish(normLabel(el))) return;
      if (found) {
        el.setAttribute("data-meme-dup", "1");
        el.style.display = "none";
      } else {
        found = true;
        el.removeAttribute("data-meme-dup");
      }
    });
  }
  function dedupeAllRails() {
    d.querySelectorAll(
      ".card, .td-row, .cmd-action-row, .banner-controls, .rrra-hub-body, [role='toolbar'], #commands-card, #tweet-desk-card, .callig-tools"
    ).forEach(dedupeMemeInScope);
  }

  /* ─── Path harden (enrichment held) ─── */
  function hardenPaths() {
    var track = d.querySelector(".cgs-track, #clarity-gate-strip");
    if (track) {
      track.setAttribute("data-path-hardened", "1");
      var active = track.querySelectorAll(".cgs-btn.is-active, .cgs-btn[aria-pressed='true']");
      if (active.length > 1) {
        active.forEach(function (btn, i) {
          if (i > 0) {
            btn.classList.remove("is-active");
            btn.setAttribute("aria-pressed", "false");
          }
        });
      }
    }
    try {
      if (typeof w.claritySwitchGate === "function" && !w.claritySwitchGate.__bb) {
        var orig = w.claritySwitchGate;
        w.claritySwitchGate = function () {
          var r = orig.apply(this, arguments);
          setTimeout(dedupeAllRails, 80);
          return r;
        };
        w.claritySwitchGate.__bb = true;
      }
    } catch (e) {}
  }

  function singleOnDevice() {
    var brand = d.querySelector(".banner-brand");
    if (!brand) return;
    var pills = brand.querySelectorAll(".on-device-ok, .brand-ondev");
    pills.forEach(function (el, i) {
      if (i > 0) el.style.display = "none";
      else el.textContent = "On-device ✓";
    });
  }

  function settle() {
    if (!isCompanion()) return;
    ensureUpdateBtn();
    patchOwnerSalah();
    if (!applySaved()) {
      requestGeo(false).catch(function () {
        var loc = d.getElementById("hijri-local-loc");
        if (loc && (!loc.textContent || /^(…|—|\.\.\.)$/.test(loc.textContent.trim()))) {
          loc.textContent = "Tap Update location";
        }
      });
    } else {
      setTimeout(function () { patchOwnerSalah(); applySaved(); }, 5500);
    }
    singleOnDevice();
    dedupeAllRails();
    hardenPaths();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(settle, 350); });
  else setTimeout(settle, 350);
  setTimeout(settle, 1500);
  d.addEventListener("click", function () { setTimeout(dedupeAllRails, 160); });
  try {
    new MutationObserver(function () { setTimeout(dedupeAllRails, 40); }).observe(d.documentElement, {
      childList: true,
      subtree: true
    });
  } catch (e) {}
})(window, document);
