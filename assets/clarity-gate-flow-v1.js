/** Phase E — Gate-on first surface · 20261021PERF */
(function (w) {
  "use strict";
  if (w.__CLARITY_GATE_FLOW_V1__) return;
  w.__CLARITY_GATE_FLOW_V1__ = true;

  function isGate() {
    try {
      if (document.body.classList.contains("gate-mode")) return true;
      if (document.documentElement.getAttribute("data-gate") === "1") return true;
      var btn = document.querySelector("[data-gate-mode], #gate-mode, .gate-mode-toggle");
      if (btn && (btn.getAttribute("aria-pressed") === "true" || btn.classList.contains("active"))) return true;
    } catch (e) {}
    return false;
  }

  function apply() {
    var gate = isGate();
    document.documentElement.classList.toggle("cph-gate-on", gate);
    /* hide bulky secondary strips when gate — keep Today + adhkār + tabs */
    var selectors = [
      ".phased-learning-strip",
      "#phased-learning",
      ".dual-path-tiles",
      ".path-tiles-row"
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (gate) {
          el.setAttribute("data-cph-gate-hidden", "1");
          el.style.display = "none";
        } else if (el.getAttribute("data-cph-gate-hidden") === "1") {
          el.style.display = "";
          el.removeAttribute("data-cph-gate-hidden");
        }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
  setTimeout(apply, 600);
  setTimeout(apply, 2000);
  document.addEventListener("click", function () {
    setTimeout(apply, 50);
  });
})(window);
