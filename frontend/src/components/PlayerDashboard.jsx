import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerDashboard.css';
const PlayerDashboard = ({ token, API_BASE, onStartQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${API_BASE}quizzes/`, { headers });
        // Only show quizzes that actually have questions
        setQuizzes(res.data.filter(q => q.question_count > 0));
      } catch (err) { console.error("Discovery failed", err); }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="player-discovery-container">
      <div className="discovery-hero">
        <h2 className="hero-title">Available <span>Quizzes</span></h2>
        <p className="hero-subtitle">Select a topic and test your knowledge.</p>
      </div>

      <div className="quiz-grid center-grid">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="quiz-glass-card player-card animate-slide-up">
            <div className="card-content">
              <div className="card-top">
                <h4>{quiz.title}</h4>
                <p className="quiz-desc">{quiz.description || "Challenge yourself with this quiz!"}</p>
              </div>
              <div className="card-bottom">
                <div className="quiz-meta">
                  <span className="q-count-badge">🧩 {quiz.question_count} Questions</span>
                </div>
                <button className="start-quiz-btn" onClick={() => onStartQuiz(quiz)}>
                  Start Quiz ➔
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerDashboard;