/*! cu-smart-nav-v1.3 · elite + locked campus pill hrefs
 * Layer1 rooms sticky top · path/halls glass below university banner
 * Suppresses legacy rails · campus only · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CU_SMART_NAV_V12__) return;
  w.__CU_SMART_NAV_V12__ = true;

  var ROOMS = [
    { href: "/", label: "Port", ico: "P" },
    { href: "/companion/", label: "Companion", ico: "C" },
    { href: "/daily/", label: "Yawm", ico: "Y" },
    { href: "/campus/", label: "University", ico: "U", room: "university" },
    { href: "/amana/", label: "Amānah", ico: "A" },
    { href: "/craft/", label: "Craft", ico: "K" }
  ];
  var STAGES = [
    { href: "/campus/desk/", label: "Desk" },
    { href: "/campus/desk/seeker/", label: "Seeker", stage: "seeker" },
    { href: "/campus/desk/practice/", label: "Practice", stage: "practice" },
    { href: "/campus/desk/consistency/", label: "Consistency", stage: "consistency" },
    { href: "/campus/desk/transmission/", label: "Transmission", stage: "transmission" },
    { href: "/campus/grading.html", label: "Progress" }
  ];
  var MORE = [
    { href: "/campus/", label: "Campus home" },
    { href: "/campus/desk/foundation/", label: "Foundation" },
    { href: "/campus/desk/pillars/", label: "Pillars" },
    { href: "/campus/desk/ihsan/", label: "Iḥsān" },
    { href: "/campus/desk/amanah/", label: "Amānah module" },
    { href: "/campus/assignments/", label: "Assignments" },
    { href: "/campus/faculty", label: "Faculty" },
    { href: "/campus/bots", label: "Bots" },
    { href: "/campus/lab/", label: "Lab" },
    { href: "/campus/library/", label: "Library" },
    { href: "/campus/buddy/", label: "Buddy" },
    { href: "/campus/portal/", label: "Portal" },
    { href: "/campus/journey/", label: "Journey" },
    { href: "/campus/orientation/", label: "Orientation" },
    { href: "/campus/schedule/", label: "Schedule" },
    { href: "/campus/transcript/", label: "Transcript" },
    { href: "/campus/diploma/", label: "Diploma" },
    { href: "/campus/mirath/", label: "Mīrāth" },
    { href: "/campus/vault/", label: "Campus vault" },
    { href: "/campus/charter/", label: "Charter" }
  ];

  
  function lockCampusAnchors(root) {
    var scope = root || d;
    scope.querySelectorAll("a[data-cu-nav]").forEach(function (a) {
      var want = a.getAttribute("data-cu-href") || a.getAttribute("href");
      if (!want || want.charAt(0) !== "/") return;
      /* Never allow Port (/) for labeled campus tools */
      if (want === "/" || want.indexOf("/campus") !== 0) {
        /* rooms bar may use / companion daily amana craft — those keep data-cu-nav=room */
        if (a.getAttribute("data-cu-nav") === "room") return;
      }
      if (a.getAttribute("data-cu-nav") === "campus" || a.getAttribute("data-cu-nav") === "path") {
        if (want.indexOf("/campus") === 0) {
          a.setAttribute("href", want);
          a.setAttribute("data-cu-href", want);
        }
      }
    });
  }

  function stamp(a, href, kind) {
    a.href = href;
    a.setAttribute("href", href);
    a.setAttribute("data-cu-href", href);
    a.setAttribute("data-cu-nav", kind || "campus");
    a.setAttribute("data-path-wire", "skip");
  }

  function path() {
    return (location.pathname || "/").replace(/\/+$/, "") || "/";
  }
  function isHere(href) {
    var p = path();
    var h = (href || "").replace(/\/+$/, "") || "/";
    if (h === "/") return p === "/";
    if (h === "/campus") return p === "/campus";
    return p === h || p.indexOf(h + "/") === 0;
  }
  function crumb() {
    var p = path();
    var parts = [{ href: "/campus/", label: "Campus" }];
    if (p.indexOf("/campus/desk") === 0) {
      parts.push({ href: "/campus/desk/", label: "Desk" });
      var m = p.match(/\/campus\/desk\/([^/]+)/);
      if (m) parts.push({ href: "/campus/desk/" + m[1] + "/", label: m[1].charAt(0).toUpperCase() + m[1].slice(1) });
    } else if (p.indexOf("/campus/") === 0 && p !== "/campus") {
      var seg = p.replace(/^\/campus\//, "").split("/")[0].replace(/\.html$/, "");
      if (seg) parts.push({ href: p, label: seg.charAt(0).toUpperCase() + seg.slice(1) });
    }
    return parts;
  }

  function suppressLegacy() {
    d.documentElement.classList.add("cu-elite-on", "cu-smart-nav-on");
    var selectors = [
      "#cu-uni-path", "#cu-uni-journey", "#cu-site-rail", "#cu-curr-rail",
      ".clarity-room-nav", "[data-room-nav]", ".cu-banner"
    ];
    selectors.forEach(function (sel) {
      d.querySelectorAll(sel).forEach(function (el) {
        el.setAttribute("data-sn-suppressed", "1");
        el.style.display = "none";
      });
    });
    /* Hide concatenated dump nodes */
    try {
      Array.prototype.forEach.call(d.body.children, function (el) {
        if (el.id === "cu-smart-nav" || el.id === "cu-sn-below" || el.classList.contains("cu-elite-banner")) return;
        var t = (el.textContent || "").replace(/\s+/g, "");
        if (t.indexOf("CampusDeskSeeker") === 0 || (el.tagName === "A" && t.length > 60)) {
          el.style.display = "none";
        }
      });
    } catch (e) {}
  }

  function buildRoomsBar() {
    if (d.getElementById("cu-smart-nav")) return d.getElementById("cu-smart-nav");
    var root = d.createElement("header");
    root.id = "cu-smart-nav";
    root.className = "sn-root sn-elite";
    root.setAttribute("role", "banner");

    var top = d.createElement("div");
    top.className = "sn-top";

    var brand = d.createElement("a");
    brand.className = "sn-brand";
    brand.href = "/campus/";
    brand.innerHTML = "<small>University</small><span>Clarity</span>";
    top.appendChild(brand);

    var rooms = d.createElement("nav");
    rooms.className = "sn-rooms";
    rooms.setAttribute("aria-label", "Clarity rooms");
    ROOMS.forEach(function (r) {
      var a = d.createElement("a");
      a.className = "sn-room" + (isHere(r.href) || (r.room === "university" && path().indexOf("/campus") === 0) ? " is-here" : "");
      stamp(a, r.href, "room");
      a.innerHTML = '<span class="sn-ico" aria-hidden="true">' + r.ico + "</span>" + r.label;
      rooms.appendChild(a);
    });
    top.appendChild(rooms);
    root.appendChild(top);
    d.body.insertBefore(root, d.body.firstChild);
    return root;
  }

  function ensureBanner() {
    var existing = d.querySelector(".cu-elite-banner");
    if (existing) return existing;
    /* Prefer promote existing hero if present */
    var hero = d.querySelector(".cu-hero, .cu-info-plaque, main .cu-plaque");
    var banner = d.createElement("div");
    banner.className = "cu-elite-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Clarity University");
    var inner = d.createElement("div");
    inner.className = "cu-elite-banner-inner";
    inner.innerHTML =
      '<p class="bismillah" lang="ar">بِسْمِ ٱللَّهِ</p>' +
      "<h1>Clarity University</h1>" +
      '<p class="lead">Sequential on-device path: Seeker → Practice → Consistency → Transmission. Progress stays on this device.</p>' +
      '<p class="limits">Educational only — not a fatwa · not a grade of īmān · not a seminary</p>';
    banner.appendChild(inner);
    var rooms = d.getElementById("cu-smart-nav");
    if (rooms && rooms.nextSibling) rooms.parentNode.insertBefore(banner, rooms.nextSibling);
    else d.body.insertBefore(banner, d.body.firstChild);
    return banner;
  }

  function buildBelow(banner) {
    if (d.getElementById("cu-sn-below")) return;
    var wrap = d.createElement("div");
    wrap.id = "cu-sn-below";
    wrap.className = "sn-below";
    var plaque = d.createElement("div");
    plaque.className = "sn-below-plaque";

    var crumbEl = d.createElement("div");
    crumbEl.className = "sn-crumb";
    crumb().forEach(function (c, i) {
      if (i) {
        var sep = d.createElement("span");
        sep.className = "sep";
        sep.textContent = "·";
        crumbEl.appendChild(sep);
      }
      var a = d.createElement("a");
      a.href = c.href;
      a.textContent = c.label;
      crumbEl.appendChild(a);
    });
    plaque.appendChild(crumbEl);

    var layer2 = d.createElement("nav");
    layer2.className = "sn-layer2";
    layer2.setAttribute("aria-label", "Ordered path");
    var gl = d.createElement("span");
    gl.className = "sn-group-label";
    gl.textContent = "Path";
    layer2.appendChild(gl);
    var stage = (d.body && d.body.getAttribute("data-seq-stage")) || "";
    STAGES.forEach(function (s) {
      var a = d.createElement("a");
      a.className = "sn-pill";
      stamp(a, s.href, "path");
      a.textContent = s.label;
      if (isHere(s.href) || (s.stage && s.stage === stage)) a.classList.add("is-here");
      try {
        if (s.stage && w.CuSeq && CuSeq.isStageUnlocked && !CuSeq.isStageUnlocked(s.stage)) {
          a.classList.add("is-locked");
          a.title = "Complete previous stage first";
        }
      } catch (e) {}
      layer2.appendChild(a);
    });
    plaque.appendChild(layer2);

    var actions = d.createElement("div");
    actions.className = "sn-below-actions";
    var moreBtn = d.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "sn-more-btn";
    moreBtn.setAttribute("aria-expanded", "false");
    moreBtn.textContent = "More · halls & modules";
    actions.appendChild(moreBtn);
    plaque.appendChild(actions);

    var drawer = d.createElement("div");
    drawer.className = "sn-drawer";
    drawer.id = "sn-drawer";
    drawer.hidden = true;
    var grid = d.createElement("div");
    grid.className = "sn-drawer-grid";
    MORE.forEach(function (m) {
      var a = d.createElement("a");
      stamp(a, m.href, "campus");
      a.textContent = m.label;
      if (isHere(m.href)) a.className = (a.className ? a.className + " " : "") + "is-here";
      grid.appendChild(a);
    });
    drawer.appendChild(grid);
    var hint = d.createElement("p");
    hint.className = "sn-hint";
    hint.textContent = "Educational only — not a fatwa. Path stays clear; halls live under More.";
    drawer.appendChild(hint);
    plaque.appendChild(drawer);

    moreBtn.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.hidden = !open;
    });

    wrap.appendChild(plaque);
    if (banner && banner.nextSibling) banner.parentNode.insertBefore(wrap, banner.nextSibling);
    else if (banner) banner.parentNode.appendChild(wrap);
    else d.body.insertBefore(wrap, d.body.firstChild);
  }

  function boot() {
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var p = path();
    if (room !== "university" && p.indexOf("/campus") !== 0) return;
    suppressLegacy();
    buildRoomsBar();
    var banner = ensureBanner();
    buildBelow(banner);
    setTimeout(suppressLegacy, 120);
    setTimeout(function () { suppressLegacy(); lockCampusAnchors(d); }, 500);
    setTimeout(function () { suppressLegacy(); lockCampusAnchors(d); }, 1500);
    setTimeout(function () { lockCampusAnchors(d); }, 2500);
    /* Click capture: force campus targets even if another script rewrote href */
    d.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("a[data-cu-nav]") : null;
      if (!a) return;
      var want = a.getAttribute("data-cu-href");
      if (!want) return;
      if (a.getAttribute("href") !== want) a.setAttribute("href", want);
    }, true);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
