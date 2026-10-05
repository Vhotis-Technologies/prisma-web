import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  FaCheck,
  FaChevronDown,
  FaClock,
  FaHandshake,
  FaMobileAlt,
  FaBars,
  FaTimes,
  FaTint,
} from "react-icons/fa";
import "./App.css";

import PaymentReturn from "./components/PaymentReturn";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import CookieConsent, {
  OPEN_COOKIE_SETTINGS_EVENT,
} from "./components/CookieConsent";
import CookieDemo from "./components/CookieDemo";
import { loginUrl, welcomeUrl } from "./config";
import { withReferral } from "./lib/referral";
import { hasConsentForCategory } from "./utils/cookieUtils";
import { initAnalytics } from "./lib/firebase";
import heroCar from "./nice car.jpg";
import washPhoto from "./cleaning.jpg";
import interiorPhoto from "./interior cleaning.jpg";
import vanPhoto from "./detailingvan.jpg";

const PRISMA_PRIMARY = "#1a78d8";
const PRISMA_PRIMARY_HOVER = "#1464b8";
const PRISMA_DEEP = "#071422";
const PRISMA_NAVY = "#0c2344";
const PRISMA_SOFT = "#e7f0f8";
const TEXT_DARK = "#212121";
const TEXT_MUTED = "#424242";

const FEATURED_KEYS = ["basic", "mini", "interior"];
const EXTRA_KEYS = ["full", "premium", "ceramic"];

const packages = {
  basic: {
    title: "Prisma Quick Sparkle",
    description: "A proper wash and a quick interior tidy.",
    points: [
      "Hand wash and steam wash",
      "Wheels, tyres, and arches dressed",
      "Exterior windows cleaned",
      "Quick interior vacuum",
    ],
    duration: "45–60 minutes",
    price: "€40 sedans, +20% for SUVs",
  },
  mini: {
    title: "Prisma Refresh",
    badge: "Most popular",
    description: "A fuller clean with wax and interior protection.",
    points: [
      "Everything in Quick Sparkle",
      "Dashboard and console cleaned",
      "All window and glass surfaces hydrophobised",
      "Seats cleaned and conditioned",
      "Deep interior vacuum",
      "Door jamb and sill cleaned",
      "Boot, and carpet vacuumed",
      "Wax or sealant applied",
      "Tar and bug splat removal",
      "Odour treatment",
      "Final detailing and inspection",
    ],
    duration: "2–3 hours",
    price: "€100 sedans, +20% for SUVs",
  },
  full: {
    title: "Prisma Showroom Shine",
    badge: "Best value",
    description:
      "Everything in Refresh, plus a full interior clean, finished with a clay bar, hand wax, and a one-stage paint correction.",
    points: [
      "Everything in Refresh",
      "Full interior clean",
      "Clay bar treatment",
      "Hand wax",
      "One-stage paint correction",
    ],
    duration: "4–5 hours",
    price: "€250 sedans, +20% for SUVs",
  },
  interior: {
    title: "Prisma Interior Sanctuary",
    description:
      "Our most comprehensive interior valet, designed to refresh, deep clean and restore the interior of your vehicle.",
    points: [
      "Full interior deep clean",
      "Fabric seats shampooed and extracted",
      "Carpets and floor mats shampooed",
      "Leather seats deep cleaned and conditioned",
      "Detailed vacuuming, including hard-to-reach areas",
      "Stain treatment",
      "Door cards and panels deep cleaned",
      "Dashboard, console and trim thoroughly cleaned",
      "Interior plastics dressed",
      "Boot area deep cleaned",
      "Interior glass cleaned and polished",
      "Odour treatment",
      "Final detailing and inspection",
    ],
    duration: "2–3 hours",
    price: "€150 sedans, +20% for SUVs",
  },
  premium: {
    title: "Prisma Prestige",
    badge: "VIP",
    description: "The full detail, plus engine bay and paint polishing.",
    points: [
      "Everything in Showroom Shine",
      "Stain and pet-hair removal",
      "Engine bay cleaned",
      "2 stage paint correction",
      "Hand wax applied",
      "Odour treatment",
      "Final detailing and inspection",
    ],
    duration: "5–6 hours",
    price: "€400 sedans, +20% for SUVs",
  },
  ceramic: {
    title: "Prisma Ceramic Guard",
    badge: "Protection",
    description: "Paint correction and a ceramic coat that lasts 12–18 months.",
    points: [
      "Everything in PrismaRefresh",
      "Tar and iron removal",
      "Clay bar and polish",
      "Two-stage correction, if needed",
      "Ceramic coating",
    ],
    duration: "5–6 hours",
    price: "€500 sedans, +20% for SUVs",
  },
};

const faqItems = [
  {
    question: "How do I book a service?",
    answer:
      "Book as a guest or with an account on the web. You can also use the mobile app.",
  },
  {
    question: "Can you detail my car at home, the office, or an apartment?",
    answer:
      "Yes. We come to you anywhere in the greater Dublin area, with the equipment and supplies for the job.",
  },
  {
    question: "What if I don't have water or electricity?",
    answer:
      "Our vans carry their own water and power, so we can work where the car is parked.",
  },
  {
    question: "How long does a detail take?",
    answer:
      "Most packages run from about an hour to a full afternoon. The time depends on the package and the size of the vehicle.",
  },
  {
    question: "How long will the detail last?",
    answer:
      "A typical finish holds for 2–4 weeks, depending on weather and how often you drive. A Quick Sparkle every couple of weeks keeps it looking fresh.",
  },
  {
    question: "Can I cancel or move the booking?",
    answer:
      "You can cancel in the app or on the web. Rescheduling is free when you do it at least 24 hours ahead. Later changes may carry a fee. The terms of service have the detail.",
  },
  {
    question: "Can I choose my detailer?",
    answer:
      "We assign the detailer from location, availability, and past ratings, so the nearest capable person takes the job.",
  },
  {
    question: "Is Prisma Car Care eco-friendly?",
    answer:
      "We use a range of eco-friendly products and practices, and we offer valeting options that keep the impact down.",
  },
  {
    question: "Where do you work?",
    answer:
      "Dublin and the greater Dublin area. We are extending the area we cover.",
  },
];

const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  min-width: 0;
`;

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(7, 20, 34, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const HeaderInner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0.85rem 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-width: 0;
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  font-size: 1.15rem;
  letter-spacing: -0.03em;
  line-height: 1.05;

  img {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    object-fit: cover;
    mix-blend-mode: screen;
  }

  small {
    display: block;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (max-width: 800px) {
    display: ${(props) => (props.$open ? "flex" : "none")};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
    padding: 0.75rem 24px 1rem;
    background: ${PRISMA_DEEP};
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const NavLink = styled.a`
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.55rem 0.75rem;
  border-radius: 8px;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MenuButton = styled.button`
  display: none;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: transparent;
  color: #fff;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  cursor: pointer;

  @media (max-width: 800px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const SolidButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${PRISMA_PRIMARY};
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.7rem 1.15rem;
  border-radius: 10px;
  border: 2px solid ${PRISMA_PRIMARY};

  @media (max-width: 800px) {
    display: ${(props) => (props.$hideNarrow ? "none" : "inline-flex")};
  }

  &:hover {
    background: ${PRISMA_PRIMARY_HOVER};
    border-color: ${PRISMA_PRIMARY_HOVER};
    color: #fff;
  }
`;

const GhostButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.7rem 1.15rem;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.7);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
`;

const Hero = styled.section`
  background:
    radial-gradient(ellipse 55% 70% at 100% 0%, rgba(26, 120, 216, 0.28), transparent 55%),
    linear-gradient(165deg, ${PRISMA_NAVY} 0%, ${PRISMA_DEEP} 62%, #040c16 100%);
  color: #fff;
  padding: 4.25rem 0 3.25rem;
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  gap: 2.5rem;
  align-items: center;

  > * {
    min-width: 0;
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2.5rem;
  }
`;

const Eyebrow = styled.p`
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: ${(props) => props.$onDark ? "rgba(255,255,255,0.82)" : PRISMA_PRIMARY};
`;

const HeroTitle = styled.h1`
  font-size: clamp(3.1rem, 7vw, 5.4rem);
  font-weight: 600;
  letter-spacing: -0.045em;
  line-height: 0.92;
  margin-bottom: 1.25rem;

  span {
    display: block;
    color: #fff;
  }
`;

const HeroLead = styled.p`
  max-width: 34rem;
  font-size: 1.15rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.75rem;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const LightSolid = styled(SolidButton)`
  background: #fff;
  color: ${PRISMA_DEEP};
  border-color: #fff;

  &:hover {
    background: ${PRISMA_SOFT};
    border-color: ${PRISMA_SOFT};
    color: ${PRISMA_DEEP};
  }
`;

const HeroPhoto = styled.div`
  min-width: 0;
  max-width: 100%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);

  img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: 420px;
    object-fit: cover;
  }

  @media (max-width: 800px) {
    img {
      height: 240px;
    }
  }
`;

const FactList = styled.ul`
  list-style: none;
  margin: 2.75rem 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const Fact = styled.li`
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.28);

  strong {
    display: block;
    font-size: 1.05rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  span {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
  }
`;

const Section = styled.section`
  padding: 4.5rem 0;
  background: ${(props) => props.$tone || "#fff"};
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 2.8rem);
  letter-spacing: -0.03em;
  color: ${TEXT_DARK};
  margin-bottom: 0.75rem;
  max-width: 18rem;
`;

const SectionLead = styled.p`
  color: ${TEXT_MUTED};
  font-size: 1.05rem;
  max-width: 38rem;
  margin-bottom: 2rem;
  line-height: 1.55;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const FeatureCard = styled.article`
  background: #fff;
  border: 1px solid rgba(0, 116, 212, 0.14);
  border-radius: 16px;
  padding: 1.4rem 1.3rem 1.5rem;

  h3 {
    font-size: 1.15rem;
    margin: 0.85rem 0 0.4rem;
    color: ${TEXT_DARK};
  }

  p {
    color: ${TEXT_MUTED};
    margin: 0;
    line-height: 1.5;
  }
`;

const IconBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${PRISMA_SOFT};
  color: ${PRISMA_PRIMARY};
  font-size: 1.1rem;
`;

const PackageHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  ${SectionLead} {
    margin-bottom: 0;
  }
`;

const TextButton = styled.button`
  background: transparent;
  color: ${PRISMA_PRIMARY};
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.4rem 0;

  &:hover {
    color: ${PRISMA_PRIMARY_HOVER};
    text-decoration: underline;
  }
`;

const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const PackageCard = styled.article`
  background: #fff;
  border-radius: 16px;
  padding: 1.4rem 1.3rem 1.3rem;
  border: 2px solid
    ${(props) => (props.$featured ? PRISMA_PRIMARY : "rgba(0, 116, 212, 0.12)")};
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-shadow: ${(props) =>
    props.$featured ? "0 12px 30px rgba(0, 116, 212, 0.12)" : "none"};
`;

const Badge = styled.span`
  display: inline-block;
  background: ${PRISMA_SOFT};
  color: ${PRISMA_DEEP};
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 0.28rem 0.55rem;
  margin-bottom: 0.8rem;
`;

const PackageName = styled.h3`
  font-size: 1.35rem;
  color: ${TEXT_DARK};
  margin-bottom: 0.35rem;
`;

const PackagePrice = styled.p`
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: ${PRISMA_DEEP};
  margin: 0.2rem 0 0.35rem;
`;

const PackageCopy = styled.p`
  color: ${TEXT_MUTED};
  margin-bottom: 1rem;
  line-height: 1.45;
`;

const PointList = styled.ul`
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  flex: 1;

  li {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    color: ${TEXT_DARK};
    margin-bottom: 0.55rem;
    line-height: 1.4;
  }

  svg {
    color: ${PRISMA_PRIMARY};
    margin-top: 0.2rem;
    flex-shrink: 0;
  }
`;

const Duration = styled.p`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: ${PRISMA_DEEP};
  font-weight: 500;
  font-size: 0.92rem;
  margin: 0;

  svg {
    color: ${PRISMA_PRIMARY};
  }
`;

const StepGrid = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  counter-reset: step;

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Step = styled.li`
  h3 {
    font-size: 1.25rem;
    margin: 0.4rem 0;
    color: ${TEXT_DARK};
  }

  p {
    color: ${TEXT_MUTED};
    margin: 0;
    line-height: 1.5;
  }
`;

const StepNumber = styled.span`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: ${PRISMA_PRIMARY};
`;

const WorkGrid = styled.div`
  margin-top: 2.75rem;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.85rem;

  figure {
    margin: 0;
    min-width: 0;
  }

  img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 16px;
  }

  figcaption {
    margin-top: 0.55rem;
    font-size: 0.92rem;
    font-weight: 600;
    color: ${TEXT_DARK};
  }

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);

    img {
      height: 210px;
    }
  }
`;

const FleetBand = styled.section`
  background: linear-gradient(135deg, ${PRISMA_NAVY}, ${PRISMA_DEEP});
  color: #fff;
  padding: 4rem 0;
`;

const FleetInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;

  h2 {
    font-size: clamp(2rem, 4vw, 2.7rem);
    letter-spacing: -0.03em;
    max-width: 16ch;
    margin-bottom: 0.75rem;
  }

  p {
    max-width: 36rem;
    color: rgba(255, 255, 255, 0.88);
    font-size: 1.05rem;
    line-height: 1.55;
  }

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FAQList = styled.div`
  max-width: 760px;
  display: grid;
  gap: 0.7rem;
`;

const FAQItem = styled.div`
  border: 1px solid rgba(0, 116, 212, 0.16);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: ${TEXT_DARK};
  font-weight: 500;
  font-size: 1rem;
  padding: 1.05rem 1.15rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: ${PRISMA_PRIMARY};
  }
`;

const FAQAnswer = styled.div`
  padding: 0 1.15rem 1.1rem;
  color: ${TEXT_MUTED};
  line-height: 1.55;
`;

const Footer = styled.footer`
  background: ${PRISMA_DEEP};
  color: rgba(255, 255, 255, 0.9);
  padding: 3rem 0 0;
`;

const FooterGrid = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px 2.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);

  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const FooterBrand = styled.div`
  .name {
    font-weight: 600;
    font-size: 1.2rem;
    letter-spacing: -0.03em;
    color: #fff;
  }

  p {
    margin-top: 0.45rem;
    color: rgba(255, 255, 255, 0.72);
    max-width: 16rem;
  }
`;

const FooterHeading = styled.h2`
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 0.8rem;
`;

const FooterLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    margin-bottom: 0.45rem;
  }

  a {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
  }

  a:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const FooterBottom = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem 24px 1.25rem;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.85rem;
`;

function App() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllPackages, setShowAllPackages] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
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

  useEffect(() => {
    if (hasConsentForCategory("analytics")) {
      initAnalytics();
    }
  }, []);

  const loginHref = withReferral(loginUrl);
  const welcomeHref = withReferral(welcomeUrl);
  const visibleKeys = showAllPackages
    ? [...FEATURED_KEYS, ...EXTRA_KEYS]
    : FEATURED_KEYS;

  const closeMenu = () => setMenuOpen(false);

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

  return (
    <div className="App">
      <HeaderBar>
        <HeaderInner>
          <Logo href="#top" onClick={closeMenu}>
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" />
            <span>
              Prisma
              <small>Car Care</small>
            </span>
          </Logo>
          <Nav $open={menuOpen} aria-label="Primary">
            <NavLink href="#packages" onClick={closeMenu}>
              Packages
            </NavLink>
            <NavLink href="#how" onClick={closeMenu}>
              How it works
            </NavLink>
            <NavLink href="#faq" onClick={closeMenu}>
              Questions
            </NavLink>
            <NavLink href={loginHref} onClick={closeMenu}>
              Log in
            </NavLink>
          </Nav>
          <HeaderActions>
            <SolidButton $hideNarrow href={welcomeHref}>
              Get started
            </SolidButton>
            <MenuButton
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </MenuButton>
          </HeaderActions>
        </HeaderInner>
      </HeaderBar>

      <Hero id="top">
        <Container>
          <HeroGrid>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Eyebrow $onDark>Mobile car care · Dublin</Eyebrow>
              <HeroTitle>
                Small changes
                <span>Big difference</span>
              </HeroTitle>
              <HeroLead>
                Professional detailing at your home or work. Book on the web or
                in the app. We bring the water, the power, and the products.
              </HeroLead>
              <HeroActions>
                <LightSolid href={welcomeHref}>Get started</LightSolid>
                <GhostButton href={loginHref}>Log in</GhostButton>
              </HeroActions>
            </motion.div>
            <HeroPhoto>
              <img
                src={heroCar}
                alt="Close-up of a glossy car headlight and paint"
              />
            </HeroPhoto>
          </HeroGrid>
          <FactList>
            <Fact>
              <strong>Fully mobile</strong>
              <span>We arrive with our own water and power.</span>
            </Fact>
            <Fact>
              <strong>Book on web or app</strong>
              <span>Choose a package, a place, and a time.</span>
            </Fact>
            <Fact>
              <strong>Across Dublin</strong>
              <span>Home, work, or wherever the car is parked.</span>
            </Fact>
          </FactList>
        </Container>
      </Hero>

      <Section>
        <Container>
          <Eyebrow>Why Prisma</Eyebrow>
          <SectionTitle>Care that comes to the car</SectionTitle>
          <SectionLead>
            We handle the clean, wherever the vehicle is parked across Dublin.
          </SectionLead>
          <FeatureGrid>
            <FeatureCard>
              <IconBadge>
                <FaTint />
              </IconBadge>
              <h3>Own water and power</h3>
              <p>
                No hose and no outdoor socket required. The van is set up to
                work on a driveway, at an office, or in a car park.
              </p>
            </FeatureCard>
            <FeatureCard>
              <IconBadge>
                <FaMobileAlt />
              </IconBadge>
              <h3>Simple booking</h3>
              <p>
                Start as a guest or with an account. Pick the package, then
                move or cancel from the same place.
              </p>
            </FeatureCard>
            <FeatureCard>
              <IconBadge>
                <FaHandshake />
              </IconBadge>
              <h3>Fleets and partners</h3>
              <p>
                Several vehicles, branches, or a partner introduction all sit
                on the same account.
              </p>
            </FeatureCard>
          </FeatureGrid>
          <WorkGrid>
            <figure>
              <img src={washPhoto} alt="Washing a car wheel by hand" />
              <figcaption>Exterior wash</figcaption>
            </figure>
            <figure>
              <img src={interiorPhoto} alt="Wiping down a car interior" />
              <figcaption>Interior clean</figcaption>
            </figure>
            <figure>
              <img
                src={vanPhoto}
                alt="Mobile detailing van stocked with water and power equipment"
              />
              <figcaption>We bring the van</figcaption>
            </figure>
          </WorkGrid>
        </Container>
      </Section>

      <Section id="packages" $tone={PRISMA_SOFT}>
        <Container>
          <PackageHead>
            <div>
              <Eyebrow>Packages</Eyebrow>
              <SectionTitle>Simple, clear pricing</SectionTitle>
              <SectionLead>
                Start with a wash, a fuller refresh, or a deep interior. Open
                the rest for showroom, prestige, or ceramic protection.
              </SectionLead>
            </div>
            <TextButton
              type="button"
              onClick={() => setShowAllPackages((open) => !open)}
            >
              {showAllPackages ? "Show the main three" : "See all packages"}
            </TextButton>
          </PackageHead>
          <PackageGrid>
            {visibleKeys.map((key) => {
              const pkg = packages[key];
              return (
                <PackageCard key={key} $featured={key === "mini"}>
                  {pkg.badge ? <Badge>{pkg.badge}</Badge> : null}
                  <PackageName>{pkg.title}</PackageName>
                  <PackagePrice>{pkg.price}</PackagePrice>
                  <PackageCopy>{pkg.description}</PackageCopy>
                  <PointList>
                    {pkg.points.map((point) => (
                      <li key={point}>
                        <FaCheck aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </PointList>
                  <Duration>
                    <FaClock aria-hidden="true" />
                    {pkg.duration}
                  </Duration>
                </PackageCard>
              );
            })}
          </PackageGrid>
        </Container>
      </Section>

      <Section id="how">
        <Container>
          <Eyebrow>How it works</Eyebrow>
          <SectionTitle>Three steps, then we come to you</SectionTitle>
          <StepGrid>
            <Step>
              <StepNumber>01</StepNumber>
              <h3>Choose a package</h3>
              <p>From a quick wash to ceramic protection.</p>
            </Step>
            <Step>
              <StepNumber>02</StepNumber>
              <h3>Pick a time and place</h3>
              <p>Home, work, or wherever the car is parked in greater Dublin.</p>
            </Step>
            <Step>
              <StepNumber>03</StepNumber>
              <h3>We come to you</h3>
              <p>Water, power, and products are already on the van.</p>
            </Step>
          </StepGrid>
        </Container>
      </Section>

      <FleetBand>
        <Container>
          <FleetInner>
            <div>
              <Eyebrow $onDark>Fleets and partners</Eyebrow>
              <h2>One account for every vehicle</h2>
              <p>
                Run a few cars or a whole branch from the same booking flow.
                Partner introductions stay attached when someone gets started
                from your link.
              </p>
            </div>
            <LightSolid href={welcomeHref}>Get started</LightSolid>
          </FleetInner>
        </Container>
      </FleetBand>

      <Section id="faq">
        <Container>
          <Eyebrow>Questions</Eyebrow>
          <SectionTitle>Before you book</SectionTitle>
          <FAQList>
            {faqItems.map((item, index) => {
              const open = expandedFAQ === index;
              return (
                <FAQItem key={item.question}>
                  <FAQQuestion
                    type="button"
                    aria-expanded={open}
                    onClick={() => setExpandedFAQ(open ? null : index)}
                  >
                    <span>{item.question}</span>
                    <FaChevronDown
                      aria-hidden="true"
                      style={{
                        transform: open ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                      }}
                    />
                  </FAQQuestion>
                  {open ? <FAQAnswer>{item.answer}</FAQAnswer> : null}
                </FAQItem>
              );
            })}
          </FAQList>
        </Container>
      </Section>

      <Footer>
        <FooterGrid>
          <FooterBrand>
            <div className="name">Prisma Car Care</div>
            <p>Small changes. Big difference. Mobile detailing across Dublin.</p>
          </FooterBrand>
          <div>
            <FooterHeading>Account</FooterHeading>
            <FooterLinks>
              <li>
                <a href={welcomeHref}>Get started</a>
              </li>
              <li>
                <a href={loginHref}>Log in</a>
              </li>
            </FooterLinks>
          </div>
          <div>
            <FooterHeading>Legal</FooterHeading>
            <FooterLinks>
              <li>
                <a href="/terms-of-service">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy Policy</a>
              </li>
              <li>
                <a
                  href="#cookie-settings"
                  onClick={(event) => {
                    event.preventDefault();
                    window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
                  }}
                >
                  Cookie Preferences
                </a>
              </li>
            </FooterLinks>
          </div>
          <div>
            <FooterHeading>Support</FooterHeading>
            <FooterLinks>
              <li>
                <a href="mailto:support@prismavalet.com">support@prismavalet.com</a>
              </li>
              <li>
                <a href="tel:+353899765197">+353 899 765 197</a>
              </li>
            </FooterLinks>
          </div>
        </FooterGrid>
        <FooterBottom>
          <p>© {new Date().getFullYear()} Prisma Car Care. All rights reserved.</p>
          <p>Powered by @vhotis technologies limited</p>
        </FooterBottom>
      </Footer>

      <CookieConsent />
    </div>
  );
}

export default App;
