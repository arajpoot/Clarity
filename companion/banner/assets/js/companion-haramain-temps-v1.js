/*! companion-haramain-temps-v1 · 20261111STILLS · numbers only · icons stay in HTML */
(function (g) {
  "use strict";
  if (g.__CLARITY_HARAMAIN_TEMPS_20261111STILLS__) return;
  g.__CLARITY_HARAMAIN_TEMPS_20261111STILLS__ = true;
  g.__CLARITY_HARAMAIN_TEMPS_REPAIR__ = true;

  var CITIES = [
    { id: "temp-makkah", lat: 21.4225, lon: 39.8262 },
    { id: "temp-madinah", lat: 24.4672, lon: 39.6112 }
  ];

  function setTemp(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    /* numbers only — never touch parent chip / icons */
    var n = String(text || "—").replace(/°C/gi, "").trim();
    el.textContent = n || "—";
  }

  function fetchTemp(lat, lon) {
    var url =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      encodeURIComponent(lat) +
      "&longitude=" +
      encodeURIComponent(lon) +
      "&current=temperature_2m";
    return fetch(url, { credentials: "omit" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.current && j.current.temperature_2m != null)
          return String(Math.round(Number(j.current.temperature_2m)));
        return "—";
      })
      .catch(function () { return "—"; });
  }

  function loadHaramain() {
    CITIES.forEach(function (c) {
      setTemp(c.id, "…");
      fetchTemp(c.lat, c.lon).then(function (t) { setTemp(c.id, t); });
    });
  }

  function boot() {
    loadHaramain();
    setTimeout(loadHaramain, 12000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.ClarityHaramainTemps = { reload: loadHaramain };
})(window);
