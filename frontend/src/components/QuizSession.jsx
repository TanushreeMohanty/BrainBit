import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizSession.css';
const QuizSession = ({ quiz, onComplete, API_BASE, token, onCancel }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await axios.get(`${API_BASE}quizzes/${quiz.id}/`, { headers });
        setQuestions(res.data.questions || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load quiz questions", err);
      }
    };
    loadQuestions();
  }, [quiz.id]);

  const handleNext = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === true) setScore(prev => prev + 1);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Pass final increment if last answer was correct
      onComplete(score + (selectedAnswer === true ? 1 : 0), questions.length);
    }
  };

  if (loading) return (
    <div className="quiz-loading-overlay">
      <div className="loader-pulse"></div>
      <p>Initializing BrainBit Session...</p>
    </div>
  );

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-session-layout animate-fade-in">
      {/* 📊 Top Tracking Header */}
      <header className="session-header">
        <button className="exit-circle-btn" onClick={onCancel} title="Exit Session">✕</button>
        <div className="progress-container-main">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="progress-label">
            Question <span>{currentIndex + 1}</span> of {questions.length}
          </div>
        </div>
      </header>

      {/* 🧠 Central Focus Card */}
      <main className="focus-card-wrapper">
        <div className="question-focus-card animate-slide-up">
          <div className="card-top-accent"></div>
          <h2 className="focus-question-text">{currentQ?.text}</h2>
          
          <div className="focus-options-grid">
            {currentQ?.choices?.map((choice) => (
              <button 
                key={choice.id}
                className={`focus-option-item ${selectedAnswer === choice.is_correct ? 'active' : ''}`}
                onClick={() => setSelectedAnswer(choice.is_correct)}
              >
                <div className="choice-letter">{String.fromCharCode(65 + currentQ.choices.indexOf(choice))}</div>
                <div className="choice-text">{choice.text}</div>
              </button>
            ))}
          </div>

          <button 
            className="action-next-btn" 
            disabled={selectedAnswer === null}
            onClick={handleNext}
          >
            {currentIndex + 1 === questions.length ? "Finish & View Score" : "Next Question ➔"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizSession;