// src/pages/Login.tsx
import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';  // <-- import from your new file
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      // Create/update user on your backend
      await axios.post(
        'http://localhost:5001/api/auth/create-user',
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Save user info locally
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        token
      }));

      navigate('/profile');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Google Sign-In failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default Login;
