// =============================================
// src/components/Navbar.jsx
// Top navigation bar - appears on every page.
// Uses MUI AppBar + Tabs for navigation.
// =============================================

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Figure out which tab is active based on current URL
  const currentTab = location.pathname === "/priority" ? 1 : 0;

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) navigate("/");
    if (newValue === 1) navigate("/priority");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* App title */}
        <NotificationsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Notification Center
        </Typography>

        {/* Navigation tabs */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="All Notifications" icon={<NotificationsIcon />} iconPosition="start" />
          <Tab label="Priority" icon={<StarIcon />} iconPosition="start" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}
