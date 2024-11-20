// src/pages/Clubs.tsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import ClubCard from '../components/ClubCard';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Clubs.css';

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<DocumentData[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsRef = collection(db, 'clubs');
        const snapshot = await getDocs(clubsRef);
        const clubsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setClubs(clubsList);
      } catch (error: any) {
        console.error('Error fetching clubs:', error);
        alert(`Error fetching clubs: ${error.message}`);
      }
    };

    fetchClubs();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setIsDropdownVisible(true); // Show dropdown while typing
  };

  const handleDropdownItemClick = (clubId: string) => {
    navigate(`/clubs/${clubId}`); // Navigate to the club's page
    setIsDropdownVisible(false); // Hide the dropdown
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleJoinClub = async (clubId: string) => {
    if (!currentUser) {
      alert('Please log in to join a club.');
      return;
    }

    // Join club logic here...
  };

  return (
    <div className="clubs-page">
      <div className="clubs-header">
        <h2 className="clubs-title">Clubs</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search clubs..."
            value={searchInput}
            onChange={handleSearchChange}
            onClick={() => setIsDropdownVisible(true)} // Show dropdown when clicking
          />
          {isDropdownVisible && (
            <div className="dropdown">
              {filteredClubs.map((club) => (
                <div
                  key={club.id}
                  className="dropdown-item"
                  onClick={() => handleDropdownItemClick(club.id)}
                >
                  {club.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {currentUser && (
        <Link to="/create-club">
          <button>Create a New Club</button>
        </Link>
      )}
      {clubs.map((club) => (
        <ClubCard
          key={club.id}
          id={club.id}
          name={club.name}
          description={club.description}
          category={club.category} // If category is added later
          onJoin={handleJoinClub}
        />
      ))}
    </div>
  );
};

export default Clubs;
