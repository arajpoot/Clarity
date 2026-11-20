/*! cu-gate-modal-v1 · U50 G1
 * First-visit two-path gate as modal overlay. After choice/dismiss, stays off.
 * Keys: cu_uni_admit_v1 · cu_campus_gate_mode_v1 · cu_campus_gate_seen_v1
 * Educational only — not a fatwa · not a grade of īmān · not a seminary
 */
(function (w, d) {
  "use strict";
  if (w.__CU_GATE_MODAL_V1__) return;
  w.__CU_GATE_MODAL_V1__ = true;

  var KEY_ADMIT = "cu_uni_admit_v1";
  var KEY_MODE = "cu_campus_gate_mode_v1";
  var KEY_SEEN = "cu_campus_gate_seen_v1";

  function isLanding() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "";
    return p === "/campus" || p === "";
  }

  function lsGet(k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }
  function loadAdmit() {
    try {
      return JSON.parse(lsGet(KEY_ADMIT) || "null");
    } catch (e) {
      return null;
    }
  }

  function markSeen(mode) {
    lsSet(KEY_SEEN, "1");
    if (mode) lsSet(KEY_MODE, mode);
    d.documentElement.setAttribute("data-campus-gate", mode || "seen");
    if (d.body) d.body.setAttribute("data-campus-gate", mode || "seen");
  }

  function shouldShowModal() {
    if (!isLanding()) return false;
    if (lsGet(KEY_SEEN) === "1") return false;
    if (lsGet(KEY_MODE) === "new" || lsGet(KEY_MODE) === "return") return false;
    var admit = loadAdmit();
    if (admit && admit.name) return false;
    return true;
  }

  function hideInlineGate() {
    var g = d.getElementById("cu-gate-block");
    if (g) {
      g.style.setProperty("display", "none", "important");
      g.setAttribute("data-gate-inline-hidden", "1");
    }
  }

  function showInlineGate() {
    var g = d.getElementById("cu-gate-block");
    if (g) {
      g.style.removeProperty("display");
      g.removeAttribute("data-gate-inline-hidden");
    }
  }

  function closeModal(mode) {
    markSeen(mode || "seen");
    var m = d.getElementById("cu-gate-modal");
    if (m) m.remove();
    /* Returning users: keep landing calm — inline gate stays hidden */
    hideInlineGate();
    try {
      w.dispatchEvent(new CustomEvent("cu-gate-chosen", { detail: { mode: mode || "seen" } }));
    } catch (e) {}
  }

  function ensureCss() {
    if (d.querySelector('link[data-cu-gate-modal]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-gate-modal-v1.css?v=20261120U50";
    l.setAttribute("data-cu-gate-modal", "1");
    d.head.appendChild(l);
  }

  function openModal() {
    if (d.getElementById("cu-gate-modal")) return;
    ensureCss();
    hideInlineGate();
    var wrap = d.createElement("div");
    wrap.id = "cu-gate-modal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Enter Campus");
    wrap.innerHTML =
      '<div class="cu-gm-backdrop" data-gm-dismiss="1"></div>' +
      '<div class="cu-gm-card">' +
      '<button type="button" class="cu-gm-x" data-gm-dismiss="1" aria-label="Close">×</button>' +
      '<p class="cu-gm-kicker">First visit · this device</p>' +
      "<h2>Enter Campus</h2>" +
      '<p class="cu-gm-lead">Two doors. Progress and preferred name stay on <strong>this device</strong> only.</p>' +
      '<div class="cu-gm-grid">' +
      '<div class="cu-gm-door">' +
      "<h3>New seeker</h3>" +
      "<p>Read the Charter limits, register a preferred name on this device, then Orientation — before the first desk module.</p>" +
      '<div class="cu-gm-actions">' +
      '<button type="button" class="cu-gm-btn primary" data-gm="new">Start as new</button>' +
      '<a class="cu-gm-btn ghost" href="/campus/charter/">Charter</a>' +
      '<a class="cu-gm-btn ghost" href="/campus/orientation/">Orientation</a>' +
      "</div></div>" +
      '<div class="cu-gm-door">' +
      "<h3>Returning student</h3>" +
      "<p>If you registered a preferred name here before, it is still in this browser’s storage — not on Clarity servers.</p>" +
      '<div class="cu-gm-actions">' +
      '<button type="button" class="cu-gm-btn primary" data-gm="return">Continue as returning</button>' +
      '<a class="cu-gm-btn ghost" href="/campus/portal/">Student portal</a>' +
      '<a class="cu-gm-btn ghost" href="/campus/desk/seeker/">Seeker desk</a>' +
      "</div></div></div>" +
      '<p class="cu-gm-stamp">Educational only — not a fatwa · not a grade of īmān · not a seminary</p>' +
      '<button type="button" class="cu-gm-skip" data-gm-dismiss="1">Continue without choosing · show path</button>' +
      "</div>";
    d.body.appendChild(wrap);
    d.body.classList.add("cu-gate-modal-open");

    wrap.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-gm-dismiss")) {
        closeModal("seen");
        d.body.classList.remove("cu-gate-modal-open");
        return;
      }
      var go = t && t.getAttribute && t.getAttribute("data-gm");
      if (!go && t && t.closest) {
        var btn = t.closest("[data-gm]");
        if (btn) go = btn.getAttribute("data-gm");
      }
      if (go === "new") {
        closeModal("new");
        d.body.classList.remove("cu-gate-modal-open");
        try {
          location.href = "/campus/charter/";
        } catch (e2) {}
      } else if (go === "return") {
        closeModal("return");
        d.body.classList.remove("cu-gate-modal-open");
        try {
          location.href = "/campus/desk/seeker/";
        } catch (e3) {}
      }
    });
  }

  function boot() {
    if (!isLanding()) return;
    if (shouldShowModal()) {
      openModal();
    } else {
      /* Returning: calm landing — hide persistent inline two-door block */
      hideInlineGate();
      var mode = lsGet(KEY_MODE) || "return";
      d.documentElement.setAttribute("data-campus-gate", mode);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 300);
})(window, document);
