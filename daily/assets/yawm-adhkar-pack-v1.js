/*! yawm-adhkar-pack-v1 · loads morning/evening JSON from /daily/assets/adhkar-data/
 * Educational only — not a fatwa. Prefer graded reports; else verify with a teacher.
 */
(function (w, d) {
  "use strict";
  if (w.__YAWM_ADHKAR_PACK_V1__) return;
  w.__YAWM_ADHKAR_PACK_V1__ = true;

  var state = { window: "morning", items: [], i: 0, tally: 0 };

  function $(id) { return d.getElementById(id); }

  function sunnahUrl(source) {
    if (!source) return null;
    var s = String(source);
    var m;
    if ((m = s.match(/Muslim\s*(\d+)/i))) return "https://sunnah.com/muslim:" + m[1];
    if ((m = s.match(/Bukhārī\s*(\d+)/i)) || (m = s.match(/Bukhari\s*(\d+)/i))) return "https://sunnah.com/bukhari:" + m[1];
    if ((m = s.match(/Abū\s*Dāwūd\s*(\d+)/i)) || (m = s.match(/Abu\s*Dawud\s*(\d+)/i))) return "https://sunnah.com/abudawud:" + m[1];
    if ((m = s.match(/Tirmidhī\s*(\d+)/i)) || (m = s.match(/Tirmidhi\s*(\d+)/i))) return "https://sunnah.com/tirmidhi:" + m[1];
    if ((m = s.match(/Nasā.?ī\s*(\d+)/i)) || (m = s.match(/Nasai\s*(\d+)/i))) return "https://sunnah.com/nasai:" + m[1];
    return null;
  }

  function reportHtml(item) {
    var grade = (item.grade || "").trim();
    var source = (item.source || "").trim();
    var url = sunnahUrl(source);
    var g = grade ? grade.charAt(0).toUpperCase() + grade.slice(1) : "verify grade";
    var line = "<strong>" + g + "</strong>";
    if (source) line += " · " + source;
    if (url) line += ' · <a href="' + url + '" target="_blank" rel="noopener">' + url.replace("https://", "") + "</a>";
    else if (source) line += " · verify with a teacher";
    else line = "verify with a teacher · ask a local scholar";
    return line;
  }

  function show() {
    var items = state.items;
    if (!items.length) return;
    var item = items[state.i % items.length];
    var ar = $("pack-ar");
    var en = $("pack-en");
    var rep = $("pack-report");
    var note = $("pack-note");
    var prog = $("pack-progress");
    var tally = $("pack-tally");
    var need = $("pack-need");
    if (ar) { ar.textContent = item.ar || ""; ar.dir = "rtl"; ar.lang = "ar"; }
    if (en) en.textContent = item.en || "";
    if (rep) rep.innerHTML = reportHtml(item);
    if (note) note.textContent = item.note || "";
    if (prog) prog.textContent = "Dhikr " + ((state.i % items.length) + 1) + " / " + items.length;
    if (need) need.textContent = String(item.count || 1);
    if (tally) tally.textContent = String(state.tally);
  }

  function load(win) {
    state.window = win === "evening" ? "evening" : "morning";
    state.i = 0;
    state.tally = 0;
    var url = "/daily/assets/adhkar-data/" + state.window + ".json?v=20261104Y2";
    return fetch(url, { credentials: "same-origin", cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("pack");
        return r.json();
      })
      .then(function (data) {
        state.items = (data && data.items) || [];
        var label = $("pack-window-label");
        if (label) label.textContent = (data && data.label) || state.window;
        show();
        var st = $("pack-status");
        if (st) st.textContent = state.items.length + " lines · on this device packs · educational only";
      })
      .catch(function () {
        var st = $("pack-status");
        if (st) st.textContent = "Pack unavailable — using static lines above. Educational only.";
      });
  }

  function boot() {
    d.querySelectorAll("[data-adhkar-window]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-adhkar-window]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        load(btn.getAttribute("data-adhkar-window"));
      });
    });
    var plus = $("pack-plus");
    if (plus) plus.addEventListener("click", function () {
      if (!state.items.length) return;
      var need = state.items[state.i % state.items.length].count || 1;
      state.tally++;
      if (state.tally >= need) {
        state.tally = 0;
        state.i++;
      }
      show();
    });
    var next = $("pack-next");
    if (next) next.addEventListener("click", function () {
      state.i++;
      state.tally = 0;
      show();
    });
    load("morning");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
