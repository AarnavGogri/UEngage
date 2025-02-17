// src/pages/Clubs.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClubCard from '../components/ClubCard';
import { Link } from 'react-router-dom';

interface Club {
  id: string;
  name: string;
  description: string;
  category?: string;
}

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('No user logged in');
          return;
        }

        const user = JSON.parse(storedUser);
        const token = user.token; // Get Firebase ID token

        const response = await axios.get('http://localhost:5001/api/clubs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched clubs:', response.data); // Debugging
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId: string) => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert('Please log in to join a club.');
        return;
      }

      const user = JSON.parse(storedUser);
      const token = user.token;

      await axios.post(
        'http://localhost:5001/api/clubs/join',
        { clubId, userId: user.uid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Successfully joined the club!');
    } catch (error) {
      console.error('Error joining club:', error);
      alert('Error joining club');
    }
  };

  return (
    <div>
      <h2>Clubs</h2>
      <Link to="/create-club">
        <button>Create a New Club</button>
      </Link>
      {clubs.length === 0 ? <p>No clubs found.</p> : (
        clubs.map((club) => (
          <ClubCard
            key={club.id}
            id={club.id}
            name={club.name}
            description={club.description}
            category={club.category || 'General'}
            onJoin={handleJoinClub}
          />
        ))
      )}
    </div>
  );
};

export default Clubs;
