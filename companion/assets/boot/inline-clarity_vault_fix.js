(function(){
  "use strict";
  if (window.__CLARITY_VAULT_FIX__) return;
  window.__CLARITY_VAULT_FIX__ = true;

  function toggleEye(btn){
    if (!btn) return;
    var id = btn.getAttribute("data-for");
    var input = id ? document.getElementById(id) : null;
    if (!input && btn.parentElement) {
      input = btn.parentElement.querySelector("input[type='password'], input[type='text']");
    }
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      btn.textContent = "\uD83D\uDE48";
      btn.setAttribute("aria-label", "Hide passphrase");
      btn.setAttribute("title", "Hide");
    } else {
      input.type = "password";
      btn.textContent = "\uD83D\uDC41";
      btn.setAttribute("aria-label", "Show passphrase");
      btn.setAttribute("title", "Show");
    }
    try { input.focus(); } catch(e){}
  }

  function onEyeEvent(ev){
    var t = ev.target;
    if (!t) return;
    var btn = (t.closest && t.closest(".av-eye, button.av-eye")) || (t.classList && t.classList.contains("av-eye") ? t : null);
    if (!btn) return;
    ev.preventDefault();
    ev.stopPropagation();
    toggleEye(btn);
  }

  document.addEventListener("click", onEyeEvent, true);
  document.addEventListener("touchend", onEyeEvent, true);

  function wireAllEyes(){
    document.querySelectorAll(".av-eye").forEach(function(btn){
      if (btn.__eyeWired) return;
      btn.__eyeWired = true;
      btn.type = "button";
      btn.addEventListener("click", function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        toggleEye(btn);
      });
    });
  }

  function ensureViewport(){
    try {
      var stage = document.getElementById("uft-stage");
      var preview = document.getElementById("uft-preview");
      var tab = document.getElementById("tab-notes");
      if (tab && (tab.classList.contains("amana-unlocked") || document.body.classList.contains("amana-unlocked"))) {
        if (stage) {
          stage.style.setProperty("display", "block", "important");
          stage.style.setProperty("visibility", "visible", "important");
          stage.style.setProperty("min-height", "min(48vh, 26rem)", "important");
        }
        if (preview) {
          preview.style.setProperty("display", "block", "important");
          preview.style.setProperty("visibility", "visible", "important");
        }
        if (typeof uftRender === "function") {
          try { uftRender({ keepScroll: true }); } catch(e){}
        }
      }
    } catch(e){}
  }

  try {
    var tab = document.getElementById("tab-notes");
    if (tab && typeof MutationObserver === "function") {
      new MutationObserver(function(){
        wireAllEyes();
        ensureViewport();
      }).observe(tab, { attributes: true, attributeFilter: ["class"] });
    }
  } catch(e){}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function(){
      setTimeout(wireAllEyes, 300);
      setTimeout(ensureViewport, 600);
    });
  } else {
    setTimeout(wireAllEyes, 300);
    setTimeout(ensureViewport, 600);
  }
  window.addEventListener("load", function(){
    setTimeout(wireAllEyes, 500);
    setTimeout(ensureViewport, 800);
  });
})();