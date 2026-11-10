/*! yawm-qibla-v1 · helper only — not a certified instrument · Y5 safe labels */
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

  function safeText(el, text) {
    if (!el) return;
    el.textContent = String(text == null ? "" : text);
  }

  function mount() {
    var needle = document.getElementById("yawm-qibla-needle");
    var label = document.getElementById("yawm-qibla-label");
    var btn = document.getElementById("yawm-qibla-cal");
    if (!needle || !btn) return;

    var qiblaDeg = null;
    var heading = null;

    function paint() {
      if (typeof qiblaDeg === "number" && typeof heading === "number") {
        needle.style.transform = "rotate(" + (qiblaDeg - heading) + "deg)";
        safeText(
          label,
          "Qibla ~ " + Math.round(qiblaDeg) + "° from N · helper only · not certified"
        );
      } else if (typeof qiblaDeg === "number") {
        needle.style.transform = "rotate(" + qiblaDeg + "deg)";
        safeText(label, "Qibla bearing set · enable compass for live heading · helper only");
      }
    }

    function onOrientation(e) {
      var x =
        e.webkitCompassHeading != null
          ? e.webkitCompassHeading
          : typeof e.alpha === "number"
            ? 360 - e.alpha
            : null;
      if (typeof x === "number" && !isNaN(x)) {
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

    safeText(label, "Allow location to estimate qibla · helper only · not certified");

    btn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        safeText(label, "Geolocation unavailable on this device · helper only");
        return;
      }
      safeText(label, "Requesting location…");
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          try {
            qiblaDeg = bearing(
              pos.coords.latitude,
              pos.coords.longitude,
              KAABA.lat,
              KAABA.lng
            );
            paint();
            listenOrientation();
          } catch (err) {
            safeText(label, "Could not compute bearing · helper only");
          }
        },
        function () {
          safeText(label, "Location denied · helper unavailable · not a certified instrument");
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
