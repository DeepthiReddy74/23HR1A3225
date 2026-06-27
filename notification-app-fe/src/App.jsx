// =============================================
// src/App.jsx
// Sets up routing between the two pages.
// LOG #2 goes here - "Page loaded"
// =============================================

import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Log } from "./logger.js";
import Navbar from "./components/Navbar";
import NotificationsPage from "./pages/NotificationsPage";
import PriorityPage from "./pages/PriorityPage";

// Material UI theme - you can customize colors here
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

export default function App() {
  useEffect(() => {
    // LOG #2 - App component mounted (page is visible to user)
    Log("frontend", "info", "App", "NotificationsPage loaded");
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* Navbar appears on every page */}
        <Navbar />
        <Routes>
          {/* Page 1: All Notifications */}
          <Route path="/" element={<NotificationsPage />} />
          {/* Page 2: Priority Notifications */}
          <Route path="/priority" element={<PriorityPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
