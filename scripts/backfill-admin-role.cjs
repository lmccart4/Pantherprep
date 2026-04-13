// One-time script: set lucamccarthy@paps.net's role field to "admin".
// Idempotent — safe to re-run.
//
// Context: lib/auth-utils.ts hardcodes this email as admin via the
// ADMIN_EMAILS list, but auth-context.tsx reads the Firestore role
// field as the source of truth for the /admin UI gate. This script
// aligns the stored value with the effective admin status so the
// admin UI treats Luke correctly without a code-level special case.
//
// Run after deploying firestore.rules changes from Task 1, which
// grant admin write access needed for this script to update roles
// via merge write.
const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'pantherprep-a5a73' });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('students')
    .where('email', '==', 'lucamccarthy@paps.net')
    .get();

  if (snap.empty) {
    console.error('No student doc found for lucamccarthy@paps.net');
    process.exit(1);
  }

  for (const doc of snap.docs) {
    const before = doc.data().role;
    await doc.ref.set({ role: 'admin' }, { merge: true });
    const after = (await doc.ref.get()).data().role;
    console.log(`${doc.data().email}: role ${JSON.stringify(before)} → ${JSON.stringify(after)}`);
  }

  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
