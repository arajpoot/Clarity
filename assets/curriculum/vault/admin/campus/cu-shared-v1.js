/* Clarity University shared — enroll + local progress strip */
(function (g) {
  "use strict";
  if (g.__CLARITY_CU_SHARED_V1__) return;
  g.__CLARITY_CU_SHARED_V1__ = true;

  var PHASE_KEY = "clarity_curriculum_phase_v1";
  var map = { seeker: 1, new_muslim: 2, practicing: 3, daily: 3, dai: 4 };

  function enroll(path) {
    path = String(path || "seeker");
    if (path === "daily") path = "practicing";
    try {
      localStorage.setItem("clarity_path_focus", path);
      localStorage.setItem("clarity_committed_path", path);
      localStorage.setItem(PHASE_KEY, String(map[path] || 1));
    } catch (e) {}
    try {
      if (typeof g.clarityWelcomePickTrack === "function") g.clarityWelcomePickTrack(path);
    } catch (e2) {}
    try {
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { path: path, pathI: (map[path] || 1) - 1 } }));
    } catch (e3) {}
    var stage = document.getElementById("cu-stage") || document.getElementById("campus-stage-body");
    if (stage) stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function progressText() {
    var ph = 1;
    try {
      ph = parseInt(localStorage.getItem(PHASE_KEY) || "1", 10) || 1;
    } catch (e) {}
    var labels = ["", "Seeker · Foundations", "New Muslim · Practice", "Daily · Consistency", "Da'i · Transmission"];
    return "Active phase " + ph + "/4 · " + (labels[ph] || "Foundations") + " · records on this device only";
  }

  function paintProgress() {
    var el = document.getElementById("cu-progress-strip");
    if (!el) return;
    el.textContent = progressText();
  }

  function bindEnroll() {
    document.querySelectorAll("[data-enroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        enroll(btn.getAttribute("data-enroll"));
        paintProgress();
      });
    });
  }

  g.ClarityUniversityChrome = { enroll: enroll, progressText: progressText, paintProgress: paintProgress };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      bindEnroll();
      paintProgress();
    });
  } else {
    bindEnroll();
    paintProgress();
  }
  g.addEventListener("clarity-path-changed", paintProgress);
})(typeof window !== "undefined" ? window : this);
