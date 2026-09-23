import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  FaCar,
  FaMobile,
  FaClock,
  FaShieldAlt,
  FaStar,
  FaDownload,
  FaCheck,
  FaChevronDown,
  FaHandshake,
  FaCogs,
} from "react-icons/fa";
import "./App.css";

// Import components
import PaymentReturn from "./components/PaymentReturn";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import CookieConsent, {
  OPEN_COOKIE_SETTINGS_EVENT,
} from "./components/CookieConsent";
import CookieDemo from "./components/CookieDemo";
import { loginUrl, welcomeUrl } from "./config";
import { hasConsentForCategory } from "./utils/cookieUtils";
import { initAnalytics } from "./lib/firebase";

// Import local images
import heroImage from "./nice car.jpg";
import carPolishing from "./Car polishing.jpg";
import detailingVan from "./detailingvan.jpg";
import interiorCleaning from "./interior cleaning.jpg";
import tireCleaning from "./tire cleaning.jpg";
import cleaning from "./cleaning.jpg";

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// Prisma brand palette (matches prisma_web / prisma_client)
const PRISMA_PRIMARY = "#0074d4";
const PRISMA_PRIMARY_HOVER = "#005fad";
const PRISMA_PRIMARY_SOFT = "#e6f3fb";
const TEXT_DARK = "#212121";
const TEXT_MUTED = "#424242";

// Modern Hero Section – Prisma aesthetic
const HeroSection = styled.section`
  background: linear-gradient(180deg, ${PRISMA_PRIMARY_SOFT} 0%, #ffffff 50%, #e6f3fb 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 2rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const HeaderNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeaderLink = styled.a`
  color: ${PRISMA_PRIMARY};
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 0.75rem;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderCta = styled.a`
  background: ${PRISMA_PRIMARY};
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 116, 212, 0.35);

  &:hover {
    background: ${PRISMA_PRIMARY_HOVER};
    color: white;
  }
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${TEXT_DARK};
  font-style: italic;
  letter-spacing: -0.02em;
  background: ${PRISMA_PRIMARY};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const HeroTitle = styled.h2`
  font-size: 4rem;
  font-weight: 800;
  color: ${TEXT_DARK};
  margin-bottom: 1rem;
  line-height: 1.1;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 3rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${TEXT_MUTED};
  font-style: italic;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const HeroTagline = styled.p`
  font-size: 1rem;
  color: ${TEXT_MUTED};
  max-width: 640px;
  margin: 0 auto 3rem;
  line-height: 1.5;
`;

const ValueStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 0;
`;

const ValueItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.9);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 116, 212, 0.08);
  font-size: 0.95rem;
  font-weight: 600;
  color: ${TEXT_DARK};

  svg {
    flex-shrink: 0;
    color: ${PRISMA_PRIMARY};
  }
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.6rem 0.8rem;
  }
`;

const HeroImage = styled.div`
  width: 100%;
  height: 400px;
  margin: 2rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 300px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(motion.a)`
  background: ${PRISMA_PRIMARY};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 160px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 116, 212, 0.4);

  &:hover {
    background: ${PRISMA_PRIMARY_HOVER};
    box-shadow: 0 6px 20px rgba(0, 116, 212, 0.45);
    color: white;
  }
`;

const SecondaryButton = styled(motion.a)`
  background: ${PRISMA_PRIMARY_SOFT};
  color: ${PRISMA_PRIMARY};
  border: 2px solid ${PRISMA_PRIMARY};
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 160px;
  text-decoration: none;

  &:hover {
    background: #d6ebf8;
    border-color: ${PRISMA_PRIMARY};
    color: ${PRISMA_PRIMARY};
  }
`;

// Problems Section
const ProblemsSection = styled.section`
  padding: 5rem 0;
  background: #e6f3fb;
  color: ${TEXT_DARK};
`;

const ProblemsContent = styled.div`
  position: relative;
  z-index: 2;
`;

const ProblemsTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: ${TEXT_DARK};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProblemsSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 4rem;
  color: ${TEXT_MUTED};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ProblemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ProblemCard = styled(motion.div)`
  background: white;
  border: 1px solid #e6f3fb;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 116, 212, 0.06);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 116, 212, 0.12);
    border-color: ${PRISMA_PRIMARY};
  }
`;

const ProblemIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${PRISMA_PRIMARY};
`;

const ProblemTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${TEXT_DARK};
`;

const ProblemDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${TEXT_MUTED};
`;

// Service Packages Section
const PackagesSection = styled.section`
  padding: 4rem 0;
  background: #e6f3fb;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${TEXT_DARK};
  text-align: center;
  margin-bottom: 3rem;
`;

const PackageTabsWrap = styled.div`
  position: relative;
  margin: 0 auto 2.5rem;
  max-width: 920px;
`;

const PackageTabs = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.35rem;
  padding: 0.4rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(0, 116, 212, 0.12);
  border-radius: 999px;
  box-shadow:
    0 1px 2px rgba(0, 116, 212, 0.04),
    0 12px 32px -16px rgba(0, 116, 212, 0.18);
  backdrop-filter: blur(10px);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    border-radius: 22px;
    padding: 0.35rem;
    gap: 0.25rem;
  }
`;

const TabButton = styled.button`
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-width: 7.5rem;
  padding: 0.7rem 1.1rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: ${(props) => (props.$active ? "#ffffff" : TEXT_MUTED)};
  cursor: pointer;
  scroll-snap-align: center;
  transition: color 0.25s ease;
  white-space: nowrap;
  outline: none;

  &:hover {
    color: ${(props) => (props.$active ? "#ffffff" : PRISMA_PRIMARY)};
  }

  &:focus-visible {
    outline: 2px solid ${PRISMA_PRIMARY};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    flex: 0 0 auto;
    min-width: 6.75rem;
    padding: 0.65rem 1rem;
  }

  @media (max-width: 480px) {
    min-width: 6.25rem;
    padding: 0.55rem 0.85rem;
  }
`;

const TabActivePill = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, ${PRISMA_PRIMARY} 0%, ${PRISMA_PRIMARY_HOVER} 100%);
  box-shadow:
    0 4px 14px rgba(0, 116, 212, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  z-index: -1;
`;

const TabLabel = styled.span`
  position: relative;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 0.78rem;
  }
`;

const TabMeta = styled.span`
  position: relative;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: ${(props) => (props.$active ? 0.85 : 0.55)};
  transition: opacity 0.25s ease;

  @media (max-width: 480px) {
    font-size: 0.62rem;
  }
`;

const PackageCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 2rem auto;
`;

const PackageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const PackageTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const PackageBadge = styled.span`
  background: #ff6b35;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const PackageImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PackageDescription = styled.p`
  color: ${TEXT_MUTED};
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const PackageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const PackageDuration = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
`;

const PackagePrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${PRISMA_PRIMARY};
`;

const ServiceList = styled.div`
  margin-bottom: 2rem;
`;

const ServiceCategory = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${TEXT_DARK};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.95rem;
`;

// Reviews Section
const ReviewsSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const ReviewCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.2rem;
  margin-bottom: 1rem;
`;

const ReviewText = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const ReviewCount = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-decoration: underline;
  margin-bottom: 1rem;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #4caf50;
  font-size: 0.9rem;
  font-weight: 600;
`;

// Mobile Features Section
const MobileSection = styled.section`
  padding: 4rem 0;
  background: #e6f3fb;
`;

const MobileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MobileContent = styled.div`
  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const MobileImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Transform Section
const TransformSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const TransformContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const TransformText = styled.div`
  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  p {
    font-size: 1.1rem;
    color: #666;
    line-height: 1.6;
  }
`;

const TransformImage = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Fleet & Partnership Section
const FleetSection = styled.section`
  padding: 5rem 0;
  background: linear-gradient(180deg, #ffffff 0%, ${PRISMA_PRIMARY_SOFT} 50%, #ffffff 100%);
  color: ${TEXT_DARK};
`;

const FleetContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const FleetTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #1a1a1a;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FleetSubtitle = styled.p`
  font-size: 1.15rem;
  color: #555;
  margin-bottom: 2.5rem;
  line-height: 1.6;
`;

const FleetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const FleetCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  }
`;

const FleetCardIcon = styled.div`
  font-size: 2.25rem;
  color: ${PRISMA_PRIMARY};
  margin-bottom: 1rem;
`;

const FleetCardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const FleetCardText = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
`;

// Licensed Section
const LicensedSection = styled.section`
  padding: 4rem 0;
  background: #f8f9fa;
`;

const LicensedContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const TeamImage = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LicensedTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const LicensedText = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

// Mobile Scheduling Section
const MobileSchedulingSection = styled.section`
  padding: 4rem 0;
  background: #f8f9fa;
`;

const MobileSchedulingContent = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const MobileIcon = styled.div`
  font-size: 3rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const MobileTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const MobileSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const PhoneNumber = styled.a`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${PRISMA_PRIMARY};
  text-decoration: none;
  margin-bottom: 2rem;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`;

// FAQ Section
const FAQSection = styled.section`
  padding: 4rem 0;
  background: #1a1a1a;
  color: white;
`;

const FAQContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQTitle = styled.h2`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
`;

const FAQItem = styled.div`
  background: #333;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const FAQQuestion = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #444;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1.5rem 1.5rem;
  color: #ccc;
  line-height: 1.6;
  font-size: 0.8rem;
`;

const Footer = styled.footer`
  background: #121212;
  color: rgba(255, 255, 255, 0.9);
  padding: 3rem 0 0;
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const FooterBrand = styled.div`
  .footer-logo {
    font-size: 1.5rem;
    font-weight: 800;
    font-style: italic;
    letter-spacing: -0.02em;
    background: ${PRISMA_PRIMARY};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }
  .footer-tagline {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
  }
`;

const FooterColumn = styled.div`
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterHeading = styled.h4`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.6rem;
  }

  a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  a:hover {
    color: #0074d4;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;

  .copyright {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  .powered {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

function App() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [activePackage, setActivePackage] = useState("basic");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    // Simple routing based on URL path
    const path = window.location.pathname;
    const search = window.location.search;

    if (path === "/payment/return" || search.includes("payment_intent")) {
      setCurrentRoute("payment-return");
    } else if (path === "/privacy-policy") {
      setCurrentRoute("privacy-policy");
    } else if (path === "/terms-of-service") {
      setCurrentRoute("terms-of-service");
    } else if (path === "/cookie-demo") {
      setCurrentRoute("cookie-demo");
    } else {
      setCurrentRoute("home");
    }
  }, []);

  // Resume Firebase Analytics when the visitor already consented
  useEffect(() => {
    if (hasConsentForCategory("analytics")) {
      initAnalytics();
    }
  }, []);

  // Route rendering — CookieConsent stays mounted on every page
  if (currentRoute === "payment-return") {
    return (
      <>
        <PaymentReturn />
        <CookieConsent />
      </>
    );
  }

  if (currentRoute === "privacy-policy") {
    return (
      <>
        <PrivacyPolicy />
        <CookieConsent />
      </>
    );
  }

  if (currentRoute === "terms-of-service") {
    return (
      <>
        <TermsOfService />
        <CookieConsent />
      </>
    );
  }

  if (currentRoute === "cookie-demo") {
    return (
      <>
        <CookieDemo />
        <CookieConsent />
      </>
    );
  }

  const faqItems = [
    {
      question: "How do I book a service?",
      answer:
        "You can either book as a guest or as a registered user using the webpage",
    },
    {
      question: "Is Prisma Car Care Eco-Friendly?",
      answer:
        "Yes, we are committed to reducing our environmental impact. We use a range of eco-friendly products and practices to ensure that our services are as sustainable as possible. Furthermore, we aim to educate our clients on the importance of sustainable detailing practices, and also provide a range of valeting options to choose from.",
    },
    {
      question: "Can you detail my car at my home, office or apartment?",
      answer:
        "Yes, we provide mobile detailing services anywhere in the greater Dublin area. Our team brings all necessary equipment and supplies to your location to ensure the best possible service.",
    },
    {
      question: "How long does the detail usually take?",
      answer:
        "Service times vary depending on the package selected. Packages typically range from 1 hour to 7 hours, depending on the size of the vehicle and the package selected.",
    },
    {
      question: "How long will the detail last?",
      answer:
        "Our detailing services typically last 2-4 weeks depending on weather conditions and how often you drive. We use premium products to ensure long-lasting results. However, we recommend you book the Prisma Quick Sparkle every 2 weeks to ensure your vehicle is always looking its best.",
    },
    {
      question: "What if I don't have access to water or electricity?",
      answer:
        "No problem! Our mobile units are fully self-contained with water tanks and generators, so we can provide service anywhere. We also have a range of products that can be used to clean your vehicle without the need for water or electricity.",
    },
    {
      question: "What if I no longer need the service?",
      answer:
        "You can cancel your service at any time via web or using our mobile app. Please read our terms of service for more information.",
    },
    {
      question: "What if I want to reschedule the service?",
      answer:
        "Yes you can reschedule at no extra cost if done within 24 hours of the original service time. Rescheduling outside of this time will incur a fee. Please check out our terms of service for more information.",
    },
    {
      question: "Can i choose a detailer who would do the service?",
      answer:
        "No! you can not select a specific detailer to render the service. our system is designed to allocate services to the best available detailer, based on their location, availability and ratings from previous services. This is to ensures that all our clients receive the best possible service.",
    },
    {
      question: "Where are you located?",
      answer:
        "We are currently located in the Dublin, and the greater Dublin area. We are working to bring our services closer to you.",
    },
    {
      question: "What if I have more questions?",
      answer:
        "Please feel free to contact us via Phone at +353 899 765 197 or by email at support@prismavalet.com.",
    },
  ];

  const packages = {
    basic: {
      title: "Prisma Quick Sparkle",
      shortLabel: "Quick Sparkle",
      description:
        "Essential cleaning for routine maintenance. Perfect for regular upkeep.",
      image: cleaning,
      interior: [],
      exterior: [
        "Full exterior valeting (Hand Wash, Steam wash)",
        "Wheels, Tires, and Arches cleaned and dressed",
        "Exterior Windows Cleaned",
        "Quick Interior Vacuum",
      ],
      duration: "45-60 minutes",
      price: "€50",
    },
    mini: {
      title: "Prisma Refresh",
      shortLabel: "Refresh",
      badge: "Most Popular",
      description:
        "Enhanced cleaning with protective treatments. Great for monthly maintenance.",
      image: tireCleaning,
      interior: [
        "Everything in the Quick Sparkle",
        "Comsole and Dashboard cleaned and vinly coated",
        "Leather seats cleaned and treated (if applicable)",
        "Interior glass cleaned and hydrophobic coated",
      ],
      exterior: [
        "Wheels, Tires, and Arches cleaned and dressed",
        "Exterior windows cleaned and hydrophobic coated",
        "Door sills and lamps cleaned",
        "Signature hot air drying",
        "Full body wax or sealant application",
        "Tar and Gravel removal",
      ],
      duration: "2-3 hours",
      price: "€130",
    },
    interior: {
      title: "Prisma Interior Sanctuary",
      shortLabel: "Interior",
      description:
        "Deep interior cleaning and restoration. Perfect for addressing stains and odors.",
      image: interiorCleaning,
      interior: [
        "Carpet & Upholstery Vacuumed and shampooed",
        "Leather Cleaning & Conditioning (if applicable)",
        "Dashboard cleaned and vinly coated",
        "Interior glass cleaned and hydrophobic coated",
        "Trunk & Door Jambs cleaned and treated",
        "Door sills and lamps cleaned",
        "Mats vacuumed and shampooed",
        "Odor Elimination Treatment",
      ],
      exterior: [],
      duration: "2-3 hours",
      price: "€150",
    },
    full: {
      title: "Prisma Showroom Shine",
      shortLabel: "Showroom",
      badge: "Best Value",
      description:
        "Comprehensive inside-out detailing. Complete vehicle restoration.",
      image: heroImage,
      interior: [
        "Everything in Prisma Interior Sanctuary",
        "Interior walls washed and treated",
      ],
      exterior: [
        "Everything in Prisma Refresh",
        "Clay Bar Treatment",
        "One stage paint correction",
        "Trim & Plastic Restoration",
        "Tar and Iron Removal",
        "Signature hot air drying",
      ],
      duration: "4-5 hours",
      price: "€250",
    },
    premium: {
      title: "Prisma Prestige",
      shortLabel: "Prestige",
      badge: "VIP",
      description:
        "Ultimate detailing experience with advanced treatments and protection.",
      image: carPolishing,
      interior: [
        "Everything in Prisma Showroom Shine",
        "Advanced Stain Removal",
        "Advanced Odor Elimination Treatment",
        "Pet Hair Removal",
      ],
      exterior: [
        "Everything in Prisma Showroom Shine",
        "Engine bay cleaned",
        "Polishing of paintwork",
        "Wax application",
      ],
      duration: "5-6 hours",
      price: "€400",
    },
    ceramic: {
      title: "Prisma Ceramic Guard",
      shortLabel: "Ceramic Guard",
      badge: "Ceramic Guard",
      description:
        "Ceramic coating for your vehicle to protect it from the elements and keep it looking new.",
      image: carPolishing,
      interior: ["Everything in Prisma Refresh"],
      exterior: [
        "Tar and Iron Removal",
        "Clay Bar Treatment",
        "Polishing of paintwork",
        "Two stage paint correction (if applicable)",
        "Advanced Ceramic Coating Application (12-18 months)",
      ],
      duration: "5-6 hours",
      price: "€500",
    },
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Header>
            <Logo>PRISMA CAR CARE</Logo>
            <HeaderNav>
              <HeaderLink href={loginUrl}>Log in</HeaderLink>
              <HeaderCta href={welcomeUrl}>Get started</HeaderCta>
            </HeaderNav>
          </Header>
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroTitle>We Make It Shine</HeroTitle>
              <HeroSubtitle>
                Get Your Services Delivered To You Anywhere At Your Convenience
              </HeroSubtitle>
              <HeroTagline>
                Premium mobile detailing with flexible scheduling and fleet &amp; partnership programs, so you can book in seconds and keep every vehicle at its best.
              </HeroTagline>
              <ValueStrip>
                <ValueItem initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <FaHandshake /> Fleet & Partnership
                </ValueItem>
                <ValueItem initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <FaMobile /> Ease of Use
                </ValueItem>
                <ValueItem initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <FaCogs /> Flexibility
                </ValueItem>
              </ValueStrip>
            </motion.div>

            <HeroImage>
              <motion.img
                src={carPolishing}
                alt="Professional Car Detailing"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 2, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </HeroImage>

            <CTAButtons>
              <PrimaryButton
                href={welcomeUrl}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get started
              </PrimaryButton>
              <SecondaryButton
                href={loginUrl}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log in
              </SecondaryButton>
            </CTAButtons>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Problems Section */}
      <ProblemsSection>
        <Container>
          <ProblemsContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ProblemsTitle>Built for Scale & Simplicity</ProblemsTitle>
              <ProblemsSubtitle>
                From individual drivers to fleets and partners—we deliver ease of use, flexibility, and premium service with clear documentation at every step.
              </ProblemsSubtitle>
            </motion.div>

            <ProblemsGrid>
              <ProblemCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <ProblemIcon>
                  <FaClock />
                </ProblemIcon>
                <ProblemTitle>Scheduling Limitations</ProblemTitle>
                <ProblemDescription>
                  Fixed operating hours and location-based services create
                  accessibility barriers for busy professionals. Our flexible
                  scheduling system accommodates diverse customer schedules and
                  operational requirements.
                </ProblemDescription>
              </ProblemCard>

              <ProblemCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <ProblemIcon>
                  <FaCar />
                </ProblemIcon>
                <ProblemTitle>Geographic Constraints</ProblemTitle>
                <ProblemDescription>
                  Stationary service locations limit customer reach and create
                  travel inefficiencies. Our mobile infrastructure delivers
                  professional automotive care services directly to customer
                  locations, eliminating geographic barriers.
                </ProblemDescription>
              </ProblemCard>

              <ProblemCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <ProblemIcon>
                  <FaShieldAlt />
                </ProblemIcon>
                <ProblemTitle>Service Standardization</ProblemTitle>
                <ProblemDescription>
                  Variable service quality and inconsistent delivery standards
                  across traditional automotive care providers create customer
                  uncertainty. Our standardized processes ensure consistent,
                  measurable service outcomes across all locations.
                </ProblemDescription>
              </ProblemCard>

              <ProblemCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <ProblemIcon>
                  <FaMobile />
                </ProblemIcon>
                <ProblemTitle>Technology & Ease of Use</ProblemTitle>
                <ProblemDescription>
                  Our integrated platform makes booking and managing services simple: seamless app booking, real-time tracking, and transparent pricing—so you spend less time organising and more time on the road.
                </ProblemDescription>
              </ProblemCard>

              <ProblemCard
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <ProblemIcon>
                  <FaHandshake />
                </ProblemIcon>
                <ProblemTitle>Fleet & Partnership</ProblemTitle>
                <ProblemDescription>
                  One platform for fleet owners, branches, and partners. Manage multiple vehicles, branches, and subscriptions with fleet maintenance insights, partner programs, and dedicated support—all in one place.
                </ProblemDescription>
              </ProblemCard>
            </ProblemsGrid>
          </ProblemsContent>
        </Container>
      </ProblemsSection>

      {/* Fleet & Partnership Section */}
      <FleetSection>
        <Container>
          <FleetContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FleetTitle>Fleet & Partnership Programs</FleetTitle>
              <FleetSubtitle>
                Whether you run a corporate fleet, multiple branches, or partner with us—get one platform that scales. Flexible subscriptions, fleet maintenance reporting, and clear documentation so your team and partners stay aligned.
              </FleetSubtitle>
              <FleetGrid>
                <FleetCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <FleetCardIcon><FaCar /></FleetCardIcon>
                  <FleetCardTitle>Fleet Management</FleetCardTitle>
                  <FleetCardText>Manage vehicles across branches, track subscriptions, and keep fleet maintenance data in one place.</FleetCardText>
                </FleetCard>
                <FleetCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <FleetCardIcon><FaHandshake /></FleetCardIcon>
                  <FleetCardTitle>Partnerships</FleetCardTitle>
                  <FleetCardText>Partner programs and referral benefits with straightforward terms and support when you need it.</FleetCardText>
                </FleetCard>
                <FleetCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <FleetCardIcon><FaCogs /></FleetCardIcon>
                  <FleetCardTitle>Flexibility</FleetCardTitle>
                  <FleetCardText>At-home or at-shop, multiple packages, and scheduling that works around your operations.</FleetCardText>
                </FleetCard>
              </FleetGrid>
            </motion.div>
          </FleetContent>
        </Container>
      </FleetSection>

      {/* Service Packages Section */}
      <PackagesSection>
        <Container>
          <SectionTitle>Detail Packages</SectionTitle>

          <PackageTabsWrap>
            <PackageTabs role="tablist" aria-label="Detail packages">
              {Object.entries(packages).map(([key, pkg]) => {
                const isActive = activePackage === key;
                return (
                  <TabButton
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    $active={isActive}
                    onClick={() => setActivePackage(key)}
                  >
                    {isActive && (
                      <TabActivePill
                        layoutId="package-tab-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                    <TabLabel>{pkg.shortLabel}</TabLabel>
                    <TabMeta $active={isActive}>{pkg.price}</TabMeta>
                  </TabButton>
                );
              })}
            </PackageTabs>
          </PackageTabsWrap>

          <PackageCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PackageHeader>
              <PackageTitle>{packages[activePackage].title}</PackageTitle>
              {packages[activePackage].badge && (
                <PackageBadge>{packages[activePackage].badge}</PackageBadge>
              )}
            </PackageHeader>

            <PackageImage>
              <img
                src={packages[activePackage].image}
                alt={packages[activePackage].title}
                initial={{ opacity: 0, scale: 1 }}
              />
            </PackageImage>

            <PackageDescription>
              {packages[activePackage].description}
            </PackageDescription>

            <PackageInfo>
              <PackageDuration>
                <FaClock />
                {packages[activePackage].duration}
              </PackageDuration>
              <PackagePrice>{packages[activePackage].price}</PackagePrice>
            </PackageInfo>

            {(packages[activePackage].interior || []).length > 0 && (
              <ServiceList>
                <ServiceCategory>INTERIOR</ServiceCategory>
                {packages[activePackage].interior.map((service, index) => (
                  <ServiceItem key={index}>
                    <FaCheck style={{ color: PRISMA_PRIMARY }} />
                    {service}
                  </ServiceItem>
                ))}
              </ServiceList>
            )}

            {(packages[activePackage].exterior || []).length > 0 && (
              <ServiceList>
                <ServiceCategory>EXTERIOR</ServiceCategory>
                {packages[activePackage].exterior.map((service, index) => (
                  <ServiceItem key={index}>
                    <FaCheck style={{ color: PRISMA_PRIMARY }} />
                    {service}
                  </ServiceItem>
                ))}
              </ServiceList>
            )}
          </PackageCard>
        </Container>
      </PackagesSection>

      {/* Reviews Section */}
      <ReviewsSection>
        <Container>
          <SectionTitle>Thousands Of Five Star Reviews</SectionTitle>
          <ReviewCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ReviewText>EXCELLENT</ReviewText>
            <StarRating>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  style={{ color: "#ffd700", fontSize: "1.5rem" }}
                />
              ))}
            </StarRating>
            <ReviewCount>Based on 1668 reviews</ReviewCount>
            <TrustBadge>
              <FaCheck />
              Trustindex
            </TrustBadge>
          </ReviewCard>
        </Container>
      </ReviewsSection>

      {/* Mobile Features Section */}
      <MobileSection>
        <Container>
          <MobileGrid>
            <MobileContent>
              <motion.h3
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ease of Use, Where You Need It
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Book in seconds from the app, choose your location and time, and get premium mobile detailing with full flexibility—at home, office, or our shop.
              </motion.p>
            </MobileContent>
            <MobileImage>
              <motion.img
                src={detailingVan}
                alt="Mobile Detailing Van"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              />
            </MobileImage>
          </MobileGrid>
        </Container>
      </MobileSection>

      {/* Transform Section */}
      <TransformSection>
        <Container>
          <TransformContent>
            <TransformText>
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Transform Your Vehicle Inside-Out
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                From spotless interiors to mirror-finish exteriors, we restore
                your ride to NEW with our expert five-star service.
              </motion.p>
            </TransformText>
            <TransformImage>
              <motion.img
                src={interiorCleaning}
                alt="Car Interior Detailing"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              />
            </TransformImage>
          </TransformContent>
        </Container>
      </TransformSection>

      {/* Licensed Section */}
      <LicensedSection>
        <Container>
          <LicensedContent>
            <TeamImage>
              <motion.img
                src={detailingVan}
                alt="PrismaDetail Team"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              />
            </TeamImage>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <LicensedTitle>Licensed, Insured & Ready to Scale</LicensedTitle>
              <LicensedText>
                With years in the business, Prisma Car Care delivers a trusted, flexible detailing experience—for individuals, fleets, and partners. We take care of every detail with premium service and clear documentation. At your place or our shop, we're ready to make your car, boat, or RV look brand new. Get in touch or download the app to book today.
              </LicensedText>
            </motion.div>
          </LicensedContent>
        </Container>
      </LicensedSection>

      {/* Mobile Scheduling Section */}
      <MobileSchedulingSection>
        <Container>
          <MobileSchedulingContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <MobileTitle>Simple Booking, Maximum Flexibility</MobileTitle>
              <MobileSubtitle>
                Book on the web or download the app to schedule anytime, reschedule when needed, and get the same premium service whether you're one car or a full fleet.
              </MobileSubtitle>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <MobileIcon>
                <FaDownload />
              </MobileIcon>
              <MobileTitle>Get started on the web or in the app</MobileTitle>
              <MobileSubtitle>
                Create an account, book as a guest, or email us if you have questions.
              </MobileSubtitle>
              <CTAButtons style={{ marginTop: "1.25rem" }}>
                <PrimaryButton href={welcomeUrl}>Get started</PrimaryButton>
                <SecondaryButton href={loginUrl}>Log in</SecondaryButton>
              </CTAButtons>
              <PhoneNumber href="mailto:support@prismavalet.com">
                support@prismavalet.com
              </PhoneNumber>
            </motion.div>
          </MobileSchedulingContent>
        </Container>
      </MobileSchedulingSection>

      {/* FAQ Section */}
      <FAQSection>
        <Container>
          <FAQContent>
            <FAQTitle>F.A.Q.</FAQTitle>
            {faqItems.map((item, index) => (
              <FAQItem key={index}>
                <FAQQuestion
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === index ? null : index)
                  }
                >
                  <span>{item.question}</span>
                  <FaChevronDown
                    style={{
                      transform:
                        expandedFAQ === index
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </FAQQuestion>
                {expandedFAQ === index && <FAQAnswer>{item.answer}</FAQAnswer>}
              </FAQItem>
            ))}
          </FAQContent>
        </Container>
      </FAQSection>
      {/* Footer */}
      <Footer>
        <FooterGrid>
          <FooterBrand>
            <div className="footer-logo">Prisma Car Care</div>
            <p className="footer-tagline">
              Premium mobile detailing at your your convenience.
            </p>
          </FooterBrand>
          <FooterColumn>
            <FooterHeading>Account</FooterHeading>
            <FooterLinks>
              <li><a href={welcomeUrl}>Get started</a></li>
              <li><a href={loginUrl}>Log in</a></li>
            </FooterLinks>
          </FooterColumn>
          <FooterColumn>
            <FooterHeading>Legal</FooterHeading>
            <FooterLinks>
              <li><a href="/terms-of-service">Terms of Service</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li>
                <a
                  href="#cookie-settings"
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(
                      new Event(OPEN_COOKIE_SETTINGS_EVENT)
                    );
                  }}
                >
                  Cookie Preferences
                </a>
              </li>
            </FooterLinks>
          </FooterColumn>
          <FooterColumn>
            <FooterHeading>Support</FooterHeading>
            <FooterLinks>
              <li>
                <a href="mailto:support@prismavalet.com?subject=Support">
                  Contact support
                </a>
              </li>
            </FooterLinks>
          </FooterColumn>
        </FooterGrid>
        <FooterBottom>
          <p className="copyright">&copy; {new Date().getFullYear()} Prisma Car Care. All rights reserved.</p>
          <p className="powered">Powered by @vhotis technologies limited</p>
        </FooterBottom>
      </Footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default App;
