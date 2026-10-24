/**
 * Arabic studio — Video module (educational clips)
 * Opens curated learning videos. Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_AR_VIDEO_V1__) return;
  g.__CU_AR_VIDEO_V1__ = true;

  var VIDEOS = [
    {
      id: "alpha",
      title: "Arabic alphabet (overview)",
      blurb: "Letter shapes and sounds — beginner orientation.",
      url: "https://www.youtube.com/results?search_query=arabic+alphabet+for+beginners+quran"
    },
    {
      id: "makharij",
      title: "Makhārij overview",
      blurb: "Where letters are articulated — study aid only.",
      url: "https://www.youtube.com/results?search_query=makharij+al+huruf+tajweed+beginner"
    },
    {
      id: "greet",
      title: "Everyday greetings",
      blurb: "Common phrases for daily use.",
      url: "https://www.youtube.com/results?search_query=arabic+greetings+for+beginners"
    },
    {
      id: "salah_words",
      title: "Words related to ṣalāh",
      blurb: "Vocabulary support — not a prayer tutorial ruling.",
      url: "https://www.youtube.com/results?search_query=arabic+salah+vocabulary+beginners"
    },
    {
      id: "travel",
      title: "Travel phrases",
      blurb: "Transit and market language — not Hajj rites.",
      url: "https://www.youtube.com/results?search_query=arabic+travel+phrases+beginners"
    }
  ];

  function mount() {
    var host =
      document.getElementById("ar-video-root") ||
      document.getElementById("cu-ar-video");
    if (!host) return;
    if (host.getAttribute("data-ready") === "1") return;
    host.setAttribute("data-ready", "1");
    var html =
      '<div class="ar-video-mod">' +
      "<h2>Video module</h2>" +
      '<p class="ar-video-disc">Short external lessons to support the studio. Opens a search or video host in a new tab. Educational only — not a fatwa. Prefer teachers you trust.</p>' +
      '<div class="ar-video-grid">';
    VIDEOS.forEach(function (v) {
      html +=
        '<a class="ar-video-card" href="' +
        v.url +
        '" target="_blank" rel="noopener noreferrer">' +
        "<strong>" +
        v.title +
        "</strong>" +
        "<span>" +
        v.blurb +
        "</span>" +
        "<em>Open →</em></a>";
    });
    html +=
      "</div>" +
      '<p class="ar-video-disc">Pair with packs above: Read along · Listen · Match. Desk teaches; lab practices.</p></div>';
    host.innerHTML = html;
  }

  function wireTab() {
    var tab = document.getElementById("ar-mode-video");
    var panel = document.getElementById("ar-video-root");
    if (tab && panel) {
      tab.addEventListener("click", function () {
        document.querySelectorAll("[data-ar-panel]").forEach(function (p) {
          p.hidden = true;
        });
        panel.hidden = false;
        document.querySelectorAll(".ar-mode-tab").forEach(function (b) {
          b.classList.remove("on");
        });
        tab.classList.add("on");
        mount();
      });
    }
    mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireTab);
  } else {
    wireTab();
  }
})(window);
