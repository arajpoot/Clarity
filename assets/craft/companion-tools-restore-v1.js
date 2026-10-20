/**
 * Companion tools restore C–F — calligraphy init, tajweed live, notes pad, wiring.
 * Educational only. Lab remains full reference at /lab/*.
 */
(function (g) {
  "use strict";
  if (g.__CU_COMPANION_TOOLS_RESTORE_V1__) return;
  g.__CU_COMPANION_TOOLS_RESTORE_V1__ = true;

  function afterDiet(fn) {
    if (g.__CLARITY_CHUNK8_LOADED__ || g.calligInit || g.memeFetchBg) {
      setTimeout(fn, 50);
      return;
    }
    g.addEventListener("clarity-companion-diet-ready", function () {
      setTimeout(fn, 80);
    });
    setTimeout(fn, 3200);
  }

  /* Phase C — Calligraphy */
  function bootCallig() {
    try {
      var card = document.getElementById("callig-lab-card");
      if (card) {
        card.style.removeProperty("display");
        card.removeAttribute("hidden");
      }
      if (typeof g.calligInit === "function") g.calligInit();
      else if (g.calligState && typeof g.calligDrawGuide === "function") g.calligDrawGuide();
      /* Lab bridge link once */
      if (card && !document.getElementById("cu-callig-lab-link")) {
        var p = document.createElement("p");
        p.id = "cu-callig-lab-link";
        p.style.cssText = "font-size:.78rem;margin:.4rem 0 0;opacity:.85";
        p.innerHTML =
          'Full atelier: <a href="/lab/calligraphy/" style="font-weight:700">Lab · Calligraphy</a> (reference)';
        card.appendChild(p);
      }
    } catch (e) {
      console.warn("callig restore", e);
    }
  }

  /* Phase D — Tajweed live card */
  function bootTajweed() {
    try {
      var card = document.getElementById("tajweed-live-card");
      if (card) {
        card.style.removeProperty("display");
        card.removeAttribute("hidden");
      }
      if (typeof g.clarityRefreshSection === "function") {
        try {
          g.clarityRefreshSection("tajweed");
        } catch (e1) {}
      }
      if (card && !document.getElementById("cu-tajweed-lab-link")) {
        var p = document.createElement("p");
        p.id = "cu-tajweed-lab-link";
        p.style.cssText = "font-size:.78rem;margin:.45rem 0 0;opacity:.85";
        p.innerHTML =
          'Deep studio: <a href="/lab/tajweed/" style="font-weight:700">Lab · Tajweed</a> (reference)';
        card.appendChild(p);
      }
      var pathCard = document.getElementById("tajweed-path-card");
      if (pathCard) {
        pathCard.style.removeProperty("display");
      }
    } catch (e) {
      console.warn("tajweed restore", e);
    }
  }

  /* Phase E — Notes: light on-device pad (vault stays at /vault/) */
  var NOTES_KEY = "clarity_companion_notes_v1";

  function loadNotes() {
    try {
      return JSON.parse(localStorage.getItem(NOTES_KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }
  function saveNotes(list) {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function bootNotes() {
    /* AMANA_WS2_KILL_NOTES_PAD — replaced by Quick note + Worksheet */
    try {
      var old = document.getElementById("cu-companion-notes-pad");
      if (old && old.parentNode) old.parentNode.removeChild(old);
    } catch (eKill) {}
    return;
    /* original bootNotes disabled */

    var tab = document.getElementById("tab-notes");
    if (!tab) return;
    if (document.getElementById("cu-companion-notes-pad")) return;

    var pad = document.createElement("div");
    pad.id = "cu-companion-notes-pad";
    pad.setAttribute(
      "style",
      "max-width:36rem;margin:1rem auto 2rem;padding:1rem 1.1rem;border-radius:16px;" +
        "border:1px solid rgba(212,180,90,.35);background:rgba(0,0,0,.2);color:inherit"
    );
    pad.innerHTML =
      "<h2 style=\"margin:0 0 .35rem;font-size:1.05rem;color:#d4b45a\">Notes pad</h2>" +
      '<p style="margin:0 0 .65rem;font-size:.82rem;opacity:.85">On this device only. Amana Vault (passphrase tools) stays on University Vault.</p>' +
      '<label style="display:block;font-size:.8rem;margin-bottom:.35rem">Title<br/>' +
      '<input id="cu-note-title" style="width:100%;padding:.4rem .5rem;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.35);color:inherit"/></label>' +
      '<label style="display:block;font-size:.8rem;margin-bottom:.5rem">Note<br/>' +
      '<textarea id="cu-note-body" rows="4" style="width:100%;padding:.4rem .5rem;border-radius:8px;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.35);color:inherit"></textarea></label>' +
      '<p style="margin:0 0 .65rem"><button type="button" id="cu-note-save" class="btn-soft">Save note</button> ' +
      '<a href="/vault/" style="font-size:.8rem;margin-left:.35rem">Open Amana Vault</a></p>' +
      '<ul id="cu-note-list" style="margin:0;padding-left:1.1rem;font-size:.86rem;line-height:1.45"></ul>';

    /* Insert pad above vault CTA if present */
    var cta = tab.querySelector(".cu-v4-vault-cta");
    if (cta && cta.parentNode) cta.parentNode.insertBefore(pad, cta);
    else tab.appendChild(pad);

    function renderList() {
      var ul = document.getElementById("cu-note-list");
      if (!ul) return;
      var list = loadNotes();
      if (!list.length) {
        ul.innerHTML = "<li style=\"opacity:.7\">No notes yet.</li>";
        return;
      }
      ul.innerHTML = list
        .slice()
        .reverse()
        .map(function (n, i) {
          var real = list.length - 1 - i;
          return (
            "<li><strong>" +
            escapeHtml(n.title || "Untitled") +
            "</strong> — " +
            escapeHtml((n.body || "").slice(0, 120)) +
            ' <button type="button" data-del="' +
            real +
            '" style="font-size:.72rem">Delete</button></li>'
          );
        })
        .join("");
      ul.querySelectorAll("[data-del]").forEach(function (btn) {
        btn.onclick = function () {
          var list2 = loadNotes();
          list2.splice(+btn.getAttribute("data-del"), 1);
          saveNotes(list2);
          renderList();
        };
      });
    }

    function escapeHtml(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    var saveBtn = document.getElementById("cu-note-save");
    if (saveBtn) {
      saveBtn.onclick = function () {
        var title = (document.getElementById("cu-note-title") || {}).value || "";
        var body = (document.getElementById("cu-note-body") || {}).value || "";
        if (!title.trim() && !body.trim()) return;
        var list = loadNotes();
        list.push({ title: title.trim(), body: body.trim(), at: Date.now() });
        saveNotes(list);
        var ti = document.getElementById("cu-note-title");
        var bd = document.getElementById("cu-note-body");
        if (ti) ti.value = "";
        if (bd) bd.value = "";
        renderList();
      };
    }
    renderList();
  }

  /* Phase F — wiring */
  function bootAll() {
    bootCallig();
    bootTajweed();
    bootNotes();
  }

  afterDiet(bootAll);
  g.addEventListener("clarity-companion-diet-ready", function () {
    setTimeout(bootAll, 100);
  });
  /* When user opens notes tab */
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t) return;
    var tab = t.getAttribute && t.getAttribute("data-tab");
    if (tab === "notes" || (t.closest && t.closest('[data-tab="notes"]'))) {
      setTimeout(bootNotes, 50);
    }
  });
})(typeof window !== "undefined" ? window : this);

  /* Ensure Action drills visible for daily + dai paths */
  function revealDrills() {
    try {
      ["meme-card", "callig-lab-card", "tajweed-live-card", "tajweed-path-card", "tj-deep-studio"].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.removeProperty("display");
        el.style.removeProperty("visibility");
        el.removeAttribute("hidden");
        el.setAttribute("aria-hidden", "false");
        if (!el.getAttribute("data-rrra")) el.setAttribute("data-rrra", "action");
      });
    } catch (e) {}
  }
  afterDiet(revealDrills);
  setTimeout(revealDrills, 1500);

