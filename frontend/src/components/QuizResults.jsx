import React from 'react';
import './QuizResults.css';

// Added onNavigate prop to handle jumping to the leaderboard
const QuizResults = ({ score, total, quizTitle, onRetry, onBackToMenu, onViewLeaderboard }) => {
  const percentage = Math.round((score / total) * 100);
  const incorrect = total - score;

  const getFeedback = () => {
    if (percentage === 100) return { msg: "Perfect Score! You're a Genius! 🏆", color: "#10b981" };
    if (percentage >= 70) return { msg: "Great Job! You really know your stuff. 🌟", color: "#6366f1" };
    if (percentage >= 50) return { msg: "Good effort! Keep practicing. 👍", color: "#f59e0b" };
    return { msg: "Don't give up! Try again to improve. 💪", color: "#ef4444" };
  };

  const feedback = getFeedback();

  return (
    <div className="results-layout-wrapper animate-fade-in">
      <div className="results-glass-card">
        <header className="results-header-section">
          <h2 className="completion-title">Quiz Completed!</h2>
          <p className="completion-quiz-name">{quizTitle}</p>
        </header>

        <section className="score-visual-section">
          <div className="circular-score-container" style={{ borderColor: feedback.color }}>
            <div className="score-data">
              <span className="final-score-num">{score}</span>
              <span className="final-total-num">out of {total}</span>
            </div>
            <div className="score-glow" style={{ backgroundColor: feedback.color }}></div>
          </div>
          <div className="percentage-pill" style={{ backgroundColor: feedback.color }}>
            {percentage}% Accuracy
          </div>
        </section>

        <section className="analytics-breakdown-container">
          <div className="analytic-stat-card correct">
            <div className="stat-circle"></div>
            <div className="stat-info">
              <span className="stat-label">Correct</span>
              <span className="stat-count">{score}</span>
            </div>
          </div>
          <div className="analytic-stat-card incorrect">
            <div className="stat-circle"></div>
            <div className="stat-info">
              <span className="stat-label">Incorrect</span>
              <span className="stat-count">{incorrect}</span>
            </div>
          </div>
        </section>

        <section className="feedback-message-section">
          <h3 className="dynamic-feedback-text" style={{ color: feedback.color }}>
            {feedback.msg}
          </h3>
        </section>

        <footer className="results-button-footer">
          <button className="btn-retry-action" onClick={onRetry}>
            Try Again
          </button>
          
          {/* New Leaderboard Action */}
          <button className="btn-leaderboard-action" onClick={onViewLeaderboard}>
            🏆 View Leaderboard
          </button>

          <button className="btn-menu-action" onClick={onBackToMenu}>
            Explore More Quizzes ➔
          </button>
        </footer>
      </div>
    </div>
  );
};

export default QuizResults;