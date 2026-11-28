/*! companion-meme-isolate-v1.js · Phase 6 Meme isolation
 * Hide meme host outside Notes · door card on Notes → /companion/meme/
 * Map Studios hall already links out · educational only — not a fatwa
 * Version: 20261128P6
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_ISOLATE_V1__) return;
  w.__COMPANION_MEME_ISOLATE_V1__ = true;

  function qs(sel, root) {
    try {
      return (root || d).querySelector(sel);
    } catch (e) {
      return null;
    }
  }

  function activeTab() {
    var btn =
      qs("#clarity-door-rail [data-rail-tab].is-active") ||
      qs(".cs-door [data-rail-tab].is-active") ||
      qs("[data-rail-tab][aria-current='page']");
    if (btn) return (btn.getAttribute("data-rail-tab") || "").toLowerCase();
    try {
      return (d.body.getAttribute("data-active-tab") || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function hideHosts() {
    ["#meme-section", "#cs-meme-mount", "#cs-meme-frame", ".cs-meme-host"].forEach(function (sel) {
      d.querySelectorAll(sel).forEach(function (el) {
        el.removeAttribute("data-p6-notes");
        el.setAttribute("hidden", "");
        try {
          el.style.setProperty("display", "none", "important");
        } catch (e) {}
      });
    });
    /* promo strips that leak into Reminder */
    d.querySelectorAll("#cs-mount .cs-meme-promo, #cs-mount [data-meme-promo]").forEach(function (el) {
      try {
        el.style.setProperty("display", "none", "important");
      } catch (e2) {}
    });
  }

  function showHostsOnNotes() {
    /* still prefer external studio — keep embed collapsed; door is enough */
    hideHosts();
  }

  function mountDoor() {
    var existing = qs("#c6-meme-door");
    if (existing) return existing;
    var mount = qs("#cs-mount");
    if (!mount) return null;
    var host = d.createElement("section");
    host.id = "c6-meme-door";
    host.setAttribute("data-cs-module", "meme-door");
    host.innerHTML =
      '<h2 class="c6-meme-title">Meme Studio · isolated</h2>' +
      '<p class="c6-meme-lead">Scenery &amp; shareable cards live in their own studio — not on Reminder or home scroll. Educational scenery only.</p>' +
      '<div class="c6-meme-actions">' +
      '<a href="/companion/meme/" rel="noopener">Open Meme Studio</a>' +
      '<a class="c6-soft" href="/companion/redirects/meme/">Redirect door</a>' +
      "</div>" +
      '<p class="c6-meme-foot">Educational only — not a fatwa · single spine · /companion/meme/</p>';
    mount.appendChild(host);
    return host;
  }

  function sync() {
    var tab = activeTab();
    if (tab === "notes") {
      showHostsOnNotes();
      var door = mountDoor();
      if (door) {
        door.removeAttribute("hidden");
        door.style.display = "";
      }
    } else {
      hideHosts();
      var door2 = qs("#c6-meme-door");
      if (door2) {
        door2.setAttribute("hidden", "");
        door2.style.display = "none";
      }
    }
  }

  function onTab(ev) {
    setTimeout(sync, 40);
    setTimeout(sync, 300);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if (t) setTimeout(sync, 50);
    },
    true
  );

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(sync, 150); });
  else setTimeout(sync, 150);
  w.addEventListener("load", function () {
    setTimeout(sync, 400);
    setTimeout(sync, 1200);
  });

  /* Observer: if meme injects into mount on Reminder, re-hide */
  try {
    var mo = new MutationObserver(function () {
      var tab = activeTab();
      if (tab !== "notes") hideHosts();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  w.CompanionMemeIsolate = { sync: sync, version: "20261128P6" };
})(window, document);
