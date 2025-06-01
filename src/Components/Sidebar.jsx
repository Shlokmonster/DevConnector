import React from "react";
import { Link } from "react-router-dom";



const openOAuthPopup=()=>{
  const url = "https://rhwmehproorvsztdxtcp.supabase.co/auth/v1/authorize?provider=github&redirect_to=http://localhost:5173/github-callback";
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  window.open(
    url,
     "GitHub OAuth",
    `width=${width},height=${height},left=${left},top=${top}`
  
  );


}

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="scroll-area">
        <nav className="nav-content">
          <ul className="nav1-list">
            <li>
            <Link to="/" className="link">
              <button className="nav1-button active">
                <i className="fas fa-home icon"></i>
                <span>Home</span>
              </button>
              </Link>
            </li>
            <li>
            <Link to="/github-repos" className="link">
              <button className="nav1-button">
                <i className="fas fa-users icon"></i>
                 <a>
                  Developers
                </a>
              </button>
              </Link>
            </li>
            <li>
            <Link to="/github-repos" className="link">
              <button className="nav1-button">
                <i className="fas fa-code icon"></i>
                <span>Posts</span>
              </button>
              </Link>
            </li>
            <li>
            <Link to="/github-repos" className="link">
              <button className="nav1-button">
                <i className="fab fa-github icon"></i>
                <span>GitHub Integration</span>
              </button>
              </Link>
            </li>
            <li>
            <Link to="/Profile" className="link">
              <button className="nav1-button">
                <i className="fas fa-user-circle icon"></i>
                <span>Profile</span>
              </button>
            </Link>
            </li>
            <li>
            <Link to="/github-repos" className="link">
              <button className="nav1-button">
                <i className="fas fa-cog icon"></i>
                <span>Settings</span>
              </button>
              </Link>
            </li>
          </ul>

          <hr className="separator" />

          <div className="topics">
            <h3 className="section-heading">Trending Topics</h3>
            <ul className="nav1-list">
              <li>
                <button className="nav1-button">
                  <i className="fas fa-hashtag icon react"></i>
                  <span>React</span>
                </button>
              </li>
              <li>
                <button className="nav1-button">
                  <i className="fas fa-hashtag icon typescript"></i>
                  <span>TypeScript</span>
                </button>
              </li>
              <li>
                <button className="nav1-button">
                  <i className="fas fa-hashtag icon ai"></i>
                  <span>AI</span>
                </button>
              </li>
            </ul>
          </div>

          <hr className="separator" />

          <div className="github-box">
            <h3 className="box-heading">Connect GitHub</h3>
            <p className="box-text">
              Sync your repositories and share your work
            </p>
            <button className="connect-btn" onClick={openOAuthPopup}>
              <i className="fab fa-github"></i> Connect
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
