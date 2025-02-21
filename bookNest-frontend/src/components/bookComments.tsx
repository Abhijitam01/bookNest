import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth  from '../hooks/useAuth';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface BookCommentsProps {
  bookId: string;
}

const BookComments = ({ bookId }: BookCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/books/${bookId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/api/books/${bookId}/comments`, {
        text: newComment
      });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return <div className="mt-6">Loading comments...</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold dark:text-white">Comments</h2>
      
      {user && (
        <form onSubmit={addComment} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            Add Comment
          </button>
        </form>
      )}

      <div className="mt-4 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold dark:text-white">
                  {comment.user.username}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 dark:text-gray-200">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookComments;
