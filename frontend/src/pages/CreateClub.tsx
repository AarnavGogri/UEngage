import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CreateClub: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!currentUser || !currentUser.uid) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      // Step 1: Add a new club document to Firestore
      const clubRef = await addDoc(collection(db, 'clubs'), {
        name,
        description,
        owner: currentUser.uid,
        admins: [currentUser.uid],
        members: [currentUser.uid],
        createdAt: Timestamp.now(),
      });

      // Step 2: Add the created club's ID to the user's 'createdClubs' field
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        createdClubs: arrayUnion(clubRef.id),
      });

      alert('Club created successfully!');
      navigate(`/clubs`); // Redirect to Clubs page or any other page as needed
    } catch (error: any) {
      console.error('Error creating club:', error);
      alert(`Error creating club: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Add Club</h2>
      <form onSubmit={handleCreateClub}>
        <div>
          <label>Club Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Club</button>
      </form>
    </div>
  );
};

export default CreateClub;
