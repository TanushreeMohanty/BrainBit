import React from 'react';

const Navbar = ({ user, onLogout, onNavigate }) => (
  <nav className="navbar">
    <div className="logo" onClick={() => onNavigate("menu")} style={{ cursor: 'pointer' }}>
       <img id='logo' src="/logo.png" alt="BrainBit Logo" /> BrainBit
    </div>
    <div className="user-info">
      <span>{user?.isAdmin ? "🛡️ Admin" : "🎮 Player"}: {user?.username}</span>
      <button onClick={onLogout} className="logout-btn">Logout</button>
    </div>
  </nav>
);

export default Navbar;