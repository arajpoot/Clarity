/*! UFT file ops · Companion leftover import
 * Save / download / upload menus + named snapshots
 * Uses live UFT core handlers when present
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FILE_OPS_V1__) return;
  w.__CLARITY_AMANA_UFT_FILE_OPS_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function panelHtml() {
    return (
      '<details class="uft-file-ops" id="uft-file-ops-section">' +
      "<summary>💾 Save · download · upload <span style=\"opacity:0.75;font-weight:500\">(collapsed until needed)</span></summary>" +
      '<p class="uft-hint" style="margin:0.25rem 0 0.45rem;font-size:0.8rem">Pedigree save, file transfer, and named copies. All files stay on this device.</p>' +
      '<div class="uft-actions">' +
      '<button type="button" class="btn-soft" id="uft-fo-save">💾 Save · show pedigree</button>' +
      '<button type="button" class="btn-soft" id="uft-fo-refresh">↻ Refresh view</button>' +
      '<button type="button" class="btn-soft" id="uft-fo-fresh">🆕 Start tree</button>' +
      '<button type="button" class="btn-soft" id="uft-fo-clear">🗑 Clear tree</button>' +
      "</div>" +
      '<div class="uft-file-menus">' +
      "<label>Download<select id=\"uft-download-menu\">" +
      '<option value="">Choose download…</option>' +
      '<option value="csv">Member cards · CSV (Excel)</option>' +
      '<option value="cards">Member cards · JSON (backup)</option>' +
      '<option value="tree">Full tree · JSON (with links)</option>' +
      '<option value="png">Pedigree view · PNG</option>' +
      '<option value="text">Family tree · TXT</option>' +
      '<option value="pack">Amānah pack · JSON</option>' +
      "</select></label>" +
      "<label>Upload<select id=\"uft-upload-menu\">" +
      '<option value="">Choose upload…</option>' +
      '<option value="cards">Member cards CSV/JSON → picker list</option>' +
      '<option value="tree">Full tree JSON (replace pedigree)</option>' +
      '<option value="pack">Amānah pack</option>' +
      "</select></label>" +
      "</div>" +
      '<p class="uft-hint" style="font-size:0.78rem;opacity:0.9">Download <strong>Member cards · CSV</strong> to edit in Excel, then Upload back into the picker list.</p>' +
      '<div class="uft-save-row">' +
      '<span class="uft-status" id="uft-fo-status">Private on this device — not uploaded.</span>' +
      '<div class="uft-lib"><select id="uft-library" aria-label="Saved copies"><option value="">Saved copies…</option></select> ' +
      '<button type="button" class="btn-soft" id="uft-fo-snap">Save named copy</button></div>' +
      "</div></details>"
    );
  }

  function call(name, arg) {
    if (typeof w[name] === "function") {
      try {
        return w[name](arg);
      } catch (e) {
        try {
          console.warn(name, e);
        } catch (err) {}
      }
    }
  }

  function bind() {
    var save = document.getElementById("uft-fo-save");
    if (save) save.onclick = function () {
      call("uftSave");
      call("uftRender");
    };
    var ref = document.getElementById("uft-fo-refresh");
    if (ref) ref.onclick = function () {
      call("uftRender");
      call("uftCollapseEditor");
    };
    var fresh = document.getElementById("uft-fo-fresh");
    if (fresh) fresh.onclick = function () {
      call("uftStartFresh");
    };
    var clr = document.getElementById("uft-fo-clear");
    if (clr) clr.onclick = function () {
      call("uftClear");
    };
    var dl = document.getElementById("uft-download-menu");
    if (dl) {
      dl.onchange = function () {
        if (typeof w.uftRunDownloadMenu === "function") w.uftRunDownloadMenu(dl);
        else if (dl.value === "tree" && typeof w.uftDownload === "function") w.uftDownload();
        else if (dl.value === "pack" && typeof w.clarityExportPack === "function") w.clarityExportPack();
        dl.value = "";
      };
    }
    var ul = document.getElementById("uft-upload-menu");
    if (ul) {
      ul.onchange = function () {
        if (typeof w.uftRunUploadMenu === "function") w.uftRunUploadMenu(ul);
        ul.value = "";
      };
    }
    var snap = document.getElementById("uft-fo-snap");
    if (snap) snap.onclick = function () {
      call("uftSnapshot");
    };
    var lib = document.getElementById("uft-library");
    if (lib) {
      lib.onchange = function () {
        if (lib.value && typeof w.uftLoadSnapshot === "function") w.uftLoadSnapshot(lib.value);
      };
    }
  }

  function mount() {
    if (!isTree()) return;
    if (document.getElementById("uft-file-ops-section")) {
      bind();
      return;
    }
    var card = document.getElementById("user-family-tree-card");
    if (!card) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = panelHtml();
    var node = wrap.firstChild;
    var build = document.getElementById("uft-build-section");
    if (build && build.parentNode) build.parentNode.insertBefore(node, build.nextSibling);
    else card.appendChild(node);
    bind();
  }

  function boot() {
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[file ops]", e);
      } catch (err) {}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 700);
})(window);
