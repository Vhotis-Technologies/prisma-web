/** Public origin of the client SPA (no trailing slash). */
const DEFAULT_WEB =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173"
    : "https://app.prismavalet.com";

export const CLIENT_WEB_URL = (
  process.env.REACT_APP_CLIENT_WEB_URL || DEFAULT_WEB
).replace(/\/$/, "");

export const registerUrl = `${CLIENT_WEB_URL}/register`;
export const loginUrl = `${CLIENT_WEB_URL}/login`;
export const welcomeUrl = `${CLIENT_WEB_URL}/welcome`;
