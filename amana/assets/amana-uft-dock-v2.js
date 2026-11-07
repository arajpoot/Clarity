/*! Amānah UFT dock chrome v2 · P2
 * Companion-parity Edit names package · steps 1–5
 * Collapsible · LTR · Islamic palette via amana-uft-dock-v2.css
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_DOCK_V2__) return;
  w.__CLARITY_AMANA_UFT_DOCK_V2__ = true;
  /* Prefer v2 over v1 inject if both load */
  w.__CLARITY_AMANA_UFT_DOCK_V1__ = true;

  function isTree() {
    try {
      return /\/amana\/tree\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function titlebarHtml() {
    return (
      '<div class="uft-titlebar-amana" id="uft-titlebar-amana">' +
      '<div class="uft-titlebar-main"><h2>🌳 Family tree</h2>' +
      '<span class="uft-titlebar-sub">Ancestry pedigree · registry · links</span></div>' +
      '<p class="uft-titlebar-desc">Private pedigree outline on this device. Educational genealogy — not a legal pedigree certificate. Confirm farāʾiḍ with a scholar.</p>' +
      '<details class="uft-tutorial-amana" id="uft-tutorial-amana">' +
      "<summary>💡 How to use · quick guide</summary>" +
      "<ol>" +
      "<li><strong>1 · Registry</strong> — add people (name, relation, optional contacts).</li>" +
      "<li><strong>2 · Link</strong> — attach roles (child, spouse, sibling, parent) toward the pedigree.</li>" +
      "<li><strong>3 · Loaded cards</strong> — review / upload list; offload or clear when ready (P3).</li>" +
      "<li><strong>4 · Build tree</strong> — stage pedigree; Snapshot for a local recovery point.</li>" +
      "<li><strong>5 · Vitals</strong> — gender / living-deceased before Farāʾiḍ study.</li>" +
      "</ol>" +
      '<p style="margin:.35rem 0 0;opacity:.9"><strong>Privacy:</strong> data stays on this device. Not a court document.</p>' +
      "</details></div>"
    );
  }

  function dockHtml() {
    return (
      '<div class="uft-data-dock uft-dock-amana collapsed" id="uft-dock-amana" data-uft-dock="edit-names">' +
      '<div class="uft-dock-head">' +
      '<div class="uft-dock-title-wrap">' +
      "<strong>Edit names · Names &amp; registry</strong>" +
      '<span class="uft-dock-sub">1 Registry · 2 Link · 3 Loaded · 4 Build · 5 Vitals</span>' +
      "</div>" +
      '<button type="button" class="btn-soft uft-editor-toggle" id="uft-editor-toggle" aria-expanded="false">Expand</button>' +
      "</div>" +
      '<div class="uft-dock-steps" role="toolbar" aria-label="Registry workflow steps">' +
      '<button type="button" class="uft-step is-active" data-step="1">1 · Registry</button>' +
      '<button type="button" class="uft-step" data-step="2">2 · Link</button>' +
      '<button type="button" class="uft-step" data-step="3">3 · Loaded cards</button>' +
      '<button type="button" class="uft-step" data-step="4">4 · Build tree</button>' +
      '<button type="button" class="uft-step" data-step="5">5 · Vitals</button>' +
      "</div>" +
      '<p class="uft-dock-hint" id="uft-dock-hint"><strong>Step 1 · Registry</strong> — enter name and relation, then Add to registry.</p>' +
      '<div class="uft-dock-body" id="uft-dock-body">' +
      '<p style="font-size:0.78rem;opacity:0.88;margin:0">Use the registry form below. Expand this dock for step guidance. Educational outline only — not a legal pedigree.</p>' +
      "</div></div>"
    );
  }

  var HINTS = {
    1: "<strong>Step 1 · Registry</strong> — enter name and relation in the registry panel. Save to keep the person on this device.",
    2: "<strong>Step 2 · Link</strong> — set link host and relation (spouse, child, parent, sibling). Backbone roles can appear on the stage.",
    3: "<strong>Step 3 · Loaded cards</strong> — review the registry list. Upload / offload / scan duplicates land in later enrichment (P3).",
    4: "<strong>Step 4 · Build tree</strong> — use the pedigree stage above; Snapshot / Clear / Reset zoom as needed.",
    5: "<strong>Step 5 · Vitals</strong> — set gender and living/deceased on people before Farāʾiḍ study loads heirs. Open Farāʾiḍ when ready."
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
        document.getElementById("uft-reg-name") ||
        document.getElementById("uft-registry-deep") ||
        document.querySelector(".uft-grid")
      );
    }
    if (n === 2) {
      return (
        document.getElementById("uft-reg-link-rel") ||
        document.getElementById("uft-reg-role") ||
        document.getElementById("uft-reg-link-host")
      );
    }
    if (n === 3) {
      return (
        document.getElementById("uft-reg-list") ||
        document.getElementById("uft-reg-loaded-count") ||
        document.getElementById("uft-library")
      );
    }
    if (n === 4) {
      return (
        document.getElementById("uft-preview") ||
        document.getElementById("uft-stage") ||
        document.getElementById("clarity-family-tree-host")
      );
    }
    if (n === 5) {
      return (
        document.getElementById("uft-reg-name") ||
        document.getElementById("uft-integrity") ||
        document.getElementById("uft-registry-deep")
      );
    }
    return null;
  }

  function setExpanded(open) {
    var dock = document.getElementById("uft-dock-amana");
    var btn = document.getElementById("uft-editor-toggle");
    if (!dock) return;
    if (open) {
      dock.classList.remove("collapsed");
      if (btn) {
        btn.textContent = "Collapse";
        btn.setAttribute("aria-expanded", "true");
      }
    } else {
      dock.classList.add("collapsed");
      if (btn) {
        btn.textContent = "Expand";
        btn.setAttribute("aria-expanded", "false");
      }
    }
  }

  function activateStep(n) {
    n = Number(n) || 1;
    if (typeof w.uftDockStepHighlight === "function") {
      try {
        w.uftDockStepHighlight(n);
      } catch (e) {}
    }
    document.querySelectorAll("#uft-dock-amana .uft-step").forEach(function (btn) {
      var on = Number(btn.getAttribute("data-step")) === n;
      btn.classList.toggle("is-active", on);
      btn.classList.toggle("active-step", on);
      if (on) {
        btn.classList.add("uft-step-flash");
        setTimeout(function () {
          try {
            btn.classList.remove("uft-step-flash");
          } catch (e) {}
        }, 900);
      }
    });
    var hint = document.getElementById("uft-dock-hint");
    if (hint) hint.innerHTML = HINTS[n] || HINTS[1];
    setExpanded(true);
    focusEl(stepTarget(n));
    try {
      var s = document.getElementById("uft-status");
      if (s) {
        s.textContent =
          "Step " + n + " · " + (HINTS[n] || "").replace(/<[^>]+>/g, "").slice(0, 72);
      }
    } catch (e) {}
  }

  function bindDock(node) {
    if (!node || node.getAttribute("data-uft-bound") === "1") return;
    node.setAttribute("data-uft-bound", "1");
    node.querySelectorAll(".uft-step").forEach(function (btn) {
      btn.onclick = function () {
        activateStep(btn.getAttribute("data-step"));
      };
    });
    var tog = document.getElementById("uft-editor-toggle");
    if (tog) {
      tog.onclick = function () {
        var dock = document.getElementById("uft-dock-amana");
        var open = dock && dock.classList.contains("collapsed");
        setExpanded(!!open);
      };
    }
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

    var existing = document.getElementById("uft-dock-amana");
    if (existing && !existing.classList.contains("uft-data-dock")) {
      /* Replace thin v1 dock with v2 package */
      existing.remove();
      existing = null;
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
      bindDock(node);
    } else {
      bindDock(document.getElementById("uft-dock-amana"));
    }
  }

  w.uftDockStep = activateStep;
  w.uftExpandEditor = function () {
    setExpanded(true);
  };
  w.uftCollapseEditor = function () {
    setExpanded(false);
  };
  w.uftToggleEditor = function () {
    var dock = document.getElementById("uft-dock-amana");
    if (!dock) return;
    setExpanded(dock.classList.contains("collapsed"));
  };

  function boot() {
    if (!isTree()) return;
    try {
      ensureChrome();
    } catch (e) {
      try {
        console.warn("[UFT dock v2]", e);
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
})(typeof window !== "undefined" ? window : this);
