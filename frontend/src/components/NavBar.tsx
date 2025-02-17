// src/components/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">UEngage</Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/events">Events</Link>
          {currentUser ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/create-club">Add Club</Link>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
