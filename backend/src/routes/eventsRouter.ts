// src/routes/eventsRouter.ts
import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken';

import {
  createEvent,
  editEvent,
  deleteEvent,
  getEventsForUserClubs,
} from './eventsHandlers';

const eventsRouter = Router();

eventsRouter.post('/', verifyFirebaseToken, createEvent);
eventsRouter.patch('/:eventId', verifyFirebaseToken, editEvent);
eventsRouter.delete('/:eventId', verifyFirebaseToken, deleteEvent);
eventsRouter.get('/joined/:userId', verifyFirebaseToken, getEventsForUserClubs);

export default eventsRouter;