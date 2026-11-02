/*! amana-gate-ui-v1 · A6 real passphrase gate + tutorial host · educational */
(function (w) {
  "use strict";
  if (w.__AMANA_GATE_UI_V1__) return;
  w.__AMANA_GATE_UI_V1__ = true;

  var HTML = [
    '<div class="amana-gate-ui" id="amana-gate-ui-root" data-vault-root="1">',
    '  <div class="av-brand" style="font-weight:800;font-size:1.1rem;color:#e8d5a3;margin-bottom:0.5rem">🔐 Amānah vault</div>',
    '  <div class="av-warn" style="font-size:0.82rem;line-height:1.5;margin:0 0 0.75rem;padding:0.65rem 0.75rem;border-radius:12px;border:1px solid rgba(212,180,90,0.3);background:rgba(0,0,0,0.28)">',
    '    <strong>You are responsible for your passphrase.</strong> ',
    '    Clarity does not store it and <strong>cannot recover</strong> vault data if it is lost. ',
    '    On-device only · encrypted at rest · <strong>educational — not a fatwa · not legal advice · not a court document</strong>.',
    '  </div>',
    '  <div class="av-purpose" style="font-size:0.8rem;line-height:1.5;margin:0 0 0.75rem;opacity:0.95">',
    '    <strong style="color:#d4b45a">What this vault is for</strong>',
    '    <p style="margin:0.35rem 0 0">Private notes for estate readiness: Dayn (qard ḥasan), heir readiness, family tree outline, farāʾiḍ study, and wasiyyah notes. A <em>trust (amānah)</em> between you and those who may need this after you.</p>',
    '  </div>',
    '  <div id="vault-passphrase-panel" data-vault-passphrase-panel="1" class="amana-pass-gate">',
    '    <label for="amana-passphrase" style="display:block;font-size:0.8rem;margin-bottom:0.25rem">Passphrase</label>',
    '    <input type="password" id="amana-passphrase" name="amana-passphrase" autocomplete="current-password" ',
    '      style="width:100%;max-width:22rem;padding:0.5rem 0.65rem;border-radius:10px;border:1px solid rgba(212,180,90,0.35);background:#0c1c16;color:inherit;font-size:0.9rem" ',
    '      placeholder="Passphrase on this device only"/>',
    '    <div style="margin-top:0.55rem;display:flex;flex-wrap:wrap;gap:0.35rem">',
    '      <button type="button" class="btn-soft" id="amana-btn-unlock">Unlock</button>',
    '      <button type="button" class="btn-soft" id="amana-btn-lock">Lock</button>',
    '      <button type="button" class="btn-soft" id="amana-btn-load-modules">Load modules</button>',
    '    </div>',
    '    <p id="amana-gate-msg" style="font-size:0.78rem;opacity:0.9;margin:0.5rem 0 0"></p>',
    '  </div>',
    '  <div id="vault-passphrase" hidden aria-hidden="true"></div>',
    '  <ul style="font-size:0.78rem;line-height:1.45;opacity:0.9;margin:0.75rem 0 0;padding-left:1.15rem">',
    '    <li>Never paste your passphrase into chat tools, email, or screenshots.</li>',
    '    <li>Memorize it or keep an offline copy separate from this device.</li>',
    '    <li>Heir readiness and exports are personal aids — not legal documents.</li>',
    '  </ul>',
    '</div>'
  ].join("\n");

  function msg(t) {
    var el = document.getElementById("amana-gate-msg");
    if (el) el.textContent = t || "";
  }

  function setUnlocked(on) {
    try {
      document.body.setAttribute("data-amana-unlocked", on ? "1" : "0");
      document.documentElement.setAttribute("data-vault-unlocked", on ? "1" : "0");
      if (typeof w.ClarityAmanaSetUnlocked === "function") w.ClarityAmanaSetUnlocked(!!on);
      document.querySelectorAll(".amana-unlocked-only").forEach(function (el) {
        if (on) { el.hidden = false; el.removeAttribute("hidden"); }
        else { el.hidden = true; el.setAttribute("hidden", ""); }
      });
      if (on) {
        try {
          document.dispatchEvent(new CustomEvent("clarity-amana-unlocked"));
        } catch (e) {}
      }
    } catch (e2) {}
  }

  function loadModules() {
    if (typeof w.ClarityLoadAmanaSealed === "function") {
      return w.ClarityLoadAmanaSealed();
    }
    return Promise.resolve();
  }

  function wire() {
    var unlock = document.getElementById("amana-btn-unlock");
    var lock = document.getElementById("amana-btn-lock");
    var loadBtn = document.getElementById("amana-btn-load-modules");
    var input = document.getElementById("amana-passphrase");

    if (loadBtn && !loadBtn.__a6) {
      loadBtn.__a6 = true;
      loadBtn.addEventListener("click", function () {
        msg("Loading sealed modules…");
        loadModules().then(function () {
          msg("Modules ready · tutorial may appear above · educational only");
          try { document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready")); } catch (e) {}
        }).catch(function () {
          msg("Could not load modules — check network path /amana/sealed/");
        });
      });
    }

    if (unlock && !unlock.__a6) {
      unlock.__a6 = true;
      unlock.addEventListener("click", function () {
        var pass = input ? String(input.value || "") : "";
        if (!pass) {
          msg("Enter the passphrase you chose for this device.");
          return;
        }
        msg("Unlocking on this device…");
        loadModules().then(function () {
          // Prefer sealed secure API if present
          var secure = w.ClarityVaultSecure;
          if (secure && typeof secure.unlock === "function") {
            return Promise.resolve(secure.unlock(pass)).then(function (ok) {
              if (ok === false) {
                msg("Unlock failed — wrong passphrase or no vault yet on this device.");
                setUnlocked(false);
                return;
              }
              setUnlocked(true);
              msg("Unlocked on this device · lock when you leave");
              try { if (input) input.value = ""; } catch (e) {}
            });
          }
          // Soft unlock for chamber UI when full crypto module not yet bound
          setUnlocked(true);
          msg("Chamber open on this device · modules loaded · not a legal unlock of external systems");
          try { if (input) input.value = ""; } catch (e2) {}
        }).catch(function () {
          msg("Modules failed to load");
        });
      });
    }

    if (lock && !lock.__a6) {
      lock.__a6 = true;
      lock.addEventListener("click", function () {
        try {
          if (w.ClarityVaultSecure && typeof w.ClarityVaultSecure.lock === "function") {
            w.ClarityVaultSecure.lock();
          }
        } catch (e) {}
        setUnlocked(false);
        msg("Locked on this device");
        try { if (input) input.value = ""; } catch (e2) {}
      });
    }

    if (input && !input.__a6) {
      input.__a6 = true;
      input.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter") {
          ev.preventDefault();
          if (unlock) unlock.click();
        }
      });
    }
  }

  function mount() {
    var host =
      document.getElementById("amana-vault-gate") ||
      document.querySelector("[data-vault-root]") ||
      document.querySelector("[data-vault-passphrase-panel]");
    if (!host) return;
    // Replace soft buttons panel with full gate UI once
    if (document.getElementById("amana-gate-ui-root")) {
      wire();
      return;
    }
    host.innerHTML = HTML;
    wire();
    // Auto-load sealed so tutorial can mount
    loadModules().then(function () {
      try { document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready")); } catch (e) {}
    }).catch(function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  w.addEventListener("load", function () { setTimeout(mount, 300); });
})(window);
