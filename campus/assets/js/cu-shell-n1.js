/**
 * N1 shell guard — keep pills under banner; stage is the only curriculum host.
 * University only. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_SHELL_N1__) return;
  g.__CU_SHELL_N1__ = true;

  function main() {
    return document.querySelector("main.cu-wrap");
  }

  function ensureOrder() {
    var m = main();
    if (!m) return;
    var pills = m.querySelector("nav.cu-pills");
    if (pills && m.firstElementChild !== pills) {
      m.insertBefore(pills, m.firstElementChild);
    }
    /* Move stray nav.cu-pills cloned lower back to top */
    var allPills = m.querySelectorAll("nav.cu-pills");
    if (allPills.length > 1) {
      for (var i = 1; i < allPills.length; i++) {
        try {
          allPills[i].parentNode.removeChild(allPills[i]);
        } catch (e) {}
      }
      ensureOrder();
    }
  }

  function guardStage() {
    var stage = document.getElementById("cu-stage");
    if (stage) stage.setAttribute("data-shell-stage", "1");
  }

  function boot() {
    ensureOrder();
    guardStage();
    var m = main();
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      var obs = new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(ensureOrder, 80);
      });
      obs.observe(m, { childList: true, subtree: false });
    }
    setTimeout(ensureOrder, 400);
    setTimeout(ensureOrder, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window);
