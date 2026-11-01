(function(){
  "use strict";
  if (window.__CLARITY_BANNER_NUCLEAR__) return;
  window.__CLARITY_BANNER_NUCLEAR__ = true;

  function nuclear() {
    var banner = document.querySelector("#clarity-top-duo .banner") || document.querySelector(".banner");
    if (!banner) return;

    var overlay = banner.querySelector(".banner-overlay");
    var media = document.getElementById("banner-media") || banner.querySelector(".banner-media");
    var ifr = document.getElementById("banner-live");
    var img = document.getElementById("banner-img");

    /* Always re-parent media as first child of banner */
    if (media) {
      if (media.parentNode !== banner) banner.insertBefore(media, banner.firstChild);
      media.setAttribute("aria-hidden", "true");
    }
    if (img && media && img.parentNode !== media) media.appendChild(img);
    if (ifr && media && ifr.parentNode !== media) media.appendChild(ifr);

    /* Size banner from overlay only */
    if (overlay) {
      var h = overlay.offsetHeight;
      if (h > 80) {
        banner.style.height = h + "px";
        banner.style.maxHeight = Math.min(h, 280) + "px";
      }
    }
    banner.style.overflow = "hidden";

    /* Live off by default unless media has live-active */
    if (ifr && media && !media.classList.contains("live-active")) {
      ifr.setAttribute("hidden", "");
      try {
        if (ifr.src) { ifr.src = ""; ifr.removeAttribute("src"); }
      } catch(e){}
    }

    /* Destroy escaped clones */
    document.querySelectorAll("#banner-live, #banner-img, .banner-media").forEach(function(node){
      if (!banner.contains(node)) {
        try { node.remove(); } catch(e) { node.style.display = "none"; }
      }
    });
  }

  /* When user enables Live, allow src then re-clip */
  function wrapLive() {
    var btn = document.getElementById("live-haramain-btn");
    if (btn && !btn.__nuclear) {
      btn.addEventListener("click", function(){ setTimeout(nuclear, 50); setTimeout(nuclear, 300); }, true);
      btn.__nuclear = true;
    }
  }

  function boot(){ nuclear(); wrapLive(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  window.addEventListener("load", function(){ setTimeout(nuclear, 200); setTimeout(nuclear, 800); });
  window.addEventListener("resize", function(){ setTimeout(nuclear, 50); });
})();
