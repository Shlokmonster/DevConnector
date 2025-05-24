import { supabase } from "../supabaseclient";
import { logout } from "../auth/logout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false); // done loading
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && user === null) {
      navigate("/Authenticate");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) console.error(error);
    else window.location.href = "/";
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="user-profile">
      <div className="profile-box">
        <img
          src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20software%20developer%20with%20short%20dark%20hair%20and%20glasses%2C%20minimalist%20background%2C%20high%20quality%20professional%20portrait%2C%20studio%20lighting&width=100&height=100&seq=avatar1&orientation=squarish"
          alt="User Avatar"
          className="avatar"
        />
        <div className="user-info">
          <h2 className="name">Shlok Sharma</h2>
          <p className="username">@shlok.codes</p>
          <p className="bio">Engineering student. Web dev nerd. Built FocusOS. Might be drinking chai rn.</p>

          <div className="follow-stats">
            <span><strong>150</strong> Followers</span>
            <span><strong>180</strong> Following</span>
          </div>

          <div className="button-group">
            <button className="edit-btn">Edit Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
