// =============================================
// logging-middleware/index.js
// This is the ONLY file you need to build first.
// Every other file in the project imports from here.
// =============================================

// STEP 1: Replace this URL with your actual logging API endpoint
const LOGGING_API_URL = "https://your-logging-api.com/logs";

/**
 * Log function - call this everywhere in your app
 *
 * @param {string} stack   - "frontend" or "backend"
 * @param {string} level   - "info" | "warn" | "error" | "fatal" | "debug"
 * @param {string} pkg     - which file/module is logging (e.g. "App", "api/notifications")
 * @param {string} message - what happened (e.g. "User opened notification 42")
 *
 * Example usage:
 *   Log("frontend", "info", "App", "Page loaded")
 *   Log("frontend", "error", "api/notifications", "Network request failed")
 */
export async function Log(stack, level, pkg, message) {
  const payload = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString(),
  };

  // Always print to browser console so you can see logs during development
  console.log(`[${level.toUpperCase()}] [${stack}/${pkg}] ${message}`);

  try {
    await fetch(LOGGING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_error) {
    // Logging must NEVER crash the app - fail silently
    // The console.log above still works even if API fails
  }
}
