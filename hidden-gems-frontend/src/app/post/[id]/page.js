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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
        <div className="text-white text-2xl">Post not found</div>
      </div>
    );
  }

  const isAuthor = currentUser && post.user && currentUser.userId === post.user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Main Post Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full capitalize">
                    {post.type}
                  </span>
                  {post.user?.username && (
                    <span>by {post.user.username}</span>
                  )}
                </div>
              </div>
              
              {isAuthor && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {post.genre && (
                <div className="flex items-start">
                  <span className="font-bold text-gray-700 w-32">Genre:</span>
                  <span className="text-gray-600">{post.genre}</span>
                </div>
              )}
              
              {post.country && (
                <div className="flex items-start">
                  <span className="font-bold text-gray-700 w-32">Country:</span>
                  <span className="text-gray-600">{post.country}</span>
                </div>
              )}
              
              {post.language && (
                <div className="flex items-start">
                  <span className="font-bold text-gray-700 w-32">Language:</span>
                  <span className="text-gray-600">{post.language}</span>
                </div>
              )}
              
              {post.year && (
                <div className="flex items-start">
                  <span className="font-bold text-gray-700 w-32">Year:</span>
                  <span className="text-gray-600">{post.year}</span>
                </div>
              )}
              
              {post.rating > 0 && (
                <div className="flex items-start md:col-span-2">
                  <span className="font-bold text-gray-700 w-32">Rating:</span>
                  <span className="text-2xl">{'⭐'.repeat(post.rating)}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{post.description}</p>
            </div>

            {/* Review */}
            {post.review && (
              <div className="bg-purple-50 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Review</h2>
                <p className="text-gray-700 text-lg leading-relaxed">{post.review}</p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Comments</h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-4 mb-8">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border-l-4 border-purple-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-purple-700">
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition resize-none"
              rows="4"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition font-bold text-lg shadow-lg"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
