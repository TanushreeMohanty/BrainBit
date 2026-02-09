import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import MainMenu from './components/MainMenu';
import AdminDashboard from './components/AdminDashboard'; // Management Core
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState("menu");
  const [isSignupMode, setIsSignupMode] = useState(false);
  
  const [formStates, setFormStates] = useState({
    username: "", 
    password: "", 
    email: "", 
    firstName: "", 
    lastName: "", 
    role: "player"
  });

  const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://127.0.0.1:8000/api/" 
    : "https://brainbit.onrender.com/api/";

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ 
          username: decoded.username, 
          isAdmin: decoded.is_admin || decoded.is_staff 
        });
      } catch { logout(); }
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignupMode ? "register/" : "token/";
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, formStates);
      if (isSignupMode) {
        alert("Success! Please login.");
        setIsSignupMode(false);
      } else {
        localStorage.setItem('token', res.data.access);
        setToken(res.data.access);
      }
    } catch (err) { alert("Authentication failed."); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setView("menu");
  };

  if (!token) return (
    <AuthForm 
      isSignupMode={isSignupMode} 
      onToggleMode={() => setIsSignupMode(!isSignupMode)}
      onSubmit={handleAuth}
      formStates={formStates}
      setFormStates={setFormStates}
    />
  );

  return (
    <div className="app-container">
      {/* 🧭 Integrated Branding Navbar */}
      <Navbar user={user} onLogout={logout} onNavigate={setView} />

      <main className="content">
        {/* --- 1. Selection Hub --- */}
        {view === "menu" && <MainMenu user={user} onNavigate={setView} />}

        {/* --- 2. Admin Management Side (Management Core) --- */}
        {view === "create" && (
          <div className="dashboard-wrapper">
             <button className="back-btn" onClick={() => setView("menu")}>⬅ Back to Menu</button>
             {/* Passes token for CRUD authorization */}
             <AdminDashboard token={token} API_BASE={API_BASE} />
          </div>
        )}

        {/* --- 3. Player Attempt Side --- */}
        {view === "play" && (
          <div className="dashboard-wrapper">
             <button className="back-btn" onClick={() => setView("menu")}>⬅ Back to Menu</button>
             <h2>Available Quizzes</h2>
             <p>Choose a quiz and prove your skills!</p>
             {/* PlayerDashboard will be added here next */}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;