/*! cu-write-to-clarity-v1 · U23 · Campus landing only
 * room: "campus" · POST /api/feedback · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CU_WRITE_TO_CLARITY_V1__) return;
  w.__CU_WRITE_TO_CLARITY_V1__ = true;

  var FEEDBACK_TO = "feedback@clarity-dawah.fyi";
  var FEEDBACK_API = "/api/feedback";
  var DRAFT_KEY = "clarity.campus.writeDraft.v1";
  var ROOM = "campus";

  function ensureShell() {
    var sec = d.getElementById("cu-write-clarity");
    if (sec) return sec;
    sec = d.createElement("section");
    sec.id = "cu-write-clarity";
    sec.className = "cu-write-clarity";
    sec.setAttribute("data-clarity-owned", "campus-write-v1");
    sec.innerHTML =
      '<div class="cuw-card">' +
      '  <header class="cuw-head">' +
      '    <div><h2 class="cuw-title">Write to Clarity</h2>' +
      '    <p class="cuw-sub">University room · path feedback · curriculum notes · <strong>not a fatwa desk</strong></p></div>' +
      '    <button type="button" class="cuw-toggle" aria-expanded="false" aria-controls="cuw-body">Open</button>' +
      "  </header>" +
      '  <div id="cuw-body" class="cuw-body" hidden>' +
      '    <p class="cuw-stamp">Educational only — not a fatwa · not a grade of īmān · verify with a teacher you trust</p>' +
      '    <div class="cuw-chips" role="group" aria-label="Message type">' +
      '      <button type="button" class="cuw-chip active" data-cuw-type="suggestion">Suggestion</button>' +
      '      <button type="button" class="cuw-chip" data-cuw-type="question">Question</button>' +
      '      <button type="button" class="cuw-chip" data-cuw-type="bug">Bug / glitch</button>' +
      '      <button type="button" class="cuw-chip" data-cuw-type="barakah">Barakah note</button>' +
      "    </div>" +
      '    <label class="cuw-label" for="cuw-input">Your note</label>' +
      '    <textarea id="cuw-input" class="cuw-input" rows="4" maxlength="2000" placeholder="Write briefly — admission flow, a stage lock, desk clarity, or a question about Campus (not a personal ruling)."></textarea>' +
      '    <div class="cuw-meta"><span id="cuw-count">0 / 2000</span></div>' +
      '    <div class="cuw-actions">' +
      '      <button type="button" class="cuw-send" id="cuw-send">Send to Clarity</button>' +
      '      <button type="button" class="cuw-copy" id="cuw-copy">Copy</button>' +
      '      <button type="button" class="cuw-mail" id="cuw-mail">Mail app</button>' +
      "    </div>" +
      '    <p class="cuw-status" id="cuw-status" role="status" aria-live="polite"></p>' +
      "  </div>" +
      "</div>";
    var foot = d.querySelector("footer.cu-foot, footer.cu-niyyah-footer");
    if (foot && foot.parentNode) foot.parentNode.insertBefore(sec, foot);
    else d.body.appendChild(sec);
    return sec;
  }

  function wire(sec) {
    if (!sec || sec.getAttribute("data-cuw-wired") === "1") return;
    sec.setAttribute("data-cuw-wired", "1");
    var type = "suggestion";
    var body = sec.querySelector("#cuw-body");
    var toggle = sec.querySelector(".cuw-toggle");
    var ta = sec.querySelector("#cuw-input");
    var count = sec.querySelector("#cuw-count");
    var status = sec.querySelector("#cuw-status");
    if (!body || !toggle) return;
    function setStatus(m) {
      if (status) status.textContent = m || "";
    }
    try {
      var draft = localStorage.getItem(DRAFT_KEY);
      if (draft && ta) ta.value = draft;
      if (count && ta) count.textContent = (ta.value || "").length + " / 2000";
    } catch (e) {}
    toggle.addEventListener("click", function () {
      var open = body.hasAttribute("hidden");
      if (open) {
        body.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Close";
      } else {
        body.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Open";
      }
    });
    sec.querySelectorAll(".cuw-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        sec.querySelectorAll(".cuw-chip").forEach(function (c) {
          c.classList.remove("active");
        });
        chip.classList.add("active");
        type = chip.getAttribute("data-cuw-type") || "suggestion";
      });
    });
    if (ta) {
      ta.addEventListener("input", function () {
        if (count) count.textContent = ta.value.length + " / 2000";
        try {
          localStorage.setItem(DRAFT_KEY, ta.value);
        } catch (e) {}
      });
    }
    function payload() {
      return {
        type: type,
        message: ((ta && ta.value) || "").trim(),
        room: ROOM,
        tab: "write-to-clarity",
        path: "/campus/",
        url: location.href,
        when: new Date().toISOString()
      };
    }
    var send = sec.querySelector("#cuw-send");
    if (send) {
      send.addEventListener("click", function () {
        if (!payload().message) {
          setStatus("Write a short note first.");
          return;
        }
        setStatus("Sending…");
        var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
        var timer = setTimeout(function () {
          try {
            if (ctrl) ctrl.abort();
          } catch (e) {}
        }, 12000);
        fetch(FEEDBACK_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload()),
          signal: ctrl ? ctrl.signal : undefined
        })
          .then(function (r) {
            return r.json().catch(function () {
              return { ok: r.ok };
            });
          })
          .then(function (j) {
            clearTimeout(timer);
            if (j && j.ok) {
              setStatus("Received · Jazak Allah khairan. Educational only — not a fatwa.");
              if (ta) ta.value = "";
              if (count) count.textContent = "0 / 2000";
              try {
                localStorage.removeItem(DRAFT_KEY);
              } catch (e) {}
            } else setStatus("Could not send directly. Use Copy or Mail app.");
          })
          .catch(function () {
            clearTimeout(timer);
            setStatus("Could not send directly. Use Copy or Mail app.");
          });
      });
    }
    var copy = sec.querySelector("#cuw-copy");
    if (copy) {
      copy.addEventListener("click", function () {
        var bodyText =
          "Clarity app feedback\nType: " + type + "\nRoom: campus\n\n" + ((ta && ta.value) || "");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(bodyText).then(
            function () {
              setStatus("Copied to clipboard.");
            },
            function () {
              setStatus("Copy failed.");
            }
          );
        } else setStatus("Clipboard unavailable.");
      });
    }
    var mail = sec.querySelector("#cuw-mail");
    if (mail) {
      mail.addEventListener("click", function () {
        location.href =
          "mailto:" +
          FEEDBACK_TO +
          "?subject=" +
          encodeURIComponent("Clarity feedback · campus · " + type) +
          "&body=" +
          encodeURIComponent(((ta && ta.value) || "").slice(0, 1800));
        setStatus("Mail app opened (optional).");
      });
    }
  }

  function boot() {
    // Landing only
    var path = (location.pathname || "").replace(/\/+$/, "") || "/";
    if (path !== "/campus" && path !== "/campus/") return;
    try {
      wire(ensureShell());
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
})(window, document);
