import { useState } from "react";
import { login } from "../auth/login";
import { signup } from "../auth/signup";
import { logout } from "../auth/logout";
import { useNavigate } from "react-router-dom";


const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("login"); // login or signup
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  // <-- initialize navigate

  const handelAuth = async () => {
    // Call the right function with separate args
    const fn = type === "login" ? login : signup;
    const { error } = await fn(email, password);

    if (error) {
      setMessage(`Error: ${error.message}`);
      console.error(error);
    } else {
      setMessage(
        type === "signup"
          ? "Signup successful! Please check your email to verify."
          : "Login successful!"
      );
      navigate("/");
    }
  };

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      setMessage(`Logout Error: ${error.message}`);
    } else {
      setMessage("Logged out successfully!");
    }
  };



  return (
    <div className="auth-page">
    <div className="auth-container">
      <h2>DevConnect</h2>
      <div className="auth-toggle">
        <button
          onClick={() => {
            setType("login");
            setMessage("");
          }}
          disabled={type === "login"}
        >
          Login
        </button>
        <button
          onClick={() => {
            setType("signup");
            setMessage("");
          }}
          disabled={type === "signup"}
        >
          Signup
        </button>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="submit" onClick={handelAuth}>
        {type === "login" ? "Log In" : "Sign Up"}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  </div>
  );
};

export default Authentication;
