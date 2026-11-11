/*! Companion site harden v1.1 · Bismillah
 * Site-wide Meme dedupe (all rails) · path harden · late DOM injects
 * Educational only — not a fatwa · enrichment held
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_SITE_HARDEN_V1__) return;
  w.__CLARITY_COMPANION_SITE_HARDEN_V1__ = true;

  function isCompanion() {
    try {
      return (d.documentElement.getAttribute("data-clarity-room") || "") === "companion" ||
        /\/companion\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function normLabel(btn) {
    return (btn.textContent || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/^🎨\s*/, "");
  }

  function isMemeish(label) {
    return label === "meme" || label === "to meme studio" || label === "to meme" || /^meme\b/.test(label);
  }

  function dedupeMemeInScope(scope) {
    if (!scope) return;
    var found = false;
    scope.querySelectorAll("button, a.btn-soft, a.btn-secondary, [role='button']").forEach(function (el) {
      var label = normLabel(el);
      if (!isMemeish(label)) return;
      if (found) {
        el.setAttribute("data-meme-dup", "1");
        el.style.display = "none";
        el.setAttribute("aria-hidden", "true");
      } else {
        found = true;
        el.removeAttribute("data-meme-dup");
        if (el.style.display === "none") el.style.display = "";
        el.removeAttribute("aria-hidden");
      }
    });
  }

  function dedupeAllRails() {
    var scopes = d.querySelectorAll(
      ".card, .td-row, .cmd-action-row, .banner-controls, .banner-av-row, .rrra-hub-body, [role='toolbar'], .cgs-track, nav, .mv-toolbar, .callig-tools, #commands-card, #tweet-desk-card"
    );
    if (!scopes.length) scopes = [d.body];
    scopes.forEach(dedupeMemeInScope);
  }

  function hardenPaths() {
    var track = d.querySelector(".cgs-track, #clarity-gate-strip, [data-clarity-path]");
    if (track) {
      track.setAttribute("data-path-hardened", "1");
      var active = track.querySelectorAll(".cgs-btn.is-active, .cgs-btn[aria-pressed='true']");
      if (active.length > 1) {
        active.forEach(function (btn, i) {
          if (i > 0) {
            btn.classList.remove("is-active");
            btn.setAttribute("aria-pressed", "false");
          }
        });
      }
    }
    d.querySelectorAll("#ilm-pathway-card, .ilm-pathway-details").forEach(function (el) {
      if (el.getAttribute("data-force-hold") === "enrichment") el.removeAttribute("hidden");
    });
    try {
      if (typeof w.claritySwitchGate === "function" && !w.claritySwitchGate.__hard) {
        var orig = w.claritySwitchGate;
        w.claritySwitchGate = function () {
          var r = orig.apply(this, arguments);
          setTimeout(dedupeAllRails, 100);
          return r;
        };
        w.claritySwitchGate.__hard = true;
      }
    } catch (e) {}
  }

  function settle() {
    if (!isCompanion()) return;
    dedupeAllRails();
    hardenPaths();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(settle, 300); });
  else setTimeout(settle, 300);
  setTimeout(settle, 1200);
  setTimeout(settle, 2800);
  d.addEventListener("click", function () { setTimeout(dedupeAllRails, 180); });

  try {
    var obs = new MutationObserver(function () {
      setTimeout(dedupeAllRails, 50);
    });
    obs.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e2) {}
})(window, document);
