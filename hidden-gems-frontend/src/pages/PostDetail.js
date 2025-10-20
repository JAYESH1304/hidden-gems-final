import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { postAPI, commentAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import CommentList from '../components/CommentList';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    postAPI.getById(id).then(res => setPost(res.data));
    commentAPI.getByPostId(id).then(res => setComments(res.data));
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

  if (!post) return <div>Loading...</div>;

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

      {user && (
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
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '2rem auto', padding: '2rem' },
  link: { color: '#007bff', textDecoration: 'underline' },
  divider: { margin: '2rem 0' },
  form: { marginTop: '2rem', display: 'flex', flexDirection: 'column' },
  textarea: { padding: '0.7rem', fontSize: '1rem', minHeight: '80px' },
  button: { marginTop: '1rem', padding: '0.7rem', cursor: 'pointer', fontSize: '1rem' },
};

export default PostDetail;
