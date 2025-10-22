import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccountJson = process.env['FIREBASE_SERVICE_ACCOUNT'];
let bucket = null;

try {
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'mouhajer-a912f.appspot.com',
      });
    }

    bucket = getStorage().bucket();
  } else {
    // Create a mock bucket for build time
    bucket = null;
  }
} catch (error) {
  console.warn('Firebase initialization skipped:', error.message);
  bucket = null;
}

export default bucket;
