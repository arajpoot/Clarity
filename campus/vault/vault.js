/**
 * University Vault locker · 20261024VAULT
 * cu_vault_* keys only — never Companion Amana keys.
 * Educational trust workspace. Not legal advice. Not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_LOCKER_V1__) return;
  g.__CU_VAULT_LOCKER_V1__ = true;

  var KEY = "cu_vault_pins_v1";
  var KEY_HYGIENE = "cu_vault_hygiene_ack_v1";

  function readPins() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }
  function writePins(a) {
    try {
      localStorage.setItem(KEY, JSON.stringify(a.slice(0, 40)));
    } catch (e) {}
  }

  function uid() {
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function addPin(pin) {
    var list = readPins();
    list.unshift({
      id: uid(),
      title: String(pin.title || "").trim() || "Untitled source",
      url: String(pin.url || "").trim(),
      shelf: String(pin.shelf || "general"),
      phase: String(pin.phase || ""),
      note: String(pin.note || "").trim(),
      ts: Date.now()
    });
    writePins(list);
    return list;
  }

  function removePin(id) {
    writePins(readPins().filter(function (p) { return p.id !== id; }));
    return readPins();
  }

  function renderList(host) {
    if (!host) return;
    var list = readPins();
    if (!list.length) {
      host.innerHTML = '<p class="v-note">No pins yet. Add a trusted source below, or open a Library shelf from Desk.</p>';
      return;
    }
    host.innerHTML = list
      .map(function (p) {
        var link = p.url
          ? '<a href="' + p.url.replace(/"/g, "") + '" target="_blank" rel="noopener noreferrer">Open source</a>'
          : "";
        var lib = p.shelf ? ' · <a href="/library/#' + p.shelf + '">Library shelf</a>' : "";
        var desk =
          p.phase === "1" || p.phase === "seeker"
            ? ' · <a href="/campus/desk/seeker/">Desk</a>'
            : p.phase === "2" || p.phase === "practice"
            ? ' · <a href="/campus/desk/practice/">Desk</a>'
            : p.phase === "3" || p.phase === "consistency"
            ? ' · <a href="/campus/desk/consistency/">Desk</a>'
            : p.phase === "4" || p.phase === "transmission"
            ? ' · <a href="/campus/desk/transmission/">Desk</a>'
            : ' · <a href="/campus/desk/">Desk</a>';
        return (
          '<article class="v-pin" data-id="' +
          p.id +
          '"><h3>' +
          escapeHtml(p.title) +
          "</h3><p class=\"v-note\">" +
          escapeHtml(p.note || "No trust note yet.") +
          '</p><p class="v-note" style="font-size:0.78rem">' +
          link +
          lib +
          desk +
          ' · <button type="button" class="v-btn soft" data-remove="' +
          p.id +
          '" style="padding:0.2rem 0.55rem;font-size:0.72rem">Remove</button></p></article>'
        );
      })
      .join("");
    host.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.onclick = function () {
        removePin(btn.getAttribute("data-remove"));
        renderList(host);
      };
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function bindForm() {
    var form = document.getElementById("cu-vault-pin-form");
    var host = document.getElementById("cu-vault-pin-list");
    if (host) renderList(host);
    if (!form) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      addPin({
        title: document.getElementById("v-pin-title").value,
        url: document.getElementById("v-pin-url").value,
        shelf: document.getElementById("v-pin-shelf").value,
        phase: document.getElementById("v-pin-phase").value,
        note: document.getElementById("v-pin-note").value
      });
      form.reset();
      renderList(host);
      var st = document.getElementById("v-pin-status");
      if (st) st.textContent = "Pinned on this device.";
    });
  }

  function bindHygiene() {
    var btn = document.getElementById("v-hygiene-ack");
    var st = document.getElementById("v-hygiene-status");
    try {
      if (localStorage.getItem(KEY_HYGIENE) && st) st.textContent = "Acknowledged on this device.";
    } catch (e) {}
    if (btn)
      btn.onclick = function () {
        try {
          localStorage.setItem(KEY_HYGIENE, new Date().toISOString());
        } catch (e) {}
        if (st) st.textContent = "Acknowledged. Pins stay on this device only. Clarity cannot recover a lost passphrase on Companion Amana.";
      };
  }

  function exportList() {
    var list = readPins();
    var lines = [
      "Clarity University · Study locker (educational)",
      "Not legal advice. Not a court document. Not a fatwa.",
      ""
    ];
    list.forEach(function (p, i) {
      lines.push(i + 1 + ". " + p.title);
      if (p.url) lines.push("   " + p.url);
      if (p.note) lines.push("   Trust note: " + p.note);
      lines.push("");
    });
    var w = window.open("", "_blank", "noopener,noreferrer");
    if (w) {
      w.document.write(
        "<pre style='font-family:system-ui;padding:1rem;white-space:pre-wrap'>" +
          escapeHtml(lines.join("\n")) +
          "</pre>"
      );
      w.document.close();
      try {
        w.print();
      } catch (e) {}
    }
  }

  g.CuVault = {
    readPins: readPins,
    addPin: addPin,
    removePin: removePin,
    exportList: exportList,
    KEY: KEY
  };

  function boot() {
    bindForm();
    bindHygiene();
    var exp = document.getElementById("v-export-pins");
    if (exp) exp.onclick = exportList;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);
