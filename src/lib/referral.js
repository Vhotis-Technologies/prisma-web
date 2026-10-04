/**
 * Partner share links land on this site as `/?ref=CODE`.
 * The marketing site and the booking app are different origins, so the code
 * has to travel on the Get started and Log in URLs. sessionStorage keeps it
 * if the visitor moves around this site before clicking through.
 */

const REFERRAL_STORAGE_KEY = "prisma_referral_code";
const REFERRAL_PATTERN = /^[A-Z0-9]{4,12}$/;

export function normalizeReferralCode(raw) {
  const code = String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  return REFERRAL_PATTERN.test(code) ? code : "";
}

/** Read `ref` from the address bar and remember a valid code for this tab. */
export function currentReferralCode() {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams(window.location.search);
  const fromUrl = normalizeReferralCode(
    params.get("ref") || params.get("referral") || params.get("referral_code"),
  );
  try {
    if (fromUrl) {
      sessionStorage.setItem(REFERRAL_STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    return normalizeReferralCode(sessionStorage.getItem(REFERRAL_STORAGE_KEY));
  } catch {
    return fromUrl;
  }
}

/** Append the remembered partner code so the booking app can prefill it. */
export function withReferral(url) {
  const code = currentReferralCode();
  if (!code) return url;
  const next = new URL(url, window.location.origin);
  next.searchParams.set("ref", code);
  return next.toString();
}
