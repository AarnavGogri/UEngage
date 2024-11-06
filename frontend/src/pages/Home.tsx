// src/pages/Home.tsx

// import React from 'react';

// const Home: React.FC = () => (
//   <div>
//     <h1>Welcome to the Community Engagement App</h1>
//     <p>Connect with clubs and stay updated on events.</p>
//   </div>
// );

// export default Home;
// src/pages/Home.tsx

import React from 'react';
import './Home.css'; // Ensure you create or update this CSS file

const Home: React.FC = () => (
  <div className="home-container">
    <div className="left-section">
      <h1>UEngage - Find your community</h1>
      <div className="business-footer">
        <span className="footer-circle"></span> Business Name
      </div>
    </div>
    <div className="right-section">
      <div className="event-card">
        <h2>Next Event</h2>
        <p className="event-title">NAME OF EVENT:</p>
        <p className="event-description">Describe the event here</p>
        <button className="learn-more-button">Learn More</button>
      </div>
    </div>
  </div>
);

export default Home;
