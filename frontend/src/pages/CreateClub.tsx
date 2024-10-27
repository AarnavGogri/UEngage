// src/pages/CreateClub.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CreateClub: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !category) { // Check if category is filled
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Add a new club document to Firestore
      const clubRef = await addDoc(collection(db, 'clubs'), {
        name,
        description,
        category, // Include category in the Firestore document
        owner: currentUser?.uid,
        admins: [currentUser?.uid],
        members: [currentUser?.uid],
        createdAt: Timestamp.now(),
      });

      alert('Club created successfully!');
      navigate(`/clubs`); // Redirect to Clubs page
    } catch (error: any) {
      console.error('Error creating club:', error);
      alert(`Error creating club: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Create Club</h2>
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
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)} // Update category state
            required
          />
        </div>
        <button type="submit">Create Club</button>
      </form>
    </div>
  );
};

export default CreateClub;
