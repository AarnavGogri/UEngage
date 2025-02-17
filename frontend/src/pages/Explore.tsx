// src/pages/Explore.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Club {
  id: string;
  name: string;
  description: string;
  link: string;
  category?: string;
  similarity: number;
}

const Explore: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Retrieve token from localStorage if available
      const storedUser = localStorage.getItem('user');
      const token = storedUser ? JSON.parse(storedUser).token : "";
      
      const response = await axios.post(
        'http://localhost:5001/api/clubs/search',
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(response.data);
    } catch (error: any) {
      console.error('Error during search:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Explore UW Clubs</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search clubs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <div>
        {results.length === 0 ? (
          <p>No clubs found. Try a different query.</p>
        ) : (
          <ul>
            {results.map((club) => (
              <li key={club.id} style={{ marginBottom: '20px' }}>
                <h3>{club.name}</h3>
                <p>{club.description}</p>
                {club.link && (
                  <a href={club.link} target="_blank" rel="noopener noreferrer">
                    Visit Club Page
                  </a>
                )}
                <p>Similarity: {(club.similarity * 100).toFixed(2)}%</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Explore;
