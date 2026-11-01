/*! S3 — prefer one next-salah text source when multiple nodes exist */
(function(){
  "use strict";
  if (window.__CLARITY_SALAH_HARMONY_S3__) return;
  window.__CLARITY_SALAH_HARMONY_S3__ = true;
  function tick(){
    var nodes = document.querySelectorAll("[data-next-salah], .next-salah, #next-salah, .salah-countdown");
    if (nodes.length < 2) return;
    var text = "";
    for (var i=0;i<nodes.length;i++){
      var t = (nodes[i].textContent||"").trim();
      if (t && t !== "—" && t.toLowerCase() !== "loading") { text = t; break; }
    }
    if (!text) return;
    for (var j=0;j<nodes.length;j++){
      if (!(nodes[j].textContent||"").trim()) nodes[j].textContent = text;
    }
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setTimeout(tick, 1500);
  setTimeout(tick, 4000);
})();
