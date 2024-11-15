// src/components/ClubCard.tsx

// src/components/ClubCard.tsx

import React from 'react';
import './ClubCard.css'; // Import the CSS file

interface ClubCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  onJoin: (clubId: string) => void;
}

const ClubCard: React.FC<ClubCardProps> = ({ id, name, description, category, onJoin }) => (
  <div className="club-card">
    <div className="club-card-image">
      {/* Placeholder for club image */}
      <img src="/path/to/club-image.jpg" alt={`${name} Logo`} />
    </div>
    <div className="club-card-content">
      <h3 className="club-card-title">{name}</h3>
      <p className="club-card-description">{description}</p>
      <p className="club-card-category">Category: {category}</p>
      <button className="join-button" onClick={() => onJoin(id)}>
        Join Club
      </button>
    </div>
  </div>
);

export default ClubCard;

// import React from 'react';

// interface ClubCardProps {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   onJoin: (clubId: string) => void;
// }

// const ClubCard: React.FC<ClubCardProps> = ({ id, name, description, category, onJoin }) => (
//   <div>
//     <h3>{name}</h3>
//     <p>{description}</p>
//     <p>Category: {category}</p>
//     <button onClick={() => onJoin(id)}>Join Club</button>
//   </div>
// );

// export default ClubCard;
