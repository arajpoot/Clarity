/**
 * Continue where you left off — Companion + prepare-for-death
 * localStorage only · offline · educational
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_CONTINUE_V1__) return;
  g.__CLARITY_CONTINUE_V1__ = true;

  var KEY = "clarity_continue_v1";

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null") || null;
    } catch (e) {
      return null;
    }
  }
  function write(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function track(action, detail) {
    write({
      action: action || "path",
      detail: detail || "",
      path: (function () {
        try {
          return localStorage.getItem("clarity_committed_path") || localStorage.getItem("clarity_path_focus") || "seeker";
        } catch (e) {
          return "seeker";
        }
      })(),
      ts: Date.now()
    });
  }

  function resume() {
    var o = read();
    if (!o) {
      if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("reminder");
      return;
    }
    var a = o.action || "";
    if (a === "grave" || a === "action") {
      if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("action");
    } else if (a === "reality") {
      if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("reality");
    } else if (a === "notes" || a === "amana") {
      if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("notes");
    } else {
      if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("reminder");
    }
    if (o.detail) {
      setTimeout(function () {
        var el = document.getElementById(o.detail) || document.querySelector(o.detail);
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }

  function ensureCard() {
    if (document.getElementById("clarity-continue-card")) return;
    var o = read();
    var host =
      document.getElementById("clarity-one-daily-drill") ||
      document.querySelector("#tab-reminder .rrra-hub-hero") ||
      document.getElementById("tab-reminder") ||
      document.getElementById("cu-dual-path") ||
      document.body;
    var card = document.createElement("div");
    card.id = "clarity-continue-card";
    card.style.cssText =
      "margin:0.5rem 0 0.75rem;padding:0.65rem 0.9rem;border-radius:12px;border:1px dashed rgba(212,180,90,0.4);font-size:0.88rem;line-height:1.4";
    var label = o
      ? "Continue where you left off · " + (o.path || "path") + (o.action ? " · " + o.action : "")
      : "Continue where you left off · start on Reminder";
    card.innerHTML =
      '<a href="#" id="clarity-continue-link" style="color:#d4b45a;font-weight:700;text-decoration:none">' +
      label +
      "</a>" +
      '<span style="opacity:0.75;font-size:0.78rem"> · saved on this device</span>';
    if (host.id === "clarity-one-daily-drill" && host.parentNode) {
      host.parentNode.insertBefore(card, host);
    } else if (host.firstChild) {
      host.insertBefore(card, host.firstChild);
    } else {
      host.appendChild(card);
    }
    var link = document.getElementById("clarity-continue-link");
    if (link)
      link.onclick = function (e) {
        e.preventDefault();
        resume();
      };
  }

  /* lightweight tracking on door opens */
  var prev = g.clarityOpenSectionDoor;
  if (typeof prev === "function" && !prev.__continueWrap) {
    g.clarityOpenSectionDoor = function (name) {
      try {
        track(String(name || "reminder"), "tab-" + String(name || "reminder"));
      } catch (e) {}
      return prev.apply(this, arguments);
    };
    g.clarityOpenSectionDoor.__continueWrap = true;
  } else if (typeof prev !== "function") {
    g.clarityOpenSectionDoor = function (name) {
      track(String(name || "reminder"), "tab-" + String(name || "reminder"));
      var id = "tab-" + String(name || "reminder");
      if (name === "notes" || name === "amana") id = "tab-notes";
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        var on = p.id === id;
        p.style.display = on ? "block" : "none";
        p.classList.toggle("active", on);
      });
    };
  }

  g.ClarityContinue = { track: track, resume: resume, read: read };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureCard);
  else ensureCard();
  g.addEventListener("load", function () {
    setTimeout(ensureCard, 600);
  });
})(typeof window !== "undefined" ? window : this);
