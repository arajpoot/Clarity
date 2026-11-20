/*! cu-path-conductor-v1 · U34
 * Streamline automation: landing → desk stages → bots ops
 * On-device only. Educational — not a fatwa · not a grade of īmān
 */
(function (w, d) {
  "use strict";
  if (w.__CU_PATH_CONDUCTOR_V1__) return;
  w.__CU_PATH_CONDUCTOR_V1__ = true;

  var STAGES = [
    { id: "seeker", label: "Seeker", href: "/campus/desk/seeker/", junior: true },
    { id: "practice", label: "Practice", href: "/campus/desk/practice/" },
    { id: "consistency", label: "Consistency", href: "/campus/desk/consistency/" },
    { id: "transmission", label: "Transmission", href: "/campus/desk/transmission/" }
  ];

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }

  function stageFromPath() {
    var p = path();
    for (var i = 0; i < STAGES.length; i++) {
      if (p.indexOf("/campus/desk/" + STAGES[i].id) === 0) return STAGES[i];
    }
    return null;
  }

  function juniorProgress() {
    try {
      var raw = localStorage.getItem("clarity_junior_progress_v1");
      var o = raw ? JSON.parse(raw) : {};
      var done = 0;
      if (o && typeof o === "object") {
        Object.keys(o).forEach(function (k) {
          if (o[k]) done++;
        });
      }
      return { done: done, total: 12 };
    } catch (e) {
      return { done: 0, total: 12 };
    }
  }

  function nextHref() {
    var st = stageFromPath();
    if (st) return st.href;
    var jp = juniorProgress();
    if (jp.done < jp.total) return "/campus/desk/seeker/";
    return "/campus/desk/";
  }

  function ensureCss() {
    if (d.querySelector('link[data-cu-cpc]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-path-conductor-v1.css?v=20261120U34";
    l.setAttribute("data-cu-cpc", "1");
    d.head.appendChild(l);
  }

  function paintLanding() {
    if (path() !== "/campus" && path() !== "") return;
    if (d.getElementById("cu-path-conductor")) return;
    var jp = juniorProgress();
    var sec = d.createElement("section");
    sec.id = "cu-path-conductor";
    sec.className = "cu-path-conductor";
    sec.setAttribute("data-clarity-owned", "path-conductor-v1");
    var next = jp.done < jp.total ? "Continue Junior curriculum on Seeker desk" : "Open desk atlas for the next stage";
    sec.innerHTML =
      '<div class="cpc-card">' +
      '<p class="cpc-kicker">Path conductor · on-device</p>' +
      '<h2 class="cpc-title">Your next step</h2>' +
      '<p class="cpc-body">Seeker (Junior) progress: <strong>' +
      jp.done +
      " / " +
      jp.total +
      "</strong> modules marked on this device. " +
      next +
      ".</p>" +
      '<div class="cpc-actions">' +
      '<a href="/campus/desk/seeker/">Seeker desk · Junior station</a>' +
      '<a class="ghost" href="/campus/desk/">Desk atlas</a>' +
      '<a class="ghost" href="/campus/bots/">Bots · path ops</a>' +
      '<a class="ghost" href="/campus/portal/">Portal</a>' +
      "</div>" +
      '<p class="cpc-stamp">Educational only — not a fatwa · not a grade of īmān · progress stays here</p>' +
      "</div>";
    var gate = d.getElementById("cu-gate-block") || d.querySelector(".cu-gate-block");
    var write = d.getElementById("cu-write-clarity");
    var hero = d.querySelector("header.cu-hero");
    var anchor = gate || hero;
    if (anchor && anchor.parentNode) {
      if (write && write.parentNode === anchor.parentNode) {
        anchor.parentNode.insertBefore(sec, write);
      } else {
        anchor.parentNode.insertBefore(sec, anchor.nextSibling);
      }
    } else {
      (d.querySelector("main") || d.body).appendChild(sec);
    }
  }

  function paintDesk() {
    var st = stageFromPath();
    if (!st) return;
    if (d.getElementById("cu-path-conductor")) return;
    var jp = juniorProgress();
    var sec = d.createElement("section");
    sec.id = "cu-path-conductor";
    sec.className = "cu-path-conductor";
    var line =
      st.id === "seeker"
        ? "Junior station: " + jp.done + "/" + jp.total + " modules on this device."
        : "You are on " + st.label + ". Junior (Seeker) is a separate station.";
    sec.innerHTML =
      '<div class="cpc-card">' +
      '<p class="cpc-kicker">Path conductor</p>' +
      '<p class="cpc-body">' +
      line +
      "</p>" +
      '<div class="cpc-actions">' +
      (st.id !== "seeker" ? '<a href="/campus/desk/seeker/">Junior · Seeker station</a>' : "") +
      '<a class="ghost" href="/campus/desk/">Desk atlas</a>' +
      '<a class="ghost" href="/campus/bots/">Bots ops</a>' +
      '<a class="ghost" href="/campus/">Campus gate</a>' +
      "</div>" +
      '<p class="cpc-stamp">Educational only — not a fatwa · not a grade of īmān</p>' +
      "</div>";
    var main = d.querySelector("main") || d.body;
    var h1 = main.querySelector("h1, h2");
    if (h1 && h1.parentNode) h1.parentNode.insertBefore(sec, h1.nextSibling);
    else main.insertBefore(sec, main.firstChild);
  }

  function paintBots() {
    if (path() !== "/campus/bots") return;
    // Strengthen ops panel with real CuSeq lines
    var scan = d.getElementById("cit-scan");
    if (!scan) return;
    var lines = [];
    lines.push("Station map: Seeker (Junior) → Practice → Consistency → Transmission");
    var jp = juniorProgress();
    lines.push("Junior progress (local): " + jp.done + "/" + jp.total);
    if (w.CuSeq && w.CuSeq.getNext) {
      try {
        var n = w.CuSeq.getNext();
        lines.push("CuSeq next: " + (n && n.moduleId ? n.moduleId : "none"));
      } catch (e) {
        lines.push("CuSeq next: error");
      }
    } else {
      lines.push("CuSeq bus: not loaded on this page yet (open Desk once, or load seq modules).");
    }
    lines.push("Junior station URL: /campus/desk/seeker/");
    if (!scan.getAttribute("data-cpc-filled")) {
      scan.innerHTML =
        '<pre style="white-space:pre-wrap;font-size:0.8rem;margin:0">' +
        lines.join("\n") +
        "</pre>";
      scan.setAttribute("data-cpc-filled", "1");
    }
  }

  function boot() {
    try {
      ensureCss();
      paintLanding();
      paintDesk();
      paintBots();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(paintBots, 1200);
})(window, document);
