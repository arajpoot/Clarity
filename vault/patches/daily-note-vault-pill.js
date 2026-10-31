/*! Companion daily note → Open Amānah Vault pill · navigation only */
(function () {
  "use strict";
  function place() {
    var hosts = [
      document.getElementById("vault-note-registry"),
      document.querySelector("[data-vault-note-registry]"),
      document.querySelector(".vault-note-registry"),
    ].filter(Boolean);
    // text match fallback
    if (!hosts.length) {
      document.querySelectorAll("h2,h3,.card-title").forEach(function (h) {
        if (/vault note registry/i.test(h.textContent || "")) {
          hosts.push(h.closest("section,article,.card,.yawm-card") || h.parentElement);
        }
      });
    }
    hosts.forEach(function (host) {
      if (!host || host.querySelector("[data-open-amana-vault-pill]")) return;
      var a = document.createElement("a");
      a.setAttribute("data-open-amana-vault-pill", "1");
      a.href = "#vault";
      a.textContent = "Open Amānah Vault";
      a.style.cssText =
        "display:inline-flex;margin:.5rem 0;padding:.35rem .85rem;border-radius:999px;border:1px solid rgba(201,168,76,.45);color:#e0c56a;text-decoration:none;font-size:.8rem;font-weight:700";
      a.addEventListener("click", function (e) {
        if (window.ClarityVault && window.ClarityVault.openDoor) {
          e.preventDefault();
          window.ClarityVault.openDoor();
        }
      });
      host.appendChild(a);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", place);
  else place();
  setTimeout(place, 1200);
})();
