(function(){
  "use strict";
  if (window.__CLARITY_EMBED_FOLD__) return;
  window.__CLARITY_EMBED_FOLD__ = true;
  function apply(d){
    if (!d || !d.classList.contains("clarity-embed-fold")) return;
    var body = d.querySelector(".clarity-embed-body");
    var iframes = d.querySelectorAll("iframe");
    if (d.open) {
      if (body) {
        body.style.cssText = "display:block;position:relative;width:100%;padding:0;background:#000;aspect-ratio:16/9;height:auto";
      }
      iframes.forEach(function(f){
        f.style.cssText = "display:block;position:absolute;inset:0;width:100%;height:100%;border:0";
        var ds = f.getAttribute("data-src");
        if (ds && (!f.getAttribute("src") || f.getAttribute("src") === "about:blank")) f.setAttribute("src", ds);
      });
    } else {
      if (body) body.style.cssText = "display:none;height:0;padding:0;margin:0";
      iframes.forEach(function(f){
        var src = f.getAttribute("src") || "";
        if (src && src !== "about:blank") {
          if (!f.getAttribute("data-src")) f.setAttribute("data-src", src);
          f.setAttribute("src", "about:blank");
        }
        f.style.cssText = "display:none;height:0";
      });
      var p = d.parentElement;
      for (var i = 0; i < 5 && p; i++) {
        if (/player-wrap|lecture-player|hajj-video|spotify-player/i.test((p.className||"")+(p.id||""))) {
          p.style.paddingBottom = "0"; p.style.height = "auto"; p.style.minHeight = "0";
        }
        p = p.parentElement;
      }
    }
  }
  function all(){
    document.querySelectorAll("details.clarity-embed-fold").forEach(function(d){
      var s = d.querySelector("summary");
      if (s) { s.style.display = "block"; s.style.visibility = "visible"; }
      if (!d.hasAttribute("data-fold-ready")) { d.removeAttribute("open"); d.setAttribute("data-fold-ready","1"); }
      apply(d);
    });
  }
  document.addEventListener("toggle", function(ev){
    if (ev.target && ev.target.classList && ev.target.classList.contains("clarity-embed-fold")) apply(ev.target);
  }, true);
  function boot(){ all(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(all, 100); setTimeout(all, 500); });
  document.addEventListener("click", function(ev){
    if (ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-tab],.door-rail-btn")) setTimeout(all, 120);
  }, true);
})();