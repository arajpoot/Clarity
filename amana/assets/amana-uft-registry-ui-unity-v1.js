/*! Amānah UFT · registry UI unity v1
 * Merges static "Registry · add person" + injected "Registry · full fields"
 * into one cohesive intake: name, role, gender, vital, contacts, link host/rel.
 * Prevents second deep panel mount. Educational only — not a legal pedigree.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_REGISTRY_UI_UNITY_V1__) return;
  w.__CLARITY_AMANA_UFT_REGISTRY_UI_UNITY_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "") || !!d.getElementById("user-family-tree-card");
  }

  var ROLES = [
    ["self", "Self (focus)"],
    ["spouse", "Spouse"],
    ["father", "Father"],
    ["mother", "Mother"],
    ["child", "Child"],
    ["sibling", "Sibling"],
    ["pgf", "Paternal grandfather"],
    ["pgm", "Paternal grandmother"],
    ["mgf", "Maternal grandfather"],
    ["mgm", "Maternal grandmother"],
    ["uncle", "Uncle"],
    ["aunt", "Aunt"],
    ["nephew", "Nephew"],
    ["niece", "Niece"],
    ["grandchild", "Grandchild"],
    ["other", "Other"]
  ];

  function opts(list, sel) {
    return list
      .map(function (r) {
        var v = r[0];
        var lab = r[1];
        return (
          '<option value="' +
          v +
          '"' +
          (v === sel ? " selected" : "") +
          ">" +
          lab +
          "</option>"
        );
      })
      .join("");
  }

  function ensureUnifiedPanel() {
    if (d.getElementById("uft-registry-unified")) return d.getElementById("uft-registry-unified");
    var card = d.getElementById("user-family-tree-card");
    if (!card) return null;

    /* Block deep injector from creating a second form */
    if (!d.getElementById("uft-registry-deep")) {
      var marker = d.createElement("div");
      marker.id = "uft-registry-deep";
      marker.setAttribute("data-unity-marker", "1");
      marker.style.display = "none";
      card.appendChild(marker);
    }

    var panel = d.createElement("details");
    panel.id = "uft-registry-unified";
    panel.className = "uft-registry-unified amana-card";
    panel.open = true;
    panel.style.cssText =
      "margin:0.75rem 0;padding:0.85rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,0.35);background:rgba(15,76,58,0.14);";
    panel.innerHTML =
      "<summary style=\"cursor:pointer;font-weight:700;color:#e8d5a3;font-size:0.95rem\">1 · Member registry — add · link · build</summary>" +
      '<p style="margin:0.4rem 0 0.65rem;font-size:0.78rem;opacity:0.9;line-height:1.4">Single intake on this device. Add a person, set role / gender / vital, optionally <strong>link</strong> to someone already on the tree, then Build tree. Educational outline only — not a legal pedigree.</p>' +
      '<div class="uft-unity-grid" style="display:grid;gap:0.5rem;grid-template-columns:1fr 1fr">' +
      '<div class="uft-field" style="grid-column:1/-1"><label for="uft-reg-name">Full name *</label>' +
      '<input id="uft-reg-name" type="text" maxlength="80" placeholder="Full name" autocomplete="name" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit"/></div>' +
      '<div class="uft-field"><label for="uft-reg-role">Relation / role</label>' +
      '<select id="uft-reg-role" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit">' +
      opts(ROLES, "self") +
      "</select></div>" +
      '<div class="uft-field"><label for="uft-reg-gender">Gender (optional)</label>' +
      '<select id="uft-reg-gender" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit">' +
      '<option value="">—</option><option value="male">Male</option><option value="female">Female</option></select></div>' +
      '<div class="uft-field"><label for="uft-reg-vital">Vital (optional)</label>' +
      '<select id="uft-reg-vital" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit">' +
      '<option value="">—</option><option value="living">Living</option><option value="deceased">Deceased</option></select></div>' +
      '<div class="uft-field"><label for="uft-reg-phone">Phone</label>' +
      '<input id="uft-reg-phone" type="text" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit"/></div>' +
      '<div class="uft-field"><label for="uft-reg-email">Email</label>' +
      '<input id="uft-reg-email" type="email" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit"/></div>' +
      '<div class="uft-field"><label for="uft-reg-city">City</label>' +
      '<input id="uft-reg-city" type="text" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit"/></div>' +
      '<div class="uft-field"><label for="uft-reg-note">Note</label>' +
      '<input id="uft-reg-note" type="text" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit"/></div>' +
      '<div class="uft-field"><label for="uft-reg-link-host">Link host (on tree)</label>' +
      '<select id="uft-reg-link-host" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit">' +
      '<option value="">No link (registry only)</option></select></div>' +
      '<div class="uft-field"><label for="uft-reg-link-rel">As relation</label>' +
      '<select id="uft-reg-link-rel" style="width:100%;padding:0.4rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit">' +
      '<option value="child">Child</option><option value="spouse">Spouse</option><option value="sibling">Sibling</option>' +
      '<option value="father">Father</option><option value="mother">Mother</option><option value="other">Other relative</option></select></div>' +
      "</div>" +
      '<input type="hidden" id="uft-reg-edit-id" value=""/>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.65rem">' +
      '<button type="button" class="btn-soft" id="uft-unity-save">＋ Save &amp; link member</button>' +
      '<button type="button" class="btn-soft" id="uft-unity-pull">↙ Pull names from tree</button>' +
      '<button type="button" class="btn-soft" id="uft-unity-build">4 · Build pedigree</button>' +
      '<button type="button" class="btn-soft" id="uft-unity-clear">Clear form</button>' +
      "</div>" +
      '<div id="uft-reg-list" style="margin-top:0.75rem"></div>' +
      '<p id="uft-unity-reg-status" style="margin:0.4rem 0 0;font-size:0.78rem;opacity:0.9"></p>';

    /* Insert near stage / replace old grid */
    var oldGrid = card.querySelector(".uft-grid.uft-grid-2");
    if (oldGrid && oldGrid.parentNode) {
      oldGrid.style.display = "none";
      oldGrid.setAttribute("data-unity-hidden", "1");
      oldGrid.parentNode.insertBefore(panel, oldGrid);
    } else {
      var host = d.getElementById("clarity-family-tree-host");
      if (host && host.parentNode) host.parentNode.insertBefore(panel, host.nextSibling);
      else card.appendChild(panel);
    }

    /* Alias deep field ids to unified controls for any leftover deep JS */
    ["name", "phone", "email", "city", "note"].forEach(function (f) {
      var primary = d.getElementById("uft-reg-" + f);
      if (primary && !d.getElementById("uft-deep-" + f)) {
        primary.setAttribute("data-also-deep", f);
      }
    });

    bindUnified();
    return panel;
  }

  function setStatus(msg) {
    var el = d.getElementById("uft-unity-reg-status");
    if (el) el.textContent = msg || "";
  }

  function bindUnified() {
    var save = d.getElementById("uft-unity-save");
    if (save && !save.__unity) {
      save.__unity = true;
      save.addEventListener("click", function () {
        /* role select feeds hidden/core */
        var role = d.getElementById("uft-reg-role");
        var gender = d.getElementById("uft-reg-gender");
        var vital = d.getElementById("uft-reg-vital");
        try {
          if (typeof w.uftRegAddNew === "function") w.uftRegAddNew();
          else if (typeof w.uftRegAdd === "function") w.uftRegAdd();
        } catch (e) {}
        /* Persist gender/vital onto last registry row */
        try {
          var data =
            typeof w.uftRead === "function"
              ? w.uftRead()
              : JSON.parse(localStorage.getItem(w.UFT_KEY || "clarity_user_family_tree_v1") || "{}");
          var name = ((d.getElementById("uft-reg-name") || {}).value || "").trim();
          if (data && Array.isArray(data.registry) && name) {
            for (var i = data.registry.length - 1; i >= 0; i--) {
              var r = data.registry[i];
              if (r && String(r.name).trim() === name) {
                if (role) r.role = role.value || r.role;
                if (gender && gender.value) r.gender = gender.value;
                if (vital && vital.value) r.vital = vital.value;
                break;
              }
            }
            localStorage.setItem(w.UFT_KEY || "clarity_user_family_tree_v1", JSON.stringify(data));
          }
        } catch (e2) {}
        try {
          if (typeof w.uftRegFillHostSelect === "function") w.uftRegFillHostSelect();
          if (typeof w.uftRegRender === "function") w.uftRegRender();
          if (typeof w.uftBuildRepairApply === "function") w.uftBuildRepairApply();
        } catch (e3) {}
        setStatus("Saved to registry · educational outline only");
      });
    }
    var pull = d.getElementById("uft-unity-pull");
    if (pull && !pull.__unity) {
      pull.__unity = true;
      pull.addEventListener("click", function () {
        try {
          if (typeof w.uftRegImportTree === "function") w.uftRegImportTree();
        } catch (e) {}
        setStatus("Pulled names from tree into registry");
      });
    }
    var build = d.getElementById("uft-unity-build");
    if (build && !build.__unity) {
      build.__unity = true;
      build.addEventListener("click", function () {
        try {
          if (typeof w.uftApplyBuildFromCards === "function") w.uftApplyBuildFromCards();
          else if (typeof w.uftBuildRepairApply === "function") w.uftBuildRepairApply();
        } catch (e) {}
        setStatus("Build pedigree requested from registry");
      });
    }
    var clr = d.getElementById("uft-unity-clear");
    if (clr && !clr.__unity) {
      clr.__unity = true;
      clr.addEventListener("click", function () {
        try {
          if (typeof w.uftRegClearForm === "function") w.uftRegClearForm();
        } catch (e) {}
        ["uft-reg-name", "uft-reg-phone", "uft-reg-email", "uft-reg-city", "uft-reg-note", "uft-reg-edit-id"].forEach(
          function (id) {
            var el = d.getElementById(id);
            if (el) el.value = "";
          }
        );
      });
    }
  }

  function hideLegacyDual() {
    d.querySelectorAll("[data-unity-hidden]").forEach(function (el) {
      el.style.display = "none";
    });
    /* Hide visible deep panel if injector won the race */
    var deep = d.getElementById("uft-registry-deep");
    if (deep && deep.getAttribute("data-unity-marker") !== "1") {
      if (deep.querySelector && deep.querySelector("#uft-deep-name")) {
        deep.style.display = "none";
        deep.setAttribute("data-unity-suppressed", "1");
      }
    }
    /* Hide headings that say Registry · full fields / add person outside unified */
    d.querySelectorAll("h3").forEach(function (h) {
      if (/Registry\s*·\s*(full fields|add person)/i.test(h.textContent || "")) {
        var root = h.closest(".uft-registry-deep, .uft-grid, section, div");
        if (root && root.id !== "uft-registry-unified") {
          root.style.display = "none";
        }
      }
    });
  }

  function boot() {
    if (!isTree()) return;
    ensureUnifiedPanel();
    hideLegacyDual();
    try {
      if (typeof w.uftRegFillHostSelect === "function") w.uftRegFillHostSelect();
      if (typeof w.uftRegRender === "function") w.uftRegRender();
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
  setTimeout(boot, 2500);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 200);
  });
})(window, document);
