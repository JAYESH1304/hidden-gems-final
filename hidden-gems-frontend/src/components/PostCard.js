'use client';
import React from 'react';
import Link from 'next/link';

const PostCard = ({ post }) => {
  return (
    <div style={styles.card}>
      <div style={styles.badge}>{post.type}</div>
      <h3 style={styles.title}>{post.title}</h3>
      <p style={styles.meta}>
        <span style={styles.genre}>{post.genre}</span> | 
        <span style={styles.year}> {post.year}</span>
      </p>
      <p style={styles.rating}>{'⭐'.repeat(post.rating)}</p>
      <p style={styles.description}>
        {post.description?.substring(0, 120)}{post.description?.length > 120 ? '...' : ''}
      </p>
      <Link href={`/post/${post._id}`} style={styles.link}>
        View Details →
      </Link>
    </div>
  );
};

const styles = {
  card: { 
    border: '1px solid #e0e0e0', 
    padding: '1.5rem', 
    borderRadius: '12px', 
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#007bff',
    color: '#fff',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: { fontSize: '1.3rem', marginBottom: '0.5rem', color: '#333' },
  meta: { fontSize: '0.9rem', color: '#777', marginBottom: '0.5rem' },
  genre: { fontWeight: 'bold', color: '#555' },
  year: { color: '#999' },
  rating: { fontSize: '1.2rem', marginBottom: '0.5rem' },
  description: { color: '#666', lineHeight: '1.5', marginBottom: '1rem' },
  link: { 
    color: '#007bff', 
    textDecoration: 'none', 
    fontWeight: 'bold',
    display: 'inline-block',
    marginTop: '0.5rem',
  },
};

export default PostCard;
