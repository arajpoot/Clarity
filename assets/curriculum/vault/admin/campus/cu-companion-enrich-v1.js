/**
 * Companion enrichment — MAP LANDING ONLY (20261016PAUSE)
 */
(function (g) {
  "use strict";
  if (g.__CU_COMPANION_ENRICH_V1__) return;
  g.__CU_COMPANION_ENRICH_V1__ = true;

  function isMap() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    if (document.body && document.body.getAttribute("data-campus-page") === "map") return true;
    return p === "/campus" || p === "/campus/";
  }

  function mount() {
    if (!isMap()) {
      var orphan = document.getElementById("cu-companion-enrich");
      if (orphan && !isMap()) orphan.remove();
      return;
    }
    if (document.getElementById("cu-companion-enrich")) return;
    /* Map HTML may already include the section — if not, light footer block */
    var main = document.querySelector("main.cu-wrap");
    if (!main) return;
    var box = document.createElement("section");
    box.id = "cu-companion-enrich";
    box.className = "cu-companion-enrich";
    box.innerHTML =
      '<h2 class="cu-enrich-title">Learning enrichment · from Companion</h2>' +
      '<p class="cu-enrich-lead">Map only — educational links. Depth stays in Desk / Lab.</p>' +
      '<div class="cu-enrich-grid">' +
      '<a class="cu-enrich-card" href="/#reminder"><strong>Daily verse</strong><span>Companion Reminder</span></a>' +
      '<a class="cu-enrich-card" href="/lab/tajweed/"><strong>Tajweed (Lab)</strong><span>Lab booth</span></a>' +
      '<a class="cu-enrich-card" href="/lab/arabic/"><strong>Arabic (Lab)</strong><span>Letters · match · phrases</span></a>' +
      '<a class="cu-enrich-card" href="/vault/"><strong>Vault</strong><span>On-device notes</span></a>' +
      "</div>";
    var foot = document.querySelector("footer.cu-foot");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot);
    else main.appendChild(box);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(typeof window !== "undefined" ? window : this);
