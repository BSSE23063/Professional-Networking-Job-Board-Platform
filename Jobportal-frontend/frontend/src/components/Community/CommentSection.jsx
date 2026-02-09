import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaEdit, FaTrash, FaUserCircle, FaSmile } from 'react-icons/fa';
import './Community.css';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getPostComments(postId);
      setComments(data);
    } catch (err) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    try {
      const newComment = await commentService.addComment(postId, { text: commentText });
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const updatedComment = await commentService.updateComment(commentId, { text: editText });
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? updatedComment : comment
      ));
      setEditingCommentId(null);
      setEditText('');
      toast.success('Comment updated!');
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted!');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comment-section">
      <div className="comment-form">
        <div className="comment-input-container">
          <div className="comment-avatar">
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user.name} />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="comment-input-wrapper">
            <form onSubmit={handleSubmit} className="comment-form-inner">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                disabled={!user}
              />
              <div className="comment-actions-right">
                <button type="button" className="emoji-btn">
                  <FaSmile />
                </button>
                <button 
                  type="submit" 
                  className="comment-submit-btn"
                  disabled={!commentText.trim() || !user}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="comments-list">
        {loading ? (
          <div className="loading-comments">
            <div className="loading-spinner"></div>
            <span>Loading comments...</span>
          </div>
        ) : comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="comment-item">
              <div className="comment-avatar">
                {comment.author.profilePic ? (
                  <img src={comment.author.profilePic} alt={comment.author.name} />
                ) : (
                  <FaUserCircle className="avatar-icon" />
                )}
              </div>
              
              <div className="comment-content">
                <div className="comment-header">
                  <div className="comment-author-info">
                    <h5 className="comment-author">{comment.author.name}</h5>
                    {comment.author.role && (
                      <span className="commenter-role">{comment.author.role}</span>
                    )}
                  </div>
                  <div className="comment-right">
                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    {user && user.id === comment.author._id && editingCommentId !== comment._id && (
                      <div className="comment-actions">
                        <button 
                          onClick={() => handleEdit(comment)}
                          className="btn-icon edit-comment-btn"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(comment._id)}
                          className="btn-icon delete-comment-btn"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {editingCommentId === comment._id ? (
                  <div className="edit-comment">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-comment-textarea"
                      rows="3"
                      autoFocus
                    />
                    <div className="edit-comment-actions">
                      <button 
                        onClick={() => setEditingCommentId(null)}
                        className="btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleUpdate(comment._id)}
                        className="btn-primary btn-sm"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.text}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;