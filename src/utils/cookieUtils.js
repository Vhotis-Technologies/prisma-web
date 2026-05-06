// Cookie utility functions for managing cookies and user preferences

/**
 * Set a cookie with the given name, value, and options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options (expires, path, domain, secure, sameSite)
 */
export const setCookie = (name, value, options = {}) => {
  const {
    expires = 365, // Default to 1 year
    path = "/",
    domain,
    secure = window.location.protocol === "https:",
    sameSite = "Lax",
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
};

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 * @param {string} path - Cookie path (default: '/')
 * @param {string} domain - Cookie domain
 */
export const deleteCookie = (name, path = "/", domain) => {
  setCookie(name, "", { expires: -1, path, domain });
};

/**
 * Check if cookies are enabled in the browser
 * @returns {Promise<boolean>} - True if cookies are enabled
 */
export const areCookiesEnabled = () => {
  return new Promise((resolve) => {
    try {
      // Try to set a test cookie
      const testCookieName = "cookie-test";
      const testCookieValue = "test-value";

      setCookie(testCookieName, testCookieValue, { expires: 1 });

      // Check if the cookie was set
      const cookieValue = getCookie(testCookieName);

      if (cookieValue === testCookieValue) {
        // Clean up the test cookie
        deleteCookie(testCookieName);
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.warn("Cookie test failed:", error);
      resolve(false);
    }
  });
};

/**
 * Get user's cookie consent preferences
 * @returns {Object} - Cookie preferences object
 */
export const getCookiePreferences = () => {
  try {
    const consent = localStorage.getItem("cookie-consent");
    if (consent) {
      return JSON.parse(consent);
    }
  } catch (error) {
    console.warn("Error reading cookie preferences:", error);
  }

  // Return default preferences if none found
  return {
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  };
};

/**
 * Save user's cookie consent preferences
 * @param {Object} preferences - Cookie preferences object
 */
export const saveCookiePreferences = (preferences) => {
  try {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.warn("Error saving cookie preferences:", error);
    return false;
  }
};

/**
 * Check if user has given consent for a specific cookie category
 * @param {string} category - Cookie category (essential, analytics, marketing, functional)
 * @returns {boolean} - True if consent is given
 */
export const hasConsentForCategory = (category) => {
  const preferences = getCookiePreferences();
  return preferences[category] === true;
};

/**
 * Initialize analytics based on user consent
 * @param {Function} analyticsInitFunction - Function to initialize analytics
 */
export const initializeAnalytics = (analyticsInitFunction) => {
  if (
    hasConsentForCategory("analytics") &&
    typeof analyticsInitFunction === "function"
  ) {
    analyticsInitFunction();
  }
};

/**
 * Initialize marketing tracking based on user consent
 * @param {Function} marketingInitFunction - Function to initialize marketing tracking
 */
export const initializeMarketing = (marketingInitFunction) => {
  if (
    hasConsentForCategory("marketing") &&
    typeof marketingInitFunction === "function"
  ) {
    marketingInitFunction();
  }
};

/**
 * Clear all cookies except essential ones
 */
export const clearNonEssentialCookies = () => {
  const allCookies = document.cookie.split(";");

  allCookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();

    // Skip essential cookies and our consent cookie
    if (cookieName !== "cookie-consent" && !isEssentialCookie(cookieName)) {
      // Only clear if user hasn't consented to the category
      if (!hasConsentForCategory(getCookieCategory(cookieName))) {
        deleteCookie(cookieName);
      }
    }
  });
};

/**
 * Check if a cookie is essential (cannot be disabled)
 * @param {string} cookieName - Name of the cookie
 * @returns {boolean} - True if cookie is essential
 */
export const isEssentialCookie = (cookieName) => {
  const essentialCookies = [
    "cookie-consent",
    "session-id",
    "csrf-token",
    "user-auth",
    "language-preference",
  ];

  return essentialCookies.some((essential) =>
    cookieName.toLowerCase().includes(essential.toLowerCase())
  );
};

/**
 * Get the category of a cookie based on its name
 * @param {string} cookieName - Name of the cookie
 * @returns {string} - Cookie category
 */
export const getCookieCategory = (cookieName) => {
  const analyticsKeywords = ["analytics", "google", "gtag", "ga", "fbp"];
  const marketingKeywords = [
    "marketing",
    "ads",
    "advertising",
    "facebook",
    "twitter",
  ];
  const functionalKeywords = ["functional", "preferences", "theme", "language"];

  const name = cookieName.toLowerCase();

  if (analyticsKeywords.some((keyword) => name.includes(keyword))) {
    return "analytics";
  }

  if (marketingKeywords.some((keyword) => name.includes(keyword))) {
    return "marketing";
  }

  if (functionalKeywords.some((keyword) => name.includes(keyword))) {
    return "functional";
  }

  return "essential";
};

/**
 * Get all cookies with their categories
 * @returns {Object} - Object with cookie categories as keys and arrays of cookies as values
 */
export const getCookiesByCategory = () => {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    if (cookieName) {
      const category = getCookieCategory(cookieName);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        name: cookieName,
        value: getCookie(cookieName),
        category: category,
      });
    }
    return acc;
  }, {});

  return cookies;
};

/**
 * Cookie categories configuration
 */
export const COOKIE_CATEGORIES = {
  ESSENTIAL: "essential",
  ANALYTICS: "analytics",
  MARKETING: "marketing",
  FUNCTIONAL: "functional",
};

/**
 * Default cookie preferences
 */
export const DEFAULT_PREFERENCES = {
  [COOKIE_CATEGORIES.ESSENTIAL]: true,
  [COOKIE_CATEGORIES.ANALYTICS]: false,
  [COOKIE_CATEGORIES.MARKETING]: false,
  [COOKIE_CATEGORIES.FUNCTIONAL]: false,
};
