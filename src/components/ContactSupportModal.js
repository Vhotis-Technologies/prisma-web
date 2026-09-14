import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const PRISMA_PRIMARY = "#0074d4";
const PRISMA_PRIMARY_HOVER = "#005fad";
const PRISMA_PRIMARY_SOFT = "#e6f3fb";
const TEXT_DARK = "#212121";
const TEXT_MUTED = "#424242";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1300;
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

const Card = styled(motion.div)`
  width: 100%;
  max-width: 520px;
  max-height: min(90vh, 720px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  border: 1px solid ${PRISMA_PRIMARY_SOFT};
  box-shadow: 0 24px 60px rgba(0, 116, 212, 0.16);
`;

const AccentBar = styled.div`
  height: 4px;
  background: ${PRISMA_PRIMARY};
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.5rem 1rem;
  border-bottom: 1px solid #e5e5e5;

  h2 {
    margin: 0 0 0.35rem;
    color: ${TEXT_DARK};
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  p {
    margin: 0;
    color: ${TEXT_MUTED};
    font-size: 0.9rem;
    line-height: 1.45;
  }
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: ${PRISMA_PRIMARY_SOFT};
  color: ${PRISMA_PRIMARY};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #d6ebf8;
  }
`;

const Body = styled.form`
  padding: 1.25rem 1.5rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${TEXT_DARK};
  }

  input,
  textarea {
    width: 100%;
    border: 1px solid #e5e5e5;
    border-radius: 10px;
    padding: 0.75rem 0.9rem;
    font-size: 0.95rem;
    font-family: inherit;
    color: ${TEXT_DARK};
    background: #fff;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: ${PRISMA_PRIMARY};
      box-shadow: 0 0 0 3px rgba(0, 116, 212, 0.15);
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  textarea {
    min-height: 140px;
    resize: vertical;
  }
`;

const ErrorText = styled.span`
  font-size: 0.8rem;
  color: #d32f2f;
`;

const FormError = styled.div`
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  background: #fdecea;
  color: #d32f2f;
  font-size: 0.9rem;
`;

const SubmitButton = styled(motion.button)`
  margin-top: 0.25rem;
  border: none;
  cursor: pointer;
  padding: 0.9rem 1.2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  background: ${PRISMA_PRIMARY};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px rgba(0, 116, 212, 0.28);

  &:hover:not(:disabled) {
    background: ${PRISMA_PRIMARY_HOVER};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const SuccessState = styled.div`
  padding: 2.5rem 1.5rem 2rem;
  text-align: center;

  .icon {
    font-size: 2.5rem;
    color: #4caf50;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0 0 0.5rem;
    color: ${TEXT_DARK};
    font-size: 1.25rem;
  }

  p {
    margin: 0 0 1.5rem;
    color: ${TEXT_MUTED};
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const DoneButton = styled(motion.button)`
  border: none;
  cursor: pointer;
  padding: 0.8rem 1.4rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  background: ${PRISMA_PRIMARY};

  &:hover {
    background: ${PRISMA_PRIMARY_HOVER};
  }
`;

const INITIAL = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

/**
 * Contact support modal — collects name, email, subject, message and
 * POSTs to the public Django contact endpoint.
 */
const ContactSupportModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState(INITIAL);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL);
      setFieldErrors({});
      setFormError("");
      setSending(false);
      setSent(false);
    }
  }, [isOpen]);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setSending(true);

    try {
      const url = `${API_BASE_URL}/api/v1/contact/submit/`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
        }
        setFormError(
          data.error ||
            data.detail ||
            "Unable to send your message. Please try again."
        );
        return;
      }

      setSent(true);
    } catch {
      setFormError(
        "Network error. Check your connection and try again, or email support@prismavalet.com."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Card
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-support-title"
          >
            <AccentBar />
            {sent ? (
              <SuccessState>
                <div className="icon">
                  <FaCheckCircle />
                </div>
                <h3>Message sent</h3>
                <p>
                  Thanks for reaching out. Our team will reply to your email as
                  soon as we can.
                </p>
                <DoneButton
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Done
                </DoneButton>
              </SuccessState>
            ) : (
              <>
                <Header>
                  <div>
                    <h2 id="contact-support-title">Contact support</h2>
                    <p>
                      Tell us how we can help. We’ll reply by email.
                    </p>
                  </div>
                  <CloseButton type="button" onClick={onClose} aria-label="Close">
                    <FaTimes />
                  </CloseButton>
                </Header>

                <Body onSubmit={handleSubmit}>
                  {formError && <FormError>{formError}</FormError>}

                  <Field>
                    <label htmlFor="contact-name">Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={onChange("name")}
                      placeholder="Your name"
                      maxLength={120}
                      required
                    />
                    {fieldErrors.name && (
                      <ErrorText>{fieldErrors.name}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <label htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={onChange("email")}
                      placeholder="you@example.com"
                      maxLength={254}
                      required
                    />
                    {fieldErrors.email && (
                      <ErrorText>{fieldErrors.email}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <label htmlFor="contact-subject">Subject</label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={form.subject}
                      onChange={onChange("subject")}
                      placeholder="What is this about?"
                      maxLength={200}
                      required
                    />
                    {fieldErrors.subject && (
                      <ErrorText>{fieldErrors.subject}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <label htmlFor="contact-message">Description</label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={onChange("message")}
                      placeholder="Share a few details so we can help faster…"
                      maxLength={5000}
                      required
                    />
                    {fieldErrors.message && (
                      <ErrorText>{fieldErrors.message}</ErrorText>
                    )}
                  </Field>

                  <SubmitButton
                    type="submit"
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.01 }}
                    whileTap={{ scale: sending ? 1 : 0.99 }}
                  >
                    <FaPaperPlane />
                    {sending ? "Sending…" : "Send message"}
                  </SubmitButton>
                </Body>
              </>
            )}
          </Card>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ContactSupportModal;
