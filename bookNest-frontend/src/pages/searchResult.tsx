import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

interface Book {
  _id: string;
  title: string;
  author: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState<Book[]>([]);

  useEffect(() => {
    if (query) {
      axios
        .get(`/api/books/search?q=${query}`)
        .then((res) => setResults(res.data));
    }
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold dark:text-white">
        Search Results for "{query}"
      </h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {results.map((book) => (
          <Link
            to={`/books/${book._id}`}
            key={book._id}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow"
          >
            <h2 className="text-lg font-semibold dark:text-white">
              {book.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              {book.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
