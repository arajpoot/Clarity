/*! Vault export host — only inside unlocked Amānah ledger, never on passphrase gate */
(function () {
  "use strict";
  if (window.__CLARITY_VAULT_EXPORT_HOST__) return;
  window.__CLARITY_VAULT_EXPORT_HOST__ = true;

  function isPassphraseContext(el) {
    if (!el) return true;
    var t = (el.textContent || "").toLowerCase();
    var html = (el.innerHTML || "").toLowerCase();
    // create/open gate signals
    if (/create\s*&\s*open vault|i have a vault|confirm passphrase|strength:\s*—/.test(t)) return true;
    if (el.querySelector && el.querySelector('input[type="password"]')) {
      // password alone is ok only if already unlocked chrome present
      var root = el.closest("[data-vault-unlocked], .vault-unlocked, [data-amana-open]") ||
        document.querySelector("[data-vault-unlocked], .vault-unlocked, [data-amana-open='1']");
      if (!root) return true;
    }
    return false;
  }

  function findLedgerMount() {
    // Prefer explicit ledger / heir letter / note registry regions
    var selectors = [
      "[data-vault-ledger]",
      "#vault-ledger",
      "#amana-ledger",
      "[data-heir-letter]",
      "#heir-letter",
      ".heir-letter",
      "#vault-note-registry",
      "[data-vault-note-registry]",
      ".vault-note-registry",
      "[data-amana-notes]",
      "#amana-notes",
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && !isPassphraseContext(el)) return el;
    }
    // Headings that look like heir / notes / export
    var heads = document.querySelectorAll("h1,h2,h3,h4,.card-title,summary");
    for (var j = 0; j < heads.length; j++) {
      var h = heads[j];
      var tx = (h.textContent || "").toLowerCase();
      if (/heir|wasiyyah|note registry|export|ledger|family tree|far[aā]i/.test(tx)) {
        var card = h.closest("section,article,.card,[class*='panel'],[class*='block']") || h.parentElement;
        if (card && !isPassphraseContext(card)) return card;
      }
    }
    // Unlocked vault root only
    var unlocked =
      document.querySelector("[data-vault-unlocked='1']") ||
      document.querySelector("[data-amana-open='1']") ||
      document.querySelector(".vault-unlocked");
    if (unlocked && !isPassphraseContext(unlocked)) return unlocked;
    return null;
  }

  function ensureLedgerShell(mount) {
    var shell = document.getElementById("amana-ledger-section");
    if (shell) return shell;
    shell = document.createElement("section");
    shell.id = "amana-ledger-section";
    shell.setAttribute("data-vault-ledger", "1");
    shell.setAttribute("data-vault-export", "1");
    shell.style.cssText =
      "margin:1.25rem 0;padding:1rem 1.1rem;border:1px solid rgba(201,168,76,.38);border-radius:16px;" +
      "background:linear-gradient(155deg,rgba(255,255,255,.06),rgba(8,24,20,.55))";
    shell.innerHTML =
      "<header style='margin-bottom:.75rem'>" +
      "<p style='margin:0;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:#c9a84c;font-weight:800'>Amānah · Ledger</p>" +
      "<h2 style='margin:.25rem 0 .35rem;font-size:1.15rem;color:#e8d5a3'>Notes, heirs letter &amp; export</h2>" +
      "<p style='margin:0;font-size:.82rem;opacity:.9'>Personal on-device ledger aids. Educational · not legal advice · not a court document.</p>" +
      "</header>" +
      "<div id='amana-ledger-notes-slot'></div>" +
      "<div id='vault-export-host' data-vault-export='1'></div>";
    // Place after mount card, or inside unlocked root
    if (mount.id === "amana-ledger-section") return mount;
    if (mount.parentElement) {
      mount.parentElement.insertBefore(shell, mount.nextSibling);
    } else {
      mount.appendChild(shell);
    }
    // Move heir/note card into notes slot when it is the mount itself
    try {
      var slot = shell.querySelector("#amana-ledger-notes-slot");
      if (slot && mount !== shell && /heir|note|wasiyyah|registry/i.test(mount.textContent || "")) {
        // don't move passphrase blocks
        if (!isPassphraseContext(mount) && !mount.querySelector('input[type="password"]')) {
          slot.appendChild(mount);
        }
      }
    } catch (e) {}
    return shell;
  }

  function place() {
    if (document.getElementById("vault-export-host")) return;
    var mount = findLedgerMount();
    if (!mount) return; // wait until unlocked UI exists
    var shell = ensureLedgerShell(mount);
    if (!document.getElementById("vault-export-host")) {
      var host = document.createElement("div");
      host.id = "vault-export-host";
      host.setAttribute("data-vault-export", "1");
      shell.appendChild(host);
    }
  }

  function tick() {
    // Only attempt when not clearly on locked gate alone
    var gateOnly = document.querySelector('input[type="password"]') &&
      !document.querySelector("[data-vault-unlocked], [data-amana-open='1'], .vault-unlocked");
    // Still allow if heir sections visible (returning user UI)
    if (gateOnly && !findLedgerMount()) return;
    place();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setTimeout(tick, 800);
  setTimeout(tick, 2000);
  setTimeout(tick, 4000);
  // observe DOM for unlock
  try {
    var obs = new MutationObserver(function () { tick(); });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { obs.disconnect(); } catch (e) {} }, 20000);
  } catch (e) {}
})();
