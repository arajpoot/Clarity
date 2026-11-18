/*! port-write-to-clarity-v1 · smoked
 * Hydrates SSR #port-write-clarity or mounts.
 * POST /api/feedback · draft localStorage · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__PORT_WRITE_TO_CLARITY_SMOKED__) return;
  w.__PORT_WRITE_TO_CLARITY_SMOKED__ = true;

  var FEEDBACK_TO = "feedback@clarity-dawah.fyi";
  var FEEDBACK_API = "/api/feedback";
  var DRAFT_KEY = "clarity.port.writeDraft.v1";

  function ensureShell() {
    var sec = d.getElementById("port-write-clarity");
    if (sec) return sec;
    sec = d.createElement("section");
    sec.id = "port-write-clarity";
    sec.className = "port-write-clarity";
    sec.setAttribute("data-port-owned", "write-to-clarity-v1");
    sec.innerHTML =
      '<div class="pwc-card">' +
      '  <header class="pwc-head">' +
      '    <div><h2 class="pwc-title">Write to Clarity</h2>' +
      '    <p class="pwc-sub">Suggestions · questions · gentle reports · <strong>not a fatwa desk</strong></p></div>' +
      '    <button type="button" class="pwc-toggle" aria-expanded="false" aria-controls="pwc-body">Open</button>' +
      "  </header>" +
      '  <div id="pwc-body" class="pwc-body" hidden>' +
      '    <p class="pwc-stamp">Educational only — not a fatwa · not legal advice · verify with a teacher you trust</p>' +
      '    <div class="pwc-chips" role="group" aria-label="Message type">' +
      '      <button type="button" class="pwc-chip active" data-pwc-type="suggestion">Suggestion</button>' +
      '      <button type="button" class="pwc-chip" data-pwc-type="question">Question</button>' +
      '      <button type="button" class="pwc-chip" data-pwc-type="bug">Bug / glitch</button>' +
      '      <button type="button" class="pwc-chip" data-pwc-type="barakah">Barakah note</button>' +
      "    </div>" +
      '    <label class="pwc-label" for="pwc-input">Your note</label>' +
      '    <textarea id="pwc-input" class="pwc-input" rows="4" maxlength="2000" placeholder="Write briefly — what helped, what to improve, or a question about the app (not a personal ruling)."></textarea>' +
      '    <div class="pwc-meta"><span id="pwc-count">0 / 2000</span></div>' +
      '    <div class="pwc-actions">' +
      '      <button type="button" class="pwc-send" id="pwc-send">Send to Clarity</button>' +
      '      <button type="button" class="pwc-copy" id="pwc-copy">Copy</button>' +
      '      <button type="button" class="pwc-mail" id="pwc-mail">Mail app</button>' +
      "    </div>" +
      '    <p class="pwc-status" id="pwc-status" role="status" aria-live="polite"></p>' +
      "  </div>" +
      "</div>";
    var visit = d.getElementById("port-visit-notes");
    var foot = d.querySelector(".port-foot");
    var wrap = d.querySelector(".port-wrap") || d.body;
    if (visit && visit.parentNode) visit.parentNode.insertBefore(sec, visit.nextSibling);
    else if (foot && foot.parentNode) foot.parentNode.insertBefore(sec, foot);
    else wrap.appendChild(sec);
    return sec;
  }

  function wire(sec) {
    if (!sec || sec.getAttribute("data-pwc-wired") === "1") return;
    sec.setAttribute("data-pwc-wired", "1");
    var type = "suggestion";
    var body = sec.querySelector("#pwc-body");
    var toggle = sec.querySelector(".pwc-toggle");
    var ta = sec.querySelector("#pwc-input");
    var count = sec.querySelector("#pwc-count");
    var status = sec.querySelector("#pwc-status");
    var send = sec.querySelector("#pwc-send") || sec.querySelector(".pwc-send");
    var copy = sec.querySelector("#pwc-copy") || sec.querySelector(".pwc-copy");
    var mail = sec.querySelector("#pwc-mail") || sec.querySelector(".pwc-mail");
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

    sec.querySelectorAll(".pwc-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        sec.querySelectorAll(".pwc-chip").forEach(function (c) {
          c.classList.remove("active");
        });
        chip.classList.add("active");
        type = chip.getAttribute("data-pwc-type") || "suggestion";
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
        room: "port",
        tab: "write-to-clarity",
        path: "/",
        url: location.href,
        when: new Date().toISOString()
      };
    }

    if (send) {
      send.addEventListener("click", function () {
        var msg = payload().message;
        if (!msg) {
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
            } else {
              setStatus("Could not send directly. Use Copy or Mail app.");
            }
          })
          .catch(function () {
            clearTimeout(timer);
            setStatus("Could not send directly. Use Copy or Mail app.");
          });
      });
    }

    if (copy) {
      copy.addEventListener("click", function () {
        var bodyText =
          "Clarity app feedback\nType: " + type + "\nRoom: port\n\n" + ((ta && ta.value) || "");
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

    if (mail) {
      mail.addEventListener("click", function () {
        location.href =
          "mailto:" +
          FEEDBACK_TO +
          "?subject=" +
          encodeURIComponent("Clarity feedback · " + type) +
          "&body=" +
          encodeURIComponent(((ta && ta.value) || "").slice(0, 1800));
        setStatus("Mail app opened (optional).");
      });
    }
  }

  function boot() {
    try {
      wire(ensureShell());
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 50); });
  else setTimeout(boot, 50);
  setTimeout(boot, 500);
  setTimeout(boot, 1200);
})(window, document);
