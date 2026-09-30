# 🧠 NeuroLearn

> **An AI-powered personalized learning platform that adapts education to each learner.**

NeuroLearn is an intelligent learning platform designed to provide **personalized, interactive, and AI-assisted education**. The system helps students learn through curated content, AI-generated explanations, quizzes, progress tracking, and personalized learning experiences.

The goal of NeuroLearn is to move away from a **one-size-fits-all learning model** and create a learning environment that adapts to the student's knowledge, pace, and learning needs.

---

## 🚀 Features

### 🤖 AI-Powered Learning

* AI-generated explanations for difficult concepts
* Ask questions using a conversational AI assistant
* Simplify complex topics into easy-to-understand explanations
* Generate examples and learning resources
* Personalized learning recommendations

### 📚 Course & Content Management

* Browse available courses and topics
* Access structured learning materials
* Organize content into modules and lessons
* Track completed and pending lessons

### 📝 AI-Generated Quizzes

* Generate quizzes based on learning topics
* Multiple-choice questions
* Automatic evaluation
* Instant feedback
* Track quiz performance

### 📊 Progress Tracking

* Monitor course completion
* Track quiz scores
* View learning history
* Identify weak areas
* Personalized progress insights

### 👤 User Authentication

* User registration and login
* Secure authentication
* User-specific learning data
* Personalized dashboard

### 💬 AI Learning Assistant

Students can interact with the AI assistant to:

* Ask questions
* Get explanations
* Request examples
* Clarify concepts
* Generate practice questions
* Get study suggestions

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │       Student        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React Frontend    │
                    │                      │
                    │ Dashboard            │
                    │ Courses              │
                    │ Quiz                 │
                    │ AI Assistant         │
                    │ Progress             │
                    └──────────┬───────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Node.js +         │
                    │    Express Server    │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │  MongoDB    │   │ AI Service  │   │ Auth Layer  │
      │             │   │             │   │             │
      │ Users       │   │ AI Model    │   │ JWT         │
      │ Courses     │   │ Prompts     │   │ Middleware  │
      │ Progress    │   │ Quiz Gen    │   │             │
      │ Quiz Data   │   │             │   │             │
      └─────────────┘   └─────────────┘   └─────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3
* Axios
* React Router

## Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcrypt

## Database

* MongoDB
* Mongoose

## AI

* Generative AI API
* AI-powered content generation
* AI question answering
* AI quiz generation
* Personalized recommendations

## Development Tools

* Git
* GitHub
* VS Code
* Postman
* npm

---

# 📁 Project Structure

```text
NeuroLearn/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

```bash
cd NeuroLearn
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

AI_API_KEY=your_ai_api_key
```

### Example

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/neurolearn
JWT_SECRET=your_secret_key
AI_API_KEY=your_api_key
```

> ⚠️ Never commit your `.env` file to GitHub.

Add it to `.gitignore`:

```gitignore
.env
node_modules/
dist/
```

---

# ▶️ Running the Project

## Start Backend

```bash
cd server
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Login / Register
 │
 ▼
Dashboard
 │
 ├──────────────► Courses
 │                  │
 │                  ▼
 │               Lessons
 │                  │
 │                  ▼
 │               Quiz
 │                  │
 │                  ▼
 │              Evaluation
 │                  │
 │                  ▼
 │              Progress
 │
 └──────────────► AI Assistant
                       │
                       ▼
                   AI Service
                       │
                       ▼
                Personalized Response
```

---

# 🤖 AI Learning Flow

When a student asks a question:

```text
Student Question
       │
       ▼
React Frontend
       │
       ▼
Express API
       │
       ▼
AI Service
       │
       ▼
Prompt Processing
       │
       ▼
Generative AI Model
       │
       ▼
AI Response
       │
       ▼
Express API
       │
       ▼
React UI
       │
       ▼
Student
```

---

# 📊 Personalization

NeuroLearn can use learning activity to create a personalized learning experience.

Example data:

```text
Student
 ├── Courses Completed
 ├── Quiz Scores
 ├── Topics Studied
 ├── Weak Topics
 ├── Learning History
 └── Recent Activity
```

This information can be used to generate:

* Recommended topics
* Additional practice questions
* Revision suggestions
* Difficulty adjustments
* Personalized study plans

---

# 🗄️ Database Models

## User

```text
User
 ├── name
 ├── email
 ├── password
 ├── enrolledCourses
 ├── completedLessons
 └── progress
```

## Course

```text
Course
 ├── title
 ├── description
 ├── category
 ├── modules
 └── difficulty
```

## Quiz

```text
Quiz
 ├── course
 ├── topic
 ├── questions
 ├── score
 └── createdAt
```

## Progress

```text
Progress
 ├── user
 ├── course
 ├── completedLessons
 ├── quizScores
 └── completionPercentage
```

---

# 🔌 API Endpoints

## Authentication

### Register

```http
POST /api/auth/register
```

### Login

```http
POST /api/auth/login
```

---

## Courses

### Get Courses

```http
GET /api/courses
```

### Get Course

```http
GET /api/courses/:id
```

### Create Course

```http
POST /api/courses
```

---

## AI

### Ask AI

```http
POST /api/ai/ask
```

Example request:

```json
{
  "question": "Explain binary search in simple terms."
}
```

Example response:

```json
{
  "answer": "Binary search is an algorithm used to find an element..."
}
```

---

## Quiz

### Generate Quiz

```http
POST /api/quiz/generate
```

Example:

```json
{
  "topic": "JavaScript Arrays",
  "difficulty": "medium",
  "numberOfQuestions": 5
}
```

---

# 🔒 Security

NeuroLearn follows common web application security practices:

* Password hashing using bcrypt
* JWT-based authentication
* Protected API routes
* Environment variables for secrets
* Input validation
* MongoDB security practices
* `.env` excluded from Git

---

# 🧪 Testing

Backend APIs can be tested using:

```text
Postman
```

Example testing flow:

```text
Register
   ↓
Login
   ↓
Get JWT Token
   ↓
Send Token
   ↓
Access Protected APIs
```

---

# 📈 Future Enhancements

The project can be extended with:

### 🧠 Advanced Personalization

* Adaptive learning paths
* AI-based difficulty adjustment
* Knowledge-gap detection
* Personalized study schedules

### 🎙️ Voice Learning

* Speech-to-text questions
* AI voice responses
* Voice-based learning assistant

### 📄 AI Document Learning

Students could upload:

```text
PDF
DOCX
PPT
TXT
```

NeuroLearn could then:

* Summarize documents
* Generate questions
* Explain concepts
* Create flashcards
* Generate quizzes

### 🃏 AI Flashcards

Automatically generate flashcards from:

```text
Course → Module → Lesson
```

### 🏆 Gamification

* XP system
* Badges
* Streaks
* Leaderboards
* Achievements

### 📱 Mobile Application

A mobile application can be developed using:

```text
React Native
```

---

# 🌟 Vision

NeuroLearn aims to create a learning platform where **AI acts as a personal learning companion rather than simply a content generator**.

Instead of giving every student the same learning experience, NeuroLearn can continuously analyze learning activity and adapt:

```text
Content
   ↓
Practice
   ↓
Assessment
   ↓
Performance Analysis
   ↓
Personalized Recommendation
   ↓
Improved Learning
```

---

# 👨‍💻 Contributors

Developed by:

**Writam**

---

# 📄 License

This project is currently intended for **educational and academic purposes**.

A formal open-source license can be added later if the project is released publicly.

---

## ⭐ Support

If you find NeuroLearn useful, consider giving the repository a ⭐ on GitHub.
