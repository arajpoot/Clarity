/* Vault unit print / export pack — only while unlocked */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_PRINT_V1__) return;
  g.__CU_VAULT_PRINT_V1__ = true;

  function V() {
    return g.ClarityVaultSecure;
  }

  function buildText() {
    var d = V().data();
    if (!d) return "";
    var lines = [
      "Clarity University — Amana educational pack",
      "Educational only — not a fatwa or legal will.",
      "Generated on-device. Keep private.",
      "",
      "=== IDENTITY & KIN ===",
      "Identity: " + (d.amana && d.amana.identity),
      "Next of kin: " + (d.amana && d.amana.nextOfKin),
      "",
      "=== DEBTS / TRUSTS ===",
      (d.amana && d.amana.debts) || "",
      "",
      "=== WASIYYAH NOTES ===",
      (d.amana && d.amana.wasiyyahNote) || (d.wasiyyah && d.wasiyyah.text) || "",
      "",
      "=== MISSED OBLIGATIONS (notes) ===",
      (d.amana && d.amana.missed) || "",
      "",
      "=== DUʿĀ LIST ===",
      (d.amana && d.amana.dua) || "",
      "",
      "=== JANAZAH NOTES ===",
      (d.amana && d.amana.janazahNote) || "",
      "",
      "=== DO-NOT (educational) ===",
      (d.amana && d.amana.doNot) || "",
      "",
      "=== FAMILY TREE (names) ==="
    ];
    var people = (d.tree && d.tree.people) || [];
    people.forEach(function (p) {
      lines.push(
        "- " +
          (p.name || "") +
          " [" +
          (p.gender || "") +
          "] " +
          (p.vital || "") +
          (p.isYou ? " (you)" : "")
      );
    });
    if (d.tree && d.tree.notes) lines.push("Tree notes: " + d.tree.notes);
    lines.push("", "=== FARĀʾIḌ STUDY NOTES ===", (d.faraid && d.faraid.scenario) || "", (d.faraid && d.faraid.notes) || "");
    lines.push("", "— End of pack —");
    return lines.join("\n");
  }

  function printPack() {
    if (!V() || !V().isUnlocked()) {
      alert("Unlock the vault first.");
      return;
    }
    var text = buildText();
    var w = window.open("", "_blank");
    if (!w) {
      alert("Allow pop-ups to print, or use Export.");
      return;
    }
    w.document.write(
      "<pre style=\"font:14px/1.45 system-ui,sans-serif;white-space:pre-wrap;padding:1.5rem\">" +
        text.replace(/</g, "&lt;") +
        "</pre>"
    );
    w.document.close();
    w.focus();
    try {
      w.print();
    } catch (e) {}
  }

  function exportPack() {
    if (!V() || !V().isUnlocked()) {
      alert("Unlock the vault first.");
      return;
    }
    var blob = new Blob([buildText()], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clarity-amana-educational-pack.txt";
    a.click();
  }

  g.ClarityVaultPrint = { printPack: printPack, exportPack: exportPack, buildText: buildText };
})(typeof window !== "undefined" ? window : this);
