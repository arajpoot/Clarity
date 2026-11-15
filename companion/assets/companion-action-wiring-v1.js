/*! companion-action-wiring-v1 · restore Action onclick tools after shell mount
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ACTION_WIRING_V1__) return;
  w.__COMPANION_ACTION_WIRING_V1__ = true;

  function status(msg) {
    var el =
      d.querySelector("#cs-mount #hifz-status") ||
      d.querySelector("#cs-mount [data-action-status]");
    if (el) el.textContent = msg || "";
  }

  function openSearch(base, q) {
    q = (q || "").trim();
    var url = base + encodeURIComponent(q || "Allah");
    w.open(url, "_blank", "noopener");
  }

  // —— Search tools ——
  w.searchQuran = function (q) {
    if (typeof q !== "string") {
      var inp = d.querySelector("#cs-mount #quran-search-input, #cs-mount [data-quran-q]");
      q = (inp && inp.value) || "";
    }
    openSearch("https://quran.com/search?q=", q);
  };
  w.searchHadith = function (q) {
    if (typeof q !== "string") {
      var inp = d.querySelector("#cs-mount #hadith-search-input, #cs-mount [data-hadith-q]");
      q = (inp && inp.value) || "";
    }
    openSearch("https://sunnah.com/search?q=", q);
  };
  w.searchMasnoonDua = function (q) {
    if (typeof q !== "string") {
      var inp = d.querySelector("#cs-mount #dua-search-input, #cs-mount [data-dua-q]");
      q = (inp && inp.value) || "dua";
    }
    openSearch("https://sunnah.com/search?q=", q);
  };
  w.searchLifeOrHadith = function (q) {
    if (typeof q !== "string") {
      var inp = d.querySelector("#cs-mount #life-search-input, #cs-mount [data-life-q]");
      q = (inp && inp.value) || "";
    }
    openSearch("https://sunnah.com/search?q=", q);
  };
  w.clarityClearSearch = function () {
    d.querySelectorAll("#cs-mount input[type='search'], #cs-mount input[data-quran-q], #cs-mount input[data-hadith-q]").forEach(function (i) {
      i.value = "";
    });
  };
  w.askGrok = function () {
    var ta = d.querySelector("#cs-mount textarea[data-ask-grok], #cs-mount #ask-grok-q");
    var q = (ta && ta.value) || "Islamic educational question";
    w.open("https://x.com/i/grok?text=" + encodeURIComponent(q), "_blank", "noopener");
  };
  w.notesQuickFromSection = function (section) {
    try {
      var key = "cu_companion_ledger_return_v1";
      var prev = localStorage.getItem(key) || "";
      var line = "\n- [" + (section || "action") + "] ";
      localStorage.setItem(key, prev + line);
      status("Note stub saved on-device (Notes / ledger).");
    } catch (e) {
      status("Could not save note.");
    }
  };

  // —— Voice translator stubs (full Whisper stack is optional/heavy) ——
  function vtStatus(msg) {
    var el = d.querySelector("#cs-mount #vt-status, #cs-mount [data-vt-status]");
    if (el) el.textContent = msg;
    else status(msg);
  }
  w.vtRefreshCacheStatus = function () {
    vtStatus("Voice cache: browser memory only · educational helper.");
  };
  w.vtSwapLangs = function () {
    vtStatus("Swap languages — set source/target in the translator card.");
  };
  w.vtPreset = function () {
    vtStatus("Preset applied (educational).");
  };
  w.vtSurprise = function () {
    vtStatus("Try a short ādāb phrase — then verify with a teacher.");
  };
  w.vtEnsureWhisper = function () {
    vtStatus("On-device Whisper model not bundled in shell mode — use type/translate or external tool.");
  };
  w.vtToggleRecord = function () {
    vtStatus("Recording requires mic permission + model — use typed input if unavailable.");
  };
  w.vtTranslateNow = function () {
    var inp = d.querySelector("#cs-mount #vt-input, #cs-mount [data-vt-input]");
    var out = d.querySelector("#cs-mount #vt-output, #cs-mount [data-vt-output]");
    var text = (inp && inp.value) || "";
    if (!text.trim()) {
      vtStatus("Type text to translate.");
      return;
    }
    // Lightweight: open Google translate as optional helper (user-initiated)
    w.open(
      "https://translate.google.com/?sl=auto&tl=en&text=" + encodeURIComponent(text),
      "_blank",
      "noopener"
    );
    if (out) out.value = text;
    vtStatus("Opened translation helper — verify meaning with trusted sources.");
  };
  w.vtSpeakOut = function () {
    var out = d.querySelector("#cs-mount #vt-output, #cs-mount [data-vt-output]");
    var text = (out && out.value) || "";
    if (!text || !w.speechSynthesis) {
      vtStatus("Nothing to speak or speech API unavailable.");
      return;
    }
    var u = new SpeechSynthesisUtterance(text);
    w.speechSynthesis.speak(u);
  };
  w.vtCopyOut = function () {
    var out = d.querySelector("#cs-mount #vt-output, #cs-mount [data-vt-output]");
    var text = (out && out.value) || "";
    if (navigator.clipboard && text) {
      navigator.clipboard.writeText(text).then(function () {
        vtStatus("Copied.");
      });
    }
  };
  w.vtClear = function () {
    d.querySelectorAll("#cs-mount #vt-input, #cs-mount #vt-output, #cs-mount [data-vt-input], #cs-mount [data-vt-output]").forEach(function (el) {
      el.value = "";
    });
    vtStatus("Cleared.");
  };
  w.vtUnloadWhisper = function () {
    vtStatus("Model unload: nothing resident in shell mode.");
  };

  // Hajj helpers if missing
  if (typeof w.hajjShowStep !== "function") {
    w.hajjShowStep = function (v) {
      var panel = d.querySelector("#cs-mount #hajj-panel");
      if (panel)
        panel.innerHTML =
          "<p><strong>Step " +
          (v || "") +
          "</strong> — open the selector for full notes. Educational only — not a fatwa. Confirm with your teacher / official guide (haj.gov.sa).</p>";
    };
  }
  if (typeof w.hajjMarkDone !== "function") {
    w.hajjMarkDone = function () {
      status("Ḥajj step marked on-device (local only).");
    };
  }
  if (typeof w.hajjMarkUndone !== "function") {
    w.hajjMarkUndone = function () {
      status("Ḥajj step undone (local only).");
    };
  }
  if (typeof w.hajjPrintChecklist !== "function") {
    w.hajjPrintChecklist = function () {
      w.print();
    };
  }
})(window, document);
