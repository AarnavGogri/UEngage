import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface EventData {
  id: string;
  eventName: string;
  eventDescription: string;
  from: any; // Can be Firestore Timestamp or ISO string
  to: any;
}

interface ClubEvents {
  clubId: string;
  clubName: string;
  events: EventData[];
}

const Events: React.FC = () => {
  const [clubEvents, setClubEvents] = useState<ClubEvents[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('Please log in to view events.');
      navigate('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    fetchEvents(user.uid, user.token);
  }, [navigate]);

  const fetchEvents = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/events/joined/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Events response:', response.data);
      setClubEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  /**
   * ✅ Converts Firestore Timestamps (_seconds) and normal date strings to readable format
   */
  const formatDate = (date: any): string => {
    if (!date) return 'No date provided';

    // Handle Firestore Timestamp (_seconds format)
    if (date._seconds) {
      return new Date(date._seconds * 1000).toLocaleString();
    }

    // Handle standard ISO date strings
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleString();
  };

  return (
    <div>
      <h2>Events</h2>
      {clubEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        clubEvents.map((club) => (
          <div key={club.clubId} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{club.clubName}</h3>
            {club.events.length === 0 ? (
              <p>No events in this club.</p>
            ) : (
              <ul>
                {club.events.map((event) => (
                  <li key={event.id} style={{ marginBottom: '10px' }}>
                    <h4>{event.eventName}</h4>
                    <p>{event.eventDescription}</p>
                    <p><strong>From:</strong> {formatDate(event.from)}</p>
                    <p><strong>To:</strong> {formatDate(event.to)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Events;
