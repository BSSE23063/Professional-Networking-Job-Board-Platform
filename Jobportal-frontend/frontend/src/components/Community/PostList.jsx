import { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import './Community.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="community-page">
      <div className="community-container">
        <div className="community-sidebar">
          <div className="sidebar-card">
            <h3>Community Guidelines</h3>
            <ul className="guidelines-list">
              <li>Be respectful and professional</li>
              <li>No spam or self-promotion</li>
              <li>Share valuable insights</li>
              <li>Keep discussions relevant</li>
              <li>Help fellow professionals</li>
            </ul>
          </div>
          
          <div className="sidebar-card stats-card">
            <h3>Community Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">245</span>
                <span className="stat-label">Members</span>
              </div>
            </div>
          </div>
        </div>

        <div className="community-main">
          <div className="community-header">
            <div>
              <h1>Community Feed</h1>
              <p>Connect with professionals, share insights, and discuss opportunities</p>
            </div>
            <button 
              className="btn-primary create-post-btn"
              onClick={() => setShowCreatePost(true)}
            >
              <span className="btn-icon">+</span>
              Create Post
            </button>
          </div>

          {showCreatePost && (
            <CreatePost 
              onPostCreated={handlePostCreated}
              onCancel={() => setShowCreatePost(false)}
            />
          )}

          <div className="posts-container">
            {posts.length === 0 ? (
              <div className="no-posts-card">
                <div className="empty-state">
                  <div className="empty-state-icon">💬</div>
                  <h3>No posts yet</h3>
                  <p>Be the first to share something with the community!</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowCreatePost(true)}
                  >
                    Create First Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map(post => (
                  <PostCard 
                    key={post._id} 
                    post={post}
                    onPostUpdated={handlePostUpdated}
                    onPostDeleted={handlePostDeleted}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostList;