/**
 * companion-quiz-to-day-v1.js · 20261026QUIZ2
 * Places #fiqh-quiz-card into its OWN Day landing section (#cdl-quiz-section),
 * not inside trust/review plaques grid.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_QUIZ_TO_DAY_V2__) return;
  g.__CLARITY_QUIZ_TO_DAY_V2__ = true;

  function ensureSection() {
    var sec = document.getElementById("cdl-quiz-section");
    var slot = document.getElementById("cdl-fiqh-quiz-slot");
    if (sec && slot) return slot;

    var day = document.getElementById("clarity-day-landing");
    if (!day) return null;

    /* Prefer insert before trust grid / review plaque — full width sibling */
    var trust =
      document.getElementById("cdl-trust-grid") ||
      document.getElementById("cdl-trust-review-plaque") ||
      day.querySelector(".cdl-trust-grid");

    sec = document.createElement("section");
    sec.id = "cdl-quiz-section";
    sec.className = "cdl-block cdl-quiz-section";
    sec.setAttribute("aria-label", "Daily quiz");
    sec.innerHTML =
      '<div class="cdl-quiz-section-head">' +
      "<h2 class=\"cdl-h\">🧠 Daily quiz</h2>" +
      '<p class="cdl-sub">Fiqh &amp; Sharia IQ · educational only — not a fatwa</p>' +
      "</div>" +
      '<div id="cdl-fiqh-quiz-slot" class="cdl-fiqh-quiz-slot"></div>';

    if (trust) {
      var anchor = trust.closest("section") || trust;
      if (anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor);
      else day.appendChild(sec);
    } else {
      day.appendChild(sec);
    }
    return document.getElementById("cdl-fiqh-quiz-slot");
  }

  function moveQuiz() {
    var card = document.getElementById("fiqh-quiz-card");
    if (!card) return false;
    var slot = ensureSection();
    if (!slot) return false;

    /* If slot was wrongly inside trust grid, hoist section out */
    var sec = document.getElementById("cdl-quiz-section");
    var grid = document.getElementById("cdl-trust-grid") || document.querySelector(".cdl-trust-grid");
    if (sec && grid && grid.contains(sec)) {
      var anchor = grid.closest("section") || grid;
      if (anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor);
    }

    if (card.parentNode !== slot) {
      slot.appendChild(card);
    }
    try {
      card.setAttribute("data-home", "day-quiz-section");
      card.style.width = "100%";
      card.style.maxWidth = "100%";
      card.style.boxSizing = "border-box";
    } catch (e) {}
    return true;
  }

  function boot() {
    moveQuiz();
    setTimeout(moveQuiz, 350);
    setTimeout(moveQuiz, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(moveQuiz, 250); });
  try {
    var obs = new MutationObserver(function () {
      if (document.documentElement.getAttribute("data-shell-mode") === "landing") moveQuiz();
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-shell-mode"] });
  } catch (e) {}

  g.ClarityQuizToDay = { move: moveQuiz };
})(typeof window !== "undefined" ? window : this);
