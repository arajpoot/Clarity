/*! cu-gate-landing-v1 · U25W · Write closes landing above footer
 * Visual order: Room nav → cu-banner bar → cu-hero → path → GATE → WRITE → body
 * Anchor is header.cu-hero (big banner), NOT the slim #cu-banner theme bar.
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_GATE_LANDING_V1W__) return;
  w.__CU_GATE_LANDING_V1W__ = true;

  var KEY = "cu_uni_admit_v1";
  var MODE_KEY = "cu_campus_gate_mode_v1";

  function isLanding() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "";
    return p === "/campus" || p === "";
  }

  function loadAdmit() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setMode(mode) {
    d.documentElement.setAttribute("data-campus-gate", mode);
    if (d.body) d.body.setAttribute("data-campus-gate", mode);
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch (e) {}
  }

  function getSavedMode() {
    try {
      return localStorage.getItem(MODE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function removeDupTwoway() {
    d.querySelectorAll("#cu-twoway-path, .cu-twoway, [data-clarity-owned='twoway-v1']").forEach(function (el) {
      try {
        el.parentNode && el.parentNode.removeChild(el);
      } catch (e) {}
    });
  }

  function softArchiveNote() {
    d.querySelectorAll("#university-isolation-note, .cu-archive-note, p, .cu-note").forEach(function (el) {
      if (/archive3/i.test(el.textContent || "")) {
        el.innerHTML = (el.innerHTML || "")
          .replace(/University room \(archive3 campus base\)\./gi, "University room · on-device path.")
          .replace(/archive3 campus base/gi, "on-device path");
      }
    });
  }

  /** Big welcome banner — not the slim theme bar */
  function findHero() {
    return d.querySelector("header.cu-hero") || d.querySelector(".cu-hero");
  }

  function findPathRail() {
    return (
      d.querySelector(".cu-path-rail") ||
      d.querySelector("nav.cu-pills") ||
      d.querySelector("[data-cu-path-rail]") ||
      d.querySelector(".cu-smart-stages")
    );
  }

  function ensureGate() {
    var existing = d.getElementById("cu-gate-block");
    if (existing) return existing;
    var wrap = d.createElement("section");
    wrap.id = "cu-gate-block";
    wrap.className = "cu-gate-block";
    wrap.setAttribute("data-clarity-owned", "gate-v1");
    wrap.innerHTML =
      '<h2 class="cu-gate-title">Enter Campus</h2>' +
      '<p class="cu-gate-lead">Two doors. Progress and preferred name stay on <strong>this device</strong> only.</p>' +
      '<div class="cu-gate-grid">' +
      '  <article class="cu-gate-card" data-gate="new">' +
      "    <h3>New seeker</h3>" +
      "    <p>Read the Charter limits, register a preferred name on this device, then Orientation — before the first desk module.</p>" +
      '    <div class="cu-g-actions">' +
      '      <button type="button" class="cu-g-btn primary" data-gate-go="new">Start as new</button>' +
      '      <a href="/campus/charter/">Charter</a>' +
      '      <a href="/campus/orientation/">Orientation</a>' +
      "    </div>" +
      "  </article>" +
      '  <article class="cu-gate-card" data-gate="return">' +
      "    <h3>Returning student</h3>" +
      "    <p>If you registered a preferred name here before, it is still in this browser’s storage — not on Clarity servers. Continue at the portal or desk.</p>" +
      '    <div class="cu-g-actions">' +
      '      <button type="button" class="cu-g-btn primary" data-gate-go="return">Continue as returning</button>' +
      '      <a href="/campus/portal/">Student portal</a>' +
      '      <a href="/campus/desk/">Seeker desk</a>' +
      "    </div>" +
      "  </article>" +
      "</div>" +
      '<p class="cu-gate-stamp">Educational only — not a fatwa · not a grade of īmān · not a seminary</p>';
    return wrap;
  }

  function ensureBack() {
    var back = d.querySelector(".cu-gate-back");
    if (back) return back;
    back = d.createElement("div");
    back.className = "cu-gate-back";
    back.innerHTML = '<button type="button" data-gate-go="gate">← Both doors again</button>';
    return back;
  }

  function placeAfter(node, ref) {
    if (!node || !ref || !ref.parentNode) return;
    if (node.parentNode) node.parentNode.removeChild(node);
    if (ref.nextSibling) ref.parentNode.insertBefore(node, ref.nextSibling);
    else ref.parentNode.appendChild(node);
  }

  /**
   * Order: room nav (untouched) → #cu-banner → isolation → hero → path rail
   *        → GATE → back → WRITE → rest of main
   */
  function orderDom() {
    var roomNav = d.querySelector("nav.clarity-room-nav");
    var slim = d.querySelector("#cu-banner, header.cu-banner");
    var hero = findHero();
    var path = findPathRail();
    var gate = ensureGate();
    var back = ensureBack();
    var write = d.getElementById("cu-write-clarity") || d.querySelector(".cu-write-clarity");
    var iso = d.getElementById("university-isolation-note");
    var main = d.querySelector("main.adm-stage, main.cu-wrap, main") || d.body;

    // Keep slim banner just under room nav
    if (slim && roomNav && roomNav.parentNode) {
      placeAfter(slim, roomNav);
    }

    // Hero under slim banner (or under room nav)
    if (hero) {
      var afterSlim = slim || roomNav;
      if (afterSlim) placeAfter(hero, afterSlim);
    }

    // Path rail under hero
    if (path && hero) placeAfter(path, hero);

    // Isolation note: under slim / above hero for quiet context, or under path
    if (iso && hero) {
      try {
        placeAfter(iso, path || hero);
      } catch (e) {}
    }

    // GATE after path (or hero)
    var anchor = path || hero || slim || roomNav;
    if (anchor) {
      placeAfter(gate, anchor);
      placeAfter(back, gate);
    } else {
      main.insertBefore(gate, main.firstChild);
      placeAfter(back, gate);
    }

    // WRITE closes the landing — immediately before footer (not mid-page)
    if (write) {
      var foot = d.querySelector("footer.cu-foot, footer.cu-niyyah-footer, footer");
      if (foot && foot.parentNode) {
        foot.parentNode.insertBefore(write, foot);
      } else if (back) {
        placeAfter(write, back);
      }
    }

    function onGo(ev) {
      var t = ev.target.closest("[data-gate-go]");
      if (!t) return;
      var go = t.getAttribute("data-gate-go");
      if (go === "new") {
        setMode("new");
        var steps = d.getElementById("adm-steps") || d.querySelector(".adm-panel");
        if (steps) steps.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (go === "return") {
        setMode("return");
        var cont = d.getElementById("seq-continue-slot") || d.querySelector(".seq-stage-map");
        if (cont) cont.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (go === "gate") {
        setMode("gate");
        gate.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    gate.onclick = onGo;
    back.onclick = onGo;
  }

  function markProgressive() {
    var hideOnGate = [
      "#seq-continue-slot",
      ".seq-stage-map",
      "#adm-steps",
      ".adm-panel",
      "#adm-returning",
      "#seq-after-clarity",
      "#adm-faculty-slot",
      ".cu-journey-slim"
    ];
    d.querySelectorAll("h2.cu-sec, h2").forEach(function (h) {
      var t = h.textContent || "";
      if (/continue learning/i.test(t)) {
        h.classList.add("cu-gate-hide-on-gate", "cu-gate-return-only");
        if (h.nextElementSibling)
          h.nextElementSibling.classList.add("cu-gate-hide-on-gate", "cu-gate-return-only");
      }
      if (/how phases work/i.test(t)) {
        h.classList.add("cu-gate-hide-on-gate");
        if (h.nextElementSibling) h.nextElementSibling.classList.add("cu-gate-hide-on-gate");
      }
    });
    hideOnGate.forEach(function (sel) {
      d.querySelectorAll(sel).forEach(function (el) {
        el.classList.add("cu-gate-hide-on-gate");
      });
    });
    d.querySelectorAll(".adm-panel, #adm-steps").forEach(function (el) {
      el.classList.add("cu-gate-new-only");
    });
    d.querySelectorAll("#seq-continue-slot, .seq-stage-map, #adm-returning").forEach(function (el) {
      el.classList.add("cu-gate-return-only");
      el.classList.remove("cu-gate-new-only");
    });
  }

  function boot() {
    if (!isLanding()) return;
    try {
      removeDupTwoway();
      softArchiveNote();
      orderDom();
      markProgressive();
      var admit = loadAdmit();
      var saved = getSavedMode();
      if (saved === "new" || saved === "return" || saved === "gate") setMode(saved);
      else if (admit && admit.name) setMode("return");
      else setMode("gate");
      if (admit && admit.name) {
        var card = d.querySelector('.cu-gate-card[data-gate="return"] p');
        if (card) {
          card.innerHTML =
            "Preferred name on this device: <strong>" +
            String(admit.name).replace(/[<>]/g, "") +
            "</strong>. It is not sent to Clarity servers. Continue at the portal or desk.";
        }
      }
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 100);
  setTimeout(boot, 400);
  setTimeout(boot, 900);
  // After smart-nav late injects
  setTimeout(boot, 1800);
})(window, document);
