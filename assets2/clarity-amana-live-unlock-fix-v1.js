/* extracted nuros-amana-unlock-fix-v21 Phase A */
(function(){
  "use strict";
  if (window.__NUROS_AMANA_UNLOCK_V21__) return;
  window.__NUROS_AMANA_UNLOCK_V21__ = true;

  function $(id){ return document.getElementById(id); }

  function fullyOpenInterior(){
    var tab = $("tab-notes");
    var gate = $("amana-vault-gate");
    var interior = $("amana-vault-interior");
    if (!tab) return;
    tab.classList.remove("amana-locked");
    tab.classList.add("amana-unlocked", "active");
    tab.removeAttribute("hidden");
    tab.setAttribute("aria-hidden", "false");
    tab.style.removeProperty("display");
    if (gate) {
      gate.hidden = true;
      gate.setAttribute("hidden", "");
      gate.style.setProperty("display", "none", "important");
    }
    if (interior) {
      interior.hidden = false;
      interior.removeAttribute("hidden");
      interior.removeAttribute("inert");
      interior.setAttribute("aria-hidden", "false");
      interior.setAttribute("data-amana-sealed", "0");
      interior.style.setProperty("display", "block", "important");
      interior.style.setProperty("visibility", "visible", "important");
      interior.style.setProperty("pointer-events", "auto", "important");
    }
  }

  function fullyCloseInterior(){
    var tab = $("tab-notes");
    var gate = $("amana-vault-gate");
    var interior = $("amana-vault-interior");
    if (!tab) return;
    tab.classList.add("amana-locked");
    tab.classList.remove("amana-unlocked");
    if (gate) {
      gate.hidden = false;
      gate.removeAttribute("hidden");
      gate.style.setProperty("display", "block", "important");
      gate.style.setProperty("visibility", "visible", "important");
    }
    if (interior) {
      interior.hidden = true;
      interior.setAttribute("hidden", "");
      interior.setAttribute("inert", "");
      interior.setAttribute("aria-hidden", "true");
      interior.setAttribute("data-amana-sealed", "1");
      interior.style.setProperty("display", "none", "important");
      /* wipe fields on lock — security */
      try {
        interior.querySelectorAll("input, textarea").forEach(function(el){
          if (el.type === "checkbox" || el.type === "radio") el.checked = false;
          else if (el.tagName !== "SELECT") el.value = "";
        });
      } catch(e){}
    }
  }

  function showStatus(msg, isErr){
    var el = $("amana-gate-status");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "av-status" + (isErr ? " err" : "");
    el.hidden = !msg;
    el.style.display = msg ? "block" : "none";
  }

  /** Patch setLockedUI once it exists */
  function patchSetLockedUI(){
    if (typeof window.setLockedUI !== "function" && typeof setLockedUI === "undefined") {
      /* gate script may keep setLockedUI local — patch via prototype on click path */
      return false;
    }
    return true;
  }

  /** Wrap gate unlock/create to force UI after success */
  function wireUnlockSuccessObserver(){
    var tab = $("tab-notes");
    if (!tab || tab.__unlockObsV21) return;
    tab.__unlockObsV21 = true;
    var was = tab.classList.contains("amana-unlocked");
    var mo = new MutationObserver(function(){
      var now = tab.classList.contains("amana-unlocked");
      if (now && !was) {
        fullyOpenInterior();
        showStatus("Vault open.", false);
        setTimeout(function(){ showStatus("", false); }, 1200);
      }
      if (!now && was) {
        fullyCloseInterior();
      }
      was = now;
    });
    mo.observe(tab, { attributes: true, attributeFilter: ["class"] });
  }

  /** Reliable unlock path: re-bind button with our wrapper after gate boots */
  function wireUnlockButton(){
    var btn = $("amana-btn-unlock");
    if (!btn || btn.__v21Wired) return;
    btn.__v21Wired = true;
    btn.addEventListener("click", function(){
      /* After gate async unlock finishes, force open if class flipped */
      var tries = 0;
      var timer = setInterval(function(){
        tries++;
        var tab = $("tab-notes");
        if (tab && tab.classList.contains("amana-unlocked")) {
          fullyOpenInterior();
          clearInterval(timer);
        }
        if (tries > 40) clearInterval(timer); /* ~4s */
      }, 100);
    }, false);
  }

  function wireCreateButton(){
    var btn = $("amana-btn-create");
    if (!btn || btn.__v21Wired) return;
    btn.__v21Wired = true;
    btn.addEventListener("click", function(){
      var tries = 0;
      var timer = setInterval(function(){
        tries++;
        var tab = $("tab-notes");
        if (tab && tab.classList.contains("amana-unlocked")) {
          fullyOpenInterior();
          clearInterval(timer);
        }
        if (tries > 40) clearInterval(timer);
      }, 100);
    }, false);
  }

  /** Enter key on unlock field */
  function wireEnter(){
    var pass = $("amana-pass-unlock");
    if (!pass || pass.__v21Enter) return;
    pass.__v21Enter = true;
    pass.addEventListener("keydown", function(ev){
      if (ev.key === "Enter") {
        ev.preventDefault();
        var btn = $("amana-btn-unlock");
        if (btn) btn.click();
      }
    });
  }

  /** Ensure status visible on failures — observe status text */
  function wireStatusVisibility(){
    var el = $("amana-gate-status");
    if (!el || el.__v21Stat) return;
    el.__v21Stat = true;
    var mo = new MutationObserver(function(){
      var t = (el.textContent || "").trim();
      if (t) {
        el.style.display = "block";
        el.hidden = false;
      }
    });
    mo.observe(el, { childList: true, characterData: true, subtree: true });
  }

  /** Open notes tab showing gate if locked */
  function ensureNotesPanel(){
    var tab = $("tab-notes");
    if (!tab) return;
    if (!tab.classList.contains("amana-unlocked")) {
      tab.classList.add("amana-locked");
      fullyCloseInterior();
    }
  }

  function openNotesFromRail(){
    document.querySelectorAll(".tab-panel").forEach(function(p){
      p.classList.remove("active");
      p.setAttribute("hidden", "");
    });
    var tab = $("tab-notes");
    if (!tab) return;
    tab.classList.add("active");
    tab.removeAttribute("hidden");
    tab.setAttribute("aria-hidden", "false");
    if (tab.classList.contains("amana-unlocked")) fullyOpenInterior();
    else {
      tab.classList.add("amana-locked");
      fullyCloseInterior();
    }
  }

  function boot(){
    /* keep locked class default */
    var tab = $("tab-notes");
    if (tab && !tab.classList.contains("amana-unlocked")) {
      tab.classList.add("amana-locked");
    }
    wireUnlockSuccessObserver();
    wireUnlockButton();
    wireCreateButton();
    wireEnter();
    wireStatusVisibility();
    ensureNotesPanel();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 100); });
  else setTimeout(boot, 100);
  window.addEventListener("load", function(){ setTimeout(boot, 300); });

  document.addEventListener("click", function(ev){
    var b = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab='notes'], [data-rail-tab='vault']");
    if (!b) return;
    setTimeout(openNotesFromRail, 50);
    setTimeout(boot, 200);
  }, true);

  /* Public */
  window.clarityAmanaFullyOpen = fullyOpenInterior;
  window.clarityAmanaFullyClose = fullyCloseInterior;
})();