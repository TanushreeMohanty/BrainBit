import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Base URL to make code cleaner
  // const API_BASE = 'http://127.0.0.1:8000/api/quizzes/';
  // const API_BASE = 'https://brainbit.onrender.com/api/quizzes/';
  const API_BASE = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://127.0.0.1:8000/api/quizzes/"
  : "https://brainbit.onrender.com/api/quizzes/";

// frontend/src/App.jsx

  const loadQuizzes = async () => {
    try {
      const response = await axios.get(API_BASE);
      if (Array.isArray(response.data)) {
        setQuizzes(response.data);
      } else if (response.data.results && Array.isArray(response.data.results)) {
        setQuizzes(response.data.results);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

const handleCreate = async (e) => {
  e.preventDefault();
  try {
    // Ensure you use 127.0.0.1 and not "localhost" to avoid DNS mismatches
    await axios.post(API_BASE, { 
      title: newTitle, 
      description: newDesc 
    });
    setNewTitle("");
    setNewDesc("");
    loadQuizzes();
  } catch (err) {
    console.error(err);
    alert("Check if Django is running on port 8000");
  }
};

  const handleDelete = async (id) => {
    try {
      // Use full URL with ID here
      await axios.delete(`${API_BASE}${id}/`);
      loadQuizzes(); 
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  return (
    <div className="brainbit-app">
      <h1>BrainBit Admin Mode 🧠</h1>

      <form onSubmit={handleCreate} className="quiz-form">
        <h3>Create New Quiz</h3>
        <input 
          placeholder="Quiz Title" 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={newDesc} 
          onChange={(e) => setNewDesc(e.target.value)} 
        />
        <button type="submit">Save to Django</button>
      </form>

      <div className="quiz-grid">
        {Array.isArray(quizzes) && quizzes.length > 0 ? (
          quizzes.map(quiz => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <button 
                onClick={() => handleDelete(quiz.id)} 
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No quizzes found. Use the form above to add one!</p>
        )}
      </div>
    </div>
  );
}

export default App;