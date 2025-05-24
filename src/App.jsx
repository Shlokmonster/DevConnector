import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Hero from "./Components/Hero";
import Authentication from "./pages/Authentication";
import { Routes, Route, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Profile from "./pages/Profile";

function App() {
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
        </Routes>
      </div>
    </>
  );
}

export default App;
