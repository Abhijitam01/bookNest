import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
  };
  file?: Express.Multer.File;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
      };
    }
  }
} 