// src/routes/usersRouter.ts
import { Router } from 'express';
import {
  createUserDoc,
  getUserDoc,
  updateUserDoc,
  deleteUserDoc,
} from './usersHandlers'; // or '../routes/usersHandlers'
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken';

const usersRouter = Router();

// For creation, you might require a valid token if you want to protect it
usersRouter.post('/', verifyFirebaseToken, createUserDoc);

// Getting user info can be public or protected
usersRouter.get('/:userId', verifyFirebaseToken, getUserDoc);

usersRouter.patch('/:userId', verifyFirebaseToken, updateUserDoc);
usersRouter.delete('/:userId', verifyFirebaseToken, deleteUserDoc);

export default usersRouter;
