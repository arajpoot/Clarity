/*! companion-nuros-tokens-v1.js · Phase G
 * Applies nuros-tokens-g1 class · loads max-3 fonts once
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__NUROS_TOKENS_G1__) return;
  w.__NUROS_TOKENS_G1__ = true;

  try {
    d.documentElement.classList.add("nuros-tokens-g1");
    if (d.body) d.body.classList.add("nuros-tokens-g1");
  } catch (e) {}

  function ensureFonts() {
    if (d.getElementById("nuros-tokens-fonts-g1")) return;
    var link = d.createElement("link");
    link.id = "nuros-tokens-fonts-g1";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&family=Scheherazade+New:wght@400;700&display=swap";
    d.head.appendChild(link);
  }
  ensureFonts();
})(window, document);
