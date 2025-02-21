import { Link } from 'react-router-dom';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  status?: string;
}

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link to={`/books/${book._id}`}>
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow transition-all duration-200 hover:scale-105 hover:shadow-lg">
        {book.coverImage && (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-48 object-cover rounded mb-3"
          />
        )}
        <h2 className="text-lg font-semibold dark:text-white line-clamp-1">
          {book.title}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-1">
          {book.author}
        </p>
        {book.status && (
          <span className="mt-2 inline-block px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
            {book.status}
          </span>
        )}
      </div>
    </Link>
  );
};

export default BookCard;
