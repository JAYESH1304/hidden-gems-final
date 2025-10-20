'use client';
import React, { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postAPI.getAll()
      .then(res => {
        setPosts(res.data);
        setFilteredPosts(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(post => post.type === typeFilter);
    }

    if (genreFilter !== 'all') {
      filtered = filtered.filter(post => post.genre?.toLowerCase() === genreFilter.toLowerCase());
    }

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.genre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [typeFilter, searchTerm, genreFilter, posts]);

  const genres = [...new Set(posts.map(post => post.genre).filter(Boolean))];


  if (loading) {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading hidden gems...</p>
    </div>
  );
}


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>🎬 Discover Hidden Gems 🎵</h1>
          <p style={styles.subtitle}>Explore underrated music and movies from around the world</p>
        </div>

        <div style={styles.filterSection}>
          <input
            type="text"
            placeholder="🔍 Search by title, genre, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />

          <div style={styles.filterGroup}>
            <div style={styles.filterItem}>
              <label style={styles.label}>Type:</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={styles.select}>
                <option value="all">All</option>
                <option value="music">🎵 Music</option>
                <option value="movie">🎬 Movie</option>
              </select>
            </div>

            <div style={styles.filterItem}>
              <label style={styles.label}>Genre:</label>
              <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} style={styles.select}>
                <option value="all">All Genres</option>
                {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
              </select>
            </div>
          </div>
        </div>

        <p style={styles.resultsCount}>
          {filteredPosts.length} gem{filteredPosts.length !== 1 ? 's' : ''} found
        </p>

        <div style={styles.grid}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => <PostCard key={post._id} post={post} />)
          ) : (
            <div style={styles.noResults}>
              <div style={styles.noResultsIcon}>🔍</div>
              <p>No posts found. Try adjusting your filters or create a new post!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: 'calc(100vh - 70px)', paddingBottom: '3rem' },
  loadingContainer: { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  minHeight: '80vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
},
spinner: { 
  border: '4px solid rgba(255,255,255,0.3)', 
  borderTop: '4px solid #fff', 
  borderRadius: '50%', 
  width: '60px', 
  height: '60px', 
  animation: 'spin 1s linear infinite' 
},
loadingText: { 
  marginTop: '1.5rem', 
  color: '#fff', 
  fontSize: '1.3rem',
  fontWeight: '500'
},

  container: { padding: '2rem', maxWidth: '1400px', margin: '0 auto' },
  hero: { textAlign: 'center', marginBottom: '3rem', color: '#fff' },
  title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' },
  subtitle: { fontSize: '1.2rem', opacity: 0.95 },
  filterSection: { marginBottom: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.95)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  searchInput: { width: '100%', padding: '1rem', fontSize: '1rem', border: '2px solid #e0e0e0', borderRadius: '10px', marginBottom: '1.5rem', outline: 'none', transition: 'border-color 0.3s' },
  filterGroup: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  filterItem: { flex: '1', minWidth: '200px' },
  label: { fontWeight: '600', marginRight: '0.8rem', color: '#555' },
  select: { padding: '0.7rem', fontSize: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px', outline: 'none', cursor: 'pointer', background: '#fff' },
  resultsCount: { color: '#fff', marginBottom: '1.5rem', fontWeight: '500', fontSize: '1.1rem', textAlign: 'center' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' },
  noResults: { gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.95)', borderRadius: '16px' },
  noResultsIcon: { fontSize: '4rem', marginBottom: '1rem' },
};
