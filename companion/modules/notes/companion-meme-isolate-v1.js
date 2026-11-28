/*! companion-meme-isolate-v1.js · Phase 6.1
 * Kill residual Meme (+ calligraphy host noise) outside Notes
 * Educational only — not a fatwa · Version 20261128P6.1
 */
(function (w, d) {
  "use strict";
  w.__COMPANION_MEME_ISOLATE_V1__ = true;

  var HIDE_SEL = [
    "#meme-section",
    "#cs-meme-mount",
    "#cs-meme-frame",
    ".cs-meme-host",
    ".cs-meme-mount",
    ".cs-meme-frame",
    "[data-meme-spine]",
    "[data-meme-host]",
    "#callig-lab-card"
  ];

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

  function forceHide(el) {
    if (!el) return;
    el.setAttribute("hidden", "");
    el.setAttribute("data-p6-hidden", "1");
    try {
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("height", "0", "important");
      el.style.setProperty("overflow", "hidden", "important");
      el.style.setProperty("margin", "0", "important");
      el.style.setProperty("padding", "0", "important");
      el.style.setProperty("border", "0", "important");
    } catch (e) {}
    /* unload iframe so it does not keep network */
    if (el.tagName === "IFRAME") {
      try {
        el.removeAttribute("src");
        el.src = "about:blank";
      } catch (e2) {}
    }
    el.querySelectorAll &&
      el.querySelectorAll("iframe").forEach(function (f) {
        try {
          f.removeAttribute("src");
          f.src = "about:blank";
        } catch (e3) {}
      });
  }

  function hideResiduals() {
    HIDE_SEL.forEach(function (sel) {
      d.querySelectorAll(sel).forEach(forceHide);
    });
    /* text-matched shells that lost ids */
    d.querySelectorAll("#cs-mount section, #cs-mount .cs-plaque, #cs-mount .card").forEach(function (el) {
      if (el.id === "c6-meme-door" || el.id === "c6-callig-door") return;
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^Meme Studio\b/i.test(t) || /Companion Meme · isolated/i.test(t) || /Expand studio/i.test(t) && /Open full page/i.test(t)) {
        forceHide(el);
      }
    });
  }

  function mountDoors() {
    var mount = qs("#cs-mount");
    if (!mount) return;

    if (!qs("#c6-meme-door")) {
      var meme = d.createElement("section");
      meme.id = "c6-meme-door";
      meme.setAttribute("data-cs-module", "meme-door");
      meme.innerHTML =
        '<h2 class="c6-meme-title">Meme Studio · isolated</h2>' +
        '<p class="c6-meme-lead">Scenery atelier lives on its own page — not on Reminder. Educational scenery only.</p>' +
        '<div class="c6-meme-actions"><a href="/companion/meme/">Open Meme Studio</a></div>' +
        '<p class="c6-meme-foot">Educational only — not a fatwa · /companion/meme/</p>';
      mount.appendChild(meme);
    }

    if (!qs("#c6-callig-door")) {
      var callig = d.createElement("section");
      callig.id = "c6-callig-door";
      callig.className = "c6-meme-door";
      callig.setAttribute("data-cs-module", "callig-door");
      callig.innerHTML =
        '<h2 class="c6-meme-title">Calligraphy · practice pad</h2>' +
        '<p class="c6-meme-lead">Letter practice stays off the Reminder scroll. Open when you want a quiet pad.</p>' +
        '<div class="c6-meme-actions"><button type="button" class="c6-soft" id="c6-callig-reveal">Show pad here</button></div>' +
        '<p class="c6-meme-foot">Educational only — not a fatwa</p>';
      mount.appendChild(callig);
      var btn = callig.querySelector("#c6-callig-reveal");
      if (btn) {
        btn.onclick = function () {
          var lab = qs("#callig-lab-card");
          if (lab) {
            lab.removeAttribute("hidden");
            lab.removeAttribute("data-p6-hidden");
            lab.style.removeProperty("display");
            lab.style.removeProperty("visibility");
            lab.style.removeProperty("height");
            lab.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        };
      }
    }
  }

  function setDoorVisible(on) {
    ["#c6-meme-door", "#c6-callig-door"].forEach(function (id) {
      var el = qs(id);
      if (!el) return;
      if (on) {
        el.removeAttribute("hidden");
        el.style.display = "";
      } else {
        el.setAttribute("hidden", "");
        el.style.display = "none";
      }
    });
  }

  function sync() {
    var tab = activeTab();
    /* Always strip residual meme/callig hosts from Reminder and non-Notes */
    if (tab !== "notes") {
      hideResiduals();
      setDoorVisible(false);
    } else {
      hideResiduals();
      mountDoors();
      setDoorVisible(true);
    }
    /* Reminder: still hide meme even if Notes logic differs */
    if (tab === "reminder" || tab === "reality" || tab === "reflection" || tab === "action" || tab === "about") {
      hideResiduals();
      setDoorVisible(false);
    }
  }

  function onTab() {
    setTimeout(sync, 30);
    setTimeout(sync, 200);
    setTimeout(sync, 600);
  }

  d.addEventListener("clarity:tab-mounted", onTab);
  w.addEventListener("clarity:tab-mounted", onTab);
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab]");
      if (t) onTab();
    },
    true
  );

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", onTab);
  else onTab();
  w.addEventListener("load", function () {
    onTab();
    setTimeout(sync, 1500);
  });

  try {
    var mo = new MutationObserver(function () {
      var tab = activeTab();
      if (tab !== "notes") hideResiduals();
    });
    mo.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  w.CompanionMemeIsolate = { sync: sync, version: "20261128P6.1" };
})(window, document);
