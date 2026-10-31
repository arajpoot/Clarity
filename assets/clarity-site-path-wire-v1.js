/*! Clarity site path-wire v1 · 20261031W1
 * Project-wide section wiring: Daily · Companion · Campus
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_SITE_PATH_WIRE_V1__) return;
  w.__CLARITY_SITE_PATH_WIRE_V1__ = true;

  var COMP = "/?enter=companion#reminder";
  var DAILY = "/daily/";
  var CAMPUS = "/campus/";

  function mark(dest) {
    try {
      sessionStorage.setItem("clarity_landing_dest_v1", dest);
      if (dest === "companion") {
        sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
        sessionStorage.setItem("clarity_daily_first_skip_v1", "1");
        localStorage.setItem("clarity_shell_mode_v1", "companion");
      }
    } catch (e) {}
  }

  function rewriteAnchors() {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var text = (a.textContent || "").replace(/\s+/g, " ").trim();
      var low = text.toLowerCase();

      /* Bare / used as Companion return */
      if (href === "/" || href === "/index.html") {
        if (/companion|reminder doors|←\s*companion/i.test(text) || a.classList.contains("cu-main-link") || a.classList.contains("cu-companion-link") || a.getAttribute("data-path-wire") === "companion") {
          a.setAttribute("href", COMP);
          a.setAttribute("data-path-wire", "companion");
        }
      }

      /* Open daily / Day landing labels */
      if (/open daily|daily routines|daily page|day landing|yawm/i.test(low) && !/campus/i.test(low)) {
        if (href === "/" || href === "#" || href === "" || /setMode|landing/i.test(href)) {
          a.setAttribute("href", DAILY);
          a.setAttribute("data-path-wire", "daily");
        }
      }

      /* University path */
      if (/university path|campus path|campus desk|campus map/i.test(low)) {
        if (href === "/" || href === "#" || !href) {
          a.setAttribute("href", CAMPUS);
          a.setAttribute("data-path-wire", "campus");
        }
      }
    });

    /* Soft-map retired section paths → campus library/journey or companion */
    var map = {
      "/grave": "/campus/journey/",
      "/seerah": "/campus/journey/",
      "/tafseer": "/campus/library/",
      "/tajweed": "/campus/lab/",
      "/lectures": "/campus/library/",
      "/notes": "/?enter=companion#notes",
      "/meme": "/?enter=companion#reminder",
      "/commands": "/campus/library/",
      "/fiqh-tools": "/campus/library/",
      "/charter/": "/campus/",
    };
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("?")[0].split("#")[0];
      if (map[href]) {
        a.setAttribute("href", map[href]);
        a.setAttribute("data-path-wire", "remap");
      }
    });
  }

  function bindMarks() {
    document.querySelectorAll('a[data-path-wire="companion"], a[href*="enter=companion"]').forEach(function (a) {
      if (a.__pw) return;
      a.__pw = true;
      a.addEventListener("click", function () { mark("companion"); }, true);
    });
    document.querySelectorAll('a[data-path-wire="daily"], a[href="/daily/"], a[href*="/daily/"]').forEach(function (a) {
      if (a.__pw) return;
      a.__pw = true;
      a.addEventListener("click", function () { mark("daily"); }, true);
    });
    document.querySelectorAll('a[data-path-wire="campus"], a[href="/campus/"], a[href*="/campus/"]').forEach(function (a) {
      if (a.__pw) return;
      a.__pw = true;
      a.addEventListener("click", function () { mark("campus"); }, true);
    });
  }

  function boot() {
    try {
      rewriteAnchors();
      bindMarks();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    setTimeout(boot, 400);
    setTimeout(boot, 1500);
  });
})(typeof window !== "undefined" ? window : this);
