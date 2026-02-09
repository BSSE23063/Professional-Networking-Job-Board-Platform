// CompanyDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '../../services/companyService';
import { postService } from '../../services/postService';
import PostCard from '../Community/PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const companyData = await companyService.getCompany(id);
        setCompany(companyData);
        setError(null);
        
        // Fetch posts by the company's user
        if (companyData.userId?._id) {
          await fetchUserPosts(companyData.userId._id);
        }
      } catch (err) {
        setError('Failed to fetch company details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const fetchUserPosts = async (userId) => {
    try {
      setPostsLoading(true);
      const allPosts = await postService.getAllPosts();
      
      // Filter posts by the user who owns the company
      const userPosts = allPosts.filter(post => 
        post.author?._id === userId || 
        post.userId === userId
      );
      
      setPosts(userPosts);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    } finally {
      setPostsLoading(false);
    }
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
  if (!company) return <div className="not-found">Company not found</div>;

  const companyOwner = company.userId || {};

  return (
    <div className="company-details">
      {/* Company Header */}
      <div className="company-header">
        <div className="company-logo">
          {company.logo ? (
            <img src={company.logo} alt={company.name} />
          ) : (
            <div className="logo-placeholder">
              {company.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="company-header-info">
          <h1>{company.name}</h1>
          <div className="company-owner-info">
            <div className="owner-avatar">
              {companyOwner.profilePic ? (
                <img src={companyOwner.profilePic} alt={companyOwner.name} />
              ) : (
                <div className="owner-initial">
                  {companyOwner.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="owner-details">
              <p className="owner-name">Owner: {companyOwner.name}</p>
              {companyOwner.email && (
                <p className="owner-email">{companyOwner.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="company-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts by Owner ({posts.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs ({company.jobCount || 0})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="company-info">
              <div className="info-section">
                <h3>Company Description</h3>
                <p>{company.description}</p>
              </div>

              <div className="info-section">
                <h3>Company Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <strong>Location:</strong>
                    <span>{company.location}</span>
                  </div>
                  {company.website && (
                    <div className="detail-item">
                      <strong>Website:</strong>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        {company.website}
                      </a>
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Jobs Posted:</strong>
                    <span>{company.jobCount || 0}</span>
                  </div>
                  {company.industry && (
                    <div className="detail-item">
                      <strong>Industry:</strong>
                      <span>{company.industry}</span>
                    </div>
                  )}
                  {company.employeeCount && (
                    <div className="detail-item">
                      <strong>Company Size:</strong>
                      <span>{company.employeeCount} employees</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-section">
                <h3>Company Owner</h3>
                <div className="owner-card">
                  <div className="owner-info">
                    <div className="owner-avatar-large">
                      {companyOwner.profilePic ? (
                        <img src={companyOwner.profilePic} alt={companyOwner.name} />
                      ) : (
                        <div className="owner-initial-large">
                          {companyOwner.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="owner-details-full">
                      <h4>{companyOwner.name}</h4>
                      <p className="owner-role">Company Owner</p>
                      {companyOwner.bio && (
                        <p className="owner-bio">{companyOwner.bio}</p>
                      )}
                      {companyOwner.email && (
                        <p className="owner-contact">
                          <strong>Email:</strong> {companyOwner.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="owner-stats">
                    <div className="stat-item">
                      <span className="stat-number">{posts.length}</span>
                      <span className="stat-label">Posts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Posts Preview */}
            {posts.length > 0 && (
              <div className="recent-posts">
                <div className="section-header">
                  <h3>Recent Posts by Owner</h3>
                  <button 
                    className="btn-text"
                    onClick={() => setActiveTab('posts')}
                  >
                    View all posts →
                  </button>
                </div>
                <div className="preview-posts">
                  {posts.slice(0, 3).map(post => (
                    <div key={post._id} className="preview-post">
                      <div className="preview-author">
                        <div className="author-avatar-small">
                          {post.author?.profilePic ? (
                            <img src={post.author.profilePic} alt={post.author.name} />
                          ) : (
                            <div className="author-initial-small">
                              {post.author?.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="preview-author-info">
                          <strong>{post.author?.name}</strong>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className="preview-content">
                        {post.content.length > 150 
                          ? `${post.content.substring(0, 150)}...` 
                          : post.content}
                      </p>
                      <div className="preview-stats">
                        <span className="post-stat">
                          ❤️ {post.likes?.length || 0}
                        </span>
                        <span className="post-stat">
                          💬 {post.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="posts-tab">
            <div className="posts-header">
              <div className="posts-header-info">
                <h2>Posts by {companyOwner.name}</h2>
                <p>
                  All posts created by the company owner. 
                  {posts.length > 0 
                    ? ` Showing ${posts.length} posts.` 
                    : ' No posts yet.'}
                </p>
              </div>
              <div className="posts-filter">
                {/* You can add filtering options here if needed */}
              </div>
            </div>

            {postsLoading ? (
              <LoadingSpinner />
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <div className="no-posts-icon">📝</div>
                <h3>No posts yet</h3>
                <p>{companyOwner.name} hasn't created any posts yet.</p>
              </div>
            ) : (
              <div className="company-posts-list">
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
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-tab">
            <div className="jobs-header">
              <h2>Jobs at {company.name}</h2>
              <p>Explore career opportunities at this company</p>
            </div>
            
            <div className="jobs-list">
              {/* You can add job listings here */}
              <div className="coming-soon">
                <h3>Job listings coming soon!</h3>
                <p>Check back later for open positions at {company.name}.</p>
                <Link to="/jobs" className="btn btn-primary">
                  Browse All Jobs
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="company-footer">
        <Link to="/companies" className="btn btn-secondary">
          ← Back to Companies
        </Link>
        <div className="action-buttons">
          <button className="btn btn-outline">
            Follow Company
          </button>
          <button className="btn btn-primary">
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;