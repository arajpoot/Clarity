
/* PRIORITY6 — export local study summary (this device only) */
(function (g) {
  "use strict";
  if (g.__CLARITY_EXPORT_PROGRESS_V1__) return;
  g.__CLARITY_EXPORT_PROGRESS_V1__ = true;
  g.clarityExportStudySummary = function () {
    var lines = [
      "Clarity — local study summary (this device only)",
      "Not a formal diploma or accreditation. Educational record only.",
      "Generated: " + new Date().toISOString(),
      ""
    ];
    try {
      lines.push("Phase: " + (localStorage.getItem("clarity_curriculum_phase_v1") || "1"));
      lines.push("Path focus: " + (localStorage.getItem("clarity_path_focus") || "seeker"));
      lines.push("Diplomas/records JSON: " + (localStorage.getItem("clarity_university_diplomas_v1") || "{}"));
    } catch (e) {}
    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-study-summary.txt";
    a.click();
    setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 1000);
  };
})(typeof window !== "undefined" ? window : this);
