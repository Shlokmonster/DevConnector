import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { supabase } from "../supabaseclient";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import hljs from "highlight.js/lib/common";

// Individual Post Component
const PostItem = ({ post }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [saved, setSaved] = useState(post.saved || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments] = useState(post.comments || 0);

  const handleLike = async () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    setLiked(newLiked);
    setLikes(newLikes);

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post._id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: newLiked, likes: newLikes }),
      });

      if (!response.ok) {
        setLiked(!newLiked);
        setLikes(newLiked ? likes - 1 : likes + 1);
        console.error('Failed to update like');
      }
    } catch (error) {
      setLiked(!newLiked);
      setLikes(newLiked ? likes - 1 : likes + 1);
      console.error('Error updating like:', error);
    }
  };

  const handleSave = async () => {
    const newSaved = !saved;
    setSaved(newSaved);

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${post._id}/save`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved: newSaved }),
      });

      if (!response.ok) {
        setSaved(!newSaved);
        console.error('Failed to update save');
      }
    } catch (error) {
      setSaved(!newSaved);
      console.error('Error updating save:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="post-item">
      <div className="post-header">
        <div className="post-user-info">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.name || post.email || 'User')}&background=random&size=40`}
            alt="avatar" 
            className="post-avatar"
          />
          <div className="post-user-details">
            <h3 className="post-username">
              {post.name || (post.email ? post.email.split('@')[0] : 'Anonymous User')}
            </h3>
            <p className="post-time">
              Developer • {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <button className="post-menu-btn">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.codeSnippet && (
          <SyntaxHighlighter language={post.language || "javascript"} style={tomorrow}>
            {post.codeSnippet}
          </SyntaxHighlighter>
        )}
      </div>

      <div className="post-engagement">
        <div className="engagement-actions">
          <button onClick={handleLike} className={`engagement-btn ${liked ? 'liked' : ''}`}>
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
          </button>

          <button className="engagement-btn">
            <MessageCircle size={18} />
            <span>{comments}</span>
          </button>
        </div>

        <button onClick={handleSave} className={`save-btn ${saved ? 'saved' : ''}`}>
          <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
};

function Hero() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ username: "", bio: "", avatar: "" });
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("plaintext");

  useEffect(() => {
    const getUser = async () => {
      setUser({ user_metadata: { name: formData.username } });
    };

    getUser();
    profile();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (codeSnippet.trim()) {
      const result = hljs.highlightAuto(codeSnippet);
      setLanguage(result.language || "plaintext");
    }
  }, [codeSnippet]);

  const profile = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      const res = await fetch("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setFormData({
        username: data.username || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const Submitpost = async () => {
    if (!content.trim() && !codeSnippet.trim()) {
      alert("Please write something or add code first");
      return;
    }

    setPosting(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!session) {
      alert("You must be logged in!");
      setPosting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ 
          content,
          codeSnippet,
          language,
          likes: 0,
          comments: 0,
          liked: false,
          saved: false
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Post created!");
        setContent("");
        setCodeSnippet("");
        fetchPosts();
      } else {
        alert(result.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    }

    setPosting(false);
  };

  return (
    <div>
      <div className="her1">
        <div className="heading">
          {user ? `Welcome back, ${formData.username || user.email}!` : "Welcome back, User"}
        </div>
        <div className="date">Monday, May 27, 2025</div>

        <div className="posting">
          <div className="postingin">
            <img
              src={formData.avatar || "https://readdy.ai/api/search-image?query=professional%20headshot%20developer"}
              alt=""
              className="accimg"
            />
            <input
              type="text"
              placeholder="Share a code snippet or update..."
              className="snipt"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="postingin1">
            <div className="postic">
              <div className="coder" onClick={() => setShowCodeEditor(!showCodeEditor)}>
                <i className="fas fa-code icon"></i>
                <span>Code</span>
              </div>
              <div className="image">
                <i className="fas fa-image icon"></i>
                <span>Image</span>
              </div>
              <div className="link">
                <i className="fas fa-link icon"></i>
                <span>Link</span>
              </div>
            </div>
            <div>
              <button className="post" onClick={Submitpost} disabled={posting}>
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>

        {showCodeEditor && (
          <div className="code-editor">
            <p>Detected Language: <strong>{language}</strong></p>
            <textarea
              placeholder="Paste your code here..."
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              rows={8}
              className="code-textarea"
            />
            <h4>Preview:</h4>
            <SyntaxHighlighter language={language} style={tomorrow}>
              {codeSnippet}
            </SyntaxHighlighter>
          </div>
        )}

        <div className="posts-list">
          <h2>Recent Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet. Be the first to post!</p>
          ) : (
            posts.map((post) => <PostItem key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
