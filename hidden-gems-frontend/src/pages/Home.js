import React, { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    postAPI.getAll().then(res => setPosts(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h1>Discover Hidden Gems</h1>
      <div style={styles.grid}>
        {posts.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
};

export default Home;
