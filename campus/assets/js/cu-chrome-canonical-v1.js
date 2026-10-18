
/**
 * Clarity University — Canonical Chrome Controller
 * One banner + one Map-style pill rail on every university page.
 * Destroys topstrip, duplicate themes, and late injectors.
 * Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_CHROME_CANONICAL_V1__) return;
  g.__CU_CHROME_CANONICAL_V1__ = true;

  var VER = "20261018CANON";
  var LINKS = [
    { href: "/charter/", label: "Charter", icon: "◇" },
    { href: "/campus/", label: "Map", icon: "▣" },
    { href: "/campus/desk/", label: "Desk", icon: "☰" },
    { href: "/lab/", label: "Lab", icon: "◈" },
    { href: "/library/", label: "Library", icon: "▦" },
    { href: "/campus/buddy/", label: "Buddy", icon: "✦" },
    { href: "/vault/", label: "Vault", icon: "◎" }
  ];

  function path() {
    return (location.pathname || "/").replace(/\/+$/, "") || "/";
  }

  function isUniversity() {
    var p = path();
    return (
      p === "/charter" ||
      p.indexOf("/campus") === 0 ||
      p.indexOf("/lab") === 0 ||
      p.indexOf("/library") === 0 ||
      p.indexOf("/vault") === 0
    );
  }

  function activeLabel() {
    var p = path();
    if (p === "/charter") return "Charter";
    if (p === "/campus" || p === "/campus/") return "Map";
    if (p.indexOf("/campus/desk") === 0) return "Desk";
    if (p.indexOf("/lab") === 0) return "Lab";
    if (p.indexOf("/library") === 0) return "Library";
    if (p.indexOf("/campus/buddy") === 0) return "Buddy";
    if (p.indexOf("/vault") === 0) return "Vault";
    if (p.indexOf("/campus/transcript") === 0 || p.indexOf("/campus/diploma") === 0 ||
        p.indexOf("/campus/assignments") === 0 || p.indexOf("/campus/schedule") === 0)
      return "Desk";
    return "Map";
  }

  function ensureCss() {
    if (document.getElementById("cu-chrome-canon-css")) return;
    var l = document.createElement("link");
    l.id = "cu-chrome-canon-css";
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-chrome-canonical-v1.css?v=" + VER;
    document.head.appendChild(l);
  }

  function wireThemes(box) {
    box.querySelectorAll("[data-cu-theme]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-cu-theme") || "system";
        try {
          if (t === "system" || t === "auto") {
            var dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
            localStorage.setItem("cu_theme_v1", "system");
          } else {
            document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark");
            localStorage.setItem("cu_theme_v1", t === "light" ? "light" : "dark");
          }
        } catch (e) {}
      });
    });
  }

  function buildBanner() {
    var el = document.createElement("header");
    el.className = "cu-banner cu-banner-canonical";
    el.setAttribute("data-cu-canon", "1");
    el.innerHTML =
      '<a class="cu-brand" href="/charter/">' +
      '<span class="cu-brand-mark" aria-hidden="true">ن</span>' +
      "<div><small>University</small><strong>Clarity University</strong></div></a>" +
      '<div class="cu-banner-actions">' +
      '<button type="button" class="cu-theme-pill" data-cu-theme="light">Day</button>' +
      '<button type="button" class="cu-theme-pill" data-cu-theme="dark">Night</button>' +
      '<button type="button" class="cu-theme-pill" data-cu-theme="system">Auto</button>' +
      '<a class="cu-main-link" href="/">← Companion</a>' +
      "</div>";
    wireThemes(el);
    return el;
  }

  function buildPills() {
    var active = activeLabel();
    var nav = document.createElement("nav");
    nav.className = "cu-pills cu-pills-canonical";
    nav.setAttribute("aria-label", "Campus");
    nav.setAttribute("data-cu-canon", "1");
    nav.innerHTML = LINKS.map(function (item) {
      var here =
        item.label === active
          ? ' class="here" aria-current="page"'
          : "";
      return (
        '<a href="' +
        item.href +
        '"' +
        here +
        "><span class=\"cu-pill-ico\" aria-hidden=\"true\">" +
        item.icon +
        "</span> " +
        item.label +
        "</a>"
      );
    }).join("");
    return nav;
  }

  function stripFighters(root) {
    root = root || document;
    try {
      root.querySelectorAll(".cu-topstrip").forEach(function (n) {
        n.remove();
      });
      root.querySelectorAll(".cu-theme-bar, .cu-ui-chrome-extra-themes, .cu-ui-extra-themes").forEach(function (n) {
        n.remove();
      });
      /* duplicate banners */
      var banners = root.querySelectorAll("header.cu-banner, .cu-banner");
      if (banners.length > 1) {
        banners.forEach(function (b, i) {
          if (i > 0 && !b.getAttribute("data-cu-canon")) b.remove();
        });
      }
      /* duplicate pill rails */
      var pills = root.querySelectorAll("nav.cu-pills, .cu-pills");
      if (pills.length > 1) {
        pills.forEach(function (p, i) {
          if (i > 0 && !p.getAttribute("data-cu-canon")) p.remove();
        });
      }
      /* extra theme pills outside canonical banner */
      document.querySelectorAll("[data-cu-theme]").forEach(function (btn) {
        if (!btn.closest(".cu-banner-canonical")) {
          /* leave alone if inside canonical; remove orphans */
          if (!btn.closest("header.cu-banner")) btn.remove();
        }
      });
    } catch (e) {}
  }

  function mount() {
    if (!isUniversity()) return;
    ensureCss();
    document.body.classList.add("cu-page", "cu-canon-chrome");

    stripFighters(document);

    var main =
      document.querySelector("main.cu-wrap") ||
      document.querySelector("main") ||
      null;

    /* Banner: replace or insert */
    var oldBanner = document.querySelector("header.cu-banner, .cu-banner");
    var banner = buildBanner();
    if (oldBanner && oldBanner.parentNode) {
      oldBanner.parentNode.replaceChild(banner, oldBanner);
    } else if (main && main.parentNode) {
      main.parentNode.insertBefore(banner, main);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    /* Pills: inside main, first child */
    var oldPills = document.querySelector("nav.cu-pills, .cu-pills");
    var pills = buildPills();
    if (main) {
      if (oldPills && main.contains(oldPills)) {
        oldPills.parentNode.replaceChild(pills, oldPills);
      } else {
        main.insertBefore(pills, main.firstChild);
      }
    } else if (oldPills && oldPills.parentNode) {
      oldPills.parentNode.replaceChild(pills, oldPills);
    }

    stripFighters(document);
  }

  var obs = null;
  function watch() {
    if (obs) return;
    var ticks = 0;
    obs = new MutationObserver(function () {
      ticks++;
      if (ticks > 40) {
        try {
          obs.disconnect();
        } catch (e) {}
        return;
      }
      /* only react if fighters reappear */
      if (
        document.querySelector(".cu-topstrip") ||
        document.querySelectorAll("header.cu-banner, .cu-banner").length > 1 ||
        document.querySelectorAll("nav.cu-pills, .cu-pills").length > 1
      ) {
        mount();
      }
    });
    try {
      obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch (e) {}
    setTimeout(function () {
      try {
        obs.disconnect();
      } catch (e) {}
    }, 5000);
  }

  function boot() {
    try {
      mount();
      watch();
      setTimeout(mount, 200);
      setTimeout(mount, 800);
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(typeof window !== "undefined" ? window : this);
