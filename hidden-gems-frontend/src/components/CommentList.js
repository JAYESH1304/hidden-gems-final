'use client';
import React from 'react';

const CommentList = ({ comments, onDelete, currentUser }) => {
  return (
    <div style={styles.container}>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(comment => (
          <div key={comment._id} style={styles.comment}>
            <p><strong>{comment.authorId?.username || 'Anonymous'}:</strong> {comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
            {currentUser && (currentUser.id === comment.authorId?._id || currentUser.role === 'admin') && (
              <button onClick={() => onDelete(comment._id)} style={styles.deleteBtn}>Delete</button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { marginTop: '1rem' },
  comment: { padding: '1rem', border: '1px solid #ddd', marginBottom: '1rem', borderRadius: '5px', backgroundColor: '#f9f9f9' },
  deleteBtn: { marginLeft: '1rem', padding: '0.3rem 0.7rem', cursor: 'pointer', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px' },
};

export default CommentList;
