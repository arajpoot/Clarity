/* Lab Media / Reminder canvas — on-device PNG */
(function (g) {
  "use strict";
  if (g.__CU_LAB_MEDIA_V1__) return;
  g.__CU_LAB_MEDIA_V1__ = true;

  var PRESETS = {
    "112:1": { ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", en: "Say: He is Allah, One." },
    "112:1-4": {
      ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      en: "Say: He is Allah, One. Allah, the Self-Sufficient. He neither begets nor is begotten. And none is comparable to Him."
    },
    "103:1-3": {
      ar: "وَٱلْعَصْرِ ۝ إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ ۝ إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ",
      en: "By time, mankind is in loss — except those who believe, do righteous deeds, and counsel one another to truth and patience."
    },
    "1:1": { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", en: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    "2:255": {
      ar: "ٱللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
      en: "Allah — there is no deity except Him, the Ever-Living, the Sustainer."
    }
  };

  var BG = {
    night: ["#0c1410", "#0d4f3c"],
    gold: ["#1a1508", "#6b5420"],
    parchment: ["#e8e0d0", "#c4b89a"],
    deep: ["#061820", "#0a4a5c"]
  };

  function $(id) {
    return document.getElementById(id);
  }

  function render() {
    var c = $("media-canvas");
    if (!c || !c.getContext) return;
    var ctx = c.getContext("2d");
    var tone = ($("media-bg") && $("media-bg").value) || "night";
    var g0 = BG[tone] || BG.night;
    var grd = ctx.createLinearGradient(0, 0, 0, c.height);
    grd.addColorStop(0, g0[0]);
    grd.addColorStop(1, g0[1]);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, c.width, c.height);

    var light = tone === "parchment";
    ctx.fillStyle = light ? "rgba(28,42,34,0.9)" : "rgba(243,230,192,0.95)";
    ctx.font = "600 42px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Clarity · Reminder", c.width / 2, 120);

    var ar = ($("media-ar") && $("media-ar").value) || "";
    ctx.font = "700 64px serif";
    ctx.fillStyle = light ? "#0d4f3c" : "#f3e6c0";
    wrapText(ctx, ar, c.width / 2, 420, c.width - 120, 84);

    var en = ($("media-en") && $("media-en").value) || "";
    ctx.font = "400 36px system-ui, sans-serif";
    ctx.fillStyle = light ? "rgba(28,42,34,0.85)" : "rgba(232,240,234,0.9)";
    wrapText(ctx, en, c.width / 2, 820, c.width - 140, 48);

    ctx.font = "500 28px system-ui";
    ctx.fillStyle = light ? "rgba(28,42,34,0.55)" : "rgba(212,180,90,0.75)";
    ctx.fillText("Educational · not a fatwa", c.width / 2, c.height - 80);
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
    ["media-ar", "media-en", "media-bg"].forEach(function (id) {
      var el = $(id);
      if (el) el.addEventListener("change", render);
    });
    if ($("media-render")) $("media-render").onclick = render;
    if ($("media-download")) {
      $("media-download").onclick = function () {
        render();
        var c = $("media-canvas");
        var a = document.createElement("a");
        a.download = "clarity-reminder.png";
        a.href = c.toDataURL("image/png");
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
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
