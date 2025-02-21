import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookComments from "../components/bookComments";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  status: string;
  notes: Array<{ text: string; createdAt: Date }>;
  images: Array<{ url: string; createdAt: Date }>;
  bookmarks: Array<{ page: string; note: string; createdAt: Date }>;
}

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newBookmark, setNewBookmark] = useState({ page: "", note: "" });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };
    fetchBook();
  }, [id]);

  const addNote = async () => {
    try {
      if (!newNote.trim()) return;
      const res = await axios.post(`/api/books/${id}/notes`, { text: newNote });
      setBook(res.data);
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const uploadImage = async () => {
    try {
      if (!newImage.trim()) return;
      const res = await axios.post(`/api/books/${id}/images`, {
        url: newImage,
      });
      setBook(res.data);
      setNewImage("");
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(`/api/books/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBook(res.data);
    } catch (error) {
      console.error("Failed to upload file:", error);
    }
  };

  const addBookmark = async () => {
    try {
      if (!newBookmark.page) return;
      const res = await axios.post(`/api/books/${id}/bookmarks`, newBookmark);
      setBook(res.data);
      setNewBookmark({ page: "", note: "" });
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const res = await axios.put(`/api/books/${id}`, { status });
      setBook(res.data);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return book ? (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-64 object-cover rounded"
        />
        <h1 className="text-3xl font-bold mt-4 dark:text-white">
          {book.title}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          By {book.author}
        </p>

        {/* Status Section */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold dark:text-white">Status</h2>
          <select
            value={book.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white w-full mt-2"
          >
            <option value="unread">Unread</option>
            <option value="reading">Reading</option>
            <option value="read">Read</option>
            <option value="wishlist">Wishlist</option>
            <option value="purchased">Purchased</option>
          </select>
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold dark:text-white">Notes</h2>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mt-2"
          />
          <button
            onClick={addNote}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
          >
            Add Note
          </button>
          <ul className="mt-4 space-y-2">
            {book.notes.map((note, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {note.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Images Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold dark:text-white">Images</h2>
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="Paste image URL"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mt-2"
          />
          <button
            onClick={uploadImage}
            className="bg-green-500 text-white py-2 px-4 rounded mt-2"
          >
            Add Image URL
          </button>
          <input
            type="file"
            onChange={uploadFile}
            accept="image/*"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mt-2"
          />
          <div className="grid grid-cols-3 gap-2 mt-2">
            {book.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt="Book"
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* Bookmarks Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold dark:text-white">Bookmarks</h2>
          <input
            type="number"
            value={newBookmark.page}
            onChange={(e) =>
              setNewBookmark({ ...newBookmark, page: e.target.value })
            }
            placeholder="Page number"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mt-2"
          />
          <input
            type="text"
            value={newBookmark.note}
            onChange={(e) =>
              setNewBookmark({ ...newBookmark, note: e.target.value })
            }
            placeholder="Add a note (optional)"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mt-2"
          />
          <button
            onClick={addBookmark}
            className="bg-yellow-500 text-white py-2 px-4 rounded mt-2"
          >
            Add Bookmark
          </button>
          <ul className="mt-4 space-y-2">
            {book.bookmarks.map((bookmark, index) => (
              <li
                key={index}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded"
              >
                Page {bookmark.page}: {bookmark.note}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <BookComments bookId={id!} />
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center dark:text-white">Loading...</p>
  );
};

export default BookDetails;
