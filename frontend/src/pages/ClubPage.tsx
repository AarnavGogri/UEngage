// src/pages/ClubPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ClubPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [club, setClub] = useState<any>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const clubRef = doc(db, 'clubs', clubId!);
        const snapshot = await getDoc(clubRef);
        if (snapshot.exists()) {
          setClub(snapshot.data());
        } else {
          console.error('Club not found');
        }
      } catch (error: any) {
        console.error('Error fetching club:', error);
      }
    };

    fetchClub();
  }, [clubId]);

  if (!club) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      {/* Additional club details */}
    </div>
  );
};

export default ClubPage;
