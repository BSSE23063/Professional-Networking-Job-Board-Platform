import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/postService';
import { toast } from 'react-toastify';
import { FaTimes, FaImage, FaVideo, FaCalendar, FaSmile } from 'react-icons/fa';
import './Community.css';

const CreatePost = ({ onPostCreated, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    content: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postData.content.trim()) {
      toast.error('Please write something to post');
      return;
    }

    try {
      setLoading(true);
      const newPost = await postService.createPost(postData);
      toast.success('Post created successfully!');
      onPostCreated(newPost);
      setPostData({ content: '', image: '' });
    } catch (err) {
      toast.error('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <h3>Create Post</h3>
        <button onClick={onCancel} className="close-btn">
          <FaTimes />
        </button>
      </div>

      <div className="post-author-info">
        <div className="author-avatar">
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="author-details">
          <h4>{user?.name}</h4>
          <div className="privacy-selector">
            <select className="privacy-select">
              <option value="public">🌍 Public</option>
              <option value="connections">🔒 Connections</option>
              <option value="private">👤 Only me</option>
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <textarea
            name="content"
            value={postData.content}
            onChange={handleChange}
            placeholder={`What's on your mind, ${user?.name}?`}
            className="post-textarea"
            rows="4"
            disabled={loading}
          />
        </div>

        {postData.image && (
          <div className="image-preview">
            <img src={postData.image} alt="Preview" />
            <button 
              type="button"
              onClick={() => setPostData(prev => ({ ...prev, image: '' }))}
              className="remove-image"
            >
              <FaTimes />
            </button>
          </div>
        )}

        <div className="post-options">
          <div className="options-text">Add to your post</div>
          <div className="option-buttons">
            <button type="button" className="option-btn">
              <FaImage className="image-icon" />
              <span>Photo</span>
            </button>
            <button type="button" className="option-btn">
              <FaVideo className="video-icon" />
              <span>Video</span>
            </button>
            <button type="button" className="option-btn">
              <FaCalendar className="event-icon" />
              <span>Event</span>
            </button>
            <button type="button" className="option-btn">
              <FaSmile className="emoji-icon" />
              <span>Feeling</span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="image-input-group">
            <FaImage className="input-icon" />
            <input
              type="url"
              name="image"
              value={postData.image}
              onChange={handleChange}
              placeholder="Paste image URL here..."
              className="image-url-input"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary cancel-btn"
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary post-btn"
            disabled={loading || !postData.content.trim()}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;