/**
 * Clarity Notes Bridge v1 — push any section verse/hadith into the notepad
 * Loads notes module on demand; injects 📝 Notes pills site-wide.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTES_BRIDGE_V1__) return;
  g.__CLARITY_NOTES_BRIDGE_V1__ = true;

  function ensureNotes() {
    return Promise.resolve().then(function () {
      if (typeof g.notesCreate === "function" && typeof g.notesRender === "function")
        return true;
      if (g.ClarityLazy && typeof g.ClarityLazy.notes === "function")
        return g.ClarityLazy.notes().then(function () { return true; }).catch(function () { return false; });
      return false;
    });
  }

  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "", title: "" };
    var arEl = card.querySelector('.arabic,[lang="ar"],.cmd-ar,.sr-ar,.verse-ar,.ayah-ar,.hadith-ar,.rabbana-arabic');
    var enEl = card.querySelector('.cmd-en,.sr-en,.verse-en,.translation,.ayah-en,.english,.hadith-en');
    var refEl = card.querySelector('.ref,.verse-ref,.sr-ref,.citation,[data-ref],.hadith-ref');
    var ar = arEl ? (arEl.textContent || "").trim() : "";
    var en = enEl ? (enEl.textContent || "").trim() : "";
    var ref = refEl ? (refEl.textContent || refEl.getAttribute("data-ref") || "").trim() : "";
    var title = ((card.querySelector("h2,h3,.card-title") || {}).textContent || "").trim().slice(0, 80);
    if (!ar && !en) {
      var paras = card.querySelectorAll("p, blockquote");
      for (var i = 0; i < paras.length; i++) {
        var t = (paras[i].textContent || "").trim();
        if (t.length < 12) continue;
        if (/[\u0600-\u06FF]/.test(t) && !ar) ar = t;
        else if (!en && !/[\u0600-\u06FF]/.test(t)) en = t.slice(0, 400);
      }
    }
    return { ar: ar, en: en, ref: ref, title: title };
  }

  function buildBody(p, source) {
    var lines = [];
    lines.push("**Source:** " + (source || "section"));
    if (p.ref) lines.push("**Ref:** " + p.ref);
    lines.push("");
    if (p.ar) {
      lines.push("> " + p.ar);
      lines.push("");
    }
    if (p.en) lines.push(p.en);
    lines.push("");
    lines.push("### My reflection");
    lines.push("");
    lines.push("- [ ] I read this with presence");
    lines.push("- [ ] One action I will take:");
    return lines.join("\n");
  }

  function openNotesTab() {
    try {
      if (typeof g.clarityOpenNotesEditor === "function") {
        g.clarityOpenNotesEditor();
        return;
      }
    } catch (e) {}
    try {
      if (typeof g.switchTab === "function") g.switchTab("notes");
      else if (typeof g.switchTab === "function") g.switchTab("about");
    } catch (e2) {}
    try {
      var shell = document.getElementById("notes-shell") || document.getElementById("notes-card");
      if (shell) {
        shell.classList.remove("gate-hidden");
        shell.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (e3) {}
  }

  function pushToNotes(payload) {
    payload = payload || {};
    var title = payload.title || "Reflection";
    var tag = payload.tag || "Reflection";
    var body = payload.body || "";
    var grave = !!payload.grave;
    return ensureNotes().then(function (ok) {
      if (!ok || typeof g.notesCreate !== "function") {
        try {
          var key = "clarity_notes_queue_v1";
          var q = [];
          try { q = JSON.parse(localStorage.getItem(key) || "[]") || []; } catch (e) {}
          q.unshift({ title: title, tag: tag, body: body, grave: grave, at: Date.now() });
          localStorage.setItem(key, JSON.stringify(q.slice(0, 40)));
          alert("Notes module loading — saved to queue. Open Notes to finish.");
        } catch (e2) {
          alert("Could not open Notes. Try the Notes / About tab.");
        }
        return;
      }
      try {
        if (typeof g.notesQuickFromSection === "function" && !payload.body) {
          g.notesQuickFromSection(tag, title, grave);
        } else {
          g.notesCreate({
            title: title,
            tag: tag,
            body: body,
            grave: grave
          });
        }
      } catch (e3) {
        console.warn("notesCreate", e3);
      }
      openNotesTab();
      setTimeout(function () {
        try {
          if (typeof g.notesRender === "function") g.notesRender();
          var bodyEl = document.getElementById("notes-body");
          if (bodyEl && body && !bodyEl.value) {
            bodyEl.value = body;
            if (typeof g.notesUpdateField === "function") g.notesUpdateField("body", body);
          } else if (bodyEl && body && bodyEl.value.indexOf(body.slice(0, 40)) < 0) {
            bodyEl.value = (bodyEl.value ? bodyEl.value + "\n\n" : "") + body;
            if (typeof g.notesUpdateField === "function") g.notesUpdateField("body", bodyEl.value);
          }
        } catch (e4) {}
      }, 200);
    });
  }

  g.clarityPushToNotes = pushToNotes;

  function ensurePills() {
    var sel = [
      ".card[id]", "[id$='-card']", ".search-result", ".cmd-card",
      ".verse-card", ".hadith-card", ".rabbana-box", "blockquote"
    ].join(",");
    document.querySelectorAll(sel).forEach(function (card) {
      if (!card || card.id === "notes-shell" || card.id === "notes-card") return;
      if (card.querySelector(".clarity-to-notes-pill")) return;
      var sample = extract(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 18) return;
      var row = card.querySelector(".sr-actions, .card-actions, .clarity-meme-pill-row, .clarity-notes-pill-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-notes-pill-row";
        row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.45rem;align-items:center";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-soft clarity-to-notes-pill";
      btn.textContent = "📝 Notes";
      btn.title = "Save this text to your notepad";
      btn.addEventListener("click", function (ev) {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
        var p = extract(card);
        var source = card.id || "section";
        var title = (p.title || p.ref || "Reflection").slice(0, 72);
        var tag = /hadith|bukhari|muslim/i.test(p.ref + p.title) ? "Hadith"
          : /qur|ayah|verse|\d+\s*:\s*\d+/i.test(p.ref + p.title) ? "Qur'an"
          : "Reflection";
        pushToNotes({
          title: title,
          tag: tag,
          body: buildBody(p, source),
          grave: /grave|death|akhirah/i.test(p.en + p.title + source)
        });
      });
      row.appendChild(btn);
    });
  }

  function boot() {
    ensurePills();
    setTimeout(ensurePills, 800);
    setTimeout(ensurePills, 2500);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__notesPillT);
        g.__notesPillT = setTimeout(ensurePills, 400);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
    g.addEventListener("clarity-path-changed", function () {
      setTimeout(ensurePills, 300);
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(ensurePills, 600); });
})(typeof window !== "undefined" ? window : this);
