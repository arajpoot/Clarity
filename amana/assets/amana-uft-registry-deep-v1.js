/*! Amānah UFT registry deep v1
 * Relation dropdowns · JSON export/import · full tree fields (Archive-3 lineage)
 * Storage: clarity_user_family_tree_v1 (same as UFT core)
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_REGISTRY_DEEP_V1__) return;
  w.__CLARITY_AMANA_UFT_REGISTRY_DEEP_V1__ = true;

  var KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var LS = w.clarityLS || {
    getItem: function (k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    setItem: function (k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    }
  };

  /* Relation set aligned with Archive-3 / UFT roles + common family outline */
  var ROLES = [
    { value: "self", label: "Self" },
    { value: "spouse", label: "Spouse" },
    { value: "husband", label: "Husband" },
    { value: "wife", label: "Wife" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "child", label: "Child" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "sibling", label: "Sibling" },
    { value: "pgf", label: "Paternal grandfather" },
    { value: "pgm", label: "Paternal grandmother" },
    { value: "mgf", label: "Maternal grandfather" },
    { value: "mgm", label: "Maternal grandmother" },
    { value: "grandson", label: "Grandson" },
    { value: "granddaughter", label: "Granddaughter" },
    { value: "grandchild", label: "Grandchild" },
    { value: "paternal_uncle", label: "Paternal uncle" },
    { value: "paternal_aunt", label: "Paternal aunt" },
    { value: "maternal_uncle", label: "Maternal uncle" },
    { value: "maternal_aunt", label: "Maternal aunt" },
    { value: "nephew", label: "Nephew" },
    { value: "niece", label: "Niece" },
    { value: "other", label: "Other / note" }
  ];

  var GENDERS = [
    { value: "", label: "—" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
  ];

  var VITALS = [
    { value: "", label: "—" },
    { value: "living", label: "Living" },
    { value: "deceased", label: "Deceased" }
  ];

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function readTree() {
    if (typeof w.uftRead === "function") {
      try {
        return w.uftRead() || {};
      } catch (e) {}
    }
    try {
      return JSON.parse(LS.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function writeTree(d) {
    if (typeof w.uftApplyData === "function") {
      try {
        w.uftApplyData(d);
        return true;
      } catch (e) {}
    }
    try {
      LS.setItem(KEY, JSON.stringify(d));
      if (typeof w.uftLoad === "function") {
        try {
          w.uftLoad();
        } catch (e) {}
      }
      if (typeof w.uftRegRender === "function") {
        try {
          w.uftRegRender();
        } catch (e) {}
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function uid() {
    return "m_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function normRow(row) {
    return {
      id: row.id || uid(),
      name: String(row.name || "").trim(),
      role: String(row.role || "").trim(),
      gender: String(row.gender || "").trim(),
      vital: String(row.vital || "").trim(),
      phone: String(row.phone || "").trim(),
      email: String(row.email || "").trim(),
      city: String(row.city || "").trim(),
      note: String(row.note || "").trim()
    };
  }

  function optionsHtml(list, selected) {
    return list
      .map(function (o) {
        var sel = o.value === selected ? " selected" : "";
        return '<option value="' + o.value + '"' + sel + ">" + o.label + "</option>";
      })
      .join("");
  }

  function ensureDeepPanel() {
    if (document.getElementById("uft-registry-deep")) return;

    var nameInput = document.getElementById("uft-reg-name");
    var card = document.getElementById("user-family-tree-card");
    if (!card) return;

    var host =
      document.querySelector(".uft-registry-panel") ||
      (nameInput && nameInput.closest(".uft-grid > div")) ||
      card;

    var panel = document.createElement("div");
    panel.id = "uft-registry-deep";
    panel.className = "uft-registry-deep";
    panel.innerHTML =
      '<h3 class="uft-deep-title">Registry · full fields</h3>' +
      '<p class="uft-deep-hint">Archive-3 style creation fields · on this device only · not a legal pedigree.</p>' +
      '<div class="uft-deep-grid">' +
      '<div class="uft-field"><label for="uft-deep-name">Name</label>' +
      '<input id="uft-deep-name" type="text" maxlength="80" placeholder="Full name or initials" autocomplete="off" /></div>' +
      '<div class="uft-field"><label for="uft-deep-role">Relation</label>' +
      '<select id="uft-deep-role">' +
      optionsHtml(ROLES, "self") +
      "</select></div>" +
      '<div class="uft-field"><label for="uft-deep-gender">Gender (optional)</label>' +
      '<select id="uft-deep-gender">' +
      optionsHtml(GENDERS, "") +
      "</select></div>" +
      '<div class="uft-field"><label for="uft-deep-vital">Vital status (optional)</label>' +
      '<select id="uft-deep-vital">' +
      optionsHtml(VITALS, "") +
      "</select></div>" +
      '<div class="uft-field"><label for="uft-deep-phone">Phone</label>' +
      '<input id="uft-deep-phone" type="text" maxlength="40" autocomplete="off" /></div>' +
      '<div class="uft-field"><label for="uft-deep-email">Email</label>' +
      '<input id="uft-deep-email" type="email" maxlength="80" autocomplete="off" /></div>' +
      '<div class="uft-field"><label for="uft-deep-city">City</label>' +
      '<input id="uft-deep-city" type="text" maxlength="60" autocomplete="off" /></div>' +
      '<div class="uft-field uft-field-span"><label for="uft-deep-note">Note</label>' +
      '<input id="uft-deep-note" type="text" maxlength="160" placeholder="Optional note" autocomplete="off" /></div>' +
      "</div>" +
      '<input type="hidden" id="uft-deep-edit-id" value="" />' +
      '<div class="uft-deep-actions">' +
      '<button type="button" class="uft-deep-btn" id="uft-deep-save">Save to registry</button>' +
      '<button type="button" class="uft-deep-btn soft" id="uft-deep-pull-tree">Pull names from tree</button>' +
      '<button type="button" class="uft-deep-btn soft" id="uft-deep-clear-form">Clear form</button>' +
      "</div>" +
      '<div class="uft-deep-io">' +
      '<p class="uft-deep-io-label">JSON · full family tree + registry</p>' +
      '<div class="uft-deep-actions">' +
      '<button type="button" class="uft-deep-btn" id="uft-deep-export">Export JSON</button>' +
      '<button type="button" class="uft-deep-btn soft" id="uft-deep-export-reg">Export registry only</button>' +
      '<label class="uft-deep-btn soft uft-deep-file">' +
      'Import JSON<input type="file" id="uft-deep-import" accept="application/json,.json" hidden />' +
      "</label>" +
      "</div>" +
      '<p class="uft-deep-msg" id="uft-deep-msg" role="status"></p>' +
      "</div>" +
      '<div class="uft-deep-list-wrap">' +
      "<h4>Registry list</h4>" +
      '<div id="uft-deep-list"></div>' +
      "</div>";

    // Prefer insert after existing registry column / before list
    var regList = document.getElementById("uft-reg-list");
    if (regList && regList.parentElement) {
      regList.parentElement.insertBefore(panel, regList);
    } else if (host) {
      host.appendChild(panel);
    } else {
      card.appendChild(panel);
    }

    bindPanel();
    renderList();
  }

  function setMsg(text, kind) {
    var el = document.getElementById("uft-deep-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "uft-deep-msg" + (kind ? " " + kind : "");
  }

  function clearForm() {
    ["uft-deep-name", "uft-deep-phone", "uft-deep-email", "uft-deep-city", "uft-deep-note"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = "";
    });
    var role = document.getElementById("uft-deep-role");
    if (role) role.value = "self";
    var g = document.getElementById("uft-deep-gender");
    if (g) g.value = "";
    var v = document.getElementById("uft-deep-vital");
    if (v) v.value = "";
    var ed = document.getElementById("uft-deep-edit-id");
    if (ed) ed.value = "";
  }

  function saveRow() {
    var name = ((document.getElementById("uft-deep-name") || {}).value || "").trim();
    if (!name) {
      setMsg("Enter a name.", "err");
      return;
    }
    var row = normRow({
      id: (document.getElementById("uft-deep-edit-id") || {}).value || "",
      name: name,
      role: (document.getElementById("uft-deep-role") || {}).value || "",
      gender: (document.getElementById("uft-deep-gender") || {}).value || "",
      vital: (document.getElementById("uft-deep-vital") || {}).value || "",
      phone: (document.getElementById("uft-deep-phone") || {}).value || "",
      email: (document.getElementById("uft-deep-email") || {}).value || "",
      city: (document.getElementById("uft-deep-city") || {}).value || "",
      note: (document.getElementById("uft-deep-note") || {}).value || ""
    });

    var d = readTree();
    d.registry = Array.isArray(d.registry) ? d.registry : [];
    var idx = -1;
    if (row.id) {
      for (var i = 0; i < d.registry.length; i++) {
        if (d.registry[i] && d.registry[i].id === row.id) {
          idx = i;
          break;
        }
      }
    }
    if (idx >= 0) d.registry[idx] = row;
    else d.registry.push(row);
    d.savedAt = new Date().toISOString();

    // Mirror core slots when role is a backbone field
    var map = {
      self: "self",
      spouse: "spouse",
      husband: "spouse",
      wife: "spouse",
      father: "father",
      mother: "mother",
      pgf: "pgf",
      pgm: "pgm",
      mgf: "mgf",
      mgm: "mgm"
    };
    if (map[row.role] && !d[map[row.role]]) d[map[row.role]] = row.name;

    if (!writeTree(d)) {
      setMsg("Could not save on this device.", "err");
      return;
    }
    setMsg("Saved · " + row.name + (row.role ? " · " + row.role : ""), "ok");
    clearForm();
    renderList();
    try {
      if (typeof w.uftRegRender === "function") w.uftRegRender();
      if (typeof w.uftRender === "function") w.uftRender();
      if (typeof w.uftSetStatus === "function") w.uftSetStatus("Registry updated on this device");
    } catch (e) {}
  }

  function pullFromTree() {
    if (typeof w.uftRegImportTree === "function") {
      try {
        w.uftRegImportTree();
        renderList();
        setMsg("Names pulled from tree into registry.", "ok");
        return;
      } catch (e) {}
    }
    var d = readTree();
    d.registry = Array.isArray(d.registry) ? d.registry : [];
    var seen = {};
    d.registry.forEach(function (r) {
      if (r && r.name) seen[(r.name + "|" + (r.role || "")).toLowerCase()] = true;
    });
    function add(name, role) {
      name = String(name || "").trim();
      if (!name) return;
      var k = (name + "|" + (role || "")).toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      d.registry.push(normRow({ name: name, role: role || "" }));
    }
    add(d.self, "self");
    add(d.spouse, "spouse");
    add(d.father, "father");
    add(d.mother, "mother");
    add(d.pgf, "pgf");
    add(d.pgm, "pgm");
    add(d.mgf, "mgf");
    add(d.mgm, "mgm");
    function lines(v) {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      return String(v)
        .split(/[\n,;]+/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
    }
    lines(d.children).forEach(function (n) {
      add(n, "child");
    });
    lines(d.siblings).forEach(function (n) {
      add(n, "sibling");
    });
    lines(d.grandchildren).forEach(function (n) {
      add(n, "grandchild");
    });
    d.savedAt = new Date().toISOString();
    writeTree(d);
    renderList();
    setMsg("Names pulled from tree into registry.", "ok");
  }

  function exportFull() {
    if (typeof w.uftDownload === "function") {
      try {
        w.uftDownload();
        setMsg("Full tree JSON download started.", "ok");
        return;
      } catch (e) {}
    }
    var d = readTree();
    d.exportedAt = new Date().toISOString();
    d.exportType = "clarity-family-members";
    d.app = "Clarity Amānah";
    d.disclaimer = "Private on-device data · educational outline · not a legal pedigree · not a fatwa";
    downloadJson(
      "clarity-family-tree-" + new Date().toISOString().slice(0, 10) + ".json",
      d
    );
    setMsg("Full tree JSON exported.", "ok");
  }

  function exportRegistryOnly() {
    var d = readTree();
    var pack = {
      app: "Clarity Amānah",
      version: 1,
      exportType: "clarity-family-registry",
      exportedAt: new Date().toISOString(),
      disclaimer: "Registry contacts only · educational · not a legal pedigree",
      registry: Array.isArray(d.registry) ? d.registry : []
    };
    downloadJson(
      "clarity-family-registry-" + new Date().toISOString().slice(0, 10) + ".json",
      pack
    );
    setMsg("Registry-only JSON exported.", "ok");
  }

  function downloadJson(filename, obj) {
    try {
      var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try {
          URL.revokeObjectURL(url);
          a.remove();
        } catch (e) {}
      }, 600);
    } catch (e) {
      setMsg("Export failed on this device.", "err");
    }
  }

  function importJson(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var pack = JSON.parse(String(reader.result || "{}"));
        var d = readTree();
        if (pack.familyTree && typeof pack.familyTree === "object") {
          // Full Amānah pack
          d = pack.familyTree;
        } else if (pack.exportType === "clarity-family-registry" && Array.isArray(pack.registry)) {
          d.registry = pack.registry.map(normRow);
        } else if (pack.exportType === "clarity-family-members" || pack.registry || pack.self) {
          // Full tree dump
          d = pack;
        } else if (Array.isArray(pack.registry)) {
          d.registry = pack.registry.map(normRow);
        } else {
          setMsg("Unrecognized JSON. Use a Clarity family tree or registry export.", "err");
          return;
        }
        d.savedAt = new Date().toISOString();
        if (!writeTree(d)) {
          setMsg("Import could not be saved.", "err");
          return;
        }
        renderList();
        try {
          if (typeof w.uftLoad === "function") w.uftLoad();
          if (typeof w.uftRegRender === "function") w.uftRegRender();
          if (typeof w.uftRender === "function") w.uftRender();
        } catch (e) {}
        setMsg("Import applied on this device.", "ok");
      } catch (e) {
        setMsg("Could not read that JSON file.", "err");
      }
    };
    reader.readAsText(file);
  }

  function renderList() {
    var box = document.getElementById("uft-deep-list");
    if (!box) return;
    var d = readTree();
    var list = Array.isArray(d.registry) ? d.registry.slice() : [];
    if (!list.length) {
      box.innerHTML =
        '<p class="uft-empty-hint">No registry contacts yet. Add a person above, or pull names from the tree.</p>';
      return;
    }
    box.innerHTML = list
      .map(function (r) {
        if (!r) return "";
        var meta = [r.role, r.gender, r.vital, r.phone, r.city].filter(Boolean).join(" · ");
        return (
          '<div class="uft-deep-row" data-id="' +
          (r.id || "") +
          '">' +
          "<div><strong>" +
          escapeHtml(r.name || "?") +
          "</strong>" +
          (meta ? '<div class="uft-deep-meta">' + escapeHtml(meta) + "</div>" : "") +
          (r.note ? '<div class="uft-deep-meta">' + escapeHtml(r.note) + "</div>" : "") +
          "</div>" +
          '<div class="uft-deep-row-actions">' +
          '<button type="button" data-act="edit">Edit</button>' +
          '<button type="button" data-act="del">Remove</button>' +
          "</div></div>"
        );
      })
      .join("");

    box.querySelectorAll(".uft-deep-row").forEach(function (row) {
      var id = row.getAttribute("data-id");
      row.querySelectorAll("[data-act]").forEach(function (btn) {
        btn.onclick = function () {
          var act = btn.getAttribute("data-act");
          var d2 = readTree();
          d2.registry = Array.isArray(d2.registry) ? d2.registry : [];
          var item = d2.registry.filter(function (x) {
            return x && x.id === id;
          })[0];
          if (act === "edit" && item) {
            document.getElementById("uft-deep-edit-id").value = item.id || "";
            document.getElementById("uft-deep-name").value = item.name || "";
            document.getElementById("uft-deep-role").value = item.role || "other";
            document.getElementById("uft-deep-gender").value = item.gender || "";
            document.getElementById("uft-deep-vital").value = item.vital || "";
            document.getElementById("uft-deep-phone").value = item.phone || "";
            document.getElementById("uft-deep-email").value = item.email || "";
            document.getElementById("uft-deep-city").value = item.city || "";
            document.getElementById("uft-deep-note").value = item.note || "";
            setMsg("Editing · " + (item.name || ""), "ok");
            try {
              document.getElementById("uft-deep-name").focus();
            } catch (e) {}
          } else if (act === "del" && id) {
            d2.registry = d2.registry.filter(function (x) {
              return x && x.id !== id;
            });
            writeTree(d2);
            renderList();
            setMsg("Removed from registry.", "ok");
          }
        };
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bindPanel() {
    var save = document.getElementById("uft-deep-save");
    if (save) save.onclick = saveRow;
    var pull = document.getElementById("uft-deep-pull-tree");
    if (pull) pull.onclick = pullFromTree;
    var clear = document.getElementById("uft-deep-clear-form");
    if (clear) clear.onclick = function () {
      clearForm();
      setMsg("Form cleared.", "ok");
    };
    var exp = document.getElementById("uft-deep-export");
    if (exp) exp.onclick = exportFull;
    var expR = document.getElementById("uft-deep-export-reg");
    if (expR) expR.onclick = exportRegistryOnly;
    var imp = document.getElementById("uft-deep-import");
    if (imp) {
      imp.onchange = function () {
        importJson(imp.files && imp.files[0]);
        imp.value = "";
      };
    }
  }

  function boot() {
    if (!isTree()) return;
    try {
      ensureDeepPanel();
      renderList();
    } catch (e) {
      try {
        console.warn("[UFT registry deep]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1800);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 100);
  });
})(window);
