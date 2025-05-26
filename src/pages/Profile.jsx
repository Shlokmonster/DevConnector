import { supabase } from "../supabaseclient";
import { logout } from "../auth/logout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    avatar: "",
  });

  const navigate = useNavigate();

  // Get Supabase session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && user === null) {
      navigate("/Authenticate");
    }
  }, [user, loading, navigate]);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      const res = await fetch("http://localhost:8080/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProfile(data);
      setFormData({
        username: data.username || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
      });
    };

    if (user) fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) console.error(error);
    else window.location.href = "/";
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    const res = await fetch("http://localhost:8080/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const updated = await res.json();
    setProfile(updated);
    setEditMode(false);
  };

  if (loading || !profile) return <p>Loading profile...</p>;

  return (
    <div className="user-profile">
      <div className="profile-box">
        <img
          src={formData.avatar || "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20software%20developer%20with%20short%20dark%20hair%20and%20glasses%2C%20minimalist%20background%2C%20high%20quality%20professional%20portrait%2C%20studio%20lighting&width=100&height=100&seq=avatar1&orientation=squarish"}
          alt="User Avatar"
          className="avatar"
        />
        <div className="user-info">
          {editMode ? (
            <>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Your bio"
              />
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Avatar URL"
              />
            </>
          ) : (
            <>
              <h2 className="name">{formData.username}</h2>
              <p className="bio">{formData.bio}</p>
            </>
          )}



          <div className="button-group">
            {editMode ? (
              <button onClick={handleSave} className="save-btn">Save</button>
            ) : (
              <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
