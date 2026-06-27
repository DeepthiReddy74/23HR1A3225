// =============================================
// src/utils/storageManager.js
// Saves which notifications the user has read.
// Uses localStorage - data stays even after refresh.
// Has 1 log point: when notification is marked read
// =============================================

import { Log } from "../logger.js";

const STORAGE_KEY = "readNotifications";

/**
 * Get the list of all read notification IDs
 * Returns an array like: [1, 5, 23, 47]
 */
export function getReadIds() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Mark a notification as read
 * Adds its ID to localStorage if not already there
 */
export function markAsRead(id) {
  const readIds = getReadIds();

  if (!readIds.includes(id)) {
    const updated = [...readIds, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // LOG #8 - User read a notification
    Log("frontend", "info", "storageManager", `Notification ${id} marked as read`);
  }
}

/**
 * Check if a specific notification has been read
 * Returns true or false
 */
export function isRead(id) {
  return getReadIds().includes(id);
}

/**
 * Clear all read status (useful for testing)
 */
export function clearAllRead() {
  localStorage.removeItem(STORAGE_KEY);
}
