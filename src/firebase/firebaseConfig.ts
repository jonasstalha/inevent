// src/firebase/firebaseConfig.ts
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC7Mr5CAQPoqAIMLh-IefxsVugqyI8PYXA',
  authDomain: 'inevents-2fe56.firebaseapp.com',
  projectId: 'inevents-2fe56',
  storageBucket: 'inevents-2fe56.appspot.com',
  messagingSenderId: '780609459655',
  appId: '1:780609459655:android:c4535e1323f166ef7f75e2',
};

// Initialize Firebase
if (!auth().app) {
  initializeApp(firebaseConfig);
}

// Export the auth instance
export const firebaseAuth = auth();
export const app = auth().app;
