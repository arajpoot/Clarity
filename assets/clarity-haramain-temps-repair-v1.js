/* PERF3_GEO_DELAY — do not prompt geolocation on first paint */
(function(w){
  try {
    var g = navigator.geolocation;
    if (!g || g.__clarityDelayed) return;
    var orig = g.getCurrentPosition.bind(g);
    g.getCurrentPosition = function(success, error, opts) {
      var go = function(){ try { orig(success, error, opts); } catch(e){ if (error) error(e); } };
      if (w.__CLARITY_ALLOW_GEO__) { go(); return; }
      var start = function(){ setTimeout(go, 10000); };
      if (document.readyState === "complete") start();
      else w.addEventListener("load", start, { once: true });
    };
    g.__clarityDelayed = true;
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);

/**
 * Haramain + local temp repair · Companion · 20261020CH
 * Ensures Makkah/Madinah and place-temp fill even if idle-deferred fetch lags.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_HARAMAIN_TEMPS_REPAIR__) return;
  g.__CLARITY_HARAMAIN_TEMPS_REPAIR__ = true;

  var CITIES = [
    { id: "temp-makkah", lat: 21.4225, lon: 39.8262 },
    { id: "temp-madinah", lat: 24.4672, lon: 39.6112 }
  ];

  function setEl(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function fetchTemp(lat, lon) {
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      encodeURIComponent(lat) +
      "&longitude=" +
      encodeURIComponent(lon) +
      "&current=temperature_2m";
    return fetch(url)
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        if (j && j.current && j.current.temperature_2m != null)
          return Math.round(Number(j.current.temperature_2m)) + "°C";
        return "—°C";
      })
      .catch(function () {
        return "—°C";
      });
  }

  function loadHaramain() {
    CITIES.forEach(function (c) {
      setEl(c.id, "…");
      fetchTemp(c.lat, c.lon).then(function (t) {
        setEl(c.id, t.replace(/°C$/, ""));
      });
    });
  }

  function loadPlace() {
    if (!g.navigator || !g.navigator.geolocation) return;
    try {
      g.navigator.geolocation.getCurrentPosition(
        function (pos) {
          fetchTemp(pos.coords.latitude, pos.coords.longitude).then(function (t) {
            ["place-temp", "place-temp-alt"].forEach(function (id) {
              var el = document.getElementById(id);
              if (el) el.textContent = t;
            });
            try {
              document.querySelectorAll(".temp-live").forEach(function (el) {
                if (el) el.textContent = t;
              });
            } catch (e) {}
          });
        },
        function () {},
        { maximumAge: 600000, timeout: 8000 }
      );
    } catch (e) {}
  }

  function boot() {
    loadHaramain();
    // second pass if first paint raced
    setTimeout(loadHaramain, 4000);
    setTimeout(loadPlace, 1500);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.loadHaramainCityTemps = g.loadHaramainCityTemps || loadHaramain;
})(typeof window !== "undefined" ? window : this);
