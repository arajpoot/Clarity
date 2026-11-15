/*! companion-action-fix-v1 · honest ID wiring · mirror · search · VT status
 * Fixes mismatch: HTML uses #quran-search, wiring looked for #quran-search-input.
 * Companion-only · enrichment hold · educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ACTION_FIX_V1__) return;
  w.__COMPANION_ACTION_FIX_V1__ = true;
  var LOG = (w.__COMPANION_ACTION_FIX_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }
  function root() { return d.getElementById("cs-mount") || d; }
  function q(sel) { return root().querySelector(sel) || d.querySelector(sel); }
  function val(sels) {
    for (var i = 0; i < sels.length; i++) {
      var el = q(sels[i]);
      if (el && String(el.value || "").trim()) return String(el.value).trim();
      if (el && el.tagName === "BUTTON") continue;
    }
    // try any visible search-ish input
    var inputs = root().querySelectorAll("input[type='text'], input[type='search']");
    for (var j = 0; j < inputs.length; j++) {
      if (String(inputs[j].value || "").trim()) return String(inputs[j].value).trim();
    }
    return "";
  }
  function openSearch(base, query) {
    query = (query || "").trim();
    if (!query) query = "Allah";
    w.open(base + encodeURIComponent(query), "_blank", "noopener");
  }

  /* —— Override search tools with correct IDs —— */
  w.searchQuran = function (qtext) {
    if (typeof qtext !== "string") {
      qtext = val(["#quran-search", "#quran-search-input", "[data-quran-q]", "#cs-mount #quran-search"]);
    }
    openSearch("https://quran.com/search?q=", qtext);
    log("searchQuran:" + qtext);
  };
  w.searchHadith = function (qtext) {
    if (typeof qtext !== "string") {
      qtext = val(["#hadith-search", "#hadith-search-input", "[data-hadith-q]"]);
    }
    openSearch("https://sunnah.com/search?q=", qtext);
    log("searchHadith:" + qtext);
  };
  w.searchMasnoonDua = function (qtext) {
    if (typeof qtext !== "string") {
      qtext = val(["#dua-search", "#dua-search-input", "[data-dua-q]"]);
    }
    if (!qtext) qtext = "dua";
    openSearch("https://sunnah.com/search?q=", qtext);
    log("searchMasnoon:" + qtext);
  };
  w.searchLifeOrHadith = function (qtext) {
    if (typeof qtext !== "string") {
      qtext = val(["#life-search", "#life-search-input", "[data-life-q]"]);
    }
    openSearch("https://sunnah.com/search?q=", qtext);
    log("searchLife:" + qtext);
  };
  w.clarityClearSearch = function () {
    root().querySelectorAll("#quran-search, #hadith-search, #dua-search, #life-search, input[type='search']").forEach(function (i) {
      i.value = "";
    });
  };

  /* Theme chips → fill nearest input + search */
  function bindThemeChips() {
    root().querySelectorAll("[data-theme-q], [data-dua-theme], [data-quran-theme], [data-hadith-theme], button[data-theme]").forEach(function (btn) {
      if (btn.__chipBound) return;
      btn.__chipBound = true;
      btn.addEventListener("click", function () {
        var theme =
          btn.getAttribute("data-theme-q") ||
          btn.getAttribute("data-dua-theme") ||
          btn.getAttribute("data-quran-theme") ||
          btn.getAttribute("data-hadith-theme") ||
          btn.getAttribute("data-theme") ||
          (btn.textContent || "").replace(/^[^\w]+/, "").trim();
        var card = btn.closest(".card, section, [data-rrra], div");
        var input = card && card.querySelector("input[type='text'], input[type='search']");
        if (input) input.value = theme;
        var id = (input && input.id) || "";
        if (id.indexOf("dua") >= 0) w.searchMasnoonDua(theme);
        else if (id.indexOf("quran") >= 0) w.searchQuran(theme);
        else if (id.indexOf("hadith") >= 0) w.searchHadith(theme);
        else if (id.indexOf("life") >= 0) w.searchLifeOrHadith(theme);
        else {
          /* heuristic by section heading */
          var head = ((card && card.querySelector("h2,h3")) || {}).textContent || "";
          if (/masn|du/i.test(head)) w.searchMasnoonDua(theme);
          else if (/qur/i.test(head)) w.searchQuran(theme);
          else w.searchHadith(theme);
        }
      });
    });
    /* also plain theme buttons without data attrs — text content */
    root().querySelectorAll("button").forEach(function (btn) {
      var t = (btn.textContent || "").trim();
      if (btn.__chipBound) return;
      if (!/^(Forgiveness|Morning|Anxiety|Parents|Travel|Protection|Patience|Hope|Prayer|Gratitude|Mercy|Anger|Charity|Neighbors|Truth)/i.test(t)) return;
      if (btn.getAttribute("onclick")) return;
      btn.__chipBound = true;
      btn.addEventListener("click", function () {
        var theme = t.replace(/^[^\w]+/, "").trim();
        var card = btn.closest(".card, section, div");
        var input = card && card.querySelector("input[type='text'], input[type='search']");
        if (input) input.value = theme;
        var head = ((card && card.querySelector("h2,h3")) || {}).textContent || "";
        if (/masn|du/i.test(head)) w.searchMasnoonDua(theme);
        else if (/qur/i.test(head)) w.searchQuran(theme);
        else if (/life/i.test(head)) w.searchLifeOrHadith(theme);
        else w.searchHadith(theme);
      });
    });
  }

  /* —— Seerah Mirror (7 steps to match markup) —— */
  var MIRROR = [
    { t: "Truthfulness", m: "He ﷺ was known as al-Amīn before prophecy.", p: "Where can I tell the truth when it costs comfort?", src: "Seerah character — educational" },
    { t: "Mercy", m: "He ﷺ was gentle even when wronged.", p: "Whom can I treat more gently before night?", src: "Educational reflection" },
    { t: "Tawakkul", m: "In the cave: Allah is with us.", p: "What anxiety can I hand to Allah in duʿāʾ?", src: "Educational reflection" },
    { t: "Humility", m: "He ﷺ served his family and mended his own sandals.", p: "What small service can I do unseen?", src: "Educational reflection" },
    { t: "Justice", m: "Standing for justice even against oneself.", p: "Where must I be fair though the ego resists?", src: "Educational reflection" },
    { t: "Consistency", m: "The most beloved deeds are those done regularly.", p: "What one small deed can I keep daily?", src: "Educational reflection" },
    { t: "Courage with wisdom", m: "Speaking truth without oppression.", p: "What boundary can I keep without harshness?", src: "Educational reflection" }
  ];
  var mi = 0;
  try {
    mi = parseInt(localStorage.getItem("clarity.sm.step") || "0", 10) || 0;
  } catch (e) {}
  function paintMirror() {
    mi = ((mi % MIRROR.length) + MIRROR.length) % MIRROR.length;
    var row = MIRROR[mi];
    var map = [
      ["sm-step-label", "Step " + (mi + 1) + " of " + MIRROR.length],
      ["sm-title", row.t],
      ["sm-moment", row.m],
      ["sm-prompt", row.p],
      ["sm-src", row.src + " · not a fatwa"]
    ];
    map.forEach(function (pair) {
      var el = q("#" + pair[0]);
      if (el) el.textContent = pair[1];
    });
    var fill = q("#sm-prog-fill");
    var prog = q("#sm-progress-text");
    if (fill) fill.style.width = ((mi + 1) / MIRROR.length) * 100 + "%";
    if (prog) prog.textContent = mi + " / " + MIRROR.length + " steps on this device";
    var link = q("#sm-link");
    if (link && (!link.getAttribute("href") || link.getAttribute("href") === "#")) {
      link.setAttribute("href", "https://sunnah.com");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    }
  }
  w.claritySeerahMirrorNext = function () {
    mi = (mi + 1) % MIRROR.length;
    try { localStorage.setItem("clarity.sm.step", String(mi)); } catch (e) {}
    paintMirror();
  };
  w.claritySeerahMirrorDone = function () {
    w.claritySeerahMirrorNext();
  };
  w.claritySeerahMirrorNote = function () {
    try {
      var row = MIRROR[mi % MIRROR.length];
      var key = "cu_companion_ledger_return_v1";
      var prev = localStorage.getItem(key) || "";
      localStorage.setItem(key, prev + "\n- [mirror] " + row.t + " — " + row.p);
      var st = q("#hifz-status") || q("[data-action-status]");
      if (st) st.textContent = "Mirror note saved on-device.";
    } catch (e) {}
  };

  /* —— Voice translator: honest status without silent failure —— */
  function vtStatus(msg) {
    var el = q("#vt-status");
    if (el) el.textContent = msg || "";
  }
  if (typeof w.vtToggleRecord !== "function") {
    w.vtToggleRecord = function () {
      vtStatus("Mic needs a speech engine on this device. You can type in the input box and use Translate. Educational only.");
    };
  }
  if (typeof w.vtTranslateNow !== "function") {
    w.vtTranslateNow = function () {
      var inp = q("#vt-in");
      var out = q("#vt-out");
      var text = (inp && inp.value) || "";
      if (!text.trim()) {
        vtStatus("Enter text to translate.");
        return;
      }
      /* open a trusted external translator with user text — no fake ML */
      var from = (q("#vt-from") && q("#vt-from").value) || "en";
      var to = (q("#vt-to") && q("#vt-to").value) || "ar";
      w.open(
        "https://translate.google.com/?sl=" + encodeURIComponent(from) + "&tl=" + encodeURIComponent(to) + "&text=" + encodeURIComponent(text) + "&op=translate",
        "_blank",
        "noopener"
      );
      vtStatus("Opened translator with your text — verify meanings with a teacher. Educational only.");
    };
  }
  if (typeof w.vtClear !== "function") {
    w.vtClear = function () {
      var inp = q("#vt-in");
      var out = q("#vt-out");
      if (inp) inp.value = "";
      if (out) out.value = "";
      vtStatus("Cleared.");
    };
  }
  if (typeof w.vtCopyOut !== "function") {
    w.vtCopyOut = function () {
      var out = q("#vt-out") || q("#vt-in");
      if (out && navigator.clipboard) navigator.clipboard.writeText(out.value || "");
      vtStatus("Copied.");
    };
  }
  if (typeof w.vtSpeakOut !== "function") {
    w.vtSpeakOut = function () {
      var out = q("#vt-out") || q("#vt-in");
      var text = (out && out.value) || "";
      if (!text || !w.speechSynthesis) return;
      var u = new SpeechSynthesisUtterance(text.slice(0, 500));
      var to = (q("#vt-to") && q("#vt-to").value) || "ar";
      u.lang = to.indexOf("ar") === 0 ? "ar-SA" : "en-US";
      w.speechSynthesis.speak(u);
    };
  }
  if (typeof w.vtSwapLangs !== "function") {
    w.vtSwapLangs = function () {
      var a = q("#vt-from");
      var b = q("#vt-to");
      if (!a || !b) return;
      var t = a.value;
      a.value = b.value;
      b.value = t;
    };
  }
  if (typeof w.vtPreset !== "function") {
    w.vtPreset = function (code) {
      var a = q("#vt-from");
      var b = q("#vt-to");
      if (!a || !b) return;
      if (code === "AR-EN") { a.value = "ar"; b.value = "en"; }
      else if (code === "EN-AR") { a.value = "en"; b.value = "ar"; }
      else if (code === "EN-UR") { a.value = "en"; b.value = "ur"; }
      else if (code === "FR-AR") { a.value = "fr"; b.value = "ar"; }
    };
  }
  ["vtEnsureWhisper", "vtRefreshCacheStatus", "vtUnloadWhisper", "vtSurprise"].forEach(function (n) {
    if (typeof w[n] !== "function") {
      w[n] = function () {
        vtStatus("Optional model tools — type text and Translate works without a local model. Educational only.");
      };
    }
  });

  /* —— Studios board: ensure Craft links work —— */
  function fixStudioLinks() {
    root().querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (h === "/yawm/" || h === "/yawm") a.setAttribute("href", "/daily/");
      if (h === "/companion/#meme" || h === "#meme") a.setAttribute("href", "/craft/");
      if (h === "/companion/#callig" || h === "#callig") a.setAttribute("href", "/craft/");
    });
    /* in-page anchors that exist */
    ["#tj-deep-studio", "#hajj-guide-card", "#hifz-display", "#seerah-mirror-card"].forEach(function (hash) {
      var el = q(hash);
      if (!el) return;
      root().querySelectorAll('a[href="' + hash + '"]').forEach(function (a) {
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    });
  }

  /* Tajweed live title if empty */
  var TJ = [
    { t: "Ikhfāʾ", b: "Conceal nūn sākinah/tanwīn with ghunnah before ikhfāʾ letters." },
    { t: "Qalqalah", b: "Echo on ق ط ب ج د when sākin." },
    { t: "Ghunnah", b: "Nasal on م/ن mushaddad — two counts." },
    { t: "Madd ṭabīʿī", b: "Natural two-count elongation." }
  ];
  var ti = Math.floor(Date.now() / 86400000) % TJ.length;
  w.clarityLiveTajweed = function (next) {
    if (next) ti = (ti + 1) % TJ.length;
    var t = q("#tajweed-live-title");
    var b = q("#tajweed-live-body");
    if (t) t.textContent = TJ[ti].t;
    if (b) b.textContent = TJ[ti].b + " Educational only — seek a teacher for correction.";
  };

  function hydrateAction() {
    paintMirror();
    bindThemeChips();
    fixStudioLinks();
    var title = q("#sm-title");
    if (title && /loading/i.test(title.textContent || "")) paintMirror();
    var tj = q("#tajweed-live-title");
    if (tj && !(tj.textContent || "").trim()) w.clarityLiveTajweed(false);
    var badge = q("#vt-cache-badge");
    if (badge && /check/i.test(badge.textContent || "")) badge.textContent = "Type + Translate ready";
    log("action-hydrate");
  }

  function watch() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(hydrateAction, 50);
    }).observe(mount, { childList: true, subtree: true });
    hydrateAction();
    setTimeout(hydrateAction, 400);
    setTimeout(hydrateAction, 1200);
  }

  function boot() {
    watch();
    log("action-fix-boot");
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
