(function(){
  "use strict";
  if (window.__CLARITY_AMANA_BACKUP_GUIDE__) return;
  window.__CLARITY_AMANA_BACKUP_GUIDE__ = true;

  var DATA_KEY = "clarity_amana_vault_blob_v1";
  var META_KEY = "clarity_amana_vault_meta_v1";

  function $(id){ return document.getElementById(id); }
  function setStatus(msg){
    var el = $("amana-backup-status");
    if (el) el.textContent = msg || "";
  }

  function exportEncrypted(){
    try {
      var blob = localStorage.getItem(DATA_KEY);
      var meta = localStorage.getItem(META_KEY);
      if (!blob) {
        setStatus("No encrypted vault on this device yet. Create and open the vault first.");
        return;
      }
      var pack = {
        type: "clarity-amana-vault-backup",
        version: 1,
        exported: new Date().toISOString(),
        note: "Encrypted at rest. Passphrase is NOT included. Keep passphrase offline separately.",
        meta: meta ? JSON.parse(meta) : null,
        blob: blob
      };
      /* strip any legacy hint from export meta */
      if (pack.meta && pack.meta.hint) delete pack.meta.hint;
      var text = JSON.stringify(pack, null, 2);
      var file = new Blob([text], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = "clarity-amana-vault-backup-" + new Date().toISOString().slice(0,10) + ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ try { URL.revokeObjectURL(a.href); a.remove(); } catch(e){} }, 500);
      setStatus("Encrypted backup downloaded. Store it offline. Passphrase is not in this file.");
    } catch(e){
      setStatus("Export failed on this device.");
    }
  }

  function helpPassphrase(){
    setStatus("Write the passphrase on paper (or offline password book). Do not screenshot it into cloud gallery. Do not use email as the only copy.");
    try {
      alert(
        "Passphrase hard copy\n\n" +
        "1. Write it offline (paper / offline vault) — not only in a phone note synced to the cloud.\n" +
        "2. Export encrypted backup regularly (button above).\n" +
        "3. Never store the passphrase inside the backup file.\n" +
        "4. If both passphrase and backups are lost, data cannot be recovered."
      );
    } catch(e){}
  }

  function boot(){
    var ex = $("amana-btn-export-encrypted");
    if (ex && !ex.__wired) {
      ex.__wired = true;
      ex.addEventListener("click", exportEncrypted);
    }
    var hp = $("amana-btn-backup-help");
    if (hp && !hp.__wired) {
      hp.__wired = true;
      hp.addEventListener("click", helpPassphrase);
    }
    /* purge stored hint from meta if present */
    try {
      var raw = localStorage.getItem(META_KEY);
      if (raw) {
        var m = JSON.parse(raw);
        if (m && m.hint) {
          delete m.hint;
          localStorage.setItem(META_KEY, JSON.stringify(m));
        }
      }
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", boot);
})();