/*! amana-uft-tree-polish-js-v1 · dedupe registry · JSON load matrix · educational only */
(function (w, d) {
  "use strict";
  if (w.__AMANA_UFT_TREE_POLISH_V1__) return;
  w.__AMANA_UFT_TREE_POLISH_V1__ = true;

  function dedupeRegistry() {
    var nodes = d.querySelectorAll(".uft-registry-deep, .uft-registry-panel, [data-uft-registry]");
    if (nodes.length < 2) {
      /* also collapse repeated headings */
      var heads = d.querySelectorAll("h2, h3, strong");
      var seen = {};
      heads.forEach(function (h) {
        var t = (h.textContent || "").trim().toLowerCase();
        if (t.indexOf("registry") === -1) return;
        if (seen[t]) {
          var block = h.closest("section, .amana-card, .uft-panel, div");
          if (block && block.querySelector && block.querySelector("input, select, textarea")) {
            /* only hide if a prior registry block already exists */
            if (seen[t] > 0) {
              try {
                block.setAttribute("data-uft-dupe-hidden", "1");
                block.style.display = "none";
              } catch (e) {}
            }
          }
          seen[t]++;
        } else {
          seen[t] = 1;
        }
      });
      return;
    }
    for (var i = 1; i < nodes.length; i++) {
      try {
        nodes[i].setAttribute("data-uft-dupe-hidden", "1");
        nodes[i].style.display = "none";
      } catch (e2) {}
    }
  }

  function spacePill() {
    var pill = d.getElementById("amana-unlock-pill");
    if (!pill) return;
    pill.querySelectorAll("a").forEach(function (a) {
      if (!a.style.marginLeft) a.style.margin = "0 0.35rem";
      a.style.whiteSpace = "nowrap";
    });
  }

  function wireJsonMatrix() {
    /* Prefer existing UFT APIs when present — do not replace pedigree engine */
    var api = w.ClarityUFT || w.UFT || w.uft || {};
    try {
      if (typeof w.uftLoadSnapshot === "function") {
        /* already wired by classic module */
      }
      if (typeof w.uftSyncRegistryToCards === "function") {
        /* hygiene button path */
      }
      /* expose stable alias for Import JSON buttons injected by dock */
      if (!w.ClarityAmanaTreeLoadJson && typeof w.uftLoadTreeJson === "function") {
        w.ClarityAmanaTreeLoadJson = w.uftLoadTreeJson;
      }
      if (!w.ClarityAmanaTreeLoadJson && typeof api.loadJson === "function") {
        w.ClarityAmanaTreeLoadJson = function (text) {
          return api.loadJson(text);
        };
      }
    } catch (e) {}

    /* Import file inputs: ensure change handler if classic missed */
    d.querySelectorAll('input[type="file"][accept*="json"], input[type="file"][data-uft-import]').forEach(function (inp) {
      if (inp.getAttribute("data-polish-wired")) return;
      inp.setAttribute("data-polish-wired", "1");
      inp.addEventListener("change", function () {
        var f = inp.files && inp.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var text = String(reader.result || "");
          try {
            if (typeof w.uftImportJson === "function") w.uftImportJson(text);
            else if (typeof w.uftLoadTreeJson === "function") w.uftLoadTreeJson(text);
            else if (typeof w.ClarityAmanaTreeLoadJson === "function") w.ClarityAmanaTreeLoadJson(text);
            else if (typeof w.uftLoadSnapshot === "function") {
              var data = JSON.parse(text);
              w.uftLoadSnapshot(data);
            } else {
              /* last resort: store for modules that poll */
              try {
                localStorage.setItem("clarity_uft_import_pending_v1", text);
              } catch (e3) {}
            }
            dedupeRegistry();
            var st = d.getElementById("uft-status");
            if (st) st.textContent = "JSON import applied · educational outline only — not a legal pedigree.";
          } catch (err) {
            var st2 = d.getElementById("uft-status");
            if (st2) st2.textContent = "Could not parse JSON on this device.";
          }
        };
        reader.readAsText(f);
      });
    });
  }

  function run() {
    spacePill();
    dedupeRegistry();
    wireJsonMatrix();
  }

  d.addEventListener("clarity-uft-core-ready", run);
  d.addEventListener("clarity-uft-wave2-ready", run);
  d.addEventListener("clarity-uft-batch-ready", function () {
    run();
    setTimeout(run, 400);
    setTimeout(run, 1200);
  });
  d.addEventListener("clarity-amana-unlock-change", function () {
    setTimeout(spacePill, 50);
  });

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", run);
  else run();
  setTimeout(run, 800);
  setTimeout(run, 2000);
})(window, document);
