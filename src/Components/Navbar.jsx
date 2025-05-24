import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import { Link } from "react-router-dom";



function Navbar() {
    const [user, setUser] = useState(null);
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
        };
    }, []);

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
                        <img
                            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20software%20developer%20with%20short%20dark%20hair%20and%20glasses%2C%20minimalist%20background%2C%20high%20quality%20professional%20portrait%2C%20studio%20lighting&width=100&height=100&seq=avatar1&orientation=squarish"
                            alt="User Avatar"
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
