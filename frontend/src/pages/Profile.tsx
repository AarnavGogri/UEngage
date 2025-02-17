// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ClubData {
  id: string;
  name: string;
  description: string;
}

interface UserData {
  userId: string;
  name: string;
  email: string;
  joinedClubs: string[];
  createdClubs: string[];
}

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<ClubData[]>([]);
  const [createdClubs, setCreatedClubs] = useState<ClubData[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventFrom, setEventFrom] = useState('');
  const [eventTo, setEventTo] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          console.error('No user logged in');
          return;
        }
        const user = JSON.parse(storedUser);
        const token = user.token;

        // Fetch user profile
        const userResponse = await axios.get(`http://localhost:5001/api/users/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(userResponse.data);

        // Fetch all clubs to map IDs to club details
        const clubsResponse = await axios.get('http://localhost:5001/api/clubs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allClubs: ClubData[] = clubsResponse.data;

        // Filter clubs based on joined and created arrays in user data
        setJoinedClubs(
          allClubs.filter((club) => userResponse.data.joinedClubs.includes(club.id))
        );
        setCreatedClubs(
          allClubs.filter((club) => userResponse.data.createdClubs.includes(club.id))
        );
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent, clubId: string) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const token = user.token;

      await axios.post(
        'http://localhost:5001/api/events',
        {
          clubId,
          eventName,
          eventDescription,
          from: eventFrom,
          to: eventTo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Event created successfully!');
      // Clear the form and hide it
      setEventName('');
      setEventDescription('');
      setEventFrom('');
      setEventTo('');
      setIsAddingEvent(null);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {userData ? (
        <>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>

          <h3>Joined Clubs</h3>
          {joinedClubs.length === 0 ? (
            <p>You haven’t joined any clubs yet.</p>
          ) : (
            <ul>
              {joinedClubs.map((club) => (
                <li key={club.id}>{club.name}</li>
              ))}
            </ul>
          )}

          <h3>Created Clubs</h3>
          {createdClubs.length === 0 ? (
            <p>You haven’t created any clubs yet.</p>
          ) : (
            createdClubs.map((club) => (
              <div key={club.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h4>{club.name}</h4>
                <p>{club.description}</p>
                {/* Button to toggle the event creation form */}
                <button onClick={() => setIsAddingEvent(club.id)}>
                  {isAddingEvent === club.id ? 'Cancel' : 'Add Event'}
                </button>

                {isAddingEvent === club.id && (
                  <form onSubmit={(e) => handleCreateEvent(e, club.id)} style={{ marginTop: '10px' }}>
                    <div>
                      <label>Event Name:</label>
                      <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>Event Description:</label>
                      <textarea
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>Start Time:</label>
                      <input
                        type="datetime-local"
                        value={eventFrom}
                        onChange={(e) => setEventFrom(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>End Time:</label>
                      <input
                        type="datetime-local"
                        value={eventTo}
                        onChange={(e) => setEventTo(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit">Save Event</button>
                  </form>
                )}
              </div>
            ))
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
