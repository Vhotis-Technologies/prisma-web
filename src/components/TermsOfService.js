import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 0 0 3rem;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #6d28d9 100%);
  padding: 1.5rem 0 2.5rem;
  margin-bottom: -1.5rem;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 0.6rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

const ContentContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.25rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 10px 40px -10px rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.04);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1.25rem;
`;

const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
`;

const LoadingText = styled.span`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
`;

const ErrorWrap = styled.div`
  text-align: center;
  padding: 2rem 1rem;
`;

const ErrorIcon = styled(FaExclamationCircle)`
  font-size: 2.5rem;
  color: #ef4444;
  margin-bottom: 0.75rem;
`;

const ErrorText = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 1.25rem;
  line-height: 1.5;
`;

const RetryButton = styled(motion.button)`
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #4f46e5;
  }
`;

const TermsContent = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.7;
  color: #374151;
  font-size: 1rem;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 1.5rem;
    letter-spacing: -0.02em;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #111827;
    margin: 2rem 0 0.75rem;
    letter-spacing: -0.01em;
  }

  h3 {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1f2937;
    margin: 1.25rem 0 0.5rem;
  }

  p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  strong {
    font-weight: 600;
    color: #111827;
  }

  ul,
  ol {
    margin: 0 0 1rem 1.5rem;
    padding-left: 0.25rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
  }

  a:hover {
    color: #4f46e5;
    border-bottom-color: #4f46e5;
  }
`;

const TermsOfService = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [termsContent, setTermsContent] = useState("");

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      setLoading(true);
      setError(false);

      const base = process.env.REACT_APP_API_BASE_URL || "http://localhost/client";
      const apiUrl = `${base.replace(/\/$/, "")}/api/v1/terms/get_terms/`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.content) {
        setTermsContent(data.content);
      } else {
        throw new Error("No content received");
      }
    } catch (err) {
      console.error("Error fetching terms of service:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <BackButton
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaArrowLeft />
            </BackButton>
            <Title>Terms of Service</Title>
          </HeaderContent>
        </Header>
        <ContentContainer>
          <Card>
            <LoadingWrap>
              <Spinner
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
              <LoadingText>Loading terms of service…</LoadingText>
            </LoadingWrap>
          </Card>
        </ContentContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <BackButton
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaArrowLeft />
            </BackButton>
            <Title>Terms of Service</Title>
          </HeaderContent>
        </Header>
        <ContentContainer>
          <Card>
            <ErrorWrap>
              <ErrorIcon />
              <ErrorText>
                Unable to load terms of service. Please try again or contact support.
              </ErrorText>
              <RetryButton
                onClick={fetchTerms}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try again
              </RetryButton>
            </ErrorWrap>
          </Card>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <BackButton
            onClick={handleBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaArrowLeft />
          </BackButton>
          <Title>Terms of Service</Title>
        </HeaderContent>
      </Header>
      <ContentContainer>
        <Card
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <TermsContent
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        </Card>
      </ContentContainer>
    </Container>
  );
};

export default TermsOfService;
