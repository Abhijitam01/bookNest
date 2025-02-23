import { Request } from "express";

export interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
  };
  file?: Express.Multer.File;
}

export interface AuthRequest extends Request {
  user: {
    _id: string;
    email: string;
  };
} 