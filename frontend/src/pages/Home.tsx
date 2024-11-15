// src/pages/Home.tsx

import React from 'react';
import './Home.css'; // Import the CSS file for organized styling

const Home: React.FC = () => (
  <div className="home-container">
    <nav className="navbar">
      <a href="#home">Home</a>
      <a href="#clubs">Clubs</a>
      <a href="#events">Events</a>
      <a href="#login">Login</a>
    </nav>
    <div className="content">
      <h1>Welcome to the Community Engagement App</h1>
      <p>Connect with clubs and stay updated on events.</p>
    </div>
  </div>
);

export default Home;

