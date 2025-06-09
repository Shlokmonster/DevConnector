import { useEffect, useState } from 'react'
function AllProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/api/profiles');
        if (!res.ok) {
          throw new Error('Failed to fetch profiles. Please try again later.');
        }
        const data = await res.json();
        setProfiles(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="developers-container">
        <div className="developers-content">
          <h2>Developer Community</h2>
          <div className="developers-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="developer-card-skeleton">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-line large"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line medium"></div>
                <div className="skeleton-stats">
                  <div className="skeleton-stat"></div>
                  <div className="skeleton-stat"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="developers-container">
        <div className="developers-content">
          <h2>Developer Community</h2>
          <div className="error-message">
            <p className="error-title">Error loading profiles</p>
            <p className="error-details">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="developers-container">
      <div className="developers-content">
        <h2>Developer Community</h2>
        
        {profiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0111.317-2.5M19 21v-1a6 6 0 00-4-5.659M12 9a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <h3>No developers found</h3>
            <p>Be the first to join our developer community!</p>
          </div>
        ) : (
          <div className="developers-grid">
            {profiles.map(profile => (
              <div key={profile._id} className="developer-card">
                <div className="developer-card-content">
                  <img
                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username || 'User'}&background=4A90E2&color=fff&size=200`}
                    alt={profile.username || 'User'}
                    className="developer-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${profile.username || 'User'}&background=4A90E2&color=fff&size=200`;
                    }}
                  />
                  <h3>{profile.username || 'Unnamed User'}</h3>
                  {profile.title && (
                    <p className="developer-title">{profile.title}</p>
                  )}
                  <p className="developer-bio">
                    {profile.bio || 'No bio yet.'}
                  </p>
                  <div className="developer-stats">
                    <div className="stat-item">
                      <div className="stat-value">{profile.followers || 0}</div>
                      <div className="stat-label">Followers</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <div className="stat-value">{profile.following || 0}</div>
                      <div className="stat-label">Following</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <div className="stat-value">{profile.posts?.length || 0}</div>
                      <div className="stat-label">Posts</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllProfiles;
