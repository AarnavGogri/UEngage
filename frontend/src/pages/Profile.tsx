// Profile.tsx
import React, { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  // getDocs,
  // query,
  // where,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface ClubData {
  id: string;
  name: string;
  description: string;
  events: string[]; // Array of event IDs
}

interface EventData {
  id: string;
  eventName: string;
  eventDescription: string;
  from: Date;
  to: Date;
}

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [createdClubs, setCreatedClubs] = useState<ClubData[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<ClubData[]>([]);
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [isCreatingEvent, setIsCreatingEvent] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [events, setEvents] = useState<{ [key: string]: EventData[] }>({}); // Events by club ID
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserClubs = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (!userData) {
          console.error('No user data found.');
          return;
        }

        const createdClubIds = userData.createdClubs || [];
        const joinedClubIds = userData.joinedClubs || [];

        // Fetch created clubs and their events
        if (createdClubIds.length > 0) {
          const createdClubsList: ClubData[] = [];
          for (const clubId of createdClubIds) {
            const clubDoc = await getDoc(doc(db, 'clubs', clubId));
            if (clubDoc.exists()) {
              const clubData = clubDoc.data();
              const club: ClubData = {
                id: clubDoc.id,
                name: clubData?.name,
                description: clubData?.description,
                events: clubData?.events || [],
              };

              // Fetch events for the club
              const eventsIds = club.events || [];
              if (eventsIds.length > 0) {
                const clubEvents: EventData[] = [];
                for (const eventId of eventsIds) {
                  const eventDoc = await getDoc(doc(db, 'events', eventId));
                  if (eventDoc.exists()) {
                    const eventData = eventDoc.data();
                    clubEvents.push({
                      id: eventDoc.id,
                      eventName: eventData?.eventName,
                      eventDescription: eventData?.eventDescription,
                      from: eventData?.from.toDate(),
                      to: eventData?.to.toDate(),
                    });
                  }
                }
                setEvents((prevEvents) => ({
                  ...prevEvents,
                  [club.id]: clubEvents,
                }));
              }

              createdClubsList.push(club);
            }
          }
          setCreatedClubs(createdClubsList);
        }

        // Fetch joined clubs
        if (joinedClubIds.length > 0) {
          const joinedClubsList: ClubData[] = [];
          for (const clubId of joinedClubIds) {
            const clubDoc = await getDoc(doc(db, 'clubs', clubId));
            if (clubDoc.exists()) {
              const clubData = clubDoc.data();
              joinedClubsList.push({
                id: clubDoc.id,
                name: clubData?.name,
                description: clubData?.description,
                events: clubData?.events || [],
              });
            }
          }
          setJoinedClubs(joinedClubsList);
        }
      } catch (error) {
        console.error('Error fetching user clubs:', error);
      }
    };

    fetchUserClubs();
  }, [currentUser]);

  const handleEditClub = (clubId: string, description: string) => {
    setEditingClubId(clubId);
    setEditedDescription(description);
  };

  const handleSaveDescription = async (clubId: string) => {
    try {
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, { description: editedDescription });
      setCreatedClubs((prev) =>
        prev.map((club) =>
          club.id === clubId ? { ...club, description: editedDescription } : club
        )
      );
      setEditingClubId(null);
    } catch (error) {
      console.error('Error updating club description:', error);
    }
  };

  const handleCreateEvent = async (clubId: string) => {
    try {
      const eventRef = await addDoc(collection(db, 'events'), {
        eventName,
        eventDescription,
        from: Timestamp.fromDate(new Date(eventStart)),
        to: Timestamp.fromDate(new Date(eventEnd)),
        clubs: [clubId],
      });
      await updateDoc(doc(db, 'clubs', clubId), {
        events: arrayUnion(eventRef.id),
      });
      setEvents((prevEvents) => ({
        ...prevEvents,
        [clubId]: [
          ...(prevEvents[clubId] || []),
          {
            id: eventRef.id,
            eventName,
            eventDescription,
            from: new Date(eventStart),
            to: new Date(eventEnd),
          },
        ],
      }));
      setIsCreatingEvent(null);
      setEventName('');
      setEventDescription('');
      setEventStart('');
      setEventEnd('');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = (
    eventId: string,
    clubId: string,
    event: EventData
  ) => {
    setEditingEventId(eventId);
    setEventName(event.eventName);
    setEventDescription(event.eventDescription);
    setEventStart(event.from.toISOString().slice(0, 16)); // Format for datetime-local input
    setEventEnd(event.to.toISOString().slice(0, 16));
  };

  const handleSaveEvent = async (eventId: string, clubId: string) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        eventName,
        eventDescription,
        from: Timestamp.fromDate(new Date(eventStart)),
        to: Timestamp.fromDate(new Date(eventEnd)),
      });

      setEvents((prevEvents) => ({
        ...prevEvents,
        [clubId]: prevEvents[clubId].map((event) =>
          event.id === eventId
            ? {
                ...event,
                eventName,
                eventDescription,
                from: new Date(eventStart),
                to: new Date(eventEnd),
              }
            : event
        ),
      }));
      setEditingEventId(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string, clubId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      await updateDoc(doc(db, 'clubs', clubId), {
        events: arrayRemove(eventId),
      });
      setEvents((prevEvents) => ({
        ...prevEvents,
        [clubId]: prevEvents[clubId].filter((event) => event.id !== eventId),
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        joinedClubs: arrayRemove(clubId),
      });

      // Update the local state to reflect the change
      setJoinedClubs((prev) => prev.filter((club) => club.id !== clubId));
    } catch (error) {
      console.error('Error leaving club:', error);
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>

      <h3>Created Clubs</h3>
      {createdClubs.length === 0 ? (
        <p>You haven’t created any clubs yet.</p>
      ) : (
        <ul>
          {createdClubs.map((club) => (
            <li key={club.id}>
              <h4>{club.name}</h4>
              {editingClubId === club.id ? (
                <input
                  type="text"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />
              ) : (
                <p>{club.description}</p>
              )}
              {editingClubId === club.id ? (
                <button onClick={() => handleSaveDescription(club.id)}>
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEditClub(club.id, club.description)}
                >
                  Edit
                </button>
              )}
              <button onClick={() => setIsCreatingEvent(club.id)}>
                Create Event
              </button>
              {isCreatingEvent === club.id && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateEvent(club.id);
                  }}
                >
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
                      value={eventStart}
                      onChange={(e) => setEventStart(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>End Time:</label>
                    <input
                      type="datetime-local"
                      value={eventEnd}
                      onChange={(e) => setEventEnd(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit">Save Event</button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingEvent(null)}
                  >
                    Cancel
                  </button>
                </form>
              )}
              <h5>Events</h5>
              <ul>
                {(events[club.id] || []).map((event) => (
                  <li key={event.id}>
                    {editingEventId === event.id ? (
                      <>
                        <div>
                          <label>Event Name:</label>
                          <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Event Description:</label>
                          <textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>Start Time:</label>
                          <input
                            type="datetime-local"
                            value={eventStart}
                            onChange={(e) => setEventStart(e.target.value)}
                          />
                        </div>
                        <div>
                          <label>End Time:</label>
                          <input
                            type="datetime-local"
                            value={eventEnd}
                            onChange={(e) => setEventEnd(e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => handleSaveEvent(event.id, club.id)}
                        >
                          Save
                        </button>
                        <button onClick={() => setEditingEventId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <h6>{event.eventName}</h6>
                        <p>{event.eventDescription}</p>
                        <p>From: {event.from.toLocaleString()}</p>
                        <p>To: {event.to.toLocaleString()}</p>
                        <button
                          onClick={() =>
                            handleEditEvent(event.id, club.id, event)
                          }
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, club.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <h3>Joined Clubs</h3>
      {joinedClubs.length === 0 ? (
        <p>You haven’t joined any clubs yet.</p>
      ) : (
        <ul>
          {joinedClubs.map((club) => (
            <li key={club.id}>
              <h4>{club.name}</h4>
              <p>{club.description}</p>
              <button onClick={() => handleLeaveClub(club.id)}>
                Leave Club
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
