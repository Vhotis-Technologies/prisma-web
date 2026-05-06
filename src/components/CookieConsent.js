import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// Custom Cookie Icon Component
const CookieIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #e5e7eb;
  border-radius: 50%;
  position: relative;
  margin: 0 auto 1rem auto;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: #d1d5db;
    border-radius: 50%;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: #9ca3af;
    border-radius: 50%;
    box-shadow: 8px 8px 0 #6b7280, -8px 8px 0 #6b7280, 8px -8px 0 #6b7280,
      -8px -8px 0 #6b7280, 0 15px 0 #6b7280, 0 -15px 0 #6b7280, 15px 0 0 #6b7280,
      -15px 0 0 #6b7280;
  }
`;

const CookieModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled(motion.div)`
  background: #2d3748;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0 0 0.5rem 0;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #cbd5e0;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const CookieActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const AcceptButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #f7fafc;
  color: #2d3748;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:hover {
    background: #edf2f7;
  }
`;

const DeclineButton = styled(motion.button)`
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  color: #cbd5e0;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    color: white;
  }
`;

const SettingsLink = styled.button`
  background: none;
  border: none;
  color: #63b3ed;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font: inherit;
  font-size: 0.9rem;
  margin-top: 0.5rem;

  &:hover {
    color: #90cdf4;
  }
`;

const SettingsModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 2rem;
`;

const SettingsModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const SettingsModalHeader = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 1px solid #f3f4f6;

  h2 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .learn-more {
    color: #10b981;
    text-decoration: none;
    font-weight: 500;
    cursor: pointer;

    &:hover {
      color: #059669;
    }
  }
`;

const SettingsModalBody = styled.div`
  padding: 2rem;
`;

const CookieCategory = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  .category-info {
    flex: 1;
    margin-right: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #1f2937;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const LockIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  color: #6b7280;
  font-size: 0.8rem;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #e5e7eb;
    transition: 0.3s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  input:checked + .slider {
    background-color: #10b981;
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  input:disabled + .slider {
    background-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

const SettingsModalFooter = styled.div`
  padding: 1.5rem 2rem 2rem 2rem;
  border-top: 1px solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AcceptAllButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:hover {
    background: #059669;
  }
`;

const SaveSettingsButton = styled(motion.button)`
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;

  &:hover {
    background: #f9fafb;
  }
`;

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const preferences = JSON.parse(consent);
      setCookiePreferences(preferences);
    }
  }, []);

  const savePreferences = (preferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    setCookiePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);

    // Here you would typically initialize analytics or other tracking based on preferences
    if (preferences.analytics) {
      // Initialize Google Analytics or other analytics tools
      console.log("Analytics cookies enabled");
    }

    if (preferences.marketing) {
      // Initialize marketing tracking
      console.log("Marketing cookies enabled");
    }

    if (preferences.functional) {
      // Initialize functional features
      console.log("Functional cookies enabled");
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    savePreferences(essentialOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(cookiePreferences);
  };

  const handlePreferenceChange = (category) => {
    if (category === "essential") return; // Essential cookies cannot be disabled

    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <CookieModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <CookieIcon />
                <h2>We use Cookies</h2>
                <p>
                  We use cookies to enhance your browsing experience. By
                  continuing, you agree to our Cookie Policy.
                </p>
              </ModalHeader>

              <CookieActions>
                <AcceptButton
                  onClick={acceptAll}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Accept cookies
                </AcceptButton>
                <DeclineButton
                  onClick={acceptEssential}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Decline cookies
                </DeclineButton>
                <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                  <SettingsLink onClick={openSettings}>
                    Cookie Settings
                  </SettingsLink>
                </div>
              </CookieActions>
            </ModalContent>
          </CookieModal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
          >
            <SettingsModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SettingsModalHeader>
                <h2>Cookie settings</h2>
                <p>
                  We use cookies, some of them are essential, others are
                  optional. <span className="learn-more">Learn more</span>
                </p>
              </SettingsModalHeader>

              <SettingsModalBody>
                <CookieCategory>
                  <div className="category-info">
                    <h3>Strictly Necessary</h3>
                    <p>
                      These cookies are necessary for the website and can't be
                      deactivated.
                    </p>
                  </div>
                  <LockIndicator>🔒</LockIndicator>
                </CookieCategory>

                <CookieCategory>
                  <div className="category-info">
                    <h3>Marketing & Analytics</h3>
                    <p>
                      These cookies can be set by our advertising partners
                      through our website.
                    </p>
                  </div>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={cookiePreferences.marketing}
                      onChange={() => handlePreferenceChange("marketing")}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                </CookieCategory>

                <CookieCategory>
                  <div className="category-info">
                    <h3>Preferences</h3>
                    <p>
                      To individualize your content, we use tools that
                      personalize your web experience.
                    </p>
                  </div>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={cookiePreferences.functional}
                      onChange={() => handlePreferenceChange("functional")}
                    />
                    <span className="slider"></span>
                  </ToggleSwitch>
                </CookieCategory>
              </SettingsModalBody>

              <SettingsModalFooter>
                <AcceptAllButton
                  onClick={acceptAll}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Accept all cookies
                </AcceptAllButton>
                <SaveSettingsButton
                  onClick={saveCustomPreferences}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save settings
                </SaveSettingsButton>
              </SettingsModalFooter>
            </SettingsModalContent>
          </SettingsModal>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsent;
