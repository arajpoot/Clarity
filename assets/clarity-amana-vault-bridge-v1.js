/**
 * Amana Vault Bridge — Phase 1–3 (20261016P3)
 * ---------------------------------------------------------------------------
 * Amanah: single crypto owner = Castle (clarity-amana-vault-secure-v1.js).
 * This module does NOT re-derive keys and does NOT store passphrases.
 *
 * Phase 1–2: unlock/lock → show/hide estate UI; load UFT + fiqh once.
 * Phase 3:   path wizard focus, sealed-blob hygiene, print-pack gate,
 *            post-unlock scroll to workflow, optional restore hook.
 *
 * University (/campus/*, sealed curriculum vault) is out of scope.
 * Educational only — not a fatwa, not a court document.
 * ---------------------------------------------------------------------------
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_BRIDGE_V1__) {
    if (g.__CLARITY_AMANA_BRIDGE_VER__ === "20261016P3") return;
  }
  g.__CLARITY_AMANA_BRIDGE_V1__ = true;
  g.__CLARITY_AMANA_BRIDGE_VER__ = "20261016P3";

  var VER = "20261016P3";
  var ESTATE_VER = "20261015FIX1";
  var VAULT_BLOB = "clarity_amana_vault_blob_v1";
  var VAULT_META = "clarity_amana_vault_meta_v1";
  var estateLoading = false;
  var estateLoaded = false;
  var lastOpen = null;

  function $(id) {
    try {
      return document.getElementById(id);
    } catch (e) {
      return null;
    }
  }

  function isOpen() {
    try {
      if (g.ClarityVault && typeof g.ClarityVault.isOpen === "function") {
        return !!g.ClarityVault.isOpen();
      }
    } catch (e) {}
    return false;
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      try {
        var base = src.split("/").pop().split("?")[0];
        if (document.querySelector('script[src*="' + base + '"]')) {
          resolve();
          return;
        }
      } catch (e) {}
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        resolve();
      };
      (document.body || document.documentElement).appendChild(s);
    });
  }

  function setEstateVisible(unlocked) {
    try {
      document.documentElement.setAttribute(
        "data-amana-session",
        unlocked ? "open" : "locked"
      );
    } catch (e) {}

    var host = $("amana-fiqh-host");
    if (host) {
      host.hidden = !unlocked;
      host.setAttribute("aria-hidden", unlocked ? "false" : "true");
      if (unlocked) {
        host.style.removeProperty("display");
        host.classList.add("amana-estate-open");
      } else {
        host.style.display = "none";
        host.classList.remove("amana-estate-open");
      }
    }

    [
      "user-family-tree-card",
      "faraid-card",
      "wasiyyah-card",
      "fiqh-workflow-card"
    ].forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.hidden = !unlocked;
      if (unlocked) {
        el.style.removeProperty("display");
      } else {
        el.style.display = "none";
      }
    });

    var notes = $("tab-notes");
    if (notes) {
      if (unlocked) {
        notes.classList.add("amana-unlocked");
        notes.classList.remove("amana-locked");
      } else {
        notes.classList.add("amana-locked");
        notes.classList.remove("amana-unlocked");
      }
    }
  }

  function bootEstateScripts() {
    if (estateLoaded || estateLoading) {
      return Promise.resolve();
    }
    estateLoading = true;
    var v = ESTATE_VER;
    return loadScript("/assets/clarity-amana-fiqh-v1.js?v=" + v)
      .then(function () {
        return loadScript("/assets/clarity-amana-uft-v1.js?v=" + v);
      })
      .then(function () {
        return loadScript(
          "/assets/clarity-uft-full-restore-v1.js?v=" + v
        ).catch(function () {});
      })
      .then(function () {
        estateLoaded = true;
        estateLoading = false;
        try {
          if (typeof g.uftLoad === "function") g.uftLoad();
        } catch (e) {}
        try {
          if (typeof g.uftRender === "function") g.uftRender();
        } catch (e2) {}
        try {
          if (typeof g.uftZoomInit === "function") g.uftZoomInit();
        } catch (e3) {}
      })
      .catch(function () {
        estateLoading = false;
      });
  }

  function focusEstatePath() {
    try {
      if (typeof g.fiqhGoStep === "function") {
        g.fiqhGoStep(1);
        return;
      }
    } catch (e) {}
    var wf = $("fiqh-workflow-card");
    if (wf && wf.scrollIntoView) {
      try {
        wf.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e2) {}
    }
  }

  function ensureVaultKeysListed() {
    try {
      var blob = localStorage.getItem(VAULT_BLOB);
      var meta = localStorage.getItem(VAULT_META);
      if (blob) localStorage.setItem(VAULT_BLOB, blob);
      if (meta) localStorage.setItem(VAULT_META, meta);
    } catch (e) {}
  }

  function onUnlocked() {
    setEstateVisible(true);
    ensureVaultKeysListed();
    bootEstateScripts().then(function () {
      try {
        if (typeof g.uftRender === "function") g.uftRender();
      } catch (e) {}
      setTimeout(focusEstatePath, 120);
    });
    try {
      g.dispatchEvent(
        new CustomEvent("clarity-amana-unlock", {
          detail: { ver: VER }
        })
      );
    } catch (e2) {}
  }

  function onLocked() {
    setEstateVisible(false);
    try {
      g.dispatchEvent(
        new CustomEvent("clarity-amana-lock", {
          detail: { ver: VER }
        })
      );
    } catch (e) {}
  }

  function sync() {
    var open = isOpen();
    if (open === lastOpen) return;
    lastOpen = open;
    if (open) onUnlocked();
    else onLocked();
  }

  function wrapCastle() {
    if (!g.ClarityVault || g.ClarityVault.__bridgeWrapped) return false;
    var api = g.ClarityVault;
    var unlock = api.unlock;
    var lock = api.lock;
    if (typeof unlock !== "function" || typeof lock !== "function") return false;

    var wrapped = {
      version: api.version,
      hasVault: api.hasVault,
      isOpen: api.isOpen,
      unlock: function () {
        var r = unlock.apply(api, arguments);
        Promise.resolve(r).then(
          function () {
            setTimeout(sync, 30);
          },
          function () {
            setTimeout(sync, 30);
          }
        );
        return r;
      },
      lock: function () {
        var r = lock.apply(api, arguments);
        setTimeout(sync, 10);
        return r;
      }
    };
    try {
      Object.freeze(wrapped);
    } catch (e) {}
    wrapped.__bridgeWrapped = true;
    g.ClarityVault = wrapped;
    return true;
  }

  function showNotesAndVault() {
    try {
      if (typeof g.switchTab === "function") g.switchTab("notes");
      else if (location) location.hash = "notes";
    } catch (e) {
      try {
        location.hash = "notes";
      } catch (e2) {}
    }
    var panel = $("tab-notes");
    if (panel) {
      panel.classList.add("active");
      panel.hidden = false;
      panel.style.display = "block";
      panel.setAttribute("aria-hidden", "false");
    }
    try {
      document.documentElement.setAttribute("data-active-tab", "notes");
      if (document.body) document.body.setAttribute("data-active-tab", "notes");
    } catch (e3) {}
    setTimeout(function () {
      var card = $("p5-vault-card") || $("amana-vault-host");
      if (card && card.scrollIntoView) {
        try {
          card.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e4) {}
      }
      sync();
    }, 80);
  }

  function printPackGuarded(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    if (!isOpen()) {
      showNotesAndVault();
      try {
        var st = $("p5-vault-status") || $("p5-vault-badge");
        if (st) st.textContent = "Unlock vault to print pack (session only).";
      } catch (e) {}
      return false;
    }
    try {
      if (typeof g.__CLARITY_AMANA_NATIVE_PRINT__ === "function") {
        g.__CLARITY_AMANA_NATIVE_PRINT__();
        return false;
      }
    } catch (e2) {}
    try {
      var data = g.__AMANA_VAULT_DATA__ || {};
      var w = g.open("", "_blank", "noopener,noreferrer");
      if (!w) return false;
      var body =
        "Clarity · Amana Vault pack (educational)\n" +
        "Session export — not a fatwa or court document.\n" +
        "Updated: " +
        (data.updatedAt || "") +
        "\n\n--- Notes ---\n" +
        (data.notes || "") +
        "\n\n--- ICE contacts ---\n" +
        (typeof data.contacts === "string"
          ? data.contacts
          : JSON.stringify(data.contacts || "")) +
        "\n\n--- Debts / rights ---\n" +
        (typeof data.debts === "string"
          ? data.debts
          : JSON.stringify(data.debts || "")) +
        "\n\n--- Wasiyyah notes (<=1/3 educational) ---\n" +
        (data.wasiyyah || "") +
        "\n";
      w.document.write(
        "<pre style=\"font-family:system-ui,sans-serif;padding:1.25rem;white-space:pre-wrap\">" +
          body.replace(/</g, "&lt;") +
          "</pre>"
      );
      w.document.close();
      try {
        w.focus();
        w.print();
      } catch (e3) {}
    } catch (e4) {}
    return false;
  }

  g.NurOS = g.NurOS || {};
  if (typeof g.NurOS.openVault !== "function") {
    g.NurOS.openVault = showNotesAndVault;
  } else {
    var prevOpen = g.NurOS.openVault;
    g.NurOS.openVault = function () {
      try {
        prevOpen.apply(g.NurOS, arguments);
      } catch (e) {}
      showNotesAndVault();
    };
  }

  if (typeof g.clarityAmanaPrintPack === "function" && !g.__CLARITY_AMANA_NATIVE_PRINT__) {
    g.__CLARITY_AMANA_NATIVE_PRINT__ = g.clarityAmanaPrintPack;
  }
  g.clarityAmanaPrintPackGuarded = printPackGuarded;
  g.clarityAmanaPrintPack = function () {
    if (!isOpen()) return printPackGuarded();
    if (typeof g.__CLARITY_AMANA_NATIVE_PRINT__ === "function") {
      try {
        return g.__CLARITY_AMANA_NATIVE_PRINT__.apply(g, arguments);
      } catch (e) {
        return printPackGuarded();
      }
    }
    return printPackGuarded();
  };

  function boot() {
    wrapCastle();
    if (lastOpen === null) {
      lastOpen = false;
      setEstateVisible(false);
    }
    sync();
    ensureVaultKeysListed();
    var n = 0;
    var iv = setInterval(function () {
      n++;
      wrapCastle();
      sync();
      if (n > 40 && g.ClarityVault) {
        clearInterval(iv);
        setInterval(function () {
          wrapCastle();
          sync();
        }, 2000);
      }
    }, 300);
  }

  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (
        t.closest(".rrra-rail-vault") ||
        t.closest("[data-open-vault]")
      ) {
        setTimeout(showNotesAndVault, 20);
      }
      if (t.closest("#amana-top-print-btn")) {
        printPackGuarded(ev);
      }
      if (
        (t.getAttribute && t.getAttribute("data-tab") === "notes") ||
        t.closest('[data-tab="notes"]')
      ) {
        setTimeout(sync, 50);
      }
    },
    true
  );

  g.addEventListener("hashchange", function () {
    if ((location.hash || "").toLowerCase().indexOf("notes") >= 0) {
      setTimeout(sync, 50);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 280);
    });
  } else {
    setTimeout(boot, 280);
  }
  g.addEventListener("load", function () {
    setTimeout(boot, 450);
  });
})(window);
