import type { UserRole } from "@/types/auth";

// Bootstrap allowlist: emails that resolve to admin on first login.
// Order of authority: stored Firestore role wins over this list (so a manual
// demote via the /admin UI sticks), but any email here auto-admins when the
// doc has no role yet. Agent accounts are pre-authorized so Luke can create
// them via PAPS IT later without touching code — they'll gain admin on the
// very first sign-in. Agents are the Lachlan team (CTO + 6 specialists).
const ADMIN_EMAILS = [
  "lucamccarthy@paps.net",
  // Lachlan agent team (may not exist in Google Workspace yet)
  "lachlan@paps.net",
  "atlas@paps.net",
  "parker@paps.net",
  "kit@paps.net",
  "mack@paps.net",
  "pixel@paps.net",
  "link@paps.net",
];

// Fake domain reserved for Lachlan agent accounts. These authenticate via
// Firebase email/password (NOT Google OAuth) and bypass the @paps.net school
// domain gate. Used when agents need real web sign-in — currently Pixel for
// visual QA of authenticated pages. Accounts are provisioned via
// scripts/create-agent-account.cjs.
const AGENT_DOMAIN = "@lachlan.internal";

export function isPapsEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith("@paps.net");
}

export function isAgentEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith(AGENT_DOMAIN);
}

// Gate for the auth flow: either a @paps.net Google user OR a @lachlan.internal
// agent. Anything else is rejected at sign-in.
export function isAllowedAuthEmail(email: string | null | undefined): boolean {
  return isPapsEmail(email) || isAgentEmail(email);
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  // Any agent-domain email is admin by convention — agents never run as
  // students or teachers. Plus the explicit @paps.net allowlist above.
  if (isAgentEmail(email)) return true;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function isTeacher(email: string | null | undefined): boolean {
  if (!email) return false;
  const [localPart, domain] = email.split("@");
  if (domain?.toLowerCase() !== "paps.net") return false;
  const digitCount = (localPart.match(/\d/g) || []).length;
  return digitCount < 3;
}

export function getUserRole(email: string | null | undefined): UserRole {
  if (isAdmin(email)) return "admin";
  if (isTeacher(email)) return "teacher";
  return "student";
}
