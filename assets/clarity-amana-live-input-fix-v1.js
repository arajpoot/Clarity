/**
 * Amana live input fix — 20261016SMOKE
 * Forces passphrase fields editable (readonly/disabled freezes mobile).
 * Does not store passphrases. Respects real lockout window only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_INPUT_FIX_SMOKE__) return;
  g.__CLARITY_AMANA_INPUT_FIX_SMOKE__ = true;
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
        parseInt(
          sessionStorage.getItem("clarity_amana_lockout_until_v1") || "0",
          10
        ) || 0;
      return until > 0 && Date.now() < until;
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
      el.style.userSelect = "text";
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
        gate.removeAttribute("inert");
        gate.style.pointerEvents = "auto";
        gate.querySelectorAll("input, button").forEach(function (n) {
          if (n.id && IDS.indexOf(n.id) >= 0) unfreezeField(n);
          else if (n.tagName === "BUTTON" && !lockedOut()) {
            n.disabled = false;
            n.style.pointerEvents = "auto";
          }
        });
      } catch (e) {}
    }
    var unlockBtn = $("amana-btn-unlock");
    if (unlockBtn && !lockedOut()) {
      try {
        unlockBtn.disabled = false;
      } catch (e) {}
    }
  }

  function bind() {
    IDS.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      if (!el.__amanaInputFixSmoke) {
        el.__amanaInputFixSmoke = true;
        ["touchstart", "pointerdown", "mousedown", "focus", "click", "keydown"].forEach(
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
      }
      unfreezeField(el);
    });
    unfreezeAll();
  }

  function boot() {
    bind();
    unfreezeAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 30);
      setTimeout(boot, 300);
      setTimeout(boot, 1000);
    });
  } else {
    setTimeout(boot, 30);
    setTimeout(boot, 300);
  }
  g.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 800);
  });

  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (
        t.closest("#amana-vault-gate") ||
        t.closest(".rrra-rail-vault") ||
        t.closest("[data-tab='notes']") ||
        t.closest("#tab-notes")
      ) {
        setTimeout(unfreezeAll, 10);
        setTimeout(unfreezeAll, 100);
      }
    },
    true
  );

  document.addEventListener(
    "visibilitychange",
    function () {
      if (document.visibilityState === "visible") {
        setTimeout(unfreezeAll, 50);
      }
    },
    true
  );

  g.clarityAmanaUnfreezePass = unfreezeAll;
})(window);
