/*! amana-unlock-access-v1
 * /amana/unlock/ IS the passphrase gate — not a locked chamber subpage.
 * - Exclude unlock path from subpage-lock / engine lock-shell redirects to desk
 * - Remove "Chamber locked · Open gate" overlay that bounces to /amana/
 * - Keep passphrase form usable
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  function isUnlockPath() {
    try {
      var p = (w.location.pathname || "").replace(/\/+$/, "");
      return p === "/amana/unlock" || /\/amana\/unlock/i.test(w.location.pathname || "");
    } catch (e) { return false; }
  }
  if (!isUnlockPath()) return;
  if (w.__AMANA_UNLOCK_ACCESS_V1__) return;
  w.__AMANA_UNLOCK_ACCESS_V1__ = true;

  d.documentElement.setAttribute("data-amana-surface", "unlock");
  d.documentElement.setAttribute("data-clarity-room", "amana");
  d.documentElement.setAttribute("data-amana-gate-page", "1");

  function stripLockOverlays() {
    [
      "amana-engine-lock-shell",
      "amana-sub-lock-banner",
      "amana-chamber-lock",
      "amana-lock-modal"
    ].forEach(function (id) {
      var el = d.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    /* modal-like nodes with Chamber locked text */
    d.querySelectorAll("div,section,aside").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (/chamber locked/i.test(t) && /open gate/i.test(t) && el.children.length < 8) {
        try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
      }
    });
  }

  function showPassphraseGate() {
    var g = d.getElementById("amana-vault-gate");
    if (g) {
      g.hidden = false;
      g.style.display = "block";
      g.style.visibility = "visible";
      g.removeAttribute("aria-hidden");
      g.querySelectorAll("input,button").forEach(function (el) {
        el.disabled = false;
      });
    }
    var unlockPanel = d.getElementById("amana-gate-unlock");
    var createPanel = d.getElementById("amana-gate-create");
    if (unlockPanel) unlockPanel.hidden = false;
    /* dim body lock overlays */
    d.body.style.overflow = "";
  }

  function patchEngine() {
    var eng = w.ClarityAmanaEngine;
    if (!eng) return;
    /* never redirect to desk from unlock page */
    eng.requireUnlock = function () {
      return true; /* already on gate page */
    };
    /* do not paint lock shell here */
    if (typeof eng.ensureLockShell === "function") {
      eng.ensureLockShell = function () {};
    }
  }

  function patchGlobals() {
    w.ClarityAmanaRequireUnlock = function () { return true; };
  }

  function blockDeskBounce(url) {
    try {
      var u = new URL(String(url), w.location.origin);
      var p = (u.pathname || "").replace(/\/+$/, "") || "/";
      if (p === "/amana" || p === "/amana/index.html") {
        if (String(u.search || "").indexOf("need_unlock") >= 0) return true;
      }
    } catch (e) {
      if (/\/amana\/?\?need_unlock/.test(String(url))) return true;
    }
    return false;
  }

  try {
    var na = w.location.assign.bind(w.location);
    var nr = w.location.replace.bind(w.location);
    w.location.assign = function (u) {
      if (blockDeskBounce(u)) {
        stripLockOverlays();
        showPassphraseGate();
        return;
      }
      return na(u);
    };
    w.location.replace = function (u) {
      if (blockDeskBounce(u)) {
        stripLockOverlays();
        showPassphraseGate();
        return;
      }
      return nr(u);
    };
  } catch (e) {}

  /* Intercept Open gate buttons that point to desk */
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t) return;
      var label = (t.textContent || "").trim().toLowerCase();
      var href = (t.getAttribute && t.getAttribute("href")) || "";
      if (label === "open gate" || /need_unlock=1/.test(href) || href === "/amana/" || href === "/amana") {
        /* if it's the lock overlay CTA, stay and focus passphrase */
        if (/chamber locked|open gate/i.test((t.closest && t.closest("div") || t).textContent || "") || /need_unlock/.test(href)) {
          ev.preventDefault();
          ev.stopPropagation();
          stripLockOverlays();
          showPassphraseGate();
          var inp = d.getElementById("amana-pass-unlock") || d.getElementById("amana-pass-new");
          if (inp) try { inp.focus(); } catch (e) {}
        }
      }
    },
    true
  );

  function boot() {
    stripLockOverlays();
    showPassphraseGate();
    patchEngine();
    patchGlobals();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    setTimeout(boot, 100);
    setTimeout(boot, 400);
    setTimeout(boot, 1000);
  });
  setInterval(function () {
    patchEngine();
    stripLockOverlays();
    showPassphraseGate();
  }, 1500);
})(window, document);
