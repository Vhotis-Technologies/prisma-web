import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%);
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;

  .success {
    color: #4caf50;
  }
  .error {
    color: #f44336;
  }
  .loading {
    color: #2196f3;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Button = styled(motion.button)`
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 0.5rem;

  &:hover {
    background: #333;
  }
`;

const SecondaryButton = styled(Button)`
  background: #e3f2fd;
  color: #1a1a1a;

  &:hover {
    background: #bbdefb;
  }
`;

const PaymentReturn = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [bookingReference, setBookingReference] = useState("");

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("status");
    const reference = urlParams.get("booking_reference");
    const redirectStatus = urlParams.get("redirect_status");

    // Set booking reference if available
    if (reference) {
      setBookingReference(reference);
    }

    // Determine status based on URL parameters
    if (paymentStatus === "success" || redirectStatus === "succeeded") {
      setStatus("success");
      setMessage(
        "Your payment has been processed successfully! Your booking has been confirmed and you will receive a confirmation email shortly."
      );
    } else if (paymentStatus === "failed" || redirectStatus === "failed") {
      setStatus("error");
      setMessage(
        "We encountered an issue processing your payment. Please try again or contact our support team for assistance."
      );
    } else if (paymentStatus === "cancelled") {
      setStatus("cancelled");
      setMessage(
        "Your payment was cancelled. You can try booking again whenever you're ready."
      );
    } else {
      // Default to processing for a few seconds, then redirect to home
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    }
  }, []);

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleOpenApp = () => {
    // Try to open the mobile app, fallback to app store
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      // Android - try to open app, fallback to Play Store
      window.location.href =
        "intent://prismavalet#Intent;scheme=prismavalet;package=com.prismavalet.client;end";
      setTimeout(() => {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.prismavalet.client";
      }, 2000);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      // iOS - try to open app, fallback to App Store
      window.location.href = "prismavalet://dashboard";
      setTimeout(() => {
        window.location.href =
          "https://apps.apple.com/app/prismavalet/id123456789";
      }, 2000);
    } else {
      // Desktop - show message to download mobile app
      alert(
        "Please download the Prisma Car Care mobile app to view your bookings."
      );
    }
  };

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <>
            <Icon>
              <FaCheckCircle className="success" />
            </Icon>
            <Title>Payment Successful!</Title>
            <Message>{message}</Message>
            {bookingReference && (
              <Message>
                <strong>Booking Reference: {bookingReference}</strong>
              </Message>
            )}
            <div>
              <Button
                onClick={handleOpenApp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Open Prisma Car Care App
              </Button>
              <SecondaryButton
                onClick={handleBackToHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </SecondaryButton>
            </div>
          </>
        );

      case "error":
        return (
          <>
            <Icon>
              <FaTimesCircle className="error" />
            </Icon>
            <Title>Payment Failed</Title>
            <Message>{message}</Message>
            <div>
              <Button
                onClick={handleOpenApp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Again in App
              </Button>
              <SecondaryButton
                onClick={handleBackToHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </SecondaryButton>
            </div>
          </>
        );

      case "cancelled":
        return (
          <>
            <Icon>
              <FaTimesCircle className="error" />
            </Icon>
            <Title>Payment Cancelled</Title>
            <Message>{message}</Message>
            <div>
              <Button
                onClick={handleOpenApp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue in App
              </Button>
              <SecondaryButton
                onClick={handleBackToHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </SecondaryButton>
            </div>
          </>
        );

      default:
        return (
          <>
            <Icon>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FaSpinner className="loading" />
              </motion.div>
            </Icon>
            <Title>Processing...</Title>
            <Message>Please wait while we process your payment...</Message>
          </>
        );
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {renderContent()}
      </Card>
    </Container>
  );
};

export default PaymentReturn;
