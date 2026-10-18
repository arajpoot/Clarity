/**
 * N6 Foundation display labels (surface) — single map for phase plaque / engine titles.
 * Used by cu-labels-n2; safe if foundation strings change later.
 */
(function (g) {
  "use strict";
  g.CU_PHASE_LABELS = {
    seeker: { label: "Seeker", subtitle: "Foundations · belief", phase: 1 },
    practice: { label: "Practice", subtitle: "Skills after foundations", phase: 2 },
    consistency: { label: "Consistency", subtitle: "Steady craft & review", phase: 3 },
    transmission: { label: "Transmission", subtitle: "Share with adab & sources", phase: 4 }
  };
  g.CU_PHASE_ORDER = ["seeker", "practice", "consistency", "transmission"];
})(window);
