
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { FIREBASE_CONFIG } from 'src/config/firebase';

// Firebase configuration
const firebaseConfig = FIREBASE_CONFIG;

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase messaging
export const messaging = getMessaging(firebaseApp);
console.log('setup sw')
