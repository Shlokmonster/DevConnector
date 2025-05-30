import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Hero from "./Components/Hero";
import Authentication from "./pages/Authentication";
import { Routes, Route, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Profile from "./pages/Profile";
import GitHubCallback from "./pages/GitHubCallback";

function App() {

//  higher order compoenent of githubouth
useEffect(() => {
  const handleMessage = (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data.type === "github_oauth_token") {
      const githubToken = event.data.access_token;
      console.log("🎉 GitHub token:", githubToken);
      // Save this to localStorage or Supabase
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
        </Routes>
      </div>
    </>
  );
}

export default App;
