import React from 'react';
import './QuizResults.css';
const QuizResults = ({ score, total, quizTitle, onRetry, onBackToMenu }) => {
  const percentage = Math.round((score / total) * 100);

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
            {/* Inner glow effect based on performance */}
            <div className="score-glow" style={{ backgroundColor: feedback.color }}></div>
          </div>
          <div className="percentage-pill" style={{ backgroundColor: feedback.color }}>
            {percentage}% Accuracy
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
          <button className="btn-menu-action" onClick={onBackToMenu}>
            Explore More Quizzes ➔
          </button>
        </footer>
      </div>
    </div>
  );
};

export default QuizResults;