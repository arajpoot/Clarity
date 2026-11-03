/*! Amānah engine unlock patch v1
 * Removes lock-shell overlay when vault becomes unlocked.
 * Fixes chamber "freeze" when user unlocks then opens /amana/dayn/.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UNLOCK_PATCH_V1__) return;
  w.__CLARITY_AMANA_UNLOCK_PATCH_V1__ = true;

  function removeLockShell() {
    try {
      var shell = document.getElementById("amana-engine-lock-shell");
      if (shell) shell.remove();
      // Re-enable controls the shell may have disabled
      document.querySelectorAll("main input, main button, main select, main textarea").forEach(function (el) {
        try {
          el.disabled = false;
        } catch (e) {}
      });
    } catch (e) {}
  }

  function onUnlock(ev) {
    if (ev && ev.detail && ev.detail.unlocked) {
      removeLockShell();
      setTimeout(removeLockShell, 50);
      setTimeout(removeLockShell, 300);
    } else if (w.ClarityAmanaEngine && w.ClarityAmanaEngine.isUnlocked()) {
      removeLockShell();
    }
  }

  document.addEventListener("clarity-amana-unlock-change", onUnlock);

  // If already unlocked on load
  function boot() {
    try {
      if (w.ClarityAmanaEngine && w.ClarityAmanaEngine.isUnlocked()) removeLockShell();
      else if (sessionStorage.getItem("clarity_amana_session_unlocked_v1") === "1") removeLockShell();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
})(window);
