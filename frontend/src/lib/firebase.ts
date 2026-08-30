import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const getValidKey = (val: string | undefined, fallback: string) => {
  if (!val || val.includes('Dummy') || val.includes('dummy') || val === 'your-api-key') {
    return fallback;
  }
  return val;
};

const firebaseConfig = {
  apiKey: getValidKey(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'AIzaSyBzk5rc_jV0GVwgv87g6UOk78H6yI2MJ-Q'),
  authDomain: getValidKey(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'minecraft-cloud-panel.firebaseapp.com'),
  projectId: getValidKey(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'minecraft-cloud-panel'),
  storageBucket: getValidKey(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'minecraft-cloud-panel.firebasestorage.app'),
  messagingSenderId: getValidKey(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, '902010567559'),
  appId: getValidKey(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, '1:902010567559:web:b2f93091af67b481c2f122'),
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
