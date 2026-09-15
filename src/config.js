/** Public origin of the client SPA (no trailing slash). */
const DEFAULT_WEB =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://staging.app.prismavalet.com";

/** Django client API base (no trailing slash). Prefer dedicated client host over /client on app. */
const DEFAULT_API =
  process.env.NODE_ENV === "development"
    ? "http://localhost/client"
    : "https://staging.client.prismavalet.com";

export const CLIENT_WEB_URL = (
  process.env.REACT_APP_CLIENT_WEB_URL || DEFAULT_WEB
).replace(/\/$/, "");

export const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || DEFAULT_API
).replace(/\/$/, "");

export const registerUrl = `${CLIENT_WEB_URL}/register`;
export const loginUrl = `${CLIENT_WEB_URL}/login`;
export const welcomeUrl = `${CLIENT_WEB_URL}/welcome`;
