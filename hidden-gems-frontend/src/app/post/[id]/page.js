'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { postAPI, commentAPI } from '../../../services/api';
import { AuthContext } from '../../../providers/AuthProvider';
import CommentList from '../../../components/CommentList';

export default function PostDetail() {
  const params = useParams();
  const id = params.id;
  const context = useContext(AuthContext);
  const user = context?.user || null;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (id) {
      postAPI.getById(id).then(res => setPost(res.data)).catch(err => console.error(err));
      commentAPI.getByPostId(id).then(res => setComments(res.data)).catch(err => console.error(err));
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    try {
      const res = await commentAPI.create(id, { content: commentText });
      setComments([...comments, res.data.comment]);
      setCommentText('');
      alert('Comment posted successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentAPI.delete(commentId);
      setComments(comments.filter(c => c._id !== commentId));
      alert('Comment deleted');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete comment');
    }
  };

  if (!post) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>{post.title}</h1>
      <p><strong>Type:</strong> {post.type} | <strong>Genre:</strong> {post.genre}</p>
      <p><strong>Country:</strong> {post.country} | <strong>Language:</strong> {post.language} | <strong>Year:</strong> {post.year}</p>
      <p><strong>Rating:</strong> {'⭐'.repeat(post.rating)}</p>
      <p><strong>Description:</strong> {post.description}</p>
      <p><strong>Review:</strong> {post.review}</p>
      {post.externalLink && (
        <p><a href={post.externalLink} target="_blank" rel="noopener noreferrer" style={styles.link}>View on External Site</a></p>
      )}

      <hr style={styles.divider} />

      <h2>Comments</h2>
      <CommentList comments={comments} onDelete={handleDeleteComment} currentUser={user} />

      {user ? (
        <form onSubmit={handleCommentSubmit} style={styles.form}>
          <textarea
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
            style={styles.textarea}
          />
          <button type="submit" style={styles.button}>Post Comment</button>
        </form>
      ) : (
        <p>Please <a href="/login">login</a> to post a comment.</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'rgba(255,255,255,0.95)', borderRadius: '12px' },
  loading: { textAlign: 'center', marginTop: '2rem', fontSize: '1.2rem' },
  link: { color: '#007bff', textDecoration: 'underline' },
  divider: { margin: '2rem 0' },
  form: { marginTop: '2rem', display: 'flex', flexDirection: 'column' },
  textarea: { padding: '0.7rem', fontSize: '1rem', minHeight: '80px', border: '1px solid #ddd', borderRadius: '8px' },
  button: { marginTop: '1rem', padding: '0.7rem', cursor: 'pointer', fontSize: '1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold' },
};
