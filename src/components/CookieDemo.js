import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCookie, FaTrash, FaEye } from "react-icons/fa";
import {
  setCookie,
  getCookie,
  deleteCookie,
  getCookiePreferences,
  getCookiesByCategory,
  areCookiesEnabled,
} from "../utils/cookieUtils";

const DemoContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  p {
    color: #666;
    margin: 0;
  }
`;

const DemoSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;

  h3 {
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }

  p {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 0.9rem;
  }
`;

const DemoActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const DemoButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &.primary {
    background: #8b5cf6;
    color: white;

    &:hover {
      background: #7c3aed;
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #e5e7eb;
    }
  }

  &.danger {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }
  }
`;

const CookieList = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  max-height: 200px;
  overflow-y: auto;

  .cookie-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
      border-bottom: none;
    }

    .cookie-name {
      font-weight: 600;
      color: #1a1a1a;
    }

    .cookie-value {
      color: #666;
      font-size: 0.8rem;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cookie-category {
      background: #e5e7eb;
      color: #374151;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
    }
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;

  &.enabled {
    background: #d1fae5;
    color: #065f46;
  }

  &.disabled {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const CookieDemo = () => {
  const [cookiesEnabled, setCookiesEnabled] = useState(null);
  const [currentCookies, setCurrentCookies] = useState({});
  const [preferences, setPreferences] = useState({});
  const [testCookieName, setTestCookieName] = useState("test-cookie");
  const [testCookieValue, setTestCookieValue] = useState("test-value");

  useEffect(() => {
    loadCookieData();
  }, []);

  const loadCookieData = async () => {
    // Check if cookies are enabled
    const enabled = await areCookiesEnabled();
    setCookiesEnabled(enabled);

    // Get current cookies by category
    const cookies = getCookiesByCategory();
    setCurrentCookies(cookies);

    // Get user preferences
    const prefs = getCookiePreferences();
    setPreferences(prefs);
  };

  const handleSetCookie = () => {
    setCookie(testCookieName, testCookieValue, { expires: 7 });
    loadCookieData();
  };

  const handleGetCookie = () => {
    const value = getCookie(testCookieName);
    alert(`Cookie value: ${value || "Not found"}`);
  };

  const handleDeleteCookie = () => {
    deleteCookie(testCookieName);
    loadCookieData();
  };

  const handleClearAllCookies = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all cookies? This action cannot be undone."
      )
    ) {
      // Clear all cookies except essential ones
      const allCookies = document.cookie.split(";");
      allCookies.forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        if (cookieName && !cookieName.includes("cookie-consent")) {
          deleteCookie(cookieName);
        }
      });
      loadCookieData();
    }
  };

  return (
    <DemoContainer>
      <DemoHeader>
        <h2>
          <FaCookie />
          Cookie Management Demo
        </h2>
        <p>Test and manage cookies on this website</p>
      </DemoHeader>

      <DemoSection>
        <h3>Cookie Status</h3>
        <p>Check if cookies are enabled in your browser</p>
        <StatusIndicator className={cookiesEnabled ? "enabled" : "disabled"}>
          {cookiesEnabled ? "✅ Cookies Enabled" : "❌ Cookies Disabled"}
        </StatusIndicator>
        <DemoActions>
          <DemoButton
            className="secondary"
            onClick={loadCookieData}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Refresh Status
          </DemoButton>
        </DemoActions>
      </DemoSection>

      <DemoSection>
        <h3>Cookie Preferences</h3>
        <p>Current user cookie consent preferences</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {Object.entries(preferences).map(([category, enabled]) => (
            <div
              key={category}
              style={{
                padding: "0.75rem",
                background: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  textTransform: "capitalize",
                  marginBottom: "0.25rem",
                }}
              >
                {category}
              </div>
              <div style={{ color: enabled ? "#065f46" : "#991b1b" }}>
                {enabled ? "✅ Enabled" : "❌ Disabled"}
              </div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection>
        <h3>Test Cookie Operations</h3>
        <p>Test basic cookie operations with a sample cookie</p>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Cookie Name:
          </label>
          <input
            type="text"
            value={testCookieName}
            onChange={(e) => setTestCookieName(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          />
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
            }}
          >
            Cookie Value:
          </label>
          <input
            type="text"
            value={testCookieValue}
            onChange={(e) => setTestCookieValue(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
            }}
          />
        </div>
        <DemoActions>
          <DemoButton
            className="primary"
            onClick={handleSetCookie}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Set Cookie
          </DemoButton>
          <DemoButton
            className="secondary"
            onClick={handleGetCookie}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaEye />
            Get Cookie
          </DemoButton>
          <DemoButton
            className="danger"
            onClick={handleDeleteCookie}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaTrash />
            Delete Cookie
          </DemoButton>
        </DemoActions>
      </DemoSection>

      <DemoSection>
        <h3>Current Cookies</h3>
        <p>All cookies currently stored on this website</p>
        <CookieList>
          {Object.keys(currentCookies).length === 0 ? (
            <div
              style={{ textAlign: "center", color: "#666", padding: "1rem" }}
            >
              No cookies found
            </div>
          ) : (
            Object.entries(currentCookies).map(([category, cookies]) =>
              cookies.map((cookie, index) => (
                <div key={`${category}-${index}`} className="cookie-item">
                  <div>
                    <div className="cookie-name">{cookie.name}</div>
                    <div className="cookie-value">{cookie.value}</div>
                  </div>
                  <div className="cookie-category">{category}</div>
                </div>
              ))
            )
          )}
        </CookieList>
        <DemoActions>
          <DemoButton
            className="danger"
            onClick={handleClearAllCookies}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaTrash />
            Clear All Cookies
          </DemoButton>
        </DemoActions>
      </DemoSection>
    </DemoContainer>
  );
};

export default CookieDemo;
