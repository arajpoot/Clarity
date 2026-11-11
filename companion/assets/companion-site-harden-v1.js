/*! Companion site harden v1 · Bismillah
 * Site-wide Meme icon dedupe (all rails) · learning path section harden
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
    return (btn.textContent || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
      .replace(/^🎨\s*/, "");
  }

  function isMemeish(label) {
    return (
      label === "meme" ||
      label === "to meme studio" ||
      label === "to meme" ||
      /^meme\b/.test(label)
    );
  }

  /** Within each local rail/toolbar, keep first Meme control only */
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
        el.style.display = "";
        el.removeAttribute("aria-hidden");
      }
    });
  }

  function dedupeAllRails() {
    var scopes = d.querySelectorAll(
      ".card, .td-row, .cmd-action-row, .banner-controls, .banner-av-row, .rrra-hub-body, [role='toolbar'], .cgs-track, nav, .mv-toolbar, .callig-tools"
    );
    if (!scopes.length) scopes = [d.body];
    scopes.forEach(dedupeMemeInScope);
    /* Also consecutive meme siblings anywhere */
    d.querySelectorAll("button, a").forEach(function (el) {
      if (!isMemeish(normLabel(el))) return;
      var prev = el.previousElementSibling;
      while (prev && prev.nodeType === 1 && !(prev.matches && (prev.matches("button") || prev.matches("a")))) {
        prev = prev.previousElementSibling;
      }
      if (prev && isMemeish(normLabel(prev))) {
        el.setAttribute("data-meme-dup", "1");
        el.style.display = "none";
      }
    });
  }

  function hardenPaths() {
    var track = d.querySelector(".cgs-track, #clarity-gate-strip, [data-clarity-path]");
    if (track) {
      track.setAttribute("data-path-hardened", "1");
      /* ensure only one active gate button */
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
    /* Path cards: keep visible, no display:none ghosts */
    d.querySelectorAll("#ilm-pathway-card, .ilm-pathway-details, [data-path-section]").forEach(function (el) {
      if (el.hasAttribute("hidden") && el.getAttribute("data-force-hold") === "enrichment") {
        el.removeAttribute("hidden");
      }
    });
    /* Don't strip pathway loaders — enrichment hold */
    try {
      if (typeof w.claritySwitchGate === "function" && !w.claritySwitchGate.__hard) {
        var orig = w.claritySwitchGate;
        w.claritySwitchGate = function (id) {
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
  d.addEventListener("click", function () {
    setTimeout(dedupeAllRails, 180);
  });
})(window, document);
