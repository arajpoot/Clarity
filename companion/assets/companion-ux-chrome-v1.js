/*! companion-ux-chrome-v1.js · safe concat merge · enrichment held · educational only — not a fatwa */

/* ---- companion-ux-rail-v1.js ---- */
/*! companion-ux-rail-v1 · iconize door rail + glass rhythm
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_UX_RAIL_V1__) return;
  w.__COMPANION_UX_RAIL_V1__ = true;

  var MAP = {
    reminder: "nuros-icon-reminder",
    reality: "nuros-icon-reality",
    reflection: "nuros-icon-reflection",
    action: "nuros-icon-action",
    notes: "nuros-icon-notes",
    about: "nuros-icon-about"
  };

  function enhanceDoor() {
    var rail = d.getElementById("clarity-door-rail");
    if (!rail) return;
    rail.querySelectorAll("[data-rail-tab]").forEach(function (btn) {
      var tab = btn.getAttribute("data-rail-tab");
      btn.classList.add("cs-door-btn");
      var ico = btn.querySelector(".dr-ico");
      if (!ico) {
        ico = d.createElement("span");
        ico.className = "dr-ico";
        ico.setAttribute("aria-hidden", "true");
        btn.insertBefore(ico, btn.firstChild);
      }
      ico.classList.add("nuros-icon");
      if (MAP[tab]) ico.classList.add(MAP[tab]);
      /* wrap text label if plain text nodes remain */
      if (!btn.querySelector(".dr-label")) {
        var label = d.createElement("span");
        label.className = "dr-label";
        var texts = [];
        Array.prototype.forEach.call(btn.childNodes, function (n) {
          if (n.nodeType === 3 && n.textContent.trim()) {
            texts.push(n.textContent.trim());
            n.textContent = "";
          }
        });
        label.textContent = texts.join(" ") || tab.charAt(0).toUpperCase() + tab.slice(1);
        btn.appendChild(label);
      }
    });
  }

  function boot() {
    enhanceDoor();
    setTimeout(enhanceDoor, 400);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

/* ---- companion-iconize-v1.js ---- */
/*! companion-iconize-v1 · path tiles · arch L1–L6 · empty sections
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ICONIZE_V1__) return;
  w.__COMPANION_ICONIZE_V1__ = true;

  var PATH_ICO = {
    seeker: "nx-ico-path-seeker",
    new_muslim: "nx-ico-path-new_muslim",
    practicing: "nx-ico-path-practicing",
    daily: "nx-ico-path-practicing",
    dai: "nx-ico-path-dai"
  };
  var ARCH_ICO = {
    1: "nx-ico-arch-1",
    2: "nx-ico-arch-2",
    3: "nx-ico-arch-3",
    4: "nx-ico-arch-4",
    5: "nx-ico-arch-5",
    6: "nx-ico-arch-6"
  };

  function ico(cls, lg) {
    var s = d.createElement("span");
    s.className = "nx-ico " + cls + (lg ? " lg" : "");
    s.setAttribute("aria-hidden", "true");
    return s;
  }

  function iconizePaths() {
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      if (btn.querySelector(".nx-ico")) return;
      var p = (btn.getAttribute("data-cs-path") || "").toLowerCase();
      var cls = PATH_ICO[p] || PATH_ICO.seeker;
      btn.insertBefore(ico(cls), btn.firstChild);
    });
  }

  function iconizeArchBadges(root) {
    (root || d).querySelectorAll(".arch-badge").forEach(function (b) {
      if (b.querySelector(".nx-ico")) return;
      var lv = 0;
      var host = b.closest("[data-arch-level]");
      if (host) lv = parseInt(host.getAttribute("data-arch-level"), 10) || 0;
      if (!lv) {
        var m = (b.textContent || "").match(/L\s*([1-6])/i);
        if (m) lv = parseInt(m[1], 10);
      }
      if (ARCH_ICO[lv]) b.insertBefore(ico(ARCH_ICO[lv], false), b.firstChild);
    });
    (root || d).querySelectorAll(".car-step[data-arch-jump]").forEach(function (btn) {
      if (btn.querySelector(".nx-ico")) return;
      var lv = parseInt(btn.getAttribute("data-arch-jump"), 10);
      if (ARCH_ICO[lv]) btn.insertBefore(ico(ARCH_ICO[lv]), btn.firstChild);
    });
  }

  function isVisuallyEmpty(el) {
    if (!el) return true;
    var t = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (!t || /^loading/i.test(t)) return true;
    if (el.querySelector(".loading-msg") && /loading/i.test(el.querySelector(".loading-msg").textContent || "")) return true;
    return false;
  }

  function emptyMessage(host) {
    var id = (host.id || "") + " " + (host.getAttribute("data-rrra") || "");
    if (/command/i.test(id)) return "Command verse will appear here when the live loader finishes.";
    if (/hadith/i.test(id)) return "A graded ḥadīth spark will open here.";
    if (/prophet-name|asma/i.test(id)) return "A prophetic name with meaning will open here.";
    if (/seerah|life-event|israeliyat|prophet-story/i.test(id)) return "Seerah / life guidance loads into this panel.";
    if (/lesson|verse|zikr/i.test(id)) return "Reflection content loads into this panel.";
    if (/fq-stage|quiz/i.test(id)) return "Quiz cards appear when you start a deck.";
    return "Content opens here when ready. Educational only — not a fatwa.";
  }

  function iconizeEmpty(root) {
    root = root || d.getElementById("cs-mount") || d;
    var hosts = root.querySelectorAll(
      "#command-box, #hadith, #prophet-name-box, #life-event, #seerah-content, #prophet-story, #israeliyat-content, #lesson, #verse, #asma-box, #zikr, #fq-stage, .loading-msg"
    );
    Array.prototype.forEach.call(hosts, function (el) {
      if (el.classList.contains("nx-empty-done")) return;
      if (!isVisuallyEmpty(el)) return;
      /* Don't fight loaders that will paint soon — soft empty plaque */
      if (el.classList.contains("loading-msg")) {
        if (!el.querySelector(".nx-ico")) {
          el.insertBefore(ico("nx-ico-empty", false), el.firstChild);
        }
        return;
      }
      if (el.querySelector(".nx-empty-state")) return;
      var box = d.createElement("div");
      box.className = "nx-empty-state";
      box.innerHTML =
        '<span class="nx-ico nx-ico-empty lg" aria-hidden="true"></span><div><strong>Preparing this section</strong><div>' +
        emptyMessage(el) +
        '</div><span class="disc">Educational only — not a fatwa.</span></div>';
      /* only inject if still empty-ish */
      if (isVisuallyEmpty(el)) {
        el.appendChild(box);
        el.classList.add("nx-empty-done");
      }
    });
  }

  function run() {
    iconizePaths();
    iconizeArchBadges(d);
    iconizeEmpty();
  }

  function watch() {
    run();
    var mount = d.getElementById("cs-mount");
    if (mount) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(function () {
          iconizeArchBadges(mount);
          iconizeEmpty(mount);
          iconizePaths();
        }, 100);
      }).observe(mount, { childList: true, subtree: true });
    }
    setTimeout(run, 500);
    setTimeout(run, 1600);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", watch);
  else watch();
})(window, document);
