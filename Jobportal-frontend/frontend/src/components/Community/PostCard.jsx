import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/postService';
import { toast } from 'react-toastify';
import CommentSection from './CommentSection';
import { 
  FaHeart, 
  FaRegHeart, 
  FaComment, 
  FaEdit, 
  FaTrash, 
  FaUserCircle,
  FaEllipsisH,
  FaShare,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import './Community.css';

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLiked = user && likes.includes(user.id);
  const isAuthor = user && post.author._id === user.id;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    try {
      const updatedPost = await postService.likePost(post._id);
      setLikes(updatedPost.likes);
      onPostUpdated(updatedPost);
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    try {
      setLoading(true);
      const updatedPost = await postService.updatePost(post._id, { content: editContent });
      onPostUpdated(updatedPost);
      setIsEditing(false);
      toast.success('Post updated successfully!');
    } catch (err) {
      toast.error('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      setLoading(true);
      await postService.deletePost(post._id);
      onPostDeleted(post._id);
      toast.success('Post deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.author.profilePic ? (
              <img src={post.author.profilePic} alt={post.author.name} />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="author-info">
            <div className="author-name-wrapper">
              <h4 className="author-name">{post.author.name}</h4>
              {post.author.role && (
                <span className={`author-role ${post.author.role}`}>
                  {post.author.role.charAt(0).toUpperCase() + post.author.role.slice(1)}
                </span>
              )}
            </div>
            <div className="post-meta">
              <span className="post-time">{formatDate(post.createdAt)}</span>
              <span className="post-dot">•</span>
              <span className="post-visibility">Public</span>
            </div>
          </div>
        </div>

        <div className="post-options">
          <button 
            className="btn-icon options-btn"
            onClick={() => setShowOptions(!showOptions)}
          >
            <FaEllipsisH />
          </button>
          
          {showOptions && (
            <div className="options-dropdown">
              <button className="option-item">
                <FaShare /> Share
              </button>
              <button 
                className="option-item"
                onClick={() => setSaved(!saved)}
              >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
                {saved ? 'Saved' : 'Save'}
              </button>
              {isAuthor && (
                <>
                  <button 
                    className="option-item"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    className="option-item delete"
                    onClick={handleDelete}
                  >
                    <FaTrash /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        {isEditing ? (
          <div className="edit-post">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-textarea"
              rows="4"
              disabled={loading}
            />
            <div className="edit-actions">
              <button 
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleEdit}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}

        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="Post attachment" />
          </div>
        )}
      </div>

      <div className="post-stats">
        <div className="stats-left">
          <span className="likes-count">
            <span className="like-icon">❤️</span>
            {likes.length} likes
          </span>
          <span className="comments-count">
            {post.comments?.length || 0} comments
          </span>
        </div>
      </div>

      <div className="post-actions">
        <button 
          onClick={handleLike}
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          disabled={!user}
        >
          {isLiked ? <FaHeart className="filled" /> : <FaRegHeart />}
          <span>Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={`action-btn comment-btn ${showComments ? 'active' : ''}`}
        >
          <FaComment />
          <span>Comment</span>
        </button>
        <button className="action-btn share-btn">
          <FaShare />
          <span>Share</span>
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post._id} />
      )}
    </div>
  );
};

export default PostCard;