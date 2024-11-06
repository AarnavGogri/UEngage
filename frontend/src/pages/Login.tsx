// src/pages/Login.tsx

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './Login.css'; // Ensure this CSS file exists for styling

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          joinedClubs: [],
        });
      }

      navigate('/profile');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="background-decor">
        <div className="uw-pattern"></div>
        <div className="circle large-circle"></div>
        <div className="circle small-circle"></div>
        <div className="uw-icon uw-logo"></div>
      </div>
      <div className="login-card">
        <h2>Welcome to UEngage</h2>
        <p>Connect with the Husky community and explore events and clubs around you.</p>
        <button className="google-signin-button" onClick={handleGoogleSignIn}>
          <img src="/path/to/google-icon.svg" alt="Google Icon" className="google-icon" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
