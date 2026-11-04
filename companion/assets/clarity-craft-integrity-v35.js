/*! Craft integrity cues v35 · from Archive2 feature-pack patterns · lazy-safe */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_INTEGRITY_V35__) return;
  w.__CLARITY_CRAFT_INTEGRITY_V35__ = true;

  function ensureMeter(hostId, meterId) {
    var host = d.getElementById(hostId);
    if (!host) return;
    var m = d.getElementById(meterId);
    if (m) return m;
    m = d.createElement("div");
    m.id = meterId;
    m.className = "clarity-level-meter";
    m.setAttribute("role", "status");
    m.innerHTML =
      '<div class="clm-bar" style="height:6px;border-radius:99px;background:rgba(15,76,58,.15);overflow:hidden">' +
      '<div class="clm-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#0f4c3a,#c9a227);transition:width .08s linear"></div></div>' +
      '<span class="clm-label" style="font-size:.72rem;opacity:.8">Input level</span>';
    host.appendChild(m);
    return m;
  }

  function setLevel(meterId, pct) {
    var m = d.getElementById(meterId);
    if (!m) return;
    var fill = m.querySelector(".clm-fill");
    if (fill) fill.style.width = Math.max(0, Math.min(100, pct || 0)) + "%";
  }

  w.clarityEnsureCraftMeters = function () {
    ensureMeter("tj-record-panel", "tj-input-meter");
    ensureMeter("callig-canvas-tools", "callig-input-meter");
    ensureMeter("lmr-record-wrap", "lmr-input-meter");
  };

  w.claritySetInputLevel = setLevel;

  d.addEventListener("clarity-craft-ready", function () {
    try {
      w.clarityEnsureCraftMeters();
    } catch (e) {}
  });

  if (d.readyState !== "loading") {
    try {
      w.clarityEnsureCraftMeters();
    } catch (e) {}
  } else {
    d.addEventListener("DOMContentLoaded", function () {
      try {
        w.clarityEnsureCraftMeters();
      } catch (e) {}
    });
  }
})(window, document);
