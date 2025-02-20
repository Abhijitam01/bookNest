import express from "express";
import { addBook, getBooks, updateBook } from "../controllers/bookController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();
router.post("/", authMiddleware, addBook);
router.get("/", authMiddleware, getBooks);
router.put("/:id", authMiddleware, updateBook);

export default router;
