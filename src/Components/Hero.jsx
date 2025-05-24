import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from 'lucide-react';
import { supabase } from "../supabaseclient";

// Individual Post Component
const PostItem = ({ post, onUpdatePost }) => {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          liked: newLiked,
          likes: newLikes 
        }),
      });

      if (!response.ok) {
        // Revert on error
        setLiked(!newLiked);
        setLikes(newLiked ? likes - 1 : likes + 1);
        console.error('Failed to update like');
      }
    } catch (error) {
      // Revert on error
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saved: newSaved }),
      });

      if (!response.ok) {
        // Revert on error
        setSaved(!newSaved);
        console.error('Failed to update save');
      }
    } catch (error) {
      // Revert on error
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
      {/* Header */}
      <div className="post-header">
        <div className="post-user-info">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.name || post.email || 'User')}&background=random&size=40`}
            alt={post.name || post.email || 'User'} 
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

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Engagement Bar */}
      <div className="post-engagement">
        <div className="engagement-actions">
          <button 
            onClick={handleLike}
            className={`engagement-btn ${liked ? 'liked' : ''}`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{likes}</span>
          </button>
          
          <button className="engagement-btn">
            <MessageCircle size={18} />
            <span>{comments}</span>
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          className={`save-btn ${saved ? 'saved' : ''}`}
        >
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

  useEffect(() => {
    // Get the currently logged-in user (your existing logic)
    const getUser = async () => {
      // Replace with your actual supabase auth call
      // const { data: { user } } = await supabase.auth.getUser();
      // setUser(user);
      
      // Temporary mock user
      setUser({ 
        user_metadata: { name: "Jason" },
        email: "jason@example.com"
      });
    };
    getUser();
    fetchPosts();
  }, []);

  // Fetching the posts with engagement data
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

  // Submitting the posts
  const Submitpost = async () => {
    if (!content.trim()) {
      alert("Please write something first");
      return;
    }

    setPosting(true);

    // Replace with your actual supabase session logic
    // const { data: { session }, error } = await supabase.auth.getSession();
    
    // Mock session for now
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;


    if (!session) {
      alert("You must be logged in!");
      // navigate("/Authenticate");
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
        fetchPosts(); // Refresh posts
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
          {user ? `Welcome back, ${user.user_metadata?.name || user.email}!` : "Welcome back, User"}
        </div>
        <div className="date">Friday, May 23, 2025</div>

        <div className="posting">
          <div className="postingin">
            <img
              src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20software%20developer%20with%20short%20dark%20hair%20and%20glasses%2C%20minimalist%20background%2C%20high%20quality%20professional%20portrait%2C%20studio%20lighting&width=100&height=100&seq=avatar1&orientation=squarish"
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
            <div className="coder">
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
            <button className="post" onClick={Submitpost} disabled={posting}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* Display posts with enhanced UI */}
        <div className="posts-list">
          <h2>Recent Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet. Be the first to post!</p>
          ) : (
            posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;