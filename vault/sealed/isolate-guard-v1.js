/*! Vault isolate guard — blocks non-façade passphrase field access from random scripts · best-effort */
(function () {
  "use strict";
  // Soft guard: mark vault roots
  function tag() {
    var roots = document.querySelectorAll("#amana-vault, [data-vault-root], #vault, .amana-vault");
    roots.forEach(function (r) {
      r.setAttribute("data-vault-sealed", "1");
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tag);
  else tag();
})();
