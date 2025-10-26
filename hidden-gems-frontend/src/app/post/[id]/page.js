'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { postAPI, commentAPI } from '@/services/api';

export default function PostDetail() {
  const router = useRouter();
  const params = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ userId: payload.userId });
      } catch (err) {
        console.error('Error parsing token:', err);
      }
    }

    fetchPost();
    fetchComments();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getById(params.id);
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getByPostId(params.id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.create(params.id, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleEdit = () => {
    router.push(`/edit-post/${params.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postAPI.delete(params.id);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="container mx-auto p-8">Loading...</div>;
  if (!post) return <div className="container mx-auto p-8">Post not found</div>;

  // Check if current user is the post author
  const isAuthor = currentUser && post.user && currentUser.userId === post.user._id;

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          {isAuthor && (
            <div className="space-x-2">
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6">
          <p><strong>Type:</strong> {post.type}</p>
          {post.genre && <p><strong>Genre:</strong> {post.genre}</p>}
          {post.country && <p><strong>Country:</strong> {post.country}</p>}
          {post.language && <p><strong>Language:</strong> {post.language}</p>}
          {post.year && <p><strong>Year:</strong> {post.year}</p>}
          {post.rating > 0 && (
            <p>
              <strong>Rating:</strong> {'⭐'.repeat(post.rating)}
            </p>
          )}
          <p><strong>Description:</strong> {post.description}</p>
          {post.review && <p><strong>Review:</strong> {post.review}</p>}
        </div>

        <hr className="my-8" />

        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 mb-6">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded">
                <p className="font-semibold">{comment.user?.username || 'Anonymous'}</p>
                <p>{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-4 border rounded-lg"
            rows="3"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 w-full"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  );
}
