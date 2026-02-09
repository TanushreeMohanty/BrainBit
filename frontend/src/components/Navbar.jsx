import React from 'react';
import img from '../assets/logo.png';

const Navbar = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="navbar">
      {/* Brand Section: Keeps logo and name together */}
      <div className="nav-brand" onClick={() => onNavigate("menu")}>
        <img src={img} alt="BrainBit Logo" className="nav-logo" />
        <span className="brand-name">BrainBit</span>
      </div>

      {/* Actions Section: Keeps user info and logout together */}
      <div className="nav-actions">
        <div className={`status-pill ${user?.isAdmin ? 'admin-pill' : 'player-pill'}`}>
          <span className="pill-icon">{user?.isAdmin ? "🛡️ Admin" : "🎮 Player"} |</span>
          <span className="pill-text">{user?.username}</span>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout ➔
        </button>
      </div>
    </nav>
  );
};

export default Navbar;