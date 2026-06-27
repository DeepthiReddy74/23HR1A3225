const LOGGING_API_URL = "https://your-logging-api.com/logs";

export async function Log(stack, level, pkg, message) {
  console.log(`[${level.toUpperCase()}] [${stack}/${pkg}] ${message}`);
  try {
    await fetch(LOGGING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stack, level, package: pkg, message,
        timestamp: new Date().toISOString()
      }),
    });
  } catch (_) {}
}