/* Lab AV kit — hear master, chips, TTS translation, stop
 * Works with nx-tj-lmr practice loop when present.
 * Educational only — mic never auto-starts.
 */
(function (g) {
  "use strict";
  if (g.__CU_LAB_AV_V1__) return;
  g.__CU_LAB_AV_V1__ = true;

  function everyAyahUrl(sura, ayah) {
    var s = String(sura).padStart(3, "0");
    var a = String(ayah).padStart(3, "0");
    return "https://everyayah.com/data/Husary_64kbps/" + s + a + ".mp3";
  }

  function parseRef(ref) {
    /* "1:1" or "1:1-7" → first ayah for audio */
    var m = String(ref || "").match(/(\d+)\s*:\s*(\d+)/);
    if (!m) return null;
    return { s: parseInt(m[1], 10), a: parseInt(m[2], 10) };
  }

  function playMaster(s, a, audioEl) {
    var url = everyAyahUrl(s, a);
    var el = audioEl || document.getElementById("lab-hub-audio") || document.getElementById("tj-lmr-master-audio");
    if (!el) {
      el = document.createElement("audio");
      el.id = "lab-hub-audio";
      document.body.appendChild(el);
    }
    el.src = url;
    el.play().catch(function () {});
    return el;
  }

  function stopAll() {
    document.querySelectorAll("audio").forEach(function (a) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (e) {}
    });
    if (g.speechSynthesis) {
      try {
        g.speechSynthesis.cancel();
      } catch (e2) {}
    }
  }

  function setLmrSelects(s, a) {
    var ss = document.getElementById("tj-lmr-surah");
    var aa = document.getElementById("tj-lmr-ayah");
    if (ss) {
      ss.value = String(s);
      try {
        ss.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (e) {}
    }
    if (aa) {
      aa.value = String(a);
      try {
        aa.dispatchEvent(new Event("change", { bubbles: true }));
      } catch (e2) {}
    }
    var fetchBtn = document.getElementById("tj-lmr-fetch");
    if (fetchBtn) {
      try {
        fetchBtn.click();
      } catch (e3) {}
    }
  }

  function speakEnglish(text) {
    if (!g.speechSynthesis || !text) return;
    try {
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.95;
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function wireChips() {
    document.querySelectorAll("[data-lab-load]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ref = parseRef(btn.getAttribute("data-lab-load"));
        if (!ref) return;
        setLmrSelects(ref.s, ref.a);
        playMaster(ref.s, ref.a);
      });
    });
    document.querySelectorAll("[data-lab-quick]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ref = parseRef(btn.getAttribute("data-lab-quick"));
        if (!ref) return;
        playMaster(ref.s, ref.a);
      });
    });
    document.querySelectorAll("[data-lab-quick-stop]").forEach(function (btn) {
      btn.addEventListener("click", stopAll);
    });
  }

  /** Enhance LMR: big Hear + TTS on English panel */
  function enhanceLmr() {
    var play = document.getElementById("tj-lmr-play-master");
    if (play && !play.__labAv) {
      play.__labAv = true;
      play.classList.add("lab-btn-primary");
    }
    var en = document.getElementById("tj-lmr-en");
    if (en && !document.getElementById("lab-tts-en")) {
      var b = document.createElement("button");
      b.type = "button";
      b.id = "lab-tts-en";
      b.className = "lab-btn lab-btn-ghost";
      b.textContent = "Speak translation";
      b.addEventListener("click", function () {
        speakEnglish(en.textContent || "");
      });
      en.parentNode.insertBefore(b, en.nextSibling);
    }
    /* Ensure record buttons never auto-fire — attribute only */
    ["tj-lmr-rec-btn", "tj-lmr-rec-stop"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.setAttribute("data-lab-consent", "1");
    });
  }

  function boot() {
    wireChips();
    enhanceLmr();
    setTimeout(enhanceLmr, 800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityLabAV = {
    playMaster: playMaster,
    stopAll: stopAll,
    everyAyahUrl: everyAyahUrl
  };
})(typeof window !== "undefined" ? window : this);
