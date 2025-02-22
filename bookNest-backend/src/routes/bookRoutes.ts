import express from "express";
import { addBook, getBooks, updateBook } from "../controllers/bookController";
import authMiddleware from "../middlewares/authMiddleware";
import { AuthRequest } from "../types/custom";
import { Response, NextFunction } from "express";

const router = express.Router();

// Improve type safety and error handling in the wrapper
const asyncHandler =
  (
    handler: (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => Promise<any>
  ) =>
  (req: express.Request, res: Response, next: NextFunction): void => {
    Promise.resolve(handler(req as AuthRequest, res, next)).catch(next);
  };

router.post("/", authMiddleware, asyncHandler(addBook));
router.get("/", authMiddleware, asyncHandler(getBooks));
router.put("/:id", authMiddleware, asyncHandler(updateBook));

export default router;
