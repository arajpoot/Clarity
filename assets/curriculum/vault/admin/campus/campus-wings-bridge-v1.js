/**
 * Campus Wings Bridge — Faculty · Security · IT on /campus/
 * Waits for wing APIs, opens desks, kills sticky plaque fight.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CAMPUS_WINGS__) return;
  g.__CLARITY_CAMPUS_WINGS__ = true;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  function relocatePlaque() {
    var rail = document.getElementById("clarity-phase-plaque-rail");
    var main = document.querySelector(".cu-page-main");
    var label = document.querySelector(".campus-stage-label");
    if (!rail || !main) return;
    rail.style.position = "relative";
    rail.style.top = "auto";
    rail.style.zIndex = "5";
    if (label && rail.parentNode !== main) {
      try {
        main.insertBefore(rail, label);
      } catch (e) {
        main.insertBefore(rail, main.firstChild);
      }
    } else if (rail.parentNode === document.body) {
      try {
        main.insertBefore(rail, main.firstChild);
      } catch (e2) {}
    }
  }

  function openFaculty() {
    if (g.ClarityFaculty && typeof g.ClarityFaculty.openDesk === "function") {
      g.ClarityFaculty.openDesk();
      return true;
    }
    return false;
  }
  function openSecurity() {
    if (g.ClaritySecurity && typeof g.ClaritySecurity.openDesk === "function") {
      g.ClaritySecurity.openDesk();
      return true;
    }
    if (g.ClaritySecurity && typeof g.ClaritySecurity.scan === "function") {
      g.ClaritySecurity.scan();
      return true;
    }
    return false;
  }
  function openIT() {
    if (g.ClarityIT && typeof g.ClarityIT.openDesk === "function") {
      g.ClarityIT.openDesk();
      return true;
    }
    if (g.ClarityIT && typeof g.ClarityIT.scanBridge === "function") {
      g.ClarityIT.scanBridge();
      /* try open after scan */
      setTimeout(function () {
        if (g.ClarityIT.openDesk) g.ClarityIT.openDesk();
      }, 100);
      return true;
    }
    return false;
  }

  function wireWings() {
    var map = {
      faculty: openFaculty,
      security: openSecurity,
      it: openIT
    };
    document.querySelectorAll(".cu-wing[data-wing]").forEach(function (btn) {
      if (btn.__wingWired) return;
      btn.__wingWired = true;
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        var name = btn.getAttribute("data-wing");
        var fn = map[name];
        var ok = fn && fn();
        if (!ok) {
          btn.disabled = true;
          var tries = 0;
          var t = setInterval(function () {
            tries++;
            if (fn && fn()) {
              clearInterval(t);
              btn.disabled = false;
            } else if (tries > 20) {
              clearInterval(t);
              btn.disabled = false;
              alert(
                "Wing still loading. Check that Faculty / Security / IT scripts are on the server, then hard-refresh."
              );
            }
          }, 250);
        }
      });
    });
  }

  function ensureModalCss() {
    if (document.getElementById("cu-wing-modal-css")) return;
    var s = document.createElement("style");
    s.id = "cu-wing-modal-css";
    s.textContent =
      ".clarity-security-modal.show,.clarity-it-modal.show,.clarity-faculty-modal.show," +
      "#clarity-security-modal.show,#clarity-it-modal.show,[id^=clarity-faculty].show{" +
      "display:flex!important;align-items:center;justify-content:center;" +
      "position:fixed!important;inset:0!important;z-index:200000!important}" +
      ".clarity-security-modal[hidden],.clarity-it-modal[hidden],.clarity-faculty-modal[hidden]{" +
      "display:none!important}" +
      "#clarity-phase-plaque-rail{position:relative!important;top:auto!important;" +
      "sticky:unset!important;z-index:5!important}";
    document.head.appendChild(s);
  }

  function statusChips() {
    var host = document.querySelector(".cu-wings");
    if (!host || host.querySelector(".cu-wing-status")) return;
    function mark(id, ok) {
      var b = document.getElementById(id);
      if (!b) return;
      b.style.opacity = ok ? "1" : "0.65";
      b.title = (b.title || "") + (ok ? " · online" : " · waiting");
    }
    mark("cu-wing-faculty", !!(g.ClarityFaculty && g.ClarityFaculty.openDesk));
    mark("cu-wing-security", !!(g.ClaritySecurity && g.ClaritySecurity.openDesk));
    mark("cu-wing-it", !!(g.ClarityIT && g.ClarityIT.openDesk));
  }

  function boot() {
    ensureModalCss();
    wireWings();
    relocatePlaque();
    statusChips();
    var n = 0;
    var iv = setInterval(function () {
      n++;
      relocatePlaque();
      statusChips();
      if (n > 25) clearInterval(iv);
    }, 400);
  }

  ready(function () {
    setTimeout(boot, 200);
    setTimeout(boot, 1200);
    setTimeout(boot, 3000);
  });
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 300);
  });

  g.ClarityCampusWings = {
    openFaculty: openFaculty,
    openSecurity: openSecurity,
    openIT: openIT,
    relocatePlaque: relocatePlaque
  };
})(typeof window !== "undefined" ? window : this);
