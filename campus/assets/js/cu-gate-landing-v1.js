/*! cu-gate-landing-v1 · U25F final order
 * Room nav → Banner → Gate + Write → body
 * Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_GATE_LANDING_V1F__) return;
  w.__CU_GATE_LANDING_V1F__ = true;

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
        el.innerHTML = (el.innerHTML || "").replace(
          /University room \(archive3 campus base\)\./gi,
          "University room · on-device path."
        );
        el.innerHTML = (el.innerHTML || "").replace(/archive3 campus base/gi, "on-device path");
      }
    });
  }

  function findBanner() {
    return (
      d.querySelector("#cu-banner") ||
      d.querySelector("header.cu-hero") ||
      d.querySelector("header.cu-banner") ||
      d.querySelector(".cu-hero")
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

  /** Final order: room nav (left alone) → banner → gate → write → rest */
  function orderDom() {
    var banner = findBanner();
    var gate = ensureGate();
    var back = ensureBack();
    var write = d.getElementById("cu-write-clarity") || d.querySelector(".cu-write-clarity");
    var main = d.querySelector("main.adm-stage, main.cu-wrap, .cu-landing-wrap, main") || d.body;

    // Place banner high in main if needed — after room nav is already outside main typically
    var roomNav = d.querySelector("nav.clarity-room-nav");
    if (banner && roomNav && banner.compareDocumentPosition(roomNav) & Node.DOCUMENT_POSITION_FOLLOWING) {
      // banner is before room nav in DOM — move banner after room nav
      if (roomNav.parentNode) {
        roomNav.parentNode.insertBefore(banner, roomNav.nextSibling);
      }
    }

    var anchor = banner || roomNav;
    var parent = (anchor && anchor.parentNode) || main;

    // Insert gate right after banner
    if (gate.parentNode) gate.parentNode.removeChild(gate);
    if (back.parentNode) back.parentNode.removeChild(back);
    if (anchor && anchor.parentNode) {
      var ref = anchor.nextSibling;
      parent.insertBefore(gate, ref);
      parent.insertBefore(back, gate.nextSibling);
    } else {
      main.insertBefore(gate, main.firstChild);
      main.insertBefore(back, gate.nextSibling);
    }

    // Write immediately after gate block (back)
    if (write) {
      if (write.parentNode) write.parentNode.removeChild(write);
      var after = back.nextSibling;
      parent.insertBefore(write, after);
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
        if (h.nextElementSibling) h.nextElementSibling.classList.add("cu-gate-hide-on-gate", "cu-gate-return-only");
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
  setTimeout(boot, 120);
  setTimeout(boot, 500);
  setTimeout(boot, 1100);
})(window, document);
