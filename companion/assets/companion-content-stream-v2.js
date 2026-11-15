/*! companion-content-stream-v2 · shell form-factor
 * Applies path×tab focus to mounted tab HTML
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CONTENT_STREAM_V2__) return;
  w.__COMPANION_CONTENT_STREAM_V2__ = true;

  var FOCUS = {
    reminder: {
      seeker: "One command-verse. Read · pause · one small act today.",
      new_muslim: "Short reminder with clear meaning — stability before volume.",
      practicing: "Refresh a known command; teach it to your own limbs.",
      dai: "Choose a verse you can share with source and adab — not argument."
    },
    reality: {
      seeker: "One Seerah spark: how the Prophet ﷺ faced a hard day.",
      new_muslim: "A gentle timeline moment — belonging to a real story.",
      practicing: "Weekly review of what you lived, not only what you read.",
      dai: "Study a transmitted report with care — name the source."
    },
    reflection: {
      seeker: "Tawbah wakes the heart: one honest return to Allah today.",
      new_muslim: "Mercy first — learn prayer; return quickly when you slip.",
      practicing: "After a slip: tawbah, next prayer, restore the wird.",
      dai: "Clean your page before you invite others — adab with Allah first."
    },
    action: {
      seeker: "One deed you can finish before sleep.",
      new_muslim: "Wuḍūʾ / ṣalāh practice — slow and correct.",
      practicing: "Tajweed or craft: one rule, one line.",
      dai: "Prepare one clear shareable note with a primary source link."
    },
    notes: {
      seeker: "Write one line you want waiting in the grave.",
      new_muslim: "Note a question for a local teacher.",
      practicing: "Log a trust or thanks to settle.",
      dai: "Draft a transmission note: source · audience · adab limit."
    },
    about: {
      seeker: "This room is educational only — not a fatwa desk.",
      new_muslim: "Charter: private by default; Amānah holds vault tools.",
      practicing: "Feedback improves the craft — kind and specific.",
      dai: "Limits: verify before you transmit."
    }
  };
  var PATH_LABEL = {
    seeker: "Seeker · wake the heart",
    new_muslim: "New Muslim · establish pillars",
    practicing: "Daily · consistency",
    dai: "Daʿi · transmission with adab"
  };

  function paintFocus(tab, path) {
    var pathEl = d.getElementById("cs-focus-path");
    var msgEl = d.getElementById("cs-focus-msg");
    if (pathEl) pathEl.textContent = (PATH_LABEL[path] || path) + " · " + tab;
    var bag = FOCUS[tab] || {};
    if (msgEl) msgEl.textContent = bag[path] || bag.seeker || "One sincere step is enough today.";
  }

  function apply(root, tab, path) {
    if (!root) return;
    root.querySelectorAll("[data-cs-path-only]").forEach(function (el) {
      var only = (el.getAttribute("data-cs-path-only") || "").split(/\s+/);
      var show = only.indexOf(path) >= 0 || only.indexOf("all") >= 0;
      el.hidden = !show;
    });
    root.querySelectorAll("[data-cs-primary]").forEach(function (el) {
      el.classList.add("cs-stream-primary");
    });
    paintFocus(tab, path);
  }

  w.ClarityContentStreamV2 = { apply: apply, paintFocus: paintFocus };
})(window, document);
