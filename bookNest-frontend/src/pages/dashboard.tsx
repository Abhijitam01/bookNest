import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  lastOpened: Date;
}

const Dashboard = () => {
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Book[]>("/api/books/activity");
        setRecentBooks(res.data);
      } catch (err) {
        setError("Failed to fetch recent books");
        console.error("Error fetching recent books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>

        <section className="mt-6">
          <h2 className="text-xl font-semibold dark:text-white">
            Recently Opened Books
          </h2>
          {recentBooks.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              No books opened yet.{" "}
              <Link to="/books" className="text-blue-500 hover:text-blue-600">
                Browse books
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {recentBooks.map((book) => (
                <Link
                  to={`/books/${book._id}`}
                  key={book._id}
                  className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        {book.author}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                        Last opened:{" "}
                        {new Date(book.lastOpened).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
