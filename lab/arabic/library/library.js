/**
 * Arabic Library · 20261017LIB
 * Letters · Words · Jumlah · Hajj stay
 */
(function () {
  "use strict";
  var state = { tab: "letters", wordsKey: "everyday", jumlahKey: "hajj_stay" };
  var data = { letters: [], words: {}, jumlah: {} };
  function $(id) { return document.getElementById(id); }
  function speak(ar) {
    try {
      if (!window.speechSynthesis) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = "ar-SA"; u.rate = 0.85;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function loadAll(cb) {
    Promise.all([
      fetch("/lab/arabic/library/data/letters.json?v=20261017LIB").then(function (r) { return r.json(); }),
      fetch("/lab/arabic/library/data/words.json?v=20261017LIB").then(function (r) { return r.json(); }),
      fetch("/lab/arabic/library/data/jumlah.json?v=20261017LIB").then(function (r) { return r.json(); })
    ]).then(function (arr) {
      data.letters = arr[0]; data.words = arr[1]; data.jumlah = arr[2];
      cb();
    }).catch(function () {
      data.letters = [{ ar: "ا", name: "alif" }];
      cb();
    });
  }
  function render() {
    var host = $("ar-lib-stage");
    if (!host) return;
    document.querySelectorAll("[data-lib-tab]").forEach(function (b) {
      b.classList.toggle("here", b.getAttribute("data-lib-tab") === state.tab);
    });
    if (state.tab === "letters") {
      host.innerHTML = '<div class="ar-lib-grid">' + data.letters.map(function (L) {
        return '<button type="button" class="ar-lib-letter" data-say="' + L.ar + '"><span dir="rtl" lang="ar">' +
          L.ar + '</span><small>' + L.name + '</small></button>';
      }).join("") + '</div><p class="ar-lib-note">Tap to hear. <a href="/lab/arabic/?mode=letters">Practice in Lab → Letters</a></p>';
    } else if (state.tab === "words") {
      var keys = Object.keys(data.words);
      var chips = keys.map(function (k) {
        return '<button type="button" class="ar-lib-chip' + (state.wordsKey === k ? ' here' : '') +
          '" data-words="' + k + '">' + k + '</button>';
      }).join("");
      var list = (data.words[state.wordsKey] || []).map(function (w) {
        return '<div class="ar-lib-row"><span dir="rtl" lang="ar" class="ar-lib-ar">' + w.ar +
          '</span><span>' + w.en + '</span><button type="button" class="ar-lib-chip" data-say="' + w.ar +
          '">Hear</button></div>';
      }).join("");
      host.innerHTML = '<div class="ar-lib-chips">' + chips + '</div>' + list +
        '<p class="ar-lib-note"><a href="/lab/arabic/?deck=' +
        (state.wordsKey === "haramayn" ? "haramayn" : state.wordsKey === "salah" ? "salah" : "everyday") +
        '">Study in Lab Flash</a></p>';
    } else if (state.tab === "jumlah" || state.tab === "hajj_stay") {
      var jk = state.tab === "hajj_stay" ? "hajj_stay" : state.jumlahKey;
      if (state.tab === "hajj_stay") jk = "hajj_stay";
      var jchips = Object.keys(data.jumlah).map(function (k) {
        return '<button type="button" class="ar-lib-chip' + (jk === k ? ' here' : '') +
          '" data-jumlah="' + k + '">' + (k === "hajj_stay" ? "Hajj stay" : k) + '</button>';
      }).join("");
      var jlist = (data.jumlah[jk] || []).map(function (s) {
        return '<div class="ar-lib-row"><div><div dir="rtl" lang="ar" class="ar-lib-ar">' + s.ar +
          '</div><div class="ar-lib-en">' + s.en + '</div></div>' +
          '<button type="button" class="ar-lib-chip" data-say="' + s.ar.replace(/"/g, '') +
          '">Hear</button></div>';
      }).join("");
      host.innerHTML = '<div class="ar-lib-chips">' + jchips + '</div>' +
        (jk === "hajj_stay" ?
          '<p class="ar-lib-note">Everyday phrases for stay in Makkah/Madinah. Language practice only — follow your group’s guide. Not a fatwa.</p>' : '') +
        jlist +
        '<p class="ar-lib-note"><a href="/lab/arabic/?deck=haramayn&mode=jumlah">Practice Jumlah in Lab</a></p>';
    }
    host.querySelectorAll("[data-say]").forEach(function (b) {
      b.onclick = function () { speak(b.getAttribute("data-say")); };
    });
    host.querySelectorAll("[data-words]").forEach(function (b) {
      b.onclick = function () { state.wordsKey = b.getAttribute("data-words"); render(); };
    });
    host.querySelectorAll("[data-jumlah]").forEach(function (b) {
      b.onclick = function () {
        state.jumlahKey = b.getAttribute("data-jumlah");
        state.tab = state.jumlahKey === "hajj_stay" ? "hajj_stay" : "jumlah";
        render();
      };
    });
  }
  function boot() {
    document.querySelectorAll("[data-lib-tab]").forEach(function (b) {
      b.onclick = function () { state.tab = b.getAttribute("data-lib-tab"); render(); };
    });
    loadAll(render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
