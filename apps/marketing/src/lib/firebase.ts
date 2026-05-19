import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider, CustomProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

if (import.meta.env.DEV || import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN) {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN;
}

initializeAppCheck(app, {
  provider: import.meta.env.PROD
    ? new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY)
    : new CustomProvider({
        getToken: () =>
          Promise.resolve({
            token: import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN as string,
            expireTimeMillis: Date.now() + 60 * 60 * 1000,
          }),
      }),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'europe-west2');
