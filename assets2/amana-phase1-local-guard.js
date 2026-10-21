(function(g){
  "use strict";
  if (g.__AMANA_PHASE1_LOCAL__) return;
  g.__AMANA_PHASE1_LOCAL__ = true;
  document.addEventListener("click", function(ev){
    var a = ev.target && ev.target.closest && ev.target.closest('a[href="/vault/"],a[href="/vault"],a[data-amana-local]');
    if (!a) return;
    var href = (a.getAttribute("href")||"");
    if (href.indexOf("/vault") === 0 || a.getAttribute("data-amana-local")) {
      ev.preventDefault();
      try {
        if (typeof g.switchTab === "function") g.switchTab("notes");
        else location.hash = "notes";
        if (g.NurOS && typeof g.NurOS.openVault === "function") setTimeout(function(){ g.NurOS.openVault(); }, 120);
      } catch(e) { location.hash = "notes"; }
    }
  }, true);
})(window);
