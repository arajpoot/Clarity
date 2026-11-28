/*! companion-char-bank-v1.js · Phase 2 Reminder densify
 * One graded character card on Reminder · Another rotates bank
 * Form factor: does not replace Beautiful Names · educational only — not a fatwa
 * Version: 20261128P2.1
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

  function isReminderActive() {
    var btn =
      qs('#clarity-door-rail [data-rail-tab="reminder"].is-active') ||
      qs('.cs-door [data-rail-tab="reminder"].is-active') ||
      qs('button[data-rail-tab="reminder"][aria-current="page"]');
    if (btn) return true;
    try {
      var tab = (d.body && d.body.getAttribute("data-active-tab")) || "";
      if (String(tab).toLowerCase() === "reminder") return true;
    } catch (e) {}
    /* hash */
    var h = (w.location.hash || "").replace(/^#/, "").toLowerCase();
    if (h === "reminder" || h === "") {
      /* empty hash often defaults to reminder on first paint — still require active class if present */
      if (!qs("#clarity-door-rail .is-active") && !qs(".cs-door .is-active")) return true;
    }
    return false;
  }

  function hideCard() {
    var el = qs("#c2-char-card");
    if (el) {
      el.setAttribute("hidden", "");
      el.style.display = "none";
      el.setAttribute("data-c2-visible", "0");
    }
  }

  function showCard(el) {
    if (!el) return;
    el.removeAttribute("hidden");
    el.style.display = "";
    el.setAttribute("data-c2-visible", "1");
  }

  function findReminderAnchor() {
    var mount = qs("#cs-mount");
    if (!mount) return null;
    /* Prefer after Reminder intro heading/plaque that contains "What Allah and His Messenger" */
    var nodes = mount.querySelectorAll("section, article, .cs-plaque, .card, h2, h1, .cs-tab-head");
    var i, el, t;
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/What Allah and His Messenger taught/i.test(t) && t.length < 280) {
        return el;
      }
    }
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Reminder\b/i.test(t) && /Educational only/i.test(t) && t.length < 320) {
        return el;
      }
    }
    /* ladder strip */
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/Reminder ladder/i.test(t) && t.length < 400) {
        return el;
      }
    }
    return null;
  }

  function mountHost() {
    var existing = qs("#c2-char-card");
    if (existing) return existing;

    var mount = qs("#cs-mount");
    var host = d.createElement("section");
    host.id = "c2-char-card";
    host.className = "c2-char-card cs-plaque";
    host.setAttribute("data-cs-module", "character-bank");
    host.setAttribute("aria-label", "Character lesson");
    host.setAttribute("data-c2-tab", "reminder");

    var anchor = findReminderAnchor();
    if (anchor && anchor.parentNode) {
      /* place AFTER Reminder intro / ladder — not above */
      if (anchor.nextSibling) anchor.parentNode.insertBefore(host, anchor.nextSibling);
      else anchor.parentNode.appendChild(host);
    } else if (mount) {
      /* bottom of mount rather than top — avoids path/focus leak look */
      mount.appendChild(host);
    } else {
      return null;
    }
    return host;
  }

  function render(forceNew) {
    if (!isReminderActive()) {
      hideCard();
      return;
    }
    var host = mountHost();
    if (!host) return;
    showCard(host);
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
    var t = "";
    try {
      t = (ev && ev.detail && (ev.detail.tab || ev.detail.name)) || "";
    } catch (e) {}
    t = String(t || "").toLowerCase();
    if (t && t !== "reminder") {
      hideCard();
      return;
    }
    setTimeout(function () { render(false); }, 80);
    setTimeout(function () { render(false); }, 450);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);
  d.addEventListener("cs:rail-tab", onTab);
  w.addEventListener("cs:rail-tab", onTab);

  /* Click rail: hide immediately on non-reminder */
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if (!t) return;
      var name = (t.getAttribute("data-rail-tab") || "").toLowerCase();
      if (name && name !== "reminder") hideCard();
      else if (name === "reminder") setTimeout(function () { render(false); }, 100);
    },
    true
  );

  function boot() {
    if (isReminderActive()) render(false);
    else hideCard();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  w.addEventListener("load", function () { setTimeout(boot, 600); });
  setTimeout(boot, 1200);

  w.CompanionCharBank = { render: render, version: "20261128P2.1", size: BANK.length };
})(window, document);
