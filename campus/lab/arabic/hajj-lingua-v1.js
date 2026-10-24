/**
 * Hajj 2027 · Lingua phrases + duʿā + checklist
 * Educational only — not a fatwa. Follow your group's guide.
 */
(function (g) {
  "use strict";
  if (g.__CU_HAJJ_LINGUA_V1__) return;
  g.__CU_HAJJ_LINGUA_V1__ = true;

  var RITE_KEY = "cu_hajj_rites_v1";
  var NOTES_KEY = "cu_hajj_notes_v1";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function el(id) {
    return document.getElementById(id);
  }

  function mount() {
    var host = el("hajj-lingua-root");
    if (!host) return;
    var data = g.CuLinguaHajjData;
    if (!data) {
      host.innerHTML = '<p class="cu-meta">Hajj phrase data not loaded.</p>';
      return;
    }
    var scenes = Object.keys(data.phrases || {});
    host.innerHTML =
      '<section class="cu-plaque" style="margin:1rem 0">' +
      "<strong>Travel phrases</strong>" +
      '<p class="cu-meta">Educational only. Not a ritual guide. Follow your group’s guide for rites.</p>' +
      '<p id="hajj-scene-pills" style="display:flex;flex-wrap:wrap;gap:.35rem;margin:.5rem 0"></p>' +
      '<div id="hajj-phrase-list"></div>' +
      "</section>" +
      '<section class="cu-plaque" style="margin:1rem 0">' +
      "<strong>Selected duʿās</strong>" +
      '<div id="hajj-dua-list"></div>' +
      "</section>" +
      '<section class="cu-plaque" style="margin:1rem 0">' +
      "<strong>Rite checklist</strong>" +
      '<p class="cu-meta">Practical aid only. Confirm with your group scholar — not a fatwa.</p>' +
      '<div id="hajj-rite-list"></div>' +
      "</section>" +
      '<section class="cu-plaque" style="margin:1rem 0">' +
      "<strong>Private notes</strong>" +
      '<textarea id="hajj-notes" rows="3" style="width:100%;border-radius:12px;padding:.65rem;border:1px solid rgba(201,162,39,.35);background:transparent;color:inherit" placeholder="Local only on this device"></textarea>' +
      "</section>";

    var pills = el("hajj-scene-pills");
    scenes.forEach(function (sc, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = sc;
      b.setAttribute("data-scene", sc);
      b.style.cssText =
        "min-height:36px;padding:.3rem .7rem;border-radius:999px;border:1px solid rgba(201,162,39,.35);background:transparent;color:inherit;font-weight:700";
      if (i === 0) b.style.background = "rgba(70,124,69,.35)";
      pills.appendChild(b);
    });
    pills.addEventListener("click", function (e) {
      var b = e.target.closest("[data-scene]");
      if (!b) return;
      pills.querySelectorAll("button").forEach(function (x) {
        x.style.background = "transparent";
      });
      b.style.background = "rgba(70,124,69,.35)";
      renderPhrases(b.getAttribute("data-scene"));
    });
    if (scenes[0]) renderPhrases(scenes[0]);
    renderDuas();
    renderRites();
    var notes = el("hajj-notes");
    if (notes) {
      try {
        notes.value = localStorage.getItem(NOTES_KEY) || "";
      } catch (e) {}
      notes.addEventListener("input", function () {
        try {
          localStorage.setItem(NOTES_KEY, notes.value);
        } catch (e) {}
      });
    }
  }

  function renderPhrases(scene) {
    var list = el("hajj-phrase-list");
    var data = g.CuLinguaHajjData;
    if (!list || !data) return;
    var rows = data.phrases[scene] || [];
    list.innerHTML = rows
      .map(function (r, i) {
        return (
          '<div class="cu-plaque" style="margin:.4rem 0">' +
          "<div><strong>" +
          esc(r.en) +
          "</strong></div>" +
          '<div lang="ar" style="font-size:1.15rem;margin:.25rem 0">' +
          esc(r.ar) +
          "</div>" +
          (r.ur
            ? '<div lang="ur" class="cu-meta">' + esc(r.ur) + "</div>"
            : "") +
          '<p style="display:flex;flex-wrap:wrap;gap:.35rem;margin:.4rem 0 0">' +
          '<button type="button" data-speak="' +
          scene +
          ":" +
          i +
          '" style="min-height:36px;padding:.3rem .7rem;border-radius:999px">Listen AR</button>' +
          '<button type="button" data-use="' +
          scene +
          ":" +
          i +
          '" style="min-height:36px;padding:.3rem .7rem;border-radius:999px">Use in Translate</button>' +
          "</p></div>"
        );
      })
      .join("");
    list.onclick = function (e) {
      var sp = e.target.closest("[data-speak]");
      var use = e.target.closest("[data-use]");
      if (sp) {
        var p = sp.getAttribute("data-speak").split(":");
        var row = data.phrases[p[0]] && data.phrases[p[0]][+p[1]];
        if (row && g.CuLinguaTts) g.CuLinguaTts.speak(row.ar, "ar");
      }
      if (use) {
        var p2 = use.getAttribute("data-use").split(":");
        var row2 = data.phrases[p2[0]] && data.phrases[p2[0]][+p2[1]];
        if (!row2) return;
        // Prefer in-page fill if Arabic panel present; else go to Arabic studio
        if (g.CuArLinguaFill) {
          g.CuArLinguaFill(row2.en, row2.ar);
        } else {
          try {
            sessionStorage.setItem(
              "cu_hajj_to_translate",
              JSON.stringify({ en: row2.en, ar: row2.ar })
            );
          } catch (err) {}
          location.href = "/campus/lab/arabic/#ar-lingua-root";
        }
      }
    };
  }

  function renderDuas() {
    var box = el("hajj-dua-list");
    var data = g.CuLinguaHajjData;
    if (!box || !data) return;
    var duas = data.duas || [];
    box.innerHTML = duas
      .map(function (d) {
        return (
          '<div style="padding:.55rem 0;border-bottom:1px solid rgba(201,162,39,.2)">' +
          '<div class="cu-meta">' +
          esc(d.title || "") +
          "</div>" +
          '<div lang="ar" style="font-size:1.1rem">' +
          esc(d.ar || "") +
          "</div>" +
          '<div class="cu-meta">' +
          esc(d.en || "") +
          "</div></div>"
        );
      })
      .join("");
  }

  function renderRites() {
    var box = el("hajj-rite-list");
    var data = g.CuLinguaHajjData;
    if (!box || !data) return;
    var state = {};
    try {
      state = JSON.parse(localStorage.getItem(RITE_KEY) || "{}") || {};
    } catch (e) {}
    var rites = data.rites || [];
    box.innerHTML = rites
      .map(function (rite, i) {
        var id = "rite" + i;
        var title = typeof rite === "string" ? rite : rite.t || "";
        var detail = typeof rite === "string" ? "" : rite.d || "";
        var on = !!state[id];
        return (
          '<label style="display:flex;gap:.5rem;align-items:flex-start;padding:.45rem 0;border-bottom:1px solid rgba(201,162,39,.15)">' +
          '<input type="checkbox" data-rite="' +
          id +
          '" ' +
          (on ? "checked" : "") +
          " style=\"margin-top:.2rem\"/>" +
          "<span><strong>" +
          esc(title) +
          "</strong>" +
          (detail
            ? '<span class="cu-meta" style="display:block">' +
              esc(detail) +
              "</span>"
            : "") +
          "</span></label>"
        );
      })
      .join("");
    box.querySelectorAll("[data-rite]").forEach(function (c) {
      c.addEventListener("change", function () {
        var st = {};
        box.querySelectorAll("[data-rite]").forEach(function (x) {
          st[x.getAttribute("data-rite")] = x.checked;
        });
        try {
          localStorage.setItem(RITE_KEY, JSON.stringify(st));
        } catch (e) {}
      });
    });
  }

  function boot() {
    mount();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
