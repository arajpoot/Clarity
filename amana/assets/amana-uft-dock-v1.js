/*! Amānah UFT dock chrome v1 · Companion-parity workflow steps 1–5
 * Does not replace core UFT — focuses existing registry / stage panels
 * Educational only — not a legal pedigree
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_DOCK_V1__) return;
  w.__CLARITY_AMANA_UFT_DOCK_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function titlebarHtml() {
    return (
      '<div class="uft-titlebar-amana" id="uft-titlebar-amana">' +
      '<div class="uft-titlebar-main"><h2>🌳 Family tree</h2>' +
      '<span class="uft-titlebar-sub">Ancestry pedigree · registry · links</span></div>' +
      '<p class="uft-titlebar-desc">Private pedigree outline on this device. Educational genealogy — not a legal pedigree certificate. Confirm farāʾiḍ with a scholar.</p>' +
      '<details class="uft-tutorial-amana" id="uft-tutorial-amana">' +
      "<summary>💡 How to use the Family Tree · quick guide</summary>" +
      "<ol>" +
      "<li><strong>1 · Registry</strong> — add people (name, relation, optional contacts).</li>" +
      "<li><strong>2 · Link</strong> — attach roles (child, spouse, sibling, parent) toward the pedigree.</li>" +
      "<li><strong>3 · List</strong> — review registry contacts; edit or remove.</li>" +
      "<li><strong>4 · Build / stage</strong> — use the pedigree stage and Snapshot to keep a local recovery point.</li>" +
      "<li><strong>5 · Vitals</strong> — set gender / living-deceased where needed before Farāʾiḍ study.</li>" +
      "</ol>" +
      "<p style=\"margin:.35rem 0 0;opacity:.9\"><strong>Privacy:</strong> data stays on this device. Not a court document.</p>" +
      "</details></div>"
    );
  }

  function dockHtml() {
    return (
      '<div class="uft-dock-amana" id="uft-dock-amana">' +
      '<div class="uft-dock-head">' +
      '<div class="uft-dock-title-wrap"><strong>Names &amp; registry</strong>' +
      '<span class="uft-dock-sub">Add · link · build pedigree</span></div>' +
      "</div>" +
      '<div class="uft-dock-steps" role="toolbar" aria-label="Registry workflow steps">' +
      '<button type="button" class="uft-step is-active" data-step="1">1 · Registry</button>' +
      '<button type="button" class="uft-step" data-step="2">2 · Link</button>' +
      '<button type="button" class="uft-step" data-step="3">3 · List</button>' +
      '<button type="button" class="uft-step" data-step="4">4 · Build</button>' +
      '<button type="button" class="uft-step" data-step="5">5 · Vitals</button>' +
      "</div>" +
      '<p class="uft-dock-hint" id="uft-dock-hint"><strong>Main workspace:</strong> Add people, set relations, then review the pedigree stage. Use Snapshot to save a local recovery point.</p>' +
      "</div>"
    );
  }

  var HINTS = {
    1: "<strong>Step 1 · Registry</strong> — enter name and relation in the registry panel. Save to keep the person on this device.",
    2: "<strong>Step 2 · Link</strong> — choose relation roles (spouse, child, parent, sibling). Backbone roles can appear on the stage.",
    3: "<strong>Step 3 · List</strong> — review registry contacts; edit or remove rows as needed.",
    4: "<strong>Step 4 · Build</strong> — use the pedigree stage above; Snapshot / Clear / Reset zoom as needed.",
    5: "<strong>Step 5 · Vitals</strong> — set gender and living/deceased on registry rows before Farāʾiḍ study loads heirs."
  };

  function focusEl(el) {
    if (!el) return;
    try {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (e) {
      try {
        el.scrollIntoView(true);
      } catch (err) {}
    }
    el.classList.add("uft-dock-focus");
    setTimeout(function () {
      try {
        el.classList.remove("uft-dock-focus");
      } catch (e) {}
    }, 1600);
  }

  function stepTarget(n) {
    n = Number(n);
    if (n === 1) {
      return (
        document.getElementById("uft-registry-deep") ||
        document.getElementById("uft-deep-name") ||
        document.getElementById("uft-reg-name") ||
        document.querySelector(".uft-registry-panel")
      );
    }
    if (n === 2) {
      return (
        document.getElementById("uft-deep-role") ||
        document.getElementById("uft-reg-role") ||
        document.getElementById("uft-reg-link-rel") ||
        document.getElementById("uft-registry-deep")
      );
    }
    if (n === 3) {
      return (
        document.getElementById("uft-deep-list") ||
        document.getElementById("uft-reg-list") ||
        document.getElementById("uft-registry-deep")
      );
    }
    if (n === 4) {
      return (
        document.getElementById("uft-stage") ||
        document.getElementById("clarity-family-tree-host") ||
        document.getElementById("user-family-tree-card")
      );
    }
    if (n === 5) {
      return (
        document.getElementById("uft-deep-vital") ||
        document.getElementById("uft-deep-gender") ||
        document.getElementById("uft-registry-deep") ||
        document.getElementById("uft-reg-name")
      );
    }
    return null;
  }

  function activateStep(n) {
    n = Number(n) || 1;
    // Prefer native UFT if present
    if (typeof w.uftDockStep === "function") {
      try {
        w.uftDockStep(n);
      } catch (e) {}
    }
    document.querySelectorAll("#uft-dock-amana .uft-step").forEach(function (btn) {
      btn.classList.toggle("is-active", Number(btn.getAttribute("data-step")) === n);
    });
    var hint = document.getElementById("uft-dock-hint");
    if (hint) hint.innerHTML = HINTS[n] || HINTS[1];
    focusEl(stepTarget(n));
    try {
      if (typeof w.uftSetStatus === "function") {
        w.uftSetStatus("Step " + n + " · " + (HINTS[n] || "").replace(/<[^>]+>/g, "").slice(0, 80));
      }
    } catch (e) {}
  }

  function ensureChrome() {
    var card = document.getElementById("user-family-tree-card");
    if (!card) return;

    if (!document.getElementById("uft-titlebar-amana")) {
      var wrap = document.createElement("div");
      wrap.innerHTML = titlebarHtml();
      var host = document.getElementById("clarity-family-tree-host") || card;
      host.insertBefore(wrap.firstChild, host.firstChild);
    }

    if (!document.getElementById("uft-dock-amana")) {
      var dockWrap = document.createElement("div");
      dockWrap.innerHTML = dockHtml();
      var stage = document.getElementById("uft-stage");
      var title = document.getElementById("uft-titlebar-amana");
      var node = dockWrap.firstChild;
      if (stage && stage.parentNode) {
        stage.parentNode.insertBefore(node, stage.nextSibling);
      } else if (title && title.parentNode) {
        title.parentNode.insertBefore(node, title.nextSibling);
      } else {
        card.appendChild(node);
      }
      node.querySelectorAll(".uft-step").forEach(function (btn) {
        btn.onclick = function () {
          activateStep(btn.getAttribute("data-step"));
        };
      });
    }
  }

  // Optional global for Companion parity
  if (typeof w.uftDockStep !== "function") {
    w.uftDockStep = activateStep;
  }
  if (typeof w.uftToggleEditor !== "function") {
    w.uftToggleEditor = function () {
      var dock = document.getElementById("uft-dock-amana");
      if (dock) dock.hidden = !dock.hidden;
    };
  }

  function boot() {
    if (!isTree()) return;
    try {
      ensureChrome();
    } catch (e) {
      try {
        console.warn("[UFT dock]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1400);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 100);
  });
})(window);
