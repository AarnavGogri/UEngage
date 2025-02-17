// src/routes/clubsSearch.ts
import { Router, Request, Response } from 'express';
import axios from 'axios';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken';

const router = Router();

router.post('/search', verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }
  
  try {
    // Call the FastAPI microservice on port 5002
    const response = await axios.post('http://localhost:5002/search', { query });
    res.json(response.data);
  } catch (error: any) {
    console.error('Error during club search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
