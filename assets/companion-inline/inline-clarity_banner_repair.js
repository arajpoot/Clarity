(function(){
  "use strict";
  if (window.__CLARITY_BANNER_REPAIR_V2__) return;
  window.__CLARITY_BANNER_REPAIR_V2__ = true;
  window.__CLARITY_BANNER_REPAIR__ = true;

  function $(id){ return document.getElementById(id); }

  function hijriParts(d){
    try {
      var day = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day: "numeric" }).format(d);
      var month = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { month: "long" }).format(d);
      var year = new Intl.DateTimeFormat("en-TN-u-ca-islamic", { year: "numeric" }).format(d);
      return { day: day, month: month, year: year,
        full: new Intl.DateTimeFormat("en-TN-u-ca-islamic", { day:"numeric", month:"long", year:"numeric" }).format(d) };
    } catch (e) {
      return { day: String(d.getDate()), month: "", year: "", full: d.toDateString() };
    }
  }

  function repairCalendar(){
    var now = new Date();
    var h = hijriParts(now);
    var grid = $("hijri-cal-grid");
    if (grid && (!grid.textContent || /…|\.\.\.|loading/i.test(grid.textContent) || grid.children.length === 0)) {
      grid.innerHTML = '<div class="hcg-day" style="font-size:1.6rem;font-weight:800;line-height:1.1">'+h.day+'</div>' +
        '<div class="hcg-month" style="font-size:0.78rem;opacity:0.9">'+h.month+'</div>';
    }
    var meta = $("hijri-cal-meta");
    if (meta && (!meta.textContent || /…|loading/i.test(meta.textContent))) {
      meta.textContent = h.full + " · " + now.toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short" });
    }
    var title = $("hijri-cal-title");
    if (title && /…|loading/i.test(title.textContent || "")) title.textContent = "Hijri · تقويم";
    /* local clock */
    var lt = $("hijri-local-time");
    if (lt) {
      try {
        lt.textContent = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      } catch (e2) {
        lt.textContent = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
      }
    }
  }

  function fillSalahList(timings, cityLabel){
    var list = $("salah-times-list");
    if (!list) return;
    var order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var html = "";
    order.forEach(function(name){
      var t = timings[name] ? String(timings[name]).slice(0, 5) : "—";
      html += '<li><span class="salah-name">'+name+'</span><span class="salah-time">'+t+'</span></li>';
    });
    list.innerHTML = html;
    var loc = $("hijri-local-loc");
    if (loc && cityLabel) loc.textContent = cityLabel;
    var st = $("salah-title");
    if (st) st.textContent = "Ṣalāh";
  }

  async function repairSalah(){
    var list = $("salah-times-list");
    if (!list) return;
    /* already real times? */
    if (list.querySelectorAll("li").length >= 5) {
      var sample = list.textContent || "";
      if (!/loading|…/i.test(sample) && /\d/.test(sample)) return;
    }
    var city = "Makkah";
    var country = "SA";
    try {
      var saved = localStorage.getItem("clarity_salah_city");
      if (saved) city = saved;
      var ctry = localStorage.getItem("clarity_salah_country");
      if (ctry) country = ctry;
    } catch (e) {}
    try {
      var url = "https://api.aladhan.com/v1/timingsByCity?city=" + encodeURIComponent(city) +
                "&country=" + encodeURIComponent(country) + "&method=4";
      var res = await fetch(url, { credentials: "omit" });
      if (!res.ok) throw new Error("http");
      var json = await res.json();
      var t = (json.data && json.data.timings) || {};
      fillSalahList(t, city + (country ? ", " + country : ""));
    } catch (e2) {
      /* offline placeholders — still structured */
      fillSalahList({ Fajr: "—", Dhuhr: "—", Asr: "—", Maghrib: "—", Isha: "—" }, "Times offline");
    }
  }

  function repairLiveFallback(){
    var ifr = $("banner-live");
    var img = $("banner-img");
    if (img && !img.getAttribute("src")) {
      img.setAttribute("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/640px-Kaaba_Masjid_Haraam_Makkah.jpg");
    }
    if (ifr && img) {
      /* if live never starts, keep still visible */
      try {
        if (ifr.hasAttribute("hidden") || !ifr.src) {
          img.hidden = false;
          img.style.display = "";
        }
      } catch (e) {}
    }
  }

  function boot(){
    repairCalendar();
    repairSalah();
    repairLiveFallback();
    setTimeout(repairCalendar, 600);
    setTimeout(repairSalah, 900);
    setTimeout(repairLiveFallback, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 400); });
  /* light clock tick — pause when hidden */
  setInterval(function(){
    if (document.hidden) return;
    var lt = $("hijri-local-time");
    if (!lt) return;
    var now = new Date();
    try {
      lt.textContent = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch (e) {}
  }, 30000);
})();
