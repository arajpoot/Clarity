/*! First-visit soft link to campus welcome (optional) */
(function () {
  try {
    if (!/\/amana\/?$/.test(location.pathname || "")) return;
    if (localStorage.getItem("clarity_amana_welcome_seen_v1") === "1") return;
    // Non-blocking chip only — does not force redirect
    if (document.getElementById("aw-once-chip")) return;
    var a = document.createElement("a");
    a.id = "aw-once-chip";
    a.href = "/amana/welcome/";
    a.textContent = "Campus welcome illustration →";
    a.style.cssText =
      "display:inline-block;margin:0.5rem auto;padding:0.4rem 0.9rem;border-radius:999px;border:1px solid rgba(212,180,90,0.4);background:rgba(30,125,94,0.45);color:#e8d5a3;text-decoration:none;font-size:0.8rem;font-weight:700";
    a.onclick = function () {
      try {
        localStorage.setItem("clarity_amana_welcome_seen_v1", "1");
      } catch (e) {}
    };
    var host = document.getElementById("amana-desk-root") || document.getElementById("amana-desk-mount");
    if (host) host.insertBefore(a, host.firstChild);
    else document.body.insertBefore(a, document.body.firstChild);
  } catch (e) {}
})();
