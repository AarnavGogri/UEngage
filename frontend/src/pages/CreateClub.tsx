import React, { useState } from 'react';
import axios from 'axios';

const CreateClub: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('Please log in to create a club.');
      return;
    }

    const user = JSON.parse(storedUser);
    const token = user.token;

    try {
      await axios.post(
        'http://localhost:5001/api/clubs',
        { name, description, userId: user.uid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Club created successfully!');
    } catch (error) {
      console.error('Error creating club:', error);
      alert('Error creating club');
    }
  };

  return (
    <div>
      <h2>Create Club</h2>
      <form onSubmit={handleCreateClub}>
        <input type="text" placeholder="Club Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateClub;
