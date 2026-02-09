import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Auth Form States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("player"); // New state for role selection
  
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [view, setView] = useState("menu");

  const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api/"
    : "https://brainbit.onrender.com/api/";

  const processToken = (accessToken) => {
    try {
      const decoded = jwtDecode(accessToken);
      setUser({
        username: decoded.username || "User",
        isAdmin: decoded.is_admin || decoded.is_staff || false
      });
    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  };

  useEffect(() => {
    if (token) processToken(token);
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}token/`, { username, password });
      localStorage.setItem('token', res.data.access);
      setToken(res.data.access);
    } catch (err) {
      alert("Login failed! Check your credentials.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Sending all the new details to your RegisterSerializer
      await axios.post(`${API_BASE}register/`, { 
        username, 
        password, 
        email,
        first_name: firstName,
        last_name: lastName,
        role 
      });
      alert("Account created successfully! Now please login.");
      setIsSignupMode(false);
      // Clear fields after success
      setEmail(""); setFirstName(""); setLastName(""); setRole("player");
    } catch (err) {
      alert("Signup failed! Please check if the username is taken.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setView("menu");
  };

  if (!token) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>{isSignupMode ? "Join BrainBit 🧠" : "BrainBit Login 🧠"}</h2>
          <form onSubmit={isSignupMode ? handleSignup : handleLogin}>
            <input 
              type="text" placeholder="Username" 
              value={username} onChange={e => setUsername(e.target.value)} required 
            />
            <input 
              type="password" placeholder="Password" 
              value={password} onChange={e => setPassword(e.target.value)} required 
            />

            {/* Render extra fields only in Signup Mode */}
            {isSignupMode && (
              <>
                <input 
                  type="email" placeholder="Email Address" 
                  value={email} onChange={e => setEmail(e.target.value)} 
                />
                <input 
                  type="text" placeholder="First Name" 
                  value={firstName} onChange={e => setFirstName(e.target.value)} 
                />
                <input 
                  type="text" placeholder="Last Name" 
                  value={lastName} onChange={e => setLastName(e.target.value)} 
                />
                <div className="role-selection">
                  <label>Register as:</label>
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="player">🎮 Player</option>
                    <option value="admin">🛡️ Admin</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit">{isSignupMode ? "Register" : "Login"}</button>
          </form>
          <button className="toggle-btn" onClick={() => setIsSignupMode(!isSignupMode)}>
            {isSignupMode ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" onClick={() => setView("menu")} style={{cursor: 'pointer'}}>
          BrainBit 🧠
        </div>
        <div className="user-info">
          <span>{user?.isAdmin ? "🛡️ Admin" : "🎮 Player"}: {user?.username}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <main className="content">
        {view === "menu" && (
          <div className="menu-selection">
            <h1>Welcome back, {user?.username}!</h1>
            <p>What would you like to do today?</p>
            <div className="menu-grid">
              <div className="menu-card" onClick={() => setView("play")}>
                <div className="card-icon">🎮</div>
                <h3>Attempt Quiz</h3>
                <p>Browse available quizzes and test your knowledge.</p>
              </div>
              <div 
                className={`menu-card ${!user?.isAdmin ? 'disabled' : 'admin-card'}`} 
                onClick={() => user?.isAdmin && setView("create")}
              >
                <div className="card-icon">🛠️</div>
                <h3>Create Quiz</h3>
                <p>{user?.isAdmin ? "Manage content, questions, and quizzes." : "Admin access required to create quizzes."}</p>
                {!user?.isAdmin && <span className="lock-badge">🔒 Locked</span>}
              </div>
            </div>
          </div>
        )}

        {view === "create" && (
          <div className="dashboard-wrapper">
             <button className="back-btn" onClick={() => setView("menu")}>⬅ Back to Menu</button>
             <h2>Admin Management Console</h2>
             <p>Manage your quizzes and questions below.</p>
          </div>
        )}

        {view === "play" && (
          <div className="dashboard-wrapper">
             <button className="back-btn" onClick={() => setView("menu")}>⬅ Back to Menu</button>
             <h2>Available Quizzes</h2>
             <p>Choose a quiz and prove your skills!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;