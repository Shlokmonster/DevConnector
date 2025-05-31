import { useEffect } from "react";


const GitHubCallback = () => {
  
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const githubToken = params.get("provider_token");

    // Just post token to opener and close
    if (window.opener) {
      window.opener.postMessage(
        { type: "github_oauth_token", access_token: githubToken },
        window.location.origin
      );
    }

    window.close();
  }, []);

  return <p>Connecting GitHub...</p> ;

};

export default GitHubCallback;