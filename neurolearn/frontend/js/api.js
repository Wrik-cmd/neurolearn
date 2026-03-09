// ============================================================
// api.js — NeuroLearn Platform
// Centralized API communication layer
// ============================================================

const API = (() => {
  const BASE_URL = 'http://localhost:5000/api';

  // ---- HELPERS ----
  function getHeaders(json = true) {
    const headers = {};
    if (json) headers['Content-Type'] = 'application/json';
    const token = localStorage.getItem('nl_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async function request(method, endpoint, body = null) {
    const config = {
      method,
      headers: getHeaders(),
    };
    if (body) config.body = JSON.stringify(body);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, config);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      
      // If backend already wrapped the response, unwrap it to prevent nested data.data
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        return { success: true, data: data.data };
      }
      
      return { success: true, data };
    } catch (err) {
      console.error(`[API] ${method} ${endpoint} failed:`, err.message);
      return { success: false, error: err.message };
    }
  }

  // ---- AUTH ----
  const auth = {
    async login(email, password) {
      const result = await request('POST', '/login', { email, password });
      if (result.success && result.data.token) {
        localStorage.setItem('nl_token', result.data.token);
        localStorage.setItem('nl_user', JSON.stringify(result.data.user));
      }
      return result;
    },

    async signup(name, email, password) {
      const result = await request('POST', '/signup', { name, email, password });
      if (result.success && result.data.token) {
        localStorage.setItem('nl_token', result.data.token);
        localStorage.setItem('nl_user', JSON.stringify(result.data.user));
      }
      return result;
    },

    logout() {
      localStorage.removeItem('nl_token');
      localStorage.removeItem('nl_user');
      window.location.href = 'login.html';
    },

    isLoggedIn() {
      return !!localStorage.getItem('nl_token');
    },

    getUser() {
      const raw = localStorage.getItem('nl_user');
      try { return raw ? JSON.parse(raw) : null; }
      catch { return null; }
    }
  };

  // ---- COURSES ----
  const courses = {
    async getAll()          { return request('GET', '/courses'); },
    async getById(id)       { return request('GET', `/courses/${id}`); },
    async getTopics(id)     { return request('GET', `/courses/${id}/topics`); },
    async enroll(id)        { return request('POST', `/courses/${id}/enroll`); },
    async updateProgress(courseId, topicId, data) {
      return request('PUT', `/courses/${courseId}/topics/${topicId}/progress`, data);
    }
  };

  // ---- QUIZ ----
  const quiz = {
    async getQuestions(topicId)          { return request('GET', `/quiz/${topicId}/questions`); },
    async submitAnswers(topicId, answers){ return request('POST', `/quiz/${topicId}/submit`, { answers }); },
    async getResults(attemptId)          { return request('GET', `/quiz/results/${attemptId}`); },
    async getHistory()                   { return request('GET', '/quiz/history'); }
  };

  // ---- DASHBOARD ----
  const dashboard = {
    async getStats()        { return request('GET', '/dashboard/stats'); },
    async getActivity()     { return request('GET', '/dashboard/activity'); },
    async getWeakTopics()   { return request('GET', '/dashboard/weak-topics'); },
    async getChartData()    { return request('GET', '/dashboard/chart'); }
  };

  // ---- RECOMMENDATIONS ----
  const recommendations = {
    async get()             { return request('GET', '/recommendation'); },
    async dismiss(id)       { return request('DELETE', `/recommendation/${id}`); },
    async markComplete(id)  { return request('PUT', `/recommendation/${id}/complete`); }
  };

  // ---- PROFILE ----
  const profile = {
    async get()             { return request('GET', '/profile'); },
    async update(data)      { return request('PUT', '/profile', data); },
    async updatePassword(data){ return request('PUT', '/profile/password', data); },
    async getAchievements() { return request('GET', '/profile/achievements'); }
  };

  // ---- MOCK DATA (for development without backend) ----
  const mock = {
    user: { id: 1, name: 'Alex Chen', email: 'alex@neurolearn.io', xp: 2450, level: 12, avatar: 'AC' },

    stats: {
      quizzesTaken: 47,
      avgScore: 78,
      streak: 12,
      coursesEnrolled: 5
    },

    weakTopics: [
      { topic: 'Recursion', score: 45, difficulty: 'Hard' },
      { topic: 'Dynamic Programming', score: 52, difficulty: 'Hard' },
      { topic: 'Graph Algorithms', score: 61, difficulty: 'Medium' },
      { topic: 'Binary Trees', score: 65, difficulty: 'Medium' }
    ],

    activity: [
      { text: 'Completed Quiz: Arrays & Strings', time: '2m ago', type: 'quiz', color: 'cyan' },
      { text: 'Unlocked badge: "Speed Coder"', time: '1h ago', type: 'badge', color: 'purple' },
      { text: 'Finished Lesson: Sorting Algorithms', time: '3h ago', type: 'lesson', color: 'green' },
      { text: 'Enrolled in: System Design Basics', time: '1d ago', type: 'enroll', color: 'cyan' },
    ],

    chartData: [55, 70, 65, 80, 72, 88, 78],

    recommendations: [
      { id: 1, topic: 'Recursion', difficulty: 'Medium', reason: 'Weak area detected', icon: '🔄', xp: 120 },
      { id: 2, topic: 'Memoization', difficulty: 'Medium', reason: 'Next in sequence', icon: '💾', xp: 150 },
      { id: 3, topic: 'Binary Search Trees', difficulty: 'Hard', reason: 'High impact topic', icon: '🌲', xp: 200 },
    ],

    questions: [
      {
        id: 1, text: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
        correct: 1, topic: 'Algorithms'
      },
      {
        id: 2, text: 'Which data structure uses LIFO (Last In, First Out)?',
        options: ['Queue', 'Array', 'Stack', 'Linked List'],
        correct: 2, topic: 'Data Structures'
      },
      {
        id: 3, text: 'What does CSS "float" property do?',
        options: ['Makes element transparent', 'Positions element along text flow', 'Adds animation', 'Changes z-index'],
        correct: 1, topic: 'CSS'
      }
    ],

    courses: [
      { id: 1, title: 'Data Structures & Algorithms', topics: 24, progress: 65, icon: '🧠', difficulty: 'Hard' },
      { id: 2, title: 'JavaScript Mastery', topics: 18, progress: 80, icon: '⚡', difficulty: 'Medium' },
      { id: 3, title: 'System Design Basics', topics: 12, progress: 20, icon: '🏗️', difficulty: 'Hard' },
      { id: 4, title: 'Web Fundamentals', topics: 20, progress: 95, icon: '🌐', difficulty: 'Easy' },
      { id: 5, title: 'Database Design', topics: 16, progress: 45, icon: '🗄️', difficulty: 'Medium' },
    ]
  };

  return { auth, courses, quiz, dashboard, recommendations, profile, mock };
})();

// ---- EXPORT ----
window.API = API;
