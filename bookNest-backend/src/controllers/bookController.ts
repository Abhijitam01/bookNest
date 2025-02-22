import { Response } from "express";
import Book from "../models/book";
import { AuthRequest } from "../types/custom";

// Add a new book
export const addBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const book = new Book({
      title,
      author,
      user: req.user._id, // Ensure TypeScript recognizes `req.user`
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

// Get books
export const getBooks = async (req: AuthRequest, res: Response) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Update book
export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author } = req.body;
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, author },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
};
