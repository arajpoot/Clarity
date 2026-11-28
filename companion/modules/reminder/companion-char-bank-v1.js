/*! companion-char-bank-v1.js · Phase 2 Reminder densify
 * One graded character card on Reminder · Another rotates bank
 * Form factor: does not replace Beautiful Names · educational only — not a fatwa
 * Version: 20261128P2
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_CHAR_BANK_V1__) return;
  w.__COMPANION_CHAR_BANK_V1__ = true;

  var BANK = [{"title": "Truthfulness", "text": "The Prophet ﷺ said: “Upon you is truthfulness. Truthfulness leads to righteousness, and righteousness leads to Paradise…”", "ref": "Bukhari 6094 · Muslim 2607", "ponder": "One honest sentence today is heavier than ten polished excuses.", "collection": "Bukhari", "number": "6094", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/bukhari:6094"}, {"title": "Gentleness", "text": "“Wherever gentleness is found, it beautifies what it is in; and when it is removed, it disfigures.”", "ref": "Muslim 2594", "ponder": "Where can you lower your voice and raise your adab?", "collection": "Muslim", "number": "2594", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/muslim:2594"}, {"title": "Guarding the tongue", "text": "“Whoever believes in Allah and the Last Day, let him speak good or remain silent.”", "ref": "Bukhari 6018 · Muslim 47", "ponder": "Silence is a ṣadaqah when speech would bruise.", "collection": "Bukhari", "number": "6018", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/bukhari:6018"}, {"title": "Modesty", "text": "“Modesty is part of faith.”", "ref": "Bukhari 24 · Muslim 36", "ponder": "Modesty is not weakness — it is light that restrains the self.", "collection": "Bukhari", "number": "24", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/bukhari:24"}, {"title": "Reliance", "text": "“If you relied on Allah as He should be relied on, He would provide for you as He provides for the birds…”", "ref": "Tirmidhi 2344", "ponder": "Tie your camel — then trust. Effort without tawakkul is noise.", "collection": "Tirmidhi", "number": "2344", "grade": "verify grade", "sunnah": "https://sunnah.com/search?q=Reliance"}, {"title": "Removing harm", "text": "“Faith has over seventy branches… the removal of harm from the road is a branch of faith.”", "ref": "Muslim 35", "ponder": "What small harm can you clear from someone’s path today?", "collection": "Muslim", "number": "35", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/muslim:35"}, {"title": "Loving for others", "text": "“None of you truly believes until he loves for his brother what he loves for himself.”", "ref": "Bukhari 13 · Muslim 45", "ponder": "Wish for them the ease you beg for yourself.", "collection": "Bukhari", "number": "13", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/bukhari:13"}, {"title": "Controlling anger", "text": "“The strong is not the one who overcomes people by his strength, but the one who controls himself while angry.”", "ref": "Bukhari 6114 · Muslim 2609", "ponder": "When heat rises: seek refuge, sit or lie down, renew wuḍūʾ.", "collection": "Bukhari", "number": "6114", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/bukhari:6114"}, {"title": "Honouring parents", "text": "“The pleasure of the Lord is in the pleasure of the parents…”", "ref": "Tirmidhi 1899", "ponder": "One kind call can outweigh a day of empty busyness.", "collection": "Tirmidhi", "number": "1899", "grade": "verify grade", "sunnah": "https://sunnah.com/search?q=Honouring+parents"}, {"title": "Consistency", "text": "“The most beloved of deeds to Allah are the most consistent, even if small.”", "ref": "Bukhari 6464 · Muslim 783", "ponder": "A small daily deed that survives is better than a burst that dies.", "collection": "Bukhari", "number": "6464", "grade": "Ṣaḥīḥ", "sunnah": "https://sunnah.com/bukhari:6464"}];

  var DAY_KEY = "cu_companion_char_day";
  var IDX_KEY = "cu_companion_char_idx";

  function qs(sel, root) {
    try { return (root || d).querySelector(sel); } catch (e) { return null; }
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function pickIndex(forceNew) {
    var day = today();
    try {
      var storedDay = localStorage.getItem(DAY_KEY);
      var idx = parseInt(localStorage.getItem(IDX_KEY) || "0", 10) || 0;
      if (forceNew || storedDay !== day) {
        idx = forceNew ? (idx + 1) % BANK.length : (Math.floor(Math.random() * BANK.length));
        localStorage.setItem(DAY_KEY, day);
        localStorage.setItem(IDX_KEY, String(idx));
      }
      return ((idx % BANK.length) + BANK.length) % BANK.length;
    } catch (e) {
      return Math.floor(Math.random() * BANK.length);
    }
  }

  function mountHost() {
    var existing = qs("#c2-char-card");
    if (existing) return existing;

    /* Prefer after Names card / inside reminder mount */
    var mount =
      qs("#cs-mount") ||
      qs('[data-rail-panel="reminder"]') ||
      qs("main");

    var host = d.createElement("section");
    host.id = "c2-char-card";
    host.className = "c2-char-card cs-plaque";
    host.setAttribute("data-cs-module", "character-bank");
    host.setAttribute("aria-label", "Character lesson");

    /* Insert near Names if present, else top of mount content */
    var names =
      qs("#cs-mount .cs-plaque") ||
      qs("#cs-mount section") ||
      qs("#cs-mount article");
    if (mount) {
      if (names && names.parentNode === mount) {
        if (names.nextSibling) mount.insertBefore(host, names.nextSibling);
        else mount.appendChild(host);
      } else {
        mount.insertBefore(host, mount.firstChild);
      }
    } else {
      d.body.appendChild(host);
    }
    return host;
  }

  function render(forceNew) {
    var host = mountHost();
    if (!host) return;
    var i = pickIndex(!!forceNew);
    var h = BANK[i];
    if (!h) return;

    var grade = h.grade || "verify grade";
    var collection = h.collection || "";
    var number = h.number || "";
    var sunnah = h.sunnah || "https://sunnah.com";

    host.innerHTML =
      '<div class="c2-char-head">' +
      '<span class="c2-char-ico" aria-hidden="true">✦</span>' +
      "<div>" +
      '<h2 class="c2-char-title">Character · ' +
      escapeHtml(h.title) +
      "</h2>" +
      '<p class="c2-char-sub">Adab before ʿilm · one lesson · one act</p>' +
      "</div></div>" +
      '<p class="c2-char-text">"' +
      escapeHtml(h.text) +
      '"</p>' +
      '<div class="c2-char-chips" role="group" aria-label="Source">' +
      '<span class="c2-chip c2-grade">' +
      escapeHtml(grade) +
      "</span>" +
      '<span class="c2-chip">' +
      escapeHtml(collection) +
      (number && number !== "—" ? " · " + escapeHtml(number) : "") +
      "</span>" +
      '<a class="c2-chip c2-link" href="' +
      escapeHtml(sunnah) +
      '" target="_blank" rel="noopener">Sunnah.com</a>' +
      "</div>" +
      '<div class="c2-char-ponder"><strong>Ponder · act</strong> · ' +
      escapeHtml(h.ponder) +
      "</div>" +
      '<div class="c2-char-actions">' +
      '<button type="button" class="c2-btn" id="c2-char-another">Another lesson</button>' +
      '<button type="button" class="c2-btn c2-btn-soft" id="c2-char-done">I will act on this</button>' +
      "</div>" +
      '<p class="c2-char-foot">Educational only — not a fatwa · verify on Sunnah.com · one card on Reminder</p>';

    var an = qs("#c2-char-another", host);
    var done = qs("#c2-char-done", host);
    if (an) {
      an.onclick = function () {
        render(true);
      };
    }
    if (done) {
      done.onclick = function () {
        try {
          var day = today();
          localStorage.setItem("cu_companion_deed_day", day);
          localStorage.setItem("cu_companion_char_acted", day);
        } catch (e) {}
        done.textContent = "Intention noted · may Allah accept";
        done.disabled = true;
      };
    }
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function onTab(ev) {
    try {
      var t = (ev && ev.detail && (ev.detail.tab || ev.detail.name)) || "";
      if (t && String(t).toLowerCase() !== "reminder") return;
    } catch (e) {}
    setTimeout(function () {
      render(false);
    }, 80);
    setTimeout(function () {
      render(false);
    }, 400);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);

  function boot() {
    /* Default first paint is often Reminder */
    var active =
      qs('#clarity-door-rail [data-rail-tab="reminder"].is-active') ||
      qs('.cs-door [data-rail-tab="reminder"].is-active');
    if (active || !qs("#c2-char-card")) render(false);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 150); });
  else setTimeout(boot, 150);
  w.addEventListener("load", function () { setTimeout(boot, 500); });

  w.CompanionCharBank = { render: render, version: "20261128P2", size: BANK.length };
})(window, document);
