/*! amana-room-v1 · A1 shell + V1 chamber visibility */
(function (w) {
  "use strict";
  if (w.__AMANA_ROOM_V1__) return;
  w.__AMANA_ROOM_V1__ = true;

  function setUnlocked(on) {
    try {
      document.body.setAttribute("data-amana-unlocked", on ? "1" : "0");
      document.querySelectorAll(".amana-unlocked-only").forEach(function (el) {
        if (on) {
          el.hidden = false;
          el.removeAttribute("hidden");
        } else {
          el.hidden = true;
          el.setAttribute("hidden", "");
        }
      });
      if (on) {
        try {
          w.dispatchEvent(new CustomEvent("clarity-amana-unlocked"));
          w.dispatchEvent(new CustomEvent("clarity-dayn-v0-mount"));
        } catch (e) {}
      }
    } catch (e2) {}
  }

  function loadSealed() {
    if (typeof w.ClarityLoadAmanaSealed === "function") {
      return w.ClarityLoadAmanaSealed();
    }
    return Promise.resolve();
  }

  function boot() {
    var btn = document.getElementById("amana-load-sealed-btn");
    if (btn && !btn.__bound) {
      btn.__bound = true;
      btn.addEventListener("click", function () {
        loadSealed().then(function () {
          btn.textContent = "Vault modules loaded";
        }).catch(function () {
          btn.textContent = "Load failed — retry";
        });
      });
    }
    var mark = document.getElementById("amana-mark-unlocked-btn");
    if (mark && !mark.__bound) {
      mark.__bound = true;
      mark.addEventListener("click", function () {
        setUnlocked(true);
        loadSealed();
      });
    }
    // Auto-load sealed on Amānah room
    loadSealed();

    // If sealed gate sets a global unlock flag later, observe
    try {
      var obs = new MutationObserver(function () {
        if (document.body.classList.contains("amana-unlocked") ||
            document.documentElement.getAttribute("data-vault-unlocked") === "1") {
          setUnlocked(true);
        }
      });
      obs.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["class", "data-vault-unlocked", "data-amana-unlocked"] });
      setTimeout(function(){ try { obs.disconnect(); } catch(e){} }, 20000);
    } catch (e) {}

    // Hash routes soft
    function hash() {
      var h = (w.location.hash || "").toLowerCase();
      if (/unlock|vault/.test(h)) loadSealed();
      if (/dayn/.test(h)) {
        var el = document.getElementById("clarity-landing-slot-dayn");
        if (el) try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e2) {}
      }
    }
    w.addEventListener("hashchange", hash);
    hash();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // Export for gate integration
  w.ClarityAmanaSetUnlocked = setUnlocked;
})(window);
