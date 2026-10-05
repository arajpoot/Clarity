(function(){
  "use strict";
  if (window.__NUROS_NULL_GUARD__) return;
  window.__NUROS_NULL_GUARD__ = true;

  function ensureStub(id, tag, attrs) {
    if (document.getElementById(id)) return document.getElementById(id);
    var el = document.createElement(tag || "div");
    el.id = id;
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    if (attrs) Object.keys(attrs).forEach(function(k){ el.setAttribute(k, attrs[k]); });
    document.body.appendChild(el);
    return el;
  }

  function ensureStreamStubs() {
    /* Only ensure audio element — controls live in the polished banner */
    if (!document.getElementById("quran-audio")) {
      ensureStub("quran-audio", "audio", { preload: "none", crossorigin: "anonymous" });
    }
  }

  function unhideApp() {
    var ws = document.getElementById("main-application-workspace");
    if (ws) {
      ws.classList.remove("hidden");
      ws.style.display = "";
      ws.removeAttribute("hidden");
    }
    /* also common gate wrappers */
    document.querySelectorAll(".gate-container, #clarity-welcome, #clarity-gate").forEach(function(el) {
      /* do not force-hide gate if user intentionally on gate — only ensure main is visible if tabs exist */
    });
    var main = document.getElementById("main-content") || document.querySelector(".page-wrapper");
    if (main) {
      main.classList.remove("hidden");
      main.style.visibility = "visible";
      main.style.display = "";
    }
    document.body.classList.add("app-ready");
  }

  function safeWrappers() {
    if (typeof window.changeStream === "function" && !window.changeStream._safe) {
      var cs = window.changeStream;
      window.changeStream = function(){ try { return cs.apply(this, arguments); } catch(e) { console.warn("changeStream", e); } };
      window.changeStream._safe = true;
    }
    if (typeof window.toggleQuranStream === "function" && !window.toggleQuranStream._safe) {
      var tq = window.toggleQuranStream;
      window.toggleQuranStream = function(){ try { return tq.apply(this, arguments); } catch(e) { console.warn("toggleQuranStream", e); } };
      window.toggleQuranStream._safe = true;
    }
    if (typeof window.setDailyBanner === "function" && !window.setDailyBanner._safe) {
      var sb = window.setDailyBanner;
      window.setDailyBanner = function(){ try { return sb.apply(this, arguments); } catch(e) { console.warn("setDailyBanner", e); } };
      window.setDailyBanner._safe = true;
    }
  }

  function boot() {
    ensureStreamStubs();
    unhideApp();
    safeWrappers();
  }
  /* Run ASAP — before deferred boot that crashes */
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
  document.addEventListener("DOMContentLoaded", function(){ ensureStreamStubs(); unhideApp(); });
  window.addEventListener("load", function(){ ensureStreamStubs(); unhideApp(); safeWrappers(); });
})();