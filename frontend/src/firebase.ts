// src/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBFD-9ya7u780CV2qNWpbm6Zh9ow1c1h8s", //process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "uengage-278e4.firebaseapp.com",
    projectId: "uengage-278e4",
    storageBucket: "uengage-278e4.appspot.com",
    messagingSenderId: "382763489448",
    appId: "1:382763489448:web:db689a25c9ff4211db4a9d",
    measurementId: "G-SHZHRKXDJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
