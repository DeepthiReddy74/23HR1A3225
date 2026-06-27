// =============================================
// src/hooks/useNotifications.js
// This hook manages ALL notification state.
// Components just call this hook - no API logic in components.
// Has 2 log points: filter change, page change
// =============================================

import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { Log } from "../logger.js";

export function useNotifications() {
  // --- STATE ---
  const [notifications, setNotifications] = useState([]); // the list of notifications
  const [loading, setLoading] = useState(false);           // true while API is running
  const [error, setError] = useState(null);                // error message if API fails
  const [page, setPage] = useState(1);                     // current page number
  const [totalPages, setTotalPages] = useState(1);         // total pages from API
  const [filter, setFilter] = useState("");                // "" | "Event" | "Result" | "Placement"

  // --- FETCH FUNCTION ---
  // useCallback means this function only re-creates when page or filter changes
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({ page, limit: 10, type: filter });
     setNotifications(Array.isArray(data) ? data : []);
      // If your API returns total pages, set it here:
      // setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  // --- AUTO-FETCH ---
  // Runs loadNotifications whenever page or filter changes
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // --- ACTIONS ---

  // Called when user picks a filter from the dropdown
  const changeFilter = (newFilter) => {
    // LOG #6 - User changed filter
    Log("frontend", "info", "useNotifications", `User changed filter to: ${newFilter || "all"}`);
    setFilter(newFilter);
    setPage(1); // Reset to page 1 when filter changes
  };

  // Called when user clicks a page number
  const changePage = (newPage) => {
    // LOG #7 - User changed page
    Log("frontend", "info", "useNotifications", `User changed page to: ${newPage}`);
    setPage(newPage);
  };

  // Return everything the components need
  return {
    notifications,
    loading,
    error,
    page,
    totalPages,
    filter,
    changeFilter,
    changePage,
  };
}
