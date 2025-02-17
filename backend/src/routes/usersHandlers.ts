// src/routes/usersHandlers.ts
import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { db } from '../config/firebaseAdmin';

/**
 * CREATE or init a user doc
 * e.g. POST /api/users
 */
export const createUserDoc = async (req: Request, res: Response) => {
  try {
    const { userId, name, email } = req.body;
    if (!userId || !name || !email) {
      res.status(400).json({ error: 'Missing required fields: userId, name, email' });
    }

    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create new doc with empty arrays
      await userRef.set({
        name,
        email,
        createdClubs: [],
        joinedClubs: [],
      });
      res.json({ message: 'User doc created', userId });
    } else {
      // Already exists; optionally update or just say “exists”
      res.json({ message: 'User already exists', userId });
    }
  } catch (err) {
    const error = err as Error;
    console.error('Error creating user doc:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET user doc (with optional expanded clubs)
 * e.g. GET /api/users/:userId
 */
export const getUserDoc = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Missing userId in params' });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data() || {};
    // userData: { name, email, joinedClubs: [], createdClubs: [] }

    res.json({ userId, ...userData });
  } catch (err) {
    const error = err as Error;
    console.error('Error fetching user doc:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE user doc
 * e.g. PATCH /api/users/:userId
 */
export const updateUserDoc = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Missing userId in params' });
    }

    // Suppose we allow updating name or email
    const { name, email } = req.body;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ error: 'No fields to update' });
    }

    await db.collection('users').doc(userId).update(updateData);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    const error = err as Error;
    console.error('Error updating user doc:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE user doc
 * e.g. DELETE /api/users/:userId
 */
export const deleteUserDoc = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: 'Missing userId in params' });
    }

    // (Optional) Remove them from joinedClubs in each club, etc.
    // For now, just delete the doc.
    await db.collection('users').doc(userId).delete();
    res.json({ message: `User ${userId} deleted` });
  } catch (err) {
    const error = err as Error;
    console.error('Error deleting user doc:', error);
    res.status(500).json({ error: error.message });
  }
};
