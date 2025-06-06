import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { supabase } from "../supabaseclient";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import hljs from "highlight.js/lib/common";

// PostItem Component
const PostItem = ({ post, fetchPosts }) => {
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

  const deletePost = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session) {
        alert("You must be logged in!");
        return;
      }

      const res = await fetch(`http://localhost:8080/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        alert("Post deleted!");
        fetchPosts(); // Refresh posts
      } else {
        alert("Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
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
        <button onClick={deletePost} className="engagement-btn">
          DELETE
        </button>
      </div>

      <div className="post-content">
        {post.content && <p className="post-text">{post.content}</p>}
        {post.imageUrl && (
          <div className="post-image-container">
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="post-image"
              onClick={() => window.open(post.imageUrl, '_blank')}
            />
          </div>
        )}
        {post.codeSnippet && (
          <div className="code-snippet-container">
            <SyntaxHighlighter 
              language={post.language || "javascript"} 
              style={tomorrow}
              customStyle={{
                margin: 0,
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#1e1e1e',
                padding: '12px',
                overflowX: 'auto'
              }}
              wrapLines={true}
              wrapLongLines={true}
            >
              {post.codeSnippet}
            </SyntaxHighlighter>
          </div>
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

// Hero Component
function Hero() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ username: "", bio: "", avatar: "" });
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      // Ensure posts is an array before setting state
      if (Array.isArray(data)) {
        // Sort posts by creation date (newest first)
        const sortedPosts = [...data].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      } else {
        console.error('Invalid posts data:', data);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Set to empty array on error to prevent undefined errors
      setPosts([]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (jpg, jpeg, png, webp)');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset the file input
    document.getElementById('image-upload').value = '';
  };

  const Submitpost = async () => {
    if (!content.trim() && !codeSnippet.trim() && !imageFile) {
      alert("Please write something, add code, or upload an image");
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
      // Create FormData object
      const formData = new FormData();
      
      // Add text fields
      if (content) formData.append('content', content);
      if (codeSnippet) {
        formData.append('codeSnippet', codeSnippet);
        formData.append('language', language);
      }
      
      // Add image file if exists
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          // Don't set Content-Type header when using FormData
          // The browser will set it automatically with the correct boundary
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Post created successfully!");
        // Reset form
        setContent("");
        setCodeSnippet("");
        setImageFile(null);
        setImagePreview(null);
        document.getElementById('image-upload').value = '';
        // Refresh posts
        fetchPosts();
      } else {
        alert(result.error || "Failed to create post. Please try again.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post. Please check your connection and try again.");
    }

    setPosting(false);
  };

  return (
    <div>
      <div className="her1">
        <div className="heading">
          {user ? `Welcome back, ${formData.username || user.email || "User"}!` : "Welcome back, User"}
        </div>
        <div className="date">Monday, May 30, 2025</div>

        <div className="posting">
          <div className="postingin">
            <img
              src={formData.avatar || "https://imgs.search.brave.com/GecKqDMq5WqnUSDr14taGskNvdh4LB59bE60yX639Gs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxOC8x/MC8yOS8yMS80Ni9o/dW1hbi0zNzgyMTg5/XzY0MC5qcGc"}
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
                <label htmlFor="image-upload">
                  <i className="fas fa-image icon"></i>
                  <span>Image</span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/jpeg, image/png, image/webp, image/jpg"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
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

        {imagePreview && (
          <div className="image-preview-container" style={{ margin: '15px 0', position: 'relative' }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: '8px',
                border: '1px solid #ddd'
              }} 
            />
            <button 
              onClick={removeImage}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              ×
            </button>
          </div>
        )}

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
            posts.map((post) => (
              <PostItem key={post._id} post={post} fetchPosts={fetchPosts} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
