/**
 * Amana Vault Bridge — Phase 1–2 restore (20261016BRIDGE)
 * ---------------------------------------------------------------------------
 * Amanah: single crypto owner = Castle (clarity-amana-vault-secure-v1.js).
 * This module does NOT re-derive keys and does NOT store passphrases.
 *
 * Duties:
 *  1. After unlock — load family tree + fiqh scripts once, then render.
 *  2. Keep #amana-fiqh-host and estate cards in sync with ClarityVault.isOpen().
 *  3. On lock — hide estate UI (Castle also calls gateEstate; this is a safety net).
 *  4. Focus notes tab + vault card when rail / FAB requests vault.
 *
 * University (/campus/*, sealed curriculum vault) is out of scope.
 * Educational only — not a fatwa, not a court document.
 * ---------------------------------------------------------------------------
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_AMANA_BRIDGE_V1__) return;
  g.__CLARITY_AMANA_BRIDGE_V1__ = true;

  var VER = "20261016BRIDGE";
  var ESTATE_VER = "20261015FIX1";
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
        /* Optional full restore — non-fatal if missing */
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

  function onUnlocked() {
    setEstateVisible(true);
    bootEstateScripts().then(function () {
      try {
        if (typeof g.uftRender === "function") g.uftRender();
      } catch (e) {}
    });
    try {
      g.dispatchEvent(
        new CustomEvent("clarity-amana-unlock", { detail: { ver: VER } })
      );
    } catch (e2) {}
  }

  function onLocked() {
    setEstateVisible(false);
    try {
      g.dispatchEvent(
        new CustomEvent("clarity-amana-lock", { detail: { ver: VER } })
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

  /** Wrap Castle API once it appears so unlock/lock fire bridge immediately */
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

  function boot() {
    wrapCastle();
    /* Initial: locked until Castle reports open */
    if (lastOpen === null) {
      lastOpen = false;
      setEstateVisible(false);
    }
    sync();
    /* Poll briefly until Castle boots, then light poll for session */
    var n = 0;
    var iv = setInterval(function () {
      n++;
      wrapCastle();
      sync();
      if (n > 40 && g.ClarityVault) {
        /* after ~12s settle to slower watch */
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
        t.closest("[data-open-vault]") ||
        t.closest("#amana-top-print-btn")
      ) {
        setTimeout(showNotesAndVault, 20);
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
