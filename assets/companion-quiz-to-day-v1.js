/**
 * companion-quiz-to-day-v1.js · 20261026QUIZ
 * Moves #fiqh-quiz-card into Day landing slot (before Auto review).
 * DOM move preserves listeners / siq* online fetch. Campus untouched.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_QUIZ_TO_DAY_V1__) return;
  g.__CLARITY_QUIZ_TO_DAY_V1__ = true;

  function moveQuiz() {
    var card = document.getElementById("fiqh-quiz-card");
    var slot = document.getElementById("cdl-fiqh-quiz-slot");
    if (!card) return false;
    if (!slot) {
      /* create slot before review plaque if landing already painted */
      var review = document.getElementById("cdl-trust-review-plaque");
      if (review && review.parentNode) {
        slot = document.createElement("section");
        slot.id = "cdl-fiqh-quiz-slot";
        slot.className = "cdl-block cdl-quiz-host";
        slot.setAttribute("aria-label", "Daily Fiqh and Sharia IQ");
        review.parentNode.insertBefore(slot, review);
      } else {
        /* fallback: append near day landing */
        var day = document.getElementById("clarity-day-landing");
        if (!day) return false;
        slot = document.createElement("section");
        slot.id = "cdl-fiqh-quiz-slot";
        slot.className = "cdl-block cdl-quiz-host";
        day.appendChild(slot);
      }
    }
    if (card.parentNode === slot) return true;
    slot.appendChild(card); /* move node — keeps onclick / siq wiring */
    card.style.marginTop = "0.75rem";
    try {
      card.setAttribute("data-home", "day-landing");
    } catch (e) {}
    return true;
  }

  function boot() {
    moveQuiz();
    setTimeout(moveQuiz, 400);
    setTimeout(moveQuiz, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(moveQuiz, 300); });

  /* When shell switches to landing, ensure quiz is in place */
  try {
    var obs = new MutationObserver(function () {
      if (document.documentElement.getAttribute("data-shell-mode") === "landing") moveQuiz();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}

  g.ClarityQuizToDay = { move: moveQuiz };
})(typeof window !== "undefined" ? window : this);
