/*! Amānah Farāʾiḍ study UX v1 · P6
 * Outline-first panel · path strip · educational stamps · calc host ensure
 * Tree → Farāʾiḍ → Wasiyyah links only (wasiyyah logic held)
 * Educational only — not a fatwa · not a court order · madhāhib differ
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_FIQH_STUDY_UX_V1__) return;
  w.__CLARITY_AMANA_FIQH_STUDY_UX_V1__ = true;

  function isFiqh() {
    try {
      return /\/amana\/fiqh\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function ensureStamp() {
    if (document.getElementById("amana-fiqh-stamp-strong")) return;
    var main = document.querySelector("main.amana-wrap") || document.body;
    var stamp = document.createElement("p");
    stamp.id = "amana-fiqh-stamp-strong";
    stamp.className = "cred-stamp";
    stamp.setAttribute("role", "note");
    stamp.innerHTML =
      "<strong>Educational study aid only — not a fatwa · not legal advice · not a court order.</strong> " +
      "Hanafi-leaning outline for learning; other madhāhib may differ. Confirm any real estate with a qualified local scholar. " +
      "Debts and funeral costs come before shares.";
    var card = document.getElementById("faraid-card");
    if (card && card.parentNode) card.parentNode.insertBefore(stamp, card);
    else main.insertBefore(stamp, main.firstChild);
  }

  function ensureOutlineHost() {
    if (document.getElementById("amana-fiqh-outline-host")) return;
    var card = document.getElementById("faraid-card");
    if (!card || !card.parentNode) return;
    var host = document.createElement("section");
    host.className = "amana-card";
    host.id = "amana-fiqh-outline-host";
    host.innerHTML =
      "<h2 style=\"margin:0 0 0.4rem;color:#d4b45a;font-size:1.05rem\">Tree outline for study</h2>" +
      '<p style="font-size:0.82rem;opacity:0.9;margin:0 0 0.45rem">Built from your on-device family tree. Refresh after editing the tree. Educational only.</p>' +
      '<div id="amana-fiqh-outline-body"><p style="font-size:0.85rem;opacity:0.85">Open <a href="/amana/tree/">Family tree</a> → Outline for Farāʾiḍ study, or wait for auto-build…</p></div>' +
      '<div style="margin-top:0.5rem;display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" class="btn-soft" id="fiqh-ux-refresh-outline">Refresh from tree</button>' +
      '<button type="button" class="btn-soft" id="fiqh-ux-suggest-heirs">Suggest living heirs</button>' +
      '<a class="btn-soft" href="/amana/tree/">Edit on Tree</a>' +
      "</div>";
    card.parentNode.insertBefore(host, card);

    document.getElementById("fiqh-ux-refresh-outline").onclick = function () {
      if (typeof w.uftSaveFiqhOutline === "function") {
        try {
          w.uftSaveFiqhOutline();
        } catch (e) {}
      }
      // Trigger bridge re-render if present
      var btn = document.getElementById("fiqh-outline-refresh");
      if (btn) {
        try {
          btn.click();
        } catch (e2) {}
      } else if (typeof w.uftBuildFiqhOutline === "function") {
        try {
          var o = w.uftBuildFiqhOutline();
          if (typeof w.uftSaveFiqhOutline === "function") w.uftSaveFiqhOutline();
          renderOutline(o);
        } catch (e3) {}
      }
    };
    document.getElementById("fiqh-ux-suggest-heirs").onclick = function () {
      var b = document.getElementById("fiqh-outline-to-heirs") || document.getElementById("fc-pull");
      if (b) {
        try {
          b.click();
        } catch (e) {}
      } else {
        alert("Open the calculator section and use Load heirs from family tree. Educational only — not a fatwa.");
      }
    };
  }

  function renderOutline(o) {
    var body = document.getElementById("amana-fiqh-outline-body");
    if (!body || !o) return;
    var people = o.people || [];
    if (!people.length) {
      body.innerHTML =
        '<p style="font-size:0.85rem">No outline yet. Add people on the <a href="/amana/tree/">Family tree</a>.</p>';
      return;
    }
    var rows = people
      .map(function (p) {
        return (
          "<tr><td>" +
          esc(p.name) +
          "</td><td>" +
          esc(p.role) +
          "</td><td>" +
          esc(p.gender) +
          "</td><td>" +
          esc(p.vital) +
          "</td></tr>"
        );
      })
      .join("");
    body.innerHTML =
      '<div class="cred-stamp">Educational outline from on-device tree — not a fatwa · not a court document</div>' +
      '<div style="overflow:auto"><table style="width:100%;font-size:0.82rem;border-collapse:collapse">' +
      "<thead><tr><th>Name</th><th>Role</th><th>Gender</th><th>Vital</th></tr></thead>" +
      "<tbody>" +
      rows +
      "</tbody></table></div>";
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function ensureCalcHost() {
    var card = document.getElementById("faraid-card");
    if (!card) return;
    if (!document.getElementById("amana-faraid-calc-root")) {
      var div = document.createElement("div");
      div.id = "amana-faraid-calc-root";
      card.appendChild(div);
    }
    // Prefer calculator self-mount; if not, leave rich root
  }

  function ensurePathStrip() {
    if (document.getElementById("amana-fiqh-path-strip")) return;
    var main = document.querySelector("main.amana-wrap");
    if (!main) return;
    var strip = document.createElement("nav");
    strip.id = "amana-fiqh-path-strip";
    strip.style.cssText = "display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.5rem 0 0.75rem";
    strip.setAttribute("aria-label", "Fiqh path");
    strip.innerHTML =
      '<a class="btn-soft" href="/amana/tree/">1 · Family tree</a>' +
      '<a class="btn-soft" href="/amana/fiqh/" aria-current="page">2 · Farāʾiḍ study</a>' +
      '<a class="btn-soft" href="/amana/wasiyyah/">3 · Wasiyyah notes</a>';
    var sub = main.querySelector(".amana-subnav");
    if (sub && sub.nextSibling) main.insertBefore(strip, sub.nextSibling);
    else main.insertBefore(strip, main.firstChild);
  }

  function tryLoadOutline() {
    try {
      var raw = localStorage.getItem("clarity_amana_fiqh_outline_v1");
      if (!raw) {
        if (typeof w.uftBuildFiqhOutline === "function") {
          var o = w.uftBuildFiqhOutline();
          if (o && o.people && o.people.length) renderOutline(o);
        }
        return;
      }
      renderOutline(JSON.parse(raw));
    } catch (e) {}
  }

  function boot() {
    if (!isFiqh()) return;
    try {
      ensureStamp();
      ensurePathStrip();
      ensureOutlineHost();
      ensureCalcHost();
      tryLoadOutline();
    } catch (e) {
      try {
        console.warn("[fiqh study ux]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  setTimeout(tryLoadOutline, 1600);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 100);
  });
})(typeof window !== "undefined" ? window : this);
