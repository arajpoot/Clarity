/*! Clarity companion-boot v2 · Phase 2 · campus untouched */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_BOOT_V2__) return;
  w.__CLARITY_COMPANION_BOOT_V2__ = true;
  w.__CLARITY_SKIP_DAY_LANDING__ = true;
  var KEY = "clarity_shell_mode_v1";
  try {
    localStorage.setItem(KEY, "companion");
    sessionStorage.setItem("clarity_shell_user_pick_v1", "1");
    var r = d.documentElement;
    r.setAttribute("data-clarity-room", "companion");
    r.setAttribute("data-clarity-viewport", "companion-path");
    r.setAttribute("data-shell-mode", "companion");
  } catch (e) {}
})(window, document);
