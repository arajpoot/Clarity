/*! Amānah UFT enrich v1 · tutorial + registry chrome
 * Does not replace core UFT — only enhances chamber UX.
 * Full module remains clarity-amana-uft-v1.js + restore (Archive-3 lineage).
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_ENRICH_V1__) return;
  w.__CLARITY_AMANA_UFT_ENRICH_V1__ = true;

  var TUT_KEY = "clarity_uft_tutorial_done_v1";

  function isTreeChamber() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function tutorialHtml() {
    return (
      '<div class="uft-tutorial" id="uft-tutorial" role="region" aria-label="Family tree quick start">' +
      "<strong>Family tree · quick start</strong>" +
      "<ol>" +
      "<li><strong>Add yourself</strong> in the registry (name + role, e.g. Self).</li>" +
      "<li><strong>Add close family</strong> — spouse, children, parents, siblings.</li>" +
      "<li>Use the <strong>pedigree stage</strong> above to see the outline on this device.</li>" +
      "<li><strong>Snapshot</strong> saves a local recovery point. Data stays on this device.</li>" +
      "</ol>" +
      '<p style="margin:0.35rem 0 0;font-size:0.78rem;opacity:0.88">Educational outline only — not a legal pedigree · not a fatwa · confirm farāʾiḍ with a scholar.</p>' +
      '<div class="uft-tut-actions">' +
      '<button type="button" id="uft-tut-dismiss">Got it</button>' +
      '<button type="button" class="soft" id="uft-tut-scroll-reg">Go to registry</button>' +
      "</div></div>"
    );
  }

  function ensureTutorial() {
    var card = document.getElementById("user-family-tree-card");
    if (!card) return;
    if (document.getElementById("uft-tutorial")) return;
    try {
      if (localStorage.getItem(TUT_KEY) === "1") return;
    } catch (e) {}

    var host = document.getElementById("clarity-family-tree-host") || card;
    var stage = document.getElementById("uft-stage");
    var wrap = document.createElement("div");
    wrap.innerHTML = tutorialHtml();
    var node = wrap.firstChild;
    if (stage && stage.parentNode) {
      stage.parentNode.insertBefore(node, stage);
    } else {
      host.insertBefore(node, host.firstChild);
    }

    var dismiss = document.getElementById("uft-tut-dismiss");
    if (dismiss) {
      dismiss.onclick = function () {
        try {
          localStorage.setItem(TUT_KEY, "1");
        } catch (e) {}
        var t = document.getElementById("uft-tutorial");
        if (t) t.classList.add("is-dismissed");
      };
    }
    var goReg = document.getElementById("uft-tut-scroll-reg");
    if (goReg) {
      goReg.onclick = function () {
        var reg = document.querySelector(".uft-registry-panel") ||
                  document.getElementById("uft-reg-name");
        if (reg) {
          try {
            reg.scrollIntoView({ behavior: "smooth", block: "center" });
          } catch (e) {
            reg.scrollIntoView(true);
          }
        }
        if (document.getElementById("uft-reg-name")) {
          try {
            document.getElementById("uft-reg-name").focus();
          } catch (e) {}
        }
      };
    }
  }

  function wrapRegistry() {
    var nameField = document.getElementById("uft-reg-name");
    if (!nameField) return;
    // Find the left column that holds registry fields
    var col = nameField.closest("div");
    while (col && col.parentElement && !col.parentElement.classList.contains("uft-grid")) {
      col = col.parentElement;
    }
    if (!col) col = nameField.parentElement;
    if (!col || col.classList.contains("uft-registry-panel")) return;

    // Mark panel for CSS
    col.classList.add("uft-registry-panel");

    // Action row under fields if buttons exist nearby
    var card = document.getElementById("user-family-tree-card");
    if (card && !card.querySelector(".uft-disclaimer")) {
      var disc = document.createElement("p");
      disc.className = "uft-disclaimer";
      disc.innerHTML =
        "On-device family outline · <strong>not a legal pedigree</strong> · not a fatwa · not a court document. " +
        "Confirm inheritance with a qualified local scholar.";
      var foot = card.querySelector(".amana-foot");
      if (foot) card.insertBefore(disc, foot);
      else card.appendChild(disc);
    }
  }

  function polishStatus() {
    var s = document.getElementById("uft-status");
    if (!s) return;
    if (!s.textContent || /Loading UFT/i.test(s.textContent)) {
      if (typeof w.uftLoad === "function" || typeof w.uftRegRender === "function") {
        s.textContent = "UFT ready · educational outline on this device · not a legal pedigree";
      }
    }
  }

  function boot() {
    if (!isTreeChamber()) return;
    try {
      ensureTutorial();
      wrapRegistry();
      polishStatus();
    } catch (e) {
      try {
        console.warn("[UFT enrich]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 80);
  });
})(window);
