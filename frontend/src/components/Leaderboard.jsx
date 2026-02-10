import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = ({ token, API_BASE }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(`${API_BASE}attempts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 1. Filter to keep only the highest score for each unique USER + QUIZ combination
      const bestPerQuizPerUser = Object.values(
        res.data.reduce((acc, current) => {
          // Create a unique key like "mama-Python" or "mama-dhanaaa"
          const key = `${current.username}-${current.quiz_title}`;
          
          const currentPerc = current.score / current.total_questions;
          const existing = acc[key];
          const existingPerc = existing ? existing.score / existing.total_questions : -1;

          if (!existing || currentPerc > existingPerc) {
            acc[key] = current;
          }
          return acc;
        }, {})
      );

      // 2. Sort the list by percentage accuracy, then by raw score
      const finalSorted = bestPerQuizPerUser
        .sort((a, b) => {
          const percA = (a.score / a.total_questions);
          const percB = (b.score / b.total_questions);
          return percB - percA || b.score - a.score;
        })
        .slice(0, 10);

      setLeaders(finalSorted);
      setLoading(false);
    } catch (err) {
      console.error("Leaderboard fetch failed", err);
      setLoading(false);
    }
  };
  fetchLeaderboard();
}, [token, API_BASE]);

  if (loading) return (
    <div className="quiz-loading-overlay">
      <div className="loader-pulse"></div>
      <p>Fetching Global Rankings...</p>
    </div>
  );

  return (
    <div className="leaderboard-layout animate-fade-in">
      <div className="leaderboard-header">
        <h2 className="section-title">🏆 BrainBit <span>Champions</span></h2>
        <p className="section-subtitle">The top performers across all challenges.</p>
      </div>

      {leaders.length > 0 ? (
        <div className="leaderboard-glass-table">
          <div className="table-header">
            <span>Rank</span>
            <span>Player</span>
            <span>Quiz Topic</span>
            <span className="text-right">Accuracy</span>
          </div>
          
          <div className="table-body">
            {leaders.map((entry, index) => (
              <div key={entry.id} className={`table-row rank-${index + 1}`}>
                <div className="rank-badge">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                </div>
                <span className="player-name">{entry.username}</span>
                <span className="quiz-name-tag">{entry.quiz_title}</span>
                <div className="score-container text-right">
                  <span className="score-val">{entry.score}/{entry.total_questions}</span>
                  <span className="perc-val">({Math.round((entry.score/entry.total_questions)*100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state-card">
          <p>No attempts recorded yet. Be the first to top the charts!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;