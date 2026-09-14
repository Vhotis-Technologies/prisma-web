import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaLock, FaChartLine, FaSlidersH, FaBullhorn } from "react-icons/fa";
import {
  applyConsentPreferences,
  getCookiePreferences,
  hasConsentBeenSet,
  DEFAULT_PREFERENCES,
} from "../utils/cookieUtils";
import { initAnalytics, disableAnalytics } from "../lib/firebase";

// Matches prisma_web / prisma_client primary blues
const PRISMA_PRIMARY = "#0074d4";
const PRISMA_PRIMARY_HOVER = "#005fad";
const PRISMA_PRIMARY_SOFT = "#e6f3fb";
const TEXT_DARK = "#212121";
const TEXT_MUTED = "#424242";

export const OPEN_COOKIE_SETTINGS_EVENT = "prisma:open-cookie-settings";

const BannerShell = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1100;
  padding: 1rem;
  pointer-events: none;

  @media (min-width: 768px) {
    padding: 1.25rem 1.5rem;
  }
`;

const BannerCard = styled(motion.div)`
  pointer-events: auto;
  max-width: 720px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid ${PRISMA_PRIMARY_SOFT};
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(0, 116, 212, 0.14),
    0 4px 16px rgba(26, 26, 26, 0.06);
  overflow: hidden;
`;

const AccentBar = styled.div`
  height: 4px;
  background: ${PRISMA_PRIMARY};
`;

const BannerBody = styled.div`
  padding: 1.25rem 1.35rem 1.35rem;

  @media (min-width: 640px) {
    padding: 1.5rem 1.75rem 1.6rem;
  }
`;

const BannerTop = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.15rem;
`;

const IconBadge = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${PRISMA_PRIMARY_SOFT};
  color: ${PRISMA_PRIMARY};
  font-size: 1.15rem;
`;

const BannerCopy = styled.div`
  h2 {
    margin: 0 0 0.35rem;
    color: ${TEXT_DARK};
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: ${TEXT_MUTED};
    font-size: 0.92rem;
    line-height: 1.55;
  }

  a {
    color: ${PRISMA_PRIMARY};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BannerActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  @media (min-width: 560px) {
    flex-direction: row;
    align-items: center;
  }
`;

const PrimaryButton = styled(motion.button)`
  flex: 1;
  border: none;
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  background: ${PRISMA_PRIMARY};
  box-shadow: 0 4px 14px rgba(0, 116, 212, 0.28);

  &:hover {
    background: ${PRISMA_PRIMARY_HOVER};
  }
`;

const SecondaryButton = styled(motion.button)`
  flex: 1;
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${PRISMA_PRIMARY};
  background: ${PRISMA_PRIMARY_SOFT};
  border: 1px solid transparent;

  &:hover {
    background: #d6ebf8;
  }
`;

const TextButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${TEXT_MUTED};
  font-weight: 600;
  font-size: 0.88rem;
  padding: 0.5rem 0.25rem;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: ${PRISMA_PRIMARY};
  }

  @media (min-width: 560px) {
    margin-left: 0.25rem;
    white-space: nowrap;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(26, 26, 26, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 640px) {
    align-items: center;
    padding: 1.5rem;
  }
`;

const SettingsCard = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  max-height: min(88vh, 680px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  border: 1px solid ${PRISMA_PRIMARY_SOFT};
  box-shadow: 0 24px 60px rgba(0, 116, 212, 0.16);
`;

const SettingsHeader = styled.div`
  padding: 1.5rem 1.5rem 1.1rem;
  border-bottom: 1px solid #e5e5e5;

  h2 {
    margin: 0 0 0.4rem;
    color: ${TEXT_DARK};
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: ${TEXT_MUTED};
    font-size: 0.9rem;
    line-height: 1.5;
  }

  a {
    color: ${PRISMA_PRIMARY};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SettingsBody = styled.div`
  padding: 0.5rem 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const CategoryRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 0;
  border-bottom: 1px solid #e5e5e5;

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryInfo = styled.div`
  display: flex;
  gap: 0.85rem;
  flex: 1;
  min-width: 0;
`;

const CategoryIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${PRISMA_PRIMARY_SOFT};
  color: ${PRISMA_PRIMARY};
  font-size: 0.9rem;
`;

const CategoryText = styled.div`
  h3 {
    margin: 0 0 0.3rem;
    color: ${TEXT_DARK};
    font-size: 0.98rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: ${TEXT_MUTED};
    font-size: 0.85rem;
    line-height: 1.45;
  }
`;

const AlwaysOn = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: ${PRISMA_PRIMARY_SOFT};
  color: ${PRISMA_PRIMARY};
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
  margin-top: 0.2rem;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    inset: 0;
    cursor: pointer;
    background: #e5e7eb;
    border-radius: 999px;
    transition: 0.2s ease;

    &:before {
      content: "";
      position: absolute;
      height: 22px;
      width: 22px;
      left: 3px;
      top: 3px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      transition: 0.2s ease;
    }
  }

  input:checked + .slider {
    background: ${PRISMA_PRIMARY};
  }

  input:checked + .slider:before {
    transform: translateX(20px);
  }

  input:focus-visible + .slider {
    outline: 2px solid ${PRISMA_PRIMARY};
    outline-offset: 2px;
  }
`;

const SettingsFooter = styled.div`
  padding: 1.15rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const OutlineButton = styled(motion.button)`
  flex: 1;
  cursor: pointer;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: ${TEXT_DARK};
  background: #fff;
  border: 1px solid #e5e5e5;

  &:hover {
    background: #fafafa;
    border-color: #d1d5db;
  }
`;

const CATEGORIES = [
  {
    key: "essential",
    title: "Strictly necessary",
    description:
      "Required for security, navigation, and remembering your cookie choices. Always on.",
    icon: FaLock,
    locked: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Helps us understand how visitors use Prisma via Google Analytics (Firebase). No ads.",
    icon: FaChartLine,
    locked: false,
  },
  {
    key: "functional",
    title: "Preferences",
    description:
      "Remembers choices that make the site feel more personal, such as display preferences.",
    icon: FaSlidersH,
    locked: false,
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Optional cookies for future campaigns and measuring promotional content. Off by default.",
    icon: FaBullhorn,
    locked: false,
  },
];

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (!hasConsentBeenSet()) {
      setShowBanner(true);
      setPreferences(DEFAULT_PREFERENCES);
    } else {
      setPreferences(getCookiePreferences());
    }
  }, []);

  useEffect(() => {
    const openSettings = () => {
      setPreferences(getCookiePreferences());
      setShowSettings(true);
      setShowBanner(false);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () =>
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const persist = useCallback(async (next) => {
    setSaving(true);
    try {
      const saved = await applyConsentPreferences(next, {
        initAnalytics,
        disableAnalytics,
      });
      setPreferences(saved);
      setShowBanner(false);
      setShowSettings(false);
    } finally {
      setSaving(false);
    }
  }, []);

  const acceptAll = () =>
    persist({
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    });

  const acceptEssential = () =>
    persist({
      essential: true,
      analytics: false,
      functional: false,
      marketing: false,
    });

  const saveCustom = () => persist(preferences);

  const toggleCategory = (key) => {
    if (key === "essential") return;
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !showSettings && (
          <BannerShell
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <BannerCard>
              <AccentBar />
              <BannerBody>
                <BannerTop>
                  <IconBadge>
                    <FaShieldAlt />
                  </IconBadge>
                  <BannerCopy>
                    <h2>Your privacy choices</h2>
                    <p>
                      We use essential cookies to run this site, and optional
                      analytics cookies to improve Prisma. You can change this
                      anytime.{" "}
                      <a href="/privacy-policy">Privacy Policy</a>
                    </p>
                  </BannerCopy>
                </BannerTop>
                <BannerActions>
                  <PrimaryButton
                    type="button"
                    disabled={saving}
                    onClick={acceptAll}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Accept all
                  </PrimaryButton>
                  <SecondaryButton
                    type="button"
                    disabled={saving}
                    onClick={acceptEssential}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Essential only
                  </SecondaryButton>
                  <TextButton
                    type="button"
                    disabled={saving}
                    onClick={() => setShowSettings(true)}
                  >
                    Customize
                  </TextButton>
                </BannerActions>
              </BannerBody>
            </BannerCard>
          </BannerShell>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (hasConsentBeenSet()) {
                setShowSettings(false);
              } else {
                setShowSettings(false);
                setShowBanner(true);
              }
            }}
          >
            <SettingsCard
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 24, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-settings-title"
            >
              <AccentBar />
              <SettingsHeader>
                <h2 id="cookie-settings-title">Cookie settings</h2>
                <p>
                  Choose which optional cookies Prisma may use. Essential
                  cookies stay on so the site works.{" "}
                  <a href="/privacy-policy">Learn more</a>
                </p>
              </SettingsHeader>

              <SettingsBody>
                {CATEGORIES.map(({ key, title, description, icon: Icon, locked }) => (
                  <CategoryRow key={key}>
                    <CategoryInfo>
                      <CategoryIcon>
                        <Icon />
                      </CategoryIcon>
                      <CategoryText>
                        <h3>{title}</h3>
                        <p>{description}</p>
                      </CategoryText>
                    </CategoryInfo>
                    {locked ? (
                      <AlwaysOn>
                        <FaLock aria-hidden /> Always on
                      </AlwaysOn>
                    ) : (
                      <Toggle>
                        <input
                          type="checkbox"
                          checked={!!preferences[key]}
                          onChange={() => toggleCategory(key)}
                          aria-label={`Enable ${title} cookies`}
                        />
                        <span className="slider" />
                      </Toggle>
                    )}
                  </CategoryRow>
                ))}
              </SettingsBody>

              <SettingsFooter>
                <PrimaryButton
                  type="button"
                  disabled={saving}
                  onClick={acceptAll}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Accept all
                </PrimaryButton>
                <OutlineButton
                  type="button"
                  disabled={saving}
                  onClick={saveCustom}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Save preferences
                </OutlineButton>
              </SettingsFooter>
            </SettingsCard>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsent;
