/*! amana-dashboard-v1 · A5 local status */
(function (w) {
  "use strict";
  if (w.__AMANA_DASHBOARD_V1__) return;
  w.__AMANA_DASHBOARD_V1__ = true;

  function countDayn() {
    try {
      var raw = localStorage.getItem("clarity_dayn_ledger_v1");
      if (!raw) return 0;
      var o = JSON.parse(raw);
      var lines = o.lines || o.items || o.entries || (Array.isArray(o) ? o : null);
      if (Array.isArray(lines)) return lines.length;
      if (o && typeof o === "object") return Object.keys(o).length ? 1 : 0;
      return 0;
    } catch (e) { return 0; }
  }
  function filled(key, fields) {
    try {
      var o = JSON.parse(localStorage.getItem(key) || "{}");
      var n = 0;
      (fields || Object.keys(o)).forEach(function (f) {
        if (o[f] && String(o[f]).trim()) n++;
      });
      return n;
    } catch (e) { return 0; }
  }
  function boot() {
    var dayn = countDayn();
    var heirs = filled("clarity_amana_heirs_v1", ["ahr-fullname","ahr-kin","ahr-wasi","ahr-letter","ahr-debts","ahr-docs"]);
    var notes = 0;
    try {
      var n = localStorage.getItem("clarity_amana_notes_page_v1");
      if (n && n.trim()) notes = 1;
    } catch (e) {}
    var fiqh = filled("clarity_amana_faraid_study_v1");
    var wasi = filled("clarity_amana_wasiyyah_v1");
    function set(stat, text) {
      var el = document.querySelector('[data-stat="' + stat + '"]');
      if (el) el.textContent = text;
    }
    set("dayn", dayn ? (dayn + " ledger item(s) on device") : "No lines yet");
    set("heirs", heirs ? (heirs + " field(s) filled") : "Not started");
    set("notes", notes ? "Notes saved" : "Empty");
    set("fiqh", fiqh ? "Study notes on device" : "Open study maps");
    set("wasi", wasi ? "Notes on device" : "Not started");
    var st = document.getElementById("amana-dash-status");
    if (st) {
      st.textContent = "Device snapshot · Dayn " + dayn + " · Heirs fields " + heirs +
        (document.documentElement.getAttribute("data-amana-sealed") === "ready" ? " · sealed ready" : " · sealed on demand");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("clarity-amana-sealed-ready", boot);
  w.addEventListener("storage", boot);
})(window);
