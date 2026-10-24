/**
 * Clarity Lab · conversation helpers
 * Key: cu_lab_talk_v1
 */
(function (g) {
  "use strict";
  if (g.__CU_LINGUA_TALK_V1__) return;
  g.__CU_LINGUA_TALK_V1__ = true;
  var KEY = "cu_lab_talk_v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }
  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify((list || []).slice(0, 40)));
    } catch (e) {}
  }
  function add(speaker, text, lang) {
    var list = load();
    list.push({ speaker: speaker, text: text, lang: lang, at: Date.now() });
    save(list);
    return list;
  }
  function clear() {
    save([]);
  }
  g.CuLinguaTalk = { load: load, save: save, add: add, clear: clear, KEY: KEY };
})(window);
