/*! craft-meme-control-wire-v1 · C19MEME11
 * Final unified control binding for Craft Meme Studio
 * Binds every button once · delegates paint to memeDraw only
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_CONTROL_WIRE_V1__) return;
  w.__CRAFT_MEME_CONTROL_WIRE_V1__ = true;

  function $(id) { return d.getElementById(id); }
  function status(id, msg) {
    var el = $(id);
    if (el) el.textContent = msg || "";
  }
  function paint() {
    if (typeof w.memeDraw === "function") {
      try { w.memeDraw(); } catch (e) {}
    }
  }
  function once(el, key, type, fn) {
    if (!el || el[key]) return;
    el[key] = true;
    el.addEventListener(type || "click", fn);
  }

  function loadSection(sec) {
    sec = sec || "reminder";
    if (w.CraftMemeSource && typeof w.CraftMemeSource.loadSection === "function") {
      return w.CraftMemeSource.loadSection(sec, true);
    }
    if (w.CraftMemeSource && typeof w.CraftMemeSource.fetchSection === "function") {
      var r = w.CraftMemeSource.fetchSection(sec);
      if (w.CraftMemeSource.applyToDesks) w.CraftMemeSource.applyToDesks(r.text);
      if (w.CraftMemeSource.pushLayers) w.CraftMemeSource.pushLayers(r.line);
      else if (r.line) {
        w.__memeLayers = { ar: r.line.ar || "", en: r.line.en || "", ur: "", ref: r.line.ref || "" };
      }
      paint();
      return r;
    }
    var btn = d.querySelector('[data-meme-section="' + sec + '"], [data-rrra="' + sec + '"]');
    if (btn) btn.click();
    return null;
  }

  function fetchScene(kind) {
    kind = kind || w.__memeSceneKind || "nature";
    w.__memeSceneKind = kind;
    status("meme-fetch-status", "Fetching scenery · " + kind + "…");
    try {
      if (typeof w.__memeOnlineFetch === "function") {
        w.__memeOnlineFetch(kind);
        return;
      }
      if (typeof w.memeFetchBg === "function") {
        w.memeFetchBg(kind);
        return;
      }
      if (typeof w.memeFetchNature === "function") {
        w.memeFetchNature();
        return;
      }
    } catch (e) {}
    status("meme-fetch-status", "Scenery fetch unavailable · try again");
  }

  function matchSceneForText() {
    var kind = w.__memeSceneKind || "nature";
    var t = "";
    try {
      if (w.__memeLayers) t = ((w.__memeLayers.en || "") + " " + (w.__memeLayers.ar || "")).toLowerCase();
    } catch (e) {}
    if (/sea|ocean|water|river|lake/.test(t)) kind = "water";
    else if (/mountain|hill/.test(t)) kind = "mountain";
    else if (/garden|flower/.test(t)) kind = "garden";
    else if (/sky|cloud|heaven/.test(t)) kind = "sky";
    else if (/desert|sand/.test(t)) kind = "desert";
    else if (/forest|tree/.test(t)) kind = "forest";
    else if (/sun|dawn|sunrise/.test(t)) kind = "sunrise";
    w.__memeSceneKind = kind;
    d.querySelectorAll("#meme-scene-chips [data-scene]").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-scene") === kind);
    });
    fetchScene(kind);
  }

  function exportPng() {
    if (typeof w.craftMemeExportPng === "function") {
      w.craftMemeExportPng();
      return;
    }
    var c = $("meme-canvas") || $("mr-canvas");
    if (!c) return;
    try {
      var a = d.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "clarity-meme-" + Date.now() + ".png";
      a.click();
      status("meme-export-status", "PNG downloaded · educational only");
    } catch (e) {
      status("meme-export-status", "Export failed");
    }
  }

  async function copyPng() {
    var c = $("meme-canvas") || $("mr-canvas");
    if (!c) return;
    try {
      if (c.toBlob && navigator.clipboard && w.ClipboardItem) {
        c.toBlob(async function (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            status("meme-export-status", "PNG copied · educational only");
          } catch (e) {
            exportPng();
          }
        });
      } else exportPng();
    } catch (e2) {
      exportPng();
    }
  }

  function pushDesks() {
    if (w.CraftMemeAutomation && typeof w.CraftMemeAutomation.fillDesks === "function") {
      w.CraftMemeAutomation.fillDesks(false);
    } else if (w.CraftMemeSource && w.__memeLayers) {
      var L = w.__memeLayers;
      var parts = [];
      if (L.ar) parts.push(L.ar);
      if (L.en) parts.push(L.en);
      if (L.ref) parts.push("(" + L.ref + ")");
      parts.push("— clarity-dawah.fyi · educational only");
      w.CraftMemeSource.applyToDesks(parts.join("\n"));
    }
    status("meme-wire-status", "Pushed to desks");
    status("meme-source-status", "Desks filled · educational only");
  }

  function fullSurprise() {
    loadSection("reminder");
    setTimeout(function () { matchSceneForText(); }, 400);
    setTimeout(function () {
      pushDesks();
      status("meme-source-status", "Verse + scene ready · educational only");
    }, 900);
  }

  function verseOnly() {
    loadSection("reminder");
    status("meme-source-status", "Verse only · educational only");
  }

  function sceneOnly() {
    fetchScene(w.__memeSceneKind || "nature");
  }

  function bindAll() {
    once($("meme-wire-preview"), "_cw", "click", function () { paint(); status("meme-wire-status", "Re-painted"); });
    once($("meme-export-png"), "_cw", "click", exportPng);
    once($("meme-copy-png"), "_cw", "click", function () { copyPng(); });
    once($("meme-push-desks"), "_cw", "click", pushDesks);
    once($("meme-full-surprise"), "_cw", "click", fullSurprise);
    once($("meme-surprise-verse-only"), "_cw", "click", verseOnly);
    once($("meme-surprise-scene-only"), "_cw", "click", sceneOnly);
    once($("meme-surprise-bg"), "_cw", "click", function () { fetchScene(w.__memeSceneKind || "nature"); });
    once($("meme-scene-for-text"), "_cw", "click", matchSceneForText);
    once($("meme-next-bg"), "_cw", "click", function () { fetchScene(w.__memeSceneKind || "nature"); });
    once($("meme-fill-desks"), "_cw", "click", pushDesks);
    once($("meme-refresh-source"), "_cw", "click", function () {
      var active = d.querySelector("[data-meme-section].active, [data-rrra].active");
      var id = active ? (active.getAttribute("data-meme-section") || active.getAttribute("data-rrra")) : "reminder";
      loadSection(id);
    });
    once($("meme-daily-pack"), "_cw", "click", function () {
      if (w.CraftMemeAutomation && typeof w.CraftMemeAutomation.dailyPack === "function") {
        w.CraftMemeAutomation.dailyPack();
      } else {
        fullSurprise();
      }
    });

    d.querySelectorAll("#meme-scene-chips [data-scene]").forEach(function (btn) {
      once(btn, "_cwScene", "click", function () {
        d.querySelectorAll("#meme-scene-chips [data-scene]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        w.__memeSceneKind = btn.getAttribute("data-scene") || "nature";
        status("meme-fetch-status", "Scene kind · " + w.__memeSceneKind);
      });
    });

    d.querySelectorAll("#meme-ratio-chips [data-ratio]").forEach(function (btn) {
      once(btn, "_cwRatio", "click", function () {
        d.querySelectorAll("#meme-ratio-chips [data-ratio]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var r = (btn.getAttribute("data-ratio") || "16:9").split(":");
        var c = $("meme-canvas") || $("mr-canvas");
        if (c && r.length === 2) {
          c.width = 1200;
          c.height = Math.round(1200 * (+r[1]) / (+r[0]));
          paint();
        }
        status("meme-ratio-status", "Ratio " + btn.getAttribute("data-ratio"));
        try {
          if (w.CraftMemeSource && w.CraftMemeSource.saveState) {
            w.CraftMemeSource.saveState({ ratio: btn.getAttribute("data-ratio") });
          }
        } catch (e) {}
      });
    });
  }

  function boot() { bindAll(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(bindAll, 300);
    setTimeout(bindAll, 1000);
  });

  w.CraftMemeControlWire = {
    loadSection: loadSection,
    fetchScene: fetchScene,
    matchSceneForText: matchSceneForText,
    fullSurprise: fullSurprise,
    exportPng: exportPng,
    pushDesks: pushDesks,
    paint: paint
  };
})(window, document);
