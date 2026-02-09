import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/Navbar";
import AuthForm from "./components/AuthForm";
import MainMenu from "./components/MainMenu";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage"; // 1. Import Landing Page
import PlayerDashboard from "./components/PlayerDashboard";
import QuizSession from "./components/QuizSession";
import QuizResults from "./components/QuizResults";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("menu");
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showLanding, setShowLanding] = useState(true); // 2. Landing State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [formStates, setFormStates] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "player",
  });

  const API_BASE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
      ? "http://127.0.0.1:8000/api/"
      : "https://brainbit.onrender.com/api/";

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // 🛡️ Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
          return;
        }

        setUser({
          username: decoded.username,
          isAdmin: decoded.is_admin || decoded.is_staff,
        });
        setShowLanding(false);
      } catch {
        logout();
      }
    } else {
      setShowLanding(true); // Ensure landing shows if no token
    }
  }, [token]);

  // 3. Helper to enter Auth mode from Landing
  const enterAuth = (signupMode) => {
    setIsSignupMode(signupMode);
    setShowLanding(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignupMode ? "register/" : "token/";
    try {
      const res = await axios.post(`${API_BASE}${endpoint}`, formStates);
      if (isSignupMode) {
        alert("Success! Please login.");
        setIsSignupMode(false);
      } else {
        localStorage.setItem("token", res.data.access);
        setToken(res.data.access);
      }
    } catch (err) {
      alert("Authentication failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setView("menu");
    setShowLanding(true); // Return to landing on logout
  };

  const handleRetry = () => {
    const currentQuiz = activeQuiz;
    setView("menu"); // Briefly switch away to clear the DOM
    setTimeout(() => {
      setActiveQuiz(currentQuiz);
      setView("active-session");
    }, 10); // Re-mount with a fresh state
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setView("active-session");
  };

  // Function to transition from Session to Results
  const handleQuizComplete = (score, total) => {
    setQuizResult({ score, total });
    setView("results");
  };

  const resetToMenu = () => {
    setActiveQuiz(null);
    setQuizResult(null);
    setView("menu");
  };
  // --- 4. Unauthenticated View Logic ---
  if (!token) {
    return showLanding ? (
      <LandingPage onEnter={enterAuth} />
    ) : (
      <AuthForm
        isSignupMode={isSignupMode}
        onToggleMode={() => setIsSignupMode(!isSignupMode)}
        onSubmit={handleAuth}
        formStates={formStates}
        setFormStates={setFormStates}
        onBack={() => setShowLanding(true)} // Back to landing button
      />
    );
  }

  // --- 5. Authenticated App ---
  return (
    <div className="app-container">
      <Navbar user={user} onLogout={logout} onNavigate={setView} />
      <main className="content">
        {view === "menu" && <MainMenu user={user} onNavigate={setView} />}
        {view === "create" && (
          <div className="dashboard-wrapper">
            <button className="back-btn" onClick={() => setView("menu")}>
              ⬅ Back to Menu
            </button>
            <AdminDashboard token={token} API_BASE={API_BASE} />
          </div>
        )}
        {view === "play" && (
          <div className="dashboard-wrapper">
            <button className="back-btn" onClick={() => setView("menu")}>
              ⬅ Back to Menu
            </button>
            <PlayerDashboard
              token={token}
              API_BASE={API_BASE}
              onStartQuiz={handleStartQuiz}
            />
          </div>
        )}

        {/* 2. Active Focus Mode Session */}
        {view === "active-session" && activeQuiz && (
          <QuizSession
            quiz={activeQuiz}
            token={token}
            API_BASE={API_BASE}
            onComplete={handleQuizComplete}
            onCancel={resetToMenu}
          />
        )}

        {/* 3. Final Results Screen */}
        {view === "results" && quizResult && (
          <QuizResults
            score={quizResult.score}
            total={quizResult.total}
            quizTitle={activeQuiz.title}
            onRetry={handleRetry} // Use the new fixed function
            onBackToMenu={resetToMenu}
          />
        )}
      </main>
    </div>
  );
}

export default App;
