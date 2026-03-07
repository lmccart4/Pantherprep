import type { UserRole } from "@/types/auth";

const ADMIN_EMAILS = ["lucamccarthy@paps.net"];

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
