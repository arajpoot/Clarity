/* Phase A — Spark quiz adab transformation (gentle unlock language) */
(function (g) {
  "use strict";
  if (g.__CU_SPARK_ADAB_V1__) return;
  g.__CU_SPARK_ADAB_V1__ = true;

  var RETRY = [
    "No worry — read the points once more, then try again with a calm heart.",
    "Take a breath. Understanding matters more than speed.",
    "Review the lesson summary, then return when ready. May Allah open it for you."
  ];
  var OK = [
    "BarakAllāhu fīk — may this knowledge sit with adab.",
    "A calm step is still a step. The next section is open.",
    "May Allah increase you in beneficial knowledge.",
    "Knowledge with adab is light. Continue gently."
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function rewriteTree(root) {
    if (!root || !root.querySelectorAll) return;
    var walk = root.querySelectorAll("button, a, h1, h2, h3, p, span, label, .craft-btn");
    walk.forEach(function (el) {
      if (el.closest && el.closest("#cu-bab-qubul")) return;
      var t = (el.textContent || "").trim();
      if (!t || t.length > 80) return;
      var low = t.toLowerCase();
      if (/prove it|unlock next|submit answer|check answer|try again|incorrect|wrong|fail|you failed/.test(low)) {
        if (/prove it/.test(low)) el.textContent = "Reflect & continue";
        else if (/unlock next/.test(low)) el.textContent = "Continue with adab";
        else if (/try again|incorrect|wrong|fail/.test(low)) el.textContent = pick(RETRY);
        else if (/submit|check answer/.test(low)) el.textContent = "Share your understanding";
      }
    });
  }

  function softOverlay() {
    /* Wrap clarityOpenModuleSparkQuiz if present */
    var prev = g.clarityOpenModuleSparkQuiz;
    if (typeof prev === "function" && !prev.__adab) {
      g.clarityOpenModuleSparkQuiz = function () {
        var r = prev.apply(this, arguments);
        setTimeout(function () {
          rewriteTree(document.body);
          var modal = document.querySelector(
            ".clarity-spark-quiz, .spark-quiz-modal, [class*='spark'], [id*='spark']"
          );
          if (modal) rewriteTree(modal);
        }, 80);
        return r;
      };
      g.clarityOpenModuleSparkQuiz.__adab = true;
    }
  }

  var obs = new MutationObserver(function () {
    rewriteTree(document.body);
  });

  function boot() {
    softOverlay();
    rewriteTree(document.body);
    try {
      obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
    g.addEventListener("clarity-vault-ready", function () {
      softOverlay();
      rewriteTree(document.body);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClaritySparkAdab = { retry: RETRY, ok: OK, rewrite: rewriteTree };
})(typeof window !== "undefined" ? window : this);
