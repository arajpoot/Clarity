/*! When user opens Companion from Yawm, mark session for freeze-guard */
(function(){
  document.addEventListener("click", function(ev){
    var a = ev.target && ev.target.closest && ev.target.closest("a[href]");
    if(!a) return;
    var href = a.getAttribute("href")||"";
    if (href.indexOf("/companion") === 0 || href.indexOf("companion") === 0) {
      try { sessionStorage.setItem("clarity_from_yawm", "1"); } catch(e) {}
    }
  }, true);
})();
