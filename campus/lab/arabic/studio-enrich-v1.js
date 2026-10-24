/**
 * Arabic enrich STABLE — packs + mode tips, no tight observer loops
 */
(function (g) {
  "use strict";
  if (g.__CU_AR_ENRICH_V1__) return;
  g.__CU_AR_ENRICH_V1__ = true;
  var VER = "20261024ARABIC";
  var MERGED_KEY = "cu_lab_ar_merged_packs_v1";
  var SESSION_KEY = "cu_lab_ar_session_v1";
  var busy = false;

  var PACK_INDEX = [
    { id: "greetings", title: "Greetings", file: "/campus/lab/arabic/packs/greetings.json" },
    { id: "family", title: "Family", file: "/campus/lab/arabic/packs/family.json" },
    { id: "salah_plus", title: "Salah plus", file: "/campus/lab/arabic/packs/salah_plus.json" },
    { id: "travel", title: "Travel", file: "/campus/lab/arabic/packs/travel.json" }
  ];
  var MODE_HELP = {
    flash: "Flip the card. Hear Arabic, then recall English.",
    match: "Pair Arabic with meaning.",
    learn: "New cards — read the example out loud.",
    test: "Local score only.",
    listen: "Hear first, then choose.",
    sentence: "Jumlah patterns.",
    type: "Type what you heard.",
    letters: "Letter shapes.",
    reviews: "Spaced reviews when Due > 0."
  };

  function $(id) { try { return document.getElementById(id); } catch (e) { return null; } }
  function root() { return $("ar-studio"); }
  function toast(msg) {
    try {
      var t = $("ar-repair-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "ar-repair-toast";
        t.className = "ar-repair-toast";
        document.body.appendChild(t);
      }
      t.textContent = String(msg || "");
      t.classList.add("show");
      clearTimeout(t._tm);
      t._tm = setTimeout(function () { t.classList.remove("show"); }, 2000);
    } catch (e) {}
  }

  function paintModeHelp() {
    try {
      var r = root();
      if (!r) return;
      var active = r.querySelector(".ar-mode-btn.here, .ar-modes .here");
      var mode = active ? (active.getAttribute("data-mode") || "flash") : "flash";
      if (mode === "sentence") mode = "sentence";
      var help = MODE_HELP[mode] || MODE_HELP.flash;
      var el = r.querySelector(".ar-mode-help");
      if (!el) {
        el = document.createElement("p");
        el.className = "ar-mode-help";
        var modes = r.querySelector(".ar-modes");
        if (modes && modes.parentNode) modes.parentNode.insertBefore(el, modes.nextSibling);
        else r.appendChild(el);
      }
      el.innerHTML = "<strong>Mode tip:</strong> " + help;
    } catch (e) {}
  }

  function paintExpandPanel() {
    try {
      var r = root();
      if (!r || r.querySelector(".ar-expand-panel")) return;
      var panel = document.createElement("div");
      panel.className = "ar-expand-panel";
      panel.innerHTML = "<div class=\"ar-expand-head\"><strong>Expand bank</strong> <span class=\"ar-muted\">· Curated packs</span></div><div class=\"ar-expand-grid\" id=\"ar-expand-grid\"></div>";
      r.appendChild(panel);
      var grid = panel.querySelector("#ar-expand-grid");
      var merged = {};
      try { merged = JSON.parse(localStorage.getItem(MERGED_KEY) || "{}"); } catch (e) {}
      PACK_INDEX.forEach(function (p) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "ar-btn" + (merged[p.id] ? " ar-pack-on" : "");
        b.textContent = (merged[p.id] ? "OK " : "+ ") + p.title;
        b.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();
          loadPack(p);
        };
        grid.appendChild(b);
      });
    } catch (e) {}
  }

  function loadPack(meta) {
    toast("Loading " + meta.title + "…");
    fetch(meta.file + "?v=" + VER)
      .then(function (r) { if (!r.ok) throw new Error("x"); return r.json(); })
      .then(function (data) {
        try {
          var merged = JSON.parse(localStorage.getItem(MERGED_KEY) || "{}");
          merged[meta.id] = { at: Date.now(), n: (data.cards || []).length };
          localStorage.setItem(MERGED_KEY, JSON.stringify(merged));
        } catch (e) {}
        if (g.CuLabArabic && g.CuLabArabic.DECKS) {
          var id = "pack_" + meta.id;
          g.CuLabArabic.DECKS[id] = {
            id: id,
            title: data.title || meta.title,
            level: 1,
            path: 1,
            cards: data.cards || []
          };
        }
        toast((data.title || meta.title) + " loaded");
        paintExpandPanel();
      })
      .catch(function () { toast("Pack unavailable"); });
  }

  function paintExtras() {
    if (busy) return;
    busy = true;
    try {
      paintModeHelp();
      paintExpandPanel();
      var r = root();
      if (r && !r.querySelector(".ar-buddy-bridge")) {
        var d = document.createElement("div");
        d.className = "ar-buddy-bridge";
        d.innerHTML = '<a class="ar-btn" href="/campus/buddy/">Study Buddy</a> <a class="ar-btn primary" href="/campus/lab/arabic/hajj2027/">Hajj 2027 phrases</a>';
        r.appendChild(d);
      }
      if (r && !r.querySelector(".ar-retention")) {
        var el = document.createElement("div");
        el.className = "ar-retention";
        var day = 1;
        try { day = parseInt(localStorage.getItem("cu_lab_ar_day_v1") || "1", 10) || 1; } catch (e) {}
        el.innerHTML = "Speak path day " + day + '/30 · <a href="/campus/transcript/">Transcript</a>';
        r.appendChild(el);
      }
    } catch (e) {}
    busy = false;
  }

  function boot() {
    paintExtras();
    var r = root();
    if (r && !r.__arEnrichClick) {
      r.__arEnrichClick = true;
      r.addEventListener("click", function (e) {
        try {
          var t = e.target;
          if (t && t.closest && t.closest("[data-mode], .ar-mode-btn")) setTimeout(paintModeHelp, 40);
        } catch (err) {}
      });
    }
  }

  setTimeout(boot, 150);
  setTimeout(boot, 600);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  }
})(typeof window !== "undefined" ? window : this);
