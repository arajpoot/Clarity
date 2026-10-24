/**
 * Arabic library · 20261024CAMP2
 * Letters · Words · Jumlah · Hajj stay — browse & open in Lab
 */
(function () {
  "use strict";
  var stage, tab = "letters";
  var cache = {};

  function $(id) { return document.getElementById(id); }

  function loadJSON(path) {
    if (cache[path]) return Promise.resolve(cache[path]);
    return fetch(path).then(function (r) { return r.json(); }).then(function (d) {
      cache[path] = d; return d;
    }).catch(function () { return null; });
  }

  function speakAr(text) {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = "ar-SA";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function cardWord(w) {
    return '<article class="ar-lib-card">' +
      '<div class="ar-lib-ar" dir="rtl" lang="ar">' + (w.ar || "") + '</div>' +
      '<div class="ar-lib-en">' + (w.en || "") + (w.tr ? ' · <span class="ar-lib-tr">' + w.tr + '</span>' : '') + '</div>' +
      '<div class="ar-lib-acts">' +
      '<button type="button" data-say="' + encodeURIComponent(w.ar || "") + '">Hear</button>' +
      '<a href="/campus/lab/arabic/?mode=flash">Open in Lab</a>' +
      '</div></article>';
  }

  function cardJumlah(j) {
    return '<article class="ar-lib-card">' +
      '<div class="ar-lib-ar" dir="rtl" lang="ar">' + (j.ar || "") + '</div>' +
      '<div class="ar-lib-en">' + (j.en || "") + '</div>' +
      '<div class="ar-lib-acts">' +
      '<button type="button" data-say="' + encodeURIComponent(j.ar || "") + '">Hear</button>' +
      '<a href="/campus/lab/arabic/?mode=jumlah&deck=haramayn">Practice Jumlah</a>' +
      '</div></article>';
  }

  function cardLetter(L) {
    return '<article class="ar-lib-card ar-lib-letter">' +
      '<div class="ar-lib-ar big" dir="rtl" lang="ar">' + L.ar + '</div>' +
      '<div class="ar-lib-en">' + L.name + '</div>' +
      '<div class="ar-lib-acts">' +
      '<button type="button" data-say="' + encodeURIComponent(L.ar) + '">Hear</button>' +
      '<a href="/campus/lab/arabic/?mode=letters">Letters in Lab</a>' +
      '</div></article>';
  }

  function bindHear(root) {
    root.querySelectorAll("[data-say]").forEach(function (b) {
      b.onclick = function () {
        try { speakAr(decodeURIComponent(b.getAttribute("data-say") || "")); } catch (e) {}
      };
    });
  }

  function renderLetters() {
    loadJSON("/campus/lab/arabic/library/data/letters.json?v=20261024CAMP2").then(function (arr) {
      if (!arr || !Array.isArray(arr)) { stage.innerHTML = "<p>Could not load letters.</p>"; return; }
      stage.innerHTML = '<div class="ar-lib-grid">' + arr.map(cardLetter).join("") + '</div>';
      bindHear(stage);
    });
  }

  function renderWords() {
    loadJSON("/campus/lab/arabic/library/data/words.json?v=20261024CAMP2").then(function (packs) {
      if (!packs || typeof packs !== "object") { stage.innerHTML = "<p>Could not load words.</p>"; return; }
      var html = "";
      Object.keys(packs).forEach(function (k) {
        html += '<h2 class="ar-lib-h">' + k + '</h2><div class="ar-lib-grid">';
        (packs[k] || []).forEach(function (w) { html += cardWord(w); });
        html += "</div>";
      });
      stage.innerHTML = html;
      bindHear(stage);
    });
  }

  function renderJumlah(key) {
    loadJSON("/campus/lab/arabic/library/data/jumlah.json?v=20261024CAMP2").then(function (packs) {
      if (!packs || typeof packs !== "object") { stage.innerHTML = "<p>Could not load Jumlah.</p>"; return; }
      var list = packs[key] || packs.everyday || [];
      if (!Array.isArray(list)) list = [];
      var note = key === "hajj_stay"
        ? '<p class="ar-lib-note">Everyday speech during stay in Makkah &amp; Madinah. Follow your group\'s guide. Educational only — not a fatwa.</p>'
        : (packs.disclaimer ? '<p class="ar-lib-note">' + packs.disclaimer + '</p>' : '');
      stage.innerHTML = note + '<div class="ar-lib-grid">' + list.map(cardJumlah).join("") + '</div>';
      bindHear(stage);
    });
  }

  function show(name) {
    tab = name;
    document.querySelectorAll("[data-lib-tab]").forEach(function (b) {
      b.classList.toggle("here", b.getAttribute("data-lib-tab") === name);
    });
    if (name === "letters") renderLetters();
    else if (name === "words") renderWords();
    else if (name === "jumlah") renderJumlah("everyday");
    else if (name === "hajj_stay") renderJumlah("hajj_stay");
    else if (name === "salah") renderJumlah("salah");
  }

  function boot() {
    stage = $("ar-lib-stage");
    if (!stage) return;
    document.querySelectorAll("[data-lib-tab]").forEach(function (b) {
      b.addEventListener("click", function () { show(b.getAttribute("data-lib-tab")); });
    });
    show("letters");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
