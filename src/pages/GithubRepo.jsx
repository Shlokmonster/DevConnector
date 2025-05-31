import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";

const GitHubRepos = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch GitHub token from Supabase
  const fetchGitHubToken = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user) throw new Error("User not logged in");

      // Get the user's GitHub token (most recent first)
      const { data: tokens, error } = await supabase
        .from('user_tokens')
        .select('github_access_token')
        .eq('user_id', session.user.id)
        .order('inserted_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (!tokens || tokens.length === 0) {
        throw new Error("GitHub token not found. Please connect your GitHub account first.");
      }

      return tokens[0].github_access_token;
    } catch (err) {
      console.error('Error fetching GitHub token:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Fetch repos from GitHub using token
  const fetchReposFromGitHub = async (token) => {
    try {
      const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=50", {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch repos from GitHub");
      }

      const repos = await res.json();
      setRepos(repos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 30) return `Updated ${diffDays} days ago`;
    if (diffDays < 365) return `Updated ${Math.ceil(diffDays / 30)} months ago`;
    return `Updated ${Math.ceil(diffDays / 365)} years ago`;
  };

  // On mount, get token and fetch repos
  useEffect(() => {
    (async () => {
      const token = await fetchGitHubToken();
      if (token) {
        await fetchReposFromGitHub(token);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="github-repos-container">
        <h2>Your GitHub Repositories</h2>
        <div className="repos-loading">Loading repositories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-repos-container">
        <h2>Your GitHub Repositories</h2>
        <div className="repos-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="github-repos-container">
      <h2>Your GitHub Repositories</h2>
      {repos.length === 0 ? (
        <div className="repos-empty">
          <p>No repositories found!</p>
        </div>
      ) : (
        <div className="repos-list">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-item"
            >
              <div className="repo-header">
                <h3 className="repo-name">{repo.name}</h3>
                <span className={`repo-visibility ${repo.private ? 'private' : 'public'}`}>
                  {repo.private ? 'Private' : 'Public'}
                </span>
              </div>
              
              {repo.description && (
                <p className="repo-description">{repo.description}</p>
              )}
              
              <div className="repo-meta">
                {repo.language && (
                  <span className="repo-meta-item repo-language">
                    {repo.language}
                  </span>
                )}
                
                {repo.stargazers_count > 0 && (
                  <span className="repo-meta-item repo-stars">
                    {repo.stargazers_count}
                  </span>
                )}
                
                {repo.forks_count > 0 && (
                  <span className="repo-meta-item repo-forks">
                    {repo.forks_count}
                  </span>
                )}
                
                <span className="repo-meta-item repo-updated">
                  {formatDate(repo.updated_at)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitHubRepos;