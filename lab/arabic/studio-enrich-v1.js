
(function (g) {
  "use strict";
  if (g.__CU_AR_ENRICH_V1__) return;
  g.__CU_AR_ENRICH_V1__ = true;
  var VER = "20261018AR48";
  var MERGED_KEY = "cu_lab_ar_merged_packs_v1";
  var SESSION_KEY = "cu_lab_ar_session_v1";
  var PACK_INDEX = [
    { id: "greetings", title: "Greetings", file: "/lab/arabic/packs/greetings.json", path: 1 },
    { id: "family", title: "Family", file: "/lab/arabic/packs/family.json", path: 1 },
    { id: "salah_plus", title: "Salah plus", file: "/lab/arabic/packs/salah_plus.json", path: 2 },
    { id: "travel", title: "Travel and needs", file: "/lab/arabic/packs/travel.json", path: 1 }
  ];
  var MODE_HELP = {
    flash: "Flip the card. Hear Arabic, then recall English.",
    match: "Pair Arabic with meaning. Accuracy over speed.",
    learn: "Up to about 10 new cards. Read the example out loud.",
    test: "MCQ or type. Local score only - not a grade of iman.",
    listen: "Hear first, then choose. Use slow hear when unsure.",
    sentence: "Jumlah patterns - nominal, templates, cloze.",
    type: "Type what you heard or the meaning.",
    letters: "Letter shapes - isolated practice before words.",
    reviews: "Spaced reviews when Due is greater than 0."
  };
  function $(id) { return document.getElementById(id); }
  function root() { return $("ar-studio"); }
  function toast(msg) {
    var t = $("ar-repair-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "ar-repair-toast";
      t.className = "ar-repair-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function loadMerged() {
    try { return JSON.parse(localStorage.getItem(MERGED_KEY) || "{}"); } catch (e) { return {}; }
  }
  function saveMerged(o) {
    try { localStorage.setItem(MERGED_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function sessionBump(kind) {
    var s = { cards: 0, listens: 0, at: Date.now() };
    try { s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null") || s; } catch (e) {}
    if (kind === "card") s.cards = (s.cards || 0) + 1;
    if (kind === "listen") s.listens = (s.listens || 0) + 1;
    s.at = Date.now();
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {}
    if (g.ClarityTranscript && kind === "card" && s.cards % 10 === 0) {
      try {
        g.ClarityTranscript.log("lab", { id: "ar-session-" + s.cards, title: "Arabic session " + s.cards + " cards" });
      } catch (e2) {}
    }
    paintRetention();
    return s;
  }
  function paintModeHelp() {
    var r = root();
    if (!r) return;
    var active = r.querySelector(".ar-mode-btn.here, .ar-modes .here");
    var mode = "flash";
    if (active) mode = active.getAttribute("data-mode") || (active.textContent || "").trim().toLowerCase();
    var key = mode;
    if (key.indexOf("jumlah") >= 0 || key === "sentence") key = "sentence";
    var help = MODE_HELP[key] || MODE_HELP.flash;
    var el = r.querySelector(".ar-mode-help");
    if (!el) {
      el = document.createElement("p");
      el.className = "ar-mode-help";
      var modes = r.querySelector(".ar-modes");
      if (modes && modes.parentNode) modes.parentNode.insertBefore(el, modes.nextSibling);
      else r.appendChild(el);
    }
    el.innerHTML = "<strong>Mode tip:</strong> " + help;
  }
  function paintExpandPanel() {
    var r = root();
    if (!r || r.querySelector(".ar-expand-panel")) return;
    var panel = document.createElement("div");
    panel.className = "ar-expand-panel";
    panel.innerHTML = "<div class=\"ar-expand-head\"><strong>Expand bank - curated packs</strong><span>Offline-friendly JSON - merges into your session</span></div><div class=\"ar-expand-grid\" id=\"ar-expand-grid\"></div>";
    r.appendChild(panel);
    var grid = panel.querySelector("#ar-expand-grid");
    var merged = loadMerged();
    PACK_INDEX.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ar-btn" + (merged[p.id] ? " ar-pack-on" : "");
      b.textContent = (merged[p.id] ? "+ " : "+ ").replace("+ ", merged[p.id] ? "OK " : "+ ") + p.title;
      b.setAttribute("data-ar-pack", p.id);
      b.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        loadPack(p);
      };
      grid.appendChild(b);
    });
  }
  function injectPackIntoStudio(pack) {
    if (!g.CuLabArabic || !g.CuLabArabic.DECKS) {
      toast("Studio decks not ready - pack cached");
      return;
    }
    var DECKS = g.CuLabArabic.DECKS;
    var id = "pack_" + pack.id;
    DECKS[id] = {
      id: id,
      title: pack.title || pack.id,
      level: pack.path || 1,
      path: pack.path || 1,
      cards: (pack.cards || []).map(function (c) {
        return { id: c.id, ar: c.ar, en: c.en, tr: c.tr || "", emoji: c.emoji || "*", example: c.example || c.ar, root: c.root || "" };
      })
    };
    toast((pack.title || pack.id) + " - " + (pack.cards || []).length + " cards");
    var r = root();
    setTimeout(function () {
      var btn = r && r.querySelector('[data-deck="' + id + '"]');
      if (btn) btn.click();
      else {
        var note = r && r.querySelector(".ar-status-line");
        if (note) note.textContent = "Pack loaded: " + (pack.title || id) + " - open Flash or Learn.";
      }
    }, 200);
  }
  function loadPack(meta) {
    toast("Loading " + meta.title + "...");
    fetch(meta.file + "?v=" + VER, { cache: "force-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("pack");
        return r.json();
      })
      .then(function (data) {
        var merged = loadMerged();
        merged[meta.id] = { at: new Date().toISOString(), title: data.title || meta.title, n: (data.cards || []).length };
        saveMerged(merged);
        injectPackIntoStudio(data);
        var grid = $("ar-expand-grid");
        if (grid) {
          grid.querySelectorAll("[data-ar-pack]").forEach(function (b) {
            if (b.getAttribute("data-ar-pack") === meta.id) {
              b.classList.add("ar-pack-on");
              b.textContent = "OK " + meta.title;
            }
          });
        }
        if (g.ClarityTranscript) {
          try { g.ClarityTranscript.log("lab", { id: "ar-pack-" + meta.id, title: "Expanded " + meta.title }); } catch (e) {}
        }
      })
      .catch(function () { toast("Pack unavailable - try Expand bank"); });
  }
  function paintRetention() {
    var r = root();
    if (!r) return;
    var s = { cards: 0 };
    try { s = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}") || s; } catch (e) {}
    var el = r.querySelector(".ar-retention");
    if (!el) {
      el = document.createElement("div");
      el.className = "ar-retention";
      r.appendChild(el);
    }
    var day = 1;
    try { day = parseInt(localStorage.getItem("cu_lab_ar_day_v1") || "1", 10) || 1; } catch (e2) {}
    el.innerHTML = "<strong>Session</strong> - cards ~" + (s.cards || 0) + " - <strong>Speak path</strong> day " + day + "/30" +
      (s.cards >= 10 ? ' - <a href="/campus/transcript/">Transcript</a>' : "") +
      ' - <a href="/campus/assignments/">Assignments</a>';
  }
  function paintBuddyBridge() {
    var r = root();
    if (!r || r.querySelector(".ar-buddy-bridge")) return;
    var d = document.createElement("div");
    d.className = "ar-buddy-bridge";
    d.innerHTML = '<span>Need a pointer?</span> <a class="ar-btn" href="/campus/buddy/">Study Buddy</a> <button type="button" class="ar-btn" id="ar-buddy-hint">Why this word?</button>';
    r.appendChild(d);
    var b = d.querySelector("#ar-buddy-hint");
    if (b) {
      b.onclick = function () {
        var sample = "This card is for recognition and speaking practice. Check the example line, hear it, then use it in a short sentence. Not a grammar fatwa - ask a teacher for rules.";
        toast("See mode tip for details");
        var box = r.querySelector(".ar-mode-help");
        if (box) box.innerHTML = "<strong>Why this word?</strong> " + sample;
      };
    }
  }
  function paintPolishChrome() {
    var r = root();
    if (!r) return;
    r.classList.add("ar-enriched");
    try {
      var q = new URLSearchParams(location.search);
      var pack = q.get("pack");
      var mode = q.get("mode");
      if (pack === "day" || pack === "speak30") {
        var btn = r.querySelector('[data-ar-action="today-pack"]');
        if (btn) setTimeout(function () { btn.click(); }, 600);
      }
      if (mode) {
        setTimeout(function () {
          var m = r.querySelector('[data-mode="' + mode + '"]');
          if (m) m.click();
        }, 700);
      }
    } catch (e) {}
  }
  function wireModeClicks() {
    var r = root();
    if (!r || r.__arEnrichModes) return;
    r.__arEnrichModes = true;
    r.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest("[data-mode], .ar-mode-btn")) {
        setTimeout(paintModeHelp, 30);
        sessionBump("card");
      }
      if (t.closest("#ar-hear, #ar-hear-q, [data-ar-action='hear-line']")) sessionBump("listen");
      if (t.closest("#ar-next, #ar-flip, .ar-flash-card")) sessionBump("card");
    }, false);
  }
  function enhance() {
    if (!root()) return;
    paintModeHelp();
    paintExpandPanel();
    paintRetention();
    paintBuddyBridge();
    paintPolishChrome();
    wireModeClicks();
  }
  var obs;
  function boot() {
    enhance();
    var r = root();
    if (r && !obs) {
      obs = new MutationObserver(function () {
        if (!r.querySelector(".ar-expand-panel")) paintExpandPanel();
        if (!r.querySelector(".ar-buddy-bridge")) paintBuddyBridge();
        paintModeHelp();
        paintRetention();
      });
      obs.observe(r, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 120);
      setTimeout(boot, 500);
    });
  } else {
    setTimeout(boot, 120);
    setTimeout(boot, 500);
  }
})(typeof window !== "undefined" ? window : this);
