/**
 * U1 Continue engine
 */
(function (g) {
  "use strict";
  if (g.__CU_CONTINUE_V1__) return;
  g.__CU_CONTINUE_V1__ = true;
  var KEY = "cu_continue_v1";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  var PHASE_HREF = { 1: "/campus/desk/seeker/", 2: "/campus/desk/practice/", 3: "/campus/desk/consistency/", 4: "/campus/desk/transmission/" };
  var PHASE_LABEL = { 1: "Seeker", 2: "Practice", 3: "Consistency", 4: "Transmission" };
  function roomNum() {
    var r = (document.body && document.body.getAttribute("data-phase-room")) || "";
    return { seeker: 1, practice: 2, consistency: 3, transmission: 4 }[r] || 0;
  }
  function ensureDefaults(s) {
    if (!s.phase) s.phase = 1;
    if (!s.unitTitle) s.unitTitle = "Unit 1 - Who is Allah?";
    if (!s.nextAction) s.nextAction = "Open the Seeker room and complete the open module.";
    if (!s.href) s.href = PHASE_HREF[s.phase] || PHASE_HREF[1];
    return s;
  }
  function paint() {
    var el = document.getElementById("cu-continue");
    if (!el) return;
    var s = ensureDefaults(load());
    var label = PHASE_LABEL[s.phase] || "Seeker";
    el.innerHTML = "<div><strong>Continue · " + label + "</strong><br/><span>" + (s.unitTitle || "") +
      "</span><br/><span style=\"opacity:.8;font-size:.85rem\">" + (s.nextAction || "") +
      "</span></div><a href=\"" + (s.href || "/campus/desk/seeker/") + "\">Open →</a>";
  }
  function touchFromRoom() {
    var n = roomNum();
    if (!n) return;
    var s = ensureDefaults(load());
    s.phase = n; s.href = PHASE_HREF[n]; s.unitTitle = PHASE_LABEL[n] + " room";
    s.nextAction = "Continue the open module, then use the completion contract (Lab + Library).";
    save(s);
  }
  g.ClarityContinue = {
    get: function () { return ensureDefaults(load()); },
    set: function (partial) {
      var s = ensureDefaults(load());
      for (var k in partial) if (Object.prototype.hasOwnProperty.call(partial, k)) s[k] = partial[k];
      if (s.phase && PHASE_HREF[s.phase]) s.href = PHASE_HREF[s.phase];
      save(s); paint();
    },
    paint: paint
  };
  function boot() { touchFromRoom(); paint(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
