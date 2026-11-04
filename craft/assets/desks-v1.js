/**
 * Shared 𝕏 + Facebook desks · Craft Meme Studio
 * Educational only — not a fatwa. Sources only.
 */
(function () {
  "use strict";
  var SNIPPETS = {
    journey: "Journey reminder · Educational only.\n\n“And whoever puts their trust in Allah — then He is sufficient for them.” (65:3)\n\n— clarity-dawah.fyi",
    commands: "Command for the believers · Educational only.\n\nيَا أَيُّهَا الَّذِينَ آمَنُوا\nO you who have believed…\n\nLive the command with the Sunnah.\n\n— clarity-dawah.fyi",
    grave: "Furnish your grave · Educational only.\n\nWhen a person dies, his deeds come to an end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for him. (Muslim)\n\n— clarity-dawah.fyi",
    tafseer: "Tafsīr reflection · Educational only.\n\nOpen the verse on Quran.com or tafsir.app. Ask a local scholar for personal rulings.\n\n— clarity-dawah.fyi",
    seerah: "Seerah moment · Educational only.\n\nThe Prophet ﷺ taught that the most beloved deeds are those done consistently, even if small.\n\n— clarity-dawah.fyi",
    samina: "Samiʿnā wa aṭaʿnā · Educational only.\n\nWe hear and we obey. (See 2:285)\n\n— clarity-dawah.fyi",
    tajweed: "Tajweed practice note · Educational only.\n\nBeautify the Qurʾān with your voice, and recite with tartīl. Practice one rule today.\n\n— clarity-dawah.fyi",
    surprise: "Surprise reminder · Educational only.\n\nBy time — mankind is in loss, except those who believe, work righteousness, and enjoin truth and patience. (103)\n\n— clarity-dawah.fyi",
    refresh: ""
  };

  function bindDesk(prefix, maxLen, openUrl) {
    var draft = document.getElementById(prefix + "-draft");
    var count = document.getElementById(prefix + "-count");
    var status = document.getElementById(prefix + "-status");
    if (!draft) return;

    function update() {
      var n = draft.value.length;
      if (count) count.textContent = n + " / " + maxLen;
      if (status) status.textContent = n ? "Draft ready" : "Ready";
    }
    draft.addEventListener("input", update);

    document.querySelectorAll("#" + prefix + "-source-chips button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#" + prefix + "-source-chips button").forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        var src = btn.getAttribute("data-src");
        if (src === "refresh") {
          var keys = Object.keys(SNIPPETS).filter(function (k) { return k !== "refresh"; });
          src = keys[Math.floor(Math.random() * keys.length)];
        }
        draft.value = (SNIPPETS[src] || "").slice(0, maxLen);
        update();
        draft.focus();
      });
    });

    var copyBtn = document.getElementById(prefix + "-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var t = draft.value.trim();
        if (!t) { if (status) status.textContent = "Nothing to copy"; return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(t).then(function () {
            if (status) status.textContent = "Copied ✓";
          });
        } else {
          draft.select();
          try { document.execCommand("copy"); if (status) status.textContent = "Copied ✓"; } catch (_) {}
        }
      });
    }

    var openBtn = document.getElementById(prefix + "-open");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        var t = draft.value.trim();
        if (t && navigator.clipboard) navigator.clipboard.writeText(t).catch(function () {});
        if (openUrl.indexOf("twitter") !== -1 || openUrl.indexOf("x.com") !== -1) {
          window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(t), "_blank", "noopener");
        } else {
          window.open(openUrl, "_blank", "noopener");
        }
        if (status) status.textContent = "Opened · paste if needed";
      });
    }

    var clearBtn = document.getElementById(prefix + "-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        draft.value = "";
        update();
        document.querySelectorAll("#" + prefix + "-source-chips button").forEach(function (b) {
          b.classList.remove("active");
        });
      });
    }
    update();
  }

  function boot() {
    bindDesk("tw", 280, "https://twitter.com/intent/tweet");
    bindDesk("fb", 2000, "https://www.facebook.com/");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
