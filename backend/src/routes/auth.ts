import express from 'express';
import { db } from '../config/firebaseAdmin';

const authRouter = express.Router();

authRouter.post('/create-user', async (req, res) => {
  try {
    const { uid, name, email } = req.body;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const newUser = { name, email, joinedClubs: [] };
      await userRef.set(newUser);
      res.status(201).json({ id: uid, ...newUser });
    } else {
      res.json({ message: 'User already exists' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

export default authRouter;
