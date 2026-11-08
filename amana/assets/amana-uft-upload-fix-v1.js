/*! Amānah UFT · Phase A · upload picker fix
 * Problem: uftRunUploadMenu clicks #uft-load-file / #uft-cards-file / #uft-pack-file
 *          but tree chamber HTML never ships those <input type="file"> nodes.
 * Fix: ensure hidden inputs exist, wire FileReader handlers, open OS directory picker.
 * Governance: on-device only · no network · educational outline · key clarity_user_family_tree_v1
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_UPLOAD_FIX_V1__) return;
  w.__CLARITY_AMANA_UFT_UPLOAD_FIX_V1__ = true;

  var UFT_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var CARDS_KEY = "clarity_uft_member_cards_v1";

  function isTree() {
    return /\/amana\/tree\/?/.test((location.pathname || "") + "");
  }

  function status(msg) {
    var el = d.getElementById("uft-fo-status") || d.getElementById("uft-status");
    if (el) el.textContent = msg || "";
    try {
      if (typeof w.uftSetStatus === "function") w.uftSetStatus(msg);
    } catch (e) {}
  }

  function ensureInput(id, accept) {
    var el = d.getElementById(id);
    if (el) return el;
    el = d.createElement("input");
    el.type = "file";
    el.id = id;
    el.accept = accept || ".json,.csv,application/json,text/csv,text/plain";
    el.style.cssText = "position:fixed;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none";
    el.setAttribute("aria-hidden", "true");
    el.tabIndex = -1;
    (d.body || d.documentElement).appendChild(el);
    return el;
  }

  function readFile(file, asText, cb) {
    if (!file) return;
    var reader = new FileReader();
    reader.onerror = function () {
      status("Could not read file on this device.");
    };
    reader.onload = function () {
      try {
        cb(String(reader.result || ""));
      } catch (e) {
        status("Import failed — check file format.");
      }
    };
    if (asText) reader.readAsText(file);
    else reader.readAsText(file);
  }

  function parseJsonLoose(text) {
    var t = String(text || "").replace(/^\uFEFF/, "").trim();
    if (!t) throw new Error("empty");
    return JSON.parse(t);
  }

  function applyTreeJson(obj) {
    if (!obj || typeof obj !== "object") throw new Error("not object");
    /* Accept {tree:...}, pack wrappers, or bare UFT object */
    var data = obj.tree || obj.uft || obj.familyTree || obj;
    if (data && data.meta && data.payload) data = data.payload;
    if (typeof data === "string") data = JSON.parse(data);
    try {
      localStorage.setItem(UFT_KEY, JSON.stringify(data));
    } catch (e) {
      throw new Error("storage");
    }
    try {
      if (typeof w.uftLoad === "function") w.uftLoad();
      else if (typeof w.uftRender === "function") w.uftRender();
    } catch (e2) {}
    status("Full tree JSON imported · on this device only · educational outline");
  }

  function applyCards(text, name) {
    var cards = [];
    var lower = (name || "").toLowerCase();
    if (lower.indexOf(".csv") !== -1 || /^name[,;\t]/i.test(text)) {
      var lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
      var start = 0;
      if (/name/i.test(lines[0])) start = 1;
      for (var i = start; i < lines.length; i++) {
        var cols = lines[i].split(/[,;\t]/);
        if (!cols[0] || !String(cols[0]).trim()) continue;
        cards.push({
          name: String(cols[0] || "").trim(),
          role: String(cols[1] || "").trim(),
          phone: String(cols[2] || "").trim(),
          email: String(cols[3] || "").trim(),
          city: String(cols[4] || "").trim(),
          note: String(cols[5] || "").trim()
        });
      }
    } else {
      var j = parseJsonLoose(text);
      if (Array.isArray(j)) cards = j;
      else if (Array.isArray(j.cards)) cards = j.cards;
      else if (Array.isArray(j.members)) cards = j.members;
      else if (Array.isArray(j.registry)) cards = j.registry;
      else throw new Error("cards shape");
    }
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
    } catch (e) {
      throw new Error("storage");
    }
    try {
      if (typeof w.uftRegRenderLoaded === "function") w.uftRegRenderLoaded();
      if (typeof w.uftRegRender === "function") w.uftRegRender();
    } catch (e2) {}
    status("Member cards imported (" + cards.length + ") · use registry · educational only");
  }

  function applyPack(text) {
    var j = parseJsonLoose(text);
    if (j.tree || j.uft || j.familyTree || j.payload) {
      applyTreeJson(j);
      return;
    }
    if (j.blob && j.type && String(j.type).indexOf("amana") !== -1) {
      status("Encrypted Amānah pack detected — import via Amānah export desk / vault tools, not tree picker.");
      return;
    }
    applyTreeJson(j);
  }

  function wireInput(id, kind) {
    var el = ensureInput(
      id,
      kind === "cards" ? ".json,.csv,text/csv,application/json,text/plain" : ".json,application/json,text/plain"
    );
    if (el.__uftUploadWired) return el;
    el.__uftUploadWired = true;
    el.addEventListener("change", function () {
      var file = el.files && el.files[0];
      el.value = "";
      if (!file) {
        status("No file selected.");
        return;
      }
      readFile(file, true, function (text) {
        try {
          if (kind === "tree") applyTreeJson(parseJsonLoose(text));
          else if (kind === "cards") applyCards(text, file.name);
          else applyPack(text);
        } catch (e) {
          status("Could not import " + (file.name || "file") + " — expected JSON/CSV on this device.");
        }
      });
    });
    return el;
  }

  function openPicker(kind) {
    var id =
      kind === "cards" ? "uft-cards-file" : kind === "pack" ? "uft-pack-file" : "uft-load-file";
    var el = wireInput(id, kind === "cards" ? "cards" : kind === "pack" ? "pack" : "tree");
    /* User-gesture path: must call click synchronously from select change */
    try {
      el.click();
    } catch (e) {
      status("Browser blocked file picker — try again from the Upload menu.");
    }
  }

  /** Override / reinforce menu handler */
  function uftRunUploadMenuFixed(sel) {
    var v = sel && sel.value;
    if (!v) return;
    openPicker(v === "cards" ? "cards" : v === "pack" ? "pack" : "tree");
    try {
      sel.value = "";
    } catch (e) {}
  }

  w.uftRunUploadMenu = uftRunUploadMenuFixed;

  function boot() {
    if (!isTree() && !d.getElementById("user-family-tree-card")) return;
    wireInput("uft-load-file", "tree");
    wireInput("uft-cards-file", "cards");
    wireInput("uft-pack-file", "pack");

    /* Re-bind upload <select> if file-ops mounted */
    var ul = d.getElementById("uft-upload-menu");
    if (ul && !ul.__uftUploadFix) {
      ul.__uftUploadFix = true;
      ul.addEventListener(
        "change",
        function () {
          uftRunUploadMenuFixed(ul);
        },
        true
      );
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(window, document);
