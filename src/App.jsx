import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Hero from "./Components/Hero";
import Authentication from "./pages/Authentication";
import { Routes, Route, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Profile from "./pages/Profile";
import GitHubCallback from "./auth/GitHubCallback.jsx";
import { useEffect } from "react";
import { supabase } from "./supabaseclient";
import GitHubRepos from "./pages/GithubRepo.jsx";

function App() {

//  higher order compoenent of githubouth
useEffect(() => {
  const handleMessage = async (event) => {
    if (event.origin !== window.location.origin) return;

    if (event.data.type === "github_oauth_token") {
      const githubToken = event.data.access_token;
      console.log("🎉 GitHub token received:", githubToken);

          // Grab your current email/password Supabase user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        return;
      }
      const user = session?.user;

      if (!user) {
        console.error("User not logged in via email/password");
        return;
      }

      try {
        // Delete any existing tokens for this user to maintain one token per user
        const { error: deleteError } = await supabase
          .from('user_tokens')
          .delete()
          .eq('user_id', user.id);

        if (deleteError) {
          console.warn('Warning: Could not clean up old tokens:', deleteError);
        }

        // Insert the new token
        const { error: insertError } = await supabase
          .from('user_tokens')
          .insert([
            {
              user_id: user.id,
              github_access_token: githubToken
              // inserted_at will be automatically set by the database
            }
          ]);
        
        if (insertError) {
          throw insertError;
        }
        
        console.log("✅ GitHub token saved to Supabase!");
      } catch (error) {
        console.error("Failed to save GitHub token:", error);
      }
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);




  const location = useLocation();

  // If the current path is '/Authenticate', don't show Sidebar
  const showSidebar = location.pathname !== "/Authenticate";





  return (
    <>
      <Navbar />
      <div className="dis">
        {showSidebar && <Sidebar />}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/Authenticate" element={<Authentication />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/github-callback" element={<GitHubCallback />} />
          <Route path="/github-repos" element={<GitHubRepos />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
