/*! amana-affairs-e1.js · Phase E
 * Educational affairs notes on Amānah desk — wasiyyah / dayn reminders
 * Not a fatwa · not a legal form · verify with qualified scholars
 */
(function (w, d) {
  "use strict";
  if (w.__AMANA_AFFAIRS_E1__) return;
  w.__AMANA_AFFAIRS_E1__ = true;

  function mount() {
    if (d.getElementById("amana-e1-affairs")) return;
    var host = d.getElementById("amana-desk-mount") || d.body;
    var el = d.createElement("section");
    el.id = "amana-e1-affairs";
    el.setAttribute("style", "max-width:42rem;margin:1rem auto;padding:1rem;border-radius:16px;border:1px solid rgba(201,162,39,.35);background:rgba(8,18,14,.6)");
    el.innerHTML =
      "<h2 style=\"margin:.2rem 0 .4rem\">📋 Affairs notes · educational</h2>" +
      "<p style=\"font-size:.9rem;line-height:1.5;opacity:.95\">On-device reminders only. <strong>Not a fatwa, not a will template, not legal advice.</strong> Confirm with a local qualified scholar and your jurisdiction.</p>" +
      "<ul style=\"font-size:.9rem;line-height:1.55\">" +
      "<li><strong>Dayn (debts)</strong> — keep a private list of what you owe and what is owed to you; settle when able.</li>" +
      "<li><strong>Wasiyyah (bequest)</strong> — education: a bequest is limited in the classical schools; heirs and local law matter. Seek a qualified advisor.</li>" +
      "<li><strong>Documents</strong> — store only what you choose on this device; passphrase never leaves your control.</li>" +
      "</ul>" +
      '<p class="td-src" style="font-size:.82rem">Qurʾān 4:58 · trusts · <a href="https://quran.com/4/58" target="_blank" rel="noopener">quran.com/4/58</a> · educational only — not a fatwa</p>' +
      '<p style="margin-top:.6rem"><a class="btn" href="/amana/unlock/">Open vault unlock</a></p>';
    host.appendChild(el);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", mount);
  else mount();
  setTimeout(mount, 400);
})(window, document);
