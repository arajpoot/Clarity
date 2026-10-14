/* University Vault — interactive family tree (V3a)
 * Educational pedigree · data lives in encrypted vault payload
 * Not a legal certificate · not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_UFT_V1__) return;
  g.__CU_VAULT_UFT_V1__ = true;

  function V() {
    return g.ClarityVaultSecure;
  }

  function ensureTree() {
    var d = V().data();
    if (!d.tree) d.tree = { people: [], notes: "" };
    if (!Array.isArray(d.tree.people)) d.tree.people = [];
    return d.tree;
  }

  function uid() {
    return "p_" + Math.random().toString(36).slice(2, 10);
  }

  function people() {
    return ensureTree().people;
  }

  function byId(id) {
    return people().find(function (p) {
      return p.id === id;
    });
  }

  function addPerson(partial) {
    var p = {
      id: uid(),
      name: (partial && partial.name) || "Unnamed",
      gender: (partial && partial.gender) || "u",
      vital: (partial && partial.vital) || "alive",
      year: (partial && partial.year) || "",
      parentId: (partial && partial.parentId) || "",
      spouseId: (partial && partial.spouseId) || "",
      isYou: !!(partial && partial.isYou)
    };
    people().push(p);
    return p;
  }

  function removePerson(id) {
    var list = people();
    var i = list.findIndex(function (p) {
      return p.id === id;
    });
    if (i >= 0) list.splice(i, 1);
    list.forEach(function (p) {
      if (p.parentId === id) p.parentId = "";
      if (p.spouseId === id) p.spouseId = "";
    });
  }

  /** Simple generations: roots = no parent; children by parentId */
  function roots() {
    return people().filter(function (p) {
      return !p.parentId || !byId(p.parentId);
    });
  }

  function childrenOf(id) {
    return people().filter(function (p) {
      return p.parentId === id;
    });
  }

  function renderPedigree(host) {
    if (!host) return;
    var rootsList = roots();
    if (!people().length) {
      host.innerHTML =
        '<p class="vault-micro">No people yet. Add yourself or an ancestor below.</p>';
      return;
    }

    function card(p) {
      var gIcon = p.gender === "m" ? "♂" : p.gender === "f" ? "♀" : "·";
      var vital = p.vital === "deceased" ? "†" : "●";
      var you = p.isYou ? " <em>(you)</em>" : "";
      return (
        '<div class="uft-card" data-id="' +
        p.id +
        '">' +
        '<div class="uft-card-head">' +
        gIcon +
        " " +
        vital +
        " <strong>" +
        escapeHtml(p.name) +
        "</strong>" +
        you +
        "</div>" +
        '<div class="uft-card-meta">' +
        (p.year ? escapeHtml(p.year) : "") +
        "</div>" +
        '<div class="uft-card-actions">' +
        '<button type="button" data-act="edit" data-id="' +
        p.id +
        '">Edit</button>' +
        '<button type="button" data-act="child" data-id="' +
        p.id +
        '">＋ Child</button>' +
        '<button type="button" data-act="del" data-id="' +
        p.id +
        '">Remove</button>' +
        "</div></div>"
      );
    }

    function branch(p) {
      var kids = childrenOf(p.id);
      var html = '<div class="uft-node">' + card(p);
      if (kids.length) {
        html += '<div class="uft-children">';
        kids.forEach(function (k) {
          html += branch(k);
        });
        html += "</div>";
      }
      html += "</div>";
      return html;
    }

    var out = '<div class="uft-pedigree">';
    rootsList.forEach(function (r) {
      out += branch(r);
    });
    out += "</div>";
    host.innerHTML = out;

    host.querySelectorAll("[data-act]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var act = btn.getAttribute("data-act");
        if (act === "del") {
          if (confirm("Remove this person from the educational tree?")) {
            removePerson(id);
            paint();
          }
        } else if (act === "child") {
          var nm = prompt("Child name?");
          if (nm) {
            addPerson({ name: nm.trim(), parentId: id });
            paint();
          }
        } else if (act === "edit") {
          var p = byId(id);
          if (!p) return;
          var n = prompt("Name", p.name);
          if (n == null) return;
          p.name = n.trim() || p.name;
          var gen = prompt("Gender m/f/u", p.gender);
          if (gen) p.gender = gen.charAt(0).toLowerCase();
          var vit = prompt("Vital alive/deceased", p.vital);
          if (vit) p.vital = /dec|†|dead/i.test(vit) ? "deceased" : "alive";
          var yr = prompt("Birth year (optional)", p.year || "");
          if (yr != null) p.year = yr.trim();
          paint();
        }
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function paint() {
    var host = document.getElementById("cu-uft-viewport");
    renderPedigree(host);
    var notes = document.getElementById("cu-uft-notes");
    if (notes) {
      notes.value = ensureTree().notes || "";
    }
    var count = document.getElementById("cu-uft-count");
    if (count) count.textContent = String(people().length);
  }

  function shellHtml() {
    return (
      '<div class="cu-uft-shell">' +
      '<div class="cu-uft-toolbar">' +
      '<button type="button" class="vault-btn vault-btn-primary" id="cu-uft-add">＋ Add person</button>' +
      '<button type="button" class="vault-btn" id="cu-uft-you">Mark / add You</button>' +
      '<button type="button" class="vault-btn" id="cu-uft-import">Import JSON</button>' +
      '<button type="button" class="vault-btn" id="cu-uft-export">Export tree</button>' +
      '<input type="file" id="cu-uft-file" accept="application/json,.json" hidden />' +
      '<span class="vault-micro">People: <strong id="cu-uft-count">0</strong></span>' +
      "</div>" +
      '<div id="cu-uft-viewport" class="cu-uft-viewport" aria-label="Pedigree viewport"></div>' +
      '<label class="vault-field"><span>Tree notes</span>' +
      '<textarea id="cu-uft-notes" rows="2" placeholder="Optional notes for Mīrāth study"></textarea></label>' +
      '<p class="vault-micro">Interactive educational pedigree · oldest roots at top · saved only inside encrypted vault · not a legal certificate.</p>' +
      "</div>"
    );
  }

  function wireShell(root) {
    root.querySelector("#cu-uft-add").onclick = function () {
      var nm = prompt("Name?");
      if (!nm) return;
      addPerson({ name: nm.trim() });
      paint();
    };
    root.querySelector("#cu-uft-you").onclick = function () {
      var existing = people().find(function (p) {
        return p.isYou;
      });
      if (existing) {
        alert("You are marked as: " + existing.name);
        return;
      }
      var nm = prompt("Your name on the tree?", "Me");
      if (!nm) return;
      addPerson({ name: nm.trim(), isYou: true });
      paint();
    };
    root.querySelector("#cu-uft-export").onclick = function () {
      var payload = {
        format: "clarity-uft-edu-v1",
        people: people(),
        notes: ensureTree().notes || ""
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json"
      });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "clarity-family-tree.json";
      a.click();
    };
    var file = root.querySelector("#cu-uft-file");
    root.querySelector("#cu-uft-import").onclick = function () {
      file.click();
    };
    file.onchange = function (ev) {
      var f = ev.target.files && ev.target.files[0];
      if (!f) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(reader.result);
          var list = data.people || data.members || data.nodes || [];
          if (!Array.isArray(list)) throw new Error("No people array");
          ensureTree().people = list.map(function (p) {
            return {
              id: p.id || uid(),
              name: p.name || p.label || "Unnamed",
              gender: p.gender || "u",
              vital: p.vital || p.status || "alive",
              year: p.year || p.birthYear || "",
              parentId: p.parentId || p.parent || "",
              spouseId: p.spouseId || p.spouse || "",
              isYou: !!(p.isYou || p.you)
            };
          });
          if (data.notes) ensureTree().notes = data.notes;
          paint();
        } catch (e) {
          alert("Could not import tree JSON.");
        }
        file.value = "";
      };
      reader.readAsText(f);
    };
    var notes = root.querySelector("#cu-uft-notes");
    notes.addEventListener("change", function () {
      ensureTree().notes = notes.value;
    });
  }

  /** Mount into Amana unit tree details section */
  function mount(intoEl) {
    if (!V() || !V().isUnlocked()) return;
    if (!intoEl) return;
    intoEl.innerHTML = shellHtml();
    wireShell(intoEl);
    paint();
  }

  g.ClarityVaultUFT = {
    mount: mount,
    paint: paint,
    people: people,
    addPerson: addPerson
  };
})(typeof window !== "undefined" ? window : this);
