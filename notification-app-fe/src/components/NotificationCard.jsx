// =============================================
// src/components/NotificationCard.jsx
// One notification displayed as a card.
// Shows read/unread status visually.
// =============================================

import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  CardActionArea,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

// Color for each notification type chip
const TYPE_COLORS = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
};

/**
 * Props:
 *   notification - the notification object from API
 *   isRead       - true if user has already opened this
 *   onClick      - function to call when card is clicked
 */
export default function NotificationCard({ notification, isRead, onClick }) {
  const chipColor = TYPE_COLORS[notification.notification_type] || "default";

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1.5,
        // Unread cards have slightly different background
        backgroundColor: isRead ? "background.paper" : "action.hover",
        border: isRead ? "1px solid" : "2px solid",
        borderColor: isRead ? "divider" : "primary.main",
        transition: "all 0.2s ease",
      }}
    >
      <CardActionArea onClick={() => onClick(notification)}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            {/* Notification title */}
            <Typography variant="subtitle1" fontWeight={isRead ? "normal" : "bold"}>
              {/* Unread dot indicator */}
              {!isRead && (
                <CircleIcon
                  sx={{ fontSize: 10, color: "primary.main", mr: 1, verticalAlign: "middle" }}
                />
              )}
              {notification.title || "Notification"}
            </Typography>

            {/* Type badge */}
            <Chip
              label={notification.notification_type}
              color={chipColor}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>

          {/* Notification message */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {notification.message || notification.description || "No message"}
          </Typography>

          {/* Timestamp */}
          <Typography variant="caption" color="text.disabled">
            {new Date(notification.created_at).toLocaleString()}
          </Typography>

          {/* Read/Unread label */}
          <Box sx={{ mt: 0.5 }}>
            <Chip
              label={isRead ? "Read" : "Unread"}
              size="small"
              variant="outlined"
              color={isRead ? "default" : "info"}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
