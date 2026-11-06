/*! amana-desk-landing-v1 · C3 smoke-hardened
 * - Compact hero only (hide desk-welcome title stack)
 * - Exactly one unlock CTA (strip desk-welcome lane)
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  w.__AMANA_DESK_LANDING_V3__ = true;

  function hideVaultChrome() {
    var g = d.getElementById("amana-vault-gate");
    if (g) {
      g.hidden = true;
      g.style.display = "none";
      g.querySelectorAll('input[type="password"]').forEach(function (inp) {
        inp.disabled = true;
        inp.value = "";
      });
    }
  }

  function compactDeskWelcome() {
    var root = d.getElementById("amana-desk-welcome-root");
    if (!root) return;
    root.querySelectorAll(".dw-bism, .dw-title, .dw-sub").forEach(function (el) {
      el.hidden = true;
      el.style.display = "none";
    });
  }

  function oneUnlockCta() {
    /* Remove ALL competing unlock lanes first */
    d.querySelectorAll("#desk-unlock-lane, .dw-unlock-cta, .amana-vault-entry, #amana-vault-entry-link").forEach(function (el) {
      try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
    });
    d.querySelectorAll("section, div").forEach(function (el) {
      if (el.id === "amana-single-unlock-cta") return;
      var h = el.querySelector && el.querySelector("h2");
      if (h && /need the full vault/i.test(h.textContent || "")) {
        try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
      }
    });

    var main = d.querySelector("main.amana-wrap") || d.querySelector("main") || d.body;
    var keep = d.getElementById("amana-single-unlock-cta");
    if (!keep) {
      keep = d.createElement("section");
      keep.id = "amana-single-unlock-cta";
      main.appendChild(keep);
    }
    keep.className = "amana-single-unlock-cta";
    keep.innerHTML =
      "<h2>Need the full vault?</h2>" +
      "<p>Family tree, farāʾiḍ study, wasiyyah, full dayn ledger, and private notes open after passphrase unlock on this device.</p>" +
      '<p class="cta-row"><a class="btn-unlock" href="/amana/unlock/" id="amana-unlock-only-link">Continue to vault unlock →</a></p>' +
      '<p class="cta-note">One door only · passphrase on the unlock page</p>';

    /* neutralize any residual scroll-unlock button */
    var btn = d.getElementById("desk-scroll-unlock");
    if (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        w.location.href = "/amana/unlock/";
      };
    }
  }

  function boot() {
    d.documentElement.setAttribute("data-amana-surface", "desk");
    hideVaultChrome();
    compactDeskWelcome();
    oneUnlockCta();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 50);
    setTimeout(boot, 300);
    setTimeout(boot, 900);
    setTimeout(boot, 1800);
  });
  /* observe desk mount mutations */
  try {
    var mount = d.getElementById("amana-desk-mount");
    if (mount && w.MutationObserver) {
      new MutationObserver(function () {
        compactDeskWelcome();
        oneUnlockCta();
      }).observe(mount, { childList: true, subtree: true });
    }
  } catch (e) {}
  setInterval(function () {
    compactDeskWelcome();
    var n = d.querySelectorAll("#desk-unlock-lane, .dw-unlock-cta, #amana-single-unlock-cta").length;
    if (n !== 1 || d.getElementById("desk-unlock-lane")) boot();
  }, 1500);
})(window, document);
