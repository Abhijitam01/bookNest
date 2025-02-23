import express, { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import Book from "../models/book";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import authMiddleware from "../middlewares/authMiddleware";
import { AuthRequest } from "../types/custom";

// Configure environment variables
dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "book-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  } as any,
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const router = express.Router();

// Create a type for the request handler
type RequestHandler = (
  req: Request & { user: { _id: string; email: string } },
  res: Response
) => Promise<void>;

// Get all books
router.get("/", async (req: Request, res: Response) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get book statistics
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await Book.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const formattedStats = stats.reduce((acc: Record<string, number>, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Get single book
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a note to a book
router.post("/:id/notes", authMiddleware, async (req, res: Response) => {
  const { user } = req as AuthRequest;

  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    book.notes.push({
      text: note,
      createdAt: new Date(),
    });

    await book.save();
    res.json({ notes: book.notes });
  } catch (error) {
    res.status(500).json({ error: "Failed to add note" });
  }
});

// Add a bookmark to a book
router.post("/:id/bookmark", authMiddleware, async (req, res: Response) => {
  const { user } = req as AuthRequest;

  try {
    const { page } = req.body;
    if (!page) {
      return res.status(400).json({ error: "Page number is required" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (!book.bookmarks.some((bookmark) => bookmark.page === page)) {
      book.bookmarks.push({
        page,
        createdAt: new Date(),
      });
      await book.save();
    }

    res.json({ bookmarks: book.bookmarks });
  } catch (error) {
    res.status(500).json({ error: "Failed to add bookmark" });
  }
});

// Upload image URL
router.post(
  "/:id/images",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "Image URL is required" });
      }

      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      book.images.push({ url, createdAt: new Date() });
      await book.save();
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to add image URL" });
    }
  }
);

// Upload image file
// Upload image file
router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("image"),
  async (req, res: Response) => {
    const { user } = req as AuthRequest;
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      book.images.push({
        url: req.file.path,
        createdAt: new Date(),
      });

      await book.save();
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload image" });
    }
  }
);

// Delete a book
router.delete("/:id", authMiddleware, async (req, res: Response) => {
  const { user } = req as AuthRequest;
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// Search for books
router.get("/search", async (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) return res.json([]);

  const books = await Book.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { author: { $regex: query, $options: "i" } },
    ],
  });

  res.json(books);
});

// Get comments for a book
router.get("/:id/comments", async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "username",
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book.comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a comment to a book
router.post(
  "/:id/comments",
  authMiddleware,
  async (req, res: Response) => {
    const { user } = req as AuthRequest;
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Comment text is required" });
      }

      const comment = {
        text,
        user: user._id,
        createdAt: new Date(),
      };

      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      book.comments.push(comment);
      await book.save();

      const populatedComment = await Book.populate(comment, {
        path: "user",
        select: "username",
      });

      res.json(populatedComment);
    } catch (error) {
      res.status(500).json({ error: "Failed to add comment" });
    }
  }
);

export default router;
