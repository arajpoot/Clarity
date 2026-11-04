/*! companion-error-trap-n35 · surface ReferenceErrors without breaking UI */
(function (w) {
  if (w.__CLARITY_ERROR_TRAP_N35__) return;
  w.__CLARITY_ERROR_TRAP_N35__ = true;
  w.__CLARITY_ERROR_LOG = w.__CLARITY_ERROR_LOG || [];
  w.addEventListener("error", function (ev) {
    try {
      w.__CLARITY_ERROR_LOG.push({
        msg: String(ev.message || ""),
        file: String(ev.filename || ""),
        line: ev.lineno || 0
      });
    } catch (e) {}
  });
  w.addEventListener("unhandledrejection", function (ev) {
    try {
      w.__CLARITY_ERROR_LOG.push({
        msg: "rejection:" + String((ev.reason && ev.reason.message) || ev.reason || ""),
        file: "",
        line: 0
      });
    } catch (e) {}
  });
})(window);
