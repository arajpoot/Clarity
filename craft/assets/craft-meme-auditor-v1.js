/*! craft-meme-auditor-v1 · C19MEME12
 * Focal observant · real-time gate for Craft Meme before paint/publish
 * Checks: text integrity · ref match · translation alignment · scenery-only BG
 * Educational only — NOT a fatwa · NOT a substitute for qualified scholarship
 *
 * Research notes (method inspiration, not dependency):
 * - IslamicEval-style citation verification (span + authenticity)
 * - Quran-validator style exact/normalized match before free translate
 * - Scenery-only BG policy already on bench
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_AUDITOR_V1__) return;
  w.__CRAFT_MEME_AUDITOR_V1__ = true;

  /* Curated educational Urdu for known RRRA lines — prevents free-API mismatch */
  var URDU_BANK = {
    "2:152": "پس تم مجھے یاد کرو، میں تمہیں یاد رکھوں گا۔",
    "13:28": "سن لو! اللہ کی یاد ہی سے دلوں کو اطمینان حاصل ہوتا ہے۔",
    "51:55": "اور نصیحت کرتے رہو، کیونکہ نصیحت ایمان والوں کو نفع دیتی ہے۔",
    "59:18": "اے ایمان والو! اللہ سے ڈرو۔",
    "3:185": "ہر جان کو موت کا مزا چکھنا ہے۔",
    "23:115": "کیا تم نے یہ سمجھا کہ ہم نے تمہیں بے مقصد پیدا کیا؟",
    "55:26": "ہر وہ چیز جو زمین پر ہے فنا ہونے والی ہے۔",
    "2:281": "اور اس دن سے ڈرو جس میں تم اللہ کی طرف لوٹائے جاؤ گے۔",
    "2:156": "بیشک ہم اللہ ہی کے ہیں اور ہمیں اسی کی طرف لوٹنا ہے۔",
    "3:190": "بیشک آسمانوں اور زمین کی پیدائش میں نشانیاں ہیں۔",
    "51:21": "اور خود تمہارے اپنے نفسوں میں بھی؛ کیا تم دیکھتے نہیں؟",
    "2:219": "تاکہ تم غور و فکر کرو۔",
    "11:88": "اور میری توفیق صرف اللہ ہی سے ہے۔",
    "9:105": "اور کہہ دو: عمل کرو، پس عنقریب اللہ تمہارے عمل کو دیکھے گا۔",
    "2:148": "پس نیکیوں میں ایک دوسرے سے آگے بڑھو۔",
    "2:153": "بیشک اللہ صبر کرنے والوں کے ساتھ ہے۔",
    "5:2": "اور نیکی اور تقویٰ پر ایک دوسرے کی مدد کرو۔"
  };

  var BAD_BG = /\b(portrait|people|person|woman|man|girl|boy|face|selfie|fashion|nude|bikini|party|crowd|child|baby|lingerie|alcohol|wine|beer|idol|statue|gambling|casino|porn|music video|dance party)\b/i;
  var OK_BG = /\b(nature|landscape|mountain|sky|cloud|forest|tree|flower|garden|water|sea|ocean|river|lake|desert|sunrise|architecture|pattern|geometry|tile|mosque|ornament|arabesque|sand|wave|field)\b/i;

  var lastReport = null;

  function $(id) { return d.getElementById(id); }

  function normalizeRef(ref) {
    if (!ref) return "";
    var m = String(ref).match(/(\d{1,3})\s*[:：]\s*(\d{1,3})/);
    return m ? m[1] + ":" + m[2] : "";
  }

  function getLayers() {
    var L = w.__memeLayers || {};
    if (!L.ar && !L.en) {
      try {
        if (w.craftMemeParseLayers) {
          var raw = "";
          var card = $("craft-verse-card");
          if (card) raw = card.textContent || "";
          if (!raw) {
            var x = $("x-draft");
            if (x) raw = x.value || "";
          }
          L = Object.assign({}, L, w.craftMemeParseLayers(raw) || {});
        }
      } catch (e) {}
    }
    return {
      ar: String(L.ar || "").trim(),
      en: String(L.en || "").trim(),
      ur: String(L.ur || "").trim(),
      ref: String(L.ref || "").trim()
    };
  }

  function curatedUrdu(ref, en) {
    var key = normalizeRef(ref);
    if (key && URDU_BANK[key]) return URDU_BANK[key];
    /* soft keyword map if ref missing but English known */
    var e = String(en || "").toLowerCase();
    if (/remembrance of allah.*hearts find rest|hearts are assured|hearts find rest/.test(e)) return URDU_BANK["13:28"];
    if (/remember me.*i will remember/.test(e)) return URDU_BANK["2:152"];
    if (/remind.*benefits the believers/.test(e)) return URDU_BANK["51:55"];
    if (/every soul will taste death/.test(e)) return URDU_BANK["3:185"];
    if (/do \[as you will\].*see your deeds|do as you will.*allah will see/.test(e)) return URDU_BANK["9:105"];
    return "";
  }

  function translationAligned(ur, ref, en) {
    if (!ur) return { ok: true, reason: "no-urdu" };
    var key = normalizeRef(ref);
    var expected = curatedUrdu(ref, en);
    if (expected) {
      /* if free-API dumped a different known bank verse, catch it */
      var foreign = Object.keys(URDU_BANK).filter(function (k) {
        return k !== key && URDU_BANK[k] && ur.indexOf(URDU_BANK[k].slice(0, 12)) !== -1;
      });
      if (foreign.length) {
        return { ok: false, reason: "urdu-matches-other-ref:" + foreign[0], fix: expected };
      }
      /* 9:105 signature wrongly on 13:28 */
      if (/عمل کرو|اعمال کو دیکھے/.test(ur) && key === "13:28") {
        return { ok: false, reason: "urdu-9:105-on-13:28", fix: expected };
      }
      if (/اطمینان|تسکین|چین|تسلی/.test(ur) && key === "13:28") {
        return { ok: true, reason: "urdu-13:28-keywords" };
      }
    }
    /* if English is 13:28-ish but urdu is action/deeds */
    if (/hearts find rest|remembrance of allah/i.test(en) && /عمل کرو|اعمال/.test(ur)) {
      return { ok: false, reason: "urdu-theme-mismatch-rest-vs-deeds", fix: URDU_BANK["13:28"] };
    }
    return { ok: true, reason: "no-hard-conflict" };
  }

  function textIntegrity(L) {
    var issues = [];
    if (!L.ar && !L.en) issues.push({ level: "block", code: "empty-text", msg: "No Arabic or English text" });
    if (L.ar && !/[\u0600-\u06FF]/.test(L.ar)) issues.push({ level: "warn", code: "ar-script", msg: "Arabic field lacks Arabic script" });
    if (L.ref && !normalizeRef(L.ref)) issues.push({ level: "warn", code: "ref-format", msg: "Reference format unclear" });
    /* obvious non-scenery promotional spam in text */
    if (/\b(buy now|crypto pump|follow me for fortune)\b/i.test(L.en)) {
      issues.push({ level: "block", code: "promo-spam", msg: "Promotional spam in text" });
    }
    return issues;
  }

  function bgIntegrity() {
    var issues = [];
    var url = String(w.__memeBgUrl || "");
    var kind = String(w.__memeSceneKind || "");
    if (url && BAD_BG.test(url)) {
      issues.push({ level: "block", code: "bg-url-bad", msg: "Background URL flags non-scenery terms" });
    }
    if (kind && BAD_BG.test(kind) && !OK_BG.test(kind)) {
      issues.push({ level: "block", code: "bg-kind-bad", msg: "Scene kind not scenery-safe" });
    }
    return issues;
  }

  function audit(opts) {
    opts = opts || {};
    var L = getLayers();
    var issues = [];
    issues = issues.concat(textIntegrity(L));
    issues = issues.concat(bgIntegrity());

    var tr = translationAligned(L.ur, L.ref, L.en);
    if (!tr.ok) {
      issues.push({
        level: "block",
        code: "urdu-mismatch",
        msg: "Urdu does not align with verse/English (" + tr.reason + ")",
        fixUrdu: tr.fix || ""
      });
    }

    var blocks = issues.filter(function (x) { return x.level === "block"; });
    var warns = issues.filter(function (x) { return x.level === "warn"; });
    var report = {
      ok: blocks.length === 0,
      blocks: blocks,
      warns: warns,
      layers: L,
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
    var L = w.__memeLayers || getLayers();
    report.blocks.forEach(function (b) {
      if (b.code === "urdu-mismatch" && b.fixUrdu) {
        L.ur = b.fixUrdu;
        w.__memeLayers = L;
        try {
          if (w.CraftMemeSource && w.CraftMemeSource.saveState) {
            w.CraftMemeSource.saveState({ layers: L });
          }
        } catch (e) {}
      }
      if (b.code === "bg-url-bad" || b.code === "bg-kind-bad") {
        w.__memeSceneKind = "nature";
        if (typeof w.__memeOnlineFetch === "function") {
          try { w.__memeOnlineFetch("nature"); } catch (e2) {}
        }
      }
    });
  }

  function renderBadge(report) {
    var host = $("meme-audit-status") || $("meme-source-status");
    if (!host) return;
    if (report.ok) {
      host.textContent = "Auditor · PASS · " + (report.warns.length ? report.warns.length + " warn · " : "") + "educational only — not a fatwa";
      host.style.color = "";
    } else {
      host.textContent = "Auditor · BLOCK · " + report.blocks.map(function (b) { return b.code; }).join(", ") + " · auto-fix available";
    }
  }

  function gatePublish(fn) {
    return function () {
      var r = audit({ autoFix: true });
      if (!r.ok) {
        status("meme-export-status", "Publish gated · " + r.blocks[0].msg);
        status("x-status", "Auditor blocked · fix required");
        status("fb-status", "Auditor blocked · fix required");
        if (typeof w.memeDraw === "function") try { w.memeDraw(); } catch (e) {}
        return;
      }
      if (typeof fn === "function") fn.apply(this, arguments);
    };
  }

  function status(id, msg) {
    var el = $(id);
    if (el) el.textContent = msg || "";
  }

  function preferCuratedUrdu() {
    var L = getLayers();
    var u = curatedUrdu(L.ref, L.en);
    if (u) {
      L.ur = u;
      w.__memeLayers = L;
      return u;
    }
    return L.ur || "";
  }

  /* Hook free Urdu path: prefer bank; audit after */
  function installHooks() {
    var prevFetch = w.fetchUrduThenPaint;
    /* paint-standard internal is not global — override lastUrdu via layers */
    var origDraw = w.memeDraw;
    if (typeof origDraw === "function" && !origDraw._auditWrap) {
      w.memeDraw = function () {
        preferCuratedUrdu();
        audit({ autoFix: true });
        return origDraw.apply(this, arguments);
      };
      w.memeDraw._auditWrap = true;
      w.memeDraw._craftStd = true;
    }

    ["meme-post-x", "meme-post-fb", "x-open", "fb-open", "meme-export-png"].forEach(function (id) {
      var el = $(id);
      if (!el || el._auditGate) return;
      el._auditGate = true;
      el.addEventListener("click", function (e) {
        var r = audit({ autoFix: true });
        if (!r.ok) {
          e.preventDefault();
          e.stopPropagation();
          status("meme-export-status", "Auditor blocked publish · " + r.blocks[0].msg);
        }
      }, true);
    });

    var fixBtn = $("meme-audit-fix");
    if (fixBtn && !fixBtn._a) {
      fixBtn._a = true;
      fixBtn.addEventListener("click", function () {
        audit({ autoFix: true });
        if (typeof w.memeDraw === "function") w.memeDraw();
      });
    }
  }

  function injectUi() {
    if ($("meme-audit-panel")) return;
    var panel = d.createElement("div");
    panel.id = "meme-audit-panel";
    panel.className = "tool-section";
    panel.innerHTML =
      "<h2>🛡 Focal auditor · real-time</h2>" +
      '<p class="panel-note">Verifies text · reference · Urdu alignment · scenery BG before publish. ' +
      "Educational gate only — <strong>not a fatwa</strong>. Auto-fixes known translation mismatches from curated bank.</p>" +
      '<p class="panel-note" id="meme-audit-status" aria-live="polite">Auditor idle</p>' +
      '<div class="wire-actions">' +
      '<button type="button" class="btn primary" id="meme-audit-run">Run audit</button>' +
      '<button type="button" class="btn" id="meme-audit-fix">Auto-fix + re-paint</button>' +
      "</div>";
    var main = d.querySelector("main.craft-main") || d.body;
    var desks = $("desks");
    if (desks && desks.parentNode) desks.parentNode.insertBefore(panel, desks);
    else main.appendChild(panel);
    $("meme-audit-run").addEventListener("click", function () {
      var r = audit({ autoFix: false });
      status("meme-audit-status", r.ok ? "PASS · educational only" : "BLOCK · " + r.blocks.map(function (b) { return b.msg; }).join("; "));
    });
  }

  function boot() {
    injectUi();
    installHooks();
    preferCuratedUrdu();
    setTimeout(function () { audit({ autoFix: true }); }, 600);
    setTimeout(installHooks, 500);
    setTimeout(installHooks, 1500);
  }

  w.CraftMemeAuditor = {
    audit: audit,
    autoFix: autoFix,
    curatedUrdu: curatedUrdu,
    preferCuratedUrdu: preferCuratedUrdu,
    URDU_BANK: URDU_BANK,
    lastReport: function () { return lastReport; }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () { setTimeout(boot, 400); });
})(window, document);
