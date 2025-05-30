import { useEffect } from "react";
import { supabase } from "../supabaseclient";

const GitHubCallback = () => {
    useEffect(() => {
      const getToken = async () => {
        const { data, error } = await supabase.auth.getSession();
  
        if (error || !data.session) {
          console.error("❌ Error:", error);
          return;
        }
  
        const token = data.session.access_token;
  
        window.opener.postMessage(
          { type: "github_oauth_token", access_token: token },
          window.location.origin
        );
        window.close();
      };
  
      getToken();
    }, []);
  
    return <p>Connecting to GitHub...</p>;
  };
  
  export default GitHubCallback;