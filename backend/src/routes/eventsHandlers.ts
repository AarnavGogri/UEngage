// src/routes/eventsHandlers.ts
import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { db } from '../config/firebaseAdmin';

/**
 * CREATE an event
 * e.g. POST /api/events
 */
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { clubId, eventName, eventDescription, from, to } = req.body;
    if (!clubId || !eventName || !from || !to) {
      res.status(400).json({ error: 'Missing required fields' });
    }

    // 1) Create the event doc
    const eventRef = await db.collection('events').add({
      eventName,
      eventDescription: eventDescription || '',
      from: new Date(from), // parse string -> Date
      to: new Date(to),
      clubs: [clubId],
      createdAt: new Date(),
    });

    // 2) Add event ID to the club doc
    await db.collection('clubs').doc(clubId).update({
      events: admin.firestore.FieldValue.arrayUnion(eventRef.id),
    });

    res.json({
      message: 'Event created successfully!',
      eventId: eventRef.id,
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating event:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * EDIT event
 * e.g. PATCH /api/events/:eventId
 */
export const editEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const { eventName, eventDescription, from, to } = req.body;
    if (!eventId) {
      res.status(400).json({ error: 'Missing eventId in params' });
    }

    const updateData: Record<string, unknown> = {};
    if (eventName !== undefined) updateData.eventName = eventName;
    if (eventDescription !== undefined) updateData.eventDescription = eventDescription;
    if (from !== undefined) updateData.from = new Date(from);
    if (to !== undefined) updateData.to = new Date(to);

    await db.collection('events').doc(eventId).update(updateData);
    res.json({ message: 'Event updated successfully!' });
  } catch (err) {
    const error = err as Error;
    console.error('Error editing event:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE event
 * e.g. DELETE /api/events/:eventId
 */
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      res.status(400).json({ error: 'Missing eventId in params' });
    }

    // 1) Find the event doc
    const eventDoc = await db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
       res.status(404).json({ error: 'Event not found' });
    }
    const eventData = eventDoc.data() || {};
    const clubs = eventData.clubs || [];

    // 2) Remove this event from each club’s "events" array
    for (const cId of clubs) {
      await db.collection('clubs').doc(cId).update({
        events: admin.firestore.FieldValue.arrayRemove(eventId),
      });
    }

    // 3) Delete the event doc
    await db.collection('events').doc(eventId).delete();

    res.json({ message: 'Event deleted successfully!' });
  } catch (err) {
    const error = err as Error;
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET events for a user’s joined clubs
 * e.g. GET /api/events/joined/:userId
 */
export const getEventsForUserClubs = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Missing userId in params' });
    }

    // 1) Get user doc
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
    }
    const userData = userDoc.data() || {};
    const joinedClubs = userData.joinedClubs || [];

    const results: Array<{
      clubId: string;
      clubName: string;
      events: any[];
    }> = [];

    // 2) For each joined club, get that club doc & events
    for (const clubId of joinedClubs) {
      const cDoc = await db.collection('clubs').doc(clubId).get();
      if (!cDoc.exists) continue;
      const cData = cDoc.data() || {};
      const clubName = cData.name || 'Unnamed Club';
      const clubEvents = cData.events || [];

      // 3) Fetch actual event docs
      if (Array.isArray(clubEvents) && clubEvents.length > 0) {
        const eventSnapshots = await db
          .collection('events')
          .where(admin.firestore.FieldPath.documentId(), 'in', clubEvents)
          .get();

        const eventList = eventSnapshots.docs.map(ev => ({
          id: ev.id,
          ...ev.data(),
        }));
        results.push({ clubId, clubName, events: eventList });
      } else {
        // No events
        results.push({ clubId, clubName, events: [] });
      }
    }

    res.json(results);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching events for joined clubs:', error);
    res.status(500).json({ error: error.message });
  }
};
