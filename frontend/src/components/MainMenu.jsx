import React from 'react';

const MainMenu = ({ user, onNavigate }) => (
  <div className="menu-selection">
    <h1>Welcome back, {user?.username}!</h1>
    <p>What would you like to do today?</p>
    <div className="menu-grid">
      <div className="menu-card" onClick={() => onNavigate("play")}>
        <div className="card-icon">🎮</div>
        <h3>Attempt Quiz</h3>
        <p>Browse available quizzes and test your knowledge.</p>
      </div>
      <div 
        className={`menu-card ${!user?.isAdmin ? 'disabled' : 'admin-card'}`} 
        onClick={() => user?.isAdmin && onNavigate("create")}
      >
        <div className="card-icon">🛠️</div>
        <h3>Create Quiz</h3>
        <p>{user?.isAdmin ? "Manage content, questions, and quizzes." : "Admin access required."}</p>
        {!user?.isAdmin && <span className="lock-badge">🔒 Locked</span>}
      </div>
    </div>
  </div>
);

export default MainMenu;