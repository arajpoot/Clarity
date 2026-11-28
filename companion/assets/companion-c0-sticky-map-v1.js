/*! companion-c0-sticky-map-v1.js
 * Phase C0.1 — full-width Map pill · Bismillah strip · Reminder rail label
 * Additive · Companion only · educational only — not a fatwa
 * Hooks: #companion-banner-shell, #cs-banner-strip, #clarity-door-rail [data-rail-tab]
 * Version: 20261128C0.1
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_C0_STICKY_MAP_V1__) return;
  w.__COMPANION_C0_STICKY_MAP_V1__ = true;

  var STRIP_ID = "cs-banner-strip";
  var PILL_ID = "c0-map-pill";
  var BACKDROP_ID = "c0-map-backdrop";
  var MODAL_ID = "c0-map-modal";

  function qs(sel, root) {
    try {
      return (root || d).querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function on(el, ev, fn) {
    if (!el) return;
    el.addEventListener(ev, fn);
  }

  function ensureStrip() {
    var existing = qs("#" + STRIP_ID);
    if (existing) return existing;

    var shell = qs("#companion-banner-shell") || qs(".companion-banner-shell");
    var strip = d.createElement("div");
    strip.id = STRIP_ID;
    strip.setAttribute("role", "region");
    strip.setAttribute("aria-label", "Companion map and help");

    if (shell && shell.parentNode) {
      if (shell.nextSibling) {
        shell.parentNode.insertBefore(strip, shell.nextSibling);
      } else {
        shell.parentNode.appendChild(strip);
      }
    } else {
      var path = qs(".cs-path");
      if (path && path.parentNode) {
        path.parentNode.insertBefore(strip, path);
      } else {
        d.body.insertBefore(strip, d.body.firstChild);
      }
    }
    return strip;
  }

  function ensurePill(strip) {
    if (qs("#" + PILL_ID, strip)) return qs("#" + PILL_ID, strip);
    var btn = d.createElement("button");
    btn.type = "button";
    btn.id = PILL_ID;
    btn.className = "c0-map-pill";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-controls", MODAL_ID);
    btn.innerHTML =
      '<span class="c0-map-ico" aria-hidden="true">▣</span>' +
      '<span class="c0-map-pill-inner">' +
      '<span class="c0-map-label">Map · paths &amp; halls</span>' +
      '<span class="c0-map-sub">Today · Learn · Prepare · Studios</span>' +
      "</span>";
    btn.setAttribute("title", "Open Companion map");
    strip.appendChild(btn);
    on(btn, "click", function (e) {
      e.preventDefault();
      openMap();
    });
    return btn;
  }


  function ensureBismillah(afterEl) {
    if (qs("#c0-bismillah-strip")) return qs("#c0-bismillah-strip");
    var strip = d.createElement("div");
    strip.id = "c0-bismillah-strip";
    strip.setAttribute("role", "note");
    strip.setAttribute("aria-label", "Bismillah");
    strip.innerHTML =
      '<p class="c0-bis-ar" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>' +
      '<p class="c0-bis-en">In the name of Allah, the Most Gracious, the Most Merciful</p>' +
      '<p class="c0-bis-seal">Educational companion · not a fatwa</p>';
    var path = qs(".cs-path");
    if (afterEl && afterEl.parentNode) {
      if (afterEl.nextSibling) {
        afterEl.parentNode.insertBefore(strip, afterEl.nextSibling);
      } else {
        afterEl.parentNode.appendChild(strip);
      }
    } else if (path && path.parentNode) {
      path.parentNode.insertBefore(strip, path);
    } else {
      d.body.appendChild(strip);
    }
    return strip;
  }

  function forceReminderRailLabel() {
    var btn =
      qs('#clarity-door-rail [data-rail-tab="reminder"]') ||
      qs('.cs-door [data-rail-tab="reminder"]');
    if (!btn) return;
    var lab = btn.querySelector(".dr-label");
    if (lab) {
      lab.textContent = "Reminder";
    } else {
      btn.setAttribute("aria-label", "Reminder");
    }
    /* Remove legacy "Map" only label if some packs set data-rail-label */
    if (btn.getAttribute("data-rail-label") === "Map") {
      btn.setAttribute("data-rail-label", "Reminder");
    }
  }

  function clickRail(tab) {
    var btn =
      qs('#clarity-door-rail [data-rail-tab="' + tab + '"]') ||
      qs('.cs-door [data-rail-tab="' + tab + '"]');
    if (btn) {
      try {
        btn.click();
      } catch (e) {}
      return true;
    }
    try {
      w.dispatchEvent(
        new CustomEvent("cs:rail-tab", { detail: { tab: tab } })
      );
    } catch (e2) {}
    return false;
  }

  function setPath(path) {
    var tile = qs('[data-cs-path="' + path + '"]');
    if (tile) {
      try {
        tile.click();
      } catch (e) {}
      return true;
    }
    try {
      localStorage.setItem("cu_companion_path_v1", path);
    } catch (e2) {}
    try {
      w.dispatchEvent(
        new CustomEvent("cs:path", { detail: { path: path } })
      );
    } catch (e3) {}
    return false;
  }

  function closeModal() {
    var bd = qs("#" + BACKDROP_ID);
    if (bd) {
      bd.setAttribute("hidden", "");
      bd.setAttribute("aria-hidden", "true");
    }
    var pill = qs("#" + PILL_ID);
    if (pill) pill.focus();
  }

  function renderMapBody(modal) {
    modal.innerHTML =
      "<h2 id=\"c0-map-title\">Companion map</h2>" +
      '<p class="c0-map-lead">Four halls on this home surface. Everything is local and educational.</p>' +
      '<div class="c0-map-halls" role="list">' +
      hall("today", "Today", "Next prayer context, one deed, path card, streak.") +
      hall("learn", "Learn", "Heart & grave · Seerah · ordered tracks.") +
      hall("prepare", "Prepare", "Legacy path · wasiyyah tools · print pack · Hajj checklist.") +
      hall("amanah", "Amanah vault", "Trusts & notes on device — not a court document.") +
      hall("studios", "Studios", "Tajweed · Calligraphy · Meme craft.") +
      "</div>" +
      '<div class="c0-map-actions">' +
      '<button type="button" class="c0-primary" data-c0="path-interest">Change path interest</button>' +
      '<button type="button" data-c0="close">Close</button>' +
      '<button type="button" data-c0="university">University (optional) →</button>' +
      "</div>" +
      '<p class="c0-map-foot">Educational only — not a fatwa.</p>';

    function hall(id, title, desc) {
      return (
        '<button type="button" class="c0-map-hall" data-c0-hall="' +
        id +
        '" role="listitem"><strong>' +
        title +
        "</strong><span>" +
        desc +
        "</span></button>"
      );
    }
  }

  function renderWelcomeBody(modal) {
    modal.innerHTML =
      "<h2 id=\"c0-map-title\">Welcome to your Companion</h2>" +
      '<p class="c0-map-lead">Private on this device. Pick what you need most — we will pin three shortcuts. Not a fatwa site.</p>' +
      '<div class="c0-welcome-list">' +
      interest("seeker", "Curious about Islam", "Purpose, prophecy, Qurʾān, next life — steady exploration.") +
      interest("new_muslim", "New Muslim", "Prayer, purification, character — one step at a time.") +
      interest("practicing", "Daily consistency", "Ṣalāh awareness, one deed, short practice.") +
      interest("dai", "Family & legacy", "Wasiyyah tools, print pack, Amanah vault — intention aids only.") +
      interest("practicing", "Creative reminder", "Ayah cards & craft — beauty without inventing meanings.") +
      "</div>" +
      '<div class="c0-map-actions">' +
      '<button type="button" data-c0="close">Skip for now</button>' +
      "</div>" +
      '<p class="c0-map-foot">Zero accounts · data stays on this device · for personal rulings ask a local scholar.</p>';

    function interest(path, title, desc) {
      return (
        '<button type="button" class="c0-map-hall" data-c0-interest="' +
        path +
        '"><strong>' +
        title +
        "</strong><span>" +
        desc +
        "</span></button>"
      );
    }
  }

  function ensureModal() {
    var bd = qs("#" + BACKDROP_ID);
    if (bd) return bd;

    bd = d.createElement("div");
    bd.id = BACKDROP_ID;
    bd.className = "c0-map-backdrop";
    bd.setAttribute("hidden", "");
    bd.setAttribute("aria-hidden", "true");
    var modalEl = d.createElement("div");
    modalEl.id = MODAL_ID;
    modalEl.className = "c0-map-modal";
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", "c0-map-title");
    bd.appendChild(modalEl);
    d.body.appendChild(bd);

    on(bd, "click", function (e) {
      if (e.target === bd) closeModal();
    });
    on(d, "keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
    on(bd, "click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var closeBtn = t.closest("[data-c0=\"close\"]");
      if (closeBtn) {
        closeModal();
        return;
      }
      var uni = t.closest("[data-c0=\"university\"]");
      if (uni) {
        closeModal();
        w.location.href = "/campus/";
        return;
      }
      var pathInterest = t.closest("[data-c0=\"path-interest\"]");
      if (pathInterest) {
        openWelcome();
        return;
      }
      var hall = t.closest("[data-c0-hall]");
      if (hall) {
        handleHall(hall.getAttribute("data-c0-hall"));
        return;
      }
      var interest = t.closest("[data-c0-interest]");
      if (interest) {
        setPath(interest.getAttribute("data-c0-interest"));
        closeModal();
        clickRail("reminder");
      }
    });

    return bd;
  }

  function handleHall(id) {
    closeModal();
    if (id === "today") {
      clickRail("reminder");
      try {
        w.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        w.scrollTo(0, 0);
      }
      return;
    }
    if (id === "learn") {
      clickRail("reminder");
      return;
    }
    if (id === "prepare") {
      /* Hajj / legacy surface lives under Action in this plan */
      clickRail("action");
      return;
    }
    if (id === "amanah") {
      /* Room isolation: link out, do not rewrite Amānah */
      w.location.href = "/amana/";
      return;
    }
    if (id === "studios") {
      clickRail("action");
      return;
    }
  }

  function openMap() {
    var bd = ensureModal();
    var modal = qs("#" + MODAL_ID, bd);
    renderMapBody(modal);
    bd.removeAttribute("hidden");
    bd.setAttribute("aria-hidden", "false");
    try {
      var first = qs(".c0-map-hall", modal);
      if (first) first.focus();
    } catch (e) {}
  }

  function openWelcome() {
    var bd = ensureModal();
    var modal = qs("#" + MODAL_ID, bd);
    renderWelcomeBody(modal);
    bd.removeAttribute("hidden");
    bd.setAttribute("aria-hidden", "false");
  }

  function markStickyClass() {
    try {
      d.documentElement.classList.add("c0-sticky-map");
    } catch (e) {}
  }

  function boot() {
    if (!d.body) return;
    markStickyClass();
    var strip = ensureStrip();
    ensurePill(strip);
    ensureBismillah(strip);
    forceReminderRailLabel();
    ensureModal();
  }

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 0);
    });
  } else {
    setTimeout(boot, 0);
  }
  w.addEventListener("load", function () {
    setTimeout(boot, 120);
    setTimeout(forceReminderRailLabel, 400);
    setTimeout(forceReminderRailLabel, 1200);
  });

  /* Public hooks for later phases / tests */
  w.CompanionC0 = {
    openMap: openMap,
    openWelcome: openWelcome,
    closeModal: closeModal,
    version: "20261128C0.1",
  };
})(window, document);
