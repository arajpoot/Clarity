/* Phase 0 — Link trust: soft controls get real targets */
(function (g) {
  "use strict";
  if (g.__CU_LINK_TRUST_V1__) return;
  g.__CU_LINK_TRUST_V1__ = true;

  function fix() {
    /* Medallions always include phase query */
    document.querySelectorAll("a.cu-medallion[data-phase-medal]").forEach(function (a) {
      var ph = a.getAttribute("data-phase-medal");
      if (!ph) return;
      var href = a.getAttribute("href") || "";
      if (href.indexOf("phase=") < 0) {
        a.setAttribute("href", "/campus/desk/?phase=" + encodeURIComponent(ph));
      }
    });

    /* Lab station buttons if present without handler */
    document.querySelectorAll(".lab-station[data-station]").forEach(function (btn) {
      if (btn.__trust) return;
      btn.__trust = true;
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-station");
        var stage = document.getElementById("lab-stage");
        if (!stage) return;
        if (id === "callig" && g.ClarityCalligraphy) g.ClarityCalligraphy.open(stage);
        else if (id === "tajweed" && g.ClarityTajweedStudio) g.ClarityTajweedStudio.open(stage);
        else if (id === "media" && g.ClarityMediaReminder) g.ClarityMediaReminder.open(stage);
        else if (id === "research") {
          stage.innerHTML =
            '<div class="craft-root"><h2>Research Bench</h2><p class="craft-lead">Open the Library for shelves. Capture three takeaways and one question for a teacher.</p>' +
            '<p><a class="craft-btn" href="/library/">Open Library</a></p></div>';
        } else if (id === "design") {
          stage.innerHTML =
            '<div class="craft-root"><h2>Module Design</h2><p class="craft-lead">Prototype on-device only — educational draft for librarian review, not publication.</p></div>';
        }
      });
    });

    /* Continue / primary learning CTAs */
    document.querySelectorAll("[data-continue-learning], .cu-continue a, a.cu-continue").forEach(function (a) {
      if (!a.getAttribute("href") || a.getAttribute("href") === "#") {
        a.setAttribute("href", "/campus/desk/?phase=seeker");
      }
    });

    /* Spark button label softener already in adab; ensure spark handler exists */
    document.querySelectorAll(".junior-spark-btn").forEach(function (b) {
      if ((b.textContent || "").indexOf("Prove it") >= 0) {
        b.textContent = "Reflect & continue";
      }
    });
  }

  function boot() {
    fix();
    var obs = new MutationObserver(function () {
      fix();
    });
    try {
      obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
