import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Library = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get("/api/books");
      setBooks(res.data);
    };
    fetchBooks();
  }, []);

  const filteredBooks = filter ? books.filter((b) => b.status === filter) : books;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold dark:text-white">Your Library</h1>

        {/* Filter Dropdown */}
        <select onChange={(e) => setFilter(e.target.value)} value={filter}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white w-full mt-4">
          <option value="">All</option>
          <option value="unread">Unread</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
          <option value="wishlist">Wishlist</option>
          <option value="purchased">Purchased</option>
        </select>

        {/* Book List */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {filteredBooks.map((book) => (
            <Link to={`/books/${book._id}`} key={book._id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow flex items-center space-x-4">
              <img src={book.coverImage} alt={book.title} className="h-16 w-12 object-cover rounded"/>
              <div>
                <h2 className="text-lg font-semibold dark:text-white">{book.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">{book.author}</p>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-1 inline-block">
                  {book.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;
