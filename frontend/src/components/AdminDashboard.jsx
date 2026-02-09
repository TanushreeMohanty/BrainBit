import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
const AdminDashboard = ({ token, API_BASE }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  const [activeQuiz, setActiveQuiz] = useState(null);
  
  // Question CRUD States
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: "" });
  const [choices, setChoices] = useState([
    { text: "", is_correct: true },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  const headers = { Authorization: `Bearer ${token}` };

  // --- READ: Quizzes ---
  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE}quizzes/`, { headers });
      setQuizzes(res.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  // --- READ: Questions for Active Quiz ---
  const fetchQuestions = async () => {
    if (!activeQuiz) return;
    try {
      const res = await axios.get(`${API_BASE}quizzes/${activeQuiz.id}/`, { headers });
      setQuestions(res.data.questions || []);
    } catch (err) { console.error("Could not fetch questions", err); }
  };

  useEffect(() => { fetchQuizzes(); }, []);
  useEffect(() => { fetchQuestions(); }, [activeQuiz]);

  // --- CREATE: Quiz ---
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}quizzes/`, newQuiz, { headers });
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes();
    } catch (err) { alert("Admin access denied."); }
  };

  // --- DELETE: Quiz ---
  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Delete entire quiz?")) {
      try {
        await axios.delete(`${API_BASE}quizzes/${id}/`, { headers });
        fetchQuizzes();
      } catch (err) { alert("Delete failed."); }
    }
  };

  // --- CREATE: Question & Choices ---
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const qRes = await axios.post(`${API_BASE}questions/`, 
        { quiz: activeQuiz.id, text: newQuestion.text }, { headers });
      
      const choicePromises = choices.map(choice => 
        axios.post(`${API_BASE}choices/`, 
          { question: qRes.data.id, text: choice.text, is_correct: choice.is_correct }, 
          { headers }
        )
      );
      
      await Promise.all(choicePromises);
      alert("Question added!");
      setNewQuestion({ text: "" });
      setChoices([
        { text: "", is_correct: true }, { text: "", is_correct: false },
        { text: "", is_correct: false }, { text: "", is_correct: false },
      ]);
      fetchQuestions(); // Refresh overview
      fetchQuizzes();   // Refresh count on dashboard
    } catch (err) { alert("Failed to build question."); }
  };

  // --- DELETE: Question ---
  const handleDeleteQuestion = async (qId) => {
    if (window.confirm("Remove this question permanently?")) {
      try {
        await axios.delete(`${API_BASE}questions/${qId}/`, { headers });
        fetchQuestions();
        fetchQuizzes();
      } catch (err) { alert("Delete failed."); }
    }
  };

  const updateChoice = (index, field, value) => {
    const updated = [...choices];
    if (field === 'is_correct') {
      updated.forEach((c, i) => c.is_correct = i === index);
    } else {
      updated[index].text = value;
    }
    setChoices(updated);
  };

  return (
    <div className="admin-console">
      {!activeQuiz ? (
        <div className="admin-view-container animate-fade-in">
          <section className="dashboard-glass-card">
            <div className="card-header">
              <span className="header-icon">🚀</span>
              <h3>Create New Quiz</h3>
            </div>
            <form onSubmit={handleCreateQuiz} className="admin-form">
              <input className="glass-input" type="text" placeholder="Quiz Title" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} required />
              <textarea className="glass-input" placeholder="Description..." value={newQuiz.description} onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} />
              <button type="submit" className="primary-btn">Save Quiz Container</button>
            </form>
          </section>

          <section className="audit-section">
            <h3 className="section-label">Audit & Manage Quizzes</h3>
            <div className="quiz-grid">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="quiz-glass-card">
                  <div className="quiz-info">
                    <h4>{quiz.title}</h4>
                    <p className="quiz-desc-preview">{quiz.description}</p>
                    <div className="quiz-stats"><span>📊 {quiz.question_count || 0} Questions</span></div>
                  </div>
                  <div className="quiz-actions">
                    <button className="build-link-btn" onClick={() => setActiveQuiz(quiz)}>🛠️ Manage Content</button>
                    <button className="icon-del-btn" onClick={() => handleDeleteQuiz(quiz.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="builder-interface animate-slide-up">
          <div className="builder-header">
            <button className="text-back-btn" onClick={() => setActiveQuiz(null)}>← Exit to Dashboard</button>
            <h2>Managing: <span>{activeQuiz.title}</span></h2>
          </div>
          
          <form onSubmit={handleAddQuestion} className="question-form">
            <div className="input-group">
              <label>Question Text</label>
              <input className="glass-input big-text" type="text" placeholder="Enter question..." value={newQuestion.text} onChange={e => setNewQuestion({text: e.target.value})} required />
            </div>
            
            <div className="choice-manager">
              <label className="sub-label">Define Options (Select the correct answer)</label>
              <div className="choices-list">
                {choices.map((choice, index) => (
                  <div key={index} className={`choice-row-glass ${choice.is_correct ? 'selected' : ''}`}>
                    <input type="radio" name="correct" checked={choice.is_correct} onChange={() => updateChoice(index, 'is_correct', true)} />
                    <input className="inline-choice-input" type="text" placeholder={`Option ${index + 1}`} value={choice.text} onChange={e => updateChoice(index, 'text', e.target.value)} required />
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="accent-build-btn">Confirm & Add Question</button>
          </form>

          {/* --- QUESTIONS OVERVIEW (CRUD: Read & Delete) --- */}
          <div className="questions-inventory-section">
            <h3 className="overview-title">Question Inventory ({questions.length})</h3>
            <div className="inventory-list">
              {questions.length === 0 && <p className="empty-msg">No questions added to this quiz yet.</p>}
              {questions.map((q, idx) => (
                <div key={q.id} className="q-inventory-card">
                  <div className="q-card-header">
                    <span className="q-idx">#{idx + 1}</span>
                    <p className="q-txt">{q.text}</p>
                    <button className="q-del-btn" onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
                  </div>
                  <div className="q-choices-preview">
                    {q.choices?.map(c => (
                      <span key={c.id} className={`choice-pill ${c.is_correct ? 'is-correct' : ''}`}>
                        {c.text}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;