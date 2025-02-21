import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";

const AddBook = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.get(`${GOOGLE_BOOKS_API}${title}`);
      setBooks(res.data.items || []);
    } catch (err) {
      setError("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book: any) => {
    setLoading(true);
    try {
      const bookData = {
        title: book.volumeInfo.title,
        author: book.volumeInfo.authors?.[0] || "Unknown",
        coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
        userId: user?.id,
      };
      const res = await axios.post("/api/books", bookData);
      navigate(`/book/${res.data._id}`);
    } catch (err) {
      setError("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold dark:text-white">Add a New Book</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex space-x-2 mt-4">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Book Name" className="flex-grow p-2 border rounded dark:bg-gray-700 dark:text-white"/>
        <button onClick={handleSearch} className="bg-blue-500 text-white py-2 px-4 rounded" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
            <img src={book.volumeInfo.imageLinks?.thumbnail || ""} alt={book.volumeInfo.title} className="h-40 w-full object-cover rounded"/>
            <h3 className="text-lg font-semibold dark:text-white mt-2">{book.volumeInfo.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{book.volumeInfo.authors?.[0] || "Unknown"}</p>
            <button onClick={() => handleAddBook(book)} className="bg-green-500 text-white py-1 px-3 rounded mt-2 w-full">
              Add to Library
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddBook;
