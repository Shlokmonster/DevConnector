import { useEffect, useState } from 'react';

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
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">Developer Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="w-20 h-20 bg-gray-700 rounded-full mb-4 mx-auto"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
                <div className="flex justify-between text-sm">
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
                  <div className="h-4 bg-gray-700 rounded w-16"></div>
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
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-white">Developer Community</h2>
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            <p className="font-medium">Error loading profiles</p>
            <p className="text-sm opacity-80">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white">Developer Community</h2>
        
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0111.317-2.5M19 21v-1a6 6 0 00-4-5.659M12 9a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-2">No developers found</h3>
            <p className="text-gray-400">Be the first to join our developer community!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => (
              <div 
                key={profile._id} 
                className="profile-card bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={profile.avatar || 'https://ui-avatars.com/api/?name=' + (profile.username || 'User') + '&background=4A90E2&color=fff&size=200'}
                    alt={profile.username || 'User'}
                    className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-gray-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${profile.username || 'User'}&background=4A90E2&color=fff&size=200`;
                    }}
                  />
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {profile.username || 'Unnamed User'}
                  </h3>
                  {profile.title && (
                    <p className="text-blue-400 text-sm font-medium mb-2">{profile.title}</p>
                  )}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {profile.bio || 'No bio yet.'}
                  </p>
                  <div className="flex justify-between w-full text-sm text-gray-400 border-t border-gray-700 pt-3">
                    <div className="text-center">
                      <div className="font-medium text-white">{profile.followers || 0}</div>
                      <div className="text-xs">Followers</div>
                    </div>
                    <div className="h-8 w-px bg-gray-700"></div>
                    <div className="text-center">
                      <div className="font-medium text-white">{profile.following || 0}</div>
                      <div className="text-xs">Following</div>
                    </div>
                    <div className="h-8 w-px bg-gray-700"></div>
                    <div className="text-center">
                      <div className="font-medium text-white">{profile.posts?.length || 0}</div>
                      <div className="text-xs">Posts</div>
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
