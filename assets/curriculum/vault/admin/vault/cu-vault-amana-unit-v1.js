/* Single-unit Amana Vault UI — companion-style fortress after unlock */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_AMANA_UNIT_V1__) return;
  g.__CU_VAULT_AMANA_UNIT_V1__ = true;

  function V() {
    return g.ClarityVaultSecure;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function ta(area, key, label, rows) {
    var d = V().data() || {};
    var val = "";
    try {
      val = (d[area] && d[area][key]) || "";
    } catch (e) {}
    return (
      '<label class="vault-field"><span>' +
      label +
      '</span><textarea data-area="' +
      area +
      '" data-key="' +
      key +
      '" rows="' +
      (rows || 3) +
      '">' +
      String(val).replace(/</g, "&lt;") +
      "</textarea></label>"
    );
  }

  function bind(host) {
    host.querySelectorAll("textarea").forEach(function (el) {
      el.addEventListener("change", function () {
        var a = el.getAttribute("data-area");
        var k = el.getAttribute("data-key");
        if (!V().data()[a]) V().data()[a] = {};
        V().data()[a][k] = el.value;
      });
    });
    host.querySelectorAll("input[data-check]").forEach(function (cb) {
      cb.addEventListener("change", function () {
        if (!V().data().faraid) V().data().faraid = { errorChecks: {} };
        if (!V().data().faraid.errorChecks) V().data().faraid.errorChecks = {};
        V().data().faraid.errorChecks[cb.getAttribute("data-check")] = cb.checked;
      });
    });
  }

  function renderUnit() {
    var host = $("vault-module-host");
    if (!host || !V().isUnlocked()) return;
    var d = V().data();
    var ec = (d.faraid && d.faraid.errorChecks) || {};
    function chk(id, label) {
      return (
        '<label class="vault-check"><input type="checkbox" data-check="' +
        id +
        '"' +
        (ec[id] ? " checked" : "") +
        "/> " +
        label +
        "</label>"
      );
    }

    host.hidden = false;
    host.innerHTML =
      '<div class="amana-session-bar" style="display:flex;justify-content:space-between;align-items:center;gap:.5rem;flex-wrap:wrap;margin-bottom:.75rem">' +
      "<span>● Vault open this session</span>" +
      '<span style="display:flex;gap:.35rem;flex-wrap:wrap">' +
      '<button type="button" class="vault-btn vault-btn-primary" id="vault-save">Save encrypted</button>' +
      '<button type="button" class="vault-btn" id="vault-export">Export JSON</button>' +
      '<button type="button" class="vault-btn" id="vault-print-pack">Print pack</button>' +
      '<button type="button" class="vault-btn" id="vault-export-pack">Export pack</button>' +
      '<button type="button" class="vault-btn" id="vault-lock">🔒 Lock</button>' +
      "</span></div>" +
      '<details class="vault-mod" open><summary>📋 Heir readiness · for those you leave behind</summary><div class="vault-mod-body">' +
      ta("amana", "identity", "Identity / full name") +
      ta("amana", "nextOfKin", "Next of kin") +
      ta("amana", "debts", "Debts and trusts (who, amount, evidence note)") +
      ta("amana", "wasiyyahNote", "Wasiyyah notes (educational)") +
      ta("amana", "missed", "Missed obligations (notes only — not a fatwa)") +
      ta("amana", "dua", "Duʿā list the family should make") +
      ta("amana", "janazahNote", "Janazah + burial notes") +
      ta("amana", "doNot", "Do-not list (educational)") +
      "</div></details>" +
      '<details class="vault-mod" open><summary>🌳 Family tree · interactive pedigree</summary><div class="vault-mod-body" id="cu-uft-mount">' +
      '<p class="vault-micro">Loading pedigree…</p></div></details>' +
      '<details class="vault-mod"><summary>📐 Farāʾiḍ · study tools</summary><div class="vault-mod-body" id="cu-faraid-mount"></div></details>' +
      '<details class="vault-mod"><summary>📜 Wasiyyah · bequest notes</summary><div class="vault-mod-body">' +
      ta("wasiyyah", "text", "Draft wasiyyah thoughts (non-binding)", 5) +
      '<p class="vault-micro">Classical teaching discusses limits (including the third; not using wasiyyah to cancel heir shares). Confirm with a teacher.</p>' +
      "</div></details>" +
      '<p class="vault-micro" style="margin-top:.75rem">Educational only — not a fatwa. You hold the passphrase.</p>';

    bind(host);

    try {
      var mountEl = document.getElementById("cu-uft-mount");
      if (mountEl && window.ClarityVaultUFT) ClarityVaultUFT.mount(mountEl);
    } catch (e) {}
    try {
      var fm = document.getElementById("cu-faraid-mount");
      if (fm && window.ClarityVaultFaraid) ClarityVaultFaraid.mount(fm);
    } catch (e2) {}
    try {
      var pb = document.getElementById("vault-print-pack");
      if (pb && window.ClarityVaultPrint) pb.onclick = function(){ ClarityVaultPrint.printPack(); };
      var eb = document.getElementById("vault-export-pack");
      if (eb && window.ClarityVaultPrint) eb.onclick = function(){ ClarityVaultPrint.exportPack(); };
    } catch (e3) {}

    $("vault-save").onclick = function () {
      V()
        .save()
        .then(function () {
          g.dispatchEvent(new CustomEvent("cu-vault-toast", { detail: "Saved · encrypted on device" }));
        })
        .catch(function (e) {
          g.dispatchEvent(new CustomEvent("cu-vault-toast", { detail: e.message || "Save failed" }));
        });
    };
    $("vault-lock").onclick = function () {
      V().lock();
      host.hidden = true;
      host.innerHTML = "";
      var mods = $("vault-modules");
      if (mods) mods.hidden = false;
      if (g.ClarityVaultUI && g.ClarityVaultUI.showGate) g.ClarityVaultUI.showGate(true);
      else location.reload();
    };
    $("vault-export").onclick = function () {
      try {
        var blob = new Blob([JSON.stringify(V().data(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "clarity-amana-unit-export.json";
        a.click();
      } catch (e) {}
    };

    /* hide preview tiles when unit open */
    var mods = $("vault-modules");
    if (mods) mods.hidden = true;
  }

  /* Hook after UI unlock */
  var prevRender = null;
  function patch() {
    if (!g.ClarityVaultSecure) return;
    /* Replace module host render from ui */
    g.ClarityVaultAmanaUnit = { render: renderUnit };
    document.addEventListener("cu-vault-unlocked", function () {
      renderUnit();
    });
  }

  /* Patch vault UI to dispatch event and use unit render */
  function boot() {
    patch();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
