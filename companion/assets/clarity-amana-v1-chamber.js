/*! clarity-amana-v1-chamber · hide vault Dayn until unlock */
(function () {
  "use strict";
  if (window.__CLARITY_AMANA_V1_CHAMBER__) return;
  window.__CLARITY_AMANA_V1_CHAMBER__ = true;

  var STYLE = document.createElement("style");
  STYLE.textContent = [
    "#tab-notes.amana-locked #clarity-dayn-vault-section { display: none !important; }",
    "body:not([data-amana-unlocked='1']) #tab-notes #clarity-dayn-vault-section { display: none !important; }",
    "body[data-amana-unlocked='1'] #tab-notes #clarity-dayn-vault-section { display: block !important; }",
    "#tab-notes .amana-vault-gate .av-brand::after { content: ' · use /amana/ room'; font-weight: 600; font-size: 0.75rem; opacity: 0.85; }",
  ].join("\n");
  document.head.appendChild(STYLE);

  function unlock() {
    try {
      document.body.setAttribute("data-amana-unlocked", "1");
      var sec = document.getElementById("clarity-dayn-vault-section");
      if (sec) { sec.hidden = false; sec.style.display = ""; }
    } catch (e) {}
  }
  function lock() {
    try {
      document.body.setAttribute("data-amana-unlocked", "0");
    } catch (e) {}
  }

  // Heuristic: tab-notes loses amana-locked when unlocked by existing gate
  try {
    var tab = document.getElementById("tab-notes");
    if (tab) {
      var obs = new MutationObserver(function () {
        if (!tab.classList.contains("amana-locked")) unlock();
        else lock();
      });
      obs.observe(tab, { attributes: true, attributeFilter: ["class"] });
      setTimeout(function(){ try { obs.disconnect(); } catch(e){} }, 20000);
      if (!tab.classList.contains("amana-locked")) unlock();
    }
  } catch (e2) {}

  document.addEventListener("clarity-amana-unlocked", unlock);
  window.ClarityAmanaSetUnlocked = function (on) { if (on) unlock(); else lock(); };
})();
