/*! companion-craft-bridge-v1 · deepen exercise local save
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CRAFT_BRIDGE_V1__) return;
  w.__COMPANION_CRAFT_BRIDGE_V1__ = true;
  var KEY = "clarity_reminder_deepen_v1";

  function boot() {
    var ta = d.getElementById("deepen-obedience");
    var btn = d.getElementById("deepen-save-btn");
    var st = d.getElementById("deepen-status");
    if (!ta) return;
    try {
      var prev = localStorage.getItem(KEY);
      if (prev && !ta.value) ta.value = prev;
    } catch (e) {}
    if (btn && !btn.__bound) {
      btn.addEventListener("click", function () {
        var v = (ta.value || "").trim().slice(0, 240);
        try {
          if (v) localStorage.setItem(KEY, v);
          else localStorage.removeItem(KEY);
          if (st) st.textContent = v ? "Saved on this device · private" : "Cleared";
        } catch (err) {
          if (st) st.textContent = "Could not save on this device";
        }
      });
      btn.__bound = true;
    }
  }
  function onMount() { setTimeout(boot, 60); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", onMount);
})(window, document);
