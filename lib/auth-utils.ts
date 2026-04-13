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

export function isPapsEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().endsWith("@paps.net");
}

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
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
