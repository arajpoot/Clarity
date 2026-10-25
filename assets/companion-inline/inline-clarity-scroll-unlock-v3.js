(function(){
  function unlock(){
    try {
      document.documentElement.style.setProperty("overflow-y", "auto", "important");
      document.documentElement.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("overflow-y", "auto", "important");
      document.body.style.setProperty("height", "auto", "important");
      document.body.style.setProperty("position", "static", "important");
      document.documentElement.style.touchAction = "pan-x pan-y pinch-zoom";
      document.body.style.touchAction = "pan-x pan-y pinch-zoom";
    } catch (e) {}
  }
  unlock();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", unlock);
  window.addEventListener("load", unlock);
  setInterval(unlock, 2500);
})();
