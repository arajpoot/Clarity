#!/usr/bin/env node
/**
 * Stamp data-min-i / data-always onto index.html from card-map.json
 * Usage: node assets/curriculum/stamp-cli.js [--write]
 */
"use strict";
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "../..");
const mapPath = path.join(__dirname, "card-map.json");
const indexPath = path.join(rootDir, "index.html");
const write = process.argv.includes("--write");

const PHASE_INDEX = { seeker: 0, "new-muslim": 1, daily: 2, dai: 3 };

const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const min = {};
const always = {};

Object.keys(map.folders).forEach((folder) => {
  const list = map.folders[folder] || [];
  if (folder === "shared") {
    list.forEach((id) => {
      always[id] = true;
      if (min[id] === undefined) min[id] = 0;
    });
    return;
  }
  const i = PHASE_INDEX[folder];
  list.forEach((id) => {
    if (min[id] === undefined || i < min[id]) min[id] = i;
  });
});

function folderFor(id) {
  if (always[id]) return "shared";
  const i = min[id];
  return i === 0 ? "seeker" : i === 1 ? "new-muslim" : i === 2 ? "daily" : i === 3 ? "dai" : "unmapped";
}

let html = fs.readFileSync(indexPath, "utf8");
let stamped = 0;
let missing = [];

Object.keys(min).forEach((id) => {
  const esc = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const idRe = new RegExp(`\\bid="${esc}"`);
  if (!idRe.test(html)) {
    missing.push(id);
    return;
  }
  // Match opening tag that contains this id
  const tagRe = new RegExp(`<([a-zA-Z0-9]+)([^>]*\\bid="${esc}"[^>]*)>`, "i");
  html = html.replace(tagRe, (full, name, attrs) => {
    stamped++;
    let a = attrs;
    if (/\bdata-min-i=/.test(a)) a = a.replace(/\sdata-min-i="[^"]*"/, ` data-min-i="${min[id]}"`);
    else a += ` data-min-i="${min[id]}"`;
    if (always[id]) {
      if (/\bdata-always=/.test(a)) a = a.replace(/\sdata-always="[^"]*"/, ` data-always="1"`);
      else a += ` data-always="1"`;
    } else {
      a = a.replace(/\sdata-always="[^"]*"/, "");
    }
    const folder = folderFor(id);
    if (/\bdata-curriculum-folder=/.test(a))
      a = a.replace(/\sdata-curriculum-folder="[^"]*"/, ` data-curriculum-folder="${folder}"`);
    else a += ` data-curriculum-folder="${folder}"`;
    return `<${name}${a}>`;
  });
});

const report = { write, stamped, missing, index: indexPath, map: mapPath };
console.log(JSON.stringify(report, null, 2));
if (write) {
  fs.writeFileSync(indexPath, html);
  console.log("Wrote", indexPath);
}
