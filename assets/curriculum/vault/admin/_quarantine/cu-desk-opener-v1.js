/* Desk opener — collapse injected how, kill duplicate, scroll stage into view once */
(function (g) {
  "use strict";
  if (g.__CU_DESK_OPENER_V1__) return;
  g.__CU_DESK_OPENER_V1__ = true;
  if ((location.pathname || "").indexOf("/campus/desk") < 0) return;

  function compactHow(root) {
    root = root || document;
    root.querySelectorAll(".cpp-how").forEach(function (el) {
      if (el.tagName === "DETAILS" || el.classList.contains("cpp-how-compact")) return;
      if (el.getAttribute("data-opened") === "1") return;
      el.setAttribute("data-opened", "1");
      var html = el.innerHTML;
      var d = document.createElement("details");
      d.className = "cpp-how cpp-how-compact";
      d.innerHTML = "<summary>How phases work</summary><div class=\"cpp-how-body\">" + html + "</div>";
      el.parentNode.replaceChild(d, el);
    });
    /* hide static duplicate */
    document.querySelectorAll("details.desk-how").forEach(function (el) {
      el.style.display = "none";
    });
  }

  function scrollStageOnce() {
    if (sessionStorage.getItem("cu_desk_scrolled_v1") === "1") return;
    var stage = document.getElementById("clarity-campus-stage") || document.getElementById("campus-stage-body");
    if (!stage) return;
    try {
      stage.scrollIntoView({ block: "start", behavior: "smooth" });
      sessionStorage.setItem("cu_desk_scrolled_v1", "1");
    } catch (e) {}
  }

  function run() {
    compactHow();
    /* only auto-scroll if plaque is tall */
    var plaque = document.querySelector("#clarity-phase-plaque, .clarity-phase-plaque, [class*='phase-plaque']");
    if (plaque && plaque.offsetHeight > 120) {
      setTimeout(scrollStageOnce, 400);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  setTimeout(run, 300);
  setTimeout(run, 900);
  setTimeout(run, 1800);
  try {
    var obs = new MutationObserver(function () {
      compactHow();
    });
    obs.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () {
      try {
        obs.disconnect();
      } catch (e) {}
    }, 5000);
  } catch (e2) {}
})(typeof window !== "undefined" ? window : this);
