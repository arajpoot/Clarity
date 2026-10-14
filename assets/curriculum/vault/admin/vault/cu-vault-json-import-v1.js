/* Full Amana unit JSON import — unlocked session only */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_JSON_IMPORT_V1__) return;
  g.__CU_VAULT_JSON_IMPORT_V1__ = true;

  function V() {
    return g.ClarityVaultSecure;
  }

  function mergeImport(raw) {
    var d = V().data();
    if (!d) throw new Error("Locked");
    var src = raw;
    if (raw.amana || raw.tree || raw.faraid || raw.wasiyyah) src = raw;
    else if (raw.data) src = raw.data;
    else if (raw.pack) src = raw.pack;

    if (src.amana && typeof src.amana === "object") {
      d.amana = d.amana || {};
      Object.keys(src.amana).forEach(function (k) {
        d.amana[k] = src.amana[k];
      });
    }
    if (src.tree) {
      d.tree = d.tree || { people: [], notes: "" };
      if (Array.isArray(src.tree.people)) d.tree.people = src.tree.people;
      else if (Array.isArray(src.people)) d.tree.people = src.people;
      if (src.tree.notes != null) d.tree.notes = src.tree.notes;
      if (src.notes && !src.tree) d.tree.notes = src.notes;
    } else if (Array.isArray(src.people)) {
      d.tree = d.tree || { people: [], notes: "" };
      d.tree.people = src.people;
    }
    if (src.faraid && typeof src.faraid === "object") {
      d.faraid = Object.assign(d.faraid || {}, src.faraid);
    }
    if (src.wasiyyah && typeof src.wasiyyah === "object") {
      d.wasiyyah = Object.assign(d.wasiyyah || {}, src.wasiyyah);
    }
    /* Companion UFT-only file */
    if (src.format === "clarity-uft-edu-v1" && Array.isArray(src.people)) {
      d.tree = { people: src.people, notes: src.notes || "" };
    }
    return d;
  }

  function importFile(file, onDone) {
    if (!V() || !V().isUnlocked()) {
      alert("Unlock the vault before importing.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        mergeImport(data);
        V()
          .save()
          .then(function () {
            if (onDone) onDone(true);
            else if (g.ClarityVaultAmanaUnit && ClarityVaultAmanaUnit.render) {
              ClarityVaultAmanaUnit.render();
            }
            alert("JSON imported and saved encrypted on this device.");
          })
          .catch(function () {
            if (onDone) onDone(false);
            alert("Imported into session but save failed.");
          });
      } catch (e) {
        alert("Could not parse JSON.");
        if (onDone) onDone(false);
      }
    };
    reader.readAsText(file);
  }

  function wireButton(btnId, fileId) {
    var btn = document.getElementById(btnId);
    var file = document.getElementById(fileId);
    if (!btn || !file) return;
    btn.onclick = function () {
      file.click();
    };
    file.onchange = function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (f) importFile(f);
      file.value = "";
    };
  }

  g.ClarityVaultJsonImport = {
    importFile: importFile,
    mergeImport: mergeImport,
    wireButton: wireButton
  };
})(typeof window !== "undefined" ? window : this);
