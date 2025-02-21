import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import useAuth  from "../hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <Link
        to="/"
        className="text-xl font-bold dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
      >
        BookNest
      </Link>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-6">
        <input
          type="search"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md border dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </form>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex space-x-4">
          <Link
            to="/books"
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            Books
          </Link>
          <Link
            to="/authors"
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
          >
            Authors
          </Link>
          {user && (
            <Link
              to="/my-library"
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              My Library
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DarkModeToggle />
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
