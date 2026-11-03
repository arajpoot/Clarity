/*! Amānah living-centre v1 · Tree as hub to Heirs / Farāʾiḍ / Wasiyyah
 * Educational only — not a fatwa · not legal advice
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_LIVING_CENTRE_V1__) return;
  w.__CLARITY_AMANA_LIVING_CENTRE_V1__ = true;

  function path() {
    return location.pathname || "";
  }
  function isTree() {
    return /\/amana\/tree\/?/.test(path());
  }
  function isHeirs() {
    return /\/amana\/heirs\/?/.test(path());
  }
  function isFiqh() {
    return /\/amana\/fiqh\/?/.test(path());
  }
  function isWasiyyah() {
    return /\/amana\/wasiyyah\/?/.test(path());
  }

  function hubHtml() {
    return (
      '<aside class="amana-living-centre" id="amana-living-centre" aria-label="Amānah living centre">' +
      "<h2>Living centre · family tree</h2>" +
      '<p class="alc-lead">Names on this device are the hub. Move to readiness, study, then wasiyyah notes — educational only.</p>' +
      '<div class="alc-flow" aria-hidden="true">' +
      "<span>Tree</span><span class=\"sep\">→</span>" +
      "<span>Heirs</span><span class=\"sep\">→</span>" +
      "<span>Farāʾiḍ</span><span class=\"sep\">→</span>" +
      "<span>Wasiyyah</span>" +
      "</div>" +
      '<div class="alc-grid">' +
      '<a class="alc-card" href="/amana/heirs/"><strong>Heirs</strong><span>Letter to heirs · household outline · print pack</span></a>' +
      '<a class="alc-card" href="/amana/fiqh/"><strong>Farāʾiḍ study</strong><span>Educational share maps · not a court calculation</span></a>' +
      '<a class="alc-card" href="/amana/wasiyyah/"><strong>Wasiyyah</strong><span>Bequest notes · debts before gifts · on device</span></a>' +
      '<a class="alc-card" href="/amana/dayn/"><strong>Dayn</strong><span>Qard ḥasan ledger · settle rights first</span></a>' +
      '<a class="alc-card" href="/amana/notes/"><strong>Notes</strong><span>Vault notes · export desk</span></a>' +
      "</div>" +
      '<p class="alc-note">Not a fatwa · not legal advice · not a court document. Confirm inheritance and wasiyyah with a qualified local scholar.</p>' +
      "</aside>"
    );
  }

  function stripHtml(here) {
    function cls(id) {
      return here === id ? ' class="is-here"' : "";
    }
    return (
      '<nav class="amana-centre-strip" aria-label="Amānah living centre">' +
      "<strong>Living centre</strong>" +
      '<div class="acs-links">' +
      '<a href="/amana/tree/"' +
      cls("tree") +
      ">Family tree</a>" +
      '<a href="/amana/heirs/"' +
      cls("heirs") +
      ">Heirs</a>" +
      '<a href="/amana/fiqh/"' +
      cls("fiqh") +
      ">Farāʾiḍ</a>" +
      '<a href="/amana/wasiyyah/"' +
      cls("wasiyyah") +
      ">Wasiyyah</a>" +
      '<a href="/amana/dayn/">Dayn</a>' +
      "</div></nav>"
    );
  }

  function injectHub() {
    if (document.getElementById("amana-living-centre")) return;
    var main = document.querySelector("main.amana-wrap") || document.querySelector("main");
    if (!main) return;
    var card = document.getElementById("user-family-tree-card");
    var wrap = document.createElement("div");
    wrap.innerHTML = hubHtml();
    var node = wrap.firstChild;
    if (card && card.parentNode) {
      card.parentNode.insertBefore(node, card);
    } else {
      var sub = main.querySelector(".amana-subnav");
      if (sub && sub.nextSibling) main.insertBefore(node, sub.nextSibling);
      else main.insertBefore(node, main.firstChild);
    }
  }

  function injectStrip(here) {
    if (document.querySelector(".amana-centre-strip")) return;
    var main = document.querySelector("main.amana-wrap") || document.querySelector("main");
    if (!main) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = stripHtml(here);
    var node = wrap.firstChild;
    var sub = main.querySelector(".amana-subnav");
    if (sub && sub.nextSibling) main.insertBefore(node, sub.nextSibling);
    else {
      var firstCard = main.querySelector(".amana-card, section");
      if (firstCard) main.insertBefore(node, firstCard);
      else main.appendChild(node);
    }
  }

  function boot() {
    try {
      if (isTree()) injectHub();
      else if (isHeirs()) injectStrip("heirs");
      else if (isFiqh()) injectStrip("fiqh");
      else if (isWasiyyah()) injectStrip("wasiyyah");
    } catch (e) {
      try {
        console.warn("[Living centre]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
})(window);
