import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { Link } from "react-router-dom";

import Profile from "../pages/Profile";



function Navbar() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        avatar: ""
      });
    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user || null);
        });

        // Listen to login/logout events
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
            profile(); 
        };
    }, []);


    //  getting the profile photo

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


    return (
        <div>
            <nav className="navbar">
                <Link to={"/"} className="link">
                <div className="logo">DevConnect</div>
                </Link>

                <div className="search">
                    <img src="https://cdn-icons-png.flaticon.com/128/17216/17216943.png" alt="" className="searchicon" />
                    <input type="text" placeholder="Search developers, posts, or code..." className="searchbar" />
                </div>

                <div className="account">
                    {user ? (
                        <Link to="/Profile"> 
                        <img src ={formData.avatar || "https://readdy.ai/api/search-image?query=professional%20headshot%20developer"}
                            className="accimg"
                        />
                        </Link>
                    ) : (
                        <Link to="/Authenticate">
                            <button className="login-btn">Login</button>
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
