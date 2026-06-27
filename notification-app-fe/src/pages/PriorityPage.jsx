// =============================================
// src/pages/PriorityPage.jsx
// Page 2: Shows top 10 priority notifications.
// Priority = Placement (3pts) > Result (2pts) > Event (1pt)
// =============================================

import { useMemo, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNotifications } from "../hooks/useNotifications";
import { getTopN, getWeight } from "../utils/prioritySorter";
import { markAsRead, getReadIds } from "../utils/storageManager";
import { Log } from "../logger.js";

// Color for weight badges
const WEIGHT_COLORS = { 3: "success", 2: "primary", 1: "warning" };

export default function PriorityPage() {
  // Reuse the same hook - loads all notifications (no filter)
  const { notifications, loading, error } = useNotifications();

  // Track read IDs in React state so the UI re-renders when one changes.
  // (Reading straight from localStorage on every render doesn't trigger
  // a re-render when it changes — React has no idea localStorage was
  // touched — so the Read/Unread chip would never update until the
  // page reloaded for some other reason.)
  const [readIds, setReadIds] = useState(() => getReadIds());

  // Calculate top 10 - only recalculates when notifications list changes
  const top10 = useMemo(() => {
    if (notifications.length === 0) return [];
    return getTopN(notifications, 10); // Log #9 fires inside getTopN
  }, [notifications]);

  const handleRowClick = (notification) => {
    markAsRead(notification.id);
    setReadIds(getReadIds()); // pull the updated list so we re-render
    Log(
      "frontend",
      "info",
      "PriorityPage",
      `User opened priority notification ${notification.id}`
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {/* Page title */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <StarIcon color="warning" />
        <Typography variant="h5" fontWeight="bold">
          Priority Notifications
        </Typography>
      </Box>

      {/* Weight legend */}
      <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
        <Chip label="Placement = 3pts" color="success" size="small" />
        <Chip label="Result = 2pts" color="primary" size="small" />
        <Chip label="Event = 1pt" color="warning" size="small" />
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && !loading && (
        <Alert severity="error">Failed to load: {error}</Alert>
      )}

      {/* Priority table */}
      {!loading && top10.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell><strong>Rank</strong></TableCell>
                <TableCell><strong>Notification</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Weight</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {top10.map((notification, index) => {
                const read = readIds.includes(notification.id);
                return (
                  <TableRow
                    key={notification.id}
                    hover
                    onClick={() => handleRowClick(notification)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: read ? "inherit" : "action.hover",
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold" color="text.secondary">
                        #{index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={read ? "normal" : "bold"}>
                        {notification.title || `Notification #${notification.id}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.message || ""}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={notification.notification_type}
                        color={WEIGHT_COLORS[getWeight(notification.notification_type)] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">
                        {getWeight(notification.notification_type)} pts
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={read ? "Read" : "Unread"}
                        size="small"
                        variant="outlined"
                        color={read ? "default" : "info"}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && top10.length === 0 && !error && (
        <Alert severity="info">No notifications available.</Alert>
      )}
    </Container>
  );
}