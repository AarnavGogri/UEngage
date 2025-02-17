// src/components/ClubCard.tsx
import React from 'react';

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  onJoin: (id: string) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ id, name, description, category, onJoin }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>{name} <button onClick={() => onJoin(id)}>Join</button></h3>
      <p>{description}</p>
    </div>
  );
};

export default ClubCard;
