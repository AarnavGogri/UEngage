import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken';

import {
  getAllClubs,
  createClub,
  joinClub,
  leaveClub,
  editClub,
} from './clubsHandlers';

const clubsRouter = Router();

clubsRouter.get('/', verifyFirebaseToken, getAllClubs);
clubsRouter.post('/', verifyFirebaseToken, createClub);
clubsRouter.post('/join', verifyFirebaseToken, joinClub);
clubsRouter.post('/leave', verifyFirebaseToken, leaveClub);
clubsRouter.patch('/:clubId', verifyFirebaseToken, editClub);

export default clubsRouter;