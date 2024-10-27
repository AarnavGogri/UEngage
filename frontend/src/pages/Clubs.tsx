// src/pages/Clubs.tsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import ClubCard from '../components/ClubCard';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Clubs: React.FC = () => {
  const [clubs, setClubs] = useState<DocumentData[]>([]);
  const { currentUser } = useAuth();

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

  const handleJoinClub = async (clubId: string) => {
    if (!currentUser) {
      alert('Please log in to join a club.');
      return;
    }

    try {
      // Update club's members
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, {
        members: arrayUnion(currentUser.uid),
      });

      // Update user's joined clubs
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        joinedClubs: arrayUnion(clubId),
      });

      alert('Successfully joined the club!');
    } catch (error: any) {
      console.error('Error joining club:', error);
      alert(`Error joining club: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Clubs</h2>
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
