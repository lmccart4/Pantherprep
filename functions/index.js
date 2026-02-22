const { onRequest } = require('firebase-functions/v2/https');
const { TranslationServiceClient } = require('@google-cloud/translate');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const crypto = require('crypto');

initializeApp();
const db = getFirestore();
const translationClient = new TranslationServiceClient();

const MAX_TEXT_LENGTH = 5000;
const MAX_TOTAL_LENGTH = 500000;

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex').substring(0, 16);
}

exports.translateText = onRequest(
  {
    cors: ['https://pantherprep.web.app', 'https://pantherprep.firebaseapp.com'],
    maxInstances: 10,
    region: 'us-central1',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    // Verify Firebase auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing authorization token' });
      return;
    }
    try {
      const token = authHeader.split('Bearer ')[1];
      const decoded = await getAuth().verifyIdToken(token);
      if (!decoded.email || !decoded.email.endsWith('@paps.net')) {
        res.status(403).json({ error: 'Unauthorized domain' });
        return;
      }
    } catch (e) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }

    const { texts, targetLanguage, sourceLanguage = 'en' } = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      res.status(400).json({ error: 'Missing or invalid "texts" array' });
      return;
    }
    if (!targetLanguage) {
      res.status(400).json({ error: 'Missing "targetLanguage"' });
      return;
    }
    if (texts.length > 128) {
      res.status(400).json({ error: 'Maximum 128 texts per request' });
      return;
    }

    // Validate individual text lengths
    let totalLength = 0;
    for (const text of texts) {
      if (typeof text !== 'string') {
        res.status(400).json({ error: 'Each text must be a string' });
        return;
      }
      if (text.length > MAX_TEXT_LENGTH) {
        res.status(400).json({ error: `Individual text exceeds ${MAX_TEXT_LENGTH} char limit` });
        return;
      }
      totalLength += text.length;
    }
    if (totalLength > MAX_TOTAL_LENGTH) {
      res.status(400).json({ error: 'Total text size exceeds limit' });
      return;
    }

    try {
      const results = new Array(texts.length);
      const uncached = [];
      const uncachedIndices = [];

      // Batch Firestore cache reads (up to 50 per batch)
      const docRefs = texts.map((text) => {
        const docId = targetLanguage + '_' + hashText(text);
        return db.collection('translations').doc(docId);
      });

      for (let b = 0; b < docRefs.length; b += 50) {
        const batchRefs = docRefs.slice(b, b + 50);
        const docs = await db.getAll(...batchRefs);
        docs.forEach((doc, idx) => {
          const origIdx = b + idx;
          if (doc.exists && doc.data().translated && doc.data().source === texts[origIdx]) {
            results[origIdx] = doc.data().translated;
          } else {
            uncached.push(texts[origIdx]);
            uncachedIndices.push(origIdx);
          }
        });
      }

      // Translate only uncached texts
      if (uncached.length > 0) {
        const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
        const request = {
          parent: `projects/${projectId}/locations/global`,
          contents: uncached,
          mimeType: 'text/plain',
          sourceLanguageCode: sourceLanguage,
          targetLanguageCode: targetLanguage,
        };

        const [response] = await translationClient.translateText(request);
        const translations = response.translations.map(t => t.translatedText);

        // Save to Firestore and fill results
        const writes = translations.map((translated, j) => {
          const origIdx = uncachedIndices[j];
          results[origIdx] = translated;
          const docId = targetLanguage + '_' + hashText(texts[origIdx]);
          return db.collection('translations').doc(docId).set({
            source: texts[origIdx],
            translated: translated,
            lang: targetLanguage,
            created: new Date().toISOString()
          });
        });

        // Write cache in background, don't block response
        Promise.all(writes).catch(e => console.error('Cache write error:', e));
      }

      res.status(200).json({ translations: results });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: 'Translation failed', message: error.message });
    }
  }
);
