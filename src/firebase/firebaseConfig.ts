// src/firebase/firebaseConfig.ts
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyC7Mr5CAQPoqAIMLh-IefxsVugqyI8PYXA',
  authDomain: 'inevents-2fe56.firebaseapp.com',
  projectId: 'inevents-2fe56',
  storageBucket: 'inevents-2fe56.appspot.com',
  messagingSenderId: '780609459655',
  appId: '1:780609459655:android:c4535e1323f166ef7f75e2',
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
