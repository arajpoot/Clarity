/**
 * Amana live input fix — 20261016FIX
 * Unblocks passphrase fields frozen by readonly/disabled/autofill hacks.
 * Does not store passphrases. Does not touch University.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_INPUT_FIX__) return;
  g.__CLARITY_AMANA_INPUT_FIX__ = true;

  var IDS = ["amana-pass-new", "amana-pass-confirm", "amana-pass-unlock"];

  function $(id) {
    try {
      return document.getElementById(id);
    } catch (e) {
      return null;
    }
  }

  function lockedOut() {
    try {
      var until =
        parseInt(sessionStorage.getItem("clarity_amana_lockout_until_v1") || "0", 10) ||
        0;
      return until && Date.now() < until;
    } catch (e) {
      return false;
    }
  }

  function unfreezeField(el) {
    if (!el) return;
    try {
      el.removeAttribute("readonly");
      el.readOnly = false;
      if (!lockedOut()) {
        el.disabled = false;
        el.removeAttribute("disabled");
      }
      el.style.pointerEvents = "auto";
      el.style.opacity = "1";
      el.setAttribute("autocomplete", "off");
      el.setAttribute("data-lpignore", "true");
      el.setAttribute("data-form-type", "other");
    } catch (e) {}
  }

  function unfreezeAll() {
    IDS.forEach(function (id) {
      unfreezeField($(id));
    });
    var gate = $("amana-vault-gate");
    if (gate) {
      try {
        gate.style.pointerEvents = "auto";
        gate.querySelectorAll("input, button, textarea").forEach(function (n) {
          if (n.id && IDS.indexOf(n.id) >= 0) unfreezeField(n);
          else if (n.tagName === "BUTTON") {
            n.style.pointerEvents = "auto";
            if (!lockedOut()) n.disabled = false;
          }
        });
      } catch (e) {}
    }
  }

  function bind() {
    IDS.forEach(function (id) {
      var el = $(id);
      if (!el || el.__amanaInputFix) return;
      el.__amanaInputFix = true;
      ["touchstart", "pointerdown", "mousedown", "focus", "click"].forEach(
        function (ev) {
          el.addEventListener(
            ev,
            function () {
              unfreezeField(el);
            },
            true
          );
        }
      );
    });
    unfreezeAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(bind, 50);
      setTimeout(unfreezeAll, 400);
    });
  } else {
    setTimeout(bind, 50);
    setTimeout(unfreezeAll, 400);
  }
  g.addEventListener("load", function () {
    setTimeout(bind, 100);
    setTimeout(unfreezeAll, 600);
  });
  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (
        t.closest(".rrra-rail-vault") ||
        t.closest("[data-tab='notes']") ||
        t.closest("#amana-vault-gate")
      ) {
        setTimeout(unfreezeAll, 30);
      }
    },
    true
  );
})(window);
