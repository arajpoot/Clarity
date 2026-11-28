/*! companion-hajj-checklist-v1.js · Phase 4 Action · Hajj densify
 * HAJJ_STEPS checklist under existing Hajj guide · on-device progress
 * Educational outline — not a fatwa · Version 20261128P4
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_HAJJ_CHECKLIST_V1__) return;
  w.__COMPANION_HAJJ_CHECKLIST_V1__ = true;

  var STEPS = [{"id": "prep", "title": "📋 0. Prepare before travel", "day": "Weeks before", "level": "Prep", "do": ["Confirm istiṭāʿah and funds for dependents", "Study pillars vs wājibāt vs sunan", "Choose nusk with your group scholar", "Pack iḥrām, comfortable footwear, basic medicines", "Memorise Talbiyah and key duʿās"], "note": "Hajj is farḍ once in a lifetime on every adult Muslim who is free, sane, and able (istiṭāʿah): physical ability, a safe route, and sufficient funds for the journey and dependents left behind. Settle debts you can, seek forgiveness from those you wronged, leave written…"}, {"id": "ihram", "title": "🧵 1. Iḥrām at the mīqāt", "day": "At / before mīqāt", "level": "Pillar", "do": ["Ghusl and cleanliness before intention", "Intention matching your nusk (Tamattuʿ/Qirān/Ifrād)", "Talbiyah aloud for men, softly for women", "Know your mīqāt and do not pass it without iḥrām"], "note": "Iḥrām is the state of sacred restriction and is a pillar. Enter it at or before your mīqāt (for most air travellers, often in the aircraft before flying over the mīqāt — follow the airline announcement and your guide). Men wear two unsewn cloths; women wear ordinary…"}, {"id": "makkah", "title": "🕌 2. Enter Makkah & first rites", "day": "Arrival", "level": "Adab + ʿUmrah (Tamattuʿ)", "do": ["Enter with calm and dhikr", "Complete ʿUmrah if on Tamattuʿ", "Rest and hydrate", "Note the location of your camp / hotel"], "note": "Enter the Ḥaram with humility. For Tamattuʿ: perform ʿUmrah first — ṭawāf, two rakʿahs if possible, saʿī, then shorten or shave the hair and exit iḥrām until the 8th of Dhul-Ḥijjah. For Qirān/Ifrād: you remain in iḥrām; ṭawāf al-qudūm is sunnah. Drink Zamzam and make…"}, {"id": "tawaf", "title": "🔄 3. Ṭawāf (seven circuits)", "day": "ʿUmrah / Ifāḍah / Wadāʿ", "level": "Pillar when Ifāḍah", "do": ["Keep count carefully", "Maintain wuḍūʾ (majority view)", "Make personal duʿāʾ — no fixed text required each step", "Two rakʿahs after if reasonably possible"], "note": "Ṭawāf is seven circuits with the Kaʿbah on your left, beginning at the Black Stone line (or its marker). Intention matters; purity (wuḍūʾ) is required by the majority. Men may uncover the right shoulder (iḍṭibāʿ) in arrival ṭawāf of ʿUmrah/Hajj and walk with strength…"}, {"id": "sai", "title": "🚶 4. Saʿī between Ṣafā and Marwah", "day": "After ṭawāf", "level": "Wājib / pillar (schools differ)", "do": ["Start at Ṣafā with Quran 2:158", "Complete seven legs (Ṣafā→Marwah is one)", "Duʿāʾ at Ṣafā and Marwah"], "note": "Saʿī is seven legs beginning at Ṣafā and ending at Marwah. Climb Ṣafā, face the Kaʿbah, make takbīr and the duʿāʾ of the Prophet ﷺ if able, then walk to Marwah (men run between the green markers if able). Pure intention; wuḍūʾ is preferred. For Tamattuʿ, saʿī of ʿUmrah…"}, {"id": "tarwiyah", "title": "⛺ 5. 8th Dhul-Ḥijjah — Tarwiyah (Mina)", "day": "8 Dhul-Ḥijjah", "level": "Sunnah (strongly practised)", "do": ["Iḥrām for Hajj (Tamattuʿ) from Makkah", "Stay Mina", "Hydrate and rest for ʿArafah", "Talbiyah often"], "note": "On the 8th, enter iḥrām for Hajj if you exited after ʿUmrah (Tamattuʿ). Proceed to Mina, stay the night, and pray shortened prayers without combining (according to the common practice). Use the day to rest, review the rites of ʿArafah, and keep the Talbiyah frequent."}, {"id": "arafah", "title": "⛰️ 6. 9th — ʿArafah (the pillar)", "day": "9 Dhul-Ḥijjah", "level": "Pillar", "do": ["Confirm you are inside the boundary", "Combine Ẓuhr & ʿAṣr", "Abundant duʿāʾ and ṣalawāt", "Keep wuḍūʾ as much as possible", "Stay until sunset (majority)"], "note": "The Prophet ﷺ said: “Hajj is ʿArafah.” Being within the boundaries of ʿArafah in the required time is the central pillar. The best is to stay from after Ẓuhr until sunset in duʿāʾ, dhikr, and tawbah. Combine Ẓuhr and ʿAṣr at ʿArafah (as the Prophet ﷺ did). Do not leave…"}, {"id": "muzdalifah", "title": "🌌 7. Muzdalifah", "day": "Night before Eid", "level": "Wājib", "do": ["Maghrib + ʿIshāʾ combined", "Rest safely", "Collect pebbles", "Leave after Fajr (or after midnight if eligible)"], "note": "After sunset, move to Muzdalifah. Pray Maghrib and ʿIshāʾ combined (with one adhān and two iqāmahs as narrated). Rest. Collect pebbles for the jamarāt (seven for the 10th; more if staying for tashrīq). After Fajr, leave for Mina before sunrise. Weak and vulnerable…"}, {"id": "jamarat10", "title": "🪨 8. 10th — ʿAqabah, hady, hair", "day": "Eid 10th", "level": "Wājib rites", "do": ["Stone only ʿAqabah this day", "Arrange hady if required", "Shave or shorten", "Maintain dignity in crowds"], "note": "On the 10th: (1) stone Jamrat al-ʿAqabah only with seven pebbles, saying Allāhu akbar with each; (2) offer the sacrifice if required (Tamattuʿ/Qirān); (3) shave the head (best for men) or shorten; women shorten a small amount. After stoning and shaving/shortening…"}, {"id": "ifadah", "title": "🕋 9. Ṭawāf al-Ifāḍah & Saʿī of Hajj", "day": "10th or after", "level": "Pillar", "do": ["Complete ifāḍah ṭawāf", "Saʿī of Hajj if required", "Confirm full taḥallul"], "note": "Ṭawāf al-ifāḍah is a pillar. Perform seven circuits, then saʿī of Hajj if it was not already done as part of your nusk in a way that suffices (Tamattuʿ needs saʿī for Hajj after ifāḍah). After ifāḍah (and saʿī when required), all iḥrām restrictions end (taḥallul…"}, {"id": "tashreeq", "title": "📅 10. Days of Tashrīq — stoning", "day": "11–12 or 13", "level": "Wājib", "do": ["Stone after Ẓuhr", "Order: small → middle → ʿAqabah", "Duʿāʾ after first and second", "Decide taʿjīl vs 13th"], "note": "After Ẓuhr on the 11th and 12th, stone the three jamarāt (small, middle, then ʿAqabah), seven each, with duʿāʾ after the first two. You may leave on the 12th after stoning before Maghrib (taʿjīl). Staying to the 13th is better if able. Keep Mina nights according to the…"}, {"id": "wada", "title": "👋 11. Farewell ṭawāf (Wadāʿ)", "day": "Before leaving Makkah", "level": "Wājib", "do": ["Perform as the last act", "Heartfelt farewell duʿāʾ", "Leave without lingering for shopping after (ideal)"], "note": "Ṭawāf al-wadāʿ is the last act in Makkah for those who leave. Seven circuits; no saʿī. Menstruating women are excused according to the ḥadīth of Ibn ʿAbbās. Make it the final rite before travel."}, {"id": "mistakes", "title": "⚠️ 12. Mistakes, fidya & missed rites", "day": "Anytime", "level": "Fidā / repair", "do": ["Write down what happened and when", "Ask your group mufti or a reliable scholar", "Complete any missed pillar as soon as possible"], "note": "Missing a pillar (e.g. ʿArafah, ifāḍah) is not fixed by a simple sacrifice alone — the pillar must be performed. Missing a wājib often requires dam (a sacrifice) or fasting according to detailed rules. Iḥrām violations have graded expiations (fidya): sacrifice,…"}];
  var STORE = "cu_companion_hajj_checks_v1";

  function qs(sel, root) {
    try { return (root || d).querySelector(sel); } catch (e) { return null; }
  }

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function saveState(st) {
    try {
      localStorage.setItem(STORE, JSON.stringify(st));
    } catch (e) {}
  }

  function isActionActive() {
    var btn =
      qs('#clarity-door-rail [data-rail-tab="action"].is-active') ||
      qs('.cs-door [data-rail-tab="action"].is-active') ||
      qs('button[data-rail-tab="action"][aria-current="page"]');
    return !!btn;
  }

  function hide() {
    var el = qs("#c4-hajj-checklist");
    if (el) {
      el.setAttribute("hidden", "");
      el.style.display = "none";
    }
  }

  function show(el) {
    if (!el) return;
    el.removeAttribute("hidden");
    el.style.display = "";
  }

  function findAnchor() {
    return (
      qs("#hajj-guide-card") ||
      qs('[data-studio="hajj"]') ||
      qs("#hajj-checklist-card") ||
      qs("#hajj-ihram-do-avoid")
    );
  }

  function mountHost() {
    var existing = qs("#c4-hajj-checklist");
    if (existing) return existing;
    var anchor = findAnchor();
    var host = d.createElement("section");
    host.id = "c4-hajj-checklist";
    host.className = "c4-hajj-checklist";
    host.setAttribute("data-cs-module", "hajj-checklist");
    host.setAttribute("aria-label", "Hajj checklist path");
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) anchor.parentNode.insertBefore(host, anchor.nextSibling);
      else anchor.parentNode.appendChild(host);
    } else {
      var mount = qs("#cs-mount");
      if (!mount) return null;
      mount.appendChild(host);
    }
    return host;
  }

  function countDone(st) {
    var n = 0;
    STEPS.forEach(function (s) {
      if (st[s.id]) n++;
    });
    return n;
  }

  function render() {
    if (!isActionActive()) {
      hide();
      return;
    }
    var host = mountHost();
    if (!host) return;
    show(host);
    var st = loadState();
    var done = countDone(st);
    var total = STEPS.length;

    var rows = STEPS.map(function (s, idx) {
      var on = !!st[s.id];
      var dos = (s.do || [])
        .map(function (x) {
          return "<li>" + esc(x) + "</li>";
        })
        .join("");
      return (
        '<details class="c4-step' +
        (on ? " is-done" : "") +
        '" data-step="' +
        esc(s.id) +
        '">' +
        "<summary>" +
        '<span class="c4-check-wrap">' +
        '<input type="checkbox" class="c4-check" data-id="' +
        esc(s.id) +
        '"' +
        (on ? " checked" : "") +
        " />" +
        "</span>" +
        '<span class="c4-step-main">' +
        '<span class="c4-step-title">' +
        esc(s.title) +
        "</span>" +
        '<span class="c4-step-meta">' +
        esc(s.day) +
        " · " +
        esc(s.level) +
        "</span>" +
        "</span>" +
        "</summary>" +
        (s.note
          ? '<p class="c4-note">' + esc(s.note) + "</p>"
          : "") +
        (dos ? '<ul class="c4-do">' + dos + "</ul>" : "") +
        '<p class="c4-src">Educational manāsik outline · verify with a teacher · not a fatwa</p>' +
        "</details>"
      );
    }).join("");

    host.innerHTML =
      '<div class="c4-head">' +
      '<h2 class="c4-title">Ḥajj checklist path</h2>' +
      '<p class="c4-lead">Thirteen stations · mark on this device · Tamattuʿ-friendly outline</p>' +
      '<div class="c4-progress"><span id="c4-prog-label">' +
      done +
      " / " +
      total +
      " marked</span>" +
      '<div class="c4-track"><div class="c4-fill" id="c4-prog-fill" style="width:' +
      (total ? Math.round((done / total) * 100) : 0) +
      '%"></div></div></div>' +
      "</div>" +
      '<div class="c4-steps">' +
      rows +
      "</div>" +
      '<p class="c4-foot">Sources for study: Qurʾān · Ṣaḥīḥ reports · mainstream Sunni manāsik (e.g. IslamQA educational articles, haj.gov.sa) · <strong>not a fatwa</strong> · school differences exist (Saʿī, qirān, etc.)</p>' +
      '<button type="button" class="c4-reset" id="c4-reset">Reset checklist</button>';

    host.querySelectorAll(".c4-check").forEach(function (inp) {
      inp.addEventListener("click", function (ev) {
        ev.stopPropagation();
      });
      inp.addEventListener("change", function () {
        var id = inp.getAttribute("data-id");
        var cur = loadState();
        if (inp.checked) cur[id] = true;
        else delete cur[id];
        saveState(cur);
        render();
      });
    });
    var reset = qs("#c4-reset", host);
    if (reset) {
      reset.onclick = function () {
        saveState({});
        render();
      };
    }
  }

  function esc(s) {
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
    if (t && t !== "action") {
      hide();
      return;
    }
    setTimeout(render, 80);
    setTimeout(render, 450);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if (!t) return;
      var name = (t.getAttribute("data-rail-tab") || "").toLowerCase();
      if (name && name !== "action") hide();
      else if (name === "action") setTimeout(render, 120);
    },
    true
  );

  function boot() {
    if (isActionActive()) render();
    else hide();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  w.addEventListener("load", function () { setTimeout(boot, 600); });

  w.CompanionHajjChecklist = { render: render, version: "20261128P4", steps: STEPS.length };
})(window, document);
