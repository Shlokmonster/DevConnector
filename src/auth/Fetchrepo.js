import { supabase } from "../supabaseclient";

export const fetchGitHubRepos = async () => {
  try {
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) throw sessionError;
    if (!session?.user) throw new Error("User not authenticated");

    // Fetch the GitHub token from user_tokens
    const { data: tokens, error: tokenError } = await supabase
      .from('user_tokens')
      .select('github_access_token')
      .eq('user_id', session.user.id)
      .order('inserted_at', { ascending: false })
      .limit(1);

    if (tokenError) throw tokenError;
    if (!tokens || tokens.length === 0) throw new Error("GitHub token not found");
    
    const tokenData = tokens[0];

    // Fetch repositories from GitHub
    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${tokenData.github_access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch repositories');
    }

    const repos = await response.json();
    return repos;
  } catch (error) {
    console.error('Error in fetchGitHubRepos:', error);
    throw error;
  }
};
