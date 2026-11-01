/*! Amānah passphrase page tutorial · educational · not legal advice */
(function () {
  "use strict";
  var ID = "amana-passphrase-tutorial";

  var HTML = [
    "<details id='" + ID + "' open style='margin:1rem 0;padding:1rem 1.1rem;border:1px solid rgba(201,168,76,.4);border-radius:14px;background:rgba(8,24,20,.55);max-width:40rem'>",
    "<summary style='cursor:pointer;color:#e0c56a;font-weight:800;font-size:1rem'>How your passphrase protects this vault</summary>",
    "<div style='font-size:.9rem;line-height:1.55;margin-top:.75rem;opacity:.95'>",
    "<p><strong>Educational only — not a fatwa · not legal advice · not a court document.</strong></p>",
    "<ol style='padding-left:1.2rem;margin:.5rem 0'>",
    "<li><strong>On this device only.</strong> Your passphrase unlocks Amānah Vault in this browser. Clarity’s servers are not given your passphrase.</li>",
    "<li><strong>Choose a strong phrase.</strong> Prefer a long phrase only you know. Do not reuse a password from email or social media.</li>",
    "<li><strong>Memorize or store offline.</strong> If you write it down, keep it private and separate from this device. Clarity cannot reset a forgotten passphrase.</li>",
    "<li><strong>Never type it into chat tools.</strong> Do not paste your passphrase into Claude, Grok, email, or screenshots.</li>",
    "<li><strong>Unlock enables export aids only.</strong> Daily email digests and on-demand API tokens use <em>snapshots you build after unlock</em> — not a live copy of the vault and not your passphrase.</li>",
    "<li><strong>Heir readiness is separate.</strong> Family instructions and export packs follow the labels in the vault; they are personal aids, not legal documents.</li>",
    "</ol>",
    "<p style='margin:.75rem 0 0;font-size:.82rem;opacity:.88'>Acceptance of deeds is with Allah. This vault is a personal organization aid.</p>",
    "<p style='margin:.35rem 0 0'><button type='button' id='amana-tut-dismiss' style='padding:.35rem .85rem;border-radius:999px;border:1px solid rgba(201,168,76,.45);background:transparent;color:#e0c56a;font-weight:700;cursor:pointer'>I understand — hide tips</button></p>",
    "</div></details>"
  ].join("");

  function findMount() {
    if (window.ClarityVaultGate && !window.ClarityVaultGate.allowPassphraseTutorial()) return null;
    var selectors = [
      "[data-vault-passphrase-panel]",
      "#vault-passphrase",
      "#amana-passphrase",
      ".vault-passphrase",
      ".amana-pass-gate",
      "#vault-unlock",
      "[data-vault-unlock]",
      "#amana-vault-gate",
      "[data-vault-root]",
      "#amana-vault",
      "#vault"
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) return el;
    }
    // password fields ONLY inside vault roots
    var inputs = (window.ClarityVaultGate && window.ClarityVaultGate.vaultPasswordInputs)
      ? window.ClarityVaultGate.vaultPasswordInputs()
      : [];
    for (var j = 0; j < inputs.length; j++) {
      var inp = inputs[j];
      var root = inp.closest("section,form,article,.card,[data-vault-root],#amana-vault") || inp.parentElement;
      if (root) return root;
    }
    return null;
  }

  function place() {
    if (document.getElementById(ID)) return;
    try {
      if (localStorage.getItem("clarity.vault.tutorial.dismissed.v1") === "1") return;
    } catch (e) {}
    var mount = findMount();
    if (!mount) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = HTML;
    var node = wrap.firstChild;
    // Prefer before passphrase form content
    if (mount.firstChild) mount.insertBefore(node, mount.firstChild);
    else mount.appendChild(node);
    var btn = document.getElementById("amana-tut-dismiss");
    if (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem("clarity.vault.tutorial.dismissed.v1", "1"); } catch (e) {}
        var el = document.getElementById(ID);
        if (el) el.remove();
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", place);
  else place();
  setTimeout(place, 800);
  setTimeout(place, 2000);
})();
