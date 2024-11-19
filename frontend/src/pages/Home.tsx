// src/pages/Home.tsx

import { Link } from 'react-router-dom';

import React from 'react';
import './Home.css'; // Import the CSS file

const Home: React.FC = () => (
  <div className="home-container">
    <h1>Welcome to UEngage</h1>
    <p>Connect with clubs and stay updated on events.</p>
    {/* <button className="get-started-button">Get Started</button> */}
    <Link to="/events" className="get-started-button">Get Started</Link>
  </div>
);

export default Home;


// import React from 'react';

// const Home: React.FC = () => (
//   <div>
//     <h1>Welcome to the Community Engagement App</h1>
//     <p>Connect with clubs and stay updated on events.</p>
//   </div>
// );

// export default Home;
