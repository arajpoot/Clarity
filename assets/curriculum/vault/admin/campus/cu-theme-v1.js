/* University theme: day / night / system — localStorage */
(function (g) {
  "use strict";
  if (g.__CU_THEME_V1__) return;
  g.__CU_THEME_V1__ = true;

  var KEY = "clarity_univ_theme_v1";

  function get() {
    try {
      return localStorage.getItem(KEY) || "system";
    } catch (e) {
      return "system";
    }
  }

  function apply(mode) {
    var m = mode === "light" || mode === "dark" || mode === "system" ? mode : "system";
    try {
      document.documentElement.setAttribute("data-theme", m);
    } catch (e) {}
    try {
      localStorage.setItem(KEY, m);
    } catch (e2) {}
    document.querySelectorAll(".cu-theme-ctl button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-set") === m ? "true" : "false");
    });
  }

  function injectControl() {
    var banner = document.querySelector("header.cu-banner");
    if (!banner || banner.querySelector(".cu-theme-ctl")) return;
    var wrap = document.createElement("div");
    wrap.className = "cu-theme-ctl";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Color theme");
    [
      ["light", "Day"],
      ["dark", "Night"],
      ["system", "Auto"]
    ].forEach(function (pair) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-theme-set", pair[0]);
      b.textContent = pair[1];
      b.title = pair[1] + " theme";
      b.addEventListener("click", function () {
        apply(pair[0]);
      });
      wrap.appendChild(b);
    });
    var right = banner.querySelector(".cu-main-link");
    if (right && right.parentNode === banner) {
      banner.insertBefore(wrap, right);
    } else {
      banner.appendChild(wrap);
    }
  }

  function boot() {
    apply(get());
    injectControl();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityUnivTheme = { apply: apply, get: get };
})(typeof window !== "undefined" ? window : this);
