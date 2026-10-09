/* Clarity University OS — Insignia emboss
 * Top-bar left: replace dual Clarity wordmark with university seal.
 * Certificates: emboss same insignia on graduation documents.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_BRAND_INSIGNIA__) return;
  g.__CLARITY_BRAND_INSIGNIA__ = true;

  var INS = "./assets/curriculum/vault/admin/brand/clarity-university-insignia.svg";
  var MARK = "./assets/curriculum/vault/admin/brand/clarity-university-mark.svg";

  function embossNav() {
    var brand = document.querySelector(".nav-brand, #clarity-global-nav .nav-brand, .global-nav .nav-brand");
    if (!brand) {
      /* fallback: first left brand span */
      brand = document.querySelector(".nav-left .nav-brand, .nav-left > span");
    }
    if (!brand || brand.getAttribute("data-cu-insignia")) return;
    brand.setAttribute("data-cu-insignia", "1");
    brand.classList.add("cu-nav-brand");
    brand.setAttribute("title", "Clarity University OS — Furnish Your Grave");
    brand.innerHTML =
      '<img class="cu-nav-insignia" src="' +
      INS +
      '" width="36" height="36" alt="" />' +
      '<span class="cu-nav-text"><span class="cu-nav-title">Clarity University</span>' +
      '<span class="cu-nav-sub">OS · Nur Path</span></span>';
    brand.onclick = function (ev) {
      if (g.ClarityUX && g.ClarityUX.openCompass) {
        ev.preventDefault();
        g.ClarityUX.openCompass();
        return;
      }
      if (typeof g.resetToGateView === "function") g.resetToGateView();
    };
  }

  function embossBanner() {
    var name = document.querySelector(".banner-brand .brand-name, .brand-name");
    if (name && !name.getAttribute("data-cu-ins")) {
      name.setAttribute("data-cu-ins", "1");
      /* keep text; add small mark before via parent */
      var parent = name.closest(".banner-brand") || name.parentElement;
      if (parent && !parent.querySelector(".cu-banner-mark")) {
        var img = document.createElement("img");
        img.className = "cu-banner-mark";
        img.src = MARK;
        img.width = 28;
        img.height = 28;
        img.alt = "";
        parent.insertBefore(img, parent.firstChild);
      }
    }
  }

  function embossCertificate(root) {
    root = root || document.getElementById("cdm-certificate");
    if (!root) return;
    var frame = root.querySelector(".cdc-frame") || root;
    if (frame.querySelector(".cu-cert-insignia")) return;
    var crest = document.createElement("div");
    crest.className = "cu-cert-insignia";
    crest.innerHTML =
      '<img src="' +
      INS +
      '" width="72" height="72" alt="Clarity University OS" />' +
      '<span class="cu-cert-os">Clarity University OS</span>';
    frame.insertBefore(crest, frame.firstChild);
    var brand = frame.querySelector(".cdc-brand");
    if (brand) {
      brand.textContent = "Clarity University OS · Certificate";
    }
  }

  function observeDiplomas() {
    var obs = new MutationObserver(function () {
      embossCertificate();
    });
    var m = document.getElementById("clarity-diploma-modal");
    if (m) obs.observe(m, { childList: true, subtree: true });
    document.addEventListener("clarity-diploma-issued", function () {
      setTimeout(embossCertificate, 200);
    });
  }

  function injectFavicon() {
    var link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    /* keep existing if png preferred; add alternate */
    var alt = document.createElement("link");
    alt.rel = "alternate icon";
    alt.type = "image/svg+xml";
    alt.href = MARK;
    document.head.appendChild(alt);
  }

  g.ClarityBrand = {
    embossNav: embossNav,
    embossCertificate: embossCertificate,
    insigniaUrl: INS,
    markUrl: MARK
  };

  function boot() {
    embossNav();
    embossBanner();
    observeDiplomas();
    injectFavicon();
    setTimeout(embossNav, 500);
    setTimeout(embossBanner, 800);
    try {
      console.info("%c Clarity University OS ", "background:#0d4f3c;color:#e8d48a", "Insignia embossed");
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(boot, 300);
  });
})(typeof window !== "undefined" ? window : this);
