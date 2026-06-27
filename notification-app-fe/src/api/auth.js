import { Log } from "../logger.js";

const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";

const CREDENTIALS = {
  email: "reddydeepthi68699@gmail.com",
  name: "gangasani deepthi",
  rollNo: "23hr1a3225",
  accessCode: "aTkybs",
  clientID: "3cf40093-85e5-4031-a46b-856009eabc53",
  clientSecret: "DGkeBttgMVuvbhVB",
};

let cachedToken = null;
let tokenExpiresAt = 0;
const REFRESH_SKEW_MS = 30 * 1000;

async function requestNewToken() {
  Log("frontend", "info", "api/auth", "Requesting a new access token");

  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(CREDENTIALS),
  });

  if (!response.ok) {
    throw new Error(`Auth failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
 cachedToken = data.access_token;

  // This API returns `expires_in` as an absolute Unix timestamp (in
  // seconds) — the exact moment the token dies — not a duration.
  tokenExpiresAt = data.expires_in * 1000 - REFRESH_SKEW_MS;
  return cachedToken;
}

export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }
  return requestNewToken();
}

export function invalidateToken() {
  cachedToken = null;
  tokenExpiresAt = 0;
}