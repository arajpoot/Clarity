/*! Amānah Family Tree · from-scratch v1
 * Complete rebuild: registry, pedigree, import/export, Farāʾiḍ outline handoff.
 * Keys: clarity_user_family_tree_v1 · clarity_amana_fiqh_outline_v1
 * Educational only — not a fatwa · not a legal pedigree
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FROM_SCRATCH_V1__) return;
  w.__CLARITY_AMANA_UFT_FROM_SCRATCH_V1__ = true;

  var TREE_KEY = "clarity_user_family_tree_v1";
  var OUTLINE_KEY = "clarity_amana_fiqh_outline_v1";

  var ROLES = [
    "self", "spouse", "father", "mother", "child", "sibling",
    "pgf", "pgm", "mgf", "mgm", "uncle", "aunt", "nephew", "niece", "grandchild", "other"
  ];

  function $(id) { return d.getElementById(id); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function norm(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function uid() {
    return "m_" + Math.random().toString(36).slice(2, 10);
  }

  function read() {
    try {
      var raw = localStorage.getItem(TREE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      if (!data || typeof data !== "object") data = {};
      data.registry = Array.isArray(data.registry) ? data.registry : [];
      return data;
    } catch (e) {
      return { registry: [] };
    }
  }

  function write(data) {
    try {
      data.savedAt = new Date().toISOString();
      localStorage.setItem(TREE_KEY, JSON.stringify(data));
    } catch (e) {
      status("Could not save on this device.");
    }
  }

  function dedupe(list) {
    var out = [];
    var seen = {};
    (list || []).forEach(function (r) {
      if (!r || !r.name) return;
      var k = norm(r.name) + "|" + norm(r.role);
      if (seen[k]) return;
      seen[k] = 1;
      out.push({
        id: r.id || uid(),
        name: String(r.name).trim(),
        role: String(r.role || "other").trim(),
        gender: r.gender || "",
        vital: r.vital || "",
        phone: r.phone || "",
        email: r.email || "",
        city: r.city || "",
        note: r.note || ""
      });
    });
    return out;
  }

  function mapBackbone(data) {
    data.registry = dedupe(data.registry);
    var reg = data.registry;
    function first(re) {
      for (var i = 0; i < reg.length; i++) {
        if (reg[i].name && re.test(String(reg[i].role || "").toLowerCase())) return reg[i].name;
      }
      return "";
    }
    function all(re) {
      var names = [];
      var seen = {};
      reg.forEach(function (r) {
        if (!r.name || !re.test(String(r.role || "").toLowerCase())) return;
        var k = norm(r.name);
        if (seen[k]) return;
        seen[k] = 1;
        names.push(r.name);
      });
      return names;
    }
    data.self = first(/^(self|focus|me)$/) || data.self || "";
    data.spouse = first(/^(spouse|husband|wife)$/) || data.spouse || "";
    data.father = first(/^father$/) || data.father || "";
    data.mother = first(/^mother$/) || data.mother || "";
    data.pgf = first(/paternal grandfather|^pgf$/) || data.pgf || "";
    data.pgm = first(/paternal grandmother|^pgm$/) || data.pgm || "";
    data.mgf = first(/maternal grandfather|^mgf$/) || data.mgf || "";
    data.mgm = first(/maternal grandmother|^mgm$/) || data.mgm || "";
    data.children = all(/^(child|son|daughter)$/).join("\n");
    data.siblings = all(/^(sibling|brother|sister)$/).join("\n");
    data.grandchildren = all(/grandchild/).join("\n");
    data.relatives = [];
    function edge(name, relation) {
      if (!name) return;
      data.relatives.push({ name: name, relation: relation, anchor: "self" });
    }
    all(/^(child|son|daughter)$/).forEach(function (n) { edge(n, "child"); });
    all(/^(sibling|brother|sister)$/).forEach(function (n) { edge(n, "sibling"); });
    all(/grandchild/).forEach(function (n) { edge(n, "grandchild"); });
    all(/^uncle$/).forEach(function (n) { edge(n, "uncle"); });
    all(/^aunt$/).forEach(function (n) { edge(n, "aunt"); });
    return data;
  }

  function lines(v) {
    return String(v || "").split(/[\n,;]+/).map(function (x) { return x.trim(); }).filter(Boolean);
  }

  function groups(data) {
    data = mapBackbone(data);
    var g = [
      { title: "Grandparents", items: [] },
      { title: "Parents", items: [] },
      { title: "Focus", items: [] },
      { title: "Siblings", items: [] },
      { title: "Children", items: [] },
      { title: "Grandchildren", items: [] },
      { title: "Extended", items: [] }
    ];
    function add(i, name, role) {
      if (!name) return;
      g[i].items.push({ name: name, role: role });
    }
    add(0, data.pgf, "pgf"); add(0, data.pgm, "pgm");
    add(0, data.mgf, "mgf"); add(0, data.mgm, "mgm");
    add(1, data.father, "father"); add(1, data.mother, "mother");
    add(2, data.self, "self"); add(2, data.spouse, "spouse");
    lines(data.siblings).forEach(function (n) { add(3, n, "sibling"); });
    lines(data.children).forEach(function (n) { add(4, n, "child"); });
    lines(data.grandchildren).forEach(function (n) { add(5, n, "grandchild"); });
    var used = {};
    g.forEach(function (sec) {
      sec.items.forEach(function (it) { used[norm(it.name)] = 1; });
    });
    (data.registry || []).forEach(function (r) {
      if (!r.name || used[norm(r.name)]) return;
      add(6, r.name, r.role || "member");
    });
    return { data: data, groups: g };
  }

  function status(msg) {
    var el = $("uft-status");
    if (el) el.textContent = msg || "";
  }

  function renderPedigree(built) {
    var host = $("uft-pedigree");
    if (!host) return;
    var parts = built.groups.filter(function (g) { return g.items.length; });
    if (!parts.length) {
      host.innerHTML = '<p class="uft-empty">No names on the pedigree yet. Add people in the registry (set one role to <strong>Self</strong>). Educational outline only.</p>';
      return;
    }
    host.innerHTML = parts.map(function (g) {
      return (
        '<section class="uft-gen">' +
        '<div class="uft-gen-label">' + esc(g.title) + "</div>" +
        '<div class="uft-gen-row">' +
        g.items.map(function (it) {
          var focus = /self|focus/i.test(it.role) ? " is-focus" : "";
          return (
            '<article class="uft-person' + focus + '">' +
            "<strong>" + esc(it.name) + "</strong>" +
            "<span>" + esc(it.role || "member") + "</span></article>"
          );
        }).join("") +
        "</div></section>"
      );
    }).join("");
  }

  function renderRegistry(data) {
    var host = $("uft-registry-list");
    if (!host) return;
    var list = data.registry || [];
    if (!list.length) {
      host.innerHTML = '<p class="uft-empty">Registry is empty. Add a member using the form.</p>';
      return;
    }
    host.innerHTML = list.map(function (r) {
      return (
        '<div class="uft-reg-row" data-id="' + esc(r.id) + '">' +
        "<div><strong>" + esc(r.name) + "</strong>" +
        "<span class=\"meta\">" + esc(r.role || "—") +
        (r.gender ? " · " + esc(r.gender) : "") +
        (r.vital ? " · " + esc(r.vital) : "") +
        "</span></div>" +
        '<div class="uft-reg-acts">' +
        '<button type="button" data-act="edit" class="btn-soft">Edit</button> ' +
        '<button type="button" data-act="del" class="btn-soft">Remove</button>' +
        "</div></div>"
      );
    }).join("");

    host.querySelectorAll(".uft-reg-row").forEach(function (row) {
      row.querySelectorAll("button").forEach(function (btn) {
        btn.onclick = function () {
          var id = row.getAttribute("data-id");
          var data = read();
          var item = (data.registry || []).filter(function (r) { return r.id === id; })[0];
          if (!item) return;
          if (btn.getAttribute("data-act") === "del") {
            data.registry = data.registry.filter(function (r) { return r.id !== id; });
            data = mapBackbone(data);
            write(data);
            paint();
            status("Removed " + item.name);
            return;
          }
          $("uft-name").value = item.name;
          $("uft-role").value = item.role || "other";
          $("uft-gender").value = item.gender || "";
          $("uft-vital").value = item.vital || "";
          $("uft-phone").value = item.phone || "";
          $("uft-note").value = item.note || "";
          $("uft-edit-id").value = item.id;
          status("Editing " + item.name);
        };
      });
    });
  }

  function paint() {
    var built = groups(read());
    write(built.data);
    renderPedigree(built);
    renderRegistry(built.data);
    var n = (built.data.registry || []).length;
    var count = $("uft-count");
    if (count) count.textContent = n ? n + " in registry" : "Empty registry";
  }

  function clearForm() {
    ["uft-name", "uft-phone", "uft-note", "uft-edit-id"].forEach(function (id) {
      if ($(id)) $(id).value = "";
    });
    if ($("uft-role")) $("uft-role").value = "self";
    if ($("uft-gender")) $("uft-gender").value = "";
    if ($("uft-vital")) $("uft-vital").value = "";
  }

  function saveMember() {
    var name = ($("uft-name").value || "").trim();
    if (!name) {
      status("Enter a full name.");
      return;
    }
    var data = read();
    data.registry = data.registry || [];
    var editId = ($("uft-edit-id").value || "").trim();
    var row = {
      id: editId || uid(),
      name: name,
      role: ($("uft-role").value || "other").trim(),
      gender: ($("uft-gender").value || "").trim(),
      vital: ($("uft-vital").value || "").trim(),
      phone: ($("uft-phone").value || "").trim(),
      note: ($("uft-note").value || "").trim()
    };
    if (editId) {
      data.registry = data.registry.map(function (r) {
        return r.id === editId ? row : r;
      });
    } else {
      data.registry.push(row);
    }
    data = mapBackbone(data);
    write(data);
    clearForm();
    paint();
    status("Saved “" + name + "” · pedigree updated");
  }

  function exportJson() {
    var data = mapBackbone(read());
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = d.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-family-tree-" + new Date().toISOString().slice(0, 10) + ".json";
    d.body.appendChild(a);
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 400);
    status("Exported JSON · stays on this device until you share the file");
  }

  function importJson(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var raw = JSON.parse(String(reader.result || "{}"));
        var data = raw.tree || raw.familyTree || raw.payload || raw;
        if (typeof data === "string") data = JSON.parse(data);
        if (!data || typeof data !== "object") throw new Error("bad");
        data.registry = Array.isArray(data.registry) ? data.registry : [];
        if (!data.registry.length) {
          ["people", "members", "cards"].forEach(function (k) {
            (raw[k] || data[k] || []).forEach(function (p) {
              if (!p) return;
              if (typeof p === "string") data.registry.push({ name: p, role: "" });
              else if (p.name) data.registry.push(p);
            });
          });
        }
        data = mapBackbone(data);
        write(data);
        paint();
        status("Imported · " + data.registry.length + " registry · educational outline only");
      } catch (e) {
        status("Could not read that JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function saveOutline() {
    var data = mapBackbone(read());
    write(data);
    var heirs = (data.registry || []).map(function (r) {
      return {
        name: r.name,
        role: r.role || "",
        gender: r.gender || "",
        vital: r.vital || "living"
      };
    });
    var payload = {
      v: 1,
      source: "uft-from-scratch",
      savedAt: new Date().toISOString(),
      focus: data.self || "",
      father: data.father || "",
      mother: data.mother || "",
      spouse: data.spouse || "",
      heirs: heirs,
      educationalOnly: true,
      disclaimer: "Educational study aid only — not a fatwa — not a court order."
    };
    try {
      localStorage.setItem(OUTLINE_KEY, JSON.stringify(payload));
    } catch (e) {
      status("Could not save outline.");
      return;
    }
    status("Outline saved for Farāʾiḍ (" + heirs.length + ") · educational only — not a fatwa");
  }

  function clearTree() {
    if (!w.confirm("Clear family tree data on this device?\n\nExport JSON first if you need a backup.")) return;
    try {
      localStorage.removeItem(TREE_KEY);
    } catch (e) {}
    paint();
    status("Tree cleared on this device.");
  }

  function bind() {
    var save = $("uft-save");
    if (save) save.onclick = saveMember;
    var clr = $("uft-clear-form");
    if (clr) clr.onclick = clearForm;
    var exp = $("uft-export");
    if (exp) exp.onclick = exportJson;
    var imp = $("uft-import");
    var file = $("uft-file");
    if (imp && file) {
      imp.onclick = function () { file.click(); };
      file.onchange = function (ev) {
        var f = ev.target.files && ev.target.files[0];
        importJson(f);
        ev.target.value = "";
      };
    }
    var outline = $("uft-outline");
    if (outline) outline.onclick = saveOutline;
    var fiqh = $("uft-fiqh");
    if (fiqh) {
      fiqh.onclick = function () {
        location.href = "/amana/fiqh/?from=tree";
      };
    }
    var clear = $("uft-clear-tree");
    if (clear) clear.onclick = clearTree;
    var refresh = $("uft-refresh");
    if (refresh) refresh.onclick = paint;
  }

  function boot() {
    bind();
    paint();
    status("Family tree ready · on this device only · educational outline — not a legal pedigree");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.uftScratchPaint = paint;
  w.uftScratchRead = function () { return mapBackbone(read()); };
})(window, document);
