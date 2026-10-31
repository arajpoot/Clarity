/*! Ensures vault-export-host exists near Amānah export/unlock UI */
(function () {
  "use strict";
  function ensure() {
    if (document.getElementById("vault-export-host") || document.querySelector("[data-vault-export]")) return;
    var roots = [
      document.querySelector("[data-vault-root]"),
      document.getElementById("amana-vault"),
      document.getElementById("vault"),
      document.querySelector(".amana-vault"),
    ].filter(Boolean);
    var mount = roots[0];
    if (!mount) {
      // late: password form parent
      var pw = document.querySelector('input[type="password"]');
      if (pw) mount = pw.closest("section,form,article,.card") || pw.parentElement;
    }
    if (!mount) return;
    var host = document.createElement("div");
    host.id = "vault-export-host";
    host.setAttribute("data-vault-export", "1");
    host.style.cssText = "margin:1rem 0";
    mount.appendChild(host);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensure);
  else ensure();
  setTimeout(ensure, 1000);
  setTimeout(ensure, 3000);
})();
