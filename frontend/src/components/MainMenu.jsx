import React from 'react';
import './MainMenu.css';
const MainMenu = ({ user, onNavigate }) => (
  <div className="menu-selection animate-fade-in">
    <div className="menu-welcome">
      <h1>Welcome back, <span>{user?.username}</span>!</h1>
    </div>

    <div className="menu-grid">
      {/* Play Mode Card */}
      <div className="menu-card play-card" onClick={() => onNavigate("play")}>
        <div className="card-icon">🎮</div>
        <div className="card-info">
          <h3>Attempt Quiz</h3>
          <p>Browse available quizzes and test your knowledge.</p>
        </div>
      </div>

      {/* Leaderboard Card */}
      <div className="menu-card leaderboard-card" onClick={() => onNavigate("leaderboard")}>
        <div className="card-icon">🏆</div>
        <div className="card-info">
          <h3>Leaderboard</h3>
          <p>See how you rank against other BrainBit performers.</p>
        </div>
      </div>

      {/* Admin Card */}
      <div 
        className={`menu-card ${!user?.isAdmin ? 'disabled' : 'admin-card'}`} 
        onClick={() => user?.isAdmin && onNavigate("create")}
      >
        <div className="card-icon">🛠️</div>
        <div className="card-info">
          <h3>Create Quiz</h3>
          <p>{user?.isAdmin ? "Manage content, questions, and quizzes." : "Admin access restricted."}</p>
        </div>
        {!user?.isAdmin && <div className="lock-overlay"><span className="lock-badge">🔒 Locked</span></div>}
      </div>
    </div>
  </div>
);

export default MainMenu;