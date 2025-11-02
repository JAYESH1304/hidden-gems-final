'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchPost = useCallback(async () => {
    try {
      const response = await postAPI.getById(params.id);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentAPI.getByPostId(params.id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [params.id]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser({ userId: payload.userId });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }

    if (params?.id) {
      fetchPost();
      fetchComments();
    }
  }, [params?.id, fetchPost, fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentAPI.create(params.id, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    }
  };

  const handleEdit = () => router.push(`/edit-post/${params.id}`);

  const handleDelete = async () => {
    if (confirm('Delete this post?')) {
      try {
        await postAPI.delete(params.id);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-white text-2xl">Post not found</div>
      </div>
    );
  }

  const isAuthor = currentUser && post.user && currentUser.userId === post.user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Main Post Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition hover:shadow-3xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-block bg-white bg-opacity-25 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium capitalize text-sm">
                    🎬 {post.type}
                  </span>
                  {post.user?.username && (
                    <span className="inline-block bg-white bg-opacity-25 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium text-sm">
                      👤 {post.user.username}
                    </span>
                  )}
                </div>
              </div>
              
              {isAuthor && (
                <div className="flex gap-3">
                  <button
                    onClick={handleEdit}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition transform hover:scale-105 shadow-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition transform hover:scale-105 shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 sm:p-10">
            
            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {post.genre && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Genre</div>
                    <div className="text-lg font-bold text-gray-800">{post.genre}</div>
                  </div>
                </div>
              )}
              
              {post.country && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Country</div>
                    <div className="text-lg font-bold text-gray-800">{post.country}</div>
                  </div>
                </div>
              )}
              
              {post.language && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <span className="text-2xl">🗣️</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Language</div>
                    <div className="text-lg font-bold text-gray-800">{post.language}</div>
                  </div>
                </div>
              )}
              
              {post.year && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Year</div>
                    <div className="text-lg font-bold text-gray-800">{post.year}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Rating */}
            {post.rating > 0 && (
              <div className="mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border-2 border-amber-200">
                <div className="text-sm font-semibold text-gray-600 mb-2">RATING</div>
                <div className="text-4xl">
                  {'⭐'.repeat(post.rating)}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📝</span> Description
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 p-6 rounded-xl">
                {post.description}
              </p>
            </div>

            {/* Review */}
            {post.review && (
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-8 rounded-2xl border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💬</span> Review
                </h2>
                <p className="text-gray-800 text-lg leading-relaxed italic">
                  &ldquo;{post.review}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span>💭</span> Comments
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <span className="text-6xl mb-4 block">🤔</span>
              <p className="text-gray-500 text-lg">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-2xl border-l-4 border-indigo-500 transform transition hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-indigo-700 flex items-center gap-2">
                      <span>👤</span>
                      {comment.user?.username || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 mt-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition resize-none text-lg"
              rows="4"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Post Comment 💬
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
