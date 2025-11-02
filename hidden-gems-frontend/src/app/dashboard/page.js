'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { postAPI } from '@/services/api';

export default function Dashboard() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      console.log('Dashboard: Checking token...', token ? 'Found' : 'Not found');
      
      if (!token) {
        console.log('Dashboard: No token, redirecting to login...');
        router.push('/login');
        return false;
      }
      
      console.log('Dashboard: Token found, user is authenticated');
      setIsAuthenticated(true);
      return true;
    };

    // Small delay to ensure localStorage is ready
    setTimeout(() => {
      if (checkAuth()) {
        fetchPosts();
      }
    }, 100);
  }, [router]);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white text-2xl">Checking authentication...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-2xl">Loading posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎬 All Posts
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white text-2xl mb-4">No posts yet!</p>
            <button
              onClick={() => router.push('/create-post')}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-purple-100 transition"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
