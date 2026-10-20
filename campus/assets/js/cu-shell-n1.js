/**
 * N1 shell guard — ordered stack inside main:
 *   desk-verse (optional) → pills → status → stage
 * Never force pills above verse. University only.
 */
(function (g) {
  "use strict";
  if (g.__CU_SHELL_N1_V2__) return;
  g.__CU_SHELL_N1_V2__ = true;

  function main() {
    return document.querySelector("main.cu-wrap");
  }

  function ensureOrder() {
    var m = main();
    if (!m) return;

    var verse = m.querySelector(".cu-desk-verse, .cu-verse-plaque, [data-desk-verse]");
    var pills = m.querySelector("nav.cu-pills");
    var status = m.querySelector("[data-cu-student-status]");
    var stage = document.getElementById("cu-stage") || m.querySelector("[data-shell-stage]");

    // Dedupe pills inside main
    var allPills = m.querySelectorAll("nav.cu-pills");
    for (var i = 1; i < allPills.length; i++) {
      try { allPills[i].parentNode.removeChild(allPills[i]); } catch (e) {}
    }
    pills = m.querySelector("nav.cu-pills");

    // Rebuild preferred order without wiping stage content
    var nodes = [];
    if (verse) nodes.push(verse);
    if (pills) nodes.push(pills);
    if (status) nodes.push(status);
    if (stage) nodes.push(stage);

    // Append other main children (not already listed) after stage
    var known = {};
    nodes.forEach(function (n) { known[n] = true; });
    Array.prototype.forEach.call(m.children, function (ch) {
      if (!known[ch] && ch.tagName !== "SCRIPT") nodes.push(ch);
    });

    nodes.forEach(function (n) {
      try { m.appendChild(n); } catch (e) {}
    });
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
        t = setTimeout(ensureOrder, 100);
      });
      obs.observe(m, { childList: true, subtree: false });
    }
    setTimeout(ensureOrder, 300);
    setTimeout(ensureOrder, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
