/*! cu-smart-nav-v1 · single campus navigation engine
 * Model: sticky global rooms + context strip + overflow drawer
 * Dedupes legacy rails (uni-nav, site-rail, curr-rail, stage-nav, path dumps)
 * Campus / university only · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CU_SMART_NAV_V1__) return;
  w.__CU_SMART_NAV_V1__ = true;

  var ROOMS = [
    { href: "/", label: "Port", ico: "P" },
    { href: "/companion/", label: "Companion", ico: "C" },
    { href: "/daily/", label: "Yawm", ico: "Y" },
    { href: "/campus/", label: "University", ico: "U", room: "university" },
    { href: "/amana/", label: "Amānah", ico: "A" },
    { href: "/craft/", label: "Craft", ico: "K" }
  ];

  /* Layer 2 — primary curriculum (always visible, scrollable) */
  var STAGES = [
    { href: "/campus/desk/", label: "Desk" },
    { href: "/campus/desk/seeker/", label: "Seeker", stage: "seeker" },
    { href: "/campus/desk/practice/", label: "Practice", stage: "practice" },
    { href: "/campus/desk/consistency/", label: "Consistency", stage: "consistency" },
    { href: "/campus/desk/transmission/", label: "Transmission", stage: "transmission" },
    { href: "/campus/grading.html", label: "Progress" }
  ];

  /* Drawer — secondary halls / classic modules (not duplicated on layer 2) */
  var MORE = [
    { href: "/campus/", label: "Campus home" },
    { href: "/campus/desk/foundation/", label: "Foundation" },
    { href: "/campus/desk/pillars/", label: "Pillars" },
    { href: "/campus/desk/ihsan/", label: "Iḥsān" },
    { href: "/campus/desk/amanah/", label: "Amānah module" },
    { href: "/campus/assignments/", label: "Assignments" },
    { href: "/campus/faculty.html", label: "Faculty" },
    { href: "/campus/bots.html", label: "Bots" },
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
      if (m) {
        var lab = m[1].charAt(0).toUpperCase() + m[1].slice(1);
        parts.push({ href: "/campus/desk/" + m[1] + "/", label: lab });
      }
    } else if (p.indexOf("/campus/") === 0 && p !== "/campus") {
      var seg = p.replace(/^\/campus\//, "").split("/")[0].replace(/\.html$/, "");
      if (seg) parts.push({ href: p, label: seg.charAt(0).toUpperCase() + seg.slice(1) });
    }
    return parts;
  }

  function suppressLegacy() {
    d.documentElement.classList.add("cu-smart-nav-on");
    /* Remove injected uni-path / broken text-only dumps */
    ["cu-uni-path", "cu-uni-journey", "cu-site-rail", "cu-curr-rail"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) el.setAttribute("data-sn-suppressed", "1");
    });
    /* Hide any top-level naked link rows that look like concatenated dumps */
    try {
      var kids = d.body.children;
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el.id === "cu-smart-nav") continue;
        if (el.tagName === "A" && (el.textContent || "").length > 80) {
          el.style.display = "none";
        }
        if (el.tagName === "DIV" || el.tagName === "NAV" || el.tagName === "P") {
          var t = (el.textContent || "").replace(/\s+/g, "");
          if (t.indexOf("CampusDeskSeeker") === 0 || t.indexOf("SeekerPracticeConsistency") >= 0) {
            el.style.display = "none";
          }
        }
      }
    } catch (e) {}
  }

  function build() {
    if (d.getElementById("cu-smart-nav")) return;
    var root = d.createElement("header");
    root.id = "cu-smart-nav";
    root.className = "sn-root";
    root.setAttribute("role", "banner");

    var top = d.createElement("div");
    top.className = "sn-top";

    var brand = d.createElement("a");
    brand.className = "sn-brand";
    brand.href = "/campus/";
    brand.innerHTML = "<div><small>University</small>Clarity</div>";
    top.appendChild(brand);

    var rooms = d.createElement("nav");
    rooms.className = "sn-rooms";
    rooms.setAttribute("aria-label", "Clarity rooms");
    ROOMS.forEach(function (r) {
      var a = d.createElement("a");
      a.className = "sn-room" + (isHere(r.href) || (r.room === "university" && path().indexOf("/campus") === 0) ? " is-here" : "");
      a.href = r.href;
      a.innerHTML = '<span class="sn-ico" aria-hidden="true">' + r.ico + "</span>" + r.label;
      rooms.appendChild(a);
    });
    top.appendChild(rooms);

    var moreBtn = d.createElement("button");
    moreBtn.type = "button";
    moreBtn.className = "sn-more-btn";
    moreBtn.setAttribute("aria-expanded", "false");
    moreBtn.setAttribute("aria-controls", "sn-drawer");
    moreBtn.textContent = "More · halls";
    top.appendChild(moreBtn);

    root.appendChild(top);

    /* Breadcrumb */
    var crumbEl = d.createElement("div");
    crumbEl.className = "sn-crumb";
    crumbEl.setAttribute("aria-label", "Location");
    var parts = crumb();
    parts.forEach(function (c, i) {
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
    root.appendChild(crumbEl);

    /* Layer 2 stages */
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
      a.href = s.href;
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
    root.appendChild(layer2);

    /* Drawer */
    var drawer = d.createElement("div");
    drawer.id = "sn-drawer";
    drawer.className = "sn-drawer";
    drawer.setAttribute("hidden", "");
    var grid = d.createElement("div");
    grid.className = "sn-drawer-grid";
    MORE.forEach(function (m) {
      var a = d.createElement("a");
      a.href = m.href;
      a.textContent = m.label;
      if (isHere(m.href)) a.className = "is-here";
      grid.appendChild(a);
    });
    drawer.appendChild(grid);
    var hint = d.createElement("p");
    hint.className = "sn-hint";
    hint.textContent = "Educational only — not a fatwa. Halls & classic modules live here so the path rail stays clean.";
    drawer.appendChild(hint);
    root.appendChild(drawer);

    moreBtn.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) drawer.removeAttribute("hidden");
      else drawer.setAttribute("hidden", "");
    });

    d.body.insertBefore(root, d.body.firstChild);
  }

  function boot() {
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var p = path();
    if (room !== "university" && p.indexOf("/campus") !== 0) return;
    suppressLegacy();
    build();
    /* Re-suppress after late injects (uni-nav, rails) */
    setTimeout(suppressLegacy, 100);
    setTimeout(suppressLegacy, 400);
    setTimeout(suppressLegacy, 1200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);
