/*! companion-nuros-chrome-n1.js — N1 bridge mark only */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_NUROS_CHROME_N1__) return;
  w.__CLARITY_NUROS_CHROME_N1__ = true;
  try {
    d.documentElement.classList.add("nuros-chrome-n1");
    if (d.body) d.body.classList.add("nuros-chrome-n1");
    else
      d.addEventListener("DOMContentLoaded", function () {
        if (d.body) d.body.classList.add("nuros-chrome-n1");
      });
  } catch (e) {}
})(window, document);
