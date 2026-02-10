import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerDashboard.css';

const PlayerDashboard = ({ token, API_BASE, onStartQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${API_BASE}quizzes/`, { headers });
        // Only show quizzes that actually have questions
        setQuizzes(res.data.filter(q => q.question_count > 0));
      } catch (err) { 
        console.error("Discovery failed", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // Professional Search & Filter Logic
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    // Using description as a proxy for category if tags aren't in your model yet
    const matchesCategory = filterCategory === "All" || 
      (quiz.description && quiz.description.toLowerCase().includes(filterCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="player-discovery-container animate-fade-in">
      <div className="discovery-hero">
        <h2 className="hero-title">Available <span>Quizzes</span></h2>
        <p className="hero-subtitle">Search for a topic and test your knowledge.</p>
        
        {/* --- 🔍 Search & Filter Section --- */}
        <div className="search-filter-controls">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Search by quiz title..." 
              className="glass-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-wrapper">
            <select 
              className="glass-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Topics</option>
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="Django">Django</option>
            </select>
          </div>
        </div>
      </div>

      <div className="quiz-grid center-grid">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className="quiz-glass-card player-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }} /* Staggered animation */
            >
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
          ))
        ) : (
          !loading && <p className="no-results">No quizzes found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;