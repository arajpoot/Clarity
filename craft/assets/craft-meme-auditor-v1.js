/*! craft-meme-auditor-v1 · C19MEME19
 * Top-notch focal auditor — verse · English · Urdu · ref · scenery
 * Cross-layer consistency: all four must point at the same ayah when known
 * Auto-fix from curated bank · publish gate
 * Educational only — NOT a fatwa · NOT scholarly certification
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_AUDITOR_V17__) return;
  w.__CRAFT_MEME_AUDITOR_V17__ = true;
  w.__CRAFT_MEME_AUDITOR_V1__ = true;

  /**
   * VERSE_BANK — educational fingerprints for RRRA lines
   * arKey: distinctive Arabic substring (normalized match)
   * enKeys: English keywords (all should loosely match for that ayah)
   * enAnti: if these dominate, it is a DIFFERENT ayah
   * ur: curated Urdu
   * urAnti: Urdu signatures of other ayahs
   */
  var VERSE_BANK = {
    "2:152": {
      arKey: "فَاذْكُرُونِي",
      enKeys: ["remember me", "i will remember"],
      enAnti: ["hearts find rest", "taste death", "see your deeds"],
      ur: "پس تم مجھے یاد کرو، میں تمہیں یاد رکھوں گا۔",
      urAnti: ["اطمینان", "عمل کرو", "موت"]
    },
    "13:28": {
      arKey: "تَطْمَئِنُّ الْقُلُوبُ",
      enKeys: ["remembrance", "hearts", "rest"],
      enAnti: ["see your deeds", "do as you will", "taste death", "race to"],
      ur: "سن لو! اللہ کی یاد ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔",
      urAnti: ["عمل کرو", "اعمال کو دیکھے", "موت کا مزا", "آگے بڑھو"]
    },
    "51:55": {
      arKey: "الذِّكْرَىٰ تَنفَعُ",
      enKeys: ["remind", "benefits", "believers"],
      enAnti: ["hearts find rest", "see your deeds"],
      ur: "اور نصیحت کرتے رہو کہ نصیحت مومنوں کو نفع دیتی ہے",
      urAnti: ["عمل کرو", "اطمینان حاصل"]
    },
    "59:18": {
      arKey: "اتَّقُوا اللَّهَ",
      enKeys: ["fear allah", "o you who believe"],
      enAnti: ["hearts find rest", "taste death"],
      ur: "اے لوگو جو ایمان لائے ہو، اللہ سے ڈرو",
      urAnti: ["عمل کرو", "اطمینان"]
    },
    "3:185": {
      arKey: "ذَائِقَةُ الْمَوْتِ",
      enKeys: ["every soul", "taste death"],
      enAnti: ["hearts find rest", "see your deeds", "remember me"],
      ur: "ہر جان کو موت کا مزا چکھنا ہے۔",
      urAnti: ["عمل کرو", "اطمینان حاصل", "یاد کرو"]
    },
    "3:185b": {
      /* second clause sometimes shown alone */
      arKey: "مَتَاعُ الْغُرُورِ",
      enKeys: ["life of this world", "deception", "enjoyment"],
      enAnti: ["hearts find rest", "see your deeds"],
      ur: "اور دنیا کی زندگی تو دھوکے کا سامان ہی ہے۔",
      urAnti: ["عمل کرو", "اطمینان"]
    },
    "23:115": {
      arKey: "خَلَقْنَاكُمْ عَبَثًا",
      enKeys: ["created you", "uselessly"],
      enAnti: ["hearts find rest"],
      ur: "کیا تم نے یہ سمجھا کہ ہم نے تمہیں بے مقصد پیدا کیا؟",
      urAnti: ["عمل کرو", "اطمینان"]
    },
    "55:26": {
      arKey: "كُلُّ مَنْ عَلَيْهَا فَانٍ",
      enKeys: ["everyone upon", "perish"],
      enAnti: ["hearts find rest"],
      ur: "ہر وہ چیز جو زمین پر ہے فنا ہونے والی ہے۔",
      urAnti: ["عمل کرو"]
    },
    "2:281": {
      arKey: "تُرْجَعُونَ فِيهِ إِلَى اللَّهِ",
      enKeys: ["returned to allah", "fear a day"],
      enAnti: ["hearts find rest"],
      ur: "اور اس دن سے ڈرو جس میں تم اللہ کی طرف لوٹائے جاؤ گے۔",
      urAnti: ["عمل کرو"]
    },
    "2:156": {
      arKey: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ",
      enKeys: ["belong to allah", "return"],
      enAnti: ["hearts find rest", "see your deeds"],
      ur: "بیشک ہم اللہ ہی کے ہیں اور ہمیں اسی کی طرف لوٹنا ہے۔",
      urAnti: ["عمل کرو"]
    },
    "3:190": {
      arKey: "خَلْقِ السَّمَاوَاتِ",
      enKeys: ["creation", "heavens", "earth", "signs"],
      enAnti: ["hearts find rest", "see your deeds"],
      ur: "بیشک آسمانوں اور زمین کی پیدائش میں نشانیاں ہیں۔",
      urAnti: ["عمل کرو"]
    },
    "51:21": {
      arKey: "وَفِي أَنفُسِكُمْ",
      enKeys: ["in yourselves", "will you not see"],
      enAnti: ["hearts find rest"],
      ur: "اور خود تمہارے اپنے نفسوں میں بھی؛ کیا تم دیکھتے نہیں؟",
      urAnti: ["عمل کرو"]
    },
    "2:219": {
      arKey: "تَتَفَكَّرُونَ",
      enKeys: ["give thought", "reflect"],
      enAnti: ["see your deeds"],
      ur: "تاکہ تم غور و فکر کرو۔",
      urAnti: ["عمل کرو"]
    },
    "11:88": {
      arKey: "تَوْفِيقِي إِلَّا بِاللَّهِ",
      enKeys: ["success", "through allah"],
      enAnti: ["hearts find rest"],
      ur: "اور میری توفیق صرف اللہ ہی سے ہے۔",
      urAnti: ["عمل کرو"]
    },
    "9:105": {
      arKey: "اعْمَلُوا فَسَيَرَى",
      enKeys: ["do", "see your deeds", "as you will"],
      enAnti: ["hearts find rest", "remembrance of allah do hearts"],
      ur: "اور کہہ دو: عمل کرو، پس عنقریب اللہ تمہارے عمل کو دیکھے گا۔",
      urAnti: ["اطمینان حاصل", "دلوں کو"]
    },
    "2:148": {
      arKey: "فَاسْتَبِقُوا الْخَيْرَاتِ",
      enKeys: ["race", "good"],
      enAnti: ["hearts find rest"],
      ur: "پس نیکیوں میں ایک دوسرے سے آگے بڑھو۔",
      urAnti: ["عمل کرو دیکھے"]
    },
    "2:153": {
      arKey: "مَعَ الصَّابِرِينَ",
      enKeys: ["patient", "with the patient"],
      enAnti: ["hearts find rest"],
      ur: "بیشک اللہ صبر کرنے والوں کے ساتھ ہے۔",
      urAnti: ["عمل کرو"]
    },
    "5:2": {
      arKey: "عَلَى الْبِرِّ وَالتَّقْوَىٰ",
      enKeys: ["cooperate", "righteousness", "piety"],
      enAnti: ["hearts find rest"],
      ur: "اور نیکی اور تقویٰ پر ایک دوسرے کی مدد کرو۔",
      urAnti: ["اطمینان"]
    }
  };

  var BAD_BG = /\b(portrait|people|person|woman|man|girl|boy|face|selfie|fashion|nude|bikini|party|crowd|child|baby|cat|dog|pet|animal face|lingerie|alcohol|wine|beer|idol|statue|gambling|casino|porn|kitten|puppy)\b/i;
  var OK_BG = /\b(nature|landscape|mountain|sky|cloud|forest|tree|flower|garden|water|sea|ocean|river|lake|desert|sunrise|architecture|pattern|geometry|tile|mosque|ornament|arabesque|sand|wave|field|horizon)\b/i;

  var lastReport = null;

  function $(id) { return d.getElementById(id); }

  function normRef(ref) {
    var m = String(ref || "").match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/);
    return m ? m[1] + ":" + m[2] : "";
  }

  function stripHarokat(s) {
    return String(s || "")
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getLayers() {
    var L = Object.assign({ ar: "", en: "", ur: "", ref: "" }, w.__memeLayers || {});
    if (!L.ar && !L.en) {
      try {
        var card = $("craft-verse-card");
        var raw = (card && card.textContent) || "";
        if (!raw) {
          var x = $("x-draft");
          if (x) raw = x.value || "";
        }
        if (raw && typeof w.craftMemeParseLayers === "function") {
          L = Object.assign(L, w.craftMemeParseLayers(raw) || {});
        }
      } catch (e) {}
    }
    L.ar = String(L.ar || "").trim();
    L.en = String(L.en || "").trim();
    L.ur = String(L.ur || "").trim();
    L.ref = String(L.ref || "").trim();
    return L;
  }

  function detectRefFromArabic(ar) {
    var n = stripHarokat(ar);
    if (!n) return "";
    var hit = "";
    Object.keys(VERSE_BANK).forEach(function (k) {
      var key = stripHarokat(VERSE_BANK[k].arKey);
      if (key && n.indexOf(key) !== -1) hit = k === "3:185b" ? "3:185" : k;
    });
    return hit;
  }

  function detectRefFromEnglish(en) {
    var e = String(en || "").toLowerCase();
    if (!e) return "";
    var best = "", score = 0;
    Object.keys(VERSE_BANK).forEach(function (k) {
      var v = VERSE_BANK[k];
      var s = 0;
      (v.enKeys || []).forEach(function (kw) {
        if (e.indexOf(kw) !== -1) s += 2;
      });
      (v.enAnti || []).forEach(function (kw) {
        if (e.indexOf(kw) !== -1) s -= 3;
      });
      if (s > score) {
        score = s;
        best = k === "3:185b" ? "3:185" : k;
      }
    });
    return score >= 2 ? best : "";
  }

  function detectRefFromUrdu(ur) {
    var u = String(ur || "");
    if (!u) return "";
    /* positive: which bank urdu is closest */
    var best = "", score = 0;
    Object.keys(VERSE_BANK).forEach(function (k) {
      var sample = VERSE_BANK[k].ur || "";
      if (!sample) return;
      var chunk = sample.slice(0, 18);
      if (u.indexOf(chunk) !== -1) {
        var s = 5;
        if (s > score) {
          score = s;
          best = k === "3:185b" ? "3:185" : k;
        }
      }
      /* anti signatures: if this urdu contains another ayah's anti, lower */
    });
    return score >= 5 ? best : "";
  }

  function bankEntry(ref) {
    var k = normRef(ref);
    if (VERSE_BANK[k]) return VERSE_BANK[k];
    if (k === "3:185" && VERSE_BANK["3:185"]) return VERSE_BANK["3:185"];
    return null;
  }

  function curatedUrdu(ref, en, ar) {
    return ""; /* C19MEME19: no bank Urdu */
  }

  function crossLayerAudit(L) {
    var issues = [];
    var refN = normRef(L.ref);
    var fromAr = detectRefFromArabic(L.ar);
    var fromEn = detectRefFromEnglish(L.en);
    var fromUr = detectRefFromUrdu(L.ur);

    /* Arabic vs claimed ref */
    if (L.ar && refN && fromAr && fromAr !== refN) {
      issues.push({
        level: "block",
        code: "ar-ref-mismatch",
        msg: "Arabic text matches " + fromAr + " but reference claims " + refN,
        fixRef: fromAr
      });
    }

    /* English vs claimed ref */
    if (L.en && refN && fromEn && fromEn !== refN) {
      issues.push({
        level: "block",
        code: "en-ref-mismatch",
        msg: "English meaning matches " + fromEn + " but reference claims " + refN,
        fixRef: fromEn
      });
    }

    /* Arabic vs English */
    if (fromAr && fromEn && fromAr !== fromEn) {
      issues.push({
        level: "block",
        code: "ar-en-mismatch",
        msg: "Arabic fingerprints " + fromAr + " but English fingerprints " + fromEn,
        fixRef: fromAr
      });
    }

    /* Urdu vs ref / ar / en */
    if (L.ur) {
      var entry = bankEntry(refN || fromAr || fromEn);
      if (entry) {
        (entry.urAnti || []).forEach(function (anti) {
          if (anti && L.ur.indexOf(anti) !== -1) {
            issues.push({
              level: "block",
              code: "urdu-anti-signature",
              msg: "Urdu contains signature of a different verse theme (" + anti + ")",
              fixUrdu: entry.ur,
              fixRef: refN || fromAr || fromEn
            });
          }
        });
      }
      if (fromUr && refN && fromUr !== refN) {
        issues.push({
          level: "block",
          code: "urdu-ref-mismatch",
          msg: "Urdu matches bank for " + fromUr + " but reference is " + refN,
          fixUrdu: (bankEntry(refN) || {}).ur || curatedUrdu(refN, L.en, L.ar),
          fixRef: refN
        });
      }
      if (fromUr && fromAr && fromUr !== fromAr) {
        issues.push({
          level: "block",
          code: "urdu-ar-mismatch",
          msg: "Urdu fingerprints " + fromUr + " but Arabic fingerprints " + fromAr,
          fixUrdu: (bankEntry(fromAr) || {}).ur || "",
          fixRef: fromAr
        });
      }
      if (fromUr && fromEn && fromUr !== fromEn) {
        issues.push({
          level: "block",
          code: "urdu-en-mismatch",
          msg: "Urdu fingerprints " + fromUr + " but English fingerprints " + fromEn,
          fixUrdu: (bankEntry(fromEn) || {}).ur || "",
          fixRef: fromEn
        });
      }
      /* classic 13:28 vs 9:105 mix */
      if ((refN === "13:28" || fromAr === "13:28" || fromEn === "13:28") && /عمل کرو|اعمال کو دیکھے/.test(L.ur)) {
        issues.push({
          level: "block",
          code: "urdu-9:105-on-13:28",
          msg: "Urdu is 9:105-style on a 13:28 verse",
          fixUrdu: VERSE_BANK["13:28"].ur,
          fixRef: "13:28"
        });
      }
      if ((refN === "9:105" || fromAr === "9:105") && /اطمینان|دلوں کو/.test(L.ur) && /یاد/.test(L.ur)) {
        issues.push({
          level: "block",
          code: "urdu-13:28-on-9:105",
          msg: "Urdu is 13:28-style on a 9:105 verse",
          fixUrdu: VERSE_BANK["9:105"].ur,
          fixRef: "9:105"
        });
      }
    }

    /* English anti-keywords vs ref */
    if (L.en && refN && bankEntry(refN)) {
      var en = L.en.toLowerCase();
      (bankEntry(refN).enAnti || []).forEach(function (anti) {
        if (en.indexOf(anti) !== -1 && (bankEntry(refN).enKeys || []).every(function (k) { return en.indexOf(k) === -1; })) {
          issues.push({
            level: "block",
            code: "en-anti-on-ref",
            msg: "English carries other-verse theme " + anti + " for " + refN
          });
        }
      });
    }

    return issues;
  }

  function textIntegrity(L) {
    /* flag stale bank-looking urdu when online cache has different text */

    var issues = [];
    if (!L.ar && !L.en) issues.push({ level: "block", code: "empty-text", msg: "No Arabic or English text" });
    if (L.ar && !/[\u0600-\u06FF]/.test(L.ar)) {
      issues.push({ level: "warn", code: "ar-script", msg: "Arabic field lacks Arabic script" });
    }
    if (/\b(buy now|crypto pump|follow me for fortune|click here to win)\b/i.test(L.en)) {
      issues.push({ level: "block", code: "promo-spam", msg: "Promotional spam in text" });
    }
    return issues;
  }

  function bgIntegrity() {
    var issues = [];
    var url = String(w.__memeBgUrl || "");
    var kind = String(w.__memeSceneKind || "");
    if (url && BAD_BG.test(url) && !OK_BG.test(url)) {
      issues.push({ level: "block", code: "bg-url-bad", msg: "Background URL flags non-scenery content" });
    }
    if (kind && BAD_BG.test(kind) && !OK_BG.test(kind)) {
      issues.push({ level: "block", code: "bg-kind-bad", msg: "Scene kind not scenery-safe" });
    }
    return issues;
  }

  function audit(opts) {
    opts = opts || {};
    var L = getLayers();
    var issues = []
      .concat(textIntegrity(L))
      .concat(crossLayerAudit(L))
      .concat(bgIntegrity());

    var blocks = issues.filter(function (x) { return x.level === "block"; });
    var warns = issues.filter(function (x) { return x.level === "warn"; });
    var report = {
      ok: blocks.length === 0,
      blocks: blocks,
      warns: warns,
      layers: L,
      detected: {
        fromAr: detectRefFromArabic(L.ar),
        fromEn: detectRefFromEnglish(L.en),
        fromUr: detectRefFromUrdu(L.ur),
        ref: normRef(L.ref)
      },
      ts: Date.now(),
      educational: true,
      note: "Educational gate only — not a fatwa · verify primary texts"
    };
    lastReport = report;
    w.__memeAuditReport = report;
    renderBadge(report);
    if (opts.autoFix && !report.ok) {
      autoFix(report);
      return audit({ autoFix: false });
    }
    return report;
  }

  function autoFix(report) {
    report = report || lastReport;
    if (!report) return;
    var L = Object.assign({}, w.__memeLayers || getLayers());
    var fixRef = "";
    var fixUr = "";
    report.blocks.forEach(function (b) {
      if (b.fixRef) fixRef = b.fixRef;
      if (false && b.fixUrdu) fixUr = b.fixUrdu;
    });
    if (fixRef) {
      var ent = bankEntry(fixRef);
      if (ent) {
        L.ref = "Qur'an " + fixRef;
        if (!L.ur || fixUr) L.ur = fixUr || ent.ur;
        /* if English clearly wrong, do not invent Arabic — only urdu/ref */
      }
    }
    /* C19MEME19: do not apply bank fixUrdu — trigger online fetch instead */
if (false && fixUr) L.ur = fixUr;
    if (!L.ur && w.CraftMemeUrduFetch) {
      var ref2 = normRef(L.ref) || detectRefFromArabic(L.ar) || detectRefFromEnglish(L.en);
      if (ref2) {
        try { w.CraftMemeUrduFetch.fetchUrdu(ref2).then(function(ur){ if (ur){ w.__memeLayers.ur = ur; forceRepaint(); } }); } catch (eF) {}
      }
    }
    w.__memeLayers = L;
    try {
      if (w.CraftMemeSource && w.CraftMemeSource.saveState) {
        w.CraftMemeSource.saveState({ layers: L, text: [L.ar, L.en, L.ref && "(" + L.ref + ")", "— clarity-dawah.fyi · educational only"].filter(Boolean).join("\n") });
      }
      if (w.CraftMemeSource && w.CraftMemeSource.applyToDesks) {
        var parts = [];
        if (L.ar) parts.push(L.ar);
        if (L.en) parts.push(L.en);
        if (L.ref) parts.push("(" + L.ref + ")");
        parts.push("— clarity-dawah.fyi · educational only");
        w.CraftMemeSource.applyToDesks(parts.join("\n"));
      }
    } catch (e) {}
    report.blocks.forEach(function (b) {
      if (b.code === "bg-url-bad" || b.code === "bg-kind-bad") {
        w.__memeSceneKind = "nature";
        try {
          if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch("nature");
        } catch (e2) {}
      }
    });
  }

  function renderBadge(report) {
    var host = $("meme-audit-status") || $("meme-source-status");
    if (!host) return;
    if (report.ok) {
      host.textContent =
        "Auditor · PASS" +
        (report.warns.length ? " · " + report.warns.length + " warn" : "") +
        " · educational only — not a fatwa";
    } else {
      host.textContent =
        "Auditor · BLOCK · " +
        report.blocks.map(function (b) { return b.code; }).join(", ") +
        " · auto-fix available";
    }
  }

  function forceRepaint() {
    try {
      preferCuratedUrdu();
      if (typeof w.memeDraw === "function") {
        /* avoid re-entry loops: call underlying if wrapped */
        var fn = w.memeDraw;
        if (fn._origDraw) fn._origDraw();
        else fn();
      }
    } catch (e) {}
  }

  function status(id, msg) {
    var el = $(id);
    if (el) el.textContent = msg || "";
  }

  function preferCuratedUrdu() {
    if (w.CraftMemeUrduFetch && typeof w.CraftMemeUrduFetch.loadForCurrentLayers === "function") {
      var L = getLayers();
      var ref = "";
      try { ref = w.CraftMemeUrduFetch.resolveRef(L); } catch (e) {}
      if (ref && w.CraftMemeUrduFetch.cache && w.CraftMemeUrduFetch.cache[ref]) {
        L.ur = w.CraftMemeUrduFetch.cache[ref];
        w.__memeLayers = L;
        return L.ur;
      }
      try { w.CraftMemeUrduFetch.loadForCurrentLayers(true); } catch (e2) {}
      return (w.__memeLayers && w.__memeLayers.ur) || "";
    }
    return "";
  }
  function preferCuratedUrdu_DISABLED_BANK() {
    var L = getLayers();
    var ref = normRef(L.ref) || detectRefFromArabic(L.ar) || detectRefFromEnglish(L.en);
    /* Never leave a foreign-bank Urdu on the wrong ref */
    if (L.ur && ref) {
      var fromU = detectRefFromUrdu(L.ur);
      if (fromU && fromU !== ref) {
        L.ur = "";
        w.__memeLayers = L;
      }
    }
    /* Sync API fetch when available (async); bank only if cache already has it */
    if (ref && w.CraftMemeUrduFetch) {
      var cached = w.CraftMemeUrduFetch.cache && w.CraftMemeUrduFetch.cache[ref];
      if (cached) {
        L.ur = cached;
        w.__memeLayers = L;
        return cached;
      }
      /* kick async load; paint will refresh when ready */
      try {
        w.CraftMemeUrduFetch.fetchUrdu(ref).then(function (ur) {
          if (!ur) return;
          if (!w.__memeLayers) w.__memeLayers = {};
          w.__memeLayers.ur = ur;
          if (typeof w.memeDraw === "function") {
            try {
              if (w.memeDraw._origDraw) w.memeDraw._origDraw();
              else w.memeDraw();
            } catch (e0) {}
          }
        });
      } catch (e1) {}
    }
    var u = curatedUrdu(ref || L.ref, L.en, L.ar);
    if (u && !L.ur) {
      L.ur = u;
      w.__memeLayers = L;
      return u;
    }
    return L.ur || u || "";
  }

  function installHooks() {
    var origDraw = w.memeDraw;
    if (typeof origDraw === "function" && !origDraw._auditWrap14) {
      function wrappedDraw() {
        preferCuratedUrdu();
        var r = audit({ autoFix: true });
        /* layers may have been fixed — paint with latest */
        return origDraw.apply(this, arguments);
      }
      wrappedDraw._origDraw = origDraw;
      wrappedDraw._auditWrap14 = true;
      wrappedDraw._craftStd = true;
      w.memeDraw = wrappedDraw;
    }
    ["meme-post-x", "meme-post-fb", "x-open", "fb-open", "meme-export-png"].forEach(function (id) {
      var el = $(id);
      if (!el || el._auditGate13) return;
      el._auditGate13 = true;
      el.addEventListener(
        "click",
        function (e) {
          var r = audit({ autoFix: true });
          if (!r.ok) {
            e.preventDefault();
            e.stopPropagation();
            status("meme-export-status", "Auditor blocked · " + r.blocks[0].msg);
          } else if (typeof w.memeDraw === "function") {
            try { w.memeDraw(); } catch (err) {}
          }
        },
        true
      );
    });
  }

  function injectUi() {
    var panel = $("meme-audit-panel");
    if (!panel) {
      panel = d.createElement("div");
      panel.id = "meme-audit-panel";
      panel.className = "tool-section";
      var main = d.querySelector("main.craft-main") || d.body;
      var canvasSec = $("meme-canvas-section") || ($("meme-canvas") && $("meme-canvas").closest("section"));
      var layersSec = $("meme-layers-section");
      if (canvasSec && canvasSec.parentNode) {
        if (canvasSec.nextSibling) canvasSec.parentNode.insertBefore(panel, canvasSec.nextSibling);
        else canvasSec.parentNode.appendChild(panel);
      } else if (layersSec && layersSec.parentNode) {
        layersSec.parentNode.insertBefore(panel, layersSec);
      } else {
        var desks = $("desks");
        if (desks && desks.parentNode) desks.parentNode.insertBefore(panel, desks);
        else main.appendChild(panel);
      }
    }
    panel.innerHTML =
      "<h2>🛡 Focal auditor · top-notch</h2>" +
      '<p class="panel-note">Cross-checks <strong>Arabic · English · Urdu · reference</strong> against a curated verse bank, ' +
      "and scenery-only backgrounds. Urdu from <strong>alquran.cloud</strong> (authentic editions) · bank fallback only · audit before every paint. " +
      "<strong>Educational only — not a fatwa.</strong></p>" +
      '<p class="panel-note" id="meme-audit-status" aria-live="polite">Auditor idle</p>' +
      '<div class="wire-actions">' +
      '<button type="button" class="btn primary" id="meme-audit-run">Run audit</button>' +
      '<button type="button" class="btn" id="meme-audit-fix">Auto-fix + re-paint</button>' +
      '<button type="button" class="btn" id="meme-audit-override">Override · re-audit pass</button>' +
      "</div>";
    var run = $("meme-audit-run");
    if (run && !run._a13) {
      run._a13 = true;
      run.addEventListener("click", function () {
        var r = audit({ autoFix: false });
        status(
          "meme-audit-status",
          r.ok
            ? "PASS · det " + JSON.stringify(r.detected) + " · educational only"
            : "BLOCK · " + r.blocks.map(function (b) { return b.msg; }).join(" · ")
        );
      });
    }
    var fix = $("meme-audit-fix");
    if (fix && !fix._a14) {
      fix._a14 = true;
      fix.addEventListener("click", function () {
        var r = audit({ autoFix: true });
        forceRepaint();
        setTimeout(forceRepaint, 150);
        status("meme-audit-status", r.ok ? "Fixed + painted · educational only" : "BLOCK remains · " + (r.blocks[0] && r.blocks[0].msg));
      });
    }
    var ov = $("meme-audit-override");
    if (ov && !ov._a14) {
      ov._a14 = true;
      ov.addEventListener("click", function () {
        /* force full re-audit even if last was PASS; still auto-fix issues */
        lastReport = null;
        preferCuratedUrdu();
        var r = audit({ autoFix: true });
        forceRepaint();
        setTimeout(forceRepaint, 150);
        status(
          "meme-audit-status",
          (r.ok ? "Override re-audit · PASS" : "Override re-audit · BLOCK · " + r.blocks.map(function(b){return b.code;}).join(", ")) +
            " · educational only — not a fatwa"
        );
      });
    }
  }

  function boot() {
    injectUi();
    installHooks();
    preferCuratedUrdu();
    setTimeout(function () { audit({ autoFix: true }); }, 500);
    setTimeout(installHooks, 400);
    setTimeout(installHooks, 1400);
  }

  w.CraftMemeAuditor = {
    audit: audit,
    autoFix: autoFix,
    curatedUrdu: curatedUrdu,
    preferCuratedUrdu: preferCuratedUrdu,
    detectRefFromArabic: detectRefFromArabic,
    detectRefFromEnglish: detectRefFromEnglish,
    detectRefFromUrdu: detectRefFromUrdu,
    VERSE_BANK: VERSE_BANK,
    lastReport: function () { return lastReport; }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 350); });
})(window, document);
