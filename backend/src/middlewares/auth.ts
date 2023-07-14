import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Middleware pour vérifier l'authentification Session
export const authenticateSession = async (req: Request, res: Response, next: NextFunction) => {
  const authenticatedUserId = req.session.userId
  
  if (authenticatedUserId) {
    const user = await User.findById(authenticatedUserId).select("+email").exec()
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
