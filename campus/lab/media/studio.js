/* Lab Media v2 — companion-style bg rail, scale, scenery-only online fetch
 * Scenery/nature/architecture only — educational daʿwah craft.
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_MEDIA_V2__) return;
  g.__CU_LAB_MEDIA_V2__ = true;

  var PRESETS = {
    "112:1": { ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", en: "Say: He is Allah, One." },
    "112:1-4": {
      ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      en: "Say: He is Allah, One. Allah, the Self-Sufficient. He neither begets nor is begotten. And none is comparable to Him."
    },
    "103:1-3": {
      ar: "وَٱلْعَصْرِ ۝ إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ",
      en: "By time, mankind is in loss — except those who believe and do good."
    },
    "1:1": { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    "2:255": { ar: "ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", en: "Allah — there is no deity except Him, the Ever-Living, the Sustainer." }
  };

  var RATIOS = {
    story: [1080, 1920],
    square: [1080, 1080],
    landscape: [1200, 675],
    portrait: [1080, 1350]
  };

  var state = {
    bgKind: "night",
    bgImg: null,
    ratio: "portrait",
    sizeAr: 64,
    sizeEn: 36,
    status: ""
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setStatus(t) {
    state.status = t || "";
    var el = $("media-fetch-status");
    if (el) el.textContent = state.status;
  }

  /** Scenery-only URL builders (no people search terms) */
  function sceneryUrl(kind) {
    var seed = Date.now() % 10000;
    var map = {
      nature: "nature,forest,landscape,mountains",
      flowers: "flowers,garden,blossom",
      holy: "mosque,architecture,islamic,geometry",
      night: "night,sky,stars,milky",
      water: "ocean,water,river,lake",
      spirit: "sunrise,mist,clouds,sky",
      free: "landscape,architecture,nature"
    };
    var q = map[kind] || map.nature;
    /* loremflickr — keyword filtered stock-style photos */
    return "https://loremflickr.com/1200/1500/" + encodeURIComponent(q.replace(/\s/g, ",")) + "?lock=" + seed;
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function () {
        resolve(img);
      };
      img.onerror = function () {
        reject(new Error("img"));
      };
      img.src = url;
    });
  }

  function fetchBg(kind) {
    setStatus("Fetching scenery…");
    var url = sceneryUrl(kind);
    loadImage(url)
      .then(function (img) {
        state.bgImg = img;
        state.bgKind = kind;
        setStatus("Scenery ready · " + kind);
        render();
      })
      .catch(function () {
        /* fallback gradient only */
        state.bgImg = null;
        state.bgKind = kind;
        setStatus("Offline gradient · " + kind);
        render();
      });
  }

  function gradientFor(kind, ctx, w, h) {
    var pairs = {
      night: ["#0c1410", "#0d4f3c"],
      gold: ["#1a1508", "#6b5420"],
      parchment: ["#e8e0d0", "#c4b89a"],
      deep: ["#061820", "#0a4a5c"],
      nature: ["#0d2818", "#1e7d5e"],
      flowers: ["#2a1520", "#8b4557"],
      holy: ["#1a2030", "#3d5a80"],
      water: ["#0a2438", "#1a6b8a"],
      spirit: ["#2a2010", "#c9a352"],
      free: ["#152019", "#1e7d5e"]
    };
    var g0 = pairs[kind] || pairs.night;
    var grd = ctx.createLinearGradient(0, 0, 0, h);
    grd.addColorStop(0, g0[0]);
    grd.addColorStop(1, g0[1]);
    return grd;
  }

  function render() {
    var c = $("media-canvas");
    if (!c || !c.getContext) return;
    var dim = RATIOS[state.ratio] || RATIOS.portrait;
    if (c.width !== dim[0] || c.height !== dim[1]) {
      c.width = dim[0];
      c.height = dim[1];
    }
    var ctx = c.getContext("2d");
    var w = c.width;
    var h = c.height;

    if (state.bgImg) {
      try {
        /* cover */
        var iw = state.bgImg.width;
        var ih = state.bgImg.height;
        var scale = Math.max(w / iw, h / ih);
        var sw = iw * scale;
        var sh = ih * scale;
        ctx.drawImage(state.bgImg, (w - sw) / 2, (h - sh) / 2, sw, sh);
        ctx.fillStyle = "rgba(0,0,0,0.42)";
        ctx.fillRect(0, 0, w, h);
      } catch (e) {
        ctx.fillStyle = gradientFor(state.bgKind, ctx, w, h);
        ctx.fillRect(0, 0, w, h);
      }
    } else {
      ctx.fillStyle = gradientFor(state.bgKind, ctx, w, h);
      ctx.fillRect(0, 0, w, h);
    }

    var light = state.bgKind === "parchment";
    ctx.textAlign = "center";
    ctx.fillStyle = light ? "rgba(28,42,34,0.9)" : "rgba(243,230,192,0.95)";
    ctx.font = "600 36px Plus Jakarta Sans, Georgia, serif";
    ctx.fillText("Clarity · Reminder", w / 2, Math.round(h * 0.1));

    var ar = ($("media-ar") && $("media-ar").value) || "";
    ctx.fillStyle = light ? "#0d4f3c" : "#f3e6c0";
    ctx.font = "700 " + state.sizeAr + "px serif";
    wrapText(ctx, ar, w / 2, Math.round(h * 0.38), w - 120, Math.round(state.sizeAr * 1.35));

    var en = ($("media-en") && $("media-en").value) || "";
    ctx.fillStyle = light ? "rgba(28,42,34,0.88)" : "rgba(232,240,234,0.92)";
    ctx.font = "500 " + state.sizeEn + "px Plus Jakarta Sans, system-ui, sans-serif";
    wrapText(ctx, en, w / 2, Math.round(h * 0.68), w - 140, Math.round(state.sizeEn * 1.4));

    ctx.font = "500 26px system-ui";
    ctx.fillStyle = light ? "rgba(28,42,34,0.5)" : "rgba(212,180,90,0.75)";
    ctx.fillText("Educational · not a fatwa", w / 2, h - 64);
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    var words = String(text).split(/\s+/);
    var line = "";
    var yy = y;
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, yy);
        line = words[i];
        yy += lineH;
      } else line = test;
    }
    if (line) ctx.fillText(line, x, yy);
  }

  function boot() {
    var root = $("media-studio-root") || document.querySelector(".media-studio");
    if (!root) return;

    /* inject rails if missing */
    if (!$("media-bg-rail")) {
      var rail = document.createElement("div");
      rail.id = "media-bg-rail";
      rail.className = "media-chip-rail";
      rail.innerHTML =
        '<div class="media-tool-label">Background · scenery only</div>' +
        '<div class="media-chip-row">' +
        '<button type="button" class="mv-chip" data-bg="nature">🌿 Nature</button>' +
        '<button type="button" class="mv-chip" data-bg="flowers">🌸 Flowers</button>' +
        '<button type="button" class="mv-chip" data-bg="holy">🕌 Holy</button>' +
        '<button type="button" class="mv-chip" data-bg="night">🌙 Night</button>' +
        '<button type="button" class="mv-chip" data-bg="water">💧 Water</button>' +
        '<button type="button" class="mv-chip" data-bg="spirit">✨ Spirit</button>' +
        '<button type="button" class="mv-chip" data-bg="free">📷 Free</button>' +
        '<button type="button" class="mv-chip" data-bg="parchment">⬛ Blank</button>' +
        "</div>" +
        '<p id="media-fetch-status" class="lab-micro"></p>';
      root.insertBefore(rail, root.firstChild);
    }
    if (!$("media-scale-rail")) {
      var scale = document.createElement("div");
      scale.id = "media-scale-rail";
      scale.className = "media-chip-rail";
      scale.innerHTML =
        '<div class="media-tool-label">Scale · ratio</div>' +
        '<div class="media-chip-row">' +
        '<button type="button" class="mv-chip" data-ratio="portrait">Portrait</button>' +
        '<button type="button" class="mv-chip" data-ratio="square">Square</button>' +
        '<button type="button" class="mv-chip" data-ratio="landscape">Landscape</button>' +
        '<button type="button" class="mv-chip" data-ratio="story">Story</button>' +
        "</div>" +
        '<label class="media-range">Arabic <input type="range" id="media-size-ar" min="28" max="96" value="64"> <b id="media-size-ar-val">64</b></label>' +
        '<label class="media-range">English <input type="range" id="media-size-en" min="18" max="56" value="36"> <b id="media-size-en-val">36</b></label>';
      var canvas = $("media-canvas");
      if (canvas && canvas.parentNode) canvas.parentNode.insertBefore(scale, canvas);
      else root.appendChild(scale);
    }

    root.querySelectorAll("[data-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-bg");
        if (k === "parchment" || k === "gold" || k === "deep") {
          state.bgImg = null;
          state.bgKind = k;
          setStatus("Gradient · " + k);
          render();
        } else fetchBg(k);
      });
    });
    root.querySelectorAll("[data-ratio]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.ratio = btn.getAttribute("data-ratio") || "portrait";
        render();
      });
    });
    var sar = $("media-size-ar");
    var sen = $("media-size-en");
    if (sar)
      sar.addEventListener("input", function () {
        state.sizeAr = +sar.value;
        if ($("media-size-ar-val")) $("media-size-ar-val").textContent = sar.value;
        render();
      });
    if (sen)
      sen.addEventListener("input", function () {
        state.sizeEn = +sen.value;
        if ($("media-size-en-val")) $("media-size-en-val").textContent = sen.value;
        render();
      });

    var ref = $("media-ref");
    if (ref) {
      ref.addEventListener("change", function () {
        var p = PRESETS[ref.value];
        if (p) {
          if ($("media-ar")) $("media-ar").value = p.ar;
          if ($("media-en")) $("media-en").value = p.en;
        }
        render();
      });
    }
    ["media-ar", "media-en"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("input", render);
    });
    if ($("media-render")) $("media-render").onclick = render;
    if ($("media-download")) {
      $("media-download").onclick = function () {
        render();
        var a = document.createElement("a");
        a.download = "clarity-reminder.png";
        a.href = $("media-canvas").toDataURL("image/png");
        a.click();
      };
    }
    if ($("media-hear")) {
      $("media-hear").onclick = function () {
        var v = ($("media-ref") && $("media-ref").value) || "112:1";
        var m = v.match(/(\d+):(\d+)/);
        if (m && g.ClarityLabAV) g.ClarityLabAV.playMaster(+m[1], +m[2]);
      };
    }
    try {
      localStorage.setItem("clarity_lab_last_v1", String(Date.now()));
    } catch (e) {}
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
