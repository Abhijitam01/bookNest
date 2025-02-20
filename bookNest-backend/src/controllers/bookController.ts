import { Request, Response } from "express";
import Book from "../models/bookModel";
import fetchBookData from "../utils/fetchBookData";

export const addBook = async (req: Request, res: Response) => {
  const { title } = req.body;
  const bookData = await fetchBookData(title);
  if (!bookData) return res.status(404).json({ message: "Book not found" });

  const book = new Book({ user: req.user.id, ...bookData });
  await book.save();
  res.status(201).json(book);
};

export const getBooks = async (req: Request, res: Response) => {
  const books = await Book.find({ user: req.user.id });
  res.json(books);
};

export const updateBook = async (req: Request, res: Response) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

  Object.assign(book, req.body);
  await book.save();
  res.json(book);
};
