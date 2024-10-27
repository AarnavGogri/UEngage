// src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJoinedClubs = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const clubIds = userData.joinedClubs || [];

            if (clubIds.length > 0) {
              const clubsRef = collection(db, 'clubs');
              const q = query(clubsRef, where('__name__', 'in', clubIds));
              const clubsSnap = await getDocs(q);
              const clubsData = clubsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
              setJoinedClubs(clubsData);
            }
          }
        } catch (error: any) {
          console.error('Error fetching joined clubs:', error);
          alert(`Error fetching joined clubs: ${error.message}`);
        }
      }
    };

    fetchJoinedClubs();
  }, [currentUser]);

  return (
    <div>
      <h2>{currentUser?.displayName || 'User'}'s Profile</h2>
      <p>Email: {currentUser?.email}</p>
      <h3>Joined Clubs</h3>
      {joinedClubs.length > 0 ? (
        joinedClubs.map((club) => (
          <div key={club.id}>
            <h4>{club.name}</h4>
            <p>{club.description}</p>
          </div>
        ))
      ) : (
        <p>You haven't joined any clubs yet.</p>
      )}
    </div>
  );
};

export default Profile;
