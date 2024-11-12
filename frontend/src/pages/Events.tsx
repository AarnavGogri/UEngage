import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface EventData {
  id: string;
  eventName: string;
  eventDescription: string;
  from: Date;
  to: Date;
}

interface ClubEvents {
  clubName: string;
  events: EventData[];
}

const Events: React.FC = () => {
  const [clubEvents, setClubEvents] = useState<ClubEvents[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) return;

      try {
        // Step 1: Fetch user's joined clubs
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        if (!userData || !userData.joinedClubs) {
          console.error('No joined clubs found for the user.');
          return;
        }

        const joinedClubs = userData.joinedClubs;

        // Step 2: Fetch events for each club and include the club name
        const clubEventsList: ClubEvents[] = [];

        for (const clubId of joinedClubs) {
          // Fetch the club document to get the club name
          const clubDoc = await getDoc(doc(db, 'clubs', clubId));
          const clubData = clubDoc.data();

          if (clubData && clubData.events) {
            // Query events in the events array of the club
            const eventsQuery = query(
              collection(db, 'events'),
              where('__name__', 'in', clubData.events.slice(0, 10)) // Limit to 10 events per club
            );
            const eventsSnapshot = await getDocs(eventsQuery);

            const eventsList = eventsSnapshot.docs.map((eventDoc) => ({
              id: eventDoc.id,
              eventName: eventDoc.data().eventName,
              eventDescription: eventDoc.data().eventDescription,
              from: eventDoc.data().from.toDate(),
              to: eventDoc.data().to.toDate(),
            }));

            clubEventsList.push({
              clubName: clubData.name,
              events: eventsList,
            });
          }
        }

        setClubEvents(clubEventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentUser]);

  return (
    <div>
      <h2>Upcoming Events</h2>
      {clubEvents.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <div>
          {clubEvents.map((club) => (
            <div key={club.clubName}>
              <h3>{club.clubName}</h3>
              <ul>
                {club.events.map((event) => (
                  <li key={event.id}>
                    <h4>{event.eventName}</h4>
                    <p>{event.eventDescription}</p>
                    <p>
                        From: {event.from.toLocaleString()} 
                    </p>
                    <p>
                        To: {event.to.toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
