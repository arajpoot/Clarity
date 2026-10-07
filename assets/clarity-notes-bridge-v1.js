/**
 * Clarity Notes Bridge v2 — sleek section chips only (never banner)
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_NOTES_BRIDGE_V2__) return;
  g.__CLARITY_NOTES_BRIDGE_V2__ = true;

  function ensureNotes() {
    if (g.ClarityNotesRestore && typeof g.ClarityNotesRestore.load === "function")
      return g.ClarityNotesRestore.load();
    if (g.ClarityLazy && typeof g.ClarityLazy.notes === "function")
      return g.ClarityLazy.notes().catch(function () { return false; });
    return Promise.resolve(typeof g.notesCreate === "function");
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
      for (var i = 0; i < Math.min(paras.length, 6); i++) {
        var t = (paras[i].textContent || "").trim();
        if (t.length < 12) continue;
        if (/[\u0600-\u06FF]/.test(t) && !ar) ar = t;
        else if (!en && !/[\u0600-\u06FF]/.test(t)) en = t.slice(0, 400);
      }
    }
    return { ar: ar, en: en, ref: ref, title: title };
  }

  function buildBody(p, source) {
    var lines = ["**Source:** " + (source || "section")];
    if (p.ref) lines.push("**Ref:** " + p.ref);
    lines.push("");
    if (p.ar) { lines.push("> " + p.ar); lines.push(""); }
    if (p.en) lines.push(p.en);
    lines.push("");
    lines.push("### My reflection");
    lines.push("");
    lines.push("- [ ] I read this with presence");
    lines.push("- [ ] One action I will take:");
    return lines.join("\n");
  }

  function pushToNotes(payload) {
    payload = payload || {};
    return ensureNotes().then(function () {
      try {
        if (typeof g.notesCreate === "function") {
          g.notesCreate({
            title: (payload.title || "Reflection").slice(0, 72),
            tag: payload.tag || "Reflection",
            body: payload.body || "",
            grave: !!payload.grave
          });
        }
      } catch (e) { console.warn(e); }
      try {
        if (typeof g.clarityOpenNotesEditor === "function") g.clarityOpenNotesEditor();
        else {
          var shell = document.getElementById("notes-shell");
          if (shell) shell.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e2) {}
      setTimeout(function () {
        try {
          var bodyEl = document.getElementById("notes-body");
          if (bodyEl && payload.body) {
            if (!bodyEl.value || bodyEl.value.length < 8) {
              bodyEl.value = payload.body;
              if (typeof g.notesUpdateField === "function") g.notesUpdateField("body", payload.body);
            }
          }
          if (typeof g.notesRender === "function") g.notesRender();
        } catch (e3) {}
      }, 280);
    });
  }
  g.clarityPushToNotes = pushToNotes;

  function banned(card) {
    if (!card) return true;
    if (card.closest("#clarity-top-duo, #clarity-global-nav, .global-nav, .banner, #banner-media")) return true;
    if (card.id === "notes-shell" || card.id === "meme-card" || card.id === "tweet-desk-card") return true;
    return false;
  }

  function ensurePills() {
    document.querySelectorAll(".card[id$='-card'], .card[id], [id$='-card']").forEach(function (card) {
      if (banned(card)) return;
      if (card.querySelector(".clarity-to-notes-pill")) return;
      var sample = extract(card);
      if (!sample.ar && !sample.en) return;
      if ((sample.ar + sample.en).length < 24) return;
      var row = card.querySelector(".clarity-action-row");
      if (!row) {
        row = document.createElement("div");
        row.className = "clarity-action-row";
        card.appendChild(row);
      }
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clarity-to-notes-pill clarity-action-chip";
      btn.textContent = "Notes";
      btn.title = "Save to notepad";
      btn.addEventListener("click", function (ev) {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
        var p = extract(card);
        var tag = /hadith|bukhari|muslim/i.test(p.ref + p.title) ? "Hadith"
          : /qur|ayah|\d+\s*:\s*\d+/i.test(p.ref) ? "Qur'an" : "Reflection";
        pushToNotes({
          title: (p.title || p.ref || "Reflection").slice(0, 72),
          tag: tag,
          body: buildBody(p, card.id || "section"),
          grave: /grave|death|akhirah/i.test(p.en + p.title + (card.id || ""))
        });
      });
      row.appendChild(btn);
    });
  }

  function boot() {
    ensurePills();
    setTimeout(ensurePills, 1000);
    setTimeout(ensurePills, 3000);
    try {
      var mo = new MutationObserver(function () {
        clearTimeout(g.__notesPillT);
        g.__notesPillT = setTimeout(ensurePills, 500);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
