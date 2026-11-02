(function(){
"use strict";
if (window.__CLARITY_PATH_RESET_V1__) return;
window.__CLARITY_PATH_RESET_V1__ = true;

/**
 * Optional reset to Seeker level — clears unlock max and path progress.
 * User confirms before wipe.
 */
window.clarityPathResetToSeeker = function(){
  var ok = false;
  try {
    ok = window.confirm(
      "Reset learning path to Seeker?\n\n" +
      "• Unlocks higher doors again (quizzes return)\n" +
      "• Does not delete Vault / family tree / notes\n" +
      "• You choose this freely — it is optional"
    );
  } catch(e){ ok = true; }
  if (!ok) return { cancelled: true };

  try {
    localStorage.setItem("clarity_path_unlocked_max", "0");
    localStorage.setItem("clarity_path_quiz_passes", "{}");
    localStorage.setItem("clarity_committed_path", "seeker");
    localStorage.setItem("clarity_path_override", "seeker");
    localStorage.setItem("clarity_active_gate", "seeker");
    /* checklist key if present */
    try { localStorage.removeItem("clarity_path_checklist_v1"); } catch(e2){}
  } catch(e){}

  try {
    document.documentElement.setAttribute("data-clarity-path", "seeker");
    document.body.setAttribute("data-clarity-path", "seeker");
  } catch(e){}

  if (typeof window.clarityRequestPath === "function") {
    window.__clarityPathBypass = true;
    try { window.clarityRequestPath("seeker"); }
    finally { window.__clarityPathBypass = false; }
  } else if (typeof window.applyAdditiveFilter === "function") {
    window.applyAdditiveFilter("seeker");
  } else if (typeof window.applyGateSectionFilter === "function") {
    window.applyGateSectionFilter("seeker");
  }

  if (typeof window.switchTab === "function") {
    try { window.switchTab("reminder"); } catch(e){}
  }

  try {
    var badge = document.getElementById("current-mode-badge");
    if (badge) badge.textContent = "SEEKER JOURNEY MODE";
  } catch(e){}

  document.querySelectorAll(".cgs-btn[data-gate]").forEach(function(btn){
    var g = btn.getAttribute("data-gate");
    btn.classList.toggle("is-active", g === "seeker");
    btn.classList.toggle("path-locked", g !== "seeker");
  });

  return { ok: true, path: "seeker" };
};

/* Also expose on progress helper */
if (!window.clarityPathProgress) window.clarityPathProgress = {};
window.clarityPathProgress.reset = window.clarityPathResetToSeeker;
})();