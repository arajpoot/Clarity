/* Admin Staff Dispatcher — loads staff wing after vault seals
 * Staff live in admin/staff (updatable) not foundation (frozen).
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STAFF_DISPATCH__) return;
  g.__CLARITY_STAFF_DISPATCH__ = true;

  var BASE = "./assets/curriculum/vault/admin/staff/";
  var SCRIPTS = [
    "staff-ops-monitor-v1.js",
    "staff-fiqh-authenticity-v1.js",
    "staff-resource-scout-v1.js",
    "staff-librarian-v1.js"
  ];

  function load(src) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = BASE + src + "?v=staff";
      s.defer = true;
      s.dataset.clarityStaff = "1";
      s.onload = function () {
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  function start() {
    if (!document.getElementById("clarity-staff-css")) {
      var st = document.createElement("style");
      st.id = "clarity-staff-css";
      st.textContent = ".cof-staff-strip{margin-top:.75rem;padding:.55rem .65rem;border-radius:10px;border:1px dashed rgba(212,180,90,.45);background:rgba(13,79,60,.07);font-size:.82rem}.cof-staff-strip ul{margin:.35rem 0 .5rem;padding-left:1rem;line-height:1.4}";
      document.head.appendChild(st);
    }

    var chain = Promise.resolve();
    SCRIPTS.forEach(function (src) {
      chain = chain.then(function () {
        return load(src);
      });
    });
    chain.then(function () {
      try {
        console.info("%c Staff Wing ", "background:#0f2a22;color:#d4b45a", "Ops · Authenticity · Scout · Librarian on duty");
      } catch (e) {}
      try {
        g.dispatchEvent(new CustomEvent("clarity-staff-ready"));
      } catch (e2) {}
      enhanceOfficePanel();
    });
  }

  function enhanceOfficePanel() {
    /* Hook Admin Office open to show staff strip */
    var prev = g.ClarityAdminOffice && g.ClarityAdminOffice.open;
    if (!prev || prev.__staffHooked) return;
    g.ClarityAdminOffice.open = function () {
      prev();
      setTimeout(injectStaffStrip, 200);
    };
    g.ClarityAdminOffice.open.__staffHooked = true;
  }

  function injectStaffStrip() {
    var body = document.getElementById("cof-body");
    if (!body || document.getElementById("cof-staff-strip")) return;
    var strip = document.createElement("div");
    strip.id = "cof-staff-strip";
    strip.className = "cof-staff-strip";
    var ops = g.ClarityStaffOps && g.ClarityStaffOps.state ? g.ClarityStaffOps.state() : null;
    var fiqh = g.ClarityStaffFiqh && g.ClarityStaffFiqh.state ? g.ClarityStaffFiqh.state() : null;
    var scout = g.ClarityStaffScout && g.ClarityStaffScout.state ? g.ClarityStaffScout.state() : null;
    var inbox = g.ClarityStaffScout && g.ClarityStaffScout.inbox ? g.ClarityStaffScout.inbox() : [];
    var lib = g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.state ? g.ClarityStaffLibrarian.state() : null;
    var issue = g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.latestIssue ? g.ClarityStaffLibrarian.latestIssue() : null;
    var stacks = g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.stacks ? g.ClarityStaffLibrarian.stacks() : null;
    strip.innerHTML =
      "<strong>Staff wing</strong>" +
      "<ul>" +
      "<li>⚙ Ops Steward — checks " +
      (ops ? ops.checks : 0) +
      ", ok " +
      (ops ? ops.ok : 0) +
      ", warn " +
      (ops ? ops.warn : 0) +
      "</li>" +
      "<li>⚖ Authenticity Clerk — scans " +
      (fiqh ? fiqh.scans : 0) +
      ", flags " +
      (fiqh && fiqh.flags ? fiqh.flags.length : 0) +
      "</li>" +
      "<li>◈ Resource Scout — proposals " +
      inbox.length +
      " in inbox</li>" +
      "<li>📚 Vault Librarian — gathers " +
      (lib ? lib.gathers : 0) +
      ", backups " +
      (lib ? lib.backups : 0) +
      ", issues " +
      (lib ? lib.issues : 0) +
      (stacks ? " · shelves " + (stacks.refs ? stacks.refs.length : 0) : "") +
      "</li>" +
      "</ul>" +
      (issue
        ? "<p class=\"cof-issue\"><b>Rotation issue</b>: " +
          (issue.ux || "") +
          " · ops tasks " +
          (issue.ops && issue.ops.tasks ? issue.ops.tasks.length : 0) +
          "</p>"
        : "") +
      '<button type="button" class="cdm-btn cdm-secondary" id="cof-staff-inbox">Scout inbox</button> ' +
      '<button type="button" class="cdm-btn cdm-secondary" id="cof-staff-lib">Library stacks</button> ' +
      '<button type="button" class="cdm-btn cdm-secondary" id="cof-staff-backup">Curriculum backup</button>';
    body.appendChild(strip);

    var btnLib = document.getElementById("cof-staff-lib");
    if (btnLib) {
      btnLib.onclick = function () {
        var st = g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.stacks ? g.ClarityStaffLibrarian.stacks() : null;
        var issue = g.ClarityStaffLibrarian && g.ClarityStaffLibrarian.latestIssue ? g.ClarityStaffLibrarian.latestIssue() : null;
        var lines = [];
        if (issue) lines.push("Latest issue: " + issue.id + "\nUX: " + (issue.ux || ""));
        if (st && st.refs) {
          lines.push("Refs on stacks: " + st.refs.length);
          st.refs.slice(-5).reverse().forEach(function (r) {
            lines.push("- " + r.title + " · " + r.url);
          });
        }
        if (st && st.uxPrinciples) lines.push("UX: " + st.uxPrinciples.slice(0, 3).join("; "));
        alert(lines.length ? lines.join("\n") : "Library stacks empty — librarian will gather after scout runs.");
      };
    }
    var btnBak = document.getElementById("cof-staff-backup");
    if (btnBak) {
      btnBak.onclick = function () {
        if (!g.ClarityStaffLibrarian) return;
        g.ClarityStaffLibrarian.backupCurriculum();
        var hist = g.ClarityStaffLibrarian.backups();
        alert("Curriculum backup saved (" + hist.length + " snapshots on device).\nSealed foundation unchanged.");
      };
    }

    var btn = document.getElementById("cof-staff-inbox");
    if (btn) {
      btn.onclick = function () {
        var lines = inbox
          .slice(-8)
          .reverse()
          .map(function (p) {
            return (
              (p.status || "") +
              " · P" +
              p.phase +
              " · " +
              p.title +
              "\n  " +
              p.url +
              (p.moduleHint ? " → " + p.moduleHint : "")
            );
          });
        alert(
          lines.length
            ? "Scout inbox (review only):\n\n" + lines.join("\n\n")
            : "Scout inbox empty — will propose allowlisted resources daily."
        );
      };
    }
  }

  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(start, 300);
  });
  /* Fallback if vault event already fired */
  if (g.__CLARITY_VAULT_SEALED__) setTimeout(start, 600);
  else if (document.readyState === "complete") setTimeout(start, 2500);
  else g.addEventListener("load", function () {
    setTimeout(start, 2000);
  });
})(typeof window !== "undefined" ? window : this);
