// src/components/NavBar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const NavBar: React.FC = () => {
  const { currentUser } = useAuth();

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Sign Out Error:', error));
  };

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/clubs">Clubs</Link>
      {currentUser ? (
        <>
          {' '}
          | <Link to="/create-club">Create Club</Link> {/* New Create Club link */}
          {' '}
          | <Link to="/profile">Profile</Link> | <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <> | <Link to="/login">Login</Link></>
      )}
    </nav>
  );
};

export default NavBar;
