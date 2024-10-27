// src/components/ClubCard.tsx

import React from 'react';

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  onJoin: (clubId: string) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ id, name, description, category, onJoin }) => (
  <div>
    <h3>{name}</h3>
    <p>{description}</p>
    <p>Category: {category}</p>
    <button onClick={() => onJoin(id)}>Join Club</button>
  </div>
);

export default ClubCard;
