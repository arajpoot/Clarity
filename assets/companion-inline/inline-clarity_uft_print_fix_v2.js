(function(){
"use strict";
if (window.__CLARITY_UFT_PRINT_FIX_V2__) return;
window.__CLARITY_UFT_PRINT_FIX_V2__ = true;

function linesOf(s){
  if (typeof uftLines === "function") return uftLines(s);
  return String(s || "").split(/\n+/).map(function(x){ return x.trim(); }).filter(Boolean);
}

function collectTreeData(){
  var d = {};
  try { if (typeof uftCollect === "function") d = uftCollect() || {}; } catch(e){}
  try {
    var stored = (typeof uftRead === "function") ? uftRead() : {};
    if (stored && typeof stored === "object") {
      Object.keys(stored).forEach(function(k){
        if (d[k] == null || d[k] === "" || (Array.isArray(d[k]) && !d[k].length))
          d[k] = stored[k];
      });
    }
  } catch(e){}
  if (!Array.isArray(d.registry)) d.registry = [];
  if (!Array.isArray(d.relatives)) d.relatives = [];

  /* Harvest names from visible pedigree cards */
  try {
    var cards = document.querySelectorAll("#uft-preview .uft-person-card, #uft-stage .uft-person-card, #uft-preview [data-name], #uft-stage [data-uft-name]");
    var seen = {};
    d.registry.forEach(function(r){ if (r && r.name) seen[String(r.name).toLowerCase()] = true; });
    cards.forEach(function(card){
      var name = card.getAttribute("data-name") || card.getAttribute("data-uft-name") || "";
      if (!name) {
        var t = card.querySelector(".uft-name, .person-name, .ni-title, strong");
        if (t) name = (t.textContent || "").trim();
      }
      name = String(name || "").replace(/\s+/g, " ").trim();
      if (!name || name.length < 2) return;
      var key = name.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      d.registry.push({ name: name, role: card.getAttribute("data-role") || card.getAttribute("data-slot") || "" });
    });
  } catch(e){}

  /* From all-members API if present */
  try {
    if (typeof uftAllMembers === "function") {
      var all = uftAllMembers(d) || [];
      all.forEach(function(m){
        var name = (m && (m.name || m.fullName || m.label)) || "";
        name = String(name).trim();
        if (!name) return;
        var key = name.toLowerCase();
        var exists = d.registry.some(function(r){ return r && String(r.name||"").toLowerCase() === key; });
        if (!exists) d.registry.push({ name: name, role: (m.role || m.slot || "") });
      });
    }
  } catch(e){}

  return d;
}

function cleanupPrint(sheet){
  function done(){
    try { document.body.classList.remove("printing"); } catch(e){}
    try { if (sheet && sheet.parentNode) sheet.parentNode.removeChild(sheet); } catch(e){}
  }
  if (window.matchMedia) {
    var mql = window.matchMedia("print");
    var handler = function(e){ if (!e.matches) { mql.removeListener(handler); done(); } };
    try { mql.addListener(handler); } catch(e){}
  }
  window.onafterprint = function(){ done(); window.onafterprint = null; };
  setTimeout(done, 4000);
}

function runPrint(sheet){
  document.body.classList.add("printing");
  document.body.appendChild(sheet);
  /* Let layout settle before print dialog */
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      try { window.print(); } catch(e){}
      cleanupPrint(sheet);
    });
  });
}

window.uftPrintFamilySheet = function(){
  var d = collectTreeData();
  var lines = [];
  lines.push("<h2>Family group sheet — Clarity</h2>");
  lines.push("<p class=\"notes-hint\">Private summary from this device · " + new Date().toLocaleString() + "</p>");
  function row(label, val){
    if (!val) return;
    lines.push("<p><strong>" + label + ":</strong> " + String(val).replace(/</g, "") + "</p>");
  }
  row("You", d.self);
  row("Spouse", d.spouse);
  row("Father", d.father);
  row("Mother", d.mother);
  row("Children", linesOf(d.children).join(", "));
  row("Siblings", linesOf(d.siblings).join(", "));
  row("G3", linesOf(d.g3).join(", "));
  row("G2", linesOf(d.g2).join(", "));
  row("G1", linesOf(d.g1).join(", "));

  var reg = d.registry || [];
  if (reg.length) {
    lines.push("<h3>Member registry (" + reg.length + ")</h3><ul>");
    reg.forEach(function(r){
      if (!r || !r.name) return;
      lines.push("<li><strong>" + String(r.name).replace(/</g,"") + "</strong>" +
        (r.role ? " (" + String(r.role).replace(/</g,"") + ")" : "") +
        (r.phone ? " · " + String(r.phone).replace(/</g,"") : "") +
        (r.email ? " · " + String(r.email).replace(/</g,"") : "") +
        (r.city ? " · " + String(r.city).replace(/</g,"") : "") + "</li>");
    });
    lines.push("</ul>");
  }
  var rels = d.relatives || [];
  if (rels.length) {
    lines.push("<h3>Relations (" + rels.length + ")</h3><ul>");
    rels.forEach(function(r){
      if (!r || !r.name) return;
      lines.push("<li>" + String(r.name).replace(/</g,"") +
        (r.relation ? " · " + String(r.relation).replace(/</g,"") : "") +
        (r.anchor ? " (via " + String(r.anchor).replace(/</g,"") + ")" : "") + "</li>");
    });
    lines.push("</ul>");
  }
  if (lines.length <= 2) {
    lines.push("<p><em>No members found in form or registry. Open the pedigree so cards are visible, or add names in Names &amp; registry, then print again.</em></p>");
  }
  lines.push("<p class=\"notes-hint\">For planning only. Farāʾiḍ calculations are educational and not a fatwa.</p>");

  var sheet = document.createElement("div");
  sheet.className = "print-sheet";
  sheet.innerHTML = lines.join("\n");
  runPrint(sheet);
};

/** Print actual pedigree viewport snapshot (DOM clone) */
window.uftPrintPedigreeView = function(){
  var src = document.getElementById("uft-preview") || document.querySelector("#uft-stage .uft-preview") || document.getElementById("uft-stage");
  if (!src) {
    alert("Pedigree view not found. Unlock the vault and open the family tree first.");
    return;
  }
  var sheet = document.createElement("div");
  sheet.className = "print-sheet print-pedigree-snap";
  var head = document.createElement("div");
  head.innerHTML = "<h2 style=\"color:#0d4f3c;margin:0 0 0.5rem\">Pedigree snapshot — Clarity</h2>" +
    "<p style=\"font-size:0.85rem;color:#444;margin:0 0 0.75rem\">Private · this device · " + new Date().toLocaleString() + "</p>";
  sheet.appendChild(head);

  var clone = src.cloneNode(true);
  clone.id = "uft-preview-print-clone";
  clone.style.cssText = "display:block !important;visibility:visible !important;overflow:visible !important;max-height:none !important;height:auto !important;width:100% !important;min-height:320px;background:#0d3d30;color:#e8f0ea;padding:8px;border-radius:8px;";
  /* Expand scrolled areas */
  clone.querySelectorAll("*").forEach(function(el){
    try {
      el.style.maxHeight = "none";
      if (el.scrollWidth > el.clientWidth + 20) el.style.width = el.scrollWidth + "px";
    } catch(e){}
  });
  sheet.appendChild(clone);

  var foot = document.createElement("p");
  foot.className = "notes-hint";
  foot.style.cssText = "margin-top:0.75rem;font-size:0.8rem;color:#555";
  foot.textContent = "Snapshot of on-screen pedigree. Educational planning only — not a legal document.";
  sheet.appendChild(foot);

  runPrint(sheet);
};

/* Also expose on window for onclick */
window.uftPrintFamilySheet = window.uftPrintFamilySheet;
window.uftPrintPedigreeView = window.uftPrintPedigreeView;
})();