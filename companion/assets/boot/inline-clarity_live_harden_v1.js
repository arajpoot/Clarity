(function(){
  "use strict";
  if (window.__CLARITY_LIVE_HARDEN_V1__) return;
  window.__CLARITY_LIVE_HARDEN_V1__ = true;

  /* 1) Kaaba / banner still image soft fallback */
  function fixBrokenImgs(){
    document.querySelectorAll("img").forEach(function(img){
      if (img.__fb) return;
      img.__fb = true;
      img.addEventListener("error", function(){
        if (/Kaaba|Masjid_Haraam|wikimedia/i.test(img.src||"")) {
          img.src = "data:image/svg+xml," + encodeURIComponent(
            "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>"+
            "<rect fill='#0f241c' width='100%' height='100%'/>"+
            "<text x='50%' y='50%' fill='#d4b45a' text-anchor='middle' font-size='28' font-family='serif'>Clarity · On-device</text></svg>"
          );
        }
      }, { once: true });
    });
  }

  /* 2) Dedupe On-device chips in brand */
  function dedupeOnDevice(){
    var h1 = document.querySelector(".banner h1, .banner .brand, #clarity-brand");
    if (!h1) return;
    var chips = h1.querySelectorAll(".brand-ondev, .nuros-ondev-chip, #nuros-ondev-chip, [class*='on-device'], [class*='ondev']");
    chips.forEach(function(el, i){ if (i > 0) el.remove(); });
  }

  /* 3) Welcome: if path already chosen, dismiss; else soft auto-begin after 12s idle */
  function softWelcome(){
    try {
      var path = localStorage.getItem("clarity_committed_path") || localStorage.getItem("clarity_path_focus");
      if (path && typeof clarityWelcomePickTrack === "function") {
        clarityWelcomePickTrack(path);
        return;
      }
      setTimeout(function(){
        if (document.querySelector("[class*='welcome'] button, .clarity-welcome")) {
          if (typeof clarityWelcomePickTrack === "function") clarityWelcomePickTrack("seeker");
        }
      }, 12000);
    } catch(e){}
  }

  /* 4) Abort laggy optional third-party counters (countapi) so UI stays snappy */
  try {
    var _fetch = window.fetch;
    if (_fetch && !_fetch.__clarityHardened) {
      window.fetch = function(input, init){
        var url = typeof input === "string" ? input : (input && input.url) || "";
        if (/countapi\.xyz/i.test(url)) {
          return Promise.resolve(new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } }));
        }
        init = init || {};
        if (!init.signal && /alquran\.cloud|api\.quran\.com|ummahapi|aladhan|ipapi/i.test(url)) {
          var ctrl = new AbortController();
          var t = setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, 8000);
          init.signal = ctrl.signal;
          return _fetch.call(this, input, init).finally(function(){ clearTimeout(t); });
        }
        return _fetch.call(this, input, init);
      };
      window.fetch.__clarityHardened = true;
    }
  } catch(e){}

  /* 5) SW: claim update so stale caches don't pin a broken shell */
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(regs){
        regs.forEach(function(r){
          try { r.update(); } catch(e){}
        });
      });
    }
  } catch(e){}

  function boot(){
    fixBrokenImgs();
    dedupeOnDevice();
    softWelcome();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 400); });
})();