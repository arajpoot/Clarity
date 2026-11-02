/*! yawm-qibla-v1 · helper only — not a certified instrument */
(function () {
  "use strict";
  if (window.__YAWM_QIBLA_V1__) return;
  window.__YAWM_QIBLA_V1__ = true;

  var KAABA = { lat: 21.4225, lng: 39.8262 };

  function bearing(lat1, lng1, lat2, lng2) {
    var r = Math.PI / 180;
    var dLng = (lng2 - lng1) * r;
    var y = Math.sin(dLng) * Math.cos(lat2 * r);
    var x =
      Math.cos(lat1 * r) * Math.sin(lat2 * r) -
      Math.sin(lat1 * r) * Math.cos(lat2 * r) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function mount() {
    var needle = document.getElementById("yawm-qibla-needle");
    var label = document.getElementById("yawm-qibla-label");
    var btn = document.getElementById("yawm-qibla-cal");
    if (!needle || !btn) return;

    var qiblaDeg = 0;
    var heading = 0;

    function paint() {
      needle.style.transform = "rotate(" + (qiblaDeg - heading) + "deg)";
      if (label) {
        label.textContent =
          "Qibla ~ " + Math.round(qiblaDeg) + "° from N · helper only · not certified";
      }
    }

    function onOrientation(e) {
      var x =
        e.webkitCompassHeading != null
          ? e.webkitCompassHeading
          : typeof e.alpha === "number"
            ? 360 - e.alpha
            : null;
      if (typeof x === "number") {
        heading = x;
        paint();
      }
    }

    function listenOrientation() {
      if (!window.DeviceOrientationEvent) return;
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
          .then(function (s) {
            if (s === "granted") {
              window.addEventListener("deviceorientation", onOrientation, true);
            }
          })
          .catch(function () {});
      } else {
        window.addEventListener("deviceorientation", onOrientation, true);
      }
    }

    btn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        if (label) label.textContent = "No geolocation on this device";
        return;
      }
      if (label) label.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          qiblaDeg = bearing(
            pos.coords.latitude,
            pos.coords.longitude,
            KAABA.lat,
            KAABA.lng
          );
          paint();
          listenOrientation();
        },
        function () {
          if (label) label.textContent = "Location denied · helper unavailable";
        },
        { enableHighAccuracy: true, timeout: 12000 }
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
