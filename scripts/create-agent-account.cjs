// Create a Firebase Auth user for a Lachlan agent account on PantherPrep.
//
// Usage:
//   node scripts/create-agent-account.cjs pixel@lachlan.internal "Pixel (visual QA)"
//
// Behavior:
// - Idempotent. If the auth user already exists, the script ensures the
//   Firestore students/{uid} doc has role=admin. Password not touched.
// - If the auth user doesn't exist, creates it with a random 18-byte
//   (24-char base64url) password and prints the password ONCE to stdout.
//   Save it immediately.
// - Writes students/{uid} with role="admin" (pantherprep has three tiers;
//   agents need admin to reach the /admin UI). Marks isAgent=true.
//
// Prerequisites:
// - Firebase Admin SDK credentials (ADC or service account)
// - Email/Password sign-in provider enabled in Firebase Console for
//   pantherprep-a5a73 — otherwise the created user can't actually sign in
//   (admin SDK creates users regardless, but client sign-in is provider-gated).
//
// Related: scripts/backfill-admin-role.cjs (for Luke's own role field).
const admin = require("firebase-admin");
const crypto = require("crypto");

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "pantherprep-a5a73" });
}
const auth = admin.auth();
const db = admin.firestore();

const EMAIL = (process.argv[2] || "").trim().toLowerCase();
const DISPLAY_NAME = process.argv[3] || "";

if (!EMAIL) {
  console.error("usage: node scripts/create-agent-account.cjs <email> [displayName]");
  process.exit(2);
}
if (!EMAIL.endsWith("@lachlan.internal") && !EMAIL.endsWith("@paps.net")) {
  console.error("refusing: email must end with @lachlan.internal or @paps.net");
  process.exit(2);
}

(async () => {
  let userRecord;
  let password = null;

  try {
    userRecord = await auth.getUserByEmail(EMAIL);
    console.log(`[auth] user exists: ${EMAIL} (uid: ${userRecord.uid}) — not touching password`);
  } catch (e) {
    if (e.code !== "auth/user-not-found") throw e;
    password = crypto.randomBytes(18).toString("base64url");
    userRecord = await auth.createUser({
      email: EMAIL,
      password,
      displayName: DISPLAY_NAME || EMAIL,
      emailVerified: true,
    });
    console.log(`[auth] created user: ${EMAIL} (uid: ${userRecord.uid})`);
  }

  // Ensure the Firestore students doc exists with role=admin. PantherPrep
  // has three tiers — agents need admin to hit the /admin UI.
  const userRef = db.collection("students").doc(userRecord.uid);
  const snap = await userRef.get();
  if (!snap.exists) {
    await userRef.set({
      email: EMAIL,
      displayName: DISPLAY_NAME || EMAIL,
      role: "admin",
      isAgent: true,
      xp: 0,
      level: 0,
      streak: 0,
      badges: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`[fs]   created students/${userRecord.uid} with role=admin`);
  } else {
    const data = snap.data();
    const needsUpdate = data.role !== "admin" || data.isAgent !== true;
    if (needsUpdate) {
      await userRef.set(
        {
          role: "admin",
          isAgent: true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`[fs]   updated students/${userRecord.uid} — role=admin, isAgent=true`);
    } else {
      console.log(`[fs]   students/${userRecord.uid} already correct`);
    }
  }

  if (password) {
    const line = "=".repeat(60);
    console.log("\n" + line);
    console.log("NEW PASSWORD — save this now, it will NOT be shown again:");
    console.log("");
    console.log("  " + password);
    console.log("");
    console.log("Account:  " + EMAIL);
    console.log("Login at: https://pantherprep.web.app");
    console.log(line);
  }

  process.exit(0);
})().catch((e) => {
  console.error(`error: ${e.message}`);
  process.exit(1);
});
