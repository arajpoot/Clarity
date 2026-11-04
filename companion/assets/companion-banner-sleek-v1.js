/*! companion-banner-sleek-v1 · ṣalāh to right · slim plaques */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_BANNER_SLEEK_V1__) return;
  w.__CLARITY_BANNER_SLEEK_V1__ = true;

  function ensureLayout() {
    var ov = d.querySelector(".banner-overlay");
    if (!ov) return;
    var left = ov.querySelector(".banner-side.left");
    var center = ov.querySelector(".banner-center");
    var right = ov.querySelector(".banner-side.right");
    var salah = ov.querySelector(".salah-times-section");
    var cal = ov.querySelector(".hijri-cal-section");

    if (salah && right && salah.parentElement !== right) {
      right.appendChild(salah);
    }
    if (cal && left && cal.parentElement !== left) {
      left.appendChild(cal);
    }
    /* order in overlay */
    if (left && center && right) {
      ov.appendChild(left);
      ov.appendChild(center);
      ov.appendChild(right);
    }
    /* hide duplicate mid nav: 3-pill Companion Yawm Campus between room-nav and global-nav */
    d.querySelectorAll(".clarity-room-nav").forEach(function (nav, i) {
      if (i > 0 && !nav.classList.contains("door-rail-bottom")) {
        var links = nav.querySelectorAll("a, button");
        if (links.length <= 4 && nav.id !== "clarity-door-rail") {
          /* second compact room row */
          if (!nav.closest("#clarity-global-nav")) {
            nav.setAttribute("data-duplicate-room-nav", "1");
            nav.style.display = "none";
          }
        }
      }
    });
  }

  function boot() {
    ensureLayout();
    setTimeout(ensureLayout, 200);
    setTimeout(ensureLayout, 800);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(ensureLayout, 100); });
})(window, document);
