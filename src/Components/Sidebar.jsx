import React from "react";
import { Link } from "react-router-dom";

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
              <button className="nav1-button">
                <i className="fas fa-users icon"></i>
                 <a>
                  Developers
                </a>
              </button>
            </li>
            <li>
              <button className="nav1-button">
                <i className="fas fa-code icon"></i>
                <span>Posts</span>
              </button>
            </li>
            <li>
              <button className="nav1-button">
                <i className="fab fa-github icon"></i>
                <span>GitHub Integration</span>
              </button>
            </li>
            <li>
              <button className="nav1-button">
                <i className="fas fa-user-circle icon"></i>
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button className="nav1-button">
                <i className="fas fa-cog icon"></i>
                <span>Settings</span>
              </button>
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
            <button className="connect-btn">
              <i className="fab fa-github"></i> Connect
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
