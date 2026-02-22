const { onRequest } = require('firebase-functions/v2/https');
const { TranslationServiceClient } = require('@google-cloud/translate');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const crypto = require('crypto');

initializeApp();
const db = getFirestore();
const translationClient = new TranslationServiceClient();

function hashText(text) {
  return crypto.createHash('md5').update(text).digest('hex').substring(0, 12);
}

exports.translateText = onRequest(
  {
    cors: true,
    maxInstances: 10,
    region: 'us-central1',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
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

    try {
      const results = new Array(texts.length);
      const uncached = [];
      const uncachedIndices = [];

      // Check Firestore cache
      const cacheChecks = texts.map(async (text, i) => {
        const docId = targetLanguage + '_' + hashText(text);
        try {
          const doc = await db.collection('translations').doc(docId).get();
          if (doc.exists && doc.data().translated) {
            results[i] = doc.data().translated;
          } else {
            uncached.push(text);
            uncachedIndices.push(i);
          }
        } catch (e) {
          uncached.push(text);
          uncachedIndices.push(i);
        }
      });

      await Promise.all(cacheChecks);

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
