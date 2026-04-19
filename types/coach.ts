import type { Timestamp } from "firebase/firestore";

export type CoachTrigger =
  | "weekly"
  | "weak_skill"
  | "post_session"
  | "student_reply"
  | "luke_initiated";

export type CoachAuthor = "parker" | "luke" | "student";
export type CoachRole = "coach" | "student";
export type DraftStatus = "pending" | "approved" | "rejected" | "sent" | "expired";

export interface CoachThread {
  studentUid: string;
  lastActivityAt: Timestamp;
  unreadCountStudent: number;
  unreadCountCoach: number;
  wantsHumanCoach: boolean;
}

export interface CoachNote {
  id: string;
  threadUid: string;
  role: CoachRole;
  author: CoachAuthor;
  body: string;
  quotedPassage?: string;
  linkedSkill?: string;
  linkedCourse?: string;
  trigger: CoachTrigger;
  createdAt: Timestamp;
  readBy: { student?: Timestamp; luke?: Timestamp };
  status: "sent";
  lukeEdited: boolean;
}

export interface CoachDraft {
  id: string;
  threadUid: string;
  body: string;
  quotedPassage?: string;
  linkedSkill?: string;
  linkedCourse?: string;
  trigger: CoachTrigger;
  author: "parker";
  draftedAt: Timestamp;
  expiresAt: Timestamp;
  status: DraftStatus;
  approvedBy?: "luke" | "auto";
  rejectedReason?: string;
  lukeEdited: boolean;
}
