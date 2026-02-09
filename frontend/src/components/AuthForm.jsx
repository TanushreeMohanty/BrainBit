import React from 'react';
import img from '../assets/logo.png';
const AuthForm = ({ 
  isSignupMode, onToggleMode, onSubmit, 
  formStates, setFormStates 
}) => {
  const { username, password, email, firstName, lastName, role } = formStates;

  return (
    <div className="login-container">
      <div className="login-box">
        <h2><img id='logo' src={img} alt="BrainBit Logo" />BrainBit {isSignupMode ? " Signup" : " Login"} </h2>
        <form onSubmit={onSubmit}>
          <input 
            type="text" placeholder="Username" 
            value={username} onChange={e => setFormStates({...formStates, username: e.target.value})} required 
          />
          <input 
            type="password" placeholder="Password" 
            value={password} onChange={e => setFormStates({...formStates, password: e.target.value})} required 
          />

          {isSignupMode && (
            <>
              <input 
                type="email" placeholder="Email Address" 
                value={email} onChange={e => setFormStates({...formStates, email: e.target.value})} 
              />
              <input 
                type="text" placeholder="First Name" 
                value={firstName} onChange={e => setFormStates({...formStates, firstName: e.target.value})} 
              />
              <input 
                type="text" placeholder="Last Name" 
                value={lastName} onChange={e => setFormStates({...formStates, lastName: e.target.value})} 
              />
              <div className="role-selection">
                <label>Register as:</label>
                <select value={role} onChange={e => setFormStates({...formStates, role: e.target.value})}>
                  <option value="player">🎮 Player</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>
            </>
          )}
          <button type="submit">{isSignupMode ? "Register" : "Login"}</button>
        </form>
        <button className="toggle-btn" onClick={onToggleMode}>
          {isSignupMode ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;