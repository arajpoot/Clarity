/*! Companion banner polish v1 · Bismillah
 * Dedupe action buttons · clarify city labels · settle banner layout
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_BANNER_POLISH_V1__) return;
  w.__CLARITY_COMPANION_BANNER_POLISH_V1__ = true;

  function isCompanion() {
    try {
      return (d.documentElement.getAttribute("data-clarity-room") || "") === "companion" ||
        /\/companion\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function dedupeButtons(root) {
    if (!root) return;
    var seen = {};
    root.querySelectorAll("button").forEach(function (btn) {
      var key = (btn.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      if (!key) return;
      /* Only dedupe short action labels that commonly double */
      if (!/^(🎨\s*)?meme$|^(📝\s*)?notes$|^(🎨\s*)?to meme studio$/i.test(key) && key.length > 24) return;
      if (seen[key]) {
        btn.setAttribute("data-dup", "1");
        btn.style.display = "none";
      } else {
        seen[key] = true;
        btn.removeAttribute("data-dup");
      }
    });
  }

  function polishCommandActions() {
    var card = d.getElementById("commands-card");
    if (!card) return;
    /* Wrap trailing soft buttons under command-box into one row */
    var box = d.getElementById("command-box");
    if (!box) return;
    var parent = box.parentNode;
    if (!parent) return;
    var row = parent.querySelector(".cmd-action-row");
    if (!row) {
      row = d.createElement("div");
      row.className = "cmd-action-row";
      /* Collect sibling buttons after nav that look like Meme/Notes */
      var node = box.nextSibling;
      var moved = [];
      while (node) {
        var next = node.nextSibling;
        if (node.nodeType === 1 && node.tagName === "BUTTON") {
          var t = (node.textContent || "").toLowerCase();
          if (/meme|notes/.test(t)) moved.push(node);
        } else if (node.nodeType === 1 && node.tagName === "DIV" && node.querySelector && node.querySelector("button")) {
          node.querySelectorAll("button").forEach(function (b) {
            var t = (b.textContent || "").toLowerCase();
            if (/meme|notes/.test(t)) moved.push(b);
          });
        }
        node = next;
      }
      if (moved.length) {
        parent.appendChild(row);
        moved.forEach(function (b) {
          row.appendChild(b);
        });
      }
    }
    dedupeButtons(card);
    dedupeButtons(parent);
  }

  function clarifyCity() {
    /* Haramain temps stay labeled Makkah / Madinah */
    var mk = d.getElementById("temp-makkah");
    var md = d.getElementById("temp-madinah");
    var host = d.getElementById("hijri-temps");
    if (host && !host.getAttribute("data-polished")) {
      host.setAttribute("data-polished", "1");
      /* ensure structure */
      if (mk && md && host.children.length >= 2) {
        /* ok */
      }
    }
    /* Salah city: prefix if missing */
    var loc = d.getElementById("hijri-local-loc");
    if (loc) {
      var t = (loc.textContent || "").trim();
      if (t && t !== "…" && t !== "—" && !/^📍/.test(t)) {
        /* CSS adds pin; keep text clean city name */
        loc.textContent = t.replace(/^📍\s*/, "");
      }
      loc.classList.add("salah-city");
    }
    /* Single On-device pill */
    var brand = d.querySelector(".banner-brand");
    if (brand) {
      var pills = brand.querySelectorAll(".on-device-ok, .brand-ondev");
      pills.forEach(function (el, i) {
        if (i > 0) el.style.display = "none";
        else {
          el.textContent = "On-device ✓";
          el.classList.add("on-device-ok");
        }
      });
    }
  }

  function settle() {
    if (!isCompanion()) return;
    clarifyCity();
    polishCommandActions();
    dedupeButtons(d.getElementById("tweet-desk-card"));
  }

  function boot() {
    if (!isCompanion()) return;
    settle();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1500);
  setTimeout(boot, 3000);
  /* After command navigation */
  d.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t) return;
    if (t.closest && (t.closest("[onclick*='nextCommand']") || t.closest("[onclick*='prevCommand']"))) {
      setTimeout(settle, 200);
    }
  });
})(window, document);
