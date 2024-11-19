// src/components/NavBar.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css'; // Import the CSS file

const NavBar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          UEngage
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/events">Events</Link>
          {currentUser ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/create-club">Create Club</Link>
              <button className="logout-button">Logout</button>
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
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const NavBar: React.FC = () => {
//   const { currentUser } = useAuth();

//   return (
//     <nav>
//       <Link to="/">Home</Link> | <Link to="/clubs">Clubs</Link> | <Link to="/events">Events</Link>
//       {currentUser ? (
//         <>
//           {' '}
//           | <Link to="/profile">Profile</Link> | <Link to="/create-club">Create Club</Link> | <button>Logout</button>
//         </>
//       ) : (
//         <> | <Link to="/login">Login</Link></>
//       )}
//     </nav>
//   );
// };

// export default NavBar;
