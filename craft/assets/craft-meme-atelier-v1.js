/*! craft-meme-atelier-v1 · C18R1
 * Self-contained Craft Meme Studio (Campus standard).
 * Owns: section packs · canvas · scenery library · ratio · export · desks fill.
 * NO MediaReminder host · NO companion-inline · NO Companion shell boot.
 * Inbound only: optional window.clarityMemePush / CraftMemeInbound for Companion feed.
 * G1: remote BG URLs → clarityShariahScanUrl (fail closed if missing).
 * Educational only — not a fatwa · sources not free-type revelation.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_ATELIER_C18R1__) return;
  w.__CRAFT_MEME_ATELIER_C18R1__ = true;

  var KEY = "clarity.craft.meme.atelier.v1";
  var bgImage = null;
  var proceduralKind = null;
  var ratioKey = "16:9";
  var DIMS = { "1:1": [1080, 1080], "16:9": [1200, 675], "4:5": [1080, 1350], twitter: [1200, 675], facebook: [1200, 630] };
  var lastLine = { ar: "", en: "", ref: "" };

  var SECTIONS = {
    reminder: {
      label: "Reminder",
      lines: [
        { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur’an 2:152" },
        { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur’an 13:28" },
        { ar: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ", en: "And remind, for reminder benefits the believers.", ref: "Qur’an 51:55" }
      ]
    },
    reality: {
      label: "Reality",
      lines: [
        { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur’an 3:185" },
        { ar: "وَاتَّقُوا يَوْمًا تُرْجَعُونَ فِيهِ إِلَى اللَّهِ", en: "And fear a Day when you will be returned to Allah.", ref: "Qur’an 2:281" }
      ]
    },
    reflection: {
      label: "Reflection",
      lines: [
        { ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", en: "Indeed, with hardship comes ease.", ref: "Qur’an 94:6" },
        { ar: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", en: "And He is with you wherever you are.", ref: "Qur’an 57:4" }
      ]
    },
    action: {
      label: "Action",
      lines: [
        { ar: "وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ", en: "And say, “Do [as you will], for Allah will see your deeds.”", ref: "Qur’an 9:105" },
        { ar: "فَاسْتَبِقُوا الْخَيْرَاتِ", en: "So race to [all that is] good.", ref: "Qur’an 2:148" }
      ]
    }
  };

  var W = function (path) {
    return "https://upload.wikimedia.org/wikipedia/commons/" + path;
  };
  var SCENES = {
    holy: [
      W("thumb/6/67/Kaaba_Masjid_Haraam_Makkah.jpg/1280px-Kaaba_Masjid_Haraam_Makkah.jpg"),
      W("thumb/c/c8/Masjid_al-Haram%2C_Mecca.jpg/1280px-Masjid_al-Haram%2C_Mecca.jpg")
    ],
    nature: [W("thumb/6/6d/Desert_in_Qatar.jpg/1280px-Desert_in_Qatar.jpg")],
    night: [W("thumb/8/80/Milky_Way_Arch.jpg/1280px-Milky_Way_Arch.jpg")],
    water: [W("thumb/0/0c/Calm_sea.jpg/1280px-Calm_sea.jpg")],
    flowers: [], /* offline gold */
    flickr: [],
    blank: []
  };

  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }
  function scan(url) {
    if (!url) return true;
    if (typeof w.clarityShariahScanUrl !== "function") {
      status("Shariah scan unavailable — refusing remote BG");
      return false;
    }
    var r = w.clarityShariahScanUrl(url, "atelier");
    if (!r.ok) {
      status("Skipped (" + (r.reason || "blocked") + ")");
      return false;
    }
    return true;
  }

  function canvas() {
    return $("craft-meme-canvas");
  }

  function paintProcedural(ctx, cw, ch, kind) {
    kind = kind || "emerald";
    if (kind === "night") {
      var g = ctx.createLinearGradient(0, 0, 0, ch);
      g.addColorStop(0, "#020617");
      g.addColorStop(1, "#1e293b");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "rgba(248,250,252,0.9)";
      for (var i = 0; i < 36; i++) {
        ctx.beginPath();
        ctx.arc((i * 97) % cw, (i * 53) % (ch * 0.5), (i % 3) + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    if (kind === "gold") {
      var g2 = ctx.createLinearGradient(0, 0, cw, ch);
      g2.addColorStop(0, "#0b1f18");
      g2.addColorStop(0.5, "#14532d");
      g2.addColorStop(0.55, "#854d0e");
      g2.addColorStop(1, "#0b1f18");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, cw, ch);
      return;
    }
    var g0 = ctx.createLinearGradient(0, 0, cw, ch);
    g0.addColorStop(0, "#064e3b");
    g0.addColorStop(1, "#0b1f18");
    ctx.fillStyle = g0;
    ctx.fillRect(0, 0, cw, ch);
  }

  function bodyText() {
    var parts = [];
    if (lastLine.ar) parts.push(lastLine.ar);
    if (lastLine.en) parts.push(lastLine.en);
    return parts.join("\n");
  }

  function paint() {
    var c = canvas();
    if (!c) return;
    var dims = DIMS[ratioKey] || DIMS["16:9"];
    if (c.width !== dims[0] || c.height !== dims[1]) {
      c.width = dims[0];
      c.height = dims[1];
    }
    var ctx = c.getContext("2d");
    if (!ctx) return;
    var cw = c.width, ch = c.height;
    ctx.fillStyle = "#0b1f18";
    ctx.fillRect(0, 0, cw, ch);

    if (bgImage) {
      try {
        var ir = bgImage.width / Math.max(1, bgImage.height);
        var cr = cw / ch;
        var dw, dh, dx, dy;
        if (ir > cr) {
          dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0;
        } else {
          dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2;
        }
        ctx.drawImage(bgImage, dx, dy, dw, dh);
      } catch (e) {
        paintProcedural(ctx, cw, ch, "emerald");
      }
    } else if (proceduralKind) {
      paintProcedural(ctx, cw, ch, proceduralKind);
    }

    var body = bodyText();
    var src = lastLine.ref || "";
    if (body) {
      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.fillRect(0, ch * 0.28, cw, ch * 0.46);
      ctx.fillStyle = "#f3e6c0";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      var lines = body.split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 6);
      var fontSize = Math.min(44, Math.floor(ch * 0.075));
      var maxW = cw - 96;
      function fits(sz) {
        ctx.font = "600 " + sz + "px Amiri, serif";
        return lines.every(function (ln) { return ctx.measureText(ln).width <= maxW; });
      }
      while (fontSize > 16 && !fits(fontSize)) fontSize -= 2;
      ctx.font = "600 " + fontSize + "px Amiri, serif";
      var lineH = fontSize * 1.35;
      var startY = ch * 0.42 - ((lines.length - 1) * lineH) / 2;
      lines.forEach(function (ln, i) {
        ctx.fillText(ln.slice(0, 120), cw / 2, startY + i * lineH);
      });
      if (src) {
        ctx.fillStyle = "rgba(224,197,106,0.95)";
        ctx.font = "500 " + Math.max(14, Math.floor(fontSize * 0.42)) + "px Quicksand, system-ui, sans-serif";
        ctx.fillText(src.slice(0, 90), cw / 2, ch - 48);
      }
      ctx.fillStyle = "rgba(243,230,192,0.55)";
      ctx.font = "12px Quicksand, system-ui, sans-serif";
      ctx.fillText("clarity-dawah.fyi · Craft · educational", cw / 2, ch - 24);
    }

    syncDesks();
    syncCard();
  }

  function syncCard() {
    var card = $("craft-verse-card");
    if (!card) return;
    card.textContent = [lastLine.ar, lastLine.en, lastLine.ref].filter(Boolean).join("\n");
  }

  function syncDesks() {
    var text = bodyText();
    var ref = lastLine.ref || "";
    var x = $("desk-x-text") || $("x-desk-text") || d.querySelector("[data-desk='x'] textarea, #x-copy-text");
    var fb = $("desk-fb-text") || $("fb-desk-text") || d.querySelector("[data-desk='fb'] textarea, #fb-copy-text");
    var payload = text + (ref ? "\n\n" + ref : "") + "\n\n— clarity-dawah.fyi · educational";
    if (x) x.value = payload.slice(0, 280);
    if (fb) fb.value = payload;
    var xc = $("x-char-count");
    if (xc && x) xc.textContent = (x.value || "").length + " / 280";
  }

  function setLine(line) {
    lastLine = {
      ar: (line && line.ar) || "",
      en: (line && line.en) || "",
      ref: (line && line.ref) || ""
    };
    paint();
  }

  function pickSection(id) {
    var pack = SECTIONS[id] || SECTIONS.reminder;
    var line = pack.lines[Math.floor(Math.random() * pack.lines.length)];
    setLine(line);
    status("Section · " + (pack.label || id) + " · sourced line");
    try {
      localStorage.setItem(KEY, JSON.stringify({ section: id, line: lastLine }));
    } catch (e) {}
  }

  function loadBg(kind) {
    kind = String(kind || "blank").toLowerCase();
    proceduralKind = null;
    bgImage = null;
    if (kind === "blank") {
      paint();
      status("Background: solid");
      return;
    }
    var urls = SCENES[kind] || SCENES.nature || [];
    if (!urls.length) {
      proceduralKind = kind === "night" ? "night" : kind === "holy" ? "gold" : "emerald";
      paint();
      status("Background: offline · " + proceduralKind);
      return;
    }
    var url = urls[Math.floor(Math.random() * urls.length)];
    if (!scan(url)) {
      proceduralKind = "emerald";
      paint();
      status("Scan blocked · offline emerald");
      return;
    }
    status("Loading scenery…");
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      bgImage = img;
      paint();
      status("Background: " + kind + " · painted · scanned");
    };
    img.onerror = function () {
      proceduralKind = kind === "night" ? "night" : "emerald";
      paint();
      status("Fetch failed · offline fallback");
    };
    img.src = url;
  }

  function applyRatio(r) {
    ratioKey = r || "16:9";
    var st = $("meme-ratio-status");
    if (st) st.textContent = "Ratio · " + ratioKey;
    paint();
  }

  function exportPng() {
    var c = canvas();
    if (!c) return;
    try {
      var a = d.createElement("a");
      a.href = c.toDataURL("image/png");
      a.download = "clarity-craft-meme-" + Date.now() + ".png";
      a.click();
      status("PNG downloaded · educational only");
    } catch (e) {
      alert("Export failed.");
    }
  }

  /* ——— Inbound only from Companion (optional) ——— */
  function inbound(ar, en, ref) {
    setLine({ ar: ar || "", en: en || "", ref: ref || "" });
    status("Inbound feed · Companion line applied");
  }
  w.clarityMemePush = function (ar, en, ref) { inbound(ar, en, ref); };
  w.CraftMemeInbound = { push: inbound };
  /* Prefer local packs; still allow CraftMemeSource if present as extra lines only */
  function sectionClick(id) {
    if (w.CraftMemeSource && typeof w.CraftMemeSource.fetchSection === "function") {
      try {
        var line = w.CraftMemeSource.fetchSection(id);
        if (line && (line.ar || line.en)) {
          setLine(line);
          status("Section · " + id + " · Craft source pack");
          return;
        }
      } catch (e) {}
    }
    pickSection(id);
  }

  function bind() {
    d.querySelectorAll("[data-meme-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-section]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        sectionClick(btn.getAttribute("data-meme-section") || "reminder");
      });
    });
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-bg]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        loadBg(btn.getAttribute("data-meme-bg"));
      });
    });
    d.querySelectorAll("[data-meme-ratio]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        d.querySelectorAll("[data-meme-ratio]").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        applyRatio(btn.getAttribute("data-meme-ratio"));
      });
    });
    var exp = $("meme-export-png");
    if (exp) exp.addEventListener("click", exportPng);
    var next = $("meme-next-bg");
    if (next) next.addEventListener("click", function () {
      var a = d.querySelector("[data-meme-bg].active");
      loadBg((a && a.getAttribute("data-meme-bg")) || "nature");
    });
    var scale = $("meme-auto-scale");
    if (scale) scale.addEventListener("click", function () {
      paint();
      status("Text fit to canvas");
    });
    var prev = $("meme-wire-preview");
    if (prev) prev.addEventListener("click", paint);

    /* restore last line */
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.line) setLine(data.line);
      }
    } catch (e) {}
    if (!lastLine.ar && !lastLine.en) pickSection("reminder");
    else paint();
    status("Craft Atelier ready · self-contained");
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bind);
  else bind();

  w.CraftMemeAtelier = {
    version: "C18R1",
    paint: paint,
    setLine: setLine,
    loadBg: loadBg,
    exportPng: exportPng
  };
})(window, document);
