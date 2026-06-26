import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";

const Login = () => {
  const { loginUser, isAuthenticated } = useContext(AudioContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email/username and password.");
      return;
    }

    setIsLoading(true);

    // Simulate network delay for premium feel
    setTimeout(() => {
      const success = loginUser(email, password);
      setIsLoading(false);
      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("Invalid username or password. Please try again.");
      }
    }, 1200);
  };

  const handleSocialLogin = (platform) => {
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      loginUser(`mock_${platform}@spotify.com`, "social_auth_token_123");
      setIsLoading(false);
      navigate("/", { replace: true });
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Spotify Logo */}
        <div className="login-logo-wrapper">
          <svg viewBox="0 0 167.5 167.5" className="spotify-login-logo">
            <path
              fill="#1db954"
              d="M83.7 0C37.5 0 0 37.5 0 83.7c0 46.3 37.5 83.7 83.7 83.7 46.3 0 83.7-37.5 83.7-83.7C167.5 37.5 130 0 83.7 0zM121.5 120.8c-1.6 2.5-4.8 3.2-7.3 1.7-19.9-12.2-45-14.9-74.6-8.2-2.9.7-5.8-1.2-6.4-4.1-.7-2.9 1.2-5.8 4.1-6.4 32.4-7.4 60.1-4.2 82.5 9.5 2.5 1.6 3.2 4.9 1.7 7.5zm11-22.8c-2 3.2-6.2 4.2-9.4 2.2-22.8-14-57.5-18-84.4-9.9-3.6 1.1-7.4-1-8.5-4.6-1.1-3.6 1-7.4 4.6-8.5 30.7-9.3 69.2-4.9 95.5 11.3 3.2 2 4.2 6.1 2.2 9.5zm.9-24C106.1 57.8 61.2 56.3 35.3 64.1c-4.2 1.3-8.6-1.1-9.9-5.3-1.3-4.2 1.1-8.6 5.3-9.9 29.8-9 79.7-7.3 111.4 11.5 3.8 2.2 5 7.1 2.8 10.9-2.2 3.8-7.1 5.1-10.9 2.8z"
            />
          </svg>
          <span className="logo-text">Spotify</span>
        </div>

        <h1 className="login-heading">Log in to Spotify</h1>

        {/* Social Buttons */}
        <div className="social-buttons-container">
          <button className="social-btn google" onClick={() => handleSocialLogin("google")}>
            <FaGoogle className="social-icon" />
            <span>Continue with Google</span>
          </button>
          <button className="social-btn facebook" onClick={() => handleSocialLogin("facebook")}>
            <FaFacebook className="social-icon" />
            <span>Continue with Facebook</span>
          </button>
          <button className="social-btn apple" onClick={() => handleSocialLogin("apple")}>
            <FaApple className="social-icon" />
            <span>Continue with Apple</span>
          </button>
        </div>

        <hr className="social-divider" />

        {/* Error Alert */}
        {error && <div className="login-error-alert">{error}</div>}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email or username</label>
            <input
              type="text"
              id="email"
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="remember-me-container">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="custom-checkbox"></span>
              Remember me
            </label>
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "Log In"}
          </button>
        </form>

        <a href="#forgot" className="forgot-password-link">Forgot your password?</a>

        <p className="signup-prompt">
          Don't have an account? <a href="#signup">Sign up for Spotify</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
