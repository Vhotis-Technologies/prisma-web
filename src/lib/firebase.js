import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let analytics = null;
let initPromise = null;
/* Gets the google analytics measurement id or returns an empty string if not set */
function getMeasurementId() {
  return firebaseConfig.measurementId || "";
}

/* Sets the google analytics measurement id to disabled or enabled */
function setGaDisabled(disabled) {
  const measurementId = getMeasurementId();
  if (!measurementId || typeof window === "undefined") return;
  window[`ga-disable-${measurementId}`] = disabled;
}

/* Clears the google analytics cookies */
function clearAnalyticsCookies() {
  if (typeof document === "undefined") return;

  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    const lower = name.toLowerCase();
    if (
      lower.startsWith("_ga") ||
      lower.startsWith("_gid") ||
      lower.includes("firebase") ||
      lower.includes("_gat")
    ) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    }
  });
}

/**
 * Initialize Firebase Analytics only after analytics consent.
 * Safe to call multiple times — subsequent calls reuse the same instance.
 */
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey || !firebaseConfig.measurementId) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Prisma Analytics] Missing Firebase env vars. Check REACT_APP_FIREBASE_*."
      );
    }
    return null;
  }

  if (analytics) return analytics;
  if (initPromise) return initPromise;

  setGaDisabled(false);

  initPromise = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) return null;

      const app = getApps().length
        ? getApps()[0]
        : initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
      logEvent(analytics, "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });
      return analytics;
    } catch (error) {
      console.warn("[Prisma Analytics] init failed:", error);
      initPromise = null;
      return null;
    }
  })();

  return initPromise;
}

/**
 * Stop sending analytics hits and clear GA cookies when consent is withdrawn.
 */
export function disableAnalytics() {
  setGaDisabled(true);
  analytics = null;
  initPromise = null;
  clearAnalyticsCookies();
}

/**
 * Log a custom event if analytics is active.
 */
export function trackEvent(name, params = {}) {
  if (!analytics) return;
  try {
    logEvent(analytics, name, params);
  } catch (error) {
    console.warn("[Prisma Analytics] trackEvent failed:", error);
  }
}

export function isAnalyticsReady() {
  return analytics !== null;
}
