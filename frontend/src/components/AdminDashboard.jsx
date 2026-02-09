import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ token, API_BASE }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  
  // State for the Question Builder / Choice Manager
  const [activeQuiz, setActiveQuiz] = useState(null); 
  const [newQuestion, setNewQuestion] = useState({ text: "" });
  const [choices, setChoices] = useState([
    { text: "", is_correct: true },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(`${API_BASE}quizzes/`, { headers });
      setQuizzes(res.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  // --- 1. QUIZ CRUD ---
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}quizzes/`, newQuiz, { headers });
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes();
    } catch (err) { alert("Admin access denied."); }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm("Delete entire quiz?")) {
      await axios.delete(`${API_BASE}quizzes/${id}/`, { headers });
      fetchQuizzes();
    }
  };

  // --- 2. QUESTION & CHOICE BUILDER ---
  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      // Step A: Create the Question linked to activeQuiz
      const qRes = await axios.post(`${API_BASE}questions/`, 
        { quiz: activeQuiz.id, text: newQuestion.text }, { headers });
      
      // Step B: Create the 4 Choices linked to that new Question
      const choicePromises = choices.map(choice => 
        axios.post(`${API_BASE}choices/`, 
          { question: qRes.data.id, text: choice.text, is_correct: choice.is_correct }, 
          { headers }
        )
      );
      
      await Promise.all(choicePromises);
      alert("Question and Choices added!");
      setNewQuestion({ text: "" });
      fetchQuizzes(); // Refresh counts
    } catch (err) { alert("Failed to build question."); }
  };

  const updateChoice = (index, field, value) => {
    const updated = [...choices];
    if (field === 'is_correct') {
      // Ensure only one choice is correct
      updated.forEach((c, i) => c.is_correct = i === index);
    } else {
      updated[index].text = value;
    }
    setChoices(updated);
  };

  return (
    <div className="admin-console">
      {!activeQuiz ? (
        <>
          {/* --- QUIZ MANAGEMENT --- */}
          <section className="quiz-form-section">
            <h3>Create New Quiz Container</h3>
            <form onSubmit={handleCreateQuiz} className="quiz-form">
              <input type="text" placeholder="Title" value={newQuiz.title} onChange={e => setNewQuiz({...newQuiz, title: e.target.value})} required />
              <textarea placeholder="Description" value={newQuiz.description} onChange={e => setNewQuiz({...newQuiz, description: e.target.value})} />
              <button type="submit">Save Quiz</button>
            </form>
          </section>

          {/* --- BULK MANAGEMENT VIEW --- */}
          <section className="bulk-management">
            <h3>Audit Quizzes</h3>
            <div className="quiz-grid">
              {quizzes.map(quiz => (
                <div key={quiz.id} className="quiz-card admin">
                  <h4>{quiz.title}</h4>
                  <div className="card-stats">Questions: {quiz.question_count}</div>
                  <div className="admin-actions">
                    <button className="manage-btn" onClick={() => setActiveQuiz(quiz)}>🛠️ Build Questions</button>
                    <button className="delete-btn" onClick={() => handleDeleteQuiz(quiz.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* --- QUESTION BUILDER & CHOICE MANAGER --- */
        <section className="builder-interface">
          <button className="back-btn" onClick={() => setActiveQuiz(null)}>⬅ Back to Quizzes</button>
          <h2>Building: {activeQuiz.title}</h2>
          
          <form onSubmit={handleAddQuestion} className="question-form">
            <input type="text" placeholder="Enter Question Text" value={newQuestion.text} onChange={e => setNewQuestion({text: e.target.value})} required />
            
            <div className="choice-manager">
              <h4>Define Options (Mark the correct one)</h4>
              {choices.map((choice, index) => (
                <div key={index} className="choice-row">
                  <input type="radio" name="correct" checked={choice.is_correct} onChange={() => updateChoice(index, 'is_correct', true)} />
                  <input type="text" placeholder={`Option ${index + 1}`} value={choice.text} onChange={e => updateChoice(index, 'text', e.target.value)} required />
                </div>
              ))}
            </div>
            <button type="submit" className="build-btn">Add Question to Quiz</button>
          </form>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;