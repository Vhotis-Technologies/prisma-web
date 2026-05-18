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
  FaPlay,
  FaHeart,
  FaHandshake,
  FaFileAlt,
  FaCogs,
} from "react-icons/fa";
import "./App.css";

// Import components
import PaymentReturn from "./components/PaymentReturn";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import CookieConsent from "./components/CookieConsent";
import CookieDemo from "./components/CookieDemo";

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

// Prisma brand palette (aligns with client app and transfer flow)
const PRISMA_PRIMARY = "#7c3aed";
const PRISMA_PRIMARY_LIGHT = "#8b5cf6";
const PRISMA_PRIMARY_PALE = "#ede9fe";
const PRISMA_GRADIENT_START = "#667eea";
const PRISMA_GRADIENT_END = "#764ba2";
const TEXT_DARK = "#1a1a1a";
const TEXT_MUTED = "#6b7280";

// Modern Hero Section – Prisma aesthetic
const HeroSection = styled.section`
  background: linear-gradient(180deg, ${PRISMA_PRIMARY_PALE} 0%, #ffffff 50%, #faf5ff 100%);
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
  margin-bottom: 3rem;
`;

const Logo = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: ${TEXT_DARK};
  font-style: italic;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, ${PRISMA_GRADIENT_START}, ${PRISMA_GRADIENT_END});
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
  box-shadow: 0 2px 12px rgba(124, 58, 237, 0.08);
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

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(135deg, ${PRISMA_GRADIENT_START}, ${PRISMA_GRADIENT_END});
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  min-width: 120px;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);

  &:hover {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: ${PRISMA_PRIMARY_PALE};
  color: ${PRISMA_PRIMARY};
  border: 2px solid ${PRISMA_PRIMARY_LIGHT};
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  min-width: 120px;

  &:hover {
    background: #ddd6fe;
    border-color: ${PRISMA_PRIMARY};
  }
`;

// Problems Section
const ProblemsSection = styled.section`
  padding: 5rem 0;
  background: #faf5ff;
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
  border: 1px solid #ede9fe;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(124, 58, 237, 0.06);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(124, 58, 237, 0.12);
    border-color: ${PRISMA_PRIMARY_LIGHT};
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
  background: #faf5ff;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${TEXT_DARK};
  text-align: center;
  margin-bottom: 3rem;
`;

const PackageTabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: ${PRISMA_PRIMARY_PALE};
  border-radius: 25px;
  padding: 4px;
  overflow-x: auto;
  gap: 2px;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(to right, ${PRISMA_PRIMARY_PALE}, transparent);
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(to left, ${PRISMA_PRIMARY_PALE}, transparent);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 2px;
    border-radius: 20px;
  }
`;

const TabButton = styled.button`
  background: ${(props) => (props.active ? "white" : "transparent")};
  color: ${(props) => (props.active ? PRISMA_PRIMARY : TEXT_MUTED)};
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 80px;
  white-space: nowrap;
  box-shadow: ${(props) => (props.active ? "0 2px 8px rgba(124, 58, 237, 0.2)" : "none")};

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    min-width: 70px;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
    min-width: 60px;
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
  background: #faf5ff;
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

const VideoSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, ${PRISMA_GRADIENT_START} 0%, ${PRISMA_GRADIENT_END} 100%);
  color: white;
  text-align: center;
`;

const VideoContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const PlayButton = styled(motion.button)`
  background: white;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    background: #f5f5f5;
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
  background: linear-gradient(180deg, #ffffff 0%, ${PRISMA_PRIMARY_PALE} 50%, #ffffff 100%);
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

// Premium & Documentation Section
const PremiumDocsSection = styled.section`
  padding: 4rem 0;
  background: #1a1a1a;
  color: white;
`;

const PremiumDocsContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const PremiumDocsTitle = styled.h2`
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const PremiumDocsText = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const PremiumDocsCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, ${PRISMA_GRADIENT_START}, ${PRISMA_GRADIENT_END});
  color: white;
  padding: 0.9rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: filter 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);

  &:hover {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(124, 58, 237, 0.45);
  }
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

// Gift Section
const GiftSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const GiftContent = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const GiftTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const GiftSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const GiftCTA = styled.div`
  color: ${PRISMA_PRIMARY};
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CarThumbnails = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 1rem 0;
`;

const CarThumbnail = styled.div`
  width: 120px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${(props) => (props.active ? "#1a1a1a" : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1a1a1a;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GiftOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const GiftOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #e9ecef;
  }
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
  background: #0f0a1e;
  color: rgba(255, 255, 255, 0.9);
  padding: 3rem 0 0;
`;

const FooterGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
    background: linear-gradient(135deg, #a78bfa, #c4b5fd);
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
    color: #a78bfa;
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
  const [selectedCar, setSelectedCar] = useState(0);
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

  // Route rendering
  if (currentRoute === "payment-return") {
    return <PaymentReturn />;
  }

  if (currentRoute === "privacy-policy") {
    return <PrivacyPolicy />;
  }

  if (currentRoute === "terms-of-service") {
    return <TermsOfService />;
  }

  if (currentRoute === "cookie-demo") {
    return <CookieDemo />;
  }

  const carImages = [
    { src: heroImage, name: "Porsche" },
    { src: carPolishing, name: "Ferrari" },
    { src: interiorCleaning, name: "Luxury" },
  ];

  const faqItems = [
    {
      question: "How do I book a service?",
      answer:
        "Services can only be booked through our mobile app which is available on the App Store and Google Play. We do not currently accept bookings over the phone.",
    },
    {
      question: "Can you detail my car at my home, office or apartment?",
      answer:
        "Yes! We provide mobile detailing services at your home, office, or apartment. Our team brings all necessary equipment and supplies to your location.",
    },
    {
      question: "How long does the detail usually take?",
      answer:
        "Service times vary depending on the package selected. Our Full Detail typically takes 2-3 hours, while our Quick Refres takes about 1 hour and, is designed for professionals who want to keep their cars looking brand new.",
    },
    {
      question: "How long will the detail last?",
      answer:
        "Our detailing services typically last 2-4 weeks depending on weather conditions and how often you drive. We use premium products to ensure long-lasting results. However, we recommend you book the Quick Sparkle every 2 weeks to keep your car looking brand new.",
    },
    {
      question: "What if I don't have access to water or electricity?",
      answer:
        "No problem! Our mobile units are fully self-contained with water tanks and generators, so we can provide service anywhere.",
    },
    {
      question: "What if I no longer need the service?",
      answer:
        "You can cancel your service at any time through our mobile app. Please note that cancellations made within 12 hours of the service will not be refunded. also note that once a service is in progress, it cannot be cancelled.",
    },
    {
      question: "What if I want to reschedule the service?",
      answer:
        "Yes you can reschedule at no extra cost if done within 24 hours of the original service time. Rescheduling outside of this time will incur a fee. Please check out our terms of service for more information.",
    },
    {
      question: "Can i choose a detailer who would do the service?",
      answer:
        "No! you can not select a specific detailer to render the service. our system is designed to allocate services to the best available detailer, based on their location, availability and ratings from previous services. This ensures that you receive the best possible service.",
    },
    {
      question: "Where are you located?",
      answer:
        "We are currently located in Dublin, Ireland. We will be expanding to other locations in the near future.",
    },
    {
      question: "What if I have more questions?",
      answer:
        "Please feel free to contact us at +353 899 765 197 or email us at support@prismavalet.com.",
    },
  ];

  const packages = {
    basic: {
      title: "Prisma Quick Sparkle",
      description:
        "Essential cleaning for routine maintenance. Perfect for regular upkeep.",
      image: cleaning,
      interior: [],
      exterior: [
        "Exterior Wash and Dry (Hand Wash, Steam wash)",
        "Clean Wheels, Tires, and  Arches",
        "Exterior Windows Cleaned",
        "Interior Windows Cleaned",
        "Quick Interior Vacuum",
        "Boot and Trunk Vacuumed",
      ],
      duration: "45-60 minutes",
      price: "€50",
    },
    mini: {
      title: "Prisma Refresh",
      description:
        "Enhanced cleaning with protective treatments. Great for monthly maintenance.",
      image: tireCleaning,
      interior: [
        "Everything in the Quick Sparkle",
        "Deep Carpet & Upholstery Cleaning",
        "Leather Cleaning & Conditioning",
        "Dashboard & Console Wipe Down",
        "Trunk & Door Jambs Cleaned",
        "Interior Glass Polish",
        "Interior Protection Application",
      ],
      exterior: [
        "Exterior Wash and Dry (Hand Wash, Steam wash)",
        "Clean Wheels, Tires, and  Arches",
        "Exterior Windows Cleaned",
        "Door sills and Lamps Cleaned",
        "Sealant or Wax Application",
        "Signature hot air drying"
      ],
      duration: "3 hours",
      price: "€100",
    },
    interior: {
      title: "Prisma Interior Sanctuary",
      description:
        "Deep interior cleaning and restoration. Perfect for addressing stains and odors.",
      image: interiorCleaning,
      interior: [
        "Deep Carpet & Upholstery Cleaning",
        "Upholstery Steam Cleaning",
        "Leather Cleaning & Conditioning",
        "Dashboard Deep Clean",
        "Odor Elimination Treatment",
        "Interior Protection Application",
        "Trunk & Door Jambs Detail",
      ],
      exterior: [""],
      duration: "3 hours",
      price: "€150",
    },
    full: {
      title: "Prisma Showroom Shine",
      badge: "Most Popular",
      description:
        "Comprehensive inside-out detailing. Complete vehicle restoration.",
      image: heroImage,
      interior: [
        "Everything in Prisma Refresh",
        "Deep Carpet & Upholstery Cleaning",
        "Leather Cleaning & Conditioning",
        "Dashboard & Console Wipe Down",
        "Trunk & Door Jambs Cleaned",
        "Interior Glass Polish",
        "Interior Protection Application",
      ],
      exterior: [
        "Everything in Prisma Refresh",
        "Hand Wash & Clay Bar Treatment",
        "One stage paint correction",
        "Wheel & Tire Deep Clean",
        "Tire Dressing",
        "Exterior Glass Polishing",
        "Trim & Plastic Restoration",
        "Tar and Gravel Removal",
        "Sealant or Wax Application",
        "Signature hot air drying"
      ],
      duration: "5 hours",
      price: "€250",
    },
    premium: {
      title: "Prisma Ultimate Prestige",
      badge: "VIP",
      description:
        "Ultimate detailing experience with advanced treatments and protection.",
      image: carPolishing,
      interior: [
        "Everything in Prisma Showroom Shine",
        "Advanced Stain Removal",
        "Professional Carpet Extraction",
        "Leather Cleaning & Conditioning",
        "Dashboard & Console Wipe Down",
        "Trunk & Door Jambs Cleaned",
        "Interior Glass Polishing",
        "Interior Protection Application",
      ],
      exterior: [
        "Everything in Prisma Showroom Shine",
        "Hand Wash & Clay Bar Treatment",
        "Two stage paint correction",
        "Wheel & Tire Deep Clean",
        "Tire Dressing",
        "Exterior Glass Polishing",
        "Trim & Plastic Restoration",
        "Tar and Gravel Removal",
        "Sealant or Wax Application",
        "Signature hot air drying"
      ],
      duration: "6 hours",
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
                <FaHeart style={{ color: "#ff6b35", marginLeft: "0.5rem" }} />
              </HeroSubtitle>
              <HeroTagline>
                Premium mobile detailing with flexible scheduling, fleet & partnership programs, and clear documentation—so you can book in seconds and keep every vehicle at its best.
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
                <ValueItem initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <FaFileAlt /> Premium & Docs
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload />
                <span>Download for</span>
                <span>iOS</span>
              </PrimaryButton>
              <SecondaryButton
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaDownload />
                <span>Download for</span>
                <span>Android</span>
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

          <PackageTabs>
            <TabButton
              active={activePackage === "basic"}
              onClick={() => setActivePackage("basic")}
            >
              Prisma Quick Sparkle
            </TabButton>
            <TabButton
              active={activePackage === "mini"}
              onClick={() => setActivePackage("mini")}
            >
              Prisma Refresh
            </TabButton>
            <TabButton
              active={activePackage === "interior"}
              onClick={() => setActivePackage("interior")}
            >
              Prisma Interior Sanctuary
            </TabButton>
            <TabButton
              active={activePackage === "full"}
              onClick={() => setActivePackage("full")}
            >
              Prisma Showroom Shine
            </TabButton>
            <TabButton
              active={activePackage === "premium"}
              onClick={() => setActivePackage("premium")}
            >
              Prisma Ultimate Prestige
            </TabButton>
          </PackageTabs>

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

            <ServiceList>
              <ServiceCategory>INTERIOR</ServiceCategory>
              {packages[activePackage].interior.map((service, index) => (
                <ServiceItem key={index}>
                  <FaCheck style={{ color: PRISMA_PRIMARY }} />
                  {service}
                </ServiceItem>
              ))}
            </ServiceList>

            <ServiceList>
              <ServiceCategory>EXTERIOR</ServiceCategory>
              {packages[activePackage].exterior.map((service, index) => (
                <ServiceItem key={index}>
                  <FaCheck style={{ color: PRISMA_PRIMARY }} />
                  {service}
                </ServiceItem>
              ))}
            </ServiceList>
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

      {/* Gift Section */}
      <GiftSection>
        <Container>
          <GiftContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <GiftTitle>Looking for a great gift?</GiftTitle>
              <GiftSubtitle>
                Prisma Car Care is perfect for birthdays, graduations, holidays &
                more.
              </GiftSubtitle>
              <GiftCTA>
                Personalize gift below
                <FaChevronDown />
              </GiftCTA>
            </motion.div>

            <CarThumbnails>
              {carImages.map((car, index) => (
                <CarThumbnail
                  key={index}
                  active={selectedCar === index}
                  onClick={() => setSelectedCar(index)}
                >
                  <img src={car.src} alt={car.name} />
                </CarThumbnail>
              ))}
            </CarThumbnails>

            <GiftOptions>
              <GiftOption>
                <span>Full Detail</span>
                <FaChevronDown />
              </GiftOption>
              <GiftOption>
                <span>Interior Detail</span>
                <FaChevronDown />
              </GiftOption>
              <GiftOption>
                <span>Exterior Detail</span>
                <FaChevronDown />
              </GiftOption>
            </GiftOptions>
          </GiftContent>
        </Container>
      </GiftSection>

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
                Download the app to book anytime, reschedule when needed, and get the same premium service whether you're one car or a full fleet.
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
              <MobileTitle>Download the app to get started</MobileTitle>
              <MobileSubtitle>
                Have any questions? Email for help
              </MobileSubtitle>
              <PhoneNumber href="mailto:support@prismavalet.com">
                support@prismavalet.com
              </PhoneNumber>
            </motion.div>
          </MobileSchedulingContent>
        </Container>
      </MobileSchedulingSection>

      {/* Video Section */}
      <VideoSection>
        <Container>
          <VideoContent>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              HOW WE DETAIL
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              style={{ fontSize: "1rem", marginBottom: "1rem" }}
            >
              SNEAK PEAK
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              style={{ fontSize: "1.2rem", marginBottom: "2rem" }}
            >
              2 minute video
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              style={{ marginBottom: "2rem" }}
            >
              See what makes Prisma Car Care the top choice for everything car
              detailing—premium service, flexibility, and clear processes. At Home or At Shop.
            </motion.p>
            <PlayButton
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay />
              Watch
            </PlayButton>
          </VideoContent>
        </Container>
      </VideoSection>

      {/* Premium Services & Documentation Section */}
      <PremiumDocsSection>
        <Container>
          <PremiumDocsContent>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <PremiumDocsTitle>Premium Services & Documentation</PremiumDocsTitle>
              <PremiumDocsText>
                From Quick Sparkle to Ultimate Prestige, every package is delivered to a high standard with clear service definitions. Fleet and partner programs come with documentation and support so you know exactly what you're getting—and how to get the most out of the platform.
              </PremiumDocsText>
              <PremiumDocsCTA href="mailto:support@prismavalet.com?subject=Partnership%20or%20Documentation%20request">
                <FaFileAlt /> Contact for partnerships & docs
              </PremiumDocsCTA>
            </motion.div>
          </PremiumDocsContent>
        </Container>
      </PremiumDocsSection>

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
              Premium mobile detailing at your place or ours. Book via app—simple, flexible, five-star service.
            </p>
          </FooterBrand>
          <FooterColumn>
            <FooterHeading>Legal</FooterHeading>
            <FooterLinks>
              <li><a href="/terms-of-service">Terms of Service</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/cookie-demo">Cookie Preferences</a></li>
            </FooterLinks>
          </FooterColumn>
          <FooterColumn>
            <FooterHeading>Support</FooterHeading>
            <FooterLinks>
              <li>
                <a href="mailto:support@prismavalet.com?subject=Support">Contact support</a>
              </li>
              <li>
                <a href="mailto:support@prismavalet.com?subject=Documentation%20or%20Partnership">
                  Documentation &amp; Partnerships
                </a>
              </li>
            </FooterLinks>
          </FooterColumn>
        </FooterGrid>
        <FooterBottom>
          <p className="copyright">&copy; 2026 Prisma Car Care. All rights reserved.</p>
          <p className="powered">Powered by @vhotis technology</p>
        </FooterBottom>
      </Footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default App;
