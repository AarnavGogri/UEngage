// src/routes/clubsHandlers.ts
import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { db } from '../config/firebaseAdmin';

/**
 * GET all clubs
 * e.g. GET /api/clubs
 */
export const getAllClubs = async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('clubs').get();
    const clubs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(clubs);
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * CREATE a new club
 * e.g. POST /api/clubs
 */
export const createClub = async (req: Request, res: Response) => {
  try {
    const { name, description, userId } = req.body;
    if (!name || !description || !userId) {
      res.status(400).json({ error: 'Missing fields' });
    }

    // 1) Create club doc
    const newClubRef = await db.collection('clubs').add({
      name,
      description,
      owner: userId,
      admins: [userId],
      members: [userId],
      events: [],
      createdAt: new Date(),
    });

    // 2) Add to user's "createdClubs"
    await db.collection('users').doc(userId).update({
      createdClubs: admin.firestore.FieldValue.arrayUnion(newClubRef.id),
    });

    res.json({
      message: 'Club created successfully!',
      clubId: newClubRef.id,
    });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating club:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * JOIN a club
 * e.g. POST /api/clubs/join
 */
export const joinClub = async (req: Request, res: Response) => {
  try {
    const { clubId, userId } = req.body;
    if (!clubId || !userId) {
      res.status(400).json({ error: 'Missing clubId or userId' });
    }

    // 1) Add user to club's "members"
    await db.collection('clubs').doc(clubId).update({
      members: admin.firestore.FieldValue.arrayUnion(userId),
    });

    // 2) Add club to user's "joinedClubs"
    await db.collection('users').doc(userId).update({
      joinedClubs: admin.firestore.FieldValue.arrayUnion(clubId),
    });

    res.json({ message: 'Successfully joined the club!' });
  } catch (err) {
    const error = err as Error;
    console.error('Error joining club:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * LEAVE a club
 * e.g. POST /api/clubs/leave
 */
export const leaveClub = async (req: Request, res: Response) => {
  try {
    const { clubId, userId } = req.body;
    if (!clubId || !userId) {
      res.status(400).json({ error: 'Missing clubId or userId' });
    }

    // 1) Remove user from club's "members"
    await db.collection('clubs').doc(clubId).update({
      members: admin.firestore.FieldValue.arrayRemove(userId),
    });

    // 2) Remove club from user's "joinedClubs"
    await db.collection('users').doc(userId).update({
      joinedClubs: admin.firestore.FieldValue.arrayRemove(clubId),
    });

    res.json({ message: 'Successfully left the club!' });
  } catch (err) {
    const error = err as Error;
    console.error('Error leaving club:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * EDIT (update) a club (e.g. update description)
 * e.g. PATCH /api/clubs/:clubId
 */
export const editClub = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;
    const { description } = req.body;
    if (!description) {
      res.status(400).json({ error: 'Missing description' });
    }

    await db.collection('clubs').doc(clubId).update({ description });
    res.json({ message: 'Club updated successfully' });
  } catch (err) {
    const error = err as Error;
    console.error('Error editing club:', error);
    res.status(500).json({ error: error.message });
  }
};
