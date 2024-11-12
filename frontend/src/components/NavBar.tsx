import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/clubs">Clubs</Link> | <Link to="/events">Events</Link>
      {currentUser ? (
        <>
          {' '}
          | <Link to="/profile">Profile</Link> | <Link to="/create-club">Create Club</Link> | <button>Logout</button>
        </>
      ) : (
        <> | <Link to="/login">Login</Link></>
      )}
    </nav>
  );
};

export default NavBar;
