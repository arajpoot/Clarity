#!/usr/bin/env node
/**
 * NurOS CI static smoke — Phase 9+
 * Usage: node scripts/nuros-ci-smoke.mjs [baseUrl]
 * Educational only — not a fatwa.
 */
import { writeFileSync } from "fs";

const BASE = process.argv[2] || "https://clarity-dawah.fyi";
const paths = ["/", "/companion/", "/daily/", "/campus/", "/amana/"];

async function fetchText(path) {
  const url = BASE.replace(/\/$/, "") + path;
  const res = await fetch(url, {
    headers: { "User-Agent": "NurOS-CI-Smoke/9" },
    redirect: "follow",
  });
  const text = await res.text();
  return { path, status: res.status, bytes: text.length, text };
}

function analyze(page) {
  const issues = [];
  const t = page.text;
  if (page.status !== 200) issues.push({ sev: 1, id: "http_" + page.status });
  if (!/not a fatwa/i.test(t)) issues.push({ sev: 2, id: "missing_stance" });

  if (page.path === "/") {
    ["/companion/", "/daily/", "/campus/", "/amana/"].forEach((h) => {
      if (!t.includes(h)) issues.push({ sev: 1, id: "port_missing_" + h });
    });
  }
  if (page.path.startsWith("/daily") && t.includes("/companion/assets/")) {
    issues.push({ sev: 1, id: "yawm_companion_bleed" });
  }
  if (page.path.startsWith("/amana") && t.includes("/campus/assets/")) {
    issues.push({ sev: 1, id: "amana_campus_bleed" });
  }
  if (page.path.startsWith("/campus")) {
    if (page.bytes > 100000) issues.push({ sev: 1, id: "campus_oversized_shell", bytes: page.bytes });
    if ((t.match(/\/companion\/assets\//g) || []).length > 5) {
      issues.push({ sev: 1, id: "campus_companion_script_bleed" });
    }
    if (!/data-clarity-room="university"/.test(t) && !/data-campus-page/.test(t)) {
      issues.push({ sev: 2, id: "campus_room_attr_weak" });
    }
  }
  return issues;
}

const report = {
  base: BASE,
  t: new Date().toISOString(),
  phase: "9+",
  pages: [],
  issues: [],
};

for (const p of paths) {
  try {
    const page = await fetchText(p);
    const issues = analyze(page);
    report.pages.push({
      path: p,
      status: page.status,
      bytes: page.bytes,
      issue_count: issues.length,
    });
    issues.forEach((i) => report.issues.push({ path: p, ...i }));
  } catch (e) {
    report.issues.push({ path: p, sev: 1, id: "fetch_error", message: String(e.message || e) });
  }
}

report.status = report.issues.some((i) => i.sev <= 1) ? "FAIL" : "PASS";
const out = "SMOKE_CI_" + Date.now() + ".json";
writeFileSync(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, issues: report.issues.length, artifact: out }, null, 2));
if (report.status === "FAIL") process.exitCode = 1;
