/*! cu-gate-landing-v1 · U25H polished
 * Single gate · hide U24 twoway · place after banner · progressive body
 * KEY cu_uni_admit_v1 · Educational only — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_GATE_LANDING_V1H__) return;
  w.__CU_GATE_LANDING_V1H__ = true;

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
    d.querySelectorAll("#university-isolation-note, .cu-archive-note").forEach(function (el) {
      var t = el.textContent || "";
      if (/archive3/i.test(t)) {
        el.textContent =
          "University room · on-device path. Path markers and progress are a study mirror, not a grade of īmān. Amānah vault is at /amana/. Educational only — not a fatwa.";
      }
    });
    // also scan paragraphs
    d.querySelectorAll("p, .cu-note, .edu-stamp").forEach(function (el) {
      if (/archive3 campus base/i.test(el.textContent || "")) {
        el.innerHTML = (el.innerHTML || "").replace(
          /University room \(archive3 campus base\)\./gi,
          "University room · on-device path."
        );
      }
    });
  }

  function ensureGate() {
    if (d.getElementById("cu-gate-block")) return d.getElementById("cu-gate-block");
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

    var back = d.createElement("div");
    back.className = "cu-gate-back";
    back.innerHTML = '<button type="button" data-gate-go="gate">← Both doors again</button>';

    var anchor =
      d.querySelector("#cu-banner") ||
      d.querySelector("header.cu-hero") ||
      d.querySelector("header.cu-banner") ||
      d.querySelector(".cu-hero");
    var parent = (anchor && anchor.parentNode) || d.querySelector("main") || d.body;
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) parent.insertBefore(wrap, anchor.nextSibling);
      else parent.appendChild(wrap);
    } else {
      parent.insertBefore(wrap, parent.firstChild);
    }
    wrap.parentNode.insertBefore(back, wrap.nextSibling);

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
        wrap.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    wrap.addEventListener("click", onGo);
    back.addEventListener("click", onGo);
    return wrap;
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
    // Continue learning heading + following block
    d.querySelectorAll("h2.cu-sec, h2").forEach(function (h) {
      if (/continue learning/i.test(h.textContent || "")) {
        h.classList.add("cu-gate-hide-on-gate", "cu-gate-return-only");
        var n = h.nextElementSibling;
        if (n) n.classList.add("cu-gate-hide-on-gate", "cu-gate-return-only");
      }
      if (/how phases work/i.test(h.textContent || "") || /admission/i.test(h.textContent || "")) {
        // admission heading stays for new path; how phases hide on pure gate
        if (/how phases/i.test(h.textContent || "")) {
          h.classList.add("cu-gate-hide-on-gate");
          var n2 = h.nextElementSibling;
          if (n2) n2.classList.add("cu-gate-hide-on-gate");
        }
      }
    });
    // Academic precinct / journey preview blocks
    d.querySelectorAll("section, div").forEach(function (el) {
      var tx = (el.textContent || "").slice(0, 80);
      if (/ACADEMIC PRECINCT|JOURNEY PREVIEW/i.test(tx) && el.children.length < 12) {
        el.classList.add("cu-gate-hide-on-gate");
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

  function moveWriteDown() {
    var write = d.getElementById("cu-write-clarity") || d.querySelector(".cu-write-clarity");
    var foot = d.querySelector("footer.cu-foot, footer.cu-niyyah-footer");
    if (write && foot && foot.parentNode) {
      foot.parentNode.insertBefore(write, foot);
    }
  }

  function boot() {
    if (!isLanding()) return;
    try {
      removeDupTwoway();
      softArchiveNote();
      ensureGate();
      markProgressive();
      moveWriteDown();
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
  setTimeout(boot, 150);
  setTimeout(boot, 600);
  setTimeout(boot, 1200);
})(window, document);
