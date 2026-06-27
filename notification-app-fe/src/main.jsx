// =============================================
// src/main.jsx
// This is the FIRST file React runs.
// LOG #1 goes here - "Application started"
// =============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";

// Import the logger from our middleware package
import { Log } from "./logger.js";

// LOG #1 - App is starting up
Log("frontend", "info", "main", "Application initialized");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
