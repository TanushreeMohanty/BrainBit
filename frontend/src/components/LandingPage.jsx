import React from 'react';
import img from '../assets/logo.png';
const LandingPage = ({ onEnter }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="hero-section">
          <img src={img} alt="BrainBit Logo" className="hero-logo" />
          <h1 className="hero-title">Master Your Mind with <span>BrainBit</span></h1>
          <p className="hero-subtitle">
            The ultimate platform for creating, managing, and conquering custom quizzes. 
            Join thousands of learners and experts today.
          </p>
          
          <div className="landing-actions">
            <button className="cta-btn primary" onClick={() => onEnter(false)}>
              Login to Account
            </button>
            <button className="cta-btn secondary" onClick={() => onEnter(true)}>
              Create New Account
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default LandingPage;