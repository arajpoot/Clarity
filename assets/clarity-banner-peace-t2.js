/*! T2 banner peace — stop nuclear re-init if present */
(function(){
  "use strict";
  try {
    window.__CLARITY_BANNER_NUCLEAR_DISABLED__ = true;
  } catch(e) {}
})();
