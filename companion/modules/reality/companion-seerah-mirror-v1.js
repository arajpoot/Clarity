/*! companion-seerah-mirror-v1.js · Phase 3 Reality densify
 * One Seerah Mirror card on Reality · Another rotates
 * Isolated to Reality tab · educational only — not a fatwa
 * Version: 20261128P3
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_SEERAH_MIRROR_V1__) return;
  w.__COMPANION_SEERAH_MIRROR_V1__ = true;

  var BANK = [{"title": "The Prophet’s Mercy with Children", "event": "The Prophet ﷺ would shorten the prayer when he heard a child crying so that the mother would not be distressed. He carried his granddaughter Umamah on his shoulder during prayer, putting her down when he prostrated and lifting her when he stood.", "lesson": "True strength includes gentleness. Adjusting our plans out of mercy for the weak is part of following the Messenger ﷺ.", "ref": "Sahih Muslim • Sahih al-Bukhari"}, {"title": "Forgiving the People of Makkah", "event": "After years of persecution, when the Prophet ﷺ entered Makkah as a victor, he stood at the door of the Kaaba and said to those who had harmed him: “Go, for you are free.” He forgave even those who had killed his companions and mutilated their bodies.", "lesson": "When we gain the upper hand, the Prophetic example is mercy over revenge. Forgiveness at the moment of power is one of the highest forms of character.", "ref": "Seerah Ibn Hisham • Seerah Ibn Ishaq"}, {"title": "Serving His Family", "event": "Aisha (RA) was asked what the Prophet ﷺ used to do in his house. She replied: “He used to serve his family, and when the time for prayer came he would go out to pray.” He mended his own clothes, milked the goat, and helped with household work.", "lesson": "Helping at home is not a loss of dignity; it is part of the Sunnah of the best of creation. The one who is greatest in the sight of Allah is also the most humble with those closest to him.", "ref": "Sahih al-Bukhari"}, {"title": "Visiting the Sick", "event": "The Prophet ﷺ regularly visited the sick, sat with them, made du’a for them, and reminded them of the reward of patience. He even visited a Jewish servant who used to serve him when the boy fell ill, and invited him to Islam.", "lesson": "A short visit, a sincere message, or a quiet du’a for someone who is ill is a living Sunnah that brings comfort in this life and reward in the next.", "ref": "Sahih al-Bukhari • Sahih Muslim"}, {"title": "The Smile of the Prophet ﷺ", "event": "The companions described the Prophet ﷺ as someone who smiled often. Jarir (RA) said: “The Messenger of Allah never saw me except that he smiled.” His face was described as more beautiful than the full moon.", "lesson": "A genuine smile is charity. Bringing ease and light to the faces of others is a small deed with great weight when done for the sake of Allah.", "ref": "Jami` at-Tirmidhi • Sahih al-Bukhari"}, {"title": "Standing for Justice Even Against His Own", "event": "When a woman from Banu Makhzum stole and some companions tried to intercede because of her status, the Prophet ﷺ became angry and said: “By Allah, if Fatimah the daughter of Muhammad were to steal, I would cut off her hand.”", "lesson": "Justice is not bent for family, status or friendship. The Prophet ﷺ established that the law of Allah applies equally to everyone.", "ref": "Sahih al-Bukhari • Sahih Muslim"}];
  var DAY_KEY = "cu_companion_seerah_day";
  var IDX_KEY = "cu_companion_seerah_idx";

  function qs(sel, root) {
    try { return (root || d).querySelector(sel); } catch (e) { return null; }
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function isRealityActive() {
    var btn =
      qs('#clarity-door-rail [data-rail-tab="reality"].is-active') ||
      qs('.cs-door [data-rail-tab="reality"].is-active') ||
      qs('button[data-rail-tab="reality"][aria-current="page"]');
    return !!btn;
  }

  function hideCard() {
    var el = qs("#c3-seerah-card");
    if (el) {
      el.setAttribute("hidden", "");
      el.style.display = "none";
      el.setAttribute("data-c3-visible", "0");
    }
  }

  function showCard(el) {
    if (!el) return;
    el.removeAttribute("hidden");
    el.style.display = "";
    el.setAttribute("data-c3-visible", "1");
  }

  function pickIndex(forceNew) {
    var day = today();
    try {
      var storedDay = localStorage.getItem(DAY_KEY);
      var idx = parseInt(localStorage.getItem(IDX_KEY) || "0", 10) || 0;
      if (forceNew || storedDay !== day) {
        idx = forceNew ? (idx + 1) % BANK.length : Math.floor(Math.random() * BANK.length);
        localStorage.setItem(DAY_KEY, day);
        localStorage.setItem(IDX_KEY, String(idx));
      }
      return ((idx % BANK.length) + BANK.length) % BANK.length;
    } catch (e) {
      return Math.floor(Math.random() * BANK.length);
    }
  }

  function findAnchor() {
    var mount = qs("#cs-mount");
    if (!mount) return null;
    var nodes = mount.querySelectorAll("section, article, .cs-plaque, .card, h2");
    var i, el, t;
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/Seerah Mirror|Reality|What was|grave|death|Akhirah/i.test(t) && t.length < 400) {
        return el;
      }
    }
    return null;
  }

  function mountHost() {
    var existing = qs("#c3-seerah-card");
    if (existing) return existing;
    var host = d.createElement("section");
    host.id = "c3-seerah-card";
    host.className = "c3-seerah-card cs-plaque";
    host.setAttribute("data-cs-module", "seerah-mirror");
    host.setAttribute("aria-label", "Seerah mirror moment");
    host.setAttribute("data-c3-tab", "reality");
    var anchor = findAnchor();
    var mount = qs("#cs-mount");
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) anchor.parentNode.insertBefore(host, anchor.nextSibling);
      else anchor.parentNode.appendChild(host);
    } else if (mount) {
      mount.appendChild(host);
    } else {
      return null;
    }
    return host;
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(forceNew) {
    if (!isRealityActive()) {
      hideCard();
      return;
    }
    var host = mountHost();
    if (!host) return;
    showCard(host);
    var i = pickIndex(!!forceNew);
    var h = BANK[i];
    if (!h) return;

    host.innerHTML =
      '<div class="c3-head">' +
      '<span class="c3-ico" aria-hidden="true">◉</span>' +
      "<div>" +
      '<h2 class="c3-title">Seerah Mirror · ' +
      esc(h.title) +
      "</h2>" +
      '<p class="c3-sub">See his life · adjust yours · one moment</p>' +
      "</div></div>" +
      '<p class="c3-event">' +
      esc(h.event) +
      "</p>" +
      '<div class="c3-lesson"><strong>Mirror · act</strong> · ' +
      esc(h.lesson) +
      "</div>" +
      '<div class="c3-chips">' +
      '<span class="c3-chip">' +
      esc(h.ref) +
      "</span>" +
      '<a class="c3-chip c3-link" href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a>' +
      "</div>" +
      '<div class="c3-actions">' +
      '<button type="button" class="c3-btn" id="c3-another">Another moment</button>' +
      '<button type="button" class="c3-btn c3-soft" id="c3-done">I will act on this</button>' +
      "</div>" +
      '<p class="c3-foot">Educational only — not a fatwa · verify reports with a teacher · one card on Reality</p>';

    var an = qs("#c3-another", host);
    var done = qs("#c3-done", host);
    if (an) an.onclick = function () { render(true); };
    if (done) {
      done.onclick = function () {
        try {
          var day = today();
          localStorage.setItem("cu_companion_deed_day", day);
          localStorage.setItem("cu_companion_seerah_acted", day);
        } catch (e) {}
        done.textContent = "Intention noted · may Allah accept";
        done.disabled = true;
      };
    }
  }

  function onTab(ev) {
    var t = "";
    try {
      t = (ev && ev.detail && (ev.detail.tab || ev.detail.name)) || "";
    } catch (e) {}
    t = String(t || "").toLowerCase();
    if (t && t !== "reality") {
      hideCard();
      return;
    }
    setTimeout(function () { render(false); }, 80);
    setTimeout(function () { render(false); }, 450);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if (!t) return;
      var name = (t.getAttribute("data-rail-tab") || "").toLowerCase();
      if (name && name !== "reality") hideCard();
      else if (name === "reality") setTimeout(function () { render(false); }, 100);
    },
    true
  );

  function boot() {
    if (isRealityActive()) render(false);
    else hideCard();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  w.addEventListener("load", function () { setTimeout(boot, 600); });

  w.CompanionSeerahMirror = { render: render, version: "20261128P3", size: BANK.length };
})(window, document);
