(function(){
  "use strict";
  if (window.__CLARITY_BANNER_REPAIR__) return;
  window.__CLARITY_BANNER_REPAIR__ = true;

  function setText(sel, txt){
    var el = typeof sel === "string" ? document.querySelector(sel) : sel;
    if (el) el.textContent = txt;
  }

  function hijriApprox(d){
    /* Civil-ish Hijri estimate for display only — not a fatwa/calendar authority */
    try {
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        var fmt = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day:"numeric", month:"long", year:"numeric" });
        return fmt.format(d);
      }
    } catch(e){}
    return d.toDateString();
  }

  function repairCalendar(){
    var now = new Date();
    var nodes = document.querySelectorAll(
      "#hijri-date, #banner-hijri, .hijri-date, .banner-hijri, [data-hijri], #islamic-date"
    );
    var label = hijriApprox(now);
    nodes.forEach(function(n){
      if (!n.textContent || /loading|…|\.\.\./i.test(n.textContent) || n.textContent.trim() === "—") {
        n.textContent = label;
      }
    });
    /* Gregorian side if empty */
    document.querySelectorAll("#greg-date, .greg-date, [data-greg]").forEach(function(n){
      if (!n.textContent || /loading|…/i.test(n.textContent)) {
        n.textContent = now.toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short", year:"numeric" });
      }
    });
  }

  async function repairSalah(){
    var box = document.querySelector(".salah-card, #salah-card, #banner-salah, [data-salah-box]");
    var rows = document.querySelectorAll(".salah-time, .salah-row time, #salah-times li, [data-salah-name]");
    /* If already filled, skip */
    var any = false;
    rows.forEach(function(r){ if (r.textContent && !/loading|—|…|:\s*$/i.test(r.textContent)) any = true; });
    if (any) return;

    var city = "Edmonton";
    var country = "Canada";
    try {
      var saved = localStorage.getItem("clarity_salah_city");
      if (saved) city = saved;
    } catch(e){}

    try {
      var url = "https://api.aladhan.com/v1/timingsByCity?city=" + encodeURIComponent(city) +
                "&country=" + encodeURIComponent(country) + "&method=2";
      var res = await fetch(url, { credentials: "omit" });
      if (!res.ok) throw new Error("http");
      var json = await res.json();
      var t = (json.data && json.data.timings) || {};
      var map = {
        Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr, Asr: t.Asr,
        Maghrib: t.Maghrib, Isha: t.Isha
      };
      Object.keys(map).forEach(function(name){
        var el = document.querySelector('[data-salah="'+name+'"], #'+name.toLowerCase()+'-time, .salah-'+name.toLowerCase());
        if (el && map[name]) el.textContent = String(map[name]).slice(0,5);
      });
      /* Generic fill by label text */
      document.querySelectorAll(".salah-row, .salah-item, li").forEach(function(row){
        var lab = (row.textContent || "").toLowerCase();
        Object.keys(map).forEach(function(name){
          if (lab.indexOf(name.toLowerCase()) >= 0 && map[name]) {
            var timeEl = row.querySelector("time, .time, span:last-child") || row;
            if (timeEl && /loading|—|…|:/.test(timeEl.textContent || "")) {
              /* only replace trailing time portion if structure allows */
            }
          }
        });
      });
      var status = document.querySelector(".salah-card .loading, #salah-status, .salah-loading");
      if (status) status.textContent = city;
      var loc = document.querySelector("#salah-location, .salah-location");
      if (loc) loc.textContent = city + ", " + country;
    } catch (e) {
      setText("#salah-status", "Times unavailable offline");
    }
  }

  function boot(){
    repairCalendar();
    repairSalah();
    setTimeout(repairCalendar, 800);
    setTimeout(repairSalah, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 400); });
})();