// =============================================
// src/pages/NotificationsPage.jsx
// Page 1: Shows all notifications with filter + pagination.
// This file ALREADY EXISTS in your project - replace its content.
// Has 1 log point: when user opens/clicks a notification
// =============================================

import {
  Container,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { Log } from "../logger.js";
import { useNotifications } from "../hooks/useNotifications";
import { markAsRead, isRead } from "../utils/storageManager";
import NotificationFilter from "../components/NotificationFilter";
import NotificationCard from "../components/NotificationCard";

export default function NotificationsPage() {
  // Get everything from the hook - no API calls directly in the page
  const {
    notifications,
    loading,
    error,
    page,
    totalPages,
    filter,
    changeFilter,
    changePage,
  } = useNotifications();

  // Called when user clicks on a notification card
  const handleNotificationClick = (notification) => {
    // Mark it as read in localStorage
    markAsRead(notification.id);

    // LOG #10 - User opened a notification
    Log(
      "frontend",
      "info",
      "NotificationsPage",
      `User opened notification ${notification.id} (type: ${notification.notification_type})`
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Page title */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        All Notifications
      </Typography>

      {/* Filter dropdown */}
      <Box sx={{ mb: 2 }}>
        <NotificationFilter value={filter} onChange={changeFilter} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && !loading && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {/* Notification list */}
      {!loading && notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          isRead={isRead(notification.id)}
          onClick={handleNotificationClick}
        />
      ))}

      {/* Pagination */}
      {!loading && notifications.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => changePage(value)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}
