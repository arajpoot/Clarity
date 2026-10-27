/**
 * companion-quiz-to-day-v1.js · 20261026FINAL
 * Full-width quiz host · scrub residual trust tile
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_QUIZ_TO_DAY_V5__) return;
  g.__CLARITY_QUIZ_TO_DAY_V5__ = true;

  function scrub() {
    document.querySelectorAll(".cdl-trust-plaque, article").forEach(function (el) {
      var t = (el.textContent || "").toLowerCase();
      if (t.indexOf("moved here for daily") >= 0) el.remove();
    });
  }

  function ensure() {
    var slot = document.getElementById("cdl-fiqh-quiz-slot");
    var sec = document.getElementById("cdl-quiz-section");
    if (slot && sec && !sec.closest(".cdl-trust-grid")) {
      sec.style.width = "100%";
      sec.style.maxWidth = "none";
      return slot;
    }
    var day = document.getElementById("clarity-day-landing");
    if (!day) return null;
    var trust = document.querySelector(".cdl-trust-grid") || document.getElementById("cdl-trust-review-plaque");
    if (!sec) {
      sec = document.createElement("section");
      sec.id = "cdl-quiz-section";
      sec.className = "cdl-block cdl-quiz-section";
      sec.innerHTML =
        '<div class="cdl-quiz-section-head"><h2 class="cdl-h">🧠 Daily quiz</h2>' +
        '<p class="cdl-sub">Fiqh &amp; Sharia IQ · educational only — not a fatwa</p></div>' +
        '<div id="cdl-fiqh-quiz-slot" class="cdl-fiqh-quiz-slot"></div>';
    }
    if (trust) {
      var anchor = trust.closest("section") || trust;
      if (anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor);
    } else if (!sec.parentNode) day.appendChild(sec);
    sec.style.width = "100%";
    sec.style.maxWidth = "none";
    return document.getElementById("cdl-fiqh-quiz-slot");
  }

  function move() {
    scrub();
    var card = document.getElementById("fiqh-quiz-card");
    if (!card) return;
    var slot = ensure();
    if (slot && card.parentNode !== slot) slot.appendChild(card);
    card.style.width = "100%";
    card.style.maxWidth = "none";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", move);
  else move();
  setTimeout(move, 400);
  setTimeout(move, 1000);
})(typeof window !== "undefined" ? window : this);
