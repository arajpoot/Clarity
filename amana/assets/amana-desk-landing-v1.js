/*! amana-desk-landing-v1 · C2
 * Desk only · single vault unlock link · no passphrase · no heavy gate
 * Dedupes desk-welcome unlock CTAs into one controlled link.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__AMANA_DESK_LANDING_V2__) return;
  w.__AMANA_DESK_LANDING_V2__ = true;
  w.__AMANA_DESK_LANDING_V1__ = true;

  function hideVaultChrome() {
    try {
      d.documentElement.setAttribute("data-amana-surface", "desk");
      d.documentElement.setAttribute("data-clarity-room", "amana");
      var g = d.getElementById("amana-vault-gate");
      if (g) {
        g.hidden = true;
        g.setAttribute("aria-hidden", "true");
        g.style.display = "none";
        g.querySelectorAll('input[type="password"]').forEach(function (inp) {
          inp.disabled = true;
          inp.value = "";
        });
      }
      d.querySelectorAll("header.amana-shariah-banner, .amana-shariah-banner").forEach(function (el) {
        el.hidden = true;
        el.style.display = "none";
      });
      d.querySelectorAll(".amana-unlocked-only").forEach(function (el) {
        el.hidden = true;
      });
    } catch (e) {}
  }

  /** One unlock CTA only — remove duplicates from desk-welcome + static HTML */
  function singleUnlockLink() {
    var main = d.querySelector("main") || d.body;
    var nodes = [];
    d.querySelectorAll(".dw-unlock-cta, #desk-unlock-lane, .amana-vault-entry, #amana-vault-entry-link, section.amana-vault-entry").forEach(function (el) {
      nodes.push(el);
    });
    /* also sections whose h2 is Need the full vault */
    d.querySelectorAll("section, div").forEach(function (el) {
      var h = el.querySelector && el.querySelector("h2");
      if (h && /need the full vault/i.test(h.textContent || "")) nodes.push(el);
    });
    /* unique */
    var seen = [];
    nodes.forEach(function (el) {
      if (seen.indexOf(el) < 0) seen.push(el);
    });
    if (!seen.length) {
      ensureOne(main);
      return;
    }
    /* keep first, strip others */
    var keep = seen[0];
    for (var i = 1; i < seen.length; i++) {
      try { seen[i].parentNode && seen[i].parentNode.removeChild(seen[i]); } catch (e) {}
    }
    /* normalize keep to single anchor */
    keep.id = "amana-single-unlock-cta";
    keep.className = "amana-single-unlock-cta";
    keep.innerHTML =
      '<h2>Need the full vault?</h2>' +
      '<p>Family tree, farāʾiḍ study, wasiyyah, full dayn ledger, and private notes open after passphrase unlock on this device.</p>' +
      '<p class="cta-row"><a class="btn-unlock" href="/amana/unlock/">Continue to vault unlock →</a></p>' +
      '<p class="cta-note">Banner and passphrase stay on the unlock page — not on this desk.</p>';
  }

  function ensureOne(main) {
    if (d.getElementById("amana-single-unlock-cta")) return;
    var sec = d.createElement("section");
    sec.id = "amana-single-unlock-cta";
    sec.className = "amana-single-unlock-cta";
    sec.innerHTML =
      '<h2>Need the full vault?</h2>' +
      '<p>Open the passphrase page only when you need deeper chambers.</p>' +
      '<p class="cta-row"><a class="btn-unlock" href="/amana/unlock/">Continue to vault unlock →</a></p>';
    (main || d.body).appendChild(sec);
  }

  function bindDeskScroll() {
    /* if desk-welcome re-adds button, point it once */
    var btn = d.getElementById("desk-scroll-unlock");
    if (btn && !btn.__single) {
      btn.__single = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        w.location.href = "/amana/unlock/";
      });
    }
  }

  function boot() {
    hideVaultChrome();
    singleUnlockLink();
    bindDeskScroll();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 500);
    setTimeout(boot, 1200);
  });
  setInterval(function () {
    hideVaultChrome();
    /* if more than one unlock CTA visible, collapse */
    var ctas = d.querySelectorAll("#amana-single-unlock-cta, .dw-unlock-cta, #desk-unlock-lane, .amana-vault-entry");
    if (ctas.length > 1) singleUnlockLink();
  }, 2000);
})(window, document);
