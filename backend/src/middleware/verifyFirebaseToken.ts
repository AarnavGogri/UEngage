import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebaseAdmin';

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return; // Ensure Express does not continue
    }

    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = decodedToken;
    
    next(); // Continue to the next middleware/handler
  } catch (error) {
    console.error('Firebase Token Verification Failed:', error);
    res.status(401).json({ error: 'Invalid token' });
    return; // Ensure Express does not continue
  }
};
