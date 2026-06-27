// =============================================
// src/utils/prioritySorter.js
// Sorts notifications by importance:
//   Placement (weight 3) > Result (weight 2) > Event (weight 1)
// If same weight, newer ones come first.
// Has 1 log point: when top N is calculated
// =============================================

import { Log } from "../logger.js";

// Weight map - higher number = more important
const WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Sort notifications by priority and return the top N
 *
 * @param {Array}  notifications - full list from API
 * @param {number} n             - how many to return (default: 10)
 *
 * Example:
 *   getTopN(notifications, 10) → top 10 most important
 */
export function getTopN(notifications, n = 10) {
  const sorted = [...notifications].sort((a, b) => {
    const weightA = WEIGHTS[a.notification_type] || 0;
    const weightB = WEIGHTS[b.notification_type] || 0;

    // Step 1: Sort by weight (higher weight = comes first)
    if (weightB !== weightA) {
      return weightB - weightA;
    }

    // Step 2: Same weight? Sort by date (newer = comes first)
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const topN = sorted.slice(0, n);

  // LOG #9 - Priority calculation done
  Log("frontend", "info", "prioritySorter", `Top ${n} notifications calculated`);

  return topN;
}

/**
 * Get the weight of a notification type (useful for displaying)
 */
export function getWeight(type) {
  return WEIGHTS[type] || 0;
}
