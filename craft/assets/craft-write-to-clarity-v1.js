/*! craft-write-to-clarity-v1 · C21
 * Craft-room Write to Clarity (Companion About / Port parity).
 * room: "craft" · POST /api/feedback · local draft · educational only — not a fatwa.
 * Does not touch plaques, registry, or station pages.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_WRITE_TO_CLARITY_V1__) return;
  w.__CRAFT_WRITE_TO_CLARITY_V1__ = true;

  var FEEDBACK_TO = "feedback@clarity-dawah.fyi";
  var FEEDBACK_API = "/api/feedback";
  var DRAFT_KEY = "clarity.craft.writeDraft.v1";
  var ROOM = "craft";

  function ensureShell() {
    var sec = d.getElementById("craft-write-clarity");
    if (sec) return sec;
    sec = d.createElement("section");
    sec.id = "craft-write-clarity";
    sec.className = "craft-write-clarity";
    sec.setAttribute("data-clarity-owned", "craft-write-v1");
    sec.innerHTML =
      '<div class="cwc-card">' +
      '  <header class="cwc-head">' +
      '    <div><h2 class="cwc-title">Write to Clarity</h2>' +
      '    <p class="cwc-sub">Craft room · suggestions · questions · gentle reports · <strong>not a fatwa desk</strong></p></div>' +
      '    <button type="button" class="cwc-toggle" aria-expanded="false" aria-controls="cwc-body">Open</button>' +
      "  </header>" +
      '  <div id="cwc-body" class="cwc-body" hidden>' +
      '    <p class="cwc-stamp">Educational only — not a fatwa · not legal advice · verify with a teacher you trust</p>' +
      '    <div class="cwc-chips" role="group" aria-label="Message type">' +
      '      <button type="button" class="cwc-chip active" data-cwc-type="suggestion">Suggestion</button>' +
      '      <button type="button" class="cwc-chip" data-cwc-type="question">Question</button>' +
      '      <button type="button" class="cwc-chip" data-cwc-type="bug">Bug / glitch</button>' +
      '      <button type="button" class="cwc-chip" data-cwc-type="barakah">Barakah note</button>' +
      "    </div>" +
      '    <label class="cwc-label" for="cwc-input">Your note</label>' +
      '    <textarea id="cwc-input" class="cwc-input" rows="4" maxlength="2000" placeholder="Write briefly — bench feedback, a missing plaque idea, or a question about Craft (not a personal ruling)."></textarea>' +
      '    <div class="cwc-meta"><span id="cwc-count">0 / 2000</span></div>' +
      '    <div class="cwc-actions">' +
      '      <button type="button" class="cwc-send" id="cwc-send">Send to Clarity</button>' +
      '      <button type="button" class="cwc-copy" id="cwc-copy">Copy</button>' +
      '      <button type="button" class="cwc-mail" id="cwc-mail">Mail app</button>' +
      "    </div>" +
      '    <p class="cwc-status" id="cwc-status" role="status" aria-live="polite"></p>' +
      "  </div>" +
      "</div>";

    var foot = d.querySelector(".craft-footer");
    var sources = d.querySelector(".craft-sources");
    var main = d.querySelector(".craft-main") || d.querySelector("main");
    if (sources && sources.parentNode) {
      sources.parentNode.insertBefore(sec, sources.nextSibling);
    } else if (foot && foot.parentNode) {
      foot.parentNode.insertBefore(sec, foot);
    } else if (main && main.parentNode) {
      main.parentNode.insertBefore(sec, main.nextSibling);
    } else {
      d.body.appendChild(sec);
    }
    return sec;
  }

  function wire(sec) {
    if (!sec || sec.getAttribute("data-cwc-wired") === "1") return;
    sec.setAttribute("data-cwc-wired", "1");
    var type = "suggestion";
    var body = sec.querySelector("#cwc-body");
    var toggle = sec.querySelector(".cwc-toggle");
    var ta = sec.querySelector("#cwc-input");
    var count = sec.querySelector("#cwc-count");
    var status = sec.querySelector("#cwc-status");
    var send = sec.querySelector("#cwc-send");
    var copy = sec.querySelector("#cwc-copy");
    var mail = sec.querySelector("#cwc-mail");
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

    sec.querySelectorAll(".cwc-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        sec.querySelectorAll(".cwc-chip").forEach(function (c) {
          c.classList.remove("active");
        });
        chip.classList.add("active");
        type = chip.getAttribute("data-cwc-type") || "suggestion";
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
        path: "/craft/",
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
          "Clarity app feedback\nType: " +
          type +
          "\nRoom: craft\n\n" +
          ((ta && ta.value) || "");
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
          encodeURIComponent("Clarity feedback · craft · " + type) +
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
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
})(window, document);
