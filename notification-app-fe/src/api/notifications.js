// =============================================
// src/api/notifications.js
// This file talks to the backend API.
// Has 3 log points: request start, success, failure
// =============================================

import { Log } from "../logger.js";
import { getAccessToken, invalidateToken } from "./auth.js";

// STEP 1: Replace this with your actual backend API URL
const BASE_URL = "http://4.224.186.213/evaluation-service";

/**
 * Fetch notifications from the API
 *
 * @param {number} page   - which page number (default: 1)
 * @param {number} limit  - how many per page (default: 10)
 * @param {string} type   - filter by type: "Event" | "Result" | "Placement" | "" (all)
 *
 * API call becomes: GET /notifications?page=1&limit=10&notification_type=Result
 */
export async function fetchNotifications({ page = 1, limit = 10, type = "" } = {}) {
  // LOG #3 - We are about to make an API call
  Log("frontend", "info", "api/notifications", "API request started — fetching notifications");

  try {
    // Build query string - only add notification_type if a filter is selected
    const params = new URLSearchParams({ page, limit });
    if (type) {
      params.append("notification_type", type);
    }

    const url = `${BASE_URL}/notifications?${params.toString()}`;

    // Get a (possibly cached, possibly freshly-refreshed) token instead
    // of relying on a token that was hardcoded at build time.
    let token = await getAccessToken();
    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    // The access token is short-lived. If it expired between when we
    // cached it and now, the server will reject the request — refresh
    // once and retry instead of failing outright.
    if (response.status === 401) {
      Log(
        "frontend",
        "warn",
        "api/notifications",
        "Access token rejected (401) — refreshing token and retrying once"
      );
      invalidateToken();
      token = await getAccessToken();
      response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
    }

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Temporary debug line — shows you the real shape in the console.
    console.log("RAW notifications response:", data);

    // Handle the common response shapes a backend might use, instead
    // of assuming `data` is already a plain array.
    const rawList = Array.isArray(data)
      ? data
      : Array.isArray(data?.notifications)
        ? data.notifications
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.results)
            ? data.results
            : [];

    // The API uses capitalized field names (ID, Type, Message, Timestamp)
    // — map them to the names the rest of the app (NotificationCard,
    // storageManager, etc.) expects.
    const notifications = rawList.map((n) => ({
      id: n.ID,
      notification_type: n.Type,
      message: n.Message,
      created_at: n.Timestamp,
    }));

    // LOG #4 - API call succeeded, log how many we got
    Log(
      "frontend",
      "info",
      "api/notifications",
      `API success — received ${notifications.length} notifications`
    );

    return notifications;
  } catch (error) {
    // LOG #5 - API call failed
    Log("frontend", "error", "api/notifications", `Network request failed — ${error.message}`);

    // Re-throw so the hook/component knows it failed
    throw error;
  }
}