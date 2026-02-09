# BrainBit 🧠
A full-stack Quiz Platform built with **React** and **Django REST Framework**, designed for seamless quiz creation and an interactive player experience.

## 🌐 Live Links
* **Frontend**: [Deployed on Vercel](https://your-vercel-link.vercel.app)
* **Backend API**: [Hosted on Render](https://brainbit.onrender.com/api/quizzes/)

---

## 🔐 Authentication & User Roles
BrainBit implements mandatory role-based access control to ensure platform integrity:
* **Admin Role**: Authorized to access the Management Dashboard, create/edit quizzes, and manage the question database.
* **Player Role**: Access to the Quiz Discovery landing page and the interactive Play Mode to take quizzes and track scores.

---

## 🚀 Key Features

### 1. Admin Dashboard (Management Side)
The administrative core allows for full control over the quiz lifecycle and content hierarchy.
* **Quiz Management**: Full CRUD (Create, Read, Update, Delete) capabilities for quiz containers.
* **Question Builder**: A dedicated interface to dynamically add, edit, and remove questions for specific quizzes.
* **Choice Manager**: Integrated form to handle multiple-choice options (A, B, C, D) with a boolean toggle to define the `is_correct` answer.
* **Bulk Management**: A centralized view to audit and manage all questions linked to a specific quiz at a glance.

### 2. The User Experience (Player Side)
A seamless, interactive "Play Mode" designed to keep users engaged.
* **Quiz Discovery**: A responsive landing page displaying available quizzes with descriptive cards and "Start Quiz" triggers.
* **Active Quiz Interface**:
    * **Focus Mode**: A "one question at a time" UI to prevent distraction and ensure a clean testing environment.
    * **Progress Tracking**: Real-time progress bar indicating the user's current position (e.g., "Question 3 of 10").
    * **Timed Challenges**: (Optional) Integrated countdown timers to add a competitive edge to the experience.

### 3. Logic & Scoring
Advanced backend logic that transforms the site into a high-performance platform.
* **Live Scoring Engine**: Real-time validation of answers to track performance as the user progresses.
* **Detailed Result Analytics**: A comprehensive summary screen providing the final score, percentage, and a breakdown of correct vs. incorrect answers.
* **Leaderboards**: (Future Scope) High-score tracking to showcase top "BrainBit" performers.

### 4. Professional & Technical Enhancements
Built with modern web standards to ensure a premium feel.
* **Search & Filter**: Intuitive search bar to find quizzes by title, category, or difficulty.
* **Mobile-First Design**: Fully responsive architecture ensuring a perfect experience on desktops, tablets, and smartphones.
* **Fluid Animations**: Powered by CSS transitions or Framer Motion for smooth, professional-grade UI state changes.

---

## 🛠️ Tech Stack
* **Frontend**: React, Vite, Axios.
* **Backend**: Django, Django REST Framework, Gunicorn.
* **Security**: Python-dotenv for environment variable management.
* **Deployment**: Vercel (Frontend), Render (Backend).

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/TanushreeMohanty/BrainBit.git](https://github.com/TanushreeMohanty/BrainBit.git)
cd BrainBit
```

### 2. Backend Setup (Django). 
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### 3. Frontend Setup (React)
```bash
cd ../frontend
npm install
npm run dev
```