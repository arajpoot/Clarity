/* University Vault UI V2 — gate + modules after unlock */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_UI_V1__) return;
  g.__CU_VAULT_UI_V1__ = true;

  var V = function () {
    return g.ClarityVaultSecure;
  };

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg) {
    var t = $("vault-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "vault-toast";
      t.className = "vault-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () {
      t.classList.remove("show");
    }, 2800);
  }

  function field(label, key, area) {
    var d = V().data();
    var val = "";
    try {
      val = (area ? d[area][key] : "") || "";
    } catch (e) {}
    return (
      '<label class="vault-field"><span>' +
      label +
      '</span><textarea data-area="' +
      area +
      '" data-key="' +
      key +
      '" rows="3">' +
      String(val).replace(/</g, "&lt;") +
      "</textarea></label>"
    );
  }

  function renderModules() {
    var host = $("vault-module-host");
    if (!host || !V().isUnlocked()) return;
    var d = V().data();
    host.hidden = false;
    host.innerHTML =
      '<div class="vault-toolbar">' +
      '<button type="button" class="vault-btn vault-btn-primary" id="vault-save">Save encrypted</button>' +
      '<button type="button" class="vault-btn" id="vault-lock">Lock</button>' +
      '<button type="button" class="vault-btn" id="vault-export">Export JSON</button>' +
      "</div>" +
      '<details class="vault-mod" open><summary>Amana · Legacy pack</summary><div class="vault-mod-body">' +
      field("Identity / full name", "identity", "amana") +
      field("Next of kin", "nextOfKin", "amana") +
      field("Debts and trusts (who, amount, evidence note)", "debts", "amana") +
      field("Wasiyyah text notes (educational)", "wasiyyahNote", "amana") +
      field("Missed obligations (notes only)", "missed", "amana") +
      field("Duʿā list for the family", "dua", "amana") +
      field("Janazah / burial notes", "janazahNote", "amana") +
      field("Do-not list (educational)", "doNot", "amana") +
      "</div></details>" +
      '<details class="vault-mod"><summary>Family tree (sketch)</summary><div class="vault-mod-body">' +
      field("People & relationships (plain text pedigree)", "notes", "tree") +
      '<p class="vault-micro">Educational sketch for Mīrāth study — not a court pedigree.</p></div></details>' +
      '<details class="vault-mod"><summary>Farāʾiḍ · shares illustrator</summary><div class="vault-mod-body">' +
      field("Scenario description (study)", "scenario", "faraid") +
      field("Notes / questions for a teacher", "notes", "faraid") +
      '<fieldset class="vault-checks"><legend>Common-error checklist (tick to study)</legend>' +
      check("unborn", "Unborn child") +
      check("missing", "Missing person / grandfather issues") +
      check("prior", "Spouses from previous marriage") +
      check("nonmuslim", "Non-Muslim relatives (rules differ — ask a teacher)") +
      "</fieldset>" +
      '<p class="vault-micro">Illustrative only — not a calculation of your estate.</p></div></details>' +
      '<details class="vault-mod"><summary>Wasiyyah notes</summary><div class="vault-mod-body">' +
      field("Draft wasiyyah thoughts (non-binding)", "text", "wasiyyah") +
      '<p class="vault-micro">Remember educational limits often taught: wasiyyah not used to override heir shares; up to one-third discussed in the Sunnah — confirm with a teacher.</p></div></details>';

    function check(id, label) {
      var on = d.faraid.errorChecks && d.faraid.errorChecks[id];
      return (
        '<label class="vault-check"><input type="checkbox" data-check="' +
        id +
        '"' +
        (on ? " checked" : "") +
        "/> " +
        label +
        "</label>"
      );
    }

    host.querySelectorAll("textarea").forEach(function (ta) {
      ta.addEventListener("change", function () {
        var area = ta.getAttribute("data-area");
        var key = ta.getAttribute("data-key");
        if (V().data()[area]) V().data()[area][key] = ta.value;
      });
    });
    host.querySelectorAll("input[data-check]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        if (!V().data().faraid.errorChecks) V().data().faraid.errorChecks = {};
        V().data().faraid.errorChecks[cb.getAttribute("data-check")] = cb.checked;
      });
    });
    $("vault-save").onclick = function () {
      V()
        .save()
        .then(function () {
          toast("Saved · encrypted on this device");
        })
        .catch(function (e) {
          toast(e.message || "Save failed");
        });
    };
    $("vault-lock").onclick = function () {
      V().lock();
      host.hidden = true;
      host.innerHTML = "";
      showGate(true);
      toast("Locked");
    };
    $("vault-export").onclick = function () {
      try {
        var blob = new Blob([JSON.stringify(V().data(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "clarity-amana-vault-export.json";
        a.click();
        toast("Exported · keep file private");
      } catch (e) {
        toast("Export failed");
      }
    };
  }

  function showGate(locked) {
    var gate = $("vault-gate");
    var pass = $("vault-pass");
    var btn = $("vault-unlock-btn");
    var createBtn = $("vault-create-btn");
    if (!gate || !pass || !btn) return;
    pass.disabled = false;
    btn.disabled = false;
    btn.removeAttribute("title");
    btn.textContent = V().hasVault() ? "Unlock" : "Unlock";
    if (createBtn) {
      createBtn.hidden = V().hasVault();
      createBtn.disabled = false;
    }
    var status = $("vault-gate-status");
    if (status) {
      status.textContent = V().hasVault()
        ? locked
          ? "Vault exists on this device — enter passphrase."
          : "Unlocked."
        : "No vault yet — create a passphrase (min 8 characters). You alone must remember it.";
    }
  }

  function wireGate() {
    var pass = $("vault-pass");
    var btn = $("vault-unlock-btn");
    var createBtn = $("vault-create-btn");
    if (!pass || !btn) return;

    btn.onclick = function () {
      var p = pass.value || "";
      V()
        .unlock(p)
        .then(function () {
          pass.value = "";
          showGate(false);
          try { window.dispatchEvent(new CustomEvent("cu-vault-unlocked")); } catch(e){}
          if (window.ClarityVaultAmanaUnit && ClarityVaultAmanaUnit.render) ClarityVaultAmanaUnit.render();
          else renderModules();
          toast("Unlocked");
        })
        .catch(function (e) {
          toast(e.message || "Unlock failed");
        });
    };

    if (createBtn) {
      createBtn.onclick = function () {
        var p = pass.value || "";
        V()
          .createVault(p)
          .then(function () {
            pass.value = "";
            showGate(false);
            try { window.dispatchEvent(new CustomEvent("cu-vault-unlocked")); } catch(e){}
            if (window.ClarityVaultAmanaUnit && ClarityVaultAmanaUnit.render) ClarityVaultAmanaUnit.render();
            else renderModules();
            toast("Vault created · remember your passphrase");
          })
          .catch(function (e) {
            toast(e.message || "Create failed");
          });
      };
    }
  }

  function enhanceGateHtml() {
    var gate = $("vault-gate");
    if (!gate || gate.getAttribute("data-v2") === "1") return;
    gate.setAttribute("data-v2", "1");
    var row = gate.querySelector(".vault-gate-row");
    if (row && !$("vault-create-btn")) {
      var b = document.createElement("button");
      b.type = "button";
      b.id = "vault-create-btn";
      b.className = "vault-btn vault-btn-primary";
      b.textContent = "Create vault";
      row.appendChild(b);
    }
    if (!$("vault-gate-status")) {
      var p = document.createElement("p");
      p.id = "vault-gate-status";
      p.className = "vault-hint";
      gate.insertBefore(p, row);
    }
    if (!$("vault-module-host")) {
      var host = document.createElement("section");
      host.id = "vault-module-host";
      host.className = "vault-panel";
      host.hidden = true;
      host.setAttribute("aria-label", "Unlocked modules");
      gate.parentNode.insertBefore(host, gate.nextSibling);
    }
    /* Enable inputs */
    var pass = $("vault-pass");
    var btn = $("vault-unlock-btn");
    if (pass) {
      pass.disabled = false;
      pass.removeAttribute("aria-disabled");
    }
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Unlock";
      btn.removeAttribute("title");
    }
    var hint = gate.querySelector(".vault-hint");
    if (hint && hint.textContent.indexOf("next phase") >= 0) {
      hint.textContent =
        "On-device encryption (Web Crypto). Passphrase is never uploaded. Lost passphrase cannot be recovered.";
    }
  }

  g.ClarityVaultUI = { showGate: showGate, renderModules: renderModules };
  function boot() {
    if ((location.pathname || "").indexOf("/vault") !== 0) return;
    if (!g.crypto || !g.crypto.subtle) {
      toast("Web Crypto unavailable in this browser");
      return;
    }
    enhanceGateHtml();
    wireGate();
    showGate(true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
