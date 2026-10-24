/**
 * Clarity Lab · TTS (Web Speech)
 */
(function (g) {
  "use strict";
  if (g.__CU_LINGUA_TTS_V1__) return;
  g.__CU_LINGUA_TTS_V1__ = true;
  var BCP47 = {
    en: "en-US",
    ar: "ar-SA",
    ur: "ur-PK",
    fr: "fr-FR",
    es: "es-ES",
    de: "de-DE",
    tr: "tr-TR",
    id: "id-ID",
    ms: "ms-MY",
    bn: "bn-BD",
    hi: "hi-IN",
    ja: "ja-JP",
    ko: "ko-KR"
  };
  function toBCP47(code) {
    return BCP47[code] || code || "en-US";
  }
  function speakText(text, lang) {
    if (!text || !g.speechSynthesis) return;
    try {
      g.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = toBCP47(lang);
      g.speechSynthesis.speak(u);
    } catch (e) {}
  }
  g.CuLinguaTts = { speak: speakText, toBCP47: toBCP47 };
})(window);
