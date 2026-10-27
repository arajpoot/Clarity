/**
 * companion-quiz-to-day-v1.js · 20261026NIGHT2
 * Full-width day section only; remove residual trust-grid quiz tile.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_QUIZ_TO_DAY_V4__) return;
  g.__CLARITY_QUIZ_TO_DAY_V4__ = true;

  function scrubTrustQuizTile() {
    document.querySelectorAll(".cdl-trust-plaque, article").forEach(function (el) {
      var t = (el.textContent || "").toLowerCase();
      if (t.indexOf("moved here for daily") >= 0 ||
          (t.indexOf("daily quiz") >= 0 && t.indexOf("fiqh") >= 0 && t.indexOf("online fetch kept") >= 0 && el.closest(".cdl-trust-grid"))) {
        if (el.parentNode) el.parentNode.removeChild(el);
      }
    });
  }

  function ensureSection() {
    var sec = document.getElementById("cdl-quiz-section");
    var slot = document.getElementById("cdl-fiqh-quiz-slot");
    if (sec && slot && !sec.closest(".cdl-trust-grid")) return slot;

    var day = document.getElementById("clarity-day-landing");
    if (!day) return null;

    var trust =
      document.getElementById("cdl-trust-grid") ||
      document.querySelector(".cdl-trust-grid") ||
      document.getElementById("cdl-trust-review-plaque");

    if (!sec) {
      sec = document.createElement("section");
      sec.id = "cdl-quiz-section";
      sec.className = "cdl-block cdl-quiz-section";
      sec.setAttribute("aria-label", "Daily quiz");
      sec.innerHTML =
        '<div class="cdl-quiz-section-head">' +
        '<h2 class="cdl-h">🧠 Daily quiz</h2>' +
        '<p class="cdl-sub">Fiqh &amp; Sharia IQ · educational only — not a fatwa</p>' +
        "</div>" +
        '<div id="cdl-fiqh-quiz-slot" class="cdl-fiqh-quiz-slot"></div>';
    }
    if (trust) {
      var anchor = trust.closest("section") || trust;
      if (anchor.parentNode) {
        if (sec.parentNode !== anchor.parentNode || (trust.compareDocumentPosition && (sec.compareDocumentPosition(trust) & 4) === 0)) {
          anchor.parentNode.insertBefore(sec, anchor);
        }
      }
    } else if (!sec.parentNode) {
      day.appendChild(sec);
    }
    return document.getElementById("cdl-fiqh-quiz-slot");
  }

  function moveQuiz() {
    scrubTrustQuizTile();
    var card = document.getElementById("fiqh-quiz-card");
    if (!card) return false;
    var slot = ensureSection();
    if (!slot) return false;
    if (card.parentNode !== slot) slot.appendChild(card);
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
  g.ClarityQuizToDay = { move: moveQuiz, scrub: scrubTrustQuizTile };
})(typeof window !== "undefined" ? window : this);
