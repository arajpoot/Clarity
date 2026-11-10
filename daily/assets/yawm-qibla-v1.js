/*! yawm-qibla-v1 · Y6 · on-device calibration until recalibrate · helper only */
(function () {
  "use strict";
  if (window.__YAWM_QIBLA_V1__) return;
  window.__YAWM_QIBLA_V1__ = true;

  var KAABA = { lat: 21.4225, lng: 39.8262 };
  var STORE = "clarity.yawm.qibla.cal.v1";

  function bearing(lat1, lng1, lat2, lng2) {
    var r = Math.PI / 180;
    var dLng = (lng2 - lng1) * r;
    var y = Math.sin(dLng) * Math.cos(lat2 * r);
    var x =
      Math.cos(lat1 * r) * Math.sin(lat2 * r) -
      Math.sin(lat1 * r) * Math.cos(lat2 * r) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  function loadCal() {
    try {
      var o = JSON.parse(localStorage.getItem(STORE) || "null");
      if (o && typeof o.qiblaDeg === "number" && typeof o.lat === "number") return o;
    } catch (e) {}
    return null;
  }
  function saveCal(o) {
    try {
      localStorage.setItem(
        STORE,
        JSON.stringify({
          qiblaDeg: o.qiblaDeg,
          lat: o.lat,
          lng: o.lng,
          t: Date.now()
        })
      );
    } catch (e) {}
  }
  function clearCal() {
    try { localStorage.removeItem(STORE); } catch (e) {}
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
    var saved = loadCal();
    if (saved) {
      qiblaDeg = saved.qiblaDeg;
      safeText(
        label,
        "Saved qibla ~ " +
          Math.round(qiblaDeg) +
          "° from N · on this device · helper only · not certified"
      );
      needle.style.transform = "rotate(" + qiblaDeg + "deg)";
      btn.textContent = "Recalibrate compass";
    } else {
      safeText(label, "Allow location to estimate qibla · helper only · not certified");
    }

    function paint() {
      if (typeof qiblaDeg === "number" && typeof heading === "number") {
        needle.style.transform = "rotate(" + (qiblaDeg - heading) + "deg)";
        safeText(
          label,
          "Qibla ~ " + Math.round(qiblaDeg) + "° from N · live heading · helper only"
        );
      } else if (typeof qiblaDeg === "number") {
        needle.style.transform = "rotate(" + qiblaDeg + "deg)";
        safeText(
          label,
          "Qibla ~ " +
            Math.round(qiblaDeg) +
            "° from N · enable compass for live heading · helper only"
        );
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

    if (saved) listenOrientation();

    btn.addEventListener("click", function () {
      if (!navigator.geolocation) {
        safeText(label, "Geolocation unavailable on this device · helper only");
        return;
      }
      // Recalibrate always refreshes store
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
            saveCal({
              qiblaDeg: qiblaDeg,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            });
            btn.textContent = "Recalibrate compass";
            paint();
            listenOrientation();
          } catch (err) {
            safeText(label, "Could not compute bearing · helper only");
          }
        },
        function () {
          safeText(
            label,
            "Location denied · helper unavailable · not a certified instrument"
          );
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
