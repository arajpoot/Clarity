(function(){
  "use strict";
  if (window.__NUROS_HARAMAIN_TEMPS__) return;
  window.__NUROS_HARAMAIN_TEMPS__ = true;
  var CITIES = {
    makkah:  { lat: 21.4225, lon: 39.8262 },
    madinah: { lat: 24.4672, lon: 39.6111 }
  };
  var CACHE_KEY = "clarity_haramain_temps_v1";
  var CACHE_MS = 25 * 60 * 1000;
  function setEl(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = (val != null && isFinite(val)) ? Math.round(val) : "—";
  }
  async function fetchOne(lat, lon) {
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat +
      "&longitude=" + lon + "&current=temperature_2m&timezone=auto";
    var res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("meteo " + res.status);
    var data = await res.json();
    if (data && data.current && data.current.temperature_2m != null)
      return data.current.temperature_2m;
    throw new Error("no temp");
  }
  async function loadBoth(force) {
    try {
      if (!force) {
        var raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          var cached = JSON.parse(raw);
          if (cached && cached.ts && (Date.now() - cached.ts) < CACHE_MS) {
            setEl("temp-makkah", cached.makkah);
            setEl("temp-madinah", cached.madinah);
            return;
          }
        }
      }
    } catch (e) {}
    var out = { ts: Date.now(), makkah: null, madinah: null };
    try {
      var results = await Promise.allSettled([
        fetchOne(CITIES.makkah.lat, CITIES.makkah.lon),
        fetchOne(CITIES.madinah.lat, CITIES.madinah.lon)
      ]);
      if (results[0].status === "fulfilled") out.makkah = results[0].value;
      if (results[1].status === "fulfilled") out.madinah = results[1].value;
      setEl("temp-makkah", out.makkah);
      setEl("temp-madinah", out.madinah);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(out)); } catch (e2) {}
    } catch (err) {
      setEl("temp-makkah", null);
      setEl("temp-madinah", null);
    }
  }
  function boot() {
    loadBoth(false);
    setInterval(function(){ loadBoth(true); }, CACHE_MS);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  window.addEventListener("online", function(){ loadBoth(true); });
})();