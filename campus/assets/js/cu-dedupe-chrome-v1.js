
(function(){
  if (window.__CU_DEDUPE_CHROME_V1__) return;
  window.__CU_DEDUPE_CHROME_V1__ = true;
  function dedupe(){
    var banners = document.querySelectorAll("header.cu-banner, .cu-banner");
    if (banners.length > 1) {
      for (var i = 1; i < banners.length; i++) banners[i].remove();
    }
    var pills = document.querySelectorAll("nav.cu-pills");
    if (pills.length > 1) {
      for (var i = 1; i < pills.length; i++) pills[i].remove();
    }
    var stations = document.querySelectorAll("nav.lab-station-nav");
    if (stations.length > 1) {
      for (var i = 1; i < stations.length; i++) stations[i].remove();
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", dedupe);
  } else {
    dedupe();
  }
  setTimeout(dedupe, 200);
  setTimeout(dedupe, 800);
})();
